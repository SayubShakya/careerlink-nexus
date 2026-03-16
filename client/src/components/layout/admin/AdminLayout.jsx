import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/routes/routes';
import { useTheme } from '@/hooks/useTheme';
import { THEME_MODES } from '@/config/constants';

import { Menu, X } from 'lucide-react';

const AdminLayout = () => {
    const { isAuthenticated } = useAuth();
    const userRole = localStorage.getItem('role');
    const { theme } = useTheme();

    useEffect(() => {
        const root = document.documentElement;
        if (theme === THEME_MODES.DARK) {
            root.classList.add('dark-theme');
        } else {
            root.classList.remove('dark-theme');
        }

        return () => {
            root.classList.remove('dark-theme');
        };
    }, [theme]);

    // Default to true for desktop, false for mobile
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1023);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1023) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!isAuthenticated() || userRole !== 'admin') {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: 'var(--theme-bg, #F8FAFC)',
            transition: 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        }}>
            {/* Mobile Header */}
            <div className="admin-mobile-header hidden-desktop">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="mobile-btn"
                    >
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--theme-text-primary, #1e293b)' }}>
                        Career<span style={{ color: '#6366F1' }}>Link Admin</span>
                    </span>
                </div>
            </div>

            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div
                style={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    marginLeft: isSidebarOpen ? '260px' : (window.innerWidth <= 1023 ? '0' : '80px')
                }}
                className="admin-main-area"
            >
                <main style={{ flexGrow: 1, padding: '0', width: '100%' }}>
                    <Outlet />
                </main>
            </div>

            <style>{`
                .admin-mobile-header {
                    display: none;
                }
                
                @media (max-width: 1023px) {
                    .admin-main-area {
                        margin-left: 0 !important;
                        padding-top: 70px;
                    }
                    .admin-mobile-header.hidden-desktop {
                        display: flex;
                        align-items: center;
                        padding: 16px 20px;
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        z-index: 1000;
                        background: rgba(255, 255, 255, 0.85);
                        backdrop-filter: blur(12px);
                        border-bottom: 1px solid var(--theme-border, #E5E7EB);
                    }
                    .dark-theme .admin-mobile-header.hidden-desktop {
                        background: rgba(15, 23, 42, 0.85);
                        border-bottom-color: rgba(255,255,255,0.06);
                    }
                    .mobile-btn {
                        background: none;
                        border: none;
                        color: var(--theme-text-primary, #1e293b);
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminLayout;
