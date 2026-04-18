/**
 * API Configuration
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login/',
    REGISTER: '/auth/register/',
    LOGOUT: '/auth/logout/',
    REFRESH: '/auth/refresh/',
    ME: '/auth/me/',
    PROFILE: '/auth/profile/',
    PASSWORD_RESET_REQUEST: '/auth/password-reset-request/',
    PASSWORD_RESET: '/auth/password-reset/',
  },
  PROJECTS: {
    LIST: '/projects/',
    CREATE: '/projects/',
    DETAIL: (id) => `/projects/${id}/`,
    UPDATE: (id) => `/projects/${id}/`,
    DELETE: (id) => `/projects/${id}/`,
  },
  SKILLS: {
    LIST: '/skills/',
    CREATE: '/skills/',
    UPDATE: (id) => `/skills/${id}/`,
    DELETE: (id) => `/skills/${id}/`,
  },
  ARTICLES: {
    LIST: '/articles/',
    CREATE: '/articles/',
    DETAIL: (id) => `/articles/${id}/`,
    UPDATE: (id) => `/articles/${id}/`,
    DELETE: (id) => `/articles/${id}/`,
  },
}

/**
 * User Roles
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
}

/**
 * Route Paths
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  DASHBOARD_PROJECTS: '/dashboard/projects',
  DASHBOARD_SKILLS: '/dashboard/skills',
  DASHBOARD_PROFILE: '/dashboard/profile',
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_CONTENT: '/admin/content',
  ADMIN_ANALYTICS: '/admin/analytics',
  NOT_FOUND: '*',
}

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
}

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORD_MISMATCH: 'Passwords do not match.',
  PASSWORD_TOO_WEAK: 'Password is too weak.',
}

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  LOGIN: 'Logged in successfully!',
  LOGOUT: 'Logged out successfully!',
  REGISTRATION: 'Registration successful!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PROJECT_CREATED: 'Project created successfully!',
  PROJECT_UPDATED: 'Project updated successfully!',
  PROJECT_DELETED: 'Project deleted successfully!',
}

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'auth_user',
  THEME: 'theme_preference',
}

/**
 * Regex Patterns
 */
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
  URL: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
}

/**
 * Pagination
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [10, 25, 50, 100],
}

/**
 * Timeout Values (in milliseconds)
 */
export const TIMEOUTS = {
  TOAST: 3000,
  DEBOUNCE: 500,
  API_REQUEST: 10000,
}
