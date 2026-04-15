
const express = require('express');
const updateFarmer = require('../controllers/update-farmer');
const authMiddleware = require('../middlewares/authMiddleware');
const chat = express.Router();

chat.post("/farmer/update-chat",authMiddleware,updateFarmer);

module.exports = chat;