// js/contact.js

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

document.getElementById('contactForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = sanitizeInput(document.getElementById('name').value.trim());
    const email = sanitizeInput(document.getElementById('email').value.trim());
    const message = sanitizeInput(document.getElementById('message').value.trim());
    const responseDiv = document.getElementById('form-response');

    // Input validation
    if (!name || !email || !message) {
        displayResponse(responseDiv, 'Please fill in all fields.', 'danger');
        return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        displayResponse(responseDiv, 'Please enter a valid email address.', 'danger');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message }),
        });

        const result = await response.json();
        if (response.ok) {
            displayResponse(responseDiv, result.message || 'Your message has been sent successfully!', 'success');
            document.getElementById('contactForm').reset();
        } else {
            displayResponse(responseDiv, result.message || 'Failed to send message. Please try again.', 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        displayResponse(responseDiv, 'An error occurred. Please check your network connection and try again.', 'danger');
    }
});

/**
 * Displays a response message to the user.
 * @param {HTMLElement} element - The DOM element to display the message in.
 * @param {string} message - The message to display.
 * @param {string} type - The Bootstrap alert type (e.g., 'success', 'danger').
 */
function displayResponse(element, message, type) {
    if (element) {
        element.style.display = 'block';
        element.className = ''; // Reset classes
        element.textContent = message;
        element.classList.add('alert', `alert-${type}`);
    }
}
