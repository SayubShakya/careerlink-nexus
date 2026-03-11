import { useGetProfile, usePutUpdateProfile } from '@/hooks/api/profile/useProfile';
import { ROUTES } from '@/routes/routes';
import { useTheme } from '@/hooks/useTheme';
import {
    User,
    Mail,
    Shield,
    Settings,
    Loader2,
    CheckCircle2,
    Briefcase,
    Target,
    Save,
    UserCircle,
    Lock,
    Eye,
    EyeOff,
    Moon,
    Sun,
    Bell,
    Globe,
    Monitor,
    Camera,
    Image,
    Plus,
    MapPin,
    Phone
} from 'lucide-react';
import { useEffect, useState } from 'react';

const MyProfile = () => {
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('personal'); // 'personal', 'security', 'preferences'
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        profile_picture: '',
        location: '',
        phone: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [language, setLanguage] = useState('en');

    const { data: serverProfile, isLoading: profileLoading } = useGetProfile();
    console.log(serverProfile, "serverProfile")
    const { mutate: updateProfile, isPending: saving } = usePutUpdateProfile();

    useEffect(() => {
        if (serverProfile) {
            setProfile({
                firstName: serverProfile?.firstName || '',
                lastName: serverProfile?.lastName || '',
                email: serverProfile?.email || '',
                profile_picture: serverProfile?.profile_picture || '',
                location: serverProfile?.Profile?.location || '',
                phone: serverProfile?.Profile?.phone || ''
            });
            if (serverProfile?.profile_picture) {
                setPreviewUrl(`/${serverProfile.profile_picture}`);
            }
        }
    }, [serverProfile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('firstName', profile.firstName);
        formData.append('lastName', profile.lastName);
        formData.append('location', profile.location);
        formData.append('phone', profile.phone);
        if (selectedFile) {
            formData.append('avatar', selectedFile);
        }

        updateProfile(formData);
    };

    if (profileLoading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#F8FAFC' }}>
            <Loader2 className="animate-spin" size={48} color="#3E61FF" />
        </div>
    );

    return (
        <div className="profile-root">
            <style>{`
                .profile-root {
                    min-height: 100vh;
                    background-color: var(--bg-dashboard);
                    padding-bottom: 80px;
                    font-family: 'Inter', system-ui, sans-serif;
                    transition: background-color 0.3s;
                }

                /* COMPACT HERO */
                .profile-hero {
                    background: linear-gradient(135deg, #3E61FF 0%, #6366F1 60%, #8B5CF6 100%);
                    padding: 30px 80px 60px;
                    border-radius: 0 0 50px 50px;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 20px 60px rgba(62, 97, 255, 0.15);
                    min-height: 200px;
                }

                /* Decorative Background Patterns */
                .profile-hero::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -10%;
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
                    border-radius: 50%;
                }
                .profile-hero::after {
                    content: '';
                    position: absolute;
                    bottom: -30%;
                    right: -5%;
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                    border-radius: 50%;
                }

                .hero-visual { 
                    position: relative; 
                    z-index: 10; 
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                    gap: 16px; 
                    text-align: center;
                }

                .avatar-badge {
                    width: 120px;
                    height: 120px;
                    background: white;
                    color: #3E61FF;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3rem;
                    font-weight: 900;
                    box-shadow: 0 15px 30px rgba(0,0,0,0.2);
                    border: 5px solid rgba(255,255,255,0.4);
                    position: relative;
                    cursor: pointer;
                    overflow: visible; /* To allow the camera icon pill to show */
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    background-size: cover;
                    background-position: center;
                }
                .avatar-badge:hover { transform: translateY(-5px) scale(1.02); }
                
                .upload-overlay {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    background: #3E61FF;
                    color: white;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 3px solid white;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                    transition: 0.2s;
                    z-index: 20;
                }
                .avatar-badge:hover .upload-overlay { transform: scale(1.1); background: #2B4BDA; }

                .avatar-img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    object-fit: cover;
                }

                .hero-text h1 { 
                    font-size: 2.2rem; 
                    font-weight: 900; 
                    color: white; 
                    letter-spacing: -0.04em; 
                    margin: 0 0 6px 0; 
                    text-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                .hero-text p { 
                    font-size: 0.8rem; 
                    color: white; 
                    font-weight: 800; 
                    margin: 0; 
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    background: rgba(255,255,255,0.2);
                    padding: 5px 16px;
                    border-radius: 100px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.3);
                }

                /* SETTINGS CONTENT - COMPACT CLEAN LAYOUT */
                .settings-grid {
                    max-width: 1200px;
                    margin: 20px auto 60px; /* Reduced margin */
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 40px;
                    padding: 0 40px;
                    align-items: start;
                }

                .side-nav { 
                    display: flex; 
                    flex-direction: column; 
                    gap: 12px; 
                }
                
                .nav-card {
                    padding: 18px 24px;
                    border-radius: 16px;
                    background: var(--card-dashboard);
                    border: 1px solid var(--border-dashboard);
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    font-weight: 800;
                    color: var(--text-muted);
                    cursor: pointer;
                    transition: 0.2s;
                    box-shadow: var(--shadow-sm);
                    font-size: 0.9rem;
                }
                .nav-card:hover { transform: translateX(5px); color: var(--color-brand-accent); }
                .nav-card.active { 
                    border-color: #3E61FF; 
                    color: #3E61FF; 
                    background: var(--bg-dashboard);
                    box-shadow: 0 8px 20px rgba(62, 97, 255, 0.15);
                }
                .dark-theme .nav-card.active { background: rgba(62, 97, 255, 0.1); color: white; border-color: transparent; }

                .main-settings-card {
                    background: var(--card-dashboard);
                    border: 1px solid var(--border-dashboard);
                    border-radius: 24px;
                    padding: 32px; /* Reduced padding */
                    box-shadow: var(--shadow-premium);
                    min-height: auto;
                }

                .form-section-title {
                    font-size: 1.8rem;
                    font-weight: 950;
                    color: var(--text-main);
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .form-section-subtitle { font-size: 1rem; color: var(--text-muted); font-weight: 600; margin-bottom: 40px; line-height: 1.5; }

                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
                .full-col { grid-column: 1 / -1; }

                .input-group { display: flex; flex-direction: column; gap: 12px; }
                .input-group label { font-size: 0.85rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
                .input-field {
                    width: 100%;
                    padding: 16px 20px;
                    border: 1.5px solid var(--border-dashboard);
                    border-radius: 16px;
                    background: var(--bg-dashboard);
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--text-main);
                    outline: none;
                    transition: 0.2s;
                }
                .input-field:focus { border-color: #3E61FF; background: var(--card-dashboard); box-shadow: 0 0 0 4px rgba(62, 97, 255, 0.1); }
                .input-field:disabled { 
                    background: var(--bg-dashboard); 
                    color: var(--text-muted); 
                    cursor: not-allowed;
                    opacity: 0.7;
                    border-color: transparent;
                }

                .email-lock-badge {
                    position: absolute;
                    right: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(62, 97, 255, 0.1);
                    color: var(--color-brand-accent);
                    padding: 6px 12px;
                    border-radius: 8px;
                    font-size: 0.65rem;
                    font-weight: 900;
                    letter-spacing: 0.1em;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .pref-card {
                    border: 1px solid var(--border-dashboard);
                    border-radius: 20px;
                    padding: 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                    transition: 0.2s;
                    background: var(--bg-dashboard);
                }
                .pref-card:hover { border-color: #3E61FF; transform: translateY(-3px); }

                .theme-toggle-group {
                    background: var(--card-dashboard);
                    padding: 6px;
                    border-radius: 14px;
                    display: flex;
                    gap: 4px;
                    border: 1px solid var(--border-dashboard);
                }
                .theme-btn {
                    padding: 10px 20px;
                    border-radius: 10px;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 800;
                    font-size: 0.85rem;
                    transition: 0.2s;
                    color: var(--text-muted);
                    background: transparent;
                }
                .theme-btn.active { background: var(--text-main); color: var(--bg-main); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

                .save-btn {
                    margin-top: 48px;
                    padding: 16px 36px;
                    background: var(--color-brand-accent);
                    color: white;
                    border: none;
                    border-radius: 16px;
                    font-size: 1rem;
                    font-weight: 850;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transition: 0.3s;
                    box-shadow: 0 10px 25px rgba(62, 97, 255, 0.25);
                }
                .save-btn:hover { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(62, 97, 255, 0.4); }

                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>

            {/* PROFILE HERO */}
            <div className="profile-hero">
                <div className="hero-visual">
                    <label htmlFor="avatar-upload" className="avatar-badge">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Profile" className="avatar-img" />
                        ) : (
                            profile?.firstName ? profile.firstName[0].toUpperCase() : 'S'
                        )}
                        <div className="upload-overlay">
                            <Camera size={18} />
                        </div>
                    </label>
                    <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <div className="hero-text">
                        <h1>{profile.firstName} {profile.lastName}</h1>
                        <p>Nexus Global Community Member</p>
                    </div>
                </div>
            </div>

            {/* SECTIONS GRID */}
            <div className="settings-grid">
                <div className="side-nav">
                    <div
                        className={`nav-card ${activeTab === 'personal' ? 'active' : ''}`}
                        onClick={() => setActiveTab('personal')}
                    >
                        <UserCircle size={22} /> Personal Settings
                    </div>

                    <div
                        className={`nav-card ${activeTab === 'preferences' ? 'active' : ''}`}
                        onClick={() => setActiveTab('preferences')}
                    >
                        <Settings size={22} /> App Preferences
                    </div>
                </div>

                <div className="main-settings-card">
                    {activeTab === 'personal' && (
                        <>
                            <h2 className="form-section-title">
                                <User size={28} color="#3E61FF" strokeWidth={3} /> Personal Details
                            </h2>
                            <p className="form-section-subtitle">Manage your name and contact information across the platform.</p>

                            <form onSubmit={handleSubmit}>
                                <div className="form-grid">
                                    <div className="input-group">
                                        <label>First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={profile?.firstName}
                                            onChange={handleChange}
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={profile.lastName}
                                            onChange={handleChange}
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                    <div className="input-group full-col">
                                        <label>Email Address</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="email"
                                                value={profile.email}
                                                className="input-field"
                                                disabled
                                            />
                                            <span className="email-lock-badge">
                                                <Lock size={12} /> LOCKED
                                            </span>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label><MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={profile.location}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="e.g. Kathmandu, Nepal"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label><Phone size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />Contact Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profile.phone}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="e.g. +977 9800000000"
                                        />
                                    </div>
                                </div>
                                <button className="save-btn" disabled={saving}>
                                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        </>
                    )}



                    {activeTab === 'preferences' && (
                        <>
                            <h2 className="form-section-title">
                                <Settings size={28} color="var(--color-brand-accent)" strokeWidth={3} /> App Preferences
                            </h2>
                            <p className="form-section-subtitle">Customize your experience and theme across the Nexus platform.</p>

                            <div className="pref-card">
                                <div>
                                    <div style={{ fontWeight: 850, color: 'var(--text-main)', marginBottom: '4px' }}>Platform Theme</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Choose between Light and Dark mode.</div>
                                </div>
                                <div className="theme-toggle-group">
                                    <button
                                        className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                                        onClick={() => toggleTheme('light')}
                                    >
                                        <Sun size={16} /> Light
                                    </button>
                                    <button
                                        className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                                        onClick={() => toggleTheme('dark')}
                                    >
                                        <Moon size={16} /> Dark
                                    </button>
                                </div>
                            </div>

                            <div className="pref-card">
                                <div>
                                    <div style={{ fontWeight: 850, color: 'var(--text-main)', marginBottom: '4px' }}>Notification Alerts</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Get email alerts for new job matches.</div>
                                </div>
                                <div
                                    onClick={() => setEmailNotifications(!emailNotifications)}
                                    style={{
                                        width: '44px',
                                        height: '24px',
                                        background: emailNotifications ? '#3E61FF' : '#CBD5E1',
                                        borderRadius: '100px',
                                        position: 'relative',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.3s ease'
                                    }}
                                >
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        background: 'white',
                                        borderRadius: '50%',
                                        position: 'absolute',
                                        top: '2px',
                                        left: emailNotifications ? '22px' : '2px',
                                        transition: 'left 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }} />
                                </div>
                            </div>

                            <div className="pref-card">
                                <div>
                                    <div style={{ fontWeight: 850, color: 'var(--text-main)', marginBottom: '4px' }}>Preferred Language</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Set your default app language.</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: 'var(--text-main)' }}>
                                    <div style={{ position: 'relative' }}>
                                        <Globe size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                                        <select
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value)}
                                            style={{
                                                appearance: 'none',
                                                padding: '10px 16px 10px 40px',
                                                borderRadius: '12px',
                                                border: '1px solid var(--border-dashboard)',
                                                background: 'var(--bg-dashboard)',
                                                fontWeight: '800',
                                                color: 'var(--text-main)',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem',
                                                minWidth: '160px',
                                                outline: 'none'
                                            }}
                                        >
                                            <option value="en">English (US)</option>
                                            <option value="es">Español (ES)</option>
                                            <option value="fr">Français (FR)</option>
                                            <option value="de">Deutsch (DE)</option>
                                            <option value="jp">日本語 (JP)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
