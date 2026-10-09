const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "your_super_secret_key", {
        expiresIn: "30d",
    });
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });
        const user = await User.create({ name, email, password });
        res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
    } catch (error) {
        res.status(500).json({ message: "Server error during registration", error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error during login", error: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (user) res.status(200).json(user);
        else res.status(404).json({ message: "User not found" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// --- DESTINATION WISHLIST ---
const toggleWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const destinationId = req.params.id;
        const index = user.wishlist.indexOf(destinationId);
        if (index > -1) user.wishlist.splice(index, 1);
        else user.wishlist.push(destinationId);
        await user.save();
        res.json({ message: "Wishlist updated", wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('wishlist');
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// --- HOTEL WISHLIST (NEW) ---
const toggleHotelWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const hotelId = req.params.id;
        const index = user.savedHotels.indexOf(hotelId);
        if (index > -1) user.savedHotels.splice(index, 1);
        else user.savedHotels.push(hotelId);
        await user.save();
        res.json({ message: "Hotel wishlist updated", savedHotels: user.savedHotels });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getHotelWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('savedHotels');
        res.json(user.savedHotels);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    toggleWishlist,
    getWishlist,
    toggleHotelWishlist, 
    getHotelWishlist     
};