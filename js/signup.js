// js/signup.js

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
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = sanitizeInput(document.getElementById('username').value.trim());
            const email = sanitizeInput(document.getElementById('email').value.trim());
            const password = document.getElementById('password').value;
            const adminSecret = document.getElementById('adminSecret')?.value.trim();

            // Input validation
            if (!username || !email || !password) {
                alert('Please fill in all required fields.');
                return;
            }

            // Basic email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Password strength validation (minimum 6 characters)
            if (password.length < 6) {
                alert('Password must be at least 6 characters long.');
                return;
            }

            const newUser = { username, email, password };
            if (adminSecret) newUser.adminSecret = adminSecret;

            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to sign up.');
                }

                const data = await response.json();
                alert('Signup successful! Please log in.');
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Signup Error:', error);
                alert(error.message || 'An error occurred during signup.');
            }
        });
    }
});
