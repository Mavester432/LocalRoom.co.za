// login.js
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { auth } from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      // Basic validation
      if (!email.includes("@")) {
        alert("Please enter a valid email.");
        return;
      }

      if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
      }

      // Firebase login
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log("Login successful:", userCredential.user);
          alert("Login successful!");
          window.location.href = "listings.html";
        })
        .catch((error) => {
          console.error("Login error:", error);
          alert("Login failed: " + error.message);
        });
    });
  }
});
