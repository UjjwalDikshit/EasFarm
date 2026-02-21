const express = require('express');
const Login = require('../controllers/Login');
const signUp = require('../controllers/signUp');
const validUser = require('../middlewares/validUser');
const checkLogin = require('../controllers/me')
const logout = require('../controllers/logout')
const sendOtp = require('../controllers/otpSender');
const authMiddleware = require('../middlewares/authMiddleware');
const me = require('../controllers/me');
const user_auth = express.Router();

const users = [];


user_auth.post('/login', Login);
user_auth.post('/sendotp', sendOtp);
user_auth.post('/signup', signUp);
user_auth.post('/logout', authMiddleware, logout);
user_auth.post('/checkLogin',authMiddleware,checkLogin);
user_auth.get('/me',authMiddleware, me);

module.exports = user_auth;