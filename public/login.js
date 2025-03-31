document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("login-form").addEventListener("submit", async (event) => {
        event.preventDefault();
    
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
    
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
    
        const data = await response.json();
        console.log(data);
    
        if (response.ok) {
            window.location.href = "responses.html"; // Redirect on successful login
        } else {
            document.getElementById("error-message").textContent = data.error; 
        }
    });
});