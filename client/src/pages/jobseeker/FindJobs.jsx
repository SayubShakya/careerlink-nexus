import { useNavigate } from 'react-router-dom';
import { useGetJobs } from '@/hooks/api/jobs/useJobs';
import { useAuth } from '@/hooks/useAuth';
import {
    Search,
    Briefcase,
    Users,
    Building2,
    ChevronRight,
    SearchCheck,
    Star,
    MapPin,
    DollarSign,
    Zap,
    ChevronLeft
} from 'lucide-react';

import bannerHuman from '@/assets/images/banner-human2.png';
import { useState } from 'react';

const FindJobs = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('Company'); // 'Company' or 'Individual Jobs'
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 10;

    const stats = [
        { label: 'Live Jobs', value: '350', icon: <Briefcase size={20} /> },
        { label: 'Vacancies', value: '932', icon: <SearchCheck size={20} /> },
        { label: 'Organizations', value: '220', icon: <Building2 size={20} /> },
    ];

    const filterOptions = ['All Jobs', 'Jobs by Function', 'Jobs by Title', 'Jobs by Industry', 'Jobs by Location'];

    const topEmployers = [
        { name: 'IBerry', logo: '🍒' }, { name: 'IEC', logo: 'I' }, { name: 'Lumina', logo: 'L' },
        { name: 'Standard', logo: 'S' }, { name: 'Global', logo: 'G' }, { name: 'Rapti', logo: 'R' },
        { name: 'Audit', logo: 'A' }, { name: 'Agro', logo: 'Ag' },
    ];

    const { data: serverJobs = [], isLoading } = useGetJobs({ search: searchTerm });
    const { isAuthenticated } = useAuth();
    const isLoggedIn = isAuthenticated();
    // Expanded data for 20+ individual jobs
    const allIndividualJobs = [
        { id: 1, company: 'Google', role: 'Senior UX Designer', loc: 'Mountain View, CA', pay: '$180k', type: 'Full-time', logo: 'G' },
        { id: 2, company: 'Meta', role: 'Staff Software Engineer', loc: 'Remote', pay: '$210k', type: 'Remote', logo: 'M' },
        { id: 3, company: 'Amazon', role: 'Solutions Architect', loc: 'Seattle, WA', pay: '$190k', type: 'Full-time', logo: 'A' },
        { id: 4, company: 'Netflix', role: 'Systems Engineer', loc: 'Los Gatos, CA', pay: '$220k', type: 'Full-time', logo: 'N' },
        { id: 5, company: 'Apple', role: 'Product Manager', loc: 'Cupertino, CA', pay: '$175k', type: 'Hybrid', logo: 'A' },
        { id: 6, company: 'NVIDIA', role: 'AI Researcher', loc: 'Santa Clara, CA', pay: '$230k', type: 'Full-time', logo: 'N' },
        { id: 7, company: 'Microsoft', role: 'Azure Consultant', loc: 'Remote', pay: '$165k', type: 'Remote', logo: 'M' },
        { id: 8, company: 'Tesla', role: 'Mechanical Engineer', loc: 'Austin, TX', pay: '$150k', type: 'On-site', logo: 'T' },
        { id: 9, company: 'Spotify', role: 'Backend Developer', loc: 'Stockholm', pay: '$140k', type: 'Remote', logo: 'S' },
        { id: 10, company: 'Adobe', role: 'Creative Director', loc: 'San Jose, CA', pay: '$195k', type: 'Hybrid', logo: 'A' },
        { id: 11, company: 'Palantir', role: 'Forward Deployed Engineer', loc: 'Denver, CO', pay: '$185k', type: 'Full-time', logo: 'P' },
        { id: 12, company: 'Cloudflare', role: 'Security Architect', loc: 'San Francisco, CA', pay: '$205k', type: 'Remote', logo: 'C' },
        { id: 13, company: 'Docker', role: 'Platform Engineer', loc: 'Austin, TX', pay: '$170k', type: 'Full-time', logo: 'D' },
        { id: 14, company: 'Stripe', role: 'Product Analyst', loc: 'Remote', pay: '$160k', type: 'Remote', logo: 'S' },
        { id: 15, company: 'Airbnb', role: 'Experience Designer', loc: 'San Francisco, CA', pay: '$180k', type: 'Full-time', logo: 'A' },
        { id: 16, company: 'Uber', role: 'Data Scientist', loc: 'Amsterdam', pay: '$170k', type: 'Hybrid', logo: 'U' },
        { id: 17, company: 'Salesforce', role: 'Customer Success Lead', loc: 'Chicago, IL', pay: '$155k', type: 'Full-time', logo: 'S' },
        { id: 18, company: 'Intel', role: 'Hardware Engineer', loc: 'Portland, OR', pay: '$165k', type: 'On-site', logo: 'I' },
        { id: 19, company: 'Slack', role: 'Mobile Developer', loc: 'Remote', pay: '$175k', type: 'Remote', logo: 'S' },
        { id: 20, company: 'Zoom', role: 'Network Specialist', loc: 'San Jose, CA', pay: '$160k', type: 'Hybrid', logo: 'Z' },
    ];

    const companyData = [
        { company: 'International Pre-School', roles: ['Montessori Teacher'], logoChar: 'A' },
        { company: 'Build up Nepal', roles: ['Social Mobilizer / Sales Officer'], logoChar: 'B' },
        { company: 'RAPA Advisors', roles: ['Content Writer', 'SEO Executive'], logoChar: 'R' },
        { company: 'Valley View School', roles: ['Vice Principal'], logoChar: 'V' },
        { company: 'Global School of Science', roles: ['Vice Principal (VP)'], logoChar: 'G' },
        { company: 'Trust Nepal Overseas', roles: ['Compliance Officer'], logoChar: 'T' },
        { company: 'RV Group', roles: ['Sr. Civil Project Manager', 'Sales and Marketing Officer'], logoChar: 'RV' },
        { company: 'The Metaphor Consultancy', roles: ['Study Abroad Counselor'], logoChar: 'M' },
        { company: 'Endeavor Nepal', roles: ['System and Network...'], logoChar: 'E' },
        { company: 'Future Hub Asia Pacific', roles: ['Counselor'], logoChar: 'F' },
        { company: 'Simjung', roles: ['Full Stack Developer (AI-...)'], logoChar: 'S' },
        { company: 'Mountain River Films', roles: ['Social Media Manager'], logoChar: 'M' },
    ];

    // // Mapping server data to display format
    // const allIndividualJobs = serverJobs.map(job => ({
    //     id: job._id || job.id,
    //     company: job.Employer?.organization_name || 'Nexus Partner',
    //     role: job.title,
    //     loc: job.location || 'Nepal',
    //     pay: job.salary || 'Negotiable',
    //     type: job.job_type || 'Full-time',
    //     logo: job.Employer?.organization_name?.[0] || 'J'
    // }));

    // const indexOfLastJob = currentPage * jobsPerPage;
    // const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    // const currentJobs = allIndividualJobs.slice(indexOfFirstJob, indexOfLastJob);
    // const totalPages = Math.ceil(allIndividualJobs.length / jobsPerPage);
    // Pagination Logic for Individual Jobs
    const filteredIndividualJobs = allIndividualJobs.filter(job =>
        job.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredIndividualJobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(filteredIndividualJobs.length / jobsPerPage);

    return (
        <div className="find-jobs-container">
            <style>{`
                .find-jobs-container { background-color: var(--bg-dashboard); min-height: 100vh; font-family: 'Inter', sans-serif; transition: background-color 0.3s; }
                .hero-section { background: var(--bg-main); padding: 0 80px; overflow: hidden; border-bottom: 1px solid var(--border-dashboard); box-shadow: var(--shadow-premium); }
                .hero-flex-container { display: flex; align-items: center; justify-content: space-between; max-width: 1400px; margin: 0 auto; }
                .hero-left { flex: 1; padding: 60px 0; text-align: left; }
                .hero-right { flex: 1; display: flex; justify-content: flex-end; align-self: flex-end; }
                .hero-image { height: 480px; object-fit: contain; }
                .hero-title { font-size: 2.8rem; color: var(--text-main); font-weight: 900; margin-bottom: 30px; letter-spacing: -0.02em; }
                .hero-title span { color: var(--color-brand-accent); }

                .stats-grid { display: flex; gap: 40px; margin-bottom: 30px; }
                .stat-item { display: flex; align-items: center; gap: 12px; }
                .stat-icon { width: 44px; height: 44px; background: var(--card-dashboard); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--color-brand-accent); box-shadow: var(--shadow-premium); }
                .stat-text .val { font-size: 1.4rem; font-weight: 800; color: var(--text-main); display: block; }
                .stat-text .lbl { font-size: 0.85rem; color: var(--text-muted); font-weight: 600; }

                .search-bar { background: var(--card-dashboard); border: 1px solid var(--border-dashboard); border-radius: 12px; padding: 6px; display: flex; max-width: 600px; box-shadow: var(--shadow-premium); }
                .search-bar input { flex: 1; border: none; padding: 0 20px; font-size: 1rem; outline: none; background: transparent; color: var(--text-main); }
                .search-btn { background: var(--color-brand-accent); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; gap: 8px; align-items: center; }

                .filter-pills { display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap; }
                .pill { 
                    background: rgba(62, 97, 255, 0.08); 
                    color: var(--color-brand-accent); 
                    padding: 8px 18px; 
                    border-radius: 100px; 
                    font-size: 0.85rem; 
                    font-weight: 700; 
                    cursor: pointer; 
                    border: 1px solid rgba(62, 97, 255, 0.15);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .pill:hover { 
                    background: rgba(62, 97, 255, 0.15); 
                    border-color: var(--color-brand-accent);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(62, 97, 255, 0.2);
                }

                .top-employers-bar { 
                    background: var(--card-dashboard); 
                    border-top: 1px solid var(--border-dashboard); 
                    border-bottom: 1px solid var(--border-dashboard); 
                    padding: 20px 0; 
                    display: flex; 
                    align-items: center; 
                    gap: 40px;
                    overflow: hidden;
                    position: relative;
                }
                .bar-label { 
                    font-weight: 800; 
                    font-size: 0.85rem; 
                    color: var(--text-light); 
                    text-transform: uppercase; 
                    letter-spacing: 0.05em;
                    white-space: nowrap;
                    padding-left: 80px;
                    z-index: 2;
                    background: var(--card-dashboard);
                    position: relative;
                    box-shadow: 10px 0 20px var(--card-dashboard);
                }
                .marqee-wrapper {
                    display: flex;
                    flex: 1;
                    overflow: hidden;
                    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                }
                .logos-scroll { 
                    display: flex; 
                    gap: 40px; 
                    align-items: center;
                    animation: scroll 30s linear infinite;
                    padding-right: 40px;
                }
                .logos-scroll:hover {
                    animation-play-state: paused;
                }
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
                .employer-logo { 
                    font-weight: 900; 
                    color: var(--text-muted); 
                    opacity: 0.6;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    padding: 8px 16px;
                    border-radius: 8px;
                    white-space: nowrap;
                }
                .employer-logo:hover {
                    opacity: 1;
                    color: var(--color-brand-accent);
                    background: rgba(62, 97, 255, 0.08);
                    transform: translateY(-2px);
                }

                .jobs-content { padding: 40px 80px; }
                .content-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
                .view-toggles { background: var(--bg-dashboard); padding: 4px; border-radius: 8px; display: flex; }
                .toggle-btn { padding: 6px 16px; border-radius: 6px; font-size: 0.85rem; font-weight: 700; border: none; cursor: pointer; background: transparent; color: var(--text-muted); }
                .toggle-btn.active { background: var(--card-dashboard); color: var(--color-brand-accent); box-shadow: var(--shadow-premium); }

                /* GRID LAYOUTS */
                .jobs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
                .company-card { background: var(--card-dashboard); border: 1px solid var(--border-dashboard); border-radius: 12px; padding: 24px; transition: 0.2s; }
                .company-card:hover { border-color: var(--color-brand-accent); transform: translateY(-2px); }
                .company-icon { width: 48px; height: 48px; background: var(--bg-dashboard); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; color: var(--text-main); border: 1px solid var(--border-dashboard); }
                .roles-list { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
                .role-link { display: flex; align-items: center; gap: 8px; text-decoration: none; font-size: 0.9rem; font-weight: 600; color: var(--text-muted); }
                .role-dot { width: 5px; height: 5px; background: var(--color-brand-accent); border-radius: 50%; }

                /* INDIVIDUAL JOB CARD */
                .job-item-card { background: var(--card-dashboard); border: 1px solid var(--border-dashboard); border-radius: 16px; padding: 24px; display: flex; justify-content: space-between; align-items: center; transition: 0.2s; }
                .job-item-card:hover { border-color: var(--color-brand-accent); box-shadow: var(--shadow-premium); }
                .job-main-info { display: flex; gap: 20px; align-items: center; }
                .job-badge { width: 56px; height: 56px; background: var(--bg-dashboard); border-radius: 12px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-dashboard); font-weight: 900; font-size: 1.2rem; }
                .job-title { font-size: 1.1rem; font-weight: 800; color: var(--text-main); margin-bottom: 4px; }
                .job-meta { display: flex; gap: 16px; font-size: 0.85rem; color: var(--text-muted); font-weight: 600; }
                .meta-item { display: flex; align-items: center; gap: 6px; }
                .apply-btn { background: var(--color-brand-accent); color: white; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 800; cursor: pointer; display: flex; gap: 8px; align-items: center; }

                /* PAGINATION */
                .pagination-tray { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 48px; }
                .page-btn { width: 40px; height: 40px; border-radius: 10px; border: 1px solid var(--border-dashboard); background: var(--card-dashboard); font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
                .page-btn.active { background: var(--color-brand-accent); color: white; border-color: var(--color-brand-accent); }
                .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
            `}</style>

            <div className="hero-section">
                <div className="hero-flex-container">
                    <div className="hero-left">
                        <h1 className="hero-title">Start your Success Journey <span>Today</span></h1>
                        <div className="stats-grid">
                            {stats.map((s, i) => (
                                <div key={i} className="stat-item">
                                    <div className="stat-icon">{s.icon}</div>
                                    <div className="stat-text"><span className="lbl">{s.label}</span><span className="val">{s.value}</span></div>
                                </div>
                            ))}
                        </div>
                        <div className="search-bar">
                            <input type="text" placeholder="Search By Job Title" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                            <button className="search-btn"><Search size={18} /> Search Job</button>
                        </div>
                        <div className="filter-pills">{filterOptions.map((f, i) => (<div key={i} className="pill">{f}</div>))}</div>
                    </div>
                    <div className="hero-right"><img src={bannerHuman} alt="Banner" className="hero-image" /></div>
                </div>
            </div>

            <div className="top-employers-bar">
                <div className="bar-label">Top Employers</div>
                <div className="marqee-wrapper">
                    <div className="logos-scroll">
                        {[...topEmployers, ...topEmployers, ...topEmployers].map((e, i) => (
                            <div key={i} className="employer-logo">{e.logo} {e.name}</div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="jobs-content">
                <div className="content-header">
                    <div className="header-title"><Star size={20} fill="#EAB308" color="#EAB308" /> Top Jobs</div>
                    <div className="view-toggles">
                        <button className={`toggle-btn ${viewMode === 'Company' ? 'active' : ''}`} onClick={() => setViewMode('Company')}>Company</button>
                        <button className={`toggle-btn ${viewMode === 'Individual Jobs' ? 'active' : ''}`} onClick={() => { setViewMode('Individual Jobs'); setCurrentPage(1); }}>Individual Jobs</button>
                    </div>
                </div>

                {viewMode === 'Company' ? (
                    <div className="jobs-grid">
                        {companyData.map((item, i) => (
                            <div key={i} className="company-card">
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div className="company-icon">{item.logoChar}</div>
                                    <div><h3 style={{ fontSize: '0.95rem', fontWeight: 800 }}>{item.company}</h3><span style={{ fontSize: '0.75rem', color: '#3E61FF', fontWeight: 700 }}>Top Employer</span></div>
                                </div>
                                <div className="roles-list">
                                    {item.roles.map((role, ri) => (
                                        <div
                                            key={ri}
                                            className="role-link"
                                            style={{ cursor: 'pointer' }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (role === 'Montessori Teacher') {
                                                    navigate('/jobseeker/jobs/montessori-teacher');
                                                }
                                            }}
                                        >
                                            <div className="role-dot" />
                                            {role}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {currentJobs.map((job) => (
                            <div key={job.id} className="job-item-card">
                                <div className="job-main-info">
                                    <div className="job-badge">{job.logo}</div>
                                    <div>
                                        <div className="job-title">{job.role}</div>
                                        <div className="job-meta">
                                            <div className="meta-item"><Building2 size={14} /> {job.company}</div>
                                            <div className="meta-item"><MapPin size={14} /> {job.loc}</div>
                                            <div className="meta-item"><DollarSign size={14} /> {job.pay}</div>
                                            <div className="meta-item"><Zap size={14} color="#3E61FF" /> {job.type}</div>
                                        </div>
                                    </div>
                                </div>
                                {/* <button className="apply-btn" onClick={() => navigate(`${isLoggedIn ? '/jobseeker' : ''}/jobs/${job.id}`)}>Apply Now <ChevronRight size={16} /></button> */}
                                <button className="apply-btn">Apply Now <ChevronRight size={16} /></button>

                            </div>
                        ))}

                        <div className="pagination-tray">
                            <button className="page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}><ChevronLeft size={18} /></button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button key={i + 1} className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                            ))}
                            <button className="page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}><ChevronRight size={18} /></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindJobs;
