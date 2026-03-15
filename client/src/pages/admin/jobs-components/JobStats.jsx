import React from 'react';
import { Eye, Users as UsersIcon, Building2, TrendingUp } from 'lucide-react';
import StatPill from './StatPill';

const JobStats = ({ jobs, activeCount }) => {
    const totalViews = jobs.reduce((a, j) => a + (j.views || 0), 0);
    const totalApps = jobs.reduce((a, j) => a + (j.totalApplications || 0), 0);
    const totalEmployers = [...new Set(jobs.map(j => j.Employer?.companyName).filter(Boolean))].length;
    const activeRate = jobs.length ? Math.round((activeCount / jobs.length) * 100) : 0;

    return (
        <div className="jb-quick-stats">
            <StatPill label="Total Clicks" value={totalViews.toLocaleString()} icon={<Eye size={20} />} color="#6366F1" bg="#EEF2FF" />
            <StatPill label="How Many Applied" value={totalApps.toLocaleString()} icon={<UsersIcon size={20} />} color="#EC4899" bg="#FDF2F8" />
            <StatPill label="Hiring Bosses" value={totalEmployers} icon={<Building2 size={20} />} color="#F59E0B" bg="#FFFBEB" />
            <StatPill label="Are Active" value={`${activeRate}%`} icon={<TrendingUp size={20} />} color="#10B981" bg="#ECFDF5" />
        </div>
    );
};

export default JobStats;
