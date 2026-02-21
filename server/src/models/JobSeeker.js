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
    first_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    last_name: {
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
    updatedAt: false // Schema says only created_at? Checking SCHEMA.md again... actually it says created_at DEFAULT NOW. Usually good to have updated_at too, but I'll follow SCHEMA exactly if it omits it? Wait, SCHEMA.md usually implies standard timestamps. I'll check schema again.
    // SCHEMA.md for Job Seeker Users Table: created_at DEFAULT NOW(). Doesn't mention updated_at explicitly unlike Roles table.
    // I will include updated_at for best practice as Sequelize expects it by default, or disable it.
    // Let's stick to default timestamps=true (adds both). The schema might just be minimal.
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
