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
        sm: { icon: '30px', text: '1rem' },
        md: { icon: '38px', text: '1.3rem' },
        lg: { icon: '52px', text: '1.8rem' },
    };

    const s = sizes[size] || sizes.md;

    return (
        <div className={className} style={{ display: 'flex', alignItems: 'center', gap: '2px', textDecoration: 'none' }}>
            <div style={{
                width: s.icon,
                height: s.icon,
                overflow: 'hidden',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <img
                    src={logoImg}
                    alt="CareerLink"
                    style={{
                        width: '180%',
                        height: '180%',
                        objectFit: 'contain',
                        filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'none'
                    }}
                />
            </div>
            {variant === 'full' && (
                <span style={{
                    fontSize: s.text,
                    fontWeight: 800,
                    color: textColor,
                    letterSpacing: '-0.03em',
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
