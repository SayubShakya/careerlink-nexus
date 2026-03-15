import React, { useState, useMemo } from 'react';
import {
    Briefcase, Search, MapPin, Eye,
    Users as UsersIcon, ChevronLeft, ChevronRight,
    Clock, Building2, X, Calendar, DollarSign,
    TrendingUp, BarChart3, ArrowUpRight, Filter,
    CheckCircle2, XCircle, Layers, Globe, SortAsc,
    LayoutGrid, List, MoreVertical, Trash2, Ban
} from 'lucide-react';
import { useGetAllJobs } from '@/hooks/api/admin/useAdmin';

/* ── Mini Sky Scene ── */
const PageHeroSky = ({ timeOfDay }) => (
    <div className="jb-sky-scene">
        {timeOfDay === 'night' && (
            <>
                {[...Array(24)].map((_, i) => (
                    <div key={i} className="jb-star" style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${1.5 + Math.random() * 2}s`,
                        width: `${2 + Math.random() * 1.5}px`,
                        height: `${2 + Math.random() * 1.5}px`,
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
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="jb-sun-ray" style={{ transform: `rotate(${i * 30}deg)` }} />
                    ))}
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
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="jb-star" style={{
                        left: `${10 + Math.random() * 80}%`,
                        top: `${5 + Math.random() * 40}%`,
                        animationDelay: `${Math.random() * 2.5}s`,
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
    <div className="jb-stat-pill" style={{ '--accent': color, '--bg': bg }}>
        <div className="jb-sp-icon-box">
            <div className="jb-sp-icon">{icon}</div>
        </div>
        <div className="jb-sp-info">
            <span className="jb-sp-value">{value}</span>
            <span className="jb-sp-label">{label}</span>
        </div>
        <div className="jb-sp-decor" />
    </div>
);

const AdminJobs = () => {
    const { data: jobs = [], isLoading } = useGetAllJobs();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [page, setPage] = useState(1);
    const [selectedJob, setSelectedJob] = useState(null);
    const perPage = 8;

    const hour = new Date().getHours();
    const timeOfDay = useMemo(() => {
        if (hour >= 5 && hour < 11) return 'morning';
        if (hour >= 11 && hour < 16) return 'afternoon';
        if (hour >= 16 && hour < 19) return 'evening';
        return 'night';
    }, [hour]);

    const filtered = useMemo(() => {
        let res = jobs.filter(job => {
            const q = search.toLowerCase();
            const matchSearch = job.title?.toLowerCase().includes(q) ||
                job.Employer?.companyName?.toLowerCase().includes(q) ||
                job.location?.toLowerCase().includes(q);
            const matchFilter = filter === 'all' ||
                (filter === 'active' && job.is_active) ||
                (filter === 'inactive' && !job.is_active);
            return matchSearch && matchFilter;
        });

        // Sorting
        if (sortBy === 'recent') res = [...res].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (sortBy === 'views') res = [...res].sort((a, b) => (b.views || 0) - (a.views || 0));
        if (sortBy === 'apps') res = [...res].sort((a, b) => (b.totalApplications || 0) - (a.totalApplications || 0));
        if (sortBy === 'salary') res = [...res].sort((a, b) => (b.salary?.replace(/[^0-9]/g, '') || 0) - (a.salary?.replace(/[^0-9]/g, '') || 0));

        return res;
    }, [jobs, search, filter, sortBy]);

    const totalPages = Math.ceil(filtered.length / perPage);
    const current = filtered.slice((page - 1) * perPage, page * perPage);
    const activeCount = jobs.filter(j => j.is_active).length;
    const inactiveCount = jobs.length - activeCount;

    const getCompanyColor = (name) => {
        const colors = [
            { bg: '#EEF2FF', color: '#6366F1', grad: 'linear-gradient(135deg, #6366F1, #818CF8)', shadow: 'rgba(99, 102, 241, 0.2)' },
            { bg: '#ECFDF5', color: '#10B981', grad: 'linear-gradient(135deg, #10B981, #34D399)', shadow: 'rgba(16, 185, 129, 0.2)' },
            { bg: '#FEF3C7', color: '#F59E0B', grad: 'linear-gradient(135deg, #F59E0B, #FBBF24)', shadow: 'rgba(245, 158, 11, 0.2)' },
            { bg: '#FCE7F3', color: '#EC4899', grad: 'linear-gradient(135deg, #EC4899, #F472B6)', shadow: 'rgba(236, 72, 153, 0.2)' },
            { bg: '#E0E7FF', color: '#4F46E5', grad: 'linear-gradient(135deg, #4F46E5, #6366F1)', shadow: 'rgba(79, 70, 229, 0.2)' },
            { bg: '#CFFAFE', color: '#06B6D4', grad: 'linear-gradient(135deg, #06B6D4, #22D3EE)', shadow: 'rgba(6, 182, 212, 0.2)' },
        ];
        const idx = (name || '?').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
        return colors[idx];
    };

    const getJobTypeBadge = (type) => {
        const t = (type || '').toLowerCase();
        if (t.includes('full')) return { label: 'Full-time', bg: 'rgba(16, 185, 129, 0.1)', color: '#059669', border: 'rgba(16, 185, 129, 0.2)' };
        if (t.includes('part')) return { label: 'Part-time', bg: 'rgba(245, 158, 11, 0.1)', color: '#D97706', border: 'rgba(245, 158, 11, 0.2)' };
        if (t.includes('contract')) return { label: 'Contract', bg: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED', border: 'rgba(124, 58, 237, 0.2)' };
        if (t.includes('intern')) return { label: 'Internship', bg: 'rgba(236, 72, 153, 0.1)', color: '#DB2777', border: 'rgba(236, 72, 153, 0.2)' };
        if (t.includes('remote')) return { label: 'Remote', bg: 'rgba(79, 70, 229, 0.1)', color: '#4338CA', border: 'rgba(79, 70, 229, 0.2)' };
        return { label: type || 'N/A', bg: '#F3F4F6', color: '#6B7280', border: '#E5E7EB' };
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Recently';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return 'Recently';
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <>
            <div className="jb-page">
                {/* ── Hero Banner ── */}
                <div className={`jb-hero jb-hero-${timeOfDay}`}>
                    <PageHeroSky timeOfDay={timeOfDay} />
                    <div className="jb-hero-content">
                        <div className="jb-hero-left">
                            <div className="jb-hero-badge-wrap">
                                <span className="jb-hero-badge"><Briefcase size={12} /> Job Management</span>
                            </div>
                            <h1 className="jb-hero-title">Jobs <span>List</span></h1>
                            <p className="jb-hero-desc">Check on and manage all the jobs in one place.</p>
                        </div>
                        <div className="jb-hero-right">
                            <div className="jb-hero-stats">
                                <div className="jb-hero-stat-card">
                                    <div className="jb-hsc-icon live"><CheckCircle2 size={18} /></div>
                                    <div className="jb-hsc-data">
                                        <span className="jb-hsc-val">{activeCount}</span>
                                        <span className="jb-hsc-label">Active</span>
                                    </div>
                                </div>
                                <div className="jb-hero-stat-card">
                                    <div className="jb-hsc-icon paused"><XCircle size={18} /></div>
                                    <div className="jb-hsc-data">
                                        <span className="jb-hsc-val">{inactiveCount}</span>
                                        <span className="jb-hsc-label">Stopped</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Quick Stats ── */}
                <div className="jb-quick-stats">
                    <StatPill label="Total Clicks" value={jobs.reduce((a, j) => a + (j.views || 0), 0).toLocaleString()} icon={<Eye size={20} />} color="#6366F1" bg="#EEF2FF" />
                    <StatPill label="How Many Applied" value={jobs.reduce((a, j) => a + (j.totalApplications || 0), 0).toLocaleString()} icon={<UsersIcon size={20} />} color="#EC4899" bg="#FDF2F8" />
                    <StatPill label="Hiring Bosses" value={[...new Set(jobs.map(j => j.Employer?.companyName).filter(Boolean))].length} icon={<Building2 size={20} />} color="#F59E0B" bg="#FFFBEB" />
                    <StatPill label="Are Active" value={jobs.length ? `${Math.round((activeCount / jobs.length) * 100)}%` : '0%'} icon={<TrendingUp size={20} />} color="#10B981" bg="#ECFDF5" />
                </div>

                {/* ── Logical Controls ── */}
                <div className="jb-controls-panel">
                    <div className="jb-search-box">
                        <Search size={20} className="jb-search-icon" />
                        <input
                            type="text"
                            className="jb-search-input"
                            placeholder="Find a job, boss, or city..."
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                        />
                        {search && <button className="jb-clear-search" onClick={() => setSearch('')}><X size={14} /></button>}
                    </div>

                    <div className="jb-filter-bar">
                        <div className="jb-filter-section">
                            <span className="jb-filter-label"><Filter size={14} /> Status</span>
                            <div className="jb-filter-options">
                                <button className={`jb-filter-opt ${filter === 'all' ? 'on' : ''}`} onClick={() => setFilter('all')}>All</button>
                                <button className={`jb-filter-opt ${filter === 'active' ? 'on' : ''}`} onClick={() => setFilter('active')}>Active</button>
                                <button className={`jb-filter-opt ${filter === 'inactive' ? 'on' : ''}`} onClick={() => setFilter('inactive')}>Paused</button>
                            </div>
                        </div>

                        <div className="jb-filter-section">
                            <span className="jb-filter-label"><SortAsc size={14} /> Sort</span>
                            <select className="jb-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                <option value="recent">Newest Job</option>
                                <option value="views">Most Looked At</option>
                                <option value="apps">Most Applied</option>
                                <option value="salary">Most Money</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* ── Results Summary ── */}
                <div className="jb-results-meta">
                    <span className="jb-res-count">Showing <b>{(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)}</b> of <b>{filtered.length}</b> jobs</span>
                    <div className="jb-view-icons">
                        <button className="jb-view-icon active"><LayoutGrid size={16} /></button>
                        <button className="jb-view-icon"><List size={16} /></button>
                    </div>
                </div>

                {/* ── Premium Jobs Grid ── */}
                {isLoading ? (
                    <div className="jb-loading-grid">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="jb-skeleton-card" />
                        ))}
                    </div>
                ) : current.length === 0 ? (
                    <div className="jb-empty-box">
                        <div className="jb-empty-icon-ring"><Search size={40} /></div>
                        <h3>Nothing found</h3>
                        <p>Try looking for something else!</p>
                        <button className="jb-reset-btn" onClick={() => { setSearch(''); setFilter('all'); }}>Show All</button>
                    </div>
                ) : (
                    <div className="jb-deck">
                        {current.map((job, i) => {
                            const comp = getCompanyColor(job.Employer?.companyName);
                            const type = getJobTypeBadge(job.jobType);
                            const hasApps = (job.totalApplications || 0) > 0;
                            return (
                                <div key={job.id} className="jb-premium-card" style={{ animationDelay: `${i * 0.05}s` }} onClick={() => setSelectedJob(job)}>
                                    <div className="jb-pc-header">
                                        <div className="jb-pc-company">
                                            <div className="jb-pc-avatar" style={{ background: comp.grad, boxShadow: `0 8px 20px ${comp.shadow}` }}>
                                                {(job.Employer?.companyName || '?')[0]}
                                            </div>
                                            <div className="jb-pc-company-info">
                                                <span className="jb-pc-comp-name">{job.Employer?.companyName || 'Unknown Partner'}</span>
                                                <div className="jb-pc-location"><MapPin size={12} /> {job.location || 'Distributed'}</div>
                                            </div>
                                        </div>
                                        <div className={`jb-pc-status ${job.is_active ? 'active' : 'paused'}`}>
                                            <div className="jb-pc-status-dot" />
                                            {job.is_active ? 'Active' : 'Stopped'}
                                        </div>
                                    </div>

                                    <h3 className="jb-pc-title">{job.title}</h3>

                                    <div className="jb-pc-meta">
                                        <span className="jb-pc-type" style={{ background: type.bg, color: type.color, borderColor: type.border }}>{type.label}</span>
                                        {job.salary ? <span className="jb-pc-salary"><DollarSign size={14} /> {job.salary}</span> : <span className="jb-pc-salary na">Not listed</span>}
                                    </div>

                                    <div className="jb-pc-body">
                                        <div className="jb-pc-metric">
                                            <div className="jb-pcm-icon views"><Eye size={18} /></div>
                                            <div className="jb-pcm-data">
                                                <span className="jb-pcm-val">{(job.views || 0).toLocaleString()}</span>
                                                <span className="jb-pcm-lbl">Clicks</span>
                                            </div>
                                        </div>
                                        <div className="jb-pc-metric">
                                            <div className={`jb-pcm-icon ${hasApps ? 'active' : ''}`}><UsersIcon size={18} /></div>
                                            <div className="jb-pcm-data">
                                                <span className="jb-pcm-val">{(job.totalApplications || 0).toLocaleString()}</span>
                                                <span className="jb-pcm-lbl">People</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="jb-pc-footer">
                                        <div className="jb-pc-date"><Clock size={14} /> {formatDate(job.createdAt || job.created_at)}</div>
                                        <div className="jb-pc-actions">
                                            <button className="jb-pc-btn-mini" onClick={e => { e.stopPropagation(); /* TODO: Ban Logic */ }} title="Stop This Job"><Ban size={16} /></button>
                                            <button className="jb-pc-btn-view">Details <ArrowUpRight size={16} /></button>
                                        </div>
                                    </div>
                                    <div className="jb-pc-glow" style={{ background: comp.grad }} />
                                </div>
                            );
                        })}
                    </div>
                )}


                {/* ── Centered Pagination ── */}
                {totalPages > 1 && (
                    <div className="jb-pagination-wrap">
                        <button className="jb-pg-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={16} /></button>
                        <div className="jb-pg-list">
                            {[...Array(totalPages)].map((_, i) => (
                                <button key={i} className={`jb-pg-item ${page === i + 1 ? 'on' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
                            ))}
                        </div>
                        <button className="jb-pg-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight size={16} /></button>
                    </div>
                )}
            </div>

            {/* ── JOB DETAIL MODAL (GLASS) ── */}
            {selectedJob && (() => {
                const comp = getCompanyColor(selectedJob.Employer?.companyName);
                return (
                    <div className="jb-modal-overlay" onClick={() => setSelectedJob(null)}>
                        <div className="jb-modal-window" onClick={e => e.stopPropagation()}>
                            <div className="jb-mw-header" style={{ background: comp.grad }}>
                                <PageHeroSky timeOfDay={timeOfDay} />
                                <div className="jb-mw-header-blur" />
                                <div className="jb-mw-header-content">
                                    <div className="jb-mw-comp">
                                        <div className="jb-mw-avatar">{(selectedJob.Employer?.companyName || '?')[0]}</div>
                                        <div className="jb-mw-comp-text">
                                            <h4 className="jb-mw-comp-name">{selectedJob.Employer?.companyName || 'Hiring Boss'}</h4>
                                            <span className="jb-mw-comp-email">{selectedJob.Employer?.email}</span>
                                        </div>
                                    </div>
                                    <button className="jb-mw-close" onClick={() => setSelectedJob(null)}><X size={20} /></button>
                                </div>
                            </div>
                            <div className="jb-mw-body">
                                <div className="jb-mw-title-area">
                                    <h2 className="jb-mw-title">{selectedJob.title}</h2>
                                    <div className={`jb-pc-status ${selectedJob.is_active ? 'active' : 'paused'}`}>
                                        <div className="jb-pc-status-dot" />
                                        {selectedJob.is_active ? 'Active Now' : 'Stopped for Now'}
                                    </div>
                                </div>

                                <div className="jb-mw-grid">
                                    <div className="jb-mw-item"><MapPin size={18} /><div><label>Location</label><span>{selectedJob.location || 'Remote'}</span></div></div>
                                    <div className="jb-mw-item"><Layers size={18} /><div><label>Job Category</label><span>{selectedJob.jobType || 'Unknown'}</span></div></div>
                                    <div className="jb-mw-item"><DollarSign size={18} /><div><label>Salary</label><span>{selectedJob.salary || 'Ask Boss'}</span></div></div>
                                    <div className="jb-mw-item"><Calendar size={18} /><div><label>Launch Date</label><span>{formatDate(selectedJob.createdAt || selectedJob.created_at)}</span></div></div>
                                </div>

                                <div className="jb-mw-analytics">
                                    <div className="jb-mw-stat shadow-indigo">
                                        <div className="jb-mws-icon"><Eye size={24} /></div>
                                        <div className="jb-mws-vals"><b>{(selectedJob.views || 0).toLocaleString()}</b><span>Total Clicks</span></div>
                                    </div>
                                    <div className="jb-mw-stat shadow-pink">
                                        <div className="jb-mws-icon"><UsersIcon size={24} /></div>
                                        <div className="jb-mws-vals"><b>{(selectedJob.totalApplications || 0).toLocaleString()}</b><span>Applied</span></div>
                                    </div>
                                    <div className="jb-mw-stat shadow-emerald">
                                        <div className="jb-mws-icon"><TrendingUp size={24} /></div>
                                        <div className="jb-mws-vals"><b>{selectedJob.views ? `${Math.round(((selectedJob.totalApplications || 0) / selectedJob.views) * 100)}%` : '0%'}</b><span>How Many Applied</span></div>
                                    </div>
                                </div>

                                <div className="jb-mw-details">
                                    <div className="jb-mw-divider" />
                                    <div className="jb-mw-section-row">
                                        <div className="jb-mw-content-main">
                                            <div className="jb-mw-block">
                                                <h5><Globe size={16} /> About This Job</h5>
                                                <div className="jb-mw-text-box">
                                                    <p>{selectedJob.description || 'No story about this job.'}</p>
                                                </div>
                                            </div>

                                            {selectedJob.requirements && (
                                                <div className="jb-mw-block">
                                                    <h5><Briefcase size={16} /> What You Need</h5>
                                                    <div className="jb-mw-text-box requirements">
                                                        <p>{selectedJob.requirements}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="jb-mw-sidebar">
                                            <div className="jb-mw-side-card">
                                                <h5>Options</h5>
                                                <button className="jb-mw-side-btn"><Trash2 size={14} /> Delete Job</button>
                                                <button className="jb-mw-side-btn warning"><Ban size={14} /> Stop Job</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="jb-mw-footer">
                                <span className="jb-mw-footer-note">Job ID: {selectedJob.id}</span>
                                <button className="jb-mw-btn-primary" onClick={() => setSelectedJob(null)}>Got it, Close!</button>
                            </div>
                        </div>
                    </div>
                );
            })()}

            <style>{`
                :root {
                  --jb-bg: #F8FAFC;
                  --jb-card-bg: #FFFFFF;
                  --jb-text-main: #0F172A;
                  --jb-text-muted: #64748B;
                  --jb-accent: #3E61FF;
                  --jb-border: #E2E8F0;
                }

                .jb-page { padding: 32px 48px; background: var(--jb-bg); min-height: 100vh; font-family: 'Inter', system-ui, sans-serif; }

                /* ── HERO ── */
                .jb-hero { border-radius: 28px; padding: 48px 64px; margin-bottom: 32px; position: relative; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.1); transition: all 0.4s; }
                .jb-hero-morning { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #93c5fd 100%); }
                .jb-hero-afternoon { background: linear-gradient(135deg, #0284c7 0%, #38bdf8 50%, #bae6fd 100%); }
                .jb-hero-evening { background: linear-gradient(135deg, #1e1b4b 0%, #4338ca 40%, #db2777 70%, #f97316 100%); }
                .jb-hero-night { background: linear-gradient(135deg, #020617 0%, #1e1b4b 50%, #312e81 100%); }

                .jb-hero-content { position: relative; z-index: 5; display: flex; justify-content: space-between; align-items: center; }
                .jb-hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; background: rgba(255,255,255,0.12); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); border-radius: 100px; font-size: 0.7rem; font-weight: 700; color: white; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 20px; }
                .jb-hero-title { font-size: 2.8rem; font-weight: 900; color: white; letter-spacing: -0.04em; margin-bottom: 12px; }
                .jb-hero-title span { background: linear-gradient(to right, #fff, rgba(255,255,255,0.5)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .jb-hero-desc { font-size: 1.05rem; color: rgba(255,255,255,0.8); max-width: 500px; line-height: 1.6; }

                .jb-hero-stats { display: flex; gap: 16px; }
                .jb-hero-stat-card { background: rgba(255,255,255,0.06); padding: 18px 24px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 16px; backdrop-filter: blur(20px); transition: 0.3s; }
                .jb-hero-stat-card:hover { transform: translateY(-4px); background: rgba(255,255,255,0.1); }
                .jb-hsc-icon { width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
                .jb-hsc-icon.active { background: rgba(52, 211, 153, 0.2); color: #34d399; }
                .jb-hsc-icon.inactive { background: rgba(248, 113, 113, 0.2); color: #f87171; }
                .jb-hsc-data { display: flex; flex-direction: column; }
                .jb-hsc-val { font-size: 1.8rem; font-weight: 800; color: white; line-height: 1; }
                .jb-hsc-label { font-size: 0.75rem; color: rgba(255,255,255,0.5); font-weight: 700; text-transform: uppercase; margin-top: 4px; }

                /* ── STAT PILLS ── */
                .jb-quick-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 32px; }
                .jb-stat-pill { background: var(--jb-card-bg); border-radius: 24px; padding: 24px; border: 1px solid var(--jb-border); display: flex; align-items: center; gap: 20px; position: relative; overflow: hidden; transition: 0.3s ease; }
                .jb-stat-pill:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.05); border-color: var(--accent); }
                .jb-sp-icon-box { width: 52px; height: 52px; border-radius: 16px; background: var(--bg); display: flex; align-items: center; justify-content: center; color: var(--accent); flex-shrink: 0; }
                .jb-sp-value { font-size: 1.6rem; font-weight: 900; color: var(--jb-text-main); display: block; line-height: 1.1; }
                .jb-sp-label { font-size: 0.85rem; color: var(--jb-text-muted); font-weight: 600; }
                .jb-sp-decor { position: absolute; top: -20px; right: -20px; width: 60px; height: 60px; border-radius: 50%; background: var(--accent); opacity: 0.05; transition: 0.4s; }
                .jb-stat-pill:hover .jb-sp-decor { transform: scale(3); opacity: 0.08; }

                /* ── CONTROLS ── */
                .jb-controls-panel { background: var(--jb-card-bg); border-radius: 20px; padding: 12px; border: 1px solid var(--jb-border); display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; gap: 20px; }
                .jb-search-box { position: relative; flex: 1; display: flex; align-items: center; }
                .jb-search-icon { position: absolute; left: 16px; color: var(--jb-text-muted); pointer-events: none; }
                .jb-search-input { width: 100%; padding: 14px 44px; background: var(--jb-bg); border: 1px solid var(--jb-border); border-radius: 14px; outline: none; transition: 0.2s; font-weight: 500; }
                .jb-search-input:focus { border-color: var(--jb-accent); box-shadow: 0 0 0 4px rgba(62, 97, 255, 0.1); }
                .jb-clear-search { position: absolute; right: 12px; padding: 6px; border-radius: 8px; border: none; background: #e2e8f0; color: #475569; cursor: pointer; display: flex; }

                .jb-filter-bar { display: flex; gap: 24px; align-items: center; padding-right: 12px; }
                .jb-filter-section { display: flex; align-items: center; gap: 12px; }
                .jb-filter-label { font-size: 0.8rem; font-weight: 700; color: var(--jb-text-muted); display: flex; align-items: center; gap: 6px; text-transform: uppercase; }
                .jb-filter-options { background: var(--jb-bg); padding: 4px; border-radius: 12px; display: flex; gap: 2px; }
                .jb-filter-opt { border: none; background: transparent; padding: 8px 16px; border-radius: 9px; font-size: 0.85rem; font-weight: 600; color: var(--jb-text-muted); cursor: pointer; transition: 0.2s; }
                .jb-filter-opt.on { background: white; color: var(--jb-accent); box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
                .jb-sort-select { background: var(--jb-bg); border: 1px solid var(--jb-border); padding: 8px 12px; border-radius: 10px; font-size: 0.85rem; font-weight: 600; color: var(--jb-text-main); outline: none; cursor: pointer; }

                .jb-results-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding: 0 8px; }
                .jb-res-count { font-size: 0.9rem; color: var(--jb-text-muted); }
                .jb-res-count b { color: var(--jb-text-main); font-weight: 700; }
                .jb-view-icons { display: flex; gap: 8px; }
                .jb-view-icon { width: 34px; height: 34px; border-radius: 8px; border: 1px solid var(--jb-border); background: white; color: var(--jb-text-muted); display: flex; align-items: center; justify-content: center; cursor: pointer; }
                .jb-view-icon.active { background: var(--jb-accent); color: white; border-color: var(--jb-accent); }

                /* ── CARDS ── */
                .jb-deck { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 28px; padding-bottom: 48px; }
                .jb-premium-card { background: white; border-radius: 28px; border: 1px solid var(--jb-border); padding: 28px; cursor: pointer; position: relative; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                .jb-premium-card:hover { transform: translateY(-10px); border-color: rgba(62, 97, 255, 0.3); box-shadow: 0 30px 60px -12px rgba(15, 23, 42, 0.12); }

                .jb-pc-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; position: relative; z-index: 2; }
                .jb-pc-company { display: flex; align-items: center; gap: 16px; }
                .jb-pc-avatar { width: 52px; height: 52px; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 1.4rem; flex-shrink: 0; box-shadow: 0 8px 16px -4px rgba(0,0,0,0.1); border: 2px solid rgba(255,255,255,0.8); }
                .jb-pc-comp-name { font-size: 0.95rem; font-weight: 800; color: var(--jb-text-main); display: block; letter-spacing: -0.01em; }
                .jb-pc-location { font-size: 0.78rem; color: var(--jb-text-muted); display: flex; align-items: center; gap: 6px; margin-top: 4px; font-weight: 600; }

                .jb-pc-status { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 100px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
                .jb-pc-status.active { background: #ECFDF5; color: #059669; border: 1px solid #D1FAE5; }
                .jb-pc-status.paused { background: #FEF2F2; color: #DC2626; border: 1px solid #FEE2E2; }
                .jb-pc-status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; animation: jbPulse 2s infinite; }
                @keyframes jbPulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }

                .jb-pc-title { font-size: 1.45rem; font-weight: 900; color: var(--jb-text-main); line-height: 1.25; margin-bottom: 16px; letter-spacing: -0.04em; position: relative; z-index: 2; }
                .jb-pc-meta { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; flex-wrap: wrap; position: relative; z-index: 2; }
                .jb-pc-type { padding: 5px 12px; border-radius: 10px; font-size: 0.78rem; font-weight: 800; border: 1px solid; letter-spacing: 0.02em; }
                .jb-pc-salary { font-size: 1rem; font-weight: 800; color: #10B981; display: flex; align-items: center; gap: 6px; }
                .jb-pc-salary.na { color: #94A3B8; font-weight: 600; font-style: italic; font-size: 0.85rem; }

                .jb-pc-body { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 20px; background: #F8FAFC; border-radius: 20px; margin-bottom: 24px; border: 1px solid #F1F5F9; position: relative; z-index: 2; }
                .jb-pc-metric { display: flex; align-items: center; gap: 14px; }
                .jb-pcm-icon { width: 38px; height: 38px; border-radius: 12px; background: white; display: flex; align-items: center; justify-content: center; color: #64748B; border: 1px solid #E2E8F0; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
                .jb-pcm-icon.active { color: #EC4899; background: #FFF1F2; border-color: #FECDD3; }
                .jb-pcm-icon.views { color: #6366F1; background: #EEF2FF; border-color: #E0E7FF; }
                .jb-pcm-val { font-size: 1.15rem; font-weight: 900; color: var(--jb-text-main); display: block; line-height: 1; letter-spacing: -0.02em; }
                .jb-pcm-lbl { font-size: 0.68rem; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px; }

                .jb-pc-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 12px; border-top: 1px solid #F1F5F9; position: relative; z-index: 2; }
                .jb-pc-date { font-size: 0.85rem; color: #94A3B8; display: flex; align-items: center; gap: 6px; font-weight: 600; }
                .jb-pc-actions { display: flex; gap: 10px; }
                .jb-pc-btn-mini { width: 36px; height: 36px; border-radius: 12px; border: 1px solid #E2E8F0; background: white; color: #64748B; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
                .jb-pc-btn-mini:hover { color: #EF4444; border-color: #FECACA; background: #FEF2F2; transform: scale(1.1); }
                .jb-pc-btn-view { padding: 10px 20px; border-radius: 14px; background: #F1F5F9; color: var(--jb-text-main); font-weight: 800; font-size: 0.9rem; border: 1px solid #E2E8F0; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                .jb-pc-btn-view:hover { background: #0F172A; color: white; border-color: #0F172A; box-shadow: 0 10px 20px rgba(15, 23, 42, 0.15); transform: translateX(4px); }

                .jb-pc-glow { position: absolute; bottom: -60px; right: -60px; width: 180px; height: 180px; border-radius: 50%; opacity: 0; filter: blur(50px); transition: 0.6s cubic-bezier(0.4, 0, 0.2, 1); z-index: 1; pointer-events: none; }
                .jb-premium-card:hover .jb-pc-glow { opacity: 0.15; transform: scale(1.2); }

                /* ── MODAL ── */
                .jb-modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 3000; padding: 20px; animation: jbPopIn 0.3s ease; }
                .jb-modal-window { background: white; border-radius: 32px; width: 100%; max-width: 680px; max-height: 90vh; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 50px 100px -20px rgba(0,0,0,0.3); }
                
                .jb-mw-header { height: 120px; position: relative; padding: 32px; }
                .jb-mw-header-blur { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(255,255,255,0.4)); }
                .jb-mw-header-content { position: relative; z-index: 10; display: flex; justify-content: space-between; align-items: center; }
                .jb-mw-comp { display: flex; align-items: center; gap: 16px; }
                .jb-mw-avatar { width: 56px; height: 56px; border-radius: 18px; background: rgba(255,255,255,0.2); backdrop-filter: blur(20px); border: 2px solid rgba(255,255,255,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 1.4rem; }
                .jb-mw-comp-name { color: white; font-size: 1.3rem; font-weight: 800; text-shadow: 0 2px 10px rgba(0,0,0,0.2); }
                .jb-mw-comp-email { color: rgba(255,255,255,0.7); font-size: 0.85rem; font-weight: 500; }
                .jb-mw-close { width: 44px; height: 44px; border-radius: 16px; background: rgba(255,255,255,0.2); border: none; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
                .jb-mw-close:hover { background: rgba(255,255,255,0.4); transform: rotate(90deg); }

                .jb-mw-body { padding: 32px; overflow-y: auto; flex: 1; position: relative; }
                .jb-mw-title-area { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; gap: 20px; }
                .jb-mw-title { font-size: 2.1rem; font-weight: 900; color: var(--jb-text-main); letter-spacing: -0.05em; line-height: 1.1; margin: 0; }
                
                .jb-mw-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 28px; }
                .jb-mw-item { padding: 18px 20px; background: #F8FAFC; border-radius: 20px; border: 1px solid #F1F5F9; display: flex; gap: 16px; align-items: center; transition: 0.2s; }
                .jb-mw-item:hover { background: white; border-color: var(--jb-accent); box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
                .jb-mw-item svg { color: var(--jb-text-muted); opacity: 0.7; }
                .jb-mw-item label { display: block; font-size: 0.65rem; font-weight: 800; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
                .jb-mw-item span { font-size: 1rem; font-weight: 700; color: var(--jb-text-main); }

                .jb-mw-analytics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
                .jb-mw-stat { background: white; padding: 24px 16px; border-radius: 24px; border: 1px solid #F1F5F9; text-align: center; position: relative; transition: 0.3s; }
                .jb-mw-stat:hover { transform: translateY(-4px); box-shadow: 0 15px 30px rgba(0,0,0,0.05); }
                .jb-mw-stat.shadow-indigo { border-bottom: 4px solid #6366f1; }
                .jb-mw-stat.shadow-pink { border-bottom: 4px solid #ec4899; }
                .jb-mw-stat.shadow-emerald { border-bottom: 4px solid #10b981; }
                .jb-mws-icon { margin-bottom: 12px; }
                .jb-mws-vals b { display: block; font-size: 1.65rem; font-weight: 900; color: #1e293b; line-height: 1; letter-spacing: -0.02em; }
                .jb-mws-vals span { font-size: 0.7rem; color: #64748b; font-weight: 700; text-transform: uppercase; margin-top: 6px; display: block; letter-spacing: 0.05em; }

                .jb-mw-divider { height: 1px; background: linear-gradient(to right, #F1F5F9, #E2E8F0, #F1F5F9); margin: 32px 0; }
                .jb-mw-section-row { display: grid; grid-template-columns: 1fr 220px; gap: 32px; }
                .jb-mw-block { margin-bottom: 32px; }
                .jb-mw-block h5 { font-size: 0.95rem; font-weight: 900; color: var(--jb-text-main); margin-bottom: 16px; display: flex; align-items: center; gap: 10px; text-transform: uppercase; letter-spacing: 0.06em; }
                .jb-mw-text-box { background: #fafbfc; padding: 20px; border-radius: 18px; border: 1px solid #f1f5f9; line-height: 1.7; color: #475569; font-size: 0.98rem; }
                .jb-mw-text-box.requirements { background: #FDF2F8; border-color: #FCE7F3; color: #831843; }
                
                .jb-mw-sidebar { display: flex; flex-direction: column; gap: 16px; }
                .jb-mw-side-card { background: #F8FAFC; padding: 20px; border-radius: 20px; border: 1px solid #F1F5F9; }
                .jb-mw-side-card h5 { font-size: 0.75rem; font-weight: 800; color: #94A3B8; text-transform: uppercase; margin-bottom: 16px; letter-spacing: 0.08em; text-align: center; }
                .jb-mw-side-btn { width: 100%; padding: 10px; border-radius: 12px; border: 1px solid #E2E8F0; background: white; color: #64748B; font-weight: 700; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 10px; transition: 0.2s; }
                .jb-mw-side-btn:hover { border-color: var(--jb-text-main); color: var(--jb-text-main); }
                .jb-mw-side-btn.warning:hover { background: #FEF2F2; border-color: #FECACA; color: #EF4444; }

                .jb-mw-footer { padding: 24px 32px; background: #f8fafc; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
                .jb-mw-footer-note { font-size: 0.7rem; color: #94A3B8; font-weight: 600; font-family: monospace; }
                .jb-mw-btn-primary { padding: 16px 48px; border-radius: 16px; background: #0F172A; color: white; font-weight: 800; font-size: 0.95rem; border: none; cursor: pointer; transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 10px 25px rgba(15, 23, 42, 0.15); }
                .jb-mw-btn-primary:hover { background: #1E293B; transform: translateY(-2px); box-shadow: 0 15px 30px rgba(15, 23, 42, 0.2); }
                .jb-mw-btn-primary:active { transform: scale(0.98); }

                /* ── PAGINATION ── */
                .jb-pagination-wrap { display: flex; justify-content: center; align-items: center; gap: 20px; }
                .jb-pg-btn { width: 44px; height: 44px; border-radius: 16px; border: 1px solid var(--jb-border); background: white; color: var(--jb-text-main); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
                .jb-pg-btn:hover:not(:disabled) { border-color: var(--jb-accent); color: var(--jb-accent); transform: scale(1.05); }
                .jb-pg-btn:disabled { opacity: 0.3; cursor: not-allowed; }
                .jb-pg-list { display: flex; gap: 8px; }
                .jb-pg-item { width: 44px; height: 44px; border-radius: 16px; border: 1px solid var(--jb-border); background: white; font-weight: 700; color: var(--jb-text-muted); cursor: pointer; transition: 0.2s; }
                .jb-pg-item.on { background: var(--jb-text-main); color: white; border-color: var(--jb-text-main); transform: scale(1.1); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }

                /* ── UTILS ── */
                .jb-loading-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 24px; }
                .jb-skeleton-card { height: 280px; background: #f1f5f9; border-radius: 24px; animation: pulse 1.5s infinite; }
                @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }

                .jb-empty-box { text-align: center; padding: 100px 40px; background: white; border-radius: 32px; border: 2px dashed #e2e8f0; }
                .jb-empty-icon-ring { width: 80px; height: 80px; border-radius: 50%; background: #f8fafc; color: #cbd5e1; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
                .jb-reset-btn { margin-top: 24px; padding: 12px 24px; border-radius: 12px; background: var(--jb-accent); color: white; font-weight: 700; border: none; cursor: pointer; }

                /* ── SKY ANIMATIONS ── */
                .jb-sky-scene { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
                .jb-star { position: absolute; background: white; border-radius: 50%; animation: twinkle 2s infinite alternate; }
                @keyframes twinkle { from { opacity: 0.2; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
                .jb-moon { position: absolute; top: 15%; right: 15%; width: 40px; height: 40px; background: #ede9fe; border-radius: 50%; box-shadow: 0 0 20px rgba(255,255,255,0.2); animation: float 6s ease-in-out infinite; }
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                .jb-sun { position: absolute; top: 15%; right: 15%; width: 40px; height: 40px; background: #fbbf24; border-radius: 50%; box-shadow: 0 0 40px rgba(251, 191, 36, 0.4); }
                .jb-sun-ray { position: absolute; top: 50%; left: 50%; width: 70px; height: 2px; background: linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent); transform-origin: left; }
                .jb-cloud { position: absolute; background: rgba(255,255,255,0.15); border-radius: 100px; backdrop-filter: blur(4px); }
                .jb-cloud-1 { width: 80px; height: 20px; top: 20%; right: 40%; animation: drift 40s linear infinite; }
                .jb-cloud-2 { width: 60px; height: 16px; top: 50%; right: 10%; animation: drift 60s linear infinite; }
                .jb-cloud-3 { width: 100px; height: 24px; bottom: 20%; right: 30%; animation: drift 50s linear infinite; }
                @keyframes drift { from { transform: translateX(200px); } to { transform: translateX(-1000px); } }
                @keyframes jbPopIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
                @keyframes jbFadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .jb-premium-card, .jb-stat-pill, .jb-hero { animation: jbFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
            `}</style>
        </>
    );
};

export default AdminJobs;
