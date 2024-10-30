// products.js

// Define the API base URL
const API_BASE_URL = "http://localhost:5000"; // Update this if your backend is hosted elsewhere

document.addEventListener("DOMContentLoaded", function() {
    loadProducts();

    // Add event listener for Add to Cart buttons
    const productGrid = document.querySelector(".product-grid");
    productGrid.addEventListener("click", function(event) {
        if (event.target && event.target.matches(".add-to-cart-btn")) {
            const button = event.target;
            const productId = button.getAttribute("data-id");
            const productName = button.getAttribute("data-name");
            const productPrice = parseFloat(button.getAttribute("data-price"));
            const productImage = button.getAttribute("data-image");

            addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });

            alert(`${productName} has been added to your cart.`);
        }
    });
});

async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        const data = await response.json();

        if (response.ok) {
            const products = data.products; // Adjust based on your backend's response structure
            const productGrid = document.querySelector(".product-grid");
            productGrid.innerHTML = "";

            products.forEach(product => {
                const productCard = `
                    <div class="product-card">
                        <img src="${product.imageUrl}" alt="${product.name}">
                        <h2 class="product-title">${product.name}</h2>
                        <p class="product-price">EGP ${product.price}</p>
                        <button class="add-to-cart-btn" 
                                data-id="${product._id}" 
                                data-name="${product.name}" 
                                data-price="${product.price}" 
                                data-image="${product.imageUrl}">
                            Add to Cart
                        </button>
                    </div>
                `;
                productGrid.innerHTML += productCard;
            });
        } else {
            alert(data.message || "Failed to load products.");
        }
    } catch (error) {
        console.error("Error loading products:", error);
        alert("An error occurred while loading products. Please try again.");
    }
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += product.quantity;
    } else {
        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
}
