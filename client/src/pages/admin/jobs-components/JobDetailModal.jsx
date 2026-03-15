import React from 'react';
import { 
    MoveLeft, Eye, Calendar, MapPin, Building2, Users as UsersIcon, 
    Briefcase, GraduationCap, DollarSign, Globe, Heart, Share2, Trash2, Ban 
} from 'lucide-react';
import { formatDate } from './JobUtils';

const JobDetailModal = ({ job, onClose }) => {
    if (!job) return null;

    return (
        <div className="jb-modal-overlay">
            <div className="jb-modal-window">
                {/* Back Button */}
                <button className="jb-back-link" onClick={onClose}>
                    <MoveLeft size={18} /> Back to Jobs
                </button>

                {/* Main Header Card */}
                <div className="jb-detail-header-card">
                    <div className="jb-dhc-top">
                        <div className="jb-dhc-avatar">
                            {(job.Employer?.companyName || '?')[0]}
                        </div>
                        <div className="jb-dhc-info">
                            <h2 className="jb-dhc-title">{job.title}</h2>
                            <div className="jb-dhc-meta-row">
                                <div className="jb-dhc-meta-item"><Building2 /> {job.Employer?.companyName || 'Hiring Boss'}</div>
                                <div className="jb-dhc-meta-item"><MapPin /> {job.location || 'On-site'}</div>
                                <div className="jb-dhc-meta-item"><UsersIcon /> Vacancy: 1</div>
                            </div>
                            <div className="jb-dhc-meta-row">
                                <div className="jb-dhc-meta-item views">Views: {job.views || 0}</div>
                                <div className="jb-dhc-meta-item">• Published on: {formatDate(job.createdAt || job.created_at)}</div>
                            </div>
                        </div>
                        <div className="jb-dhc-actions">
                            <button className="jb-dhc-circle-btn"><Heart size={20} /></button>
                            <button className="jb-dhc-circle-btn"><Share2 size={20} /></button>
                        </div>
                    </div>

                    <div className="jb-dhc-tags">
                        <div className="jb-tag-pill"><Briefcase /> Job Type: {job.jobType || 'N/A'}</div>
                        <div className="jb-tag-pill"><UsersIcon /> Experience: Entry Level</div>
                        <div className="jb-tag-pill"><DollarSign /> {job.salary || 'Negotiable'}</div>
                        <div className="jb-tag-pill"><GraduationCap /> BSc in Computer Science</div>
                        <div className="jb-tag-pill"><Globe /> Official Website</div>
                    </div>
                </div>

                {/* Two Column Grid */}
                <div className="jb-detail-grid">
                    <div className="jb-detail-main">
                        <div className="jb-detail-box">
                            <div className="jb-detail-section">
                                <h3>Job Description</h3>
                                <p>{job.description || 'No description provided.'}</p>
                            </div>

                            <div className="jb-detail-section">
                                <h3>Key Responsibilities:</h3>
                                <p>{job.requirements || 'Daily tasks and ownership details go here.'}</p>
                            </div>

                            <div className="jb-detail-section">
                                <h3>Qualifications & Skills:</h3>
                                <p>Experience with relevant tools, attention to detail, and industry knowledge.</p>
                            </div>
                        </div>
                    </div>

                    <div className="jb-detail-side">
                        {/* Action Box */}
                        <div className="jb-sidebar-box">
                            <div className="jb-sb-accent-bar" />
                            <div className="jb-sb-content">
                                <h4 className="jb-sb-title">Management Actions</h4>
                                <p className="jb-sb-text">
                                    This job has <b>{job.totalApplications || 0}</b> total applications. You can manage the listing status below.
                                </p>
                                <button className="jb-sb-btn-main" onClick={() => {/* TODO: Stop logic */}}>
                                    Stop This Job
                                </button>
                                <div className="jb-sb-date-footer"> Apply Before: <span>4/1/2026</span></div>
                            </div>
                        </div>

                        {/* About Box */}
                        <div className="jb-sidebar-box">
                            <div className="jb-sb-content">
                                <h4 className="jb-sb-title">About the Organization</h4>
                                <div className="jb-sb-org">
                                    <div className="jb-sb-org-avatar">{(job.Employer?.companyName || '?')[0]}</div>
                                    <div className="jb-sb-org-name">{job.Employer?.companyName}</div>
                                </div>
                                <p className="jb-sb-text" style={{ marginTop: '16px', marginBottom: 0 }}>
                                    {job.Employer?.description || 'A growing company looking for great talent.'}
                                </p>
                            </div>
                        </div>

                        {/* Admin Cleanup */}
                        <div className="jb-sidebar-box" style={{ borderColor: '#FEE2E2' }}>
                            <div className="jb-sb-content" style={{ padding: '16px' }}>
                                <button className="jb-sb-btn-main" style={{ background: '#EF4444' }} onClick={() => {/* TODO: Delete logic */}}>
                                    <Trash2 size={16} style={{ marginRight: '8px' }} /> Delete Permanently
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetailModal;
