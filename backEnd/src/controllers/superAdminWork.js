const User = require("../models/farmerSchema");

const makeAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ emailId:email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (user.role === "superAdmin") {
      return res.status(400).send("Cannot modify Super Admin");
    }

    user.role = "admin";
    await user.save();

    return res.status(200).send({
      message: "User promoted to admin",
      data: user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Failed to promote user");
  }
};
const removeAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId); // ✅ FIXED

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (user.role === "superAdmin") {
      return res.status(400).send("Cannot modify Super Admin");
    }

    user.role = "farmer";
    await user.save();

    return res.status(200).send({
      message: "Admin removed. Now a farmer.",
      data: user,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).send("Failed to remove admin");
  }
};
const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });

    return res.status(200).send({
      message: "Admins fetched successfully",
      data: admins,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Failed to fetch admins");
  }
};
module.exports = {
  getAllAdmins,
  removeAdmin,
  makeAdmin,
};
