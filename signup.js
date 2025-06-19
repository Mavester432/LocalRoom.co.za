// signup.js
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");

  const urlParams = new URLSearchParams(window.location.search);
  const role = urlParams.get("role") || "seeker";

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      const phone = document.getElementById("phone")?.value.trim() || "";
      const business = document.getElementById("business")?.value.trim() || "";
      const address = document.getElementById("address")?.value.trim() || "";

      // Basic validation
      if (!name || !email.includes("@") || password.length < 6) {
        alert("Please fill out all required fields correctly.");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userData = {
          name,
          email,
          role,
          createdAt: new Date(),
        };

        if (role === "landlord") {
          userData.phone = phone;
          userData.business = business;
          userData.address = address;
        }

        await setDoc(doc(db, "users", user.uid), userData);

        alert("Signup successful!");

        // Redirect
        if (role === "landlord") {
          window.location.href = "list-room.html";
        } else {
          window.location.href = "listings.html";
        }
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          alert("This email is already registered. Please log in instead.");
        } else {
          console.error(error);
          alert("Signup failed: " + error.message);
        }
      }
    });
  }
});
