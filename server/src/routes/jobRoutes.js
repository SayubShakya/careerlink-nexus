const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job applications and management
 */

/**
 * @swagger
 * /api/jobs/{id}/apply:
 *   post:
 *     summary: Apply for a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The job ID
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/jobs/{id}/applicants:
 *   get:
 *     summary: Get applicants for a specific job (Employer only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The job ID
 *     responses:
 *       200:
 *         description: List of applicants retrieved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

// Job Routes - Assumes routes are mounted under /api/jobs

// Seeker applies to a job
router.post('/:id/apply', protect, applicationController.applyForJob);

// Employer views applicants for a job
router.get('/:id/applicants', protect, applicationController.getApplicationsByJob);

module.exports = router;
