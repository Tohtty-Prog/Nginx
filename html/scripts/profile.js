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

function fillProfile(data) {
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
}

function getProfileIdFromUrl() {
    const params = new URLSearchParams(window.location.search)
    return params.get("id")
}

async function set_Avatar() {
    const fileInput = document.getElementById("avatarUpload")

    if (!fileInput || !fileInput.files.length) {
        return
    }

    const file = fileInput.files[0]

    const formData = new FormData()
    formData.append("avatar", file)

    try {
        const response = await fetch("/api/me/avatar", {
            method: "POST",
            credentials: "include",
            body: formData
        })

        if (!response.ok) {
            console.error("Avatar upload failed:", response.status)
            return
        }

        await initProfilePage()
    } catch (error) {
        console.error("Avatar upload error:", error)
    }
}


async function initProfilePage() {
    try {
        const profileId = getProfileIdFromUrl()
        const uploadSection = document.getElementById("avatarUploadSection")

        let response

        if (profileId) {
            if(uploadSection) {
                uploadSection.style.display = "none"
            }
            response = await fetch(`/api/users/${profileId}`, {
                method: "GET",
                credentials: "include"
            })
        } else {
            response = await fetch("/api/me", {
                method: "GET",
                credentials: "include"
            })
        }

        if (!response.ok) {
            console.log("Failed to load profile:", response.status)
            return
        }

        const data = await response.json()
        fillProfile(data)
    } catch (error) {
        console.error("Profile page error:", error)
    }
}
