// js/login.js

import { API_BASE_URL } from './config.js';

/**
 * Sanitizes user input to prevent XSS attacks.
 * @param {string} input - The user input string.
 * @returns {string} - The sanitized string.
 */
function sanitizeInput(input) {
    const element = document.createElement('div');
    element.textContent = input;
    return element.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = sanitizeInput(document.getElementById('loginEmail').value.trim());
            const password = document.getElementById('loginPassword').value;

            // Input validation
            if (!email || !password) {
                alert('Please enter both email and password.');
                return;
            }

            // Basic email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Login failed.');
                }

                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('userRole', data.user.role);

                alert('Login successful!');
                window.location.href = 'index.html'; // Redirect to update navigation links
            } catch (error) {
                console.error('Login Error:', error);
                alert(error.message || 'An error occurred during login.');
            }
        });
    }
});
