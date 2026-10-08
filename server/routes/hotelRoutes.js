const express = require("express");
const { createHotel, getHotels, getHotelById } = require("../controllers/hotelController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public route: Anyone can view hotels
router.get("/", getHotels);
router.get("/:id", getHotelById); // <-- ADD THIS (Must be BEFORE any other dynamic routes if you had them)

// Protected Admin route: Only admins can add hotels
router.post("/", protect, admin, createHotel);

module.exports = router;