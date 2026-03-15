import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
    Search, Briefcase, Building2, ChevronRight, SearchCheck, Star,
    MapPin, DollarSign, Zap, ChevronLeft, Heart
} from 'lucide-react';
import { useGetJobs, useGetSavedJobs, useSaveJob, useUnsaveJob } from '@/hooks/api/jobs/useJobs';
import toast from 'react-hot-toast';
import bannerHuman from '@/assets/images/banner-human2.png';
import { useState, useMemo } from 'react';

const COLORS = [
    '#3E61FF', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#EC4899', '#14B8A6', '#F97316', '#6366F1'
];
function colorForName(name) {
    if (!name) return COLORS[0];
    let h = 0;
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return COLORS[Math.abs(h) % COLORS.length];
}

const FindJobs = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [jobType, setJobType] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const CARDS_PER_PAGE = 20;

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

    // Group jobs by employer
    const grouped = useMemo(() => {
        const map = new Map();
        serverJobs.forEach(job => {
            const key = job.Employer?.id || job.company || 'unknown';
            const name = job.Employer?.name || job.company || 'Unknown Company';
            const logo = job.Employer?.logo || null;
            if (!map.has(key)) map.set(key, { key, name, logo, jobs: [] });
            map.get(key).jobs.push(job);
        });
        return Array.from(map.values());
    }, [serverJobs]);

    const totalPages = Math.ceil(grouped.length / CARDS_PER_PAGE);
    const pagedGroups = grouped.slice((currentPage - 1) * CARDS_PER_PAGE, currentPage * CARDS_PER_PAGE);

    const handleJobClick = (jobId) => navigate(`/jobseeker/jobs/${jobId}`);

    return (
        <div className="fj-root">
            <style>{`
                .fj-root { background: var(--bg-dashboard); min-height: 100vh; font-family: 'Inter', sans-serif; }

                /* ── HERO ── */
                .fj-hero { background: var(--bg-main); padding: 0 80px; border-bottom: 1px solid var(--border-dashboard); overflow: hidden; }
                .fj-hero-inner { display: flex; align-items: center; justify-content: space-between; max-width: 1400px; margin: 0 auto; }
                .fj-hero-left { flex: 1; padding: 60px 0; }
                .fj-hero-right { flex: 0 0 auto; display: flex; align-self: flex-end; }
                .fj-hero-img { height: 420px; object-fit: contain; }
                .fj-hero-title { font-size: 2.6rem; font-weight: 900; color: var(--text-main); margin-bottom: 28px; letter-spacing: -0.02em; line-height: 1.15; }
                .fj-hero-title span { color: var(--color-brand-accent); }
                .fj-stats { display: flex; gap: 36px; margin-bottom: 28px; }
                .fj-stat { display: flex; align-items: center; gap: 10px; }
                .fj-stat-icon { width: 42px; height: 42px; border-radius: 50%; background: var(--card-dashboard); display: flex; align-items: center; justify-content: center; color: var(--color-brand-accent); box-shadow: var(--shadow-premium); }
                .fj-stat-val { font-size: 1.3rem; font-weight: 800; color: var(--text-main); display: block; }
                .fj-stat-lbl { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; }
                .fj-search-bar { display: flex; background: var(--card-dashboard); border: 1px solid var(--border-dashboard); border-radius: 12px; padding: 5px; max-width: 580px; box-shadow: var(--shadow-premium); }
                .fj-search-bar input { flex: 1; border: none; padding: 0 18px; font-size: 0.95rem; background: transparent; outline: none; color: var(--text-main); }
                .fj-search-btn { background: var(--color-brand-accent); color: white; border: none; padding: 11px 22px; border-radius: 8px; font-weight: 700; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; gap: 7px; transition: opacity 0.2s; }
                .fj-search-btn:hover { opacity: 0.9; }
                .fj-pills { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 20px; }
                .fj-pill { padding: 7px 16px; border-radius: 100px; font-size: 0.82rem; font-weight: 700; color: var(--color-brand-accent); background: rgba(62,97,255,0.08); border: 1px solid rgba(62,97,255,0.15); cursor: pointer; transition: all 0.25s; }
                .fj-pill:hover { background: rgba(62,97,255,0.15); transform: translateY(-1px); }

                /* ── TICKER ── */
                .fj-ticker { background: var(--card-dashboard); border-top: 1px solid var(--border-dashboard); border-bottom: 1px solid var(--border-dashboard); padding: 18px 0; display: flex; align-items: center; overflow: hidden; }
                .fj-ticker-label { font-size: 0.8rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; white-space: nowrap; padding: 0 32px; background: var(--card-dashboard); z-index: 2; position: relative; box-shadow: 12px 0 18px var(--card-dashboard); }
                .fj-ticker-mask { flex: 1; overflow: hidden; mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent); }
                .fj-ticker-track { display: flex; gap: 36px; align-items: center; animation: fjScroll 32s linear infinite; }
                .fj-ticker-track:hover { animation-play-state: paused; }
                @keyframes fjScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
                .fj-ticker-item { font-size: 0.88rem; font-weight: 700; color: var(--text-muted); opacity: 0.55; white-space: nowrap; cursor: pointer; padding: 6px 12px; border-radius: 7px; transition: all 0.25s; }
                .fj-ticker-item:hover { opacity: 1; color: var(--color-brand-accent); background: rgba(62,97,255,0.07); }

                /* ── CONTENT ── */
                .fj-content { padding: 36px 80px; }
                .fj-content-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
                .fj-section-title { font-size: 1.2rem; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 9px; }
                .fj-type-tabs { display: flex; gap: 4px; background: var(--bg-dashboard); border: 1px solid var(--border-dashboard); border-radius: 10px; padding: 4px; }
                .fj-type-tab { padding: 7px 14px; border-radius: 7px; border: none; font-size: 0.82rem; font-weight: 700; background: transparent; color: var(--text-muted); cursor: pointer; transition: all 0.2s; white-space: nowrap; }
                .fj-type-tab.active { background: var(--card-dashboard); color: var(--color-brand-accent); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
                .fj-type-tab:hover:not(.active) { color: var(--color-brand-accent); background: rgba(62,97,255,0.05); }

                /* ── COMPANY GRID ── */
                .fj-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
                @media (max-width: 1200px) { .fj-grid { grid-template-columns: repeat(3, 1fr); } }
                @media (max-width: 880px) { .fj-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 560px) { .fj-grid { grid-template-columns: 1fr; } .fj-content { padding: 24px 20px; } .fj-hero { padding: 0 20px; } }

                .fj-card { background: var(--card-dashboard); border: 1px solid var(--border-dashboard); border-radius: 10px; padding: 18px 20px; cursor: pointer; transition: all 0.22s cubic-bezier(0.4,0,0.2,1); }
                .fj-card:hover { border-color: var(--color-brand-accent); box-shadow: 0 6px 24px rgba(62,97,255,0.1); transform: translateY(-2px); }
                .fj-card-head { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
                .fj-logo-wrap { width: 48px; height: 48px; border-radius: 8px; border: 1px solid var(--border-dashboard); overflow: hidden; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: var(--bg-dashboard); }
                .fj-logo-img { width: 100%; height: 100%; object-fit: contain; }
                .fj-logo-init { font-size: 1.3rem; font-weight: 900; color: white; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
                .fj-company-name { font-size: 0.9rem; font-weight: 800; color: var(--text-main); line-height: 1.3; }
                .fj-job-count { font-size: 0.72rem; color: var(--text-muted); font-weight: 600; margin-top: 2px; }
                .fj-roles { display: flex; flex-direction: column; gap: 6px; }
                .fj-role { display: flex; align-items: flex-start; gap: 7px; }
                .fj-role-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--color-brand-accent); flex-shrink: 0; margin-top: 6px; }
                .fj-role-link { font-size: 0.82rem; font-weight: 600; color: var(--text-muted); line-height: 1.4; transition: color 0.18s; }
                .fj-card:hover .fj-role-link { color: var(--color-brand-accent); }
                .fj-more-badge { font-size: 0.75rem; font-weight: 700; color: var(--color-brand-accent); background: rgba(62,97,255,0.08); border: 1px solid rgba(62,97,255,0.15); border-radius: 100px; padding: 3px 10px; display: inline-flex; align-items: center; gap: 4px; margin-top: 6px; align-self: flex-start; }

                /* ── LOADING ── */
                .fj-skeleton-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
                .fj-skel-card { background: var(--card-dashboard); border: 1px solid var(--border-dashboard); border-radius: 10px; padding: 18px 20px; }
                .fj-skel-row { height: 12px; border-radius: 6px; background: var(--border-dashboard); margin-bottom: 10px; animation: fjPulse 1.5s ease-in-out infinite; }
                .fj-skel-row.wide { width: 70%; } .fj-skel-row.medium { width: 55%; } .fj-skel-row.narrow { width: 40%; }
                @keyframes fjPulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
                .fj-skel-head { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
                .fj-skel-logo { width: 48px; height: 48px; border-radius: 8px; background: var(--border-dashboard); flex-shrink: 0; animation: fjPulse 1.5s ease-in-out infinite; }

                /* ── EMPTY STATE ── */
                .fj-empty { padding: 80px 40px; text-align: center; background: var(--card-dashboard); border-radius: 14px; border: 1px dashed var(--border-dashboard); }
                .fj-empty-icon { font-size: 3rem; margin-bottom: 16px; }
                .fj-empty-text { font-size: 1rem; font-weight: 700; color: var(--text-muted); }
                .fj-empty-btn { margin-top: 14px; background: transparent; border: none; color: var(--color-brand-accent); font-weight: 700; cursor: pointer; font-size: 0.9rem; }

                /* ── PAGINATION ── */
                .fj-pagination { display: flex; align-items: center; justify-content: space-between; margin-top: 40px; flex-wrap: wrap; gap: 16px; }
                .fj-page-info { font-size: 0.88rem; color: var(--text-muted); font-weight: 600; }
                .fj-page-info strong { color: var(--text-main); }
                .fj-page-btns { display: flex; gap: 6px; }
                .fj-page-btn { width: 38px; height: 38px; border-radius: 9px; border: 1px solid var(--border-dashboard); background: var(--card-dashboard); font-weight: 700; font-size: 0.88rem; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: all 0.18s; }
                .fj-page-btn:hover:not(:disabled):not(.active) { border-color: var(--color-brand-accent); color: var(--color-brand-accent); }
                .fj-page-btn.active { background: var(--color-brand-accent); color: white; border-color: var(--color-brand-accent); }
                .fj-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
            `}</style>

            {/* ── HERO ── */}
            <div className="fj-hero">
                <div className="fj-hero-inner">
                    <div className="fj-hero-left">
                        <h1 className="fj-hero-title">Start your Success Journey <span>Today</span></h1>
                        <div className="fj-stats">
                            {stats.map((s, i) => (
                                <div key={i} className="fj-stat">
                                    <div className="fj-stat-icon">{s.icon}</div>
                                    <div>
                                        <span className="fj-stat-lbl">{s.label}</span>
                                        <span className="fj-stat-val">{s.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="fj-search-bar">
                            <input
                                type="text"
                                placeholder="Search by job title or company..."
                                value={searchTerm}
                                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                            <button className="fj-search-btn"><Search size={16} /> Search</button>
                        </div>
                        <div className="fj-pills">
                            {filterOptions.map((f, i) => <div key={i} className="fj-pill">{f}</div>)}
                        </div>
                    </div>
                    <div className="fj-hero-right">
                        <img src={bannerHuman} alt="Find your dream job" className="fj-hero-img" />
                    </div>
                </div>
            </div>

            {/* ── EMPLOYER TICKER ── */}
            <div className="fj-ticker">
                <div className="fj-ticker-label">Top Employers</div>
                <div className="fj-ticker-mask">
                    <div className="fj-ticker-track">
                        {[...topEmployers, ...topEmployers, ...topEmployers].map((e, i) => (
                            <div key={i} className="fj-ticker-item">{e.logo} {e.name}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── JOBS CONTENT ── */}
            <div className="fj-content">
                <div className="fj-content-header">
                    <div className="fj-section-title">
                        <Star size={20} fill="#EAB308" color="#EAB308" />
                        Jobs by Company
                        {grouped.length > 0 && (
                            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: 4 }}>
                                ({serverJobs.length} openings across {grouped.length} companies)
                            </span>
                        )}
                    </div>
                    <div className="fj-type-tabs">
                        {['All', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'].map(type => (
                            <button
                                key={type}
                                className={`fj-type-tab${jobType === type ? ' active' : ''}`}
                                onClick={() => { setJobType(type); setCurrentPage(1); }}
                            >{type}</button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div className="fj-skeleton-grid">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="fj-skel-card">
                                <div className="fj-skel-head">
                                    <div className="fj-skel-logo" />
                                    <div style={{ flex: 1 }}>
                                        <div className="fj-skel-row wide" />
                                        <div className="fj-skel-row narrow" />
                                    </div>
                                </div>
                                <div className="fj-skel-row medium" />
                                <div className="fj-skel-row wide" />
                                <div className="fj-skel-row narrow" />
                            </div>
                        ))}
                    </div>
                ) : pagedGroups.length > 0 ? (
                    <div className="fj-grid">
                        {pagedGroups.map(group => {
                            const color = colorForName(group.name);
                            const initial = group.name.charAt(0).toUpperCase();
                            const visibleJobs = group.jobs.slice(0, 4);
                            const remainingCount = group.jobs.length - visibleJobs.length;

                            return (
                                <div key={group.key} className="fj-card">
                                    <div className="fj-card-head">
                                        <div className="fj-logo-wrap">
                                            {group.logo ? (
                                                <img
                                                    src={group.logo.startsWith('http') ? group.logo : `http://localhost:5000/uploads/${group.logo.replace(/^(\/?uploads\/|\/)/, '')}`.replace(/\\/g, '/')}
                                                    alt={group.name}
                                                    className="fj-logo-img"
                                                    onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                                />
                                            ) : null}
                                            <div
                                                className="fj-logo-init"
                                                style={{
                                                    background: color,
                                                    display: group.logo ? 'none' : 'flex',
                                                }}
                                            >
                                                {initial}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="fj-company-name">{group.name}</div>
                                            <div className="fj-job-count">{group.jobs.length} open position{group.jobs.length !== 1 ? 's' : ''}</div>
                                        </div>
                                    </div>
                                    <div className="fj-roles">
                                        {visibleJobs.map(job => (
                                            <div
                                                key={job.id}
                                                className="fj-role"
                                                onClick={() => handleJobClick(job.id)}
                                            >
                                                <div className="fj-role-dot" style={{ background: color }} />
                                                <span className="fj-role-link">{job.title}</span>
                                            </div>
                                        ))}
                                        {remainingCount > 0 && (
                                            <div className="fj-more-badge">
                                                +{remainingCount} more <ChevronRight size={11} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="fj-empty">
                        <div className="fj-empty-icon">🔍</div>
                        <div className="fj-empty-text">No jobs found matching your search.</div>
                        <button className="fj-empty-btn" onClick={() => { setSearchTerm(''); setJobType('All'); }}>
                            Clear filters
                        </button>
                    </div>
                )}

                {/* ── PAGINATION ── */}
                {grouped.length > 0 && (
                    <div className="fj-pagination">
                        <div className="fj-page-info">
                            Showing companies{' '}
                            <strong>{(currentPage - 1) * CARDS_PER_PAGE + 1}–{Math.min(currentPage * CARDS_PER_PAGE, grouped.length)}</strong>
                            {' '}of <strong>{grouped.length}</strong>
                        </div>
                        {totalPages > 1 && (
                            <div className="fj-page-btns">
                                <button
                                    className="fj-page-btn"
                                    disabled={currentPage === 1}
                                    onClick={() => { setCurrentPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                                    <button
                                        key={n}
                                        className={`fj-page-btn${currentPage === n ? ' active' : ''}`}
                                        onClick={() => { setCurrentPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    >
                                        {n}
                                    </button>
                                ))}
                                <button
                                    className="fj-page-btn"
                                    disabled={currentPage === totalPages}
                                    onClick={() => { setCurrentPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindJobs;
