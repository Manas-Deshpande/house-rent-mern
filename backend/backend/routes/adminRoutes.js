const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const {
  getAllUsers,
  deleteUser,
  getAllProperties,
  deleteProperty,
  getAllBookings,
  getDashboardStats,
} = require("../controllers/adminController");

// All admin routes require authentication and admin role
router.use(verifyToken, isAdmin);

router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);
router.delete("/user/:id", deleteUser);
router.get("/properties", getAllProperties);
router.delete("/property/:id", deleteProperty);
router.get("/bookings", getAllBookings);

module.exports = router;
