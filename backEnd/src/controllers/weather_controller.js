const { setCache, getCache } = require('../utils/cache.js');
const  fetchWeatherData = require('../services/weather_service.js');

const getWeather = async (req, res) => {
  try {

    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude required"
      });
    }

    const cacheKey = `weather:${lat},${lon}`;
    const cached = await getCache(cacheKey);

    if (cached) {
      return res.json({
        success: true,
        source: "cache",
        data: cached
      });
    }


    const weather = await fetchWeatherData(lat, lon);
    await setCache(cacheKey, weather, 600);
    
    console.log(weather.windSpeed);

    res.json({
      success: true,
      source: "api",
      data: weather
    });

  }
  catch (err) {
    console.error("WEATHER ERROR:", err.response?.data || err.message);
    res.status(500).json({
        success: false,
        message: "Failed to fetch weather"
    });
    }
};

module.exports = getWeather;
