import React from 'react';
import { X, MapPin, Layers, DollarSign, Calendar, Eye, Users as UsersIcon, TrendingUp, Globe, Briefcase, Trash2, Ban } from 'lucide-react';
import { getCompanyColor, formatDate } from './JobUtils';
import JobSkyScene from './JobSkyScene';

const JobDetailModal = ({ job, onClose, timeOfDay }) => {
    if (!job) return null;
    const comp = getCompanyColor(job.Employer?.companyName);

    return (
        <div className="jb-modal-overlay" onClick={onClose}>
            <div className="jb-modal-window" onClick={e => e.stopPropagation()}>
                <div className="jb-mw-header" style={{ background: comp.grad }}>
                    <JobSkyScene timeOfDay={timeOfDay} />
                    <div className="jb-mw-header-blur" />
                    <div className="jb-mw-header-content">
                        <div className="jb-mw-comp">
                            <div className="jb-mw-avatar">{(job.Employer?.companyName || '?')[0]}</div>
                            <div className="jb-mw-comp-text">
                                <h4 className="jb-mw-comp-name">{job.Employer?.companyName || 'Hiring Boss'}</h4>
                                <span className="jb-mw-comp-email">{job.Employer?.email}</span>
                            </div>
                        </div>
                        <button className="jb-mw-close" onClick={onClose}><X size={20} /></button>
                    </div>
                </div>
                <div className="jb-mw-body">
                    <div className="jb-mw-title-area">
                        <h2 className="jb-mw-title">{job.title}</h2>
                        <div className={`jb-pc-status ${job.is_active ? 'active' : 'paused'}`}>
                            <div className="jb-pc-status-dot" />
                            {job.is_active ? 'Active Now' : 'Stopped for Now'}
                        </div>
                    </div>

                    <div className="jb-mw-grid">
                        <div className="jb-mw-item"><MapPin size={18} /><div><label>Location</label><span>{job.location || 'Remote'}</span></div></div>
                        <div className="jb-mw-item"><Layers size={18} /><div><label>Job Category</label><span>{job.jobType || 'Unknown'}</span></div></div>
                        <div className="jb-mw-item"><DollarSign size={18} /><div><label>Salary</label><span>{job.salary || 'Ask Boss'}</span></div></div>
                        <div className="jb-mw-item"><Calendar size={18} /><div><label>Launch Date</label><span>{formatDate(job.createdAt || job.created_at)}</span></div></div>
                    </div>

                    <div className="jb-mw-analytics">
                        <div className="jb-mw-stat shadow-indigo">
                            <div className="jb-mws-icon"><Eye size={24} /></div>
                            <div className="jb-mws-vals"><b>{(job.views || 0).toLocaleString()}</b><span>Total Clicks</span></div>
                        </div>
                        <div className="jb-mw-stat shadow-pink">
                            <div className="jb-mws-icon"><UsersIcon size={24} /></div>
                            <div className="jb-mws-vals"><b>{(job.totalApplications || 0).toLocaleString()}</b><span>Applied</span></div>
                        </div>
                        <div className="jb-mw-stat shadow-emerald">
                            <div className="jb-mws-icon"><TrendingUp size={24} /></div>
                            <div className="jb-mws-vals"><b>{job.views ? `${Math.round(((job.totalApplications || 0) / job.views) * 100)}%` : '0%'}</b><span>How Many Applied</span></div>
                        </div>
                    </div>

                    <div className="jb-mw-details">
                        <div className="jb-mw-divider" />
                        <div className="jb-mw-section-row">
                            <div className="jb-mw-content-main">
                                <div className="jb-mw-block">
                                    <h5><Globe size={16} /> About This Job</h5>
                                    <div className="jb-mw-text-box">
                                        <p>{job.description || 'No story about this job.'}</p>
                                    </div>
                                </div>

                                {job.requirements && (
                                    <div className="jb-mw-block">
                                        <h5><Briefcase size={16} /> What You Need</h5>
                                        <div className="jb-mw-text-box requirements">
                                            <p>{job.requirements}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="jb-mw-sidebar">
                                <div className="jb-mw-side-card">
                                    <h5>Options</h5>
                                    <button className="jb-mw-side-btn"><Trash2 size={14} /> Delete Job</button>
                                    <button className="jb-mw-side-btn warning"><Ban size={14} /> Stop Job</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="jb-mw-footer">
                    <span className="jb-mw-footer-note">Job ID: {job.id}</span>
                    <button className="jb-mw-btn-primary" onClick={onClose}>Got it, Close!</button>
                </div>
            </div>
        </div>
    );
};

export default JobDetailModal;
