const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isIn: [['job_seeker', 'employer', 'admin']] // Ensure only valid role names
        }
    }
}, {
    tableName: 'roles',
    timestamps: true, // Adds created_at and updated_at automatically
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Role;
