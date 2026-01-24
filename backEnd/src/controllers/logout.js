const redisClient = require("../config/redis");

const Logout = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(200).json({ success:true, message: "Already logged out" });
  }

  const exp = req.user.exp; // may need to replace user -> farmer
  const ttl = exp - Math.floor(Date.now() / 1000);

  if (ttl > 0) {
    await redisClient.set(`blacklist:${token}`, "true", { EX: ttl });
  }

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ success: true, message: "Logout successful" });
};

module.exports = Logout;
