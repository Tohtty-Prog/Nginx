let ws = null

function getChatBox() {
    return document.getElementById("chatMessages")
}

function scrollToBottom() {
    const box = getChatBox()
    if (!box) return

    box.scrollTop = box.scrollHeight
}

function formatTimestamp(timestamp) {
    if (!timestamp) return ""

    const date = new Date(timestamp)

    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    })
}

function createMessageElement(msg) {
    const div = document.createElement("div")
    div.classList.add("chat-message")

    const usernameValue = msg.username || "Unknown"
    const messageValue = msg.message || ""

    if (usernameValue === currentUser) {
        div.classList.add("chat-right")
    } else {
        div.classList.add("chat-left")
    }

    const header = document.createElement("div")
    header.classList.add("message-header")

    const username = document.createElement("span")
    username.classList.add("message-user")
    username.textContent = usernameValue

    const time = document.createElement("span")
    time.classList.add("message-time")
    time.textContent = formatTimestamp(msg.timestamp)

    const text = document.createElement("div")
    text.classList.add("message-text")
    text.textContent = messageValue

    header.appendChild(username)
    header.appendChild(time)

    div.appendChild(header)
    div.appendChild(text)

    return div
}

function renderOnlineUsers(users) {
    const container = document.getElementById("onlineUsers")
    const title = document.getElementById("onlineUsersTitle")

    if (title) {
        title.textContent = `Online Users (${users.length})`
    }

    if (!container) return
    container.innerHTML = ""

    if (!users || users.length === 0) {
        container.innerHTML = '<div class="empty-text">No users online</div>'
        return
    }

    users.forEach(user => {
        const row = document.createElement("div")
        row.classList.add("online-user")

        row.onclick = () => {
            if (user.username === currentUser) {
            window.location.href = "/profile.html"
            } else {
            window.location.href = `/profile.html?id=${user.id}`
            }
        }

        const label = user.username === currentUser
            ? `${user.username} (You)`
            : user.username

        row.innerHTML = `
            <span class="online-dot"></span>
            <span>${label}</span>
        `

        container.appendChild(row)
    })
}


function addMessageToChat(msg) {
    const box = getChatBox()
    if (!box) return

    const messageElement = createMessageElement(msg)
    box.appendChild(messageElement)
}

async function loadMessages() {
    const box = getChatBox()
    if (!box) return

    try {
        const response = await fetch("/api/messages", {
            method: "GET",
            credentials: "include"
        })

        if (!response.ok) {
            console.error("Failed to load messages")
            return
        }

        const messages = await response.json()

        box.innerHTML = ""

        messages.forEach(msg => {
            addMessageToChat(msg)
        })

        scrollToBottom()
    } catch (error) {
        console.error("Error loading messages", error)
    }
}

function connectChat() {
    if (ws && ws.readyState === WebSocket.OPEN) {
        return
    }

    const protocol = window.location.protocol === "https:" ? "wss" : "ws"
    ws = new WebSocket(`${protocol}://${window.location.host}/ws/chat`)

    ws.onopen = () => {
        console.log("Chat connected")
    }

    ws.onmessage = (event) => {
        try {
            const msg = JSON.parse(event.data)
            if(msg.type === "online_users") {
                renderOnlineUsers(msg.users)
                return
            }

            if (msg.type === "message") {
                addMessageToChat(msg)
                scrollToBottom()
            }

        } catch (error) {
            console.error("Invalid websocket message", error)
        }
    }

    ws.onerror = (error) => {
        console.error("WebSocket error", error)
    }

    ws.onclose = () => {
        console.log("Chat disconnected")
        ws = null

        setTimeout(() => {
            connectChat()
        }, 3000)
    }
}

function sendMessage() {
    const input = document.getElementById("chatInput")
    if (!input) return

    const text = input.value.trim()

    if (!text) return
    if (!ws || ws.readyState !== WebSocket.OPEN) return

    ws.send(JSON.stringify({
        message: text
    }))

    input.value = ""
}

function handleChatEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault()
        sendMessage()
    }
}

async function initChat() {
    const box = getChatBox()

    if (!box) return

    await loadMessages()
    connectChat()
}