const Resume = require('../models/Resume');
const Profile = require('../models/Profile');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const path = require('path');
const fs = require('fs');

// Helper to get profile
const getProfile = async (userId) => {
    const profile = await Profile.findOne({ where: { user_id: userId } });
    if (!profile) throw new AppError('Profile not found. Please create a profile first.', 404);
    return profile;
};

// Upload a Resume (PDF)
exports.uploadResume = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('Please provide a PDF file to upload.', 400));
    }

    const profile = await getProfile(req.user.id);

    // If is_default is true, unset other defaults
    if (req.body.is_default === 'true' || req.body.is_default === true) {
        await Resume.update({ is_default: false }, { where: { profile_id: profile.id } });
    }

    const newResume = await Resume.create({
        profile_id: profile.id,
        resume_url: req.file.path.replace(/\\/g, '/'),
        is_default: req.body.is_default === 'true' || req.body.is_default === true
    });

    res.status(201).json({
        status: 'success',
        data: {
            resume: newResume
        }
    });
});

// Get all resumes for user
exports.getMyResumes = catchAsync(async (req, res, next) => {
    const profile = await getProfile(req.user.id);
    const resumes = await Resume.findAll({ where: { profile_id: profile.id } });

    res.status(200).json({
        status: 'success',
        results: resumes.length,
        data: { resumes }
    });
});

// Delete a resume
exports.deleteResume = catchAsync(async (req, res, next) => {
    const profile = await getProfile(req.user.id);
    const resume = await Resume.findOne({
        where: { id: req.params.id, profile_id: profile.id }
    });

    if (!resume) return next(new AppError('Resume not found', 404));

    // Delete file
    const filePath = path.join(__dirname, '../../', resume.resume_url);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    await resume.destroy();

    res.status(204).json({
        status: 'success',
        data: null
    });
});

// Download/View Resume
exports.downloadResume = catchAsync(async (req, res, next) => {
    const profile = await getProfile(req.user.id);
    const resume = await Resume.findOne({
        where: { id: req.params.id, profile_id: profile.id }
    });

    if (!resume) return next(new AppError('Resume not found', 404));

    const filePath = path.join(__dirname, '../../', resume.resume_url);
    if (!fs.existsSync(filePath)) {
        return next(new AppError('File not found on server', 404));
    }

    res.download(filePath);
});
