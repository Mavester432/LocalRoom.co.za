// login.js
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

      // Basic validation
      if (!email.includes("@")) {
        alert("Please enter a valid email.");
        return;
      }
      if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
      }

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch user doc from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const role = userData.role || "seeker"; // default to seeker

          alert("Login successful!");

          // Redirect based on role
          if (role === "landlord") {
            window.location.href = "list-room.html";
          } else {
            window.location.href = "listings.html";
          }
        } else {
          alert("User data not found. Please contact support.");
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("Login failed: " + error.message);
      }
    });
  }
});
