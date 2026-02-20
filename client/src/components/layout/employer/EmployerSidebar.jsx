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
            icon: <LayoutDashboard size={20} />
        },
        {
            label: 'Job Management',
            path: ROUTES.JOB_MANAGEMENT,
            icon: <Briefcase size={20} />
        },
        {
            label: 'Recent Applications',
            path: ROUTES.EMPLOYER_APPLICATIONS,
            icon: <Users size={20} />
        },
        {
            label: 'Messages',
            path: '/employer/messages',
            icon: <MessageSquare size={20} />
        },
        {
            label: 'Company Profile',
            path: ROUTES.EMPLOYER_COMPANY_PROFILE,
            icon: <BarChart3 size={20} />
        },
        {
            label: 'History',
            path: ROUTES.EMPLOYER_HISTORY,
            icon: <History size={20} />
        },
        {
            label: 'Settings',
            path: '/employer/settings',
            icon: <Settings size={20} />
        }
    ];

    const styles = {
        sidebar: {
            width: isOpen ? '280px' : '80px',
            height: '100vh',
            backgroundColor: 'var(--color-brand-primary)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 1001,
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
            overflow: 'hidden'
        },
        header: {
            padding: isOpen ? '24px' : '20px 0',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: isOpen ? 'flex-start' : 'center',
            gap: '15px',
            minHeight: '100px'
        },
        toggleBtn: {
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            alignSelf: isOpen ? 'flex-end' : 'center'
        },
        logo: {
            fontSize: isOpen ? '1.25rem' : '0.8rem',
            fontWeight: '800',
            color: 'var(--color-brand-accent)',
            letterSpacing: isOpen ? '-0.02em' : '0',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s'
        },
        orgName: {
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.6)',
            marginTop: '4px',
            textTransform: 'uppercase',
            display: isOpen ? 'block' : 'none',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%'
        },
        nav: {
            flexGrow: 1,
            padding: isOpen ? '20px 16px' : '20px 10px'
        },
        navLink: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: isOpen ? 'flex-start' : 'center',
            gap: isOpen ? '12px' : '0',
            padding: isOpen ? '12px 16px' : '15px 0',
            borderRadius: 'var(--radius-md)',
            color: 'rgba(255,255,255,0.7)',
            textDecoration: 'none',
            fontWeight: '500',
            fontSize: '0.95rem',
            transition: 'all 0.2s',
            marginBottom: '4px',
            position: 'relative'
        },
        activeLink: {
            backgroundColor: 'rgba(62, 97, 255, 0.15)',
            color: 'var(--color-brand-accent)',
        },
        label: {
            display: isOpen ? 'block' : 'none',
            whiteSpace: 'nowrap'
        },
        footer: {
            padding: isOpen ? '20px 16px' : '20px 0',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            justifyContent: 'center'
        },
        logoutBtn: {
            width: isOpen ? '100%' : '50px',
            height: isOpen ? 'auto' : '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isOpen ? 'flex-start' : 'center',
            gap: isOpen ? '12px' : '0',
            padding: isOpen ? '12px 16px' : '0',
            borderRadius: 'var(--radius-md)',
            color: '#FDA4AF',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: '600',
            transition: 'all 0.2s',
            textAlign: 'left'
        }
    };

    return (
        <aside style={styles.sidebar} className="sidebar-container">
            <div style={styles.header}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={styles.toggleBtn}
                    className="sidebar-toggle-btn"
                >
                    {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
                </button>

                <div style={{ padding: isOpen ? '0' : '0 5px', textAlign: 'center' }}>
                    <span style={styles.logo}>{isOpen ? 'CAREERLINK' : 'CL'}</span>
                    <span style={styles.orgName}>
                        {user?.organization_name || 'Employer'}
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
                        {item.icon}
                        <span style={styles.label}>{item.label}</span>
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
                    <LogOut size={20} />
                    <span style={styles.label}>Logout</span>
                </button>
            </div>

            <style>{`
                .sidebar-toggle-btn:hover {
                    background-color: rgba(255,255,255,0.2) !important;
                }
                .sidebar-link:hover {
                    background-color: rgba(255,255,255,0.05);
                    color: white;
                }
                .sidebar-link.active:hover {
                    background-color: rgba(62, 97, 255, 0.2);
                    color: var(--color-brand-accent);
                }
                .sidebar-logout-btn:hover {
                    background-color: rgba(244, 63, 94, 0.1);
                    color: #FB7185;
                }
                @media (max-width: 1023px) {
                    .sidebar-container {
                        width: ${isOpen ? '280px' : '0px'} !important;
                    }
                }
            `}</style>
        </aside>
    );
};

export default EmployerSidebar;
