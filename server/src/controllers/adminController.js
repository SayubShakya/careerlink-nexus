const Category = require('../models/Category');
const Skill = require('../models/Skill');
const Employer = require('../models/Employer');
const JobListing = require('../models/JobListing');
const JobSeeker = require('../models/JobSeeker');
const Application = require('../models/Application');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const sequelize = require('../config/sequelize');

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

// --- Admin Dashboard Endpoints ---

// Get all employers with their job counts
exports.getAllEmployers = catchAsync(async (req, res, next) => {
    const employers = await Employer.findAll({
        attributes: ['id', 'email', 'companyName', 'companyWebsite', 'industry', 'location', 'is_verified', 'profile_picture', 'created_at'],
        include: [{
            model: JobListing,
            attributes: ['id'],
        }],
        order: [['created_at', 'DESC']]
    });

    const employersData = employers.map(emp => {
        const empJson = emp.toJSON();
        return {
            ...empJson,
            jobCount: empJson.JobListings ? empJson.JobListings.length : 0,
            JobListings: undefined // Remove the full array
        };
    });

    res.status(200).json({
        status: 'success',
        results: employersData.length,
        data: { employers: employersData }
    });
});

// Get all jobs with employer info and applicant counts
exports.getAllJobs = catchAsync(async (req, res, next) => {
    const jobs = await JobListing.findAll({
        include: [{
            model: Employer,
            attributes: ['id', 'companyName', 'email', 'profile_picture']
        }],
        order: [['created_at', 'DESC']]
    });

    // Count applicants for each job
    const jobsWithCounts = await Promise.all(jobs.map(async (job) => {
        const applicantCount = await Application.count({
            where: { job_id: job.id }
        });
        return {
            ...job.toJSON(),
            totalApplications: applicantCount
        };
    }));

    res.status(200).json({
        status: 'success',
        results: jobsWithCounts.length,
        data: { jobs: jobsWithCounts }
    });
});

// Get all job seekers
exports.getAllJobSeekers = catchAsync(async (req, res, next) => {
    const Profile = require('../models/Profile');
    const jobSeekers = await JobSeeker.findAll({
        attributes: ['id', 'email', 'firstName', 'lastName', 'profile_picture', 'created_at'],
        include: [{
            model: Profile,
            attributes: ['phone', 'location', 'headline']
        }],
        order: [['created_at', 'DESC']]
    });

    res.status(200).json({
        status: 'success',
        results: jobSeekers.length,
        data: { jobSeekers }
    });
});

// Get admin dashboard stats
exports.getDashboardStats = catchAsync(async (req, res, next) => {
    const totalEmployers = await Employer.count();
    const totalJobSeekers = await JobSeeker.count();
    const totalJobs = await JobListing.count();
    const activeJobs = await JobListing.count({ where: { is_active: true } });
    const totalApplications = await Application.count();

    // Total Clicks = SUM of views from all job_listings
    const clicksResult = await JobListing.findOne({
        attributes: [
            [sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('views')), 0), 'totalClicks']
        ],
        raw: true
    });
    const totalClicks = parseInt(clicksResult?.totalClicks || 0);

    // Hiring Bosses = count of employers (same as totalEmployers)
    const hiringBosses = totalEmployers;

    res.status(200).json({
        status: 'success',
        data: {
            stats: {
                totalEmployers,
                totalJobSeekers,
                totalJobs,
                activeJobs,
                totalApplications,
                totalClicks,
                hiringBosses
            }
        }
    });
});

// Delete an employer and their job listings
exports.deleteEmployer = catchAsync(async (req, res, next) => {
    const employer = await Employer.findByPk(req.params.id);
    if (!employer) return next(new AppError('Employer not found', 404));

    // Delete all job listings by this employer (cascade handles applications)
    await JobListing.destroy({ where: { employer_id: req.params.id } });

    // Delete the employer
    await employer.destroy();

    res.status(200).json({
        status: 'success',
        message: 'Employer and all associated job listings deleted successfully'
    });
});

// Get jobs by a specific employer
exports.getEmployerJobs = catchAsync(async (req, res, next) => {
    const employer = await Employer.findByPk(req.params.id);
    if (!employer) return next(new AppError('Employer not found', 404));

    const jobs = await JobListing.findAll({
        where: { employer_id: req.params.id },
        order: [['created_at', 'DESC']]
    });

    res.status(200).json({
        status: 'success',
        results: jobs.length,
        data: {
            employer: { id: employer.id, companyName: employer.companyName },
            jobs
        }
    });
});
