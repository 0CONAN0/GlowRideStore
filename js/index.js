// js/index.js

import { API_BASE_URL } from './config.js';

/**
 * Fetches and displays featured products on the homepage.
 */
document.addEventListener('DOMContentLoaded', loadFeaturedProducts);

/**
 * Loads featured products from the backend and displays them.
 */
async function loadFeaturedProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products/featured`);
        if (!response.ok) throw new Error('Failed to load featured products.');

        const products = await response.json();
        const featuredCollection = document.getElementById('featured-collection');
        if (!featuredCollection) {
            console.error('Featured collection element not found.');
            return;
        }
        featuredCollection.innerHTML = ''; // Clear any existing content

        if (Array.isArray(products)) {
            products.forEach((product) => {
                const card = document.createElement('div');
                card.className = 'col-md-6 col-lg-3';
                card.innerHTML = `
          <div class="featured-card card h-100">
            <img src="${product.imageUrl}" alt="${product.name}" class="card-img-top" loading="lazy">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-price">EGP ${parseFloat(product.price).toFixed(2)}</p>
              <p class="card-text">${product.description}</p>
              <button class="btn btn-primary mt-auto add-to-cart-btn" data-id="${product._id}" data-name="${sanitizeInput(product.name)}" data-price="${parseFloat(product.price).toFixed(2)}" data-image="${sanitizeInput(product.imageUrl)}">Add to Cart</button>
            </div>
          </div>
        `;
                featuredCollection.appendChild(card);
            });

            // Event delegation for Add to Cart buttons
            featuredCollection.addEventListener('click', (event) => {
                if (event.target.matches('.add-to-cart-btn')) {
                    const button = event.target;
                    const productId = button.getAttribute('data-id');
                    addToCart(productId);
                }
            });
        } else {
            console.error('Unexpected data format for featured products.');
        }
    } catch (error) {
        console.error('Error loading featured products:', error);
        alert('An error occurred while loading featured products. Please try again later.');
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

/**
 * Adds a product to the cart.
 * @param {string} productId - The ID of the product to add.
 */
function addToCart(productId) {
    const cart = getCart();
    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Assuming product details are stored in data attributes
        const addButton = document.querySelector(`.add-to-cart-btn[data-id="${productId}"]`);
        const name = addButton.getAttribute('data-name') || 'Unnamed Product';
        const price = parseFloat(addButton.getAttribute('data-price')) || 0;
        const image = addButton.getAttribute('data-image') || 'media/default-product.png';

        cart.push({ id: productId, name, price, quantity: 1, image });
    }

    saveCart(cart);
    displayCartCount();
    alert('Product added to cart!');
}

/**
 * Retrieves the cart from localStorage.
 * @returns {Array} - The cart items array.
 */
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('cart')) || [];
    } catch (error) {
        console.error('Error reading cart from localStorage:', error);
        return [];
    }
}

/**
 * Saves the cart to localStorage.
 * @param {Array} cart - The cart items array.
 */
function saveCart(cart) {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
}

/**
 * Displays the cart count in the navbar.
 */
function displayCartCount() {
    const cart = getCart();
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
}

/**
 * Initializes the cart count display on page load.
 */
function initializeCartCount() {
    displayCartCount();
}

document.addEventListener('DOMContentLoaded', initializeCartCount);
