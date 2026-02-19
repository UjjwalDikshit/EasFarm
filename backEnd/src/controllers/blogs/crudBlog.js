const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Blog = require("../../models/blogs/blog");
const UserInterest = require("../../models/blogs/userInterest");
const BlogView = require("../../models/blogs/blogViews");
const Report = require("../../models/blogs/report");
const Reaction = require("../../models/blogs/reaction");
const BlogInteraction = require("../../models/blogs/BlogInteration");
const Comment = require("../../models/blogs/comment");
// const User = require('../../models/farmerSchema');

const blog = require("../../models/blogs/blog");

const createBlog = async (req, res) => {
  try {
    const {
      title,
      content,
      tags = [],
      category,
      isFeatured = false,
      mediaType,
      media,
      thumbnail,
    } = req.body;

    const authorId = req.user._id;

    // ✅ Required fields
    if (!authorId || !title || !content) {
      return res.status(400).json({
        success: false,
        message: "authorId, title and content are required",
      });
    }

    // ✅ Slug generation
    let finalSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // ✅ Prevent duplicate slug
    const existingSlug = await Blog.findOne({ slug: finalSlug });
    if (existingSlug) {
      finalSlug = `${finalSlug}-${Date.now()}`;
    }

    const blog = await Blog.create({
      authorId,
      title,
      slug: finalSlug,
      content,
      tags,
      category,
      isFeatured,
      status: "draft",
      publishedAt: null,
      mediaType,
      media,
      thumbnail,
    });

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Create blog error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create blog",
    });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, coverImage, videoUrl } = req.body;

    //1. determine what is being updated
    const isTextUpdate = title || content;
    const isMediaUpdate = coverImage || videoUrl;

    //both together not allowed
    if (isTextUpdate && isMediaUpdate) {
      return res.status(400).json({
        success: false,
        message: "You can update either text or media at a time, not both",
      });
    }

    //nothing to update
    if (!isTextUpdate && !isMediaUpdate) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    const updateData = {};

    //2. text update
    if (title) {
      updateData.title = title;
      updateData.slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    if (content) {
      updateData.content = content;
    }

    // 3.media update -> dekete previous file using link and deleteFile file inside cloudinary.service.delete.service.js
    if (coverImage) updateData.coverImage = coverImage;
    if (videoUrl) updateData.videoUrl = videoUrl;

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );

    if (!updatedBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    console.error("Update blog error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update blog",
    });
  }
};

// soft delete
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const softDeletedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          status: "archived", // optional but recommended
        },
      },
      { new: true },
    );

    if (!softDeletedBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
      data: softDeletedBlog,
    });
  } catch (error) {
    console.error("Delete blog error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete blog",
    });
  }
};

const readBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const blog = await Blog.findOne({
      _id: id,
      isDeleted: false,
      status: "published",
    })
      .populate("authorId", "fullName emailId")
      .lean();

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    let myReaction = null;

    if (userId) {
      const baseFilter = { blogId: id, userId };

      // ✅ 1️⃣ Get user reaction
      const reactionDoc = await Reaction.findOne(baseFilter)
        .select("type")
        .lean();

      myReaction = reactionDoc?.type || null;

      // ✅ 2️⃣ Atomic insert for VIEW type only
      const viewResult = await BlogInteraction.updateOne(
        { ...baseFilter, type: "view" },
        {
          $setOnInsert: {
            blogId: id,
            userId,
            type: "view",
            duration: 0,
          },
        },
        { upsert: true }
      );

      // ✅ 3️⃣ Increment only if first time view
      if (viewResult.upsertedCount === 1) {
        await Blog.updateOne(
          { _id: id },
          {
            $inc: {
              viewsCount: 1,
              trendingScore: 1,
            },
          }
        );
      }
    } else {
      // Guest view (optional logic)
      await Blog.updateOne(
        { _id: id },
        { $inc: { viewsCount: 1 } }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      data: {
        ...blog,
        myReaction,
      },
    });
  } catch (error) {
    console.error("Read blog error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
    });
  }
};


const readBlogUsingSlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({
      slug,
      isDeleted: false,
      status: "published", // important
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Read blog by slug error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
    });
  }
};

const myBlog = async (req, res) => {
  try {
    const user = req.user; 
    const authorId = user._id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const MAX_LIMIT = 50;
    const finalLimit = Math.min(limit, MAX_LIMIT);

    const skip = (page - 1) * finalLimit;

    
    const totalBlogs = await Blog.countDocuments({
      authorId,
      isDeleted: false,
    });

    
    const blogs = await Blog.find({
      authorId,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(finalLimit);

    return res.status(200).json({
      success: true,
      message: "My blogs fetched successfully",
      data: blogs,
      pagination: {
        total: totalBlogs,
        page,
        limit: finalLimit,
        totalPages: Math.ceil(totalBlogs / finalLimit),
        hasNextPage: page * finalLimit < totalBlogs,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("My blogs error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};


const updateBlogStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["published", "archived",'draft'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const updateData = {
      status,
      publishedAt: status === "published" ? new Date() : null,
    };

    const blog = await Blog.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      { $set: updateData },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        status === "published"
          ? "Blog published successfully"
          : "Blog moved to archived successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Update blog status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update blog status",
    });
  }
};


const getFeaturedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({
      isFeatured: true,
      isDeleted: false,
      status: "published",
    })
      .sort({ publishedAt: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      message: "Featured blogs fetched successfully",
      data: blogs,
    });
  } catch (error) {
    console.error("Featured blogs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch featured blogs",
    });
  }
};

const featureBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { isFeatured: true } },
      { new: true },
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog marked as featured",
      data: blog,
    });
  } catch (error) {
    console.error("Feature blog error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to feature blog",
    });
  }
};

const unfeatureBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { isFeatured: false } },
      { new: true },
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog removed from featured",
      data: blog,
    });
  } catch (error) {
    console.error("Unfeature blog error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to unfeature blog",
    });
  }
};

const notPersonalisedFeed = async (req, res) => {
  try {
    // 1 Get userId (from auth middleware)
    const userId = req.user._id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const interest = await UserInterest.findOne({ userId });

    // fallback if no interests
    let matchQuery = {
      status: "published",
      isDeleted: false,
    };

    if (interest) {
      matchQuery.$or = [
        { tags: { $in: interest.tags || [] } },
        { category: { $in: interest.categories || [] } },
      ];
    }

    const blogs = await Blog.find(matchQuery)
      .sort({ publishedAt: -1 }) // newest first
      .skip(skip)
      .limit(limit)
      .select("title slug coverImage category tags publishedAt");

    // Total count (for frontend paging)
    const total = await Blog.countDocuments(matchQuery);

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      hasMore: skip + blogs.length < total,
      data: blogs,
    });
  } catch (error) {
    console.error("Feed error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load feed",
    });
  }
};

const trending = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const matchQuery = {
      status: "published",
      isDeleted: false,
    };

    const blogs = await Blog.find(matchQuery)
      .sort({ trendingScore: -1 })
      .skip(skip)
      .limit(limit)
      .select("title slug coverImage category tags publishedAt trendingScore");

    const total = await Blog.countDocuments(matchQuery);

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      hasMore: skip + blogs.length < total,
      data: blogs,
    });
  } catch (error) {
    console.error("Trending feed error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load trending blogs",
    });
  }
};

const blogView = async (req, res) => {
  // blogView unique + duplicate handler
  try {
    const blogId = req.params.blogId;
    const userId = req.user?.id || null;
    const ipAddress = req.ip;
    const userAgent = req.headers["user-agent"];

    // 1️⃣ Check if blog exists
    const blog = await Blog.findById(blogId).select("_id");
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // 2️⃣ Check if this user / IP already viewed
    const viewQuery = userId ? { blogId, userId } : { blogId, ipAddress };

    const existingView = await BlogView.findOne(viewQuery);

    // 3️⃣ If first view → create BlogView + update counters
    if (!existingView) {
      await BlogView.create({
        blogId,
        userId,
        ipAddress,
        userAgent,
      });

      // 4️⃣ Increment blog counters atomically
      await Blog.findByIdAndUpdate(
        blogId,
        {
          $inc: {
            duplicateViewsCount: 1,
            viewsCount: 1,
            trendingScore: 1, // keep simple for now
          },
          $set: {
            lastViewedAt: new Date(),
          },
        },
        { new: false },
      );
    } else {
      // 5️⃣ Optional: still increment total views (not unique / trending)

      if (Date.now() - existingView.createdAt < 30 * 60 * 1000) {
        // so that duplicate views within 30 mintues can't count
        return res.status(200).json({
          success: true,
          viewed: true,
        });
      }
      await Blog.findByIdAndUpdate(blogId, {
        $inc: { duplicateViewsCount: 1 },
        $set: { lastViewedAt: new Date() },
      });
    }

    return res.status(200).json({
      success: true,
      viewed: true,
    });
  } catch (error) {
    console.error("Blog view error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// REACT ON BLOG Logged-in users only

const reactionOnBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const userId = req.user._id; 
    const { type } = req.body;

    if (!["like", "clap", "love", "insightful"].includes(type)) {
      return res.status(400).json({ message: "Invalid reaction type" });
    }

    // 1️⃣ Check existing reaction
    const existingReaction = await Reaction.findOne({ blogId, userId });

    // 2️⃣ If same reaction → toggle off
    if (existingReaction && existingReaction.type === type) {
      await Reaction.deleteOne({ _id: existingReaction._id });

      await Blog.findByIdAndUpdate(blogId, {
        $inc: { likesCount: -1, trendingScore: -3 },
      });

      // if reaction is toggling then also remove BlogInteraction
      await BlogInteraction.deleteOne({userId,blogId,type:"like"});

      return res.status(200).json({
        reacted: false,
        reaction: null,
      });
    }

    // 3️⃣ If reaction exists but different type → update
    if (existingReaction) {
      await Reaction.updateOne(
        { _id: existingReaction._id },
        { $set: { type } },
      );

      // likesCount stays same
      return res.status(200).json({
        reacted: true,
        reaction: type,
      });
    }

    // 4️⃣ No reaction yet → create new
    await Reaction.create({
      blogId,
      userId,
      type,
    });

    await BlogInteraction.create({
      blogId,
      userId,
      type : "like"
    });

    await Blog.findByIdAndUpdate(blogId, {
      $inc: { likesCount: 1, trendingScore: 3 },
    });

    return res.status(200).json({
      reacted: true,
      reaction: type,
    });
  } catch (error) {
    console.error("Reaction error:", error);

    // Handle race-condition duplicate
    if (error.code === 11000) {
      return res.status(409).json({ message: "Already reacted" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

const getReactionPerType = async (req, res) => {
  // need to work on this functoin
  //   Reaction.aggregate([
  //   { $match: { blogId: mongoose.Types.ObjectId(blogId) } },
  //   {
  //     $group: {
  //       _id: "$type",
  //       count: { $sum: 1 }
  //     }
  //   }
  // ]);
  return res.json("First complete this function");
  // **response
  // [
  //   { "_id": "like", "count": 42 },
  //   { "_id": "clap", "count": 31 },
  //   { "_id": "love", "count": 18 }
  // ]
};

// comment related thing

const commentOnBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user._id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }
    const comment = await Comment.create({
      blogId,
      userId,
      content: content.trim(),
      parentCommentId: null,
    });

    // Optional: increment comment count on blog
    await Blog.findByIdAndUpdate(blogId, {
      $inc: { commentsCount: 1, trendingScore: 5 },
    });

    return res.status(201).json({
      success: true,
      comment,
    });
  } catch (error) {
    console.error("Comment on blog error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const commentOnComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Reply cannot be empty" });
    }

    // Ensure parent comment exists & not deleted
    const parentComment = await Comment.findOne({
      _id: commentId,
      isDeleted: false,
    }).select("blogId");

    if (!parentComment) {
      return res.status(404).json({ message: "Parent comment not found" });
    }

    const reply = await Comment.create({
      blogId: parentComment.blogId,
      userId,
      content: content.trim(),
      parentCommentId: commentId,
    });

    await Comment.findByIdAndUpdate(commentId, {
      $inc: { repliesCount: 1 },
    });

    return res.status(201).json({
      success: true,
      comment: reply,
    });
  } catch (error) {
    console.error("Comment on comment error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// const getComments = async (req, res) => {
//   try {
//     const blogId = req.params.id;
//     const page = parseInt(req.query.page) || 1;
//     const limit = Math.min(parseInt(req.query.limit) || 10, 20);
//     const skip = (page - 1) * limit;

//     // 1 Get parent comments (paginated)
//     const parentComments = await Comment.find({
//       blogId,
//       parentCommentId: null,
//       isDeleted: false,
//     })
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .populate("userId", "name avatar")
//       .lean();

//     const parentIds = parentComments.map(c => c._id);

//     // 2 Get replies for those parent comments
//     const replies = await Comment.find({
//       parentCommentId: { $in: parentIds },
//       isDeleted: false,
//     })
//       .sort({ createdAt: -1 })
//       .populate("userId", "name avatar")
//       .lean();

//     // 3 Attach replies to their parent
//     const comments = parentComments.map(parent => ({
//       ...parent,
//       replies: replies.filter(
//         reply => reply.parentCommentId.toString() === parent._id.toString()
//       ),
//     }));

//     // 4 Total count (only parent comments)
//     const total = await Comment.countDocuments({
//       blogId,
//       parentCommentId: null,
//       isDeleted: false,
//     });

//     return res.status(200).json({
//       page,
//       limit,
//       total,
//       comments,
//     });

//   } catch (error) {
//     console.error("Get comments error:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

const getComments = async (req, res) => {
  try {
    const blogId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 20);
    const skip = (page - 1) * limit;

    // 1 Fetch paginated parent comments
    const parentComments = await Comment.find({
      blogId,
      parentCommentId: null,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name avatar")
      .lean(); // VERY IMPORTANT (better performance)

    const parentIds = parentComments.map((c) => c._id);

    // 2 Fetch all replies for those parents
    const replies = await Comment.find({
      parentCommentId: { $in: parentIds },
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .populate("userId", "name avatar")
      .lean();

    // 3 Group replies efficiently (O(n))
    const repliesMap = {};

    for (const reply of replies) {
      const parentId = reply.parentCommentId.toString();
      if (!repliesMap[parentId]) {
        repliesMap[parentId] = [];
      }
      repliesMap[parentId].push(reply);
    }

    // 4 Attach replies without filtering (O(n))
    const comments = parentComments.map((parent) => ({
      ...parent,
      replies: repliesMap[parent._id.toString()] || [],
    }));

    // 5 Count parent comments only
    const total = await Comment.countDocuments({
      blogId,
      parentCommentId: null,
      isDeleted: false,
    });

    return res.status(200).json({
      page,
      limit,
      total,
      comments,
    });
  } catch (error) {
    console.error("Get comments error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const comment = await Comment.findOne({
      _id: commentId,
      userId,
      isDeleted: false,
    });

    if (!comment) {
      return res
        .status(404)
        .json({ message: "Comment not found or unauthorized" });
    }

    // Add edit window (LinkedIn-style)
    const EDIT_WINDOW_MS = 15 * 24 * 60 * 60 * 1000;

    if (Date.now() - comment.createdAt.getTime() > EDIT_WINDOW_MS) {
      return res.status(403).json({
        message: "Editing window expired",
      });
    }

    comment.content = content.trim();
    await comment.save();

    return res.status(200).json({
      success: true,
      comment,
    });
  } catch (error) {
    console.error("Update comment error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;

    const comment = await Comment.findOne({
      _id: commentId,
      userId,
      isDeleted: false,
    });

    if (!comment) {
      return res
        .status(404)
        .json({ message: "Comment not found or unauthorized" });
    }

    comment.isDeleted = true;
    comment.content = "[deleted]";
    await comment.save();

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Delete comment error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// view related thing

const trackBlogView = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user?._id || null;
    const ip = req.ip;
    const userAgent = req.headers["user-agent"];

    // Avoid duplicate views within 30 minutes
    const recentView = await BlogView.findOne({
      blogId,
      $or: [{ userId, userId: { $ne: null } }, { ip }],
      createdAt: { $gte: new Date(Date.now() - 30 * 60 * 1000) },
    });

    if (recentView) {
      return res.status(200).json({ message: "View already counted" });
    }

    // Save view
    await BlogView.create({
      blogId,
      userId,
      ip,
      userAgent,
    });

    // Increment counter (fast read)
    await Blog.findByIdAndUpdate(blogId, {
      $inc: { views: 1 },
    });

    res.status(201).json({ message: "View tracked" });
  } catch (err) {
    res.status(500).json({ error: "Failed to track view" });
  }
};

const getBlogViews = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).select("views title");

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json({
      blogId: blog._id,
      title: blog.title,
      views: blog.views,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch views" });
  }
};

const getBlogsViewStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const match = {};
    if (startDate && endDate) {
      match.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const stats = await BlogView.aggregate([
      { $match: match },

      {
        $group: {
          _id: "$blogId",
          views: { $sum: 1 },
        },
      },

      {
        $lookup: {
          from: "blogs",
          localField: "_id",
          foreignField: "_id",
          as: "blog",
        },
      },

      { $unwind: "$blog" },

      {
        $project: {
          _id: 0,
          blogId: "$_id",
          title: "$blog.title",
          views: 1,
        },
      },

      { $sort: { views: -1 } },
    ]);

    res.json({
      totalBlogs: stats.length,
      stats,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};

// report thing

const createReport = async (req, res) => {
  try {
    const reporterId = req.user._id;
    const { targetType, targetId, type,reason } = req.body;

    if (!targetType || !targetId || !type) {
      return res.status(400).json({ error: "All required fields missing" });
    }


    // Validate target type
    if (!["blog", "comment"].includes(targetType)) {
      return res.status(400).json({ error: "Invalid target type" });
    }

    // Check target exists
    const Model = targetType === "blog" ? Blog : Comment;
    const target = await Model.findById(targetId);

    if (!target) {
      return res.status(404).json({ error: "Target not found" });
    }

    // Prevent duplicate reports by same user
    const existingReport = await Report.findOne({
      reporterId,
      targetType,
      targetId,
    });

    if (existingReport) {
      return res.status(409).json({
        error: "You have already reported this content",
      });
    }

    const report = await Report.create({
      reporterId,
      targetType,
      targetId,
      reason,
      type,
    });

    res.status(201).json({
      message: "Report submitted successfully",
      reportId: report._id,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit report",err });
  }
};

const listReports = async (req, res) => {
  try {
    const { status, targetType, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (targetType) filter.targetType = targetType;

    const reports = await Report.find(filter)
      .populate("reporterId", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Report.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      reports,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};

const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const reportId = req.params.id;

    if (!["pending", "reviewed", "resolved"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    report.status = status;
    await report.save();

    res.json({
      message: "Report status updated",
      reportId: report._id,
      status: report.status,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
};

// interest thing

const getUserInterests = async (req, res) => {
  try {
    const userId = req.user._id;

    const interests = await UserInterest.findOne({ userId });

    if (!interests) {
      return res.json({
        tags: [],
        categories: [],
      });
    }

    res.json({
      tags: interests.tags,
      categories: interests.categories,
      lastInteractedAt: interests.lastInteractedAt,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user interests" });
  }
};

const createUserInterests = async (req, res) => {
  try {
    const userId = req.user._id;
    const { tags = [], categories = [] } = req.body;

    // Check if already exists
    const existing = await UserInterest.findOne({ userId });
    if (existing) {
      return res.status(409).json({
        error: "User interests already exist. Use update instead.",
      });
    }

    const interests = await UserInterest.create({
      userId,
      tags: [...new Set(tags)],
      categories: [...new Set(categories)],
      lastInteractedAt: new Date(),
    });

    res.status(201).json({
      message: "User interests created",
      interests,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create user interests", err });
  }
};

const updateUserInterests = async (req, res) => {
  try {
    const userId = req.user._id;
    const { tags, categories } = req.body;

    const update = {
      lastInteractedAt: new Date(),
    };

    if (tags) {
      update.tags = [...new Set(tags)];
    }

    if (categories) {
      update.categories = [...new Set(categories)];
    }

    const interests = await UserInterest.findOneAndUpdate(
      { userId },
      { $set: update },
      { new: true, upsert: true }, // upsert -> update + insert // if present-> update or create automatically
    );

    res.json({
      message: "User interests updated",
      interests,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user interests" });
  }
};

// feed talk

const getTags = async (req, res) => {
  try {
    const tags = await Blog.distinct("tags", {
      status: "published",
      isDeleted: false,
    });

    res.json({ tags });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tags" });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Blog.distinct("category", {
      status: "published",
      isDeleted: false,
    });

    res.json({ categories });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

/**
 * FULLY SCALABLE BLOG SEARCH
 * Supports:
 * - keyword search
 * - tags & categories filter
 * - author filter
 * - date range
 * - pagination
 * - sorting
 * - fallback when no keyword
 */

const searchBlogs = async (req, res) => {
  try {
    const {
      q, // keyword
      tags, // comma separated
      category, // single or comma separated
      authorId,
      startDate,
      endDate,
      sortBy = "relevance", // relevance | newest | views
      page = 1,
      limit = 20,
    } = req.query;

    const skip = (page - 1) * limit;

    const filter = {
      status: "published",
      isDeleted: false,
    };

    /* ---------------- DATE FILTER ---------------- */
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    /* ---------------- AUTHOR FILTER ---------------- */
    if (authorId) {
      filter.authorId = authorId;
    }

    /* ---------------- TAG FILTER ---------------- */
    if (tags) {
      filter.tags = {
        $in: tags.split(",").map((t) => t.trim().toLowerCase()),
      };
    }

    /* ---------------- CATEGORY FILTER ---------------- */
    if (category) {
      filter.category = {
        $in: category.split(",").map((c) => c.trim().toLowerCase()),
      };
    }

    /* ---------------- TEXT SEARCH ---------------- */
    let query = Blog.find(filter);

    if (q) {
      query = Blog.find({
        ...filter,
        $text: { $search: q },
      }).select({
        score: { $meta: "textScore" },
      });
    }

    /* ---------------- SORTING ---------------- */
    const sortMap = {
      relevance: q ? { score: { $meta: "textScore" } } : { createdAt: -1 },
      newest: { createdAt: -1 },
      views: { views: -1 },
    };

    /* ---------------- EXECUTE QUERY ---------------- */
    const blogs = await query
      .sort(sortMap[sortBy])
      .skip(skip)
      .limit(Number(limit))
      .populate("authorId", "name")
      .lean();

    /* ---------------- TOTAL COUNT ---------------- */
    const total = q
      ? await Blog.countDocuments({
          ...filter,
          $text: { $search: q },
        })
      : await Blog.countDocuments(filter);

    res.json({
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
      blogs,
    });
  } catch (err) {
    res.status(500).json({ error: "Blog search failed" });
  }
};

// get personalized feed, need to add paging

const getFeed = async (req, res) => {
  try {
    const userId = req.user._id;
    const userObjectId = new mongoose.Types.ObjectId(req.user._id);

    const limit = Number(req.query.limit) || 20;

    /* ---------------- USER INTERESTS ---------------- */
    const interests = await UserInterest.findOne({ userId }).lean();

    const interestTags = interests?.tags || [];
    const interestCategories = interests?.categories || [];

    /* ---------------- USER INTERACTION HISTORY ---------------- */
    const interactions = await BlogInteraction.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: "$blogId",
          likeScore: {
            $sum: { $cond: [{ $eq: ["$type", "like"] }, 5, 0] },
          },
          commentScore: {
            $sum: { $cond: [{ $eq: ["$type", "comment"] }, 7, 0] },
          },
          viewScore: {
            $sum: { $cond: [{ $eq: ["$type", "view"] }, 1, 0] },
          },
          readTimeScore: {
            $sum: {
              $cond: [
                { $eq: ["$type", "read"] },
                { $divide: ["$duration", 30] },
                0,
              ],
            },
          },
        },
      },
    ]);

    const interactionMap = {};
    interactions.forEach((i) => {
      interactionMap[i._id.toString()] =
        i.likeScore + i.commentScore + i.viewScore + i.readTimeScore;
    });

    /* ---------------- BASE MATCH ---------------- */
    const matchStage = {
      status: "published",
      isDeleted: false,
    };

    if (interestTags.length || interestCategories.length) {
      matchStage.$or = [
        { tags: { $in: interestTags } },
        { category: { $in: interestCategories } },
      ];
    }

    /* ---------------- AGGREGATION ---------------- */
    const blogs = await Blog.aggregate([
      { $match: matchStage },

      /* ---------------- INTEREST SCORE ---------------- */
      {
        $addFields: {
          interestScore: {
            $add: [
              {
                $size: {
                  $setIntersection: ["$tags", interestTags],
                },
              },
              {
                $cond: [{ $in: ["$category", interestCategories] }, 3, 0],
              },
            ],
          },
        },
      },

      /* ---------------- FRESHNESS SCORE ---------------- */
      {
        $addFields: {
          freshnessScore: {
            $divide: [
              1,
              {
                $add: [
                  {
                    $divide: [
                      { $subtract: [new Date(), "$createdAt"] },
                      1000 * 60 * 60 * 24,
                    ],
                  },
                  1,
                ],
              },
            ],
          },
        },
      },

      /* ---------------- POPULARITY SCORE ---------------- */
      {
        $addFields: {
          popularityScore: {
            $add: [
              { $multiply: [{ $ifNull: ["$viewsCount", 0] }, 0.3] },
              { $multiply: [{ $ifNull: ["$likesCount", 0] }, 2] },
              { $multiply: [{ $ifNull: ["$commentsCount", 0] }, 3] },
            ],
          },
        },
      },

      /* ---------------- TOTAL SYSTEM SCORE ---------------- */
      {
        $addFields: {
          totalScore: {
            $add: ["$interestScore", "$freshnessScore", "$popularityScore"],
          },
        },
      },

      /* ---------------- USER REACTION LOOKUP ---------------- */

      {
        $lookup: {
          from: "reactions", //  correct collection
          let: { blogId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$blogId", "$$blogId"] },
                    { $eq: ["$userId", userObjectId] },
                  ],
                },
              },
            },
            { $limit: 1 },
          ],
          as: "myReactionData",
        },
      },

      {
        $addFields: {
          myReaction: {
            $arrayElemAt: ["$myReactionData.type", 0],
          },
        },
      },
      {
        $project: {
          myReactionData: 0,
        },
      },

      /* ---------------- SORT + LIMIT ---------------- */
      { $sort: { totalScore: -1 } },
      { $limit: limit },
    ]);

    /* ---------------- APPLY BEHAVIOR BOOST ---------------- */
    const rankedBlogs = blogs
      .map((blog) => {
        const behaviorScore = interactionMap[blog._id.toString()] || 0;

        return {
          ...blog,
          finalScore: blog.totalScore + behaviorScore,
          myReaction: blog.myReaction || null,
        };
      })
      .sort((a, b) => b.finalScore - a.finalScore);

    return res.json({
      count: rankedBlogs.length,
      blogs: rankedBlogs,
    });
  } catch (err) {
    console.error("Feed error:", err);
    return res.status(500).json({
      error: "Failed to load personalized feed",
    });
  }
};

module.exports = {
  createBlog,
  updateBlog,
  deleteBlog,
  readBlog,
  readBlogUsingSlug,
  myBlog,
  updateBlogStatus, 
  getFeaturedBlogs,
  featureBlog,
  unfeatureBlog,
  notPersonalisedFeed,
  trending,
  blogView,
  reactionOnBlog,
  getReactionPerType,
  commentOnBlog,
  commentOnComment,
  getComments,
  updateComment,
  deleteComment,
  getBlogViews,
  trackBlogView,
  getBlogsViewStats,
  createReport,
  listReports,
  updateReportStatus,
  getUserInterests,
  createUserInterests,
  updateUserInterests,
  getTags,
  getCategories,
  getFeed,
  searchBlogs,
  getCategories,
  getTags,
};
