import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import JobseekerNavbar from './JobseekerNavbar';
import Footer from '../Footer';
import { useTheme } from '@/hooks/useTheme';
import { THEME_MODES } from '@/config/constants';
import { ROUTES } from '@/routes/routes';
import { useAuth } from '@/hooks/useAuth';

const JobseekerLayout = () => {
    const { theme } = useTheme();
    const { isAuthenticated } = useAuth();
    const userRole = localStorage.getItem('role');

    useEffect(() => {
        const root = document.documentElement;
        if (theme === THEME_MODES.DARK) {
            root.classList.add('dark-theme');
        } else {
            root.classList.remove('dark-theme');
        }

        // Cleanup: remove dark theme when leaving dashboard sections
        return () => {
            root.classList.remove('dark-theme');
        };
    }, [theme]);

    // Safety check: if user is not a job seeker, redirect to login
    if (!isAuthenticated() || userRole !== 'job_seeker') {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-dashboard)' }}>
            <JobseekerNavbar />
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default JobseekerLayout;
