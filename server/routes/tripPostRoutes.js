const express = require("express");
const {
    getTripPosts,
    getTripPostById,
    createTripPost,
    updateTripPost,
} = require("../controllers/tripPostController");
const { protect } = require("../middleware/authMiddleware"); // <-- ADD THIS

const router = express.Router();

router.route("/").get(getTripPosts).post(protect, createTripPost); // <-- ADD protect
router.route("/:id").get(getTripPostById).put(protect, updateTripPost); // <-- ADD protect

module.exports = router;