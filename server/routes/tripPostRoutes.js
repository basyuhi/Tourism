const express = require("express");
const {
    getTripPosts,
    getTripPostById,
    createTripPost,
    updateTripPost,
} = require("../controllers/tripPostController");
const { protect } = require("../middleware/authMiddleware"); 

const router = express.Router();

router.route("/").get(getTripPosts).post(protect, createTripPost);
router.route("/:id").get(getTripPostById).put(protect, updateTripPost);

module.exports = router;