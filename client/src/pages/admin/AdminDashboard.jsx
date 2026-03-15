import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building2, Briefcase, Users, ArrowUpRight, FileText,
    Trash2, X, TrendingUp, Globe, Activity, Zap, ChevronRight, Shield,
    Clock, Mail, Phone, MapPin, Calendar, ExternalLink, Filter, CheckCircle2,
    XCircle, Info, BarChart3, Star, Cloud, Moon, Sun, ChevronLeft
} from 'lucide-react';
import { ROUTES } from '@/routes/routes';
import {
    useGetAdminStats, useGetAllEmployers, useGetAllJobs,
    useGetAllJobSeekers, useDeleteEmployer, useGetEmployerJobs
} from '@/hooks/api/admin/useAdmin';

/* ── Mini Sky Scene ── */
const PageHeroSky = ({ timeOfDay }) => (
    <div className="dash-sky-scene">
        {timeOfDay === 'night' && (
            <>
                {[...Array(25)].map((_, i) => (
                    <div key={i} className="dash-star" style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${1.5 + Math.random() * 2}s`,
                        width: `${2 + Math.random() * 2}px`,
                        height: `${2 + Math.random() * 2}px`,
                    }} />
                ))}
                <div className="dash-moon">
                    <div className="dash-moon-crater" style={{ width: 8, height: 8, top: 8, left: 12 }} />
                    <div className="dash-moon-crater" style={{ width: 5, height: 5, top: 18, left: 6 }} />
                    <div className="dash-moon-crater" style={{ width: 4, height: 4, top: 12, left: 22 }} />
                </div>
                <div className="dash-moon-glow" />
            </>
        )}
        {timeOfDay === 'morning' && (
            <>
                <div className="dash-sun dash-morning-sun">
                    <div className="dash-sun-ray" />
                    <div className="dash-sun-ray" style={{ transform: 'rotate(60deg)' }} />
                    <div className="dash-sun-ray" style={{ transform: 'rotate(120deg)' }} />
                </div>
                <div className="dash-glow dash-morning-glow" />
                <div className="dash-cloud dash-cloud-1" />
                <div className="dash-cloud dash-cloud-2" />
            </>
        )}
        {timeOfDay === 'afternoon' && (
            <>
                <div className="dash-sun dash-afternoon-sun" />
                <div className="dash-glow dash-afternoon-glow" />
                <div className="dash-cloud dash-cloud-1" />
                <div className="dash-cloud dash-cloud-3" />
            </>
        )}
        {timeOfDay === 'evening' && (
            <>
                <div className="dash-sunset-orb" />
                <div className="dash-sunset-glow" />
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="dash-star" style={{
                        left: `${15 + Math.random() * 65}%`,
                        top: `${5 + Math.random() * 45}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        width: '2px', height: '2px',
                    }} />
                ))}
                <div className="dash-cloud dash-cloud-ev" />
            </>
        )}
    </div>
);

/* ── Animated Counter ── */
const AnimCounter = ({ value }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = parseInt(value) || 0;
        if (!end) { setCount(0); return; }
        const step = Math.ceil(end / 35);
        const t = setInterval(() => {
            start += step;
            if (start >= end) { setCount(end); clearInterval(t); }
            else setCount(start);
        }, 20);
        return () => clearInterval(t);
    }, [value]);
    return <span>{count.toLocaleString()}</span>;
};

/* ── Stat Card ── */
const StatCard = ({ label, value, icon, color, bg, idx }) => (
    <div className="admin-stat-card" style={{ animationDelay: `${idx * 0.08}s` }}>
        <div className="stat-icon" style={{ background: bg, color }}>
            {icon}
        </div>
        <div className="stat-info">
            <div className="stat-value"><AnimCounter value={value} /></div>
            <div className="stat-label">{label}</div>
        </div>
        <div className="stat-badge">
            <TrendingUp size={11} />
            Live
        </div>
    </div>
);

/* ── Quick Link ── */
const QuickLink = ({ label, desc, icon, color, onClick }) => (
    <button className="admin-quick-link" onClick={onClick}>
        <div className="ql-icon" style={{ background: `${color}10`, color }}>{icon}</div>
        <div className="ql-text">
            <span className="ql-label">{label}</span>
            <span className="ql-desc">{desc}</span>
        </div>
        <ChevronRight size={16} className="ql-arrow" />
    </button>
);

/* ════════════════════════════════════════════════ */
const AdminDashboard = () => {
    const navigate = useNavigate();
    const [confirmDelId, setConfirmDelId] = useState(null);
    const [jobsModalEmpId, setJobsModalEmpId] = useState(null);

    const { data: stats } = useGetAdminStats();
    const { data: employers = [], isLoading: empLoading, refetch } = useGetAllEmployers();
    const deleteEmployer = useDeleteEmployer();

    const hour = new Date().getHours();
    const timeOfDay = hour >= 5 && hour < 12 ? 'morning' : hour >= 12 && hour < 17 ? 'afternoon' : hour >= 17 && hour < 20 ? 'evening' : 'night';

    const getGreeting = () => {
        if (timeOfDay === 'morning') return { text: 'Good morning!', icon: '☀️' };
        if (timeOfDay === 'afternoon') return { text: 'Good afternoon!', icon: '🌤️' };
        if (timeOfDay === 'evening') return { text: 'Good evening!', icon: '🌅' };
        return { text: 'Good night!', icon: '🌙' };
    };

    const greeting = getGreeting();

    const handleDelete = id => {
        deleteEmployer.mutate(id, { onSuccess: () => { setConfirmDelId(null); refetch(); } });
    };

    const ds = stats || { totalEmployers: 0, totalJobSeekers: 0, totalJobs: 0, totalApplications: 0 };
    
    // Pagination logic
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const totalPages = Math.ceil(employers.length / itemsPerPage);
    const paginatedEmployers = employers.slice(startIndex, startIndex + itemsPerPage);

    const cards = [
        { label: 'Employers', value: ds.totalEmployers, icon: <Building2 size={20} />, color: '#6366F1', bg: '#EEF2FF' },
        { label: 'Job Seekers', value: ds.totalJobSeekers, icon: <Users size={20} />, color: '#10B981', bg: '#ECFDF5' },
        { label: 'Job Listings', value: ds.totalJobs, icon: <Briefcase size={20} />, color: '#F59E0B', bg: '#FFFBEB' },
        { label: 'Applications', value: ds.totalApplications, icon: <FileText size={20} />, color: '#EC4899', bg: '#FDF2F8' },
    ];

    return (
        <>
            <div className="admin-page">
                {/* ───── HERO SECTION ───── */}
                <div className={`admin-hero dash-hero-${timeOfDay}`}>
                    <PageHeroSky timeOfDay={timeOfDay} />
                    <div className="hero-content">
                        <div className="hero-left">
                            <span className="hero-tag"><Shield size={12} /> Admin Portal</span>
                            <h1 className="hero-title" style={{ color: timeOfDay === 'night' ? '#FFFFFF' : 'inherit' }}>
                                {greeting.text} {greeting.icon}
                            </h1>
                            <p className="hero-subtitle">Here's what's happening on your platform today.</p>
                            <div className="hero-actions">
                                <button className="hero-btn primary" onClick={() => navigate(ROUTES.ADMIN_JOBS)}>
                                    Manage Jobs <ArrowUpRight size={16} />
                                </button>
                                <button className="hero-btn secondary" onClick={() => navigate(ROUTES.ADMIN_EMPLOYERS)}>
                                    Review Companies
                                </button>
                            </div>
                        </div>
                        <div className="hero-right">
                            <div className="hero-glass-card">
                                <span className="hero-stat-label">Total Users</span>
                                <div className="hero-stat-value"><AnimCounter value={ds.totalEmployers + ds.totalJobSeekers} /></div>
                                <div className="hero-online"><span className="pulse-dot" /> All systems running</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ───── STATS GRID ───── */}
                <div className="admin-stats-grid">
                    {cards.map((c, i) => <StatCard key={c.label} {...c} idx={i} />)}
                </div>

                {/* ───── MAIN CONTENT AREA ───── */}
                <div className="admin-main-layout">
                    {/* Left Column: Recent Employers */}
                    <div className="admin-content-card">
                        <div className="card-header">
                            <div>
                                <h2 className="card-title">Recent Companies</h2>
                                <p className="card-subtitle">Latest employers to join the network.</p>
                            </div>
                            <button className="card-action-btn" onClick={() => navigate(ROUTES.ADMIN_EMPLOYERS)}>
                                View All <ArrowUpRight size={14} />
                            </button>
                        </div>
                        <div className="admin-table-container">
                            <table className="admin-custom-table">
                                <thead>
                                    <tr>
                                        <th>Company Profile</th>
                                        <th>Location & Sector</th>
                                        <th>Join Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {empLoading ? (
                                        <tr><td colSpan="4" className="list-empty">Loading companies...</td></tr>
                                    ) : paginatedEmployers.length === 0 ? (
                                        <tr><td colSpan="4" className="list-empty">No companies registered yet.</td></tr>
                                    ) : paginatedEmployers.map((emp, i) => {
                                        const colorVariations = [
                                            { bg: 'linear-gradient(135deg, #EEF2FF 0%, #C7D2FE 100%)', text: '#4338CA', border: '#A5B4FC' }, // Indigo
                                            { bg: 'linear-gradient(135deg, #F0FDF4 0%, #BBF7D0 100%)', text: '#15803D', border: '#86EFAC' }, // Green
                                            { bg: 'linear-gradient(135deg, #FFFBEB 0%, #FDE68A 100%)', text: '#B45309', border: '#FCD34D' }, // Amber
                                            { bg: 'linear-gradient(135deg, #FDF2F8 0%, #FBCFE8 100%)', text: '#BE185D', border: '#F9A8D4' }, // Pink
                                            { bg: 'linear-gradient(135deg, #F5F3FF 0%, #DDD6FE 100%)', text: '#6D28D9', border: '#C4B5FD' }, // Violet
                                        ];
                                        const color = colorVariations[(emp.companyName?.length || i) % colorVariations.length];
                                        
                                        return (
                                        <tr key={emp.id} style={{ animationDelay: `${i * 0.05}s` }} className="table-row-animate">
                                            <td>
                                                <div className="td-company-info">
                                                    <div className="item-avatar" style={{ background: color.bg, color: color.text, borderColor: color.border }}>
                                                        {(emp.companyName || '?')[0]}
                                                    </div>
                                                    <div className="td-name-col">
                                                        <span className="td-company-name">{emp.companyName}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="td-meta-col">
                                                    <span className="td-industry">{emp.industry || 'General Sector'}</span>
                                                    <span className="td-location"><MapPin size={12}/> {emp.location || 'Nepal'}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="td-date-badge">
                                                    {new Date(emp.createdAt || emp.created_at || new Date()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="td-actions">
                                                    <button className="btn-icon view" onClick={() => setJobsModalEmpId(emp.id)} title="View Jobs">
                                                        <Briefcase size={14} />
                                                    </button>
                                                    <button className="btn-icon delete" onClick={() => setConfirmDelId(emp.id)} title="Delete">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {totalPages > 0 && (
                                <div className="table-pagination">
                                    <button 
                                        className="pag-btn" 
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft size={16} /> Prev
                                    </button>
                                    <div className="pag-info">
                                        <span className="pag-page-num">Page {currentPage} of {totalPages}</span>
                                    </div>
                                    <button 
                                        className="pag-btn" 
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next <ChevronRight size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Quick Actions & Trends */}
                    <div className="admin-side-col">
                        <div className="admin-content-card no-padding">
                            <div className="card-header border-bottom">
                                <h2 className="card-title">Quick Tasks</h2>
                            </div>
                            <div className="quick-links-list">
                                <QuickLink
                                    label="Review Talent"
                                    desc="Browse recently joined job seekers"
                                    icon={<Users size={18} />}
                                    color="#10B981"
                                    onClick={() => navigate(ROUTES.ADMIN_JOBSEEKERS)}
                                />
                                <QuickLink
                                    label="Monitor Jobs"
                                    desc="Active postings & analytics"
                                    icon={<Activity size={18} />}
                                    color="#F59E0B"
                                    onClick={() => navigate(ROUTES.ADMIN_JOBS)}
                                />
                                <QuickLink
                                    label="Manage Access"
                                    desc="System settings & security"
                                    icon={<Shield size={18} />}
                                    color="#6366F1"
                                    onClick={() => { }}
                                />
                            </div>
                        </div>

                        <div className="admin-content-card gradient-card">
                            <div className="trend-content">
                                <div className="trend-icon"><Zap size={20} /></div>
                                <h3 className="trend-title">Platform Pulse</h3>
                                <p className="trend-desc">Engagement is up 12% this week compared to last month.</p>
                                <div className="trend-bar-wrap">
                                    <div className="trend-bar" style={{ width: '65%' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALS */}
            {confirmDelId && (
                <div className="admin-modal-overlay" onClick={() => setConfirmDelId(null)}>
                    <div className="admin-modal delete-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-icon-wrap"><Trash2 size={24} /></div>
                        <h3>Remove Employer?</h3>
                        <p>This action will permanently delete the company account and all associated job listings. This cannot be undone.</p>
                        <div className="modal-footer">
                            <button className="modal-btn cancel" onClick={() => setConfirmDelId(null)}>Cancel</button>
                            <button className="modal-btn confirm" onClick={() => handleDelete(confirmDelId)}>Yes, Remove</button>
                        </div>
                    </div>
                </div>
            )}

            {jobsModalEmpId && (
                <JobsModal empId={jobsModalEmpId} onClose={() => setJobsModalEmpId(null)} employers={employers} />
            )}

            <style>{`
                .admin-page { padding: 32px 40px; min-height: 100vh; background: #F8FAFC; }

                /* ── HERO ── */
                /* ── HERO ── */
                .admin-hero {
                    border-radius: 24px; padding: 48px; margin-bottom: 32px;
                    position: relative; overflow: hidden; animation: dashFadeUp 0.5s ease both;
                    min-height: 240px;
                }
                .dash-hero-morning { background: linear-gradient(135deg, #1e3a5f 0%, #3d6f8e 30%, #87CEEB 60%, #FFE4B5 90%); }
                .dash-hero-afternoon { background: linear-gradient(135deg, #1565C0 0%, #42A5F5 40%, #90CAF9 70%, #E3F2FD 100%); }
                .dash-hero-evening { background: linear-gradient(135deg, #1a0533 0%, #4a1942 25%, #c2185b 50%, #ff6f00 75%, #ffab40 100%); }
                .dash-hero-night { background: linear-gradient(135deg, #020111 0%, #0a0e2a 30%, #141852 60%, #1b2240 100%); }

                .hero-content { position: relative; z-index: 2; display: flex; width: 100%; justify-content: space-between; align-items: center; min-height: 140px; }
                .hero-left { max-width: 500px; }
                .hero-tag { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; font-size: 0.65rem; font-weight: 600; color: rgba(255,255,255,0.8); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; backdrop-filter: blur(8px); }
                .hero-title { font-size: 2.25rem; font-weight: 800; color: #111827; letter-spacing: -0.03em; margin-bottom: 10px; text-shadow: 0 1px 3px rgba(0,0,0,0.1); }
                .hero-subtitle { font-size: 1.05rem; color: rgba(0,0,0,0.5); font-weight: 500; margin-bottom: 24px; }
                .dash-hero-night .hero-subtitle { color: rgba(255,255,255,0.6); }
                .dash-hero-evening .hero-subtitle { color: rgba(255,255,255,0.7); }

                .hero-actions { display: flex; gap: 12px; }
                .hero-btn { display: flex; align-items: center; gap: 8px; padding: 12px 22px; border-radius: 12px; font-size: 0.88rem; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; font-family: inherit; }
                .hero-btn.primary { background: #111827; color: white; box-shadow: 0 10px 20px rgba(0,0,0,0.15); }
                .hero-btn.primary:hover { background: #000000; transform: translateY(-2px); }
                .hero-btn.secondary { background: rgba(255,255,255,0.8); color: #374151; backdrop-filter: blur(10px); }
                .hero-btn.secondary:hover { background: #FFFFFF; transform: translateY(-2px); }

                .hero-right { position: relative; margin-right: -10px; }
                .hero-glass-card { background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 28px 36px; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.1); min-width: 180px; }
                .hero-stat-label { font-size: 0.72rem; font-weight: 600; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.08em; }
                .hero-stat-value { font-size: 3rem; font-weight: 800; color: white; letter-spacing: -0.04em; margin: 6px 0; }
                .hero-online { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.72rem; color: rgba(255,255,255,0.6); font-weight: 500; }
                .pulse-dot { width: 8px; height: 8px; background: #10B981; border-radius: 50%; box-shadow: 0 0 0 rgba(16,185,129,0.4); animation: dashPulse 2s infinite; }

                /* ── SKY ELEMENTS ── */
                .dash-sky-scene { position: absolute; inset: 0; pointer-events: none; }
                .dash-star { position: absolute; background: white; border-radius: 50%; animation: dashTwinkle 2s ease-in-out infinite alternate; }
                .dash-moon { position: absolute; top: 15px; right: 30px; width: 45px; height: 45px; border-radius: 50%; background: linear-gradient(135deg, #f5f3ce 0%, #d4d0a0 100%); box-shadow: 0 0 20px rgba(245,243,206,0.25); animation: dashMoonFloat 6s ease-in-out infinite; z-index: 1; }
                .dash-moon-crater { position: absolute; border-radius: 50%; background: rgba(0,0,0,0.05); }
                .dash-moon-glow { position: absolute; top: 5px; right: 20px; width: 65px; height: 65px; border-radius: 50%; background: radial-gradient(circle, rgba(245,243,206,0.08) 0%, transparent 70%); }
                .dash-sun { position: absolute; border-radius: 50%; animation: dashSunPulse 4s ease-in-out infinite; }
                .dash-morning-sun { top: 15px; right: 30px; width: 40px; height: 40px; background: radial-gradient(circle, #FFD93D 30%, #FF9A3C 70%); box-shadow: 0 0 50px rgba(255,217,61,0.4); }
                .dash-sun-ray { position: absolute; top: 50%; left: 50%; width: 80px; height: 2px; background: linear-gradient(90deg, transparent, rgba(255,217,61,0.2), transparent); transform-origin: center; margin-left: -40px; margin-top: -1px; animation: dashRayRotate 10s linear infinite; }
                .dash-afternoon-sun { top: 15px; right: 40px; width: 35px; height: 35px; background: radial-gradient(circle, #fff 20%, #FFD93D 60%); box-shadow: 0 0 60px rgba(255,217,61,0.5); }
                .dash-sunset-orb { position: absolute; bottom: 5px; right: 40px; width: 55px; height: 28px; border-radius: 60px 60px 0 0; background: linear-gradient(to top, #FF1744, #FF6B35); box-shadow: 0 0 40px rgba(255,107,53,0.4); }

                @keyframes dashTwinkle { from { opacity: 0.3; transform: scale(0.8); } to { opacity: 1; transform: scale(1.1); } }
                @keyframes dashMoonFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
                @keyframes dashSunPulse { 0%, 100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.08); opacity: 1; } }
                @keyframes dashRayRotate { 100% { transform: rotate(360deg); } }

                /* ── STATS ── */
                .admin-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 32px; animation: dashFadeUp 0.4s ease 0.05s both; }
                .admin-stat-card { background: white; border-radius: 20px; padding: 24px; border: 1px solid #E5E7EB; position: relative; overflow: hidden; display: flex; align-items: center; gap: 18px; transition: all 0.25s; animation: dashFadeUp 0.4s ease both; }
                .admin-stat-card:hover { transform: translateY(-4px); box-shadow: 0 10px 25px rgba(0,0,0,0.05); border-color: #D1D5DB; }
                .stat-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .stat-info { flex: 1; }
                .stat-value { font-size: 1.65rem; font-weight: 800; color: #111827; letter-spacing: -0.02em; }
                .stat-label { font-size: 0.78rem; font-weight: 600; color: #64748B; margin-top: 1px; }
                .stat-badge { position: absolute; top: 12px; right: 12px; display: flex; align-items: center; gap: 4px; padding: 3px 8px; background: #F0FDF4; border: 1px solid #DCFCE7; border-radius: 20px; font-size: 0.62rem; font-weight: 700; color: #16A34A; text-transform: uppercase; }

                /* ── LAYOUT ── */
                .admin-main-layout { display: grid; grid-template-columns: 1.8fr 1fr; gap: 24px; }
                .admin-content-card { background: white; border-radius: 20px; border: 1px solid #E2E8F0; display: flex; flex-direction: column; overflow: hidden; animation: dashFadeUp 0.4s ease 0.1s both; }
                .admin-content-card.no-padding { padding: 0; }
                .admin-content-card.gradient-card { background: linear-gradient(135deg, #111827 0%, #1F2937 100%); color: white; padding: 32px; height: 200px; display: flex; align-items: center; justify-content: center; }
                .card-header { padding: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
                .card-header.border-bottom { border-bottom: 1px solid #F1F5F9; }
                .card-title { font-size: 1.15rem; font-weight: 750; color: #111827; letter-spacing: -0.01em; }
                .card-subtitle { font-size: 0.85rem; color: #64748B; margin-top: 2px; }
                .card-action-btn { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 10px; background: #F8FAFC; border: 1px solid #E2E8F0; color: #334155; font-size: 0.75rem; font-weight: 650; cursor: pointer; transition: all 0.2s; }
                .card-action-btn:hover { background: #F1F5F9; border-color: #CBD5E1; color: #111827; }

                /* ── TABLE LISTS & PAGINATION ── */
                .admin-table-container { padding: 0 24px 24px; display: flex; flex-direction: column; overflow-x: auto; }
                .admin-custom-table { width: 100%; border-collapse: separate; border-spacing: 0 10px; margin-top: 10px; }
                .admin-custom-table th { color: #64748B; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 0 20px 10px; text-align: left; border-bottom: 1px solid #F1F5F9; }
                
                .admin-custom-table tbody tr { background: #FFFFFF; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
                .admin-custom-table tbody tr:hover { transform: translateY(-3px) scale(1.01); box-shadow: 0 12px 20px -8px rgba(0, 0, 0, 0.1); position: relative; z-index: 2; }
                
                .admin-custom-table td { padding: 16px 20px; font-size: 0.95rem; color: #334155; vertical-align: middle; border-top: 1px solid #F1F5F9; border-bottom: 1px solid #F1F5F9; }
                .admin-custom-table td:first-child { border-left: 1px solid #F1F5F9; border-top-left-radius: 16px; border-bottom-left-radius: 16px; }
                .admin-custom-table td:last-child { border-right: 1px solid #F1F5F9; border-top-right-radius: 16px; border-bottom-right-radius: 16px; }

                .td-company-info { display: flex; align-items: center; gap: 14px; }
                .item-avatar { width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); border: 1px solid #C7D2FE; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #4338CA; font-size: 1.3rem; flex-shrink: 0; box-shadow: inset 0 2px 4px rgba(255,255,255,0.6); text-transform: uppercase; }
                .td-name-col { display: flex; flex-direction: column; gap: 4px; }
                .td-company-name { font-size: 1.05rem; font-weight: 800; color: #0F172A; letter-spacing: -0.01em; }
                .td-company-id { font-size: 0.7rem; color: #94A3B8; font-family: monospace; }
                
                .td-meta-col { display: flex; flex-direction: column; gap: 4px; }
                .td-industry { font-size: 0.88rem; font-weight: 600; color: #475569; }
                .td-location { display: flex; align-items: center; gap: 4px; font-size: 0.75rem; color: #94A3B8; }
                
                .td-date-badge { display: inline-flex; padding: 5px 12px; background: #EEF2FF; border: 1px solid #E0E7FF; border-radius: 20px; font-size: 0.72rem; font-weight: 700; color: #4F46E5; white-space: nowrap; }

                .td-actions { display: flex; gap: 8px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .btn-icon { width: 36px; height: 36px; border-radius: 12px; border: 1px solid transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
                .btn-icon.view { background: #F0F9FF; color: #0284C7; border-color: #E0F2FE; }
                .btn-icon.view:hover { background: #E0F2FE; color: #0369A1; border-color: #BAE6FD; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(2, 132, 199, 0.15); }
                .btn-icon.delete { background: #FEF2F2; color: #EF4444; border-color: #FEE2E2; }
                .btn-icon.delete:hover { background: #FEE2E2; color: #DC2626; border-color: #FECACA; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15); }
                .list-empty { padding: 40px; text-align: center; color: #94A3B8; font-size: 0.88rem; }
                
                .table-row-animate { animation: dashFadeUp 0.4s ease both; }

                .table-pagination { display: flex; align-items: center; justify-content: space-between; margin-top: 16px; padding: 12px 16px; background: #FAF5FF; border-radius: 14px; border: 1px solid #F3E8FF; }
                .pag-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 10px; background: #9333EA; border: 1px solid #7E22CE; color: white; font-size: 0.8rem; font-weight: 650; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 6px rgba(147, 51, 234, 0.2); }
                .pag-btn:hover:not(:disabled) { background: #7E22CE; border-color: #6B21A8; transform: translateY(-1px); box-shadow: 0 6px 12px rgba(147, 51, 234, 0.3); }
                .pag-btn:disabled { background: #D8B4FE; border-color: #C084FC; color: rgba(255,255,255,0.8); cursor: not-allowed; box-shadow: none; transform: none; }
                .pag-info { font-size: 0.82rem; font-weight: 700; color: #7E22CE; }

                /* ── SIDE COL ── */
                .admin-side-col { display: flex; flex-direction: column; gap: 24px; }
                .quick-links-list { display: flex; flex-direction: column; }
                .admin-quick-link { display: flex; align-items: center; gap: 16px; padding: 18px 24px; border: none; background: transparent; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid #F8FAFC; text-align: left; }
                .admin-quick-link:hover { background: #F8FAFC; }
                .ql-icon { width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: transform 0.2s; }
                .admin-quick-link:hover .ql-icon { transform: scale(1.08); }
                .ql-text { flex: 1; }
                .ql-label { display: block; font-size: 0.92rem; font-weight: 650; color: #111827; }
                .ql-desc { display: block; font-size: 0.75rem; color: #94A3B8; margin-top: 1px; }
                .ql-arrow { color: #CBD5E1; opacity: 0.5; transition: transform 0.2s; }
                .admin-quick-link:hover .ql-arrow { transform: translateX(3px); opacity: 1; color: #111827; }

                .trend-content { text-align: center; width: 100%; transition: transform 0.3s; }
                .gradient-card:hover .trend-content { transform: scale(1.03); }
                .trend-icon { width: 48px; height: 48px; border-radius: 16px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; color: #F59E0B; }
                .trend-title { font-size: 1.25rem; font-weight: 750; margin-bottom: 8px; }
                .trend-desc { font-size: 0.85rem; color: rgba(255,255,255,0.6); line-height: 1.5; margin-bottom: 20px; }
                .trend-bar-wrap { height: 8px; background: rgba(255,255,255,0.08); border-radius: 10px; overflow: hidden; width: 80%; margin: 0 auto; }
                .trend-bar { height: 100%; background: linear-gradient(90deg, #F59E0B, #FBBF24); border-radius: 10px; animation: trendSlide 1.5s ease-out; }

                /* ── MODALS ── */
                .admin-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 2000; animation: dashFadeIn 0.2s ease; }
                .admin-modal { background: white; border-radius: 24px; padding: 32px; width: 90%; max-width: 440px; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); animation: dashModalUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
                .modal-icon-wrap { width: 64px; height: 64px; border-radius: 16px; background: #FEF2F2; color: #EF4444; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
                .admin-modal h3 { font-size: 1.25rem; font-weight: 750; color: #111827; margin-bottom: 12px; }
                .admin-modal p { color: #64748B; font-size: 0.88rem; line-height: 1.6; margin-bottom: 28px; }
                .modal-footer { display: flex; gap: 12px; }
                .modal-btn { flex: 1; padding: 14px; border-radius: 14px; font-weight: 600; font-size: 0.88rem; cursor: pointer; transition: all 0.2s; border: none; font-family: inherit; }
                .modal-btn.cancel { background: #F1F5F9; color: #64748B; }
                .modal-btn.cancel:hover { background: #E2E8F0; }
                .modal-btn.confirm { background: #EF4444; color: white; display: flex; align-items: center; justify-content: center; }
                .modal-btn.confirm:hover { background: #DC2626; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(220,38,38,0.25); }

                @keyframes dashFadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes dashFadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes dashModalUp { from { opacity: 0; transform: translateY(40px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
                @keyframes dashPulse { 0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); } 70% { box-shadow: 0 0 0 10px rgba(16,185,129,0); } 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); } }
                @keyframes trendSlide { from { width: 0; } to { width: 65%; } }
            `}</style>
        </>
    );
};

/* ── Jobs Modal Component ── */
const JobsModal = ({ empId, onClose, employers }) => {
    const { data: d, isLoading } = useGetEmployerJobs(empId);
    const jobs = d?.jobs || [];
    const emp = employers.find(e => e.id === empId);

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <div className="admin-modal jobs-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '620px', textAlign: 'left' }}>
                <div className="modal-top">
                    <div>
                        <span className="modal-label">Company Jobs</span>
                        <h2 className="modal-title">{emp?.companyName || 'Company'}</h2>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <div className="modal-jobs-list">
                    {isLoading ? (
                        <div className="modal-loading">Fetching job listings...</div>
                    ) : jobs.length === 0 ? (
                        <div className="modal-empty">This employer has no active job postings.</div>
                    ) : (
                        jobs.map(job => (
                            <div key={job.id} className="modal-job-item">
                                <div className="job-info">
                                    <div className="job-title">{job.title}</div>
                                    <div className="job-meta">
                                        <span><MapPin size={12} /> {job.location || 'Nepal'}</span>
                                        <span className="bullet">•</span>
                                        <span><Clock size={12} /> {job.jobType || 'Full-time'}</span>
                                    </div>
                                </div>
                                <div className={`job-status ${job.is_active ? 'active' : 'inactive'}`}>
                                    {job.is_active ? 'Active' : 'Closed'}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <style>{`
                    .jobs-modal { padding: 32px; border-radius: 28px; }
                    .modal-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
                    .modal-label { font-size: 0.65rem; font-weight: 700; color: #6366F1; text-transform: uppercase; letter-spacing: 0.1em; }
                    .modal-title { font-size: 1.5rem; font-weight: 800; color: #111827; letter-spacing: -0.02em; margin-top: 4px; }
                    .modal-close-btn { width: 36px; height: 36px; border-radius: 12px; background: #F8FAFC; border: 1px solid #E2E8F0; color: #64748B; cursor: pointer; display: flex; align-items: center; justify-content: center; }
                    .modal-close-btn:hover { background: #F1F5F9; color: #111827; }
                    .modal-jobs-list { display: flex; flex-direction: column; gap: 10px; max-height: 400px; overflow-y: auto; padding-right: 4px; }
                    .modal-job-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; background: #F8FAFC; border-radius: 16px; border: 1px solid #F1F5F9; }
                    .job-title { font-size: 0.95rem; font-weight: 650; color: #111827; margin-bottom: 4px; }
                    .job-meta { display: flex; align-items: center; gap: 8px; font-size: 0.75rem; color: #64748B; }
                    .job-status { font-size: 0.65rem; font-weight: 700; padding: 4px 10px; border-radius: 8px; text-transform: uppercase; }
                    .job-status.active { background: #DCFCE7; color: #16A34A; }
                    .job-status.inactive { background: #F3F4F6; color: #6B7280; }
                    .modal-loading, .modal-empty { padding: 40px; text-align: center; color: #94A3B8; font-size: 0.88rem; }
                    .bullet { color: #CBD5E1; }
                `}</style>
            </div>
        </div>
    );
};

export default AdminDashboard;
