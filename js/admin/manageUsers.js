// js/admin/manageUsers.js

import { API_BASE_URL } from './config.js';

/**
 * Checks if the current user has admin access.
 * Redirects to login or home page if unauthorized.
 * @returns {Promise<boolean>} - Returns true if admin, false otherwise.
 */
async function checkAdminAccess() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You must be logged in as an admin to access this page.');
        window.location.href = 'login.html';
        return false;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify-admin`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            alert('You are not authorized to access this page.');
            window.location.href = 'index.html';
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error verifying admin access:', error);
        alert('An error occurred. Please try again.');
        window.location.href = 'index.html';
        return false;
    }
}

/**
 * Loads and displays users in the users table.
 */
async function loadUsers() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/users`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to load users.');
        }

        const data = await response.json();
        const usersTableBody = document.getElementById('usersTableBody');
        if (!usersTableBody) {
            console.error('Users table body not found.');
            return;
        }
        usersTableBody.innerHTML = '';

        data.users.forEach((user) => {
            const row = document.createElement('tr');

            row.innerHTML = `
        <td>${user._id}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
      `;

            const actionsCell = document.createElement('td');

            // Create Edit button
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('btn', 'btn-sm', 'btn-primary', 'me-2');
            editButton.addEventListener('click', () => editUser(user));

            // Create Delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('btn', 'btn-sm', 'btn-danger');
            deleteButton.addEventListener('click', () => deleteUser(user._id));

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);
            row.appendChild(actionsCell);

            usersTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading users:', error);
        alert('An error occurred while loading users. Please try again.');
    }
}

/**
 * Edits a specific user.
 * @param {Object} user - The user object to edit.
 */
function editUser(user) {
    // Implement a modal or redirect to an edit page with user details
    // For now, display an alert with user information
    alert(`Edit user: ${user.username}\nID: ${user._id}`);
}

/**
 * Deletes a specific user after confirmation.
 * @param {string} userId - The ID of the user to delete.
 */
async function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete user.');
            }

            alert('User deleted successfully.');
            loadUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('An error occurred while deleting the user.');
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const isAdmin = await checkAdminAccess();
    if (isAdmin) {
        loadUsers();
    }
});
