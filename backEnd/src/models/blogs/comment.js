const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
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
      required: true
    },

    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null
    },

    content: {
      type: String,
      required: true,
      trim: true
    },

    repliesCount: {
      type: Number,
      default: 0
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

commentSchema.index({ blogId: 1, createdAt: -1 });
commentSchema.index({ parentCommentId: 1, createdAt: 1 });

module.exports = mongoose.model("Comment", commentSchema);
