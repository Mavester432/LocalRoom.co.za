// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-storage.js";

// ===== Firebase Configuration =====
const firebaseConfig = {
  apiKey: "AIzaSyCqTJ7hNrVqO_mJ4cfqb5fOj-pvqzq7qII",
  authDomain: "localroomapp.firebaseapp.com",
  projectId: "localroomapp",
  storageBucket: "localroomapp.appspot.com",
  messagingSenderId: "232945388743",
  appId: "1:232945388743:web:089083c9f60269406c02e2",
  measurementId: "G-XBC1GV59MF"
};

// ===== Initialize Firebase =====
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ===== Export Modules =====
export { auth, db, storage };
