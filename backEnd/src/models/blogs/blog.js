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

blogSchema.index({ status: 1, isDeleted: 1, publishedAt: -1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ trendingScore: -1 });


module.exports = mongoose.model("Blog", blogSchema);
