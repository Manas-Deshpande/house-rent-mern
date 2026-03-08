const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const {
  signup,
  login,
  getAllProperties,
  getPropertyById,
  createBooking,
  getUserBookings,
  cancelBooking,
} = require("../controllers/userController");

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/properties", getAllProperties);
router.get("/properties/:id", getPropertyById);

// Protected routes (requires login)
router.post("/booking", verifyToken, createBooking);
router.get("/mybookings", verifyToken, getUserBookings);
router.delete("/booking/:id", verifyToken, cancelBooking);

module.exports = router;
