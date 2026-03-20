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
    Layers,
    Shield
} from 'lucide-react';
import { ROUTES } from '@/routes/routes';
import { useGetEmployerStats, useGetEmployerApplications } from '@/hooks/api/employer/useEmployer';
import { useGetMe } from '@/hooks/api/auth/useGetMe';

// Design System
import '@/styles/ProfessionalGlass.css';

// --- Animated Counter Hook-like Component ---
const GlassCounter = ({ value, prefix = "" }) => {
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
        if (increment === 0) increment = 1;
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

    return <span className="glass-number">{prefix}{count.toLocaleString()}</span>;
};

const StatTrend = ({ value, label }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 8px',
        background: 'rgba(16, 185, 129, 0.1)',
        borderRadius: '20px',
        fontSize: '0.65rem',
        fontWeight: '800',
        color: '#10B981',
        border: '1px solid rgba(16, 185, 129, 0.15)',
        marginTop: '0'
    }}>
        <TrendingUp size={10} />
        {value} {label}
    </div>
);

const StatCard = ({ label, value, icon, index, trend }) => (
    <div
        className="glass-panel"
        style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px',
            animationDelay: `${index * 0.1}s`,
            position: 'relative',
        }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: 'var(--theme-bg-subtle)',
                border: '1px solid var(--theme-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--glass-accent-light)',
                flexShrink: 0,
            }}>
                {icon}
            </div>
            {trend && <StatTrend value={trend.val} label={trend.label} />}
        </div>

        <div style={{ paddingTop: '4px' }}>
            <div style={{
                fontSize: '2.4rem',
                fontWeight: '900',
                color: 'var(--theme-text-primary)',
                lineHeight: '1.1',
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.025em'
            }}>
                <GlassCounter value={value} />
            </div>
            <div style={{
                fontSize: '0.72rem',
                color: 'var(--glass-text-secondary)',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginTop: '6px'
            }}>
                {label}
            </div>
        </div>
    </div>
);

/* ── Mini Sky Scene ── */
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
        {timeOfDay === 'afternoon' && (
            <>
                <div className="dash-sun dash-afternoon-sun" />
                <div className="dash-cloud dash-cloud-1" />
                <div className="dash-cloud dash-cloud-2" />
            </>
        )}
        {timeOfDay === 'evening' && (
            <>
                <div className="dash-sunset-orb" />
                <div className="dash-cloud dash-cloud-3" />
            </>
        )}
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
    const { data: me } = useGetMe();

    const hour = new Date().getHours();
    const timeOfDay = hour >= 5 && hour < 12 ? 'morning' : hour >= 12 && hour < 17 ? 'afternoon' : hour >= 17 && hour < 20 ? 'evening' : 'night';

    const getGreeting = () => {
        if (timeOfDay === 'morning') return { text: 'Good morning!', icon: '☀️' };
        if (timeOfDay === 'afternoon') return { text: 'Good afternoon!', icon: '🌤️' };
        if (timeOfDay === 'evening') return { text: 'Good evening!', icon: '🌅' };
        return { text: 'Good night!', icon: '🌙' };
    };

    const greeting = getGreeting();

    const statsConfig = [
        { label: 'Total Jobs', value: stats.totalJobs, icon: <Briefcase size={20} />, trend: { val: 'Live', label: '' } },
        { label: 'Active Jobs', value: stats.activeJobs, icon: <Target size={20} />, trend: { val: '+2', label: 'this wk' } },
        { label: 'Applications', value: stats.totalApplications, icon: <Users size={20} />, trend: { val: '+12', label: 'total' } },
        { label: 'Shortlisted', value: stats.shortlisted, icon: <CheckCircle2 size={20} />, trend: { val: 'Elite', label: '' } },
    ];

    return (
        <div className="glass-main" style={{ position: 'relative' }}>
            {/* Ambient Background Glows */}
            <div className="glow-effect" style={{ top: '10%', left: '5%', background: '#60A5FA', width: '300px', height: '300px' }} />
            <div className="glow-effect" style={{ top: '40%', right: '5%', background: '#3F51B5', width: '400px', height: '400px', opacity: 0.2 }} />

            <div className="glass-container glass-reveal">

                {/* ───── HERO SECTION ───── */}
                <div className={`glass-panel dash-hero-${timeOfDay}`} style={{
                    padding: '48px',
                    marginBottom: '40px',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: '220px',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}>
                    <PageHeroSky timeOfDay={timeOfDay} />
                    <div style={{ position: 'relative', zIndex: 2, display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ maxWidth: '800px' }}>
                            <h1 style={{
                                fontSize: '3.5rem',
                                fontWeight: '900',
                                color: 'white',
                                letterSpacing: '-0.04em',
                                marginBottom: '16px',
                                lineHeight: '0.9',
                                textShadow: '0 4px 15px rgba(0,0,0,0.2)'
                            }}>
                                {greeting.text} <br />
                                <span style={{ opacity: 0.85, fontSize: '0.8em' }}>Welcome back, {me?.companyName || me?.fullname || 'Employer'}</span>
                            </h1>
                            <p style={{
                                fontSize: '1.2rem',
                                color: 'rgba(255,255,255,0.75)',
                                fontWeight: '500',
                                maxWidth: '600px',
                                margin: '0 auto',
                                lineHeight: '1.5'
                            }}>
                                Your hiring process is looking {stats.totalApplications > 10 ? 'great' : 'good'} today.
                            </p>
                        </div>
                    </div>
                </div>

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
                                                        <CandidateAvatar 
                                                            name={app.JobSeeker?.fullname || (app.JobSeeker ? `${app.JobSeeker.firstName || ''} ${app.JobSeeker.lastName || ''}`.trim() : '') || app.name || 'U'}
                                                            status={app.status}
                                                        />
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <div style={{ fontWeight: '800', color: 'var(--theme-text-primary)', fontSize: '0.95rem' }}>
                                                                {app.JobSeeker?.fullname || (app.JobSeeker ? `${app.JobSeeker.firstName || ''} ${app.JobSeeker.lastName || ''}`.trim() : '') || app.name || 'Unknown Candidate'}
                                                            </div>
                                                            <div style={{ fontSize: '0.72rem', color: 'var(--theme-text-muted)', fontWeight: '600' }}>
                                                                {app.JobSeeker?.email || 'email-syncing@nexus.com'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ fontWeight: '700', color: 'var(--theme-text-primary)', fontSize: '0.9rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--glass-accent-light)' }} />
                                                        {app.jobTitle || app.JobListing?.title}
                                                    </div>
                                                </td>
                                                <td style={{ fontWeight: '600', color: 'var(--theme-text-secondary)', fontSize: '0.85rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <Clock size={12} style={{ opacity: 0.6 }} />
                                                        {app.applied_at ? new Date(app.applied_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Syncing'}
                                                    </div>
                                                </td>
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

                    {/* Intelligence & Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        
                        {/* Hiring Intelligence Card */}
                        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{ 
                                padding: '24px', 
                                background: 'linear-gradient(135deg, var(--theme-sidebar-accent), transparent)',
                                borderBottom: '1px solid var(--theme-border)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                    <ShieldCheck size={18} className="text-gradient-sapphire" />
                                    <span style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--theme-text-muted)' }}>Stats</span>
                                </div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--theme-text-primary)', marginBottom: '4px' }}>How you are doing</h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--theme-text-muted)', fontWeight: '500' }}>See how many people like your jobs.</p>
                            </div>
                            
                            <div style={{ padding: '24px' }}>
                                <div style={{ marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem', fontWeight: '700' }}>
                                        <span style={{ color: 'var(--theme-text-primary)' }}>Shortlist Progress</span>
                                        <span style={{ color: 'var(--glass-accent-light)' }}>{Math.round((stats.shortlisted / (stats.totalApplications || 1)) * 100)}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', background: 'var(--theme-bg-subtle)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--theme-border)' }}>
                                        <div style={{ 
                                            width: `${(stats.shortlisted / (stats.totalApplications || 1)) * 100}%`, 
                                            height: '100%', 
                                            background: 'linear-gradient(90deg, #3F51B5, #3E61FF)',
                                            borderRadius: '4px',
                                            transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                            boxShadow: '0 0 10px rgba(62, 97, 255, 0.3)'
                                        }} />
                                    </div>
                                </div>

                                <div className="glass-panel" style={{ padding: '16px', background: 'var(--theme-bg-subtle)', border: 'none', borderRadius: '16px', marginBottom: '20px' }}>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--theme-text-secondary)', lineHeight: '1.6', fontWeight: '600', margin: '0' }}>
                                        {stats.activeJobs > 0 
                                            ? `You have ${stats.activeJobs} active listings. Reach quality candidates 30% faster with Premium.`
                                            : "No active jobs. Start your recruitment journey by posting a new listing."}
                                    </p>
                                </div>

                                {/* Mini Performance Chart Simulation */}
                                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '60px', padding: '0 8px' }}>
                                    {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                        <div key={i} style={{ 
                                            flex: 1, 
                                            height: `${h}%`, 
                                            background: i === 6 ? 'var(--glass-accent-light)' : 'var(--theme-text-muted)', 
                                            opacity: i === 6 ? 1 : 0.2,
                                            borderRadius: '4px',
                                            transition: 'height 1s ease-out',
                                            animation: `growUp 1s ease-out ${i * 0.1}s forwards`
                                        }} />
                                    ))}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.65rem', color: 'var(--theme-text-muted)', fontWeight: '700' }}>
                                    <span>MON</span>
                                    <span>SUN</span>
                                </div>
                            </div>
                        </div>

                         {/* Quick Actions */}
                        <div className="glass-panel" style={{ padding: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                                <LayoutDashboard size={20} className="text-gradient-sapphire" />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--theme-text-primary)' }}>Quick Actions</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <OperationButton label="Post a Job" icon={<PlusCircle size={18} />} primary onClick={() => navigate(ROUTES.JOB_MANAGEMENT)} />
                                <OperationButton label="Candidate List" icon={<Users size={18} />} onClick={() => navigate(ROUTES.EMPLOYER_APPLICATIONS)} />
                                <OperationButton label="My Jobs" icon={<Target size={18} />} onClick={() => navigate(ROUTES.JOB_MANAGEMENT)} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <style>{`
                .glass-btn-secondary:hover { transform: translateY(-2px); background: rgba(255,255,255,0.06) !important; color: var(--glass-accent-light) !important; }
                .op-btn:hover { transform: translateX(8px); border-color: var(--glass-border-bright) !important; }
                @keyframes growUp { from { height: 0; } to { height: var(--final-height); } }
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
            color: primary ? 'white' : 'var(--theme-text-primary)',
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
            {status === 'Shortlisted' ? 'SHORTLIST' : (status === 'Accepted' ? 'HIRED' : (status === 'Pending' ? 'PENDING' : status.toUpperCase()))}
        </span>
    );
};

const CandidateAvatar = ({ name, status }) => {
    const getStatusColor = () => {
        switch (status) {
            case 'Accepted': return '#10B981';
            case 'Shortlisted': return '#3B82F6';
            case 'Interview': return '#F59E0B';
            case 'Rejected': return '#EF4444';
            default: return 'var(--glass-accent-light)';
        }
    };
    
    return (
        <div style={{ position: 'relative' }}>
            <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '12px', 
                background: 'linear-gradient(135deg, #1A237E, #3F51B5)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'white', 
                fontSize: '0.9rem', 
                fontWeight: '900',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)' 
            }}>
                {(name?.[0] || 'U').toUpperCase()}
            </div>
            <div style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: getStatusColor(),
                border: '2px solid var(--theme-card)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }} />
        </div>
    );
};

export default EmployerDashboard;
