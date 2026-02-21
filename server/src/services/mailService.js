/**
 * Mock Email Service for CareerLink Nexus
 * In production, replace this with Nodemailer/SendGrid/AWS SES
 */

exports.sendEmail = async (to, subject, text, html) => {
    console.log(`📧 [MOCK EMAIL] To: ${to}`);
    console.log(`📌 Subject: ${subject}`);
    console.log(`📝 Content: ${text}`);
    console.log('---');
    return true;
};

exports.sendApplicationConfirmation = async (userEmail, jobTitle) => {
    const subject = `Application Received: ${jobTitle}`;
    const text = `Hi, thank you for applying for the position of ${jobTitle}. We have received your application and will review it shortly.`;
    return this.sendEmail(userEmail, subject, text);
};

exports.sendStatusUpdate = async (userEmail, jobTitle, status) => {
    const subject = `Update on your application for ${jobTitle}`;
    const text = `Hi, our hiring team has updated your application status for ${jobTitle} to: ${status.toUpperCase()}.`;
    return this.sendEmail(userEmail, subject, text);
};
