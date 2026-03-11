let selectedResetUser = null

async function register() {
    if (!validateRegisterForm()) {
        return
    }

    const username = getEl("username").value.trim()
    const password = getEl("password").value

    try {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })

        const data = await response.json()

        if (response.ok) {
            showResult("User created")
            window.location.href = "/index.html"
            return
        }

        showBackendValidationError(data)
    } catch (error) {
        console.error(error)
        showResult("Request failed")
    }
}

async function login() {
    if (!validateLoginForm()) {
        return
    }

    const username = getEl("username").value.trim()
    const password = getEl("password").value

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

        showResult(getBackendErrorMessage(data))
    } catch (error) {
        console.error(error)
        showResult("Request failed")
    }
}

async function checkLogin() {
    const usernameDisplay = getEl("usernameDisplay")
    const roleDisplay = getEl("roleDisplay")
    const accountUsername = getEl("accountUsername")
    const accountRole = getEl("accountRole")
    const adminPanel = getEl("adminPanel")

    try {
        const response = await fetch("/api/me", {
            credentials: "include"
        })

        if (!response.ok) {
            window.location.href = "/index.html"
            return
        }

        const data = await response.json()

        if (usernameDisplay) {
            usernameDisplay.textContent = data.username
        }

        if (roleDisplay) {
            roleDisplay.textContent = data.role || "user"
        }

        if (accountUsername) {
            accountUsername.textContent = data.username
        }

        if (accountRole) {
            accountRole.textContent = data.role || "user"
        }

        if (data.role === "admin" && adminPanel) {
            adminPanel.style.display = "block"
            loadUsers()
        }

        showResult(`Welcome ${data.username}`)
    } catch (error) {
        console.error(error)
        window.location.href = "/index.html"
    }
}

async function logout() {
    try {
        await fetch("/api/logout", {
            method: "POST",
            credentials: "include"
        })
    } catch (error) {
        console.error(error)
    }

    window.location.href = "/index.html"
}

function sendFakeMessage() {
    const chatInput = getEl("chatInput")
    const chatBox = getEl("chatBox")

    if (!chatInput || !chatBox) {
        return
    }

    const message = chatInput.value.trim()

    if (!message) {
        return
    }

    const div = document.createElement("div")
    div.className = "msg"
    div.textContent = message
    chatBox.appendChild(div)

    chatInput.value = ""
    chatBox.scrollTop = chatBox.scrollHeight
}

function clearChat() {
    const chatBox = getEl("chatBox")

    if (!chatBox) {
        return
    }

    chatBox.innerHTML = `<div class="msg system-message">Chat cleared.</div>`
}

async function loadProfile() {
    try {
        const response = await fetch("/api/me", {
            credentials: "include"
        })

        const data = await response.json()

        if (!response.ok) {
            showResult("Could not load profile")
            return
        }

        showResult(`Profile loaded: ${data.username} (${data.role || "user"})`)
    } catch (error) {
        console.error(error)
        showResult("Request failed")
    }
}

async function loadNotifications() {
    showResult("Notifications feature not added yet")
}

async function pingServer() {
    try {
        const response = await fetch("/api/me", {
            credentials: "include"
        })

        if (response.ok) {
            showResult("Server is online")
            return
        }

        showResult("Server responded with error")
    } catch (error) {
        console.error(error)
        showResult("Server is offline")
    }
}

async function loadUsers() {
    const usersList = getEl("usersList")

    if (!usersList) {
        return
    }

    usersList.innerHTML = "<p>Loading users...</p>"

    try {
        const response = await fetch("/api/admin/users", {
            credentials: "include"
        })

        const data = await response.json()

        if (!response.ok) {
            usersList.innerHTML = "<p>Failed to load users.</p>"
            showResult(getBackendErrorMessage(data))
            return
        }

        if (!data.users || data.users.length === 0) {
            usersList.innerHTML = "<p>No users found.</p>"
            return
        }

        usersList.innerHTML = ""

        data.users.forEach((user) => {
            const userDiv = document.createElement("div")
            userDiv.className = "user-item"

            userDiv.innerHTML = `
                <div class="user-meta">
                    <div class="user-name">${escapeHtml(user.username)}</div>
                    <div class="user-role">Role: ${escapeHtml(user.role || "user")}</div>
                </div>
                <div class="user-actions">
                    <button type="button" onclick="openResetPasswordModal('${escapeForSingleQuote(user.username)}')">
                        Reset password
                    </button>
                </div>
            `

            usersList.appendChild(userDiv)
        })
    } catch (error) {
        console.error(error)
        usersList.innerHTML = "<p>Request failed.</p>"
    }
}

function openResetPasswordModal(username) {
    selectedResetUser = username

    const modal = getEl("resetPasswordModal")
    const usernameText = getEl("resetPasswordUsername")
    const passwordInput = getEl("resetPasswordInput")
    const confirmInput = getEl("resetPasswordConfirmInput")
    const errorText = getEl("resetPasswordError")

    if (usernameText) {
        usernameText.textContent = username
    }

    if (passwordInput) {
        passwordInput.value = ""
    }

    if (confirmInput) {
        confirmInput.value = ""
    }

    if (errorText) {
        errorText.textContent = ""
    }

    if (modal) {
        modal.classList.remove("hidden")
    }

    if (passwordInput) {
        passwordInput.focus()
    }
}

function closeResetPasswordModal() {
    selectedResetUser = null

    const modal = getEl("resetPasswordModal")
    const errorText = getEl("resetPasswordError")

    if (errorText) {
        errorText.textContent = ""
    }

    if (modal) {
        modal.classList.add("hidden")
    }
}

async function submitResetPassword() {
    const passwordInput = getEl("resetPasswordInput")
    const confirmInput = getEl("resetPasswordConfirmInput")
    const errorText = getEl("resetPasswordError")

    if (!selectedResetUser || !passwordInput || !confirmInput || !errorText) {
        return
    }

    const newPassword = passwordInput.value
    const confirmPassword = confirmInput.value

    errorText.textContent = ""

    if (newPassword.length < 8) {
        errorText.textContent = "Password must be at least 8 characters."
        return
    }

    if (newPassword !== confirmPassword) {
        errorText.textContent = "Passwords do not match."
        return
    }

    try {
        const response = await fetch("/api/admin/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                username: selectedResetUser,
                new_password: newPassword
            })
        })

        const data = await response.json()

        if (!response.ok) {
            errorText.textContent = getBackendErrorMessage(data)
            return
        }

        closeResetPasswordModal()
        showResult(`Password reset for ${selectedResetUser}`)
    } catch (error) {
        console.error(error)
        errorText.textContent = "Request failed"
    }
}

function changeOwnPassword() {
    showResult("Own password change not added yet")
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;")
}

function escapeForSingleQuote(value) {
    return String(value)
        .replaceAll("\\", "\\\\")
        .replaceAll("'", "\\'")
}

function setupLiveValidation() {
    const usernameInput = getEl("username")
    const passwordInput = getEl("password")
    const repasswordInput = getEl("repassword")

    if (usernameInput) {
        usernameInput.addEventListener("input", () => {
            clearFieldError("username")
            clearResult()

            const username = usernameInput.value
            if (username.length === 0) {
                return
            }

            const error = validateUsername(username)
            if (error) {
                setFieldError("username", error)
            }
        })
    }

    if (passwordInput) {
        passwordInput.addEventListener("input", () => {
            clearFieldError("password")
            clearResult()

            const password = passwordInput.value
            if (password.length > 0) {
                const error = validatePassword(password)
                if (error) {
                    setFieldError("password", error)
                }
            }

            if (repasswordInput) {
                clearFieldError("repassword")

                const repassword = repasswordInput.value
                if (repassword.length > 0) {
                    const repeatError = validateRepeatPassword(password, repassword)
                    if (repeatError) {
                        setFieldError("repassword", repeatError)
                    }
                }
            }
        })
    }

    if (repasswordInput) {
        repasswordInput.addEventListener("input", () => {
            clearFieldError("repassword")
            clearResult()

            const password = passwordInput ? passwordInput.value : ""
            const repassword = repasswordInput.value

            if (repassword.length === 0) {
                return
            }

            const error = validateRepeatPassword(password, repassword)
            if (error) {
                setFieldError("repassword", error)
            }
        })
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setupLiveValidation()

    const modal = getEl("resetPasswordModal")
    if (modal) {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeResetPasswordModal()
            }
        })
    }
})