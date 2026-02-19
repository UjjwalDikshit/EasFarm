const express = require("express");
const blog_router = express.Router();

const {
  createBlog,
  updateBlog,
  readBlog,
  deleteBlog,
  readBlogUsingSlug,
  myBlog,
  updateBlogStatus,
  getFeaturedBlogs,
  featureBlog,
  unfeatureBlog,
  notPersonalisedFeed,
  trending,
  reactionOnBlog,
  getReactionPerType,
  commentOnComment,
  commentOnBlog,
  getComments,
  updateComment,
  deleteComment,
  getBlogsViewStats,
  getBlogViews,
  trackBlogView,
  createReport,
  listReports,
  updateReportStatus,
  getUserInterests,
  createUserInterests,
  updateUserInterests,
  getFeed,
  searchBlogs,
  getTags,
  getCategories,
} = require("../controllers/blogs/crudBlog");
const authMiddleware = require("../middlewares/authMiddleware");

// Static Routes Firs
blog_router.get("/feed", authMiddleware, getFeed);
blog_router.get("/search/blogs", searchBlogs);
blog_router.get("/tags", getTags);
blog_router.get("/categories", getCategories);

blog_router.get("/analytics/blogs/views", getBlogsViewStats);

blog_router.get("/user/interests", getUserInterests);
blog_router.post("/user/interests", authMiddleware, createUserInterests);
blog_router.put("/user/interests", updateUserInterests);

blog_router.get("/reports",authMiddleware, listReports);
blog_router.post("/reports", authMiddleware,createReport);
blog_router.put("/reports/:id/status", updateReportStatus);

blog_router.get("/featured", getFeaturedBlogs);
blog_router.get("/trending", trending);
blog_router.get("/me", authMiddleware, myBlog);
blog_router.get("/slug/:slug", readBlogUsingSlug);

// Root Routes

blog_router.post("/", authMiddleware, createBlog);
blog_router.get("/", notPersonalisedFeed);

// Nested ID Routes

blog_router.post("/:blogId/reactions", authMiddleware, reactionOnBlog);
blog_router.get("/:id/reactions", getReactionPerType);

blog_router.post("/:id/comments", authMiddleware, commentOnBlog);
blog_router.post(
  "/comments/:commentId/reply",
  authMiddleware,
  commentOnComment,
);

blog_router.get("/:id/comments", getComments);

blog_router.post("/:id/view", trackBlogView);
blog_router.get("/:id/views", getBlogViews);

blog_router.post("/:id/status", updateBlogStatus);

blog_router.post("/:id/mark_featured", featureBlog);
blog_router.post("/:id/mark_unfeatured", unfeatureBlog);

blog_router.get("/:id", authMiddleware, readBlog);
blog_router.put("/:id", authMiddleware, updateBlog);
blog_router.delete("/:id", authMiddleware, deleteBlog);

module.exports = blog_router;
