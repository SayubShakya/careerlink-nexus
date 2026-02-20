import React, { useState } from 'react';
import './CvBuilder.css';
import CvForm from './components/CvForm';
import CvPreview from './components/CvPreview';

const CvBuilder = () => {
    const [cvData, setCvData] = useState({
        firstName: '',
        lastName: '',
        summary: '',
        experience: [],
        education: [],
        skills: []
    });

    const handleUpdate = (newData) => {
        setCvData(prev => ({ ...prev, ...newData }));
    };

    return (
        <div className="cv-builder-container">
            <div className="cv-builder-left">
                <CvForm data={cvData} onUpdate={handleUpdate} />
            </div>
            <div className="cv-builder-right">
                <CvPreview data={cvData} />
            </div>
        </div>
    );
};

export default CvBuilder;
