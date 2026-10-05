const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Destination name is required"],
            trim: true,
        },
        state: {
            type: String,
            enum: ["Assam", "Meghalaya"],
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true, // e.g., "kaziranga" for /api/destinations/kaziranga
            lowercase: true,
        },
        description: {
            type: String,
            required: true,
        },
        pros: [{ type: String }],
        cons: [{ type: String }],
        dos: [{ type: String }],
        donts: [{ type: String }],
        bestTimeToVisit: {
            type: String,
            required: true,
        },
        heroImage: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt automatically
    }
);

module.exports = mongoose.model("Destination", destinationSchema);