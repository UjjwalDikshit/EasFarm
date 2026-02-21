// const axios = require('axios');

// const fetchWeatherData = async(lat,lon)=>{
//     const res = await axios.get(
//     `${process.env.WEATHER_BASE_URL}/current.json`,
//         {
//             params: {
//                 key: process.env.WEATHER_API_KEY,
//                 q: `${lat},${lon}`
//             }
//         }
//     );

//      return {
//         city: res.data.location.name,
//         temperature: res.data.current.temp_c,
//         feelsLike: res.data.current.feelslike_c,
//         humidity: res.data.current.humidity,
//         description: res.data.current.condition.text,
//         icon: res.data.current.condition.icon,
//         windSpeed: res.data.current.wind_kph
//   };
// };

// module.exports  = fetchWeatherData;

// services/weather_service.js - Enhanced version with forecast data
const axios = require('axios');

const fetchWeatherData = async(lat, lon) => {
    // Fetch current weather
    const currentRes = await axios.get(
        `${process.env.WEATHER_BASE_URL}/current.json`,
        {
            params: {
                key: process.env.WEATHER_API_KEY,
                q: `${lat},${lon}`
            }
        }
    );

    // Fetch forecast data for additional info (sunrise, sunset, moon phase)
    const forecastRes = await axios.get(
        `${process.env.WEATHER_BASE_URL}/forecast.json`,
        {
            params: {
                key: process.env.WEATHER_API_KEY,
                q: `${lat},${lon}`,
                days: 1
            }
        }
    );

    const forecast = forecastRes.data.forecast.forecastday[0];
    const astronomy = forecast.astro;

    return {
        // Location info
        city: currentRes.data.location.name,
        region: currentRes.data.location.region,
        country: currentRes.data.location.country,
        lat: currentRes.data.location.lat,
        lon: currentRes.data.location.lon,
        localtime: currentRes.data.location.localtime,
        
        // Current weather - core data
        temperature: currentRes.data.current.temp_c,
        feelsLike: currentRes.data.current.feelslike_c,
        humidity: currentRes.data.current.humidity,
        description: currentRes.data.current.condition.text,
        icon: currentRes.data.current.condition.icon,
        condition: {
            text: currentRes.data.current.condition.text,
            icon: currentRes.data.current.condition.icon,
            code: currentRes.data.current.condition.code
        },
        
        // Wind details
        windSpeed: currentRes.data.current.wind_kph,
        windMph: currentRes.data.current.wind_mph,
        windDegree: currentRes.data.current.wind_degree,
        windDir: currentRes.data.current.wind_dir,
        gust_kph: currentRes.data.current.gust_kph,
        gust_mph: currentRes.data.current.gust_mph,
        
        // Atmospheric conditions
        pressure_mb: currentRes.data.current.pressure_mb,
        pressure_in: currentRes.data.current.pressure_in,
        precip_mm: currentRes.data.current.precip_mm,
        precip_in: currentRes.data.current.precip_in,
        cloud: currentRes.data.current.cloud,
        visibility: currentRes.data.current.vis_km,
        visibility_miles: currentRes.data.current.vis_miles,
        
        // Temperature details
        temp_f: currentRes.data.current.temp_f,
        feelslike_f: currentRes.data.current.feelslike_f,
        windchill_c: currentRes.data.current.windchill_c,
        windchill_f: currentRes.data.current.windchill_f,
        heatindex_c: currentRes.data.current.heatindex_c,
        heatindex_f: currentRes.data.current.heatindex_f,
        dewpoint_c: currentRes.data.current.dewpoint_c,
        dewpoint_f: currentRes.data.current.dewpoint_f,
        
        // UV and other
        uv: currentRes.data.current.uv,
        
        // Min/Max temperatures from forecast
        minTemp: forecast.day.mintemp_c,
        maxTemp: forecast.day.maxtemp_c,
        
        // Astronomy data
        sunrise: astronomy.sunrise,
        sunset: astronomy.sunset,
        moon_phase: astronomy.moon_phase,
        moonrise: astronomy.moonrise,
        moonset: astronomy.moonset,
        moon_illumination: astronomy.moon_illumination
    };
};

module.exports = fetchWeatherData;