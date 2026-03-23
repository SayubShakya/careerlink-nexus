const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AppError = require('./AppError');

const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

// Generic storage configuration for Cloudinary (Images only)
const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
        const ext = path.extname(file.originalname).toLowerCase();
        
        let folder = 'nexus_others';
        if (file.fieldname === 'profile_picture' || file.fieldname === 'avatar') folder = 'nexus_profiles';
        else if (file.fieldname === 'logo') folder = 'nexus_logos';

        return {
            folder,
            resource_type: 'image',
            public_id: `${file.fieldname}-${req.user?.id || 'guest'}-${Date.now()}`
        };
    }
});

// Local storage configuration specifically for CV PDFs (kept as a temporary fallback or for private storage)
const localCvStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../../uploads/cvs');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `file-${req.user?.id || 'guest'}-${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`);
    }
});

// Cloudinary storage for CVs (globally accessible)
// We use resource_type: 'raw' to avoid image-specific delivery issues with PDFs
const cloudCvStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => ({
        folder: 'nexus_cvs',
        resource_type: 'raw',
        format: 'pdf',
        public_id: `cv-${req.user?.id || 'guest'}-${Date.now()}`,
        type: 'upload', // Changed from 'authenticated' to allow the server to serve it regardless of IP
        access_mode: 'public'
    })
});

const imageFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedImageTypes = ['.jpg', '.jpeg', '.png', '.webp'];
    if (allowedImageTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new AppError('Invalid image type. Only JPG, PNG and WEBP are allowed.', 400), false);
    }
};

const docFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedDocTypes = ['.pdf', '.doc', '.docx'];
    if (allowedDocTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new AppError('Invalid file type. Only PDF and Word documents are allowed.', 400), false);
    }
};

const uploadImage = multer({
    storage: cloudStorage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const uploadCV = multer({
    storage: cloudCvStorage, // Switched to Cloudinary for global accessibility
    fileFilter: docFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit for CVs
});

module.exports = {
    uploadImage,
    uploadCV,
    // Provide a generic fallback that defaults to uploadImage for compatibility
    single: (fieldName) => uploadImage.single(fieldName)
};
