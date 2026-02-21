import React, { useState } from 'react';
import { useGetSavedJobs, useUnsaveJob } from '@/hooks/api/jobs/useJobs';
import {
    Heart,
    Briefcase,
    MapPin,
    DollarSign,
    Zap,
    Calendar,
    ChevronRight,
    Search,
    Inbox,
    Building2,
    Loader2,
    ArrowUpRight,
    X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SavedJobs = () => {
    const navigate = useNavigate();
    const { data: savedJobs = [], isLoading } = useGetSavedJobs();
    const { mutate: unsaveJob } = useUnsaveJob();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredJobs = savedJobs.filter(item => {
        const job = item.JobListing || {};
        const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.Employer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const handleUnsave = (e, id) => {
        e.stopPropagation();
        unsaveJob(id, {
            onSuccess: () => {
                toast.success('Job removed from saved list');
            }
        });
    };

    const styles = {
        container: {
            padding: '40px 80px',
            maxWidth: '1400px',
            margin: '0 auto',
            minHeight: '100vh',
            fontFamily: 'Inter, system-ui, sans-serif'
        },
        header: {
            marginBottom: '40px'
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
        controls: {
            display: 'flex',
            gap: '20px',
            marginBottom: '40px'
        },
        searchBox: {
            position: 'relative',
            flex: 1,
            maxWidth: '500px'
        },
        input: {
            width: '100%',
            padding: '14px 16px 14px 48px',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            fontSize: '1rem',
            outline: 'none',
            transition: 'all 0.2s',
            background: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        },
        jobGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '24px'
        },
        jobCard: {
            background: 'white',
            borderRadius: '24px',
            padding: '24px',
            border: '1px solid #E2E8F0',
            position: 'relative',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        },
        badge: {
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: '#F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748B',
            border: '1px solid #E2E8F0'
        },
        unsaveBtn: {
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#FEF2F2',
            color: '#EF4444',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Saved Jobs</h1>
                <p style={styles.subtitle}>Opportunities you've bookmarked for later.</p>
            </div>

            <div style={styles.controls}>
                <div style={styles.searchBox}>
                    <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} size={20} />
                    <input
                        style={styles.input}
                        placeholder="Search your saved jobs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
                    <Loader2 className="animate-spin" size={48} color="#3E61FF" />
                </div>
            ) : filteredJobs.length > 0 ? (
                <div style={styles.jobGrid}>
                    {filteredJobs.map((item) => {
                        const job = item.JobListing || {};
                        const employer = job.Employer || {};
                        return (
                            <div
                                key={item.id}
                                style={styles.jobCard}
                                className="saved-job-card"
                                onClick={() => navigate(`/jobseeker/jobs/${job.id}`)}
                            >
                                <button
                                    style={styles.unsaveBtn}
                                    onClick={(e) => handleUnsave(e, job.id)}
                                    title="Unsave Job"
                                >
                                    <Heart size={20} fill="#EF4444" />
                                </button>

                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    <div style={styles.badge}>
                                        {employer.logo ? (
                                            <img src={`/${employer.logo}`} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                                        ) : (
                                            <Building2 size={24} />
                                        )}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>{job.title}</h3>
                                        <div style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: '600' }}>{employer.name || 'Nexus Developer'}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#64748B', fontWeight: '600' }}>
                                        <MapPin size={14} /> {job.location}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#64748B', fontWeight: '600' }}>
                                        <Zap size={14} color="#3E61FF" /> {job.jobType || job.type}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#64748B', fontWeight: '600' }}>
                                        <DollarSign size={14} /> {job.salary}
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
                                            color: '#334155',
                                            fontWeight: '700',
                                            fontSize: '0.9rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        View Details <ArrowUpRight size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '100px 40px', background: '#F8FAFC', borderRadius: '32px', border: '2px dashed #E2E8F0' }}>
                    <div style={{ width: '80px', height: '80px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Heart size={40} color="#CBD5E1" />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1E293B', marginBottom: '8px' }}>No saved jobs</h3>
                    <p style={{ color: '#64748B', maxWidth: '400px', margin: '0 auto' }}>
                        {searchTerm
                            ? "No matches found for your search."
                            : "You haven't bookmarked any jobs yet. Start exploring jobs to save your favorites!"}
                    </p>
                    {!searchTerm && (
                        <button
                            style={{ marginTop: '24px', padding: '12px 24px', background: '#3E61FF', color: 'white', borderRadius: '12px', border: 'none', fontWeight: '800', cursor: 'pointer' }}
                            onClick={() => navigate('/jobseeker/find-jobs')}
                        >
                            Find Jobs
                        </button>
                    )}
                </div>
            )}

            <style>{`
                .saved-job-card:hover {
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

export default SavedJobs;
