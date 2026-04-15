const farmers = require("../models/farmerSchema");

const updateFarmer = async (req, res) => {
  try {
    // Get logged-in user (from JWT middleware)
    const userId = req.user._id;

    const {
      chatUserId,
      chatDisplayName,
      // future fields can be added here
    } = req.body;

    //  Find farmer
    const farmer = await farmers.findById(userId);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    //  Initialize chat object if not exists
    if (!farmer.chat) {
      farmer.chat = {};
    }

    //  Update chat fields only if provided
    if (chatUserId) {
      farmer.chat.chatUserId = chatUserId;
      farmer.chat.isChatUser = true;
    }

    if (chatDisplayName) {
      farmer.chat.displayName = chatDisplayName;
    }

    //  Save updated farmer
    await farmer.save();

    return res.status(200).json({
      success: true,
      message: "Farmer updated successfully",
      farmer,
    });
  } catch (error) {
    console.error("Update Farmer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = updateFarmer;