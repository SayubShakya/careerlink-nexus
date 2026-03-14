import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import authIllustration from '@/assets/images/auth-illustration.png';

import { Eye, EyeOff } from 'lucide-react';
import { ROUTES } from '@/routes/routes';
import usePostRegisterEmployer from '@/hooks/api/auth/usePostRegisterEmployer';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { toast } from 'react-hot-toast';

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
    row: {
        display: 'flex',
        gap: '20px',
        marginBottom: '20px'
    },
    inputGroup: {
        flex: 1,
        marginBottom: '20px'
    },
    label: {
        display: 'block',
        fontSize: '0.85rem',
        fontWeight: '600',
        color: 'var(--color-brand-primary)',
        marginBottom: '8px'
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'all 0.2s'
    },
    errorText: {
        color: '#E53E3E',
        fontSize: '0.75rem',
        marginTop: '4px'
    },
    serverErrorBox: {
        backgroundColor: '#FFF5F5',
        border: '1px solid #FEB2B2',
        borderRadius: '8px',
        padding: '12px 16px',
        marginBottom: '20px',
        color: '#C53030',
        fontSize: '0.85rem'
    },
    checkboxGroup: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        marginBottom: '30px',
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
        marginBottom: '20px',
        transition: 'background-color 0.2s'
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
    },
    backBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        marginBottom: '20px',
        padding: 0
    }
};

const EmployerSignup = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const role = localStorage.getItem('role');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        companyName: '',
        companyWebsite: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: false
    });
    const [errors, setErrors] = useState({});

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await axios.post('http://localhost:5000/api/auth/google/verify', {
                    token: tokenResponse.access_token,
                    role: 'employer',
                    companyName: formData.companyName,
                    companyWebsite: formData.companyWebsite
                });

                if (res.status === 201) {
                    toast.success('Registration successful! Please log in.');
                    navigate(ROUTES.LOGIN);
                    return;
                }

                // If user was already registered
                const { token, data } = res.data;
                localStorage.setItem("userToken", token);
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("role", data.role);
                toast.success('Login successful!');
                window.location.href = data.role === 'job_seeker' ? ROUTES.JOBSEEKER_DASHBOARD : ROUTES.EMPLOYER_DASHBOARD;
            } catch (error) {
                toast.error(error.response?.data?.message || 'Google signup failed');
                console.error(error);
            }
        },
        onError: () => toast.error('Google signup failed'),
    });

    useEffect(() => {
        if (isAuthenticated()) {
            if (role === 'job_seeker') {
                navigate(ROUTES.JOBSEEKER_DASHBOARD);
            } else if (role === 'employer') {
                navigate(ROUTES.EMPLOYER_DASHBOARD);
            }
        }
    }, [isAuthenticated, role, navigate]);

    const handleGoogleClick = () => {
        if (!formData.companyName.trim() || !formData.companyWebsite.trim()) {
            toast.error('Employers must provide Company Name and Website above before registering via Google.', { duration: 6000 });
            setErrors({
                ...errors,
                companyName: !formData.companyName.trim() ? "Required for Google Sign up" : "",
                companyWebsite: !formData.companyWebsite.trim() ? "Required for Google Sign up" : ""
            });
            return;
        }
        handleGoogleLogin();
    };
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Extracts the root domain (e.g. 'nexus.com') from a URL or plain domain string
    const extractDomain = (website) => {
        try {
            // Prefix with protocol if missing so the URL parser works
            const url = website.startsWith('http') ? website : `https://${website}`;
            const hostname = new URL(url).hostname;
            // Remove 'www.' prefix if present and return lowercase
            return hostname.replace(/^www\./, '').toLowerCase();
        } catch {
            // Fallback: strip protocol/www manually
            return website
                .replace(/^https?:\/\//, '')
                .replace(/^www\./, '')
                .split('/')[0]
                .toLowerCase();
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';

        // Website validation
        if (!formData.companyWebsite.trim()) {
            newErrors.companyWebsite = 'Company website is required';
        } else {
            const websiteDomain = extractDomain(formData.companyWebsite);
            if (!websiteDomain.includes('.')) {
                newErrors.companyWebsite = 'Please enter a valid website (e.g. company.com)';
            } else {
                // Cross-validate with email domain if email is already filled
                if (formData.email && formData.email.includes('@')) {
                    const emailDomain = formData.email.split('@')[1]?.toLowerCase();
                    if (emailDomain && emailDomain !== websiteDomain) {
                        newErrors.email = `Work email domain (@${emailDomain}) must match the company website (${websiteDomain})`;
                    }
                }
            }
        }

        // Email validation
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Valid work email is required';
        }

        if (!formData.password || formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.terms) {
            newErrors.terms = 'You must accept the terms';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear this field's error
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
        // When website or email changes, also clear the domain cross-validation error on email
        if (name === 'companyWebsite' || name === 'email') {
            setErrors(prev => ({ ...prev, email: '' }));
        }
    };

    const { mutate: register, isPending: loading } = usePostRegisterEmployer();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        register(formData, {
            onSuccess: () => {
                navigate(ROUTES.LOGIN, { state: { message: 'Registration successful! Please log in.' } });
            }
        });
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.card}>
                <div style={styles.leftColumn} className="auth-left-hide">

                    <img src={authIllustration} alt="Authentication" style={styles.illustration} />
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--color-brand-primary)', marginBottom: '10px' }}>
                        Grow Your Team
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '300px' }}>
                        Access a curated pool of exceptional talent for your industry-defining roles.
                    </p>
                </div>

                <div style={styles.rightColumn}>
                    <button style={styles.backBtn} onClick={() => navigate(ROUTES.REGISTER)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Back to Selection
                    </button>

                    <h2 style={styles.formTitle}>Employer Sign Up</h2>
                    <p style={styles.formSubtitle}>Join thousands of top companies</p>

                    <form onSubmit={handleSubmit}>


                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Company Name</label>
                            <input
                                type="text"
                                name="companyName"
                                placeholder="Enter company name"
                                style={{
                                    ...styles.input,
                                    borderColor: errors.companyName ? '#E53E3E' : 'var(--border-subtle)'
                                }}
                                value={formData.companyName}
                                onChange={handleChange}
                                className="auth-input"
                            />
                            {errors.companyName && <p style={styles.errorText}>{errors.companyName}</p>}
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Company Website</label>
                            <input
                                type="text"
                                name="companyWebsite"
                                placeholder="e.g. nexuspartner.com"
                                style={{
                                    ...styles.input,
                                    borderColor: errors.companyWebsite ? '#E53E3E' : 'var(--border-subtle)'
                                }}
                                value={formData.companyWebsite}
                                onChange={handleChange}
                                className="auth-input"
                            />
                            {errors.companyWebsite && <p style={styles.errorText}>{errors.companyWebsite}</p>}
                            {!errors.companyWebsite && formData.companyWebsite && (() => {
                                try {
                                    const url = formData.companyWebsite.startsWith('http') ? formData.companyWebsite : `https://${formData.companyWebsite}`;
                                    const domain = new URL(url).hostname.replace(/^www\./, '');
                                    if (domain.includes('.')) return (
                                        <p style={{ color: '#718096', fontSize: '0.75rem', marginTop: '4px' }}>
                                            ✉️ Work email must end in <strong>@{domain}</strong>
                                        </p>
                                    );
                                } catch { return null; }
                            })()}
                        </div>



                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Work Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                style={{
                                    ...styles.input,
                                    borderColor: errors.email ? '#E53E3E' : 'var(--border-subtle)'
                                }}
                                value={formData.email}
                                onChange={handleChange}
                                className="auth-input"
                            />
                            {errors.email && <p style={styles.errorText}>{errors.email}</p>}
                        </div>

                        <div style={styles.row} className="form-row">
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Enter your password"
                                        style={{
                                            ...styles.input,
                                            borderColor: errors.password ? '#E53E3E' : 'var(--border-subtle)',
                                            paddingRight: '45px'
                                        }}
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="auth-input"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: 'var(--text-muted)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '4px'
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.password && <p style={styles.errorText}>{errors.password}</p>}
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Confirm Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        placeholder="Enter confirm password"
                                        style={{
                                            ...styles.input,
                                            borderColor: errors.confirmPassword ? '#E53E3E' : 'var(--border-subtle)',
                                            paddingRight: '45px'
                                        }}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="auth-input"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: 'var(--text-muted)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '4px'
                                        }}
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p style={styles.errorText}>{errors.confirmPassword}</p>}
                            </div>
                        </div>

                        <div style={styles.checkboxGroup}>
                            <input
                                type="checkbox"
                                name="terms"
                                checked={formData.terms}
                                onChange={handleChange}
                                style={{ marginTop: '4px' }}
                            />
                            <div>
                                <label>
                                    I agree to the <span style={styles.link}>Terms & Conditions</span> and <span style={styles.link}>Privacy Policy</span>
                                </label>
                                {errors.terms && <p style={styles.errorText}>{errors.terms}</p>}
                            </div>
                        </div>

                        <button type="submit" style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }} className="auth-submit-btn" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Create Employer Account'}
                        </button>

                        <div style={{ textAlign: 'center', margin: '20px 0', fontSize: '0.8rem', color: '#CBD5E0', position: 'relative' }}>
                            <span style={{ backgroundColor: 'white', padding: '0 10px', position: 'relative', zIndex: 1 }}>or sign up with</span>
                            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px solid #E2E8F0', zIndex: 0 }}></div>
                        </div>

                        <button
                            type="button"
                            style={{
                                ...styles.submitBtn,
                                backgroundColor: 'white',
                                color: '#4A5568',
                                border: '1px solid #E2E8F0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                transition: 'all 0.2s ease',
                                marginBottom: '25px'
                            }}
                            className="google-btn"
                            onClick={handleGoogleClick}
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" style={{ width: '20px', height: '20px' }} />
                            Sign up with Google
                        </button>

                        <p style={styles.switchText}>
                            Already have an account?{' '}
                            <Link to={ROUTES.LOGIN} style={styles.link}>
                                Log In
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
            <style>{`
                .auth-input:focus {
                    border-color: var(--color-brand-accent) !important;
                    box-shadow: 0 0 0 3px rgba(62, 97, 255, 0.1);
                }
                .auth-submit-btn:hover {
                    background-color: var(--color-brand-accent) !important;
                }
                .google-btn:hover {
                    background-color: #F7FAFC !important;
                    border-color: #CBD5E0 !important;
                }
                @media (max-width: 768px) {
                    .auth-left-hide { display: none !important; }
                    .card { max-width: 500px !important; }
                    .form-row { flex-direction: column; gap: 0; }
                    .form-row > div { margin-bottom: 20px; }
                }
            `}</style>
        </div>
    );
};

export default EmployerSignup;
