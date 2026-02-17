import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import EmployerNavbar from './EmployerNavbar';
import Footer from '../Footer';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/routes/routes';

const EmployerLayout = () => {
    const { isAuthenticated } = useAuth();
    const userRole = localStorage.getItem('role');

    // Safety check: if user is not an employer, redirect to login
    if (!isAuthenticated() || userRole !== 'employer') {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <EmployerNavbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default EmployerLayout;
