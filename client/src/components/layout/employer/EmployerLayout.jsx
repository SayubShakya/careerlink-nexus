import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import EmployerNavbar from './EmployerNavbar';
import Footer from '../Footer';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/routes/routes';
import { useTheme } from '@/hooks/useTheme';
import { THEME_MODES } from '@/config/constants';

const EmployerLayout = () => {
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

    // Safety check: if user is not an employer, redirect to login
    if (!isAuthenticated() || userRole !== 'employer') {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-dashboard)' }}>
            <EmployerNavbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default EmployerLayout;
