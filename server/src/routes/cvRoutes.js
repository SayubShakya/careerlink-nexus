const express = require('express');
const cvController = require('../controllers/cvController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: CVs
 *   description: CV management and file uploads
 */

/**
 * @swagger
 * /api/cvs:
 *   get:
 *     summary: Get all CVs for current job seeker
 *     tags: [CVs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of CVs retrieved
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new platform-based CV
 *     tags: [CVs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: CV created successfully
 */

/**
 * @swagger
 * /api/cvs/upload:
 *   post:
 *     summary: Upload a CV file
 *     tags: [CVs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully
 */

/**
 * @swagger
 * /api/cvs/{id}:
 *   get:
 *     summary: Download/View a specific CV
 *     tags: [CVs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: CV retrieved
 *   patch:
 *     summary: Update a CV
 *     tags: [CVs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: CV updated
 *   delete:
 *     summary: Delete a CV
 *     tags: [CVs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: CV deleted
 */

// Protect all routes
router.use(authMiddleware.protect);
// Restrict to job seekers only
router.use(authMiddleware.restrictTo('job_seeker'));

router.route('/')
    .get(cvController.getAllCVs)
    .post(cvController.createPlatformCV);

router.post('/upload', upload.single('file'), cvController.uploadCV);

router.route('/:id')
    .delete(cvController.deleteCV)
    .get(cvController.downloadCV)
    .patch(cvController.updateCV);

module.exports = router;
