const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const listingRoutes = require("./routes/listingRoutes");
const tripPostRoutes = require("./routes/tripPostRoutes");
const adminRoutes = require("./routes/adminRoutes");
const searchRoutes = require("./routes/searchRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");
const uploadRoutes = require("./routes/uploadRoutes"); 

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({ message: "Tourism API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/trip-posts", tripPostRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/upload", uploadRoutes); 

module.exports = app;