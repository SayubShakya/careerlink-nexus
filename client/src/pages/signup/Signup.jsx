import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import authIllustration from '@/assets/images/auth-illustration.png';
import logo from '@assets/images/temporary_logo.png';
import { ROUTES } from '@/routes/routes';

const styles = {
    pageContainer: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-subtle)',
        padding: '40px 20px'
    },
    card: {
        display: 'flex',
        backgroundColor: 'white',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '1000px',
        minHeight: '700px',
        transition: 'all 0.3s ease'
    },
    leftColumn: {
        flex: 1,
        backgroundColor: '#F3F6FF',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    },
    rightColumn: {
        flex: 1,
        padding: '50px',
        display: 'flex',
        flexDirection: 'column'
    },
    illustration: {
        maxWidth: '100%',
        height: 'auto',
        marginBottom: '30px'
    },
    formTitle: {
        fontSize: '2rem',
        fontWeight: '700',
        color: 'var(--color-brand-accent)',
        marginBottom: '10px'
    },
    formSubtitle: {
        color: 'var(--text-muted)',
        fontSize: '0.95rem',
        marginBottom: '30px'
    },
    selectionContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        marginTop: '20px'
    },
    roleCard: {
        width: '100%',
        padding: '24px',
        borderRadius: '16px',
        border: '2px solid #edf2f7',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        backgroundColor: 'white'
    },
    roleIcon: {
        width: '48px',
        height: '48px',
        color: 'var(--color-brand-accent)',
        flexShrink: 0
    },
    roleTitle: {
        fontSize: '1.1rem',
        fontWeight: '700',
        color: 'var(--color-brand-primary)',
        marginBottom: '4px'
    },
    roleText: {
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        lineHeight: '1.4'
    },
    switchText: {
        marginTop: 'auto',
        textAlign: 'center',
        fontSize: '0.9rem',
        color: 'var(--text-muted)'
    },
    link: {
        color: 'var(--color-brand-accent)',
        textDecoration: 'none',
        fontWeight: '600',
        cursor: 'pointer'
    }
};

const Signup = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const role = localStorage.getItem('role');

    useEffect(() => {
        if (isAuthenticated()) {
            if (role === 'job_seeker') {
                navigate(ROUTES.JOBSEEKER_DASHBOARD);
            } else if (role === 'employer') {
                navigate(ROUTES.EMPLOYER_DASHBOARD);
            }
        }
    }, [isAuthenticated, role, navigate]);

    return (
        <div style={styles.pageContainer}>
            <div style={styles.card}>
                {/* Left Column - Illustration */}
                <div style={styles.leftColumn} className="auth-left-hide">

                    <img src={authIllustration} alt="Authentication" style={styles.illustration} />
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--color-brand-primary)', marginBottom: '10px' }}>
                        Join CareerLink
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '300px' }}>
                        The premier ecosystem for modern professional growth and industry-defining roles.
                    </p>
                </div>

                {/* Right Column - Role Selection */}
                <div style={styles.rightColumn}>
                    <h2 style={styles.formTitle}>Get Started</h2>
                    <p style={styles.formSubtitle}>Select how you would like to use the platform</p>

                    <div style={styles.selectionContainer}>
                        <div
                            style={styles.roleCard}
                            className="role-card"
                            onClick={() => navigate(ROUTES.REGISTER_JOBSEEKER)}
                        >
                            <div style={styles.roleIcon}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div>
                                <h3 style={styles.roleTitle}>Jobseeker</h3>
                                <p style={styles.roleText}>Create account to apply for jobs and build your career!</p>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', color: '#CBD5E0', fontWeight: 'bold', margin: '10px 0' }}>OR</div>

                        <div
                            style={styles.roleCard}
                            className="role-card"
                            onClick={() => navigate(ROUTES.REGISTER_EMPLOYER)}
                        >
                            <div style={styles.roleIcon}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div>
                                <h3 style={styles.roleTitle}>Employer</h3>
                                <p style={styles.roleText}>Create account to post jobs and find elite talent!</p>
                            </div>
                        </div>
                    </div>

                    <p style={styles.switchText}>
                        Already have an account?{' '}
                        <Link to={ROUTES.LOGIN} style={styles.link}>
                            Log In
                        </Link>
                    </p>
                </div>
            </div>

            <style>{`
                .role-card:hover {
                    border-color: var(--color-brand-accent) !important;
                    box-shadow: 0 10px 30px rgba(62, 97, 255, 0.12) !important;
                    transform: translateY(-5px);
                }
                .google-btn:hover {
                    background-color: #F7FAFC !important;
                    border-color: #CBD5E0 !important;
                }

                @media (max-width: 768px) {
                    .auth-left-hide { display: none !important; }
                    .card { max-width: 500px !important; }
                }
            `}</style>
        </div>
    );
};

export default Signup;
