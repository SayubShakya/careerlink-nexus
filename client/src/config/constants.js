// Application-wide constants

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Local Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'userToken',
    USER_DATA: 'user',
    THEME: 'nexus-theme',
};

// User Roles
export const USER_ROLES = {
    JOB_SEEKER: 'job_seeker',
    EMPLOYER: 'employer',
    ADMIN: 'admin',
};

// Application Status
export const APPLICATION_STATUS = {
    PENDING: 'Pending',
    REVIEWING: 'Reviewing',
    ACCEPTED: 'Accepted',
    REJECTED: 'Rejected',
    INTERVIEW: 'Interview',
};

// Theme Modes
export const THEME_MODES = {
    LIGHT: 'light',
    DARK: 'dark',
};

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
};

// File Upload
export const FILE_UPLOAD = {
    MAX_SIZE_MB: 5,
    ALLOWED_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx'],
};

// Validation Rules
export const VALIDATION = {
    PASSWORD_MIN_LENGTH: 8,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
};

// Toast Configuration
export const TOAST_CONFIG = {
    POSITION: 'top-right',
    AUTO_CLOSE: 3000,
    HIDE_PROGRESS_BAR: false,
};
