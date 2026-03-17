/**
 * Mock Email Service for CareerLink Nexus
 * In production, replace this with Nodemailer/SendGrid/AWS SES
 */

const sendEmail = async (to, subject, text) => {
    console.log(`📧 [MOCK EMAIL] To: ${to}`);
    console.log(`📌 Subject: ${subject}`);
    console.log(`📝 Content: ${text}`);
    console.log('---');
    return true;
};

const sendApplicationConfirmation = async (userEmail, jobTitle) => {
    const subject = `Application Received: ${jobTitle}`;
    const text = `Hi, thank you for applying for the position of ${jobTitle}. We have received your application and will review it shortly.`;
    return sendEmail(userEmail, subject, text);
};

const sendStatusUpdate = async (userEmail, jobTitle, status) => {
    const subject = `Update on your application for ${jobTitle}`;
    const text = `Hi, our hiring team has updated your application status for ${jobTitle} to: ${status.toUpperCase()}.`;
    return sendEmail(userEmail, subject, text);
};

module.exports = { sendEmail, sendApplicationConfirmation, sendStatusUpdate };
