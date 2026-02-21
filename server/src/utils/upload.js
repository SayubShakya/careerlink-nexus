const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AppError = require('./AppError');

// Generic storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dest = 'uploads/';
        if (file.fieldname === 'profile_picture' || file.fieldname === 'avatar') {
            dest += 'profiles';
        } else if (file.fieldname === 'logo') {
            dest += 'logos';
        } else if (file.fieldname === 'file') {
            dest += 'cvs';
        } else {
            dest += 'others';
        }

        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${req.user.id || 'guest'}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (file.fieldname === 'profile_picture' || file.fieldname === 'avatar' || file.fieldname === 'logo') {
        const allowedImageTypes = ['.jpg', '.jpeg', '.png', '.webp'];
        if (allowedImageTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new AppError('Invalid image type. Only JPG, PNG and WEBP are allowed.', 400), false);
        }
    } else {
        const allowedDocTypes = ['.pdf', '.doc', '.docx'];
        if (allowedDocTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new AppError('Invalid file type. Only PDF and Word documents are allowed.', 400), false);
        }
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = upload;
