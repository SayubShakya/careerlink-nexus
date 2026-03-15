import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetEmployerJobs } from '@/hooks/api/employer/useEmployer';
import { useCreateJob, useUpdateJob, useDeleteJob } from '@/hooks/api/jobs/useJobs';
import {
    PlusCircle,
    Trash2,
    Edit,
    Eye,
    Briefcase,
    MapPin,
    DollarSign,
    Calendar,
    X,
    CheckCircle2,
    FileText,
    Settings,
    Users,
    ChevronDown,
    ChevronUp,
    Info,
    AlertCircle,
    Search,
    Filter,
    Plus,
    LayoutGrid,
    Clock,
    AlertTriangle,
    ShieldCheck,
    ArrowUpRight,
    Target,
    Zap,
    Layers
} from 'lucide-react';

// Design System
import '@/styles/ProfessionalGlass.css';
import { ROUTES } from '../../../routes/routes';

// --- Custom Modal Component (Redesigned for Glass Authority) ---
const CustomModal = ({ isOpen, onClose, title, message, type, onConfirm }) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success': return <div className="icon-surface success"><ShieldCheck size={32} /></div>;
            case 'confirm': return <div className="icon-surface warning"><AlertTriangle size={32} /></div>;
            default: return <div className="icon-surface danger"><AlertCircle size={32} /></div>;
        }
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3000,
            animation: 'glassEntrance 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }} onClick={onClose}>
            <div
                className="glass-panel"
                style={{
                    padding: '48px 40px',
                    maxWidth: '520px',
                    width: '90%',
                    textAlign: 'center',
                    background: 'rgba(10, 12, 16, 0.95)',
                    border: '1px solid var(--glass-border-bright)',
                    boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.8)'
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
                    {getIcon()}
                </div>

                <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem',
                    fontWeight: '800',
                    color: 'var(--theme-text-primary)',
                    marginBottom: '16px',
                    letterSpacing: '-0.02em'
                }}>
                    {title}
                </h2>
                <p style={{
                    fontSize: '1rem',
                    color: 'var(--glass-text-secondary)',
                    lineHeight: '1.7',
                    marginBottom: '40px',
                    fontWeight: '500'
                }}>
                    {message}
                </p>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    {type === 'confirm' && (
                        <button
                            className="btn-scale"
                            style={{
                                padding: '14px 28px',
                                borderRadius: '14px',
                                background: 'transparent',
                                border: '1px solid var(--theme-border)',
                                color: 'var(--theme-text-primary)',
                                fontWeight: '700',
                                cursor: 'pointer',
                                fontFamily: 'var(--font-display)'
                            }}
                            onClick={onClose}
                        >
                            CANCEL ACTION
                        </button>
                    )}
                    <button
                        className="btn-scale"
                        style={{
                            padding: '14px 40px',
                            borderRadius: '14px',
                            background: type === 'confirm' ? '#EF4444' : 'var(--glass-accent)',
                            color: 'white',
                            border: 'none',
                            fontWeight: '800',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-display)',
                            boxShadow: type === 'confirm' ? '0 8px 20px -4px rgba(239, 68, 68, 0.4)' : '0 8px 20px -4px rgba(63, 81, 181, 0.4)'
                        }}
                        onClick={() => {
                            if (onConfirm) onConfirm();
                            onClose();
                        }}
                    >
                        {type === 'confirm' ? 'CONFIRM' : 'OK'}
                    </button>
                </div>
            </div>
        </div>
    );
};



const JobManagement = () => {
    const navigate = useNavigate();
    // API Hooks
    const { data: serverJobs = [], isLoading: jobsLoading } = useGetEmployerJobs();
    const { mutate: createJob, isLoading: isCreating } = useCreateJob();
    const { mutate: updateJob, isLoading: isUpdating } = useUpdateJob();
    const { mutate: deleteJobMutation } = useDeleteJob();

    // UI State
    const [isFormExpanded, setIsFormExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // Modal State
    const [modal, setModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'success',
        onConfirm: null
    });

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        salary: '',
        jobType: 'Full-time',
        deadline: '',
        description: '',
        responsibilities: '',
        qualifications: '',
        specification: '',
        education: ''
    });

    // Skills State
    const [skillInput, setSkillInput] = useState('');
    const [skills, setSkills] = useState([]);

    // Error State
    const [errors, setErrors] = useState({});

    // Filtering State
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // --- Helper Functions ---
    const filteredJobs = serverJobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.location.toLowerCase().includes(searchQuery.toLowerCase());
        const jobStatus = job.is_active === false ? 'Closed' : 'Active';
        const matchesStatus = statusFilter === 'All' || jobStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });
    const showModal = (title, message, type = 'success', onConfirm = null) => {
        setModal({ isOpen: true, title, message, type, onConfirm });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleAddSkill = (e) => {
        if (e.key === 'Enter' || e.type === 'blur') {
            e.preventDefault();
            const trimmedSkill = skillInput.trim();
            if (trimmedSkill && !skills.includes(trimmedSkill)) {
                setSkills(prev => [...prev, trimmedSkill]);
                setSkillInput('');
            }
        }
    };

    const removeSkill = (skillToRemove) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Job Title is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        if (!formData.salary.toString().trim()) newErrors.salary = 'Salary is required';
        if (!formData.deadline) newErrors.deadline = 'Deadline is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const payload = {
                ...formData,
                skills: [...skills]
            };

            if (isEditing) {
                updateJob(
                    { id: editId, jobData: payload },
                    {
                        onSuccess: () => {
                            showModal('Job Updated!', `Successfully updated ${formData.title}`);
                            resetForm();
                        }
                    }
                );
            } else {
                createJob(payload, {
                    onSuccess: () => {
                        showModal('Job Published!', `Your job "${formData.title}" is now live.`);
                        resetForm();
                    }
                });
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '', location: '', salary: '', jobType: 'Full-time',
            deadline: '', description: '', responsibilities: '',
            qualifications: '', specification: '', education: ''
        });
        setSkills([]);
        setIsFormExpanded(false);
        setIsEditing(false);
        setEditId(null);
    };

    const editJob = (job) => {
        setFormData({
            title: job.title || '',
            location: job.location || '',
            salary: job.salary || '',
            jobType: job.jobType || 'Full-time',
            deadline: job.deadline ? (typeof job.deadline === 'string' && job.deadline.includes('T') ? job.deadline.split('T')[0] : (typeof job.deadline === 'string' && job.deadline.match(/\d{4}-\d{2}-\d{2}/) ? job.deadline.match(/\d{4}-\d{2}-\d{2}/)[0] : '')) : '',
            description: job.description || '',
            responsibilities: job.responsibilities || '',
            qualifications: job.qualifications || '',
            specification: job.specification || '',
            education: job.education || ''
        });
        setSkills([...(job.skills || [])]);
        setIsEditing(true);
        setEditId(job.id);
        setIsFormExpanded(true);
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    const deleteJob = (id) => {
        const jobToDelete = serverJobs.find(j => j.id === id);
        showModal(
            'Delete Job?',
            `Are you sure you want to delete "${jobToDelete.title}"? This action cannot be undone.`,
            'confirm',
            () => deleteJobMutation(id)
        );
    };

    const viewApplications = (job) => {
        navigate(ROUTES.EMPLOYER_APPLICATIONS);
    };

    const styles = {
        container: {
            padding: '60px 32px',
            maxWidth: '1400px',
            margin: '0 auto',
            fontFamily: 'var(--font-body)',
            position: 'relative',
            zIndex: 2,
            color: 'var(--theme-text-primary)'
        },
        postTriggerCard: {
            background: 'var(--glass-surface)',
            backdropFilter: 'blur(var(--glass-blur))',
            borderRadius: '20px',
            padding: '24px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: isEditing ? '1px solid var(--glass-accent-light)' : '1px solid var(--glass-border)',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            marginBottom: '32px'
        },
        formWrapper: {
            maxHeight: isFormExpanded ? '2500px' : '0',
            opacity: isFormExpanded ? 1 : 0,
            overflow: 'hidden',
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            marginBottom: isFormExpanded ? '48px' : '0'
        },
        section: {
            background: 'var(--glass-surface)',
            backdropFilter: 'blur(var(--glass-blur))',
            borderRadius: '20px',
            padding: '40px',
            border: '1px solid var(--glass-border)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '24px'
        },
        label: {
            display: 'block',
            marginBottom: '10px',
            fontWeight: '600',
            fontSize: '0.85rem',
            color: 'var(--glass-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
        },
        input: {
            width: '100%',
            padding: '14px 18px',
            borderRadius: '12px',
            border: '1px solid var(--theme-border)',
            fontSize: '0.95rem',
            backgroundColor: 'var(--theme-bg-subtle)',
            color: 'var(--theme-text-primary)',
            transition: 'all 0.2s ease',
            outline: 'none',
            fontFamily: 'var(--font-body)'
        },
        textarea: {
            width: '100%',
            padding: '14px 18px',
            borderRadius: '12px',
            border: '1px solid var(--theme-border)',
            fontSize: '0.95rem',
            backgroundColor: 'var(--theme-bg-subtle)',
            color: 'var(--theme-text-primary)',
            minHeight: '140px',
            resize: 'vertical',
            outline: 'none',
            transition: 'all 0.2s ease',
            fontFamily: 'var(--font-body)'
        },
        submitBtn: {
            padding: '16px 32px',
            background: 'var(--glass-accent)',
            color: 'white',
            border: 'none',
            borderRadius: '14px',
            fontWeight: '800',
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            fontFamily: 'var(--font-display)',
            boxShadow: '0 8px 16px -4px rgba(63, 81, 181, 0.3)'
        },
        cancelBtn: {
            padding: '16px 28px',
            borderRadius: '14px',
            border: '1px solid var(--glass-border)',
            background: 'transparent',
            color: 'var(--glass-text-secondary)',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'var(--font-display)'
        },
        tableCard: {
            background: 'var(--glass-surface)',
            backdropFilter: 'blur(var(--glass-blur))',
            borderRadius: '24px',
            border: '1px solid var(--glass-border)',
            overflow: 'hidden',
            marginTop: '32px'
        },
        tableHeader: {
            padding: '32px 40px',
            borderBottom: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.01)'
        },
        actionBtn: (colorType) => ({
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--glass-border)',
            background: 'rgba(255, 255, 255, 0.03)',
            color: colorType === 'edit' ? '#60A5FA' : colorType === 'delete' ? '#F87171' : '#A78BFA',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            marginRight: '10px'
        }),
        badge: (status) => {
            const isActive = status === 'Active' || status === true;
            return {
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.7rem',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                background: isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: isActive ? '#10B981' : '#F87171',
                border: isActive ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-display)'
            }
        },
        skillBadge: {
            background: 'rgba(96, 165, 250, 0.08)',
            color: '#93C5FD',
            padding: '8px 16px',
            borderRadius: '14px',
            fontSize: '0.8rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid rgba(96, 165, 250, 0.2)',
            transition: 'all 0.2s ease'
        }
    };

    return (
        <div className="glass-main" style={{ position: 'relative' }}>
            {/* Ambient Background Glows */}
            <div className="glow-effect" style={{ top: '15%', left: '-5%', background: '#60A5FA', width: '300px', height: '300px', opacity: 0.15 }} />
            <div className="glow-effect" style={{ top: '55%', right: '-5%', background: '#3F51B5', width: '400px', height: '400px', opacity: 0.1 }} />

            <div className="glass-container glass-reveal">
                {/* Authority Header (Operational Hero) */}
                <header style={{
                    marginBottom: '72px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    padding: '0 8px'
                }}>
                    <div style={{ animationDelay: '0.1s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={{
                                padding: '8px',
                                background: 'rgba(96, 165, 250, 0.1)',
                                borderRadius: '10px',
                                border: '1px solid rgba(96, 165, 250, 0.2)'
                            }}>
                                <ShieldCheck size={20} className="text-gradient-sapphire" />
                            </div>
                            <span style={{
                                fontSize: '0.8rem',
                                fontWeight: '800',
                                color: 'var(--glass-text-muted)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.25em',
                                fontFamily: 'var(--font-display)'
                            }}>
                                Job Management
                            </span>
                        </div>
                        <h1 style={{
                            fontSize: '4rem',
                            fontWeight: '800',
                            color: 'var(--theme-text-primary)',
                            letterSpacing: '-0.04em',
                            lineHeight: '0.9',
                            fontFamily: 'var(--font-display)'
                        }}>
                            Job <br />
                            <span className="text-gradient-sapphire">Dashboard</span>
                        </h1>
                    </div>

                    <div className="glass-panel" style={{
                        padding: '20px 28px',
                        textAlign: 'right',
                        animationDelay: '0.2s',
                        position: 'relative',
                        overflow: 'hidden',
                        backdropFilter: 'blur(20px)',
                        background: 'linear-gradient(135deg, var(--theme-card), rgba(255, 255, 255, 0.02))',
                        boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.1), var(--theme-shadow)',
                        border: '1px solid var(--theme-border-bright)'
                    }}>
                        <div style={{
                            fontSize: '0.75rem',
                            color: 'var(--glass-text-secondary)',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            marginBottom: '4px'
                        }}>
                            Total Jobs
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-end' }}>
                            <div style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                background: '#3B82F6',
                                boxShadow: '0 0 15px rgba(59, 130, 246, 0.6)',
                                animation: 'pulse 2s infinite'
                            }} />
                            <span style={{
                                fontSize: '1.25rem',
                                fontWeight: '900',
                                color: 'var(--theme-text-primary)',
                                fontFamily: 'var(--font-display)',
                                textShadow: '0 4px 8px rgba(0,0,0,0.1)'
                            }}>
                                {serverJobs.length} <span style={{ fontSize: '0.85rem', color: 'var(--glass-text-muted)', fontWeight: '600' }}>Active Jobs</span>
                            </span>
                        </div>
                        {/* Gloss Reflection */}
                        <div style={{
                            position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
                            background: 'radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%)',
                            pointerEvents: 'none', zIndex: 0
                        }} />
                    </div>
                </header>

                {/* Removal of CustomModal from here to bottom of component wrap */}

                {/* Collapsible Trigger (Industrial Glass Panel) */}
                <div
                    className="glass-panel"
                    style={styles.postTriggerCard}
                    onClick={() => {
                        if (!isFormExpanded) {
                            setIsFormExpanded(true);
                        } else if (!isEditing) {
                            setIsFormExpanded(false);
                        }
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '18px',
                            background: isEditing ? 'rgba(96, 165, 250, 0.15)' : 'rgba(255,255,255,0.03)',
                            border: isEditing ? '1px solid rgba(96, 165, 250, 0.3)' : '1px solid var(--glass-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isEditing ? 'var(--glass-accent-light)' : 'white',
                            transition: 'all 0.3s ease'
                        }}>
                            {isEditing ? <Settings size={28} className="spin-slow" /> : <Plus size={28} />}
                        </div>
                        <div>
                            <h3 style={{
                                fontSize: '1.4rem',
                                fontWeight: '800',
                                color: 'var(--theme-text-primary)',
                                fontFamily: 'var(--font-display)',
                                marginBottom: '4px'
                            }}>
                                {isEditing ? `Editing: ${formData.title}` : 'Post a New Job'}
                            </h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--glass-text-muted)', fontWeight: '500' }}>
                                {isEditing ? 'Update the job details below.' : 'Fill out the form below to post a new job.'}
                            </p>
                        </div>
                    </div>
                    <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '14px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--glass-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--glass-text-muted)',
                        transition: 'all 0.3s ease'
                    }}>
                        {isFormExpanded ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                    </div>
                </div>

                {/* Collapsible Form (Frosted Form) */}
                <div style={styles.formWrapper}>
                    <section style={styles.section} className="glass-panel">
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    background: 'rgba(255,255,255,0.03)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--glass-text-muted)',
                                    border: '1px solid var(--glass-border)'
                                }}>
                                    <Info size={16} />
                                </div>
                                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--glass-text-secondary)', letterSpacing: '0.02em' }}>
                                    Complete all fields marked with an asterisk (*)
                                </span>
                            </div>

                            <div style={styles.grid}>
                                <div className="form-group">
                                    <label style={styles.label}>Job Title *</label>
                                    <input
                                        style={{ ...styles.input, borderColor: errors.title ? '#ef4444' : 'var(--glass-border)' }}
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Lead Systems Architect…"
                                    />
                                    {errors.title && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '6px', fontWeight: '600' }}>{errors.title}</p>}
                                </div>

                                <div className="form-group">
                                    <label style={styles.label}>Location *</label>
                                    <div style={{ position: 'relative' }}>
                                        <MapPin size={16} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--glass-text-muted)' }} />
                                        <input
                                            style={{ ...styles.input, paddingRight: '48px', borderColor: errors.location ? '#ef4444' : 'var(--glass-border)' }}
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Remote / Sector 7…"
                                        />
                                    </div>
                                    {errors.location && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '6px', fontWeight: '600' }}>{errors.location}</p>}
                                </div>

                                <div className="form-group">
                                    <label style={styles.label}>Compensation Buffer *</label>
                                    <div style={{ position: 'relative' }}>
                                        <DollarSign size={16} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--glass-text-muted)' }} />
                                        <input
                                            type="number"
                                            style={{ ...styles.input, paddingRight: '48px', borderColor: errors.salary ? '#ef4444' : 'var(--glass-border)' }}
                                            name="salary"
                                            value={formData.salary}
                                            onChange={handleInputChange}
                                            placeholder="e.g. 120000"
                                        />
                                    </div>
                                    {errors.salary && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '6px', fontWeight: '600' }}>{errors.salary}</p>}
                                </div>

                                <div className="form-group">
                                    <label style={styles.label}>Job Type</label>
                                    <div style={{ position: 'relative' }}>
                                        <Layers size={16} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--glass-text-muted)', pointerEvents: 'none' }} />
                                        <select
                                            style={{ ...styles.input, paddingRight: '48px', appearance: 'none' }}
                                            name="jobType"
                                            value={formData.jobType}
                                            onChange={handleInputChange}
                                        >
                                            <option style={{ background: '#0F1217' }}>Full-time</option>
                                            <option style={{ background: '#0F1217' }}>Part-time</option>
                                            <option style={{ background: '#0F1217' }}>Contract</option>
                                            <option style={{ background: '#0F1217' }}>Internship</option>
                                            <option style={{ background: '#0F1217' }}>Freelance</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label style={styles.label}>Application Deadline *</label>
                                    <div style={{ position: 'relative' }}>
                                        <Calendar size={16} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--glass-text-muted)' }} />
                                        <input
                                            type="date"
                                            style={{ ...styles.input, paddingRight: '48px', borderColor: errors.deadline ? '#ef4444' : 'var(--glass-border)' }}
                                            name="deadline"
                                            value={formData.deadline}
                                            onChange={handleInputChange}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '32px' }}>
                                <label style={styles.label}>Job Description *</label>
                                <textarea
                                    style={{ ...styles.textarea, borderColor: errors.description ? '#ef4444' : 'var(--glass-border)' }}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Outline the core mission and architectural impact…"
                                />
                            </div>

                            <div style={styles.grid}>
                                <div className="form-group">
                                    <label style={styles.label}>Responsibilities</label>
                                    <textarea
                                        style={{ ...styles.textarea, minHeight: '120px' }}
                                        name="responsibilities"
                                        value={formData.responsibilities}
                                        onChange={handleInputChange}
                                        placeholder="Key operational deliverables…"
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={styles.label}>Qualifications</label>
                                    <textarea
                                        style={{ ...styles.textarea, minHeight: '120px' }}
                                        name="qualifications"
                                        value={formData.qualifications}
                                        onChange={handleInputChange}
                                        placeholder="Required stack and experience…"
                                    />
                                </div>
                            </div>

                            {/* Skills Tag Input (Industrial Style) */}
                            <div style={{ marginBottom: '40px' }}>
                                <label style={styles.label}>Skills (Press Enter to Add)</label>
                                <div style={{ position: 'relative' }}>
                                    <Zap size={16} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--glass-text-muted)' }} />
                                    <input
                                        style={{ ...styles.input, paddingRight: '48px' }}
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={handleAddSkill}
                                        placeholder="e.g. React, Node.js, Distributed Systems…"
                                    />
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '16px' }}>
                                    {skills.map((skill, index) => (
                                        <span key={index} style={styles.skillBadge}>
                                            <Target size={14} />
                                            {skill}
                                            <X
                                                size={14}
                                                style={{ cursor: 'pointer', opacity: 0.5, transition: 'opacity 0.2s' }}
                                                onClick={() => removeSkill(skill)}
                                                onMouseOver={(e) => e.target.style.opacity = 1}
                                                onMouseOut={(e) => e.target.style.opacity = 0.5}
                                            />
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                                <button type="submit" style={styles.submitBtn} className="btn-scale">
                                    {isEditing ? <ShieldCheck size={20} /> : <Zap size={20} />}
                                    {isEditing ? 'SAVE CHANGES' : 'POST JOB'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    style={styles.cancelBtn}
                                    className="btn-scale"
                                >
                                    CANCEL
                                </button>
                            </div>
                        </form>
                    </section>
                </div>

                {/* Manage Jobs Section (The Job Matrix) */}
                <div style={styles.tableCard} className="glass-panel">
                    <div style={styles.tableHeader}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <LayoutGrid size={16} className="text-gradient-sapphire" />
                                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'white', fontFamily: 'var(--font-display)' }}>All Jobs</h2>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: 'var(--glass-text-muted)', fontWeight: '500' }}>
                                Managing <span style={{ color: 'white', fontWeight: '700' }}>{filteredJobs.length}</span> jobs {searchQuery || statusFilter !== 'All' ? '(filtered)' : ''}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--glass-text-muted)' }} />
                                <input
                                    type="text"
                                    placeholder="Search jobs..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        padding: '10px 16px 10px 36px',
                                        borderRadius: '10px',
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid var(--glass-border)',
                                        color: 'white',
                                        fontSize: '0.8rem',
                                        width: '200px',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Filter size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--glass-text-muted)' }} />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    style={{
                                        padding: '10px 16px 10px 36px',
                                        borderRadius: '10px',
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid var(--glass-border)',
                                        color: 'white',
                                        fontSize: '0.8rem',
                                        outline: 'none',
                                        appearance: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="All" style={{ background: '#0F1217' }}>All Status</option>
                                    <option value="Active" style={{ background: '#0F1217' }}>Active</option>
                                    <option value="Closed" style={{ background: '#0F1217' }}>Closed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }} className="glass-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '40%' }}>Job Information</th>
                                    <th>Date Posted</th>
                                    <th>Status</th>
                                    <th>Applicants</th>
                                    <th style={{ textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobsLoading ? (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '64px', textAlign: 'center' }}>
                                            <div className="spin-slow" style={{ color: 'var(--glass-accent)', marginBottom: '16px' }}>
                                                <Layers size={32} />
                                            </div>
                                            <p style={{ color: 'var(--glass-text-muted)', fontWeight: '600' }}>Loading jobs…</p>
                                        </td>
                                    </tr>
                                ) : filteredJobs.length > 0 ? (
                                    filteredJobs.map(job => (
                                        <tr key={job.id} className="glass-row">
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                                    <div style={{
                                                        width: '48px',
                                                        height: '48px',
                                                        borderRadius: '14px',
                                                        background: 'rgba(255,255,255,0.03)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'var(--glass-text-secondary)',
                                                        border: '1px solid var(--glass-border)'
                                                    }}>
                                                        <Briefcase size={22} />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '800', color: 'white', fontSize: '1rem', letterSpacing: '-0.01em', marginBottom: '4px' }}>{job.title}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--glass-text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
                                                            <MapPin size={12} /> {job.location}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--glass-text-secondary)', fontWeight: '600', fontSize: '0.85rem' }}>
                                                    <Clock size={14} style={{ opacity: 0.6 }} /> {job.postedDate || (job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Active Proto')}
                                                </div>
                                            </td>
                                            <td>
                                                <span style={styles.badge(job.is_active === false ? 'Closed' : 'Active')}>
                                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', boxShadow: '0 0 8px currentColor' }} />
                                                    {job.is_active === false ? 'Closed' : 'Active'}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{
                                                        padding: '4px 10px',
                                                        borderRadius: '8px',
                                                        background: 'rgba(96, 165, 250, 0.1)',
                                                        color: '#60A5FA',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '800',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px'
                                                    }}>
                                                        <Users size={14} />
                                                        {job.applicants || 0}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                                                    <button
                                                        style={styles.actionBtn('edit')}
                                                        className="btn-scale"
                                                        title="Edit Job"
                                                        onClick={() => editJob(job)}
                                                    >
                                                        <Settings size={18} />
                                                    </button>
                                                    <button
                                                        style={styles.actionBtn('applicants')}
                                                        className="btn-scale"
                                                        title="View Applicants"
                                                        onClick={() => viewApplications(job)}
                                                    >
                                                        <ArrowUpRight size={18} />
                                                    </button>
                                                    <button
                                                        style={styles.actionBtn('delete')}
                                                        className="btn-scale"
                                                        title="Delete Job"
                                                        onClick={() => deleteJob(job.id)}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">
                                            <div style={{ padding: '100px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <div style={{
                                                    width: '120px',
                                                    height: '120px',
                                                    borderRadius: '30px',
                                                    background: 'rgba(255,255,255,0.02)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginBottom: '32px',
                                                    border: '1px solid var(--glass-border)'
                                                }}>
                                                    <Search size={48} color="var(--glass-text-muted)" opacity={0.3} />
                                                </div>
                                                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white', fontFamily: 'var(--font-display)', marginBottom: '12px' }}>
                                                    {searchQuery || statusFilter !== 'All' ? 'No Matching Jobs' : 'No Jobs Found'}
                                                </h3>
                                                <p style={{ maxWidth: '400px', margin: '0 auto 32px', color: 'var(--glass-text-muted)', lineHeight: '1.6', fontWeight: '500' }}>
                                                    {searchQuery || statusFilter !== 'All'
                                                        ? 'Try modifying your search or filters.'
                                                        : 'You haven\'t posted any jobs yet. Create a new job to get started.'}
                                                </p>
                                                {searchQuery || statusFilter !== 'All' ? (
                                                    <button
                                                        onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
                                                        style={styles.submitBtn}
                                                        className="btn-scale"
                                                    >
                                                        <X size={20} /> CLEAR FILTERS
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => setIsFormExpanded(true)}
                                                        style={styles.submitBtn}
                                                        className="btn-scale"
                                                    >
                                                        <Plus size={20} /> POST A JOB
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.2); opacity: 1; }
                    100% { transform: scale(1); opacity: 0.8; }
                }

                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .spin-slow {
                    animation: spin-slow 8s linear infinite;
                }

                .icon-surface {
                    width: 72px;
                    height: 72px;
                    border-radius: 20px;
                    display: flex;
                    alignItems: center;
                    justifyContent: center;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid var(--glass-border);
                    margin: 0 auto;
                }

                .icon-surface.success { color: #10B981; border-color: rgba(16, 185, 129, 0.2); background: rgba(16, 185, 129, 0.05); }
                .icon-surface.warning { color: #F59E0B; border-color: rgba(245, 158, 11, 0.2); background: rgba(245, 158, 11, 0.05); }
                .icon-surface.danger { color: #EF4444; border-color: rgba(239, 68, 68, 0.2); background: rgba(239, 68, 68, 0.05); }

                .btn-scale:active {
                    transform: scale(0.96);
                }

                .btn-scale:hover {
                    filter: brightness(1.1);
                    transform: translateY(-1px);
                }

                input:focus, textarea:focus, select:focus {
                    background-color: rgba(255, 255, 255, 0.04) !important;
                    border-color: var(--glass-accent-light) !important;
                    box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.1) !important;
                }

                ::-webkit-calendar-picker-indicator {
                    filter: invert(1);
                    cursor: pointer;
                    opacity: 0.5;
                }

                ::-webkit-calendar-picker-indicator:hover {
                    opacity: 1;
                }
            `}</style>
            </div>
            {/* Custom Modal - Moved to end of component for stability */}
            <CustomModal
                isOpen={modal.isOpen}
                onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                onConfirm={modal.onConfirm}
            />
        </div>
    );
};

export default JobManagement;
