import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);

            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 28px',
            borderTop: '1px solid var(--glass-border, #E2E8F0)',
            flexWrap: 'wrap',
            gap: '16px'
        }}>
            <span style={{
                fontSize: '0.82rem',
                fontWeight: '700',
                color: 'var(--theme-text-muted, #64748B)',
                letterSpacing: '0.01em'
            }}>
                Showing <strong style={{ color: 'var(--theme-text-primary, #1E293B)' }}>{startItem}–{endItem}</strong> of <strong style={{ color: 'var(--theme-text-primary, #1E293B)' }}>{totalItems}</strong>
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {/* First */}
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    style={btnStyle(currentPage === 1)}
                    title="First page"
                >
                    <ChevronsLeft size={16} />
                </button>

                {/* Prev */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={btnStyle(currentPage === 1)}
                    title="Previous page"
                >
                    <ChevronLeft size={16} />
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((page, idx) => (
                    page === '...' ? (
                        <span key={`dots-${idx}`} style={{
                            padding: '0 6px',
                            color: 'var(--theme-text-muted, #94A3B8)',
                            fontSize: '0.85rem',
                            fontWeight: '800',
                            userSelect: 'none'
                        }}>···</span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            style={{
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '10px',
                                border: page === currentPage ? '1px solid #3E61FF' : '1px solid transparent',
                                background: page === currentPage ? 'rgba(62, 97, 255, 0.1)' : 'transparent',
                                color: page === currentPage ? '#3E61FF' : 'var(--theme-text-secondary, #64748B)',
                                fontSize: '0.85rem',
                                fontWeight: page === currentPage ? '900' : '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                fontFamily: 'var(--font-display, inherit)',
                                boxShadow: page === currentPage ? '0 4px 12px rgba(62, 97, 255, 0.15)' : 'none'
                            }}
                        >
                            {page}
                        </button>
                    )
                ))}

                {/* Next */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={btnStyle(currentPage === totalPages)}
                    title="Next page"
                >
                    <ChevronRight size={16} />
                </button>

                {/* Last */}
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    style={btnStyle(currentPage === totalPages)}
                    title="Last page"
                >
                    <ChevronsRight size={16} />
                </button>
            </div>
        </div>
    );
};

const btnStyle = (disabled) => ({
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10px',
    border: '1px solid var(--glass-border, #E2E8F0)',
    background: 'var(--theme-bg-subtle, #F8FAFC)',
    color: disabled ? 'var(--theme-text-muted, #CBD5E1)' : 'var(--theme-text-primary, #1E293B)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s',
    padding: 0
});

export default Pagination;
