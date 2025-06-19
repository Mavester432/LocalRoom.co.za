import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { auth, db } from "./firebase-config.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");

  // Get role from query string
  const urlParams = new URLSearchParams(window.location.search);
  const role = urlParams.get("role") || "seeker";

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      if (!name) return alert("Please enter your name.");
      if (!email.includes("@")) return alert("Please enter a valid email.");
      if (password.length < 6) return alert("Password must be at least 6 characters.");

      // Additional landlord fields
      let phone = "", business = "", address = "";

      if (role === "landlord") {
        phone = document.getElementById("phone").value.trim();
        business = document.getElementById("business").value.trim();
        address = document.getElementById("address").value.trim();

        if (!phone) return alert("Please enter your phone number.");
        if (!address) return alert("Please enter your address.");
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user info in Firestore
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
