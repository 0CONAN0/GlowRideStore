document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const email = loginForm.email.value;
            const password = loginForm.password.value;

            const response = await fetch("/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token); // Store JWT token
                alert("Logged in successfully!");
                window.location.href = "/profile.html"; // Redirect after login
            } else {
                alert(data.message || "Login failed");
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const username = signupForm.username.value;
            const email = signupForm.email.value;
            const password = signupForm.password.value;

            const response = await fetch("/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token); // Store JWT token
                alert("Signed up successfully!");
                window.location.href = "/profile.html"; // Redirect after signup
            } else {
                alert(data.message || "Signup failed");
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const signInForm = document.getElementById("signInForm");
    const signUpForm = document.getElementById("signUpForm");

    if (signInForm) {
        signInForm.addEventListener("submit", handleSignIn);
    }

    if (signUpForm) {
        signUpForm.addEventListener("submit", handleSignUp);
    }
});


async function handleSignIn(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("token", data.token);
            window.location.href = "profile.html";
        } else {
            alert(data.message || "Login failed");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function handleSignUp(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert("Signup successful! Please log in.");
            window.location.href = "login.html";
        } else {
            alert(data.message || "Signup failed");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
