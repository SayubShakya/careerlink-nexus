import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const JobPagination = ({ page, setPage, totalPages }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="jb-pagination-wrap">
            <button className="jb-pg-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                <ChevronLeft size={16} />
            </button>
            <div className="jb-pg-list">
                {[...Array(totalPages)].map((_, i) => (
                    <button 
                        key={i} 
                        className={`jb-pg-item ${page === i + 1 ? 'on' : ''}`} 
                        onClick={() => setPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
            <button className="jb-pg-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                <ChevronRight size={16} />
            </button>
        </div>
    );
};

export default JobPagination;
