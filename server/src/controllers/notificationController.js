const Notification = require('../models/Notification');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Get all notifications for the current user
exports.getMyNotifications = catchAsync(async (req, res, next) => {
    // Determine user type from the authenticated user object or role
    const user_type = req.role === 'employer' ? 'employer' : 'job_seeker';

    const notifications = await Notification.findAll({
        where: { user_id: req.user.id, user_type },
        order: [['created_at', 'DESC']]
    });

    res.status(200).json({
        status: 'success',
        results: notifications.length,
        data: {
            notifications
        }
    });
});

// Mark a notification as read
exports.markAsRead = catchAsync(async (req, res, next) => {
    const notification = await Notification.findOne({
        where: { id: req.params.id, user_id: req.user.id }
    });

    if (!notification) {
        return next(new AppError('Notification not found', 404));
    }

    notification.is_read = true;
    await notification.save();

    res.status(200).json({
        status: 'success',
        data: {
            notification
        }
    });
});

// Batch mark as read
exports.markAllRead = catchAsync(async (req, res, next) => {
    const user_type = req.role === 'employer' ? 'employer' : 'job_seeker';

    await Notification.update(
        { is_read: true },
        { where: { user_id: req.user.id, user_type, is_read: false } }
    );

    res.status(200).json({
        status: 'success',
        message: 'All notifications marked as read'
    });
});
