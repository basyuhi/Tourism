const Listing = require("../models/Listing");
const TripPost = require("../models/TripPost");
const User = require("../models/User");

const verifyListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (listing) {
            listing.isVerified = true;
            const updatedListing = await listing.save();
            res.status(200).json({ message: "Listing verified successfully", listing: updatedListing });
        } else {
            res.status(404).json({ message: "Listing not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTripPost = async (req, res) => {
    try {
        const post = await TripPost.findById(req.params.id);
        if (post) {
            await post.deleteOne();
            res.status(200).json({ message: "Trip post removed by admin" });
        } else {
            res.status(404).json({ message: "Trip post not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { verifyListing, deleteTripPost, getAllUsers };