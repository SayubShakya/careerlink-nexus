import React from 'react';
import { Briefcase, CheckCircle2, XCircle } from 'lucide-react';
import JobSkyScene from './JobSkyScene';

const JobHero = ({ timeOfDay, activeCount, stoppedCount }) => (
    <div className={`jb-hero jb-hero-${timeOfDay}`}>
        <JobSkyScene timeOfDay={timeOfDay} />
        <div className="jb-hero-content">
            <div className="jb-hero-left">
                <div className="jb-hero-badge-wrap">
                    <span className="jb-hero-badge"><Briefcase size={12} /> Job Management</span>
                </div>
                <h1 className="jb-hero-title">Jobs <span>List</span></h1>
                <p className="jb-hero-desc">Check on and manage all the jobs in one place.</p>
            </div>
            <div className="jb-hero-right">
                <div className="jb-hero-stats">
                    <div className="jb-hero-stat-card">
                        <div className="jb-hsc-icon live"><CheckCircle2 size={18} /></div>
                        <div className="jb-hsc-data">
                            <span className="jb-hsc-val">{activeCount}</span>
                            <span className="jb-hsc-label">Active</span>
                        </div>
                    </div>
                    <div className="jb-hero-stat-card">
                        <div className="jb-hsc-icon paused"><XCircle size={18} /></div>
                        <div className="jb-hsc-data">
                            <span className="jb-hsc-val">{stoppedCount}</span>
                            <span className="jb-hsc-label">Stopped</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default JobHero;
