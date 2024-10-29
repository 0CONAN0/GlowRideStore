// Load cart items from Local Storage and display them on the cart page
document.addEventListener("DOMContentLoaded", function () {
    displayCartItems();
});

// Function to display cart items
function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsContainer = document.querySelector(".cart-items");
    const checkoutButton = document.querySelector(".checkout-btn");
    let subtotal = 0;

    cartItemsContainer.innerHTML = ""; // Clear previous items

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        document.getElementById("subtotal").textContent = `$0.00`;
        document.getElementById("total").textContent = `$0.00`;
        checkoutButton.disabled = true;
        checkoutButton.classList.add("disabled");
    } else {
        checkoutButton.disabled = false;
        checkoutButton.classList.remove("disabled");

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h2 class="item-title">${item.name}</h2>
                    <p class="product-price">EGP ${product.price.toFixed(2)}</p>
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="decreaseQuantity('${item.id}')">-</button>
                        <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" onchange="updateQuantity(this)">
                        <button class="quantity-btn" onclick="increaseQuantity('${item.id}')">+</button>
                    </div>
                </div>
                <button class="remove-item-btn" onclick="removeItem('${item.id}')">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        document.getElementById("subtotal").textContent = `EGP${subtotal.toFixed(2)}`;
        document.getElementById("total").textContent = `EGP${subtotal.toFixed(2)}`;
    }
}

// Update item quantity
function updateQuantity(input) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productId = input.getAttribute("data-id");
    const product = cart.find(item => item.id === productId);
    product.quantity = parseInt(input.value);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCartItems();
}

// Decrease quantity
function decreaseQuantity(productId) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const product = cart.find(item => item.id === productId);
    if (product.quantity > 1) {
        product.quantity -= 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCartItems();
    }
}

// Increase quantity
function increaseQuantity(productId) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const product = cart.find(item => item.id === productId);
    product.quantity += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCartItems();
}

// Remove item from cart
function removeItem(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCartItems();
}

// Prevent checkout if cart is empty
document.querySelector(".checkout-btn").addEventListener("click", function (e) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        e.preventDefault();
        alert("Your cart is empty. Add items to proceed to checkout.");
    } else {
        // Pass cart data to the checkout page
        localStorage.setItem("cartForCheckout", JSON.stringify(cart));
    }
});
