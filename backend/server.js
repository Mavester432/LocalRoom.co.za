// backend/server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" with { type: "json" };

dotenv.config();

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// Test route
app.get("/", (req, res) => {
  res.send("LocalRoom backend is running!");
});

// POST /rooms - Add a room listing
app.post("/rooms", async (req, res) => {
  try {
    const { title, location, price, features, landlordId, images } = req.body;

    if (!title || !location || !price || !features || !landlordId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // images is expected to be an array of Base64 strings
    const roomData = {
      title,
      location,
      price,
      features,
      landlordId,
      images: images || [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("listings").add(roomData);

    return res.json({ success: true, message: "Room listed successfully!" });
  } catch (err) {
    console.error("Error adding room:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
