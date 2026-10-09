const Destination = require("../models/Destination");

const getDestinations = async (req, res) => {
    try {
        const destinations = await Destination.find({});
        res.status(200).json(destinations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDestinationBySlug = async (req, res) => {
    try {
        const destination = await Destination.findOne({ slug: req.params.slug });
        if (destination) {
            res.status(200).json(destination);
        } else {
            res.status(404).json({ message: "Destination not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createDestination = async (req, res) => {
    try {
        const destination = await Destination.create(req.body);
        res.status(201).json(destination);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getDestinationById = async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (destination) {
            res.status(200).json(destination);
        } else {
            res.status(404).json({ message: "Destination not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = {
    getDestinations,
    getDestinationBySlug,
    getDestinationById,
    createDestination,
};