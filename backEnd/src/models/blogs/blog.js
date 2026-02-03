const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
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
        index: true,
      },
    ],

    category: {
      type: String,
      index: true,
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    viewsCount: { type: Number, default: 0 },
    duplicateViewsCount: {type:Number,default:0},
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },

    trendingScore: { type: Number, default: 0, index: true },

    publishedAt: Date,
  },
  { timestamps: true },
);


/* ---------------- INDEXES ---------------- */

// TEXT SEARCH (only ONE text index allowed)
blogSchema.index(
  {
    title: "text",
    content: "text",
    tags: "text"
  },
  {
    weights: {
      title: 10,
      tags: 5,
      content: 1
    }
  }
);

// FILTER + SORT (feed, list, homepage)
blogSchema.index({ status: 1, isDeleted: 1, publishedAt: -1 });

// TRENDING
blogSchema.index({ trendingScore: -1 });

// FILTERS
blogSchema.index({createdAt: -1});
blogSchema.index({ tags: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ authorId: 1 });
blogSchema.index({ views: -1 });


module.exports = mongoose.model("Blog", blogSchema);
