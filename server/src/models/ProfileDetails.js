const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Profile = require('./Profile');

const Experience = sequelize.define('Experience', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    profile_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: Profile, key: 'id' }
    },
    company: { type: DataTypes.STRING(100), allowNull: false },
    title: { type: DataTypes.STRING(100), allowNull: false },
    duration: { type: DataTypes.STRING(100), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true }
}, { tableName: 'personal_experiences', timestamps: false });

const Education = sequelize.define('Education', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    profile_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: Profile, key: 'id' }
    },
    university: { type: DataTypes.STRING(255), allowNull: false },
    degree: { type: DataTypes.STRING(100), allowNull: false },
    gradYear: { type: DataTypes.STRING(50), allowNull: true }
}, { tableName: 'personal_education', timestamps: false });

const ProfileSkill = sequelize.define('ProfileSkill', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    profile_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: Profile, key: 'id' }
    },
    name: { type: DataTypes.STRING(100), allowNull: false },
    level: {
        type: DataTypes.INTEGER,
        defaultValue: 50
    }
}, { tableName: 'personal_skills', timestamps: false });

const Project = sequelize.define('Project', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    profile_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: Profile, key: 'id' }
    },
    project_title: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    link: { type: DataTypes.STRING(255), allowNull: true }
}, { tableName: 'personal_projects', timestamps: false });

const Training = sequelize.define('Training', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    profile_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: Profile, key: 'id' }
    },
    title: { type: DataTypes.STRING(255), allowNull: false },
    provider: { type: DataTypes.STRING(255), allowNull: true },
    completion_date: { type: DataTypes.DATEONLY, allowNull: true }
}, { tableName: 'personal_trainings', timestamps: false });

const SocialLink = sequelize.define('SocialLink', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    profile_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: Profile, key: 'id' }
    },
    platform_name: { type: DataTypes.STRING(50), allowNull: false },
    link_url: { type: DataTypes.TEXT, allowNull: false }
}, { tableName: 'personal_social_links', timestamps: true, createdAt: 'created_at', updatedAt: false });

const Language = sequelize.define('Language', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    profile_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: Profile, key: 'id' }
    },
    language_name: { type: DataTypes.STRING(100), allowNull: false },
    proficiency: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'Native' }
}, { tableName: 'user_languages', timestamps: false });

// Global Associations
Profile.hasMany(Experience, { foreignKey: 'profile_id', as: 'experiences' });
Profile.hasMany(Education, { foreignKey: 'profile_id', as: 'educations' });
Profile.hasMany(ProfileSkill, { foreignKey: 'profile_id', as: 'skills' });
Profile.hasMany(Project, { foreignKey: 'profile_id', as: 'projects' });
Profile.hasMany(Training, { foreignKey: 'profile_id', as: 'trainings' });
Profile.hasMany(SocialLink, { foreignKey: 'profile_id', as: 'social_links' });
Profile.hasMany(Language, { foreignKey: 'profile_id', as: 'languages' });

module.exports = { Experience, Education, ProfileSkill, Project, Training, SocialLink, Language };
