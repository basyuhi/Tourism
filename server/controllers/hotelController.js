const Hotel = require("../models/Hotel");

const createHotel = async (req, res) => {
    try {
        const { name, location, address, rating, priceLevel, photoUrl } = req.body;

        const newHotel = await Hotel.create({
            name,
            location,
            address,
            rating: parseFloat(rating) || 4.5,
            totalReviews: Math.floor(Math.random() * 100) + 10,
            photoUrl: photoUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
            priceLevel: parseInt(priceLevel) || 2
        });

        res.status(201).json({
            success: true,
            message: "Hotel added successfully!",
            data: newHotel
        });
    } catch (error) {
        console.error("❌ Create Hotel Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error adding hotel",
            error: error.message
        });
    }
};

const getHotels = async (req, res) => {
    try {
        const { location } = req.query;
        const filter = location ? { location: { $regex: location, $options: 'i' } } : {};
        const hotels = await Hotel.find(filter).sort({ rating: -1 });

        res.status(200).json({
            success: true,
            count: hotels.length,
            data: hotels
        });
    } catch (error) {
        console.error("❌ Get Hotels Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error fetching hotels"
        });
    }
};

const getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(404).json({ success: false, message: "Hotel not found" });
        }
        res.status(200).json({ success: true, data: hotel });
    } catch (error) {
        console.error("❌ Get Hotel By ID Error:", error.message);
        res.status(500).json({ success: false, message: "Server error fetching hotel" });
    }
};

module.exports = {
    createHotel,
    getHotelById, 
    getHotels
};
