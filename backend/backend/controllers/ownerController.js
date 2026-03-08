const propertySchema = require("../models/PropertySchema");
const bookingSchema = require("../models/BookingSchema");
const userSchema = require("../models/UserSchema");

// POST /api/owner/property
const addProperty = async (req, res) => {
  try {
    const owner = await userSchema.findById(req.user.id);

    const propertyData = {
      ...req.body,
      ownerId: req.user.id,
      ownerName: owner.name,
    };

    if (req.file) {
      propertyData.propertyImage = {
        filename: req.file.filename,
        path: req.file.path,
        mimetype: req.file.mimetype,
      };
    }

    const property = await propertySchema.create(propertyData);
    res.status(201).json({ message: "Property added successfully", property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/owner/property/:id
const updateProperty = async (req, res) => {
  try {
    const property = await propertySchema.findOne({
      _id: req.params.id,
      ownerId: req.user.id,
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const updateData = { ...req.body };

    if (req.file) {
      updateData.propertyImage = {
        filename: req.file.filename,
        path: req.file.path,
        mimetype: req.file.mimetype,
      };
    }

    const updated = await propertySchema.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({ message: "Property updated successfully", property: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/owner/property/:id
const deleteProperty = async (req, res) => {
  try {
    const property = await propertySchema.findOne({
      _id: req.params.id,
      ownerId: req.user.id,
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    await propertySchema.findByIdAndDelete(req.params.id);
    await bookingSchema.deleteMany({ propertId: req.params.id });

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/owner/properties
const getOwnerProperties = async (req, res) => {
  try {
    const properties = await propertySchema
      .find({ ownerId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({ properties });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/owner/bookings
const getOwnerBookings = async (req, res) => {
  try {
    const bookings = await bookingSchema
      .find({ ownerID: req.user.id })
      .populate("propertId", "propertyType propertyAddress propertyAmt propertyAdType")
      .populate("userID", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/owner/booking/:id
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingStatus } = req.body;

    const booking = await bookingSchema.findOne({
      _id: req.params.id,
      ownerID: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const validStatuses = ["pending", "confirmed", "rejected", "completed"];
    if (!validStatuses.includes(bookingStatus)) {
      return res.status(400).json({ message: "Invalid booking status" });
    }

    const updated = await bookingSchema.findByIdAndUpdate(
      req.params.id,
      { bookingStatus },
      { new: true }
    );

    res.status(200).json({ message: "Booking status updated", booking: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addProperty,
  updateProperty,
  deleteProperty,
  getOwnerProperties,
  getOwnerBookings,
  updateBookingStatus,
};
