import React, { useState } from 'react';
import { useGetEmployerApplications, useUpdateApplicationStatus } from '@/hooks/api/employer/useEmployer';
import {
    Search,
    Filter,
    Eye,
    CheckCircle2,
    XCircle,
    FileText,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Briefcase,
    ChevronDown,
    User,
    X,
    ExternalLink,
    AlertCircle,
    Download,
    ChevronRight,
    AlertTriangle,
    Inbox,
    RefreshCw,
    ShieldCheck,
    Zap,
    Layers,
    Target
} from 'lucide-react';

// Design System
import '@/styles/ProfessionalGlass.css';

// --- Custom Confirmation Modal (Obsidian Authority Style) ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type = 'warning' }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3000,
            animation: 'glassEntrance 0.2s ease-out'
        }} onClick={onClose}>
            <div
                className="glass-panel"
                style={{
                    backgroundColor: 'rgba(10, 12, 16, 0.95)',
                    borderRadius: '24px',
                    padding: '48px 40px',
                    width: '90%',
                    maxWidth: '520px',
                    border: '1px solid var(--glass-border-bright)',
                    boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.8)',
                    position: 'relative',
                    zIndex: 3001,
                    textAlign: 'center',
                    animation: 'glassEntrance 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
                    <div className={`flex-center`} style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '20px',
                        backgroundColor: type === 'warning' ? 'rgba(239, 172, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: type === 'warning' ? '#F59E0B' : '#EF4444',
                        border: `1px solid ${type === 'warning' ? 'rgba(239, 172, 68, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                    }}>
                        <AlertTriangle size={36} />
                    </div>
                </div>
                <h3 style={{
                    fontSize: '2rem',
                    fontWeight: '800',
                    color: 'var(--theme-text-primary)',
                    marginBottom: '16px',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '-0.02em'
                }}>{title}</h3>
                <p style={{
                    color: 'var(--theme-text-secondary)',
                    marginBottom: '40px',
                    lineHeight: '1.7',
                    fontSize: '1.05rem',
                    fontWeight: '500'
                }}>{message}</p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <button
                        onClick={onClose}
                        className="btn-scale"
                        style={{
                            padding: '14px 28px',
                            borderRadius: '14px',
                            border: '1px solid var(--theme-border)',
                            background: 'transparent',
                            color: 'var(--theme-text-primary)',
                            fontWeight: '700',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-display)'
                        }}
                    >
                        CANCEL PROTOCOL
                    </button>
                    <button
                        onClick={() => { onConfirm(); onClose(); }}
                        className="btn-scale"
                        style={{
                            padding: '14px 40px',
                            borderRadius: '14px',
                            border: 'none',
                            background: type === 'warning' ? 'var(--glass-accent)' : '#DC2626',
                            color: 'white',
                            fontWeight: '800',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-display)',
                            boxShadow: `0 8px 20px -4px ${type === 'warning' ? 'rgba(63, 81, 181, 0.4)' : 'rgba(220, 38, 38, 0.4)'}`
                        }}
                    >
                        CONFIRM ACTION
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Candidate Intelligence Modal (Frosted Experience) ---
const CandidateModal = ({ isOpen, onClose, candidate, onShortlist, onReject }) => {
    if (!isOpen || !candidate) return null;

    const styles = {
        overlay: {
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3000,
            animation: 'glassEntrance 0.3s ease-out'
        },
        modal: {
            backgroundColor: 'var(--glass-bg)',
            borderRadius: '28px',
            width: '95%',
            maxWidth: '1000px',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid var(--glass-border-bright)',
            boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.6)',
            position: 'relative',
            animation: 'glassEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
        },
        header: {
            padding: '60px 50px',
            background: 'linear-gradient(135deg, rgba(10, 12, 16, 0.8) 0%, rgba(63, 81, 181, 0.1) 100%)',
            borderBottom: '1px solid var(--glass-border)',
            display: 'flex',
            gap: '40px',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
        },
        content: {
            padding: '50px'
        },
        section: {
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid var(--glass-border)',
            marginBottom: '32px'
        },
        label: {
            fontSize: '0.75rem',
            fontWeight: '800',
            color: 'var(--glass-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginBottom: '8px',
            display: 'block'
        },
        value: {
            fontSize: '1.1rem',
            fontWeight: '600',
            color: 'white'
        }
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()} className="hide-scrollbar">
                {/* Decoration */}
                <div style={{
                    position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px',
                    background: 'radial-gradient(circle, var(--glass-accent) 0%, transparent 70%)',
                    opacity: 0.15, filter: 'blur(60px)', pointerEvents: 'none'
                }} />

                <button
                    onClick={onClose}
                    className="glass-action-circle"
                    style={{ position: 'absolute', top: '32px', right: '32px', zIndex: 10 }}
                >
                    <X size={20} />
                </button>

                <div style={styles.header}>
                    <div className="glass-avatar-tile" style={{ width: '120px', height: '120px', borderRadius: '32px', fontSize: '3.5rem' }}>
                        {candidate.name.charAt(0)}
                    </div>
                    <div>
                        <h2 style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--theme-text-primary)', marginBottom: '12px', letterSpacing: '-0.03em', fontFamily: 'var(--font-display)' }}>
                            {candidate.name}
                        </h2>
                        <div style={{ display: 'flex', gap: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--theme-text-secondary)', fontWeight: '600' }}>
                                <Briefcase size={18} className="text-gradient-sapphire" /> {candidate.jobTitle}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--theme-text-secondary)', fontWeight: '600' }}>
                                <MapPin size={18} className="text-gradient-sapphire" /> {candidate.location}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={styles.content}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
                        <div className="glass-panel" style={{ padding: '24px' }}>
                            <span style={styles.label}>Email Address</span>
                            <div style={styles.value}>{candidate.email}</div>
                        </div>
                        <div className="glass-panel" style={{ padding: '24px' }}>
                            <span style={styles.label}>Phone Protocol</span>
                            <div style={styles.value}>{candidate.phone || 'System Not Set'}</div>
                        </div>
                        <div className="glass-panel" style={{ padding: '24px' }}>
                            <span style={styles.label}>Applied On</span>
                            <div style={styles.value}>{candidate.appliedDate}</div>
                        </div>
                    </div>

                    <div style={styles.section}>
                        <h3 style={{ ...styles.label, fontSize: '0.85rem', color: 'var(--glass-accent-light)' }}>Candidate Intelligence Summary</h3>
                        <p style={{ color: 'var(--glass-text-secondary)', lineHeight: '1.8', fontSize: '1.1rem', fontWeight: '500', margin: 0 }}>
                            {candidate.about || "No profile summary provided in the data matrix."}
                        </p>
                    </div>

                    <div style={styles.section}>
                        <h3 style={{ ...styles.label, fontSize: '0.85rem', color: 'var(--glass-accent-light)' }}>Technical Skill Matrix</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                            {candidate.skills.map((skill, i) => (
                                <span key={i} className="glass-badge-pulse" style={{ background: 'rgba(96, 165, 250, 0.1)', color: '#93C5FD', border: '1px solid rgba(96, 165, 250, 0.2)' }}>
                                    <Target size={14} /> {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                        <div style={styles.section}>
                            <h3 style={{ ...styles.label, fontSize: '0.85rem', color: 'var(--glass-accent-light)' }}>Education Path</h3>
                            <div style={{ color: 'white', fontWeight: '600' }}>{candidate.education}</div>
                        </div>
                        <div style={styles.section}>
                            <h3 style={{ ...styles.label, fontSize: '0.85rem', color: 'var(--glass-accent-light)' }}>Operational Cover</h3>
                            <div style={{ color: 'var(--glass-text-secondary)', fontSize: '0.95rem', fontStyle: 'italic' }}>
                                "{candidate.coverLetter.substring(0, 150)}..."
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div style={{ padding: '32px 50px', borderTop: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.01)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        {candidate.status !== 'Shortlisted' && (
                            <button
                                className="btn-scale"
                                style={{ padding: '14px 32px', background: 'var(--glass-accent)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-display)' }}
                                onClick={() => { onShortlist(candidate.id); onClose(); }}
                            >
                                <ShieldCheck size={20} /> SHORTLIST CANDIDATE
                            </button>
                        )}
                        {candidate.status !== 'Rejected' && (
                            <button
                                className="btn-scale"
                                style={{ padding: '14px 32px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-display)' }}
                                onClick={() => { onReject(candidate.id); onClose(); }}
                            >
                                <XCircle size={20} /> REJECT APPLICATION
                            </button>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        style={{ background: 'transparent', border: 'none', color: 'var(--glass-text-secondary)', fontWeight: '700', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem' }}
                    >
                        CLOSE INTELLIGENCE MODAL
                    </button>
                </div>
            </div>
        </div>
    );
};

const Applications = () => {
    // API Hooks
    const { data: serverApps = [], isLoading } = useGetEmployerApplications();
    const { mutate: updateAppStatus } = useUpdateApplicationStatus();

    // UI State
    const [searchQuery, setSearchQuery] = useState('');
    const [jobFilter, setJobFilter] = useState('All Jobs');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [selectedApp, setSelectedApp] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, onConfirm: null, title: '', message: '' });

    // Derived Data
    const uniqueJobs = ['All Jobs', ...new Set(serverApps.map(app => app.jobTitle || app.JobListing?.title))];

    // Filter Logic
    const filteredApps = serverApps.filter(app => {
        const name = app.name || app.JobSeeker?.fullname || '';
        const jobTitle = app.jobTitle || app.JobListing?.title || '';
        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesJob = jobFilter === 'All Jobs' || jobTitle === jobFilter;
        const matchesStatus = statusFilter === 'All Status' || app.status === statusFilter;
        return matchesSearch && matchesJob && matchesStatus;
    });

    const triggerAction = (id, newStatus) => {
        const app = serverApps.find(a => a.id === id);
        const name = app.name || app.JobSeeker?.fullname || 'the candidate';

        if (newStatus === 'Rejected') {
            setConfirmModal({
                isOpen: true,
                title: 'Terminate Application',
                message: `Are you sure you want to terminate the recruitment process for ${name}? The candidate will be notified of the decision.`,
                onConfirm: () => updateStatus(id, newStatus)
            });
        } else {
            updateStatus(id, newStatus);
        }
    };

    const updateStatus = (id, newStatus) => {
        updateAppStatus({ id, status: newStatus });
    };

    const styles = {
        container: {
            padding: '40px 32px 60px',
            maxWidth: '1400px',
            margin: '0 auto',
            minHeight: '100vh',
            fontFamily: 'var(--font-body)',
            color: 'var(--theme-text-primary)',
            position: 'relative'
        },
        headerBanner: {
            backgroundColor: 'var(--glass-surface)',
            backdropFilter: 'blur(var(--glass-blur))',
            borderRadius: '24px',
            padding: '50px 64px',
            marginBottom: '40px',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        },
        bannerOverline: {
            fontSize: '0.8rem',
            fontWeight: '800',
            color: 'var(--glass-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            fontFamily: 'var(--font-display)'
        },
        bannerTitle: {
            fontSize: '3.5rem',
            fontWeight: '800',
            margin: 0,
            letterSpacing: '-0.03em',
            fontFamily: 'var(--font-display)',
            lineHeight: 1.1,
            color: 'var(--theme-text-primary)'
        },
        bannerSubtitle: {
            fontSize: '1.1rem',
            color: 'var(--glass-text-secondary)',
            fontWeight: '500',
            maxWidth: '500px',
            marginTop: '8px'
        },
        filterCard: {
            backgroundColor: 'var(--glass-surface)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '12px', // Tight horizontal panel
            border: '1px solid var(--glass-border)',
            marginBottom: '32px',
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            alignItems: 'center',
        },
        searchWrapper: {
            position: 'relative',
            flex: '2',
            minWidth: '350px'
        },
        searchInput: {
            width: '100%',
            padding: '12px 16px 12px 56px',
            borderRadius: '12px',
            border: '1px solid var(--theme-border)',
            backgroundColor: 'var(--theme-bg-subtle)',
            fontSize: '0.9rem',
            color: 'var(--theme-text-primary)',
            outline: 'none',
            transition: 'all 0.3s ease',
            fontWeight: '600',
            fontFamily: 'var(--font-body)'
        },
        select: {
            padding: '12px 24px',
            borderRadius: '12px',
            border: '1px solid var(--glass-border)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            fontSize: '0.9rem',
            color: 'white',
            outline: 'none',
            cursor: 'pointer',
            minWidth: '220px',
            transition: 'all 0.3s ease',
            fontWeight: '700',
            appearance: 'none',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%3C3B82F6\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 16px center',
            backgroundSize: '16px',
            fontFamily: 'var(--font-body)'
        },
        tableWrapper: {
            backgroundColor: 'var(--glass-surface)',
            backdropFilter: 'blur(var(--glass-blur))',
            borderRadius: '24px',
            border: '1px solid var(--glass-border)',
            overflow: 'hidden',
        },
        th: {
            padding: '20px 24px',
            color: 'var(--glass-text-secondary)',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            fontWeight: '800',
            letterSpacing: '0.08em',
            borderBottom: '1px solid var(--glass-border)',
            backgroundColor: 'rgba(255, 255, 255, 0.01)',
            fontFamily: 'var(--font-display)'
        },
        td: {
            padding: '20px 24px',
            borderBottom: '1px solid var(--glass-border)',
            verticalAlign: 'middle',
            fontSize: '0.95rem',
            color: 'var(--theme-text-primary)'
        },
        statusBadge: (status) => {
            let color, glow;
            switch (status) {
                case 'Shortlisted':
                    color = '#3B82F6'; // Sapphire
                    glow = 'rgba(59, 130, 246, 0.15)';
                    break;
                case 'Rejected':
                    color = '#EF4444'; // Crimson
                    glow = 'rgba(239, 68, 68, 0.15)';
                    break;
                case 'Accepted':
                    color = '#10B981'; // Emerald
                    glow = 'rgba(16, 185, 129, 0.15)';
                    break;
                default: // Pending
                    color = '#F59E0B'; // Amber/Gold
                    glow = 'rgba(245, 158, 11, 0.15)';
            }
            return (
                <span className="glass-badge-pulse" style={{
                    backgroundColor: glow,
                    color: color,
                    border: `1px solid ${color}33`,
                    boxShadow: `0 0 12px ${color}11`
                }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }} />
                    {status}
                </span>
            );
        },
        actionBtn: (type) => ({
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            border: '1px solid var(--glass-border)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            backgroundColor: type === 'details' ? 'rgba(59, 130, 246, 0.1)' : (type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'),
            color: type === 'details' ? '#60A5FA' : (type === 'success' ? '#34D399' : '#F87171')
        }),
        emptyState: {
            textAlign: 'center',
            padding: '120px 40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        statLabel: {
            fontSize: '0.7rem',
            fontWeight: '800',
            color: 'var(--glass-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '4px'
        },
        statValue: {
            fontSize: '1.4rem',
            fontWeight: '900',
            color: 'var(--theme-text-primary)',
            fontFamily: 'var(--font-display)',
            textShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }
    };

    return (
        <div className="glass-main">
            <div style={styles.container}>
                {/* Modals */}
                <CandidateModal
                    isOpen={!!selectedApp}
                    onClose={() => setSelectedApp(null)}
                    candidate={selectedApp}
                    onShortlist={(id, status = 'Shortlisted') => updateStatus(id, status)}
                    onReject={(id) => triggerAction(id, 'Rejected')}
                />
                <ConfirmationModal
                    {...confirmModal}
                    onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                />

                {/* Recruitment Operations Hero */}
                <header style={styles.headerBanner} className="glass-reveal">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
                        <div>
                            <span style={styles.bannerOverline}>Recruitment Operations</span>
                            <h1 style={styles.bannerTitle}>
                                Applications <span className="text-gradient-sapphire">Intelligence.</span>
                            </h1>
                            <p style={styles.bannerSubtitle}>
                                Track, evaluate, and manage candidate pipelines in real time with high-density precision.
                            </p>
                        </div>

                        {/* Inventory Quick Stats */}
                        <div style={{ display: 'flex', gap: '32px' }}>
                            <div className="glass-panel" style={{
                                padding: '16px 24px',
                                position: 'relative',
                                overflow: 'hidden',
                                backdropFilter: 'blur(20px)',
                                background: 'linear-gradient(135deg, var(--theme-card), rgba(255, 255, 255, 0.02))',
                                boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.1), var(--theme-shadow)',
                                border: '1px solid var(--theme-border-bright)'
                            }}>
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <div style={styles.statLabel}>Global Inventory</div>
                                    <div style={styles.statValue}>{serverApps.length}</div>
                                </div>
                                {/* Gloss Reflection */}
                                <div style={{
                                    position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
                                    background: 'radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%)',
                                    pointerEvents: 'none', zIndex: 0
                                }} />
                            </div>
                            <div className="glass-panel" style={{
                                padding: '16px 24px',
                                position: 'relative',
                                overflow: 'hidden',
                                backdropFilter: 'blur(20px)',
                                background: 'linear-gradient(135deg, var(--theme-card), rgba(255, 255, 255, 0.02))',
                                boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.1), var(--theme-shadow)',
                                border: '1px solid var(--theme-border-bright)'
                            }}>
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <div style={styles.statLabel}>Active Pipeline</div>
                                    <div style={styles.statValue}>{serverApps.filter(a => a.status === 'Shortlisted').length}</div>
                                </div>
                                {/* Gloss Reflection */}
                                <div style={{
                                    position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
                                    background: 'radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%)',
                                    pointerEvents: 'none', zIndex: 0
                                }} />
                            </div>
                        </div>
                    </div>

                    {/* Background Glow */}
                    <div style={{
                        position: 'absolute', bottom: '-80px', right: '-80px', width: '250px', height: '250px',
                        background: 'radial-gradient(circle, var(--glass-accent) 0%, transparent 70%)',
                        opacity: 0.15, filter: 'blur(50px)', pointerEvents: 'none'
                    }} />
                </header>

                {/* Glass Filter Bar */}
                <div style={{ ...styles.filterCard, animationDelay: '0.1s' }} className="glass-reveal">
                    <div style={styles.searchWrapper}>
                        <Search size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--glass-accent-light)' }} />
                        <input
                            style={styles.searchInput}
                            placeholder="SEARCH CANDIDATE PROTOCOL..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ position: 'relative' }}>
                            <select style={styles.select} value={jobFilter} onChange={(e) => setJobFilter(e.target.value)}>
                                {uniqueJobs.map(job => <option key={job} style={{ background: '#0F1217' }}>{job}</option>)}
                            </select>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <select style={styles.select} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <option style={{ background: '#0F1217' }}>All Status</option>
                                <option style={{ background: '#0F1217' }}>Pending</option>
                                <option style={{ background: '#0F1217' }}>Shortlisted</option>
                                <option style={{ background: '#0F1217' }}>Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Recruitment Intelligence Matrix */}
                <div style={{ ...styles.tableWrapper, animationDelay: '0.2s' }} className="glass-reveal">
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Candidate Profile</th>
                                    <th style={styles.th}>Position Matrix</th>
                                    <th style={styles.th}>CV Access</th>
                                    <th style={styles.th}>Initiation Date</th>
                                    <th style={styles.th}>Current Protocol</th>
                                    <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '60px', textAlign: 'center', color: 'var(--glass-text-muted)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                                                <RefreshCw size={24} className="spin-slow text-gradient-sapphire" />
                                                <span style={{ fontWeight: '700', letterSpacing: '0.1em' }}>LOADING DATA POINTS...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredApps.length > 0 ? (
                                    filteredApps.map((app, index) => {
                                        const candidateName = app.name || (app.JobSeeker ? `${app.JobSeeker.firstName || ''} ${app.JobSeeker.lastName || ''}`.trim() : '') || 'Unknown Node';
                                        const candidateEmail = app.email || app.JobSeeker?.email || 'N/A';
                                        const jobTitle = app.jobTitle || app.JobListing?.title || 'Unknown Position';

                                        return (
                                            <tr
                                                key={app.id}
                                                className="glass-row"
                                                style={{
                                                    animation: `glassEntrance 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards ${index * 60}ms`,
                                                    opacity: 0,
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                <td style={styles.td}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                                        <div className="glass-avatar-tile">
                                                            {candidateName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: '800', color: 'var(--theme-text-primary)', fontSize: '1rem', letterSpacing: '-0.01em' }}>{candidateName}</div>
                                                            <div style={{ fontSize: '0.8rem', color: 'var(--theme-text-muted)', fontWeight: '500' }}>{candidateEmail}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={styles.td}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: 'var(--theme-text-primary)' }}>
                                                        <Briefcase size={16} className="text-gradient-sapphire" />
                                                        {jobTitle}
                                                    </div>
                                                </td>
                                                <td style={styles.td}>
                                                    <button
                                                        className="btn-scale"
                                                        style={{ background: 'var(--theme-bg-subtle)', border: '1px solid var(--theme-border)', color: 'var(--theme-text-primary)', padding: '8px 16px', borderRadius: '10px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', letterSpacing: '0.05em' }}
                                                        onClick={() => {
                                                            const cvUrl = app.CV?.file_url || app.CV?.platform_data_url;
                                                            if (cvUrl) window.open(cvUrl, '_blank');
                                                            else alert('CV data mismatch error.');
                                                        }}
                                                    >
                                                        <FileText size={14} className="text-gradient-sapphire" /> VIEW CV
                                                    </button>
                                                </td>
                                                <td style={{ ...styles.td, color: 'var(--glass-text-secondary)', fontWeight: '700', fontSize: '0.85rem' }}>
                                                    {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : app.appliedDate}
                                                </td>
                                                <td style={styles.td}>
                                                    {styles.statusBadge(app.status)}
                                                </td>
                                                <td style={styles.td}>
                                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                                        <button
                                                            className="btn-scale"
                                                            style={styles.actionBtn('details')}
                                                            title="View Details"
                                                            onClick={() => {
                                                                const formattedApp = {
                                                                    ...app,
                                                                    name: candidateName,
                                                                    email: candidateEmail,
                                                                    jobTitle: jobTitle,
                                                                    appliedDate: app.applied_at ? new Date(app.applied_at).toLocaleDateString() : app.appliedDate,
                                                                    skills: app.JobSeeker?.skills || app.skills || [],
                                                                    education: app.JobSeeker?.education || app.education || 'N/A',
                                                                    about: app.JobSeeker?.summary || app.about || '',
                                                                    phone: app.JobSeeker?.phone || app.phone || '',
                                                                    location: app.JobSeeker?.location || app.location || '',
                                                                    coverLetter: app.cover_letter || app.coverLetter || 'No cover letter provided.'
                                                                };
                                                                setSelectedApp(formattedApp);
                                                            }}
                                                        >
                                                            <Eye size={18} />
                                                        </button>

                                                        {app.status !== 'Shortlisted' && (
                                                            <button
                                                                className="btn-scale"
                                                                style={styles.actionBtn('success')}
                                                                title="Shortlist"
                                                                onClick={() => updateStatus(app.id, 'Shortlisted')}
                                                            >
                                                                <ShieldCheck size={18} />
                                                            </button>
                                                        )}

                                                        {app.status !== 'Rejected' && (
                                                            <button
                                                                className="btn-scale"
                                                                style={styles.actionBtn('danger')}
                                                                title="Terminate"
                                                                onClick={() => triggerAction(app.id, 'Rejected')}
                                                            >
                                                                <XCircle size={18} />
                                                            </button>
                                                        )}

                                                        {app.status !== 'Pending' && (
                                                            <button
                                                                className="btn-scale"
                                                                style={styles.actionBtn('details')}
                                                                title="Reset Protocol"
                                                                onClick={() => updateStatus(app.id, 'Pending')}
                                                            >
                                                                <RefreshCw size={18} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6">
                                            <div style={styles.emptyState}>
                                                <div className="glass-panel" style={{ width: '120px', height: '120px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
                                                    <Inbox size={60} color="var(--theme-text-muted)" />
                                                </div>
                                                <h3 style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--theme-text-primary)', marginBottom: '16px', letterSpacing: '-0.02em' }}>No Data Nodes Found</h3>
                                                <p style={{ maxWidth: '400px', color: 'var(--theme-text-secondary)', lineHeight: '1.7', fontSize: '1.05rem' }}>
                                                    The recruitment matrix is currently empty for the selected filters. Refine your query parameters.
                                                </p>
                                                <button
                                                    onClick={() => { setSearchQuery(''); setJobFilter('All Jobs'); setStatusFilter('All Status'); }}
                                                    style={{ marginTop: '32px', padding: '14px 32px', background: 'var(--glass-accent)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', fontFamily: 'var(--font-display)' }}
                                                    className="btn-scale"
                                                >
                                                    RESET FILTERS
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .spin-slow { animation: spin 4s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                
                .glass-row:hover {
                    background-color: rgba(255, 255, 255, 0.02) !important;
                    transform: translateX(4px);
                }
                
                select:focus, input:focus {
                    border-color: var(--glass-accent-light) !important;
                    box-shadow: 0 0 0 1px var(--glass-accent-light) !important;
                }

                .btn-scale { transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                .btn-scale:hover { transform: scale(1.08); }
                .btn-scale:active { transform: scale(0.92); }
            `}</style>
        </div>
    );
};

export default Applications;
