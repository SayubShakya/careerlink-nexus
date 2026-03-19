const md5 = require('md5');
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Role = require('./Role');
const bcrypt = require('bcryptjs');

const Employer = sequelize.define('Employer', {
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
    companyName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    companyWebsite: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
            isUrl: true
        }
    },
    industry: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    contact_person: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    state: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    zip_code: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    country: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
    tableName: 'employer_users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Hooks
Employer.beforeCreate(async (user) => {
    if (user.password_hash) {
        user.password_hash = await bcrypt.hash(user.password_hash, 12);
    }

    // Set default avatar if not provided (stored in DB)
    if (!user.profile_picture) {
        const hash = md5(user.email.toLowerCase().trim());
        user.profile_picture = `https://api.dicebear.com/9.x/avataaars/svg?seed=${hash}`;
    }
});

Employer.prototype.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Association
Employer.belongsTo(Role, { foreignKey: 'role_id' });

module.exports = Employer;
