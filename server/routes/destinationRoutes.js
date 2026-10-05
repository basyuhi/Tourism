const express = require("express");
const {
    getDestinations,
    getDestinationBySlug,
    createDestination,
} = require("../controllers/destinationController");

const router = express.Router();

// Route: GET /api/destinations  AND  POST /api/destinations
router.route("/").get(getDestinations).post(createDestination);

// Route: GET /api/destinations/:slug
router.route("/:slug").get(getDestinationBySlug);

module.exports = router;