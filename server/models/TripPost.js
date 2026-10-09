const mongoose = require("mongoose");

const tripPostSchema = new mongoose.Schema(
    {
        authorName: {
            type: String,
            required: [true, "Your name is required"],
            trim: true,
        },
        title: {
            type: String,
            required: [true, "Post title is required (e.g., 'Looking for buddy for Majuli')"],
            trim: true,
        },
        destination: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            enum: ["Assam", "Meghalaya", "Both"],
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        budget: {
            type: String, 
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        contactInfo: {
            type: String,
            required: [true, "Contact info is required for matching"],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isFilled: {
            type: Boolean,
            default: false, 
        },
    },
    {
        timestamps: true,
    }
);

// Index to make querying by state and dates faster
tripPostSchema.index({ state: 1, startDate: 1, isFilled: 1 });

module.exports = mongoose.model("TripPost", tripPostSchema);