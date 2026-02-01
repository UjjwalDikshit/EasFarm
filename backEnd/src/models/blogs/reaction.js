const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["like", "clap", "love", "insightful"],
      required: true,
    },
  },
  { timestamps: true },
);

// Prevent duplicate reactions
// reactionSchema.index({ blogId: 1, userId: 1, type: 1 }, { unique: true });

reactionSchema.index({ blogId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Reaction", reactionSchema);
