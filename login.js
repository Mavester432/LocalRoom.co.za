import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { auth, db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// ===== Toast Function =====
function showToast(message, type = "error") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.classList.add("toast", type);
  toast.textContent = message;

  container.appendChild(toast);

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ===== Login Form =====
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const loginButton = loginForm.querySelector("button");

    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";

    // Basic validation
    if (!email.includes("@")) {
      showToast("Please enter a valid email.", "error");
      loginButton.disabled = false;
      loginButton.textContent = "Login";
      return;
    }
    if (password.length < 6) {
      showToast("Password must be at least 6 characters.", "error");
      loginButton.disabled = false;
      loginButton.textContent = "Login";
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        showToast("No user data found. Please contact support.", "error");
        loginButton.disabled = false;
        loginButton.textContent = "Login";
        return;
      }

      const userData = userDoc.data();
      const role = userData.role;

      if (role === "landlord") {
        showToast("Login successful! Redirecting to dashboard...", "success");
        setTimeout(() => {
          window.location.href = "dashboard.html"; // Direct to dashboard
        }, 1200);
      } else if (role === "seeker") {
        showToast("Login successful! Redirecting to listings...", "success");
        setTimeout(() => {
          window.location.href = "listings.html";
        }, 1200);
      } else {
        showToast("Unknown role. Please contact support.", "error");
        loginButton.disabled = false;
        loginButton.textContent = "Login";
      }

    } catch (error) {
      let message = "Login failed.";
      if (error.code === "auth/user-not-found") {
        message = "No user found with this email.";
      } else if (error.code === "auth/wrong-password") {
        message = "Incorrect password.";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email format.";
      }
      showToast(message, "error");
      loginButton.disabled = false;
      loginButton.textContent = "Login";
    }
  });
});
