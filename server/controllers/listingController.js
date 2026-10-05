const Listing = require("../models/Listing");

// @desc    Get all listings
// @route   GET /api/listings
const getListings = async (req, res) => {
    try {
        const query = {};
        if (req.query.state) query.state = req.query.state;
        if (req.query.category) query.category = req.query.category;

        const listings = await Listing.find(query).populate("user", "name email");
        res.status(200).json(listings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single listing by ID
// @route   GET /api/listings/:id
const getListingById = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate("user", "name email");
        if (listing) {
            res.status(200).json(listing);
        } else {
            res.status(404).json({ message: "Listing not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new listing (Protected)
// @route   POST /api/listings
const createListing = async (req, res) => {
    try {
        const listing = await Listing.create({ ...req.body, user: req.user._id });
        res.status(201).json(listing);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a listing (Protected - Owner or Admin only)
// @route   PUT /api/listings/:id
const updateListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (listing) {
            if (listing.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
                return res.status(403).json({ message: "Not authorized to update this listing" });
            }

            listing.isVerified = req.body.isVerified !== undefined ? req.body.isVerified : listing.isVerified;
            const updatedListing = await listing.save();
            res.status(200).json(updatedListing);
        } else {
            res.status(404).json({ message: "Listing not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getListings, getListingById, createListing, updateListing };