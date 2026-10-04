require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const port = process.env.PORT || 5000;

connectDB();

const server = app.listen(port, "127.0.0.1", () => {
    console.log(`Server running on port ${port}`);
});

server.on("error", (err) => {
    console.error("Server error:", err);
});