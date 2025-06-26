// listings.js
import { db } from './firebase-config.js';
import {
  collection,
  getDocs,
  query,
  orderBy
} from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js';

const listingsContainer = document.querySelector('.listings-container');

async function fetchListings() {
  try {
    const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      listingsContainer.innerHTML = `<p style="text-align:center;">No rooms available at the moment.</p>`;
      return;
    }

    querySnapshot.forEach((doc) => {
      const room = doc.data();

      const card = document.createElement('div');
      card.classList.add('room-card');

      const images = room.images && room.images.length > 0
        ? `<img src="${room.images[0]}" alt="Room Image" />`
        : `<img src="https://via.placeholder.com/300x180?text=No+Image" alt="No Image" />`;

      card.innerHTML = `
        <div class="room-images">${images}</div>
        <h3>${room.title || 'Untitled Room'}</h3>
        <p>${room.location || 'Unknown location'} – R${room.price || '?'} / month</p>
        <p>${room.features || 'No description provided.'}</p>
        <button onclick="viewRoom('${doc.id}')">View Details</button>
      `;

      listingsContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading listings:", error);
    listingsContainer.innerHTML = `<p style="text-align:center; color:red;">Error loading listings. Please try again later.</p>`;
  }
}

function viewRoom(roomId) {
  window.location.href = `room-details.html?id=${roomId}`;
}

fetchListings();
