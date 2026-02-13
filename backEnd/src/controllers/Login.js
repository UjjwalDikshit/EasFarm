const jwt = require("jsonwebtoken");
const Farmer = require("../models/farmerSchema");
const toVerifyOtp = require("../controllers/otpVerify");
const redisClient = require("../config/redis");

const Login = async (req, res) => {
  try {
    const { emailId, otp } = req.body;

    if (!emailId || !otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const frmer = await Farmer.findOne({ emailId });

    if (!frmer) {
      return res.status(401).json({
        success: false,
        message: "Farmer has not registered",
      });
    }

    

    await toVerifyOtp(emailId, otp);

    // JWT
    const token = jwt.sign(
      {                            // payload
        _id: frmer._id,
        role: frmer.role,
        emailId: frmer.emailId,
        iat: Math.floor(Date.now() / 1000),
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: process.env.TOKEN_TIME,
    });

    // delete OTP after successful login
    await redisClient.del(`emailOtp:${emailId}`);

    return res.status(200).json({
      success: true,
      message: "Login Successfully",
      token: token
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = Login;
