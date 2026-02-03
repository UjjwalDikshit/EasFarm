const express = require("express");
const blog_router = express.Router();

const {
     createBlog,updateBlog, readBlog, deleteBlog, readBlogUsingSlug, myBlog, publishBlog,
     unpublishBlog, getFeaturedBlogs, featureBlog, unfeatureBlog, notPersonalisedFeed, trending,
     reactionOnBlog,getReactionPerType, commentOnComment, commentOnBlog, getComments, 
     updateComment, deleteComment,
     getBlogsViewStats,
     getBlogViews,
     trackBlogView,
     createReport,
     listReports,
     updateReportStatus,
     getUserInterests,
     createUserInterests,
     updateUserInterests
   }= require('../controllers/blogs/crudBlog');

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
blog_router.get("/", notPersonalisedFeed);

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
blog_router.get("/trending", trending);


/* =========================
   ❤️ REACTION APIs
========================= */

// toggle reaction
blog_router.post("/:id/reactions", reactionOnBlog);


// get reaction counts + user reaction
blog_router.get("/:id/reactions", getReactionPerType);


/* =========================
   💬 COMMENT APIs
========================= */

// add comment
blog_router.post("/:id/comments", commentOnBlog);

// get comments
blog_router.get("/:id/comments", getComments);

// reply to comment
blog_router.post("/comments/:id/reply", commentOnComment);

// update comment
blog_router.put("/comments/:id", updateComment);

// delete comment (soft)
blog_router.delete("/comments/:id", deleteComment);


/* =========================
   👀 BLOG VIEW APIs
========================= */
// seems like unnecessary api

// track blog view
blog_router.post("/:id/view", trackBlogView);

// get blog views count
blog_router.get("/:id/views", getBlogViews);

// admin analytics
blog_router.get("/analytics/blogs/views", getBlogsViewStats);


/* =========================
   🚩 Report VIEW APIs
========================= */


// report blog or comment
blog_router.post("/reports", createReport);

// admin: list reports
blog_router.get("/reports", listReports);

// admin: update report status
blog_router.put("/reports/:id/status", updateReportStatus);



/* =========================
   🎯 User Interest APIs
========================= */


// get user interests
blog_router.get("/user/interests", getUserInterests);

// create user interests
blog_router.post("/user/interests", createUserInterests);

// update user interests
blog_router.put("/user/interests", updateUserInterests);


/* =========================
   📊 Utility / Feed APIs
========================= */
// personalized feed
blog_router.get("/feed", geFeed);

// search blogs
blog_router.get("/search/blogs", /* searchBlogs */);

// list all tags
blog_router.get("/tags", /* getTags */);

// list all categories
blog_router.get("/categories", /* getCategories */);



module.exports = blog_router;
