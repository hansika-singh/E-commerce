console.log("Authentication system loaded successfully!");
const API_BASE = "http://localhost:5000/api";
const notify = (message, type = "info") => {
    if (typeof showToast === "function") {
        showToast(message, type);
    } else {
        alert(message);
    }
};

// =============================
// BACKEND AUTH FUNCTIONS
// =============================

const signupUser = async (name, email, password) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            email,
            password
        })
    });
    return await res.json();
};

const loginUser = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });
    return await res.json();
};

// =============================
// EMAIL SIGNUP
// =============================

const signupForm = document.getElementById("signup-form");
if(signupForm){
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("signup-name").value.trim();
        const email = document.getElementById("signup-email").value.trim();
        const password = document.getElementById("signup-password").value;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name) {
            notify("Name is required", "error");
            return;
        }

        if (!emailRegex.test(email)) {
            notify("Enter a valid email", "error");
            return;
        }

        if (password.length < 8) {
            notify("Password must be at least 8 characters", "error");
            return;
        }
        try {
            const response = await signupUser(name, email, password);
            if(response.success){
                notify("Account Created Successfully!", "success");
                window.location.href = "signin.html";
            } else {
                notify(response.message, "error");
            }
        } catch(error){
            console.error(error);
            notify("Signup failed. Please try again.", "error");
        }
    });
}

// =============================
// EMAIL SIGNIN
// =============================

const signinForm = document.getElementById("signin-form");
if(signinForm){
    signinForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("signin-email").value.trim();
        const password = document.getElementById("signin-password").value;
        try {
            const response = await loginUser(email, password);
            if(response.success){
                // Store auth data
                localStorage.setItem("token", response.accessToken);
                localStorage.setItem("refreshToken", response.refreshToken);
                localStorage.setItem("user", JSON.stringify(response.user));

                notify("Login Successful!", "success");

                window.location.href = "index.html";
            } else {
                notify(response.message, "error");
            }
        } catch(error){
            console.error(error);
            notify("Login failed. Please try again.", "error");
        }
    });
}

// =============================
// AUTH NAVBAR PROFILE SYSTEM (JWT)
// =============================

const token = localStorage.getItem("token");
const authLink = document.getElementById("auth-link");
const dropdown = document.getElementById("profile-dropdown");
const logoutBtn = document.getElementById("logout-btn");

if(authLink){
    if(token){
        authLink.innerHTML = `<i class="fas fa-user"></i>`;
        authLink.href = "#";
        authLink.classList.add("profile-active");

        // Toggle Dropdown
        authLink.addEventListener("click", (e) => {
            e.preventDefault();
            if(dropdown) dropdown.classList.toggle("active");
        });

        // Logout
        if(logoutBtn){
            logoutBtn.addEventListener("click", () => {
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");

                window.location.href = "index.html";
            });
        }

        // Close Dropdown on outside click
        document.addEventListener("click", (e) => {
            if(!e.target.closest(".profile-wrapper")){
                if(dropdown) dropdown.classList.remove("active");
            }
        });
    } else {
        authLink.innerHTML = "Sign In";
        authLink.href = "signin.html";
        authLink.classList.remove("profile-active");
        if(dropdown) dropdown.classList.remove("active");
    }
}