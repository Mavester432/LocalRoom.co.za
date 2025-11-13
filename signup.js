import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";

// ===== Toast Helper =====
function showToast(message, type = "error") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

// ===== Signup Handler =====
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");
  if (!signupForm) return;

  const urlParams = new URLSearchParams(window.location.search);
  const role = urlParams.get("role") || "seeker";

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone")?.value.trim() || "";
    const business = document.getElementById("business")?.value.trim() || "";
    const address = document.getElementById("address")?.value.trim() || "";

    // ===== Basic Validation =====
    if (!name || !email.includes("@") || password.length < 6) {
      showToast("Please fill out all required fields correctly.", "error");
      return;
    }

    const submitButton = signupForm.querySelector("button");
    submitButton.disabled = true;
    submitButton.textContent = "Signing up...";

    try {
      // ===== Create Firebase Auth User =====
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ===== Prepare Firestore User Data =====
      const userData = {
        name,
        email,
        role,
        createdAt: serverTimestamp()  // <--- AUTO TIMESTAMP 🚀
      };

      if (role === "landlord") {
        userData.phone = phone;
        userData.business = business;
        userData.address = address;
      }

      // ===== Save User Data =====
      await setDoc(doc(db, "users", user.uid), userData);

      showToast("Signup successful! Redirecting...", "success");

      // ===== Redirect Based on Role =====
      setTimeout(() => {
        window.location.href = role === "landlord" ? "list-room.html" : "listings.html";
      }, 1200);

    } catch (error) {
      console.error("Signup error:", error);

      if (error.code === "auth/email-already-in-use") {
        showToast("This email is already registered. Please log in.", "error");
      } else {
        showToast(`Error: ${error.message}`, "error");
      }

      submitButton.disabled = false;
      submitButton.textContent = "Sign Up";
    }
  });
});
