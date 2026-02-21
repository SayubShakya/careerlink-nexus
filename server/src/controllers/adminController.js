const Category = require('../models/Category');
const Skill = require('../models/Skill');
const Employer = require('../models/Employer');
const JobListing = require('../models/JobListing');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// S4-27: System Config (Categories)
exports.createCategory = catchAsync(async (req, res, next) => {
    const category = await Category.create(req.body);
    res.status(201).json({
        status: 'success',
        data: { category }
    });
});

exports.getAllCategories = catchAsync(async (req, res, next) => {
    const categories = await Category.findAll();
    res.status(200).json({
        status: 'success',
        results: categories.length,
        data: { categories }
    });
});

// S4-27: System Config (Skills)
exports.createSkill = catchAsync(async (req, res, next) => {
    const skill = await Skill.create(req.body);
    res.status(201).json({
        status: 'success',
        data: { skill }
    });
});

exports.getAllSkills = catchAsync(async (req, res, next) => {
    const skills = await Skill.findAll();
    res.status(200).json({
        status: 'success',
        results: skills.length,
        data: { skills }
    });
});

// S4-26: Moderation
exports.verifyEmployer = catchAsync(async (req, res, next) => {
    const employer = await Employer.findByPk(req.params.id);
    if (!employer) return next(new AppError('Employer not found', 404));

    employer.is_verified = true;
    await employer.save();

    res.status(200).json({
        status: 'success',
        message: 'Employer verified successfully'
    });
});

exports.banJob = catchAsync(async (req, res, next) => {
    const job = await JobListing.findByPk(req.params.id);
    if (!job) return next(new AppError('Job not found', 404));

    job.is_active = false;
    await job.save();

    res.status(200).json({
        status: 'success',
        message: 'Job listing deactivated by admin'
    });
});
