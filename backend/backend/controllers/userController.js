const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = require("../models/UserSchema");
const propertySchema = require("../models/PropertySchema");
const bookingSchema = require("../models/BookingSchema");

// POST /api/user/signup
const signup = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;

    const existingUser = await userSchema.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userSchema.create({
      name,
      email,
      password: hashedPassword,
      type,
    });

    res.status(201).json({ message: "User registered successfully", userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/user/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, type: user.type, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, type: user.type },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/user/properties
const getAllProperties = async (req, res) => {
  try {
    const { propertyType, propertyAdType, minAmt, maxAmt } = req.query;
    const filter = {};

    if (propertyType) filter.propertyType = propertyType;
    if (propertyAdType) filter.propertyAdType = propertyAdType;
    if (minAmt || maxAmt) {
      filter.propertyAmt = {};
      if (minAmt) filter.propertyAmt.$gte = Number(minAmt);
      if (maxAmt) filter.propertyAmt.$lte = Number(maxAmt);
    }

    const properties = await propertySchema.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ properties });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/user/properties/:id
const getPropertyById = async (req, res) => {
  try {
    const property = await propertySchema.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json({ property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/user/booking
const createBooking = async (req, res) => {
  try {
    const { propertId, ownerID, userName, phone } = req.body;

    const property = await propertySchema.findById(propertId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const booking = await bookingSchema.create({
      propertId,
      ownerID,
      userID: req.user.id,
      userName,
      phone,
      bookingStatus: "pending",
    });

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/user/mybookings
const getUserBookings = async (req, res) => {
  try {
    const bookings = await bookingSchema
      .find({ userID: req.user.id })
      .populate("propertId", "propertyType propertyAddress propertyAmt propertyImage");

    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/user/booking/:id
const cancelBooking = async (req, res) => {
  try {
    const booking = await bookingSchema.findOne({
      _id: req.params.id,
      userID: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.bookingStatus !== "pending") {
      return res.status(400).json({ message: "Only pending bookings can be cancelled" });
    }

    await bookingSchema.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  signup,
  login,
  getAllProperties,
  getPropertyById,
  createBooking,
  getUserBookings,
  cancelBooking,
};
