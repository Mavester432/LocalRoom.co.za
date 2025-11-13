import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const auth = window.auth;
const db = window.db;

function showToast(message, type="error") {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast";
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
    const button = loginForm.querySelector("button");
    button.disabled = true;
    button.textContent = "Logging in...";

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) throw new Error("User data not found");

      const userData = userDoc.data();
      const role = userData.role;

      // Return URL logic
      const returnURL = localStorage.getItem("returnURL");
      if (returnURL) {
        localStorage.removeItem("returnURL");
        showToast("Login successful! Redirecting...", "success");
        setTimeout(() => { window.location.replace(returnURL); }, 1000);
        return;
      }

      // Default role-based redirect
      if (role === "landlord") window.location.href = "dashboard.html";
      else if (role === "seeker") window.location.href = "listings.html";
      else throw new Error("Unknown role");

    } catch (err) {
      showToast(err.message || "Login failed");
      button.disabled = false;
      button.textContent = "Login";
    }
  });
});
