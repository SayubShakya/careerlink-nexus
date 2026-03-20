const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const applicationController = require('../controllers/applicationController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Public Routes
router.get('/stats', jobController.getGlobalStats);
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJob);

// Seeker Routes
router.post('/:id/apply', protect, restrictTo('job_seeker'), applicationController.applyForJob);

// Employer Routes
router.post('/', protect, restrictTo('employer'), jobController.createJob);
router.patch('/:id', protect, restrictTo('employer'), jobController.updateJob);
router.put('/:id', protect, restrictTo('employer'), jobController.updateJob);
router.delete('/:id', protect, restrictTo('employer'), jobController.deleteJob);
router.get('/:id/applicants', protect, restrictTo('employer'), applicationController.getApplicationsByJob);

module.exports = router;
