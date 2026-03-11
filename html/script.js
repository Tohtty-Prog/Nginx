async function register(){
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    const retype = document.getElementById("repassword").value
    if(password !== retype){
        document.getElementById("result").textContent = "Password dont match"
        return
    }
    if (!password || !username){
            document.getElementById("result").textContent = "Fill all fields"
            return
    }
    try {
        const response = await fetch("/api/register",{
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password,
            })
        })
        const data = await response.json()
        if(response.ok){
            document.getElementById("result").textContent = "User created"
            window.location.href = "/index.html"
        }else{
            document.getElementById("result").textContent = data.detail || "Register failed"
        }

    }catch(error){
        console.error(error)
        document.getElementById("result").textContent = "Request failed"
    }
}
async function login() {
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })

        const data = await response.json()
        if (data.token) {
            localStorage.setItem("token", data.token)
            window.location.href = "/home.html"
        } else {
            document.getElementById("result").textContent = "Wrong login"
        }
    } catch (error) {
        console.error(error)
        document.getElementById("result").textContent = "Request failed"
    }
}

async function checkLogin() {

    const token = localStorage.getItem("token")

    if (!token) {
        window.location.href = "/index.html"
        return
    }

    try {

        const response = await fetch("/api/me", {
            headers: {
                "Authorization": "Bearer " + token
            }
        })

        if (response.status !== 200) {
            window.location.href = "/index.html"
        }

    } catch (error) {

        console.error(error)
        window.location.href = "/index.html"

    }
}


function logout() {

    localStorage.removeItem("token")
    window.location.href = "/index.html"

}