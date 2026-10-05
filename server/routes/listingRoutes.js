const express = require("express");
const {
    getListings,
    getListingById,
    createListing,
    updateListing,
} = require("../controllers/listingController");
const { protect } = require("../middleware/authMiddleware"); // <-- ADD THIS

const router = express.Router();

router.route("/").get(getListings).post(protect, createListing); // <-- ADD protect
router.route("/:id").get(getListingById).put(protect, updateListing); // <-- ADD protect

module.exports = router;