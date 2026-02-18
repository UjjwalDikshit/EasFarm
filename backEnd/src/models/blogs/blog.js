const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "farmer",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
    },

    coverImage: String,
    videoUrl: String,

    tags: [
      {
        type: String,
        lowercase: true,
      },
    ],

    category: {
      type: String,
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    viewsCount: { type: Number, default: 0 },
    duplicateViewsCount: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },

    trendingScore: { type: Number, default: 0 },

    publishedAt: Date,

    mediaType: {
      type: String,
      enum: ["image", "video", "pdf"],
    },

    media: {
      secureUrl: String,
      publicId: String,
      resourceType: String,
      format: String,
      bytes: Number,
    },

    thumbnail: {
      secureUrl: String,
      publicId: String,
    },
  },
  { timestamps: true },
);

/* ---------------- INDEXES ---------------- */

// TEXT SEARCH (only ONE text index allowed)
blogSchema.index(
  {
    title: "text",
    content: "text",
    tags: "text",
  },
  {
    weights: {
      title: 10,
      tags: 5,
      content: 1,
    },
  },
);

blogSchema.index({ status: 1, isDeleted: 1, publishedAt: -1 });
blogSchema.index({ trendingScore: -1 });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ authorId: 1 });
blogSchema.index({ viewsCount: -1 });

module.exports = mongoose.model("Blog", blogSchema);
