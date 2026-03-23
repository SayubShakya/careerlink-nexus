const JobListing = require('../models/JobListing');
const Employer = require('../models/Employer');
const SavedJob = require('../models/SavedJob');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { Op } = require('sequelize');

// Get all jobs with filters
exports.getAllJobs = catchAsync(async (req, res, next) => {
    const { search, type, location } = req.query;

    const where = { is_active: true };

    if (search) {
        where[Op.or] = [
            { title: { [Op.iLike]: `%${search}%` } },
            { description: { [Op.iLike]: `%${search}%` } }
        ];
    }

    if (type && type !== 'All') {
        where.jobType = type;
    }

    if (location) {
        where.location = { [Op.iLike]: `%${location}%` };
    }

    const jobs = await JobListing.findAll({
        where,
        include: [
            {
                model: Employer,
                attributes: ['companyName', 'profile_picture'],
            }
        ],
        order: [['created_at', 'DESC']]
    });

    // Formatting response to match frontend expectations
    const formattedJobs = jobs.map(job => ({
        id: job.id,
        title: job.title,
        company: job.Employer?.companyName || 'Nexus Partner',
        location: job.location,
        salary: job.salary,
        type: job.jobType,
        description: job.description,
        skills: job.skills,
        deadline: job.deadline,
        Employer: {
            name: job.Employer?.companyName,
            logo: job.Employer?.profile_picture
        }
    }));

    res.status(200).json({
        status: 'success',
        results: formattedJobs.length,
        data: {
            jobs: formattedJobs
        }
    });
});

// Get single job details
exports.getJob = catchAsync(async (req, res, next) => {
    const job = await JobListing.findByPk(req.params.id, {
        include: [
            {
                model: Employer,
                attributes: ['companyName', 'profile_picture', 'description', 'companyWebsite', 'industry', 'location']
            }
        ]
    });

    if (!job) {
        return next(new AppError('No job found with that ID', 404));
    }

    // Increment views
    job.views += 1;
    await job.save();

    res.status(200).json({
        status: 'success',
        data: {
            job: {
                ...job.toJSON(),
                Employer: {
                    name: job.Employer?.companyName,
                    logo: job.Employer?.profile_picture,
                    description: job.Employer?.description,
                    website: job.Employer?.companyWebsite,
                    industry: job.Employer?.industry,
                    location: job.Employer?.location
                }
            }
        }
    });
});

// For Employers: Create a job
exports.createJob = catchAsync(async (req, res, next) => {
    if (req.role !== 'employer') {
        return next(new AppError('Only employers can create jobs', 403));
    }

    const newJob = await JobListing.create({
        ...req.body,
        employer_id: req.user.id
    });

    res.status(201).json({
        status: 'success',
        data: {
            job: newJob
        }
    });
});

// For Employers: Update a job
exports.updateJob = catchAsync(async (req, res, next) => {
    const job = await JobListing.findOne({
        where: { id: req.params.id, employer_id: req.user.id }
    });

    if (!job) {
        return next(new AppError('No job found with that ID belonging to you', 404));
    }

    await job.update(req.body);

    res.status(200).json({
        status: 'success',
        data: {
            job
        }
    });
});

// Get applicant count for a job (used before delete confirmation)
exports.getJobApplicantCount = catchAsync(async (req, res, next) => {
    const Application = require('../models/Application');
    const job = await JobListing.findOne({
        where: { id: req.params.id, employer_id: req.user.id }
    });

    if (!job) {
        return next(new AppError('No job found with that ID belonging to you', 404));
    }

    const applicantCount = await Application.count({ where: { job_id: job.id } });

    res.status(200).json({
        status: 'success',
        data: { applicantCount }
    });
});

// For Employers: Delete a job
exports.deleteJob = catchAsync(async (req, res, next) => {
    const Application = require('../models/Application');
    const job = await JobListing.findOne({
        where: { id: req.params.id, employer_id: req.user.id }
    });

    if (!job) {
        return next(new AppError('No job found with that ID belonging to you', 404));
    }

    // Explicitly delete related records to avoid FK constraint errors
    await Application.destroy({ where: { job_id: job.id } });
    await SavedJob.destroy({ where: { job_id: job.id } });

    await job.destroy();

    res.status(204).json({
        status: 'success',
        data: null
    });
});
// Get Global Platform Stats (Public)
exports.getGlobalStats = catchAsync(async (req, res, next) => {
    const liveJobs = await JobListing.count({ where: { is_active: true } });
    
    // Sum of vacancy column for active jobs
    const vacancyResult = await JobListing.findOne({
        attributes: [
            [require('../config/sequelize').fn('COALESCE', require('../config/sequelize').fn('SUM', require('../config/sequelize').col('vacancy')), 1), 'totalVacancies']
        ],
        where: { is_active: true },
        raw: true
    });
    const vacancies = parseInt(vacancyResult?.totalVacancies || 0);
    
    const organizations = await Employer.count();

    res.status(200).json({
        status: 'success',
        data: {
            liveJobs: liveJobs || 0,
            vacancies: vacancies || 0,
            organizations: organizations || 0
        }
    });
});
