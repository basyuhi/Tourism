const Inquiry = require("../models/Inquiry"); // Make sure this matches your model file name

// @desc    Track/Submit a new inquiry
// @route   POST /api/inquiries/track
const trackInquiry = async (req, res) => {
    try {
        const { listingId, destinationId, destinationName, name, email, message, date, guests } = req.body;

        // Create the inquiry in the database
        const newInquiry = await Inquiry.create({
            listingId: listingId || destinationId, // Fallback to destinationId if listingId is missing
            destinationName: destinationName || "Unknown Destination",
            userName: name,
            userEmail: email,
            userMessage: message,
            preferredDate: date,
            numberOfGuests: guests,
            status: "pending"
        });

        res.status(201).json({
            success: true,
            message: "Inquiry submitted successfully",
            data: newInquiry
        });
    } catch (error) {
        console.error("Inquiry Submission Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while submitting inquiry",
            error: error.message
        });
    }
};

// @desc    Get inquiry stats for a listing
// @route   GET /api/inquiries/stats/:listingId
const getInquiryStats = async (req, res) => {
    try {
        const stats = await Inquiry.aggregate([
            { $match: { listingId: req.params.listingId } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// @desc    Get all inquiries for the logged-in user
// @route   GET /api/inquiries/my-inquiries
const getUserInquiries = async (req, res) => {
    try {
        // req.user is attached by the 'protect' middleware
        const inquiries = await Inquiry.find({ userEmail: req.user.email })
            .sort({ createdAt: -1 }) // Newest first
            .select("-__v"); // Hide mongoose version key

        res.status(200).json({
            success: true,
            count: inquiries.length,
            data: inquiries
        });
    } catch (error) {
        console.error("❌ Get User Inquiries Error:", error);
        res.status(500).json({ success: false, message: "Server error fetching inquiries" });
    }
};
// @desc    Get ALL inquiries (For Admin/Vendor)
// @route   GET /api/inquiries/all
const getAllInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find({})
            .sort({ createdAt: -1 })
            .populate('listingId', 'name state'); // Populates destination details

        res.status(200).json({ success: true, count: inquiries.length, data: inquiries });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE module.exports at the bottom to include:
module.exports = {
    trackInquiry,
    getInquiryStats,
    getUserInquiries,
    getAllInquiries // <-- ADD THIS
};
