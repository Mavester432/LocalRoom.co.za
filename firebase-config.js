// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCqTJ7hNrVqO_mJ4cfqb5fOj-pvqzq7qII",
  authDomain: "localroomapp.firebaseapp.com",
  projectId: "localroomapp",
  storageBucket: "localroomapp.firebasestorage.app",
  messagingSenderId: "232945388743",
  appId: "1:232945388743:web:089083c9f60269406c02e2",
  measurementId: "G-XBC1GV59MF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
