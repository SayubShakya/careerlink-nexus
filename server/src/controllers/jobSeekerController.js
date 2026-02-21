const JobSeeker = require('../models/JobSeeker');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Get current job seeker profile
exports.getMe = catchAsync(async (req, res, next) => {
    // req.user is already populated by protect middleware
    const user = await JobSeeker.findByPk(req.user.id, {
        attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
        return next(new AppError('User not found', 404));
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
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This route is not for password updates. Please use /updateMyPassword.',
                400
            )
        );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const allowedFields = ['first_name', 'last_name', 'profile_picture'];

    const filteredBody = {};
    Object.keys(req.body).forEach(el => {
        if (allowedFields.includes(el)) filteredBody[el] = req.body[el];
    });

    // If a file was uploaded, add its path to filteredBody
    if (req.file) {
        filteredBody.profile_picture = req.file.path.replace(/\\/g, '/');
    }

    // 3) Update user document
    // Using update instead of save simply because save hooks might require validation on all fields or re-hash password if not careful (though we avoided password here)
    // Actually, simple update is safer for partial updates
    const [updatedRows] = await JobSeeker.update(filteredBody, {
        where: { id: req.user.id }
    });

    if (updatedRows === 0) {
        // This might happen if no fields were actually changed
        // But we still return the user
    }

    const updatedUser = await JobSeeker.findByPk(req.user.id, {
        attributes: { exclude: ['password_hash'] }
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});
