const uploadFolderMap = {
  profile: {
    folder: "production/users/profile",
    resource_type: "image",
  },
  blog: {
    image: { folder: "production/blogs/images", resource_type: "image" },
    video: {
      folder: "production/blogs/videos",
      resource_type: "video",
      eager: [
        {
          format: "jpg",
          width: 320,
          height: 180,
          crop: "fill",
        },
        {
          format: "jpg",
          width: 1280,
          height: 720,
          crop: "fill",
        },
      ],
      eager_async:false,
    },
    pdf: {
      folder: "production/blogs/pdf",
      resource_type: "raw",
    },
  },
  product: {
    folder: "production/products/images",
    resource_type: "image",
  },
  course: {
    folder: "production/courses/videos",
    resource_type: "video",
  },
  reel: {
    folder: "production/reels/videos",
    resource_type: "video",
  },
};

module.exports = uploadFolderMap;
