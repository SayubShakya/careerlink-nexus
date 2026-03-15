import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Briefcase,
    Users,
    TrendingUp,
    CheckCircle2,
    Target,
    LayoutDashboard,
    Clock,
    PlusCircle,
    ArrowUpRight,
    Zap,
    ShieldCheck,
    Layers
} from 'lucide-react';
import { ROUTES } from '../../routes/routes';
import { useGetEmployerStats, useGetEmployerApplications } from '@/hooks/api/employer/useEmployer';

// Design System
import '@/styles/ProfessionalGlass.css';

// --- Animated Counter Hook-like Component ---
const GlassCounter = ({ value }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = parseInt(value) || 0;
        if (start === end) {
            setCount(end);
            return;
        }
        let totalDuration = 1000;
        let increment = Math.ceil(end / (totalDuration / 16));
        let timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, 16);
        return () => clearInterval(timer);
    }, [value]);

    return <span className="glass-number">{count}</span>;
};

const StatCard = ({ label, value, icon, index }) => (
    <div
        className="glass-panel"
        style={{
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            animationDelay: `${index * 0.1}s`,
            position: 'relative',
            overflow: 'hidden',
        }}
    >
        {/* Deep Gloss Gradient Reflection */}
        <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle at center, rgba(96, 165, 250, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(63, 81, 181, 0.2), rgba(96, 165, 250, 0.05))',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--glass-accent-light)',
                boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.05), 0 4px 12px rgba(0, 0, 0, 0.2)'
            }}>
                {icon}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--glass-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                {label}
            </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, marginTop: '8px' }}>
            <div style={{
                fontSize: '3.5rem',
                fontWeight: '800',
                color: 'var(--glass-text-primary)',
                lineHeight: '1',
                textShadow: '0 4px 16px rgba(0,0,0,0.4)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.03em'
            }}>
                <GlassCounter value={value} />
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--glass-accent-light)', fontWeight: '600', marginTop: '12px', letterSpacing: '0.05em', opacity: 0.8 }}>
                Total {label}
            </div>
        </div>
    </div>
);

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

    const statsConfig = [
        { label: 'Total Jobs', value: stats.totalJobs, icon: <Briefcase size={22} /> },
        { label: 'Active Jobs', value: stats.activeJobs, icon: <Target size={22} /> },
        { label: 'Applications', value: stats.totalApplications, icon: <Users size={22} /> },
        { label: 'Shortlisted', value: stats.shortlisted, icon: <CheckCircle2 size={22} /> },
    ];

    return (
        <div className="glass-main" style={{ position: 'relative' }}>
            {/* Ambient Background Glows */}
            <div className="glow-effect" style={{ top: '10%', left: '5%', background: '#60A5FA', width: '300px', height: '300px' }} />
            <div className="glow-effect" style={{ top: '40%', right: '5%', background: '#3F51B5', width: '400px', height: '400px', opacity: 0.2 }} />

            <div className="glass-container glass-reveal">

                {/* Authority Header */}
                <header style={{ marginBottom: '56px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={{ animationDelay: '0.05s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <Layers size={18} className="text-gradient-sapphire" />
                            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--glass-text-muted)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                                Employer Dashboard
                            </span>
                        </div>
                        <h1 style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--theme-text-primary)', letterSpacing: '-0.03em', lineHeight: '0.95' }}>
                            Recruitment <br />
                            <span className="text-gradient-sapphire">Dashboard</span>
                        </h1>
                    </div>
                    <div style={{ textAlign: 'right', animationDelay: '0.1s' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--glass-text-secondary)', fontWeight: '600' }}>System Status</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end', marginTop: '6px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 12px rgba(16, 185, 129, 0.5)' }} />
                            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--theme-text-primary)', textTransform: 'uppercase' }}>Secure / Active</span>
                        </div>
                    </div>
                </header>

                {/* Staggered Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '60px' }}>
                    {statsConfig.map((item, idx) => (
                        <StatCard key={idx} index={idx} {...item} />
                    ))}
                </div>

                {/* Content Section */}
                <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '32px', alignItems: 'start' }}>

                    {/* Glass Data Feed */}
                    <div className="glass-panel" style={{ padding: '0' }}>
                        <div style={{ padding: '32px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--theme-text-primary)' }}>Recent Applications</h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--theme-text-muted)', marginTop: '4px', fontWeight: '500' }}>Recent candidate applications.</p>
                            </div>
                            <button
                                onClick={() => navigate(ROUTES.EMPLOYER_APPLICATIONS)}
                                className="glass-btn-secondary"
                                style={{
                                    background: 'var(--theme-bg-subtle)',
                                    border: '1px solid var(--theme-border)',
                                    color: 'var(--theme-text-primary)',
                                    padding: '10px 20px',
                                    borderRadius: '12px',
                                    fontSize: '0.85rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                View All <ArrowUpRight size={16} />
                            </button>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table className="glass-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr>
                                        <th>Candidate Name</th>
                                        <th>Job Title</th>
                                        <th>Date Applied</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr><td colSpan="4" style={{ padding: '60px', textAlign: 'center', color: 'var(--glass-text-muted)' }}>Loading applications...</td></tr>
                                    ) : recentApplications.length > 0 ? (
                                        recentApplications.map((app) => (
                                            <tr key={app.id} className="glass-row" style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #3F51B5, #1A237E)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: '800' }}>
                                                            {(app.JobSeeker?.fullname?.[0] || app.JobSeeker?.firstName?.[0] || app.name?.[0] || 'U').toUpperCase()}
                                                        </div>
                                                        <div style={{ fontWeight: '700', color: 'var(--theme-text-primary)' }}>
                                                            {app.JobSeeker?.fullname || (app.JobSeeker ? `${app.JobSeeker.firstName || ''} ${app.JobSeeker.lastName || ''}`.trim() : '') || app.name || 'Unknown Candidate'}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ fontWeight: '600' }}>{app.jobTitle || app.JobListing?.title}</td>
                                                <td style={{ fontWeight: '500' }}>{app.applied_at ? new Date(app.applied_at).toLocaleDateString() : 'Syncing'}</td>
                                                <td><StatusPill status={app.status} /></td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4" style={{ padding: '60px', textAlign: 'center', color: 'var(--glass-text-muted)' }}>No recent applications found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Industrial Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                        <div className="glass-panel" style={{ padding: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                <ShieldCheck size={20} className="text-gradient-sapphire" />
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'white' }}>Quick Actions</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <OperationButton label="Post a Job" icon={<PlusCircle size={20} />} primary onClick={() => navigate(ROUTES.JOB_MANAGEMENT)} />
                                <OperationButton label="View Applications" icon={<Users size={20} />} onClick={() => navigate(ROUTES.EMPLOYER_APPLICATIONS)} />
                                <OperationButton label="Manage Jobs" icon={<Briefcase size={20} />} onClick={() => navigate(ROUTES.JOB_MANAGEMENT)} />
                            </div>
                        </div>

                        {/* Analysis Insight */}
                        <div className="glass-panel" style={{ padding: '28px', background: 'linear-gradient(135deg, rgba(63, 81, 181, 0.08), transparent)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                                <TrendingUp size={18} className="text-gradient-sapphire" />
                                <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'white' }}>Hiring Overview</h4>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--glass-text-secondary)', lineHeight: '1.6', fontWeight: '500' }}>
                                You have <strong>{stats.activeJobs} active job{stats.activeJobs !== 1 ? 's' : ''}</strong> with <strong>{stats.totalApplications} total application{stats.totalApplications !== 1 ? 's' : ''}</strong>. {stats.shortlisted > 0 ? `${stats.shortlisted} candidate${stats.shortlisted !== 1 ? 's have' : ' has'} been shortlisted.` : 'Review incoming applications to build your shortlist.'}
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            <style>{`
                .glass-btn-secondary:hover { transform: translateY(-2px); background: rgba(255,255,255,0.06) !important; color: var(--glass-accent-light) !important; }
                .op-btn:hover { transform: translateX(8px); border-color: var(--glass-border-bright) !important; }
            `}</style>
        </div>
    );
};

const OperationButton = ({ label, icon, primary, onClick }) => (
    <button
        onClick={onClick}
        className="op-btn"
        style={{
            width: '100%',
            padding: '16px 20px',
            borderRadius: '16px',
            border: primary ? 'none' : '1px solid var(--glass-border)',
            background: primary ? 'linear-gradient(135deg, #3F51B5, #303F9F)' : 'rgba(255,255,255,0.02)',
            color: 'white',
            fontWeight: '700',
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: primary ? '0 10px 20px rgba(63, 81, 181, 0.2)' : 'none'
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {icon}
            {label}
        </div>
        <ArrowUpRight size={16} style={{ opacity: 0.5 }} />
    </button>
);

const StatusPill = ({ status }) => {
    const getStyles = () => {
        switch (status) {
            case 'Shortlisted': return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', border: 'rgba(59, 130, 246, 0.2)' };
            case 'Accepted': return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: 'rgba(16, 185, 129, 0.2)' };
            case 'Rejected': return { bg: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: 'rgba(239, 68, 68, 0.2)' };
            case 'Reviewed': return { bg: 'rgba(168, 85, 247, 0.1)', color: '#A855F7', border: 'rgba(168, 85, 247, 0.2)' };
            case 'Interview': return { bg: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', border: 'rgba(245, 158, 11, 0.2)' };
            default: return { bg: 'rgba(96, 165, 250, 0.1)', color: '#60A5FA', border: 'rgba(96, 165, 250, 0.2)' }; // Pending
        }
    };
    const s = getStyles();
    return (
        <span style={{
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.7rem',
            fontWeight: '800',
            backgroundColor: s.bg,
            color: s.color,
            border: `1px solid ${s.border}`,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
        }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.color }} />
            {status || 'Pending'}
        </span>
    );
};

export default EmployerDashboard;
