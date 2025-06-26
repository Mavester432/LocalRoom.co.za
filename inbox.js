import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  orderBy
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Firebase config (replace with yours if different)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

const messagesContainer = document.getElementById("messages-container");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    messagesContainer.innerHTML = "Please log in to view your inbox.";
    return;
  }

  const messagesRef = collection(db, "messages");
  const q = query(
    messagesRef,
    where("receiverId", "==", user.uid),
    orderBy("timestamp", "desc")
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    messagesContainer.innerHTML = "<p>No messages yet.</p>";
    return;
  }

  let html = "";
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    html += `
      <div class="message-card">
        <p><strong>From:</strong> ${data.senderId}</p>
        <p><strong>Message:</strong> ${data.message}</p>
        <p><small>${new Date(data.timestamp.toDate()).toLocaleString()}</small></p>
      </div>
    `;
  });

  messagesContainer.innerHTML = html;
});
