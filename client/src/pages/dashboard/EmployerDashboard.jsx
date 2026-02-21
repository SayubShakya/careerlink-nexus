import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Briefcase,
    Users,
    TrendingUp,
    CheckCircle2,
    PlusCircle,
    Eye,
    Target,
    LayoutDashboard,
    ArrowRight,
    Clock,
    AlertCircle,
    XCircle,
    MousePointer2
} from 'lucide-react';
import { ROUTES } from '../../routes/routes';

import { useGetEmployerStats, useGetEmployerApplications } from '@/hooks/api/employer/useEmployer';

const EmployerDashboard = () => {
    const navigate = useNavigate();

    // --- API Data ---
    const { data: serverStats, isLoading: isStatsLoading } = useGetEmployerStats();
    const { data: applications = [], isLoading: isAppsLoading } = useGetEmployerApplications();

    const stats = serverStats || {
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        shortlisted: 0
    };

    const recentApplications = [...applications]
        .sort((a, b) => new Date(b.applied_at || 0) - new Date(a.applied_at || 0))
        .slice(0, 5);

    const isLoading = isStatsLoading || isAppsLoading;

    const styles = {
        container: {
            padding: '40px 20px',
            maxWidth: '1240px',
            margin: '0 auto',
            fontFamily: 'var(--font-body)',
            animation: 'fadeIn 0.5s ease-out'
        },
        headerBanner: {
            background: 'linear-gradient(135deg, var(--color-brand-primary) 0%, #1a2a5e 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '50px',
            color: 'white',
            marginBottom: '40px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(5, 10, 26, 0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        bannerContent: {
            position: 'relative',
            zIndex: 2
        },
        bannerTitle: {
            fontSize: '2.5rem',
            fontWeight: '800',
            marginBottom: '10px',
            letterSpacing: '-0.02em'
        },
        bannerSubtitle: {
            fontSize: '1.2rem',
            opacity: 0.9,
            maxWidth: '500px'
        },
        bannerImage: {
            position: 'absolute',
            right: '40px',
            top: '50%',
            transform: 'translateY(-50%)',
            opacity: 0.2,
            zIndex: 1
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
        },
        statCard: {
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-premium)',
            border: '1px solid var(--border-subtle)',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
        },
        iconWrapper: (color) => ({
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            backgroundColor: `${color}10`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }),
        statNumber: {
            fontSize: '2rem',
            fontWeight: '900',
            color: 'var(--text-main)',
            lineHeight: 1
        },
        statLabel: {
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
        },
        sectionLayout: {
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '30px',
            alignItems: 'start'
        },
        card: {
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: '30px',
            boxShadow: 'var(--shadow-premium)',
            border: '1px solid var(--border-subtle)'
        },
        cardHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '25px'
        },
        cardTitle: {
            fontSize: '1.4rem',
            fontWeight: '800',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        viewAllBtn: {
            fontSize: '0.9rem',
            fontWeight: '700',
            color: 'var(--color-brand-accent)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
        },
        statusBadge: (status) => {
            let bg, color;
            switch (status) {
                case 'Shortlisted': bg = '#ECFDF5'; color = '#059669'; break;
                case 'Rejected': bg = '#FEF2F2'; color = '#DC2626'; break;
                default: bg = '#FFFBEB'; color = '#D97706'; // Pending
            }
            return (
                <span style={{
                    padding: '6px 14px', borderRadius: '25px', fontSize: '0.75rem', fontWeight: '800',
                    backgroundColor: bg, color: color, display: 'inline-flex', alignItems: 'center'
                }}>
                    {status}
                </span>
            );
        },
        actionBtn: {
            width: '100%',
            padding: '16px',
            borderRadius: '15px',
            border: '1px solid var(--border-subtle)',
            background: 'white',
            color: 'var(--text-main)',
            fontWeight: '700',
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.2s'
        },
        noJobsCard: {
            textAlign: 'center',
            padding: '60px 40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
        }
    };

    const statsConfig = [
        { label: 'Total Jobs Posted', value: stats.totalJobs, icon: <Briefcase size={24} />, color: '#4F46E5' },
        { label: 'Active Jobs', value: stats.activeJobs, icon: <Target size={24} />, color: '#059669' },
        { label: 'Total Applications', value: stats.totalApplications, icon: <Users size={24} />, color: '#3B82F6' },
        { label: 'Shortlisted', value: stats.shortlisted, icon: <CheckCircle2 size={24} />, color: '#8B5CF6' },
    ];

    return (
        <div style={styles.container}>
            {/* Header Section */}
            <header style={styles.headerBanner}>
                <div style={styles.bannerContent}>
                    <h1 style={styles.bannerTitle}>Employer Suite</h1>
                    <p style={styles.bannerSubtitle}>Monitor your hiring velocity and manage incoming talent effortlessly.</p>
                </div>
                <div style={styles.bannerImage}>
                    <LayoutDashboard size={120} />
                </div>
                <div style={{ position: 'absolute', right: '-50px', top: '-50px', width: '250px', height: '250px', background: 'white', borderRadius: '50%', opacity: 0.05 }} />
            </header>

            {/* Statistics Overview */}
            <div style={styles.statsGrid}>
                {statsConfig.map((item, index) => (
                    <div
                        key={index}
                        className="btn-scale"
                        style={{ ...styles.statCard, animation: `fadeInUp 0.5s ease-out forwards ${index * 0.1}s`, opacity: 0 }}
                    >
                        <div style={styles.iconWrapper(item.color)}>
                            {item.icon}
                        </div>
                        <div>
                            <div style={styles.statNumber}>{item.value}</div>
                            <div style={styles.statLabel}>{item.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Layout */}
            <div style={styles.sectionLayout}>
                {/* Recent Applications Table */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h2 style={styles.cardTitle}>
                            <Clock size={22} color="var(--color-brand-accent)" /> Recent Applications
                        </h2>
                        <button style={styles.viewAllBtn} onClick={() => navigate(ROUTES.EMPLOYER_APPLICATIONS)}>
                            View All <ArrowRight size={16} />
                        </button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #F3F4F6' }}>
                                    <th style={{ padding: '15px 0', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '800' }}>Candidate</th>
                                    <th style={{ padding: '15px 0', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '800' }}>Position</th>
                                    <th style={{ padding: '15px 0', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '800' }}>Applied on</th>
                                    <th style={{ padding: '15px 0', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '800' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</td>
                                    </tr>
                                ) : recentApplications.length > 0 ? (
                                    recentApplications.map((app) => (
                                        <tr key={app.id} style={{ borderBottom: '1px solid #F9FAFB' }} className="table-row">
                                            <td style={{ padding: '18px 0', fontWeight: '700', color: 'var(--text-main)' }}>
                                                {app.name || (app.JobSeeker ? `${app.JobSeeker.firstName || ''} ${app.JobSeeker.lastName || ''}`.trim() : '') || 'Unknown'}
                                            </td>
                                            <td style={{ padding: '18px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                {app.jobTitle || app.JobListing?.title}
                                            </td>
                                            <td style={{ padding: '18px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : (app.date || 'N/A')}
                                            </td>
                                            <td style={{ padding: '18px 0' }}>{styles.statusBadge(app.status)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No recent applications</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={styles.card}>
                        <h2 style={{ ...styles.cardTitle, marginBottom: '20px' }}>
                            <TrendingUp size={22} color="var(--color-brand-accent)" /> Quick Actions
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button
                                style={{ ...styles.actionBtn, backgroundColor: 'var(--color-brand-primary)', color: 'white', border: 'none' }}
                                className="action-btn-hover"
                                onClick={() => navigate(ROUTES.JOB_MANAGEMENT)}
                            >
                                <PlusCircle size={20} /> Post New Job
                            </button>
                            <button
                                style={styles.actionBtn}
                                className="action-btn-hover"
                                onClick={() => navigate(ROUTES.EMPLOYER_APPLICATIONS)}
                            >
                                <Users size={20} /> View Applications
                            </button>
                            <button
                                style={styles.actionBtn}
                                className="action-btn-hover"
                                onClick={() => navigate(ROUTES.JOB_MANAGEMENT)}
                            >
                                <Briefcase size={20} /> Manage Jobs
                            </button>
                        </div>
                    </div>

                    {/* Hiring Tip Card */}
                    <div style={{ ...styles.card, background: '#EFF6FF', borderColor: '#DBEAFE' }}>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <AlertCircle size={24} color="#3B82F6" />
                            <div>
                                <h4 style={{ fontWeight: '800', color: '#1E40AF', marginBottom: '5px' }}>Pro Tip</h4>
                                <p style={{ fontSize: '0.85rem', color: '#3B82F6', lineHeight: '1.5' }}>
                                    Shortlisting candidates within 48 hours increases hiring success by 35%.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Empty State Example (Render conditionally where needed) */}
            {stats.totalJobs === 0 && (
                <div style={{ ...styles.card, ...styles.noJobsCard, marginTop: '40px' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                        <Briefcase size={40} color="#D1D5DB" />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>No Jobs Posted Yet</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Get started by creating your first job opportunity.</p>
                    <button
                        style={{ padding: '12px 24px', backgroundColor: 'var(--color-brand-primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}
                        onClick={() => navigate(ROUTES.JOB_MANAGEMENT)}
                    >
                        Post Your First Job
                    </button>
                </div>
            )}

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

                .table-row:hover { background-color: #FAFAFB; cursor: pointer; }
                
                .btn-scale:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.08); }
                
                .action-btn-hover:hover {
                    border-color: var(--color-brand-accent);
                    color: var(--color-brand-accent);
                    transform: translateX(5px);
                }
                
                .action-btn-hover:active { transform: translateX(0); }

                @media (max-width: 1024px) {
                    .sectionLayout { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default EmployerDashboard;
