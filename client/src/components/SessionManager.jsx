import { useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';

const SESSION_DURATION_MS = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
const WARNING_BEFORE_MS = 5 * 60 * 1000; // Show warning 5 minutes before expiry

/**
 * SessionManager - Automatically logs the user out after 1 hour.
 * 
 * How it works:
 * 1. On login, `loginTimestamp` is saved to localStorage.
 * 2. This component checks the remaining time on mount and sets timers.
 * 3. A warning toast is shown 5 minutes before expiry.
 * 4. When the session expires, localStorage is cleared and user is redirected to /login.
 * 5. It also listens for storage events so all tabs log out together.
 */
const SessionManager = () => {
    const warningTimerRef = useRef(null);
    const logoutTimerRef = useRef(null);
    const hasWarnedRef = useRef(false);

    const performLogout = useCallback(() => {
        // Clear all auth data
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('loginTimestamp');

        toast.error('Your session has expired. Please log in again.', {
            duration: 5000,
            icon: '⏰',
        });

        // Small delay so the toast is visible before redirect
        setTimeout(() => {
            window.location.href = '/login';
        }, 1000);
    }, []);

    const clearTimers = useCallback(() => {
        if (warningTimerRef.current) {
            clearTimeout(warningTimerRef.current);
            warningTimerRef.current = null;
        }
        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = null;
        }
    }, []);

    const setupTimers = useCallback(() => {
        clearTimers();
        hasWarnedRef.current = false;

        const token = localStorage.getItem('userToken');
        const loginTimestamp = localStorage.getItem('loginTimestamp');

        // No token or no timestamp means not logged in
        if (!token || !loginTimestamp) return;

        const loginTime = parseInt(loginTimestamp, 10);
        const now = Date.now();
        const elapsed = now - loginTime;
        const remaining = SESSION_DURATION_MS - elapsed;

        // Session already expired
        if (remaining <= 0) {
            performLogout();
            return;
        }

        // Set warning timer (5 minutes before expiry)
        const warningIn = remaining - WARNING_BEFORE_MS;
        if (warningIn > 0) {
            warningTimerRef.current = setTimeout(() => {
                if (!hasWarnedRef.current) {
                    hasWarnedRef.current = true;
                    toast('Your session will expire in 5 minutes.', {
                        duration: 10000,
                        icon: '⚠️',
                        style: {
                            background: '#FEF3C7',
                            color: '#92400E',
                            border: '1px solid #F59E0B',
                        },
                    });
                }
            }, warningIn);
        } else if (!hasWarnedRef.current) {
            // Less than 5 min remaining, show warning immediately
            hasWarnedRef.current = true;
            const minsLeft = Math.ceil(remaining / 60000);
            toast(`Your session will expire in ${minsLeft} minute${minsLeft !== 1 ? 's' : ''}.`, {
                duration: 10000,
                icon: '⚠️',
                style: {
                    background: '#FEF3C7',
                    color: '#92400E',
                    border: '1px solid #F59E0B',
                },
            });
        }

        // Set logout timer
        logoutTimerRef.current = setTimeout(() => {
            performLogout();
        }, remaining);

    }, [clearTimers, performLogout]);

    useEffect(() => {
        setupTimers();

        // Listen for storage changes (handles multi-tab logout & new logins)
        const handleStorageChange = (e) => {
            if (e.key === 'userToken' && !e.newValue) {
                // Token was removed in another tab
                clearTimers();
                window.location.href = '/login';
            } else if (e.key === 'loginTimestamp' && e.newValue) {
                // New login in another tab — reset timers
                setupTimers();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Also re-check on visibility change (e.g. user comes back to tab after being away)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                const token = localStorage.getItem('userToken');
                const loginTimestamp = localStorage.getItem('loginTimestamp');
                if (token && loginTimestamp) {
                    const elapsed = Date.now() - parseInt(loginTimestamp, 10);
                    if (elapsed >= SESSION_DURATION_MS) {
                        performLogout();
                    } else {
                        setupTimers(); // Recalculate timers
                    }
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearTimers();
            window.removeEventListener('storage', handleStorageChange);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [setupTimers, clearTimers, performLogout]);

    return null; // This component renders nothing
};

export default SessionManager;
