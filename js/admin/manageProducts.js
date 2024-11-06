// js/admin/manageProducts.js

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
 * Loads and displays products in the products table.
 */
async function loadProducts() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/products`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to load products.');
        }

        const data = await response.json();
        const productsTableBody = document.getElementById('productsTableBody');
        if (!productsTableBody) {
            console.error('Products table body not found.');
            return;
        }
        productsTableBody.innerHTML = '';

        data.products.forEach((product) => {
            const row = document.createElement('tr');

            row.innerHTML = `
        <td>${product.name}</td>
        <td>EGP ${parseFloat(product.price).toFixed(2)}</td>
      `;

            const actionsCell = document.createElement('td');

            // Create Edit button
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('btn', 'btn-sm', 'btn-primary', 'me-2');
            editButton.addEventListener('click', () => editProduct(product));

            // Create Delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('btn', 'btn-sm', 'btn-danger');
            deleteButton.addEventListener('click', () => deleteProduct(product._id));

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);
            row.appendChild(actionsCell);

            productsTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading products:', error);
        alert('An error occurred while loading products. Please try again.');
    }
}

/**
 * Adds a new product using the form data.
 * @param {Event} event - The form submission event.
 */
async function addProduct(event) {
    event.preventDefault();

    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const description = document.getElementById('productDescription').value.trim();
    const imageUrl = document.getElementById('productImageUrl').value.trim();
    const inStock = document.getElementById('productInStock').checked;

    // Input validation
    if (!name || isNaN(price) || price <= 0) {
        alert('Please provide valid product details.');
        return;
    }

    const newProduct = { name, price, description, imageUrl, inStock };

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newProduct),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add product.');
        }

        alert('Product added successfully.');
        loadProducts();
        document.getElementById('addProductForm').reset();
    } catch (error) {
        console.error('Error adding product:', error);
        alert('An error occurred while adding the product.');
    }
}

/**
 * Deletes a specific product after confirmation.
 * @param {string} productId - The ID of the product to delete.
 */
async function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete product.');
            }

            alert('Product deleted successfully.');
            loadProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('An error occurred while deleting the product.');
        }
    }
}

/**
 * Edits a specific product.
 * @param {Object} product - The product object to edit.
 */
function editProduct(product) {
    // Implement a modal or redirect to an edit page with product details
    // For now, display an alert with product information
    alert(`Edit product: ${product.name}\nID: ${product._id}`);
}

document.addEventListener('DOMContentLoaded', async () => {
    const isAdmin = await checkAdminAccess();
    if (isAdmin) {
        loadProducts();

        const addProductForm = document.getElementById('addProductForm');
        if (addProductForm) {
            addProductForm.addEventListener('submit', addProduct);
        }
    }
});
