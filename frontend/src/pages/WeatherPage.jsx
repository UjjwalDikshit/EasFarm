import React, { useState, useEffect } from "react";
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
  AlertCircle,
} from "lucide-react";
import { getUserLocation } from "../utils/location";

const WeatherPage = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLocationAndWeather();
  }, []);

  const fetchLocationAndWeather = async () => {
    try {
      setLoading(true);
      const userLocation = await getUserLocation();

      const res = await fetch(
        `http://localhost:4000/api/weather?lat=${userLocation.lat}&lon=${userLocation.lon}`
      );

      if (!res.ok) throw new Error("Failed to fetch weather");

      const data = await res.json();
      setWeatherData(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (code) => {
    if (code === 1000) return <Sun className="w-12 h-12 text-warning" />;
    if (code >= 1180) return <CloudRain className="w-12 h-12 text-info" />;
    return <Cloud className="w-12 h-12 text-base-content/50" />;
  };

  const getWindDirection = (deg) => {
    const dirs = ["N","NE","E","SE","S","SW","W","NW"];
    return dirs[Math.round(deg / 45) % 8];
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-base-content">Fetching weather data...</p>
        </div>
      </div>
    );
  }

  // ================= ERROR =================
  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="bg-base-100 rounded-2xl p-8 text-center border border-base-300 shadow-lg">
          <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
          <p className="text-base-content mb-4">{error}</p>
          <button onClick={fetchLocationAndWeather} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!weatherData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-300 to-base-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-base-100/70 backdrop-blur-lg rounded-3xl p-6 border border-base-300 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
              <MapPin /> {weatherData.city}
            </h1>
            <p className="text-sm text-base-content/70 flex items-center gap-2 mt-1">
              <Calendar size={14} />
              {new Date().toDateString()}
              <Clock size={14} />
              {new Date().toLocaleTimeString()}
            </p>
          </div>

          <button onClick={fetchLocationAndWeather} className="btn btn-outline">
            Refresh
          </button>
        </div>

        {/* MAIN */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* CURRENT */}
          <div className="lg:col-span-2 bg-gradient-to-br from-primary to-primary-focus text-primary-content rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-4">

              <div>
                <div className="text-6xl font-bold">
                  {Math.round(weatherData.temperature)}°C
                </div>
                <p>Feels like {weatherData.feelsLike}°C</p>
                <p className="capitalize">{weatherData.description}</p>
              </div>

              {getWeatherIcon(weatherData.condition?.code)}

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-base-100/20 p-3 rounded-xl text-center">
                  <Droplets className="mx-auto mb-1" />
                  {weatherData.humidity}%
                </div>
                <div className="bg-base-100/20 p-3 rounded-xl text-center">
                  <Wind className="mx-auto mb-1" />
                  {weatherData.windSpeed} km/h
                </div>
              </div>

            </div>
          </div>

          {/* QUICK */}
          <div className="bg-base-100/70 backdrop-blur-lg rounded-3xl p-6 border border-base-300">
            <h2 className="font-semibold mb-4">Quick Stats</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Pressure</span>
                <span>{weatherData.pressure} mb</span>
              </div>
              <div className="flex justify-between">
                <span>Visibility</span>
                <span>{weatherData.visibility} km</span>
              </div>
              <div className="flex justify-between">
                <span>Wind Dir</span>
                <span>{getWindDirection(weatherData.windDegree)}</span>
              </div>
              <div className="flex justify-between">
                <span>UV</span>
                <span>{weatherData.uv}</span>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="card bg-base-100 border border-base-300 p-4">
            <h3 className="font-semibold mb-2 flex gap-2">
              <Thermometer /> Temp
            </h3>
            <p>{weatherData.temperature}°C</p>
            <p>Feels {weatherData.feelsLike}°C</p>
          </div>

          <div className="card bg-base-100 border border-base-300 p-4">
            <h3 className="font-semibold mb-2 flex gap-2">
              <Droplets /> Humidity
            </h3>
            <p>{weatherData.humidity}%</p>
            <p>Rain {weatherData.precip_mm || 0}mm</p>
          </div>

          <div className="card bg-base-100 border border-base-300 p-4">
            <h3 className="font-semibold mb-2 flex gap-2">
              <Wind /> Wind
            </h3>
            <p>{weatherData.windSpeed} km/h</p>
            <p>{getWindDirection(weatherData.windDegree)}</p>
          </div>

          <div className="card bg-base-100 border border-base-300 p-4">
            <h3 className="font-semibold mb-2 flex gap-2">
              <Cloud /> Atmosphere
            </h3>
            <p>{weatherData.pressure} mb</p>
            <p>{weatherData.cloud}% clouds</p>
          </div>

        </div>

        {/* EXTRA */}
        <div className="bg-base-100/70 backdrop-blur-lg rounded-3xl p-6 border border-base-300">
          <h2 className="font-semibold mb-4">Extra Info</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <Sunrise className="mx-auto mb-1 text-warning" />
              {weatherData.sunrise}
            </div>
            <div>
              <Sunset className="mx-auto mb-1 text-warning" />
              {weatherData.sunset}
            </div>
            <div>
              <Moon className="mx-auto mb-1 text-info" />
              {weatherData.moon_phase}
            </div>
            <div>
              <Sun className="mx-auto mb-1 text-warning" />
              UV {weatherData.uv}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WeatherPage;