// js/checkout.js

import { API_BASE_URL } from './config.js';

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

document.addEventListener('DOMContentLoaded', function () {
    loadCart();
});

/**
 * Loads and displays the cart items for checkout.
 */
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cartForCheckout')) || [];
    const cartList = document.getElementById('cartList');

    if (!cartList) {
        console.error('Cart list element not found.');
        return;
    }

    if (cart.length === 0) {
        cartList.innerHTML = "<p>Your cart is empty. <a href='products.html'>Go shopping</a></p>";
        document.getElementById('totalAmount').textContent = `EGP 0.00`;
        const placeOrderBtn = document.getElementById('placeOrderBtn');
        if (placeOrderBtn) {
            placeOrderBtn.disabled = true;
            placeOrderBtn.classList.add('disabled');
        }
        return;
    }

    cartList.innerHTML = '';

    cart.forEach((item) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - ${item.quantity} x EGP ${item.price.toFixed(2)}`;
        cartList.appendChild(listItem);
    });

    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    document.getElementById('totalAmount').textContent = `EGP ${totalAmount.toFixed(2)}`;
}

/**
 * Handles the order placement process.
 */
document.getElementById('placeOrderBtn')?.addEventListener('click', async () => {
    const cart = JSON.parse(localStorage.getItem('cartForCheckout')) || [];
    const token = getToken();

    if (!token) {
        alert('You need to be logged in to place an order.');
        window.location.href = 'login.html';
        return;
    }

    const address = document.getElementById('address')?.value.trim();
    const city = document.getElementById('city')?.value.trim();
    const postalCode = document.getElementById('postalCode')?.value.trim();
    const country = document.getElementById('country')?.value.trim();
    const state = document.getElementById('state')?.value.trim();

    // Input validation
    if (!address || !city || !postalCode || !country) {
        alert('Please fill in all shipping address fields.');
        return;
    }

    const orderDetails = {
        items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
        shippingAddress: { address, city, state, postalCode, country },
        paymentMethod: 'Cash on Delivery',
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(orderDetails),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to place order');
        }

        alert('Order placed successfully!');
        localStorage.removeItem('cart');
        localStorage.removeItem('cartForCheckout');
        window.location.href = 'profile.html';
    } catch (error) {
        console.error('Order Error:', error);
        alert(error.message || 'An error occurred while placing the order.');
    }
});
