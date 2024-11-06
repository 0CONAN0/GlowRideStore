// js/cart.js

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
 * Displays the cart items in the UI.
 */
function displayCartItems() {
    const cart = getCart();
    const cartItemsContainer = document.querySelector('.cart-items');
    const checkoutButton = document.querySelector('.checkout-btn');
    let subtotal = 0;

    cartItemsContainer.innerHTML = ''; // Clear previous items

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        document.getElementById('subtotal').textContent = `EGP 0.00`;
        document.getElementById('total').textContent = `EGP 0.00`;
        if (checkoutButton) {
            checkoutButton.disabled = true;
            checkoutButton.classList.add('disabled');
        }
    } else {
        if (checkoutButton) {
            checkoutButton.disabled = false;
            checkoutButton.classList.remove('disabled');
        }

        cart.forEach((item) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
          <img src="${item.image}" alt="${item.name}" loading="lazy">
          <div class="item-details">
            <h2 class="item-title">${item.name}</h2>
            <p class="product-price">EGP ${item.price.toFixed(2)}</p>
            <div class="quantity-control">
              <button class="quantity-btn btn btn-sm btn-secondary" onclick="decreaseQuantity('${item.id}')">-</button>
              <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" onchange="updateQuantity(this)" class="form-control form-control-sm d-inline-block" style="width: 60px;">
              <button class="quantity-btn btn btn-sm btn-secondary" onclick="increaseQuantity('${item.id}')">+</button>
            </div>
          </div>
          <button class="remove-item-btn btn btn-sm btn-danger" onclick="removeItem('${item.id}')">Remove</button>
        `;
            cartItemsContainer.appendChild(cartItem);
        });

        document.getElementById('subtotal').textContent = `EGP ${subtotal.toFixed(2)}`;
        document.getElementById('total').textContent = `EGP ${subtotal.toFixed(2)}`;
    }
}

/**
 * Updates the cart count displayed in the navbar.
 */
function updateCartCount() {
    const cart = getCart();
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
}

/**
 * Updates the quantity of a specific cart item.
 * @param {HTMLInputElement} input - The input element containing the new quantity.
 */
function updateQuantity(input) {
    const cart = getCart();
    const productId = input.getAttribute('data-id');
    const product = cart.find((item) => item.id === productId);
    const newQuantity = parseInt(input.value);

    if (newQuantity > 0 && product) {
        product.quantity = newQuantity;
        saveCart(cart);
        displayCartItems();
        updateCartCount();
    } else if (product) {
        removeItem(productId);
    }
}

/**
 * Decreases the quantity of a specific cart item by 1.
 * @param {string} productId - The ID of the product.
 */
function decreaseQuantity(productId) {
    const cart = getCart();
    const product = cart.find((item) => item.id === productId);

    if (product && product.quantity > 1) {
        product.quantity -= 1;
        saveCart(cart);
        displayCartItems();
        updateCartCount();
    } else if (product) {
        removeItem(productId);
    }
}

/**
 * Increases the quantity of a specific cart item by 1.
 * @param {string} productId - The ID of the product.
 */
function increaseQuantity(productId) {
    const cart = getCart();
    const product = cart.find((item) => item.id === productId);

    if (product) {
        product.quantity += 1;
        saveCart(cart);
        displayCartItems();
        updateCartCount();
    }
}

/**
 * Removes a specific item from the cart.
 * @param {string} productId - The ID of the product to remove.
 */
function removeItem(productId) {
    let cart = getCart();
    cart = cart.filter((item) => item.id !== productId);
    saveCart(cart);
    displayCartItems();
    updateCartCount();
}

/**
 * Initializes event listeners and displays cart items on page load.
 */
document.addEventListener('DOMContentLoaded', () => {
    displayCartItems();
    updateCartCount();

    // Proceed to checkout
    const checkoutButton = document.querySelector('.checkout-btn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function (e) {
            const cart = getCart();
            if (cart.length === 0) {
                e.preventDefault();
                alert('Your cart is empty. Add items to proceed to checkout.');
            } else {
                localStorage.setItem('cartForCheckout', JSON.stringify(cart));
                window.location.href = 'checkout.html'; // Redirect to checkout page
            }
        });
    }
});

/**
 * Adds a specific product to the cart.
 * @param {string} productId - The ID of the product to add.
 */
function addToCart(productId) {
    const cart = getCart();
    const product = cart.find((item) => item.id === productId);

    if (product) {
        product.quantity += 1;
    } else {
        // Assuming you have access to product details (e.g., from data attributes)
        const productElement = document.querySelector(`.add-to-cart-btn[data-id="${productId}"]`);
        const name = productElement.getAttribute('data-name') || 'Unknown Product';
        const price = parseFloat(productElement.getAttribute('data-price')) || 0;
        const image = productElement.getAttribute('data-image') || 'media/default-product.png';

        cart.push({ id: productId, name, price, quantity: 1, image });
    }

    saveCart(cart);
    displayCartItems();
    updateCartCount();
}
