import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { useGetJobs } from '@/hooks/api/jobs/useJobs';
import {
    Search,
    Briefcase,
    Building2,
    SearchCheck,
    ChevronRight,
    ChevronLeft,
    Star,
    MapPin,
    DollarSign,
    Loader2
} from 'lucide-react';

import bannerHuman from '@/assets/images/banner-human2.png';

const PublicFindJobs = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    
    // Initial states from search params
    const initialSearch = searchParams.get('q') || '';
    const initialLocation = searchParams.get('l') || '';
    
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [locationTerm, setLocationTerm] = useState(initialLocation);
    const [jobType, setJobType] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 10;

    const { data: serverJobs = [], isLoading } = useGetJobs({
        search: searchTerm,
        type: jobType === 'All' ? undefined : jobType,
        location: locationTerm
    });

    const stats = [
        { label: 'Live Jobs', value: serverJobs.length || '350', icon: <Briefcase size={20} /> },
        { label: 'Vacancies', value: '932', icon: <SearchCheck size={20} /> },
        { label: 'Organizations', value: '220', icon: <Building2 size={20} /> },
    ];

    const filterOptions = ['All Jobs', 'Jobs by Function', 'Jobs by Title', 'Jobs by Industry', 'Jobs by Location'];

    const topEmployers = [
        { name: 'Leapfrog', logo: '🐸' }, { name: 'eSewa', logo: '💳' }, { name: 'Khalti', logo: '📱' },
        { name: 'Daraz', logo: '📦' }, { name: 'Nabil Bank', logo: '🏦' }, { name: 'Pathao', logo: '🏍️' },
        { name: 'Foodmandu', logo: '🍕' }, { name: 'F1Soft', logo: '💻' },
    ];

    const handleJobClick = (jobId) => {
        navigate(isAuthenticated() ? `/jobseeker/jobs/${jobId}` : `/jobs/${jobId}`);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        // Update URL params
        const newParams = new URLSearchParams();
        if (searchTerm) newParams.append('q', searchTerm);
        if (locationTerm) newParams.append('l', locationTerm);
        setSearchParams(newParams);
    };

    const totalPages = Math.ceil(serverJobs.length / jobsPerPage);
    const currentJobs = serverJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

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

                .search-bar-wrap { background: var(--card-dashboard); border: 1px solid var(--border-dashboard); border-radius: 12px; padding: 6px; display: flex; max-width: 800px; box-shadow: var(--shadow-premium); }
                .search-bar-wrap form { display: flex; width: 100%; gap: 10px; }
                .search-input-group { flex: 1; display: flex; align-items: center; gap: 10px; padding: 0 15px; }
                .search-input-group input { flex: 1; border: none; font-size: 0.95rem; outline: none; background: transparent; color: var(--text-main); height: 44px; }
                .search-divider { width: 1px; height: 30px; background: var(--border-dashboard); margin: 0 5px; }
                .search-btn { background: var(--color-brand-accent); color: white; border: none; padding: 0 24px; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; gap: 8px; align-items: center; white-space: nowrap; }

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
                .pill:hover { background: rgba(62, 97, 255, 0.15); border-color: var(--color-brand-accent); transform: translateY(-2px); }

                .top-employers-bar { background: var(--card-dashboard); border-top: 1px solid var(--border-dashboard); border-bottom: 1px solid var(--border-dashboard); padding: 20px 0; display: flex; align-items: center; overflow: hidden; }
                .bar-label { font-weight: 800; font-size: 0.85rem; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.05em; padding-left: 80px; background: var(--card-dashboard); position: relative; z-index: 2; box-shadow: 10px 0 20px var(--card-dashboard); }
                .marqee-wrapper { flex: 1; overflow: hidden; mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); }
                .logos-scroll { display: flex; gap: 40px; align-items: center; animation: scroll 30s linear infinite; }
                @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
                .employer-logo { font-weight: 900; color: var(--text-muted); opacity: 0.6; font-size: 1rem; cursor: pointer; white-space: nowrap; padding: 8px 16px; transition: 0.3s; }
                .employer-logo:hover { opacity: 1; color: var(--color-brand-accent); }

                .jobs-content { padding: 40px 80px; max-width: 1400px; margin: 0 auto; }
                .content-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
                .view-toggles { display: flex; gap: 8px; background: rgba(0,0,0,0.03); padding: 4px; border-radius: 12px; border: 1px solid var(--border-dashboard); }
                .filter-tab { padding: 8px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 700; border: none; cursor: pointer; background: transparent; color: var(--text-muted); transition: 0.2s; }
                .filter-tab.active { background: white; color: var(--color-brand-accent); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }

                .job-item-card { background: var(--card-dashboard); border: 1px solid var(--border-dashboard); border-radius: 16px; padding: 24px; display: flex; justify-content: space-between; align-items: center; transition: 0.2s; cursor: pointer; margin-bottom: 16px; }
                .job-item-card:hover { border-color: var(--color-brand-accent); box-shadow: var(--shadow-premium); transform: translateY(-2px); }
                .job-main-info { display: flex; gap: 20px; align-items: center; }
                .job-badge { width: 56px; height: 56px; background: var(--bg-dashboard); border-radius: 12px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-dashboard); font-weight: 900; font-size: 1.2rem; overflow: hidden; }
                .job-logo-img { width: 100%; height: 100%; object-fit: contain; }
                .job-title { font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin-bottom: 4px; }
                .job-meta { display: flex; gap: 16px; font-size: 0.88rem; color: var(--text-muted); font-weight: 600; flex-wrap: wrap; }
                .meta-item { display: flex; align-items: center; gap: 6px; }
                .apply-btn { background: var(--color-brand-accent); color: white; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 800; cursor: pointer; display: flex; gap: 8px; align-items: center; transition: 0.2s; }
                .apply-btn:hover { background: #3551d1; }

                .pagination-tray { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 48px; }
                .page-btn { width: 40px; height: 40px; border-radius: 10px; border: 1px solid var(--border-dashboard); background: var(--card-dashboard); font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
                .page-btn.active { background: var(--color-brand-accent); color: white; border-color: var(--color-brand-accent); }
                .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

                .loading-container { display: flex; flex-direction: column; align-items: center; padding: 100px 0; }
                .empty-state { text-align: center; padding: 100px 0; background: var(--card-dashboard); border-radius: 20px; border: 1px dashed var(--border-dashboard); }
            `}</style>

            <div className="hero-section">
                <div className="hero-flex-container">
                    <div className="hero-left">
                        <h1 className="hero-title">
                            Find Your <span>Dream Job</span> in Nepal
                        </h1>
                        <div className="stats-grid">
                            {stats.map((stat, i) => (
                                <div key={i} className="stat-item">
                                    <div className="stat-icon">{stat.icon}</div>
                                    <div className="stat-text">
                                        <span className="val">{stat.value}</span>
                                        <span className="lbl">{stat.label}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="search-bar-wrap">
                            <form onSubmit={handleSearch}>
                                <div className="search-input-group">
                                    <Search size={20} className="text-muted" />
                                    <input
                                        type="text"
                                        placeholder="Job title or keyword..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="search-divider"></div>
                                <div className="search-input-group">
                                    <MapPin size={20} className="text-muted" />
                                    <input
                                        type="text"
                                        placeholder="Location..."
                                        value={locationTerm}
                                        onChange={(e) => setLocationTerm(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="search-btn">
                                    Find Jobs
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="hero-right">
                        <img src={bannerHuman} alt="Find Jobs" className="hero-image" />
                    </div>
                </div>
            </div>

            <div className="top-employers-bar">
                <div className="bar-label">Top Employers</div>
                <div className="marqee-wrapper">
                    <div className="logos-scroll">
                        {[...topEmployers, ...topEmployers, ...topEmployers].map((emp, i) => (
                            <div key={i} className="employer-logo">{emp.logo} {emp.name}</div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="jobs-content">
                <div className="content-header">
                    <div className="header-title" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Star size={22} fill="#EAB308" color="#EAB308" /> Browse Opportunities
                    </div>
                    <div className="view-toggles">
                        {['All', 'Full-time', 'Part-time', 'Remote', 'Contract'].map(type => (
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

                {isLoading ? (
                    <div className="loading-container">
                        <Loader2 size={48} className="animate-spin" color="var(--color-brand-accent)" />
                        <p style={{ marginTop: 20, fontWeight: 600, color: 'var(--text-muted)' }}>Loading jobs...</p>
                    </div>
                ) : currentJobs.length > 0 ? (
                    <div className="jobs-list">
                        {currentJobs.map((job) => (
                            <div key={job.id} className="job-item-card" onClick={() => handleJobClick(job.id)}>
                                <div className="job-main-info">
                                    <div className="job-badge">
                                        {job.Employer?.logo ? (
                                            <img
                                                src={job.Employer.logo.startsWith('http') ? job.Employer.logo : `/uploads/${job.Employer.logo.replace(/^(\/?uploads\/|\/)/, '')}`.replace(/\\/g, '/')}
                                                alt={job.company}
                                                className="job-logo-img"
                                                onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerText = job.company?.charAt(0) || 'J'; }}
                                            />
                                        ) : (
                                            job.company?.charAt(0) || 'J'
                                        )}
                                    </div>
                                    <div>
                                        <div className="job-title">{job.title}</div>
                                        <div className="job-meta">
                                            <span className="meta-item"><Building2 size={14} /> {job.company}</span>
                                            <span className="meta-item"><MapPin size={14} /> {job.location}</span>
                                            <span className="meta-item"><DollarSign size={14} /> {job.salary}</span>
                                            <span className="meta-item"><Briefcase size={14} /> {job.type}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="apply-btn" onClick={(e) => { e.stopPropagation(); handleJobClick(job.id); }}>
                                    View Details <ChevronRight size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <SearchCheck size={64} color="var(--text-muted)" style={{ margin: '0 auto 20px' }} />
                        <h3>No jobs found</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search filters or searching for something else.</p>
                        <button
                            className="apply-btn"
                            style={{ margin: '20px auto 0' }}
                            onClick={() => { setSearchTerm(''); setLocationTerm(''); setJobType('All'); }}
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="pagination-tray">
                        <button
                            className="page-btn"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            className="page-btn"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicFindJobs;
