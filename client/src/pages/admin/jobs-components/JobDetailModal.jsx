import React from 'react';
import { 
    MoveLeft, Eye, Calendar, MapPin, Building2, Users as UsersIcon, 
    Briefcase, GraduationCap, DollarSign, Globe, Heart, Share2, Trash2 
} from 'lucide-react';
import { formatDate } from './JobUtils';

const isEmptyHtml = (html) => {
    if (!html) return true;
    const stripped = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '').trim();
    return stripped.length === 0;
};

const formatContent = (content) => {
    if (!content) return '';
    if (isEmptyHtml(content)) return '';
    if (/<\/?[a-z][\s\S]*>/i.test(content)) return content;
    return content.replace(/\n/g, '<br/>');
};

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
                        <div className="jb-dhc-avatar" style={{ overflow: 'hidden' }}>
                            {job.Employer?.profile_picture ? (
                                <img 
                                    src={job.Employer.profile_picture.startsWith('http') ? job.Employer.profile_picture : `/uploads/${job.Employer.profile_picture.replace(/^(\/?uploads\/|\/)/, '')}`} 
                                    alt="Logo" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                            ) : (
                                (job.Employer?.companyName || '?')[0]
                            )}
                        </div>
                        <div className="jb-dhc-info">
                            <h2 className="jb-dhc-title">{job.title || 'Job Title'}</h2>
                            <div className="jb-dhc-meta-row">
                                <div className="jb-dhc-meta-item"><Building2 /> {job.Employer?.companyName || 'Hiring Boss'}</div>
                                <div className="jb-dhc-meta-item"><MapPin /> {job.location || 'On-site'}</div>
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
                        {job.jobType && (
                            <div className="jb-tag-pill"><Briefcase size={14} /> {job.jobType}</div>
                        )}
                        {!isEmptyHtml(job.specification) && (
                             <div className="jb-tag-pill"><UsersIcon size={14} /> {job.specification.length > 20 ? 'Experience Req.' : job.specification}</div>
                        )}
                        {job.salary && (
                            <div className="jb-tag-pill"><DollarSign size={14} /> {job.salary}</div>
                        )}
                        {!isEmptyHtml(job.education) && (
                            <div className="jb-tag-pill"><GraduationCap size={14} /> {job.education.length > 20 ? 'Education Req.' : job.education}</div>
                        )}
                        {job.Employer?.companyWebsite && (
                            <a href={job.Employer.companyWebsite} target="_blank" rel="noopener noreferrer" className="jb-tag-pill" style={{ textDecoration: 'none' }}>
                                <Globe size={14} /> Website
                            </a>
                        )}
                    </div>
                </div>

                {/* content grid */}
                <div className="jb-detail-grid">
                    <div className="jb-detail-main">
                        <div className="jb-detail-box">
                            <div className="jb-detail-section">
                                <h3>Job Description</h3>
                                <div dangerouslySetInnerHTML={{ __html: formatContent(job.description || 'No description provided.') }} />
                            </div>

                            {!isEmptyHtml(job.responsibilities) && (
                                <div className="jb-detail-section">
                                    <h3>Key Responsibilities:</h3>
                                    <div dangerouslySetInnerHTML={{ __html: formatContent(job.responsibilities) }} />
                                </div>
                            )}

                            {!isEmptyHtml(job.qualifications) && (
                                <div className="jb-detail-section">
                                    <h3>Qualifications & Skills:</h3>
                                    <div dangerouslySetInnerHTML={{ __html: formatContent(job.qualifications) }} />
                                </div>
                            )}

                            <div className="jb-detail-section">
                                <h3>Job Specification</h3>
                                {!isEmptyHtml(job.education) && (
                                    <div style={{ marginBottom: '12px' }}>
                                        <strong>Required Education Level:</strong>
                                        <div dangerouslySetInnerHTML={{ __html: formatContent(job.education) }} />
                                    </div>
                                )}
                                {!isEmptyHtml(job.specification) && (
                                    <div>
                                        <strong>Experience Required / Additional Specifications:</strong>
                                        <div dangerouslySetInnerHTML={{ __html: formatContent(job.specification) }} />
                                    </div>
                                )}
                                {!job.education && !job.specification && <p>No extra details provided.</p>}
                            </div>

                            {job.skills && job.skills.length > 0 && (
                                <div className="jb-detail-section">
                                    <h3>Skills Required</h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                                        {job.skills.map((skill, i) => (
                                            <span key={i} className="jb-tag-pill" style={{ background: 'var(--theme-bg-subtle)', border: '1px solid var(--theme-border)' }}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
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
                                    <div className="jb-sb-org-avatar" style={{ overflow: 'hidden' }}>
                                        {job.Employer?.profile_picture ? (
                                            <img 
                                                src={job.Employer.profile_picture.startsWith('http') ? job.Employer.profile_picture : `/uploads/${job.Employer.profile_picture.replace(/^(\/?uploads\/|\/)/, '')}`} 
                                                alt="Logo" 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                            />
                                        ) : (
                                            (job.Employer?.companyName || '?')[0]
                                        )}
                                    </div>
                                    <div className="jb-sb-org-name">{job.Employer?.companyName || 'The Company'}</div>
                                </div>
                                <p className="jb-sb-text" style={{ marginTop: '16px', marginBottom: 0 }}>
                                    {job.Employer?.description || 'A great company to work for.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetailModal;
