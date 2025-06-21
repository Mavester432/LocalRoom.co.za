import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { auth, db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const loginButton = loginForm.querySelector("button");

      // Disable button to prevent double clicks
      loginButton.disabled = true;
      loginButton.textContent = "Logging in...";

      // Simple validation
      if (!email.includes("@")) {
        alert("Please enter a valid email.");
        loginButton.disabled = false;
        loginButton.textContent = "Login";
        return;
      }
      if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        loginButton.disabled = false;
        loginButton.textContent = "Login";
        return;
      }

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User logged in:", user.uid);

        // Fetch user document from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          alert("No user data found. Please contact support.");
          return;
        }

        const userData = userDoc.data();
        const role = userData.role;

        console.log("User role:", role);

        if (role === "landlord") {
          window.location.href = "landlord-home.html";
        } else if (role === "seeker") {
          window.location.href = "listings.html";
        } else {
          alert("Unknown role. Please contact support.");
        }

      } catch (error) {
        console.error("Login error:", error);
        let message = "Login failed.";
        if (error.code === "auth/user-not-found") {
          message = "No user found with this email.";
        } else if (error.code === "auth/wrong-password") {
          message = "Incorrect password.";
        } else if (error.code === "auth/invalid-email") {
          message = "Invalid email format.";
        }
        alert(message);
      } finally {
        loginButton.disabled = false;
        loginButton.textContent = "Login";
      }
    });
  }
});
