// checkout.js

// Load cart for checkout
function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cartForCheckout")) || [];
    const cartList = document.getElementById("cartList");

    cart.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.name} - ${item.quantity} x EGP${item.price}`;
        cartList.appendChild(listItem);
    });

    const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    document.getElementById("totalAmount").textContent = `EGP${totalAmount.toFixed(2)}`;
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

    const orderDetails = {
        products: cart.map(item => ({ productId: item.id, quantity: item.quantity })),
        totalAmount: cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    };

    try {
        const response = await fetch("http://localhost:5000/api/orders", {
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

// Load cart data on page load
loadCart();