function getEl(id) {
    return document.getElementById(id)
}

function clearError(field) {
    const errorEl = getEl(field + "-error")
    if (errorEl) {
        errorEl.textContent = ""
    }
}

function setError(field, message) {
    const errorEl = getEl(field + "-error")
    if (errorEl) {
        errorEl.textContent = message
    }
}

function clearResult() {
    const result = getEl("result")
    if (result) {
        result.textContent = ""
    }
}

function setResult(message) {
    const result = getEl("result")
    if (result) {
        result.textContent = message
    }
}

function clearAuthErrors() {
    clearError("username")
    clearError("password")
    clearError("repassword")
    clearResult()
}

function validateLoginForm(username, password) {
    let ok = true

    clearAuthErrors()

    if (username.length < 3) {
        setError("username", "Username must be at least 3 characters")
        ok = false
    }

    if (password.length < 8) {
        setError("password", "Password must be at least 8 characters")
        ok = false
    }

    return ok
}

function validateRegisterForm(username, password, repassword) {
    let ok = true

    clearAuthErrors()

    if (username.length < 3) {
        setError("username", "Username must be at least 3 characters")
        ok = false
    }

    if (password.length < 8) {
        setError("password", "Password must be at least 8 characters")
        ok = false
    }

    if (password !== repassword) {
        setError("repassword", "Passwords do not match")
        ok = false
    }

    return ok
}