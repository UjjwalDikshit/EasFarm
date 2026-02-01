const jwt = require("jsonwebtoken");
const Blog = require("../../models/blogs/blog");
const UserInterest = require("../.blogs./models/userInterest");
const BlogView = require('../../models/blogs/blogViews');
const Reaction = require("../../models/blogs/reaction");
const Comment = require('../../models/blogs/comment')

const blog = require("../../models/blogs/blog");


const createBlog = async (req, res) => {
  try {
    const {
      authorId, // ideally from req.user._id
      title,
      slug,
      content,
      coverImage,
      videoUrl,
      tags = [],
      category,
      isFeatured = false,
    } = req.body;

    if (!authorId || !title) {
      return res.status(400).json({
        success: false,
        message: "authorId, title  are required",
      });
    }

    // auto-generate slug if not provided
    const finalSlug =
      slug ||
      title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const blog = await Blog.create({
      authorId,
      title,
      slug: finalSlug,
      content,
      coverImage,
      videoUrl,
      tags,
      category,
      status: "draft",
      isFeatured,
      publishedAt: null,
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

    // 3.media update
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

    const blog = await Blog.findOne({
      _id: id,
      isDeleted: false
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      data: blog
    });

  } catch (error) {
    console.error("Read blog error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog"
    });
  }
};


const readBlogUsingSlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({
      slug,
      isDeleted: false,
      status: "published"   // important
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      data: blog
    });

  } catch (error) {
    console.error("Read blog by slug error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog"
    });
  }
};

//  send using paging
const myBlog = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const authorId = payload._id;

    const blogs = await Blog.find({
      authorId,
      isDeleted: false
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "My blogs fetched successfully",
      data: blogs
    });

  } catch (error) {
    console.error("My blogs error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

const publishBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false
      },
      {
        $set: {
          status: "published",
          publishedAt: new Date()
        }
      },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog published successfully",
      data: blog
    });

  } catch (error) {
    console.error("Publish blog error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to publish blog"
    });
  }
};

const unpublishBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false
      },
      {
        $set: {
          status: "draft",
          publishedAt: null
        }
      },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog moved to draft successfully",
      data: blog
    });

  } catch (error) {
    console.error("Unpublish blog error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to unpublish blog"
    });
  }
};


const getFeaturedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({
      isFeatured: true,
      isDeleted: false,
      status: "published"
    })
      .sort({ publishedAt: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      message: "Featured blogs fetched successfully",
      data: blogs
    });

  } catch (error) {
    console.error("Featured blogs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch featured blogs"
    });
  }
};

const featureBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { isFeatured: true } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog marked as featured",
      data: blog
    });

  } catch (error) {
    console.error("Feature blog error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to feature blog"
    });
  }
};

const unfeatureBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { isFeatured: false } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog removed from featured",
      data: blog
    });

  } catch (error) {
    console.error("Unfeature blog error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to unfeature blog"
    });
  }
};

const notPersonalisedFeed = async(req,res)=>{

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
      isDeleted: false
    };

    if (interest) {
      matchQuery.$or = [
        { tags: { $in: interest.tags || [] } },
        { category: { $in: interest.categories || [] } }
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
      data: blogs
    });

  } catch (error) {
    console.error("Feed error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load feed"
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
      isDeleted: false
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
      data: blogs
    });

  } catch (error) {
    console.error("Trending feed error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load trending blogs"
    });
  }
};

const blogView = async(req,res)=>{
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
    const viewQuery = userId
      ? { blogId, userId }
      : { blogId, ipAddress };

    const existingView = await BlogView.findOne(viewQuery);

    // 3️⃣ If first view → create BlogView + update counters
    if (!existingView) {
      await BlogView.create({
        blogId,
        userId,
        ipAddress,
        userAgent
      });

      // 4️⃣ Increment blog counters atomically
      await Blog.findByIdAndUpdate(
        blogId,
        {
          $inc: {
            totalViews: 1,
            viewsCount: 1,
            trendingScore: 1   // keep simple for now
          },
          $set: {
            lastViewedAt: new Date()
          }
        },
        { new: false }
      );
    } else {
      // 5️⃣ Optional: still increment total views (not unique / trending)
      await Blog.findByIdAndUpdate(
        blogId,
        {
          $inc: { totalViews: 1 },
          $set: { lastViewedAt: new Date() }
        }
      );
    }

    return res.status(200).json({
      success: true,
      viewed: true
    });

  } catch (error) {
    console.error("Blog view error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// REACT ON BLOG Logged-in users only
const reactionOnBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const userId = req.user.id; // auth required
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
        $inc: { likesCount: -1, trendingScore: -3 }
        
      });

      return res.status(200).json({
        reacted: false,
        reaction: null
      });
    }

    // 3️⃣ If reaction exists but different type → update
    if (existingReaction) {
      await Reaction.updateOne(
        { _id: existingReaction._id },
        { $set: { type } }
      );

      // likesCount stays same
      return res.status(200).json({
        reacted: true,
        reaction: type
      });
    }

    // 4️⃣ No reaction yet → create new
    await Reaction.create({
      blogId,
      userId,
      type
    });

    await Blog.findByIdAndUpdate(blogId, {
      $inc: { likesCount: 1 , trendingScore: 3}
    });

    return res.status(200).json({
      reacted: true,
      reaction: type
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

const getReactionPerType = async(req,res)=>{ // need to work on this functoin
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

const commentOnBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const userId = req.user.id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const comment = await Comment.create({
      blogId,
      userId,
      content: content.trim(),
      parentCommentId: null
    });

    // Optional: increment comment count on blog
    await Blog.findByIdAndUpdate(blogId, {
      $inc: { commentsCount: 1,trendingScore: 5 }
    });

    return res.status(201).json({
      success: true,
      comment
    });

  } catch (error) {
    console.error("Comment on blog error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const commentOnComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Reply cannot be empty" });
    }

    // Ensure parent comment exists & not deleted
    const parentComment = await Comment.findOne({
      _id: commentId,
      isDeleted: false
    }).select("blogId");

    if (!parentComment) {
      return res.status(404).json({ message: "Parent comment not found" });
    }

    const reply = await Comment.create({
      blogId: parentComment.blogId,
      userId,
      content: content.trim(),
      parentCommentId: commentId
    });

    await Comment.findByIdAndUpdate(commentId, {
      $inc: { repliesCount: 1 }
    });


    return res.status(201).json({
      success: true,
      comment: reply
    });

  } catch (error) {
    console.error("Comment on comment error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getComments = async (req, res) => {
  try {
    const blogId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 20);
    const skip = (page - 1) * limit;

    const comments = await Comment.find({
      blogId,
      parentCommentId: null,
      isDeleted: false
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name avatar");

    const total = await Comment.countDocuments({
      blogId,
      parentCommentId: null,
      isDeleted: false
    });

    return res.status(200).json({
      page,
      limit,
      total,
      comments
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
      isDeleted: false
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found or unauthorized" });
    }

    // Add edit window (LinkedIn-style)
    const EDIT_WINDOW_MS = 15 * 24 * 60 * 60 * 1000;

    if (Date.now() - comment.createdAt.getTime() > EDIT_WINDOW_MS) {
      return res.status(403).json({
        message: "Editing window expired"
      });
    }

    comment.content = content.trim();
    await comment.save();

    return res.status(200).json({
      success: true,
      comment
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
      isDeleted: false
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found or unauthorized" });
    }

    comment.isDeleted = true;
    comment.content = "[deleted]";
    await comment.save();

    return res.status(200).json({
      success: true
    });

  } catch (error) {
    console.error("Delete comment error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { createBlog, updateBlog, deleteBlog, readBlog , readBlogUsingSlug,
                    myBlog, publishBlog, unpublishBlog, getFeaturedBlogs, featureBlog,
                  unfeatureBlog, notPersonalisedFeed, trending, blogView, reactionOnBlog
                , getReactionPerType, commentOnBlog, commentOnComment, getComments, updateComment
               ,deleteComment};
