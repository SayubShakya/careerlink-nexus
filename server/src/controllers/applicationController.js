const Application = require('../models/Application');
const CV = require('../models/CV');
const Profile = require('../models/Profile');
const JobSeeker = require('../models/JobSeeker');
const JobListing = require('../models/JobListing');
const Employer = require('../models/Employer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { sendNotification } = require('../services/notificationService');
const { sendApplicationConfirmation, sendStatusUpdate } = require('../services/mailService');

// Seeker applies for a job (S4-07)
exports.applyForJob = catchAsync(async (req, res, next) => {
    const { id: jobId } = req.params;
    const { cvId, cv_id, resume_id, cover_letter } = req.body;
    const finalCvId = cvId || cv_id || resume_id;
    const job_seeker_id = req.user.id;

    if (!finalCvId) {
        return next(new AppError('Please select a CV to apply.', 400));
    }

    // 1) Check if job exists
    const job = await JobListing.findByPk(jobId);
    if (!job) {
        return next(new AppError('Job not found.', 404));
    }

    // 2) Check application method and validate CV
    const cv = await CV.findOne({
        where: { id: finalCvId, user_id: job_seeker_id }
    });

    if (!cv) {
        return next(new AppError('CV not found or unauthorized.', 404));
    }

    const application_method = cv.type === 'platform' ? 'platform_cv' : 'pdf_resume';

    // 3) Check if already applied
    const existing = await Application.findOne({
        where: { job_id: jobId, job_seeker_id }
    });

    if (existing) {
        return next(new AppError('You have already applied for this job.', 400));
    }

    // 4) Create Application
    const application = await Application.create({
        job_id: jobId,
        job_seeker_id,
        cv_id: finalCvId,
        application_method,
        cover_letter,
        status: 'applied'
    });

    // Notify Employer
    await sendNotification(
        job.employer_id,
        'employer',
        'New Application received!',
        `A candidate has applied for your position: ${job.title}`,
        `/dashboard/employer/applications`
    );

    // Send Email to Seeker
    const seeker = await JobSeeker.findByPk(job_seeker_id);
    await sendApplicationConfirmation(seeker.email, job.title);

    res.status(201).json({
        status: 'success',
        message: 'Application submitted successfully',
        data: { application }
    });
});

// Seeker views their own applications
exports.getApplicationsBySeeker = catchAsync(async (req, res, next) => {
    const applications = await Application.findAll({
        where: { job_seeker_id: req.user.id },
        include: [
            {
                model: JobListing,
                include: [{ model: Employer, attributes: ['companyName', 'profile_picture'] }]
            }
        ],
        order: [['applied_at', 'DESC']]
    });

    res.status(200).json({
        status: 'success',
        results: applications.length,
        data: { applications }
    });
});

// Employer views applications for a specific job
exports.getApplicationsByJob = catchAsync(async (req, res, next) => {
    const { id: jobId } = req.params;

    // Verify job belongs to this employer
    const job = await JobListing.findOne({
        where: { id: jobId, employer_id: req.user.id }
    });

    if (!job) {
        return next(new AppError('Job not found or unauthorized.', 404));
    }

    const applications = await Application.findAll({
        where: { job_id: jobId },
        include: [
            { model: JobSeeker, attributes: ['firstName', 'lastName', 'email'] },
            { model: CV }
        ],
        order: [['applied_at', 'DESC']]
    });

    res.status(200).json({
        status: 'success',
        results: applications.length,
        data: { applications }
    });
});

// Employer views ALL applications for THEIR jobs (Dashboard Overview)
exports.getAllApplications = catchAsync(async (req, res, next) => {
    const applications = await Application.findAll({
        include: [
            {
                model: JobListing,
                where: { employer_id: req.user.id }
            },
            { model: JobSeeker, attributes: ['firstName', 'lastName', 'email'] },
            { model: CV }
        ],
        order: [['applied_at', 'DESC']]
    });

    res.status(200).json({
        status: 'success',
        results: applications.length,
        data: { applications }
    });
});

// Employer updates application status (S4-04)
exports.updateApplicationStatus = catchAsync(async (req, res, next) => {
    const { status } = req.body;

    if (!['applied', 'reviewed', 'shortlisted', 'interview_scheduled', 'rejected', 'hired'].includes(status)) {
        return next(new AppError('Invalid status value.', 400));
    }

    // Find application and ensure job belongs to employer
    const application = await Application.findByPk(req.params.id, {
        include: [{ model: JobListing }, { model: JobSeeker, attributes: ['email'] }]
    });

    if (!application) {
        return next(new AppError('Application not found.', 404));
    }

    if (application.JobListing.employer_id !== req.user.id) {
        return next(new AppError('Unauthorized to update this application.', 403));
    }

    application.status = status;
    await application.save();

    // Notify Seeker
    await sendNotification(
        application.job_seeker_id,
        'job_seeker',
        'Application Status Updated!',
        `Your application for ${application.JobListing.title} is now ${status.toUpperCase()}.`,
        `/jobseeker/status`
    );

    // Send Email to Seeker
    await sendStatusUpdate(application.JobSeeker.email, application.JobListing.title, status);

    res.status(200).json({
        status: 'success',
        message: `Application status updated to ${status}`,
        data: { application }
    });
});
