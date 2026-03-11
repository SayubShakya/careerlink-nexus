import React, { useState, useMemo } from 'react';
import {
    Briefcase, Search, MapPin, Eye,
    Users as UsersIcon, ChevronLeft, ChevronRight,
    Clock, Building2, X, Calendar, DollarSign,
    TrendingUp, BarChart3, ArrowUpRight, Filter,
    CheckCircle2, XCircle, Layers, Globe
} from 'lucide-react';
import { useGetAllJobs } from '@/hooks/api/admin/useAdmin';

/* ── Mini Sky Scene ── */
const PageHeroSky = ({ timeOfDay }) => (
    <div className="jb-sky-scene">
        {timeOfDay === 'night' && (
            <>
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="jb-star" style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${1.5 + Math.random() * 2}s`,
                        width: `${2 + Math.random() * 2}px`,
                        height: `${2 + Math.random() * 2}px`,
                    }} />
                ))}
                <div className="jb-moon">
                    <div className="jb-moon-crater" style={{ width: 8, height: 8, top: 8, left: 12 }} />
                    <div className="jb-moon-crater" style={{ width: 5, height: 5, top: 18, left: 6 }} />
                    <div className="jb-moon-crater" style={{ width: 4, height: 4, top: 12, left: 22 }} />
                </div>
                <div className="jb-moon-glow" />
            </>
        )}
        {timeOfDay === 'morning' && (
            <>
                <div className="jb-sun jb-morning-sun">
                    <div className="jb-sun-ray" />
                    <div className="jb-sun-ray" style={{ transform: 'rotate(60deg)' }} />
                    <div className="jb-sun-ray" style={{ transform: 'rotate(120deg)' }} />
                </div>
                <div className="jb-sun-glow jb-morning-glow" />
                <div className="jb-cloud jb-cloud-1" />
                <div className="jb-cloud jb-cloud-2" />
            </>
        )}
        {timeOfDay === 'afternoon' && (
            <>
                <div className="jb-sun jb-afternoon-sun" />
                <div className="jb-sun-glow jb-afternoon-glow" />
                <div className="jb-cloud jb-cloud-1" />
                <div className="jb-cloud jb-cloud-3" />
            </>
        )}
        {timeOfDay === 'evening' && (
            <>
                <div className="jb-sunset-orb" />
                <div className="jb-sunset-glow" />
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="jb-star" style={{
                        left: `${15 + Math.random() * 65}%`,
                        top: `${5 + Math.random() * 45}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        width: '2px', height: '2px',
                    }} />
                ))}
                <div className="jb-cloud jb-cloud-ev" />
            </>
        )}
    </div>
);

/* ── Stat Pill ── */
const StatPill = ({ label, value, icon, color, bg }) => (
    <div className="jb-stat-pill" style={{ background: bg, borderColor: `${color}20` }}>
        <div className="jb-sp-icon" style={{ color }}>{icon}</div>
        <div className="jb-sp-info">
            <span className="jb-sp-value">{value}</span>
            <span className="jb-sp-label">{label}</span>
        </div>
    </div>
);

const AdminJobs = () => {
    const { data: jobs = [], isLoading } = useGetAllJobs();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [selectedJob, setSelectedJob] = useState(null);
    const perPage = 8;

    const hour = new Date().getHours();
    const timeOfDay = hour >= 5 && hour < 12 ? 'morning' : hour >= 12 && hour < 17 ? 'afternoon' : hour >= 17 && hour < 20 ? 'evening' : 'night';

    const filtered = useMemo(() => jobs.filter(job => {
        const q = search.toLowerCase();
        const matchSearch = job.title?.toLowerCase().includes(q) ||
            job.Employer?.companyName?.toLowerCase().includes(q) ||
            job.location?.toLowerCase().includes(q);
        const matchFilter = filter === 'all' ||
            (filter === 'active' && job.is_active) ||
            (filter === 'inactive' && !job.is_active);
        return matchSearch && matchFilter;
    }), [jobs, search, filter]);

    const totalPages = Math.ceil(filtered.length / perPage);
    const current = filtered.slice((page - 1) * perPage, page * perPage);
    const activeCount = jobs.filter(j => j.is_active).length;
    const inactiveCount = jobs.length - activeCount;

    const getCompanyColor = (name) => {
        const colors = [
            { bg: '#EEF2FF', color: '#6366F1', grad: 'linear-gradient(135deg, #6366F1, #818CF8)' },
            { bg: '#ECFDF5', color: '#059669', grad: 'linear-gradient(135deg, #10B981, #34D399)' },
            { bg: '#FEF3C7', color: '#D97706', grad: 'linear-gradient(135deg, #F59E0B, #FBBF24)' },
            { bg: '#FCE7F3', color: '#DB2777', grad: 'linear-gradient(135deg, #EC4899, #F472B6)' },
            { bg: '#E0E7FF', color: '#4338CA', grad: 'linear-gradient(135deg, #4F46E5, #6366F1)' },
            { bg: '#CFFAFE', color: '#0891B2', grad: 'linear-gradient(135deg, #06B6D4, #22D3EE)' },
        ];
        const idx = (name || '?').charCodeAt(0) % colors.length;
        return colors[idx];
    };

    const getJobTypeBadge = (type) => {
        const t = (type || '').toLowerCase();
        if (t.includes('full')) return { label: 'Full-time', bg: '#ECFDF5', color: '#059669', border: '#D1FAE5' };
        if (t.includes('part')) return { label: 'Part-time', bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' };
        if (t.includes('contract')) return { label: 'Contract', bg: '#EDE9FE', color: '#7C3AED', border: '#DDD6FE' };
        if (t.includes('intern')) return { label: 'Internship', bg: '#FCE7F3', color: '#DB2777', border: '#FBCFE8' };
        if (t.includes('remote')) return { label: 'Remote', bg: '#E0E7FF', color: '#4338CA', border: '#C7D2FE' };
        return { label: type || 'N/A', bg: '#F3F4F6', color: '#6B7280', border: '#E5E7EB' };
    };

    return (
        <>
            <div className="jb-page">
                {/* ── Hero Banner ── */}
                <div className={`jb-hero jb-hero-${timeOfDay}`}>
                    <PageHeroSky timeOfDay={timeOfDay} />
                    <div className="jb-hero-content">
                        <div className="jb-hero-left">
                            <span className="jb-hero-badge"><Briefcase size={12} /> Job Listings</span>
                            <h1 className="jb-hero-title">All Jobs</h1>
                            <p className="jb-hero-desc">Browse and monitor all job postings across the platform.</p>
                        </div>
                        <div className="jb-hero-right">
                            <div className="jb-hero-stats">
                                <div className="jb-hero-stat-card">
                                    <div className="jb-hsc-icon green"><CheckCircle2 size={16} /></div>
                                    <span className="jb-hsc-val green">{activeCount}</span>
                                    <span className="jb-hsc-label">Active</span>
                                </div>
                                <div className="jb-hero-stat-card">
                                    <div className="jb-hsc-icon red"><XCircle size={16} /></div>
                                    <span className="jb-hsc-val">{inactiveCount}</span>
                                    <span className="jb-hsc-label">Inactive</span>
                                </div>
                                <div className="jb-hero-stat-card">
                                    <div className="jb-hsc-icon amber"><Layers size={16} /></div>
                                    <span className="jb-hsc-val">{jobs.length}</span>
                                    <span className="jb-hsc-label">Total</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Quick Stats ── */}
                <div className="jb-quick-stats">
                    <StatPill label="Total Views" value={jobs.reduce((a, j) => a + (j.views || 0), 0)} icon={<Eye size={16} />} color="#6366F1" bg="#EEF2FF" />
                    <StatPill label="Applications" value={jobs.reduce((a, j) => a + (j.totalApplications || 0), 0)} icon={<UsersIcon size={16} />} color="#EC4899" bg="#FDF2F8" />
                    <StatPill label="Companies" value={[...new Set(jobs.map(j => j.Employer?.companyName).filter(Boolean))].length} icon={<Building2 size={16} />} color="#F59E0B" bg="#FFFBEB" />
                    <StatPill label="Active Rate" value={jobs.length ? `${Math.round((activeCount / jobs.length) * 100)}%` : '0%'} icon={<TrendingUp size={16} />} color="#10B981" bg="#ECFDF5" />
                </div>

                {/* ── Controls ── */}
                <div className="jb-controls">
                    <div className="jb-search-wrap">
                        <Search size={18} className="jb-search-icon" />
                        <input
                            type="text"
                            className="jb-search-input"
                            placeholder="Search jobs by title, company, or location..."
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                        />
                        {search && (
                            <button className="jb-search-clear" onClick={() => { setSearch(''); setPage(1); }}>
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    <div className="jb-filter-group">
                        <Filter size={14} className="jb-filter-icon" />
                        {[
                            { key: 'all', label: 'All Jobs', count: jobs.length },
                            { key: 'active', label: 'Active', count: activeCount },
                            { key: 'inactive', label: 'Inactive', count: inactiveCount },
                        ].map(t => (
                            <button key={t.key} className={`jb-filter-btn ${filter === t.key ? 'active' : ''}`}
                                onClick={() => { setFilter(t.key); setPage(1); }}>
                                {t.label}<span className="jb-filter-count">{t.count}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Results bar ── */}
                <div className="jb-results-bar">
                    <span className="jb-results-text">
                        Showing <strong>{(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)}</strong> of <strong>{filtered.length}</strong> jobs
                    </span>
                    {search && (
                        <span className="jb-search-tag">Results for "{search}"
                            <button onClick={() => setSearch('')}><X size={12} /></button>
                        </span>
                    )}
                </div>

                {/* ── Job Cards Grid ── */}
                {isLoading ? (
                    <div className="jb-empty-state"><div className="jb-spinner" /><span>Loading job listings...</span></div>
                ) : current.length === 0 ? (
                    <div className="jb-empty-state">
                        <div className="jb-empty-icon"><Briefcase size={40} /></div>
                        <h3>No jobs found</h3><p>Try adjusting your search or filter criteria.</p>
                    </div>
                ) : (
                    <div className="jb-cards-grid">
                        {current.map((job, i) => {
                            const compColor = getCompanyColor(job.Employer?.companyName);
                            const typeBadge = getJobTypeBadge(job.jobType);
                            return (
                                <div key={job.id} className="jb-card" style={{ animationDelay: `${i * 0.04}s` }} onClick={() => setSelectedJob(job)}>
                                    <div className="jb-card-accent" style={{ background: compColor.grad }} />
                                    <div className="jb-card-top">
                                        <div className="jb-card-company">
                                            <div className="jb-card-comp-avatar" style={{ background: compColor.grad }}>{(job.Employer?.companyName || '?')[0]}</div>
                                            <span className="jb-card-comp-name">{job.Employer?.companyName || 'Unknown'}</span>
                                        </div>
                                        <span className={`jb-card-status ${job.is_active ? 'active' : 'inactive'}`}>
                                            <span className="jb-card-status-dot" />{job.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <h3 className="jb-card-title">{job.title}</h3>
                                    <div className="jb-card-meta">
                                        <span className="jb-card-meta-item"><MapPin size={13} /> {job.location || 'Not specified'}</span>
                                        <span className="jb-card-type-badge" style={{ background: typeBadge.bg, color: typeBadge.color, borderColor: typeBadge.border }}>{typeBadge.label}</span>
                                    </div>
                                    {job.salary && <div className="jb-card-salary"><DollarSign size={13} /> {job.salary}</div>}
                                    <div className="jb-card-divider" />
                                    <div className="jb-card-footer">
                                        <div className="jb-card-stat"><Eye size={14} /><span className="jb-card-stat-val">{job.views || 0}</span><span className="jb-card-stat-label">views</span></div>
                                        <div className="jb-card-stat"><UsersIcon size={14} /><span className="jb-card-stat-val">{job.totalApplications || 0}</span><span className="jb-card-stat-label">applicants</span></div>
                                        <button className="jb-card-view-btn" onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }}>View <ArrowUpRight size={13} /></button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                    <div className="jb-pagination">
                        <button className="jb-pg-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={16} /> Previous</button>
                        <div className="jb-pg-numbers">
                            {[...Array(totalPages)].map((_, i) => (
                                <button key={i} className={`jb-pg-num ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
                            ))}
                        </div>
                        <button className="jb-pg-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next <ChevronRight size={16} /></button>
                    </div>
                )}
            </div>

            {/* ── JOB DETAIL MODAL ── */}
            {selectedJob && (() => {
                const compColor = getCompanyColor(selectedJob.Employer?.companyName);
                return (
                    <div className="jb-overlay" onClick={() => setSelectedJob(null)}>
                        <div className="jb-modal" onClick={e => e.stopPropagation()}>
                            <div className="jb-modal-header" style={{ background: compColor.grad }}>
                                <div className="jb-modal-header-content">
                                    <div className="jb-modal-comp">
                                        <div className="jb-modal-comp-avatar">{(selectedJob.Employer?.companyName || '?')[0]}</div>
                                        <div>
                                            <div className="jb-modal-comp-name">{selectedJob.Employer?.companyName || 'Unknown Company'}</div>
                                            <div className="jb-modal-comp-email">{selectedJob.Employer?.email || ''}</div>
                                        </div>
                                    </div>
                                    <button className="jb-modal-close" onClick={() => setSelectedJob(null)}><X size={18} /></button>
                                </div>
                            </div>
                            <div className="jb-modal-body">
                                <div className="jb-modal-title-row">
                                    <h2 className="jb-modal-title">{selectedJob.title}</h2>
                                    <span className={`jb-card-status ${selectedJob.is_active ? 'active' : 'inactive'}`} style={{ fontSize: '0.72rem' }}>
                                        <span className="jb-card-status-dot" />{selectedJob.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="jb-modal-info-grid">
                                    <div className="jb-modal-info-item"><MapPin size={15} /><div><span className="jb-modal-info-label">Location</span><span className="jb-modal-info-value">{selectedJob.location || 'Not specified'}</span></div></div>
                                    <div className="jb-modal-info-item"><Clock size={15} /><div><span className="jb-modal-info-label">Job Type</span><span className="jb-modal-info-value">{selectedJob.jobType || 'N/A'}</span></div></div>
                                    {selectedJob.salary && <div className="jb-modal-info-item"><DollarSign size={15} /><div><span className="jb-modal-info-label">Salary</span><span className="jb-modal-info-value">{selectedJob.salary}</span></div></div>}
                                    <div className="jb-modal-info-item"><Calendar size={15} /><div><span className="jb-modal-info-label">Posted</span><span className="jb-modal-info-value">{selectedJob.createdAt ? new Date(selectedJob.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span></div></div>
                                </div>
                                <div className="jb-modal-stats">
                                    <div className="jb-modal-stat"><div className="jb-modal-stat-icon views"><Eye size={18} /></div><div className="jb-modal-stat-val">{selectedJob.views || 0}</div><div className="jb-modal-stat-label">Total Views</div></div>
                                    <div className="jb-modal-stat"><div className="jb-modal-stat-icon apps"><UsersIcon size={18} /></div><div className="jb-modal-stat-val">{selectedJob.totalApplications || 0}</div><div className="jb-modal-stat-label">Applications</div></div>
                                    <div className="jb-modal-stat"><div className="jb-modal-stat-icon rate"><BarChart3 size={18} /></div><div className="jb-modal-stat-val">{selectedJob.views ? `${Math.round(((selectedJob.totalApplications || 0) / selectedJob.views) * 100)}%` : '0%'}</div><div className="jb-modal-stat-label">Apply Rate</div></div>
                                </div>
                                {selectedJob.description && <div className="jb-modal-section"><h4 className="jb-modal-section-title">Job Description</h4><p className="jb-modal-section-text">{selectedJob.description}</p></div>}
                                {selectedJob.requirements && <div className="jb-modal-section"><h4 className="jb-modal-section-title">Requirements</h4><p className="jb-modal-section-text">{selectedJob.requirements}</p></div>}
                            </div>
                        </div>
                    </div>
                );
            })()}

            <style>{`
                .jb-page { padding: 28px 36px; min-height: 100vh; background: #F8FAFC; }
                .jb-hero { border-radius: 22px; padding: 38px 48px; margin-bottom: 22px; position: relative; overflow: hidden; animation: jbFadeUp 0.5s ease both; min-height: 150px; }
                .jb-hero-morning { background: linear-gradient(135deg, #1e3a5f 0%, #3d6f8e 30%, #87CEEB 60%, #FFE4B5 90%); }
                .jb-hero-afternoon { background: linear-gradient(135deg, #1565C0 0%, #42A5F5 40%, #90CAF9 70%, #E3F2FD 100%); }
                .jb-hero-evening { background: linear-gradient(135deg, #1a0533 0%, #4a1942 25%, #c2185b 50%, #ff6f00 75%, #ffab40 100%); }
                .jb-hero-night { background: linear-gradient(135deg, #020111 0%, #0a0e2a 30%, #141852 60%, #1b2240 100%); }
                .jb-hero-content { position: relative; z-index: 2; display: flex; justify-content: space-between; align-items: center; }
                .jb-hero-left { color: white; }
                .jb-hero-badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; font-size: 0.65rem; font-weight: 600; color: rgba(255,255,255,0.8); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 14px; backdrop-filter: blur(8px); }
                .jb-hero-title { font-size: 1.85rem; font-weight: 700; color: #FFFFFF; letter-spacing: -0.03em; margin-bottom: 6px; text-shadow: 0 2px 10px rgba(0,0,0,0.25); }
                .jb-hero-desc { font-size: 0.9rem; color: rgba(255,255,255,0.55); line-height: 1.5; }
                .jb-hero-stats { display: flex; gap: 10px; }
                .jb-hero-stat-card { background: rgba(255,255,255,0.08); backdrop-filter: blur(14px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 14px 20px; text-align: center; min-width: 90px; transition: all 0.2s; }
                .jb-hero-stat-card:hover { background: rgba(255,255,255,0.12); transform: translateY(-2px); }
                .jb-hsc-icon { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 0 auto 6px; }
                .jb-hsc-icon.green { background: rgba(16,185,129,0.15); color: #34D399; }
                .jb-hsc-icon.red { background: rgba(239,68,68,0.15); color: #F87171; }
                .jb-hsc-icon.amber { background: rgba(245,158,11,0.15); color: #FBBF24; }
                .jb-hsc-val { display: block; font-size: 1.5rem; font-weight: 700; color: white; letter-spacing: -0.03em; }
                .jb-hsc-val.green { color: #34D399; }
                .jb-hsc-label { font-size: 0.58rem; font-weight: 600; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.06em; }
                .jb-sky-scene { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
                .jb-star { position: absolute; background: white; border-radius: 50%; animation: jbTwinkle 2s ease-in-out infinite alternate; box-shadow: 0 0 4px rgba(255,255,255,0.5); }
                .jb-moon { position: absolute; top: 14px; right: 200px; width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #f5f3ce 0%, #e8e4b8 50%, #d4d0a0 100%); box-shadow: 0 0 25px rgba(245,243,206,0.35), inset -3px -2px 6px rgba(0,0,0,0.06); animation: jbMoonFloat 6s ease-in-out infinite; }
                .jb-moon-crater { position: absolute; border-radius: 50%; background: rgba(0,0,0,0.05); }
                .jb-moon-glow { position: absolute; top: 0; right: 185px; width: 65px; height: 65px; border-radius: 50%; background: radial-gradient(circle, rgba(245,243,206,0.12) 0%, transparent 70%); }
                .jb-sun { position: absolute; border-radius: 50%; animation: jbSunPulse 4s ease-in-out infinite; }
                .jb-morning-sun { top: 12px; right: 210px; width: 38px; height: 38px; background: radial-gradient(circle, #FFD93D 30%, #FF9A3C 70%); box-shadow: 0 0 35px rgba(255,217,61,0.45); }
                .jb-sun-ray { position: absolute; top: 50%; left: 50%; width: 70px; height: 2px; background: linear-gradient(90deg, transparent, rgba(255,217,61,0.25), transparent); transform-origin: center; margin-left: -35px; margin-top: -1px; animation: jbRayRotate 10s linear infinite; }
                .jb-afternoon-sun { top: 8px; right: 215px; width: 32px; height: 32px; background: radial-gradient(circle, #fff 20%, #FFD93D 60%); box-shadow: 0 0 45px rgba(255,217,61,0.5); }
                .jb-sun-glow { position: absolute; border-radius: 50%; }
                .jb-morning-glow { top: -15px; right: 185px; width: 85px; height: 85px; background: radial-gradient(circle, rgba(255,217,61,0.12) 0%, transparent 70%); }
                .jb-afternoon-glow { top: -20px; right: 190px; width: 90px; height: 90px; background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%); }
                .jb-sunset-orb { position: absolute; bottom: 5px; right: 230px; width: 50px; height: 25px; border-radius: 50px 50px 0 0; background: radial-gradient(circle at 50% 100%, #FF6B35, #FF1744); box-shadow: 0 0 35px rgba(255,107,53,0.45); animation: jbSunsetPulse 5s ease-in-out infinite; }
                .jb-sunset-glow { position: absolute; bottom: -25px; right: 195px; width: 140px; height: 90px; background: radial-gradient(ellipse at 50% 100%, rgba(255,107,53,0.15) 0%, transparent 70%); }
                .jb-cloud { position: absolute; border-radius: 30px; }
                .jb-cloud::before, .jb-cloud::after { content: ''; position: absolute; border-radius: 50%; background: inherit; }
                .jb-cloud-1 { width: 55px; height: 15px; top: 22px; right: 65px; background: rgba(255,255,255,0.1); animation: jbCloudDrift 18s ease-in-out infinite; }
                .jb-cloud-1::before { width: 24px; height: 24px; top: -11px; left: 9px; }
                .jb-cloud-1::after { width: 18px; height: 18px; top: -7px; left: 26px; }
                .jb-cloud-2 { width: 42px; height: 12px; top: 55px; right: 135px; background: rgba(255,255,255,0.07); animation: jbCloudDrift 24s ease-in-out infinite reverse; }
                .jb-cloud-2::before { width: 18px; height: 18px; top: -8px; left: 7px; }
                .jb-cloud-2::after { width: 14px; height: 14px; top: -6px; left: 20px; }
                .jb-cloud-3 { width: 48px; height: 13px; bottom: 20px; right: 95px; background: rgba(255,255,255,0.06); animation: jbCloudDrift 20s ease-in-out infinite; }
                .jb-cloud-3::before { width: 20px; height: 20px; top: -10px; left: 8px; }
                .jb-cloud-3::after { width: 16px; height: 16px; top: -7px; left: 24px; }
                .jb-cloud-ev { width: 60px; height: 14px; top: 35px; right: 55px; background: rgba(255,150,100,0.1); animation: jbCloudDrift 20s ease-in-out infinite; }
                .jb-cloud-ev::before { width: 24px; height: 24px; top: -10px; left: 10px; background: rgba(255,150,100,0.1); }
                .jb-cloud-ev::after { width: 18px; height: 18px; top: -7px; left: 30px; background: rgba(255,150,100,0.1); }
                .jb-quick-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 22px; animation: jbFadeUp 0.4s ease 0.06s both; }
                .jb-stat-pill { display: flex; align-items: center; gap: 14px; padding: 16px 20px; border-radius: 14px; border: 1px solid; transition: all 0.2s; }
                .jb-stat-pill:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.05); }
                .jb-sp-icon { flex-shrink: 0; }
                .jb-sp-value { display: block; font-size: 1.25rem; font-weight: 700; color: #111827; letter-spacing: -0.02em; }
                .jb-sp-label { font-size: 0.7rem; color: #6B7280; font-weight: 500; }
                .jb-controls { display: flex; gap: 14px; margin-bottom: 14px; flex-wrap: wrap; animation: jbFadeUp 0.4s ease 0.08s both; }
                .jb-search-wrap { position: relative; flex: 1; min-width: 280px; }
                .jb-search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #9CA3AF; pointer-events: none; }
                .jb-search-input { width: 100%; padding: 12px 42px 12px 46px; background: white; border: 1px solid #E5E7EB; border-radius: 14px; font-size: 0.88rem; color: #111827; outline: none; transition: all 0.25s; font-family: inherit; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
                .jb-search-input::placeholder { color: #9CA3AF; }
                .jb-search-input:focus { border-color: #F59E0B; box-shadow: 0 0 0 3px rgba(245,158,11,0.08), 0 2px 8px rgba(0,0,0,0.04); }
                .jb-search-clear { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 24px; height: 24px; border-radius: 6px; border: none; background: #F3F4F6; color: #6B7280; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
                .jb-search-clear:hover { background: #E5E7EB; color: #111827; }
                .jb-filter-group { display: flex; align-items: center; gap: 4px; padding: 4px 8px 4px 14px; background: white; border-radius: 14px; border: 1px solid #E5E7EB; }
                .jb-filter-icon { color: #9CA3AF; flex-shrink: 0; }
                .jb-filter-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 10px; border: none; background: transparent; color: #6B7280; cursor: pointer; font-size: 0.78rem; font-weight: 500; transition: all 0.2s; font-family: inherit; white-space: nowrap; }
                .jb-filter-btn.active { background: linear-gradient(135deg, #F59E0B, #D97706); color: white; box-shadow: 0 3px 10px rgba(245,158,11,0.25); }
                .jb-filter-btn:hover:not(.active) { color: #111827; background: #F9FAFB; }
                .jb-filter-count { padding: 1px 7px; border-radius: 6px; font-size: 0.65rem; font-weight: 700; }
                .jb-filter-btn.active .jb-filter-count { background: rgba(255,255,255,0.25); color: white; }
                .jb-filter-btn:not(.active) .jb-filter-count { background: #F3F4F6; color: #9CA3AF; }
                .jb-results-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; animation: jbFadeUp 0.4s ease 0.1s both; }
                .jb-results-text { font-size: 0.78rem; color: #6B7280; }
                .jb-results-text strong { color: #111827; font-weight: 600; }
                .jb-search-tag { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px 3px 12px; border-radius: 8px; background: #FFFBEB; border: 1px solid #FDE68A; font-size: 0.72rem; color: #92400E; font-weight: 500; }
                .jb-search-tag button { border: none; background: transparent; color: #D97706; cursor: pointer; display: flex; padding: 2px; }
                .jb-cards-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; }
                .jb-card { background: white; border-radius: 18px; border: 1px solid #E5E7EB; padding: 0; overflow: hidden; cursor: pointer; transition: all 0.25s ease; animation: jbFadeUp 0.4s ease both; position: relative; }
                .jb-card:hover { border-color: #D1D5DB; box-shadow: 0 10px 30px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.03); transform: translateY(-4px); }
                .jb-card-accent { height: 4px; width: 100%; transition: height 0.2s; }
                .jb-card:hover .jb-card-accent { height: 5px; }
                .jb-card-top { display: flex; justify-content: space-between; align-items: center; padding: 18px 22px 0; }
                .jb-card-company { display: flex; align-items: center; gap: 10px; }
                .jb-card-comp-avatar { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.8rem; box-shadow: 0 3px 8px rgba(0,0,0,0.1); transition: transform 0.2s; }
                .jb-card:hover .jb-card-comp-avatar { transform: scale(1.08); }
                .jb-card-comp-name { font-size: 0.78rem; color: #6B7280; font-weight: 500; }
                .jb-card-status { display: inline-flex; align-items: center; gap: 5px; padding: 4px 11px; border-radius: 20px; font-size: 0.65rem; font-weight: 600; }
                .jb-card-status.active { background: #ECFDF5; color: #059669; border: 1px solid #D1FAE5; }
                .jb-card-status.inactive { background: #FEF2F2; color: #EF4444; border: 1px solid #FEE2E2; }
                .jb-card-status-dot { width: 5px; height: 5px; border-radius: 50%; }
                .jb-card-status.active .jb-card-status-dot { background: #10B981; }
                .jb-card-status.inactive .jb-card-status-dot { background: #EF4444; }
                .jb-card-title { font-size: 1.02rem; font-weight: 650; color: #111827; padding: 12px 22px 8px; margin: 0; letter-spacing: -0.01em; line-height: 1.3; }
                .jb-card:hover .jb-card-title { color: #1F2937; }
                .jb-card-meta { display: flex; align-items: center; gap: 10px; padding: 0 22px 4px; flex-wrap: wrap; }
                .jb-card-meta-item { display: flex; align-items: center; gap: 4px; font-size: 0.75rem; color: #9CA3AF; font-weight: 400; }
                .jb-card-type-badge { padding: 3px 10px; border-radius: 6px; font-size: 0.65rem; font-weight: 600; border: 1px solid; letter-spacing: 0.02em; }
                .jb-card-salary { display: flex; align-items: center; gap: 4px; padding: 4px 22px; font-size: 0.8rem; color: #059669; font-weight: 600; }
                .jb-card-divider { height: 1px; background: #F3F4F6; margin: 12px 22px; }
                .jb-card-footer { display: flex; align-items: center; gap: 16px; padding: 0 22px 18px; }
                .jb-card-stat { display: flex; align-items: center; gap: 5px; font-size: 0.75rem; color: #9CA3AF; }
                .jb-card-stat-val { font-weight: 700; color: #374151; }
                .jb-card-stat-label { font-weight: 400; }
                .jb-card-view-btn { margin-left: auto; display: flex; align-items: center; gap: 4px; padding: 6px 14px; border-radius: 9px; border: 1px solid #E5E7EB; background: white; color: #374151; font-size: 0.72rem; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; }
                .jb-card-view-btn:hover { background: linear-gradient(135deg, #F59E0B, #D97706); color: white; border-color: transparent; box-shadow: 0 3px 10px rgba(245,158,11,0.25); }
                .jb-empty-state { display: flex; flex-direction: column; align-items: center; padding: 80px 40px; background: white; border-radius: 18px; border: 1px solid #E5E7EB; animation: jbFadeUp 0.4s ease 0.12s both; }
                .jb-empty-icon { color: #D1D5DB; margin-bottom: 16px; }
                .jb-empty-state h3 { font-size: 1.05rem; font-weight: 600; color: #374151; margin-bottom: 6px; }
                .jb-empty-state p { font-size: 0.85rem; color: #9CA3AF; }
                .jb-pagination { display: flex; justify-content: center; align-items: center; gap: 10px; animation: jbFadeUp 0.4s ease 0.16s both; }
                .jb-pg-btn { display: flex; align-items: center; gap: 6px; padding: 9px 18px; border-radius: 12px; border: 1px solid #E5E7EB; background: white; color: #374151; font-size: 0.78rem; font-weight: 500; cursor: pointer; transition: all 0.2s; font-family: inherit; }
                .jb-pg-btn:disabled { opacity: 0.35; cursor: not-allowed; }
                .jb-pg-btn:hover:not(:disabled) { border-color: #F59E0B; color: #D97706; background: #FFFBEB; }
                .jb-pg-numbers { display: flex; gap: 4px; }
                .jb-pg-num { width: 38px; height: 38px; border-radius: 10px; border: 1px solid #E5E7EB; background: white; color: #6B7280; font-weight: 600; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; }
                .jb-pg-num.active { background: linear-gradient(135deg, #F59E0B, #D97706); color: white; border-color: transparent; box-shadow: 0 3px 10px rgba(245,158,11,0.3); }
                .jb-pg-num:hover:not(.active) { border-color: #F59E0B; color: #D97706; }
                .jb-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 3000; animation: jbFadeIn 0.2s ease; }
                .jb-modal { background: white; border-radius: 24px; width: 95%; max-width: 620px; max-height: 85vh; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 30px 80px rgba(0,0,0,0.25); animation: jbSlideUp 0.3s ease; }
                .jb-modal-header { padding: 28px 32px; position: relative; }
                .jb-modal-header-content { display: flex; justify-content: space-between; align-items: center; }
                .jb-modal-comp { display: flex; align-items: center; gap: 14px; }
                .jb-modal-comp-avatar { width: 46px; height: 46px; border-radius: 14px; background: rgba(255,255,255,0.2); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 1.1rem; }
                .jb-modal-comp-name { font-size: 1rem; font-weight: 600; color: white; }
                .jb-modal-comp-email { font-size: 0.75rem; color: rgba(255,255,255,0.6); margin-top: 1px; }
                .jb-modal-close { width: 36px; height: 36px; border-radius: 10px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
                .jb-modal-close:hover { background: rgba(255,255,255,0.25); }
                .jb-modal-body { overflow-y: auto; padding: 28px 32px; }
                .jb-modal-title-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; gap: 12px; }
                .jb-modal-title { font-size: 1.35rem; font-weight: 700; color: #111827; letter-spacing: -0.02em; margin: 0; line-height: 1.3; }
                .jb-modal-info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 22px; }
                .jb-modal-info-item { display: flex; align-items: flex-start; gap: 10px; padding: 14px 16px; background: #F9FAFB; border-radius: 12px; border: 1px solid #F3F4F6; }
                .jb-modal-info-item svg { color: #9CA3AF; flex-shrink: 0; margin-top: 1px; }
                .jb-modal-info-label { display: block; font-size: 0.62rem; font-weight: 600; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3px; }
                .jb-modal-info-value { display: block; font-size: 0.85rem; font-weight: 500; color: #374151; }
                .jb-modal-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; padding: 20px; background: #FAFBFC; border-radius: 16px; border: 1px solid #F3F4F6; }
                .jb-modal-stat { text-align: center; }
                .jb-modal-stat-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; }
                .jb-modal-stat-icon.views { background: #EEF2FF; color: #6366F1; }
                .jb-modal-stat-icon.apps { background: #FDF2F8; color: #EC4899; }
                .jb-modal-stat-icon.rate { background: #ECFDF5; color: #10B981; }
                .jb-modal-stat-val { font-size: 1.4rem; font-weight: 700; color: #111827; letter-spacing: -0.02em; }
                .jb-modal-stat-label { font-size: 0.7rem; color: #6B7280; font-weight: 500; }
                .jb-modal-section { margin-bottom: 20px; }
                .jb-modal-section-title { font-size: 0.82rem; font-weight: 600; color: #111827; margin-bottom: 8px; }
                .jb-modal-section-text { font-size: 0.85rem; color: #4B5563; line-height: 1.7; white-space: pre-wrap; }
                .jb-spinner { width: 36px; height: 36px; border: 3px solid #E5E7EB; border-top: 3px solid #F59E0B; border-radius: 50%; animation: jbSpin 0.8s linear infinite; margin-bottom: 12px; }
                @keyframes jbFadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes jbFadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes jbSlideUp { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
                @keyframes jbSpin { 100% { transform: rotate(360deg); } }
                @keyframes jbTwinkle { 0% { opacity: 0.15; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1.15); } }
                @keyframes jbMoonFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
                @keyframes jbSunPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
                @keyframes jbRayRotate { 100% { transform: rotate(360deg); } }
                @keyframes jbSunsetPulse { 0%, 100% { box-shadow: 0 0 30px rgba(255,107,53,0.4); } 50% { box-shadow: 0 0 45px rgba(255,107,53,0.6); } }
                @keyframes jbCloudDrift { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(12px); } }
            `}</style>
        </>
    );
};

export default AdminJobs;
