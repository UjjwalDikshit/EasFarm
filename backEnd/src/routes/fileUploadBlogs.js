const express = require('express');

const upload = require('../cloudinary/middleware.js/multer.middleware.js');
const uploadFile = require("../cloudinary/controllers/upload.controller.js") ;
const getUploadSignature = require('../cloudinary/services/getSignature.cloudinary.js');
const deleteMedia = require('../cloudinary/services/cloudinary.delete.service.js');
const rateLimit = require("express-rate-limit") ;

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
});


const router = express.Router();

// Universal upload route (image, video, pdf)
router.post("/upload",uploadLimiter, upload.single("file"), uploadFile);
// better for file > 100 MB to upload
router.post("/signature", getUploadSignature);
router.delete("/media", deleteMedia);

module.exports = router;
