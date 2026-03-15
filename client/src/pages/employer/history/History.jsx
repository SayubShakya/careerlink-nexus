import React, { useState, useMemo, useEffect } from 'react';
import Pagination from '@/components/ui/Pagination';
import '@/styles/ProfessionalGlass.css';
import { useGetEmployerApplications } from '@/hooks/api/employer/useEmployer';
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
    Search as SearchIcon,
    BookOpen,
    FileText,
    ShieldCheck
} from 'lucide-react';

// --- Mini Sky Scene (Shared from Dashboard) ---
const PageHeroSky = ({ timeOfDay }) => (
    <div className="dash-sky-scene">
        {timeOfDay === 'night' && (
            <>
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="dash-star" style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        width: `${2 + Math.random() * 2}px`,
                        height: `${2 + Math.random() * 2}px`,
                    }} />
                ))}
                <div className="dash-moon">
                    <div className="dash-moon-crater" style={{ width: 8, height: 8, top: 8, left: 12 }} />
                </div>
            </>
        )}
        {timeOfDay === 'morning' && (
            <>
                <div className="dash-sun dash-morning-sun">
                    <div className="dash-sun-ray" />
                    <div className="dash-sun-ray" style={{ transform: 'rotate(60deg)' }} />
                </div>
                <div className="dash-cloud dash-cloud-1" />
            </>
        )}
        {(timeOfDay === 'afternoon' || timeOfDay === 'evening') && (
            <>
                <div className={timeOfDay === 'afternoon' ? "dash-sun dash-afternoon-sun" : "dash-sunset-orb"} />
                <div className="dash-cloud dash-cloud-1" />
                <div className="dash-cloud dash-cloud-2" />
            </>
        )}
    </div>
);

const History = () => {
    // API Hooks
    const { data: serverApps = [], isLoading } = useGetEmployerApplications();

    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    // Filter for processed candidates (non-Pending, i.e. not 'applied')
    const historyData = useMemo(() => {
        return serverApps.filter(app => app.status !== 'Pending' && app.status !== 'applied');
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

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus, searchTerm]);

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
            padding: '50px 64px',
            marginBottom: '40px',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '24px',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        },
        title: {
            fontSize: '3.5rem',
            fontWeight: '800',
            color: 'var(--theme-text-primary)',
            fontFamily: 'var(--font-display)',
            marginBottom: '12px',
            letterSpacing: '-0.03em',
            lineHeight: '1.1'
        },
        bannerSubtitle: {
            fontSize: '1.1rem',
            color: 'var(--glass-text-secondary)',
            fontWeight: '600',
            maxWidth: '550px',
            marginTop: '12px',
            lineHeight: '1.6',
            position: 'relative',
            zIndex: 2
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
        },
        statCard: (color) => ({
            background: 'var(--glass-surface)',
            padding: '28px 32px',
            borderRadius: '24px',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
            cursor: 'default',
            position: 'relative',
            overflow: 'hidden'
        }),
        statIcon: (color) => ({
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'var(--theme-bg-subtle)',
            border: '1px solid var(--theme-border)',
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 8px 20px ${color}15`
        }),
        statValue: {
            fontSize: '2.5rem',
            fontWeight: '900',
            color: 'var(--theme-text-primary)',
            lineHeight: '1',
            letterSpacing: '-0.02em',
            marginBottom: '4px',
            fontFamily: 'var(--font-display)',
            textShadow: '0 4px 12px rgba(0,0,0,0.05)'
        },
        statLabel: {
            fontSize: '0.7rem',
            color: 'var(--glass-text-secondary)',
            fontWeight: '900',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
        },
        controlBar: {
            background: 'var(--glass-surface)',
            padding: '16px 20px',
            borderRadius: '24px',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            backdropFilter: 'blur(12px)',
            gap: '16px',
            flexWrap: 'wrap',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)'
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
            background: isActive ? 'var(--theme-bg-subtle)' : 'transparent',
            color: isActive ? 'var(--theme-text-primary)' : 'var(--theme-text-muted)',
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
            padding: '14px 16px 14px 52px',
            borderRadius: '16px',
            border: '1px solid var(--theme-border)',
            backgroundColor: 'var(--theme-bg-subtle)',
            fontSize: '0.9rem',
            color: 'var(--theme-text-primary)',
            outline: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            fontWeight: '700',
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.02em'
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
            color: 'var(--theme-text-primary)',
            borderBottom: '1px solid var(--glass-border)',
            transition: 'all 0.2s ease'
        },
        badge: (status) => {
            const configs = {
                Accepted: { color: '#10B981', label: 'HIRED' },
                Rejected: { color: '#EF4444', label: 'REJECTED' },
                Shortlisted: { color: '#3B82F6', label: 'SHORTLIST' }
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
            background: 'var(--theme-bg-subtle)',
            border: '1px solid var(--theme-border)',
            color: 'var(--theme-text-primary)',
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

    const hour = new Date().getHours();
    const timeOfDay = hour >= 5 && hour < 12 ? 'morning' : hour >= 12 && hour < 17 ? 'afternoon' : hour >= 17 && hour < 20 ? 'evening' : 'night';

    return (
        <div className="glass-main" style={{ position: 'relative' }}>
            {/* Ambient Background Glows */}
            <div className="glow-effect" style={{ top: '5%', left: '-5%', background: '#60A5FA', width: '300px', height: '300px', opacity: 0.15 }} />
            <div className="glow-effect" style={{ top: '65%', right: '-5%', background: '#818CF8', width: '400px', height: '400px', opacity: 0.1 }} />

            <div style={styles.container}>
                <div className="glass-reveal">
                    {/* Operational Hero Section */}
                    <header style={styles.headerHero} className={`dash-hero-${timeOfDay} glass-panel`}>
                        <PageHeroSky timeOfDay={timeOfDay} />
                        <div style={{ position: 'relative', zIndex: 2 }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '8px 16px',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '12px',
                                fontSize: '0.65rem',
                                fontWeight: '900',
                                color: 'white',
                                textTransform: 'uppercase',
                                letterSpacing: '0.15em',
                                marginBottom: '16px',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <Clock size={14} fill="white" /> Operational History
                            </div>
                            <h1 style={{
                                fontSize: '4rem',
                                fontWeight: '900',
                                color: 'white',
                                margin: 0,
                                letterSpacing: '-0.04em',
                                fontFamily: 'var(--font-display)',
                                lineHeight: 1
                            }}>
                                Past <span style={{ color: 'rgba(255,255,255,0.8)' }}>Decisions.</span>
                            </h1>
                            <p style={styles.bannerSubtitle}>
                                See all the decisions you have made for your candidates.
                            </p>
                        </div>

                         {/* Background Glow */}
                        <div style={{
                            position: 'absolute', bottom: '-80px', right: '-80px', width: '250px', height: '250px',
                            background: 'radial-gradient(circle, var(--glass-accent) 0%, transparent 70%)',
                            opacity: 0.15, filter: 'blur(50px)', pointerEvents: 'none'
                        }} />
                    </header>

                    {/* Summary Intelligence Stats */}
                    <div style={styles.statsGrid}>
                        {[
                            { label: 'Total', value: stats.total, icon: Users, color: 'var(--glass-accent-light)' },
                            { label: 'Chosen', value: stats.accepted, icon: CheckCircle, color: '#10B981' },
                            { label: 'Saved', value: stats.shortlisted, icon: Clock, color: '#3B82F6' },
                            { label: 'Not Hired', value: stats.rejected, icon: XCircle, color: '#EF4444' }
                        ].map((item, idx) => (
                            <div key={idx} style={{ ...styles.statCard(item.color), animationDelay: `${idx * 0.1}s` }} className="glass-stat-card glass-reveal">
                                <div style={styles.statIcon(item.color)}>
                                    <item.icon size={28} />
                                </div>
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <div style={styles.statValue}>{item.value}</div>
                                    <div style={styles.statLabel}>{item.label}</div>
                                </div>
                                {/* Gloss Reflection */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    width: '100px',
                                    height: '100px',
                                    background: `radial-gradient(circle at center, ${item.color}10 0%, transparent 70%)`,
                                    pointerEvents: 'none',
                                    zIndex: 0
                                }} />
                                <div className="stat-sweep" />
                            </div>
                        ))}
                    </div>

                    {/* Glass Control Bar */}
                    <div style={{ ...styles.controlBar, animationDelay: '0.4s' }} className="glass-reveal">
                        <div style={styles.tabs}>
                            {[['All', 'All'], ['Accepted', 'Hired'], ['Shortlisted', 'Shortlist'], ['Rejected', 'Rejected']].map(([key, label]) => (
                                <button
                                    key={key}
                                    style={styles.tab(filterStatus === key)}
                                    onClick={() => setFilterStatus(key)}
                                    className="tab-hover"
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        <div style={styles.searchWrapper}>
                            <SearchIcon size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--glass-accent-light)' }} />
                            <input
                                type="text"
                                placeholder="Find someone..."
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
                                <p style={{ fontSize: '1.1rem', fontWeight: '700' }}>Looking back...</p>
                            </div>
                        ) : filteredData.length > 0 ? (
                            <>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Person</th>
                                        <th style={styles.th}>Job Name</th>
                                        <th style={styles.th}>Result</th>
                                        <th style={styles.th}>Done On</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedData.map(item => {
                                        const candidateName = item.JobSeeker?.fullname || 'Unknown Candidate';
                                        return (
                                            <tr key={item.id} className="history-row">
                                                <td style={styles.td}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                        <div className="glass-avatar-tile" style={{ width: '40px', height: '40px', fontSize: '0.9rem' }}>
                                                            {candidateName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--theme-text-primary)' }}>{candidateName}</div>
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--glass-text-secondary)', fontWeight: '600' }}>{item.JobSeeker?.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={styles.td}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--theme-text-primary)', fontWeight: '700' }}>
                                                        <Briefcase size={14} className="text-gradient-sapphire" />
                                                        {item.JobListing?.title}
                                                    </div>
                                                </td>
                                                <td style={styles.td}>
                                                    <span style={styles.badge(item.status)}>
                                                        <div className="status-dot" style={{ background: 'currentColor' }} />
                                                        {item.status === 'Accepted' ? 'HIRED' : (item.status === 'Rejected' ? 'REJECTED' : (item.status === 'Shortlisted' ? 'SHORTLIST' : item.status.toUpperCase()))}
                                                    </span>
                                                </td>
                                                <td style={styles.td}>
                                                    <div style={{ fontWeight: '700', color: 'var(--glass-text-secondary)', fontSize: '0.85rem' }}>
                                                        {item.updated_at ? new Date(item.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                totalItems={filteredData.length}
                                itemsPerPage={ITEMS_PER_PAGE}
                            />
                            </>
                        ) : (
                            <div style={{ padding: '100px', textAlign: 'center', color: 'var(--glass-text-muted)' }}>
                                <Clock size={60} opacity={0.1} style={{ margin: '0 auto 24px' }} />
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white', marginBottom: '8px' }}>Nothing here yet</h3>
                                <p style={{ maxWidth: '300px', margin: '0 auto' }}>We could not find anything. Try looking for something else.</p>
                            </div>
                        )}
                    </div>

                    {/* Hiring Overview Analytics */}
                    <div style={{ ...styles.analyticsPanel, animationDelay: '0.6s' }} className="glass-reveal">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                            <div className="icon-surface" style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--theme-bg-subtle)', border: '1px solid var(--theme-border)' }}>
                                <BarChart2 size={24} className="text-gradient-sapphire" />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900', letterSpacing: '-0.01em', color: 'var(--theme-text-primary)' }}>Efficiency Metrics</h3>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--glass-text-secondary)', fontWeight: '600' }}>Real-time overview of your recruitment funnel.</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', marginBottom: '32px' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                                    <span style={styles.statLabel}>Success Rate</span>
                                    <span style={styles.percentValue} className="text-gradient-sapphire">{stats.total ? Math.round((stats.accepted / stats.total) * 100) : 0}%</span>
                                </div>
                                <div style={{ height: '14px', background: 'var(--theme-bg-subtle)', borderRadius: '100px', overflow: 'hidden', padding: '2px', border: '1px solid var(--theme-border)' }}>
                                    <div
                                        className="progress-fill"
                                        style={{ height: '100%', background: 'linear-gradient(90deg, #10B981, #34D399)', width: `${stats.total ? (stats.accepted / stats.total) * 100 : 0}%`, borderRadius: '100px', boxShadow: '0 0 12px rgba(16, 185, 129, 0.3)' }}
                                    ></div>
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                                    <span style={styles.statLabel}>Retention Rate</span>
                                    <span style={styles.percentValue} className="text-gradient-sapphire">{stats.total ? Math.round((stats.shortlisted / stats.total) * 100) : 0}%</span>
                                </div>
                                <div style={{ height: '14px', background: 'var(--theme-bg-subtle)', borderRadius: '100px', overflow: 'hidden', padding: '2px', border: '1px solid var(--theme-border)' }}>
                                    <div
                                        className="progress-fill"
                                        style={{ height: '100%', background: 'linear-gradient(90deg, #3B82F6, #60A5FA)', width: `${stats.total ? (stats.shortlisted / stats.total) * 100 : 0}%`, borderRadius: '100px', boxShadow: '0 0 12px rgba(59, 130, 246, 0.3)' }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div style={{ ...styles.progressTrack, background: 'var(--theme-bg-subtle)', border: '1px solid var(--theme-border)', padding: '2px', height: '16px' }}>
                            <div className="progress-fill" style={{ width: `${stats.total ? (stats.accepted / stats.total) * 100 : 0}%`, backgroundColor: '#10B981', boxShadow: '0 0 8px rgba(16, 185, 129, 0.2)' }}></div>
                            <div className="progress-fill" style={{ width: `${stats.total ? (stats.shortlisted / stats.total) * 100 : 0}%`, backgroundColor: '#3B82F6', boxShadow: '0 0 8px rgba(59, 130, 246, 0.2)' }}></div>
                            <div className="progress-fill" style={{ width: `${stats.total ? (stats.rejected / stats.total) * 100 : 0}%`, backgroundColor: '#EF4444', boxShadow: '0 0 8px rgba(239, 68, 68, 0.2)' }}></div>
                        </div>

                        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', marginTop: '24px' }}>
                            {[
                                { color: '#10B981', label: 'Accepted Candidates', count: stats.accepted },
                                { color: '#3B82F6', label: 'Shortlisted Pool', count: stats.shortlisted },
                                { color: '#EF4444', label: 'Declined Profiles', count: stats.rejected }
                            ].map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', fontWeight: '800', color: 'var(--theme-text-primary)' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color, boxShadow: `0 0 10px ${item.color}60` }} />
                                    <span>{item.label}</span>
                                    <span style={{ color: 'var(--glass-text-secondary)', marginLeft: '4px' }}>({item.count})</span>
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
                                <h2 style={{ margin: '0 0 8px', fontSize: '2.5rem', fontWeight: '900', color: 'var(--theme-text-primary)', letterSpacing: '-0.02em', fontFamily: 'var(--font-display)' }}>{selectedCandidate.JobSeeker?.fullname}</h2>
                                <span style={styles.badge(selectedCandidate.status)}>{selectedCandidate.status === 'Accepted' ? 'HIRED' : (selectedCandidate.status === 'Rejected' ? 'REJECTED' : (selectedCandidate.status === 'Shortlisted' ? 'SHORTLIST' : selectedCandidate.status.toUpperCase()))}</span>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'var(--theme-bg-subtle)', border: '1px solid var(--theme-border)', borderRadius: '14px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--theme-text-primary)' }} className="btn-scale">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gap: '24px' }}>
                            <div className="icon-surface" style={{ padding: '24px', borderRadius: '20px', display: 'flex', gap: '20px', background: 'var(--theme-bg-subtle)', border: '1px solid var(--theme-border)' }}>
                                <div style={{ width: '56px', height: '56px', background: 'var(--glass-surface)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--glass-accent-light)', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                                    <Briefcase size={28} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--glass-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Assignment Portfolio</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--theme-text-primary)' }}>{selectedCandidate.JobListing?.title}</div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '0 8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div className="icon-surface" style={{ width: '36px', height: '36px', borderRadius: '10px' }}><Mail size={16} /></div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--theme-text-primary)' }}>{selectedCandidate.JobSeeker?.email}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div className="icon-surface" style={{ width: '36px', height: '36px', borderRadius: '10px' }}><Phone size={16} /></div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--theme-text-primary)' }}>{selectedCandidate.JobSeeker?.phone || 'N/A'}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div className="icon-surface" style={{ width: '36px', height: '36px', borderRadius: '10px' }}><MapPin size={16} /></div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--theme-text-primary)' }}>{selectedCandidate.JobSeeker?.location || 'N/A'}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div className="icon-surface" style={{ width: '36px', height: '36px', borderRadius: '10px' }}><TrendingUp size={16} /></div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--theme-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{(selectedCandidate.CV?.content?.experience && selectedCandidate.CV.content.experience.length > 0) ? selectedCandidate.CV.content.experience[0].title : 'Experience Not Listed'}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div className="icon-surface" style={{ width: '36px', height: '36px', borderRadius: '10px' }}><BookOpen size={16} /></div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--theme-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{(selectedCandidate.CV?.content?.education && selectedCandidate.CV.content.education.length > 0) ? `${selectedCandidate.CV.content.education[0].degree}` : 'Education Not Listed'}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div className="icon-surface" style={{ width: '36px', height: '36px', borderRadius: '10px' }}><Calendar size={16} /></div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--theme-text-primary)' }}>{selectedCandidate.updated_at ? new Date(selectedCandidate.updated_at).toLocaleDateString() : 'N/A'}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center' }}>
                            <button onClick={() => setIsModalOpen(false)} style={{ padding: '18px 64px', borderRadius: '16px', background: 'var(--glass-accent)', color: 'white', border: 'none', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '1rem', letterSpacing: '0.05em', boxShadow: '0 10px 25px rgba(63, 81, 181, 0.4)' }} className="btn-scale">
                                CLOSE MODULE
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
