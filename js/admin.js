// js/admin.js

import { API_BASE_URL } from './config.js';

/**
 * Retrieves the user's role from the JWT token.
 * @param {string} token - The JWT token.
 * @returns {string|null} - The user role or null if not found.
 */
function getUserRoleFromToken(token) {
    if (!token) return null;
    try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = atob(payloadBase64);
        const payload = JSON.parse(decodedPayload);
        return payload.role;
    } catch (error) {
        console.error('Token parsing error:', error);
        return null;
    }
}

/**
 * Sets up the admin UI by initializing necessary components.
 */
function setupAdminUI() {
    // Initialize admin-specific UI components here
    console.log('Admin UI setup complete.');
}

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (!token) {
        // Redirect to login if not logged in
        window.location.href = 'login.html';
        return;
    }

    const userRole = getUserRoleFromToken(token);

    if (userRole !== 'admin') {
        // Redirect to homepage or show an error message
        alert('Access denied. Admins only.');
        window.location.href = 'index.html';
    } else {
        // Load admin functionalities
        setupAdminUI();
    }
});
