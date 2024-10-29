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


    document.getElementById("editProfileForm").addEventListener("submit", async (e) => {
        e.preventDefault();
    
        const updatedProfile = {
            username: document.getElementById("username").value,
            email: document.getElementById("email").value,
        };
    
        try {
            const response = await fetch("http://localhost:5000/api/users/update-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(updatedProfile),
            });
    
            if (response.ok) {
                alert("Profile updated successfully");
            } else {
                console.error("Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    });
    

    // Load user profile data
    async function loadProfile() {
        const response = await fetch("/api/profile", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();

        if (response.ok) {
            usernameEl.textContent = data.username;
            emailEl.textContent = data.email;
        } else {
            alert("Failed to load profile.");
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
        const updatedUsername = document.getElementById("edit-username").value;
        const updatedEmail = document.getElementById("edit-email").value;

        const response = await fetch("/api/profile", {
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
    });

    // Handle logout
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });

    // Load profile data on page load
    loadProfile();
});
