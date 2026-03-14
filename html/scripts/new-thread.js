function goHome() {
    window.location.href = "/home.html"
}

function setThreadResult(message, isError = false) {
    const result = document.getElementById("threadResult")
    if (!result) return

    result.textContent = message
    result.className = isError ? "result error" : "result success"
}

async function initNewThreadPage() {
    const userData = await checkLogin()

    if (!userData) {
        return
    }

    showAdminButton(userData.role)
}

async function createThread() {
    const title = document.getElementById("threadTitle")?.value.trim() || ""
    const content = document.getElementById("threadContent")?.value.trim() || ""

    if (!title || !content) {
        setThreadResult("Title and content are required", true)
        return
    }

    try {
        const response = await fetch("/api/threads", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                title: title,
                content: content
            })
        })

        const data = await response.json()

        if (!response.ok) {
            setThreadResult(data.detail || "Failed to create thread", true)
            return
        }

        window.location.href = `/thread.html?id=${data.thread_id}`
    } catch (error) {
        console.error("Create thread error", error)
        setThreadResult("Server connection failed", true)
    }
}
