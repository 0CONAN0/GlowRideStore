// js/admin/manageUsers.js

document.addEventListener("DOMContentLoaded", () => {
    loadUsers();
});

async function loadUsers() {
    const response = await fetch("http://localhost:5000/api/users", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });

    if (response.ok) {
        const users = await response.json();
        const usersTableBody = document.getElementById("usersTableBody");
        usersTableBody.innerHTML = "";

        users.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button onclick="editUser('${user.id}')">Edit</button>
                    <button onclick="deleteUser('${user.id}')">Delete</button>
                </td>
            `;
            usersTableBody.appendChild(row);
        });
    } else {
        console.error("Failed to load users");
    }
}

async function editUser(userId) {
    // Implement edit functionality here
    alert(`Edit user: ${userId}`);
}

async function deleteUser(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });

        if (response.ok) {
            alert("User deleted successfully");
            loadUsers();
        } else {
            alert("Failed to delete user");
        }
    }
}
