const express = require('express');
const router = express.Router();

const homepage  = require('../controllers/homePage');

console.log('inside homeroute');


//  PUBLIC (or logged-in)
router.get('/', homepage);


module.exports = router;