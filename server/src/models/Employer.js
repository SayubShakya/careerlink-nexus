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
    organization_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    company_website: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            isUrl: true // Basic URL validation
        }
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
        allowNull: true
    }
}, {
    tableName: 'employeer_users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false // Following same pattern as JobSeeker
});

// Hooks
Employer.beforeCreate(async (user) => {
    if (user.password_hash) {
        user.password_hash = await bcrypt.hash(user.password_hash, 12);
    }
});

Employer.prototype.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Association
Employer.belongsTo(Role, { foreignKey: 'role_id' });

module.exports = Employer;
