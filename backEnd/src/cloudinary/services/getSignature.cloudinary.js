const cloudinary = require("../config/cloudinary");
const uploadFolderMap = require("../utils/uploadFolderMap");

const getUploadSignature = async (req, res) => {
  try {
    const { type, fileType } = req.body;

    const timestamp = Math.round(Date.now() / 1000);

    // Validate type
    if (!uploadFolderMap[type]) {
      return res.status(400).json({ message: "Invalid upload type" });
    }

    if (!["image", "video", "pdf"].includes(fileType)) {
      return res.status(400).json({ message: "Invalid file type" });
    }

    const config = uploadFolderMap[type][fileType];

    if (!config) {
      return res.status(400).json({ message: "Invalid file configuration" });
    }

    const paramsToSign = {
      timestamp,
      ...config,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    return res.json({
      timestamp,
      signature,
      ...config,
      cloudName: process.env.CLOUDINARY_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    return res.status(500).json({ message: "Signature generation failed" });
  }
};

module.exports = getUploadSignature;
