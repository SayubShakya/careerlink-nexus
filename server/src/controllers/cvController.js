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
    const cv = await CV.findOne({
        where: { id: req.params.id, user_id: req.user.id }
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
    if (cv.type === 'uploaded' && cv.file_path) {
        const filePath = path.join(__dirname, '../../', cv.file_path);
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
    let whereClause = { id: req.params.id };
    
    // Only restrict by user_id if the user is a job seeker
    if (req.role === 'job_seeker') {
        whereClause.user_id = req.user.id;
    }

    const cv = await CV.findOne({
        where: whereClause
    });

    if (!cv) {
        return next(new AppError('No CV found with that ID or unauthorized', 404));
    }

    if (cv.type === 'platform') {
        const user = await JobSeeker.findByPk(cv.user_id);
        const pdfBuffer = await pdfGenerator.generateCV(cv, user);


        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${cv.title.replace(/\s+/g, '_')}.pdf"`,
            'Content-Length': pdfBuffer.length,
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Surrogate-Control': 'no-store'
        });
        return res.send(pdfBuffer);
    }

    const filePath = path.join(__dirname, '../../', cv.file_path);
    if (!fs.existsSync(filePath)) {
        return next(new AppError('File not found on server', 404));
    }

    res.download(filePath, cv.title);
});

// Upload a CV file
exports.uploadCV = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('Please provide a file to upload.', 400));
    }

    const newCV = await CV.create({
        user_id: req.user.id,
        title: req.body.title || req.file.originalname,
        type: 'uploaded',
        file_path: req.file.path.replace(/\\/g, '/') // Ensure forward slashes
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

