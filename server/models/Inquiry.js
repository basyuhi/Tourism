const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
    {
        listing: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Listing",
            required: true,
        },
        type: {
            type: String,
            enum: ["whatsapp", "affiliate", "instagram", "email"],
            required: true,
        },
        // Optional: If the user clicking is logged in, we track them. 
        // If not, it's still a valid anonymous lead.
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true, // createdAt acts as the timestamp of the click
    }
);

module.exports = mongoose.model("Inquiry", inquirySchema);