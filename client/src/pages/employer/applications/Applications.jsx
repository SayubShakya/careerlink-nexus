import React, { useState, useEffect } from 'react';
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

import api from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import Pagination from '@/components/ui/Pagination';

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
                        CANCEL
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
                        CONFIRM
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
                        {(candidate.name || '?').charAt(0)}
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
                            <span style={styles.label}>Email</span>
                            <div style={styles.value}>{candidate.email}</div>
                        </div>
                        <div className="glass-panel" style={{ padding: '24px' }}>
                            <span style={styles.label}>Phone Number</span>
                            <div style={styles.value}>{candidate.phone || 'Not added'}</div>
                        </div>
                        <div className="glass-panel" style={{ padding: '24px' }}>
                            <span style={styles.label}>Date Applied</span>
                            <div style={styles.value}>{candidate.appliedDate}</div>
                        </div>
                    </div>

                    <div style={styles.section}>
                        <h3 style={{ ...styles.label, fontSize: '0.85rem', color: 'var(--glass-accent-light)' }}>About them</h3>
                        <p style={{ color: 'var(--glass-text-secondary)', lineHeight: '1.8', fontSize: '1.1rem', fontWeight: '500', margin: 0 }}>
                            {candidate.about || "This person did not write any details."}
                        </p>
                    </div>

                    <div style={styles.section}>
                        <h3 style={{ ...styles.label, fontSize: '0.85rem', color: 'var(--glass-accent-light)' }}>Skills</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                            {(candidate.skills || []).length > 0 ? (candidate.skills || []).map((skill, i) => (
                                <span key={i} className="glass-badge-pulse" style={{ background: 'rgba(96, 165, 250, 0.1)', color: '#93C5FD', border: '1px solid rgba(96, 165, 250, 0.2)' }}>
                                    <Target size={14} /> {skill}
                                </span>
                            )) : (
                                <span style={{ color: 'var(--glass-text-muted)', fontStyle: 'italic' }}>No skills listed</span>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                        <div style={styles.section}>
                            <h3 style={{ ...styles.label, fontSize: '0.85rem', color: 'var(--glass-accent-light)' }}>Education</h3>
                            <div style={{ color: 'white', fontWeight: '600' }}>{candidate.education}</div>
                        </div>
                        <div style={styles.section}>
                            <h3 style={{ ...styles.label, fontSize: '0.85rem', color: 'var(--glass-accent-light)' }}>Cover Letter</h3>
                            <div style={{ color: 'var(--glass-text-secondary)', fontSize: '0.95rem', fontStyle: 'italic' }}>
                                "{(candidate.coverLetter || 'No cover letter provided.').substring(0, 150)}{(candidate.coverLetter || '').length > 150 ? '...' : ''}"
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div style={{ padding: '32px 50px', borderTop: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.01)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        {candidate.status !== 'Accepted' && (
                            <button
                                title="Finalize hiring"
                                className="btn-scale"
                                style={{ padding: '14px 32px', background: '#10B981', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-display)', boxShadow: '0 8px 20px -4px rgba(16, 185, 129, 0.4)' }}
                                onClick={() => { onAccept(candidate.id); onClose(); }}
                            >
                                <ShieldCheck size={20} /> HIRE CANDIDATE
                            </button>
                        )}
                        {candidate.status !== 'Shortlisted' && candidate.status !== 'Accepted' && (
                            <button
                                title="Add to shortlist"
                                className="btn-scale"
                                style={{ padding: '14px 32px', background: 'var(--glass-accent)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-display)' }}
                                onClick={() => { onShortlist(candidate.id); onClose(); }}
                            >
                                <Zap size={20} /> SHORTLIST
                            </button>
                        )}
                        {candidate.status !== 'Rejected' && (
                            <button
                                title="Reject this application"
                                className="btn-scale"
                                style={{ padding: '14px 32px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-display)' }}
                                onClick={() => { onReject(candidate.id); onClose(); }}
                            >
                                <XCircle size={20} /> REJECT
                            </button>
                        )}
                        
                        <button
                            title="Send Email"
                            className="btn-scale"
                            style={{ padding: '14px 32px', background: 'var(--theme-bg-subtle)', color: 'var(--theme-text-primary)', border: '1px solid var(--theme-border)', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-display)' }}
                            onClick={() => window.location.href = `mailto:${candidate.email}?subject=Regarding your application for ${candidate.jobTitle}`}
                        >
                            <Mail size={20} /> EMAIL
                        </button>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ background: 'transparent', border: 'none', color: 'var(--glass-text-secondary)', fontWeight: '700', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem' }}
                    >
                        CLOSE
                    </button>
                </div>
            </div>
        </div>
    );
};

import { useLocation } from 'react-router-dom';

const Applications = () => {
    // API Hooks
    const { data: serverApps = [], isLoading } = useGetEmployerApplications();
    const { mutate: updateAppStatus } = useUpdateApplicationStatus();
    const location = useLocation();
    
    const handleViewCV = async (cvId) => {
        if (!cvId) {
            alert('No CV data found for this candidate.');
            return;
        }
        try {
            const response = await api.get(`${API_ENDPOINTS.CV.DOWNLOAD(cvId)}?t=${Date.now()}`, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (err) {
            console.error('View failed:', err);
            alert('Failed to view CV. Please try again.');
        }
    };

    // UI State
    const [searchQuery, setSearchQuery] = useState('');
    const [jobFilter, setJobFilter] = useState(location.state?.filterJob || 'All Jobs');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [selectedApp, setSelectedApp] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, onConfirm: null, title: '', message: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

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

    const totalPages = Math.ceil(filteredApps.length / ITEMS_PER_PAGE);
    const paginatedApps = filteredApps.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, jobFilter, statusFilter]);

    const triggerAction = (id, newStatus) => {
        const app = serverApps.find(a => a.id === id);
        const name = app.name || app.JobSeeker?.fullname || 'the candidate';

        if (newStatus === 'Rejected') {
            setConfirmModal({
                isOpen: true,
                title: 'Reject Application?',
                message: `Are you sure you want to reject ${name}? They will be notified of your decision.`,
                onConfirm: () => updateStatus(id, newStatus)
            });
        } else if (newStatus === 'Accepted') {
            setConfirmModal({
                isOpen: true,
                title: 'Confirm Hiring?',
                message: `Are you sure you want to hire ${name}? This will mark their application as successful.`,
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
            fontSize: '0.65rem',
            fontWeight: '900',
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontFamily: 'var(--font-display)',
            marginBottom: '8px',
            display: 'block'
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
            fontWeight: '600',
            maxWidth: '550px',
            marginTop: '12px',
            lineHeight: '1.6'
        },
        refreshBtn: {
            padding: '10px 20px',
            borderRadius: '12px',
            background: 'var(--glass-surface)',
            border: '1px solid var(--glass-border-bright)',
            color: 'var(--theme-text-primary)',
            fontSize: '0.8rem',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        },
        filterCard: {
            backgroundColor: 'var(--glass-surface)',
            backdropFilter: 'blur(12px)',
            borderRadius: '24px',
            padding: '16px 20px',
            border: '1px solid var(--glass-border)',
            marginBottom: '32px',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            alignItems: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)'
        },
        searchWrapper: {
            position: 'relative',
            flex: '2',
            minWidth: '350px'
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
        select: {
            padding: '14px 44px 14px 20px',
            borderRadius: '16px',
            border: '1px solid var(--theme-border)',
            backgroundColor: 'var(--theme-bg-subtle)',
            fontSize: '0.9rem',
            color: 'var(--theme-text-primary)',
            outline: 'none',
            cursor: 'pointer',
            minWidth: '200px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            fontWeight: '700',
            appearance: 'none',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%3C3B82F6\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 16px center',
            backgroundSize: '16px',
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.01em'
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
                    {status === 'Shortlisted' ? 'SHORTLIST' : (status === 'Accepted' ? 'HIRED' : (status === 'Pending' ? 'PENDING' : status.toUpperCase()))}
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
            backgroundColor: type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: type === 'success' ? '#34D399' : '#F87171',
            textDecoration: 'none'
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
        <div className="glass-main" style={{ position: 'relative' }}>
            {/* Ambient Background Glows */}
            <div className="glow-effect" style={{ top: '5%', left: '-5%', background: '#818CF8', width: '400px', height: '400px', opacity: 0.15 }} />
            <div className="glow-effect" style={{ top: '60%', right: '0%', background: '#3B82F6', width: '500px', height: '500px', opacity: 0.1 }} />

            <div style={styles.container}>
                {/* Modals */}
                <CandidateModal
                    isOpen={!!selectedApp}
                    onClose={() => setSelectedApp(null)}
                    candidate={selectedApp}
                    onShortlist={(id, status = 'Shortlisted') => updateStatus(id, status)}
                    onReject={(id) => triggerAction(id, 'Rejected')}
                    onAccept={(id) => triggerAction(id, 'Accepted')}
                />
                <ConfirmationModal
                    {...confirmModal}
                    onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                />

                {/* Recruitment Operations Hero */}
                <header style={styles.headerBanner} className="glass-reveal">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
                        <div style={{ flex: 1 }}>
                            <span style={styles.bannerOverline}>APPS</span>
                            <h1 style={{
                                fontSize: '4rem',
                                fontWeight: '900',
                                color: '#1E293B', // Dark bold color
                                margin: 0,
                                letterSpacing: '-0.04em',
                                fontFamily: 'var(--font-display)',
                                lineHeight: 1
                            }}>
                                Check <span className="text-gradient-sapphire">Candidates.</span>
                            </h1>
                            <p style={styles.bannerSubtitle}>
                                See who has applied for your jobs here.
                            </p>
                        </div>

                        {/* Inventory Quick Stats */}
                        {/* Inventory Quick Stats */}
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                            <div className="glass-panel" style={{
                                padding: '24px 32px',
                                background: 'rgba(255, 255, 255, 0.7)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.8)',
                                borderRadius: '24px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                                minWidth: '180px'
                            }}>
                                <div style={{ fontSize: '0.65rem', fontWeight: '900', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                                    TOTAL APPLICATIONS
                                </div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0F172A', lineHeight: 1 }}>
                                    {serverApps.length}
                                </div>
                            </div>
                            <div className="glass-panel" style={{
                                padding: '24px 32px',
                                background: 'rgba(255, 255, 255, 0.7)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.8)',
                                borderRadius: '24px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                                minWidth: '180px',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{ fontSize: '0.65rem', fontWeight: '900', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                                    SHORTLISTED
                                </div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0F172A', lineHeight: 1 }}>
                                    {serverApps.filter(a => a.status === 'Shortlisted').length}
                                </div>
                                {/* Subtle Right Glow */}
                                <div style={{
                                    position: 'absolute', top: 0, right: 0, bottom: 0, width: '40%',
                                    background: 'linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.1))',
                                    pointerEvents: 'none'
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
                            placeholder="FIND SOMEONE..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ position: 'relative' }}>
                            <select style={styles.select} value={jobFilter} onChange={(e) => setJobFilter(e.target.value)}>
                                {uniqueJobs.map(job => (
                                    <option key={job} style={{ background: '#0F1217', color: 'white' }}>
                                        {job}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <select style={styles.select} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <option style={{ background: '#0F1217', color: 'white' }}>All Status</option>
                                <option style={{ background: '#0F1217', color: 'white' }} value="Pending">Pending</option>
                                <option style={{ background: '#0F1217', color: 'white' }} value="Shortlisted">Shortlisted</option>
                                <option style={{ background: '#0F1217', color: 'white' }} value="Accepted">Hired</option>
                                <option style={{ background: '#0F1217', color: 'white' }} value="Rejected">Rejected</option>
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
                                    <th style={styles.th}>Candidate</th>
                                    <th style={styles.th}>Job Title</th>
                                    <th style={styles.th}>Resume</th>
                                    <th style={styles.th}>Date Applied</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '60px', textAlign: 'center', color: 'var(--glass-text-muted)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                                                <RefreshCw size={24} className="spin-slow text-gradient-sapphire" />
                                                <span style={{ fontWeight: '700', letterSpacing: '0.1em' }}>LOADING APPLICATIONS...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredApps.length > 0 ? (
                                    paginatedApps.map((app, index) => {
                                        const candidateName = app.JobSeeker?.fullname || app.name || (app.JobSeeker ? `${app.JobSeeker.firstName || ''} ${app.JobSeeker.lastName || ''}`.trim() : '') || 'Unknown Candidate';
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
                                                        <div 
                                                            className="glass-avatar-tile" 
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => {
                                                                const formattedApp = {
                                                                    ...app,
                                                                    name: candidateName,
                                                                    email: candidateEmail,
                                                                    jobTitle: jobTitle,
                                                                    appliedDate: app.applied_at ? new Date(app.applied_at).toLocaleDateString() : app.appliedDate,
                                                                    skills: (app.CV?.content?.skills && Array.isArray(app.CV.content.skills)) ? app.CV.content.skills.map(s => s.name || s) : [],
                                                                    education: (app.CV?.content?.education && Array.isArray(app.CV.content.education)) ? app.CV.content.education.map(e => `${e.degree || ''} at ${e.school || ''}`).join(', ') : 'N/A',
                                                                    about: app.JobSeeker?.summary || app.about || '',
                                                                    phone: app.JobSeeker?.phone || app.phone || '',
                                                                    location: app.JobSeeker?.location || app.location || '',
                                                                    coverLetter: app.cover_letter || app.coverLetter || 'No cover letter provided.'
                                                                };
                                                                setSelectedApp(formattedApp);
                                                            }}
                                                        >
                                                            {candidateName.charAt(0)}
                                                        </div>
                                                        <div 
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => {
                                                                const formattedApp = {
                                                                    ...app,
                                                                    name: candidateName,
                                                                    email: candidateEmail,
                                                                    jobTitle: jobTitle,
                                                                    appliedDate: app.applied_at ? new Date(app.applied_at).toLocaleDateString() : app.appliedDate,
                                                                    skills: (app.CV?.content?.skills && Array.isArray(app.CV.content.skills)) ? app.CV.content.skills.map(s => s.name || s) : [],
                                                                    education: (app.CV?.content?.education && Array.isArray(app.CV.content.education)) ? app.CV.content.education.map(e => `${e.degree || ''} at ${e.school || ''}`).join(', ') : 'N/A',
                                                                    about: app.JobSeeker?.summary || app.about || '',
                                                                    phone: app.JobSeeker?.phone || app.phone || '',
                                                                    location: app.JobSeeker?.location || app.location || '',
                                                                    coverLetter: app.cover_letter || app.coverLetter || 'No cover letter provided.'
                                                                };
                                                                setSelectedApp(formattedApp);
                                                            }}
                                                        >
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
                                                            const cvId = app.cv_id || app.CV?.id;
                                                            handleViewCV(cvId);
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
                                                         {/* Removed Eye icon button per request - details now accessible via candidate name */}

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
                                                                title="Reject Application"
                                                                onClick={() => triggerAction(app.id, 'Rejected')}
                                                            >
                                                                <XCircle size={18} />
                                                            </button>
                                                        )}

                                                        {app.status !== 'Accepted' && app.status !== 'Rejected' && (
                                                            <button
                                                                className="btn-scale"
                                                                style={{
                                                                    ...styles.actionBtn('success'),
                                                                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                                                                    color: '#10B981',
                                                                    border: '1px solid rgba(16, 185, 129, 0.3)'
                                                                }}
                                                                title="Accept & Hire"
                                                                onClick={() => updateStatus(app.id, 'Accepted')}
                                                            >
                                                                <CheckCircle2 size={18} />
                                                            </button>
                                                        )}

                                                        {app.status !== 'Pending' && (
                                                            <button
                                                                className="btn-scale"
                                                                style={styles.actionBtn('details')}
                                                                title="Reset Status"
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
                                                <h3 style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--theme-text-primary)', marginBottom: '16px', letterSpacing: '-0.02em' }}>No Applications Found</h3>
                                                <p style={{ maxWidth: '400px', color: 'var(--theme-text-secondary)', lineHeight: '1.7', fontSize: '1.05rem' }}>
                                                    No applications found with the selected filters.
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
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            totalItems={filteredApps.length}
                            itemsPerPage={ITEMS_PER_PAGE}
                        />
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
                    background-color: var(--theme-bg-subtle) !important;
                    border-color: var(--glass-accent-light) !important;
                    box-shadow: 0 0 0 4px var(--glass-accent-glow) !important;
                    transform: translateY(-1px);
                }

                select:hover, input:hover {
                    border-color: rgba(62, 97, 255, 0.3);
                    background-color: rgba(255, 255, 255, 0.05);
                }

                .glass-avatar-tile:hover {
                    transform: scale(1.1) rotate(5deg);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
                    border-color: var(--glass-accent-light) !important;
                }

                .btn-scale { transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                .btn-scale:hover { transform: scale(1.08); filter: brightness(1.1); }
                .btn-scale:active { transform: scale(0.92); }
            `}</style>
        </div>
    );
};

export default Applications;
