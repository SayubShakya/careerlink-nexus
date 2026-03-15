import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import {
    FileText,
    Upload,
    Plus,
    Download,
    Edit2,
    Trash2,
    FileCheck,
    Loader2,
    Search,
    HardDrive,
    Layout,
    ChevronRight,
    ArrowUpRight,
    Star,
    MoreVertical,
    Clock,
    FileSearch,
    Eye
} from 'lucide-react';
import { useGetCVs, usePostUploadCV, useDeleteCV } from '@/hooks/api/cv/useCVs';
import { ROUTES } from '@/routes/routes';
import cvBanner from '@/assets/images/cv-upload-banner.jpg';

import api from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';

const MyCVs = () => {
    const { data: cvs = [], isLoading: loading } = useGetCVs();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const fileInputRef = useRef(null);

    const { mutate: uploadCV, isPending: uploading } = usePostUploadCV();
    const { mutate: deleteCV } = useDeleteCV();

    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this CV?")) return;
        deleteCV(id);
    };

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name);

        uploadCV(formData, {
            onSuccess: () => {
                e.target.value = '';
            }
        });
    };

    const handleDownload = async (id, title) => {
        try {
            const response = await api.get(`${API_ENDPOINTS.CV.DOWNLOAD(id)}?t=${Date.now()}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${title.replace(/\s+/g, '_')}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed:', err);
            toast.error('Failed to download CV');
        }
    };

    const handleView = async (id) => {
        const viewToast = toast.loading("Opening preview...");
        try {
            const response = await api.get(`${API_ENDPOINTS.CV.DOWNLOAD(id)}?t=${Date.now()}`, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
            toast.dismiss(viewToast);
        } catch (err) {
            console.error('View failed:', err);
            toast.error('Failed to view CV', { id: viewToast });
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        return date.toLocaleDateString();
    };

    const filteredCVs = Array.isArray(cvs) ? cvs.filter(cv => {
        const matchesSearch = cv.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === 'All' || cv.type === activeFilter;
        return matchesSearch && matchesFilter;
    }) : [];

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#F8FAFC' }}>
            <Loader2 className="animate-spin" size={48} color="#3E61FF" />
        </div>
    );

    return (
        <div className="premium-vault">
            <style>{`
                .premium-vault {
                    min-height: 100vh;
                    background-color: var(--bg-dashboard);
                    padding-bottom: 80px;
                    font-family: 'Inter', system-ui, sans-serif;
                    transition: background-color 0.3s;
                }

                /* GLASSMORPHIC HERO */
                .vault-hero-container {
                    padding: 40px 80px 80px;
                    background: var(--bg-main);
                    border-radius: 0 0 50px 50px;
                    margin-bottom: 60px;
                    border-bottom: 1px solid var(--border-dashboard);
                    box-shadow: var(--shadow-premium);
                }

                .vault-hero {
                    max-width: 1400px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    align-items: center;
                    gap: 60px;
                }

                .hero-content { position: relative; z-index: 1; }
                
                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    background: var(--card-dashboard);
                    border: 1px solid var(--border-dashboard);
                    border-radius: 100px;
                    font-size: 0.75rem;
                    font-weight: 800;
                    color: var(--color-brand-accent);
                    margin-bottom: 32px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
                }

                .hero-title {
                    font-size: 2.2rem;
                    font-weight: 950;
                    letter-spacing: -0.04em;
                    color: var(--text-main);
                    line-height: 1.2;
                    margin-bottom: 40px;
                }
                .hero-title span { color: var(--color-brand-accent); }

                /* STATS TRAY */
                .stats-tray {
                    display: flex;
                    gap: 32px;
                    margin-bottom: 48px;
                }

                .stat-card {
                    background: var(--card-dashboard);
                    padding: 24px 32px;
                    border-radius: 24px;
                    box-shadow: var(--shadow-premium);
                    border: 1px solid var(--border-dashboard);
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    min-width: 180px;
                    transition: 0.3s;
                }
                .stat-card:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(62, 97, 255, 0.1); }
                .stat-card .lbl { font-size: 0.75rem; font-weight: 850; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.1em; }
                .stat-card.platform .lbl { color: #6366F1; }
                .stat-card.uploaded .lbl { color: #10B981; }
                .stat-card .val { font-size: 2.2rem; font-weight: 950; color: var(--text-main); letter-spacing: -0.02em; }

                /* FLOATING IMAGE */
                .image-frame {
                    position: relative;
                    display: flex;
                    justify-content: flex-end;
                }
                .banner-img {
                    width: 100%;
                    max-width: 580px;
                    height: auto;
                    border-radius: 32px;
                    box-shadow: var(--shadow-premium);
                    transition: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .banner-img:hover { transform: rotate(-1deg) scale(1.02); }

                /* SEARCH & ACTIONS */
                .hub-controls {
                    display: flex;
                    gap: 20px;
                    align-items: center;
                    background: var(--card-dashboard);
                    padding: 12px;
                    border-radius: 24px;
                    box-shadow: var(--shadow-premium);
                    border: 1px solid var(--border-dashboard);
                    max-width: 800px;
                }

                .search-input-group {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 0 20px;
                    border-right: 1px solid var(--border-dashboard);
                }
                .search-input-group input {
                    border: none;
                    outline: none;
                    width: 100%;
                    background: transparent;
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--text-main);
                }

                .action-btns { display: flex; gap: 12px; }
                .p-btn {
                    padding: 14px 28px;
                    border-radius: 16px;
                    font-weight: 850;
                    font-size: 0.9rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transition: 0.2s;
                    border: none;
                }
                .btn-upload { background: var(--bg-dashboard); color: var(--text-main); border: 1.5px solid var(--border-dashboard); }
                .btn-create { background: var(--color-brand-accent); color: white; box-shadow: 0 8px 20px rgba(62, 97, 255, 0.3); }
                .p-btn:hover { transform: translateY(-3px); filter: brightness(1.05); }

                /* FILTER & CONTENT */
                .vault-main { padding: 0 80px; max-width: 1400px; margin: 0 auto; }
                
                .filter-tabs {
                    display: flex;
                    gap: 32px;
                    border-bottom: 2px solid var(--border-dashboard);
                    margin-bottom: 48px;
                }
                .tab-item {
                    padding: 16px 8px;
                    font-size: 0.9rem;
                    font-weight: 850;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    cursor: pointer;
                    color: var(--text-light);
                    position: relative;
                    transition: 0.2s;
                }
                .tab-item.active { color: var(--text-main); }
                .tab-item.active::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: var(--color-brand-accent);
                    border-radius: 10px;
                }

                /* ASSET GRID */
                .asset-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                    gap: 32px;
                }

                .asset-card {
                    background: var(--card-dashboard);
                    border: 1px solid var(--border-dashboard);
                    border-radius: 30px;
                    padding: 32px;
                    transition: 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                    position: relative;
                    display: flex;
                    flex-direction: column;
                }
                .asset-card:hover {
                    transform: translateY(-12px);
                    box-shadow: var(--shadow-premium);
                    border-color: var(--color-brand-accent);
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 24px;
                }
                .type-badge.platform { background: #EEF2FF; color: #4338CA; border: 1px solid #C7D2FE; }
                .type-badge.uploaded { background: #ECFDF5; color: #047857; border: 1px solid #A7F3D0; }
                
                .asset-card:hover .type-badge { transform: scale(1.05); }

                .icon-container {
                    width: 64px;
                    height: 64px;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 24px;
                    transition: 0.3s;
                }
                .icon-container.platform { background: #F5F3FF; color: #6D28D9; }
                .icon-container.uploaded { background: #F0FDF4; color: #16A34A; }
                
                .asset-card:hover .icon-container { background: var(--color-brand-accent); color: white; transform: rotate(5deg); }

                .asset-title { font-size: 1.35rem; font-weight: 950; color: var(--text-main); margin: 0 0 10px 0; letter-spacing: -0.03em; }
                .asset-info { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-light); font-weight: 600; }

                .card-actions {
                    margin-top: 40px;
                    padding-top: 24px;
                    border-top: 1.5px solid var(--border-dashboard);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .action-pill {
                    display: flex;
                    gap: 8px;
                }
                .circle-btn {
                    width: 44px;
                    height: 44px;
                    border-radius: 14px;
                    background: var(--bg-dashboard);
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-muted);
                    cursor: pointer;
                    transition: 0.2s;
                }
                .circle-btn:hover { background: var(--text-main); color: var(--bg-main); }
                .circle-btn.delete:hover { background: var(--color-danger); color: white; }

                .final-status {
                    padding: 8px 16px;
                    background: rgba(62, 97, 255, 0.1);
                    color: var(--color-brand-accent);
                    border-radius: 10px;
                    font-size: 0.75rem;
                    font-weight: 950;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>

            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".pdf,.doc,.docx" onChange={handleUpload} />

            {/* PREMIUM HERO SECTION */}
            <div className="vault-hero-container">
                <div className="vault-hero">
                    <div className="hero-content">

                        <h1 className="hero-title">My <span>CV</span> Storage</h1>

                        <div className="stats-tray">
                            <div className="stat-card platform">
                                <span className="lbl">Made Here</span>
                                <span className="val">{cvs.filter(c => c.type === 'platform').length}</span>
                            </div>
                            <div className="stat-card uploaded">
                                <span className="lbl">Uploaded</span>
                                <span className="val">{cvs.filter(c => c.type === 'uploaded').length}</span>
                            </div>
                        </div>

                        <div className="hub-controls">
                            <div className="search-input-group">
                                <Search size={22} color="#CBD5E1" />
                                <input
                                    type="text"
                                    placeholder="Search CVs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="action-btns">
                                <button className="p-btn btn-upload" onClick={() => fileInputRef.current.click()} disabled={uploading}>
                                    {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                                    Upload PDF
                                </button>
                                <button className="p-btn btn-create" onClick={() => window.location.href = ROUTES.CV_BUILDER}>
                                    <Plus size={18} /> Create New
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="image-frame">
                        <img src={cvBanner} alt="Storage Illustration" className="banner-img" />
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="vault-main">
                <div className="filter-tabs">
                    <div className={`tab-item ${activeFilter === 'All' ? 'active' : ''}`} onClick={() => setActiveFilter('All')}>All CVs</div>
                    <div className={`tab-item ${activeFilter === 'platform' ? 'active' : ''}`} onClick={() => setActiveFilter('platform')}>Created Here</div>
                    <div className={`tab-item ${activeFilter === 'uploaded' ? 'active' : ''}`} onClick={() => setActiveFilter('uploaded')}>Uploaded Files</div>
                </div>

                <div className="asset-grid">
                    {filteredCVs.map((cv) => (
                        <div key={cv.id} className="asset-card">
                            <div className="card-header">
                                <div className={`type-badge ${cv.type}`}>
                                    {cv.type === 'platform' ? <><Layout size={12} /> Created Here</> : <><HardDrive size={12} /> Uploaded</>}
                                </div>
                                <div style={{ color: '#E2E8F0', cursor: 'pointer' }}><MoreVertical size={20} /></div>
                            </div>

                            <div className={`icon-container ${cv.type}`}>
                                {cv.type === 'platform' ? <FileCheck size={32} /> : <FileText size={32} />}
                            </div>

                            <h3 className="asset-title">{cv.title}</h3>
                            <div className="asset-info">
                                <Clock size={14} /> Updated {formatDate(cv.updated_at)}
                            </div>

                            <div className="card-actions">
                                <div className="action-pill">
                                    <button className="circle-btn" title="View CV" onClick={() => handleView(cv.id)}>
                                        <Eye size={18} />
                                    </button>
                                    <button className="circle-btn" title="Download" onClick={() => handleDownload(cv.id, cv.title)}>
                                        <Download size={18} />
                                    </button>
                                    {cv.type === 'platform' && (
                                        <button className="circle-btn" title="Edit" onClick={() => window.location.href = `${ROUTES.CV_BUILDER}?id=${cv.id}`}>
                                            <Edit2 size={18} />
                                        </button>
                                    )}
                                    <button className="circle-btn delete" title="Delete" onClick={() => handleDelete(cv.id)}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="final-status">
                                    FINAL <ChevronRight size={14} />
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* EMPTY STATE - REFINED */}
                    {filteredCVs.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', padding: '120px 0', textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                                <div style={{ width: '80px', height: '80px', background: '#F8FAFC', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #E2E8F0', color: '#94A3B8' }}>
                                    <FileSearch size={32} />
                                </div>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A' }}>No items found</h2>
                                <p style={{ color: '#64748B', maxWidth: '300px', fontWeight: 600 }}>Try adjusting your filters or upload a new PDF to get started.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default MyCVs;
