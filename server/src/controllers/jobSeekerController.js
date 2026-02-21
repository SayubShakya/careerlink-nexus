const { Op } = require('sequelize');
const JobSeeker = require('../models/JobSeeker');
const JobListing = require('../models/JobListing');
const SavedJob = require('../models/SavedJob');
const Application = require('../models/Application');
const CV = require('../models/CV');
const Employer = require('../models/Employer');
const Notification = require('../models/Notification');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const Profile = require('../models/Profile');
const sequelize = require('../config/sequelize');

// Get current job seeker profile
exports.getMe = catchAsync(async (req, res, next) => {
    const user = await JobSeeker.findByPk(req.user.id, {
        attributes: { exclude: ['password_hash'] },
        include: [{ model: Profile }]
    });

    if (!user) {
        return next(new AppError('Job seeker not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

// Update current job seeker profile
exports.updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates.', 400));
    }

    // 1) Update JobSeeker Fields
    const seekerFields = ['firstName', 'lastName'];
    const seekerBody = {};
    Object.keys(req.body).forEach(el => {
        if (seekerFields.includes(el)) seekerBody[el] = req.body[el];
    });

    if (req.file) seekerBody.profile_picture = req.file.path.replace(/\\/g, '/');

    if (Object.keys(seekerBody).length > 0) {
        await JobSeeker.update(seekerBody, { where: { id: req.user.id } });
    }

    // 2) Update Profile Fields
    const profileFields = ['headline', 'summary', 'phone', 'location'];
    const profileBody = {};
    Object.keys(req.body).forEach(el => {
        if (profileFields.includes(el)) profileBody[el] = req.body[el];
    });

    if (Object.keys(profileBody).length > 0) {
        let profile = await Profile.findOne({ where: { user_id: req.user.id } });
        if (!profile) {
            await Profile.create({ ...profileBody, user_id: req.user.id });
        } else {
            await profile.update(profileBody);
        }
    }

    const updatedUser = await JobSeeker.findByPk(req.user.id, {
        attributes: { exclude: ['password_hash'] },
        include: [{ model: Profile }]
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

// S4-14: The CV Dynamic Builder Aggregator (Using SQL View)
exports.getFullProfile = catchAsync(async (req, res, next) => {
    const results = await sequelize.query(
        `SELECT * FROM job_seeker_full_profile_view WHERE user_id = :userId`,
        {
            replacements: { userId: req.user.id },
            type: sequelize.QueryTypes.SELECT
        }
    );

    if (results.length === 0) {
        // Create profile if missing
        await Profile.findOrCreate({ where: { user_id: req.user.id } });
        return res.status(200).json({
            status: 'success',
            data: { profile: { experience: [], education: [], skills: [], projects: [], training: [], social_links: [] } }
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            profile: results[0]
        }
    });
});

// Get Stats for Job Seeker Dashboard
exports.getStats = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    console.log(`[Stats] Fetching stats for user: ${userId}`);

    const appliedCount = await Application.count({ where: { job_seeker_id: userId } });
    const cvCount = await CV.count({ where: { user_id: userId } });
    const reviewingCount = await Application.count({
        where: {
            job_seeker_id: userId,
            status: { [Op.in]: ['applied', 'reviewed'] }
        }
    });
    const interviewCount = await Application.count({
        where: { job_seeker_id: userId, status: 'interview_scheduled' }
    });

    console.log(`[Stats] applied=${appliedCount}, cvs=${cvCount}, reviewing=${reviewingCount}, interviews=${interviewCount}`);

    res.status(200).json({
        status: 'success',
        data: {
            stats: {
                appliedCount,
                cvCount,
                reviewingCount,
                interviewCount
            }
        }
    });
});

// Saved Jobs Logic
exports.getSavedJobs = catchAsync(async (req, res, next) => {
    const savedJobs = await SavedJob.findAll({
        where: { seeker_id: req.user.id },
        include: [
            {
                model: JobListing,
                include: [{ model: Employer, attributes: ['companyName', 'profile_picture'] }]
            }
        ]
    });

    res.status(200).json({
        status: 'success',
        data: {
            savedJobs
        }
    });
});

exports.saveJob = catchAsync(async (req, res, next) => {
    const jobId = req.params.id;

    // Check if job exists
    const job = await JobListing.findByPk(jobId);
    if (!job) return next(new AppError('Job not found', 404));

    // Check if already saved
    const existing = await SavedJob.findOne({ where: { seeker_id: req.user.id, job_id: jobId } });
    if (existing) return next(new AppError('Job already saved', 400));

    await SavedJob.create({
        seeker_id: req.user.id,
        job_id: jobId
    });

    res.status(201).json({
        status: 'success',
        message: 'Job saved successfully'
    });
});

exports.unsaveJob = catchAsync(async (req, res, next) => {
    const jobId = req.params.id;

    const result = await SavedJob.destroy({
        where: { seeker_id: req.user.id, job_id: jobId }
    });

    if (!result) return next(new AppError('Job was not in saved list', 404));

    res.status(204).json({
        status: 'success',
        data: null
    });
});

// Activity Feed for seeker (Recent notifications + New Jobs)
exports.getActivityFeed = catchAsync(async (req, res, next) => {
    const notifications = await Notification.findAll({
        where: { user_id: req.user.id, user_type: 'job_seeker' },
        limit: 10,
        order: [['created_at', 'DESC']]
    });

    const recentJobs = await JobListing.findAll({
        where: { is_active: true },
        include: [{ model: Employer, attributes: ['companyName', 'profile_picture'] }],
        limit: 5,
        order: [['created_at', 'DESC']]
    });

    res.status(200).json({
        status: 'success',
        data: {
            feed: {
                notifications,
                recentJobs
            }
        }
    });
});
