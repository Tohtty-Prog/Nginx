let currentUser = null
let currentUserId = null
let currentRole = null
let currentCreatedAt = null

function prepareFormState() {
    if (typeof clearResult === "function") {
        clearResult()
    }

    if (typeof clearAllErrors === "function") {
        clearAllErrors()
    }
}

function showRequestError(message) {
    if (typeof setResult === "function") {
        setResult(message)
    } else {
        console.error(message)
    }
}

async function login() {
    const username = document.getElementById("username")?.value.trim() || ""
    const password = document.getElementById("password")?.value || ""

    prepareFormState()

    if (typeof validateLoginForm === "function") {
        if (!validateLoginForm(username, password)) {
            return
        }
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

        showRequestError(data.detail || "Login failed")
    } catch (error) {
        showRequestError("Server connection failed")
    }
}

async function register() {
    const username = document.getElementById("username")?.value.trim() || ""
    const password = document.getElementById("password")?.value || ""
    const repassword = document.getElementById("repassword")?.value || ""

    prepareFormState()

    if (typeof validateRegisterForm === "function") {
        if (!validateRegisterForm(username, password, repassword)) {
            return
        }
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

        showRequestError(data.detail || "Register failed")
    } catch (error) {
        showRequestError("Server connection failed")
    }
}

function updateAvatar(data) {
    const avatarCircle = document.getElementById("avatarCircle")
    if (!avatarCircle) return

    if (data.avatar) {
        avatarCircle.innerHTML =
            `<img src="${data.avatar}" alt="Avatar" onerror="this.remove()">`
    } else if (data.username) {
        avatarCircle.textContent = data.username.charAt(0).toUpperCase()
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
            return null
        }

        const data = await response.json()

        currentUser = data.username
        currentUserId = data.id
        currentRole = data.role || "user"
        currentCreatedAt = data.created_at || null

        if (usernameDisplay) {
            usernameDisplay.textContent = data.username
        }

        if (dropdownUsername) {
            dropdownUsername.textContent = data.username
        }

        if (roleDisplay) {
            roleDisplay.textContent = currentRole
        }

        if (result) {
            result.textContent = "Welcome " + data.username
        }
        updateAvatar(data)

        return {
            username: data.username,
            role: currentRole
        }
    } catch (error) {
        window.location.href = "/index.html"
        return null
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

        showRequestError("Logout failed")
    } catch (error) {
        showRequestError("Server connection failed")
    }
}