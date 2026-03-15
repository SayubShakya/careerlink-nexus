import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ROUTES } from '@/routes/routes';
import { useGetMe } from '@/hooks/api/auth/useGetMe';

const EmployerNavbar = () => {
    const navigate = useNavigate();
    const { data: me } = useGetMe();
    const user = me?.user || JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        navigate(ROUTES.LOGOUT_CONFIRMATION);
    };

    const styles = {
        nav: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 40px',
            backgroundColor: 'white',
            borderBottom: '1px solid var(--border-subtle)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        },
        logoContainer: {
            display: 'flex',
            alignItems: 'center'
        },
        logo: {
            height: '100px',
            objectFit: 'contain'
        },
        links: {
            display: 'flex',
            alignItems: 'center',
            gap: '30px'
        },
        link: {
            textDecoration: 'none',
            color: 'var(--text-main)',
            fontWeight: '600',
            fontSize: '0.95rem',
            transition: 'color 0.2s',
            cursor: 'pointer'
        },
        logoutBtn: {
            padding: '8px 18px',
            backgroundColor: '#FFF5F5',
            color: '#C53030',
            border: '1px solid #FEB2B2',
            borderRadius: 'var(--radius-sm)',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '0.9rem',
            transition: 'all 0.2s'
        },
        postJobBtn: {
            padding: '10px 20px',
            backgroundColor: 'var(--color-brand-accent)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '0.9rem'
        }
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.logoContainer}>
                <div style={{ padding: '5px 0' }}>
                    <span style={{ fontWeight: '800', color: 'var(--color-brand-accent)', fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
                        {user?.companyName ? user.companyName.toUpperCase() : 'EMPLOYER HUB'}
                    </span>
                </div>
            </div>

            <div style={styles.links}>
                <Link to="/applicants" style={styles.link} className="nav-link">View applicant status</Link>
                <button onClick={handleLogout} style={styles.logoutBtn} className="logout-btn">Logout</button>
            </div>

            <style>{`
                .nav-link:hover {
                    color: var(--color-brand-accent) !important;
                }
                .logout-btn:hover {
                    background-color: #FEB2B2 !important;
                    color: #9B2C2C !important;
                }
            `}</style>
        </nav>
    );
};

export default EmployerNavbar;
