import React from 'react';
import { Link2 } from 'lucide-react';

/**
 * Premium CareerLink Logo Component
 * @param {string} className - Additional CSS classes
 * @param {string} variant - 'full' (icon + text) or 'icon' (icon only)
 * @param {string} theme - 'light' (dark text) or 'dark' (white text)
 */
const Logo = ({ className = '', variant = 'full', theme = 'light' }) => {
    // Colors
    const primaryColor = '#3E61FF';
    const textColor = theme === 'dark' ? '#FFFFFF' : '#0F172A';

    const logoIcon = (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, boxShadow: '0 4px 10px rgba(62, 97, 255, 0.3)', borderRadius: '10px' }}>
            <rect width="36" height="36" rx="10" fill="url(#brandGradOuter)" />
            {/* The 'C' and 'L' stylized infinity link */}
            <path d="M22 13H15C12.7909 13 11 14.7909 11 17C11 19.2091 12.7909 21 15 21H18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 23H21C23.2091 23 25 21.2091 25 19C25 16.7909 23.2091 15 21 15H18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Connecting dot point */}
            <circle cx="21" cy="15" r="3.5" fill="#6EE7B7" />
            <circle cx="15" cy="21" r="2.5" fill="#F472B6" />
            <defs>
                <linearGradient id="brandGradOuter" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3E61FF"/>
                    <stop offset="1" stopColor="#8B5CF6"/>
                </linearGradient>
            </defs>
        </svg>
    );

    return (
        <div className={`flex items-center gap-3 ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            {logoIcon}

            {variant === 'full' && (
                <div className="logo-text" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                    <span style={{
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: textColor,
                        letterSpacing: '-0.02em',
                        fontFamily: "'Inter', sans-serif"
                    }}>
                        Career<span style={{ color: primaryColor }}>Link</span>
                    </span>
                    <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        color: theme === 'dark' ? 'rgba(255,255,255,0.6)' : '#64748B',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        marginTop: '2px',
                        marginLeft: '1px'
                    }}>
                        NEXUS
                    </span>
                </div>
            )}
        </div>
    );
};

export default Logo;
