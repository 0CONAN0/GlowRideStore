import { API_BASE_URL } from './config.js';

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem("userRole") || getUserRoleFromToken(token);

    toggleAuthLinks(userRole);

    document.getElementById("logoutButton")?.addEventListener("click", async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                localStorage.removeItem("token");
                localStorage.removeItem("userRole");

                toggleAuthLinks(null);
                window.location.href = "index.html";
            } else {
                throw new Error('Failed to logout.');
            }
        } catch (error) {
            console.error("Logout Error:", error);
            alert("An error occurred while logging out. Please try again.");
        }
    });
});

function toggleAuthLinks(role) {
    const loginLink = document.getElementById("loginLink");
    const profileLink = document.getElementById("profileLink");
    const logoutLink = document.getElementById("logoutLink");
    const adminPanelLink = document.getElementById("adminPanelLink");

    if (loginLink) loginLink.style.display = role ? "none" : "block";
    if (profileLink) profileLink.style.display = role ? "block" : "none";
    if (logoutLink) logoutLink.style.display = role ? "block" : "none";
    if (adminPanelLink) adminPanelLink.style.display = role === "admin" ? "block" : "none";
}

function getUserRoleFromToken(token) {
    if (!token) return null;
    try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = atob(payloadBase64);
        const payload = JSON.parse(decodedPayload);
        return payload.role;
    } catch (error) {
        console.error("Token parsing error:", error);
        return null;
    }
}
