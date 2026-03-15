import React from 'react';
import { MapPin, DollarSign, Eye, Users as UsersIcon, Clock, Ban, ArrowUpRight } from 'lucide-react';
import { getCompanyColor, getJobTypeBadge, formatDate } from './JobUtils';

const JobCard = ({ job, index, onSelect }) => {
    const comp = getCompanyColor(job.Employer?.companyName);
    const type = getJobTypeBadge(job.jobType);
    const hasApps = (job.totalApplications || 0) > 0;

    return (
        <div className="jb-premium-card" style={{ animationDelay: `${index * 0.05}s` }} onClick={() => onSelect(job)}>
            <div className="jb-pc-header">
                <div className="jb-pc-company">
                    <div className="jb-pc-avatar" style={{ background: comp.grad, boxShadow: `0 8px 16px -4px ${comp.shadow}` }}>
                        {(job.Employer?.companyName || '?')[0]}
                    </div>
                    <div className="jb-pc-company-info">
                        <span className="jb-pc-comp-name">{job.Employer?.companyName || 'Unknown Boss'}</span>
                        <div className="jb-pc-location"><MapPin size={12} /> {job.location || 'Distributed'}</div>
                    </div>
                </div>
                <div className={`jb-pc-status ${job.is_active ? 'active' : 'paused'}`}>
                    <div className="jb-pc-status-dot" />
                    {job.is_active ? 'Active' : 'Stopped'}
                </div>
            </div>

            <h3 className="jb-pc-title">{job.title}</h3>

            <div className="jb-pc-meta">
                <span className="jb-pc-type" style={{ background: type.bg, color: type.color, borderColor: type.border }}>{type.label}</span>
                {job.salary ? <span className="jb-pc-salary"><DollarSign size={14} /> {job.salary}</span> : <span className="jb-pc-salary na">Ask Boss</span>}
            </div>

            <div className="jb-pc-body">
                <div className="jb-pc-metric">
                    <div className="jb-pcm-icon views"><Eye size={18} /></div>
                    <div className="jb-pcm-data">
                        <span className="jb-pcm-val">{(job.views || 0).toLocaleString()}</span>
                        <span className="jb-pcm-lbl">Clicks</span>
                    </div>
                </div>
                <div className="jb-pc-metric">
                    <div className={`jb-pcm-icon ${hasApps ? 'active' : ''}`}><UsersIcon size={18} /></div>
                    <div className="jb-pcm-data">
                        <span className="jb-pcm-val">{(job.totalApplications || 0).toLocaleString()}</span>
                        <span className="jb-pcm-lbl">People</span>
                    </div>
                </div>
            </div>

            <div className="jb-pc-footer">
                <div className="jb-pc-date"><Clock size={14} /> {formatDate(job.createdAt || job.created_at)}</div>
                <div className="jb-pc-actions">
                    <button className="jb-pc-btn-mini" onClick={e => { e.stopPropagation(); /* TODO: Ban Logic */ }} title="Stop This Job"><Ban size={16} /></button>
                    <button className="jb-pc-btn-view">Details <ArrowUpRight size={16} /></button>
                </div>
            </div>
            <div className="jb-pc-glow" style={{ background: comp.grad }} />
        </div>
    );
};

export default JobCard;
