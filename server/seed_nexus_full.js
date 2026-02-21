const JobListing = require('./src/models/JobListing');
const Employer = require('./src/models/Employer');
const Role = require('./src/models/Role');
const Category = require('./src/models/Category');
const Skill = require('./src/models/Skill');
const JobSeeker = require('./src/models/JobSeeker');
const Profile = require('./src/models/Profile');
const CV = require('./src/models/CV');
const Application = require('./src/models/Application');
const Notification = require('./src/models/Notification');
const SavedJob = require('./src/models/SavedJob');
const Resume = require('./src/models/Resume');
const { Experience, Education, ProfileSkill, Project, Training, SocialLink } = require('./src/models/ProfileDetails');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

async function seedData() {
    try {
        console.log('🌱 Starting Comprehensive Nexus Seeding...');

        // 1. Roles
        const [roles] = await Promise.all([
            Role.findOrCreate({ where: { name: 'employer' } }),
            Role.findOrCreate({ where: { name: 'job_seeker' } }),
            Role.findOrCreate({ where: { name: 'admin' } })
        ]);
        const employerRole = await Role.findOne({ where: { name: 'employer' } });
        const jobSeekerRole = await Role.findOne({ where: { name: 'job_seeker' } });

        // 2. Employer
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

        // 3. Job Seeker
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

        // 4. Profiles & Details
        const [profile] = await Profile.findOrCreate({
            where: { user_id: jobSeeker.id },
            defaults: {
                id: uuidv4(),
                user_id: jobSeeker.id,
                summary: 'Passionate frontend developer with 5 years of experience in React.',
                headline: 'Senior Frontend Developer',
                phone: '+977-9800000000',
                location: 'Kathmandu, Nepal'
            }
        });

        await Experience.findOrCreate({
            where: { profile_id: profile.id, company: 'Google' },
            defaults: { id: uuidv4(), profile_id: profile.id, company: 'Google', title: 'Senior Software Engineer', duration: '2020 - Present', description: 'Working on search UI.' }
        });

        await Education.findOrCreate({
            where: { profile_id: profile.id, university: 'MIT' },
            defaults: { id: uuidv4(), profile_id: profile.id, university: 'MIT', degree: 'BS Computer Science', gradYear: '2019' }
        });

        await ProfileSkill.findOrCreate({
            where: { profile_id: profile.id, name: 'React' },
            defaults: { id: uuidv4(), profile_id: profile.id, name: 'React', level: 90 }
        });

        await Project.findOrCreate({
            where: { profile_id: profile.id, project_title: 'Nexus Hub' },
            defaults: { id: uuidv4(), profile_id: profile.id, project_title: 'Nexus Hub', description: 'A job portal for the futuristic era.', link: 'https://nexushub.com' }
        });

        await Training.findOrCreate({
            where: { profile_id: profile.id, title: 'AWS Cloud Architect' },
            defaults: { id: uuidv4(), profile_id: profile.id, title: 'AWS Cloud Architect', provider: 'Amazon', completion_date: '2023-01-01' }
        });

        await SocialLink.findOrCreate({
            where: { profile_id: profile.id, platform_name: 'LinkedIn' },
            defaults: { id: uuidv4(), profile_id: profile.id, platform_name: 'LinkedIn', link_url: 'https://linkedin.com/in/alice' }
        });

        await Resume.findOrCreate({
            where: { profile_id: profile.id },
            defaults: { id: uuidv4(), profile_id: profile.id, resume_url: '/uploads/resumes/sample-resume.pdf', is_default: true }
        });

        // 5. CV Storage
        const [cv] = await CV.findOrCreate({
            where: { user_id: jobSeeker.id, title: 'Master Resume 2026' },
            defaults: {
                id: uuidv4(),
                user_id: jobSeeker.id,
                title: 'Master Resume 2026',
                description: 'General resume for web development roles.',
                type: 'platform',
                content: {
                    experience: '5 years at Google',
                    education: 'MIT BSCS',
                    skills: ['React', 'Node', 'AWS']
                },
                is_primary: true
            }
        });

        // 6. Categories & Skills
        const categories = ['Engineering', 'Marketing', 'Design', 'Sales', 'Customer Support'];
        for (const cat of categories) {
            await Category.findOrCreate({ where: { name: cat } });
        }
        const skillsList = ['React.js', 'Node.js', 'PostgreSQL', 'UI/UX Design', 'Project Management'];
        for (const sk of skillsList) {
            await Skill.findOrCreate({ where: { name: sk } });
        }

        // 7. 5 Job Listings
        const jobData = [
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

        const createdJobs = [];
        for (const job of jobData) {
            const [createdJob] = await JobListing.findOrCreate({
                where: { title: job.title, employer_id: employer.id },
                defaults: {
                    ...job,
                    id: uuidv4(),
                    employer_id: employer.id
                }
            });
            createdJobs.push(createdJob);
        }

        // 8. Application
        await Application.findOrCreate({
            where: { job_id: createdJobs[0].id, job_seeker_id: jobSeeker.id },
            defaults: {
                id: uuidv4(),
                job_id: createdJobs[0].id,
                job_seeker_id: jobSeeker.id,
                cv_id: cv.id,
                application_method: 'platform_cv',
                status: 'applied',
                cover_letter: 'I am highly interested in the Senior Frontend role at Tech Nexus!'
            }
        });

        // 9. Saved Job
        await SavedJob.findOrCreate({
            where: { seeker_id: jobSeeker.id, job_id: createdJobs[1].id },
            defaults: {
                id: uuidv4(),
                seeker_id: jobSeeker.id,
                job_id: createdJobs[1].id
            }
        });

        // 10. Notification
        await Notification.findOrCreate({
            where: { user_id: jobSeeker.id, message: 'Welcome to CareerLink Nexus!' },
            defaults: {
                id: uuidv4(),
                user_id: jobSeeker.id,
                user_type: 'job_seeker',
                title: 'Welcome!',
                message: 'Welcome to CareerLink Nexus! Start applying to your dream jobs today.',
                is_read: false
            }
        });

        console.log('✅ COMPLETE: All Nexus sections seeded successfully with zero nulls.');
        process.exit(0);
    } catch (error) {
        console.error('❌ SEEDING ERROR:', error);
        process.exit(1);
    }
}

seedData();
