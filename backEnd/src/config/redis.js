const { createClient } = require('redis');

const redisClient = createClient({
  username: 'default',
  password: process.env.REDIS_PASS,
  socket: {
    host: 'redis-13074.c301.ap-south-1-1.ec2.cloud.redislabs.com',
    port: 13074,

    // 🔑 IMPORTANT FIXES
    keepAlive: 5000,
    reconnectStrategy: (retries) => {
      console.log(`Redis reconnect attempt: ${retries}`);
      return Math.min(retries * 100, 3000);
    }
  }
});

redisClient.on('connect', () => {
  console.log('Redis connected');
});

redisClient.on('ready', () => {
  console.log('Redis ready');
});

redisClient.on('reconnecting', () => {
  console.log('Redis reconnecting...');
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('end', () => {
  console.log('Redis connection closed');
});


module.exports = redisClient;
