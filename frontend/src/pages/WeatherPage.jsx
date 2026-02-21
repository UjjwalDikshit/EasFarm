// WeatherPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  CloudRain,
  Eye,
  Moon,
  Gauge,
  Compass,
  Calendar,
  Clock,
  Sunrise,
  Sunset,
  Cloud,
  CloudSnow,
  CloudLightning,
  CloudFog,
  AlertCircle
} from 'lucide-react';
import { getUserLocation } from '../utils/location';

const WeatherPage = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    fetchLocationAndWeather();
  }, []);

  const fetchLocationAndWeather = async () => {
    try {
      setLoading(true);
      
      // Get user location
      const userLocation = await getUserLocation();
      setLocation(userLocation);

      // Fetch weather data from your backend
      const response = await fetch(
        `http://localhost:5000/api/weather?lat=${userLocation.lat}&lon=${userLocation.lon}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      setWeatherData(data.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load weather data');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (code, isDay) => {
    // Map weather condition codes to appropriate icons
    const iconMap = {
      1000: isDay ? <Sun className="w-12 h-12 text-yellow-400" /> : <Sun className="w-12 h-12 text-blue-200" />,
      1003: <Cloud className="w-12 h-12 text-gray-400" />,
      1006: <Cloud className="w-12 h-12 text-gray-500" />,
      1009: <Cloud className="w-12 h-12 text-gray-600" />,
      1030: <CloudFog className="w-12 h-12 text-gray-400" />,
      1063: <CloudRain className="w-12 h-12 text-blue-300" />,
      1066: <CloudSnow className="w-12 h-12 text-blue-200" />,
      1069: <CloudSnow className="w-12 h-12 text-blue-300" />,
      1072: <CloudRain className="w-12 h-12 text-blue-300" />,
      1087: <CloudLightning className="w-12 h-12 text-yellow-500" />,
      1114: <CloudSnow className="w-12 h-12 text-blue-200" />,
      1117: <CloudSnow className="w-12 h-12 text-blue-100" />,
      1135: <CloudFog className="w-12 h-12 text-gray-400" />,
      1147: <CloudFog className="w-12 h-12 text-gray-500" />,
      1150: <CloudRain className="w-12 h-12 text-blue-300" />,
      1153: <CloudRain className="w-12 h-12 text-blue-400" />,
      1168: <CloudRain className="w-12 h-12 text-blue-400" />,
      1171: <CloudRain className="w-12 h-12 text-blue-500" />,
      1180: <CloudRain className="w-12 h-12 text-blue-300" />,
      1183: <CloudRain className="w-12 h-12 text-blue-400" />,
      1186: <CloudRain className="w-12 h-12 text-blue-500" />,
      1189: <CloudRain className="w-12 h-12 text-blue-500" />,
      1192: <CloudRain className="w-12 h-12 text-blue-600" />,
      1195: <CloudRain className="w-12 h-12 text-blue-700" />,
      1198: <CloudRain className="w-12 h-12 text-blue-400" />,
      1201: <CloudRain className="w-12 h-12 text-blue-500" />,
      1204: <CloudSnow className="w-12 h-12 text-blue-300" />,
      1207: <CloudSnow className="w-12 h-12 text-blue-400" />,
      1210: <CloudSnow className="w-12 h-12 text-blue-200" />,
      1213: <CloudSnow className="w-12 h-12 text-blue-300" />,
      1216: <CloudSnow className="w-12 h-12 text-blue-300" />,
      1219: <CloudSnow className="w-12 h-12 text-blue-400" />,
      1222: <CloudSnow className="w-12 h-12 text-blue-400" />,
      1225: <CloudSnow className="w-12 h-12 text-blue-500" />,
      1237: <CloudSnow className="w-12 h-12 text-blue-300" />,
      1240: <CloudRain className="w-12 h-12 text-blue-300" />,
      1243: <CloudRain className="w-12 h-12 text-blue-500" />,
      1246: <CloudRain className="w-12 h-12 text-blue-700" />,
      1249: <CloudSnow className="w-12 h-12 text-blue-300" />,
      1252: <CloudSnow className="w-12 h-12 text-blue-500" />,
      1255: <CloudSnow className="w-12 h-12 text-blue-200" />,
      1258: <CloudSnow className="w-12 h-12 text-blue-400" />,
      1261: <CloudSnow className="w-12 h-12 text-blue-300" />,
      1264: <CloudSnow className="w-12 h-12 text-blue-500" />,
      1273: <CloudLightning className="w-12 h-12 text-yellow-500" />,
      1276: <CloudLightning className="w-12 h-12 text-yellow-600" />,
      1279: <CloudSnow className="w-12 h-12 text-blue-200" />,
      1282: <CloudSnow className="w-12 h-12 text-blue-300" />
    };

    return iconMap[code] || <Cloud className="w-12 h-12 text-gray-400" />;
  };

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Fetching weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center border border-white/20">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
          <p className="text-blue-200 mb-6">{error}</p>
          <button 
            onClick={fetchLocationAndWeather}
            className="btn btn-primary bg-blue-500 hover:bg-blue-600 border-none text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!weatherData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/30 rounded-2xl">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {weatherData.city}
                </h1>
                <p className="text-blue-200 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                  <Clock className="w-4 h-4 ml-2" />
                  {new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
            <button 
              onClick={fetchLocationAndWeather}
              className="btn btn-ghost text-white hover:bg-white/20 border border-white/30"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Refresh Location
            </button>
          </div>
        </div>

        {/* Main Weather Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Weather */}
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 border border-white/20 shadow-xl">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                {getWeatherIcon(weatherData.condition?.code || 1000, true)}
                <div className="absolute -bottom-2 -right-2 bg-blue-500/50 rounded-full p-2 backdrop-blur-sm border border-white/30">
                  <span className="text-xs text-white">{weatherData.description}</span>
                </div>
              </div>
              <div className="text-center md:text-left flex-1">
                <div className="text-6xl md:text-7xl font-bold text-white mb-2">
                  {Math.round(weatherData.temperature)}°C
                </div>
                <p className="text-2xl text-blue-100 mb-2">
                  Feels like {Math.round(weatherData.feelsLike)}°C
                </p>
                <p className="text-blue-200 text-lg capitalize">
                  {weatherData.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                  <Droplets className="w-5 h-5 text-blue-200 mx-auto mb-1" />
                  <p className="text-white font-semibold">{weatherData.humidity}%</p>
                  <p className="text-xs text-blue-200">Humidity</p>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                  <Wind className="w-5 h-5 text-blue-200 mx-auto mb-1" />
                  <p className="text-white font-semibold">{weatherData.windSpeed} km/h</p>
                  <p className="text-xs text-blue-200">Wind Speed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-blue-300" />
                  <span className="text-blue-200">Pressure</span>
                </div>
                <span className="text-white font-semibold">{weatherData.pressure || 1013} mb</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-300" />
                  <span className="text-blue-200">Visibility</span>
                </div>
                <span className="text-white font-semibold">{weatherData.visibility || 10} km</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-blue-300" />
                  <span className="text-blue-200">Wind Direction</span>
                </div>
                <span className="text-white font-semibold">{getWindDirection(weatherData.windDegree || 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-blue-300" />
                  <span className="text-blue-200">UV Index</span>
                </div>
                <span className="text-white font-semibold">{weatherData.uv || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Weather Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Temperature Details */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <Thermometer className="w-5 h-5 text-blue-300" />
              <h3 className="text-white font-semibold">Temperature</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Current</span>
                <span className="text-white font-medium">{weatherData.temperature}°C</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Feels Like</span>
                <span className="text-white font-medium">{weatherData.feelsLike}°C</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Min/Max</span>
                <span className="text-white font-medium">{weatherData.minTemp || weatherData.temperature}° / {weatherData.maxTemp || weatherData.temperature}°C</span>
              </div>
            </div>
          </div>

          {/* Humidity & Precipitation */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <Droplets className="w-5 h-5 text-blue-300" />
              <h3 className="text-white font-semibold">Humidity & Rain</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Humidity</span>
                <span className="text-white font-medium">{weatherData.humidity}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Dew Point</span>
                <span className="text-white font-medium">{weatherData.dewpoint_c || '--'}°C</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Precipitation</span>
                <span className="text-white font-medium">{weatherData.precip_mm || 0} mm</span>
              </div>
            </div>
          </div>

          {/* Wind Details */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <Wind className="w-5 h-5 text-blue-300" />
              <h3 className="text-white font-semibold">Wind</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Speed</span>
                <span className="text-white font-medium">{weatherData.windSpeed} km/h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Direction</span>
                <span className="text-white font-medium">{getWindDirection(weatherData.windDegree || 0)} ({weatherData.windDegree || 0}°)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Gust</span>
                <span className="text-white font-medium">{weatherData.gust_kph || 0} km/h</span>
              </div>
            </div>
          </div>

          {/* Atmospheric Conditions */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <Cloud className="w-5 h-5 text-blue-300" />
              <h3 className="text-white font-semibold">Atmosphere</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Pressure</span>
                <span className="text-white font-medium">{weatherData.pressure || 1013} mb</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Visibility</span>
                <span className="text-white font-medium">{weatherData.visibility || 10} km</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Cloud Cover</span>
                <span className="text-white font-medium">{weatherData.cloud || 0}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Additional Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Sunrise className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-xs text-blue-200">Sunrise</p>
              <p className="text-white font-medium">{weatherData.sunrise || '06:30'}</p>
            </div>
            <div className="text-center">
              <Sunset className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <p className="text-xs text-blue-200">Sunset</p>
              <p className="text-white font-medium">{weatherData.sunset || '18:45'}</p>
            </div>
            <div className="text-center">
              <Moon className="w-6 h-6 text-blue-200 mx-auto mb-2" />
              <p className="text-xs text-blue-200">Moon Phase</p>
              <p className="text-white font-medium">{weatherData.moon_phase || 'Waxing Gibbous'}</p>
            </div>
            <div className="text-center">
              <Sun className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-xs text-blue-200">UV Index</p>
              <p className="text-white font-medium">{weatherData.uv || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;