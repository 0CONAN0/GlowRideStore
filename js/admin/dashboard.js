// js/admin/dashboard.js

document.addEventListener("DOMContentLoaded", () => {
    loadDashboardMetrics();
});

async function loadDashboardMetrics() {
    const token = localStorage.getItem("token");

    // Fetch metrics from backend API
    const response = await fetch("http://localhost:5000/api/admin/metrics", {
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (response.ok) {
        const data = await response.json();
        document.getElementById("total-sales").textContent = `Total Sales: EGP${data.totalSales}`;
        document.getElementById("total-orders").textContent = `Total Orders: ${data.totalOrders}`;
        document.getElementById("total-users").textContent = `Total Users: ${data.totalUsers}`;
    } else {
        console.error("Failed to load metrics");
    }
}
