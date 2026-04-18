const express = require('express');
const router = express.Router();

const {
    makeAdmin,
    removeAdmin,
    getAllAdmins
} = require('../controllers/superAdminWork');

const {
    getHome,
    createHome,
    addBanner,
    updateBanner,
    deleteBanner,
    addCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/updateHome');

const isAuth = require('../middlewares/authMiddleware');
const isSuperAdmin = require('../middlewares/isSuperAdmin');


//  ROLE MANAGEMENT
router.put('/make-admin', isAuth, isSuperAdmin, makeAdmin);
router.put('/remove-admin/:userId', isAuth, isSuperAdmin, removeAdmin);
router.get('/admins', isAuth, isSuperAdmin, getAllAdmins);


//  HOMEPAGE CONTROL
router.get('/home',isAuth, isSuperAdmin, getHome);
router.post('/home', isAuth, isSuperAdmin, createHome);

// BANNERS
router.post('/home/banner', isAuth, isSuperAdmin, addBanner);
router.put('/home/banner/:bannerId', isAuth, isSuperAdmin, updateBanner);
router.delete('/home/banner/:bannerId', isAuth, isSuperAdmin, deleteBanner);

//  CATEGORIES
router.post('/home/category', isAuth, isSuperAdmin, addCategory);
router.put('/home/category/:categoryId', isAuth, isSuperAdmin, updateCategory);
router.delete('/home/category/:categoryId', isAuth, isSuperAdmin, deleteCategory);


module.exports = router;