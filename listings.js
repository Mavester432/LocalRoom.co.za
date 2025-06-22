// listings.js

// Initialize Firebase (replace with your own config)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Get the container where listings will be shown
const listingsContainer = document.querySelector('.listings-container');

// Fetch all room listings from the shared 'rooms' collection
db.collection('rooms').get()
  .then((querySnapshot) => {
    if (querySnapshot.empty) {
      listingsContainer.innerHTML = `<p style="text-align:center;">No rooms available at the moment.</p>`;
      return;
    }

    querySnapshot.forEach((doc) => {
      const room = doc.data();

      // Create room card
      const card = document.createElement('div');
      card.classList.add('room-card');

      // Render room content
      card.innerHTML = `
        <img src="${room.imageURL || 'https://via.placeholder.com/300x180?text=No+Image'}" alt="Room Image" />
        <h3>${room.title || 'Untitled Room'}</h3>
        <p>${room.description || 'No description provided.'}</p>
        <button onclick="viewRoom('${doc.id}')">View Details</button>
      `;

      listingsContainer.appendChild(card);
    });
  })
  .catch((error) => {
    console.error("Error loading listings:", error);
    listingsContainer.innerHTML = `<p style="text-align:center; color:red;">Error loading listings. Please try again later.</p>`;
  });

// Optional: Handler for "View Details" (can redirect or open modal)
function viewRoom(roomId) {
  // Redirect to a future details page (if you plan to make one)
  window.location.href = `room-details.html?id=${roomId}`;
}
