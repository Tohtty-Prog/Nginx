function goHome() {
    window.location.href = "/home.html"
}

function formatJoinedDate(timestamp) {
    if (!timestamp) {
        return "-"
    }

    const date = new Date(timestamp)

    return date.toLocaleDateString([], {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    })
}

function updateProfileAvatar(data) {
    const avatar = document.getElementById("profileAvatar")
    if (!avatar) return

    if (data.avatar) {
        avatar.innerHTML = `<img src="${data.avatar}" alt="Profile avatar">`
    } else if (data.username) {
        avatar.textContent = data.username.charAt(0).toUpperCase()
    }
}

async function initProfilePage() {
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

        const username = document.getElementById("profileUsername")
        const id = document.getElementById("profileId")
        const role = document.getElementById("profileRole")
        const joined = document.getElementById("profileJoined")

        if (username) {
            username.textContent = data.username || "Unknown user"
        }

        if (id) {
            id.textContent = data.id ?? "-"
        }

        if (role) {
            role.textContent = data.role || "user"
        }

        if (joined) {
            joined.textContent = formatJoinedDate(data.created_at)
        }

        updateProfileAvatar(data)
    } catch (error) {
        window.location.href = "/index.html"
    }
}