const cloudinary = require("../config/cloudinary") ;

/**
 * Delete single file from Cloudinary
 * @param {string} public_id
 * @param {string} resource_type ("image" | "video" | "raw")
 */
const deleteFile = async (public_id, resource_type = "image") => {
  try {
    if (!public_id) {
      throw new Error("public_id is required");
    }

    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type,
      invalidate: true, // clears CDN cache
    });

    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error("Cloudinary deletion failed");
    }

    return result;
  } catch (error) {
    console.error("Cloudinary Delete Error:", error.message);
    throw error;
  }
};

module.exports = deleteFile;