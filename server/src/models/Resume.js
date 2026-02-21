const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Profile = require('./Profile');

const Resume = sequelize.define('Resume', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    profile_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Profile,
            key: 'id'
        }
    },
    resume_url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'resumes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Associations
Profile.hasMany(Resume, { foreignKey: 'profile_id', onDelete: 'CASCADE' });
Resume.belongsTo(Profile, { foreignKey: 'profile_id' });

module.exports = Resume;
