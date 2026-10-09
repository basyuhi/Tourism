const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        location: { type: String, required: true }, 
        address: { type: String, required: true },
        rating: { type: Number, required: true, default: 4.5 },
        totalReviews: { type: Number, default: 10 },
        photoUrl: { type: String, required: true },
        uniqueId: { type: String, unique: true, default: () => `hotel_${Date.now()}` },
        priceLevel: { type: Number, enum: [1, 2, 3, 4], default: 2 }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Hotel", hotelSchema);