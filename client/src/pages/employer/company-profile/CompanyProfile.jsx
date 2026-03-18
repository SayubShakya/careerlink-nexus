import React, { useState, useEffect } from 'react';
import '@/styles/ProfessionalGlass.css';
import { Camera, MapPin, Globe, Building2, Save, AlertCircle, CheckCircle2, Loader2, Info } from 'lucide-react';
import { useGetCompanyProfile, useUpdateCompanyProfile } from '@/hooks/api/employer/useEmployer';

// --- Mini Sky Scene (Shared from Dashboard) ---
const PageHeroSky = ({ timeOfDay }) => (
    <div className="dash-sky-scene">
        {timeOfDay === 'night' && (
            <>
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="dash-star" style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        width: `${2 + Math.random() * 2}px`,
                        height: `${2 + Math.random() * 2}px`,
                    }} />
                ))}
                <div className="dash-moon">
                    <div className="dash-moon-crater" style={{ width: 8, height: 8, top: 8, left: 12 }} />
                </div>
            </>
        )}
        {timeOfDay === 'morning' && (
            <>
                <div className="dash-sun dash-morning-sun">
                    <div className="dash-sun-ray" />
                    <div className="dash-sun-ray" style={{ transform: 'rotate(60deg)' }} />
                </div>
                <div className="dash-cloud dash-cloud-1" />
            </>
        )}
        {(timeOfDay === 'afternoon' || timeOfDay === 'evening') && (
            <>
                <div className={timeOfDay === 'afternoon' ? "dash-sun dash-afternoon-sun" : "dash-sunset-orb"} />
                <div className="dash-cloud dash-cloud-1" />
                <div className="dash-cloud dash-cloud-2" />
            </>
        )}
    </div>
);

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
                const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace('/api', '');
                const fullBaseUrl = baseUrl.startsWith('http') ? baseUrl : window.location.origin + baseUrl;
                setLogoPreview(serverCompany.profile_picture.startsWith('http') ? 
                    serverCompany.profile_picture : 
                    `${fullBaseUrl}/uploads/${serverCompany.profile_picture.replace(/^(\/?uploads\/|\/)/, '')}`.replace(/([^:]\/)\/+/g, "$1").replace(/\\/g, '/')
                );
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
            let processedWebsite = formData.website.trim();
            if (processedWebsite && !/^https?:\/\//i.test(processedWebsite)) {
                processedWebsite = `https://${processedWebsite}`;
            }

            const data = new FormData();
            data.append('companyName', formData.companyName);
            data.append('description', formData.description);
            data.append('location', formData.location);
            data.append('companyWebsite', processedWebsite);
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

    const hour = new Date().getHours();
    const timeOfDay = hour >= 5 && hour < 12 ? 'morning' : hour >= 12 && hour < 17 ? 'afternoon' : hour >= 17 && hour < 20 ? 'evening' : 'night';

    const styles = {
        pageContainer: {
            padding: '60px 32px',
            maxWidth: '1400px',
            margin: '0 auto',
            fontFamily: 'var(--font-body)',
            position: 'relative',
            zIndex: 2
        },
        headerHero: {
            padding: '48px',
            marginBottom: '40px',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '220px',
            borderRadius: '24px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            zIndex: 2
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
            padding: '60px',
            background: 'var(--glass-surface)',
            backdropFilter: 'blur(var(--glass-blur))',
            borderRadius: '28px',
            border: '1px solid var(--glass-border)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
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
            background: 'var(--glass-accent)',
            color: 'white',
            padding: '18px 48px',
            borderRadius: '16px',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '900',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            marginTop: '16px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-display)',
            boxShadow: '0 10px 25px -5px rgba(63, 81, 181, 0.4)'
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
        <div className="glass-main" style={{ position: 'relative' }}>
             {/* Ambient Background Glows */}
            <div className="glow-effect" style={{ top: '10%', left: '-5%', background: '#60A5FA', width: '300px', height: '300px', opacity: 0.15 }} />
            <div className="glow-effect" style={{ top: '50%', right: '-5%', background: '#3F51B5', width: '400px', height: '400px', opacity: 0.1 }} />

            <div style={styles.pageContainer}>
                <div className="glass-reveal">
                    {/* Operational Hero Section */}
                    <div style={styles.headerHero} className={`dash-hero-${timeOfDay}`}>
                        <PageHeroSky timeOfDay={timeOfDay} />
                        <div style={{ position: 'relative', zIndex: 2, display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ maxWidth: '650px' }}>
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '10px 18px',
                                    background: 'rgba(255,255,255,0.15)',
                                    border: '1px solid rgba(255,255,255,0.25)',
                                    borderRadius: '14px',
                                    fontSize: '0.7rem',
                                    fontWeight: '900',
                                    color: 'white',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.12em',
                                    marginBottom: '20px',
                                    backdropFilter: 'blur(16px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}>
                                    <Building2 size={14} fill="white" /> Operational Identity
                                </div>
                                <h1 style={{
                                    fontSize: '3.6rem',
                                    fontWeight: '950',
                                    color: 'white',
                                    letterSpacing: '-0.05em',
                                    marginBottom: '12px',
                                    lineHeight: '1',
                                    textShadow: '0 4px 20px rgba(0,0,0,0.3)'
                                }}>
                                    My Company.
                                </h1>
                                <p style={{
                                    fontSize: '1.2rem',
                                    color: 'rgba(255,255,255,0.75)',
                                    fontWeight: '600',
                                    maxWidth: '500px',
                                    marginBottom: '0',
                                    lineHeight: '1.5'
                                }}>
                                    Define your company's presence in the recruitment matrix.
                                </p>
                            </div>

                            <div className="glass-panel" style={{
                                background: 'rgba(255,255,255,0.08)',
                                backdropFilter: 'blur(24px)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '28px',
                                padding: '32px 40px',
                                textAlign: 'center',
                                minWidth: '200px',
                                boxShadow: '0 15px 35px rgba(0,0,0,0.2)'
                            }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    color: 'rgba(255,255,255,0.5)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em'
                                }}>Status</span>
                                <div style={{ fontSize: '1rem', fontWeight: '950', color: 'white', letterSpacing: '0.05em', margin: '4px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <div className="pulse-dot" style={{ background: '#10B981', boxShadow: '0 0 12px #10B981', width: '10px', height: '10px' }} />
                                    LIVE
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Primary Glass Panel */}
                    <div className="glass-panel" style={styles.glassPanel}>
                        {isProfileLoading ? (
                            <div style={{ padding: '80px', textAlign: 'center', color: 'var(--glass-text-muted)' }}>
                                <Loader2 className="animate-spin" size={40} />
                                <p style={{ marginTop: '16px', fontWeight: '600' }}>Getting your info...</p>
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
                                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--theme-text-muted)' }}>ADD LOGO</span>
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
                                                        placeholder="Write your company's name"
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
                                                <div style={styles.formGroup}>                                                     <label style={styles.label}>Where is your company? *</label>
                                                    <div style={{ position: 'relative' }}>
                                                        <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--glass-accent-light)' }} />
                                                        <input
                                                            type="text"
                                                            name="location"
                                                            value={formData.location}
                                                            onChange={handleInputChange}
                                                            placeholder="Example: Kathmandu, Nepal"
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
                                            <div className="glass-reveal" style={{ animationDelay: '0.4s' }}>                                                 <div style={styles.formGroup}>
                                                    <label style={styles.label}>Website Link</label>
                                                    <div style={{ position: 'relative' }}>
                                                        <Globe size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--glass-accent-light)' }} />
                                                        <input
                                                            type="text"
                                                            name="website"
                                                            value={formData.website}
                                                            onChange={handleInputChange}
                                                            placeholder="example.com (e.g. honeybee.com)"
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
                                                <label style={styles.label}>About the company *</label>
                                                <textarea
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleInputChange}
                                                    placeholder="Tell us what your company does and why it's a good place to work."
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
                                                    <><Loader2 className="animate-spin" size={20} /> WAIT...</>
                                                ) : (
                                                    <><Save size={20} className="text-gradient-sapphire" /> SAVE</>
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
                    <span>All saved!</span>
                </div>
            )}

            <style>{`
                .glass-input:focus {
                    background: var(--theme-bg-subtle) !important;
                    border-color: var(--glass-accent-light) !important;
                    box-shadow: 0 0 0 4px var(--glass-accent-glow) !important;
                    transform: translateY(-1px);
                }

                .glass-logo-upload:hover {
                    border-color: var(--glass-accent-light) !important;
                    background: rgba(255, 255, 255, 0.05) !important;
                    transform: translateY(-4px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                }

                .btn-scale { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .btn-scale:hover { transform: scale(1.02) translateY(-2px); filter: brightness(1.1); }
                .btn-scale:active { transform: scale(0.98); }

                .pulse-dot {
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
                    background: var(--theme-bg-subtle);
                    border: 1px solid var(--theme-border);
                    color: var(--theme-text-primary);
                }
                
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .animate-spin {
                    animation: spin-slow 1s linear infinite;
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
