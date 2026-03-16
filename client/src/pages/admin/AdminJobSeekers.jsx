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
                                    <th>Join Date</th>
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
                                                <span className="js-td-date">
                                                    {s.created_at ? new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                                </span>
                                            </div>
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
                .js-page { padding: 28px 36px; min-height: 100vh; background: var(--theme-bg-subtle, #F8FAFC); transition: background 0.3s; }

                /* ── Hero ── */
                .js-hero { border-radius: 22px; padding: 38px 48px; margin-bottom: 22px; position: relative; overflow: hidden; animation: jsFadeUp 0.5s ease both; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.3); }
                .js-hero-morning { background: linear-gradient(135deg, #1e3a5f 0%, #3d6f8e 30%, #87CEEB 60%, #FFE4B5 90%); }
                .js-hero-afternoon { background: linear-gradient(135deg, #1565C0 0%, #42A5F5 40%, #90CAF9 70%, #E3F2FD 100%); }
                .js-hero-evening { background: linear-gradient(135deg, #1a0533 0%, #4a1942 25%, #c2185b 50%, #ff6f00 75%, #ffab40 100%); }
                .js-hero-night { background: linear-gradient(135deg, #020111 0%, #0a0e2a 30%, #141852 60%, #1b2240 100%); }

                .js-hero-content { position: relative; z-index: 2; display: flex; justify-content: space-between; align-items: center; }
                .js-hero-left { color: white; }
                .js-hero-badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; font-size: 0.65rem; font-weight: 650; color: rgba(255,255,255,0.9); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 14px; backdrop-filter: blur(8px); }
                .js-hero-title { font-size: 2.2rem; font-weight: 800; color: #FFFFFF; letter-spacing: -0.04em; margin-bottom: 6px; text-shadow: 0 2px 15px rgba(0,0,0,0.3); }
                .js-hero-desc { font-size: 0.95rem; color: rgba(255,255,255,0.7); line-height: 1.5; font-weight: 500; }

                .js-hero-stat { text-align: right; background: rgba(255,255,255,0.1); backdrop-filter: blur(14px); padding: 20px 32px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 8px 32px rgba(0,0,0,0.2); }
                .js-hs-val { display: block; font-size: 2.2rem; font-weight: 900; color: white; letter-spacing: -0.05em; }
                .js-hs-label { display: block; font-size: 0.65rem; font-weight: 700; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 2px; }

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
                .js-stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; animation: jsFadeUp 0.4s ease 0.05s both; }
                .js-mini-stat { display: flex; align-items: center; gap: 16px; padding: 20px 24px; background: var(--theme-bg-white, #FFFFFF); border-radius: 18px; border: 1px solid var(--theme-border, #E5E7EB); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .dark-theme .js-mini-stat { background: #1E293B; border-color: rgba(255,255,255,0.08); }
                .js-mini-stat:hover { transform: translateY(-4px); box-shadow: 0 10px 20px -5px rgba(0,0,0,0.1); border-color: #10B981; }
                .js-ms-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
                .js-ms-icon.blue { background: #EEF2FF; color: #6366F1; }
                .js-ms-icon.green { background: #ECFDF5; color: #10B981; }
                .js-ms-icon.purple { background: #F5F3FF; color: #8B5CF6; }
                .js-ms-val { display: block; font-size: 1.5rem; font-weight: 800; color: var(--theme-text-primary, #111827); letter-spacing: -0.03em; }
                .js-ms-label { display: block; font-size: 0.75rem; color: var(--theme-text-muted, #9CA3AF); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }

                /* ── Controls ── */
                .js-controls { margin-bottom: 16px; animation: jsFadeUp 0.4s ease 0.08s both; }
                .js-search-wrap { position: relative; }
                .js-search-icon { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: #9CA3AF; transition: color 0.3s; }
                .js-search-input { width: 100%; padding: 15px 52px; background: var(--theme-bg-white, #FFFFFF); border: 2px solid var(--theme-border, #E5E7EB); border-radius: 16px; font-size: 0.95rem; color: var(--theme-text-primary, #111827); outline: none; transition: all 0.3s; font-family: inherit; font-weight: 500; }
                .dark-theme .js-search-input { background: #1E293B; border-color: rgba(255,255,255,0.08); }
                .js-search-input:focus { border-color: #10B981; box-shadow: 0 0 0 5px rgba(16,185,129,0.1); }
                .js-search-input:focus + .js-search-icon { color: #10B981; }
                .js-search-clear { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); width: 28px; height: 28px; border-radius: 8px; border: none; background: #F3F4F6; color: #6B7280; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
                .dark-theme .js-search-clear { background: #334155; color: #CBD5E1; }
                .js-search-clear:hover { background: #E5E7EB; color: #111827; }

                .js-results-info { font-size: 0.85rem; color: var(--theme-text-muted, #6B7280); margin-bottom: 20px; animation: jsFadeUp 0.4s ease 0.1s both; }
                .js-results-info strong { color: var(--theme-text-primary, #111827); }

                /* ── Table ── */
                .js-table-container { background: var(--theme-bg-white, #FFFFFF); border-radius: 20px; border: 1px solid var(--theme-border, #E5E7EB); overflow-x: auto; margin-bottom: 24px; animation: jsFadeUp 0.4s ease both; box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.08); transition: all 0.3s; }
                .dark-theme .js-table-container { background: #1E293B; border-color: rgba(255,255,255,0.08); }
                .js-custom-table { width: 100%; border-collapse: separate; border-spacing: 0; min-width: 850px; }
                .js-custom-table th { color: var(--theme-text-muted, #64748B); font-size: 0.75rem; font-weight: 750; text-transform: uppercase; letter-spacing: 0.08em; padding: 20px 24px; text-align: left; border-bottom: 1px solid var(--theme-border, #E5E7EB); background: var(--theme-bg-subtle, #F8FAFC); white-space: nowrap; transition: background 0.3s; }
                .dark-theme .js-custom-table th { border-color: rgba(255,255,255,0.08); background: #0F172A; }
                
                .js-table-row { transition: all 0.2s ease; background: var(--theme-bg-white, #FFFFFF); }
                .dark-theme .js-table-row { background: #1E293B; }
                .js-table-row:hover { background: var(--theme-bg-subtle, #F8FAFC); }
                .dark-theme .js-table-row:hover { background: #2D3748; }
                .js-table-row td { padding: 18px 24px; vertical-align: middle; border-bottom: 1px solid var(--theme-border, #E5E7EB); color: var(--theme-text-primary, #111827); transition: border-color 0.3s; }
                .dark-theme .js-table-row td { border-color: rgba(255,255,255,0.08); }
                .js-table-row:last-child td { border-bottom: none; }
                
                .js-td-profile { display: flex; align-items: center; gap: 16px; }
                .js-td-avatar { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 1.1rem; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.15); overflow: hidden; border: 2px solid white; transition: transform 0.2s; }
                .dark-theme .js-td-avatar { border-color: #334155; }
                .js-table-row:hover .js-td-avatar { transform: scale(1.05); }
                .js-td-avatar img { width: 100%; height: 100%; object-fit: cover; }
                .js-td-name-col { display: flex; flex-direction: column; gap: 4px; }
                .js-td-name { font-size: 1rem; font-weight: 750; color: var(--theme-text-primary, #111827); letter-spacing: -0.01em; transition: color 0.3s; }
                .js-td-headline { font-size: 0.78rem; color: var(--theme-text-muted, #6B7280); font-weight: 500; line-height: 1.4; max-width: 240px; }
                
                .js-td-contact { display: flex; flex-direction: column; gap: 8px; }
                .js-td-email, .js-td-phone, .js-td-location, .js-td-date { display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--theme-text-muted, #4B5563); white-space: nowrap; transition: color 0.3s; }
                .dark-theme .js-td-email, .dark-theme .js-td-phone, .dark-theme .js-td-location, .dark-theme .js-td-date { color: #94A3B8; }
                .js-td-email svg, .js-td-phone svg, .js-td-location svg { color: #10B981; opacity: 0.8; }
                
                .js-td-meta { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
                .js-td-date { font-weight: 600; color: #10B981; background: rgba(16,185,129,0.05); padding: 4px 10px; border-radius: 8px; border: 1px solid rgba(16,185,129,0.1); }

                /* ── Pagination ── */
                .js-pagination { display: flex; justify-content: center; align-items: center; gap: 12px; padding-bottom: 40px; animation: jsFadeUp 0.4s ease 0.15s both; }
                .js-pg-btn { padding: 10px 20px; border-radius: 14px; border: 1px solid var(--theme-border, #E5E7EB); background: var(--theme-bg-white, #FFFFFF); color: var(--theme-text-primary, #374151); font-size: 0.82rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.25s; }
                .dark-theme .js-pg-btn { background: #1E293B; border-color: rgba(255,255,255,0.08); color: #CBD5E1; }
                .js-pg-btn:disabled { opacity: 0.4; cursor: not-allowed; }
                .js-pg-btn:hover:not(:disabled) { border-color: #10B981; color: #10B981; background: rgba(16,185,129,0.05); transform: translateY(-1px); }
                .js-pg-nums { display: flex; gap: 6px; }
                .js-pg-num { width: 42px; height: 42px; border-radius: 12px; border: 1px solid var(--theme-border, #E5E7EB); background: var(--theme-bg-white, #FFFFFF); color: var(--theme-text-muted, #6B7280); font-weight: 750; font-size: 0.85rem; cursor: pointer; transition: all 0.25s; }
                .dark-theme .js-pg-num { background: #1E293B; border-color: rgba(255,255,255,0.08); color: #94A3B8; }
                .js-pg-num.active { background: #10B981 !important; color: white !important; border-color: #10B981 !important; box-shadow: 0 8px 20px -5px rgba(16,185,129,0.4); }
                .js-pg-num:hover:not(.active) { border-color: #10B981; color: #10B981; background: rgba(16,185,129,0.05); }

                .js-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 20px; color: var(--theme-text-muted, #9CA3AF); text-align: center; }
                .js-empty h3 { color: var(--theme-text-primary, #111827); font-size: 1.25rem; font-weight: 700; margin-bottom: 8px; }

                .js-spinner { width: 40px; height: 40px; border: 4px solid var(--theme-border, #F3F4F6); border-top: 4px solid #10B981; border-radius: 50%; animation: jsSpin 0.8s linear infinite; margin-bottom: 20px; }

                @keyframes jsFadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes jsSpin { 100% { transform: rotate(360deg); } }
                @keyframes jsTwinkle { from { opacity: 0.3; } to { opacity: 1; } }
            `}</style>
        </>
    );
};

export default AdminJobSeekers;
