const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Listing title is required"],
            trim: true,
        },
        category: {
            type: String,
            enum: ["Homestay", "Experience", "Artisan", "Transport", "Hotel"],
            required: true,
        },
        state: {
            type: String,
            enum: ["Assam", "Meghalaya"],
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        ownerName: {
            type: String,
            required: true,
        },
        whatsappNumber: {
            type: String,
            required: [true, "WhatsApp number is required for direct connection"],
        },
        instagramLink: {
            type: String,
            default: "",
        },
        affiliateUrl: {
            type: String,
            default: "", 
        },
        externalRating: {
            type: String,
            default: "", 
        },
        // -----------------------------
        priceRange: {
            type: String,
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        images: [{ type: String }],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Listing", listingSchema);