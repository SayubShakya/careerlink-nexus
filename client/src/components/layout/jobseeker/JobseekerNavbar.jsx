import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';
import { useGetMe } from '@/hooks/api/auth/useGetMe';
import { LogOut, User, Layout, Search, FileText, Database } from 'lucide-react';

const JobseekerNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { data: me } = useGetMe();
    const user = me?.user || JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        navigate(ROUTES.LOGOUT_CONFIRMATION);
    };

    const isActive = (path) => {
        if (path.includes('#')) {
            return location.hash === path.split('#')[1] ? 'active' : '';
        }
        return location.pathname === path ? 'active' : '';
    };

    const styles = {
        nav: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 60px',
            backgroundColor: 'var(--bg-glass)',
            borderBottom: '1px solid var(--border-dashboard)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            backdropFilter: 'blur(20px) saturate(180%)',
            boxShadow: 'var(--shadow-premium)',
            transition: 'background-color 0.3s, border-color 0.3s'
        },
        logoContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
        },
        brand: {
            fontWeight: '900',
            color: 'var(--text-main)',
            fontSize: '0.9rem',
            letterSpacing: '0.05em',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textTransform: 'uppercase'
        },
        avatarBox: {
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #3E61FF 0%, #6366F1 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(62, 97, 255, 0.2)',
            border: '2px solid var(--bg-main)'
        },
        links: {
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            backgroundColor: 'var(--bg-dashboard)',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid var(--border-dashboard)'
        },
        link: {
            textDecoration: 'none',
            color: 'var(--text-muted)',
            fontWeight: '700',
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '8px 16px',
            borderRadius: '8px',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        logoutBtn: {
            padding: '10px 20px',
            backgroundColor: 'var(--text-main)',
            color: 'var(--bg-main)',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '800',
            cursor: 'pointer',
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginLeft: '24px',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 10px 20px rgba(15, 23, 42, 0.15)'
        }
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.logoContainer}>
                <Link to={ROUTES.JOBSEEKER_DASHBOARD} style={styles.brand}>
                    <div style={{ ...styles.avatarBox, overflow: 'hidden' }}>
                        {user?.profile_picture ? (
                            <img
                                src={`http://localhost:5000/${user.profile_picture}`}
                                alt="Profile"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <User size={16} color="white" strokeWidth={3} />
                        )}
                    </div>
                    <span>Welcome, {user?.first_name || 'Seeker'}</span>
                </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={styles.links}>
                    <Link to={ROUTES.JOBSEEKER_DASHBOARD} style={styles.link} className={`nav-item ${isActive(ROUTES.JOBSEEKER_DASHBOARD)}`}>
                        <Layout size={14} /> Overview
                    </Link>
                    <Link to={ROUTES.JOBSEEKER_FIND_JOBS} style={styles.link} className={`nav-item ${isActive(ROUTES.JOBSEEKER_FIND_JOBS) ? 'active' : ''}`}>
                        <Search size={14} /> Find Jobs
                    </Link>
                    <Link to={ROUTES.CV_BUILDER} style={styles.link} className={`nav-item ${isActive(ROUTES.CV_BUILDER)}`}>
                        <FileText size={14} /> Build CV
                    </Link>
                    <Link to={ROUTES.MY_CVS} style={styles.link} className={`nav-item ${isActive(ROUTES.MY_CVS)}`}>
                        <Database size={14} /> CV Storage
                    </Link>
                    <Link to={ROUTES.JOBSEEKER_PROFILE} style={styles.link} className={`nav-item ${isActive(ROUTES.JOBSEEKER_PROFILE)}`}>
                        <User size={14} /> My Account
                    </Link>
                </div>

                <button onClick={handleLogout} style={styles.logoutBtn} className="logout-btn">
                    <LogOut size={14} strokeWidth={3} />
                    <span>Logout</span>
                </button>
            </div>

            <style>{`
                .nav-item:hover {
                    color: var(--text-main) !important;
                    background: var(--card-dashboard);
                    box-shadow: var(--shadow-premium);
                }
                .nav-item.active {
                    background: var(--card-dashboard) !important;
                    color: #3E61FF !important;
                    box-shadow: 0 4px 12px rgba(62, 97, 255, 0.08);
                    border: 1px solid var(--border-dashboard);
                }
                .logout-btn:hover {
                    background-color: #3E61FF !important;
                    color: white !important;
                    transform: translateY(-1px);
                    box-shadow: 0 15px 30px rgba(62, 97, 255, 0.25);
                }
                .logout-btn:active {
                    transform: translateY(0);
                }
            `}</style>
        </nav>
    );
};

export default JobseekerNavbar;
