const Inquiry = require("../models/Inquiry"); 

const trackInquiry = async (req, res) => {
    try {
        const { listingId, destinationId, destinationName, name, email, message, date, guests } = req.body;

        const newInquiry = await Inquiry.create({
            listingId: listingId || destinationId, 
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

const getUserInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find({ userEmail: req.user.email })
            .sort({ createdAt: -1 }) 
            .select("-__v");

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

const getAllInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find({})
            .sort({ createdAt: -1 })
            .populate('listingId', 'name state'); 

        res.status(200).json({ success: true, count: inquiries.length, data: inquiries });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = {
    trackInquiry,
    getInquiryStats,
    getUserInquiries,
    getAllInquiries
};
