import React, { createContext, useState, useEffect, useMemo } from 'react';
import { STORAGE_KEYS, THEME_MODES } from '@/config/constants';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Get user from localStorage to determine the specific theme key
    const getUser = () => {
        try {
            const user = localStorage.getItem(STORAGE_KEYS.USER_DATA);
            return user ? JSON.parse(user) : null;
        } catch (e) {
            return null;
        }
    };

    const user = getUser();
    const userId = user?.id || user?.user_id;

    // Each user gets their own theme entry in localStorage
    const themeKey = userId ? `theme_${userId}` : STORAGE_KEYS.THEME;

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem(themeKey) || THEME_MODES.LIGHT;
    });

    // Handle theme switching when the user context changes (login/logout)
    useEffect(() => {
        const savedTheme = localStorage.getItem(themeKey);
        if (savedTheme && savedTheme !== theme) {
            setTheme(savedTheme);
        } else if (!savedTheme) {
            // Default to light for new/unset users
            setTheme(THEME_MODES.LIGHT);
        }
    }, [themeKey]);

    // Save theme to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem(themeKey, theme);
    }, [theme, themeKey]);

    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
    };

    const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
