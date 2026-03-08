const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./backend/config/connect");

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/user", require("./backend/routes/userRoutes"));
app.use("/api/owner", require("./backend/routes/ownerRoutes"));
app.use("/api/admin", require("./backend/routes/adminRoutes"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "HouseHunt API is running" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
