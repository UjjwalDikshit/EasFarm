const  { deleteFile } = require("../services/cloudinary.delete.service")

const deleteMedia = async (req, res) => {
  try {
    const { public_id, resource_type } = req.body;

    if (!public_id) {
      return res.status(400).json({
        success: false,
        message: "public_id is required",
      });
    }

    const result = await deleteFile(
      public_id,
      resource_type || "image"
    );

    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
      result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete file",
    });
  }
};

module.export = deleteMedia;