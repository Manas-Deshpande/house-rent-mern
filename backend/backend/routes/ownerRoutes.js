const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { verifyToken, isOwner } = require("../middlewares/authMiddleware");
const {
  addProperty,
  updateProperty,
  deleteProperty,
  getOwnerProperties,
  getOwnerBookings,
  updateBookingStatus,
} = require("../controllers/ownerController");

// Multer config for property image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed (jpeg, jpg, png, webp)"));
    }
  },
});

// All owner routes require authentication and owner role
router.use(verifyToken, isOwner);

router.post("/property", upload.single("propertyImage"), addProperty);
router.put("/property/:id", upload.single("propertyImage"), updateProperty);
router.delete("/property/:id", deleteProperty);
router.get("/properties", getOwnerProperties);
router.get("/bookings", getOwnerBookings);
router.put("/booking/:id", updateBookingStatus);

module.exports = router;
