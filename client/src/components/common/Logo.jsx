import React from 'react';
import logoImg from '@assets/images/careerlink_logo.png';

/**
 * Premium CareerLink Logo Component
 * @param {string} className - Additional CSS classes
 * @param {string} variant - 'full' (icon + text) or 'icon' (icon only)
 * @param {string} theme - 'light' (dark text) or 'dark' (white text)
 */
const Logo = ({ className = '', variant = 'full', theme = 'light' }) => {
    // Colors
    const primaryColor = '#3E61FF';
    const secondaryColor = '#8B5CF6';
    const textColor = theme === 'dark' ? '#FFFFFF' : '#0F172A';

    return (
        <div className={`flex items-center gap-3 ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img 
                src={logoImg} 
                alt="CareerLink Logo" 
                style={{ height: '40px', objectFit: 'contain' }}
            />

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
