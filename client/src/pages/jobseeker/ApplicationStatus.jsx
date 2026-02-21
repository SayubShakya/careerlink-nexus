import React, { useState } from 'react';
import { useGetAppliedJobs } from '@/hooks/api/jobs/useJobs';
import {
    Clock,
    CheckCircle2,
    XCircle,
    Search,
    Filter,
    Briefcase,
    MapPin,
    Calendar,
    ChevronRight,
    ArrowUpRight,
    Inbox,
    Building2,
    Loader2
} from 'lucide-react';

const ApplicationStatus = () => {
    const { data: appliedJobs = [], isLoading } = useGetAppliedJobs();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filteredJobs = appliedJobs.filter(job => {
        const matchesSearch = job.JobListing?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.JobListing?.Employer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Shortlisted': return { bg: '#ECFDF5', text: '#059669', icon: <CheckCircle2 size={16} /> };
            case 'Rejected': return { bg: '#FEF2F2', text: '#DC2626', icon: <XCircle size={16} /> };
            case 'Accepted': return { bg: '#EFF6FF', text: '#2563EB', icon: <CheckCircle2 size={16} /> };
            default: return { bg: '#FFFBEB', text: '#D97706', icon: <Clock size={16} /> }; // Pending
        }
    };

    const styles = {
        container: {
            padding: '40px 20px',
            maxWidth: '1200px',
            margin: '0 auto',
            fontFamily: 'Inter, system-ui, sans-serif'
        },
        header: {
            marginBottom: '32px'
        },
        title: {
            fontSize: '2.5rem',
            fontWeight: '900',
            color: '#0F172A',
            letterSpacing: '-0.025em',
            marginBottom: '8px'
        },
        subtitle: {
            fontSize: '1.1rem',
            color: '#64748B',
            fontWeight: '500'
        },
        filters: {
            display: 'flex',
            gap: '16px',
            marginBottom: '32px',
            flexWrap: 'wrap'
        },
        searchBox: {
            position: 'relative',
            flex: 1,
            minWidth: '300px'
        },
        input: {
            width: '100%',
            padding: '12px 16px 12px 48px',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            fontSize: '0.95rem',
            outline: 'none',
            transition: 'all 0.2s',
            background: 'white'
        },
        select: {
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            fontSize: '0.95rem',
            outline: 'none',
            background: 'white',
            cursor: 'pointer',
            minWidth: '160px'
        },
        jobGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px'
        },
        jobCard: {
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            position: 'relative',
            overflow: 'hidden'
        },
        statusBadge: (status) => {
            const colors = getStatusColor(status);
            return {
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '100px',
                fontSize: '0.8rem',
                fontWeight: '700',
                backgroundColor: colors.bg,
                color: colors.text
            };
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Track Applications</h1>
                <p style={styles.subtitle}>Keep an eye on the status of your submitted job applications.</p>
            </div>

            <div style={styles.filters}>
                <div style={styles.searchBox}>
                    <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} size={20} />
                    <input
                        style={styles.input}
                        placeholder="Search by job or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    style={styles.select}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Accepted">Accepted</option>
                </select>
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
                    <Loader2 className="animate-spin" size={48} color="#3E61FF" />
                </div>
            ) : filteredJobs.length > 0 ? (
                <div style={styles.jobGrid}>
                    {filteredJobs.map((app, index) => {
                        const job = app.JobListing || {};
                        const employer = job.Employer || {};
                        const statusInfo = getStatusColor(app.status);

                        return (
                            <div key={app.id} style={styles.jobCard} className="hover-lift">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                                        {employer.logo ? (
                                            <img src={`/${employer.logo}`} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                                        ) : (
                                            <Building2 size={24} />
                                        )}
                                    </div>
                                    <div style={styles.statusBadge(app.status)}>
                                        {statusInfo.icon}
                                        {app.status}
                                    </div>
                                </div>

                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E293B', marginBottom: '4px' }}>{job.title}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontWeight: '600', fontSize: '0.9rem' }}>
                                        <Building2 size={16} /> {employer.name || 'Nexus Partner'}
                                    </div>
                                </div>

                                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '0.85rem' }}>
                                        <MapPin size={14} /> {job.location}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '0.85rem' }}>
                                        <Calendar size={14} /> Applied on {new Date(app.applied_at).toLocaleDateString()}
                                    </div>
                                </div>

                                <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
                                    <button
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            borderRadius: '12px',
                                            backgroundColor: '#F8FAFC',
                                            border: '1px solid #E2E8F0',
                                            color: '#475569',
                                            fontWeight: '700',
                                            fontSize: '0.9rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => window.location.href = `/jobseeker/jobs/${job.id}`}
                                    >
                                        View Job Details <ArrowUpRight size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '100px 40px', background: '#F8FAFC', borderRadius: '24px', border: '2px dashed #E2E8F0' }}>
                    <div style={{ width: '80px', height: '80px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Inbox size={40} color="#CBD5E1" />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1E293B', marginBottom: '8px' }}>No applications found</h3>
                    <p style={{ color: '#64748B', maxWidth: '400px', margin: '0 auto' }}>
                        {searchTerm || statusFilter !== 'All'
                            ? "Try adjusting your filters to find what you're looking for."
                            : "You haven't applied to any jobs yet. Start exploring opportunities!"}
                    </p>
                </div>
            )}

            <style>{`
                .hover-lift:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    border-color: #3E61FF;
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default ApplicationStatus;
