const express = require("express");
const { createHotel, getHotels, getHotelById } = require("../controllers/hotelController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getHotels);
router.get("/:id", getHotelById);

router.post("/", protect, admin, createHotel);

module.exports = router;