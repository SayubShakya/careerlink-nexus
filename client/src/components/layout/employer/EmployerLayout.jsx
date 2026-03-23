import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation, ScrollRestoration } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import EmployerSidebar from './EmployerSidebar';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/routes/routes';
import { useTheme } from '@/hooks/useTheme';
import { THEME_MODES } from '@/config/constants';

const EmployerLayout = () => {
    const { isAuthenticated } = useAuth();
    const userRole = localStorage.getItem('role');
    const { theme } = useTheme();
    const location = useLocation();

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

    // Safety check: if user is not an employer, redirect to login
    if (!isAuthenticated() || userRole !== 'employer') {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    const styles = {
        container: {
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: 'var(--bg-subtle)'
        },
        mainArea: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            transition: 'margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
        },
        content: {
            flexGrow: 1,
            padding: '0',
            width: '100%',
            marginBottom: '40px', // Extra padding at bottom
        }
    };

    return (
        <div style={styles.container}>
            <ScrollRestoration />
            {/* Mobile Header */ }
            <div className="mobile-header-glass hidden-desktop">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="mobile-menu-toggle btn-scale"
                    >
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <span style={{ fontWeight: 800, fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'var(--theme-text-primary)' }}>
                        Career<span style={{ color: '#3E61FF' }}>Link</span>
                    </span>
                </div>
            </div>

            <EmployerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div
                style={{
                    ...styles.mainArea,
                    marginLeft: isSidebarOpen ? '280px' : '88px'
                }}
                className="main-content-area"
            >
                <main style={styles.content}>
                    <Outlet />
                </main>
            </div>

            <style>{`
                .mobile-header-glass {
                    display: none;
                }
                .mobile-menu-toggle {
                    background: none;
                    border: none;
                    color: var(--theme-text-primary);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                @media (max-width: 1023px) {
                    .main-content-area {
                        margin-left: 0 !important;
                    }
                    .mobile-header-glass.hidden-desktop {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 16px 20px;
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        z-index: 999;
                        background: rgba(255, 255, 255, 0.8);
                        backdrop-filter: blur(12px);
                        -webkit-backdrop-filter: blur(12px);
                        border-bottom: 1px solid var(--theme-border);
                    }
                    
                    /* Dark mode wrapper for header */
                    .dark-theme .mobile-header-glass.hidden-desktop {
                        background: rgba(10, 14, 23, 0.8);
                    }
                }
            `}</style>
        </div>
    );
};

export default EmployerLayout;
