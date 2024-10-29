// auth.js

document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const newUser = {
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
    };

    try {
        const response = await fetch("http://localhost:5000/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.token);
            window.location.href = "profile.html";  // Redirect to profile or other desired page
        } else {
            console.error("Failed to sign up");
        }
    } catch (error) {
        console.error("Error during signup:", error);
    }
});






// Login function
async function login(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("token", data.token);
            alert("Login successful!");
            window.location.href = "index.html"; // Redirect to homepage
        } else {
            alert(data.message || "Login failed.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
