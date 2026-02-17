import { useGetMe } from '@/hooks/api/auth/useGetMe';
import { useGetEmployerApplications } from '@/hooks/api/employer/useEmployer';
import {
    PlusCircle,
    Eye,
    Edit,
    Trash2,
    Briefcase,
    Users,
    BarChart3,
    TrendingUp,
    FileText,
    Download
} from 'lucide-react';

const EmployerDashboard = () => {
    const { data: me } = useGetMe();
    const user = me?.user || JSON.parse(localStorage.getItem('user') || '{}');
    const { data: applications = [] } = useGetEmployerApplications();

    // Static stats for the top section
    const stats = [
        { label: 'Total Jobs Posted', value: '3', icon: <Briefcase size={24} />, color: '#3E61FF' },
        { label: 'Total Applicants', value: '24', icon: <Users size={24} />, color: '#10B981' },
        { label: 'Avg Applications', value: '8.0', icon: <TrendingUp size={24} />, color: '#F59E0B' },
        { label: 'Total CVs Added', value: '18', icon: <FileText size={24} />, color: '#8B5CF6' },
    ];

    // Static job data for 10 slots
    const jobSlots = [
        { id: 1, title: 'Senior Software Engineer', postedDate: '2024-10-15', status: 'Active', applications: 12 },
        { id: 2, title: 'Product Manager', postedDate: '2024-11-02', status: 'Active', applications: 8 },
        { id: 3, title: 'UI/UX Designer', postedDate: '2024-11-10', status: 'Draft', applications: 4 },
        { id: 4, title: null },
        { id: 5, title: null },
        { id: 6, title: null },
        { id: 7, title: null },
        { id: 8, title: null },
        { id: 9, title: null },
        { id: 10, title: null },
    ];

    const styles = {
        container: {
            padding: '40px',
            maxWidth: '1200px',
            margin: '0 auto',
            backgroundColor: 'var(--bg-subtle)'
        },
        header: {
            marginBottom: '30px'
        },
        title: {
            fontSize: '1.8rem',
            fontWeight: '800',
            color: 'var(--text-main)',
            marginBottom: '5px'
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
        },
        statCard: {
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '20px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
        },
        iconBox: (color) => ({
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: `${color}15`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }),
        managementHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
        },
        tableCard: {
            backgroundColor: 'white',
            borderRadius: '24px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left'
        },
        th: {
            padding: '16px 24px',
            fontSize: '0.8rem',
            fontWeight: '700',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: '#F9FAFB'
        },
        td: {
            padding: '18px 24px',
            fontSize: '0.95rem',
            borderBottom: '1px solid var(--border-subtle)'
        },
        statusBadge: (status) => ({
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: '600',
            backgroundColor: status === 'Active' ? '#ECFDF5' : '#F3F4F6',
            color: status === 'Active' ? '#059669' : '#4B5563'
        }),
        actionBtn: {
            padding: '8px',
            borderRadius: '10px',
            border: 'none',
            background: '#F3F4F6',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            marginRight: '8px'
        },
        addBtn: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: 'var(--color-brand-accent)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
        },
        chartPlaceholder: {
            marginTop: '40px',
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: '30px',
            border: '1px solid var(--border-subtle)',
            textAlign: 'center'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Welcome back, {user?.organization_name || 'Employer'}</h1>
                <p style={{ color: 'var(--text-muted)' }}>Here's what's happening with your job postings today.</p>
            </div>

            {/* Stats Section */}
            <div style={styles.statsGrid}>
                {stats.map((stat, index) => (
                    <div key={index} style={styles.statCard}>
                        <div style={styles.iconBox(stat.color)}>
                            {stat.icon}
                        </div>
                        <div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{stat.label}</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1 }}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Management Section */}
            <div style={styles.managementHeader}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Job Management</h2>
                <button style={styles.addBtn}>
                    <PlusCircle size={18} />
                    Post New Job
                </button>
            </div>

            <div style={styles.tableCard}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Job Position</th>
                            <th style={styles.th}>Date Posted</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Applicants</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobSlots.filter(s => s.title).length > 0 ? (
                            jobSlots.filter(s => s.title).map((job) => (
                                <tr key={job.id} className="table-row">
                                    <td style={styles.td}>
                                        <strong>{job.title}</strong>
                                    </td>
                                    <td style={styles.td}>{job.postedDate}</td>
                                    <td style={styles.td}>
                                        <span style={styles.statusBadge(job.status)}>{job.status}</span>
                                    </td>
                                    <td style={styles.td}>{job.applications}</td>
                                    <td style={styles.td}>
                                        <div style={{ display: 'flex' }}>
                                            <button style={{ ...styles.actionBtn, color: 'var(--color-brand-primary)' }} title="View">
                                                <Eye size={18} />
                                            </button>
                                            <button style={{ ...styles.actionBtn, color: '#F59E0B' }} title="Edit">
                                                <Edit size={18} />
                                            </button>
                                            <button style={{ ...styles.actionBtn, color: '#EF4444' }} title="Remove">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ ...styles.td, textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                    No jobs posted yet. Click "Post New Job" to get started!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Recent Applications Section - Dynamic */}
            <div style={{ ...styles.managementHeader, marginTop: '40px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Recent Applications</h2>
            </div>

            <div style={styles.tableCard}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Candidate</th>
                            <th style={styles.th}>Applying For</th>
                            <th style={styles.th}>CV / Resume</th>
                            <th style={styles.th}>Applied Date</th>
                            <th style={styles.th}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.length > 0 ? (
                            applications.map((app) => (
                                <tr key={app.id} className="table-row">
                                    <td style={styles.td}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3E61FF', fontWeight: 'bold' }}>
                                                {app.JobSeeker?.first_name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600' }}>{app.JobSeeker?.first_name} {app.JobSeeker?.last_name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.JobSeeker?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={{ fontWeight: '500' }}>{app.job_id}</span>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FileText size={16} color="var(--text-muted)" />
                                            <span>{app.CV?.title || 'CV Document'}</span>
                                            {/* Download link would go here */}
                                        </div>
                                    </td>
                                    <td style={styles.td}>{new Date(app.applied_at).toLocaleDateString()}</td>
                                    <td style={styles.td}>
                                        <span style={styles.statusBadge(app.status || 'Pending')}>
                                            {app.status || 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ ...styles.td, textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                                    No applications received yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Optional Chart Section */}
            <div style={styles.chartPlaceholder}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--text-muted)', marginBottom: '15px' }}>
                    <BarChart3 size={20} />
                    <span style={{ fontWeight: '600' }}>Application Trends</span>
                </div>
                <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '0 40px' }}>
                    {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                        <div key={i} style={{ width: '40px', height: `${h}%`, backgroundColor: i === 3 ? 'var(--color-brand-accent)' : '#E5E7EB', borderRadius: '8px 8px 0 0' }}></div>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
            </div>

            <style>{`
                .table-row:hover {
                    background-color: #F9FAFB;
                }
                .table-row:last-child td {
                    border-bottom: none;
                }
            `}</style>
        </div>
    );
};

export default EmployerDashboard;
