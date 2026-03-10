const authService = require('../services/authService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { createSendToken } = require('../utils/auth');

// 1. Register Job Seeker
exports.registerJobSeeker = catchAsync(async (req, res, next) => {
    const newUser = await authService.createJobSeeker(req.body);
    createSendToken(newUser, 201, res, 'job_seeker');
});

// 2. Register Employer
exports.registerEmployer = catchAsync(async (req, res, next) => {
    const newUser = await authService.createEmployer(req.body);
    createSendToken(newUser, 201, res, 'employer');
});

// 3. Login
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    // 1) Check if user exists
    const result = await authService.findUserByEmail(email);
    if (!result) {
        return next(new AppError('Incorrect email or password', 401));
    }

    const { user, role } = result;

    // 2) Check if password is correct
    const isCorrect = await authService.verifyPassword(user, password);
    if (!isCorrect) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // 3) Store user info in session
    req.session.userId = user.id;
    req.session.role = role;

    // 4) If everything ok, send token to client
    createSendToken(user, 200, res, role);
});

// 4. Logout
exports.logout = catchAsync(async (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return next(new AppError('Could not log out. Please try again.', 500));
        }
        res.clearCookie('connect.sid'); // Default cookie name for express-session
        res.status(200).json({
            status: 'success',
            message: 'Logged out successfully'
        });
    });
});

// 5. Google SSO Verification
exports.googleVerify = catchAsync(async (req, res, next) => {
    const { token, role: intendedRole = 'job_seeker' } = req.body;

    if (!token) {
        return next(new AppError('Please provide a Google token', 400));
    }

    // 1. Exchange access_token for user profile via Google's userinfo endpoint
    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!userInfoRes.ok) {
        return next(new AppError('Invalid Google token', 401));
    }

    const { email, sub: googleId, name, picture } = await userInfoRes.json();

    // 2. Check if user exists in our database
    const result = await authService.findUserByEmail(email);

    if (result) {
        // User exists - log them in using their actual pre-existing role
        const { user, role } = result;
        req.session.userId = user.id;
        req.session.role = role;
        return createSendToken(user, 200, res, role);
    } else {
        // User does not exist - can we create them immediately?
        if (req.body.role) {
            const role = req.body.role;
            const payload = role === 'job_seeker'
                ? { firstName: name.split(' ')[0], lastName: name.split(' ').slice(1).join(' ') || 'User', email, password: googleId, is_sso: true }
                : {
                    companyName: req.body.companyName || `${name}'s Org`,
                    companyWebsite: req.body.companyWebsite || 'https://example.com',
                    email, password: googleId, is_sso: true
                };

            let newUser;
            if (role === 'job_seeker') {
                newUser = await authService.createJobSeeker(payload);
            } else {
                newUser = await authService.createEmployer(payload);
            }
            req.session.userId = newUser.id;
            req.session.role = role;
            return createSendToken(newUser, 201, res, role);
        }

        // No intended role - came from login and user not found
        return next(new AppError('No account found for this Google email. Please sign up to create an account.', 404));
    }
});

// 6. Get current authenticated user
exports.getMe = catchAsync(async (req, res, next) => {
    // req.user and req.role are already populated by protect middleware
    res.status(200).json({
        status: 'success',
        data: {
            user: req.user,
            role: req.role
        }
    });
});
