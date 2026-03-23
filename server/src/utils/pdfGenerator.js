const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.generateCV = (cvData, userData) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            margin: 50,
            size: 'A4'
        });

        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            resolve(Buffer.concat(buffers));
        });

        let content = cvData.content || Object.assign({}, cvData);
        if (typeof content === 'string') {
            try { content = JSON.parse(content); } catch (e) { content = {}; }
        }
        
        const about = content.about || {};
        const firstName = about.firstName || userData?.firstName || 'Professional';
        const lastName = about.lastName || userData?.lastName || '';
        const email = about.email || userData?.email || '';
        const phone = about.phone || '';
        const address = about.address || '';

        // Colors matching the UI Tokens
        const primary = '#3E61FF';
        const primaryDark = '#1E3A8A';
        const textMain = '#1E293B';
        const textMuted = '#64748B';

        // HEADER
        doc.font('Helvetica-Bold').fontSize(36).fillColor(textMain)
            .text(`${firstName} `, { continued: true })
            .fillColor(primary).text(lastName);
        
        if (about.designation) {
            doc.font('Helvetica-Bold').fontSize(14).fillColor(textMuted).text(about.designation);
        }
        
        doc.moveDown(0.5);
        let contactInfo = [];
        if (email) contactInfo.push(email);
        if (phone) contactInfo.push(phone);
        if (address) contactInfo.push(address);
        
        if (contactInfo.length > 0) {
            doc.font('Helvetica').fontSize(10).fillColor(textMuted).text(contactInfo.join('  |  '));
        }

        doc.moveDown(0.8);
        doc.strokeColor('#E2E8F0').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(1.5);

        // Grid Constants
        const topY = doc.y;
        const leftX = 50;
        const rightX = 380;
        const leftWidth = 300;
        const rightWidth = 165;
        
        const renderSectionTitle = (title, x, y) => {
            doc.x = x;
            doc.y = y;
            doc.font('Helvetica-Bold').fontSize(11).fillColor(primary).text(title.toUpperCase(), { characterSpacing: 1.5 });
            doc.moveDown(0.6);
        };

        // ==========================================
        // LEFT COLUMN RENDERING
        // ==========================================
        doc.x = leftX;
        doc.y = topY;

        // ABOUT ME
        const summary = about.summary || content.summary;
        if (summary && summary.trim()) {
            renderSectionTitle('About Me', leftX, doc.y);
            doc.font('Helvetica').fontSize(9.5).fillColor(textMain).text(summary, { width: leftWidth, align: 'justify', lineGap: 3 });
            doc.moveDown(1.5);
        }

        // WORK HISTORY
        const experience = (content.experience || []).filter(e => e && e.role);
        if (experience.length > 0) {
            renderSectionTitle('Work History', leftX, doc.y);
            experience.forEach(exp => {
                const startY = doc.y;
                doc.font('Helvetica-Bold').fontSize(11).fillColor(textMain).text(exp.role || exp.title, { width: leftWidth });
                
                const dateRange = `${exp.startDate || ''} - ${exp.isPresent ? 'Present' : exp.endDate || ''}`;
                doc.font('Helvetica-Bold').fontSize(9).fillColor(textMuted).text(dateRange, leftX, startY + 1.5, { width: leftWidth, align: 'right' });
                
                doc.x = leftX;
                doc.moveDown(0.2);
                doc.font('Helvetica-Bold').fontSize(9.5).fillColor(primary).text(exp.company, { width: leftWidth });
                doc.moveDown(0.4);
                
                if (exp.tasks) {
                    doc.font('Helvetica').fontSize(9.5).fillColor(textMain).text(exp.tasks, { width: leftWidth, lineGap: 2 });
                }
                doc.moveDown(1.2);
            });
        }

        // EDUCATION
        const education = (content.education || []).filter(e => e && e.degree);
        if (education.length > 0) {
            renderSectionTitle('Education', leftX, doc.y);
            education.forEach(edu => {
                const startY = doc.y;
                doc.font('Helvetica-Bold').fontSize(11).fillColor(textMain).text(edu.degree, { width: leftWidth });
                const dateRange = `${edu.startDate || ''} - ${edu.isPresent ? 'Present' : edu.endDate || ''}`;
                doc.font('Helvetica-Bold').fontSize(9).fillColor(textMuted).text(dateRange, leftX, startY + 1.5, { width: leftWidth, align: 'right' });
                doc.x = leftX;
                doc.moveDown(0.2);
                doc.font('Helvetica').fontSize(9.5).fillColor(textMuted).text(edu.institute, { width: leftWidth });
                doc.moveDown(1.2);
            });
        }

        // TRAININGS
        const trainings = (content.trainings || []).filter(t => t && (typeof t === 'string' ? t.trim() : true));
        if (trainings.length > 0) {
            renderSectionTitle('Training & Certificates', leftX, doc.y);
            trainings.forEach(t => {
                const text = typeof t === 'string' ? t : t.name;
                doc.font('Helvetica-Bold').fontSize(9.5).fillColor(textMain).text(`• ${text}`, { width: leftWidth, lineGap: 2 });
                doc.moveDown(0.4);
            });
            doc.moveDown(1);
        }

        // Save max left Y to know the end of the page if needed
        const maxLeftY = doc.y;

        // ==========================================
        // RIGHT COLUMN RENDERING
        // ==========================================
        doc.x = rightX;
        doc.y = topY;

        // SKILLS
        const skills = (content.skills || []).filter(s => s && ((typeof s === 'string' && s.trim()) || s.name));
        if (skills.length > 0) {
            renderSectionTitle('Skills', rightX, doc.y);
            const skillsArray = skills.map(s => typeof s === 'string' ? s : s.name);
            doc.font('Helvetica-Bold').fontSize(9).fillColor(textMain).text(skillsArray.join('  •  '), { width: rightWidth, lineGap: 4 });
            doc.moveDown(1.5);
        }

        // KEY SUCCESSES (ACHIEVEMENTS)
        const successes = (content.achievements || []).filter(a => a && a.trim && a.trim());
        if (successes.length > 0) {
            renderSectionTitle('Key Successes', rightX, doc.y);
            successes.forEach(s => {
                doc.font('Helvetica').fontSize(9).fillColor(textMain).text(`• ${s}`, { width: rightWidth, lineGap: 2 });
                doc.moveDown(0.6);
            });
            doc.moveDown(1);
        }

        // AWARDS
        const awards = (content.awards || []).filter(a => a && a.trim && a.trim());
        if (awards.length > 0) {
            renderSectionTitle('Awards', rightX, doc.y);
            awards.forEach(a => {
                doc.font('Helvetica').fontSize(9).fillColor(textMain).text(`• ${a}`, { width: rightWidth, lineGap: 2 });
                doc.moveDown(0.6);
            });
            doc.moveDown(1);
        }

        // LANGUAGES
        const languages = (content.languages || []).filter(l => l && l.lang && l.lang.trim());
        if (languages.length > 0) {
            renderSectionTitle('Languages', rightX, doc.y);
            languages.forEach(l => {
                const startY = doc.y;
                doc.font('Helvetica-Bold').fontSize(9).fillColor(textMain).text(l.lang, { width: rightWidth });
                doc.font('Helvetica').fontSize(9).fillColor(textMuted).text(l.level || 'Native', rightX, startY, { width: rightWidth, align: 'right' });
                doc.x = rightX;
                doc.moveDown(0.5);
            });
        }

        doc.end();
    });
};
