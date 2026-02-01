const mongoose = require("mongoose");

const blogViewSchema = new mongoose.Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
      index: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    ipAddress: String,

    userAgent: String,

    viewedAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  { timestamps: false }
);

blogViewSchema.index(
  { blogId: 1, userId: 1 },
  { unique: true, partialFilterExpression: { userId: { $ne: null } } }
);

blogViewSchema.index(
  { blogId: 1, ipAddress: 1 },
  { unique: true, partialFilterExpression: { userId: null } }
);

module.exports = mongoose.model("BlogView", blogViewSchema);
