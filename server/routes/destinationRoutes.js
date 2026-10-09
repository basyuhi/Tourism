const express = require("express");
const {
    getDestinations,
    getDestinationBySlug,
    getDestinationById,
    createDestination,
} = require("../controllers/destinationController");

const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(getDestinations);
router.route("/:slug").get(getDestinationBySlug);
router.route("/id/:id").get(getDestinationById);

router.route("/").post(protect, admin, createDestination);

module.exports = router;