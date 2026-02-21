const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Employer = require('./Employer');

const JobListing = sequelize.define('JobListing', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    employer_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Employer,
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    responsibilities: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    qualifications: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    specification: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    skills: {
        type: DataTypes.JSON, // Array of strings from skills state
        allowNull: true
    },
    location: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    salary: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    jobType: {
        type: DataTypes.ENUM('Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'),
        allowNull: false,
        defaultValue: 'Full-time'
    },
    education: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    vacancy: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: true
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'job_listings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Associations
Employer.hasMany(JobListing, { foreignKey: 'employer_id', onDelete: 'CASCADE' });
JobListing.belongsTo(Employer, { foreignKey: 'employer_id' });

module.exports = JobListing;
