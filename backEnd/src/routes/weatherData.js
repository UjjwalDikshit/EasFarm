const express = require('express');
const getWeather = require('../controllers/weather_controller.js')
const weather_ji  = express.Router();


weather_ji.get('/weather', getWeather);


module.exports = weather_ji;