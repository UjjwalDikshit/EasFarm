const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");

const {
  getMyProfile,
  updateMyProfile,
  updateInterests,
  getMyOrders,
  updateLocation,
} = require("../controllers/farmerProfile");

const router = express.Router();

// routes/farmerProfileRoutes.js

router.get("/profile", authMiddleware, getMyProfile);
router.put("/profile", authMiddleware, updateMyProfile);
router.patch("/interests", authMiddleware, updateInterests);
router.get("/orders", authMiddleware, getMyOrders);
router.patch("/location", authMiddleware, updateLocation);

module.exports = router;