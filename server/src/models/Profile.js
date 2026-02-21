const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const JobSeeker = require('./JobSeeker');

const Profile = sequelize.define('Profile', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: {
            model: JobSeeker,
            key: 'id'
        }
    },
    headline: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    summary: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    location: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
}, {
    tableName: 'profiles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Associations
JobSeeker.hasOne(Profile, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Profile.belongsTo(JobSeeker, { foreignKey: 'user_id' });

module.exports = Profile;
