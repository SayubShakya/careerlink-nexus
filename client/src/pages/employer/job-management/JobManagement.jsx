import React, { useState } from 'react';
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
    AlertTriangle
} from 'lucide-react';

// --- Custom Modal Component ---
const CustomModal = ({ isOpen, onClose, title, message, type, onConfirm }) => {
    if (!isOpen) return null;

    const styles = {
        overlay: {
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 10, 26, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            animation: 'fadeIn 0.2s ease-out'
        },
        modal: {
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: '40px',
            maxWidth: '450px',
            width: '90%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            textAlign: 'center',
            animation: 'slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        },
        iconBox: {
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 25px',
            backgroundColor: type === 'success' ? '#ECFDF5' : (type === 'confirm' ? '#FFFBEB' : '#FEF2F2'),
            color: type === 'success' ? '#059669' : (type === 'confirm' ? '#D97706' : '#DC2626')
        },
        title: {
            fontSize: '1.5rem',
            fontWeight: '800',
            color: 'var(--text-main)',
            marginBottom: '10px'
        },
        message: {
            fontSize: '1rem',
            color: 'var(--text-muted)',
            lineHeight: '1.6',
            marginBottom: '30px'
        },
        btnGroup: {
            display: 'flex',
            gap: '12px',
            justifyContent: 'center'
        },
        primaryBtn: {
            padding: '12px 24px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            backgroundColor: type === 'success' ? '#059669' : (type === 'confirm' ? '#D97706' : '#ef4444'),
            color: 'white',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s'
        },
        secondaryBtn: {
            padding: '12px 24px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'transparent',
            color: 'var(--text-muted)',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
        }
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <div style={styles.iconBox}>
                    {type === 'success' && <CheckCircle2 size={40} />}
                    {type === 'confirm' && <AlertTriangle size={40} />}
                    {type === 'alert' && <AlertCircle size={40} />}
                </div>
                <h2 style={styles.title}>{title}</h2>
                <p style={styles.message}>{message}</p>
                <div style={styles.btnGroup}>
                    {type === 'confirm' && (
                        <button style={styles.secondaryBtn} onClick={onClose}>Cancel</button>
                    )}
                    <button
                        style={styles.primaryBtn}
                        onClick={() => {
                            if (onConfirm) onConfirm();
                            onClose();
                        }}
                    >
                        {type === 'confirm' ? 'Confirm' : 'Got it'}
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};



const JobManagement = () => {
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

    // --- Helper Functions ---
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
        showModal(
            'Job Applications',
            `Redirecting to applications for ${job.title}. Total applicants: ${job.applicants || 0}`,
            'success'
        );
    };

    const styles = {
        container: {
            padding: '40px 20px',
            maxWidth: '1200px',
            margin: '0 auto',
            fontFamily: 'var(--font-body)',
            animation: 'fadeIn 0.5s ease-out'
        },
        headerBanner: {
            background: 'linear-gradient(135deg, var(--color-brand-primary) 0%, #1a2a5e 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '40px',
            color: 'white',
            marginBottom: '40px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(5, 10, 26, 0.15)'
        },
        bannerContent: {
            position: 'relative',
            zIndex: 2
        },
        bannerTitle: {
            fontSize: '2.2rem',
            fontWeight: '800',
            marginBottom: '10px',
            letterSpacing: '-0.02em'
        },
        bannerSubtitle: {
            fontSize: '1.1rem',
            opacity: 0.9,
            maxWidth: '600px'
        },
        bannerDecoration: {
            position: 'absolute',
            right: '-50px',
            top: '-50px',
            width: '250px',
            height: '250px',
            background: 'var(--color-brand-accent)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            opacity: 0.3
        },
        postTriggerCard: {
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-premium)',
            border: isEditing ? '2px solid var(--color-brand-accent)' : '1px solid var(--border-subtle)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginBottom: '20px'
        },
        formWrapper: {
            maxHeight: isFormExpanded ? '2000px' : '0',
            opacity: isFormExpanded ? 1 : 0,
            overflow: 'hidden',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            marginBottom: isFormExpanded ? '40px' : '0'
        },
        section: {
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: '35px',
            boxShadow: 'var(--shadow-premium)',
            border: '1px solid var(--border-subtle)'
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '24px'
        },
        input: {
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.95rem',
            backgroundColor: '#F9FAFB',
            transition: 'all 0.2s ease',
            outline: 'none'
        },
        textarea: {
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.95rem',
            backgroundColor: '#F9FAFB',
            minHeight: '140px',
            resize: 'vertical',
            outline: 'none',
            transition: 'all 0.2s ease'
        },
        submitBtn: {
            padding: '16px 32px',
            backgroundColor: 'var(--color-brand-accent)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: '700',
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            boxShadow: '0 4px 14px rgba(62, 97, 255, 0.2)'
        },
        tableCard: {
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-premium)',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden',
            marginTop: '20px'
        },
        tableHeader: {
            padding: '24px 30px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#fff'
        },
        emptyState: {
            padding: '80px 40px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            color: 'var(--text-muted)'
        },
        actionBtn: {
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginRight: '8px'
        },
        badge: (type) => ({
            padding: '5px 14px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            backgroundColor: type === 'Active' ? '#ECFDF5' : '#FEF2F2',
            color: type === 'Active' ? '#059669' : '#DC2626',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
        })
    };

    return (
        <div style={styles.container}>
            {/* Custom Modal */}
            <CustomModal
                isOpen={modal.isOpen}
                onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                onConfirm={modal.onConfirm}
            />

            {/* Header Banner */}
            <div style={styles.headerBanner}>
                <div style={styles.bannerDecoration} />
                <div style={styles.bannerContent}>
                    <h1 style={styles.bannerTitle}>Job Management</h1>
                    <p style={styles.bannerSubtitle}>
                        Streamline your hiring process. Create, manage, and track your job applications with ease from one central hub.
                    </p>
                </div>
            </div>

            {/* Collapsible Trigger */}
            <div
                style={{
                    ...styles.postTriggerCard,
                    transform: isFormExpanded ? 'translateY(5px)' : 'translateY(0)'
                }}
                className="hover-card"
                onClick={() => {
                    if (!isFormExpanded) {
                        setIsFormExpanded(true);
                    } else if (!isEditing) {
                        setIsFormExpanded(false);
                    }
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '15px',
                        backgroundColor: isEditing ? 'rgba(62, 97, 255, 0.2)' : 'rgba(62, 97, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-brand-accent)'
                    }}>
                        {isEditing ? <Edit size={28} /> : <PlusCircle size={28} />}
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)' }}>
                            {isEditing ? `Editing: ${formData.title}` : 'Post New Job Opening'}
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            {isEditing ? 'Modify the details and save changes' : 'Fill in the details to find your next great hire'}
                        </p>
                    </div>
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                    {isFormExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
            </div>

            {/* Collapsible Form */}
            <div style={styles.formWrapper}>
                <section style={styles.section}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', color: 'var(--text-muted)' }}>
                            <Info size={18} />
                            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Complete all required fields marked with *</span>
                        </div>

                        <div style={styles.grid}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Job Title *</label>
                                <input
                                    style={{ ...styles.input, width: '100%', borderColor: errors.title ? '#ef4444' : 'var(--border-subtle)' }}
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Senior Product Designer"
                                />
                                {errors.title && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '5px' }}>{errors.title}</p>}
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Location *</label>
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={18} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                                    <input
                                        style={{ ...styles.input, width: '100%', paddingRight: '45px', borderColor: errors.location ? '#ef4444' : 'var(--border-subtle)' }}
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Remote / Kathmandu"
                                    />
                                </div>
                                {errors.location && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '5px' }}>{errors.location}</p>}
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Salary (Annual/Monthly) *</label>
                                <div style={{ position: 'relative' }}>
                                    <DollarSign size={18} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                                    <input
                                        type="number"
                                        style={{ ...styles.input, width: '100%', paddingRight: '45px', borderColor: errors.salary ? '#ef4444' : 'var(--border-subtle)' }}
                                        name="salary"
                                        value={formData.salary}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 50000"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Job Type</label>
                                <select
                                    style={{ ...styles.input, width: '100%' }}
                                    name="jobType"
                                    value={formData.jobType}
                                    onChange={handleInputChange}
                                >
                                    <option>Full-time</option>
                                    <option>Part-time</option>
                                    <option>Contract</option>
                                    <option>Internship</option>
                                    <option>Freelance</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Application Deadline *</label>
                                <div style={{ position: 'relative' }}>
                                    <Calendar size={18} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                                    <input
                                        type="date"
                                        style={{ ...styles.input, width: '100%', paddingRight: '45px', borderColor: errors.deadline ? '#ef4444' : 'var(--border-subtle)' }}
                                        name="deadline"
                                        value={formData.deadline}
                                        onChange={handleInputChange}
                                        min={new Date().toISOString().split('T')[0]} // Prevent past dates
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Job Description *</label>
                            <textarea
                                style={{ ...styles.textarea, width: '100%', borderColor: errors.description ? '#ef4444' : 'var(--border-subtle)' }}
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe the role, team, and company culture..."
                            />
                        </div>

                        <div style={styles.grid}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Key Responsibilities</label>
                                <textarea
                                    style={{ ...styles.textarea, width: '100%', minHeight: '100px' }}
                                    name="responsibilities"
                                    value={formData.responsibilities}
                                    onChange={handleInputChange}
                                    placeholder="List the main tasks..."
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Required Qualifications</label>
                                <textarea
                                    style={{ ...styles.textarea, width: '100%', minHeight: '100px' }}
                                    name="qualifications"
                                    value={formData.qualifications}
                                    onChange={handleInputChange}
                                    placeholder="Skills, experience, certificates..."
                                />
                            </div>
                        </div>

                        {/* Skills Tag Input */}
                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Skills Required (Press Enter)</label>
                            <input
                                style={{ ...styles.input, width: '100%' }}
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={handleAddSkill}
                                placeholder="e.g. React, Node.js, Photoshop..."
                            />
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                                {skills.map((skill, index) => (
                                    <span key={index} style={{
                                        backgroundColor: '#EEF2FF',
                                        color: '#4F46E5',
                                        padding: '6px 14px',
                                        borderRadius: '12px',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}>
                                        {skill}
                                        <X size={14} style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => removeSkill(skill)} />
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button type="submit" style={styles.submitBtn} className="btn-scale">
                                <CheckCircle2 size={20} />
                                {isEditing ? 'Save Changes' : 'Publish Job Opening'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsFormExpanded(false);
                                    setIsEditing(false);
                                    setEditId(null);
                                    setFormData({
                                        title: '', location: '', salary: '', jobType: 'Full-time',
                                        deadline: '', description: '', responsibilities: '',
                                        qualifications: '', specification: '', education: ''
                                    });
                                    setSkills([]);
                                }}
                                style={{ padding: '16px 24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'transparent', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </section>
            </div>

            {/* Manage Jobs Section */}
            <div style={styles.tableCard}>
                <div style={styles.tableHeader}>
                    <div>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>Manage Jobs</h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>You have {serverJobs.length} active job postings</p>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#F9FAFB' }}>
                                <th style={{ padding: '16px 30px', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '700' }}>Job Information</th>
                                <th style={{ padding: '16px 30px', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '700' }}>Post Date</th>
                                <th style={{ padding: '16px 30px', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '700' }}>Status</th>
                                <th style={{ padding: '16px 30px', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '700' }}>Applicants</th>
                                <th style={{ padding: '16px 30px', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '700' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobsLoading ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading your jobs...</td>
                                </tr>
                            ) : serverJobs.length > 0 ? (
                                serverJobs.map(job => (
                                    <tr key={job.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s' }} className="table-row">
                                        <td style={{ padding: '20px 30px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                                    <Briefcase size={20} />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '1rem' }}>{job.title}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <MapPin size={12} /> {job.location}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 30px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Clock size={14} /> {job.postedDate || new Date(job.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 30px' }}>
                                            <span style={styles.badge(job.status || 'Active')}>
                                                {(job.status || 'Active') === 'Active' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                                {job.status || 'Active'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '20px 30px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontWeight: '600' }}>
                                                <Users size={16} color="var(--color-brand-accent)" />
                                                {job.applicants || 0}
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 30px' }}>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                <button
                                                    style={{ ...styles.actionBtn, backgroundColor: '#EFF6FF', color: '#3B82F6' }}
                                                    title="Edit"
                                                    onClick={() => editJob(job)}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    style={{ ...styles.actionBtn, backgroundColor: '#FEF2F2', color: '#EF4444' }}
                                                    title="Delete"
                                                    onClick={() => deleteJob(job.id)}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <button
                                                    style={{ ...styles.actionBtn, backgroundColor: '#F5F3FF', color: '#8B5CF6' }}
                                                    title="View Applicants"
                                                    onClick={() => viewApplications(job)}
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">
                                        <div style={styles.emptyState}>
                                            <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                                                <Search size={48} color="#D1D5DB" />
                                            </div>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>No jobs posted yet</h3>
                                            <p style={{ maxWidth: '300px', margin: '0 auto' }}>Your job vacancies will appear here. Start by creating a new job opening to find your perfect candidate.</p>
                                            <button
                                                onClick={() => setIsFormExpanded(true)}
                                                style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: 'var(--color-brand-accent)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}
                                            >
                                                Create Your First Job
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .hover-card:hover {
                    box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important;
                    border-color: var(--color-brand-accent) !important;
                }
                .table-row:hover {
                    background-color: #F9FAFB !important;
                }
                .btn-scale:active {
                    transform: scale(0.95);
                }
                input:focus, textarea:focus, select:focus {
                    background-color: white !important;
                    border-color: var(--color-brand-accent) !important;
                    box-shadow: 0 0 0 4px rgba(62, 97, 255, 0.1) !important;
                }
            `}</style>
        </div>
    );
};

export default JobManagement;
