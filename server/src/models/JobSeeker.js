const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Role = require('./Role');
const bcrypt = require('bcryptjs');

const JobSeeker = sequelize.define('JobSeeker', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password_hash: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    role_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Role,
            key: 'id'
        }
    },
    profile_picture: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'job_seeker_users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Hooks for password hashing
JobSeeker.beforeCreate(async (user) => {
    if (user.password_hash) {
        user.password_hash = await bcrypt.hash(user.password_hash, 12);
    }
});

JobSeeker.prototype.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Association
JobSeeker.belongsTo(Role, { foreignKey: 'role_id' });

module.exports = JobSeeker;
