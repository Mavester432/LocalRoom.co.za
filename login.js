import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// Assuming auth and db are initialized and exposed as window.auth / window.db
const auth = window.auth;
const db = window.db;

// Toast helper
function showToast(message, type = "error") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const submitButton = loginForm.querySelector("button");

    // Basic validation
    if (!email || !password) {
      showToast("Please enter both email and password.", "error");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Logging in...";

    try {
      // Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user data from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) throw new Error("User data not found.");

      const userData = userDoc.data();
      const role = userData.role;

      // Handle redirect if a return URL is stored
      const returnURL = localStorage.getItem("returnURL");
      if (returnURL) {
        localStorage.removeItem("returnURL");
        showToast("Login successful! Redirecting...", "success");
        setTimeout(() => window.location.replace(returnURL), 1000);
        return;
      }

      // Default role-based redirect
      if (role === "landlord") window.location.href = "dashboard.html";
      else if (role === "seeker") window.location.href = "listings.html";
      else throw new Error("Unknown user role.");

    } catch (error) {
      console.error("Login error:", error);
      showToast(error.message || "Login failed.", "error");
      submitButton.disabled = false;
      submitButton.textContent = "Login";
    }
  });
});
