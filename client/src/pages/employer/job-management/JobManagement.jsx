import React, { useState, useEffect } from 'react';
import Pagination from '@/components/ui/Pagination';
import { useNavigate } from 'react-router-dom';
import { useGetEmployerJobs } from '@/hooks/api/employer/useEmployer';
import { useCreateJob, useUpdateJob, useDeleteJob } from '@/hooks/api/jobs/useJobs';
import toast from 'react-hot-toast';
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
            zIndex: 4000,
            animation: 'glassEntrance 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }} onClick={onClose}>
            <div
                className="glass-panel"
                style={{
                    padding: '48px 40px',
                    maxWidth: '520px',
                    width: '90%',
                    textAlign: 'center',
                    background: 'var(--theme-bg-subtle)',
                    border: '1px solid var(--theme-border)',
                    boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.4)'
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
                    {getIcon()}
                </div>

                <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem',
                    fontWeight: '900',
                    color: 'var(--theme-text-primary)',
                    marginBottom: '16px',
                    letterSpacing: '-0.025em'
                }}>
                    {title}
                </h2>
                <p style={{
                    fontSize: '1.05rem',
                    color: 'var(--theme-text-secondary)',
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
                            CANCEL
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
                            fontWeight: '900',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-display)',
                            boxShadow: type === 'confirm' ? '0 10px 25px -5px rgba(239, 68, 68, 0.4)' : '0 10px 25px -5px rgba(63, 81, 181, 0.4)'
                        }}
                        onClick={() => {
                            if (onConfirm) onConfirm();
                            onClose();
                        }}
                    >
                        {type === 'confirm' ? 'PROCEED' : 'OK'}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ── Mini Sky Scene (Shared from Dashboard) ── */
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



const JobManagement = () => {
    const navigate = useNavigate();
    // API Hooks
    const { data: serverJobs = [], isLoading: jobsLoading } = useGetEmployerJobs();
    const { mutate: createJob, isPending: isCreating } = useCreateJob();
    const { mutate: updateJob, isPending: isUpdating } = useUpdateJob();
    const { mutate: deleteJobMutation, isPending: isDeleting } = useDeleteJob();

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

    const hour = new Date().getHours();
    const timeOfDay = hour >= 5 && hour < 12 ? 'morning' : hour >= 12 && hour < 17 ? 'afternoon' : hour >= 17 && hour < 20 ? 'evening' : 'night';

    // --- Helper Functions ---
    const filteredJobs = serverJobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.location.toLowerCase().includes(searchQuery.toLowerCase());
        const jobStatus = job.is_active === false ? 'Closed' : 'Active';
        const matchesStatus = statusFilter === 'All' || jobStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;
    const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
    const paginatedJobs = filteredJobs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter]);

    const resetFilters = () => {
        setSearchQuery('');
        setStatusFilter('All');
    };

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
                            toast.success(`Job "${formData.title}" saved!`);
                            resetForm();
                        },
                        onError: (err) => {
                            toast.error(err?.response?.data?.message || 'Could not save changes');
                        }
                    }
                );
            } else {
                createJob(payload, {
                    onSuccess: () => {
                        toast.success(`Job "${formData.title}" is now online!`);
                        resetForm();
                    },
                    onError: (err) => {
                        toast.error(err?.response?.data?.message || 'Could not post job');
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
        // Logic: Scroll to form container slowly instead of jumping
        setTimeout(() => {
            const formElement = document.querySelector('.glass-panel.form-section-trigger');
            if (formElement) {
                formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    const deleteJob = (id) => {
        const jobId = id;
        const jobToDelete = serverJobs.find(j => (j.id === jobId || j._id === jobId));

        if (!jobToDelete) {
            toast.error("Oops! We can't find that job.");
            return;
        }

        showModal(
            'Delete this job?',
            `Are you sure? You will not be able to get "${jobToDelete.title}" back after you delete it.`,
            'confirm',
            () => {
                const loadingToast = toast.loading('Deleting...');
                deleteJobMutation(jobId, {
                    onSuccess: () => {
                        toast.dismiss(loadingToast);
                        toast.success('Deleted successfully!');
                    },
                    onError: (err) => {
                        toast.dismiss(loadingToast);
                        toast.error(err?.response?.data?.message || 'Error deleting job.');
                    }
                });
            }
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
            border: '1px solid var(--theme-border)',
            background: 'var(--theme-bg-subtle)',
            color: colorType === 'edit' ? 'var(--glass-accent-light)' : colorType === 'delete' ? '#EF4444' : '#8B5CF6',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            marginRight: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
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
            background: 'var(--theme-bg-subtle)',
            color: 'var(--glass-accent-light)',
            padding: '8px 16px',
            borderRadius: '14px',
            fontSize: '0.8rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid var(--theme-border)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }
    };

    return (
        <div className="glass-main" style={{ position: 'relative' }}>
            {/* Ambient Background Glows */}
            <div className="glow-effect" style={{ top: '15%', left: '-5%', background: '#60A5FA', width: '300px', height: '300px', opacity: 0.15 }} />
            <div className="glow-effect" style={{ top: '55%', right: '-5%', background: '#3F51B5', width: '400px', height: '400px', opacity: 0.1 }} />

            <div className="glass-container glass-reveal">
                {/* ───── OPERATIONAL HERO SECTION ───── */}
                <div className={`glass-panel dash-hero-${timeOfDay}`} style={{
                    padding: '48px',
                    marginBottom: '40px',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: '220px',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}>
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
                                <Zap size={14} fill="white" className="spin-slow" /> Manage Your Jobs
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
                                Job List
                            </h1>
                            <p style={{
                                fontSize: '1.2rem',
                                color: 'rgba(255,255,255,0.75)',
                                fontWeight: '600',
                                maxWidth: '500px',
                                marginBottom: '0',
                                lineHeight: '1.5'
                            }}>
                                Easily add and change your job posts here.
                            </p>
                        </div>

                        <div className="glass-panel" style={{
                            background: 'rgba(255,255,255,0.08)',
                            backdropFilter: 'blur(24px)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '28px',
                            padding: '32px 40px',
                            textAlign: 'center',
                            minWidth: '220px',
                            boxShadow: '0 15px 35px rgba(0,0,0,0.2)'
                        }}>
                            <span style={{
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                color: 'rgba(255,255,255,0.5)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em'
                            }}>Jobs Posted</span>
                            <div style={{ fontSize: '4.5rem', fontWeight: '950', color: 'white', letterSpacing: '-0.05em', margin: '4px 0', lineHeight: '1' }}>
                                {serverJobs.length}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.75rem', color: '#10B981', fontWeight: '800' }}>
                                <div style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%', boxShadow: '0 0 12px #10B981' }} />
                                ACTIVE NOW
                            </div>
                        </div>
                    </div>
                </div>

                {/* Collapsible Trigger (Industrial Glass Panel) */}
                <div
                    className="glass-panel form-section-trigger"
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
                            borderRadius: '20px',
                            background: isEditing ? 'var(--theme-bg-subtle)' : 'var(--theme-bg-subtle)',
                            border: isEditing ? '1px solid var(--glass-accent-light)' : '1px solid var(--theme-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isEditing ? 'var(--glass-accent-light)' : 'var(--glass-accent-light)',
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            boxShadow: isEditing ? '0 0 20px rgba(62, 97, 255, 0.2)' : '0 4px 12px rgba(0,0,0,0.05)'
                        }}>
                            {isEditing ? <Settings size={28} className="spin-slow" /> : <PlusCircle size={32} className="text-gradient-sapphire" />}
                        </div>
                        <div>
                            <h3 style={{
                                fontSize: '1.5rem',
                                fontWeight: '900',
                                color: 'var(--theme-text-primary)',
                                fontFamily: 'var(--font-display)',
                                marginBottom: '4px',
                                letterSpacing: '-0.01em'
                            }}>
                                {isEditing ? `Changing Job: ${formData.title}` : 'Add a New Job'}
                            </h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--theme-text-muted)', fontWeight: '600' }}>
                                {isEditing ? 'Make changes to your job post below.' : 'Create a new job post for people to see.'}
                            </p>
                        </div>
                    </div>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        background: 'var(--theme-bg-subtle)',
                        border: '1px solid var(--theme-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--theme-text-muted)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                    }}>
                        {isFormExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
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
                                    <label style={styles.label}>Salary (How much you pay) *</label>
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
                                    <label style={styles.label}>Job ends on *</label>
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
                                    placeholder="What is this job about? Write a few sentences here."
                                />
                            </div>

                            <div style={styles.grid}>
                                <div className="form-group">
                                    <label style={styles.label}>What they will do</label>
                                    <textarea
                                        style={{ ...styles.textarea, minHeight: '120px' }}
                                        name="responsibilities"
                                        value={formData.responsibilities}
                                        onChange={handleInputChange}
                                        placeholder="Write down what they will do every day."
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={styles.label}>What they need to know</label>
                                    <textarea
                                        style={{ ...styles.textarea, minHeight: '120px' }}
                                        name="qualifications"
                                        value={formData.qualifications}
                                        onChange={handleInputChange}
                                        placeholder="What kind of school or skills should they have?"
                                    />
                                </div>
                            </div>

                            {/* Skills Tag Input (Industrial Style) */}
                            <div style={{ marginBottom: '40px' }}>
                                <label style={styles.label}>Skills they should have</label>
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
                                <button
                                    type="submit"
                                    disabled={isCreating || isUpdating}
                                    className="btn-scale"
                                    style={{
                                        ...styles.submitBtn,
                                        opacity: (isCreating || isUpdating) ? 0.6 : 1,
                                        cursor: (isCreating || isUpdating) ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '12px'
                                    }}
                                >
                                    {(isCreating || isUpdating) ? (
                                        <>
                                            <Settings size={20} className="spin-slow" />
                                            SAVING...
                                        </>
                                    ) : (
                                        <>
                                            {isEditing ? <CheckCircle2 size={20} /> : <PlusCircle size={20} />}
                                            {isEditing ? 'SAVE CHANGES' : 'POST JOB NOW'}
                                        </>
                                    )}
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <LayoutGrid size={24} className="text-gradient-sapphire" />
                            <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--theme-text-primary)' }}>My Jobs</h2>
                            <div className="glass-badge-pulse" style={{ background: 'rgba(62, 97, 255, 0.1)', color: 'var(--glass-accent-light)', border: '1px solid rgba(62, 97, 255, 0.2)', fontSize: '0.7rem' }}>
                                {filteredJobs.length} JOBS FOUND
                            </div>
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
                                        background: 'var(--theme-bg-subtle)',
                                        border: '1px solid var(--theme-border)',
                                        color: 'var(--theme-text-primary)',
                                        fontSize: '0.85rem',
                                        width: '240px',
                                        outline: 'none',
                                        fontWeight: '600'
                                    }}
                                />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Filter size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--theme-text-muted)' }} />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    style={{
                                        padding: '10px 16px 10px 36px',
                                        borderRadius: '10px',
                                        background: 'var(--theme-bg-subtle)',
                                        border: '1px solid var(--theme-border)',
                                        color: 'var(--theme-text-primary)',
                                        fontSize: '0.85rem',
                                        outline: 'none',
                                        appearance: 'none',
                                        cursor: 'pointer',
                                        fontWeight: '600'
                                    }}
                                >
                                    <option value="All">All Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Closed">Closed</option>
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
                                    paginatedJobs.map(job => (
                                        <tr key={job.id} className="glass-row">
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                                    <div style={{
                                                        width: '52px',
                                                        height: '52px',
                                                        borderRadius: '16px',
                                                        background: 'var(--theme-bg-subtle)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'var(--glass-accent-light)',
                                                        border: '1px solid var(--theme-border)',
                                                        boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                                                    }}>
                                                        <Briefcase size={24} />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '900', color: 'var(--theme-text-primary)', fontSize: '1.05rem', letterSpacing: '-0.02em', marginBottom: '2px' }}>{job.title}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--theme-text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                                                            <MapPin size={12} fill="var(--theme-text-muted)" /> {job.location}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--theme-text-secondary)', fontWeight: '700', fontSize: '0.85rem' }}>
                                                    <Clock size={14} style={{ opacity: 0.8 }} className="text-gradient-sapphire" />
                                                    {job.postedDate || (job.created_at ? new Date(job.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Active Proto')}
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
                                                        className="btn-scale"
                                                        style={{
                                                            ...styles.actionBtn('delete'),
                                                            opacity: (isDeleting) ? 0.5 : 1,
                                                            pointerEvents: (isDeleting) ? 'none' : 'auto'
                                                        }}
                                                        title="Delete Job"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteJob(job.id || job._id);
                                                        }}
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
                                                <h3 style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--theme-text-primary)', fontFamily: 'var(--font-display)', marginBottom: '12px' }}>
                                                    {searchQuery || statusFilter !== 'All' ? 'Zero Matches' : 'Nexus Library Empty'}
                                                </h3>
                                                <p style={{ maxWidth: '400px', margin: '0 auto 32px', color: 'var(--theme-text-muted)', lineHeight: '1.6', fontWeight: '600' }}>
                                                    {searchQuery || statusFilter !== 'All'
                                                        ? 'No operational records found for current filter criteria.'
                                                        : 'Your job roster is currently unpopulated. Initiate a new deployment.'}
                                                </p>
                                                {searchQuery || statusFilter !== 'All' ? (
                                                    <button
                                                        onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
                                                        style={styles.submitBtn}
                                                        className="btn-scale"
                                                    >
                                                        <X size={20} /> RESET FILTERS
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => setIsFormExpanded(true)}
                                                        style={styles.submitBtn}
                                                        className="btn-scale"
                                                    >
                                                        <Plus size={20} /> INITIALIZE POST
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            totalItems={filteredJobs.length}
                            itemsPerPage={ITEMS_PER_PAGE}
                        />
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
                    background-color: var(--theme-bg-subtle) !important;
                    border-color: var(--glass-accent-light) !important;
                    box-shadow: 0 0 0 4px var(--glass-accent-glow) !important;
                    transform: translateY(-1px);
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
