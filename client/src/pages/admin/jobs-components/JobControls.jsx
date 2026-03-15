import React from 'react';
import { Search, X, Filter, SortAsc } from 'lucide-react';

const JobControls = ({ search, setSearch, filter, setFilter, sortBy, setSortBy, setPage }) => (
    <div className="jb-controls-panel">
        <div className="jb-search-box">
            <Search size={20} className="jb-search-icon" />
            <input
                type="text"
                className="jb-search-input"
                placeholder="Find a job, boss, or city..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
            {search && <button className="jb-clear-search" onClick={() => setSearch('')}><X size={14} /></button>}
        </div>

        <div className="jb-filter-bar">
            <div className="jb-filter-section">
                <span className="jb-filter-label"><Filter size={14} /> Status</span>
                <div className="jb-filter-options">
                    <button className={`jb-filter-opt ${filter === 'all' ? 'on' : ''}`} onClick={() => setFilter('all')}>All</button>
                    <button className={`jb-filter-opt ${filter === 'active' ? 'on' : ''}`} onClick={() => setFilter('active')}>Active</button>
                    <button className={`jb-filter-opt ${filter === 'inactive' ? 'on' : ''}`} onClick={() => setFilter('inactive')}>Stopped</button>
                </div>
            </div>

            <div className="jb-filter-section">
                <span className="jb-filter-label"><SortAsc size={14} /> Sort</span>
                <select className="jb-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="recent">Newest Job</option>
                    <option value="views">Most Looked At</option>
                    <option value="apps">Most Applied</option>
                    <option value="salary">Most Money</option>
                </select>
            </div>
        </div>
    </div>
);

export default JobControls;
