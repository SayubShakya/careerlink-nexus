import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Building2,
    Users,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Briefcase,
    Shield,
    Sun,
    Moon
} from 'lucide-react';
import { ROUTES } from '@/routes/routes';
import { useTheme } from '@/hooks/useTheme';
import { THEME_MODES } from '@/config/constants';
import logoImg from '@assets/images/CareerLink-Logo.png';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const handleLogout = () => navigate(ROUTES.LOGOUT_CONFIRMATION);

    const navItems = [
        { label: 'Dashboard', desc: 'Overview & stats', path: ROUTES.ADMIN_DASHBOARD, icon: <LayoutDashboard size={20} /> },
        { label: 'Employers', desc: 'Company accounts', path: ROUTES.ADMIN_EMPLOYERS, icon: <Building2 size={20} /> },
        { label: 'Job Seekers', desc: 'Talent pool', path: ROUTES.ADMIN_JOBSEEKERS, icon: <Users size={20} /> },
        { label: 'Job Listings', desc: 'All posted jobs', path: ROUTES.ADMIN_JOBS, icon: <Briefcase size={20} /> },
    ];

    return (
        <>
            <aside className="admin-sidebar" data-open={isOpen}>
                {/* Brand */}
                <div className="sidebar-brand">
                    <div className="brand-logo">
                        <div className="brand-icon">
                            <img src={logoImg} alt="CareerLink" style={{ width: '140%', height: '140%', objectFit: 'contain' }} />
                        </div>
                        {isOpen && (
                            <div className="brand-text">
                                <span className="brand-name">CareerLink</span>
                                <span className="brand-label">Admin Panel</span>
                            </div>
                        )}
                    </div>
                    <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>

                {/* Nav */}
                <nav className="sidebar-nav">
                    {isOpen && <div className="nav-section-label">Menu</div>}
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === ROUTES.ADMIN_DASHBOARD}
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                            title={!isOpen ? item.label : ''}
                        >
                            <span className="link-icon">{item.icon}</span>
                            {isOpen && (
                                <div className="link-content">
                                    <span className="link-label">{item.label}</span>
                                    <span className="link-desc">{item.desc}</span>
                                </div>
                            )}
                            {isOpen && <ChevronRight size={14} className="link-chevron" />}
                            {!isOpen && <div className="sidebar-tooltip">{item.label}</div>}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="sidebar-footer">
                    <button
                        onClick={() => toggleTheme(theme === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT)}
                        className="theme-toggle-btn"
                        title={!isOpen ? "Toggle Theme" : ""}
                    >
                        <div className="theme-btn-info">
                            {theme === THEME_MODES.LIGHT ? <Sun size={18} /> : <Moon size={18} />}
                            {isOpen && <span>{theme === THEME_MODES.LIGHT ? 'LIGHT MODE' : 'DARK MODE'}</span>}
                        </div>
                        {isOpen && (
                            <div className={`theme-switch ${theme === THEME_MODES.DARK ? 'active' : ''}`}>
                                <div className="switch-knob" />
                            </div>
                        )}
                        {!isOpen && <div className="sidebar-tooltip">Toggle Theme</div>}
                    </button>

                    {isOpen && (
                        <div className="admin-badge">
                            <Shield size={14} />
                            <span>System Administrator</span>
                        </div>
                    )}
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={18} />
                        {isOpen && <span>Log Out</span>}
                        {!isOpen && <div className="sidebar-tooltip">Log Out</div>}
                    </button>
                </div>
            </aside>

            <style>{`
                .admin-sidebar {
                    width: 260px;
                    height: 100vh;
                    background: var(--theme-sidebar, #FFFFFF);
                    color: var(--theme-text-primary, #0F172A);
                    display: flex;
                    flex-direction: column;
                    position: fixed;
                    left: 0; top: 0;
                    z-index: 1001;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow: hidden;
                    border-right: 1px solid var(--theme-border, rgba(0,0,0,0.06));
                }
                .admin-sidebar[data-open="false"] { width: 80px; }

                /* Dark Theme Specific Sidebar */
                .dark-theme .admin-sidebar {
                    background: linear-gradient(180deg, #0F172A 0%, #020617 100%);
                    color: #FFFFFF;
                    border-right-color: rgba(255,255,255,0.06);
                }

                /* Brand */
                .sidebar-brand {
                    padding: 24px 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 1px solid var(--theme-border, rgba(0,0,0,0.06));
                    min-height: 80px;
                }
                .dark-theme .sidebar-brand {
                    border-bottom-color: rgba(255,255,255,0.06);
                }
                .admin-sidebar[data-open="false"] .sidebar-brand {
                    padding: 20px 0;
                    flex-direction: column;
                    gap: 12px;
                    justify-content: center;
                    min-height: 120px;
                }
                .brand-logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .admin-sidebar[data-open="false"] .brand-logo {
                    justify-content: center;
                }
                .brand-icon {
                    width: 44px; height: 44px;
                    border-radius: 12px;
                    background: #ffffff;
                    display: flex; align-items: center; justify-content: center;
                    overflow: hidden;
                    flex-shrink: 0;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    border: 1px solid var(--theme-border, rgba(0,0,0,0.05));
                }
                .dark-theme .brand-icon {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                }
                .brand-text { display: flex; flex-direction: column; }
                .brand-name { font-size: 1.15rem; font-weight: 800; letter-spacing: -0.02em; color: var(--theme-text-primary, #0F172A); white-space: nowrap; }
                .dark-theme .brand-name { color: #F8FAFC; }
                .brand-label { font-size: 0.65rem; font-weight: 700; color: #6366F1; letter-spacing: 0.05em; text-transform: uppercase; margin-top: 1px; }
                .dark-theme .brand-label { color: #818CF8; }
                
                .sidebar-toggle {
                    width: 32px; height: 32px; border-radius: 8px;
                    background: var(--theme-bg-subtle, rgba(0,0,0,0.03)); 
                    border: 1px solid var(--theme-border, rgba(0,0,0,0.08));
                    color: var(--theme-text-secondary, #475569); cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.2s; flex-shrink: 0;
                }
                .dark-theme .sidebar-toggle {
                    background: rgba(255,255,255,0.05);
                    border-color: rgba(255,255,255,0.1);
                    color: #94A3B8;
                }
                .admin-sidebar[data-open="false"] .sidebar-toggle {
                    width: 32px; height: 32px;
                    background: #6366F1;
                    color: white;
                    border: none;
                }
                .sidebar-toggle:hover { 
                    background: #6366F1; 
                    color: white; 
                    border-color: #6366F1;
                }

                /* Nav */
                .sidebar-nav { flex: 1; padding: 16px 10px; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }
                .nav-section-label {
                    font-size: 0.6rem; font-weight: 700; color: var(--theme-text-muted, #94A3B8);
                    text-transform: uppercase; letter-spacing: 0.1em;
                    padding: 8px 12px 10px; pointer-events: none;
                }
                .sidebar-link {
                    display: flex; align-items: center; gap: 12px;
                    padding: 10px 12px; border-radius: 10px;
                    color: var(--theme-text-secondary, #475569); text-decoration: none;
                    font-weight: 600; font-size: 0.85rem;
                    transition: all 0.2s; position: relative;
                    border: 1px solid transparent;
                }
                .dark-theme .sidebar-link { color: #94A3B8; }
                
                .admin-sidebar[data-open="false"] .sidebar-link { 
                    justify-content: center; 
                    padding: 12px;
                    margin: 0 10px;
                }
                .sidebar-link:hover { 
                    background: var(--theme-bg-subtle, rgba(0,0,0,0.03)); 
                    color: var(--theme-text-primary, #0F172A); 
                }
                .dark-theme .sidebar-link:hover {
                    background: rgba(255,255,255,0.04);
                    color: #CBD5E1;
                }
                .sidebar-link.active {
                    background: rgba(99,102,241,0.08);
                    color: #4F46E5;
                    border-color: rgba(99,102,241,0.1);
                }
                .dark-theme .sidebar-link.active {
                    background: rgba(99,102,241,0.1);
                    color: #A5B4FC;
                    border-color: rgba(99,102,241,0.15);
                }
                .sidebar-link.active .link-icon { color: #4F46E5; }
                .dark-theme .sidebar-link.active .link-icon { color: #818CF8; }
                
                .link-icon { display: flex; flex-shrink: 0; transition: color 0.2s; }
                .link-content { flex: 1; min-width: 0; }
                .link-label { display: block; }
                .link-desc { display: block; font-size: 0.65rem; color: var(--theme-text-muted, #94A3B8); font-weight: 500; margin-top: 1px; }
                .sidebar-link.active .link-desc { color: #818CF8; }
                .link-chevron { margin-left: auto; opacity: 0.3; transition: all 0.2s; flex-shrink: 0; }
                .sidebar-link:hover .link-chevron { opacity: 0.8; transform: translateX(2px); }
                .sidebar-link.active .link-chevron { opacity: 0.6; }

                /* Tooltip */
                .sidebar-tooltip {
                    position: absolute; left: calc(100% + 12px);
                    padding: 6px 12px; 
                    background: var(--theme-text-primary, #0F172A);
                    border: 1px solid var(--theme-border, rgba(255,255,255,0.08));
                    color: var(--theme-bg, #FFFFFF); border-radius: 8px;
                    font-size: 0.75rem; font-weight: 700;
                    white-space: nowrap; pointer-events: none;
                    opacity: 0; visibility: hidden;
                    transition: all 0.15s; z-index: 1002;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                }
                .dark-theme .sidebar-tooltip {
                    background: #1E293B;
                    color: #E2E8F0;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
                }
                .sidebar-link:hover .sidebar-tooltip,
                .theme-toggle-btn:hover .sidebar-tooltip,
                .logout-btn:hover .sidebar-tooltip { 
                    opacity: 1; 
                    visibility: visible; 
                    left: calc(100% + 8px); 
                }

                /* Footer */
                .sidebar-footer {
                    padding: 20px 10px;
                    border-top: 1px solid var(--theme-border, rgba(0,0,0,0.06));
                    display: flex; flex-direction: column; gap: 12px;
                }
                .dark-theme .sidebar-footer {
                    border-top-color: rgba(255,255,255,0.06);
                }
                
                .theme-toggle-btn {
                    width: 100%; display: flex; align-items: center; justify-content: space-between;
                    padding: 12px; border-radius: 12px; border: 1px solid var(--theme-border, rgba(0,0,0,0.08));
                    background: var(--theme-bg-subtle, rgba(0,0,0,0.02)); 
                    color: var(--theme-text-secondary, #475569); cursor: pointer;
                    transition: all 0.2s; position: relative;
                }
                .dark-theme .theme-toggle-btn {
                    border-color: rgba(255,255,255,0.05);
                    background: rgba(255,255,255,0.02);
                    color: #94A3B8;
                }
                .admin-sidebar[data-open="false"] .theme-toggle-btn { justify-content: center; }
                .theme-toggle-btn:hover { 
                    background: var(--theme-bg-subtle, rgba(0,0,0,0.05)); 
                    border-color: var(--theme-border-bright, rgba(0,0,0,0.15));
                    color: var(--theme-text-primary, #0F172A); 
                }
                .dark-theme .theme-toggle-btn:hover {
                    background: rgba(255,255,255,0.05);
                    border-color: rgba(255,255,255,0.1);
                    color: #F1F5F9;
                }
                
                .theme-btn-info { display: flex; align-items: center; gap: 12px; }
                .theme-btn-info span { font-size: 0.7rem; font-weight: 800; letter-spacing: 0.05em; }
                
                .theme-switch {
                    width: 34px; height: 18px; border-radius: 20px; background: rgba(0,0,0,0.1);
                    padding: 2px; position: relative; transition: all 0.3s;
                }
                .dark-theme .theme-switch { background: rgba(255,255,255,0.1); }
                .theme-switch.active { background: #6366F1; }
                .switch-knob {
                    width: 14px; height: 14px; border-radius: 50%; background: white;
                    position: absolute; left: 2px; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .theme-switch.active .switch-knob { left: calc(100% - 16px); }

                .admin-badge {
                    display: flex; align-items: center; gap: 8px;
                    padding: 10px 14px; border-radius: 12px;
                    background: rgba(99,102,241,0.06);
                    border: 1px solid rgba(99,102,241,0.1);
                    color: #6366F1; font-size: 0.72rem; font-weight: 700;
                    letter-spacing: 0.02em;
                }
                .dark-theme .admin-badge { color: #818CF8; }

                .logout-btn {
                    width: 100%; display: flex; align-items: center;
                    gap: 12px; padding: 12px; border-radius: 12px;
                    color: #DC2626; background: rgba(239,68,68,0.06);
                    border: 1px solid rgba(239,68,68,0.12);
                    cursor: pointer; font-size: 0.85rem; font-weight: 800;
                    transition: all 0.2s; position: relative;
                }
                .dark-theme .logout-btn { color: #F87171; }
                .admin-sidebar[data-open="false"] .logout-btn { justify-content: center; }
                .logout-btn:hover {
                    background: rgba(239,68,68,0.12);
                    border-color: rgba(239,68,68,0.25);
                    color: #B91C1C; transform: translateY(-1px);
                }
                .dark-theme .logout-btn:hover { color: #FCA5A5; }

                @media (max-width: 1023px) {
                    .admin-sidebar { display: none; }
                }
            `}</style>
        </>
    );
};

export default AdminSidebar;
