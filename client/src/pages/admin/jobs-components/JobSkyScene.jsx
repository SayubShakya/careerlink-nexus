import React from 'react';

const JobSkyScene = ({ timeOfDay }) => (
    <div className="jb-sky-scene">
        {timeOfDay === 'night' && (
            <>
                {[...Array(24)].map((_, i) => (
                    <div key={i} className="jb-star" style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${1.5 + Math.random() * 2}s`,
                        width: `${2 + Math.random() * 1.5}px`,
                        height: `${2 + Math.random() * 1.5}px`,
                    }} />
                ))}
                <div className="jb-moon">
                    <div className="jb-moon-crater" style={{ width: 8, height: 8, top: 8, left: 12 }} />
                    <div className="jb-moon-crater" style={{ width: 5, height: 5, top: 18, left: 6 }} />
                    <div className="jb-moon-crater" style={{ width: 4, height: 4, top: 12, left: 22 }} />
                </div>
                <div className="jb-moon-glow" />
            </>
        )}
        {timeOfDay === 'morning' && (
            <>
                <div className="jb-sun jb-morning-sun">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="jb-sun-ray" style={{ transform: `rotate(${i * 30}deg)` }} />
                    ))}
                </div>
                <div className="jb-sun-glow jb-morning-glow" />
                <div className="jb-cloud jb-cloud-1" />
                <div className="jb-cloud jb-cloud-2" />
            </>
        )}
        {timeOfDay === 'afternoon' && (
            <>
                <div className="jb-sun jb-afternoon-sun" />
                <div className="jb-sun-glow jb-afternoon-glow" />
                <div className="jb-cloud jb-cloud-1" />
                <div className="jb-cloud jb-cloud-3" />
            </>
        )}
        {timeOfDay === 'evening' && (
            <>
                <div className="jb-sunset-orb" />
                <div className="jb-sunset-glow" />
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="jb-star" style={{
                        left: `${10 + Math.random() * 80}%`,
                        top: `${5 + Math.random() * 40}%`,
                        animationDelay: `${Math.random() * 2.5}s`,
                        width: '2px', height: '2px',
                    }} />
                ))}
                <div className="jb-cloud jb-cloud-ev" />
            </>
        )}
    </div>
);

export default JobSkyScene;
