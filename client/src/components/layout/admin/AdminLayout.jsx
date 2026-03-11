import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/routes/routes';

const AdminLayout = () => {
    const { isAuthenticated } = useAuth();
    const userRole = localStorage.getItem('role');

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    if (!isAuthenticated() || userRole !== 'admin') {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: '#F8FAFC',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        }}>
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div
                style={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    marginLeft: isSidebarOpen ? '260px' : '80px'
                }}
                className="admin-main-area"
            >
                <main style={{ flexGrow: 1, padding: '0', width: '100%' }}>
                    <Outlet />
                </main>
            </div>

            <style>{`
                @media (max-width: 1023px) {
                    .admin-main-area {
                        margin-left: 0 !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminLayout;
