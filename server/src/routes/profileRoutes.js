const express = require('express');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('job_seeker'));

// Experience
router.post('/experience', profileController.addExperience);
router.patch('/experience/:id', profileController.updateExperience);
router.delete('/experience/:id', profileController.deleteExperience);

// Education
router.post('/education', profileController.addEducation);
router.patch('/education/:id', profileController.updateEducation);
router.delete('/education/:id', profileController.deleteEducation);

// Skills
router.post('/skills', profileController.addSkill);
router.patch('/skills/:id', profileController.updateSkill);
router.delete('/skills/:id', profileController.deleteSkill);

// Projects
router.post('/projects', profileController.addProject);
router.patch('/projects/:id', profileController.updateProject);
router.delete('/projects/:id', profileController.deleteProject);

// Trainings
router.post('/trainings', profileController.addTraining);
router.patch('/trainings/:id', profileController.updateTraining);
router.delete('/trainings/:id', profileController.deleteTraining);

// Social Links
router.post('/social-links', profileController.addSocialLink);
router.patch('/social-links/:id', profileController.updateSocialLink);
router.delete('/social-links/:id', profileController.deleteSocialLink);

module.exports = router;
