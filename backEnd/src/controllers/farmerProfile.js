const Farmer = require("../models/farmerSchema"); // adjust path if needed

const Order = require("../models/orderSchema");

const {
  updateProfileSchema,
  interestsSchema,
  locationSchema,
} = require("../utils/farmerProfileValidation");

//  Standard response helper
const sendRes = (res, status, success, message, data = null) => {
  res.status(status).json({ success, message, data });
};

//  1. Get Profile
exports.getMyProfile = async (req, res) => {
  try {
    if (!req.user?._id) {
      return sendRes(res, 401, false, "Unauthorized");
    }
    const farmer = await Farmer.findById(req.user._id)
      .select("-password")
      .lean();

    if (!farmer) {
      return sendRes(res, 404, false, "Farmer not found");
    }

    return sendRes(res, 200, true, "Profile fetched", farmer);
  } catch (err) {
    return sendRes(res, 500, false, err.message);
  }
};

//  2. Update Profile
exports.updateMyProfile = async (req, res) => {
  try {
    const { error } = updateProfileSchema.validate(req.body);
    if (error) {
      return sendRes(res, 400, false, error.details[0].message);
    }

    const updated = await Farmer.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    return sendRes(res, 200, true, "Profile updated", updated);
  } catch (err) {
    return sendRes(res, 500, false, err.message);
  }
};

//  3. Update Interests
exports.updateInterests = async (req, res) => {
  try {
    const { error } = interestsSchema.validate(req.body);
    if (error) {
      return sendRes(res, 400, false, error.details[0].message);
    }

    const updated = await Farmer.findByIdAndUpdate(
      req.user._id,
      { interests: req.body },
      { new: true },
    ).select("interests");

    return sendRes(res, 200, true, "Interests updated", updated);
  } catch (err) {
    return sendRes(res, 500, false, err.message);
  }
};

//  4. Get Orders (PAGINATED)
exports.getMyOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const orders = await Order.find({ farmer: req.user._id })
      .populate("product")
      .populate("tool")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Order.countDocuments({ farmer: req.user._id });

    return sendRes(res, 200, true, "Orders fetched", {
      orders,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return sendRes(res, 500, false, err.message);
  }
};

//  5. Update Location
exports.updateLocation = async (req, res) => {
  try {
    const { error } = locationSchema.validate(req.body);
    if (error) {
      return sendRes(res, 400, false, error.details[0].message);
    }

    const farmer = await Farmer.findByIdAndUpdate(
      req.user._id,
      {
        gpsLocation: {
          type: "Point",
          coordinates: req.body.coordinates,
        },
      },
      { new: true },
    ).select("gpsLocation");

    return sendRes(res, 200, true, "Location updated", farmer);
  } catch (err) {
    return sendRes(res, 500, false, err.message);
  }
};
