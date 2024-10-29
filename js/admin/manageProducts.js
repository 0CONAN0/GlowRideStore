// js/admin/manageProducts.js

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    document.getElementById("addProductForm").addEventListener("submit", addProduct);
});

async function loadProducts() {
    const response = await fetch("http://localhost:5000/api/products");
    const products = await response.json();

    const productsTableBody = document.getElementById("productsTableBody");
    productsTableBody.innerHTML = "";

    products.forEach(product => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.name}</td>
            <td>EGP${product.price}</td>
            <td>
                <button onclick="deleteProduct('${product._id}')">Delete</button>
            </td>
        `;
        productsTableBody.appendChild(row);
    });
}

async function addProduct(event) {
    event.preventDefault();

    const newProduct = {
        name: document.getElementById("productName").value,
        price: document.getElementById("productPrice").value,
        description: document.getElementById("productDescription").value,
        imageUrl: document.getElementById("productImageUrl").value,
    };

    const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(newProduct)
    });

    if (response.ok) {
        alert("Product added successfully");
        loadProducts();
    } else {
        alert("Failed to add product");
    }
}

async function deleteProduct(productId) {
    const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });

    if (response.ok) {
        alert("Product deleted");
        loadProducts();
    } else {
        alert("Failed to delete product");
    }
}
