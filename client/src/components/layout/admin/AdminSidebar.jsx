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
    Shield
} from 'lucide-react';
import { ROUTES } from '@/routes/routes';
import logoImg from '@assets/images/CareerLink-Logo.png';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();
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
                            <img src={logoImg} alt="CareerLink" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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
                    {isOpen && (
                        <div className="admin-badge">
                            <Shield size={14} />
                            <span>Admin Access</span>
                        </div>
                    )}
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={18} />
                        {isOpen && <span>Log Out</span>}
                    </button>
                </div>
            </aside>

            <style>{`
                .admin-sidebar {
                    width: 260px;
                    height: 100vh;
                    background: linear-gradient(180deg, #0B0F1A 0%, #111827 100%);
                    color: white;
                    display: flex;
                    flex-direction: column;
                    position: fixed;
                    left: 0; top: 0;
                    z-index: 1001;
                    transition: width 0.28s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow: hidden;
                    border-right: 1px solid rgba(255,255,255,0.06);
                }
                .admin-sidebar[data-open="false"] { width: 76px; }

                /* Brand */
                .sidebar-brand {
                    padding: 20px 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    min-height: 72px;
                }
                .brand-logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .brand-icon {
                    width: 44px; height: 44px;
                    border-radius: 10px;
                    background: #ffffff;
                    display: flex; align-items: center; justify-content: center;
                    padding: 6px;
                    flex-shrink: 0;
                }
                .brand-text { display: flex; flex-direction: column; }
                .brand-name { font-size: 0.95rem; font-weight: 700; letter-spacing: -0.01em; color: #F1F5F9; }
                .brand-label { font-size: 0.6rem; font-weight: 500; color: #6366F1; letter-spacing: 0.08em; text-transform: uppercase; margin-top: 1px; }
                .sidebar-toggle {
                    width: 32px; height: 32px; border-radius: 8px;
                    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
                    color: #64748B; cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.2s; flex-shrink: 0;
                }
                .sidebar-toggle:hover { background: rgba(255,255,255,0.08); color: #E2E8F0; }

                /* Nav */
                .sidebar-nav { flex: 1; padding: 16px 10px; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }
                .nav-section-label {
                    font-size: 0.6rem; font-weight: 600; color: #475569;
                    text-transform: uppercase; letter-spacing: 0.1em;
                    padding: 8px 12px 10px; pointer-events: none;
                }
                .sidebar-link {
                    display: flex; align-items: center; gap: 12px;
                    padding: 10px 12px; border-radius: 10px;
                    color: #94A3B8; text-decoration: none;
                    font-weight: 500; font-size: 0.85rem;
                    transition: all 0.2s; position: relative;
                    border: 1px solid transparent;
                }
                .admin-sidebar[data-open="false"] .sidebar-link { justify-content: center; padding: 10px; }
                .sidebar-link:hover { background: rgba(255,255,255,0.04); color: #CBD5E1; }
                .sidebar-link.active {
                    background: rgba(99,102,241,0.1);
                    color: #A5B4FC;
                    border-color: rgba(99,102,241,0.15);
                }
                .sidebar-link.active .link-icon { color: #818CF8; }
                .link-icon { display: flex; flex-shrink: 0; transition: color 0.2s; }
                .link-content { flex: 1; min-width: 0; }
                .link-label { display: block; }
                .link-desc { display: block; font-size: 0.65rem; color: #475569; font-weight: 400; margin-top: 1px; }
                .sidebar-link.active .link-desc { color: #6366F1; }
                .link-chevron { margin-left: auto; opacity: 0.2; transition: all 0.2s; flex-shrink: 0; }
                .sidebar-link:hover .link-chevron { opacity: 0.6; transform: translateX(2px); }
                .sidebar-link.active .link-chevron { opacity: 0.5; }

                /* Tooltip */
                .sidebar-tooltip {
                    position: absolute; left: calc(100% + 12px);
                    padding: 6px 12px; background: #1E293B;
                    border: 1px solid rgba(255,255,255,0.08);
                    color: #E2E8F0; border-radius: 8px;
                    font-size: 0.75rem; font-weight: 600;
                    white-space: nowrap; pointer-events: none;
                    opacity: 0; visibility: hidden;
                    transition: all 0.15s; z-index: 1002;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
                }
                .sidebar-link:hover .sidebar-tooltip { opacity: 1; visibility: visible; left: calc(100% + 8px); }

                /* Footer */
                .sidebar-footer {
                    padding: 16px 10px 20px;
                    border-top: 1px solid rgba(255,255,255,0.06);
                    display: flex; flex-direction: column; gap: 10px;
                }
                .admin-badge {
                    display: flex; align-items: center; gap: 8px;
                    padding: 8px 12px; border-radius: 8px;
                    background: rgba(99,102,241,0.06);
                    border: 1px solid rgba(99,102,241,0.1);
                    color: #818CF8; font-size: 0.7rem; font-weight: 600;
                }
                .logout-btn {
                    width: 100%; display: flex; align-items: center;
                    gap: 10px; padding: 10px 12px; border-radius: 10px;
                    color: #F87171; background: rgba(239,68,68,0.05);
                    border: 1px solid rgba(239,68,68,0.08);
                    cursor: pointer; font-size: 0.85rem; font-weight: 500;
                    transition: all 0.2s;
                }
                .admin-sidebar[data-open="false"] .logout-btn { justify-content: center; }
                .logout-btn:hover {
                    background: rgba(239,68,68,0.1);
                    border-color: rgba(239,68,68,0.2);
                    color: #FCA5A5;
                }

                @media (max-width: 1023px) {
                    .admin-sidebar { display: none; }
                }
            `}</style>
        </>
    );
};

export default AdminSidebar;
