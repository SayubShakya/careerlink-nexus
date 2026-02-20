import React from 'react';
import './CvForm.css';

const CvForm = ({ data, onUpdate }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onUpdate({ [name]: value });
    };

    const handleArrayChange = (section, index, field, value) => {
        const newArray = [...data[section]];
        newArray[index] = { ...newArray[index], [field]: value };
        onUpdate({ [section]: newArray });
    };

    const addSectionItem = (section, template) => {
        onUpdate({ [section]: [...data[section], template] });
    };

    return (
        <div className="cv-form-container">
            <div className="cv-form-header">
                <h2>Features to Keep in CV</h2>
                <button className="add-sections-btn">Add Sections +</button>
            </div>

            <div className="completeness-section">
                <div className="completeness-header">
                    <span>Information Completeness</span>
                    <span>{data.firstName && data.summary && data.experience.length > 0 ? '75%' : '50%'}</span>
                </div>
                <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: data.firstName && data.summary && data.experience.length > 0 ? '75%' : '50%' }}></div>
                </div>
            </div>

            <div className="form-section">
                <h3>Personal Information</h3>
                <div className="input-row">
                    <div className="input-group">
                        <label>First Name</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                name="firstName"
                                value={data.firstName}
                                onChange={handleChange}
                                placeholder="e.g. John"
                            />
                            <span className="heart-icon">❤</span>
                        </div>
                    </div>
                    <div className="input-group">
                        <label>Last Name</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                name="lastName"
                                value={data.lastName}
                                onChange={handleChange}
                                placeholder="e.g. Doe"
                            />
                            <span className="heart-icon">❤</span>
                        </div>
                    </div>
                </div>
                <div className="input-group">
                    <label>Summary</label>
                    <div className="input-wrapper">
                        <textarea
                            name="summary"
                            value={data.summary}
                            onChange={handleChange}
                            placeholder="Write a brief professional summary..."
                            rows="4"
                        ></textarea>
                        <span className="heart-icon textarea-heart">❤</span>
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h3>Experience</h3>
                {data.experience.map((exp, index) => (
                    <div key={index} className="section-item">
                        <div className="input-group">
                            <label>Company</label>
                            <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                                placeholder="e.g. Google"
                            />
                        </div>
                        <div className="input-group">
                            <label>Title</label>
                            <input
                                type="text"
                                value={exp.title}
                                onChange={(e) => handleArrayChange('experience', index, 'title', e.target.value)}
                                placeholder="e.g. Software Engineer"
                            />
                        </div>
                    </div>
                ))}
                <button
                    className="add-more-btn"
                    onClick={() => addSectionItem('experience', { company: '', title: '', duration: '', description: [] })}
                >
                    + Add Experience
                </button>
            </div>

            <div className="form-section">
                <h3>Education</h3>
                {data.education.map((edu, index) => (
                    <div key={index} className="section-item">
                        <div className="input-group">
                            <label>University</label>
                            <input
                                type="text"
                                value={edu.university}
                                onChange={(e) => handleArrayChange('education', index, 'university', e.target.value)}
                                placeholder="e.g. Harvard"
                            />
                        </div>
                        <div className="input-group">
                            <label>Degree</label>
                            <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                                placeholder="e.g. Computer Science"
                            />
                        </div>
                    </div>
                ))}
                <button
                    className="add-more-btn"
                    onClick={() => addSectionItem('education', { university: '', degree: '', gradYear: '' })}
                >
                    + Add Education
                </button>
            </div>

            <div className="form-section">
                <h3>Skills</h3>
                {data.skills.map((skill, index) => (
                    <div key={index} className="section-item skill-form-item">
                        <div className="input-group flex-1">
                            <label>Skill Name</label>
                            <input
                                type="text"
                                value={skill.name}
                                onChange={(e) => handleArrayChange('skills', index, 'name', e.target.value)}
                                placeholder="e.g. React"
                            />
                        </div>
                        <div className="input-group flex-1">
                            <label>Proficiency ({skill.level}%)</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={skill.level}
                                onChange={(e) => handleArrayChange('skills', index, 'level', e.target.value)}
                                className="range-slider"
                            />
                        </div>
                    </div>
                ))}
                <button
                    className="add-more-btn"
                    onClick={() => addSectionItem('skills', { name: '', level: 50 })}
                >
                    + Add Skill
                </button>
            </div>
        </div>
    );
};

export default CvForm;
