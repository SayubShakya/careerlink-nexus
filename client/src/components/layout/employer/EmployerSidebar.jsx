import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    Briefcase,
    Users,
    History,
    LogOut,
    Menu,
    X,
    LayoutDashboard,
    BarChart3,
    Sun,
    Moon,
    ShieldCheck,
    PlusCircle as PostIcon
} from 'lucide-react';
import { ROUTES } from '@/routes/routes';
import { useGetMe } from '@/hooks/api/auth/useGetMe';
import { useTheme } from '@/hooks/useTheme';
import { THEME_MODES } from '@/config/constants';
import logoImg from '@assets/images/CareerLink-Logo.png';

const EmployerSidebar = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { data: me } = useGetMe();
    const { theme, toggleTheme } = useTheme();
    const user = me?.user || JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        navigate(ROUTES.LOGOUT_CONFIRMATION);
    };

    const navItems = [
        {
            label: 'Dashboard',
            path: ROUTES.EMPLOYER_DASHBOARD,
            icon: <LayoutDashboard size={20} />
        },
        {
            label: 'Manage Jobs',
            path: ROUTES.JOB_MANAGEMENT,
            icon: <Briefcase size={20} />
        },
        {
            label: 'Candidate List',
            path: ROUTES.EMPLOYER_APPLICATIONS,
            icon: <Users size={20} />
        },
        {
            label: 'My Company',
            path: ROUTES.EMPLOYER_COMPANY_PROFILE,
            icon: <BarChart3 size={20} />
        },
        {
            label: 'History',
            path: ROUTES.EMPLOYER_HISTORY,
            icon: <History size={20} />
        }
    ];

    const styles = {
        sidebar: {
            width: isOpen ? '280px' : '88px',
            height: '100vh',
            backgroundColor: 'var(--theme-sidebar)',
            color: 'var(--theme-text-primary)',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 1001,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid var(--theme-border)',
            overflow: 'hidden',
        },
        header: {
            padding: isOpen ? '20px 24px 8px' : '20px 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: isOpen ? 'flex-start' : 'center',
            gap: '8px',
            transition: 'padding 0.4s'
        },
        toggleBtn: {
            display: 'none', // Managed by mobile drawer if needed, or hidden for cleaner desktop look
        },
        logoSection: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: isOpen ? 'flex-start' : 'center',
            padding: '0',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        },
        logoWrapper: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isOpen ? 'flex-start' : 'center',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            marginBottom: '4px',
            padding: '0',
            gap: '12px',
            cursor: 'pointer',
            userSelect: 'none',
            background: 'none',
            border: 'none',
            boxShadow: 'none'
        },
        logoImg: {
            width: isOpen ? '36px' : '32px',
            height: isOpen ? '36px' : '32px',
            objectFit: 'contain',
            filter: theme === THEME_MODES.DARK ? 'brightness(1.1) drop-shadow(0 0 12px rgba(62, 97, 255, 0.4))' : 'none',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        },
        brandName: {
            display: isOpen ? 'block' : 'none',
            fontSize: '1.5rem',
            fontWeight: '900',
            letterSpacing: '-0.03em',
            fontFamily: 'var(--font-display)',
            color: 'var(--theme-text-primary)',
            whiteSpace: 'nowrap',
            lineHeight: '1',
            paddingTop: '1px'
        },
        identityContainer: {
            display: isOpen ? 'flex' : 'none',
            flexDirection: 'column',
            gap: '0',
            paddingLeft: '48px', // Perfectly aligned with 'Career' text (36px icon + 12px gap)
            marginBottom: '12px'
        },
        identityName: {
            fontSize: '0.75rem',
            fontWeight: '600',
            color: 'var(--theme-text-muted)',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            opacity: 0.5,
            maxWidth: '160px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        nav: {
            flexGrow: 1,
            padding: '4px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
        },
        navItem: (isActive) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: isOpen ? 'flex-start' : 'center',
            gap: '10px',
            padding: '8px 14px',
            borderRadius: '10px',
            color: isActive ? 'var(--theme-text-primary)' : 'var(--theme-text-muted)',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '0.875rem',
            backgroundColor: isActive ? 'var(--theme-bg-subtle)' : 'transparent',
            border: '1px solid',
            borderColor: isActive ? 'var(--theme-border-bright)' : 'transparent',
            transition: 'all 0.15s ease',
            position: 'relative'
        }),
        iconBox: (isActive) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
            color: isActive ? 'var(--glass-accent-light)' : 'inherit',
            transition: 'all 0.2s'
        }),
        footer: {
            padding: '16px',
            borderTop: '1px solid var(--theme-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        },
        themeBtn: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor: 'var(--theme-bg-subtle)',
            border: '1px solid var(--theme-border)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            color: 'var(--theme-text-primary)'
        },
        logoutBtn: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isOpen ? 'flex-start' : 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '12px',
            color: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.1)',
            cursor: 'pointer',
            fontSize: '0.925rem',
            fontWeight: '800',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }
    };

    return (
        <aside style={styles.sidebar} className={`sidebar-glass ${isOpen ? 'mobile-open' : ''}`}>
            <div style={styles.header}>
                <div style={styles.logoSection} className="sidebar-id-hub">
                    <div 
                        style={styles.logoWrapper} 
                        className="logo-gem-container btn-scale"
                        onClick={() => navigate(ROUTES.EMPLOYER_DASHBOARD)}
                    >
                        <img src={logoImg} alt="CareerLink" style={styles.logoImg} />
                        <span style={styles.brandName}>Career<span style={{ color: 'var(--color-brand-accent)' }}>Link</span></span>
                    </div>
                    <div style={styles.identityContainer}>
                        <h3 style={styles.identityName}>{user?.companyName}</h3>
                    </div>
                </div>
            </div>

            <nav style={styles.nav}>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path || (item.path === ROUTES.EMPLOYER_DASHBOARD && location.pathname === '/dashboard/employer');
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            style={styles.navItem(isActive)}
                            className={({ isActive }) => `sidebar-link-glass ${isActive ? 'active' : ''}`}
                            onClick={() => {
                                if (window.innerWidth <= 1023) {
                                    setIsOpen(false);
                                }
                            }}
                        >
                            <div style={styles.iconBox(isActive)} className="glass-icon-wrapper">
                                {item.icon}
                            </div>
                            {isOpen && <span style={{ transition: 'opacity 0.2s' }}>{item.label}</span>}
                            {!isOpen && <div className="glass-tooltip">{item.label}</div>}
                        </NavLink>
                    );
                })}

                {/* Quick Action - Post Job */}
                <div style={{ padding: '24px 0 12px', marginTop: 'auto' }}>
                    <button
                        onClick={() => navigate(ROUTES.JOB_MANAGEMENT, { state: { expandForm: true } })}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: isOpen ? 'flex-start' : 'center',
                            gap: '12px',
                            padding: '12px 14px',
                            borderRadius: '12px',
                            background: 'var(--glass-accent)',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '800',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 8px 16px -4px rgba(63, 81, 181, 0.3)'
                        }}
                        className="btn-scale sidebar-post-btn"
                    >
                        <PostIcon size={18} />
                        {isOpen && <span>Post a Job</span>}
                        {!isOpen && <div className="glass-tooltip" style={{ background: 'var(--glass-accent)' }}>Post a Job</div>}
                    </button>
                </div>
            </nav>

            <div style={styles.footer}>
                <button
                    onClick={() => toggleTheme(theme === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT)}
                    style={styles.themeBtn}
                    className="glass-theme-btn"
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {theme === THEME_MODES.LIGHT ? <Sun size={18} /> : <Moon size={18} />}
                        {isOpen && <span style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{theme === THEME_MODES.LIGHT ? 'Light Mode' : 'Dark Mode'}</span>}
                    </div>
                    {isOpen && (
                        <div style={{ width: '36px', height: '20px', borderRadius: '20px', background: theme === THEME_MODES.DARK ? 'var(--glass-accent-light)' : '#E2E8F0', padding: '2px', position: 'relative' }}>
                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'white', position: 'absolute', right: theme === THEME_MODES.DARK ? '2px' : 'auto', left: theme === THEME_MODES.LIGHT ? '2px' : 'auto', transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }} />
                        </div>
                    )}
                </button>

                <button
                    onClick={handleLogout}
                    style={styles.logoutBtn}
                    className="glass-logout-btn"
                >
                    <LogOut size={18} strokeWidth={2.5} />
                    {isOpen && <span>Logout</span>}
                    {!isOpen && <div className="glass-tooltip">Logout</div>}
                </button>
            </div>

            <style>{`
                .sidebar-glass {
                    box-shadow: 20px 0 60px rgba(0,0,0,0.1);
                }

                .sidebar-id-hub {
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .sidebar-id-hub:hover .logo-gem-container {
                    background: rgba(62, 97, 255, 0.08);
                    border-color: rgba(62, 97, 255, 0.2);
                    transform: translateY(-2px);
                }

                .sidebar-link-glass:hover {
                    background: var(--theme-sidebar-accent);
                    color: var(--theme-text-primary);
                    padding-left: 20px !important;
                }

                .sidebar-link-glass.active::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 15%;
                    height: 70%;
                    width: 4px;
                    background: var(--glass-accent-light);
                    border-radius: 0 4px 4px 0;
                    box-shadow: 0 0 15px var(--glass-accent-light);
                }

                .glass-icon-wrapper {
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .sidebar-link-glass:hover .glass-icon-wrapper {
                    transform: scale(1.1) rotate(-5deg);
                }

                .glass-theme-btn:hover {
                    background: var(--theme-sidebar-accent);
                    border-color: var(--theme-border-bright);
                }

                .glass-logout-btn:hover {
                    background: rgba(239, 68, 68, 0.1) !important;
                    transform: scale(1.02);
                }

                .glass-tooltip {
                    position: absolute;
                    left: 100%;
                    margin-left: 20px;
                    padding: 8px 14px;
                    background: rgba(15, 23, 42, 0.9);
                    backdrop-filter: blur(8px);
                    color: white;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 800;
                    white-space: nowrap;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.2s;
                    border: 1px solid rgba(255,255,255,0.1);
                    z-index: 1002;
                }

                .sidebar-link-glass:hover .glass-tooltip,
                .glass-logout-btn:hover .glass-tooltip {
                    opacity: 1;
                    visibility: visible;
                    transform: translateX(-8px);
                }

                @keyframes reveal {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .sidebar-post-btn:hover {
                    box-shadow: 0 12px 24px -6px rgba(63, 81, 181, 0.5);
                    transform: scale(1.02) translateY(-1px);
                    filter: brightness(1.1);
                }

                @media (max-width: 1023px) {
                    .sidebar-glass {
                        width: ${isOpen ? '280px' : '0'} !important;
                        border-right: ${isOpen ? '1px solid var(--theme-border)' : 'none'};
                    }
                }
            `}</style>
        </aside>
    );
};

export default EmployerSidebar;

