const jwt = require("jsonwebtoken");
const Blog = require("../../models/blogs/blog");

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
  
};

module.exports = { createBlog, updateBlog, deleteBlog, readBlog , readBlogUsingSlug,
                    myBlog, publishBlog, unpublishBlog, getFeaturedBlogs, featureBlog,
                  unfeatureBlog, notPersonalisedFeed};
