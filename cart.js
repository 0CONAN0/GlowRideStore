// JavaScript Functions for Cart Interactions
function updateSubtotal() {
    // Placeholder for calculating the subtotal based on item quantities
    let subtotal = 0;
    document.querySelectorAll('.cart-item').forEach(item => {
        const price = parseFloat(item.querySelector('.item-price').textContent.replace('$', ''));
        const quantity = parseInt(item.querySelector('input[type="number"]').value);
        subtotal += price * quantity;
    });
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `$${subtotal.toFixed(2)}`;
}

function decreaseQuantity(button) {
    let input = button.nextElementSibling;
    if (input.value > 1) {
        input.value--;
        updateSubtotal();
    }
}

function increaseQuantity(button) {
    let input = button.previousElementSibling;
    input.value++;
    updateSubtotal();
}

function removeItem(button) {
    button.closest('.cart-item').remove();
    updateSubtotal();
}

// Function to add a product to the cart
function addToCart(productId) {
    // Find the selected product from the product list
    const selectedProduct = products.find(product => product.id === productId);
    
    // Retrieve the cart from localStorage, or create an empty array if it doesn't exist
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if the product is already in the cart
    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        // If it exists, increase the quantity
        existingProduct.quantity += 1;
    } else {
        // If it doesn't exist, add it to the cart with quantity 1
        cart.push({ ...selectedProduct, quantity: 1 });
    }

    // Save the updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update cart icon count
    updateCartCount();

    // Optional: Show a message to confirm the item was added
    alert(`${selectedProduct.name} has been added to your cart.`);
}
