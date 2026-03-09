import React, { useState, useMemo, useEffect } from 'react';
import '@/styles/ProfessionalGlass.css';
import {
    Users,
    CheckCircle,
    XCircle,
    Clock,
    Search,
    Filter,
    Eye,
    ExternalLink,
    Calendar,
    Briefcase,
    Mail,
    Phone,
    MapPin,
    BarChart2,
    RefreshCw,
    TrendingUp,
    ChevronRight,
    Search as SearchIcon
} from 'lucide-react';

import { useGetEmployerApplications } from '@/hooks/api/employer/useEmployer';

const History = () => {
    // API Hooks
    const { data: serverApps = [], isLoading } = useGetEmployerApplications();

    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter for processed candidates (non-Pending)
    const historyData = useMemo(() => {
        return serverApps.filter(app => app.status !== 'Pending');
    }, [serverApps]);

    // Calculate Summary Stats
    const stats = useMemo(() => {
        const total = historyData.length;
        return {
            total,
            accepted: historyData.filter(d => d.status === 'Accepted').length,
            rejected: historyData.filter(d => d.status === 'Rejected').length,
            shortlisted: historyData.filter(d => d.status === 'Shortlisted').length
        };
    }, [historyData]);

    const filteredData = useMemo(() => {
        let data = historyData;
        if (filterStatus !== 'All') {
            data = data.filter(item => item.status === filterStatus);
        }
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            data = data.filter(item =>
                (item.JobSeeker?.fullname || '').toLowerCase().includes(term) ||
                (item.JobListing?.title || '').toLowerCase().includes(term)
            );
        }
        return data;
    }, [filterStatus, historyData, searchTerm]);

    const handleViewDetails = (candidate) => {
        setSelectedCandidate(candidate);
        setIsModalOpen(true);
    };

    const styles = {
        container: {
            padding: '40px 32px',
            maxWidth: '1300px',
            margin: '0 auto',
            fontFamily: 'var(--font-body)',
        },
        headerHero: {
            marginBottom: '40px',
            position: 'relative',
        },
        title: {
            fontSize: '3.5rem',
            fontWeight: '800',
            color: 'white',
            fontFamily: 'var(--font-display)',
            marginBottom: '12px',
            letterSpacing: '-0.03em',
            lineHeight: '1.1'
        },
        subtitle: {
            color: 'var(--glass-text-secondary)',
            fontSize: '1.1rem',
            maxWidth: '600px',
            lineHeight: '1.6'
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
        },
        statCard: (isActive) => ({
            background: 'var(--glass-surface)',
            padding: '28px',
            borderRadius: '24px',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'default',
            position: 'relative',
            overflow: 'hidden'
        }),
        statIcon: (color) => ({
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--glass-border)',
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 20px ${color}10`
        }),
        statValue: {
            fontSize: '2rem',
            fontWeight: '800',
            color: 'white',
            lineHeight: '1',
            marginBottom: '4px',
            fontFamily: 'var(--font-display)',
            textShadow: '0 0 15px rgba(255,255,255,0.1)'
        },
        statLabel: {
            fontSize: '0.85rem',
            color: 'var(--glass-text-secondary)',
            fontWeight: '700',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
        },
        controlBar: {
            background: 'var(--glass-surface)',
            padding: '12px',
            borderRadius: '20px',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            backdropFilter: 'blur(10px)',
            gap: '20px',
            flexWrap: 'wrap'
        },
        tabs: {
            display: 'flex',
            gap: '8px'
        },
        tab: (isActive) => ({
            padding: '10px 20px',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: isActive ? 'var(--glass-border-bright)' : 'transparent',
            background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
            color: isActive ? 'white' : 'var(--glass-text-muted)',
            fontSize: '0.9rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        }),
        searchWrapper: {
            position: 'relative',
            flex: 1,
            maxWidth: '400px'
        },
        searchInput: {
            width: '100%',
            padding: '12px 16px 12px 48px',
            borderRadius: '12px',
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid var(--glass-border)',
            color: 'white',
            fontSize: '0.9rem',
            outline: 'none',
            transition: 'all 0.3s ease',
            fontFamily: 'var(--font-body)'
        },
        tableWrapper: {
            background: 'var(--glass-surface)',
            borderRadius: '24px',
            border: '1px solid var(--glass-border)',
            overflow: 'hidden',
            backdropFilter: 'blur(16px)',
            marginBottom: '40px'
        },
        table: {
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0',
            textAlign: 'left'
        },
        th: {
            padding: '20px 24px',
            fontSize: '0.75rem',
            fontWeight: '800',
            color: 'var(--glass-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            borderBottom: '1px solid var(--glass-border)',
            background: 'rgba(255,255,255,0.01)'
        },
        td: {
            padding: '20px 24px',
            fontSize: '0.95rem',
            color: 'white',
            borderBottom: '1px solid var(--glass-border)',
            transition: 'all 0.2s ease'
        },
        badge: (status) => {
            const configs = {
                Accepted: { color: '#10B981', label: 'ACCEPTED' },
                Rejected: { color: '#EF4444', label: 'REJECTED' },
                Shortlisted: { color: '#3B82F6', label: 'SHORTLISTED' }
            };
            const config = configs[status] || { color: 'var(--glass-text-muted)', label: status.toUpperCase() };
            return {
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.7rem',
                fontWeight: '900',
                background: `${config.color}15`,
                color: config.color,
                border: `1px solid ${config.color}30`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                letterSpacing: '0.05em'
            };
        },
        viewAction: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--glass-border)',
            color: 'white',
            fontSize: '0.85rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
        },
        analyticsPanel: {
            background: 'var(--glass-surface)',
            padding: '32px',
            borderRadius: '24px',
            border: '1px solid var(--glass-border)',
            backdropFilter: 'blur(16px)'
        },
        progressTrack: {
            height: '12px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '100px',
            overflow: 'hidden',
            display: 'flex',
            margin: '24px 0 16px'
        },
        percentValue: {
            fontSize: '1.5rem',
            fontWeight: '800',
            color: 'white',
            fontFamily: 'var(--font-display)'
        }
    };

    return (
        <div className="glass-main">
            <div style={styles.container}>
                <div className="glass-reveal">
                    {/* Operational Hero Section */}
                    <div style={styles.headerHero}>
                        <h1 style={styles.title}>Hiring <span className="text-gradient-sapphire">History.</span></h1>
                        <p style={styles.subtitle}>
                            Track and review processed candidate applications with industrial precision.
                            Your organization's complete recruitment legacy in one command center.
                        </p>
                    </div>

                    {/* Summary Intelligence Stats */}
                    <div style={styles.statsGrid}>
                        {[
                            { label: 'Total Processed', value: stats.total, icon: Users, color: 'var(--glass-accent-light)' },
                            { label: 'Accepted', value: stats.accepted, icon: CheckCircle, color: '#10B981' },
                            { label: 'Shortlisted', value: stats.shortlisted, icon: Clock, color: '#3B82F6' },
                            { label: 'Rejected', value: stats.rejected, icon: XCircle, color: '#EF4444' }
                        ].map((item, idx) => (
                            <div key={idx} style={{ ...styles.statCard(), animationDelay: `${idx * 0.1}s` }} className="glass-stat-card glass-reveal">
                                <div style={styles.statIcon(item.color)}>
                                    <item.icon size={28} />
                                </div>
                                <div>
                                    <div style={styles.statValue}>{item.value}</div>
                                    <div style={styles.statLabel}>{item.label}</div>
                                </div>
                                <div className="stat-sweep" />
                            </div>
                        ))}
                    </div>

                    {/* Glass Control Bar */}
                    <div style={{ ...styles.controlBar, animationDelay: '0.4s' }} className="glass-reveal">
                        <div style={styles.tabs}>
                            {['All', 'Accepted', 'Shortlisted', 'Rejected'].map(tab => (
                                <button
                                    key={tab}
                                    style={styles.tab(filterStatus === tab)}
                                    onClick={() => setFilterStatus(tab)}
                                    className="tab-hover"
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div style={styles.searchWrapper}>
                            <SearchIcon size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--glass-accent-light)' }} />
                            <input
                                type="text"
                                placeholder="Search hiring protocols…"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={styles.searchInput}
                                className="glass-input-focus"
                            />
                        </div>
                    </div>

                    {/* Hiring History Matrix */}
                    <div style={{ ...styles.tableWrapper, animationDelay: '0.5s' }} className="glass-reveal">
                        {isLoading ? (
                            <div style={{ padding: '100px', textAlign: 'center', color: 'var(--glass-text-muted)' }}>
                                <RefreshCw size={48} className="animate-spin" opacity={0.3} style={{ margin: '0 auto 20px' }} />
                                <p style={{ fontSize: '1.1rem', fontWeight: '700' }}>Synchronizing History Matrix…</p>
                            </div>
                        ) : filteredData.length > 0 ? (
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Candidate Intelligence</th>
                                        <th style={styles.th}>Job Allocation</th>
                                        <th style={styles.th}>Status Protocol</th>
                                        <th style={styles.th}>Processed Date</th>
                                        <th style={styles.th}>Control</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map(item => (
                                        <tr key={item.id} className="history-row">
                                            <td style={styles.td}>
                                                <div style={{ fontWeight: '800', fontSize: '1.05rem', color: 'white' }}>{item.JobSeeker?.fullname || 'Candidate'}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--glass-text-secondary)', fontWeight: '600' }}>{item.JobSeeker?.email}</div>
                                            </td>
                                            <td style={styles.td}>
                                                <div style={{ color: 'var(--glass-accent-light)', fontWeight: '700' }}>{item.JobListing?.title}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--glass-text-muted)' }}>ID: {item.id.slice(0, 8)}</div>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={styles.badge(item.status)}>
                                                    <div className="status-dot" style={{ background: 'currentColor' }} />
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td style={styles.td}>
                                                <div style={{ fontWeight: '600' }}>{item.updated_at ? new Date(item.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</div>
                                            </td>
                                            <td style={styles.td}>
                                                <button
                                                    style={styles.viewAction}
                                                    onClick={() => handleViewDetails(item)}
                                                    className="btn-scale"
                                                >
                                                    <Eye size={16} className="text-gradient-sapphire" />
                                                    DETAILS
                                                    <ChevronRight size={14} className="arrow-move" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div style={{ padding: '100px', textAlign: 'center', color: 'var(--glass-text-muted)' }}>
                                <Clock size={60} opacity={0.1} style={{ margin: '0 auto 24px' }} />
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white', marginBottom: '8px' }}>Void History</h3>
                                <p style={{ maxWidth: '300px', margin: '0 auto' }}>No hiring protocols match your current parameters. Attempt a system reset.</p>
                            </div>
                        )}
                    </div>

                    {/* Hiring Overview Analytics */}
                    <div style={{ ...styles.analyticsPanel, animationDelay: '0.6s' }} className="glass-reveal">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                            <div className="icon-surface" style={{ width: '40px', height: '40px', borderRadius: '10px' }}>
                                <BarChart2 size={20} />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', letterSpacing: '0.02em' }}>Hiring Overview</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
                                    <span style={styles.statLabel}>Success Rate</span>
                                    <span style={styles.percentValue}>{stats.total ? Math.round((stats.accepted / stats.total) * 100) : 0}%</span>
                                </div>
                                <div style={{ height: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '100px', overflow: 'hidden' }}>
                                    <div
                                        className="progress-fill"
                                        style={{ height: '100%', background: 'linear-gradient(90deg, #10B981, #34D399)', width: `${stats.total ? (stats.accepted / stats.total) * 100 : 0}%`, borderRadius: '100px' }}
                                    ></div>
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
                                    <span style={styles.statLabel}>Shortlist Ratio</span>
                                    <span style={styles.percentValue}>{stats.total ? Math.round((stats.shortlisted / stats.total) * 100) : 0}%</span>
                                </div>
                                <div style={{ height: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '100px', overflow: 'hidden' }}>
                                    <div
                                        className="progress-fill"
                                        style={{ height: '100%', background: 'linear-gradient(90deg, #3B82F6, #60A5FA)', width: `${stats.total ? (stats.shortlisted / stats.total) * 100 : 0}%`, borderRadius: '100px' }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div style={styles.progressTrack}>
                            <div className="progress-fill" style={{ width: `${stats.total ? (stats.accepted / stats.total) * 100 : 0}%`, backgroundColor: '#10B981' }}></div>
                            <div className="progress-fill" style={{ width: `${stats.total ? (stats.shortlisted / stats.total) * 100 : 0}%`, backgroundColor: '#3B82F6' }}></div>
                            <div className="progress-fill" style={{ width: `${stats.total ? (stats.rejected / stats.total) * 100 : 0}%`, backgroundColor: '#EF4444' }}></div>
                        </div>

                        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                            {[
                                { color: '#10B981', label: 'Accepted' },
                                { color: '#3B82F6', label: 'Shortlisted' },
                                { color: '#EF4444', label: 'Rejected' }
                            ].map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--glass-text-secondary)' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, boxShadow: `0 0 8px ${item.color}80` }} />
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal - Reusing Detail Protocol from Applications hub for consistency */}
            {isModalOpen && selectedCandidate && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 2000, animation: 'fadeIn 0.3s ease'
                }} onClick={() => setIsModalOpen(false)}>
                    <div style={{
                        background: 'var(--glass-bg)', width: '90%', maxWidth: '600px',
                        borderRadius: '24px', border: '1px solid var(--glass-border)',
                        padding: '40px', position: 'relative', overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                        animation: 'reveal 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, transparent, var(--glass-accent-light), transparent)' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                            <div>
                                <h2 style={{ margin: '0 0 8px', fontSize: '2rem', fontWeight: '800', color: 'white' }}>{selectedCandidate.JobSeeker?.fullname}</h2>
                                <span style={styles.badge(selectedCandidate.status)}>{selectedCandidate.status}</span>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                                <XCircle size={20} />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gap: '24px' }}>
                            <div className="icon-surface" style={{ padding: '20px', borderRadius: '16px', display: 'flex', gap: '16px' }}>
                                <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--glass-accent-light)' }}>
                                    <Briefcase size={22} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--glass-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Application Protocol</div>
                                    <div style={{ fontSize: '1rem', fontWeight: '700', color: 'white' }}>{selectedCandidate.JobListing?.title}</div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div className="icon-surface" style={{ width: '32px', height: '32px', borderRadius: '8px' }}><Mail size={14} /></div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--glass-text-secondary)' }}>{selectedCandidate.JobSeeker?.email}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div className="icon-surface" style={{ width: '32px', height: '32px', borderRadius: '8px' }}><Phone size={14} /></div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--glass-text-secondary)' }}>{selectedCandidate.JobSeeker?.phone || 'N/A'}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div className="icon-surface" style={{ width: '32px', height: '32px', borderRadius: '8px' }}><MapPin size={14} /></div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--glass-text-secondary)' }}>{selectedCandidate.JobSeeker?.location || 'N/A'}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div className="icon-surface" style={{ width: '32px', height: '32px', borderRadius: '8px' }}><TrendingUp size={14} /></div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--glass-text-secondary)' }}>{selectedCandidate.JobSeeker?.experience || 'N/A'}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '40px', display: 'flex', gap: '16px' }}>
                            <button style={{ flex: 1, padding: '16px', borderRadius: '12px', background: 'var(--glass-accent)', color: 'white', border: '1px solid var(--glass-border-bright)', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} className="btn-scale">
                                <ExternalLink size={18} /> FULL PROFILE
                            </button>
                            <button onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)', fontWeight: '800', cursor: 'pointer' }}>
                                CLOSE
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .glass-stat-card:hover {
                    transform: translateY(-4px);
                    border-color: var(--glass-border-bright);
                    background: rgba(255, 255, 255, 0.05);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                }

                .stat-sweep {
                    position: absolute;
                    top: 0; left: -100%; width: 100%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
                    transition: 0.5s;
                }

                .glass-stat-card:hover .stat-sweep { left: 100%; }

                .tab-hover:hover { color: white; background: rgba(255,255,255,0.03); }

                .glass-input-focus:focus {
                    background: rgba(255,255,255,0.05);
                    border-color: var(--glass-accent-light);
                    box-shadow: 0 0 20px rgba(59, 130, 246, 0.15);
                }

                .history-row { transition: all 0.2s; cursor: default; }
                .history-row:hover { background: rgba(255,255,255,0.02); }
                .history-row:hover .td { border-bottom-color: rgba(255,255,255,0.15); }

                .btn-scale { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
                .btn-scale:hover { transform: scale(1.05) translateY(-2px); border-color: var(--glass-border-bright); filter: brightness(1.1); }
                .btn-scale:active { transform: scale(0.95); }

                .arrow-move { transition: transform 0.2s; }
                .btn-scale:hover .arrow-move { transform: translateX(3px); }

                .progress-fill { border-radius: 100px; transition: width 1s cubic-bezier(0.2, 0.8, 0.2, 1); }

                .status-dot { width: 6px; height: 6px; border-radius: 50%; box-shadow: 0 0 8px currentColor; }

                @keyframes reveal { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }

                @media (max-width: 900px) {
                    th:nth-child(2), td:nth-child(2), th:nth-child(4), td:nth-child(4) { display: none; }
                    .controlBar { flex-direction: column; align-items: stretch; }
                    .searchWrapper { max-width: 100%; }
                }
            `}</style>
        </div>
    );
};

export default History;
