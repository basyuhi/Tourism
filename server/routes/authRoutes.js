const express = require("express");
const { registerUser, loginUser, getMe, toggleWishlist, getWishlist, toggleHotelWishlist, getHotelWishlist } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

// Destination Wishlist
router.post("/wishlist/:id", protect, toggleWishlist);
router.get("/wishlist", protect, getWishlist);

// Hotel Wishlist
router.post("/hotel-wishlist/:id", protect, toggleHotelWishlist);
router.get("/hotel-wishlist", protect, getHotelWishlist);

module.exports = router;