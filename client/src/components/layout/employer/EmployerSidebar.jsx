import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    Briefcase,
    Users,
    History,
    LogOut,
    Menu,
    X,
    LayoutDashboard,
    MessageSquare,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { ROUTES } from '@/routes/routes';
import { useGetMe } from '@/hooks/api/auth/useGetMe';

const EmployerSidebar = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();
    const { data: me } = useGetMe();
    const user = me?.user || JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        navigate(ROUTES.LOGOUT_CONFIRMATION);
    };

    const navItems = [
        {
            label: 'Dashboard',
            path: ROUTES.EMPLOYER_DASHBOARD,
            icon: <LayoutDashboard size={20} strokeWidth={2} />
        },
        {
            label: 'Job Management',
            path: ROUTES.JOB_MANAGEMENT,
            icon: <Briefcase size={20} strokeWidth={2} />
        },
        {
            label: 'Applications',
            path: ROUTES.EMPLOYER_APPLICATIONS,
            icon: <Users size={20} strokeWidth={2} />
        },
        {
            label: 'Company Profile',
            path: ROUTES.EMPLOYER_COMPANY_PROFILE,
            icon: <BarChart3 size={20} strokeWidth={2} />
        },
        {
            label: 'History',
            path: ROUTES.EMPLOYER_HISTORY,
            icon: <History size={20} strokeWidth={2} />
        }
    ];

    const styles = {
        sidebar: {
            width: isOpen ? '280px' : '88px',
            height: '100vh',
            backgroundColor: 'var(--color-brand-primary)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 1001,
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '10px 0 30px rgba(0,0,0,0.15)',
            overflow: 'hidden',
        },
        header: {
            padding: isOpen ? '32px 24px' : '32px 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: isOpen ? 'flex-start' : 'center',
            gap: '24px',
            transition: 'padding 0.4s'
        },
        toggleBtn: {
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'white',
            cursor: 'pointer',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: isOpen ? 'absolute' : 'relative',
            right: isOpen ? '20px' : 'auto',
            top: isOpen ? '32px' : 'auto',
        },
        logoContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: isOpen ? 'flex-start' : 'center',
            transition: 'all 0.4s',
            opacity: 1,
            width: '100%'
        },
        logo: {
            fontSize: isOpen ? '1.5rem' : '1.1rem',
            fontWeight: '900',
            color: 'var(--color-brand-accent)',
            letterSpacing: '-0.04em',
            whiteSpace: 'nowrap',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            marginBottom: '4px'
        },
        orgName: {
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.5)',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: isOpen ? 'block' : 'none',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '200px',
            animation: isOpen ? 'fadeIn 0.4s forwards' : 'none'
        },
        nav: {
            flexGrow: 1,
            padding: '0 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
        },
        navLink: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: isOpen ? 'flex-start' : 'center',
            gap: '16px',
            padding: '14px 18px',
            borderRadius: '14px',
            color: 'rgba(255,255,255,0.6)',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '0.925rem',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            whiteSpace: 'nowrap'
        },
        activeLink: {
            backgroundColor: 'rgba(62, 97, 255, 0.1)',
            color: 'var(--color-brand-accent)',
            boxShadow: 'inset 0 0 0 1px rgba(62, 97, 255, 0.2)'
        },
        label: {
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'none' : 'translateX(-10px)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            display: isOpen ? 'inline-block' : 'none'
        },
        footer: {
            padding: '24px 16px 32px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
        },
        logoutBtn: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isOpen ? 'flex-start' : 'center',
            gap: '16px',
            padding: '14px 18px',
            borderRadius: '14px',
            color: '#FDA4AF',
            backgroundColor: 'rgba(244, 63, 94, 0.05)',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.925rem',
            fontWeight: '600',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }
    };

    return (
        <aside style={styles.sidebar} className="sidebar-container">
            <div style={styles.header}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={styles.toggleBtn}
                    className="sidebar-toggle-btn"
                    aria-label={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                <div style={styles.logoContainer}>
                    <div style={{ width: isOpen ? '160px' : '48px', height: isOpen ? '45px' : '48px', background: '#fff', borderRadius: '10px', padding: '4px', transition: 'all 0.4s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src="/src/assets/images/CareerLink-Logo.png" alt="CareerLink" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <span style={styles.orgName}>
                        {user?.organization_name || 'Employer Portal'}
                    </span>
                </div>
            </div>

            <nav style={styles.nav}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === ROUTES.EMPLOYER_DASHBOARD}
                        style={({ isActive }) => ({
                            ...styles.navLink,
                            ...(isActive ? styles.activeLink : {})
                        })}
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                        title={!isOpen ? item.label : ''}
                    >
                        <span className="icon-wrapper" style={{ display: 'flex' }}>
                            {item.icon}
                        </span>
                        <span style={styles.label}>{item.label}</span>
                        {!isOpen && <div className="link-tooltip">{item.label}</div>}
                    </NavLink>
                ))}
            </nav>

            <div style={styles.footer}>
                <button
                    onClick={handleLogout}
                    style={styles.logoutBtn}
                    className="sidebar-logout-btn"
                    title={!isOpen ? "Logout" : ""}
                >
                    <span className="icon-wrapper" style={{ display: 'flex' }}>
                        <LogOut size={20} strokeWidth={2.5} />
                    </span>
                    <span style={styles.label}>Logout</span>
                    {!isOpen && <div className="link-tooltip">Logout</div>}
                </button>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .sidebar-toggle-btn:hover {
                    background-color: rgba(255,255,255,0.12) !important;
                    transform: scale(1.05);
                }
                
                .sidebar-link:hover {
                    background-color: rgba(255,255,255,0.04);
                    color: white;
                    transform: translateX(4px);
                }

                .sidebar-link.active:hover {
                    background-color: rgba(62, 97, 255, 0.15);
                    color: var(--color-brand-accent);
                    transform: none;
                }

                .sidebar-link.active::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 25%;
                    height: 50%;
                    width: 4px;
                    background: var(--color-brand-accent);
                    border-radius: 0 4px 4px 0;
                    box-shadow: 2px 0 10px rgba(62, 97, 255, 0.5);
                }

                .sidebar-logout-btn:hover {
                    background-color: rgba(244, 63, 94, 0.15) !important;
                    color: #FB7185;
                    transform: scale(1.02);
                }

                .link-tooltip {
                    position: absolute;
                    left: 100%;
                    margin-left: 20px;
                    padding: 8px 12px;
                    background: #1e293b;
                    color: white;
                    border-radius: 8px;
                    font-size: 0.8rem;
                    font-weight: 500;
                    white-space: nowrap;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.2s;
                    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
                    z-index: 1002;
                }

                .sidebar-link:hover .link-tooltip,
                .sidebar-logout-btn:hover .link-tooltip {
                    opacity: 1;
                    visibility: visible;
                    margin-left: 12px;
                }

                .icon-wrapper {
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .sidebar-link:hover .icon-wrapper {
                    transform: scale(1.15);
                }

                @media (max-width: 1023px) {
                    .sidebar-container {
                        width: ${isOpen ? '280px' : '0px'} !important;
                        box-shadow: ${isOpen ? '20px 0 50px rgba(0,0,0,0.3)' : 'none'};
                    }
                }
            `}</style>
        </aside>
    );
};

export default EmployerSidebar;

