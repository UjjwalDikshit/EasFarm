const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  console.log(token);
  
  if (!token) {
    return res.status(401).json({ LoggedIn:false, message: "Not authenticated" });
  }

  // 🔒 check blacklist
  const isBlacklisted = await redisClient.get(`blacklist:${token}`);
  if (isBlacklisted) {
    return res.status(401).json({LoggedIn:false, message: "Session expired" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user
    next();
  } catch (err) {
    return res.status(401).json({ LoggedIn:false,message: "Invalid token" ,err});
  }
};

module.exports = authMiddleware;
