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
        <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3E61FF 0%, #8B5CF6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(62, 97, 255, 0.3)',
            flexShrink: 0
        }}>
            <Link2 size={22} color="white" strokeWidth={2.5} style={{ transform: 'rotate(-45deg)' }} />
        </div>
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
