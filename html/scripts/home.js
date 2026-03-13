function showAdminButton(role) {
    const button = document.getElementById("adminPanelButton")

    if (!button) {
        return
    }

    if ((role || "").toLowerCase() === "admin") {
        button.classList.remove("hidden")
    } else {
        button.classList.add("hidden")
    }
}

function formatJoinedDate(timestamp){
    if(!timestamp) return "-"
    const date = new Date(timestamp)
    return date.toLocaleDateString([],{
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    })
}

function fillAccountBox(data) {
    const accountUsername = document.getElementById("accountUsername")
    const accountRole = document.getElementById("accountRole")
    const accountId = document.getElementById("accountId")
    const accountCreated = document.getElementById("accountCreated")

    if (accountUsername) {
        accountUsername.textContent = data.username || "-"
    }

    if (accountRole) {
        accountRole.textContent = data.role || "user"
    }

    if (accountId) {
        accountId.textContent = data.id ?? "-"
    }

    if (accountCreated) {
        accountCreated.textContent = formatJoinedDate(data.created_at)
    }
}

function createThreadElement(thread, isPinned = false) {

    const item = document.createElement("div")
    item.classList.add("thread-item")

    if (isPinned) {
        item.classList.add("pinned")
    }

    item.onclick = () => {
        window.location.href = `/thread.html?id=${thread.id}`
    }

    item.innerHTML = `
        <span class="thread-title">${thread.title}</span>
        <span class="thread-meta">by ${thread.author}</span>
    `

    return item
}

async function loadPinnedThreads() {
    const container = document.getElementById("pinnedThreads")
    if (!container) return

    try {
        const response = await fetch("/api/threads/pinned", {
            method: "GET",
            credentials: "include"
        })

        if (!response.ok) {
            console.error("Failed to load pinned threads")
            return
        }

        const threads = await response.json()
        container.innerHTML = ""

        threads.forEach(thread => {
            container.appendChild(createThreadElement(thread, true))
        })
    } catch (error) {
        console.error("Pinned threads error", error)
    }
}

async function loadLatestThreads() {
    const container = document.getElementById("latestThreads")
    if (!container) return

    try {
        const response = await fetch("/api/threads", {
            method: "GET",
            credentials: "include"
        })

        if (!response.ok) {
            console.error("Failed to load latest threads")
            return
        }

        const threads = await response.json()
        container.innerHTML = ""

        threads.forEach(thread => {
            container.appendChild(createThreadElement(thread, false))
        })
    } catch (error) {
        console.error("Latest threads error", error)
    }
}



function goToAdminPanel() {
    window.location.href = "/admin.html"
}

async function initHomePage() {
    const data = await checkLogin()

    if (!data) return

    showAdminButton(data.role)
    fillAccountBox(data)

    await loadPinnedThreads()
    await loadLatestThreads()

    if (typeof initChat === "function") {
        initChat()
    }
}
