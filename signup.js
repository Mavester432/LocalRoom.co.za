// signup.js
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { auth } from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      // Basic Validation
      if (name.trim() === "") {
        alert("Please enter your name.");
        return;
      }

      if (!email.includes("@")) {
        alert("Please enter a valid email.");
        return;
      }

      if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
      }

      // Firebase Signup
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log("Signup successful:", userCredential.user);
          alert("Signup successful!");
          window.location.href = "listings.html"; // Redirect after signup
        })
        .catch((error) => {
          console.error("Signup error:", error);
          alert(error.message);
        });
    });
  }
});
