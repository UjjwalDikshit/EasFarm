

const cache = new Map();

const setCache = (key,value,ttlSeconds)=>{
    cache.set(key,{
        value,
        expiresAt: Date.now() + ttlSeconds * 1000
    });
};

const getCache = (key)=>{
    const cached = cache.get(key);
    if(!cached) return null;

    if(Date.now() > cached.expiresAt){
        cache.delete(key);
        return null;
    }
    return cached.value;
};

module.exports = {setCache,getCache};

// ⚠️ Works well for:
// Single server
// Low–medium traffic
// 👉 Upgrade to Redis later if needed.