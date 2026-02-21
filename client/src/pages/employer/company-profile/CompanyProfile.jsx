import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Globe, Building2, Save, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
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

            updateProfile(data);
        }
    };

    const styles = {
        pageContainer: {
            padding: 'var(--space-md)',
            animation: 'fadeIn 0.5s ease-out'
        },
        header: {
            marginBottom: 'var(--space-md)'
        },
        title: {
            fontSize: '2rem',
            fontWeight: '700',
            color: 'var(--text-main)',
            fontFamily: 'var(--font-heading)',
            marginBottom: '4px'
        },
        subtitle: {
            color: 'var(--text-muted)',
            fontSize: '1rem'
        },
        card: {
            background: 'var(--card-dashboard)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-md)',
            boxShadow: 'var(--shadow-premium)',
            border: '1px solid var(--border-dashboard)',
            maxWidth: '1000px',
            margin: '0 auto'
        },
        formGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-sm)',
            marginBottom: 'var(--space-sm)'
        },
        fullWidth: {
            gridColumn: '1 / -1'
        },
        formGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '1rem'
        },
        label: {
            fontSize: '0.9rem',
            fontWeight: '600',
            color: 'var(--text-main)'
        },
        input: {
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            border: '2px solid var(--border-dashboard)',
            background: 'var(--bg-subtle)',
            fontSize: '1rem',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            outline: 'none'
        },
        textarea: {
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            border: '2px solid var(--border-dashboard)',
            background: 'var(--bg-subtle)',
            fontSize: '1rem',
            minHeight: '150px',
            resize: 'vertical',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            outline: 'none'
        },
        logoSection: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-sm)',
            border: '2px dashed var(--border-dashboard)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            transition: 'all 0.3s',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: 'rgba(62, 97, 255, 0.02)'
        },
        logoPreview: {
            width: '120px',
            height: '120px',
            borderRadius: 'var(--radius-md)',
            objectFit: 'cover',
            marginBottom: '12px',
            boxShadow: 'var(--shadow-premium)'
        },
        placeholderLogo: {
            width: '120px',
            height: '120px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--border-dashboard)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-light)',
            marginBottom: '12px'
        },
        saveButton: {
            backgroundColor: 'var(--color-brand-accent)',
            color: 'white',
            padding: '14px 28px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            marginTop: '1rem',
            width: 'fit-content',
            boxShadow: '0 4px 14px 0 rgba(62, 97, 255, 0.39)'
        },
        errorText: {
            color: 'var(--color-danger)',
            fontSize: '0.8rem',
            marginTop: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
        },
        successToast: {
            position: 'fixed',
            bottom: 'var(--space-md)',
            right: 'var(--space-md)',
            backgroundColor: 'var(--color-success)',
            color: 'white',
            padding: '16px 24px',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'slideIn 0.3s ease-out',
            zIndex: 1000
        }
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.header}>
                <h1 style={styles.title}>Company Profile</h1>
                <p style={styles.subtitle}>Manage and update your company information</p>
            </div>

            <div style={styles.card}>
                {isProfileLoading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Loader2 className="animate-spin" size={32} />
                        <p>Loading profile...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{ ...styles.formGrid, gridTemplateColumns: '300px 1fr' }}>
                            {/* Logo Upload Section */}
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Company Logo</label>
                                <div
                                    style={styles.logoSection}
                                    onClick={() => document.getElementById('logoInput').click()}
                                    className="logo-upload-area"
                                >
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo Preview" style={styles.logoPreview} className="logo-preview-img" />
                                    ) : (
                                        <div style={styles.placeholderLogo}>
                                            <Building2 size={48} />
                                        </div>
                                    )}
                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-brand-accent)', fontWeight: '600' }}>
                                        {logoPreview ? 'Change Logo' : 'Upload Logo'}
                                    </span>
                                    <input
                                        type="file"
                                        id="logoInput"
                                        hidden
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                    />
                                </div>
                            </div>

                            {/* Basic Info Section */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Company Name *</label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleInputChange}
                                        placeholder="Enter your company name"
                                        style={{
                                            ...styles.input,
                                            borderColor: errors.companyName ? 'var(--color-danger)' : 'var(--border-dashboard)'
                                        }}
                                        className="profile-input"
                                    />
                                    {errors.companyName && (
                                        <span style={styles.errorText}><AlertCircle size={14} /> {errors.companyName}</span>
                                    )}
                                </div>

                                <div style={styles.formGrid}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Location *</label>
                                        <div style={{ position: 'relative' }}>
                                            <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                placeholder="e.g. Kathmandu, Nepal"
                                                style={{
                                                    ...styles.input,
                                                    paddingLeft: '40px',
                                                    borderColor: errors.location ? 'var(--color-danger)' : 'var(--border-dashboard)',
                                                    width: '100%',
                                                    boxSizing: 'border-box'
                                                }}
                                                className="profile-input"
                                            />
                                        </div>
                                        {errors.location && (
                                            <span style={styles.errorText}><AlertCircle size={14} /> {errors.location}</span>
                                        )}
                                    </div>

                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Website</label>
                                        <div style={{ position: 'relative' }}>
                                            <Globe size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                                            <input
                                                type="url"
                                                name="website"
                                                value={formData.website}
                                                onChange={handleInputChange}
                                                placeholder="https://example.com"
                                                style={{
                                                    ...styles.input,
                                                    paddingLeft: '40px',
                                                    borderColor: errors.website ? 'var(--color-danger)' : 'var(--border-dashboard)',
                                                    width: '100%',
                                                    boxSizing: 'border-box'
                                                }}
                                                className="profile-input"
                                            />
                                        </div>
                                        {errors.website && (
                                            <span style={styles.errorText}><AlertCircle size={14} /> {errors.website}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Tell us about your company, its mission, and what you do..."
                                style={{
                                    ...styles.textarea,
                                    borderColor: errors.description ? 'var(--color-danger)' : 'var(--border-dashboard)'
                                }}
                                className="profile-input"
                            ></textarea>
                            {errors.description && (
                                <span style={styles.errorText}><AlertCircle size={14} /> {errors.description}</span>
                            )}
                        </div>

                        <button
                            type="submit"
                            style={styles.saveButton}
                            className="save-button"
                            disabled={isUpdating}
                        >
                            {isUpdating ? 'Saving...' : <><Save size={20} /> Save Changes</>}
                        </button>
                    </form>
                )}
            </div>

            {showSuccess && (
                <div style={styles.successToast}>
                    <CheckCircle2 size={24} />
                    <span>Profile updated successfully!</span>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .logo-upload-area:hover {
                    border-color: var(--color-brand-accent) !important;
                    background-color: rgba(62, 97, 255, 0.05) !important;
                }
                .logo-preview-img {
                    animation: scaleIn 0.3s ease-out;
                }
                @keyframes scaleIn {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .profile-input:focus {
                    border-color: var(--color-brand-accent) !important;
                    background: white !important;
                    box-shadow: 0 0 0 4px rgba(62, 97, 255, 0.1);
                }
                .save-button:hover {
                    transform: translateY(-2px);
                    background-color: var(--color-brand-accent-hover) !important;
                    box-shadow: 0 6px 20px 0 rgba(62, 97, 255, 0.45);
                }
                .save-button:active {
                    transform: translateY(0);
                }
                .save-button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                @media (max-width: 768px) {
                    .card {
                        padding: var(--space-sm);
                    }
                    div[style*="gridTemplateColumns: 300px 1fr"] {
                        grid-template-columns: 1fr !important;
                    }
                    .save-button {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default CompanyProfile;
