// js/admin/manageOrders.js

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
 * Loads and displays orders in the orders table.
 */
async function loadOrders() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to load orders.');
        }

        const data = await response.json();
        const ordersTableBody = document.getElementById('ordersTableBody');
        if (!ordersTableBody) {
            console.error('Orders table body not found.');
            return;
        }
        ordersTableBody.innerHTML = '';

        data.orders.forEach((order) => {
            const row = document.createElement('tr');

            row.innerHTML = `
        <td>${order._id}</td>
        <td>${order.userId?.username || 'Guest'}</td>
        <td>EGP ${parseFloat(order.totalAmount).toFixed(2)}</td>
        <td>${order.status}</td>
      `;

            const actionsCell = document.createElement('td');

            // Create Update Status button
            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update Status';
            updateButton.classList.add('btn', 'btn-sm', 'btn-warning', 'me-2');
            updateButton.addEventListener('click', () => updateOrderStatus(order._id));

            // Create Delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('btn', 'btn-sm', 'btn-danger');
            deleteButton.addEventListener('click', () => deleteOrder(order._id));

            actionsCell.appendChild(updateButton);
            actionsCell.appendChild(deleteButton);
            row.appendChild(actionsCell);

            ordersTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading orders:', error);
        alert('An error occurred while loading orders. Please try again.');
    }
}

/**
 * Updates the status of a specific order.
 * @param {string} orderId - The ID of the order to update.
 */
async function updateOrderStatus(orderId) {
    const newStatus = prompt('Enter the new status for the order:');
    if (!newStatus) return;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update order status.');
        }

        alert('Order status updated successfully.');
        loadOrders();
    } catch (error) {
        console.error('Error updating order status:', error);
        alert('An error occurred while updating the order status.');
    }
}

/**
 * Deletes a specific order after confirmation.
 * @param {string} orderId - The ID of the order to delete.
 */
async function deleteOrder(orderId) {
    if (confirm('Are you sure you want to delete this order?')) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete order.');
            }

            alert('Order deleted successfully.');
            loadOrders();
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('An error occurred while deleting the order.');
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const isAdmin = await checkAdminAccess();
    if (isAdmin) {
        loadOrders();
    }
});
