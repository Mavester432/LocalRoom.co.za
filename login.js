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

      if (!email.includes("@")) return alert("Please enter a valid email.");
      if (password.length < 6) return alert("Password must be at least 6 characters.");

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get user role from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const role = userData.role;

          if (role === "landlord") {
            window.location.href = "list-room.html";
          } else if (role === "seeker") {
            window.location.href = "listings.html";
          } else {
            alert("Invalid user role. Contact support.");
          }
        } else {
          alert("No user data found. Please contact support.");
        }

      } catch (error) {
        alert("Login failed: " + error.message);
      }
    });
  }
});
