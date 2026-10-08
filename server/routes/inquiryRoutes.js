const express = require("express");
const { trackInquiry, getInquiryStats, getUserInquiries ,getAllInquiries} = require("../controllers/inquiryController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/track", trackInquiry);
router.get("/stats/:listingId", protect, getInquiryStats);
router.get("/my-inquiries", protect, getUserInquiries); // <-- ADD THIS
router.get("/all", protect, getAllInquiries);
module.exports = router;