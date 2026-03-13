function goHome() {
    window.location.href = "/home.html"
}

function getThreadIdFromUrl() {
    const params = new URLSearchParams(window.location.search)
    return params.get("id")
}

function formatThreadDate(timestamp) {
    if (!timestamp) return "-"

    const date = new Date(timestamp)

    return date.toLocaleString([], {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    })
}

async function initThreadPage() {
    const userData = await checkLogin()

    if (userData) {
        showAdminButton(userData.role)
    }

    const threadId = getThreadIdFromUrl()

    if (!threadId) {
        window.location.href = "/home.html"
        return
    }

    try {
        const response = await fetch(`/api/threads/${threadId}`, {
            method: "GET",
            credentials: "include"
        })

        if (!response.ok) {
            window.location.href = "/home.html"
            return
        }

        const thread = await response.json()

        document.getElementById("threadTitle").textContent = thread.title
        document.getElementById("threadMeta").textContent =
            `by ${thread.author} • ${formatThreadDate(thread.created_at)}`
        document.getElementById("threadContent").textContent = thread.content

    } catch (error) {
        console.error("Failed to load thread", error)
        window.location.href = "/home.html"
    }
}

