const Inquiry = require("../models/Inquiry");
const Listing = require("../models/Listing");

// @desc    Track a click and return the redirect URL
// @route   POST /api/inquiries/track
const trackInquiry = async (req, res) => {
    try {
        const { listingId, type } = req.body;

        // 1. Find the listing to get the actual URL/Number
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        // 2. Log the inquiry in the database
        const inquiryData = { listing: listingId, type };
        if (req.user) {
            inquiryData.user = req.user._id; // Attach user if logged in
        }
        await Inquiry.create(inquiryData);

        // 3. Return the correct redirect URL based on the type
        let redirectUrl = "";
        if (type === "whatsapp") {
            const message = encodeURIComponent("Hi, I found your listing on Bibek and would like to know more!");
            redirectUrl = `https://wa.me/${listing.whatsappNumber}?text=${message}`;
        } else if (type === "affiliate") {
            redirectUrl = listing.affiliateUrl || "#";
        } else if (type === "instagram") {
            redirectUrl = listing.instagramLink || "#";
        }

        res.status(200).json({ success: true, redirectUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get inquiry stats for a specific listing (For Vendor Dashboard)
// @route   GET /api/inquiries/stats/:listingId
const getInquiryStats = async (req, res) => {
    try {
        const { listingId } = req.params;

        // Verify the requesting user owns this listing (or is admin)
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }
        if (listing.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized to view these stats" });
        }

        // Aggregate stats
        const totalInquiries = await Inquiry.countDocuments({ listing: listingId });
        const whatsappClicks = await Inquiry.countDocuments({ listing: listingId, type: "whatsapp" });
        const affiliateClicks = await Inquiry.countDocuments({ listing: listingId, type: "affiliate" });
        const instagramClicks = await Inquiry.countDocuments({ listing: listingId, type: "instagram" });

        res.status(200).json({
            totalInquiries,
            breakdown: {
                whatsapp: whatsappClicks,
                affiliate: affiliateClicks,
                instagram: instagramClicks,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { trackInquiry, getInquiryStats };