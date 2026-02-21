const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const JobSeeker = require('./JobSeeker');
const CV = require('./CV');
const JobListing = require('./JobListing');

const Application = sequelize.define('Application', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    job_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: JobListing,
            key: 'id'
        }
    },
    job_seeker_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: JobSeeker,
            key: 'id'
        }
    },
    application_method: {
        type: DataTypes.ENUM('platform_cv', 'pdf_resume', 'both'),
        allowNull: false,
        defaultValue: 'platform_cv'
    },
    cv_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: CV,
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('applied', 'reviewed', 'shortlisted', 'interview_scheduled', 'rejected', 'hired'),
        defaultValue: 'applied'
    },
    cover_letter: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'applications',
    timestamps: true,
    createdAt: 'applied_at',
    updatedAt: 'updated_at'
});

// Associations
JobSeeker.hasMany(Application, { foreignKey: 'job_seeker_id' });
Application.belongsTo(JobSeeker, { foreignKey: 'job_seeker_id' });

CV.hasMany(Application, { foreignKey: 'cv_id' });
Application.belongsTo(CV, { foreignKey: 'cv_id' });

JobListing.hasMany(Application, { foreignKey: 'job_id', onDelete: 'CASCADE' });
Application.belongsTo(JobListing, { foreignKey: 'job_id' });

module.exports = Application;
