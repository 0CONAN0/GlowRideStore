// js/admin/dashboard.js

// Define the API base URL
const API_BASE_URL = "http://localhost:5000"; // Update this if your backend is hosted elsewhere

document.addEventListener("DOMContentLoaded", () => {
    checkAdminAccess();
    loadDashboardMetrics();
});

async function checkAdminAccess() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You must be logged in as an admin to access this page.");
        window.location.href = "login.html";
        return;
    }

    // Optionally, verify if the user is an admin
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

async function loadDashboardMetrics() {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/metrics`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById("total-sales").textContent = `Total Sales: EGP ${data.totalSales.toFixed(2)}`;
            document.getElementById("total-orders").textContent = `Total Orders: ${data.totalOrders}`;
            document.getElementById("total-users").textContent = `Total Users: ${data.totalUsers}`;
        } else {
            alert(data.message || "Failed to load metrics.");
            if (response.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "login.html";
            }
        }
    } catch (error) {
        console.error("Error loading dashboard metrics:", error);
        alert("An error occurred while loading metrics. Please try again.");
    }
}
