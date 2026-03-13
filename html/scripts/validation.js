function getEl(id) {
    return document.getElementById(id)
}

function setResult(message) {
    const result = getEl("result")

    if (!result) {
        return
    }

    result.textContent = message
}

function clearResult() {
    const result = getEl("result")

    if (!result) {
        return
    }

    result.textContent = ""
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
}

function validateUsername(username) {
    if (!username) {
        return "Username is required"
    }

    if (username.length < 3) {
        return "Username must be at least 3 characters"
    }

    if (username.length > 20) {
        return "Username must be at most 20 characters"
    }

    const usernamePattern = /^[a-zA-Z0-9_]+$/

    if (!usernamePattern.test(username)) {
        return "Username can use letters, numbers and underscore"
    }

    return ""
}

function validatePassword(password) {
    if (!password) {
        return "Password is required"
    }

    if (password.length < 8) {
        return "Password must be at least 8 characters"
    }

    if (password.length > 100) {
        return "Password is too long"
    }

    return ""
}

function validateRepassword(password, repassword) {
    if (!repassword) {
        return "Please repeat the password"
    }

    if (password !== repassword) {
        return "Passwords do not match"
    }

    return ""
}

function validateLoginForm(username, password) {
    clearAllErrors()
    clearResult()

    let isValid = true

    if (!username) {
        setFieldError("username", "Username is required")
        isValid = false
    }

    if (!password) {
        setFieldError("password", "Password is required")
        isValid = false
    }

    return isValid
}

function validateRegisterForm(username, password, repassword) {
    clearAllErrors()
    clearResult()

    let isValid = true

    const usernameError = validateUsername(username)
    const passwordError = validatePassword(password)
    const repasswordError = validateRepassword(password, repassword)

    if (usernameError) {
        setFieldError("username", usernameError)
        isValid = false
    }

    if (passwordError) {
        setFieldError("password", passwordError)
        isValid = false
    }

    if (repasswordError) {
        setFieldError("repassword", repasswordError)
        isValid = false
    }

    return isValid
}

function validateSingleField(field) {
    const input = getEl(field)

    if (!input) {
        return
    }

    const value = input.value.trim()

    clearResult()

    if (field === "username") {
        const error = validateUsername(value)

        if (error) {
            setFieldError("username", error)
        } else {
            clearFieldError("username")
        }

        return
    }

    if (field === "password") {
        const passwordValue = getEl("password") ? getEl("password").value : ""
        const error = validatePassword(passwordValue)

        if (error) {
            setFieldError("password", error)
        } else {
            clearFieldError("password")
        }

        const repasswordInput = getEl("repassword")
        if (repasswordInput) {
            validateSingleField("repassword")
        }

        return
    }

    if (field === "repassword") {
        const passwordValue = getEl("password") ? getEl("password").value : ""
        const repasswordValue = getEl("repassword") ? getEl("repassword").value : ""
        const error = validateRepassword(passwordValue, repasswordValue)

        if (error) {
            setFieldError("repassword", error)
        } else {
            clearFieldError("repassword")
        }
    }
}

function setupLiveValidation() {
    const username = getEl("username")
    const password = getEl("password")
    const repassword = getEl("repassword")

    if (username) {
        username.addEventListener("input", function() {
            validateSingleField("username")
        })

        username.addEventListener("blur", function() {
            validateSingleField("username")
        })
    }

    if (password) {
        password.addEventListener("input", function() {
            validateSingleField("password")
        })

        password.addEventListener("blur", function() {
            validateSingleField("password")
        })
    }

    if (repassword) {
        repassword.addEventListener("input", function() {
            validateSingleField("repassword")
        })

        repassword.addEventListener("blur", function() {
            validateSingleField("repassword")
        })
    }
}

document.addEventListener("DOMContentLoaded", function() {
    setupLiveValidation()
})