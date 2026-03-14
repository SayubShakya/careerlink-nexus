import React from 'react';
import logoImg from '@assets/images/CareerLink-Logo.png';

/**
 * CareerLink Logo Component
 * @param {string} className - Additional CSS classes
 * @param {string} variant - 'full' (icon + text) or 'icon' (icon only)
 * @param {string} theme - 'light' (dark text) or 'dark' (white text)
 * @param {string} size - 'sm', 'md', 'lg' for different sizes
 */
const Logo = ({ className = '', variant = 'full', theme = 'light', size = 'md' }) => {
    const textColor = theme === 'dark' ? '#FFFFFF' : '#0F172A';

    const sizes = {
        sm: { icon: '32px', text: '1.1rem' },
        md: { icon: '42px', text: '1.4rem' },
        lg: { icon: '56px', text: '1.8rem' },
    };

    const s = sizes[size] || sizes.md;

    return (
        <div className={className} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <img
                src={logoImg}
                alt="CareerLink"
                style={{
                    height: s.icon,
                    width: 'auto',
                    objectFit: 'contain',
                    filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'none'
                }}
            />
            {variant === 'full' && (
                <span style={{
                    fontSize: s.text,
                    fontWeight: 800,
                    color: textColor,
                    letterSpacing: '-0.02em',
                    fontFamily: "'Inter', sans-serif",
                    whiteSpace: 'nowrap'
                }}>
                    Career<span style={{ color: '#3E61FF' }}>Link</span>
                </span>
            )}
        </div>
    );
};

export default Logo;
