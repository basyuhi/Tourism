const express = require("express");
const {
    getDestinations,
    getDestinationBySlug,
    getDestinationById, // <-- Import it here
    createDestination,
} = require("../controllers/destinationController");

const router = express.Router();

// Route: GET /api/destinations  AND  POST /api/destinations
router.route("/").get(getDestinations).post(createDestination);

// Route: GET /api/destinations/:slug
router.route("/:slug").get(getDestinationBySlug);

// Route: GET /api/destinations/id/:id  <-- Add this new route
router.route("/id/:id").get(getDestinationById);

module.exports = router;