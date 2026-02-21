const JobListing = require('./src/models/JobListing');
const Employer = require('./src/models/Employer');
const Role = require('./src/models/Role');
const Category = require('./src/models/Category');
const Skill = require('./src/models/Skill');
const JobSeeker = require('./src/models/JobSeeker');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

async function seedData() {
    try {
        console.log('🌱 Starting seed process...');

        // 1. Ensure Roles exist
        const [roles] = await Promise.all([
            Role.findOrCreate({ where: { name: 'employer' } }),
            Role.findOrCreate({ where: { name: 'job_seeker' } }),
            Role.findOrCreate({ where: { name: 'admin' } })
        ]);
        const employerRole = await Role.findOne({ where: { name: 'employer' } });
        const jobSeekerRole = await Role.findOne({ where: { name: 'job_seeker' } });

        // 2. Create/Find an Employer
        const passwordHash = await bcrypt.hash('password123', 12);
        const [employer] = await Employer.findOrCreate({
            where: { email: 'hr@technexus.com' },
            defaults: {
                id: uuidv4(),
                companyName: 'Tech Nexus Solutions',
                companyWebsite: 'https://technexus.com',
                industry: 'Information Technology',
                description: 'A leading tech firm in the Nexus ecosystem.',
                location: 'Kathmandu, Nepal',
                password_hash: passwordHash,
                role_id: employerRole.id,
                is_verified: true
            }
        });

        // 3. Create/Find a Job Seeker
        const [jobSeeker] = await JobSeeker.findOrCreate({
            where: { email: 'alice@example.com' },
            defaults: {
                id: uuidv4(),
                firstName: 'Alice',
                lastName: 'Smith',
                password_hash: passwordHash,
                role_id: jobSeekerRole.id
            }
        });

        // 4. Seed Categories
        const categories = ['Engineering', 'Marketing', 'Design', 'Sales', 'Customer Support'];
        for (const cat of categories) {
            await Category.findOrCreate({ where: { name: cat } });
        }

        // 5. Seed Skills
        const skillsList = ['React.js', 'Node.js', 'PostgreSQL', 'UI/UX Design', 'Project Management'];
        for (const sk of skillsList) {
            await Skill.findOrCreate({ where: { name: sk } });
        }

        // 6. Seed 5 Job Descriptions
        const jobs = [
            {
                title: 'Senior Frontend Developer',
                description: 'We are looking for a React expert to lead our frontend team.',
                responsibilities: 'Build scalable React components, Optimize web performance, Mentor junior developers',
                qualifications: '5+ years of React experience, CS Degree, Proficiency in TypeScript',
                skills: ['React.js', 'CSS3', 'TypeScript'],
                location: 'Remote',
                salary: '$80,000 - $120,000',
                jobType: 'Full-time',
                education: "Bachelor's Degree",
                vacancy: 2,
                deadline: '2026-05-01',
                is_active: true
            },
            {
                title: 'Backend Node.js Engineer',
                description: 'Help us scale our microservices architecture using Node.js and Postgres.',
                responsibilities: 'Design RESTful APIs, Optimize database queries, Implement security protocols',
                qualifications: '3+ years Node.js experience, Knowledge of Sequelize/ORM, Experience with Docker',
                skills: ['Node.js', 'PostgreSQL', 'Docker'],
                location: 'Kathmandu, Nepal',
                salary: '$60,000 - $90,000',
                jobType: 'Full-time',
                education: "Bachelor's Degree",
                vacancy: 3,
                deadline: '2026-04-15',
                is_active: true
            },
            {
                title: 'UI/UX Product Designer',
                description: 'Create stunning user experiences for our next-gen job portal.',
                responsibilities: 'Design wireframes, Conduct user research, Create high-fidelity prototypes',
                qualifications: 'Proven portfolio, Figma mastery, Experience in Agile teams',
                skills: ['Figma', 'UI/UX', 'Prototyping'],
                location: 'Hybrid',
                salary: '$50,000 - $75,000',
                jobType: 'Part-time',
                education: 'Diploma or Degree in Design',
                vacancy: 1,
                deadline: '2026-03-30',
                is_active: true
            },
            {
                title: 'Full Stack Web Developer',
                description: 'Join our startup to build features end-to-end.',
                responsibilities: 'Handle both React and Node.js tasks, Deploy to AWS, Participate in code reviews',
                qualifications: '2+ years Full Stack experience, Willingness to learn, Great communication skills',
                skills: ['React.js', 'Node.js', 'AWS'],
                location: 'Remote',
                salary: '$70,000 - $100,000',
                jobType: 'Full-time',
                education: 'Any technical degree',
                vacancy: 2,
                deadline: '2026-06-20',
                is_active: true
            },
            {
                title: 'Quality Assurance (QA) Engineer',
                description: 'Ensure our platform remains bug-free and performant.',
                responsibilities: 'Write automated test scripts, Perform manual testing, Track bugs in Jira',
                qualifications: 'Experience with Selenium/Playwright, Strong attention to detail, Knowledge of SDLC',
                skills: ['Playwright', 'Manual Testing', 'Jira'],
                location: 'On-site',
                salary: '$40,000 - $60,000',
                jobType: 'Contract',
                education: 'BSc in Computer Science',
                vacancy: 1,
                deadline: '2026-04-01',
                is_active: true
            }
        ];

        for (const job of jobs) {
            await JobListing.findOrCreate({
                where: { title: job.title, employer_id: employer.id },
                defaults: {
                    ...job,
                    id: uuidv4(),
                    employer_id: employer.id
                }
            });
        }

        console.log('✅ Seeding complete! 5 Jobs, 5 Categories, and 5 Skills added.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedData();
