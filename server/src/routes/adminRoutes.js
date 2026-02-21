const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Only Admins can access these routes
router.use(protect);
router.use(restrictTo('admin'));

// System Config
router.route('/categories')
    .get(adminController.getAllCategories)
    .post(adminController.createCategory);

router.route('/skills')
    .get(adminController.getAllSkills)
    .post(adminController.createSkill);

// Moderation
router.patch('/verify-employer/:id', adminController.verifyEmployer);
router.patch('/ban-job/:id', adminController.banJob);

module.exports = router;
