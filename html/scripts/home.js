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

function goToAdminPanel() {
    window.location.href = "/admin.html"
}

async function initHomePage() {
    const data = await checkLogin()

    if (!data) return

    showAdminButton(data.role)

    if (typeof initChat === "function") {
        initChat()
    }
}