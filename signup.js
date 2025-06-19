// signup.js
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { auth, db } from "./firebase-config.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");

  // Get role from URL query params: ?role=landlord or ?role=seeker
  const urlParams = new URLSearchParams(window.location.search);
  const role = urlParams.get("role") || "seeker"; // default seeker if not provided

  // Optional: update heading based on role
  const heading = document.querySelector(".form-container h2");
  if (heading) {
    if (role === "landlord") heading.textContent = "Sign Up as a Landlord";
    else if (role === "seeker") heading.textContent = "Sign Up as a Room Seeker";
    else heading.textContent = "Create an Account";
  }

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      // Basic Validation
      if (!name) {
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

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save extra info to Firestore
        await setDoc(doc(db, "users", user.uid), {
          name: name,
          email: email,
          role: role,
          createdAt: new Date()
        });

        alert("Signup successful!");

        // Redirect based on role
        if (role === "landlord") {
          window.location.href = "list-room.html";
        } else {
          window.location.href = "listings.html";
        }
      } catch (error) {
        alert("Error: " + error.message);
      }
    });
  }
});
