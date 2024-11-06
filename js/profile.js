// js/profile.js

import { API_BASE_URL } from './config.js';

/**
 * ProfileManager class handles user profile operations including loading,
 * updating, and validating profile data.
 */
class ProfileManager {
    constructor() {
        this.token = localStorage.getItem('token');
        if (!this.token) {
            this.redirectToLogin('Please log in to view your profile.');
            return;
        }
        this.setupEventListeners();
    }

    /**
     * Sets up necessary event listeners for profile interactions.
     */
    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.loadProfile();
            this.setupFormListeners();
            this.setupModalListeners();
            this.setupImagePreview();
        });

        // Logout button event listener
        document.getElementById('logoutButton')?.addEventListener('click', () => this.logout());
    }

    /**
     * Validates user authentication and redirects if unauthorized.
     */
    validateAuth() {
        if (!this.token) {
            this.redirectToLogin('Please log in to view your profile.');
            return false;
        }
        return true;
    }

    /**
     * Redirects the user to the login page with an optional message.
     * @param {string} message - The message to display before redirecting.
     */
    redirectToLogin(message) {
        if (message) {
            sessionStorage.setItem('loginMessage', message);
        }
        window.location.href = 'login.html';
    }

    /**
     * Sets up event listeners for the profile edit form.
     */
    setupFormListeners() {
        const form = document.getElementById('editProfileForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.updateProfile();
            });
        }
    }

    /**
     * Sets up event listeners for modal interactions.
     */
    setupModalListeners() {
        const editBtn = document.getElementById('edit-profile-btn');
        const closeBtn = document.getElementById('closeModal');
        const modal = document.getElementById('editModal');

        if (editBtn && modal) {
            editBtn.addEventListener('click', () => this.toggleModal(true));
        }

        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => this.toggleModal(false));
            window.addEventListener('click', (e) => {
                if (e.target === modal) this.toggleModal(false);
            });
        }
    }

    /**
     * Sets up the image preview functionality for profile picture uploads.
     */
    setupImagePreview() {
        const imageInput = document.getElementById('edit-profile-picture');
        const preview = document.getElementById('image-preview');

        if (imageInput && preview) {
            imageInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && this.validateImage(file)) {
                    this.showImagePreview(file, preview);
                }
            });
        }
    }

    /**
     * Displays the selected image as a preview.
     * @param {File} file - The image file to preview.
     * @param {HTMLElement} previewElement - The image element to display the preview in.
     */
    showImagePreview(file, previewElement) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewElement.src = e.target.result;
            previewElement.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    /**
     * Toggles the visibility of the profile edit modal.
     * @param {boolean} show - Whether to show or hide the modal.
     */
    toggleModal(show) {
        const modal = document.getElementById('editModal');
        if (modal) {
            modal.style.display = show ? 'block' : 'none';
            if (show) {
                this.populateEditForm();
            }
        }
    }

    /**
     * Populates the profile edit form with current user data.
     */
    populateEditForm() {
        const currentUsername = document.getElementById('username')?.textContent;
        const currentEmail = document.getElementById('email')?.textContent;
        const usernameInput = document.getElementById('edit-username');
        const emailInput = document.getElementById('edit-email');

        if (usernameInput && currentUsername) usernameInput.value = currentUsername;
        if (emailInput && currentEmail) emailInput.value = currentEmail;
    }

    /**
     * Validates the selected profile image.
     * @param {File} file - The image file to validate.
     * @returns {boolean} - Returns true if valid, false otherwise.
     */
    validateImage(file) {
        const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
        const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

        if (!VALID_IMAGE_TYPES.includes(file.type)) {
            this.showError('Please upload a valid image file (JPEG, PNG, or GIF).');
            return false;
        }
        if (file.size > MAX_IMAGE_SIZE) {
            this.showError('Image size should be less than 5MB.');
            return false;
        }
        return true;
    }

    /**
     * Validates the input fields before updating the profile.
     * @param {string} username - The username input.
     * @param {string} email - The email input.
     * @throws Will throw an error if validation fails.
     */
    validateInputs(username, email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

        if (!usernameRegex.test(username)) {
            throw new Error('Username must be 3-20 characters and contain only letters, numbers, and underscores.');
        }
        if (!emailRegex.test(email)) {
            throw new Error('Please enter a valid email address.');
        }
    }

    /**
     * Loads the user's profile from the backend and updates the UI.
     */
    async loadProfile() {
        try {
            const response = await this.makeRequest(`${API_BASE_URL}/api/v1/users/profile`);
            if (response) {
                const data = await this.handleResponse(response);
                if (data?.user) {
                    this.updateProfileUI(data.user);
                }
            }
        } catch (error) {
            this.handleError(error, 'loading your profile');
        }
    }

    /**
     * Updates the user's profile by sending form data to the backend.
     */
    async updateProfile() {
        const username = sanitizeInput(document.getElementById('edit-username')?.value?.trim());
        const email = sanitizeInput(document.getElementById('edit-email')?.value?.trim());
        const profilePicture = document.getElementById('edit-profile-picture')?.files[0];

        try {
            this.validateInputs(username, email);

            // If profilePicture is provided and invalid, stop here
            if (profilePicture && !this.validateImage(profilePicture)) return;

            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            if (profilePicture) {
                formData.append('profilePicture', profilePicture);
            }

            const response = await this.makeRequest(`${API_BASE_URL}/api/v1/users/profile`, {
                method: 'PUT',
                body: formData,
            });

            if (response) {
                await this.handleResponse(response);
                this.showSuccess('Profile updated successfully!');
                this.toggleModal(false);
                await this.loadProfile();
            }
        } catch (error) {
            this.handleError(error, 'updating your profile');
        }
    }

    /**
     * Makes an API request with proper headers and error handling.
     * @param {string} url - The API endpoint URL.
     * @param {Object} options - Fetch options.
     * @returns {Promise<Response|null>} - The fetch response or null if unauthorized.
     */
    async makeRequest(url, options = {}) {
        const defaultOptions = {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        };

        try {
            const response = await fetch(url, { ...defaultOptions, ...options });

            if (response.status === 401) {
                this.handleUnauthorized();
                return null;
            } else if (response.status === 500) {
                console.error('Server encountered an error while processing the request.');
                alert('Internal Server Error: Please try again later.');
            }

            return response;
        } catch (error) {
            this.handleError(error, 'making a network request');
            return null;
        }
    }

    /**
     * Handles the fetch response, throwing errors if response is not ok.
     * @param {Response} response - The fetch response object.
     * @returns {Promise<Object>} - The parsed JSON data.
     * @throws Will throw an error if response is not ok.
     */
    async handleResponse(response) {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'An error occurred.');
        }
        return data;
    }

    /**
     * Handles unauthorized access by clearing tokens and redirecting to login.
     */
    handleUnauthorized() {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        this.redirectToLogin('Your session has expired. Please log in again.');
    }

    /**
     * Updates the profile UI with fetched user data.
     * @param {Object} user - The user data object.
     */
    updateProfileUI(user) {
        const elements = {
            username: document.getElementById('username'),
            email: document.getElementById('email'),
            avatar: document.getElementById('profile-avatar'),
        };

        if (elements.username && user.username) elements.username.textContent = user.username;
        if (elements.email && user.email) elements.email.textContent = user.email;
        if (elements.avatar) {
            elements.avatar.src = user.profilePictureUrl || 'media/profile-default.png';
            elements.avatar.alt = `${user.username || 'User'}'s profile picture`;
        }
    }

    /**
     * Logs out the user by clearing tokens and redirecting to login.
     */
    async logout() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${this.token}` },
            });

            if (response.ok) {
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                alert('Logged out successfully.');
                window.location.href = 'index.html';
            } else {
                throw new Error('Failed to logout.');
            }
        } catch (error) {
            console.error('Logout Error:', error);
            alert('An error occurred while logging out. Please try again.');
        }
    }

    /**
     * Displays an error message to the user.
     * @param {Error} error - The error object.
     * @param {string} action - The action being performed when the error occurred.
     */
    showError(error, action) {
        console.error(`Error ${action}:`, error);
        const errorMessage = error.message || `An error occurred while ${action}. Please try again.`;
        alert(errorMessage);
    }

    /**
     * Displays a success message to the user.
     * @param {string} message - The success message to display.
     */
    showSuccess(message) {
        alert(message);
    }
}

/**
 * Sanitizes user input to prevent XSS attacks.
 * @param {string} input - The input string to sanitize.
 * @returns {string} - The sanitized string.
 */
function sanitizeInput(input) {
    const element = document.createElement('div');
    element.textContent = input;
    return element.innerHTML;
}

// Initialize the ProfileManager
const profileManager = new ProfileManager();
export default profileManager;
