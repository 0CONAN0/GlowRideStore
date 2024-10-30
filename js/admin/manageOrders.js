// js/admin/manageOrders.js

// Define the API base URL
const API_BASE_URL = "http://localhost:5000"; // Update this if your backend is hosted elsewhere

document.addEventListener("DOMContentLoaded", () => {
    checkAdminAccess();
    loadOrders();
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

async function loadOrders() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });

        const data = await response.json();

        if (response.ok) {
            const orders = data.orders; // Adjust based on your backend's response structure
            const ordersTableBody = document.getElementById("ordersTableBody");
            ordersTableBody.innerHTML = "";

            orders.forEach(order => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${order._id}</td>
                    <td>${order.userId?.username || "Guest"}</td>
                    <td>EGP ${order.totalAmount.toFixed(2)}</td>
                    <td>${order.status}</td>
                    <td>
                        <button onclick="updateOrderStatus('${order._id}')">Update Status</button>
                        <button onclick="deleteOrder('${order._id}')">Delete</button>
                    </td>
                `;
                ordersTableBody.appendChild(row);
            });
        } else {
            alert(data.message || "Failed to load orders.");
        }
    } catch (error) {
        console.error("Error loading orders:", error);
        alert("An error occurred while loading orders. Please try again.");
    }
}

async function updateOrderStatus(orderId) {
    const newStatus = prompt("Enter the new status for the order:");
    if (!newStatus) return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ status: newStatus })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Order status updated successfully.");
            loadOrders();
        } else {
            alert(data.message || "Failed to update order status.");
        }
    } catch (error) {
        console.error("Error updating order status:", error);
        alert("An error occurred while updating the order status.");
    }
}

async function deleteOrder(orderId) {
    if (confirm("Are you sure you want to delete this order?")) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });

            const data = await response.json();

            if (response.ok) {
                alert("Order deleted successfully.");
                loadOrders();
            } else {
                alert(data.message || "Failed to delete order.");
            }
        } catch (error) {
            console.error("Error deleting order:", error);
            alert("An error occurred while deleting the order.");
        }
    }
}
