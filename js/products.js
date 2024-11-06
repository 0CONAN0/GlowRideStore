// js/products.js

import { API_BASE_URL } from './config.js';

/**
 * Keeps track of the current page and applied filters for pagination.
 */
let currentPage = 1;
const limit = 20; // Number of products per page
let currentFilters = {};

/**
 * Initializes the products page by loading filters, products, and setting up event listeners.
 */
document.addEventListener('DOMContentLoaded', () => {
    loadFilters();
    loadProducts();

    const productGrid = document.querySelector('.product-grid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreProducts);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }

    if (priceFilter) {
        priceFilter.addEventListener('change', applyFilters);
    }

    if (productGrid) {
        productGrid.addEventListener('click', async (event) => {
            if (event.target.matches('.add-to-cart-btn')) {
                const productId = event.target.getAttribute('data-id');
                await addToCart(productId);
            }
        });
    }
});

/**
 * Fetches and populates category filters.
 */
async function loadFilters() {
    try {
        const response = await fetch(`${API_BASE_URL}/products/categories`);
        if (!response.ok) throw new Error('Failed to load categories.');

        const data = await response.json();
        const categoryFilter = document.getElementById('categoryFilter');

        if (categoryFilter && Array.isArray(data.categories)) {
            data.categories.forEach((category) => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading filters:', error);
        alert('An error occurred while loading filters. Please try again later.');
    }
}

/**
 * Fetches and displays products based on current page and filters.
 */
async function loadProducts() {
    try {
        const query = new URLSearchParams({
            page: currentPage,
            limit,
            ...currentFilters,
        });

        const response = await fetch(`${API_BASE_URL}/products?${query.toString()}`);
        const data = await response.json();

        if (response.ok && Array.isArray(data.products)) {
            const productGrid = document.querySelector('.product-grid');
            if (!productGrid) {
                console.error('Product grid element not found.');
                return;
            }

            data.products.forEach((product) => {
                const productCard = document.createElement('div');
                productCard.className = 'col-md-4 col-lg-3 mb-4';
                productCard.innerHTML = `
          <div class="product-card card h-100">
            <img src="${sanitizeInput(product.imageUrl)}" alt="${sanitizeInput(product.name)}" class="card-img-top" loading="lazy">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${sanitizeInput(product.name)}</h5>
              <p class="card-price">EGP ${parseFloat(product.price).toFixed(2)}</p>
              <button class="btn btn-primary add-to-cart-btn mt-auto" data-id="${product._id}" data-name="${sanitizeInput(product.name)}" data-price="${parseFloat(product.price).toFixed(2)}" data-image="${sanitizeInput(product.imageUrl)}">Add to Cart</button>
            </div>
          </div>
        `;
                productGrid.appendChild(productCard);
            });

            const loadMoreBtn = document.getElementById('loadMoreBtn');
            if (data.products.length < limit && loadMoreBtn) {
                loadMoreBtn.style.display = 'none';
            } else if (loadMoreBtn) {
                loadMoreBtn.style.display = 'block';
            }
        } else {
            throw new Error(data.message || 'Failed to load products.');
        }
    } catch (error) {
        console.error('Load Products Error:', error);
        alert('An error occurred while loading products. Please try again.');
    }
}

/**
 * Loads more products for pagination.
 */
async function loadMoreProducts() {
    currentPage += 1;
    await loadProducts();
}

/**
 * Applies selected filters and reloads products.
 */
function applyFilters() {
    const category = document.getElementById('categoryFilter')?.value;
    const price = document.getElementById('priceFilter')?.value;

    currentFilters = {};
    if (category) currentFilters.category = category;
    if (price) currentFilters.sort = price;

    currentPage = 1;
    const productGrid = document.querySelector('.product-grid');
    if (productGrid) productGrid.innerHTML = '';
    loadProducts();
}

/**
 * Adds a product to the cart by communicating with the backend.
 * @param {string} productId - The ID of the product to add.
 */
async function addToCart(productId) {
    const token = getToken();

    if (!token) {
        alert('You need to be logged in to add items to the cart.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ productId, quantity: 1 }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add to cart.');
        }

        const data = await response.json();
        updateCartCount(data.cartCount);
        alert('Product added to cart!');
    } catch (error) {
        console.error('Add to Cart Error:', error);
        alert(error.message || 'An error occurred while adding the product to the cart.');
    }
}

/**
 * Retrieves the token from cookies or localStorage.
 * @returns {string|null} - The authentication token or null if not found.
 */
function getToken() {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [name, value] = cookie.trim().split('=');
        acc[name] = value;
        return acc;
    }, {});
    return cookies['token'] || localStorage.getItem('token');
}

/**
 * Updates the cart count displayed in the navbar.
 * @param {number} count - The new cart count.
 */
function updateCartCount(count) {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
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
