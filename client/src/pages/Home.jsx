import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import Hero from '@/components/features/Hero/Hero';
import StatsSection from '@/components/features/StatsSection/StatsSection';
import Slider from '@/components/ui/Slider';
import { CheckCircle, Zap, Shield, Globe, TrendingUp, Users, ArrowRight, Star } from 'lucide-react';

export default function Home() {
    const [userType, setUserType] = useState('jobseeker');

    const companies = ['Linear', 'Vercel', 'Anthropic', 'OpenAI', 'Stripe', 'Airbnb', 'Notion', 'Figma', 'Shopify', 'Coinbase']; // 'jobseeker' | 'employer'
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const role = localStorage.getItem('role');

    useEffect(() => {
        if (isAuthenticated()) {
            if (role === 'job_seeker') {
                navigate('/jobseeker/overview');
            } else if (role === 'employer') {
                navigate('/dashboard/employer');
            }
        }
    }, [isAuthenticated, role, navigate]);

    const handleJobClick = () => {
        navigate('/jobs');
    };

    const handleApplyClick = (e) => {
        e.stopPropagation(); // Prevent card click triggering job navigation
        if (isAuthenticated()) {
            navigate('/jobs'); // Redirect to jobs page if authenticated (as per request "redirected to Find Jobs navigation page" for clicked jobs, assuming apply follows similar flow or goes to specific job. For now, following the specific rule: "if job seeker tries to apply... unauthorized... sign in". Implies authorized -> proceed. Redirecting to /jobs is a safe proceed action if no specific job link exists).
        } else {
            navigate('/login');
        }
    };

    return (
        <div style={{ position: 'relative', backgroundColor: '#FAFAFA', minHeight: '100vh', overflowX: 'hidden' }}>
            <main>
                {/* Section 1: Hero (State Managed Here) */}
                <Hero userType={userType} setUserType={setUserType} />

                {/* Section 2: Trusted Companies */}
                <section className="marquee-section">
                    <div className="marquee-label">Trusted by high-growth teams at</div>
                    <div className="marqee-wrapper">
                        <div className="companies-scroll">
                            {[...companies, ...companies, ...companies].map((company, index) => (
                                <span key={index} className="company-logo-text">
                                    {company}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section 3: Stats (Subtle) */}
                <div style={{ background: 'white', borderBottom: '1px solid #F1F5F9' }}>
                    <StatsSection />
                </div>

                {/* Conditional Sections based on User Type */}
                {userType === 'jobseeker' ? (
                    <>
                        {/* Job Seeker: Visual Experience (Slider) */}
                        <section style={{ padding: '80px 0', background: '#FAFAFA' }} className="animate-up delay-2">
                            <div className="container">
                                <div className="glass-showcase">
                                    <Slider />
                                </div>
                            </div>
                        </section>

                    </>
                ) : (
                    <>
                        {/* Employer: Bento Grid Features */}
                        <section style={{ padding: '100px 0', background: 'linear-gradient(to bottom, #FFFFFF, #F8FAFC)' }}>
                            <div className="container">
                                <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 80px' }}>
                                    <h2 className="section-title">Hire the Top 1% of Talent</h2>
                                    <p className="section-subtitle">
                                        Our rigorous vetting process ensures you only meet candidates who are ready to make an impact from day one.
                                    </p>
                                </div>

                                <div className="bento-grid">
                                    <div className="bento-card large blue-gradient">
                                        <div className="bento-icon"><Zap size={32} /></div>
                                        <h3>Accelerated Hiring</h3>
                                        <p>Reduce time-to-hire by 70% with our pre-vetted talent pool of elite engineers and designers ready to interview.</p>
                                        <div className="bento-visual graph-visual"></div>
                                    </div>
                                    <div className="bento-card medium purple-gradient">
                                        <div className="bento-icon"><Globe size={32} /></div>
                                        <h3>Global Reach</h3>
                                        <p>Access talent from over 50 countries, vetted for English proficiency and remote readiness.</p>
                                    </div>
                                    <div className="bento-card medium dark-gradient">
                                        <div className="bento-icon"><Shield size={32} /></div>
                                        <h3>Quality Guaranteed</h3>
                                        <p>We stand by our candidates. 90-day full replacement guarantee if it's not a match.</p>
                                    </div>
                                    <div className="bento-card wide orange-gradient">
                                        <div className="content-side">
                                            <div className="bento-icon"><TrendingUp size={32} /></div>
                                            <h3>Data-Driven Matching</h3>
                                            <p>Our AI analyzes over 50 data points to predict candidate success in your specific team context.</p>
                                        </div>
                                        <div className="bento-visual stats-visual">
                                            <div className="stat-row"><span>Skill Match</span><div className="bar" style={{ width: '94%' }}></div></div>
                                            <div className="stat-row"><span>Culture Fit</span><div className="bar" style={{ width: '88%' }}></div></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </main>

            <style>{`
                /* Marquee Stylings */
                .marquee-section {
                    background: white;
                    padding: 60px 0;
                    border-bottom: 1px solid #F1F5F9;
                    text-align: center;
                    overflow: hidden;
                    position: relative;
                }
                .marquee-label {
                    font-size: 0.75rem;
                    color: #94A3B8;
                    margin-bottom: 40px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                }
                .marqee-wrapper {
                    display: flex;
                    overflow: hidden;
                    mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .companies-scroll {
                    display: flex;
                    align-items: center;
                    gap: 60px;
                    animation: scroll 40s linear infinite;
                    padding-right: 60px;
                }
                .companies-scroll:hover {
                    animation-play-state: paused;
                }
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
                
                .company-logo-text {
                    font-size: 1.7rem;
                    font-weight: 800;
                    color: #CBD5E1;
                    white-space: nowrap;
                    font-family: 'Inter', sans-serif;
                    letter-spacing: -0.04em;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .company-logo-text:hover {
                    color: var(--color-brand-accent);
                    transform: translateY(-2px);
                    opacity: 1;
                }
                .company-logo-text:hover {
                    color: #64748B;
                }

                /* Bento Grid */
                .bento-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    grid-template-rows: auto auto; 
                    gap: 24px;
                    max-width: 1100px;
                    margin: 0 auto;
                }
                .bento-card {
                    padding: 40px;
                    border-radius: 32px;
                    background: #F8FAFC;
                    border: 1px solid rgba(0,0,0,0.05);
                    transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                }
                .bento-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08); }
                
                .bento-card.large { grid-column: span 1; grid-row: span 2; }
                .bento-card.medium { grid-column: span 1; grid-row: span 1; }
                .bento-card.wide { grid-column: span 2; grid-row: span 1; flex-direction: row; align-items: center; justify-content: space-between; gap: 20px; }
                .bento-card.wide .content-side { max-width: 60%; }

                .bento-icon { margin-bottom: 24px; width: 64px; height: 64px; border-radius: 20px; background: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.05); color: #0F172A; }
                
                .bento-card h3 { font-size: 1.5rem; font-weight: 800; margin-bottom: 12px; color: #0F172A; letter-spacing: -0.02em; }
                .bento-card p { font-size: 1.05rem; line-height: 1.6; color: #64748B; }

                /* Gradients for Bento */
                .blue-gradient { background: linear-gradient(145deg, #F0F9FF 0%, #E0F2FE 100%); }
                .purple-gradient { background: linear-gradient(145deg, #F5F3FF 0%, #EDE9FE 100%); }
                .dark-gradient { background: #0F172A; color: white !important; }
                .dark-gradient h3 { color: white !important; }
                .dark-gradient p { color: #94A3B8 !important; }
                .dark-gradient .bento-icon { background: rgba(255,255,255,0.1); color: white; }
                .orange-gradient { background: linear-gradient(145deg, #FFF7ED 0%, #FFEDD5 100%); }
                
                /* Bento Visuals */
                .bento-visual { margin-top: auto; width: 100%; height: 100px; background: rgba(255,255,255,0.5); border-radius: 12px; }
                .graph-visual { 
                    background-image: radial-gradient(#94a3b8 1.5px, transparent 1.5px);
                    background-size: 16px 16px;
                    opacity: 0.4;
                }
                .stats-visual { 
                    width: 40%; height: auto; padding: 20px; background: white; border-radius: 16px; 
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                }
                .stat-row { display: flex; align-items: center; gap: 10px; font-size: 0.8rem; font-weight: 700; color: #64748B; margin-bottom: 8px; }
                .stat-row span { width: 70px; }
                .stat-row .bar { height: 6px; background: #3E61FF; border-radius: 100px; }

                @media (max-width: 1024px) {
                    .bento-grid { grid-template-columns: 1fr; }
                    .bento-card.large, .bento-card.medium, .bento-card.wide { grid-column: span 1; grid-row: span 1; }
                    .bento-card.wide { flex-direction: column; align-items: flex-start; }
                    .bento-card.wide .content-side { max-width: 100%; }
                    .stats-visual { width: 100%; margin-top: 20px; }
                }

                /* Job Cards Premium Reimagined */
                .job-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 32px; }
                .job-card-premium {
                    background: white;
                    border: 1px solid #F1F5F9;
                    border-radius: 28px;
                    padding: 36px;
                    transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
                    display: flex; flex-direction: column; 
                    position: relative;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.01), 0 2px 4px -1px rgba(0, 0, 0, 0.01);
                }
                .job-card-premium:hover { 
                    transform: translateY(-8px); 
                    box-shadow: 0 20px 40px -12px rgba(62, 97, 255, 0.15); 
                    border-color: rgba(62, 97, 255, 0.2); 
                }
                
                .card-header { display: flex; justify-content: space-between; align-items: flex-start; }
                .company-logo-wrapper { 
                    width: 60px; height: 60px; 
                    background: white; 
                    border-radius: 18px; 
                    display: flex; align-items: center; justify-content: center; 
                    border: 1px solid #F1F5F9; /* Placeholder for dynamic color border */
                    box-shadow: 0 4px 10px rgba(0,0,0,0.03);
                }
                
                .job-type-badge { 
                    font-size: 0.75rem; font-weight: 700; color: #64748B; 
                    padding: 8px 16px; background: #F8FAFC; border-radius: 100px; border: 1px solid #F1F5F9;
                }
                
                .job-title { font-size: 1.35rem; font-weight: 800; color: #0F172A; letter-spacing: -0.02em; margin: 0; line-height: 1.3; }
                .job-meta { color: #64748B; font-size: 0.95rem; margin: 4px 0 0 0; font-weight: 500; }
                
                .tags-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: auto; padding: 20px 0; border-bottom: 1px solid #F1F5F9; }
                .tech-tag { 
                    font-size: 0.8rem; padding: 6px 12px; border-radius: 8px; 
                    background: white; border: 1px solid #E2E8F0; color: #475569; font-weight: 600; 
                }
                
                .card-footer { margin-top: 24px; display: flex; justify-content: space-between; align-items: center; }
                
                .salary-badge { 
                    font-weight: 700; color: #0F172A; font-size: 0.95rem; 
                    display: flex; align-items: center; gap: 8px;
                    padding: 8px 14px; background: #F8FAFC; border-radius: 10px;
                }
                .salary-badge .dot { width: 6px; height: 6px; background: #10B981; border-radius: 50%; }

                .apply-btn-card { 
                    background: #0F172A; color: white; font-weight: 600; border: none; 
                    padding: 10px 24px; border-radius: 12px; cursor: pointer; transition: all 0.2s;
                    font-size: 0.9rem;
                }
                .apply-btn-card:hover {
                    background: #3E61FF; transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(62, 97, 255, 0.25);
                }

                /* Section Headers */
                .section-title { font-size: 2.75rem; font-weight: 800; color: #0F172A; margin-bottom: 12px; letter-spacing: -0.04em; line-height: 1.1; }
                .section-subtitle { color: #64748B; font-size: 1.15rem; line-height: 1.6; max-width: 600px; }

                .btn-premium-outline {
                    border: 1px solid #E2E8F0; padding: 12px 24px; border-radius: 14px; background: white; color: #0F172A; font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px;
                }
                .btn-premium-outline:hover { background: #F8FAFC; border-color: #CBD5E1; color: #3E61FF; }
                
                .glass-showcase {
                    padding: 24px; background: white; border-radius: 40px; box-shadow: 0 40px 80px -20px rgba(0,0,0,0.06); border: 1px solid rgba(0,0,0,0.03);
                }
            `}</style>
        </div>
    );
}
