export const getCompanyColor = (name) => {
    const colors = [
        { bg: '#EEF2FF', color: '#6366F1', grad: 'linear-gradient(135deg, #6366F1, #818CF8)', shadow: 'rgba(99, 102, 241, 0.2)' },
        { bg: '#ECFDF5', color: '#10B981', grad: 'linear-gradient(135deg, #10B981, #34D399)', shadow: 'rgba(16, 185, 129, 0.2)' },
        { bg: '#FEF3C7', color: '#F59E0B', grad: 'linear-gradient(135deg, #F59E0B, #FBBF24)', shadow: 'rgba(245, 158, 11, 0.2)' },
        { bg: '#FCE7F3', color: '#EC4899', grad: 'linear-gradient(135deg, #EC4899, #F472B6)', shadow: 'rgba(236, 72, 153, 0.2)' },
        { bg: '#E0E7FF', color: '#4F46E5', grad: 'linear-gradient(135deg, #4F46E5, #6366F1)', shadow: 'rgba(79, 70, 229, 0.2)' },
        { bg: '#CFFAFE', color: '#06B6D4', grad: 'linear-gradient(135deg, #06B6D4, #22D3EE)', shadow: 'rgba(6, 182, 212, 0.2)' },
    ];
    const idx = (name || '?').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[idx];
};

export const getJobTypeBadge = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('full')) return { label: 'Full-time', bg: 'rgba(16, 185, 129, 0.1)', color: '#059669', border: 'rgba(16, 185, 129, 0.2)' };
    if (t.includes('part')) return { label: 'Part-time', bg: 'rgba(245, 158, 11, 0.1)', color: '#D97706', border: 'rgba(245, 158, 11, 0.2)' };
    if (t.includes('contract')) return { label: 'Contract', bg: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED', border: 'rgba(124, 58, 237, 0.2)' };
    if (t.includes('intern')) return { label: 'Internship', bg: 'rgba(236, 72, 153, 0.1)', color: '#DB2777', border: 'rgba(236, 72, 153, 0.2)' };
    if (t.includes('remote')) return { label: 'Remote', bg: 'rgba(79, 70, 229, 0.1)', color: '#4338CA', border: 'rgba(79, 70, 229, 0.2)' };
    return { label: type || 'N/A', bg: '#F3F4F6', color: '#6B7280', border: '#E5E7EB' };
};

export const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Recently';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
