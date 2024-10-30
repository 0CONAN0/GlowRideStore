// js/admin/manageProducts.js

// Define the API base URL
const API_BASE_URL = "http://localhost:5000"; // Update this if your backend is hosted elsewhere

document.addEventListener("DOMContentLoaded", () => {
    checkAdminAccess();
    loadProducts();
    document.getElementById("addProductForm").addEventListener("submit", addProduct);
});

async function checkAdminAccess() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You must be logged in as an admin to access this page.");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify-admin`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            alert("You are not authorized to access this page.");
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Error verifying admin access:", error);
        alert("An error occurred. Please try again.");
        window.location.href = "index.html";
    }
}

async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });

        const data = await response.json();

        if (response.ok) {
            const products = data.products; // Adjust based on your backend's response structure
            const productsTableBody = document.getElementById("productsTableBody");
            productsTableBody.innerHTML = "";

            products.forEach(product => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>EGP ${product.price.toFixed(2)}</td>
                    <td>
                        <button onclick="editProduct('${product._id}')">Edit</button>
                        <button onclick="deleteProduct('${product._id}')">Delete</button>
                    </td>
                `;
                productsTableBody.appendChild(row);
            });
        } else {
            alert(data.message || "Failed to load products.");
        }
    } catch (error) {
        console.error("Error loading products:", error);
        alert("An error occurred while loading products. Please try again.");
    }
}

async function addProduct(event) {
    event.preventDefault();

    const token = localStorage.getItem("token");
    const newProduct = {
        name: document.getElementById("productName").value.trim(),
        price: parseFloat(document.getElementById("productPrice").value),
        description: document.getElementById("productDescription").value.trim(),
        imageUrl: document.getElementById("productImageUrl").value.trim(),
        inStock: document.getElementById("productInStock").checked
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(newProduct)
        });

        const data = await response.json();

        if (response.ok) {
            alert("Product added successfully.");
            loadProducts();
            document.getElementById("addProductForm").reset();
        } else {
            alert(data.message || "Failed to add product.");
        }
    } catch (error) {
        console.error("Error adding product:", error);
        alert("An error occurred while adding the product.");
    }
}

async function deleteProduct(productId) {
    if (confirm("Are you sure you want to delete this product?")) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });

            const data = await response.json();

            if (response.ok) {
                alert("Product deleted successfully.");
                loadProducts();
            } else {
                alert(data.message || "Failed to delete product.");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("An error occurred while deleting the product.");
        }
    }
}

async function editProduct(productId) {
    // Implement product editing functionality
    // You might open a modal with pre-filled product details
    alert(`Edit product: ${productId}`);
}
