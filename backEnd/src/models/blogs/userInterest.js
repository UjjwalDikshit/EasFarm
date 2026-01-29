const mongoose = require("mongoose");

const userInterestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    tags: [{
      type: String,
      trim: true,
      lowercase: true,
      index: true
    }],

    categories: [{
      type: String,
      trim: true,
      lowercase: true
    }],

    lastInteractedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserInterest", userInterestSchema);
