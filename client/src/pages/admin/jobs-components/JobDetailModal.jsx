import React from 'react';
import { 
    MoveLeft, Eye, Calendar, MapPin, Building2, Users as UsersIcon, 
    Briefcase, GraduationCap, DollarSign, Globe, Heart, Share2, Trash2 
} from 'lucide-react';
import { formatDate } from './JobUtils';

const JobDetailModal = ({ job, onClose }) => {
    if (!job) return null;

    return (
        <div className="jb-modal-overlay">
            <div className="jb-modal-window">
                {/* Navigation */}
                <button className="jb-back-link" onClick={onClose}>
                    <MoveLeft size={18} /> Back to Jobs
                </button>

                {/* header card like the image */}
                <div className="jb-detail-header-card">
                    <div className="jb-dhc-top">
                        <div className="jb-dhc-avatar">
                            {(job.Employer?.companyName || '?')[0]}
                        </div>
                        <div className="jb-dhc-info">
                            <h2 className="jb-dhc-title">{job.title || 'Job Title'}</h2>
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
                            <button className="jb-dhc-circle-btn" title="Save Job"><Heart size={20} /></button>
                            <button className="jb-dhc-circle-btn" title="Share Job"><Share2 size={20} /></button>
                        </div>
                    </div>

                    <div className="jb-dhc-tags">
                        <div className="jb-tag-pill"><Briefcase /> Job Type: {job.jobType || 'Full-time'}</div>
                        <div className="jb-tag-pill"><UsersIcon /> Experience: Entry Level</div>
                        <div className="jb-tag-pill"><DollarSign /> {job.salary || 'Negotiable'}</div>
                        <div className="jb-tag-pill"><GraduationCap /> BSc in Computer Science</div>
                        <div className="jb-tag-pill"><Globe /> Official Website</div>
                    </div>
                </div>

                {/* content grid */}
                <div className="jb-detail-grid">
                    <div className="jb-detail-main">
                        <div className="jb-detail-box">
                            <div className="jb-detail-section">
                                <h3>Job Description</h3>
                                <p>{job.description || 'No description provided.'}</p>
                            </div>

                            <div className="jb-detail-section">
                                <h3>Key Responsibilities:</h3>
                                <p>
                                    Write automated test scripts, Perform manual testing, Track bugs in Jira
                                </p>
                            </div>

                            <div className="jb-detail-section">
                                <h3>Qualifications & Skills:</h3>
                                <p>
                                    Experience with Selenium/Playwright, Strong attention to detail, Knowledge of SDLC
                                </p>
                            </div>

                            <div className="jb-detail-section">
                                <h3>Job Specification</h3>
                                <p>No extra details provided.</p>
                            </div>
                        </div>
                    </div>

                    <div className="jb-detail-side">
                        {/* Applying Procedure Box */}
                        <div className="jb-sidebar-box">
                            <div className="jb-sb-accent-bar" />
                            <div className="jb-sb-content">
                                <h4 className="jb-sb-title">Applying Procedure</h4>
                                <p className="jb-sb-text">
                                    Click on <b>Apply</b> and apply to this job via your jobseeker profile with easy apply process.
                                </p>
                                <button className="jb-sb-btn-main">Apply Now</button>
                                <div className="jb-sb-date-footer"> 
                                    Apply Before: <span>4/1/2026</span>
                                </div>
                            </div>
                        </div>

                        {/* Organization Box */}
                        <div className="jb-sidebar-box">
                            <div className="jb-sb-content">
                                <h4 className="jb-sb-title">About the Organization</h4>
                                <div className="jb-sb-org">
                                    <div className="jb-sb-org-avatar">{(job.Employer?.companyName || '?')[0]}</div>
                                    <div className="jb-sb-org-name">{job.Employer?.companyName || 'The Company'}</div>
                                </div>
                                <p className="jb-sb-text" style={{ marginTop: '16px', marginBottom: 0 }}>
                                    {job.Employer?.description || 'A great company to work for.'}
                                </p>
                            </div>
                        </div>

                         {/* Admin Tool: Delete */}
                         <div className="jb-sidebar-box" style={{ borderColor: '#FEE2E2', marginTop: 'auto' }}>
                            <div className="jb-sb-content" style={{ padding: '12px' }}>
                                <button className="jb-sb-btn-main" style={{ background: '#EF4444' }} onClick={() => {/* Delete Logic */}}>
                                    <Trash2 size={16} style={{ marginRight: '8px' }} /> Admin: Delete Job
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
