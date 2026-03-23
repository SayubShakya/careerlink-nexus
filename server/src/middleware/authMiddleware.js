const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const JobSeeker = require('../models/JobSeeker');
const Employer = require('../models/Employer');

const Role = require('../models/Role');

const ADMIN_ID = '00000000-0000-0000-0000-000000000001';

// Protect routes - verifies JWT token
exports.protect = catchAsync(async (req, res, next) => {
    // 1) Get token from header OR query param (query param needed for window.open / direct URL access)
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.query.token) {
        token = req.query.token;
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user is admin (virtual user)
    if (decoded.id === ADMIN_ID) {
        req.user = {
            id: ADMIN_ID,
            email: 'admin@nexus.com',
            firstName: 'System',
            lastName: 'Admin',
            Role: { name: 'admin' }
        };
        req.role = 'admin';
        return next();
    }

    // 4) Check if user still exists (check both tables)
    let currentUser = await JobSeeker.findByPk(decoded.id, {
        include: [{ model: Role, attributes: ['name'] }]
    });

    if (!currentUser) {
        currentUser = await Employer.findByPk(decoded.id, {
            include: [{ model: Role, attributes: ['name'] }]
        });
    }

    if (!currentUser) {
        return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // 5) Grant access - attach user and role to request
    req.user = currentUser;
    req.role = currentUser.Role.name;
    next();
});

// Restrict to specific roles
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};
