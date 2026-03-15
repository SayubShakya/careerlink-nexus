import React from 'react';

const StatPill = ({ label, value, icon, color, bg }) => (
    <div className="jb-stat-pill" style={{ '--accent': color, '--bg': bg }}>
        <div className="jb-sp-icon-box">
            <div className="jb-sp-icon">{icon}</div>
        </div>
        <div className="jb-sp-info">
            <span className="jb-sp-value">{value}</span>
            <span className="jb-sp-label">{label}</span>
        </div>
        <div className="jb-sp-decor" />
    </div>
);

export default StatPill;
