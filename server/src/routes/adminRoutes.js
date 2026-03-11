const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Only Admins can access these routes
router.use(protect);
router.use(restrictTo('admin'));

// Dashboard Stats
router.get('/stats', adminController.getDashboardStats);

// System Config
router.route('/categories')
    .get(adminController.getAllCategories)
    .post(adminController.createCategory);

router.route('/skills')
    .get(adminController.getAllSkills)
    .post(adminController.createSkill);

// Dashboard Data
router.get('/employers', adminController.getAllEmployers);
router.get('/employers/:id/jobs', adminController.getEmployerJobs);
router.delete('/employers/:id', adminController.deleteEmployer);
router.get('/jobs', adminController.getAllJobs);
router.get('/job-seekers', adminController.getAllJobSeekers);

// Moderation
router.patch('/verify-employer/:id', adminController.verifyEmployer);
router.patch('/ban-job/:id', adminController.banJob);

module.exports = router;
