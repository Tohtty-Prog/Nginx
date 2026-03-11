function getEl(id) {
    return document.getElementById(id)
}

function showResult(message) {
    const result = getEl("result")
    if (result) {
        result.textContent = message
    }
}

function clearResult() {
    const result = getEl("result")
    if (result) {
        result.textContent = ""
    }
}

function setFieldError(field, message) {
    const input = getEl(field)
    const error = getEl(field + "-error")

    if (input) {
        input.classList.add("invalid")
    }

    if (error) {
        error.textContent = message
    }
}

function clearFieldError(field) {
    const input = getEl(field)
    const error = getEl(field + "-error")

    if (input) {
        input.classList.remove("invalid")
    }

    if (error) {
        error.textContent = ""
    }
}

function clearAllErrors() {
    clearFieldError("username")
    clearFieldError("password")
    clearFieldError("repassword")
    clearResult()
}

function validateUsername(username) {
    const value = username.trim()

    if (!value) {
        return "Username is required"
    }

    if (value.length < 3) {
        return "Username must be at least 3 characters"
    }

    if (value.length > 20) {
        return "Username can be max 20 characters"
    }

    if (value.includes(" ")) {
        return "Username cannot contain spaces"
    }

    return null
}

function validatePassword(password) {
    if (!password.trim()) {
        return "Password is required"
    }

    if (password.length < 8) {
        return "Password must be at least 8 characters"
    }

    if (password.length > 100) {
        return "Password is too long"
    }

    return null
}

function validateRepeatPassword(password, repeatPassword) {
    if (!repeatPassword.trim()) {
        return "Repeat password is required"
    }

    if (password !== repeatPassword) {
        return "Passwords do not match"
    }

    return null
}

function getBackendErrorMessage(data) {
    if (Array.isArray(data.detail) && data.detail.length > 0) {
        return data.detail[0].msg || "Request failed"
    }

    if (typeof data.detail === "string") {
        return data.detail
    }

    return "Request failed"
}

function showBackendValidationError(data) {
    if (Array.isArray(data.detail) && data.detail.length > 0) {
        const firstError = data.detail[0]
        const field = firstError.loc ? firstError.loc[firstError.loc.length - 1] : null
        const message = firstError.msg || "Invalid input"

        if (field === "username") {
            setFieldError("username", message)
            return
        }

        if (field === "password") {
            setFieldError("password", message)
            return
        }
    }

    showResult(getBackendErrorMessage(data))
}

function validateLoginForm() {
    clearAllErrors()

    const username = getEl("username")?.value || ""
    const password = getEl("password")?.value || ""

    let hasError = false

    const usernameError = validateUsername(username)
    if (usernameError) {
        setFieldError("username", usernameError)
        hasError = true
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
        setFieldError("password", passwordError)
        hasError = true
    }

    return !hasError
}

function validateRegisterForm() {
    clearAllErrors()

    const username = getEl("username")?.value || ""
    const password = getEl("password")?.value || ""
    const repassword = getEl("repassword")?.value || ""

    let hasError = false

    const usernameError = validateUsername(username)
    if (usernameError) {
        setFieldError("username", usernameError)
        hasError = true
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
        setFieldError("password", passwordError)
        hasError = true
    }

    const repeatError = validateRepeatPassword(password, repassword)
    if (repeatError) {
        setFieldError("repassword", repeatError)
        hasError = true
    }

    return !hasError
}