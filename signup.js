import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";

// Toast helper function (same as login.js)
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

    if (!name || !email.includes("@") || password.length < 6) {
      showToast("Please fill out all required fields correctly.", "error");
      return;
    }

    const submitButton = signupForm.querySelector("button");
    submitButton.disabled = true;
    submitButton.textContent = "Signing up...";

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        name,
        email,
        role,
        createdAt: new Date()
      };

      if (role === "landlord") {
        userData.phone = phone;
        userData.business = business;
        userData.address = address;
      }

      await setDoc(doc(db, "users", user.uid), userData);

      showToast("Signup successful! Redirecting...", "success");

      setTimeout(() => {
        if (role === "landlord") {
          window.location.href = "list-room.html";
        } else {
          window.location.href = "listings.html";
        }
      }, 1200);

    } catch (error) {
      console.error("Signup error:", error);
      if (error.code === "auth/email-already-in-use") {
        showToast("This email is already registered. Please log in.", "error");
      } else {
        showToast("Error: " + error.message, "error");
      }
      submitButton.disabled = false;
      submitButton.textContent = "Sign Up";
    }
  });
});
