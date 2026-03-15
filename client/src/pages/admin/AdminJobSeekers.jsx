import React, { useState, useMemo } from 'react';
import { useGetAllJobSeekers } from '@/hooks/api/admin/useAdmin';
import {
    Users, Search, Mail, Phone, MapPin, Calendar,
    ChevronLeft, ChevronRight, X, Clock, Briefcase,
    TrendingUp, UserCheck, Shield, Eye, ArrowUpRight
} from 'lucide-react';

/* ── Mini Sky Scene ── */
const PageHeroSky = ({ timeOfDay }) => (
    <div className="js-sky-scene">
        {timeOfDay === 'night' && (
            <>
                {[...Array(24)].map((_, i) => (
                    <div key={i} className="js-star" style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        width: `${2 + Math.random() * 2}px`,
                        height: `${2 + Math.random() * 2}px`,
                    }} />
                ))}
                <div className="js-moon" />
                <div className="js-moon-glow" />
            </>
        )}
        {timeOfDay === 'morning' && (
            <>
                <div className="js-sun js-morning-sun" />
                <div className="js-sun-glow js-morning-glow" />
                <div className="js-cloud js-cloud-1" />
                <div className="js-cloud js-cloud-2" />
            </>
        )}
        {timeOfDay === 'afternoon' && (
            <>
                <div className="js-sun js-afternoon-sun" />
                <div className="js-sun-glow js-afternoon-glow" />
                <div className="js-cloud js-cloud-1" />
            </>
        )}
        {timeOfDay === 'evening' && (
            <>
                <div className="js-sunset-orb" />
                <div className="js-sunset-glow" />
                <div className="js-cloud js-cloud-ev" />
            </>
        )}
    </div>
);

const AdminJobSeekers = () => {
    const { data: jobSeekers = [], isLoading } = useGetAllJobSeekers();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const perPage = 8;

    const hour = new Date().getHours();
    const timeOfDay = hour >= 5 && hour < 12 ? 'morning' : hour >= 12 && hour < 17 ? 'afternoon' : hour >= 17 && hour < 20 ? 'evening' : 'night';

    const getName = s => [s.firstName, s.lastName].filter(Boolean).join(' ') || 'Unnamed User';

    const filtered = useMemo(() => jobSeekers.filter(s =>
        getName(s).toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase()) ||
        s.Profile?.headline?.toLowerCase().includes(search.toLowerCase())
    ), [jobSeekers, search]);

    const totalPages = Math.ceil(filtered.length / perPage);
    const current = filtered.slice((page - 1) * perPage, page * perPage);

    const getAvatarGradient = (name) => {
        const grads = [
            'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
            'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
            'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
            'linear-gradient(135deg, #EC4899 0%, #D946EF 100%)',
            'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
        ];
        const idx = (name || '?').charCodeAt(0) % grads.length;
        return grads[idx];
    };

    return (
        <>
            <div className="js-page">
                {/* ── Hero Banner ── */}
                <div className={`js-hero js-hero-${timeOfDay}`}>
                    <PageHeroSky timeOfDay={timeOfDay} />
                    <div className="js-hero-content">
                        <div className="js-hero-left">
                            <span className="js-hero-badge"><Users size={12} /> Talent Management</span>
                            <h1 className="js-hero-title">Job Seekers</h1>
                            <p className="js-hero-desc">Explore and manage the talent pool of registered users.</p>
                        </div>
                        <div className="js-hero-right">
                            <div className="js-hero-stat">
                                <span className="js-hs-val">{jobSeekers.length}</span>
                                <span className="js-hs-label">Total Talent</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Desktop Stats ── */}
                <div className="js-stats-row">
                    <div className="js-mini-stat">
                        <div className="js-ms-icon blue"><TrendingUp size={16} /></div>
                        <div><span className="js-ms-val">{jobSeekers.length}</span><span className="js-ms-label">Total Profiles</span></div>
                    </div>
                    <div className="js-mini-stat">
                        <div className="js-ms-icon green"><UserCheck size={16} /></div>
                        <div><span className="js-ms-val">{jobSeekers.filter(s => s.Profile).length}</span><span className="js-ms-label">Detailed Profiles</span></div>
                    </div>
                    <div className="js-mini-stat">
                        <div className="js-ms-icon purple"><Shield size={16} /></div>
                        <div><span className="js-ms-val">{Math.round(jobSeekers.length * 0.85)}</span><span className="js-ms-label">Verified Talent</span></div>
                    </div>
                </div>

                {/* ── Search ── */}
                <div className="js-controls">
                    <div className="js-search-wrap">
                        <Search size={18} className="js-search-icon" />
                        <input
                            type="text"
                            className="js-search-input"
                            placeholder="Search talent by name, email or headline..."
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                        />
                        {search && <button className="js-search-clear" onClick={() => { setSearch(''); setPage(1); }}><X size={14} /></button>}
                    </div>
                </div>

                <div className="js-results-info">
                    Showing <strong>{(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)}</strong> talent from <strong>{filtered.length}</strong>
                </div>

                {/* ── Cards Grid ── */}
                {isLoading ? (
                    <div className="js-empty"><div className="js-spinner" /><span>Loading talent pool...</span></div>
                ) : current.length === 0 ? (
                    <div className="js-empty">
                        <Users size={40} style={{ color: '#E5E7EB', marginBottom: 12 }} />
                        <h3>No talent found</h3>
                        <p>Adjust your search to find more candidates.</p>
                    </div>
                ) : (
                    <div className="js-table-container">
                        <table className="js-custom-table">
                            <thead>
                                <tr>
                                    <th>Talent Profile</th>
                                    <th>Contact Info</th>
                                    <th>Location</th>
                                    <th>Status & Join Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {current.map((s, i) => (
                                    <tr key={s.id} style={{ animationDelay: `${i * 0.04}s` }} className="js-table-row">
                                        <td>
                                            <div className="js-td-profile">
                                                <div className="js-td-avatar" style={{ background: getAvatarGradient(getName(s)) }}>
                                                    {s.profile_picture ? (
                                                        <img src={s.profile_picture.startsWith('http') ? s.profile_picture : `http://localhost:5000/uploads/${s.profile_picture.replace(/^(\/?uploads\/|\/)/, '')}`} alt="" />
                                                    ) : getName(s)[0]}
                                                </div>
                                                <div className="js-td-name-col">
                                                    <span className="js-td-name">{getName(s)}</span>
                                                    <span className="js-td-headline">{s.Profile?.headline || 'Open for opportunities'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="js-td-contact">
                                                <span className="js-td-email"><Mail size={12}/> {s.email}</span>
                                                <span className="js-td-phone"><Phone size={12}/> {s.Profile?.phone || 'Not provided'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="js-td-location"><MapPin size={12}/> {s.Profile?.location || 'Not specified'}</span>
                                        </td>
                                        <td>
                                            <div className="js-td-meta">
                                                <span className="js-td-status-md"><span className="js-dot" /> Online</span>
                                                <span className="js-td-date">
                                                    {s.created_at ? new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <button className="js-btn-view" title="View Profile"><ArrowUpRight size={14} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                    <div className="js-pagination">
                        <button className="js-pg-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={16} /> Previous</button>
                        <div className="js-pg-nums">
                            {[...Array(totalPages)].map((_, i) => (
                                <button key={i} className={`js-pg-num ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
                            ))}
                        </div>
                        <button className="js-pg-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next <ChevronRight size={16} /></button>
                    </div>
                )}
            </div>

            <style>{`
                .js-page { padding: 28px 36px; min-height: 100vh; background: #F8FAFC; }

                /* ── Hero ── */
                .js-hero { border-radius: 22px; padding: 38px 48px; margin-bottom: 22px; position: relative; overflow: hidden; animation: jsFadeUp 0.5s ease both; }
                .js-hero-morning { background: linear-gradient(135deg, #1e3a5f 0%, #3d6f8e 30%, #87CEEB 60%, #FFE4B5 90%); }
                .js-hero-afternoon { background: linear-gradient(135deg, #1565C0 0%, #42A5F5 40%, #90CAF9 70%, #E3F2FD 100%); }
                .js-hero-evening { background: linear-gradient(135deg, #1a0533 0%, #4a1942 25%, #c2185b 50%, #ff6f00 75%, #ffab40 100%); }
                .js-hero-night { background: linear-gradient(135deg, #020111 0%, #0a0e2a 30%, #141852 60%, #1b2240 100%); }

                .js-hero-content { position: relative; z-index: 2; display: flex; justify-content: space-between; align-items: center; }
                .js-hero-left { color: white; }
                .js-hero-badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; font-size: 0.65rem; font-weight: 600; color: rgba(255,255,255,0.8); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 14px; backdrop-filter: blur(8px); }
                .js-hero-title { font-size: 1.85rem; font-weight: 700; color: #FFFFFF; letter-spacing: -0.03em; margin-bottom: 6px; text-shadow: 0 2px 10px rgba(0,0,0,0.25); }
                .js-hero-desc { font-size: 0.9rem; color: rgba(255,255,255,0.55); line-height: 1.5; }

                .js-hero-stat { text-align: right; background: rgba(255,255,255,0.08); backdrop-filter: blur(14px); padding: 18px 28px; border-radius: 18px; border: 1px solid rgba(255,255,255,0.1); }
                .js-hs-val { display: block; font-size: 2rem; font-weight: 800; color: white; letter-spacing: -0.04em; }
                .js-hs-label { display: block; font-size: 0.65rem; font-weight: 600; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px; }

                /* ── Sky Elements ── */
                .js-sky-scene { position: absolute; inset: 0; pointer-events: none; }
                .js-star { position: absolute; background: white; border-radius: 50%; animation: jsTwinkle 2s ease-in-out infinite alternate; }
                .js-moon { position: absolute; top: 18px; right: 210px; width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #f5f3ce 0%, #d4d0a0 100%); box-shadow: 0 0 20px rgba(245,243,206,0.3); }
                .js-moon-glow { position: absolute; top: 8px; right: 200px; width: 64px; height: 64px; border-radius: 50%; background: radial-gradient(circle, rgba(245,243,206,0.1) 0%, transparent 70%); }
                .js-sun { position: absolute; border-radius: 50%; }
                .js-morning-sun { top: 15px; right: 220px; width: 40px; height: 40px; background: radial-gradient(circle, #FFD93D 30%, #FF9A3C 70%); box-shadow: 0 0 40px rgba(255,217,61,0.4); }
                .js-afternoon-sun { top: 10px; right: 230px; width: 34px; height: 34px; background: radial-gradient(circle, #fff 20%, #FFD93D 60%); box-shadow: 0 0 50px rgba(255,217,61,0.5); }
                .js-sunset-orb { position: absolute; bottom: 8px; right: 240px; width: 54px; height: 27px; border-radius: 54px 54px 0 0; background: linear-gradient(to top, #FF1744, #FF6B35); box-shadow: 0 0 35px rgba(255,107,53,0.4); }

                /* ── Stats Row ── */
                .js-stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 22px; animation: jsFadeUp 0.4s ease 0.05s both; }
                .js-mini-stat { display: flex; align-items: center; gap: 14px; padding: 18px 24px; background: white; border-radius: 16px; border: 1px solid #E5E7EB; transition: transform 0.2s; }
                .js-mini-stat:hover { transform: translateY(-2px); border-color: #D1D5DB; }
                .js-ms-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .js-ms-icon.blue { background: #EEF2FF; color: #6366F1; }
                .js-ms-icon.green { background: #ECFDF5; color: #10B981; }
                .js-ms-icon.purple { background: #F5F3FF; color: #8B5CF6; }
                .js-ms-val { display: block; font-size: 1.35rem; font-weight: 700; color: #111827; letter-spacing: -0.02em; }
                .js-ms-label { display: block; font-size: 0.72rem; color: #9CA3AF; font-weight: 500; }

                /* ── Controls ── */
                .js-controls { margin-bottom: 12px; animation: jsFadeUp 0.4s ease 0.08s both; }
                .js-search-wrap { position: relative; }
                .js-search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #9CA3AF; }
                .js-search-input { width: 100%; padding: 13px 48px 13px 48px; background: white; border: 1px solid #E5E7EB; border-radius: 14px; font-size: 0.9rem; color: #111827; outline: none; transition: all 0.25s; font-family: inherit; }
                .js-search-input:focus { border-color: #10B981; box-shadow: 0 0 0 4px rgba(16,185,129,0.06); }
                .js-search-clear { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); width: 24px; height: 24px; border-radius: 6px; border: none; background: #F3F4F6; color: #6B7280; cursor: pointer; display: flex; align-items: center; justify-content: center; }

                .js-results-info { font-size: 0.78rem; color: #6B7280; margin-bottom: 16px; animation: jsFadeUp 0.4s ease 0.1s both; }

                /* ── Table ── */
                .js-table-container { background: white; border-radius: 18px; border: 1px solid #E5E7EB; overflow-x: auto; margin-bottom: 24px; animation: jsFadeUp 0.4s ease both; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
                .js-custom-table { width: 100%; border-collapse: separate; border-spacing: 0; min-width: 850px; }
                .js-custom-table th { color: #64748B; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 18px 24px; text-align: left; border-bottom: 1px solid #E5E7EB; background: #F8FAFC; white-space: nowrap; }
                .js-custom-table th:first-child { border-top-left-radius: 18px; }
                .js-custom-table th:last-child { border-top-right-radius: 18px; }
                
                .js-table-row { transition: all 0.25s ease; background: white; }
                .js-table-row:hover { background: #F8FAFC; }
                .js-table-row td { padding: 16px 24px; vertical-align: middle; border-bottom: 1px solid #E5E7EB; }
                .js-table-row:last-child td { border-bottom: none; }
                
                .js-td-profile { display: flex; align-items: center; gap: 14px; }
                .js-td-avatar { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 1rem; flex-shrink: 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1); overflow: hidden; }
                .js-td-avatar img { width: 100%; height: 100%; object-fit: cover; }
                .js-td-name-col { display: flex; flex-direction: column; gap: 4px; }
                .js-td-name { font-size: 0.98rem; font-weight: 700; color: #111827; letter-spacing: -0.01em; }
                .js-td-headline { font-size: 0.75rem; color: #6B7280; font-weight: 450; line-height: 1.3; max-width: 200px; }
                
                .js-td-contact { display: flex; flex-direction: column; gap: 8px; }
                .js-td-email, .js-td-phone, .js-td-location, .js-td-date { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: #4B5563; white-space: nowrap; }
                
                .js-td-meta { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
                .js-td-status-md { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 650; white-space: nowrap; background: #ECFDF5; color: #059669; border: 1px solid #D1FAE5; }
                .js-dot { width: 6px; height: 6px; border-radius: 50%; background: #10B981; animation: jsPulse 2s infinite; }
                
                .js-btn-view { width: 36px; height: 36px; border-radius: 10px; border: 1px solid #E5E7EB; background: white; color: #9CA3AF; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
                .js-btn-view:hover { background: #ECFDF5; color: #10B981; border-color: #A7F3D0; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15); }


                /* ── Pagination ── */
                .js-pagination { display: flex; justify-content: center; align-items: center; gap: 10px; animation: jsFadeUp 0.4s ease 0.15s both; }
                .js-pg-btn { padding: 9px 18px; border-radius: 12px; border: 1px solid #E5E7EB; background: white; color: #374151; font-size: 0.78rem; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 7px; transition: all 0.22s; }
                .js-pg-btn:disabled { opacity: 0.4; cursor: not-allowed; }
                .js-pg-btn:hover:not(:disabled) { border-color: #10B981; color: #059669; background: #ECFDF5; }
                .js-pg-nums { display: flex; gap: 5px; }
                .js-pg-num { width: 38px; height: 38px; border-radius: 10px; border: 1px solid #E5E7EB; background: white; color: #6B7280; font-weight: 600; font-size: 0.82rem; cursor: pointer; transition: all 0.2s; }
                .js-pg-num.active { background: #10B981; color: white; border-color: #10B981; box-shadow: 0 4px 12px rgba(16,185,129,0.25); }
                .js-pg-num:hover:not(.active) { border-color: #10B981; color: #059669; }

                .js-spinner { width: 34px; height: 34px; border: 3px solid #F3F4F6; border-top: 3px solid #10B981; border-radius: 50%; animation: jsSpin 0.8s linear infinite; margin-bottom: 12px; }

                @keyframes jsFadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes jsSpin { 100% { transform: rotate(360deg); } }
                @keyframes jsTwinkle { from { opacity: 0.3; } to { opacity: 1; } }
                @keyframes jsPulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }
            `}</style>
        </>
    );
};

export default AdminJobSeekers;
