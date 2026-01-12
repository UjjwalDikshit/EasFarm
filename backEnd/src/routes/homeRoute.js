const express = require('express');
const router = express.Router();
const homePage = require('../controllers/homePage');
const { updateBanners, updateCategories, createHome } = require('../controllers/updateHome');
const validUser = require('../middlewares/validUser');


console.log('inside homeroute');

router.get('/', homePage);//validUser
router.put('/createhome', createHome); // for admin only
router.put('/updateban', updateBanners); // for admin only
router.put('/updateCat', updateCategories); // for admin only

// put check in upper admin work for admin authentication


module.exports = router;