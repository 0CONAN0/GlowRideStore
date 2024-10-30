// profile.js

// Define the API base URL
const API_BASE_URL = "http://localhost:5000"; // Update this if your backend is hosted elsewhere

document.addEventListener("DOMContentLoaded", function () {
    const usernameEl = document.getElementById("username");
    const emailEl = document.getElementById("email");
    const editProfileBtn = document.getElementById("edit-profile-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const editModal = document.getElementById("editModal");
    const closeModalBtn = document.getElementById("closeModal");
    const editProfileForm = document.getElementById("editProfileForm");

    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
    }

    // Load user profile data
    async function loadProfile() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/profile`, { // Updated endpoint
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await response.json();

            if (response.ok) {
                usernameEl.textContent = data.username;
                emailEl.textContent = data.email;
            } else {
                alert(data.message || "Failed to load profile.");
                if (response.status === 401) {
                    // Token might be invalid or expired
                    localStorage.removeItem("token");
                    window.location.href = "login.html";
                }
            }
        } catch (error) {
            console.error("Error loading profile:", error);
            alert("An error occurred while loading your profile. Please try again.");
        }
    }

    // Open edit modal
    editProfileBtn.addEventListener("click", function () {
        editModal.style.display = "flex";
        document.getElementById("edit-username").value = usernameEl.textContent;
        document.getElementById("edit-email").value = emailEl.textContent;
    });

    // Close edit modal
    closeModalBtn.addEventListener("click", function () {
        editModal.style.display = "none";
    });

    // Handle profile update form submission
    editProfileForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const updatedUsername = document.getElementById("edit-username").value.trim();
        const updatedEmail = document.getElementById("edit-email").value.trim();

        try {
            const response = await fetch(`${API_BASE_URL}/api/users/profile`, { // Updated endpoint
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ username: updatedUsername, email: updatedEmail })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Profile updated successfully!");
                loadProfile();
                editModal.style.display = "none";
            } else {
                alert(data.message || "Failed to update profile.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("An error occurred while updating your profile. Please try again.");
        }
    });

    // Handle logout
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });

    // Load profile data on page load
    loadProfile();
});
