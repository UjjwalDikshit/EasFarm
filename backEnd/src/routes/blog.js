const express = require("express");
const blog_router = express.Router();

const {createBlog,updateBlog, readBlog, deleteBlog, readBlogUsingSlug, myBlog, publishBlog, unpublishBlog, getFeaturedBlogs, featureBlog, unfeatureBlog}= require('../controllers/blogs/crudBlog');

/* =========================
   📝 BLOG APIs
========================= */

// create blog
blog_router.post("/",createBlog);

// update blog
blog_router.put("/:id", updateBlog );

// get blog by id
blog_router.get('/:id', readBlog);

// soft delete blog
blog_router.delete("/:id", deleteBlog );

// list blogs (feed)
blog_router.get("/", /* listBlogs */);

// get blog by slug
blog_router.get("/slug/:slug", readBlogUsingSlug);

// get my blogs
blog_router.get("/me", myBlog);

// publish blog
blog_router.post("/:id/publish", publishBlog);

// unpublish blog
blog_router.post("/:id/unpublish", unpublishBlog);

// featured blogs
blog_router.get("/featured", getFeaturedBlogs);

// mark blog featured
blog_router.post('/:id/mark_featured',featureBlog);

// mark blog unfeature
blog_router.post('/:id/mark_unfeatured',unfeatureBlog);

// trending blogs
blog_router.get("/trending", /* trendingBlogs */);


/* =========================
   ❤️ REACTION APIs
========================= */

// add reaction
blog_router.post("/:id/reactions", /* addReaction */);

// remove reaction
blog_router.delete("/:id/reactions/:type", /* removeReaction */);

// get reaction counts + user reaction
blog_router.get("/:id/reactions", /* getReactions */);


/* =========================
   💬 COMMENT APIs
========================= */

// add comment
blog_router.post("/:id/comments", /* addComment */);

// get comments
blog_router.get("/:id/comments", /* getComments */);

// reply to comment
blog_router.post("/comments/:id/reply", /* replyComment */);

// update comment
blog_router.put("/comments/:id", /* updateComment */);

// delete comment (soft)
blog_router.delete("/comments/:id", /* deleteComment */);


/* =========================
   👀 BLOG VIEW APIs
========================= */

// track blog view
blog_router.post("/:id/view", /* trackBlogView */);

// get blog views count
blog_router.get("/:id/views", /* getBlogViews */);

// admin analytics
router.get("/analytics/blogs/views", /* getBlogsViewStats */);


/* =========================
   🚩 Report VIEW APIs
========================= */


// report blog or comment
router.post("/reports", /* createReport */);

// admin: list reports
router.get("/reports", /* listReports */);

// admin: update report status
router.put("/reports/:id/status", /* updateReportStatus */);



/* =========================
   🎯 User Interest APIs
========================= */


// get user interests
router.get("/user/interests", /* getUserInterests */);

// create user interests
router.post("/user/interests", /* createUserInterests */);

// update user interests
router.put("/user/interests", /* updateUserInterests */);


/* =========================
   📊 Utility / Feed APIs
========================= */
// personalized feed
router.get("/feed", /* getFeed */);

// search blogs
router.get("/search/blogs", /* searchBlogs */);

// list all tags
router.get("/tags", /* getTags */);

// list all categories
router.get("/categories", /* getCategories */);



module.exports = blog_router;
