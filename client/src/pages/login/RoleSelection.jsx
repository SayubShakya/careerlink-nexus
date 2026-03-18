import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { User, Building2, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/routes/routes';
import { toast } from 'react-hot-toast';

const RoleSelection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email, name, googleId } = location.state || {};
    const [loading, setLoading] = useState(false);

    if (!email) {
        navigate(ROUTES.LOGIN);
        return null;
    }

    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-subtle)',
            padding: '20px'
        },
        card: {
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: '600px',
            textAlign: 'center'
        },
        title: {
            fontSize: '2rem',
            fontWeight: '700',
            color: 'var(--color-brand-primary)',
            marginBottom: '10px'
        },
        subtitle: {
            color: 'var(--text-muted)',
            marginBottom: '40px'
        },
        optionsGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '40px'
        },
        optionCard: (selected) => ({
            padding: '30px',
            borderRadius: '16px',
            border: `2px solid ${selected ? 'var(--color-brand-accent)' : 'var(--border-subtle)'}`,
            backgroundColor: selected ? 'var(--bg-subtle)' : 'white',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px'
        }),
        iconContainer: {
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#F3F6FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-brand-primary)'
        },
        optionTitle: {
            fontWeight: '600',
            fontSize: '1.1rem'
        },
        optionDesc: {
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
        },
        submitBtn: {
            width: '100%',
            padding: '14px',
            backgroundColor: 'var(--color-brand-primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            opacity: loading ? 0.7 : 1
        }
    };

    const handleRoleSelect = async (role) => {
        setLoading(true);
        try {
            const endpoint = role === 'job_seeker' ? '/api/auth/register/job-seeker' : '/api/auth/register/employer';

            const payload = role === 'job_seeker'
                ? { firstName: name.split(' ')[0], lastName: name.split(' ').slice(1).join(' ') || 'User', email, password: googleId, is_sso: true }
                : { companyName: `${name}'s Org`, companyWebsite: 'https://example.com', email, password: googleId, is_sso: true };

            const response = await axios.post(endpoint, payload);

            toast.success('Account created successfully!');
            navigate(ROUTES.LOGIN, { state: { message: 'Registration successful! Please log in.' } });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Welcome, {name.split(' ')[0]}!</h1>
                <p style={styles.subtitle}>Please select how you would like to use CareerLink Nexus</p>

                <div style={styles.optionsGrid}>
                    <div
                        style={styles.optionCard(false)}
                        onClick={() => !loading && handleRoleSelect('job_seeker')}
                        className="role-option"
                    >
                        <div style={styles.iconContainer}>
                            <User size={30} />
                        </div>
                        <span style={styles.optionTitle}>Job Seeker</span>
                        <span style={styles.optionDesc}>I am looking for elite career opportunities</span>
                    </div>

                    <div
                        style={styles.optionCard(false)}
                        onClick={() => !loading && handleRoleSelect('employer')}
                        className="role-option"
                    >
                        <div style={styles.iconContainer}>
                            <Building2 size={30} />
                        </div>
                        <span style={styles.optionTitle}>Employer</span>
                        <span style={styles.optionDesc}>I am looking to hire top-tier talent</span>
                    </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
            <style>{`
                .role-option:hover {
                    border-color: var(--color-brand-accent) !important;
                    transform: translateY(-5px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                }
            `}</style>
        </div>
    );
};

export default RoleSelection;
