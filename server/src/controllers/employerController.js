const { Op } = require('sequelize');
const Employer = require('../models/Employer');
const Notification = require('../models/Notification');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Get current employer profile
exports.getMe = catchAsync(async (req, res, next) => {
    // req.user is already populated by protect middleware
    const user = await Employer.findByPk(req.user.id, {
        attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
        return next(new AppError('Employer not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

const JobListing = require('../models/JobListing');
const Application = require('../models/Application');

// Get Stats for Employer Dashboard
exports.getStats = catchAsync(async (req, res, next) => {
    const activeJobs = await JobListing.count({ where: { employer_id: req.user.id, is_active: true } });
    const totalApplications = await Application.count({
        include: [{
            model: JobListing,
            where: { employer_id: req.user.id }
        }]
    });

    // Simple logic for "New Cards" (e.g. applications in last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newCards = await Application.count({
        where: { applied_at: { [Op.gte]: sevenDaysAgo } },
        include: [{
            model: JobListing,
            where: { employer_id: req.user.id }
        }]
    });

    res.status(200).json({
        status: 'success',
        data: {
            stats: {
                activeJobs,
                totalApplications,
                newCards
            }
        }
    });
});

// Get jobs owned by current employer
exports.getMyJobs = catchAsync(async (req, res, next) => {
    const { status } = req.query; // 'active' or 'closed'
    const where = { employer_id: req.user.id };

    if (status === 'active') where.is_active = true;
    if (status === 'closed') where.is_active = false;

    const jobs = await JobListing.findAll({
        where,
        order: [['created_at', 'DESC']]
    });

    res.status(200).json({
        status: 'success',
        data: {
            jobs
        }
    });
});

// Update current employer profile
exports.updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates.', 400));
    }

    const allowedFields = ['companyName', 'industry', 'companyWebsite', 'contact_person', 'description', 'location'];
    const filteredBody = {};
    Object.keys(req.body).forEach(el => {
        if (allowedFields.includes(el)) filteredBody[el] = req.body[el];
    });

    if (req.file) filteredBody.profile_picture = req.file.path.replace(/\\/g, '/');

    await Employer.update(filteredBody, {
        where: { id: req.user.id }
    });

    const updatedUser = await Employer.findByPk(req.user.id, {
        attributes: { exclude: ['password_hash'] }
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

// Activity Feed for Employer (Recent notifications + New Applicants)
exports.getActivityFeed = catchAsync(async (req, res, next) => {
    const notifications = await Notification.findAll({
        where: { user_id: req.user.id, user_type: 'employer' },
        limit: 10,
        order: [['created_at', 'DESC']]
    });

    const recentApplications = await Application.findAll({
        include: [
            {
                model: JobListing,
                where: { employer_id: req.user.id }
            },
            { model: require('../models/JobSeeker'), attributes: ['firstName', 'lastName'] }
        ],
        limit: 5,
        order: [['applied_at', 'DESC']]
    });

    res.status(200).json({
        status: 'success',
        data: {
            feed: {
                notifications,
                recentApplications
            }
        }
    });
});
