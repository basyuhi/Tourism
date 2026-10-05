const express = require("express");
const { trackInquiry, getInquiryStats } = require("../controllers/inquiryController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public route: Anyone can trigger a click (user is attached if logged in)
router.post("/track", trackInquiry);

// Protected route: Only the listing owner or admin can view stats
router.get("/stats/:listingId", protect, getInquiryStats);

module.exports = router;