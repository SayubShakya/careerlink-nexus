import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    User,
    GraduationCap,
    Briefcase,
    Wrench,
    Trophy,
    BookOpen,
    Award,
    Languages as LangIcon,
    Users,
    Share2,
    Plus,
    Trash2,
    Layout,
    Download,
    Eye,
    Crown,
    Save,
    MapPin,
    Mail,
    Phone,
    Globe
} from 'lucide-react';
import { useGetCVs, usePostCreatePlatformCV, usePutUpdatePlatformCV } from '@/hooks/api/cv/useCVs';
import toast from 'react-hot-toast';
import api from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import { useSearchParams } from 'react-router-dom';

const CVBuilder = () => {
    const [searchParams] = useSearchParams();
    const cvId = searchParams.get('id');

    // --- PREMIUM DESIGN TOKENS (HSL) ---
    const tokens = {
        primary: '228 100% 63%', // Elite Blue
        primaryDark: '228 100% 50%',
        accent: '262 83% 58%', // Purple accent
        bg: '210 20% 98%',
        surface: '0 0% 100%',
        textMain: '215 28% 17%',
        textMuted: '215 16% 47%',
        border: '214 32% 91%',
        radiusLg: '20px',
        radiusMd: '12px',
        shadowPremium: '0 20px 40px -12px rgba(0,0,0,0.1)'
    };

    const [cvData, setCvData] = useState({
        title: 'Untitled CV',
        template: 'professional',
        about: {
            firstName: '',
            lastName: '',
            designation: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            summary: '',
            socialLinks: [{ platform: 'LinkedIn', url: '' }]
        },
        education: [{ id: Date.now(), degree: '', institute: '', year: '' }],
        experience: [{ id: Date.now(), role: '', company: '', duration: '', tasks: '' }],
        skills: [''],
        achievements: [''],
        trainings: [''],
        awards: [''],
        languages: [{ lang: '', level: 'Native' }],
        references: [{ name: '', position: '', contact: '' }]
    });

    const [activeSection, setActiveSection] = useState('about');
    const [isTitleEditing, setIsTitleEditing] = useState(false);
    const middleScrollRef = useRef(null);

    const sectionsRef = {
        about: useRef(null),
        education: useRef(null),
        experience: useRef(null),
        skills: useRef(null),
        achievements: useRef(null),
        trainings: useRef(null),
        awards: useRef(null),
        languages: useRef(null),
        references: useRef(null)
    };

    const { data: cvs = [] } = useGetCVs();
    const { mutate: createCV, isPending: creating } = usePostCreatePlatformCV();
    const { mutate: updateCV, isPending: updating } = usePutUpdatePlatformCV();

    const isSaving = creating || updating;

    useEffect(() => {
        if (cvId && cvs.length > 0) {
            const existing = cvs.find(c => String(c.id || c._id) === String(cvId));
            if (existing && existing.content) {
                setCvData({
                    ...existing.content,
                    title: existing.title,
                    id: existing.id || existing._id
                });
            }
        }
    }, [cvId, cvs]);

    // 2. Scroll Sync (Intersection Observer)
    useEffect(() => {
        const observerOptions = {
            root: middleScrollRef.current,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const handleIntersection = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, observerOptions);
        Object.values(sectionsRef).forEach(ref => {
            if (ref.current) observer.observe(ref.current);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (sectionId) => {
        setActiveSection(sectionId);
        sectionsRef[sectionId]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // --- State Handlers ---
    const handleAboutChange = (field, value) => {
        setCvData(prev => ({
            ...prev,
            about: { ...prev.about, [field]: value }
        }));
    };

    const addItem = (section, initialValue) => {
        setCvData(prev => ({
            ...prev,
            [section]: [...prev[section], { id: Date.now(), ...initialValue }]
        }));
    };

    const removeItem = (section, id) => {
        setCvData(prev => ({
            ...prev,
            [section]: prev[section].filter(item => item.id !== id)
        }));
    };

    const updateItem = (section, id, field, value) => {
        setCvData(prev => ({
            ...prev,
            [section]: prev[section].map(item => item.id === id ? { ...item, [field]: value } : item)
        }));
    };

    const handleSave = () => {
        if (cvId || cvData.id) {
            updateCV({
                id: cvId || cvData.id,
                cvData: {
                    title: cvData.title,
                    content: cvData
                }
            });
        } else {
            createCV({
                title: cvData.title || `${cvData.about.firstName} CV`,
                content: cvData
            }, {
                onSuccess: (response) => {
                    const savedCV = response?.data?.cv;
                    if (savedCV) {
                        setCvData(prev => ({ ...prev, id: savedCV.id }));
                    }
                }
            });
        }
    };

    const handleDownload = async () => {
        const id = cvId || cvData.id;
        if (!id) {
            toast.error("Please save your CV first before downloading");
            return;
        }

        const downloadToast = toast.loading("Generating your PDF...");
        try {
            const response = await api.get(`${API_ENDPOINTS.CV.DOWNLOAD(id)}?t=${Date.now()}`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${cvData.title.replace(/\s+/g, '_')}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Download started!", { id: downloadToast });
        } catch (error) {
            console.error("Download error:", error);
            toast.error("Failed to download PDF. Please try again.", { id: downloadToast });
        }
    };

    const styles = {
        page: {
            display: 'grid',
            gridTemplateColumns: '180px 0.9fr 1.3fr',
            height: 'calc(100vh - 64px)',
            backgroundColor: `hsl(${tokens.bg})`,
            overflow: 'hidden',
            fontFamily: "'Inter', system-ui, sans-serif"
        },
        sidebar: {
            backgroundColor: 'white',
            borderRight: `1px solid hsl(${tokens.border})`,
            overflowY: 'auto',
            padding: '40px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
        },
        sidebarItem: (isActive) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 16px',
            borderRadius: tokens.radiusMd,
            color: isActive ? `hsl(${tokens.primary})` : `hsl(${tokens.textMuted})`,
            backgroundColor: isActive ? `hsla(${tokens.primary}, 0.08)` : 'transparent',
            fontWeight: isActive ? '800' : '600',
            fontSize: '0.88rem',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isActive ? 'translateX(4px)' : 'none'
        }),
        middle: {
            backgroundColor: 'white',
            overflowY: 'auto',
            padding: '0 40px 100px 40px',
            scrollPaddingTop: '100px',
            borderRight: `1px solid hsl(${tokens.border})`
        },
        header: {
            position: 'sticky',
            top: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            zIndex: 100,
            padding: '20px 0',
            borderBottom: `1px solid hsl(${tokens.border})`,
            marginBottom: '40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '24px',
            width: '100%'
        },
        titleContainer: {
            flex: 1,
            minWidth: '200px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
        },
        titleInput: {
            border: 'none',
            background: 'transparent',
            fontSize: '1.75rem',
            fontWeight: '900',
            color: `hsl(${tokens.textMain})`,
            outline: 'none',
            width: '100%',
            padding: '4px 0',
            letterSpacing: '-0.04em',
            transition: 'all 0.2s'
        },
        formSection: {
            marginBottom: '80px',
            scrollMarginTop: '120px'
        },
        sectionLabel: {
            fontSize: '1.75rem',
            fontWeight: '900',
            marginBottom: '32px',
            letterSpacing: '-0.04em',
            color: `hsl(${tokens.textMain})`,
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
        },
        card: {
            padding: '32px',
            borderRadius: tokens.radiusLg,
            border: `1px solid hsl(${tokens.border})`,
            backgroundColor: 'white',
            marginBottom: '24px',
            position: 'relative',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.02)',
            transition: 'all 0.3s ease'
        },
        input: {
            width: '100%',
            padding: '16px 20px',
            borderRadius: tokens.radiusMd,
            border: `1.5px solid hsl(${tokens.border})`,
            fontSize: '1rem',
            outline: 'none',
            transition: 'all 0.25s ease',
            backgroundColor: 'white',
            color: `hsl(${tokens.textMain})`,
            fontFamily: 'inherit'
        },
        previewPane: {
            padding: '40px',
            backgroundColor: '#E5E7EB',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
        },
        cvPaper: {
            width: '100%',
            maxWidth: '820px',
            minHeight: '1160px', // Proper A4 Ratio
            backgroundColor: 'white',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            padding: '60px 50px',
            color: '#111827',
            transition: 'all 0.3s ease',
            margin: '0 auto'
        },
        btnPrimary: {
            padding: '14px 28px',
            borderRadius: tokens.radiusMd,
            backgroundColor: `hsl(${tokens.primary})`,
            color: 'white',
            fontWeight: '800',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.95rem',
            boxShadow: `0 10px 20px -5px hsla(${tokens.primary}, 0.4)`,
            transition: 'all 0.3s'
        }
    };

    return (
        <div style={styles.page}>
            {/* Sidebar */}
            <aside style={styles.sidebar}>
                <div style={{ marginBottom: '40px', paddingLeft: '20px' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: '1000', color: `hsl(${tokens.primary})`, letterSpacing: '-0.02em' }}>CV BUILDER</h2>
                </div>
                {[
                    { id: 'about', label: 'About Me', icon: <User size={20} /> },
                    { id: 'education', label: 'Education', icon: <GraduationCap size={20} /> },
                    { id: 'experience', label: 'Work History', icon: <Briefcase size={20} /> },
                    { id: 'skills', label: 'Skills', icon: <Wrench size={20} /> },
                    { id: 'achievements', label: 'Successes', icon: <Trophy size={20} /> },
                    { id: 'trainings', label: 'Training', icon: <BookOpen size={20} /> },
                    { id: 'awards', label: 'Awards', icon: <Award size={20} /> },
                    { id: 'languages', label: 'Languages', icon: <LangIcon size={20} /> },
                    { id: 'references', label: 'References', icon: <Users size={20} /> },
                ].map(item => (
                    <div
                        key={item.id}
                        style={styles.sidebarItem(activeSection === item.id)}
                        onClick={() => scrollToSection(item.id)}
                    >
                        {item.icon} {item.label}
                    </div>
                ))}
            </aside>

            {/* Form */}
            <main style={styles.middle} ref={middleScrollRef}>
                <header style={styles.header}>
                    <div style={styles.titleContainer}>
                        <input
                            style={styles.titleInput}
                            value={cvData.title}
                            onFocus={() => setIsTitleEditing(true)}
                            onBlur={() => setIsTitleEditing(false)}
                            onChange={(e) => setCvData({ ...cvData, title: e.target.value })}
                        />
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            height: '2.5px',
                            width: isTitleEditing ? '100%' : '0%',
                            backgroundColor: `hsl(${tokens.primary})`,
                            transition: 'width 0.3s'
                        }} />
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexShrink: 0, alignItems: 'center' }}>
                        <button onClick={handleSave} disabled={isSaving} style={{ ...styles.btnPrimary, padding: '12px 20px', whiteSpace: 'nowrap' }}>
                            {isSaving ? 'Saving...' : <><Save size={18} /> Save Now</>}
                        </button>
                        <button onClick={handleDownload} style={{ ...styles.btnPrimary, backgroundColor: '#10B981', boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.4)', padding: '12px 20px', whiteSpace: 'nowrap' }}>
                            <Download size={18} /> Download PDF
                        </button>
                    </div>
                </header>

                {/* About */}
                <section id="about" ref={sectionsRef.about} style={styles.formSection}>
                    <h3 style={styles.sectionLabel}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `hsla(${tokens.primary}, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={20} color={`hsl(${tokens.primary})`} />
                        </div>
                        Tell us about yourself
                    </h3>
                    <div style={styles.card}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <input style={styles.input} placeholder="First Name" value={cvData.about.firstName} onChange={(e) => handleAboutChange('firstName', e.target.value)} />
                            <input style={styles.input} placeholder="Last Name" value={cvData.about.lastName} onChange={(e) => handleAboutChange('lastName', e.target.value)} />
                        </div>
                        <input style={{ ...styles.input, marginTop: '24px' }} placeholder="Headline (e.g. Senior Software Architect)" value={cvData.about.designation} onChange={(e) => handleAboutChange('designation', e.target.value)} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginTop: '24px' }}>
                            <input style={styles.input} placeholder="Email" value={cvData.about.email} onChange={(e) => handleAboutChange('email', e.target.value)} />
                            <input style={styles.input} placeholder="Phone" value={cvData.about.phone} onChange={(e) => handleAboutChange('phone', e.target.value)} />
                        </div>
                        <textarea
                            style={{ ...styles.input, marginTop: '24px', minHeight: '160px', lineHeight: '1.6' }}
                            placeholder="Write a short summary about yourself..."
                            value={cvData.about.summary}
                            onChange={(e) => handleAboutChange('summary', e.target.value)}
                        />
                    </div>
                </section>

                {/* Education */}
                <section id="education" ref={sectionsRef.education} style={styles.formSection}>
                    <h3 style={styles.sectionLabel}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `hsla(${tokens.primary}, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <GraduationCap size={20} color={`hsl(${tokens.primary})`} />
                        </div>
                        Your Education
                    </h3>
                    {cvData.education.map(edu => (
                        <div key={edu.id} style={styles.card}>
                            <button onClick={() => removeItem('education', edu.id)} style={{ position: 'absolute', top: '24px', right: '24px', border: 'none', background: 'transparent', color: '#EF4444', cursor: 'pointer', opacity: 0.6, zIndex: 10 }}><Trash2 size={20} /></button>
                            <input style={{ ...styles.input, marginBottom: '20px', fontWeight: '700', paddingRight: '50px' }} placeholder="Degree / Qualification" value={edu.degree} onChange={(e) => updateItem('education', edu.id, 'degree', e.target.value)} />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: '20px' }}>
                                <input style={styles.input} placeholder="University / Institute" value={edu.institute} onChange={(e) => updateItem('education', edu.id, 'institute', e.target.value)} />
                                <input style={styles.input} placeholder="Grad. Year" value={edu.year} onChange={(e) => updateItem('education', edu.id, 'year', e.target.value)} />
                            </div>
                        </div>
                    ))}
                    <button onClick={() => addItem('education', { degree: '', institute: '', year: '' })} style={{ ...styles.btnPrimary, background: 'transparent', color: `hsl(${tokens.primary})`, border: `2px dashed hsla(${tokens.primary}, 0.3)`, boxShadow: 'none' }}><Plus size={18} /> Add School/College</button>
                </section>

                {/* Experience */}
                <section id="experience" ref={sectionsRef.experience} style={styles.formSection}>
                    <h3 style={styles.sectionLabel}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `hsla(${tokens.primary}, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Briefcase size={20} color={`hsl(${tokens.primary})`} />
                        </div>
                        Work History
                    </h3>
                    {cvData.experience.map(exp => (
                        <div key={exp.id} style={styles.card}>
                            <button onClick={() => removeItem('experience', exp.id)} style={{ position: 'absolute', top: '24px', right: '24px', border: 'none', background: 'transparent', color: '#EF4444', cursor: 'pointer', opacity: 0.6, zIndex: 10 }}><Trash2 size={20} /></button>
                            <input style={{ ...styles.input, marginBottom: '20px', fontWeight: '700', paddingRight: '50px' }} placeholder="Position / Role" value={exp.role} onChange={(e) => updateItem('experience', exp.id, 'role', e.target.value)} />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: '20px', marginBottom: '20px' }}>
                                <input style={styles.input} placeholder="Company / Organization" value={exp.company} onChange={(e) => updateItem('experience', exp.id, 'company', e.target.value)} />
                                <input style={styles.input} placeholder="Date (e.g. 2021 - Present)" value={exp.duration} onChange={(e) => updateItem('experience', exp.id, 'duration', e.target.value)} />
                            </div>
                            <textarea style={{ ...styles.input, minHeight: '120px', lineHeight: '1.6' }} placeholder="Key responsibilities and achievements..." value={exp.tasks} onChange={(e) => updateItem('experience', exp.id, 'tasks', e.target.value)} />
                        </div>
                    ))}
                    <button onClick={() => addItem('experience', { role: '', company: '', duration: '', tasks: '' })} style={{ ...styles.btnPrimary, background: 'transparent', color: `hsl(${tokens.primary})`, border: `2px dashed hsla(${tokens.primary}, 0.3)`, boxShadow: 'none' }}><Plus size={18} /> Add a Job</button>
                </section>

                {/* Skills */}
                <section id="skills" ref={sectionsRef.skills} style={styles.formSection}>
                    <h3 style={styles.sectionLabel}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `hsla(${tokens.primary}, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Wrench size={20} color={`hsl(${tokens.primary})`} />
                        </div>
                        Your Skills
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                        {cvData.skills.map((s, i) => (
                            <div key={i} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <input
                                    style={{ ...styles.input, width: '200px', fontWeight: '600', paddingRight: '44px' }}
                                    value={s}
                                    onChange={(e) => {
                                        const n = [...cvData.skills]; n[i] = e.target.value;
                                        setCvData(prev => ({ ...prev, skills: n }));
                                    }}
                                />
                                <button onClick={() => setCvData(prev => ({ ...prev, skills: prev.skills.filter((_, idx) => idx !== i) }))} style={{ position: 'absolute', right: '12px', border: 'none', background: 'transparent', color: '#9CA3AF', cursor: 'pointer' }}><Trash2 size={16} /></button>
                            </div>
                        ))}
                        <button onClick={() => setCvData(prev => ({ ...prev, skills: [...prev.skills, ''] }))} style={{ ...styles.input, width: 'fit-content', borderStyle: 'dashed', fontWeight: '700' }}>+ Add Skill</button>
                    </div>
                </section>

                {/* Achievements */}
                <section id="achievements" ref={sectionsRef.achievements} style={styles.formSection}>
                    <h3 style={styles.sectionLabel}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `hsla(${tokens.primary}, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trophy size={20} color={`hsl(${tokens.primary})`} />
                        </div>
                        Things you achieved
                    </h3>
                    {cvData.achievements.map((a, i) => (
                        <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                            <input style={styles.input} value={a} onChange={(e) => {
                                const n = [...cvData.achievements]; n[i] = e.target.value;
                                setCvData(prev => ({ ...prev, achievements: n }));
                            }} placeholder="Significant accomplishment or metric-driven result..." />
                            <button onClick={() => setCvData(prev => ({ ...prev, achievements: prev.achievements.filter((_, idx) => idx !== i) }))} style={{ color: '#EF4444', border: 'none', background: 'transparent', cursor: 'pointer' }}><Trash2 size={20} /></button>
                        </div>
                    ))}
                    <button onClick={() => setCvData(prev => ({ ...prev, achievements: [...prev.achievements, ''] }))} style={{ ...styles.btnPrimary, background: 'transparent', color: `hsl(${tokens.primary})`, border: `2px dashed hsla(${tokens.primary}, 0.3)`, boxShadow: 'none' }}>+ Add Achievement</button>
                </section>

                {/* Trainings */}
                <section id="trainings" ref={sectionsRef.trainings} style={styles.formSection}>
                    <h3 style={styles.sectionLabel}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `hsla(${tokens.primary}, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BookOpen size={20} color={`hsl(${tokens.primary})`} />
                        </div>
                        Training & Certificates
                    </h3>
                    {cvData.trainings.map((t, i) => (
                        <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                            <input style={styles.input} value={t} onChange={(e) => {
                                const n = [...cvData.trainings]; n[i] = e.target.value;
                                setCvData(prev => ({ ...prev, trainings: n }));
                            }} placeholder="License, Certification, or Course Title..." />
                            <button onClick={() => setCvData(prev => ({ ...prev, trainings: prev.trainings.filter((_, idx) => idx !== i) }))} style={{ color: '#EF4444', border: 'none', background: 'transparent', cursor: 'pointer' }}><Trash2 size={20} /></button>
                        </div>
                    ))}
                    <button onClick={() => setCvData(prev => ({ ...prev, trainings: [...prev.trainings, ''] }))} style={{ ...styles.btnPrimary, background: 'transparent', color: `hsl(${tokens.primary})`, border: `2px dashed hsla(${tokens.primary}, 0.3)`, boxShadow: 'none' }}>+ Add Certification</button>
                </section>

                {/* Languages */}
                <section id="languages" ref={sectionsRef.languages} style={styles.formSection}>
                    <h3 style={styles.sectionLabel}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `hsla(${tokens.primary}, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <LangIcon size={20} color={`hsl(${tokens.primary})`} />
                        </div>
                        Languages you speak
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        {cvData.languages.map((l, i) => (
                            <div key={i} style={{ display: 'flex', gap: '12px' }}>
                                <input style={styles.input} value={l.lang} placeholder="Language" onChange={(e) => {
                                    const n = [...cvData.languages]; n[i].lang = e.target.value;
                                    setCvData(prev => ({ ...prev, languages: n }));
                                }} />
                                <select
                                    style={{ ...styles.input, width: '180px', cursor: 'pointer' }}
                                    value={l.level}
                                    onChange={(e) => {
                                        const n = [...cvData.languages]; n[i].level = e.target.value;
                                        setCvData(prev => ({ ...prev, languages: n }));
                                    }}
                                >
                                    <option>Native</option>
                                    <option>Fluent</option>
                                    <option>Professional</option>
                                    <option>Intermediate</option>
                                    <option>Elementary</option>
                                </select>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setCvData(prev => ({ ...prev, languages: [...prev.languages, { lang: '', level: 'Native' }] }))} style={{ ...styles.btnPrimary, background: 'transparent', color: `hsl(${tokens.primary})`, border: `2px dashed hsla(${tokens.primary}, 0.3)`, boxShadow: 'none', marginTop: '24px' }}>+ Add Language</button>
                </section>

                {/* References */}
                <section id="references" ref={sectionsRef.references} style={styles.formSection}>
                    <h3 style={styles.sectionLabel}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `hsla(${tokens.primary}, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users size={20} color={`hsl(${tokens.primary})`} />
                        </div>
                        People who know you (References)
                    </h3>
                    {cvData.references.map((rf, i) => (
                        <div key={i} style={styles.card}>
                            <button onClick={() => setCvData(prev => ({ ...prev, references: prev.references.filter((_, idx) => idx !== i) }))} style={{ position: 'absolute', top: '24px', right: '24px', border: 'none', background: 'transparent', color: '#EF4444', cursor: 'pointer', opacity: 0.6, zIndex: 10 }}><Trash2 size={20} /></button>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                                <input style={styles.input} placeholder="Reference Name" value={rf.name} onChange={(e) => {
                                    const n = [...cvData.references]; n[i].name = e.target.value;
                                    setCvData(prev => ({ ...prev, references: n }));
                                }} />
                                <input style={{ ...styles.input, paddingRight: '50px' }} placeholder="Position / Connection" value={rf.position} onChange={(e) => {
                                    const n = [...cvData.references]; n[i].position = e.target.value;
                                    setCvData(prev => ({ ...prev, references: n }));
                                }} />
                            </div>
                            <input style={styles.input} placeholder="Phone or Email Contact" value={rf.contact} onChange={(e) => {
                                const n = [...cvData.references]; n[i].contact = e.target.value;
                                setCvData(prev => ({ ...prev, references: n }));
                            }} />
                        </div>
                    ))}
                    <button onClick={() => setCvData(prev => ({ ...prev, references: [...prev.references, { name: '', position: '', contact: '' }] }))} style={{ ...styles.btnPrimary, background: 'transparent', color: `hsl(${tokens.primary})`, border: `2px dashed hsla(${tokens.primary}, 0.3)`, boxShadow: 'none' }}>+ Add Reference</button>
                </section>
            </main>

            {/* --- LIVE PREVIEW --- */}
            <section style={styles.previewPane}>
                <div style={styles.cvPaper}>
                    {/* Header */}
                    <header style={{ borderBottom: `4px solid hsl(${tokens.primary})`, paddingBottom: '30px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <h1 style={{ fontSize: '3rem', fontWeight: '1000', color: `hsl(${tokens.textMain})`, letterSpacing: '-0.06em', margin: 0, lineHeight: 1 }}>
                                {cvData.about.firstName} <span style={{ color: `hsl(${tokens.primary})` }}>{cvData.about.lastName}</span>
                            </h1>
                            <p style={{ fontSize: '1.25rem', fontWeight: '800', color: `hsl(${tokens.textMuted})`, marginTop: '12px', letterSpacing: '-0.02em' }}>{cvData.about.designation}</p>
                        </div>
                        <div style={{ textAlign: 'right', fontSize: '0.85rem', color: `hsl(${tokens.textMuted})`, fontWeight: '600' }}>
                            {cvData.about.email && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginBottom: '4px' }}>{cvData.about.email} <Mail size={14} /></div>}
                            {cvData.about.phone && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginBottom: '4px' }}>{cvData.about.phone} <Phone size={14} /></div>}
                            {cvData.about.address && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>{cvData.about.address} <MapPin size={14} /></div>}
                        </div>
                    </header>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '50px' }}>
                        {/* Main Stream */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                            {/* Summary */}
                            {cvData.about.summary && (
                                <div>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '1000', color: `hsl(${tokens.primary})`, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>About Me</h4>
                                    <p style={{ fontSize: '0.92rem', lineHeight: '1.7', color: `hsl(${tokens.textMain})`, textAlign: 'justify' }}>{cvData.about.summary}</p>
                                </div>
                            )}

                            {/* Experience */}
                            {cvData.experience.length > 0 && cvData.experience[0].role && (
                                <div>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '1000', color: `hsl(${tokens.primary})`, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px' }}>Work History</h4>
                                    {cvData.experience.map(exp => (
                                        <div key={exp.id} style={{ marginBottom: '24px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                                <h5 style={{ fontWeight: '900', fontSize: '1.05rem', margin: 0 }}>{exp.role}</h5>
                                                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: `hsl(${tokens.textMuted})` }}>{exp.duration}</span>
                                            </div>
                                            <h6 style={{ fontSize: '0.9rem', fontWeight: '700', color: `hsl(${tokens.primaryDark})`, margin: '4px 0 12px 0' }}>{exp.company}</h6>
                                            <p style={{ fontSize: '0.88rem', lineHeight: '1.6', color: `hsl(${tokens.textMain})`, whiteSpace: 'pre-line' }}>{exp.tasks}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Education */}
                            {cvData.education.length > 0 && cvData.education[0].degree && (
                                <div>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '1000', color: `hsl(${tokens.primary})`, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px' }}>Education</h4>
                                    {cvData.education.map(edu => (
                                        <div key={edu.id} style={{ marginBottom: '16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <h5 style={{ fontWeight: '900', fontSize: '1rem', margin: 0 }}>{edu.degree}</h5>
                                                <span style={{ fontSize: '0.8rem', fontWeight: '800' }}>{edu.year}</span>
                                            </div>
                                            <p style={{ fontSize: '0.9rem', color: `hsl(${tokens.textMuted})`, fontWeight: '600' }}>{edu.institute}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sidebar Stream */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            {/* Skills */}
                            {cvData.skills.length > 0 && cvData.skills[0] && (
                                <div>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: '1000', color: `hsl(${tokens.primary})`, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Skills</h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {cvData.skills.filter(s => s).map((s, i) => (
                                            <span key={i} style={{ backgroundColor: `hsla(${tokens.primary}, 0.06)`, color: `hsl(${tokens.primaryDark})`, padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '800', border: `1px solid hsla(${tokens.primary}, 0.1)` }}>{s}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Milestones */}
                            {cvData.achievements.length > 0 && cvData.achievements[0] && (
                                <div>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: '1000', color: `hsl(${tokens.primary})`, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Key Successes</h4>
                                    <ul style={{ paddingLeft: '18px', color: `hsl(${tokens.textMain})`, fontSize: '0.82rem', lineHeight: '1.6' }}>
                                        {cvData.achievements.filter(a => a).map((a, i) => (
                                            <li key={i} style={{ marginBottom: '8px', fontWeight: '500' }}>{a}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Languages */}
                            {cvData.languages.length > 0 && cvData.languages[0].lang && (
                                <div>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: '1000', color: `hsl(${tokens.primary})`, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Languages</h4>
                                    {cvData.languages.filter(l => l.lang).map((l, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '8px' }}>
                                            <span style={{ fontWeight: '800', color: `hsl(${tokens.textMain})` }}>{l.lang}</span>
                                            <span style={{ color: `hsl(${tokens.textMuted})`, fontWeight: '700' }}>{l.level}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CVBuilder;
