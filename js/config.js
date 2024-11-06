// js/config.js

/**
 * Determines the API base URL based on the current environment.
 * @returns {string} - The API base URL.
 */
export const API_BASE_URL = window.location.origin.includes('localhost')
    ? 'http://localhost:5000/api'
    : 'https://your-production-api.com/api';

/**
 * Defines the authentication cookie name.
 */
export const AUTH_COOKIE_NAME = 'session_token';

/**
 * Defines the authentication cookie options.
 */
export const AUTH_COOKIE_OPTIONS = {
    secure: window.location.protocol === 'https:', // Secure only in production
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
};
