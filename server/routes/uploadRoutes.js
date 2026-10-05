const express = require("express");
const multer = require("multer");
const { uploadImage } = require("../controllers/uploadController");

const router = express.Router();

// Configure Multer to store files in memory (as a buffer)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

// The route expects a single file with the field name "image"
router.post("/image", upload.single("image"), uploadImage);

module.exports = router;