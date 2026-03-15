import { useState } from 'react';
import { useGetSavedJobs, useUnsaveJob } from '@/hooks/api/jobs/useJobs';
import {
    Heart, MapPin, DollarSign, Zap, Calendar,
    ChevronRight, Search, Building2, Loader2,
    ArrowUpRight, Bookmark, Clock, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ACCENT_COLORS = [
    '#3E61FF', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#06B6D4', '#EC4899', '#14B8A6',
];
function colorFor(str) {
    if (!str) return ACCENT_COLORS[0];
    let h = 0;
    for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
    return ACCENT_COLORS[Math.abs(h) % ACCENT_COLORS.length];
}
function hex2rgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}
function daysUntil(dateStr) {
    if (!dateStr) return null;
    const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
    // only show deadline for reasonable future dates (within 1 year)
    if (diff > 365) return null;
    return diff;
}

const SavedJobs = () => {
    const navigate = useNavigate();
    const { data: savedJobs = [], isLoading } = useGetSavedJobs();
    const { mutate: unsaveJob } = useUnsaveJob();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('recent');

    const filtered = savedJobs
        .filter(item => {
            const job = item.JobListing || {};
            const q = searchTerm.toLowerCase();
            return (
                job.title?.toLowerCase().includes(q) ||
                job.Employer?.name?.toLowerCase().includes(q) ||
                job.location?.toLowerCase().includes(q)
            );
        });

    const handleUnsave = (e, id) => {
        e.stopPropagation();
        unsaveJob(id, { onSuccess: () => toast.success('Job removed from saved list') });
    };

    const urgentCount = filtered.filter(item => {
        const days = daysUntil(item.JobListing?.deadline);
        return days !== null && days <= 7 && days >= 0;
    }).length;

    return (
        <div className="sj-root">
            <style>{`
                .sj-root { background: var(--bg-dashboard); min-height: 100vh; font-family: 'Inter', sans-serif; }

                /* ── HERO BANNER ── */
                .sj-hero { background: var(--bg-main); border-bottom: 1px solid var(--border-dashboard); padding: 44px 80px; }
                .sj-hero-inner { max-width: 1400px; margin: 0 auto; display: flex; align-items: flex-end; justify-content: space-between; gap: 32px; flex-wrap: wrap; }
                .sj-hero-left {}
                .sj-hero-eyebrow { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; font-weight: 800; color: var(--color-brand-accent); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; }
                .sj-hero-eyebrow-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--color-brand-accent); animation: sjPing 2s ease-in-out infinite; }
                @keyframes sjPing { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.3); } }
                .sj-hero-title { font-size: 2.4rem; font-weight: 900; color: var(--text-main); letter-spacing: -0.025em; margin-bottom: 8px; line-height: 1.1; }
                .sj-hero-sub { font-size: 1rem; color: var(--text-muted); font-weight: 500; }
                .sj-hero-stats { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
                .sj-stat-chip { display: flex; align-items: center; gap: 10px; background: var(--card-dashboard); border: 1px solid var(--border-dashboard); border-radius: 12px; padding: 12px 20px; box-shadow: var(--shadow-premium); }
                .sj-stat-chip-icon { width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center; }
                .sj-stat-chip-val { font-size: 1.4rem; font-weight: 900; color: var(--text-main); line-height: 1; }
                .sj-stat-chip-lbl { font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; }

                /* ── CONTROLS ── */
                .sj-controls { padding: 28px 80px 0; max-width: 1560px; margin: 0 auto; display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
                .sj-search-wrap { position: relative; flex: 1; max-width: 480px; }
                .sj-search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; }
                .sj-search-input { width: 100%; padding: 12px 16px 12px 46px; border-radius: 12px; border: 1px solid var(--border-dashboard); font-size: 0.9rem; font-weight: 500; background: var(--card-dashboard); color: var(--text-main); outline: none; transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box; }
                .sj-search-input::placeholder { color: var(--text-muted); }
                .sj-search-input:focus { border-color: var(--color-brand-accent); box-shadow: 0 0 0 3px rgba(62,97,255,0.12); }
                .sj-sort-tabs { display: flex; gap: 4px; background: var(--card-dashboard); border: 1px solid var(--border-dashboard); border-radius: 10px; padding: 4px; }
                .sj-sort-tab { padding: 8px 14px; border-radius: 7px; border: none; font-size: 0.82rem; font-weight: 700; background: transparent; color: var(--text-muted); cursor: pointer; transition: all 0.2s; white-space: nowrap; }
                .sj-sort-tab.active { background: var(--color-brand-accent); color: white; }
                .sj-count-tag { margin-left: auto; font-size: 0.82rem; font-weight: 700; color: var(--text-muted); white-space: nowrap; }
                .sj-count-tag strong { color: var(--text-main); }

                /* ── GRID ── */
                .sj-grid-wrap { padding: 24px 80px 60px; max-width: 1560px; margin: 0 auto; }
                .sj-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
                @media (max-width: 1200px) { .sj-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 740px) { .sj-grid { grid-template-columns: 1fr; } .sj-controls, .sj-grid-wrap, .sj-hero { padding-left: 20px; padding-right: 20px; } }

                /* ── JOB CARD ── */
                .sj-card { background: var(--card-dashboard); border: 1px solid var(--border-dashboard); border-radius: 16px; padding: 22px; cursor: pointer; transition: all 0.25s cubic-bezier(0.4,0,0.2,1); display: flex; flex-direction: column; gap: 14px; position: relative; overflow: hidden; }
                .sj-card::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: var(--card-accent, transparent); transition: opacity 0.3s; opacity: 0; border-radius: 0 0 16px 16px; }
                .sj-card:hover { border-color: var(--color-brand-accent); box-shadow: 0 8px 28px rgba(62,97,255,0.1); transform: translateY(-3px); }
                .sj-card:hover::after { opacity: 1; }

                /* card top row */
                .sj-card-top { display: flex; align-items: flex-start; gap: 14px; }
                .sj-logo { width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 1.35rem; font-weight: 900; color: white; border: 1px solid rgba(0,0,0,0.06); overflow: hidden; }
                .sj-logo img { width: 100%; height: 100%; object-fit: contain; }
                .sj-card-title-group { flex: 1; min-width: 0; }
                .sj-card-title { font-size: 1rem; font-weight: 800; color: var(--text-main); line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 3px; }
                .sj-card-company { font-size: 0.82rem; font-weight: 600; color: var(--text-muted); }
                .sj-unsave-btn { width: 36px; height: 36px; border-radius: 50%; border: 1px solid #FCA5A5; background: #FEF2F2; color: #EF4444; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
                .sj-unsave-btn:hover { background: #EF4444; color: white; border-color: #EF4444; transform: scale(1.08); }

                /* meta row */
                .sj-meta { display: flex; flex-wrap: wrap; gap: 10px; }
                .sj-meta-pill { display: flex; align-items: center; gap: 5px; font-size: 0.78rem; font-weight: 700; color: var(--text-muted); background: var(--bg-dashboard); border: 1px solid var(--border-dashboard); border-radius: 7px; padding: 4px 10px; }
                .sj-meta-pill.type { color: var(--color-brand-accent); background: rgba(62,97,255,0.07); border-color: rgba(62,97,255,0.15); }

                /* skills */
                .sj-skills { display: flex; flex-wrap: wrap; gap: 6px; }
                .sj-skill { font-size: 0.72rem; font-weight: 700; padding: 3px 9px; border-radius: 6px; background: rgba(62,97,255,0.07); color: var(--color-brand-accent); border: 1px solid rgba(62,97,255,0.14); }

                /* deadline / urgency */
                .sj-deadline { display: flex; align-items: center; gap: 5px; font-size: 0.76rem; font-weight: 700; }
                .sj-deadline.safe { color: var(--text-muted); }
                .sj-deadline.warn { color: #F59E0B; }
                .sj-deadline.danger { color: #EF4444; }

                /* footer action */
                .sj-card-footer { border-top: 1px solid var(--border-dashboard); padding-top: 14px; display: flex; gap: 10px; margin-top: auto; }
                .sj-view-btn { flex: 1; padding: 10px 14px; border-radius: 10px; border: 1.5px solid var(--color-brand-accent); background: transparent; color: var(--color-brand-accent); font-weight: 700; font-size: 0.84rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px; transition: all 0.2s; }
                .sj-view-btn:hover { background: var(--color-brand-accent); color: white; }

                /* ── URGENT BANNER ── */
                .sj-urgent-banner { margin: 24px 80px 0; max-width: 1400px; background: linear-gradient(135deg, rgba(239,68,68,0.07), rgba(245,158,11,0.07)); border: 1px solid rgba(239,68,68,0.2); border-radius: 12px; padding: 14px 20px; display: flex; align-items: center; gap: 12px; }
                .sj-urgent-icon { width: 36px; height: 36px; border-radius: 8px; background: rgba(239,68,68,0.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .sj-urgent-text { font-size: 0.88rem; font-weight: 700; color: var(--text-main); }
                .sj-urgent-text span { color: #EF4444; }

                /* ── SKELETON ── */
                .sj-skel { background: var(--card-dashboard); border: 1px solid var(--border-dashboard); border-radius: 16px; padding: 22px; }
                .sj-skel-bar { height: 12px; border-radius: 6px; background: var(--border-dashboard); margin-bottom: 10px; animation: sjPulse 1.6s ease-in-out infinite; }
                @keyframes sjPulse { 0%,100% { opacity: 0.45; } 50% { opacity: 1; } }
                .sj-skel-head { display: flex; gap: 14px; margin-bottom: 14px; }
                .sj-skel-logo { width: 52px; height: 52px; border-radius: 12px; background: var(--border-dashboard); flex-shrink: 0; animation: sjPulse 1.6s ease-in-out infinite; }

                /* ── EMPTY STATE ── */
                .sj-empty { padding: 80px 40px; text-align: center; max-width: 480px; margin: 0 auto; }
                .sj-empty-orb { width: 96px; height: 96px; border-radius: 50%; background: linear-gradient(135deg, rgba(62,97,255,0.12), rgba(62,97,255,0.05)); border: 2px dashed rgba(62,97,255,0.25); display: flex; align-items: center; justify-content: center; margin: 0 auto 28px; }
                .sj-empty-title { font-size: 1.5rem; font-weight: 800; color: var(--text-main); margin-bottom: 10px; }
                .sj-empty-sub { font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; }
                .sj-empty-btn { margin-top: 24px; display: inline-flex; align-items: center; gap: 8px; padding: 12px 26px; background: var(--color-brand-accent); color: white; border: none; border-radius: 12px; font-weight: 800; font-size: 0.95rem; cursor: pointer; transition: opacity 0.2s; }
                .sj-empty-btn:hover { opacity: 0.88; }
            `}</style>

            {/* ── HERO BANNER ── */}
            <div className="sj-hero">
                <div className="sj-hero-inner">
                    <div className="sj-hero-left">
                        <div className="sj-hero-eyebrow">
                            <div className="sj-hero-eyebrow-dot" />
                            Your Job Wishlist
                        </div>
                        <h1 className="sj-hero-title">Saved Jobs</h1>
                        <p className="sj-hero-sub">Opportunities you've bookmarked — apply before they close.</p>
                    </div>
                    <div className="sj-hero-stats">
                        <div className="sj-stat-chip">
                            <div className="sj-stat-chip-icon" style={{ background: 'rgba(62,97,255,0.1)' }}>
                                <Bookmark size={18} color="#3E61FF" />
                            </div>
                            <div>
                                <div className="sj-stat-chip-val">{savedJobs.length}</div>
                                <div className="sj-stat-chip-lbl">Total Saved</div>
                            </div>
                        </div>
                        {urgentCount > 0 && (
                            <div className="sj-stat-chip">
                                <div className="sj-stat-chip-icon" style={{ background: 'rgba(239,68,68,0.1)' }}>
                                    <Clock size={18} color="#EF4444" />
                                </div>
                                <div>
                                    <div className="sj-stat-chip-val" style={{ color: '#EF4444' }}>{urgentCount}</div>
                                    <div className="sj-stat-chip-lbl">Expiring Soon</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── URGENT NOTICE ── */}
            {urgentCount > 0 && (
                <div className="sj-urgent-banner">
                    <div className="sj-urgent-icon"><Clock size={18} color="#EF4444" /></div>
                    <div className="sj-urgent-text">
                        <span>{urgentCount} job{urgentCount > 1 ? 's' : ''}</span> in your saved list {urgentCount > 1 ? 'are' : 'is'} expiring within 7 days — apply soon!
                    </div>
                </div>
            )}

            {/* ── CONTROLS ── */}
            <div className="sj-controls">
                <div className="sj-search-wrap">
                    <Search size={17} className="sj-search-icon" />
                    <input
                        className="sj-search-input"
                        placeholder="Search by title, company or location..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                {filtered.length > 0 && (
                    <div className="sj-count-tag">
                        <strong>{filtered.length}</strong> job{filtered.length !== 1 ? 's' : ''} saved
                    </div>
                )}
            </div>

            {/* ── GRID / LOADING / EMPTY ── */}
            <div className="sj-grid-wrap">
                {isLoading ? (
                    <div className="sj-grid">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="sj-skel">
                                <div className="sj-skel-head">
                                    <div className="sj-skel-logo" />
                                    <div style={{ flex: 1 }}>
                                        <div className="sj-skel-bar" style={{ width: '65%' }} />
                                        <div className="sj-skel-bar" style={{ width: '40%' }} />
                                    </div>
                                </div>
                                <div className="sj-skel-bar" style={{ width: '80%' }} />
                                <div className="sj-skel-bar" style={{ width: '55%' }} />
                                <div className="sj-skel-bar" style={{ width: '70%', marginTop: 8 }} />
                            </div>
                        ))}
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="sj-grid">
                        {filtered.map(item => {
                            const job = item.JobListing || {};
                            const employer = job.Employer || {};
                            const color = colorFor(employer.name || job.title);
                            const days = daysUntil(job.deadline);
                            const deadlineClass = days === null ? '' : days <= 3 ? 'danger' : days <= 7 ? 'warn' : 'safe';
                            const skills = Array.isArray(job.skills) ? job.skills : [];

                            return (
                                <div
                                    key={item.id}
                                    className="sj-card"
                                    style={{ '--card-accent': color }}
                                    onClick={() => navigate(`/jobseeker/jobs/${job.id}`)}
                                >
                                    {/* Top row: logo + title + unsave */}
                                    <div className="sj-card-top">
                                        <div className="sj-logo" style={{ background: employer.logo ? '#F8FAFC' : `linear-gradient(135deg, ${color}, ${hex2rgba(color, 0.7)})` }}>
                                            {employer.logo ? (
                                                <img src={employer.logo.startsWith('http') ? employer.logo : `http://localhost:5000/uploads/${employer.logo.replace(/^(\/?uploads\/|\/)/, '')}`.replace(/\\/g, '/')} alt={employer.name} />
                                            ) : (
                                                (employer.name || job.title || 'J').charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div className="sj-card-title-group">
                                            <div className="sj-card-title">{job.title}</div>
                                            <div className="sj-card-company">
                                                <Building2 size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                                                {employer.name || 'Nexus Partner'}
                                            </div>
                                        </div>
                                        <button
                                            className="sj-unsave-btn"
                                            onClick={e => handleUnsave(e, job.id)}
                                            title="Remove from saved"
                                        >
                                            <Heart size={16} fill="#EF4444" color="#EF4444" />
                                        </button>
                                    </div>

                                    {/* Meta pills */}
                                    <div className="sj-meta">
                                        {job.location && (
                                            <div className="sj-meta-pill">
                                                <MapPin size={12} /> {job.location}
                                            </div>
                                        )}
                                        {(job.jobType || job.type) && (
                                            <div className="sj-meta-pill type">
                                                <Zap size={12} /> {job.jobType || job.type}
                                            </div>
                                        )}
                                        {job.salary && (
                                            <div className="sj-meta-pill">
                                                <DollarSign size={12} /> {job.salary}
                                            </div>
                                        )}
                                    </div>

                                    {/* Skills */}
                                    {skills.length > 0 && (
                                        <div className="sj-skills">
                                            {skills.slice(0, 4).map((s, i) => (
                                                <span key={i} className="sj-skill">{s}</span>
                                            ))}
                                            {skills.length > 4 && <span className="sj-skill">+{skills.length - 4}</span>}
                                        </div>
                                    )}

                                    {/* Deadline */}
                                    {days !== null && (
                                        <div className={`sj-deadline ${deadlineClass}`}>
                                            <Clock size={13} />
                                            {days < 0
                                                ? 'Deadline passed'
                                                : days === 0
                                                    ? 'Closes today!'
                                                    : days === 1
                                                        ? 'Closes tomorrow'
                                                        : `${days} days left to apply`}
                                        </div>
                                    )}

                                    {/* CTA */}
                                    <div className="sj-card-footer">
                                        <button
                                            className="sj-view-btn"
                                            onClick={e => { e.stopPropagation(); navigate(`/jobseeker/jobs/${job.id}`); }}
                                        >
                                            View Details <ArrowUpRight size={15} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="sj-empty">
                        <div className="sj-empty-orb">
                            {searchTerm ? <Search size={36} color="#3E61FF" /> : <Heart size={36} color="#3E61FF" />}
                        </div>
                        <div className="sj-empty-title">
                            {searchTerm ? 'No matches found' : 'No saved jobs yet'}
                        </div>
                        <div className="sj-empty-sub">
                            {searchTerm
                                ? `No jobs match "${searchTerm}". Try a different search term.`
                                : "You haven't bookmarked any jobs yet. Start exploring and save jobs that interest you!"}
                        </div>
                        {!searchTerm && (
                            <button className="sj-empty-btn" onClick={() => navigate('/jobseeker/find-jobs')}>
                                <Sparkles size={16} /> Browse Jobs
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedJobs;
