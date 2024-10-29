// js/admin/manageOrders.js

document.addEventListener("DOMContentLoaded", () => {
    loadOrders();
});

async function loadOrders() {
    const response = await fetch("http://localhost:5000/api/orders", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });

    if (response.ok) {
        const orders = await response.json();
        const ordersTableBody = document.getElementById("ordersTableBody");
        ordersTableBody.innerHTML = "";

        orders.forEach(order => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.customerName}</td>
                <td>$${order.totalAmount}</td>
                <td>${order.status}</td>
                <td>
                    <button onclick="updateOrderStatus('${order.id}')">Update Status</button>
                    <button onclick="deleteOrder('${order.id}')">Delete</button>
                </td>
            `;
            ordersTableBody.appendChild(row);
        });
    } else {
        console.error("Failed to load orders");
    }
}

async function updateOrderStatus(orderId) {
    // Implement status update functionality here
    alert(`Update status for order: ${orderId}`);
}

async function deleteOrder(orderId) {
    if (confirm("Are you sure you want to delete this order?")) {
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });

        if (response.ok) {
            alert("Order deleted successfully");
            loadOrders();
        } else {
            alert("Failed to delete order");
        }
    }
}
