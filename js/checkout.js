// checkout.js

// Define the API base URL
const API_BASE_URL = "http://localhost:5000"; // Update this if your backend is hosted elsewhere

// Load cart data on page load
document.addEventListener("DOMContentLoaded", function () {
    loadCart();
});

// Load cart for checkout
function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cartForCheckout")) || [];
    const cartList = document.getElementById("cartList");

    if (cart.length === 0) {
        cartList.innerHTML = "<p>Your cart is empty. <a href='products.html'>Go shopping</a></p>";
        document.getElementById("totalAmount").textContent = `EGP 0.00`;
        document.getElementById("placeOrderBtn").disabled = true;
        return;
    }

    cartList.innerHTML = ""; // Clear any existing items

    cart.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.name} - ${item.quantity} x EGP ${item.price.toFixed(2)}`;
        cartList.appendChild(listItem);
    });

    const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    document.getElementById("totalAmount").textContent = `EGP ${totalAmount.toFixed(2)}`;
}

// Submit order to backend
document.getElementById("placeOrderBtn").addEventListener("click", async () => {
    const cart = JSON.parse(localStorage.getItem("cartForCheckout")) || [];
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You need to be logged in to place an order.");
        window.location.href = "login.html";
        return;
    }

    // Get shipping address details from the form
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const postalCode = document.getElementById("postalCode").value.trim();
    const country = document.getElementById("country").value.trim();

    if (!address || !city || !postalCode || !country) {
        alert("Please fill in all shipping address fields.");
        return;
    }

    const orderDetails = {
        items: cart.map(item => ({ productId: item.id, quantity: item.quantity })),
        shippingAddress: {
            address,
            city,
            postalCode,
            country
        },
        paymentMethod: "Cash on Delivery" // Or allow user to select payment method
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(orderDetails)
        });

        const data = await response.json();
        if (response.ok) {
            alert("Order placed successfully!");
            localStorage.removeItem("cart"); // Clear cart after order
            localStorage.removeItem("cartForCheckout");
            window.location.href = "profile.html"; // Redirect to profile or order history page
        } else {
            alert(data.message || "Failed to place order");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while placing the order.");
    }
});
