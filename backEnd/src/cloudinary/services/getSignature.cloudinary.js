const cloudinary = require('../config/cloudinary')
const uploadFolderMap = require('../utils/uploadFolderMap')

const getUploadSignature = async (req, res) => {
  try {
    const { type } = req.body;

    const timestamp = Math.round(Date.now() / 1000);

    if (!uploadFolderMap[type]) {
      return res.status(400).json({ message: "Invalid upload type" });
    }

    const paramsToSign = {
      timestamp,
      ...uploadFolderMap[type],
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      timestamp,
      signature,
      detailOfFile: uploadFolderMap[type],
      cloudName: process.env.CLOUDINARY_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    res.status(500).json({ message: "Signature generation failed" });
  }
};


module.exports = getUploadSignature;