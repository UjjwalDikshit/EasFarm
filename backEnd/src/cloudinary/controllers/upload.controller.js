const streamUpload = require("../services/cloudinary.service");
// need to send type from frontend to backend
const uploadFolderMap = require("../utils/uploadFolderMap");

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.file;
    const { type } = req.body; // blog,profile,product,course,reel

    if (!type || !uploadFolderMap[type]) {
      return res.status(400).json({ message: "Invalid upload type" });
    }

    const config = uploadFolderMap[type];
    let finalFolderAndResourceType;

   
    let transformations = [];

    // IMAGE
    if (file.mimetype.startsWith("image")) {
      if (file.size > 20 * 1024 * 1024) {
        return res.status(400).json({ message: "Image exceeds 20MB limit" });
      }

      finalFolderAndResourceType = config.image;

      transformations = [{ quality: "auto" }, { fetch_format: "auto" }];
    }

    // VIDEO
    else if (file.mimetype.startsWith("video")) {
      if (file.size > 1024 * 1024 * 1024) {
        return res.status(400).json({ message: "Video exceeds 1GB limit" });
      }

      finalFolderAndResourceType = config.video;

      transformations = [{ quality: "auto" }];
    }

    // PDF
    else if (file.mimetype === "application/pdf") {
      if (file.size > 50 * 1024 * 1024) {
        return res.status(400).json({ message: "PDF exceeds 50MB limit" });
      }

      finalFolderAndResourceType = config.pdf;
    }

    const result = await streamUpload(file.buffer, {
      ...finalFolderAndResourceType,
      transformation: transformations,
    });

    // as file uploaded so create blog or pass url and etc to create blog crud operation
    
    return res.status(200).json({
      message: "Upload successful",
      result,
      url: result.secure_url,
      public_id: result.public_id,
      bytes: result.bytes,
      format: result.format,
      resource_type: result.resource_type,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ message: "Upload failed" });
  }
};

module.exports = uploadFile;
