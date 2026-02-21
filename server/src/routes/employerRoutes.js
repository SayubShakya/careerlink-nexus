const express = require('express');
const employerController = require('../controllers/employerController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Employer
 *   description: Employer profile and application management
 */

/**
 * @swagger
 * /api/employers/me:
 *   get:
 *     summary: Get current employer profile
 *     tags: [Employer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data retrieved successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/employers/me:
 *   patch:
 *     summary: Update employer profile
 *     tags: [Employer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile updated
 */

/**
 * @swagger
 * /api/employers/applications:
 *   get:
 *     summary: View all applications (Dashboard view)
 *     tags: [Employer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of applications
 */

// Protect all routes after this middleware
router.use(authMiddleware.protect);
// Restrict to only employers
router.use(authMiddleware.restrictTo('employer'));

const applicationController = require('../controllers/applicationController'); // New Import

const upload = require('../utils/upload');

// Routes specific to employer
router.get('/me', employerController.getMe);
router.patch('/me', upload.single('profile_picture'), employerController.updateMe);
router.get('/me/stats', employerController.getStats);
router.get('/me/feed', employerController.getActivityFeed);
router.get('/my-jobs', employerController.getMyJobs);

// Application Management
router.get('/applications', applicationController.getAllApplications);
router.patch('/applications/:id/status', applicationController.updateApplicationStatus);

module.exports = router;
