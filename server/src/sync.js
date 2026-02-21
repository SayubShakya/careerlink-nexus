const sequelize = require('./config/sequelize');
const Role = require('./models/Role');
const JobSeeker = require('./models/JobSeeker');
const Employer = require('./models/Employer');
const Resume = require('./models/Resume');
const JobListing = require('./models/JobListing');
const Application = require('./models/Application');
const SavedJob = require('./models/SavedJob');
const Notification = require('./models/Notification');
const Category = require('./models/Category');
const Skill = require('./models/Skill');
const Profile = require('./models/Profile');
const { Experience, Education, ProfileSkill, Project, Training, SocialLink } = require('./models/ProfileDetails');

const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connection has been established successfully.');
        console.log('✅ Connected to database.');

        // Drop View before syncing to avoid dependency errors
        await sequelize.query('DROP VIEW IF EXISTS job_seeker_full_profile_view CASCADE');

        // Sync models (Order matters for foreign keys)
        await Role.sync({ alter: true });
        await JobSeeker.sync({ alter: true });
        await Employer.sync({ alter: true });
        await JobListing.sync({ alter: true });

        // Profile Ecosystem
        await Profile.sync({ alter: true });
        await Experience.sync({ alter: true });
        await Education.sync({ alter: true });
        await ProfileSkill.sync({ alter: true });
        await Project.sync({ alter: true });
        await Training.sync({ alter: true });
        await SocialLink.sync({ alter: true });

        await Resume.sync({ alter: true });
        await Application.sync({ alter: true });
        await SavedJob.sync({ alter: true });
        await Notification.sync({ alter: true });
        await Category.sync({ alter: true });
        await Skill.sync({ alter: true });

        // CREATE SQL VIEW for S4-14 (CV Dynamic Builder)
        await sequelize.query(`
            CREATE OR REPLACE VIEW job_seeker_full_profile_view AS
            SELECT 
                p.id AS profile_id,
                p.user_id,
                u."firstName",
                u."lastName",
                u.email,
                u.profile_picture,
                p.headline,
                p.summary,
                p.phone,
                p.location,
                (SELECT COALESCE(json_agg(exp), '[]'::json) FROM personal_experiences exp WHERE exp.profile_id = p.id) as experience,
                (SELECT COALESCE(json_agg(edu), '[]'::json) FROM personal_education edu WHERE edu.profile_id = p.id) as education,
                (SELECT COALESCE(json_agg(sk), '[]'::json) FROM personal_skills sk WHERE sk.profile_id = p.id) as skills,
                (SELECT COALESCE(json_agg(proj), '[]'::json) FROM personal_projects proj WHERE proj.profile_id = p.id) as projects,
                (SELECT COALESCE(json_agg(trn), '[]'::json) FROM personal_trainings trn WHERE trn.profile_id = p.id) as training,
                (SELECT COALESCE(json_agg(sl), '[]'::json) FROM personal_social_links sl WHERE sl.profile_id = p.id) as social_links
            FROM profiles p
            JOIN job_seeker_users u ON p.user_id = u.id;
        `);

        console.log('✅ All tables and views synced successfully.');

        // Rename 'employeer' to 'employer' if exists
        const oldRole = await Role.findOne({ where: { name: 'employeer' } });
        if (oldRole) {
            oldRole.name = 'employer';
            await oldRole.save();
            console.log('✅ Renamed role "employeer" to "employer".');
        }

        // Seed roles if not exist
        const count = await Role.count();
        if (count === 0) {
            await Role.bulkCreate([
                { name: 'job_seeker' },
                { name: 'employer' },
                { name: 'admin' }
            ]);
            console.log('✅ Default roles seeded.');
        }

    } catch (error) {
        console.error('❌ Database sync failed:', error);
    } finally {
        // Close connection if standalone script, but usually keep open for server
        // await sequelize.close(); 
    }
};

if (require.main === module) {
    syncDatabase();
}

module.exports = syncDatabase;
