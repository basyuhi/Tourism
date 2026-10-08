const express = require("express");
const {
    getDestinations,
    getDestinationBySlug,
    getDestinationById,
    createDestination,
} = require("../controllers/destinationController");

// Import the middleware
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// PUBLIC ROUTES (Anyone can view)
router.route("/").get(getDestinations);
router.route("/:slug").get(getDestinationBySlug);
router.route("/id/:id").get(getDestinationById);

// PROTECTED ADMIN ROUTE (Only logged-in admins can create)
router.route("/").post(protect, admin, createDestination);

module.exports = router;