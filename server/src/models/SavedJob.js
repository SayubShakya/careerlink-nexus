const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const JobSeeker = require('./JobSeeker');
const JobListing = require('./JobListing');

const SavedJob = sequelize.define('SavedJob', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    seeker_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: JobSeeker,
            key: 'id'
        }
    },
    job_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: JobListing,
            key: 'id'
        }
    }
}, {
    tableName: 'saved_jobs',
    timestamps: true,
    createdAt: 'saved_at',
    updatedAt: false
});

// Associations
JobSeeker.hasMany(SavedJob, { foreignKey: 'seeker_id', onDelete: 'CASCADE' });
SavedJob.belongsTo(JobSeeker, { foreignKey: 'seeker_id' });

JobListing.hasMany(SavedJob, { foreignKey: 'job_id', onDelete: 'CASCADE' });
SavedJob.belongsTo(JobListing, { foreignKey: 'job_id' });

module.exports = SavedJob;
