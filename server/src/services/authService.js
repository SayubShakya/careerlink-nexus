const JobSeeker = require('../models/JobSeeker');
const Employer = require('../models/Employer');
const Role = require('../models/Role');
const AppError = require('../utils/AppError');

class AuthService {
    /**
     * Find a role by its name
     */
    async getRoleByName(name) {
        const role = await Role.findOne({ where: { name } });
        if (!role) {
            throw new AppError(`${name} role not found. Please sync roles.`, 500);
        }
        return role;
    }

    /**
     * Business logic for finding a user by email across both tables
     */
    async findUserByEmail(email) {
        // Check JobSeeker
        const jobSeeker = await JobSeeker.findOne({
            where: { email },
            include: [{ model: Role, attributes: ['name'] }]
        });
        if (jobSeeker) return { user: jobSeeker, role: jobSeeker.Role.name };

        // Check Employer
        const employer = await Employer.findOne({
            where: { email },
            include: [{ model: Role, attributes: ['name'] }]
        });
        if (employer) return { user: employer, role: employer.Role.name };

        return null;
    }

    /**
     * Business logic for creating a job seeker
     */
    async createJobSeeker(userData) {
        // Check if user exists in either table
        const existingUser = await this.findUserByEmail(userData.email);
        if (existingUser) {
            throw new AppError('Email already in use. Please use a different email or log in.', 400);
        }

        const role = await this.getRoleByName('job_seeker');

        return await JobSeeker.create({
            ...userData,
            password_hash: userData.password, // Hook handles hashing
            role_id: role.id
        });
    }

    /**
     * Business logic for creating an employer
     */
    async createEmployer(userData) {
        // Check if user exists in either table
        const existingUser = await this.findUserByEmail(userData.email);
        if (existingUser) {
            throw new AppError('Email already in use. Please use a different email or log in.', 400);
        }

        const role = await this.getRoleByName('employer');

        return await Employer.create({
            ...userData,
            password_hash: userData.password, // Hook handles hashing
            role_id: role.id
        });
    }

    /**
     * Verify password using the model's instance method
     */
    async verifyPassword(user, candidatePassword) {
        return await user.correctPassword(candidatePassword, user.password_hash);
    }
}

module.exports = new AuthService();
