const Scheme = require("../models/govtSchema");
const Report = require("../models/blogs/report");
const Blog = require("../models/blogs/blog");
const Comment = require("../models/blogs/comment");
// ============================
// SCHEMES
// ============================

// CREATE SCHEME
const addScheme = async (req, res) => {
  try {
    if (!req.body.title || !req.body.description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const scheme = await Scheme.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Scheme created successfully",
      data: scheme,
    });
  } catch (err) {
    console.error("Add Scheme Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to create scheme",
    });
  }
};

// GET ALL SCHEMES
const getSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: schemes,
    });
  } catch (err) {
    console.error("Get Schemes Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch schemes",
    });
  }
};

// UPDATE SCHEME
const updateScheme = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Scheme.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Scheme updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("Update Scheme Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to update scheme",
    });
  }
};

// DELETE SCHEME
const deleteScheme = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Scheme.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Scheme deleted successfully",
    });
  } catch (err) {
    console.error("Delete Scheme Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to delete scheme",
    });
  }
};

// ============================
// REPORTS
// ============================

const getReports = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};

    if (status && ["pending", "reviewed", "resolved"].includes(status)) {
      filter.status = status;
    }

    const reports = await Report.find(filter)
      .populate("reporterId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: reports || [],
    });

  } catch (err) {
    console.error("GET REPORTS ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching reports",
    });
  }
};
const markReviewed = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Report ID is required",
      });
    }

    const report = await Report.findByIdAndUpdate(
      id,
      { status: "reviewed" },
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Report marked as reviewed",
      data: report,
    });

  } catch (err) {
    console.error("MARK REVIEWED ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to update report",
    });
  }
};
const resolveReport = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Report ID is required",
      });
    }

    const report = await Report.findByIdAndUpdate(
      id,
      { status: "resolved" },
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Report resolved successfully",
      data: report,
    });

  } catch (err) {
    console.error("RESOLVE REPORT ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to resolve report",
    });
  }
};
const deleteReportedTarget = async (req, res) => {
  try {
    const { type, id } = req.params;

    if (!type || !id) {
      return res.status(400).json({
        success: false,
        message: "Type and ID are required",
      });
    }

    let Model;

    switch (type) {
      case "blog":
        Model = Blog;
        break;

      case "comment":
        Model = Comment;
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid target type (blog/comment only)",
        });
    }

    const deleted = await Model.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Target not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Target deleted successfully",
    });

  } catch (err) {
    console.error("DELETE TARGET ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to delete target",
    });
  }
};
// ============================
// EXPORT
// ============================
module.exports = {
  // schemes
  addScheme,
  getSchemes,
  updateScheme,
  deleteScheme,

  // reports
  getReports,
  markReviewed,
  resolveReport,
  deleteReportedTarget,

};
