// js/admin/manageUsers.js

// Define the API base URL
const API_BASE_URL = "http://localhost:5000"; // Update this if your backend is hosted elsewhere

document.addEventListener("DOMContentLoaded", () => {
    checkAdminAccess();
    loadUsers();
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

async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });

        const data = await response.json();

        if (response.ok) {
            const users = data.users; // Adjust based on your backend's response structure
            const usersTableBody = document.getElementById("usersTableBody");
            usersTableBody.innerHTML = "";

            users.forEach(user => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${user._id}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>
                        <button onclick="editUser('${user._id}')">Edit</button>
                        <button onclick="deleteUser('${user._id}')">Delete</button>
                    </td>
                `;
                usersTableBody.appendChild(row);
            });
        } else {
            alert(data.message || "Failed to load users.");
        }
    } catch (error) {
        console.error("Error loading users:", error);
        alert("An error occurred while loading users. Please try again.");
    }
}

async function editUser(userId) {
    // Implement user editing functionality
    // You might open a modal with pre-filled user details
    alert(`Edit user: ${userId}`);
}

async function deleteUser(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });

            const data = await response.json();

            if (response.ok) {
                alert("User deleted successfully.");
                loadUsers();
            } else {
                alert(data.message || "Failed to delete user.");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("An error occurred while deleting the user.");
        }
    }
}
