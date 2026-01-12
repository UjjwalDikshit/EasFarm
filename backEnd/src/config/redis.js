const { createClient } = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-14923.crce217.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 14923
    }
});
redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});

module.exports = redisClient;