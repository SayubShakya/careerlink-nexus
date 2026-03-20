const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generate a professional PDF from CV JSON content
 * @param {Object} cvData - The CV model instance with content JSON
 * @param {Object} userData - User info (firstName, lastName, email)
 * @returns {Promise<Buffer>} - PDF Buffer
 */
exports.generateCV = (cvData, userData) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            margin: 50,
            size: 'A4'
        });

        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            let pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });

        let content = cvData.content || {};
        if (typeof content === 'string') {
            try { content = JSON.parse(content); } catch (e) { content = {}; }
        }
        const about = content.about || {};

        // Header
        const firstName = about.firstName || userData.firstName;
        const lastName = about.lastName || userData.lastName;
        const email = about.email || userData.email;

        doc.fillColor('#0F172A')
            .fontSize(26)
            .font('Helvetica-Bold')
            .text(`${firstName} ${lastName}`, { align: 'left' });

        if (about.designation) {
            doc.fontSize(14)
                .fillColor('#3E61FF')
                .text(about.designation, { align: 'left' });
        }

        doc.fontSize(10)
            .font('Helvetica')
            .fillColor('#64748B')
            .text(`${email} | ${about.phone || ''} | ${about.address || ''}`, { align: 'left' });

        doc.moveDown();
        doc.strokeColor('#E2E8F0').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown();

        // Summary
        const summary = about.summary || content.summary;
        if (summary && summary.trim()) {
            sectionTitle(doc, 'ABOUT ME');
            doc.fontSize(10).font('Helvetica').fillColor('#334155').text(summary, { align: 'justify', lineGap: 2 });
            doc.moveDown();
        }

        // Experience
        const rawExperience = content.experience || [];
        const experience = rawExperience.filter(exp => exp && (exp.role || exp.title || exp.company));

        if (experience.length > 0) {
            sectionTitle(doc, 'WORK HISTORY');
            experience.forEach(exp => {
                doc.fontSize(11).font('Helvetica-Bold').fillColor('#0F172A').text(exp.role || exp.title || 'Role');
                doc.fontSize(10).font('Helvetica-Bold').fillColor('#3E61FF').text(exp.company || '');
                const dateRange = exp.duration || `${exp.startDate || ''} - ${exp.isPresent ? 'Present' : exp.endDate || ''}`;
                doc.fontSize(9).font('Helvetica-Oblique').fillColor('#64748B').text(dateRange);
                doc.moveDown(0.3);
                const tasks = exp.tasks || exp.description;
                if (tasks && tasks.trim()) {
                    doc.fontSize(10).font('Helvetica').fillColor('#334155').text(tasks, { indent: 10 });
                }
                doc.moveDown();
            });
        }

        // Education
        const rawEducation = content.education || [];
        const education = rawEducation.filter(edu => edu && (edu.degree || edu.institute || edu.school));

        if (education.length > 0) {
            sectionTitle(doc, 'EDUCATION');
            education.forEach(edu => {
                doc.fontSize(11).font('Helvetica-Bold').fillColor('#0F172A').text(edu.degree || 'Degree');
                const eduDate = edu.year || `${edu.startDate || ''} - ${edu.isPresent ? 'Present' : edu.endDate || ''}`;
                doc.fontSize(10).font('Helvetica').fillColor('#334155').text(`${edu.institute || edu.school || ''} | ${eduDate}`);
                doc.moveDown();
            });
        }

        // Skills
        const skills = content.skills || [];
        const filteredSkills = skills.filter(s => s && s.trim());
        if (filteredSkills.length > 0) {
            sectionTitle(doc, 'SKILLS');
            doc.fontSize(10).font('Helvetica').fillColor('#334155').text(filteredSkills.join(' • '));
            doc.moveDown();
        }

        // Languages
        const languages = content.languages || [];
        const filteredLangs = languages.filter(l => l && l.lang && l.lang.trim());
        if (filteredLangs.length > 0) {
            sectionTitle(doc, 'LANGUAGES');
            const langStrings = filteredLangs.map(l => `${l.lang} (${l.level || 'Native'})`);
            doc.fontSize(10).font('Helvetica').fillColor('#334155').text(langStrings.join(' • '));
        }

        doc.end();
    });
};

function sectionTitle(doc, title) {
    doc.fillColor('#0F172A')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text(title, { characterSpacing: 1 });
    doc.moveDown(0.5);
}
