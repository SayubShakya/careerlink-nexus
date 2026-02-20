import React, { useState } from 'react';
import {
    Search,
    Filter,
    Eye,
    CheckCircle2,
    XCircle,
    FileText,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Briefcase,
    ChevronDown,
    User,
    X,
    ExternalLink,
    AlertCircle,
    Download,
    ChevronRight,
    AlertTriangle,
    Inbox,
    RefreshCw
} from 'lucide-react';

// --- Custom Confirmation Modal ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type = 'warning' }) => {
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
            zIndex: 3000,
            animation: 'fadeIn 0.2s ease-out'
        },
        modal: {
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: '30px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            textAlign: 'center',
            animation: 'slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <div style={{
                    width: '60px', height: '60px', borderRadius: '50%', backgroundColor: type === 'warning' ? '#FEF3C7' : '#FEE2E2',
                    color: type === 'warning' ? '#D97706' : '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
                }}>
                    <AlertTriangle size={30} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>{title}</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '25px', lineHeight: '1.6' }}>{message}</p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button
                        onClick={onClose}
                        style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'transparent', fontWeight: '600', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => { onConfirm(); onClose(); }}
                        style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: type === 'warning' ? '#D97706' : '#DC2626', color: 'white', fontWeight: '700', cursor: 'pointer' }}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Candidate Details Modal ---
const CandidateModal = ({ isOpen, onClose, candidate, onShortlist, onReject }) => {
    if (!isOpen || !candidate) return null;

    const styles = {
        overlay: {
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 10, 26, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            animation: 'fadeIn 0.3s ease-out'
        },
        modal: {
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            width: '95%',
            maxWidth: '900px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            animation: 'slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none' // IE/Edge
        },
        closeBtn: {
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'white',
            border: 'none',
            borderRadius: '12px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        },
        header: {
            padding: '60px 50px 40px',
            background: 'linear-gradient(135deg, var(--color-brand-primary) 0%, #1a2a5e 100%)',
            color: 'white',
            display: 'flex',
            gap: '30px',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
        },
        avatar: {
            width: '120px',
            height: '120px',
            borderRadius: '30px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            fontWeight: '800',
            position: 'relative',
            zIndex: 2
        },
        bannerDecoration: {
            position: 'absolute',
            right: '-10%',
            top: '-20%',
            width: '300px',
            height: '300px',
            background: 'var(--color-brand-accent)',
            borderRadius: '50%',
            filter: 'blur(100px)',
            opacity: 0.2
        },
        content: {
            padding: '40px 50px'
        },
        group: {
            marginBottom: '40px'
        },
        sectionTitle: {
            fontSize: '1.25rem',
            fontWeight: '800',
            color: 'var(--text-main)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderBottom: '2px solid #f3f4f6',
            paddingBottom: '10px'
        },
        detailCard: {
            backgroundColor: '#F9FAFB',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            border: '1px solid var(--border-subtle)',
            lineHeight: '1.7',
            color: 'var(--text-muted)'
        },
        footer: {
            padding: '24px 50px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: '#fff',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '16px',
            position: 'sticky',
            bottom: 0,
            zIndex: 5
        }
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()} className="hide-scrollbar">
                <button style={styles.closeBtn} onClick={onClose} className="btn-scale"><X size={24} /></button>

                <div style={styles.header}>
                    <div style={styles.bannerDecoration} />
                    <div style={styles.avatar}>{candidate.name.charAt(0)}</div>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.02em' }}>{candidate.name}</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.9 }}>
                                <Briefcase size={18} /> {candidate.jobTitle}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.9 }}>
                                <MapPin size={18} /> {candidate.location}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={styles.content}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '50px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Mail size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Email Address</div>
                                <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{candidate.email}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Phone size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Phone Number</div>
                                <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{candidate.phone}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: '#FFF7ED', color: '#C2410C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Calendar size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Applied Date</div>
                                <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{candidate.appliedDate}</div>
                            </div>
                        </div>
                    </div>

                    <div style={styles.group}>
                        <h3 style={styles.sectionTitle}><User size={22} color="var(--color-brand-accent)" /> Professional Summary</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.05rem' }}>{candidate.about || "No summary provided."}</p>
                    </div>

                    <div style={styles.group}>
                        <h3 style={styles.sectionTitle}><CheckCircle2 size={22} color="#059669" /> Top Skills</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {candidate.skills.map((skill, i) => (
                                <span key={i} style={{ padding: '8px 18px', backgroundColor: '#F3F4F6', color: '#374151', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '700', border: '1px solid #e5e7eb' }}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div style={styles.group}>
                        <h3 style={styles.sectionTitle}><FileText size={22} color="var(--color-brand-accent)" /> Education Path</h3>
                        <div style={styles.detailCard}>{candidate.education}</div>
                    </div>

                    <div style={styles.group}>
                        <h3 style={styles.sectionTitle}><RefreshCw size={22} color="#8B5CF6" /> Cover Letter</h3>
                        <div style={{ ...styles.detailCard, position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '20px', right: '20px', color: '#d1d5db' }}><X size={40} opacity={0.1} /></div>
                            {candidate.coverLetter}
                        </div>
                    </div>
                </div>

                <div style={styles.footer}>
                    <div style={{ display: 'flex', gap: '12px', marginRight: 'auto' }}>
                        {candidate.status !== 'Shortlisted' && (
                            <button
                                style={{ padding: '12px 24px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
                                className="btn-scale"
                                onClick={() => { onShortlist(candidate.id); onClose(); }}
                            >
                                <CheckCircle2 size={18} /> Shortlist
                            </button>
                        )}
                        {candidate.status !== 'Rejected' && (
                            <button
                                style={{ padding: '12px 24px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
                                className="btn-scale"
                                onClick={() => { onReject(candidate.id); onClose(); }}
                            >
                                <XCircle size={18} /> Reject
                            </button>
                        )}
                        {candidate.status !== 'Pending' && (
                            <button
                                style={{ padding: '12px 24px', backgroundColor: '#f3f4f6', color: 'var(--text-main)', border: '1px solid #e5e7eb', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
                                className="btn-scale"
                                onClick={() => { onShortlist(candidate.id, 'Pending'); onClose(); }}
                            >
                                <RefreshCw size={18} /> Reset to Pending
                            </button>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'transparent', fontWeight: '700', cursor: 'pointer' }}
                    >
                        Close Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

const Applications = () => {
    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [jobFilter, setJobFilter] = useState('All Jobs');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [selectedApp, setSelectedApp] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, onConfirm: null, title: '', message: '' });

    const [applications, setApplications] = useState([
        {
            id: 1,
            name: 'Aayush Shrestha',
            email: 'aayush.shr@gmail.com',
            phone: '+977 9841234567',
            location: 'Lalitpur, Nepal',
            jobTitle: 'Senior Software Engineer',
            appliedDate: '2026-02-15',
            status: 'Pending',
            skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
            education: 'B.E. in Computer Engineering, Kathmandu University',
            about: 'Passionate full-stack developer with 5+ years of experience in building scalable web applications. Expert in modern JavaScript frameworks and cloud infrastructure.',
            coverLetter: 'I am highly interested in the Senior Software Engineer position at CareerLink. With my background in React and Node.js, I believe I can contribute significantly to your team...'
        },
        {
            id: 2,
            name: 'Sita Sharma',
            email: 'sita.sharma@outlook.com',
            phone: '+977 9801122334',
            location: 'Kathmandu, Nepal',
            jobTitle: 'Junior Product Designer',
            appliedDate: '2026-02-16',
            status: 'Shortlisted',
            skills: ['Figma', 'UI/UX', 'Adobe XD', 'Prototyping'],
            education: 'B.Sc. in IT, Amrit Science Campus',
            about: 'Creative designer focused on user-centric experiences and clean aesthetics. Always looking for the intersection of functionality and beauty.',
            coverLetter: 'I have been following CareerLink for a while now and I love the product. As a designer, I want to help make it even more intuitive for users...'
        },
        {
            id: 3,
            name: 'Rohan Thapa',
            email: 'rohan.t@gmail.com',
            phone: '+977 9812345678',
            location: 'Pokhara, Nepal',
            jobTitle: 'Marketing Specialist',
            appliedDate: '2026-02-14',
            status: 'Rejected',
            skills: ['SEO', 'Content Strategy', 'Google Analytics'],
            education: 'MBA in Marketing, Tribhuvan University',
            about: 'Result-oriented marketing professional with a track record of successful digital campaigns across various industries.',
            coverLetter: 'My experience in Pokhara-based startups has prepared me for high-growth environments where agility and data-driven decisions are key.'
        }
    ]);

    // Derived Job Titles for filter
    const uniqueJobs = ['All Jobs', ...new Set(applications.map(app => app.jobTitle))];

    // Filter Logic
    const filteredApps = applications.filter(app => {
        const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesJob = jobFilter === 'All Jobs' || app.jobTitle === jobFilter;
        const matchesStatus = statusFilter === 'All Status' || app.status === statusFilter;
        return matchesSearch && matchesJob && matchesStatus;
    });

    const triggerAction = (id, newStatus) => {
        if (newStatus === 'Rejected') {
            const app = applications.find(a => a.id === id);
            setConfirmModal({
                isOpen: true,
                title: 'Reject Application',
                message: `Are you sure you want to reject ${app.name}? This candidate will be notified of your decision.`,
                onConfirm: () => updateStatus(id, newStatus)
            });
        } else {
            updateStatus(id, newStatus);
        }
    };

    const updateStatus = (id, newStatus) => {
        setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
    };

    const styles = {
        container: {
            padding: '30px 20px',
            maxWidth: '1180px',
            margin: '0 auto',
            fontFamily: 'var(--font-body)',
            animation: 'fadeIn 0.5s ease-out'
        },
        headerBanner: {
            background: 'linear-gradient(135deg, var(--color-brand-primary) 0%, #1a2a5e 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '35px 50px',
            color: 'white',
            marginBottom: '30px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(5, 10, 26, 0.15)'
        },
        bannerContent: {
            position: 'relative',
            zIndex: 2
        },
        bannerTitle: {
            fontSize: '2.5rem',
            fontWeight: '800',
            marginBottom: '10px',
            letterSpacing: '-0.02em'
        },
        bannerSubtitle: {
            fontSize: '1.2rem',
            opacity: 0.9,
            maxWidth: '600px'
        },
        bannerDecoration: {
            position: 'absolute',
            right: '-50px',
            top: '-50px',
            width: '280px',
            height: '280px',
            background: 'var(--color-brand-accent)',
            borderRadius: '50%',
            filter: 'blur(90px)',
            opacity: 0.3
        },
        filterCard: {
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 30px',
            boxShadow: 'var(--shadow-premium)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '25px',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            alignItems: 'center'
        },
        searchWrapper: {
            position: 'relative',
            flex: '1',
            minWidth: '300px'
        },
        input: {
            width: '100%',
            padding: '16px 20px 16px 55px',
            borderRadius: '15px',
            border: '1px solid var(--border-subtle)',
            backgroundColor: '#F9FAFB',
            fontSize: '1rem',
            outline: 'none',
            transition: 'all 0.3s ease'
        },
        select: {
            padding: '16px 24px',
            borderRadius: '15px',
            border: '1px solid var(--border-subtle)',
            backgroundColor: '#F9FAFB',
            fontSize: '1rem',
            outline: 'none',
            cursor: 'pointer',
            minWidth: '200px',
            transition: 'all 0.3s ease'
        },
        tableWrapper: {
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-premium)',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden'
        },
        statusBadge: (status) => {
            let bg, color, icon;
            switch (status) {
                case 'Shortlisted': bg = '#ECFDF5'; color = '#059669'; icon = <CheckCircle2 size={12} />; break;
                case 'Rejected': bg = '#FEF2F2'; color = '#DC2626'; icon = <XCircle size={12} />; break;
                default: bg = '#FFFBEB'; color = '#D97706'; icon = <AlertCircle size={12} />; // Pending
            }
            return (
                <span style={{
                    padding: '6px 14px', borderRadius: '25px', fontSize: '0.8rem', fontWeight: '800',
                    backgroundColor: bg, color: color, display: 'inline-flex', alignItems: 'center', gap: '8px'
                }}>
                    {icon} {status}
                </span>
            );
        },
        actionBtn: (type) => ({
            padding: '10px 18px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '0.85rem',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: type === 'details' ? '#EFF6FF' : (type === 'success' ? '#ECFDF5' : '#FEF2F2'),
            color: type === 'details' ? '#3B82F6' : (type === 'success' ? '#059669' : '#EF4444')
        }),
        emptyState: {
            textAlign: 'center',
            padding: '120px 40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }
    };

    return (
        <div style={styles.container}>
            {/* Candidate Details Modal */}
            <CandidateModal
                isOpen={!!selectedApp}
                onClose={() => setSelectedApp(null)}
                candidate={selectedApp}
                onShortlist={(id, status = 'Shortlisted') => updateStatus(id, status)}
                onReject={(id) => triggerAction(id, 'Rejected')}
            />

            {/* Confirmation Modal */}
            <ConfirmationModal
                {...confirmModal}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
            />

            {/* Header Banner */}
            <header style={styles.headerBanner}>
                <div style={styles.bannerDecoration} />
                <div style={styles.bannerContent}>
                    <h1 style={styles.bannerTitle}>Applications Hub</h1>
                    <p style={styles.bannerSubtitle}>Efficiently track, review, and hire the best talent from your candidate pool.</p>
                </div>
            </header>

            {/* Filters Section */}
            <div style={styles.filterCard}>
                <div style={styles.searchWrapper}>
                    <Search size={22} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                    <input
                        style={styles.input}
                        className="main-input"
                        placeholder="Search candidates by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ position: 'relative' }}>
                        <select style={styles.select} className="main-input" value={jobFilter} onChange={(e) => setJobFilter(e.target.value)}>
                            {uniqueJobs.map(job => <option key={job}>{job}</option>)}
                        </select>
                    </div>
                    <select style={styles.select} className="main-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option>All Status</option>
                        <option>Pending</option>
                        <option>Shortlisted</option>
                        <option>Rejected</option>
                    </select>
                </div>
            </div>

            {/* Table Section */}
            <div style={styles.tableWrapper}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '2px solid #f3f4f6' }}>
                                <th style={{ padding: '16px 30px', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '0.05em' }}>Candidate Profile</th>
                                <th style={{ padding: '16px 30px', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '0.05em' }}>Position</th>
                                <th style={{ padding: '16px 30px', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '0.05em' }}>Review CV</th>
                                <th style={{ padding: '16px 30px', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '0.05em' }}>Submission</th>
                                <th style={{ padding: '16px 30px', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '0.05em' }}>Current Status</th>
                                <th style={{ padding: '16px 30px', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '0.05em' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApps.length > 0 ? (
                                filteredApps.map((app, index) => (
                                    <tr
                                        key={app.id}
                                        style={{
                                            borderBottom: '1px solid #f3f4f6',
                                            transition: 'background 0.2s',
                                            animation: `fadeInUp 0.4s ease-out forwards ${index * 0.1}s`,
                                            opacity: 0
                                        }}
                                        className="table-row"
                                    >
                                        <td style={{ padding: '18px 30px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div style={{
                                                    width: '42px', height: '42px', borderRadius: '12px',
                                                    backgroundColor: 'var(--color-brand-primary)', color: 'white',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800',
                                                    fontSize: '1rem', boxShadow: '0 4px 12px rgba(5, 10, 26, 0.1)'
                                                }}>
                                                    {app.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '0.95rem' }}>{app.name}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <Mail size={12} /> {app.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '18px 30px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: '#4B5563', fontSize: '0.9rem' }}>
                                                <Briefcase size={14} color="var(--color-brand-accent)" />
                                                {app.jobTitle}
                                            </div>
                                        </td>
                                        <td style={{ padding: '18px 30px' }}>
                                            <button
                                                style={{ background: '#f3f4f6', border: 'none', color: 'var(--text-main)', padding: '8px 14px', borderRadius: '10px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', transition: 'all 0.2s' }}
                                                className="btn-scale"
                                            >
                                                <Download size={14} /> Resume
                                            </button>
                                        </td>
                                        <td style={{ padding: '18px 30px', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Calendar size={14} /> {app.appliedDate}
                                            </div>
                                        </td>
                                        <td style={{ padding: '18px 30px' }}>
                                            {styles.statusBadge(app.status)}
                                        </td>
                                        <td style={{ padding: '18px 30px' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    style={styles.actionBtn('details')}
                                                    className="btn-scale"
                                                    onClick={() => setSelectedApp(app)}
                                                >
                                                    <Eye size={14} /> Details
                                                </button>

                                                {app.status !== 'Shortlisted' && (
                                                    <button
                                                        style={styles.actionBtn('success')}
                                                        title="Shortlist"
                                                        className="btn-scale"
                                                        onClick={() => updateStatus(app.id, 'Shortlisted')}
                                                    >
                                                        <CheckCircle2 size={14} />
                                                    </button>
                                                )}

                                                {app.status !== 'Rejected' && (
                                                    <button
                                                        style={styles.actionBtn('danger')}
                                                        title="Reject"
                                                        className="btn-scale"
                                                        onClick={() => triggerAction(app.id, 'Rejected')}
                                                    >
                                                        <XCircle size={14} />
                                                    </button>
                                                )}

                                                {app.status !== 'Pending' && (
                                                    <button
                                                        style={styles.actionBtn('details')}
                                                        title="Set to Pending"
                                                        className="btn-scale"
                                                        onClick={() => updateStatus(app.id, 'Pending')}
                                                    >
                                                        <RefreshCw size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">
                                        <div style={styles.emptyState}>
                                            <div style={{
                                                width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#F3F4F6',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px'
                                            }}>
                                                <Inbox size={60} color="#D1D5DB" />
                                            </div>
                                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>No candidates found</h3>
                                            <p style={{ maxWidth: '350px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                                We couldn't find any applications matching your current filters. Try refining your search or resetting the filters.
                                            </p>
                                            <button
                                                onClick={() => { setSearchQuery(''); setJobFilter('All Jobs'); setStatusFilter('All Status'); }}
                                                style={{ marginTop: '25px', padding: '12px 24px', background: 'var(--color-brand-primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}
                                                className="btn-scale"
                                            >
                                                Reset Filters
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
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { 
                    from { opacity: 0; transform: translateY(30px) scale(0.95); } 
                    to { opacity: 1; transform: translateY(0) scale(1); } 
                }

                .table-row:hover { background-color: #fcfcfd !important; }
                
                .main-input:focus {
                    background-color: white !important;
                    border-color: var(--color-brand-accent) !important;
                    box-shadow: 0 10px 20px rgba(62, 97, 255, 0.08) !important;
                    transform: translateY(-2px);
                }
                
                .btn-scale:hover { transform: scale(1.05); }
                .btn-scale:active { transform: scale(0.95); }

                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }

                @media (max-width: 1024px) {
                    .filterCard { flex-direction: column; align-items: stretch; }
                    .searchWrapper { width: 100%; }
                }
            `}</style>
        </div>
    );
};

export default Applications;
