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
    // CASE 2: Uploaded CV with Cloudinary URL — proxy the file through the server
    if (cv.file_path && cv.file_path.startsWith('http')) {
        const cloudinary = require('../utils/cloudinary');
        const https = require('https');

        try {
            const resourceType = cv.file_path.includes('/raw/') ? 'raw' : 'image';

            // Extract the public_id from the URL
            const splitOn = cv.file_path.includes('/authenticated/') ? '/authenticated/' : '/upload/';
            const urlParts = cv.file_path.split(splitOn);

            if (urlParts.length < 2) {
                console.warn(`[downloadCV] Could not parse Cloudinary URL, redirecting raw: ${cv.file_path}`);
                return res.redirect(302, cv.file_path);
            }

            // Strip version prefix and any signature fragments
            let pathAfterDelivery = urlParts[1]
                .replace(/^s--[A-Za-z0-9_-]+--\//, '')
                .replace(/^v\d+\//, '');

            // For raw files, the URL includes .pdf but the internal public_id may or may not
            const publicIdWithExt = pathAfterDelivery;                              // nexus_cvs/cv-xxx.pdf
            const publicIdNoExt = pathAfterDelivery.replace(/\.[^/.]+$/, '');       // nexus_cvs/cv-xxx

            console.log(`[downloadCV] public_id (with ext): ${publicIdWithExt}`);
            console.log(`[downloadCV] public_id (no ext): ${publicIdNoExt}`);

            // Helper: try to fetch a URL and stream it; returns true on success
            const tryFetchAndStream = (url) => {
                return new Promise((resolve) => {
                    https.get(url, (fileRes) => {
                        if (fileRes.statusCode !== 200) {
                            // Consume the response to free the socket
                            fileRes.resume();
                            console.error(`[downloadCV] URL returned status ${fileRes.statusCode}`);
                            return resolve(false);
                        }

                        const filename = (cv.title || 'cv').replace(/\s+/g, '_') + '.pdf';
                        res.set({
                            'Content-Type': 'application/pdf',
                            'Content-Disposition': `inline; filename="${filename}"`,
                            'Cache-Control': 'no-store'
                        });
                        if (fileRes.headers['content-length']) {
                            res.set('Content-Length', fileRes.headers['content-length']);
                        }

                        fileRes.pipe(res);
                        fileRes.on('end', () => resolve(true));
                        fileRes.on('error', () => resolve(false));
                    }).on('error', () => resolve(false));
                });
            };

            // Strategy 1: private_download_url with type:'upload' (no ext)
            // private_download_url defaults to type:'private' which returns 404 for upload-type assets
            try {
                const dlUrl1 = cloudinary.utils.private_download_url(publicIdNoExt, 'pdf', {
                    resource_type: resourceType,
                    type: 'upload',
                    expires_at: Math.floor(Date.now() / 1000) + 300,
                });
                console.log(`[downloadCV] Strategy 1 - private_download (upload, no ext): ${dlUrl1}`);
                const ok = await tryFetchAndStream(dlUrl1);
                if (ok) return;
            } catch (e) {
                console.log(`[downloadCV] Strategy 1 failed: ${e.message}`);
            }

            // Strategy 2: private_download_url with type:'upload' (with ext)
            try {
                const dlUrl2 = cloudinary.utils.private_download_url(publicIdWithExt, 'pdf', {
                    resource_type: resourceType,
                    type: 'upload',
                    expires_at: Math.floor(Date.now() / 1000) + 300,
                });
                console.log(`[downloadCV] Strategy 2 - private_download (upload, with ext): ${dlUrl2}`);
                const ok = await tryFetchAndStream(dlUrl2);
                if (ok) return;
            } catch (e) {
                console.log(`[downloadCV] Strategy 2 failed: ${e.message}`);
            }

            // Strategy 3: private_download_url with type:'private' (no ext) — in case upload type was different
            try {
                const dlUrl3 = cloudinary.utils.private_download_url(publicIdNoExt, 'pdf', {
                    resource_type: resourceType,
                    expires_at: Math.floor(Date.now() / 1000) + 300,
                });
                console.log(`[downloadCV] Strategy 3 - private_download (private, no ext): ${dlUrl3}`);
                const ok = await tryFetchAndStream(dlUrl3);
                if (ok) return;
            } catch (e) {
                console.log(`[downloadCV] Strategy 3 failed: ${e.message}`);
            }

            // Strategy 4: Signed CDN URL with version from stored URL
            try {
                // Extract version from stored URL
                const versionMatch = cv.file_path.match(/\/v(\d+)\//);
                const version = versionMatch ? versionMatch[1] : undefined;

                const signedUrl = cloudinary.url(publicIdWithExt, {
                    resource_type: resourceType,
                    type: 'upload',
                    sign_url: true,
                    version: version,
                    secure: true
                });
                console.log(`[downloadCV] Strategy 4 - signed CDN (version=${version}): ${signedUrl}`);
                const ok = await tryFetchAndStream(signedUrl);
                if (ok) return;
            } catch (e) {
                console.log(`[downloadCV] Strategy 4 failed: ${e.message}`);
            }

            // All strategies failed
            console.error(`[downloadCV] All download strategies failed, redirecting raw URL`);
            return res.redirect(302, cv.file_path);
        } catch (err) {
            console.error('[downloadCV] Failed to proxy CV:', err.message);
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

