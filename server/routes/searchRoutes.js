const express = require("express");
const { unifiedSearch } = require("../controllers/searchController");

const router = express.Router();

// Public route, no auth required
router.get("/", unifiedSearch);

module.exports = router;