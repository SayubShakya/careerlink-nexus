import React, { useState, useMemo } from 'react';
import { useGetAllEmployers, useDeleteEmployer, useGetEmployerJobs } from '@/hooks/api/admin/useAdmin';
import {
    Building2, Search, Trash2, Briefcase, Globe, X, Mail, Phone,
    MapPin, ChevronLeft, ChevronRight, ExternalLink, Calendar,
    CheckCircle2, Users, ArrowUpRight, Filter, TrendingUp,
    BarChart3, Activity
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ── Mini Sky Scene ── */
const PageHeroSky = ({ timeOfDay }) => (
    <div className="ep-sky-scene">
        {timeOfDay === 'night' && (
            <>
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="ep-star" style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${1.5 + Math.random() * 2}s`,
                        width: `${2 + Math.random() * 2}px`,
                        height: `${2 + Math.random() * 2}px`
                    }} />
                ))}
                <div className="ep-moon">
                    <div className="ep-moon-crater" style={{ width: 8, height: 8, top: 8, left: 12 }} />
                    <div className="ep-moon-crater" style={{ width: 5, height: 5, top: 18, left: 6 }} />
                    <div className="ep-moon-crater" style={{ width: 4, height: 4, top: 12, left: 22 }} />
                </div>
                <div className="ep-moon-glow" />
            </>
        )}
        {timeOfDay === 'morning' && (
            <>
                <div className="ep-sun ep-morning-sun">
                    <div className="ep-sun-ray" />
                    <div className="ep-sun-ray" style={{ transform: 'rotate(60deg)' }} />
                    <div className="ep-sun-ray" style={{ transform: 'rotate(120deg)' }} />
                </div>
                <div className="ep-glow ep-morning-glow" />
                <div className="ep-cloud ep-cloud-1" />
                <div className="ep-cloud ep-cloud-2" />
            </>
        )}
        {timeOfDay === 'afternoon' && (
            <>
                <div className="ep-sun ep-afternoon-sun" />
                <div className="ep-glow ep-afternoon-glow" />
                <div className="ep-cloud ep-cloud-1" />
            </>
        )}
        {timeOfDay === 'evening' && (
            <>
                <div className="ep-sunset-orb" />
                <div className="ep-sunset-glow" />
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="ep-star" style={{
                        left: `${15 + Math.random() * 65}%`,
                        top: `${5 + Math.random() * 45}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        width: '2px', height: '2px'
                    }} />
                ))}
                <div className="ep-cloud ep-cloud-ev" />
            </>
        )}
    </div>
);

/* ── Stat Pill ── */
const StatPill = ({ label, value, icon, color, bg }) => (
    <div className="ep-stat-pill" style={{ background: bg, borderColor: `${color}20` }}>
        <div className="ep-sp-icon" style={{ color }}>{icon}</div>
        <div className="ep-sp-info">
            <span className="ep-sp-value">{value}</span>
            <span className="ep-sp-label">{label}</span>
        </div>
    </div>
);

const AdminEmployers = () => {
    const { data: employers = [], isLoading, refetch } = useGetAllEmployers();
    const deleteEmployer = useDeleteEmployer();
    const [search, setSearch] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [page, setPage] = useState(1);
    const perPage = 6;

    const hour = new Date().getHours();
    const timeOfDay = hour >= 5 && hour < 12 ? 'morning' : hour >= 12 && hour < 17 ? 'afternoon' : hour >= 17 && hour < 20 ? 'evening' : 'night';

    const filtered = useMemo(() => employers.filter(e =>
        e.companyName?.toLowerCase().includes(search.toLowerCase()) ||
        e.email?.toLowerCase().includes(search.toLowerCase()) ||
        e.industry?.toLowerCase().includes(search.toLowerCase())
    ), [employers, search]);

    const totalPages = Math.ceil(filtered.length / perPage);
    const current = filtered.slice((page - 1) * perPage, page * perPage);
    const totalJobs = employers.reduce((a, e) => a + (e.jobCount || 0), 0);
    const verifiedCount = employers.filter(e => e.is_verified).length;

    const handleDelete = id => {
        deleteEmployer.mutate(id, {
            onSuccess: () => {
                setDeleteId(null);
                refetch();
                toast.success('Employer removed');
            }
        });
    };

    const getCompanyColor = (name) => {
        const colors = [
            { grad: 'linear-gradient(135deg, #6366F1, #818CF8)', shadow: 'rgba(99,102,241,0.2)' },
            { grad: 'linear-gradient(135deg, #10B981, #34D399)', shadow: 'rgba(16,185,129,0.2)' },
            { grad: 'linear-gradient(135deg, #F59E0B, #FBBF24)', shadow: 'rgba(245,158,11,0.2)' },
            { grad: 'linear-gradient(135deg, #EC4899, #F472B6)', shadow: 'rgba(236,72,153,0.2)' },
            { grad: 'linear-gradient(135deg, #4F46E5, #6366F1)', shadow: 'rgba(79,70,229,0.2)' },
            { grad: 'linear-gradient(135deg, #06B6D4, #22D3EE)', shadow: 'rgba(6,182,212,0.2)' },
            { grad: 'linear-gradient(135deg, #8B5CF6, #A78BFA)', shadow: 'rgba(139,92,246,0.2)' },
        ];
        return colors[(name || '?').charCodeAt(0) % colors.length];
    };

    return (
        <>
            <div className="ep-page">
                {/* ───── HERO SECTION ───── */}
                <div className={`ep-hero ep-hero-${timeOfDay}`}>
                    <PageHeroSky timeOfDay={timeOfDay} />
                    <div className="ep-hero-content">
                        <div className="ep-hero-left">
                            <span className="ep-hero-badge"><Building2 size={12} /> Employer Management</span>
                            <h1 className="ep-hero-title">All Employers</h1>
                            <p className="ep-hero-desc">View and manage all registered companies on the platform.</p>
                        </div>
                        <div className="ep-hero-right">
                            <div className="ep-hero-stats">
                                <div className="ep-hero-stat-card"><div className="ep-hsc-icon indigo"><Building2 size={16} /></div><span className="ep-hsc-val">{employers.length}</span><span className="ep-hsc-label">Companies</span></div>
                                <div className="ep-hero-stat-card"><div className="ep-hsc-icon green"><CheckCircle2 size={16} /></div><span className="ep-hsc-val green">{verifiedCount}</span><span className="ep-hsc-label">Verified</span></div>
                                <div className="ep-hero-stat-card"><div className="ep-hsc-icon amber"><Briefcase size={16} /></div><span className="ep-hsc-val">{totalJobs}</span><span className="ep-hsc-label">Total Jobs</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ───── QUICK STATS ───── */}
                <div className="ep-quick-stats">
                    <StatPill label="Companies" value={employers.length} icon={<Building2 size={16} />} color="#6366F1" bg="#EEF2FF" />
                    <StatPill label="Total Jobs" value={totalJobs} icon={<Briefcase size={16} />} color="#F59E0B" bg="#FFFBEB" />
                    <StatPill label="Verified" value={verifiedCount} icon={<CheckCircle2 size={16} />} color="#10B981" bg="#ECFDF5" />
                    <StatPill label="Industries" value={[...new Set(employers.map(e => e.industry).filter(Boolean))].length || '—'} icon={<BarChart3 size={16} />} color="#EC4899" bg="#FDF2F8" />
                </div>

                {/* ───── SEARCH & FILTERS ───── */}
                <div className="ep-controls">
                    <div className="ep-search-wrap">
                        <Search size={18} className="ep-search-icon" />
                        <input
                            type="text"
                            className="ep-search-input"
                            placeholder="Search by company, email, or industry..."
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                        />
                        {search && <button className="ep-search-clear" onClick={() => { setSearch(''); setPage(1); }}><X size={14} /></button>}
                    </div>
                </div>

                <div className="ep-results-bar">
                    <span className="ep-results-text">Showing <strong>{(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)}</strong> of <strong>{filtered.length}</strong> employers</span>
                    {search && <span className="ep-search-tag">Results for "{search}" <button onClick={() => setSearch('')}><X size={12} /></button></span>}
                </div>

                {/* ───── CARDS GRID ───── */}
                {isLoading ? (
                    <div className="ep-empty-state"><div className="ep-spinner" /><span>Loading employers...</span></div>
                ) : current.length === 0 ? (
                    <div className="ep-empty-state"><div className="ep-empty-icon"><Building2 size={40} /></div><h3>No employers found</h3><p>Try adjusting your search criteria.</p></div>
                ) : (
                    <div className="ep-cards-grid">
                        {current.map((emp, i) => {
                            const compColor = getCompanyColor(emp.companyName);
                            return (
                                <div key={emp.id} className="ep-card" style={{ animationDelay: `${i * 0.04}s` }}>
                                    <div className="ep-card-accent" style={{ background: compColor.grad }} />
                                    <div className="ep-card-header">
                                        <div className="ep-card-company">
                                            <div className="ep-card-avatar" style={{ background: compColor.grad, boxShadow: `0 4px 12px ${compColor.shadow}`, overflow: 'hidden' }}>
                                                {emp.profile_picture ? (
                                                    <img 
                                                        src={emp.profile_picture.startsWith('http') ? emp.profile_picture : `http://localhost:5000/uploads/${emp.profile_picture.replace(/^(\/?uploads\/|\/)/, '')}`} 
                                                        alt="Logo" 
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                    />
                                                ) : (
                                                    (emp.companyName || '?')[0]
                                                )}
                                            </div>
                                            <div>
                                                <div className="ep-card-name">{emp.companyName}</div>
                                                <div className="ep-card-industry">{emp.industry || 'Industry not set'}</div>
                                            </div>
                                        </div>
                                        <span className={`ep-card-status ${emp.is_verified ? 'verified' : 'active'}`}><span className="ep-card-status-dot" />{emp.is_verified ? 'Verified' : 'Active'}</span>
                                    </div>
                                    <div className="ep-card-info">
                                        <div className="ep-card-info-item"><Mail size={13} className="ep-info-icon" /><span className="ep-info-text">{emp.email}</span></div>
                                        <div className="ep-card-info-item"><MapPin size={13} className="ep-info-icon" /><span className="ep-info-text">{emp.location || 'Not specified'}</span></div>
                                        {emp.companyWebsite && <div className="ep-card-info-item"><Globe size={13} className="ep-info-icon" /><span className="ep-info-text ep-link">{emp.companyWebsite}</span></div>}
                                    </div>
                                    <div className="ep-card-divider" />
                                    <div className="ep-card-footer">
                                        <div className="ep-card-jobs-pill" onClick={() => setSelectedId(emp.id)}><Briefcase size={13} /><span className="ep-jobs-count">{emp.jobCount || 0}</span><span>jobs</span></div>
                                        <div className="ep-card-date"><Calendar size={12} />{emp.created_at ? new Date(emp.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</div>
                                        <div className="ep-card-actions">
                                            <button className="ep-btn-view" onClick={() => setSelectedId(emp.id)} title="View jobs"><ExternalLink size={14} /></button>
                                            <button className="ep-btn-delete" onClick={() => setDeleteId(emp.id)} title="Remove"><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ───── PAGINATION ───── */}
                {totalPages > 1 && (
                    <div className="ep-pagination">
                        <button className="ep-pg-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={16} /> Previous</button>
                        <div className="ep-pg-numbers">{[...Array(totalPages)].map((_, i) => <button key={i} className={`ep-pg-num ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>)}</div>
                        <button className="ep-pg-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next <ChevronRight size={16} /></button>
                    </div>
                )}
            </div>

            {/* ───── MODALS ───── */}
            {selectedId && <JobsModal empId={selectedId} employers={employers} getCompanyColor={getCompanyColor} onClose={() => setSelectedId(null)} />}

            {deleteId && (
                <div className="ep-overlay" onClick={() => setDeleteId(null)}>
                    <div className="ep-delete-modal" onClick={e => e.stopPropagation()}>
                        <div className="ep-dm-icon"><Trash2 size={26} /></div>
                        <h3 className="ep-dm-title">Remove this employer?</h3>
                        <p className="ep-dm-desc">Their account and all job listings will be permanently deleted. This action cannot be undone.</p>
                        <div className="ep-dm-actions">
                            <button className="ep-dm-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
                            <button className="ep-dm-confirm" onClick={() => handleDelete(deleteId)}>{deleteEmployer.isPending ? 'Removing...' : 'Yes, Remove'}</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .ep-page { padding: 28px 36px; min-height: 100vh; background: #F8FAFC; font-family: 'Inter', system-ui, sans-serif; }
                
                /* ── HERO ── */
                .ep-hero { border-radius: 22px; padding: 38px 48px; margin-bottom: 22px; position: relative; overflow: hidden; animation: epFadeUp 0.5s ease both; min-height: 150px; }
                .ep-hero-morning { background: linear-gradient(135deg, #1e3a5f 0%, #3d6f8e 30%, #87CEEB 60%, #FFE4B5 90%); }
                .ep-hero-afternoon { background: linear-gradient(135deg, #1565C0 0%, #42A5F5 40%, #90CAF9 70%, #E3F2FD 100%); }
                .ep-hero-evening { background: linear-gradient(135deg, #1a0533 0%, #4a1942 25%, #c2185b 50%, #ff6f00 75%, #ffab40 100%); }
                .ep-hero-night { background: linear-gradient(135deg, #020111 0%, #0a0e2a 30%, #141852 60%, #1b2240 100%); }
                
                .ep-hero-content { position: relative; z-index: 2; display: flex; justify-content: space-between; align-items: center; }
                .ep-hero-left { color: white; }
                .ep-hero-badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; font-size: 0.65rem; font-weight: 600; color: rgba(255,255,255,0.8); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 14px; backdrop-filter: blur(8px); }
                .ep-hero-title { font-size: 1.85rem; font-weight: 700; color: #FFFFFF; letter-spacing: -0.03em; margin-bottom: 6px; text-shadow: 0 2px 10px rgba(0,0,0,0.25); }
                .ep-hero-desc { font-size: 0.9rem; color: rgba(255,255,255,0.55); line-height: 1.5; }
                
                .ep-hero-stats { display: flex; gap: 10px; }
                .ep-hero-stat-card { background: rgba(255,255,255,0.08); backdrop-filter: blur(14px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 14px 20px; text-align: center; min-width: 90px; transition: all 0.2s; }
                .ep-hero-stat-card:hover { background: rgba(255,255,255,0.12); transform: translateY(-2px); }
                .ep-hsc-icon { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 0 auto 6px; }
                .ep-hsc-icon.indigo { background: rgba(99,102,241,0.15); color: #A5B4FC; }
                .ep-hsc-icon.green { background: rgba(16,185,129,0.15); color: #34D399; }
                .ep-hsc-icon.amber { background: rgba(245,158,11,0.15); color: #FBBF24; }
                .ep-hsc-val { display: block; font-size: 1.5rem; font-weight: 700; color: white; letter-spacing: -0.03em; }
                .ep-hsc-val.green { color: #34D399; }
                .ep-hsc-label { font-size: 0.58rem; font-weight: 600; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.06em; }

                /* ── SKY ── */
                .ep-sky-scene { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
                .ep-star { position: absolute; background: white; border-radius: 50%; animation: epTwinkle 2s ease-in-out infinite alternate; box-shadow: 0 0 4px rgba(255,255,255,0.5); }
                .ep-moon { position: absolute; top: 14px; right: 200px; width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #f5f3ce 0%, #e8e4b8 50%, #d4d0a0 100%); box-shadow: 0 0 25px rgba(245,243,206,0.35); animation: epMoonFloat 6s ease-in-out infinite; }
                .ep-moon-crater { position: absolute; border-radius: 50%; background: rgba(0,0,0,0.05); }
                .ep-moon-glow { position: absolute; top: 0; right: 185px; width: 65px; height: 65px; border-radius: 50%; background: radial-gradient(circle, rgba(245,243,206,0.12) 0%, transparent 70%); }
                .ep-sun { position: absolute; border-radius: 50%; animation: epSunPulse 4s ease-in-out infinite; }
                .ep-morning-sun { top: 12px; right: 210px; width: 38px; height: 38px; background: radial-gradient(circle, #FFD93D 30%, #FF9A3C 70%); box-shadow: 0 0 35px rgba(255,217,61,0.45); }
                .ep-sun-ray { position: absolute; top: 50%; left: 50%; width: 70px; height: 2px; background: linear-gradient(90deg, transparent, rgba(255,217,61,0.25), transparent); transform-origin: center; margin-left: -35px; margin-top: -1px; animation: epRayRotate 10s linear infinite; }
                .ep-afternoon-sun { top: 8px; right: 215px; width: 32px; height: 32px; background: radial-gradient(circle, #fff 20%, #FFD93D 60%); box-shadow: 0 0 45px rgba(255,217,61,0.5); }
                .ep-glow { position: absolute; border-radius: 50%; }
                .ep-morning-glow { top: -15px; right: 185px; width: 85px; height: 85px; background: radial-gradient(circle, rgba(255,217,61,0.12) 0%, transparent 70%); }
                .ep-afternoon-glow { top: -20px; right: 190px; width: 90px; height: 90px; background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%); }
                .ep-sunset-orb { position: absolute; bottom: 5px; right: 230px; width: 50px; height: 25px; border-radius: 50px 50px 0 0; background: radial-gradient(circle at 50% 100%, #FF6B35, #FF1744); box-shadow: 0 0 35px rgba(255,107,53,0.45); animation: epSunsetPulse 5s ease-in-out infinite; }
                .ep-sunset-glow { position: absolute; bottom: -25px; right: 195px; width: 140px; height: 90px; background: radial-gradient(ellipse at 50% 100%, rgba(255,107,53,0.15) 0%, transparent 70%); }
                
                .ep-cloud { position: absolute; border-radius: 30px; }
                .ep-cloud::before, .ep-cloud::after { content: ''; position: absolute; border-radius: 50%; background: inherit; }
                .ep-cloud-1 { width: 55px; height: 15px; top: 22px; right: 65px; background: rgba(255,255,255,0.1); animation: epCloudDrift 18s ease-in-out infinite; }
                .ep-cloud-1::before { width: 24px; height: 24px; top: -11px; left: 9px; }
                .ep-cloud-1::after { width: 18px; height: 18px; top: -7px; left: 26px; }
                .ep-cloud-2 { width: 42px; height: 12px; top: 55px; right: 135px; background: rgba(255,255,255,0.07); animation: epCloudDrift 24s ease-in-out infinite reverse; }
                .ep-cloud-2::before { width: 18px; height: 18px; top: -8px; left: 7px; }
                .ep-cloud-2::after { width: 14px; height: 14px; top: -6px; left: 20px; }
                .ep-cloud-ev { width: 60px; height: 14px; top: 35px; right: 55px; background: rgba(255,150,100,0.1); animation: epCloudDrift 20s ease-in-out infinite; }
                .ep-cloud-ev::before { width: 24px; height: 24px; top: -10px; left: 10px; background: rgba(255,150,100,0.1); }
                .ep-cloud-ev::after { width: 18px; height: 18px; top: -7px; left: 30px; background: rgba(255,150,100,0.1); }

                /* ── PILLS ── */
                .ep-quick-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 22px; animation: epFadeUp 0.4s ease 0.06s both; }
                .ep-stat-pill { display: flex; align-items: center; gap: 14px; padding: 16px 20px; border-radius: 14px; border: 1px solid; transition: all 0.2s; }
                .ep-stat-pill:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.05); }
                .ep-sp-icon { flex-shrink: 0; }
                .ep-sp-value { display: block; font-size: 1.25rem; font-weight: 700; color: #111827; letter-spacing: -0.02em; }
                .ep-sp-label { font-size: 0.7rem; color: #6B7280; font-weight: 500; }

                /* ── CONTROLS ── */
                .ep-controls { display: flex; gap: 14px; margin-bottom: 14px; flex-wrap: wrap; animation: epFadeUp 0.4s ease 0.08s both; }
                .ep-search-wrap { position: relative; flex: 1; min-width: 280px; }
                .ep-search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #9CA3AF; pointer-events: none; }
                .ep-search-input { width: 100%; padding: 12px 42px 12px 46px; background: white; border: 1px solid #E5E7EB; border-radius: 14px; font-size: 0.88rem; color: #111827; outline: none; transition: all 0.25s; font-family: inherit; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
                .ep-search-input:focus { border-color: #6366F1; box-shadow: 0 0 0 3px rgba(99,102,241,0.08); }
                .ep-search-clear { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 24px; height: 24px; border-radius: 6px; border: none; background: #F3F4F6; color: #6B7280; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
                .ep-search-clear:hover { background: #E5E7EB; color: #111827; }

                .ep-results-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; animation: epFadeUp 0.4s ease 0.1s both; }
                .ep-results-text { font-size: 0.78rem; color: #6B7280; }
                .ep-results-text strong { color: #111827; font-weight: 600; }
                .ep-search-tag { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 8px; background: #EEF2FF; border: 1px solid #C7D2FE; font-size: 0.72rem; color: #4338CA; font-weight: 500; }
                .ep-search-tag button { border: none; background: transparent; color: #6366F1; cursor: pointer; display: flex; }

                /* ── GRID ── */
                .ep-cards-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; }
                .ep-card { background: white; border-radius: 18px; border: 1px solid #E5E7EB; overflow: hidden; transition: all 0.25s ease; animation: epFadeUp 0.4s ease both; position: relative; }
                .ep-card:hover { border-color: #D1D5DB; box-shadow: 0 10px 30px rgba(0,0,0,0.07); transform: translateY(-4px); }
                .ep-card-accent { height: 4px; width: 100%; transition: height 0.2s; }
                .ep-card:hover .ep-card-accent { height: 5px; }

                .ep-card-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px 0; }
                .ep-card-company { display: flex; align-items: center; gap: 12px; }
                .ep-card-avatar { width: 46px; height: 46px; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 1rem; transition: transform 0.2s; flex-shrink: 0; }
                .ep-card:hover .ep-card-avatar { transform: scale(1.08); }
                .ep-card-name { font-size: 1rem; font-weight: 650; color: #111827; letter-spacing: -0.01em; }
                .ep-card-industry { font-size: 0.72rem; color: #9CA3AF; margin-top: 2px; }

                .ep-card-status { display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: 20px; font-size: 0.65rem; font-weight: 600; }
                .ep-card-status.verified { background: #ECFDF5; color: #059669; border: 1px solid #D1FAE5; }
                .ep-card-status.active { background: #EEF2FF; color: #4338CA; border: 1px solid #C7D2FE; }
                .ep-card-status-dot { width: 5px; height: 5px; border-radius: 50%; }
                .ep-card-status.verified .ep-card-status-dot { background: #10B981; }
                .ep-card-status.active .ep-card-status-dot { background: #6366F1; }

                .ep-card-info { padding: 16px 24px 0; display: flex; flex-direction: column; gap: 8px; }
                .ep-card-info-item { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: #4B5563; }
                .ep-info-icon { color: #9CA3AF; flex-shrink: 0; }
                .ep-info-text { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .ep-info-text.ep-link { color: #6366F1; }

                .ep-card-divider { height: 1px; background: #F3F4F6; margin: 16px 24px 0; }
                .ep-card-footer { display: flex; align-items: center; gap: 12px; padding: 14px 24px 20px; }
                .ep-card-jobs-pill { display: inline-flex; align-items: center; gap: 5px; padding: 5px 14px; border-radius: 8px; background: #EEF2FF; color: #4F46E5; border: 1px solid #E0E7FF; font-weight: 600; font-size: 0.72rem; cursor: pointer; transition: all 0.2s; }
                .ep-card-jobs-pill:hover { background: #E0E7FF; transform: scale(1.03); }
                .ep-card-date { display: flex; align-items: center; gap: 4px; font-size: 0.7rem; color: #9CA3AF; }
                .ep-card-actions { margin-left: auto; display: flex; gap: 6px; }
                
                .ep-btn-view { width: 34px; height: 34px; border-radius: 10px; border: 1px solid #E0E7FF; background: #EEF2FF; color: #6366F1; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
                .ep-btn-view:hover { background: #6366F1; color: white; transform: scale(1.08); }
                .ep-btn-delete { width: 34px; height: 34px; border-radius: 10px; border: 1px solid #FEE2E2; background: #FEF2F2; color: #EF4444; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
                .ep-btn-delete:hover { background: #EF4444; color: white; transform: scale(1.08); }

                /* ── PAGINATION ── */
                .ep-pagination { display: flex; justify-content: center; align-items: center; gap: 10px; padding: 20px 0; }
                .ep-pg-btn { border: 1px solid #E5E7EB; background: white; padding: 8px 16px; border-radius: 10px; font-size: 0.8rem; cursor: pointer; color: #374151; transition: 0.2s; }
                .ep-pg-btn:disabled { opacity: 0.4; cursor: not-allowed; }
                .ep-pg-btn:hover:not(:disabled) { border-color: #6366F1; color: #6366F1; }
                .ep-pg-num { width: 34px; height: 34px; border-radius: 8px; border: 1px solid #E5E7EB; background: white; cursor: pointer; transition: 0.2s; font-weight: 600; font-size: 0.8rem; }
                .ep-pg-num.active { background: #6366F1; color: white; border-color: #6366F1; }

                /* ── OVERLAY & MODALS ── */
                .ep-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 3000; animation: epFadeIn 0.2s ease; }
                .ep-delete-modal { background: white; border-radius: 24px; padding: 40px; max-width: 400px; width: 90%; text-align: center; box-shadow: 0 30px 80px rgba(0,0,0,0.2); animation: epSlideUp 0.3s ease; }
                .ep-dm-icon { width: 60px; height: 60px; border-radius: 16px; background: #FEF2F2; color: #DC2626; display: flex; align-items: center; justify-content: center; margin: 0 auto 22px; }
                .ep-dm-title { font-size: 1.18rem; font-weight: 650; color: #111827; margin-bottom: 8px; }
                .ep-dm-desc { color: #6B7280; font-size: 0.85rem; line-height: 1.6; margin-bottom: 26px; }
                .ep-dm-actions { display: flex; gap: 10px; }
                .ep-dm-cancel { flex: 1; padding: 12px; border-radius: 14px; border: 1px solid #E5E7EB; background: white; cursor: pointer; }
                .ep-dm-confirm { flex: 1; padding: 12px; border-radius: 14px; border: none; background: #EF4444; color: white; font-weight: 600; cursor: pointer; }
                
                .ep-spinner { width: 36px; height: 36px; border: 3px solid #E5E7EB; border-top-color: #6366F1; border-radius: 50%; animation: epSpin 0.8s linear infinite; margin-bottom: 12px; }
                
                @keyframes epFadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes epFadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes epSlideUp { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
                @keyframes epSpin { 100% { transform: rotate(360deg); } }
                @keyframes epTwinkle { 0% { opacity: 0.15; } 100% { opacity: 1; } }
                @keyframes epMoonFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
                @keyframes epSunPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
                @keyframes epRayRotate { 100% { transform: rotate(360deg); } }
                @keyframes epCloudDrift { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(12px); } }

                /* ── DARK THEME OVERRIDES ── */
                .dark-theme .ep-page { background: var(--theme-bg, #020617); }
                .dark-theme .ep-hero-title { color: #FFFFFF; }
                
                .dark-theme .ep-stat-pill { background: rgba(255,255,255,0.03) !important; border-color: rgba(255,255,255,0.08) !important; }
                .dark-theme .ep-sp-value { color: #F8FAFC; }
                .dark-theme .ep-sp-label { color: #94A3B8; }
                
                .dark-theme .ep-search-input { background: var(--theme-card, #0B1120); border-color: rgba(255,255,255,0.1); color: #F8FAFC; }
                .dark-theme .ep-search-input:focus { border-color: #6366F1; box-shadow: 0 0 0 3px rgba(99,102,241,0.2); }
                .dark-theme .ep-search-clear { background: rgba(255,255,255,0.05); color: #94A3B8; }
                .dark-theme .ep-search-clear:hover { background: rgba(255,255,255,0.1); color: #F8FAFC; }
                
                .dark-theme .ep-results-text { color: #94A3B8; }
                .dark-theme .ep-results-text strong { color: #F8FAFC; }
                .dark-theme .ep-search-tag { background: rgba(99, 102, 241, 0.1); border-color: rgba(99, 102, 241, 0.2); color: #818CF8; }
                
                .dark-theme .ep-card { background: var(--theme-card, #0B1120); border-color: rgba(255,255,255,0.08); }
                .dark-theme .ep-card:hover { border-color: rgba(255,255,255,0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
                .dark-theme .ep-card-name { color: #F8FAFC; }
                .dark-theme .ep-card-industry { color: #94A3B8; }
                
                .dark-theme .ep-card-status.verified { background: rgba(16, 185, 129, 0.1); color: #34D399; border-color: rgba(16, 185, 129, 0.2); }
                .dark-theme .ep-card-status.active { background: rgba(99, 102, 241, 0.1); color: #818CF8; border-color: rgba(99, 102, 241, 0.2); }
                
                .dark-theme .ep-card-info-item { color: #CBD5E1; }
                .dark-theme .ep-info-icon { color: #64748B; }
                .dark-theme .ep-card-divider { background: rgba(255,255,255,0.05); }
                
                .dark-theme .ep-card-jobs-pill { background: rgba(99, 102, 241, 0.1); color: #818CF8; border-color: rgba(99, 102, 241, 0.2); }
                .dark-theme .ep-card-jobs-pill:hover { background: rgba(99, 102, 241, 0.15); }
                .dark-theme .ep-card-date { color: #64748B; }
                
                .dark-theme .ep-btn-view { background: rgba(99, 102, 241, 0.1); color: #818CF8; border-color: rgba(99, 102, 241, 0.2); }
                .dark-theme .ep-btn-view:hover { background: #6366F1; color: white; }
                .dark-theme .ep-btn-delete { background: rgba(239, 68, 68, 0.1); color: #F87171; border-color: rgba(239, 68, 68, 0.2); }
                .dark-theme .ep-btn-delete:hover { background: #EF4444; color: white; }
                
                .dark-theme .ep-pg-btn { background: var(--theme-card, #0B1120); border-color: rgba(255,255,255,0.1); color: #CBD5E1; }
                .dark-theme .ep-pg-btn:hover:not(:disabled) { border-color: #6366F1; color: #818CF8; }
                .dark-theme .ep-pg-num { background: var(--theme-card, #0B1120); border-color: rgba(255,255,255,0.1); color: #94A3B8; }
                .dark-theme .ep-pg-num.active { background: #6366F1; color: white; border-color: #6366F1; }
                
                .dark-theme .ep-delete-modal { background: #0F172A; }
                .dark-theme .ep-dm-title { color: #F8FAFC; }
                .dark-theme .ep-dm-desc { color: #94A3B8; }
                .dark-theme .ep-dm-cancel { background: rgba(255,255,255,0.05); color: #CBD5E1; border-color: rgba(255,255,255,0.1); }
                
                /* Jobs Modal */
                .dark-theme .ep-jobs-modal { background: #0F172A; }
                .dark-theme .ep-jm-header { border-bottom: 1px solid rgba(255,255,255,0.05); }
                .dark-theme .ep-jm-stats-bar { background: rgba(255,255,255,0.02); border-color: rgba(255,255,255,0.05); }
                .dark-theme .ep-jm-stat-item { color: #94A3B8; }
                .dark-theme .ep-jm-stat-item strong { color: #F8FAFC; }
                .dark-theme .ep-jm-stat-item.active { color: #34D399; }
                .dark-theme .ep-jm-empty { color: #64748B; }
                .dark-theme .ep-jm-job { background: rgba(255,255,255,0.02); border-color: rgba(255,255,255,0.05); }
                .dark-theme .ep-jm-job-title { color: #F8FAFC; }
                .dark-theme .ep-jm-job-meta { color: #94A3B8; }
                .dark-theme .ep-jm-status.on { background: rgba(16, 185, 129, 0.1); color: #34D399; border-color: rgba(16, 185, 129, 0.2); }
                .dark-theme .ep-jm-status.off { background: rgba(239, 68, 68, 0.1); color: #F87171; border-color: rgba(239, 68, 68, 0.2); }
            `}</style>
        </>
    );
};

const JobsModal = ({ empId, employers, getCompanyColor, onClose }) => {
    const { data: d, isLoading } = useGetEmployerJobs(empId);
    const jobs = d?.jobs || [];
    const emp = d?.employer;
    const empData = employers?.find(e => e.id === empId);
    const compColor = getCompanyColor(emp?.companyName || empData?.companyName);

    const getTypeBadge = (type) => {
        const t = (type || '').toLowerCase();
        if (t.includes('full')) return { bg: '#ECFDF5', color: '#059669', border: '#D1FAE5' };
        if (t.includes('part')) return { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' };
        if (t.includes('contract')) return { bg: '#EDE9FE', color: '#7C3AED', border: '#DDD6FE' };
        return { bg: '#F3F4F6', color: '#6B7280', border: '#E5E7EB' };
    };

    return (
        <div className="ep-overlay" onClick={onClose}>
            <div className="ep-jobs-modal" onClick={e => e.stopPropagation()}>
                <div className="ep-jm-header" style={{ background: compColor?.grad }}>
                    <div className="ep-jm-header-content">
                        <div className="ep-jm-comp">
                            <div className="ep-jm-avatar">{(emp?.companyName || empData?.companyName || '?')[0]}</div>
                            <div>
                                <div className="ep-jm-comp-name">{emp?.companyName || empData?.companyName || 'Employer'}</div>
                                <div className="ep-jm-comp-sub">{empData?.email || ''}</div>
                            </div>
                        </div>
                        <button className="ep-jm-close" onClick={onClose}><X size={18} /></button>
                    </div>
                </div>
                <div className="ep-jm-body">
                    <div className="ep-jm-stats-bar">
                        <span className="ep-jm-stat-item"><Briefcase size={14} /> <strong>{jobs.length}</strong> jobs</span>
                        <span className="ep-jm-stat-item active"><CheckCircle2 size={14} /> <strong>{jobs.filter(j => j.is_active).length}</strong> active</span>
                    </div>

                    {isLoading ? (
                        <div className="ep-jm-empty"><div className="ep-spinner" style={{ borderTopColor: '#6366F1' }} />Loading jobs...</div>
                    ) : jobs.length === 0 ? (
                        <div className="ep-jm-empty"><Briefcase size={36} style={{ color: '#D1D5DB', marginBottom: 10 }} /><div>No jobs posted yet</div></div>
                    ) : (
                        <div className="ep-jm-list">
                            {jobs.map(j => {
                                const tb = getTypeBadge(j.jobType);
                                return (
                                    <div key={j.id} className="ep-jm-job">
                                        <div className="ep-jm-job-main">
                                            <div className="ep-jm-job-title">{j.title}</div>
                                            <div className="ep-jm-job-meta">
                                                <span><MapPin size={12} /> {j.location || 'Not specified'}</span>
                                                <span style={{ background: tb.bg, color: tb.color, border: `1px solid ${tb.border}`, padding: '2px 8px', borderRadius: 6, fontSize: '0.65rem', fontWeight: 600 }}>{j.jobType || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <span className={`ep-jm-status ${j.is_active ? 'on' : 'off'}`}><span className="ep-jm-status-dot" />{j.is_active ? 'Active' : 'Inactive'}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                <style>{`
                    .ep-jobs-modal { background: white; border-radius: 24px; width: 95%; max-width: 640px; max-height: 82vh; overflow: hidden; display: flex; flex-direction: column; animation: epSlideUp 0.3s ease; }
                    .ep-jm-header { padding: 28px 32px; position: relative; }
                    .ep-jm-header-content { display: flex; justify-content: space-between; align-items: center; }
                    .ep-jm-comp { display: flex; align-items: center; gap: 14px; }
                    .ep-jm-avatar { width: 46px; height: 46px; border-radius: 14px; background: rgba(255,255,255,0.2); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 1.1rem; }
                    .ep-jm-comp-name { font-size: 1.05rem; font-weight: 600; color: white; }
                    .ep-jm-comp-sub { font-size: 0.75rem; color: rgba(255,255,255,0.6); margin-top: 1px; }
                    .ep-jm-close { width: 36px; height: 36px; border-radius: 10px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
                    .ep-jm-close:hover { background: rgba(255,255,255,0.25); }
                    .ep-jm-body { overflow-y: auto; padding: 20px 32px 32px; }
                    .ep-jm-stats-bar { display: flex; gap: 16px; margin-bottom: 18px; padding: 12px 16px; background: #F9FAFB; border-radius: 12px; border: 1px solid #F3F4F6; }
                    .ep-jm-stat-item { display: flex; align-items: center; gap: 5px; font-size: 0.78rem; color: #6B7280; }
                    .ep-jm-stat-item strong { color: #111827; }
                    .ep-jm-stat-item.active { color: #059669; }
                    .ep-jm-empty { padding: 50px 0; text-align: center; color: #9CA3AF; display: flex; flex-direction: column; align-items: center; }
                    .ep-jm-list { display: flex; flex-direction: column; gap: 8px; }
                    .ep-jm-job { padding: 16px 20px; background: white; border-radius: 14px; border: 1px solid #E8ECF1; display: flex; justify-content: space-between; align-items: center; }
                    .ep-jm-job-title { font-weight: 600; color: #111827; font-size: 0.9rem; margin-bottom: 5px; }
                    .ep-jm-job-meta { font-size: 0.75rem; color: #6B7280; display: flex; gap: 10px; align-items: center; }
                    .ep-jm-job-meta span { display: flex; align-items: center; gap: 4px; }
                    .ep-jm-status { padding: 4px 12px; border-radius: 20px; font-size: 0.66rem; font-weight: 600; display: inline-flex; align-items: center; gap: 5px; flex-shrink: 0; }
                    .ep-jm-status.on { background: #ECFDF5; color: #059669; border: 1px solid #D1FAE5; }
                    .ep-jm-status.off { background: #FEF2F2; color: #DC2626; border: 1px solid #FEE2E2; }
                    .ep-jm-status-dot { width: 5px; height: 5px; border-radius: 50%; }
                    .ep-jm-status.on .ep-jm-status-dot { background: #10B981; }
                    .ep-jm-status.off .ep-jm-status-dot { background: #EF4444; }
                `}</style>
            </div>
        </div>
    );
};

export default AdminEmployers;
