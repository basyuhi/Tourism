const TripPost = require("../models/TripPost");

// @desc    Get all active trip posts
// @route   GET /api/trip-posts
const getTripPosts = async (req, res) => {
    try {
        const query = { isFilled: false };
        if (req.query.state) query.state = req.query.state;
        if (req.query.destination) {
            query.destination = { $regex: req.query.destination, $options: "i" };
        }

        const posts = await TripPost.find(query).populate("user", "name email").sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single trip post by ID
// @route   GET /api/trip-posts/:id
const getTripPostById = async (req, res) => {
    try {
        const post = await TripPost.findById(req.params.id).populate("user", "name email");
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: "Trip post not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new trip post (Protected)
// @route   POST /api/trip-posts
const createTripPost = async (req, res) => {
    try {
        // Automatically attach the logged-in user's ID
        const post = await TripPost.create({ ...req.body, user: req.user._id });
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a trip post (Protected - Owner or Admin only)
// @route   PUT /api/trip-posts/:id
const updateTripPost = async (req, res) => {
    try {
        const post = await TripPost.findById(req.params.id);
        if (post) {
            // Check if the logged-in user is the owner OR an admin
            if (post.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
                return res.status(403).json({ message: "Not authorized to update this post" });
            }

            post.isFilled = req.body.isFilled !== undefined ? req.body.isFilled : post.isFilled;
            const updatedPost = await post.save();
            res.status(200).json(updatedPost);
        } else {
            res.status(404).json({ message: "Trip post not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTripPosts, getTripPostById, createTripPost, updateTripPost };