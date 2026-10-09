const express = require("express");
const {
    getListings,
    getListingById,
    createListing,
    updateListing,
} = require("../controllers/listingController");
const { protect } = require("../middleware/authMiddleware"); 

const router = express.Router();

router.route("/").get(getListings).post(protect, createListing);
router.route("/:id").get(getListingById).put(protect, updateListing);

module.exports = router;