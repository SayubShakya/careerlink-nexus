import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useGetMe } from '@/hooks/api/auth/useGetMe';
import { ROUTES } from '@/routes/routes';
import {
    Briefcase,
    FileText,
    ArrowUpRight,
    Search,
    Shield,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

import heroBg from '@assets/images/job-seeker-img.jpg';

const JobSeekerDashboard = () => {
    const { data: me } = useGetMe();
    const navigate = useNavigate();
    const user = me?.user || JSON.parse(localStorage.getItem('user') || '{}');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const stats = [
        { label: 'Jobs Applied', value: '24', trend: 'Total count' },
        { label: 'My Resumes', value: '3', trend: 'In your files' },
        { label: 'Under Review', value: '12', trend: 'Active jobs' },
        { label: 'Interview Calls', value: '5', trend: 'Shortlisted', color: '#0F172A' },
    ];

    const pipelineData = [
        { id: 1, role: 'Senior UX Designer', company: 'Google', loc: 'Mountain View, CA', status: 'Reviewing', logo: 'G' },
        { id: 2, role: 'Product Manager', company: 'Meta', loc: 'Menlo Park, CA', status: 'Interview', logo: 'M' },
        { id: 3, role: 'Staff Software Engineer', company: 'Amazon', loc: 'Seattle, WA', status: 'Accepted', logo: 'A' },
        { id: 4, role: 'Cloud Architect', company: 'Microsoft', loc: 'Remote', status: 'Pending', logo: 'M' },
        { id: 5, role: 'AI Researcher', company: 'NVIDIA', loc: 'Santa Clara, CA', status: 'Rejected', logo: 'N' },
        { id: 6, role: 'Full Stack Engineer', company: 'Netflix', loc: 'Los Gatos, CA', status: 'Interview', logo: 'N' },
        { id: 7, role: 'Systems Architect', company: 'Apple', loc: 'Cupertino, CA', status: 'Reviewing', logo: 'A' },
        { id: 8, role: 'Data Scientist', company: 'Palantir', loc: 'Denver, CO', status: 'Pending', logo: 'P' },
        { id: 9, role: 'Security Analyst', company: 'Cloudflare', loc: 'Remote', status: 'Applied', logo: 'C' },
        { id: 10, role: 'Lead DevOps', company: 'Docker', loc: 'Remote', status: 'Reviewing', logo: 'D' },
    ];

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = pipelineData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(pipelineData.length / itemsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="dashboard-root">
            <style>{`
                .dashboard-root {
                    min-height: 100vh;
                    background-color: var(--bg-dashboard);
                    color: var(--text-main);
                    padding: 40px 80px;
                    font-family: var(--font-body);
                    transition: background-color 0.3s;
                }

                /* UNIFIED HERO BOX */
                .hero-premium-box {
                    display: grid;
                    grid-template-columns: 1fr 440px;
                    background: var(--card-dashboard);
                    border: 1px solid var(--border-dashboard);
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: var(--shadow-premium);
                    margin-bottom: 64px;
                    height: 480px;
                }

                .hero-visual-side {
                    background-image: url(${heroBg});
                    background-size: contain;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-color: var(--bg-main);
                    border-right: 1px solid var(--border-dashboard);
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .dashboard-profile-circle {
                    width: 140px;
                    height: 140px;
                    border-radius: 50%;
                    border: 6px solid var(--card-dashboard);
                    box-shadow: 0 15px 40px rgba(0,0,0,0.15);
                    overflow: hidden;
                    background: white;
                    position: absolute;
                    bottom: 40px;
                    left: 40px;
                    z-index: 5;
                }

                .dashboard-profile-circle img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .hero-stats-side {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-template-rows: 1fr 1fr;
                    background: var(--bg-dashboard);
                    gap: 1px;
                }

                .stat-tile {
                    background: var(--card-dashboard);
                    padding: 40px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    transition: all 0.3s ease;
                }

                .stat-tile:hover { background: var(--bg-subtle); }
                .stat-tile.active-pipeline { background: var(--bg-subtle); border: 2px solid var(--color-brand-accent); }

                .tile-label {
                    font-size: 0.75rem;
                    font-weight: 800;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    margin-bottom: 12px;
                }

                .tile-val {
                    font-size: 3.5rem;
                    font-weight: 950;
                    line-height: 1;
                    margin-bottom: 8px;
                    color: var(--text-main);
                    letter-spacing: -0.04em;
                }

                .stat-tile.active-pipeline .tile-val { color: var(--color-brand-accent); }
                .tile-trend { font-size: 0.8rem; font-weight: 700; color: var(--text-light); }

                /* CONTENT FEED */
                .main-dashboard-grid {
                    display: grid;
                    grid-template-columns: 1fr 340px;
                    gap: 64px;
                }

                .section-header-block { margin-bottom: 40px; }
                .section-label {
                    font-size: 0.8rem;
                    font-weight: 800;
                    color: var(--color-brand-accent);
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    margin-bottom: 8px;
                    display: block;
                }

                .dashboard-title {
                    font-size: 2.5rem;
                    font-weight: 950;
                    letter-spacing: -0.03em;
                    color: var(--text-main);
                    margin: 0;
                }

                .pipeline-item {
                    background: var(--card-dashboard);
                    border: 1px solid var(--border-dashboard);
                    border-radius: 16px;
                    padding: 24px 32px;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .pipeline-item:hover { 
                    border-color: var(--color-brand-accent); 
                    transform: translateY(-3px); 
                    box-shadow: var(--shadow-premium); 
                }

                .item-info { display: flex; align-items: center; gap: 24px; }
                .company-badge {
                    width: 52px;
                    height: 52px;
                    background: var(--bg-dashboard);
                    border: 1px solid var(--border-dashboard);
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 900;
                    font-size: 1.25rem;
                    color: var(--text-main);
                }

                .role-name { font-size: 1.1rem; font-weight: 800; margin-bottom: 4px; color: var(--text-main); }
                .company-meta { font-size: 0.85rem; color: var(--text-muted); font-weight: 600; display: flex; align-items: center; gap: 8px; }

                .status-chip {
                    padding: 8px 18px;
                    border-radius: 8px;
                    font-size: 0.72rem;
                    font-weight: 850;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    background: var(--bg-dashboard);
                    color: var(--text-muted);
                    border: 1px solid transparent;
                    min-width: 100px;
                    text-align: center;
                }

                .status-chip.reviewing { background: var(--bg-subtle); color: var(--text-muted); border: 1px solid var(--border-dashboard); }
                .status-chip.interview { background: rgba(62, 97, 255, 0.1); color: var(--color-brand-accent); border: 1px solid var(--color-brand-accent); }
                .status-chip.pending { background: #FFFBEB; color: #D97706; border: 1px solid #FEF3C7; }
                .status-chip.accepted { background: #ECFDF5; color: #059669; border: 1px solid #D1FAE5; }
                .status-chip.rejected { background: #FEF2F2; color: #DC2626; border: 1px solid #FEE2E2; }
                .status-chip.applied { background: var(--bg-dashboard); color: var(--text-muted); border: 1px solid var(--border-dashboard); }

                /* PAGINATION STYLES */
                .pagination-tray {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-top: 48px;
                }

                .page-btn {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                    border: 1px solid var(--border-dashboard);
                    background: var(--card-dashboard);
                    color: var(--text-muted);
                    font-weight: 700;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: 0.2s;
                }

                .page-btn:hover:not(:disabled) { border-color: var(--color-brand-accent); color: var(--color-brand-accent); background: var(--bg-subtle); }
                .page-btn.active { background: var(--text-main); color: var(--bg-main); border-color: var(--text-main); }
                .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

                /* SIDEBAR */
                .management-sidebar { position: sticky; top: 120px; }
                .sidebar-label {
                    font-size: 0.75rem;
                    font-weight: 850;
                    color: var(--text-light);
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    margin-bottom: 32px;
                    display: block;
                }

                .nav-action-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 24px 0;
                    border-bottom: 1.5px solid var(--border-dashboard);
                    text-decoration: none;
                    color: var(--text-muted);
                    font-weight: 800;
                    font-size: 0.95rem;
                    transition: 0.2s ease;
                }

                .nav-action-item:hover { 
                    color: var(--color-brand-accent); 
                    padding-left: 12px;
                    border-bottom-color: var(--color-brand-accent); 
                }

                .nav-action-item span { display: flex; align-items: center; gap: 14px; }
            `}</style>

            {/* HERO BOX */}
            <div className="hero-premium-box">
                <div className="hero-visual-side">
                    {user?.profile_picture && (
                        <div className="dashboard-profile-circle">
                            <img src={`http://localhost:5000/${user.profile_picture}`} alt="Profile" />
                        </div>
                    )}
                </div>
                <div className="hero-stats-side">
                    {stats.map((s, i) => (
                        <div key={i} className={`stat-tile ${s.highlight ? 'active-pipeline' : ''}`}>
                            <span className="tile-label">{s.label}</span>
                            <span className="tile-val">{s.value}</span>
                            <span className="tile-trend">{s.trend}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* MAIN FEED */}
            <div className="main-dashboard-grid">
                <div className="pipeline-section">
                    <div className="section-header-block">
                        <span className="section-label">Application Status</span>
                        <h1 className="dashboard-title">Applied Jobs</h1>
                    </div>

                    <div className="pipeline-feed">
                        {currentItems.map((app) => (
                            <div key={app.id} className="pipeline-item" onClick={() => navigate(`/jobseeker/jobs/${app.id}?status=${app.status}`)} style={{ cursor: 'pointer' }}>
                                <div className="item-info">
                                    <div className="company-badge">{app.logo}</div>
                                    <div className="text-content">
                                        <div className="role-name">{app.role}</div>
                                        <div className="company-meta">
                                            <span>{app.company}</span>
                                            <span style={{ opacity: 0.3 }}>•</span>
                                            <span>{app.loc}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`status-chip ${app.status.toLowerCase()}`}>
                                    {app.status}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* PAGINATION TRAY */}
                    <div className="pagination-tray">
                        <button
                            className="page-btn"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={18} />
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                                onClick={() => paginate(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            className="page-btn"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                {/* SIDEBAR */}
                <div className="management-sidebar">
                    <span className="sidebar-label">Quick Management</span>

                    <Link to={ROUTES.JOBSEEKER_FIND_JOBS} className="nav-action-item">
                        <span><Search size={22} color="#3E61FF" strokeWidth={2.5} /> Find Jobs</span>
                        <ArrowUpRight size={18} />
                    </Link>

                    <Link to={ROUTES.CV_BUILDER} className="nav-action-item">
                        <span><FileText size={22} color="#3E61FF" strokeWidth={2.5} /> Build CV</span>
                        <ArrowUpRight size={18} />
                    </Link>

                    <Link to={ROUTES.MY_CVS} className="nav-action-item">
                        <span><Briefcase size={22} color="#3E61FF" strokeWidth={2.5} /> CV Storage</span>
                        <ArrowUpRight size={18} />
                    </Link>

                    <Link to={ROUTES.JOBSEEKER_PROFILE} className="nav-action-item">
                        <span><Shield size={22} color="#3E61FF" strokeWidth={2.5} /> My Account</span>
                        <ArrowUpRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default JobSeekerDashboard;
