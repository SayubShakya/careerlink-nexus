const { Experience, Education, ProfileSkill, Project, Training, SocialLink } = require('../models/ProfileDetails');
const Profile = require('../models/Profile');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Helper to get or create profile
const getProfile = async (userId) => {
    let profile = await Profile.findOne({ where: { user_id: userId } });
    if (!profile) {
        profile = await Profile.create({ user_id: userId });
    }
    return profile;
};

// Generic CRUD Generator for sub-tables
const createSubItem = (Model) => catchAsync(async (req, res, next) => {
    const profile = await getProfile(req.user.id);
    const item = await Model.create({ ...req.body, profile_id: profile.id });
    res.status(201).json({ status: 'success', data: { item } });
});

const updateSubItem = (Model) => catchAsync(async (req, res, next) => {
    const profile = await getProfile(req.user.id);
    const [count, [item]] = await Model.update(req.body, {
        where: { id: req.params.id, profile_id: profile.id },
        returning: true
    });
    if (!count) return next(new AppError('Item not found', 404));
    res.status(200).json({ status: 'success', data: { item } });
});

const deleteSubItem = (Model) => catchAsync(async (req, res, next) => {
    const profile = await getProfile(req.user.id);
    const deleted = await Model.destroy({ where: { id: req.params.id, profile_id: profile.id } });
    if (!deleted) return next(new AppError('Item not found', 404));
    res.status(204).json({ status: 'success', data: null });
});

// Experience
exports.addExperience = createSubItem(Experience);
exports.updateExperience = updateSubItem(Experience);
exports.deleteExperience = deleteSubItem(Experience);

// Education
exports.addEducation = createSubItem(Education);
exports.updateEducation = updateSubItem(Education);
exports.deleteEducation = deleteSubItem(Education);

// Skills
exports.addSkill = createSubItem(ProfileSkill);
exports.updateSkill = updateSubItem(ProfileSkill);
exports.deleteSkill = deleteSubItem(ProfileSkill);

// Projects
exports.addProject = createSubItem(Project);
exports.updateProject = updateSubItem(Project);
exports.deleteProject = deleteSubItem(Project);

// Trainings
exports.addTraining = createSubItem(Training);
exports.updateTraining = updateSubItem(Training);
exports.deleteTraining = deleteSubItem(Training);

// Social Links
exports.addSocialLink = createSubItem(SocialLink);
exports.updateSocialLink = updateSubItem(SocialLink);
exports.deleteSocialLink = deleteSubItem(SocialLink);
