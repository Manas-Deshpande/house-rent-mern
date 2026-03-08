const userSchema = require("../models/UserSchema");
const propertySchema = require("../models/PropertySchema");
const bookingSchema = require("../models/BookingSchema");

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await userSchema.find({}, { password: 0 }).sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/admin/user/:id
const deleteUser = async (req, res) => {
  try {
    const user = await userSchema.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.type === "admin") {
      return res.status(400).json({ message: "Cannot delete an admin user" });
    }

    await userSchema.findByIdAndDelete(req.params.id);

    if (user.type === "owner") {
      const properties = await propertySchema.find({ ownerId: req.params.id });
      const propertyIds = properties.map((p) => p._id);
      await propertySchema.deleteMany({ ownerId: req.params.id });
      await bookingSchema.deleteMany({ propertId: { $in: propertyIds } });
    }

    await bookingSchema.deleteMany({ userID: req.params.id });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/properties
const getAllProperties = async (req, res) => {
  try {
    const properties = await propertySchema
      .find()
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ properties });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/admin/property/:id
const deleteProperty = async (req, res) => {
  try {
    const property = await propertySchema.findById(req.params.id);
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

// GET /api/admin/bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingSchema
      .find()
      .populate("propertId", "propertyType propertyAddress propertyAmt")
      .populate("userID", "name email")
      .populate("ownerID", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalOwners, totalProperties, totalBookings] = await Promise.all([
      userSchema.countDocuments({ type: "user" }),
      userSchema.countDocuments({ type: "owner" }),
      propertySchema.countDocuments(),
      bookingSchema.countDocuments(),
    ]);

    const bookingsByStatus = await bookingSchema.aggregate([
      { $group: { _id: "$bookingStatus", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      totalUsers,
      totalOwners,
      totalProperties,
      totalBookings,
      bookingsByStatus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllProperties,
  deleteProperty,
  getAllBookings,
  getDashboardStats,
};
