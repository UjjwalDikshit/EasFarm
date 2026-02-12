const jwt = require('jsonwebtoken');
const Farmer = require('../models/farmerSchema');
const redisClient = require('../config/redis');


const validUser = async(req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            console.warn('No token found in cookies');
            return res.status(401).json({ success: false, message: 'No token provided' });
        }
        // to check connection with redis
        // redisClient.ping().then(() => {
        //     console.log(' Redis is alive');
        // }).catch((err) => {
        //     console.error(' Redis ping failed:', err);
        // });

        // if (!redisClient || typeof redisClient.exists !== 'function') {
        //     console.error('Redis client not initialized properly');
        //     return res.status(500).json({ success: false, message: 'Server error: Redis not available' });
        // }

        console.log('🔍 Checking blacklist...');
        const isBlacklisted = await redisClient.exists(`blacklist:${token}`);
        if (isBlacklisted === 1) {
            console.warn('Token is blacklisted');
            return res.status(401).json({ success: false, message: 'Invalid Token' });
        }

        console.log('🔐 Verifying JWT...');
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.farmer = payload;

        const { _id } = payload;
        console.log(`👤 Verifying user with ID: ${_id}`);

        const existThisUser = await Farmer.findById(_id);
        if (!existThisUser) {
            console.warn('User not found in database');
            return res.status(401).json({ success: false, message: 'Unauthorized User' });
        }

        console.log('✅ Authenticated successfully');
        next();
    } catch (err) {
        console.error('Authentication error:', err.message);
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

module.exports = validUser;