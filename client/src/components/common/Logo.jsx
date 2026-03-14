import React from 'react';
import logoImg from '@assets/images/CareerLink-Logo.png';

/**
 * Premium CareerLink Logo Component
 * @param {string} className - Additional CSS classes
 * @param {string} variant - 'full' (icon + text) or 'icon' (icon only)
 * @param {string} theme - 'light' (dark text) or 'dark' (white text)
 */
const Logo = ({ className = '', variant = 'full', theme = 'light' }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img 
                src={logoImg} 
                alt="CareerLink"
                style={{
                    height: variant === 'full' ? '45px' : '36px',
                    objectFit: 'contain',
                    mixBlendMode: theme === 'dark' ? 'normal' : 'multiply'
                }}
            />
        </div>
    );
};

export default Logo;
