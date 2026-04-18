const express = require("express");
const router = express.Router();

const isAdmin = require("../middlewares/isAdmin");

const {
  // schemes
  addScheme,
  getSchemes,
  updateScheme,
  deleteScheme,

  // reports
  getReports,
  markReviewed,
  resolveReport,
  deleteReportedTarget
} = require("../controllers/adminWork");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware); // globally

// ============================
// REPORTS
// ===========================
router.get("/reports", getReports);
router.put("/reports/:id/review", isAdmin, markReviewed);
router.put("/reports/:id/resolve", isAdmin, resolveReport);
router.delete(
  "/reports/delete-target/:type/:id",
  isAdmin,
  deleteReportedTarget
);


// ============================
// GOVERNMENT SCHEMES
// ============================
router.get("/schemes",getSchemes);
router.post("/schemes", isAdmin, addScheme);
router.put("/schemes/:id", isAdmin, updateScheme);
router.delete("/schemes/:id", isAdmin, deleteScheme);

module.exports = router;