document.addEventListener("DOMContentLoaded", loadProducts);

async function loadProducts() {
    try {
        const response = await fetch("http://localhost:5000/api/products");
        const products = await response.json();

        const productGrid = document.querySelector(".product-grid");
        productGrid.innerHTML = "";

        products.forEach(product => {
            const productCard = `
                <div class="product-card">
                    <img src="${product.imageUrl}" alt="${product.name}">
                    <h2 class="product-title">${product.name}</h2>
                    <p class="product-price">EGP${product.price}</p>
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
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

