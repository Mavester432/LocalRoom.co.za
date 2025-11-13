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
    // Query listings ordered by creation date descending
    const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    listingsContainer.innerHTML = ''; // Clear previous content

    if (querySnapshot.empty) {
      listingsContainer.innerHTML = `<p style="text-align:center; font-size:1.1rem; color:#555;">No rooms available at the moment.</p>`;
      return;
    }

    querySnapshot.forEach((doc) => {
      const room = doc.data();

      const card = document.createElement('div');
      card.classList.add('room-card');

      // Use first image if available, else placeholder
      const imageSrc = room.images && room.images.length > 0
        ? room.images[0]
        : 'https://via.placeholder.com/300x180?text=No+Image';

      card.innerHTML = `
        <div class="room-images">
          <img src="${imageSrc}" alt="${room.title || 'Room Image'}" />
        </div>
        <h3>${room.title || 'Untitled Room'}</h3>
        <p>${room.location || 'Unknown location'} – R${room.price || '?'} / month</p>
        <p>${room.features || 'No description provided.'}</p>
        <button class="view-btn" data-id="${doc.id}">View Details</button>
      `;

      // Add click listener for the View Details button
      const viewBtn = card.querySelector('.view-btn');
      viewBtn.addEventListener('click', () => viewRoom(doc.id));

      listingsContainer.appendChild(card);
    });

  } catch (error) {
    console.error("Error loading listings:", error);
    listingsContainer.innerHTML = `<p style="text-align:center; color:red;">Error loading listings. Please try again later.</p>`;
  }
}

// Navigate to room details page
function viewRoom(roomId) {
  window.location.href = `room-details.html?id=${roomId}`;
}

// Initial fetch
fetchListings();
