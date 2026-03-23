const CV = require('../models/CV');
const JobSeeker = require('../models/JobSeeker');
const pdfGenerator = require('../utils/pdfGenerator');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const path = require('path');
const fs = require('fs');

// Get all CVs for the current user
exports.getAllCVs = catchAsync(async (req, res, next) => {
    const cvs = await CV.findAll({
        where: { user_id: req.user.id },
        order: [['updated_at', 'DESC']]
    });

    res.status(200).json({
        status: 'success',
        results: cvs.length,
        data: {
            cvs
        }
    });
});

// Create a new platform CV
exports.createPlatformCV = catchAsync(async (req, res, next) => {
    const newCV = await CV.create({
        user_id: req.user.id,
        title: req.body.title || 'Untitled CV',
        type: 'platform',
        content: req.body.content || {}
    });

    res.status(201).json({
        status: 'success',
        data: {
            cv: newCV
        }
    });
});

// Get single CV details
exports.getCV = catchAsync(async (req, res, next) => {
    let whereClause = { id: req.params.id };
    
    // Only restrict by user_id if the user is a job seeker
    if (req.role === 'job_seeker') {
        whereClause.user_id = req.user.id;
    }

    const cv = await CV.findOne({
        where: whereClause
    });

    if (!cv) {
        return next(new AppError('No CV found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            cv
        }
    });
});

// Delete a CV
exports.deleteCV = catchAsync(async (req, res, next) => {
    const cv = await CV.findOne({
        where: { id: req.params.id, user_id: req.user.id }
    });

    if (!cv) {
        return next(new AppError('No CV found with that ID', 404));
    }

    // If it's an uploaded file, delete from disk
    if (cv.type === 'uploaded' && cv.file_path && !cv.file_path.startsWith('http')) {
        // Handle both absolute paths (legacy) and relative paths (new)
        const filePath = path.isAbsolute(cv.file_path)
            ? cv.file_path
            : path.join(__dirname, '../../', cv.file_path);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    await cv.destroy();

    res.status(204).json({
        status: 'success',
        data: null
    });
});

// Download/View CV (Supports both uploaded and platform-generated)
exports.downloadCV = catchAsync(async (req, res, next) => {
    const cv = await CV.findByPk(req.params.id);

    if (!cv) {
        return next(new AppError('No CV found with that ID', 404));
    }

    // CHECK PERMISSIONS
    if (req.role === 'job_seeker') {
        if (cv.user_id !== req.user.id) {
            return next(new AppError('Unauthorized: You can only download your own CVs.', 403));
        }
    } else if (req.role === 'employer') {
        // Employer can only download CVs of candidates who have applied to their jobs
        const Application = require('../models/Application');
        const JobListing = require('../models/JobListing');
        
        const hasApplication = await Application.findOne({
            where: { cv_id: cv.id },
            include: [{
                model: JobListing,
                where: { employer_id: req.user.id }
            }]
        });

        if (!hasApplication && req.role !== 'admin') {
            return next(new AppError('Unauthorized: You can only download CVs of candidates who have applied to your jobs.', 403));
        }
    } else if (req.role !== 'admin') {
        return next(new AppError('Unauthorized access to CV.', 403));
    }

    console.log(`[downloadCV] Permission granted for user=${req.user.id}, role=${req.role}, cv=${cv.id}`);

    // CASE 1: Platform-generated CVs — generate PDF on-the-fly
    if (cv.type === 'platform') {
        const user = await JobSeeker.findByPk(cv.user_id);
        const pdfBuffer = await pdfGenerator.generateCV(cv, user);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${cv.title.replace(/\s+/g, '_')}.pdf"`,
            'Content-Length': pdfBuffer.length,
            'Cache-Control': 'no-store'
        });
        return res.send(pdfBuffer);
    }
    // CASE 2: Uploaded CV with Cloudinary URL — always generate a signed URL
    if (cv.file_path && cv.file_path.startsWith('http')) {
        const cloudinary = require('../utils/cloudinary');

        try {
            // Detect delivery type: 'upload' (public) or 'authenticated' (private)
            const isAuthenticated = cv.file_path.includes('/authenticated/');
            const deliveryType = isAuthenticated ? 'authenticated' : 'upload';
            const resourceType = cv.file_path.includes('/raw/') ? 'raw' : 'image';

            // Extract the path after the delivery segment to get the public_id
            const splitOn = isAuthenticated ? '/authenticated/' : '/upload/';
            const urlParts = cv.file_path.split(splitOn);

            if (urlParts.length < 2) {
                // Malformed URL — redirect as-is and hope for the best
                console.warn(`[downloadCV] Could not parse Cloudinary URL, redirecting raw: ${cv.file_path}`);
                return res.redirect(302, cv.file_path);
            }

            // Strip version prefix (v1234567890/)
            let pathAfterDelivery = urlParts[1].replace(/^v\d+\//, '');

            // For 'raw' files the public_id MUST include the extension
            // For 'image' files the public_id excludes the extension
            const publicId = resourceType === 'raw'
                ? pathAfterDelivery               // keep extension: nexus_cvs/cv-xxx.pdf
                : pathAfterDelivery.replace(/\.[^/.]+$/, '');

            const signedUrl = cloudinary.url(publicId, {
                resource_type: resourceType,
                type: deliveryType,
                sign_url: true,
                expires_at: Math.floor(Date.now() / 1000) + 300, // 5 minutes
                secure: true
            });

            console.log(`[downloadCV] Signed redirect → type=${deliveryType} resource=${resourceType} id=${publicId}`);
            return res.redirect(302, signedUrl);
        } catch (err) {
            console.error('[downloadCV] Failed to build signed URL, falling back to raw redirect:', err.message);
            return res.redirect(302, cv.file_path);
        }
    }


    // CASE 3: Local file path
    if (!cv.file_path) {
        return next(new AppError('CV file path is missing', 404));
    }

    // Handle both absolute paths (legacy) and relative paths (new)
    const filePath = path.isAbsolute(cv.file_path)
        ? cv.file_path
        : path.join(__dirname, '../../', cv.file_path);
    
    console.log(`[downloadCV] Resolved file path: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
        console.error(`[downloadCV] Local file missing: ${filePath}`);
        return next(new AppError('CV file not found on server. It may have been uploaded on a different machine. Please ask the candidate to re-upload their CV.', 404));
    }

    res.download(filePath, cv.title);
});

// Upload a CV file
exports.uploadCV = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('Please provide a file to upload.', 400));
    }

    // For Cloudinary uploads, req.file.path or req.file.secure_url will contain the global URL
    // For local uploads (fallback), we store the relative path
    const filePath = req.file.path || req.file.secure_url;
    
    console.log(`[uploadCV] File processed. Path/URL: ${filePath}`);

    const newCV = await CV.create({
        user_id: req.user.id,
        title: req.body.title || req.file.originalname,
        type: 'uploaded',
        file_path: filePath
    });

    res.status(201).json({
        status: 'success',
        data: {
            cv: newCV
        }
    });
});

// Update a CV
exports.updateCV = catchAsync(async (req, res, next) => {
    const cv = await CV.findOne({
        where: { id: req.params.id, user_id: req.user.id }
    });

    if (!cv) {
        return next(new AppError('No CV found with that ID', 404));
    }

    const { title, content, is_primary } = req.body;

    if (title !== undefined) cv.title = title;
    if (content !== undefined && cv.type === 'platform') {
        cv.content = content;
        // Ensure Sequelize detects the JSON change
        cv.changed('content', true);
    }
    if (is_primary !== undefined) cv.is_primary = is_primary;

    await cv.save();

    res.status(200).json({
        status: 'success',
        message: 'CV updated successfully',
        data: {
            cv
        }
    });
});

