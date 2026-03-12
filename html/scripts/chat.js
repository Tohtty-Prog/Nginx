let ws = null

async function loadMessages() {
    const box = document.getElementById("chatMessages")

    if (!box) return

    const response = await fetch("/api/messages", {
        method: "GET",
        credentials: "include"
    })

    if (!response.ok) return

    const messages = await response.json()

    box.innerHTML = ""

    messages.forEach(msg => {
        addMessageToChat(msg)
    })

    box.scrollTop = box.scrollHeight
}

function addMessageToChat(msg) {
    const box = document.getElementById("chatMessages")
    if (!box) return

    const div = document.createElement("div")
    div.classList.add("chat-message")

    if (msg.username === currentUser) {
        div.classList.add("chat-right")
    } else {
        div.classList.add("chat-left")
    }

    div.textContent = msg.username + ": " + msg.message
    box.appendChild(div)
}

function connectChat() {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws"
    ws = new WebSocket(`${protocol}://${window.location.host}/ws/chat`)

    ws.onmessage = (event) => {
        const msg = JSON.parse(event.data)
        addMessageToChat(msg)

        const box = document.getElementById("chatMessages")
        box.scrollTop = box.scrollHeight
    }
}

function sendMessage() {
    const input = document.getElementById("chatInput")
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
    await loadMessages()
    connectChat()
}

document.addEventListener("DOMContentLoaded", initChat)