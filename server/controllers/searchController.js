const Destination = require("../models/Destination");
const Listing = require("../models/Listing");


const unifiedSearch = async (req, res) => {
    try {
        const keyword = req.query.q
            ? { $regex: req.query.q, $options: "i" }
            : {};

        
        const destinations = await Destination.find({
            $or: [{ name: keyword }, { description: keyword }],
        }).limit(5);

        
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