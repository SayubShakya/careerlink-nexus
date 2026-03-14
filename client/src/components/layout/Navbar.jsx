import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/components/common/Logo';
import { ROUTES } from '../../routes/routes';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
    const { isAuthenticated: checkAuth, getCurrentUser } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const isAuthenticated = checkAuth();
    const role = localStorage.getItem('role');

    const user = getCurrentUser();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        navigate(ROUTES.LOGOUT_CONFIRMATION);
    };

    const getDashboardRoute = () => {
        if (role === 'job_seeker') return ROUTES.JOBSEEKER_DASHBOARD;
        if (role === 'employer') return ROUTES.EMPLOYER_DASHBOARD;
        return '/';
    };

    const navStyles = {
        navLinks: {
            display: 'flex',
            gap: 'var(--space-md)',
            alignItems: 'center'
        },
        link: {
            fontSize: '0.95rem',
            fontWeight: '600',
            color: 'var(--text-main)',
            textDecoration: 'none',
            opacity: 0.9,
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '8px'
        },
        btn: {
            padding: '0.65rem 1.4rem',
            backgroundColor: 'var(--color-brand-primary)',
            color: 'white',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.9rem',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            marginLeft: '10px'
        },
        logoutBtn: {
            padding: '0.65rem 1.4rem',
            backgroundColor: 'transparent',
            color: '#C53030',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.9rem',
            fontWeight: '600',
            border: '1px solid #FEB2B2',
            cursor: 'pointer',
            marginLeft: '10px',
            transition: 'all 0.2s'
        }
    };

    return (
        <nav className={`sticky-header ${scrolled ? 'scrolled' : ''}`} aria-label="Main Navigation">
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <Logo variant="full" />
                </Link>

                <nav style={navStyles.navLinks} aria-label="Quick Links">
                    <Link to="/" style={navStyles.link} className="nav-item">Home</Link>
                    <Link to="/find-jobs" style={navStyles.link} className="nav-item">Find Jobs</Link>

                    {isAuthenticated ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <Link to={getDashboardRoute()} style={navStyles.link} className="nav-item">Dashboard</Link>
                            {user?.profile_picture ? (
                                <img 
                                    src={`/${user.profile_picture.replace(/\\/g, '/')}`} 
                                    alt="Profile" 
                                    style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-brand-primary)' }} 
                                />
                            ) : (
                                <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'var(--color-brand-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                    {user?.firstName ? user.firstName[0].toUpperCase() : 'U'}
                                </div>
                            )}
                            <button onClick={handleLogout} style={navStyles.logoutBtn} className="logout-nav-btn">Logout</button>
                        </div>
                    ) : (
                        <>
                            <Link to={ROUTES.LOGIN} style={navStyles.link} className="nav-item">Sign In</Link>
                            <Link
                                to={ROUTES.REGISTER}
                                style={{ ...navStyles.btn, textDecoration: 'none', display: 'inline-block' }}
                                className="signup-nav-btn"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </nav>
            </div>

            <style>{`
        .nav-item:hover {
          opacity: 1 !important;
          color: var(--color-brand-accent) !important;
          background: rgba(62, 97, 255, 0.05);
        }
        @media (max-width: 768px) {
          nav { display: none !important; }
        }
      `}</style>
        </nav>
    );
}
