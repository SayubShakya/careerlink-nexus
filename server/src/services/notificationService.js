const Notification = require('../models/Notification');

/**
 * Send a notification to a user
 * @param {string} userId - UUID of the user
 * @param {string} userType - 'job_seeker' or 'employer'
 * @param {string} title - Title of the notification
 * @param {string} message - Content of the notification
 * @param {string} link - Optional URL for redirection
 */
exports.sendNotification = async (userId, userType, title, message, link = null) => {
    try {
        await Notification.create({
            user_id: userId,
            user_type: userType,
            title,
            message,
            link
        });
        console.log(`🔔 Notification sent to ${userType} (${userId}): ${title}`);
    } catch (error) {
        console.error('❌ Failed to send notification:', error);
    }
};
