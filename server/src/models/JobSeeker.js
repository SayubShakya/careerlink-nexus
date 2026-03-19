const md5 = require('md5');
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
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('profile_picture');
            if (rawValue) {
                // If it was already set to initials, convert it to avataaars
                if (typeof rawValue === 'string' && rawValue.includes('dicebear.com/9.x/initials')) {
                    return rawValue.replace('initials', 'avataaars');
                }
                return rawValue;
            }
            
            const email = this.getDataValue('email');
            if (!email) return null;
            const hash = md5(email.toLowerCase().trim());
            return `https://api.dicebear.com/9.x/avataaars/svg?seed=${hash}`;
        }
    }
}, {
    tableName: 'job_seeker_users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Hooks for password hashing and default avatar
JobSeeker.beforeCreate(async (user) => {
    if (user.password_hash) {
        user.password_hash = await bcrypt.hash(user.password_hash, 12);
    }
    
    // Set default avatar if not provided (stored in DB)
    if (!user.profile_picture) {
        const hash = md5(user.email.toLowerCase().trim());
        user.profile_picture = `https://api.dicebear.com/9.x/avataaars/svg?seed=${hash}`;
    }
});

JobSeeker.prototype.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Association
JobSeeker.belongsTo(Role, { foreignKey: 'role_id' });

module.exports = JobSeeker;
