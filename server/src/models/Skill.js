const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Skill = sequelize.define('Skill', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'skills_library',
    timestamps: false
});

module.exports = Skill;
