const axios = require('axios');

const fetchWeatherData = async(lat,lon)=>{
    const res = await axios.get(
    `${process.env.WEATHER_BASE_URL}/current.json`,
        {
            params: {
                key: process.env.WEATHER_API_KEY,
                q: `${lat},${lon}`
            }
        }
    );

     return {
        city: res.data.location.name,
        temperature: res.data.current.temp_c,
        feelsLike: res.data.current.feelslike_c,
        humidity: res.data.current.humidity,
        description: res.data.current.condition.text,
        icon: res.data.current.condition.icon,
        windSpeed: res.data.current.wind_kph
  };
};

module.exports  = fetchWeatherData;