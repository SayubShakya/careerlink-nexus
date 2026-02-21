const express = require('express');
const jobSeekerController = require('../controllers/jobSeekerController');
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

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
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
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
// Restrict to only job seekers
router.use(authMiddleware.restrictTo('job_seeker'));

// Routes specific to job seeker
router.get('/me', jobSeekerController.getMe);
router.get('/full-profile', jobSeekerController.getFullProfile);
router.patch('/me', upload.single('profile_picture'), jobSeekerController.updateMe);
router.get('/me/stats', jobSeekerController.getStats);
router.get('/me/feed', jobSeekerController.getActivityFeed);
router.get('/me/saved-jobs', jobSeekerController.getSavedJobs);
router.post('/me/saved-jobs/:id', jobSeekerController.saveJob);
router.delete('/me/saved-jobs/:id', jobSeekerController.unsaveJob);
router.get('/me/applications', applicationController.getApplicationsBySeeker);

module.exports = router;
