const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const JobSeeker = require('./JobSeeker');

const CV = sequelize.define('CV', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: JobSeeker,
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    type: {
        type: DataTypes.ENUM('platform', 'uploaded'),
        allowNull: false,
        defaultValue: 'platform'
    },
    file_path: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Path to the file on server for uploaded CVs'
    },
    content: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'JSON content for platform-generated CVs'
    },
    is_primary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'cv_storage',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Associations
JobSeeker.hasMany(CV, { foreignKey: 'user_id', onDelete: 'CASCADE' });
CV.belongsTo(JobSeeker, { foreignKey: 'user_id' });

// Virtual property for download path
CV.prototype.toJSON = function () {
    const values = { ...this.get() };
    const apiBase = process.env.VITE_API_BASE_URL || '/api';
    values.cv_path = `${apiBase}/cvs/${values.id}/download`;
    return values;
};

module.exports = CV;
