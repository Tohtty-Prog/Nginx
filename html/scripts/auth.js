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
})