import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, Sparkles, Building2, Users } from 'lucide-react';
import './Hero.css';

const Hero = ({ userType, setUserType }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery) params.append('q', searchQuery);
        if (location) params.append('l', location);
        
        const path = userType === 'jobseeker' ? '/find-jobs' : '/jobs'; 
        navigate(`${path}?${params.toString()}`);
    };

    return (
        <section className="hero-section premium-hero">
            {/* Background Effects */}
            <div className="hero-mesh-bg"></div>

            <div className="hero-content">
                {/* Toggle Switch */}
                <div className="user-toggle-container">
                    <div
                        className={`toggle-option ${userType === 'jobseeker' ? 'active' : ''}`}
                        onClick={() => setUserType('jobseeker')}
                    >
                        <Users size={16} /> Job Seeker
                    </div>
                    <div
                        className={`toggle-option ${userType === 'employer' ? 'active' : ''}`}
                        onClick={() => setUserType('employer')}
                    >
                        <Building2 size={16} /> Employer
                    </div>
                </div>

                {/* Dynamic Content */}
                <div className="hero-text-wrapper fade-in-up">
                    <h1 className="hero-title">
                        {userType === 'jobseeker' ? (
                            <>Find Your <span className="gradient-text">Dream Job</span></>
                        ) : (
                            <>Hire <span className="gradient-text">World-Class</span> Talent</>
                        )}
                    </h1>

                    <p className="hero-subtitle">
                        {userType === 'jobseeker'
                            ? "Discover thousands of job opportunities from top companies. Your perfect career match is just a search away."
                            : "Access a curated network of top engineers, designers, and product leaders ready to join your team."
                        }
                    </p>
                </div>

                {userType === 'jobseeker' ? (
                    <form className="search-container glass-panel" onSubmit={handleSearch}>
                        <div className="search-input-group">
                            <Search size={20} className="text-muted" />
                            <input
                                type="text"
                                placeholder="Job title, keywords, or company"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="divider"></div>

                        <div className="search-input-group">
                            <MapPin size={20} className="text-muted" />
                            <input
                                type="text"
                                placeholder="City, state, or remote"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="search-btn btn-glow">
                            Search Jobs
                        </button>
                    </form>
                ) : (
                    <div className="hero-actions-container">
                        <button className="btn-primary-large btn-glow">
                            Start Hiring <ArrowRight size={20} />
                        </button>
                        <button className="btn-secondary-large">
                            View Talent Pool
                        </button>
                    </div>
                )}

                {/* Trust/Stats Indicators */}
                <div className="hero-stats-row">
                    <div className="stat-pill">
                        <span className="stat-highlight">10k+</span> per month
                    </div>
                    <div className="stat-pill">
                        <Sparkles size={14} fill="#FFD700" color="#FFD700" /> Top Startups
                    </div>
                    <div className="stat-pill">
                        <span className="stat-highlight">72h</span> avg. hiring time
                    </div>
                </div>
            </div>

            <style>{`
                .premium-hero {
                    position: relative;
                    min-height: 85vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    background: #FAFAFA; /* Fallback */
                }

                .hero-mesh-bg {
                    position: absolute;
                    inset: 0;
                    background: 
                        radial-gradient(at 0% 0%, rgba(62, 97, 255, 0.1) 0px, transparent 50%),
                        radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.1) 0px, transparent 50%),
                        radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.05) 0px, transparent 50%);
                    z-index: 0;
                }

                .hero-content {
                    z-index: 2;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    width: 100%;
                    max-width: 900px;
                    padding: 0 20px;
                }

                /* Toggle Switch */
                .user-toggle-container {
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(10px);
                    padding: 6px;
                    border-radius: 100px;
                    border: 1px solid rgba(0,0,0,0.05);
                    display: flex;
                    gap: 4px;
                    margin-bottom: 40px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
                }

                .toggle-option {
                    padding: 10px 24px;
                    border-radius: 100px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #64748B;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    user-select: none;
                }

                .toggle-option:hover {
                    color: #0F172A;
                    background: rgba(0,0,0,0.02);
                }

                .toggle-option.active {
                    background: #0F172A; /* Black pill for active state */
                    color: white;
                    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
                }

                /* Typography */
                .hero-title {
                    font-size: clamp(3rem, 6vw, 4.5rem);
                    font-weight: 800;
                    color: #0F172A;
                    letter-spacing: -0.04em;
                    line-height: 1.1;
                    margin-bottom: 24px;
                }

                .gradient-text {
                    background: linear-gradient(135deg, #3E61FF 0%, #8B5CF6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .hero-subtitle {
                    font-size: 1.25rem;
                    color: #64748B;
                    max-width: 600px;
                    line-height: 1.6;
                    margin-bottom: 48px;
                }

                /* Search Bar */
                .glass-panel {
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
                    border-radius: 20px;
                    padding: 10px;
                    display: flex;
                    align-items: center;
                    width: 100%;
                    max-width: 800px;
                    transition: transform 0.3s, box-shadow 0.3s;
                }

                .glass-panel:focus-within {
                    transform: translateY(-4px);
                    box-shadow: 0 30px 60px -15px rgba(62, 97, 255, 0.15);
                    border-color: rgba(62, 97, 255, 0.3);
                }

                .search-input-group {
                    flex: 1;
                    padding: 0 20px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .search-input-group input {
                    width: 100%;
                    border: none;
                    background: transparent;
                    font-size: 1.05rem;
                    font-weight: 500;
                    color: #0F172A;
                    outline: none;
                    height: 48px;
                }
                
                .text-muted { color: #94A3B8; }

                .divider {
                    width: 1px;
                    height: 32px;
                    background: #E2E8F0;
                }

                .search-btn {
                    padding: 0 32px;
                    height: 56px;
                    background: linear-gradient(135deg, #3E61FF 0%, #6366F1 100%);
                    color: white;
                    border: none;
                    border-radius: 14px;
                    font-weight: 700;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-left: 10px;
                }

                .btn-glow:hover {
                    box-shadow: 0 10px 25px rgba(62, 97, 255, 0.4);
                    transform: translateY(-2px);
                }
                
                /* Large Actions Buttons */
                .hero-actions-container {
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                }

                .btn-primary-large {
                    padding: 16px 40px;
                    font-size: 1.1rem;
                    font-weight: 700;
                    background: #0F172A;
                    color: white;
                    border-radius: 16px;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transition: all 0.2s;
                }
                
                .btn-secondary-large {
                    padding: 16px 40px;
                    font-size: 1.1rem;
                    font-weight: 700;
                    background: white;
                    color: #0F172A;
                    border-radius: 16px;
                    border: 1px solid #E2E8F0;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-secondary-large:hover {
                    background: #F8FAFC;
                    border-color: #CBD5E1;
                    transform: translateY(-2px);
                }

                /* Stats Row */
                .hero-stats-row {
                    margin-top: 60px;
                    display: flex;
                    gap: 24px;
                    flex-wrap: wrap;
                    justify-content: center;
                }

                .stat-pill {
                    background: rgba(255, 255, 255, 0.6);
                    backdrop-filter: blur(4px);
                    padding: 8px 16px;
                    border-radius: 100px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #64748B;
                    border: 1px solid rgba(0,0,0,0.05);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .stat-highlight {
                    color: #0F172A;
                    font-weight: 800;
                }

                @media (max-width: 768px) {
                    .glass-panel {
                        flex-direction: column;
                        padding: 16px;
                        gap: 12px;
                    }
                    .divider { display: none; }
                    .search-input-group { width: 100%; border-bottom: 1px solid #E2E8F0; padding-bottom: 12px; }
                    .search-input-group:last-of-type { border-bottom: none; }
                    .search-btn { width: 100%; margin: 0; }
                    .hero-title { font-size: 2.5rem; }
                }

                .fade-in-up {
                    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </section>
    );
};

export default Hero;
