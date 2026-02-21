const farmers = require("../models/farmerSchema");

const me = async (req, res) => {
  try {
    const farmer = await farmers.findById(req.user._id).select("-password");

    if (!farmer) {
      return res.status(404).json({
        loggedIn: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      loggedIn: true,
      farmer
    });

  } catch (err) {
    return res.status(500).json({
      loggedIn: false,
      message: "Server error",
      error: err.message
    });
  }
};

module.exports = me;