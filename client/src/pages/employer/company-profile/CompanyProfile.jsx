import React, { useState, useEffect } from 'react';
import '@/styles/ProfessionalGlass.css';
import { Camera, MapPin, Globe, Building2, Save, AlertCircle, CheckCircle2, Loader2, Info } from 'lucide-react';
import { useGetCompanyProfile, useUpdateCompanyProfile } from '@/hooks/api/employer/useEmployer';

const CompanyProfile = () => {
    const { data: serverCompany, isLoading: isProfileLoading } = useGetCompanyProfile();
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateCompanyProfile();

    const [formData, setFormData] = useState({
        companyName: '',
        description: '',
        location: '',
        website: '',
    });

    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (serverCompany) {
            setFormData({
                companyName: serverCompany.companyName || '',
                description: serverCompany.description || '',
                location: serverCompany.location || '',
                website: serverCompany.companyWebsite || '',
            });
            if (serverCompany.profile_picture) {
                setLogoPreview(`/${serverCompany.profile_picture}`);
            }
        }
    }, [serverCompany]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogo(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.companyName.trim()) newErrors.companyName = 'Company Name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const data = new FormData();
            data.append('companyName', formData.companyName);
            data.append('description', formData.description);
            data.append('location', formData.location);
            data.append('companyWebsite', formData.website);
            if (logo) {
                data.append('logo', logo);
            }

            updateProfile(data, {
                onSuccess: () => {
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 3000);
                }
            });
        }
    };

    const styles = {
        pageContainer: {
            padding: '40px 32px',
            maxWidth: '1200px',
            margin: '0 auto',
            fontFamily: 'var(--font-body)',
        },
        headerHero: {
            marginBottom: '40px',
            position: 'relative',
        },
        overline: {
            fontSize: '0.75rem',
            fontWeight: '800',
            color: 'var(--glass-accent-light)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '12px',
            display: 'block'
        },
        title: {
            fontSize: '3.5rem',
            fontWeight: '800',
            color: 'var(--theme-text-primary)',
            fontFamily: 'var(--font-display)',
            marginBottom: '16px',
            letterSpacing: '-0.03em',
            lineHeight: '1'
        },
        subtitle: {
            color: 'var(--glass-text-secondary)',
            fontSize: '1.1rem',
            maxWidth: '600px',
            lineHeight: '1.6'
        },
        glassPanel: {
            padding: '50px',
            position: 'relative',
            overflow: 'hidden'
        },
        formGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '32px',
        },
        logoColumn: {
            gridColumn: 'span 4',
        },
        infoColumn: {
            gridColumn: 'span 8',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
        },
        formGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
        },
        label: {
            fontSize: '0.85rem',
            fontWeight: '700',
            color: 'var(--glass-text-primary)',
            letterSpacing: '0.02em'
        },
        input: {
            padding: '16px 20px',
            borderRadius: '16px',
            border: '1px solid var(--theme-border)',
            backgroundColor: 'var(--theme-bg-subtle)',
            fontSize: '1rem',
            color: 'var(--theme-text-primary)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            outline: 'none',
            fontFamily: 'var(--font-body)'
        },
        textarea: {
            padding: '16px 20px',
            borderRadius: '16px',
            border: '1px solid var(--theme-border)',
            backgroundColor: 'var(--theme-bg-subtle)',
            fontSize: '1rem',
            color: 'var(--theme-text-primary)',
            minHeight: '180px',
            resize: 'vertical',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            outline: 'none',
            lineHeight: '1.7',
            fontFamily: 'var(--font-body)'
        },
        logoDropzone: {
            aspectRatio: '1',
            borderRadius: '24px',
            border: '1px dashed var(--glass-border)',
            background: 'rgba(255, 255, 255, 0.01)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
        },
        saveButton: {
            background: 'var(--theme-bg-subtle)',
            color: 'var(--theme-text-primary)',
            padding: '16px 36px',
            borderRadius: '14px',
            border: '1px solid var(--theme-border)',
            fontSize: '0.95rem',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            marginTop: '16px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
        },
        statusBadge: {
            padding: '8px 16px',
            borderRadius: '100px',
            fontSize: '0.75rem',
            fontWeight: '800',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--glass-border)',
            color: 'var(--glass-text-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            position: 'absolute',
            top: '0',
            right: '0'
        }
    };

    return (
        <div className="glass-main">
            <div style={styles.pageContainer}>
                <div className="glass-reveal">
                    {/* Operational Hero Section */}
                    <div style={styles.headerHero}>
                        <div style={styles.statusBadge}>
                            <div className="pulse-dot" style={{ background: '#10B981', boxShadow: '0 0 12px #10B981' }} />
                            PROFILE ACTIVE
                        </div>
                        <span style={styles.overline}>Company Settings</span>
                        <h1 style={styles.title}>Company <span className="text-gradient-sapphire">Profile.</span></h1>
                        <p style={styles.subtitle}>
                            Manage your company profile and public brand.
                            Your profile here defines how candidates perceive your company.
                        </p>
                    </div>

                    {/* Primary Glass Panel */}
                    <div className="glass-panel" style={styles.glassPanel}>
                        {isProfileLoading ? (
                            <div style={{ padding: '80px', textAlign: 'center', color: 'var(--glass-text-muted)' }}>
                                <Loader2 className="animate-spin" size={40} />
                                <p style={{ marginTop: '16px', fontWeight: '600' }}>Synchronizing profile data…</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div style={styles.formGrid}>
                                    {/* Logo Section */}
                                    <div style={{ ...styles.logoColumn, animationDelay: '0.1s' }} className="glass-reveal">
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>COMPANY LOGO</label>
                                            <div
                                                style={styles.logoDropzone}
                                                onClick={() => document.getElementById('logoInput').click()}
                                                className="glass-logo-upload"
                                            >
                                                {logoPreview ? (
                                                    <img src={logoPreview} alt="Company Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                    <div style={{ textAlign: 'center' }}>
                                        <div className="icon-surface" style={{ width: '64px', height: '64px', margin: '0 auto 16px', borderRadius: '16px', backgroundColor: 'var(--theme-bg-subtle)', color: 'var(--theme-text-primary)' }}>
                                            <Building2 size={32} />
                                        </div>
                                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--theme-text-muted)' }}>UPLOAD LOGO</span>
                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    id="logoInput"
                                                    hidden
                                                    accept="image/*"
                                                    onChange={handleLogoChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fields Section */}
                                    <div style={styles.infoColumn}>
                                        <div className="glass-reveal" style={{ animationDelay: '0.2s' }}>
                                            <div style={styles.formGroup}>
                                                <label style={styles.label}>COMPANY NAME *</label>
                                                <div style={{ position: 'relative' }}>
                                                    <input
                                                        type="text"
                                                        name="companyName"
                                                        value={formData.companyName}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter legal company name"
                                                        style={{
                                                            ...styles.input,
                                                            width: '100%',
                                                            boxSizing: 'border-box',
                                                            borderColor: errors.companyName ? '#EF4444' : 'var(--glass-border)'
                                                        }}
                                                        className="glass-input"
                                                    />
                                                </div>
                                                {errors.companyName && (
                                                    <span style={{ fontSize: '0.75rem', color: '#EF4444', fontWeight: '700', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <AlertCircle size={14} /> {errors.companyName}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                            <div className="glass-reveal" style={{ animationDelay: '0.3s' }}>
                                                <div style={styles.formGroup}>
                                                    <label style={styles.label}>HEADQUARTERS *</label>
                                                    <div style={{ position: 'relative' }}>
                                                        <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--glass-accent-light)' }} />
                                                        <input
                                                            type="text"
                                                            name="location"
                                                            value={formData.location}
                                                            onChange={handleInputChange}
                                                            placeholder="City, Country"
                                                            style={{
                                                                ...styles.input,
                                                                paddingLeft: '48px',
                                                                width: '100%',
                                                                boxSizing: 'border-box',
                                                                borderColor: errors.location ? '#EF4444' : 'var(--glass-border)'
                                                            }}
                                                            className="glass-input"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="glass-reveal" style={{ animationDelay: '0.4s' }}>
                                                <div style={styles.formGroup}>
                                                    <label style={styles.label}>WEBSITE URL</label>
                                                    <div style={{ position: 'relative' }}>
                                                        <Globe size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--glass-accent-light)' }} />
                                                        <input
                                                            type="url"
                                                            name="website"
                                                            value={formData.website}
                                                            onChange={handleInputChange}
                                                            placeholder="https://company.com"
                                                            style={{
                                                                ...styles.input,
                                                                paddingLeft: '48px',
                                                                width: '100%',
                                                                boxSizing: 'border-box'
                                                            }}
                                                            className="glass-input"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="glass-reveal" style={{ animationDelay: '0.5s' }}>
                                            <div style={styles.formGroup}>
                                                <label style={styles.label}>COMPANY DESCRIPTION *</label>
                                                <textarea
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleInputChange}
                                                    placeholder="Share your company's mission, values, and culture…"
                                                    style={{
                                                        ...styles.textarea,
                                                        borderColor: errors.description ? '#EF4444' : 'var(--glass-border)'
                                                    }}
                                                    className="glass-input"
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="glass-reveal" style={{ animationDelay: '0.6s' }}>
                                            <button
                                                type="submit"
                                                style={styles.saveButton}
                                                className="btn-scale"
                                                disabled={isUpdating}
                                            >
                                                {isUpdating ? (
                                                    <><Loader2 className="animate-spin" size={20} /> SAVING…</>
                                                ) : (
                                                    <><Save size={20} className="text-gradient-sapphire" /> SAVE CHANGES</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {showSuccess && (
                <div style={{
                    position: 'fixed',
                    bottom: '40px',
                    right: '40px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#10B981',
                    padding: '16px 24px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    animation: 'slideIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    zIndex: 2000,
                    fontWeight: '800'
                }}>
                    <CheckCircle2 size={24} />
                    <span>Profile Saved Successfully</span>
                </div>
            )}

            <style>{`
                .glass-input:focus {
                    background: rgba(255, 255, 255, 0.05) !important;
                    border-color: var(--glass-accent-light) !important;
                    box-shadow: 0 0 20px rgba(59, 130, 246, 0.15) !important;
                }

                .glass-logo-upload:hover {
                    border-color: var(--glass-accent-light) !important;
                    background: rgba(59, 130, 246, 0.02) !important;
                    transform: translateY(-4px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                }

                .btn-scale { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
                .btn-scale:hover { transform: scale(1.05) translateY(-2px); border-color: var(--glass-accent-light); filter: brightness(1.1); }
                .btn-scale:active { transform: scale(0.95); }

                .pulse-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% { transform: scale(0.95); opacity: 0.8; }
                    50% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(0.95); opacity: 0.8; }
                }

                @keyframes slideIn {
                    from { transform: translateX(100px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                .icon-surface {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--glass-border);
                    color: white;
                }

                @media (max-width: 900px) {
                    div[style*="gridTemplateColumns: repeat(12, 1fr)"] {
                        grid-template-columns: 1fr !important;
                    }
                    div[style*="gridColumn: span 4"], div[style*="gridColumn: span 8"] {
                        grid-column: span 12 !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default CompanyProfile;
