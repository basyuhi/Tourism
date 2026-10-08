const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
    {
        listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Destination" },
        destinationName: { type: String, required: true },
        userName: { type: String, required: true },
        userEmail: { type: String, required: true },
        userMessage: { type: String, required: true },
        preferredDate: { type: String },
        numberOfGuests: { type: String },
        status: { type: String, enum: ["pending", "contacted", "closed"], default: "pending" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Inquiry", inquirySchema);