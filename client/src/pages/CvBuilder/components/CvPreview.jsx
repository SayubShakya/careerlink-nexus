import React from 'react';
import './CvPreview.css';

const CvPreview = ({ data }) => {
    const handleDownload = () => {
        window.print();
    };

    return (
        <div className="cv-preview-canvas">
            <div className="download-container">
                <button className="download-btn" onClick={handleDownload}>
                    Download Resume
                </button>
            </div>

            <div className="cv-paper">
                <header className="cv-header">
                    <h1 className="cv-name">
                        {data.firstName || 'First Name'} {data.lastName || 'Last Name'}
                    </h1>
                    <div className="cv-contact">
                        {data.email && <span>{data.email}</span>}
                        {data.phone && <span>{data.phone}</span>}
                        {data.location && <span>{data.location}</span>}
                    </div>
                </header>

                {data.summary && (
                    <section className="cv-section">
                        <h2 className="section-title">Professional Summary</h2>
                        <p className="summary-text">{data.summary}</p>
                    </section>
                )}

                <section className="cv-section">
                    <h2 className="section-title">Experience</h2>
                    {data.experience.length === 0 ? (
                        <p className="placeholder-text">Add your professional experience in the form.</p>
                    ) : (
                        data.experience.map((exp, index) => (
                            <div key={index} className="experience-item">
                                <h3 className="item-title">{exp.title}</h3>
                                <p className="item-subtitle">{exp.company} | {exp.duration}</p>
                                <ul className="bullet-list">
                                    {exp.description && exp.description.map((bullet, bIndex) => (
                                        <li key={bIndex}>{bullet}</li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    )}
                </section>

                <section className="cv-section">
                    <h2 className="section-title">Education</h2>
                    {data.education.length === 0 ? (
                        <p className="placeholder-text">Add your educational background.</p>
                    ) : (
                        data.education.map((edu, index) => (
                            <div key={index} className="education-item">
                                <h3 className="item-title">{edu.degree}</h3>
                                <p className="item-subtitle">{edu.university} | {edu.gradYear}</p>
                            </div>
                        ))
                    )}
                </section>

                <section className="cv-section">
                    <h2 className="section-title">Skills</h2>
                    <div className="skills-grid">
                        {data.skills.map((skill, index) => (
                            <div key={index} className="skill-item">
                                <span className="skill-name">{skill.name}</span>
                                <div className="skill-level-bar">
                                    <div className="skill-level-fill" style={{ width: `${skill.level}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CvPreview;
