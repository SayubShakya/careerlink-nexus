import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
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

    // Default to true for desktop layout
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
                @media (max-width: 1023px) {
                    .main-content-area {
                        margin-left: 0 !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default EmployerLayout;
