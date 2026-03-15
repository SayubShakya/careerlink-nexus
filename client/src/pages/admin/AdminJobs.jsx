import React, { useState, useMemo } from 'react';
import { Search, LayoutGrid, List } from 'lucide-react';
import { useGetAllJobs } from '@/hooks/api/admin/useAdmin';

// Sub-components
import JobHero from './jobs-components/JobHero';
import JobStats from './jobs-components/JobStats';
import JobControls from './jobs-components/JobControls';
import JobCard from './jobs-components/JobCard';
import JobDetailModal from './jobs-components/JobDetailModal';
import JobPagination from './jobs-components/JobPagination';

// Styles
import './AdminJobs.css';

const AdminJobs = () => {
    const { data: jobs = [], isLoading } = useGetAllJobs();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [page, setPage] = useState(1);
    const [selectedJob, setSelectedJob] = useState(null);
    const perPage = 8;

    const hour = new Date().getHours();
    const timeOfDay = useMemo(() => {
        if (hour >= 5 && hour < 11) return 'morning';
        if (hour >= 11 && hour < 16) return 'afternoon';
        if (hour >= 16 && hour < 19) return 'evening';
        return 'night';
    }, [hour]);

    const filtered = useMemo(() => {
        let res = jobs.filter(job => {
            const q = search.toLowerCase();
            const matchSearch = job.title?.toLowerCase().includes(q) ||
                job.Employer?.companyName?.toLowerCase().includes(q) ||
                job.location?.toLowerCase().includes(q);
            const matchFilter = filter === 'all' ||
                (filter === 'active' && job.is_active) ||
                (filter === 'inactive' && !job.is_active);
            return matchSearch && matchFilter;
        });

        // Sorting
        if (sortBy === 'recent') res = [...res].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (sortBy === 'views') res = [...res].sort((a, b) => (b.views || 0) - (a.views || 0));
        if (sortBy === 'apps') res = [...res].sort((a, b) => (b.totalApplications || 0) - (a.totalApplications || 0));
        if (sortBy === 'salary') res = [...res].sort((a, b) => (b.salary?.replace(/[^0-9]/g, '') || 0) - (a.salary?.replace(/[^0-9]/g, '') || 0));

        return res;
    }, [jobs, search, filter, sortBy]);

    const totalPages = Math.ceil(filtered.length / perPage);
    const current = filtered.slice((page - 1) * perPage, page * perPage);
    const activeCount = jobs.filter(j => j.is_active).length;
    const stoppedCount = jobs.length - activeCount;

    return (
        <div className="jb-page">
            <JobHero timeOfDay={timeOfDay} activeCount={activeCount} stoppedCount={stoppedCount} />
            
            <JobStats jobs={jobs} activeCount={activeCount} />

            <JobControls 
                search={search} setSearch={setSearch} 
                filter={filter} setFilter={setFilter} 
                sortBy={sortBy} setSortBy={setSortBy} 
                setPage={setPage} 
            />

            <div className="jb-results-meta">
                <span className="jb-res-count">
                    Showing <b>{(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)}</b> of <b>{filtered.length}</b> jobs
                </span>
                <div className="jb-view-icons">
                    <button className="jb-view-icon active"><LayoutGrid size={16} /></button>
                    <button className="jb-view-icon"><List size={16} /></button>
                </div>
            </div>

            {isLoading ? (
                <div className="jb-loading-grid">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="jb-skeleton-card" />
                    ))}
                </div>
            ) : current.length === 0 ? (
                <div className="jb-empty-box">
                    <div className="jb-empty-icon-ring"><Search size={40} /></div>
                    <h3>Nothing found</h3>
                    <p>Try looking for something else!</p>
                    <button className="jb-reset-btn" onClick={() => { setSearch(''); setFilter('all'); }}>Show All</button>
                </div>
            ) : (
                <div className="jb-deck">
                    {current.map((job, i) => (
                        <JobCard 
                            key={job.id} 
                            job={job} 
                            index={i} 
                            onSelect={setSelectedJob} 
                        />
                    ))}
                </div>
            )}

            <JobPagination page={page} setPage={setPage} totalPages={totalPages} />

            {selectedJob && (
                <JobDetailModal 
                    job={selectedJob} 
                    onClose={() => setSelectedJob(null)} 
                    timeOfDay={timeOfDay} 
                />
            )}
        </div>
    );
};

export default AdminJobs;
