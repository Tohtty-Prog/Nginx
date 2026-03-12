let currentUser = null

async function login() {
    const username = document.getElementById("username").value.trim()
    const password = document.getElementById("password").value

    if (!validateLoginForm(username, password)) {
        return
    }

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                username: username,
                password: password
            })
        })

        const data = await response.json()

        if (response.ok) {
            window.location.href = "/home.html"
            return
        }

        setResult(data.detail || "Login failed")
    } catch (error) {
        setResult("Server connection failed")
    }
}

async function register() {
    const username = document.getElementById("username").value.trim()
    const password = document.getElementById("password").value
    const repassword = document.getElementById("repassword").value

    if (!validateRegisterForm(username, password, repassword)) {
        return
    }

    try {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                username: username,
                password: password
            })
        })

        const data = await response.json()

        if (response.ok) {
            window.location.href = "/index.html"
            return
        }

        setResult(data.detail || "Register failed")
    } catch (error) {
        setResult("Server connection failed")
    }
}

async function checkLogin() {
    const usernameDisplay = document.getElementById("usernameDisplay")
    const dropdownUsername = document.getElementById("dropdownUsername")
    const roleDisplay = document.getElementById("roleDisplay")
    const result = document.getElementById("result")
    const avatarCircle = document.getElementById("avatarCircle")

    try {
        const response = await fetch("/api/me", {
            method: "GET",
            credentials: "include"
        })

        if (!response.ok) {
            window.location.href = "/index.html"
            return
        }

        const data = await response.json()

        currentUser = data.username

        if (usernameDisplay) {
            usernameDisplay.textContent = data.username
        }

        if (dropdownUsername) {
            dropdownUsername.textContent = data.username
        }

        if (roleDisplay) {
            roleDisplay.textContent = data.role || "user"
        }

        if (result) {
            result.textContent = "Welcome " + data.username
        }

        if (avatarCircle && data.username) {
            avatarCircle.textContent = data.username.charAt(0).toUpperCase()
        }

        if (typeof loadMessages === "function") {
            loadMessages()
        }
    } catch (error) {
        window.location.href = "/index.html"
    }
}

async function logout() {
    try {
        const response = await fetch("/api/logout", {
            method: "POST",
            credentials: "include"
        })

        if (response.ok) {
            window.location.href = "/index.html"
            return
        }

        setResult("Logout failed")
    } catch (error) {
        setResult("Server connection failed")
    }
}