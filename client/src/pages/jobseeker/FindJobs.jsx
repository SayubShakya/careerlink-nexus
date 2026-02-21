import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
    Search, Briefcase, Users, Building2, ChevronRight, SearchCheck, Star,
    MapPin, DollarSign, Zap, ChevronLeft, X, Clock, Calendar,
    GraduationCap, CheckCircle, BookOpen, FileText, Heart
} from 'lucide-react';
import { useGetJobs, useGetSavedJobs, useSaveJob, useUnsaveJob } from '@/hooks/api/jobs/useJobs';
import toast from 'react-hot-toast';
import bannerHuman from '@/assets/images/banner-human2.png';
import { useState } from 'react';

// JobDetailModal removed as requested - using dedicated page navigation now

const FindJobs = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [jobType, setJobType] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedJob, setSelectedJob] = useState(null);
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

    const { data: serverJobs = [], isLoading } = useGetJobs({
        search: searchTerm,
        type: jobType === 'All' ? undefined : jobType
    });
    const { data: savedJobs = [] } = useGetSavedJobs();
    const { mutate: saveJob } = useSaveJob();
    const { mutate: unsaveJob } = useUnsaveJob();

    const isJobSaved = (jobId) => savedJobs.some(item => item.job_id === jobId || item.jobId === jobId);

    const toggleSave = (e, jobId) => {
        e.stopPropagation();
        if (isJobSaved(jobId)) {
            unsaveJob(jobId, { onSuccess: () => toast.success('Job removed from saved list') });
        } else {
            saveJob(jobId, { onSuccess: () => toast.success('Job saved successfully') });
        }
    };

    const { isAuthenticated } = useAuth();
    const isLoggedIn = isAuthenticated();

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = serverJobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(serverJobs.length / jobsPerPage);

    const handleJobClick = (jobId) => {
        navigate(`/jobseeker/jobs/${jobId}`);
    };

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
                .pill { background: rgba(62,97,255,0.08); color: var(--color-brand-accent); padding: 8px 18px; border-radius: 100px; font-size: 0.85rem; font-weight: 700; cursor: pointer; border: 1px solid rgba(62,97,255,0.15); transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
                .pill:hover { background: rgba(62,97,255,0.15); border-color: var(--color-brand-accent); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(62,97,255,0.2); }
                .top-employers-bar { background: var(--card-dashboard); border-top: 1px solid var(--border-dashboard); border-bottom: 1px solid var(--border-dashboard); padding: 20px 0; display: flex; align-items: center; gap: 40px; overflow: hidden; position: relative; }
                .bar-label { font-weight: 800; font-size: 0.85rem; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; padding-left: 80px; z-index: 2; background: var(--card-dashboard); position: relative; box-shadow: 10px 0 20px var(--card-dashboard); }
                .marqee-wrapper { display: flex; flex: 1; overflow: hidden; mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); }
                .logos-scroll { display: flex; gap: 40px; align-items: center; animation: scroll 30s linear infinite; padding-right: 40px; }
                .logos-scroll:hover { animation-play-state: paused; }
                @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
                .employer-logo { font-weight: 900; color: var(--text-muted); opacity: 0.6; font-size: 1rem; cursor: pointer; transition: all 0.3s; padding: 8px 16px; border-radius: 8px; white-space: nowrap; }
                .employer-logo:hover { opacity: 1; color: var(--color-brand-accent); background: rgba(62,97,255,0.08); transform: translateY(-2px); }
                .jobs-content { padding: 40px 80px; }
                .content-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
                .view-toggles { display: flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.03); padding: 4px; border-radius: 12px; border: 1px solid var(--border-dashboard); }
                .filter-tab { padding: 8px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 700; border: none; cursor: pointer; background: transparent; color: var(--text-muted); transition: all 0.2s; white-space: nowrap; }
                .filter-tab.active { background: white; color: var(--color-brand-accent); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
                .filter-tab:hover:not(.active) { color: var(--color-brand-accent); background: rgba(62,97,255,0.05); }
                .jobs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
                .company-card { background: var(--card-dashboard); border: 1px solid var(--border-dashboard); border-radius: 12px; padding: 24px; transition: 0.2s; }
                .company-card:hover { border-color: var(--color-brand-accent); transform: translateY(-2px); }
                .company-icon { width: 48px; height: 48px; background: var(--bg-dashboard); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; color: var(--text-main); border: 1px solid var(--border-dashboard); }
                .roles-list { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
                .role-link { display: flex; align-items: center; gap: 8px; text-decoration: none; font-size: 0.9rem; font-weight: 600; color: var(--text-muted); }
                .role-dot { width: 5px; height: 5px; background: var(--color-brand-accent); border-radius: 50%; }

                /* ENHANCED JOB CARD */
                .job-item-card { background: var(--card-dashboard); border: 1px solid var(--border-dashboard); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 16px; transition: all 0.3s cubic-bezier(0.4,0,0.2,1); cursor: pointer; position: relative; overflow: hidden; }
                .job-item-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--color-brand-accent); opacity: 0; transition: opacity 0.3s; }
                .job-item-card:hover { border-color: var(--color-brand-accent); box-shadow: 0 8px 30px rgba(62,97,255,0.12); transform: translateY(-3px); }
                .job-item-card:hover::before { opacity: 1; }
                .job-card-top { display: flex; justify-content: space-between; align-items: flex-start; }
                .job-main-info { display: flex; gap: 16px; align-items: center; flex: 1; }
                .job-badge { width: 52px; height: 52px; background: linear-gradient(135deg, rgba(62,97,255,0.1), rgba(62,97,255,0.05)); border-radius: 14px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-dashboard); font-weight: 900; font-size: 1.2rem; color: var(--color-brand-accent); flex-shrink: 0; }
                .job-title { font-size: 1.05rem; font-weight: 800; color: var(--text-main); margin-bottom: 4px; }
                .job-meta { display: flex; gap: 14px; font-size: 0.8rem; color: var(--text-muted); font-weight: 600; flex-wrap: wrap; }
                .meta-item { display: flex; align-items: center; gap: 5px; }
                .job-card-desc { font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; padding-left: 68px; }
                .job-card-bottom { display: flex; justify-content: space-between; align-items: center; padding-left: 68px; }
                .job-card-skills { display: flex; gap: 6px; flex-wrap: wrap; }
                .job-card-skill { background: rgba(62,97,255,0.08); color: var(--color-brand-accent); padding: 4px 10px; border-radius: 6px; font-size: 0.72rem; font-weight: 700; }
                .job-card-deadline { font-size: 0.78rem; color: var(--text-light); display: flex; align-items: center; gap: 4px; font-weight: 600; }
                .view-details-btn { background: transparent; color: var(--color-brand-accent); border: 1.5px solid var(--color-brand-accent); padding: 8px 18px; border-radius: 8px; font-weight: 700; font-size: 0.82rem; cursor: pointer; display: flex; gap: 6px; align-items: center; transition: all 0.2s; white-space: nowrap; }
                .view-details-btn:hover { background: var(--color-brand-accent); color: white; }

                /* PAGINATION */
                .pagination-tray { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 48px; }
                .page-btn { width: 40px; height: 40px; border-radius: 10px; border: 1px solid var(--border-dashboard); background: var(--card-dashboard); font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
                .page-btn.active { background: var(--color-brand-accent); color: white; border-color: var(--color-brand-accent); }
                .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

                /* ═══ JOB DETAIL MODAL ═══ */
                .jd-modal-overlay { position: fixed; inset: 0; background: rgba(5,10,26,0.65); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 2000; animation: jdFadeIn 0.2s ease-out; }
                @keyframes jdFadeIn { from { opacity: 0; } to { opacity: 1; } }
                .jd-modal-container { background: var(--card-dashboard, #fff); border-radius: 20px; width: 90%; max-width: 720px; max-height: 85vh; display: flex; flex-direction: column; box-shadow: 0 25px 60px rgba(0,0,0,0.25); animation: jdSlideUp 0.35s cubic-bezier(0.175,0.885,0.32,1.275); position: relative; overflow: hidden; }
                @keyframes jdSlideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                .jd-modal-close { position: absolute; top: 18px; right: 18px; background: var(--bg-dashboard, #f3f4f6); border: none; width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-muted); transition: 0.2s; z-index: 10; }
                .jd-modal-close:hover { background: #fee2e2; color: #ef4444; }
                .jd-modal-scroll { overflow-y: auto; padding: 32px 32px 20px; flex: 1; }
                .jd-modal-header { display: flex; gap: 16px; align-items: center; margin-bottom: 20px; }
                .jd-modal-badge { width: 60px; height: 60px; background: linear-gradient(135deg, rgba(62,97,255,0.15), rgba(62,97,255,0.05)); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.5rem; color: var(--color-brand-accent); border: 1px solid var(--border-dashboard); flex-shrink: 0; }
                .jd-modal-title { font-size: 1.45rem; font-weight: 800; color: var(--text-main); margin-bottom: 4px; }
                .jd-modal-company-row { display: flex; align-items: center; gap: 10px; font-size: 0.88rem; color: var(--text-muted); font-weight: 600; flex-wrap: wrap; }
                .jd-modal-company-row span { display: flex; align-items: center; gap: 5px; }
                .jd-sep { color: var(--border-dashboard); }
                .jd-modal-tags { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid var(--border-dashboard); }
                .jd-tag { display: flex; align-items: center; gap: 6px; font-size: 0.82rem; font-weight: 600; color: var(--text-muted); background: var(--bg-dashboard, #f3f4f6); padding: 6px 14px; border-radius: 8px; }
                .jd-modal-section { margin-bottom: 22px; }
                .jd-modal-section h3 { font-size: 1rem; font-weight: 700; color: var(--text-main); margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
                .jd-modal-section p { font-size: 0.9rem; color: var(--text-muted); line-height: 1.7; }
                .jd-modal-section ul { padding-left: 20px; list-style: disc; }
                .jd-modal-section ul li { font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 6px; }
                .jd-skills-cloud { display: flex; flex-wrap: wrap; gap: 8px; }
                .jd-skill-pill { background: rgba(62,97,255,0.08); color: var(--color-brand-accent); padding: 6px 14px; border-radius: 100px; font-size: 0.82rem; font-weight: 700; border: 1px solid rgba(62,97,255,0.15); }
                .jd-modal-footer { padding: 16px 32px; border-top: 1px solid var(--border-dashboard); display: flex; justify-content: flex-end; background: var(--bg-dashboard, #f8f9fa); }
                .jd-modal-apply-btn { background: var(--color-brand-accent); color: white; border: none; padding: 12px 28px; border-radius: 10px; font-weight: 800; font-size: 0.95rem; cursor: pointer; display: flex; gap: 8px; align-items: center; transition: all 0.2s; box-shadow: 0 4px 14px rgba(62,97,255,0.25); }
                .jd-modal-apply-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(62,97,255,0.35); }

                .save-job-btn {
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    border: 1px solid var(--border-dashboard);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--card-dashboard);
                    color: var(--text-muted);
                    cursor: pointer;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                    margin-right: 12px;
                }
                .save-job-btn:hover { transform: scale(1.1); background: rgba(239, 68, 68, 0.1); color: #EF4444; border-color: #FCA5A5; }
                .save-job-btn.saved { 
                    color: #EF4444 !important; 
                    border-color: #FCA5A5 !important; 
                    background: #FEF2F2 !important;
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
                }
                .already-saved-badge {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: #FEF2F2;
                    color: #EF4444;
                    padding: 6px 12px;
                    border-radius: 100px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    border: 1px solid #FCA5A5;
                    animation: badgeSlideIn 0.3s ease-out;
                }
                @keyframes badgeSlideIn { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
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
                <div className="content-header" style={{ marginBottom: '32px' }}>
                    <div className="header-title" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Star size={22} fill="#EAB308" color="#EAB308" /> Available Jobs
                    </div>
                    <div className="view-toggles">
                        {['All', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'].map(type => (
                            <button
                                key={type}
                                className={`filter-tab ${jobType === type ? 'active' : ''}`}
                                onClick={() => { setJobType(type); setCurrentPage(1); }}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {isLoading ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <div className="animate-pulse" style={{ fontSize: '1.2rem', fontWeight: '600' }}>Loading available jobs...</div>
                        </div>
                    ) : currentJobs.length > 0 ? (
                        currentJobs.map((job) => (
                            <div key={job.id} className="job-item-card" onClick={() => handleJobClick(job.id)}>
                                <div className="job-card-top">
                                    <div className="job-main-info">
                                        <div className="job-badge">
                                            {job.Employer?.logo ? (
                                                <img src={`/${job.Employer.logo}`} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }} />
                                            ) : (
                                                job.Employer?.name?.charAt(0) || job.company?.charAt(0) || 'J'
                                            )}
                                        </div>
                                        <div>
                                            <div className="job-title">{job.title}</div>
                                            <div className="job-meta">
                                                <div className="meta-item"><Building2 size={13} /> {job.Employer?.name || job.company || 'Nexus Partner'}</div>
                                                <div className="meta-item"><MapPin size={13} /> {job.location}</div>
                                                <div className="meta-item"><DollarSign size={13} /> {job.salary}</div>
                                                <div className="meta-item"><Zap size={13} color="#3E61FF" /> {job.jobType || job.type}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {isJobSaved(job.id) && (
                                            <span className="already-saved-badge">
                                                <Heart size={12} fill="#EF4444" color="#EF4444" /> Already Saved
                                            </span>
                                        )}
                                        <button
                                            className={`save-job-btn ${isJobSaved(job.id) ? 'saved' : ''}`}
                                            onClick={(e) => toggleSave(e, job.id)}
                                            title={isJobSaved(job.id) ? "Unsave Job" : "Save Job"}
                                        >
                                            <Heart size={18} fill={isJobSaved(job.id) ? "#EF4444" : "none"} color={isJobSaved(job.id) ? "#EF4444" : "currentColor"} />
                                        </button>
                                        <button className="view-details-btn" onClick={(e) => { e.stopPropagation(); handleJobClick(job.id); }}>
                                            View Details <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div className="job-card-desc">{job.description}</div>
                                <div className="job-card-bottom">
                                    <div className="job-card-skills">
                                        {job.skills && Array.isArray(job.skills) && job.skills.slice(0, 3).map((s, i) => (
                                            <span key={i} className="job-card-skill">{s}</span>
                                        ))}
                                        {job.skills && Array.isArray(job.skills) && job.skills.length > 3 && <span className="job-card-skill">+{job.skills.length - 3}</span>}
                                    </div>
                                    <div className="job-card-deadline"><Calendar size={13} /> {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}</div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '80px', textAlign: 'center', background: 'var(--card-dashboard)', borderRadius: '16px', border: '1px dashed var(--border-dashboard)' }}>
                            <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: '600' }}>No jobs found matching your criteria.</div>
                            <button
                                onClick={() => { setSearchTerm(''); setJobType('All'); }}
                                style={{ marginTop: '16px', color: 'var(--color-brand-accent)', fontWeight: '700', cursor: 'pointer', background: 'transparent', border: 'none' }}
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}

                    {serverJobs.length > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '48px', flexWrap: 'wrap', gap: '20px' }}>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                                Showing <span style={{ color: 'var(--text-main)' }}>{indexOfFirstJob + 1}-{Math.min(indexOfLastJob, serverJobs.length)}</span> of <span style={{ color: 'var(--text-main)' }}>{serverJobs.length}</span> results
                            </div>

                            {totalPages > 1 && (
                                <div className="pagination-tray" style={{ marginTop: 0 }}>
                                    <button
                                        className="page-btn"
                                        disabled={currentPage === 1}
                                        onClick={() => { setCurrentPage(currentPage - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                                            onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        className="page-btn"
                                        disabled={currentPage === totalPages}
                                        onClick={() => { setCurrentPage(currentPage + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FindJobs;
