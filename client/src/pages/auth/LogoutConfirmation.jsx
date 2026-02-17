import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePostLogout from '@/hooks/api/auth/usePostLogout';
import { ROUTES } from '@/routes/routes';
import { LogOut } from 'lucide-react';

const LogoutConfirmation = () => {
    const navigate = useNavigate();
    const { mutate: logout, isPending: loading } = usePostLogout();

    const handleConfirmLogout = () => {
        logout();
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="logout-overlay">
            <style>{`
                .logout-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(248, 250, 252, 0.95);
                    backdrop-filter: blur(8px);
                    z-index: 9999; /* HIGHEST Z-INDEX TO COVER NAVBAR */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Inter', sans-serif;
                }

                .logout-card {
                    background: white;
                    border-radius: 32px;
                    padding: 48px;
                    width: 100%;
                    max-width: 480px;
                    text-align: center;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
                    border: 1px solid rgba(226, 232, 240, 0.8);
                    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .icon-wrapper {
                    width: 80px;
                    height: 80px;
                    background: #FEF2F2;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 24px;
                    color: #EF4444;
                    box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.1);
                }

                .logout-title {
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: #1E293B;
                    margin-bottom: 12px;
                    letter-spacing: -0.02em;
                }

                .logout-message {
                    color: #64748B;
                    font-size: 1rem;
                    line-height: 1.6;
                    margin-bottom: 40px;
                }

                .btn-group {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .btn-logout {
                    width: 100%;
                    padding: 16px;
                    background: #EF4444;
                    color: white;
                    border: none;
                    border-radius: 16px;
                    font-weight: 700;
                    font-size: 1rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.2s;
                    box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.2);
                }
                .btn-logout:hover {
                    background: #DC2626;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.3);
                }

                .btn-cancel {
                    width: 100%;
                    padding: 16px;
                    background: white;
                    color: #64748B;
                    border: 2px solid #E2E8F0;
                    border-radius: 16px;
                    font-weight: 700;
                    font-size: 1rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.2s;
                }
                .btn-cancel:hover {
                    background: #F8FAFC;
                    color: #1E293B;
                    border-color: #CBD5E1;
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="logout-card">
                <div className="icon-wrapper">
                    <LogOut size={36} strokeWidth={2.5} />
                </div>

                <h2 className="logout-title">Signing Out?</h2>
                <p className="logout-message">
                    You are about to end your secure session.<br />
                    Come back soon!
                </p>

                <div className="btn-group">
                    <button
                        className="btn-logout"
                        onClick={handleConfirmLogout}
                        disabled={loading}
                    >
                        {loading ? 'Signing Out...' : 'Yes, Sign Out'}
                    </button>

                    <button
                        className="btn-cancel"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Stay Logged In
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutConfirmation;
