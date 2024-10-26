// Function to add a product to the cart
function addToCart(event) {
    const button = event.target;
    const productId = button.getAttribute("data-id");
    const productName = button.getAttribute("data-name");
    const productPrice = parseFloat(button.getAttribute("data-price"));
    const productImage = button.getAttribute("data-image");

    // Retrieve cart from localStorage or create an empty array if it doesn't exist
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if the product is already in the cart
    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        // If product exists, increase the quantity
        existingProduct.quantity += 1;
    } else {
        // If product doesn't exist, add it with quantity 1
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update the cart count
    updateCartCount();

    // Optional: Show a confirmation message
    alert(`${productName} has been added to your cart.`);
}

// Function to update the cart icon count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById("cart-count").textContent = cartCount;
}

// Attach event listeners to each "Add to Cart" button
document.querySelectorAll(".add-to-cart-btn").forEach(button => {
    button.addEventListener("click", addToCart);
});

// Update cart count on page load
window.onload = updateCartCount;
