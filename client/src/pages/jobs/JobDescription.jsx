import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
    MapPin,
    Briefcase,
    DollarSign,
    Clock,
    Calendar,
    CheckCircle,
    ArrowLeft,
    Share2,
    Building2,
    BookOpen,
    GraduationCap,
    Users,
    X,
    Upload,
    FileText,
    Loader2,
    Check,
    SearchCheck
} from 'lucide-react';
import { useGetCVs, usePostUploadCV } from '@/hooks/api/cv/useCVs';
import { useGetJobDetails } from '@/hooks/api/jobs/useJobs';
import { usePostApplyJob } from '@/hooks/api/jobs/usePostApplyJob';
import { useAuth } from '@/hooks/useAuth';

const JobDescription = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleJobClick = (jobId) => {
        navigate(isAuthenticated() ? `/jobseeker/jobs/${jobId}` : `/jobs/${jobId}`);
    };
    const isLoggedIn = isAuthenticated();
    const [searchParams] = useSearchParams();
    const statusParam = searchParams.get('status');

    // The status is passed via URL if navigating from the Dashboard
    const STATIC_APPLIED_STATUS = statusParam;

    // Application Modal State
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [selectedCvId, setSelectedCvId] = useState(null);
    const [uploadFile, setUploadFile] = useState(null);
    const [applyMethod, setApplyMethod] = useState('select'); // 'select' | 'upload'
    const fileInputRef = useRef(null);


    const { data: serverJobData, isLoading: jobLoading } = useGetJobDetails(id);
    const { data: userCVs = [], isLoading: isLoadingCVs } = useGetCVs({ enabled: isLoggedIn });
    const { mutate: uploadCV } = usePostUploadCV();
    const { mutate: applyJob, isPending: isSubmitting } = usePostApplyJob();

    const MOCK_JOBS_LIST = [
        {
            id: 1, company: 'Google', title: 'Senior UX Designer', location: 'Mountain View, CA', salary: '$180k', type: 'Full-time', logo: 'G', deadline: '2026-04-15', posted: 'Feb 15, 2026', views: 1240, vacancy: 2, experience: '5+ years', education: 'Bachelor in Design or HCI',
            description: 'We are seeking a Senior UX Designer to lead the design of next-generation products. You will collaborate with cross-functional teams to define and implement innovative solutions for product direction, visuals, and experience.',
            responsibilities: ['Lead end-to-end design for core products', 'Conduct user research and usability testing', 'Create wireframes, prototypes, and high-fidelity mockups', 'Collaborate with engineering and product teams'],
            requirements: ['5+ years UX design experience', 'Proficiency in Figma and design systems', 'Strong portfolio demonstrating user-centered design'],
            skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Accessibility'], aboutOrg: 'Google is a global leader in technology.'
        },
        {
            id: 2, company: 'Meta', title: 'Product Manager', location: 'Menlo Park, CA', salary: '$175k', type: 'Hybrid', logo: 'M', deadline: '2026-04-10', posted: 'Feb 22, 2026', views: 2300, vacancy: 2, experience: '5+ years', education: 'MBA or equivalent experience',
            description: 'Drive the roadmap for Apple\'s next-generation products. You will work with design, engineering, and marketing to define product vision and deliver exceptional user experiences.',
            responsibilities: ['Define product strategy and roadmap', 'Gather and prioritize requirements', 'Coordinate cross-functional launches', 'Analyze market trends and user analytics'],
            requirements: ['5+ years product management', 'Technical background preferred', 'Excellent stakeholder management skills'],
            skills: ['Product Strategy', 'Agile', 'Data Analysis', 'Stakeholder Mgmt', 'Market Research'], aboutOrg: 'Meta builds technologies that help people connect.'
        },
        {
            id: 3, company: 'Amazon', title: 'Staff Software Engineer', location: 'Seattle, WA', salary: '$210k', type: 'Full-time', logo: 'A', deadline: '2026-05-01', posted: 'Feb 18, 2026', views: 890, vacancy: 3, experience: '8+ years', education: 'MS/PhD in Computer Science preferred',
            description: 'Join Amazon\'s core infrastructure team to build highly scalable distributed systems. You will architect and implement systems that handle massive throughput.',
            responsibilities: ['Design and implement distributed backend services', 'Mentor junior engineers and lead code reviews', 'Optimize systems for performance and reliability', 'Drive technical strategy for the team'],
            requirements: ['8+ years software engineering experience', 'Expert in C++, Python, or Java', 'Experience building large-scale distributed systems'],
            skills: ['C++', 'Python', 'Distributed Systems', 'System Design', 'Leadership'], aboutOrg: 'Amazon is a global leader in e-commerce and cloud computing.'
        },
        {
            id: 4, company: 'Microsoft', title: 'Cloud Architect', location: 'Remote', salary: '$165k', type: 'Remote', logo: 'M', deadline: '2026-04-25', posted: 'Feb 12, 2026', views: 640, vacancy: 8, experience: '3+ years', education: 'Bachelor in IT or Engineering',
            description: 'Help enterprise customers migrate to and optimize their Azure cloud environments. Provide architectural guidance and hands-on implementation support.',
            responsibilities: ['Assess customer cloud maturity', 'Design Azure migration strategies', 'Implement cloud solutions hands-on', 'Deliver training and enablement sessions'],
            requirements: ['3+ years Azure cloud experience', 'Azure certifications (AZ-104, AZ-305)', 'Consulting or customer-facing experience'],
            skills: ['Azure', 'Cloud Migration', 'PowerShell', 'ARM Templates', 'DevOps'], aboutOrg: 'Microsoft enables digital transformation for the era of an intelligent cloud.'
        },
        {
            id: 5, company: 'NVIDIA', title: 'AI Researcher', location: 'Santa Clara, CA', salary: '$230k', type: 'Full-time', logo: 'N', deadline: '2026-05-15', posted: 'Feb 25, 2026', views: 1560, vacancy: 4, experience: 'PhD required', education: 'PhD in Computer Science or AI',
            description: 'Join NVIDIA Research to push the boundaries of AI/ML. Publish at top venues and develop algorithms that power the next generation of GPU-accelerated computing.',
            responsibilities: ['Conduct cutting-edge ML research', 'Publish at top-tier conferences', 'Develop prototype AI models', 'Collaborate with hardware and software teams'],
            requirements: ['PhD in ML, AI, or related field', 'Strong publication record', 'Proficiency in PyTorch or TensorFlow'],
            skills: ['PyTorch', 'Deep Learning', 'CUDA', 'Computer Vision', 'NLP'], aboutOrg: 'NVIDIA is the pioneer of GPU-accelerated computing.'
        },
        {
            id: 6, company: 'Netflix', title: 'Full Stack Engineer', location: 'Los Gatos, CA', salary: '$220k', type: 'Full-time', logo: 'N', deadline: '2026-03-30', posted: 'Feb 10, 2026', views: 750, vacancy: 1, experience: '5+ years', education: 'Bachelor in CS or related field',
            description: 'Netflix is looking for a Systems Engineer to optimize our content delivery network. You will work on systems that stream content to 250M+ subscribers worldwide.',
            responsibilities: ['Manage and optimize CDN infrastructure', 'Automate deployment and monitoring', 'Troubleshoot complex production issues', 'Collaborate with content delivery partners'],
            requirements: ['5+ years systems engineering', 'Deep Linux and networking knowledge', 'Experience with CDN or large-scale distributed systems'],
            skills: ['Linux', 'Networking', 'Python', 'CDN', 'Automation'], aboutOrg: 'Netflix is the world\'s leading streaming entertainment service.'
        },
        {
            id: 7, company: 'Apple', title: 'Systems Architect', location: 'Cupertino, CA', salary: '$190k', type: 'Full-time', logo: 'A', deadline: '2026-04-20', posted: 'Feb 20, 2026', views: 1100, vacancy: 5, experience: '5+ years', education: 'Bachelor in CS or Engineering',
            description: 'As a Solutions Architect at AWS, you will help enterprise customers design and build cloud-based solutions. You will be the trusted technical advisor ensuring best practices.',
            responsibilities: ['Design cloud architecture for enterprise clients', 'Conduct technical workshops and presentations', 'Build proof-of-concept solutions', 'Collaborate with sales and engineering teams'],
            requirements: ['5+ years in cloud architecture', 'AWS certifications preferred', 'Strong communication and presentation skills'],
            skills: ['AWS', 'Cloud Architecture', 'Terraform', 'Kubernetes', 'Networking'], aboutOrg: 'Apple transforms the industry with its innovative products.'
        }
    ];

    // Fallback static data if no match found
    const FALLBACK_JOB = {
        title: "Montessori Teacher",
        company: "International Pre-School",
        location: "Chandol, Kathmandu",
        salary: "Not Disclosed",
        type: "Full-time",
        posted: "Feb 13, 2026",
        deadline: "Feb 27, 2026",
        views: 130,
        vacancy: 1,
        experience: "More than 2 years",
        education: "Under Graduate (Bachelor)",
        logo: "A",
        description: `Looking a Montessori Teacher for our a well-established International Pre-school in Kathmandu.`,
        responsibilities: ["Teach and guide toddlers using Montessori principles"],
        requirements: ["Bachelor’s degree in Early Childhood Education"],
        skills: ["Counseling", "Teaching"],
        aboutOrg: "An International Pre-School fostering balance, connection, adventure and knowledge."
    };

    // Determine which job to show
    const getJobData = () => {
        if (serverJobData) return serverJobData;
        const mockMatch = MOCK_JOBS_LIST.find(j => j.id.toString() === id);
        return mockMatch || FALLBACK_JOB;
    };

    const jobData = getJobData();
    console.log(serverJobData, "serverJobData")

    const handleApplyClick = () => {
        if (!isLoggedIn) {
            navigate('/login', { state: { message: "Please login to apply for this job." } });
        } else {
            setIsApplyModalOpen(true);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadFile(file);
            setApplyMethod('upload');
        }
    };

    const handleSubmitApplication = async () => {
        if (applyMethod === 'upload' && !uploadFile) {
            toast.error("Please upload a CV file.");
            return;
        }
        if (applyMethod === 'select' && !selectedCvId) {
            toast.error("Please select a CV.");
            return;
        }

        try {
            let finalCvId = selectedCvId;

            if (applyMethod === 'upload') {
                const formData = new FormData();
                formData.append('file', uploadFile);
                formData.append('title', uploadFile.name);

                uploadCV(formData, {
                    onSuccess: (uploadedCv) => {
                        const newCvId = uploadedCv.id || uploadedCv.data?.id;
                        applyJob({ jobId: id, cvId: newCvId }, {
                            onSuccess: () => setIsApplyModalOpen(false)
                        });
                    }
                });
            } else {
                applyJob({ jobId: id, cvId: finalCvId }, {
                    onSuccess: () => setIsApplyModalOpen(false)
                });
            }
        } catch (error) {
            console.error("Application Error:", error);
        }
    };


    return (
        <div className="job-description-container">
            <div className="job-content-wrapper">
                {/* Back Button */}
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={20} /> Back to Jobs
                </button>

                {/* Header Section */}
                <div className="job-header-card">
                    <div className="header-main">
                        <div className="company-logo-large">{jobData.logo}</div>
                        <div className="header-info">
                            <h1 className="job-title-large">{jobData.title}</h1>
                            <div className="company-meta">
                                <span className="company-name">
                                    <Building2 size={16} /> {jobData.company}
                                </span>
                                <span className="meta-separator">|</span>
                                <span className="meta-detail">
                                    <MapPin size={14} /> {jobData.location}
                                </span>
                                <span className="meta-separator">|</span>
                                <span className="meta-detail">
                                    <Users size={14} /> Vacancy: {jobData.vacancy}
                                </span>
                            </div>

                            <div className="job-stats-row">
                                <span className="view-count">Views: {jobData.views}</span>
                                <span className="dot-sep">•</span>
                                <span className="publish-date">Published on: {jobData.posted}</span>
                            </div>
                        </div>

                        <div className="header-actions">
                            <button className="share-btn" title="Share">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="job-tags-row">
                        <div className="tag-item">
                            <Briefcase size={16} /> {jobData.type}
                        </div>
                        <div className="tag-item">
                            <Clock size={16} /> Experience: {jobData.experience}
                        </div>
                        <div className="tag-item">
                            <DollarSign size={16} /> {jobData.salary}
                        </div>
                        <div className="tag-item">
                            <GraduationCap size={16} /> {jobData.education}
                        </div>
                    </div>
                </div>

                <div className="job-body-grid">
                    {/* Main Content */}
                    <div className="job-details-col">
                        <section className="detail-section">
                            <h3 className="section-title-main">Job Description</h3>
                            <p className="description-text">{jobData.description}</p>
                        </section>

                        <section className="detail-section">
                            <h3 className="section-title-sub">Key Responsibilities:</h3>
                            <ul className="custom-list">
                                {jobData?.responsibilities?.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        <section className="detail-section">
                            <h3 className="section-title-sub">Required Qualifications & Skills:</h3>
                            <ul className="custom-list">
                                {jobData?.requirements?.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        <div className="divider-line"></div>

                        <section className="detail-section spec-section">
                            <h3 className="section-title-main">Job Specification</h3>
                            <div className="spec-grid">
                                <div className="spec-row">
                                    <span className="spec-label">Required Education Level :</span>
                                    <span className="spec-value">{jobData.education}</span>
                                </div>
                                <div className="spec-row">
                                    <span className="spec-label">Required Experience :</span>
                                    <span className="spec-value">{jobData.experience}</span>
                                </div>
                            </div>
                        </section>

                        <div className="divider-line"></div>

                        <section className="detail-section">
                            <h3 className="section-title-main">Skills Required</h3>
                            <div className="skills-cloud">
                                {jobData?.skills?.map((skill, i) => (
                                    <span key={i} className="skill-pill">{skill}</span>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="job-sidebar-col">
                        {/* Applying Procedure Card */}
                        <div className="sidebar-card highlight-card">
                            <h3>Applying Procedure</h3>
                            <p className="apply-note">
                                Click on <strong>{isLoggedIn ? 'Apply' : 'Login to Apply'}</strong> and apply to this job via your jobseeker profile with easy apply process.
                            </p>
                            {isLoggedIn && STATIC_APPLIED_STATUS ? (
                                <div className={`status-badge-premium ${STATIC_APPLIED_STATUS.toLowerCase()}`}>
                                    Status: {STATIC_APPLIED_STATUS}
                                </div>
                            ) : (
                                <button
                                    className={`sidebar-action-btn ${isLoggedIn ? 'btn-apply' : 'btn-login'}`}
                                    onClick={handleApplyClick}
                                >
                                    {isLoggedIn ? 'Apply Now' : 'Login to Apply'}
                                </button>
                            )}

                            <div className="deadline-text">
                                Apply Before: <span className="text-danger">{jobData.deadline}</span>
                            </div>
                        </div>

                        {/* Organization Card */}
                        <div className="sidebar-card">
                            <h3>About the Organization</h3>
                            <div className="org-profile-mini">
                                <div className="org-logo-mini">{jobData.logo}</div>
                                <div className="org-name-mini">{jobData.company}</div>
                            </div>
                            <p className="org-desc">
                                {jobData.aboutOrg}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Modal */}
            {isApplyModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Apply for {jobData.title}</h2>
                            <button onClick={() => setIsApplyModalOpen(false)} className="close-btn">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <p className="modal-desc">Select a CV to attach to your application.</p>

                            <div className="apply-options">
                                {/* Option 1: Select Existing */}
                                <div
                                    className={`apply-option-card ${applyMethod === 'select' ? 'active' : ''}`}
                                    onClick={() => setApplyMethod('select')}
                                >
                                    <div className="option-header">
                                        <div className="radio-circle">
                                            {applyMethod === 'select' && <div className="radio-dot" />}
                                        </div>
                                        <div className="option-title">Select from My Library</div>
                                    </div>

                                    {applyMethod === 'select' && (
                                        <div className="cv-list-container">
                                            {isLoadingCVs ? (
                                                <div className="loading-state"><Loader2 className="animate-spin" size={20} /> Loading CVs...</div>
                                            ) : userCVs.length > 0 ? (
                                                <div className="cv-list">
                                                    {userCVs.map(cv => (
                                                        <div
                                                            key={cv.id}
                                                            className={`cv-item ${selectedCvId === cv.id ? 'selected' : ''}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedCvId(cv.id);
                                                            }}
                                                        >
                                                            <div className="cv-icon">
                                                                <FileText size={18} />
                                                            </div>
                                                            <div className="cv-info">
                                                                <div className="cv-name">{cv.title}</div>
                                                                <div className="cv-meta">{cv.type === 'platform' ? 'Built on Platform' : 'Uploaded File'}</div>
                                                            </div>
                                                            {selectedCvId === cv.id && <Check size={18} className="check-icon" />}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="empty-cvs">No saved CVs found.</div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Option 2: Upload New */}
                                <div
                                    className={`apply-option-card ${applyMethod === 'upload' ? 'active' : ''}`}
                                    onClick={() => setApplyMethod('upload')}
                                >
                                    <div className="option-header">
                                        <div className="radio-circle">
                                            {applyMethod === 'upload' && <div className="radio-dot" />}
                                        </div>
                                        <div className="option-title">Upload a Local CV</div>
                                    </div>

                                    {applyMethod === 'upload' && (
                                        <div className="upload-area" onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                style={{ display: 'none' }}
                                                accept=".pdf,.doc,.docx"
                                                onChange={handleFileUpload}
                                            />
                                            <div className="upload-icon-circle">
                                                <Upload size={24} />
                                            </div>
                                            <div className="upload-text">
                                                {uploadFile ? uploadFile.name : "Click to upload PDF or DOCX"}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Option 3: Build New (Redirect) */}
                                <div
                                    className="apply-option-card"
                                    onClick={() => navigate('/jobseeker/cv-builder')}
                                    style={{ borderStyle: 'dashed', borderColor: '#3E61FF', background: '#F8FAFC' }}
                                >
                                    <div className="option-header">
                                        <div style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <BookOpen size={16} color="#3E61FF" />
                                        </div>
                                        <div className="option-title" style={{ color: '#3E61FF' }}>Create with CV Builder</div>
                                    </div>
                                    <div style={{ marginLeft: 32, fontSize: '0.85rem', color: '#64748B' }}>
                                        Don't have a CV yet? Build a professional one in minutes.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={() => setIsApplyModalOpen(false)}>Cancel</button>
                            <button
                                className="submit-app-btn"
                                onClick={handleSubmitApplication}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" /> Sending...
                                    </>
                                ) : 'Send Application'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .job-description-container {
                    background-color: #F8F9FA;
                    min-height: 100vh;
                    padding: 40px 20px;
                    font-family: 'Inter', sans-serif;
                    color: #2D3748;
                }
                .job-content-wrapper {
                    max-width: 1100px;
                    margin: 0 auto;
                }
                .back-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: none;
                    border: none;
                    color: #718096;
                    font-weight: 600;
                    margin-bottom: 20px;
                    cursor: pointer;
                    font-size: 0.95rem;
                }
                .back-btn:hover { color: var(--color-brand-accent); }

                /* Header Card */
                .job-header-card {
                    background: white;
                    border-radius: 8px;
                    padding: 30px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.03);
                    border: 1px solid #E2E8F0;
                    margin-bottom: 24px;
                }
                .header-main {
                    display: flex;
                    justify-content: space-between;
                    gap: 24px;
                }
                .company-logo-large {
                    width: 70px;
                    height: 70px;
                    background: #F8FAFC;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 1.8rem;
                    color: #4A5568;
                    border: 1px solid #E2E8F0;
                    flex-shrink: 0;
                }
                .header-info { flex: 1; }
                .job-title-large {
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: #1A365D;
                    margin-bottom: 8px;
                    margin-top: -4px;
                }
                .company-meta {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #718096;
                    font-size: 0.9rem;
                    flex-wrap: wrap;
                }
                .company-name { font-weight: 600; color: #4A5568; display: flex; align-items: center; gap: 6px; }
                .meta-separator { color: #CBD5E0; }
                .meta-detail { display: flex; align-items: center; gap: 5px; }
                
                .job-stats-row {
                    margin-top: 10px;
                    font-size: 0.8rem;
                    color: #A0AEC0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .view-count { color: #81E6D9; font-weight: 600; }
                
                .share-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: 1px solid #E2E8F0;
                    background: white;
                    color: #718096;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: 0.2s;
                }
                .share-btn:hover { background: #F7FAFC; color: #2D3748; }

                .job-tags-row {
                    display: flex;
                    gap: 12px;
                    margin-top: 24px;
                    flex-wrap: wrap;
                }
                .tag-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.85rem;
                    color: #4A5568;
                    font-weight: 500;
                    background: #EDF2F7;
                    padding: 6px 14px;
                    border-radius: 4px;
                }

                /* Grid Layout */
                .job-body-grid {
                    display: grid;
                    grid-template-columns: 2.2fr 1fr;
                    gap: 30px;
                }
                .job-details-col {
                    background: white;
                    padding: 40px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.03);
                    border: 1px solid #E2E8F0;
                }
                .detail-section { margin-bottom: 30px; }
                .section-title-main {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #2D3748;
                    margin-bottom: 16px;
                    padding-bottom: 8px;
                    border-bottom: 2px solid #F1F5F9;
                }
                .section-title-sub {
                    font-size: 1.05rem;
                    font-weight: 700;
                    color: #2D3748;
                    margin-bottom: 12px;
                }
                .description-text {
                    color: #4A5568;
                    line-height: 1.7;
                    font-size: 0.95rem;
                }
                .custom-list {
                    list-style: disc;
                    padding-left: 20px;
                    color: #4A5568;
                }
                .custom-list li { margin-bottom: 8px; line-height: 1.6; font-size: 0.95rem; }
                
                .divider-line { height: 1px; background: #E2E8F0; margin: 30px 0; }

                /* Job Spec */
                .spec-grid { display: flex; flex-direction: column; gap: 12px; }
                .spec-row { display: grid; grid-template-columns: 200px 1fr; font-size: 0.95rem; }
                .spec-label { color: #718096; font-weight: 500; }
                .spec-value { color: #2D3748; font-weight: 600; }

                /* Skills */
                .skills-cloud { display: flex; flex-wrap: wrap; gap: 10px; }
                .skill-pill {
                    border: 1px solid #CBD5E0;
                    color: #4A5568;
                    padding: 6px 14px;
                    border-radius: 100px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    background: white;
                }

                /* Sidebar */
                .job-sidebar-col {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }
                .sidebar-card {
                    background: white;
                    padding: 24px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.03);
                    border: 1px solid #E2E8F0;
                }
                .sidebar-card h3 {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #2D3748;
                    margin-bottom: 16px;
                }
                .highlight-card { border-top: 4px solid #3E61FF; }
                .apply-note { font-size: 0.9rem; color: #4A5568; margin-bottom: 10px; line-height: 1.5; }
                .login-note { font-size: 0.8rem; color: #E53E3E; margin-bottom: 16px; font-style: italic; }
                
                .sidebar-action-btn {
                    width: 100%;
                    padding: 12px;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 1rem;
                    cursor: pointer;
                    text-align: center;
                    transition: 0.2s;
                    border: none;
                    margin-bottom: 12px;
                }
                .btn-login {
                    background: #10B981; /* Green like merojob */
                    color: white;
                }
                .btn-apply {
                    background: #3E61FF;
                    color: white;
                }
                .btn-login:hover { background: #059669; }
                .btn-apply:hover { background: #2b4bda; }
                
                .deadline-text { font-size: 0.85rem; color: #718096; text-align: center; }
                .text-danger { color: #E53E3E; font-weight: 600; }

                /* Org Mini Profile */
                .org-profile-mini { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
                .org-logo-mini {
                    width: 48px; height: 48px;
                    background: #F8FAFC; border: 1px solid #E2E8F0;
                    display: flex; align-items: center; justify-content: center;
                    border-radius: 6px; font-weight: 700; color: #4A5568;
                }
                .org-name-mini { font-weight: 700; font-size: 1rem; color: #2D3748; }
                .org-desc { font-size: 0.85rem; color: #718096; line-height: 1.6; }

                /* Modal Stylings */
                .modal-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.6);
                    display: flex; justify-content: center; align-items: center;
                    z-index: 1000;
                    backdrop-filter: blur(4px);
                }
                .modal-content {
                    background: white;
                    width: 90%; max-width: 600px;
                    border-radius: 16px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.1);
                    overflow: hidden;
                    animation: slideUp 0.3s ease-out;
                }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                
                .modal-header {
                    padding: 20px 24px;
                    border-bottom: 1px solid #E2E8F0;
                    display: flex; justify-content: space-between; align-items: center;
                }
                .modal-header h2 { font-size: 1.25rem; font-weight: 700; color: #1A365D; margin: 0; }
                .close-btn { background: none; border: none; cursor: pointer; color: #A0AEC0; transition: 0.2s; }
                .close-btn:hover { color: #E53E3E; }
                
                .modal-body { padding: 24px; }
                .modal-desc { color: #718096; font-size: 0.95rem; margin-bottom: 24px; }
                
                .apply-options { display: flex; flex-direction: column; gap: 16px; }
                .apply-option-card {
                    border: 1px solid #E2E8F0;
                    border-radius: 12px;
                    padding: 16px;
                    cursor: pointer;
                    transition: 0.2s;
                    user-select: none;
                }
                .apply-option-card.active {
                    border-color: #3E61FF;
                    background: #F0F5FF;
                }
                .option-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
                .radio-circle {
                    width: 20px; height: 20px; border-radius: 50%;
                    border: 2px solid #CBD5E0;
                    display: flex; align-items: center; justify-content: center;
                }
                .apply-option-card.active .radio-circle { border-color: #3E61FF; }
                .radio-dot { width: 10px; height: 10px; background: #3E61FF; border-radius: 50%; }
                .option-title { font-weight: 600; color: #2D3748; }
                
                /* CV List */
                .cv-list-container { padding-left: 32px; }
                .loading-state { font-size: 0.9rem; color: #718096; display: flex; gap: 8px; align-items: center; }
                .cv-list { display: flex; flex-direction: column; gap: 8px; max-height: 200px; overflow-y: auto; }
                .cv-item {
                    display: flex; align-items: center; gap: 12px;
                    padding: 10px; border-radius: 8px;
                    background: white; border: 1px solid #E2E8F0;
                    transition: 0.2s;
                }
                .cv-item:hover { border-color: #A0AEC0; }
                .cv-item.selected { border-color: #3E61FF; background: white; box-shadow: 0 0 0 1px #3E61FF; }
                .cv-icon { color: #718096; }
                .cv-info { flex: 1; }
                .cv-name { font-size: 0.9rem; font-weight: 600; color: #2D3748; }
                .cv-meta { font-size: 0.75rem; color: #A0AEC0; }
                .check-icon { color: #3E61FF; }
                .empty-cvs { font-size: 0.9rem; color: #E53E3E; font-style: italic; }

                /* Upload Area */
                .upload-area {
                    margin-left: 32px;
                    border: 2px dashed #CBD5E0;
                    border-radius: 8px;
                    padding: 24px;
                    display: flex; flex-direction: column; align-items: center; gap: 12px;
                    background: white;
                    transition: 0.2s;
                }
                .upload-area:hover { border-color: #3E61FF; background: #fafbff; }
                .upload-icon-circle {
                    width: 48px; height: 48px; background: #F7FAFC;
                    border-radius: 50%; display: flex; align-items: center; justify-content: center;
                    color: #718096;
                }
                .upload-text { font-size: 0.9rem; color: #4A5568; font-weight: 500; }
                
                .modal-footer {
                    padding: 20px 24px;
                    border-top: 1px solid #E2E8F0;
                    display: flex; justify-content: flex-end; gap: 12px;
                    background: #F8FAFC;
                }
                .cancel-btn {
                    padding: 10px 20px; border: none; background: none; color: #718096;
                    font-weight: 600; cursor: pointer;
                }
                .submit-app-btn {
                    padding: 10px 24px;
                    background: #3E61FF; color: white;
                    border: none; border-radius: 8px;
                    font-weight: 600; cursor: pointer;
                    display: flex; align-items: center; gap: 8px;
                    transition: 0.2s;
                }
                .submit-app-btn:hover { background: #2b4bda; }
                .submit-app-btn:disabled { opacity: 0.7; cursor: not-allowed; }
                
                .status-badge-premium {
                    padding: 14px;
                    border-radius: 8px;
                    font-size: 0.95rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    text-align: center;
                    margin-bottom: 16px;
                }
                .status-badge-premium.reviewing { background: #F1F5F9; color: #475569; border: 1px solid #E2E8F0; }
                .status-badge-premium.interview { background: rgba(62, 97, 255, 0.1); color: #3E61FF; border: 1px solid #3E61FF; }
                .status-badge-premium.accepted { background: #ECFDF5; color: #059669; border: 1px solid #D1FAE5; }
                .status-badge-premium.rejected { background: #FEF2F2; color: #DC2626; border: 1px solid #FEE2E2; }
                .status-badge-premium.pending { background: #FFFBEB; color: #D97706; border: 1px solid #FEF3C7; }
                .status-badge-premium.applied { background: #F8FAFC; color: #64748B; border: 1px solid #E2E8F0; }

                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                @media (max-width: 900px) {
                    .job-body-grid { grid-template-columns: 1fr; }
                    .header-main { flex-direction: column; }
                    .header-actions { position: absolute; top: 30px; right: 30px; }
                    .job-header-card { position: relative; }
                    .spec-row { grid-template-columns: 1fr; gap: 4px; margin-bottom: 10px; }
                }
            `}</style>
        </div>
    );
};

export default JobDescription;
