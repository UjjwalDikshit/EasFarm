const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    content: {
      type: String,
      required: true
    },

    coverImage: String,

    tags: [{
      type: String,
      lowercase: true,
      index: true
    }],

    category: {
      type: String,
      index: true
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true
    },

    isFeatured: {
      type: Boolean,
      default: false
    },

    publishedAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
