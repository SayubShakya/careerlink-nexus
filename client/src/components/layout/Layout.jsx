import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
    useEffect(() => {
        // Ensure public pages are always in light mode
        document.documentElement.classList.remove('dark-theme');
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-grow" style={{ paddingTop: 'var(--header-height)', backgroundColor: 'white' }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
