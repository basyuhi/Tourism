const imagekit = require("../config/imagekit");

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        
        const response = await imagekit.upload({
            file: req.file.buffer, 
            fileName: req.file.originalname,
            folder: "/bibek-tourism",
        });

        res.status(200).json({
            success: true,
            url: response.url,
            fileId: response.fileId,
            thumbnailUrl: response.thumbnailUrl,
        });
    } catch (error) {
        console.error("ImageKit upload error:", error);
        res.status(500).json({ message: "Image upload failed", error: error.message });
    }
};

module.exports = { uploadImage };