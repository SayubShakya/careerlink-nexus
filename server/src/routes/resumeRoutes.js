const express = require('express');
const resumeController = require('../controllers/resumeController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

const router = express.Router();

router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('job_seeker'));

router.post('/upload', upload.uploadCV.single('resume'), resumeController.uploadResume);
router.get('/', resumeController.getMyResumes);
router.get('/:id/download', resumeController.downloadResume);
router.delete('/:id', resumeController.deleteResume);

module.exports = router;
