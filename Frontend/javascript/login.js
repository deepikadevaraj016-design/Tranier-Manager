document.addEventListener("DOMContentLoaded", function () {
const form = document.getElementById("loginForm");
form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const res = await fetch("http://localhost:5500/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        alert("Login successful!"); 
        window.location.href = "index.html";
      } else {
        alert(data.msg || "Login failed");
      }
    })
  })