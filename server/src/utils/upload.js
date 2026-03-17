const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AppError = require('./AppError');

const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

// Generic storage configuration for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: (req, file) => {
            if (file.fieldname === 'profile_picture' || file.fieldname === 'avatar') return 'nexus_profiles';
            if (file.fieldname === 'logo') return 'nexus_logos';
            if (file.fieldname === 'file') return 'nexus_cvs';
            return 'nexus_others';
        },
        // Cloudinary auto-detects resource_type based on the file content.
        resource_type: 'auto',
        // Optional: keeping original filename might not be fully required since Cloudinary assigns random suffix anyway.
        public_id: (req, file) => {
            return `${file.fieldname}-${req.user?.id || 'guest'}-${Date.now()}`;
        }
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
