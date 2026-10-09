const TripPost = require("../models/TripPost");

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

const createTripPost = async (req, res) => {
    try {
        
        const post = await TripPost.create({ ...req.body, user: req.user._id });
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateTripPost = async (req, res) => {
    try {
        const post = await TripPost.findById(req.params.id);
        if (post) {
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