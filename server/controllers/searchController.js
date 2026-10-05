const Destination = require("../models/Destination");
const Listing = require("../models/Listing");

// @desc    Search across destinations and listings
// @route   GET /api/search?q=keyword
const unifiedSearch = async (req, res) => {
    try {
        const keyword = req.query.q
            ? { $regex: req.query.q, $options: "i" } // Case-insensitive regex search
            : {};

        // Search Destinations (by name or description)
        const destinations = await Destination.find({
            $or: [{ name: keyword }, { description: keyword }],
        }).limit(5);

        // Search Listings (by title, location, or description)
        const listings = await Listing.find({
            $or: [{ title: keyword }, { location: keyword }, { description: keyword }],
        }).limit(5);

        res.status(200).json({
            destinations,
            listings,
            totalResults: destinations.length + listings.length,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { unifiedSearch };