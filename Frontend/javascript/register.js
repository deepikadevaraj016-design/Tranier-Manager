document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registerForm");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    const res = await fetch("https://trainer-manager-backend.onrender.com/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    if (res.ok) {
      alert("Registration successful. Please login.");
      window.location.href = "login.html";
    } else {
      alert(data.msg || "Error during registration");
    }
  })
})