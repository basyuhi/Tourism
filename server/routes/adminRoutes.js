const express = require("express");
const { verifyListing, deleteTripPost, getAllUsers } = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes here require BOTH login (protect) AND admin role (admin)
router.put("/listings/:id/verify", protect, admin, verifyListing);
router.delete("/trip-posts/:id", protect, admin, deleteTripPost);
router.get("/users", protect, admin, getAllUsers);

module.exports = router;