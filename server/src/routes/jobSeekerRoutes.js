const express = require('express');
const jobSeekerController = require('../controllers/jobSeekerController');
const authMiddleware = require('../middleware/authMiddleware');
const uploadAvatar = require('../utils/avatarUpload');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Job Seeker
 *   description: Job seeker profile and management
 */

/**
 * @swagger
 * /api/job-seekers/me:
 *   get:
 *     summary: Get current job seeker profile
 *     tags: [Job Seeker]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/JobSeeker'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/job-seekers/me:
 *   patch:
 *     summary: Update current job seeker profile
 *     tags: [Job Seeker]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input or password change attempted
 *       401:
 *         description: Unauthorized
 */

// Get current logged-in user
// Protect all routes after this middleware
router.use(authMiddleware.protect);

// Routes specific to job seeker
router.get('/me', jobSeekerController.getMe);
router.patch('/me', uploadAvatar.single('avatar'), jobSeekerController.updateMe);

module.exports = router;
