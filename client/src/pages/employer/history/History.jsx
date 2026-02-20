import React, { useState, useMemo } from 'react';
import {
    Users,
    CheckCircle,
    XCircle,
    Clock,
    Search,
    Filter,
    Eye,
    ExternalLink,
    Calendar,
    Briefcase,
    Mail,
    Phone,
    MapPin,
    BarChart2
} from 'lucide-react';

const History = () => {
    // Dummy Data
    const [historyData, setHistoryData] = useState([
        {
            id: 1,
            candidateName: 'Aarya Sharma',
            jobTitle: 'Senior React Developer',
            appliedDate: '2026-02-10',
            processedDate: '2026-02-15',
            status: 'Accepted',
            email: 'aarya@example.com',
            phone: '+977-9841234567',
            location: 'Kathmandu, Nepal',
            experience: '5+ years'
        },
        {
            id: 2,
            candidateName: 'Bibek Thapa',
            jobTitle: 'UX/UI Designer',
            appliedDate: '2026-02-12',
            processedDate: '2026-02-14',
            status: 'Rejected',
            email: 'bibek@example.com',
            phone: '+977-9801234567',
            location: 'Pokhara, Nepal',
            experience: '3 years'
        },
        {
            id: 3,
            candidateName: 'Sita Rai',
            jobTitle: 'Backend Engineer',
            appliedDate: '2026-02-08',
            processedDate: '2026-02-16',
            status: 'Shortlisted',
            email: 'sita@example.com',
            phone: '+977-9811234567',
            location: 'Lalitpur, Nepal',
            experience: '4 years'
        },
        {
            id: 4,
            candidateName: 'Rohan Gurung',
            jobTitle: 'Project Manager',
            appliedDate: '2026-02-05',
            processedDate: '2026-02-10',
            status: 'Accepted',
            email: 'rohan@example.com',
            phone: '+977-9861234567',
            location: 'Butwal, Nepal',
            experience: '7 years'
        },
        {
            id: 5,
            candidateName: 'Maya Tamang',
            jobTitle: 'Frontend Developer',
            appliedDate: '2026-02-14',
            processedDate: '2026-02-18',
            status: 'Shortlisted',
            email: 'maya@example.com',
            phone: '+977-9821234567',
            location: 'Bhaktapur, Nepal',
            experience: '2 years'
        }
    ]);

    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Calculate Summary Stats
    const stats = useMemo(() => {
        return {
            total: historyData.length,
            accepted: historyData.filter(d => d.status === 'Accepted').length,
            rejected: historyData.filter(d => d.status === 'Rejected').length,
            shortlisted: historyData.filter(d => d.status === 'Shortlisted').length
        };
    }, [historyData]);

    const filteredData = useMemo(() => {
        if (filterStatus === 'All') return historyData;
        return historyData.filter(item => item.status === filterStatus);
    }, [filterStatus, historyData]);

    const handleViewDetails = (candidate) => {
        setSelectedCandidate(candidate);
        setIsModalOpen(true);
    };

    const styles = {
        container: {
            padding: 'var(--space-md)',
            animation: 'fadeIn 0.5s ease-out'
        },
        header: {
            marginBottom: 'var(--space-md)'
        },
        title: {
            fontSize: '1.8rem',
            fontWeight: '700',
            color: 'var(--text-main)',
            fontFamily: 'var(--font-heading)',
            marginBottom: '4px'
        },
        subtitle: {
            color: 'var(--text-muted)',
            fontSize: '1rem'
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-sm)',
            marginBottom: 'var(--space-md)'
        },
        statCard: {
            background: 'var(--card-dashboard)',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-premium)',
            border: '1px solid var(--border-dashboard)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            transition: 'transform 0.3s'
        },
        statIcon: (color) => ({
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            background: `${color}15`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }),
        statInfo: {
            display: 'flex',
            flexDirection: 'column'
        },
        statValue: {
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'var(--text-main)'
        },
        statLabel: {
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            fontWeight: '500'
        },
        controls: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-sm)',
            flexWrap: 'wrap',
            gap: '16px'
        },
        filterTabs: {
            display: 'flex',
            background: 'var(--bg-subtle)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-dashboard)'
        },
        tab: (isActive) => ({
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            background: isActive ? 'white' : 'transparent',
            color: isActive ? 'var(--color-brand-accent)' : 'var(--text-muted)',
            boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
            transition: 'all 0.2s'
        }),
        tableContainer: {
            background: 'var(--card-dashboard)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-premium)',
            border: '1px solid var(--border-dashboard)',
            overflow: 'hidden'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left'
        },
        th: {
            padding: '16px',
            borderBottom: '1px solid var(--border-dashboard)',
            fontSize: '0.85rem',
            fontWeight: '600',
            color: 'var(--text-muted)',
            backgroundColor: 'var(--bg-subtle)'
        },
        td: {
            padding: '16px',
            borderBottom: '1px solid var(--border-dashboard)',
            fontSize: '0.95rem',
            color: 'var(--text-main)'
        },
        badge: (status) => {
            const colors = {
                Accepted: { bg: '#dcfce7', text: '#166534' },
                Rejected: { bg: '#fee2e2', text: '#991b1b' },
                Shortlisted: { bg: '#e0e7ff', text: '#3730a3' }
            };
            const color = colors[status] || { bg: '#f3f4f6', text: '#4b5563' };
            return {
                padding: '4px 12px',
                fontSize: '0.75rem',
                fontWeight: '600',
                backgroundColor: color.bg,
                color: color.text,
                borderRadius: '20px',
                display: 'inline-block'
            };
        },
        viewBtn: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--color-brand-accent)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600'
        },
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.2s ease-out'
        },
        modalContent: {
            background: 'white',
            width: '90%',
            maxWidth: '500px',
            borderRadius: 'var(--radius-lg)',
            padding: '32px',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            animation: 'slideUp 0.3s ease-out'
        },
        analysisSection: {
            marginTop: 'var(--space-md)',
            background: 'var(--card-dashboard)',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-dashboard)',
            boxShadow: 'var(--shadow-premium)'
        },
        progressBar: {
            height: '10px',
            background: 'var(--bg-subtle)',
            borderRadius: '5px',
            overflow: 'hidden',
            display: 'flex',
            marginTop: '20px'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Hiring History</h1>
                <p style={styles.subtitle}>Track and review processed candidate applications</p>
            </div>

            {/* Summary Stats */}
            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statIcon('#6366f1')}>
                        <Users size={24} />
                    </div>
                    <div style={styles.statInfo}>
                        <span style={styles.statValue}>{stats.total}</span>
                        <span style={styles.statLabel}>Total Processed</span>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statIcon('var(--color-success)')}>
                        <CheckCircle size={24} />
                    </div>
                    <div style={styles.statInfo}>
                        <span style={styles.statValue}>{stats.accepted}</span>
                        <span style={styles.statLabel}>Accepted</span>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statIcon('var(--color-danger)')}>
                        <XCircle size={24} />
                    </div>
                    <div style={styles.statInfo}>
                        <span style={styles.statValue}>{stats.rejected}</span>
                        <span style={styles.statLabel}>Rejected</span>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statIcon('#3E61FF')}>
                        <Clock size={24} />
                    </div>
                    <div style={styles.statInfo}>
                        <span style={styles.statValue}>{stats.shortlisted}</span>
                        <span style={styles.statLabel}>Shortlisted</span>
                    </div>
                </div>
            </div>

            <div style={styles.controls}>
                <div style={styles.filterTabs}>
                    {['All', 'Accepted', 'Rejected', 'Shortlisted'].map(tab => (
                        <button
                            key={tab}
                            style={styles.tab(filterStatus === tab)}
                            onClick={() => setFilterStatus(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                    <input
                        type="text"
                        placeholder="Search candidates..."
                        style={{
                            padding: '10px 12px 10px 40px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-dashboard)',
                            background: 'white',
                            fontSize: '0.9rem'
                        }}
                    />
                </div>
            </div>

            <div style={styles.tableContainer}>
                {filteredData.length > 0 ? (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Candidate</th>
                                <th style={styles.th}>Job Title</th>
                                <th style={styles.th}>Applied Date</th>
                                <th style={styles.th}>Final Status</th>
                                <th style={styles.th}>Processed Date</th>
                                <th style={styles.th}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map(item => (
                                <tr key={item.id} className="table-row">
                                    <td style={styles.td}>
                                        <div style={{ fontWeight: '600' }}>{item.candidateName}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.email}</div>
                                    </td>
                                    <td style={styles.td}>{item.jobTitle}</td>
                                    <td style={styles.td}>{item.appliedDate}</td>
                                    <td style={styles.td}>
                                        <span style={styles.badge(item.status)}>{item.status}</span>
                                    </td>
                                    <td style={styles.td}>{item.processedDate}</td>
                                    <td style={styles.td}>
                                        <button
                                            style={styles.viewBtn}
                                            onClick={() => handleViewDetails(item)}
                                            className="action-btn"
                                        >
                                            <Eye size={16} /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <div style={{ marginBottom: '16px' }}><Clock size={48} opacity={0.2} /></div>
                        <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>No hiring history available yet.</p>
                        <p style={{ fontSize: '0.9rem' }}>Try changing your filters or process some applications.</p>
                    </div>
                )}
            </div>

            {/* Simple Visual Analysis */}
            <div style={styles.analysisSection}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <BarChart2 size={20} color="var(--color-brand-accent)" />
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>Hiring Overview</h3>
                </div>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                            <span>Success Rate</span>
                            <span style={{ fontWeight: '700' }}>{Math.round((stats.accepted / stats.total) * 100)}%</span>
                        </div>
                        <div style={{ height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px' }}>
                            <div style={{ height: '100%', background: 'var(--color-success)', borderRadius: '4px', width: `${(stats.accepted / stats.total) * 100}%` }}></div>
                        </div>
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                            <span>Shortlist Ratio</span>
                            <span style={{ fontWeight: '700' }}>{Math.round((stats.shortlisted / stats.total) * 100)}%</span>
                        </div>
                        <div style={{ height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px' }}>
                            <div style={{ height: '100%', background: 'var(--color-brand-accent)', borderRadius: '4px', width: `${(stats.shortlisted / stats.total) * 100}%` }}></div>
                        </div>
                    </div>
                </div>

                <div style={styles.progressBar}>
                    <div style={{ width: `${(stats.accepted / stats.total) * 100}%`, backgroundColor: 'var(--color-success)' }} title="Accepted"></div>
                    <div style={{ width: `${(stats.shortlisted / stats.total) * 100}%`, backgroundColor: '#3E61FF' }} title="Shortlisted"></div>
                    <div style={{ width: `${(stats.rejected / stats.total) * 100}%`, backgroundColor: 'var(--color-danger)' }} title="Rejected"></div>
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '0.75rem', fontWeight: '500' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-success)' }}></div> Accepted</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3E61FF' }}></div> Shortlisted</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-danger)' }}></div> Rejected</div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && selectedCandidate && (
                <div style={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>{selectedCandidate.candidateName}</h2>
                                <span style={styles.badge(selectedCandidate.status)}>{selectedCandidate.status}</span>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}><XCircle size={24} /></button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Briefcase size={18} color="var(--text-light)" />
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Applied For</div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '500' }}>{selectedCandidate.jobTitle}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Calendar size={18} color="var(--text-light)" />
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Application Timeline</div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '500' }}>{selectedCandidate.appliedDate} (Applied) → {selectedCandidate.processedDate} (Finalized)</div>
                                </div>
                            </div>
                            <div style={{ borderTop: '1px solid var(--border-dashboard)', paddingTop: '16px', marginTop: '8px' }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '12px' }}>Contact Information</div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                        <Mail size={14} color="var(--text-light)" /> {selectedCandidate.email}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                        <Phone size={14} color="var(--text-light)" /> {selectedCandidate.phone}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                        <MapPin size={14} color="var(--text-light)" /> {selectedCandidate.location}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                        <Clock size={14} color="var(--text-light)" /> {selectedCandidate.experience}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                            <button style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--color-brand-accent)', color: 'white', border: 'none', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <ExternalLink size={16} /> View Profile
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-subtle)', color: 'var(--text-main)', border: '1px solid var(--border-dashboard)', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .table-row {
                    transition: all 0.2s;
                }
                .table-row:hover {
                    background-color: rgba(62, 97, 255, 0.02);
                }
                .action-btn {
                    transition: transform 0.2s;
                }
                .action-btn:hover {
                    transform: scale(1.05);
                    opacity: 0.8;
                }
                @media (max-width: 768px) {
                    .container {
                        padding: var(--space-sm);
                    }
                    th:nth-child(3), td:nth-child(3), th:nth-child(5), td:nth-child(5) {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default History;
