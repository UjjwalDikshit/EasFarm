import { useRef } from "react";
import useOutsideClick from "../hooks/useOutsideClick";

export default function WeatherCard({ weather, onClose }) {
  const ref = useRef();
  useOutsideClick(ref, onClose);

  const weatherData = weather.data || weather;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-indigo-900/20 to-violet-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        ref={ref}
        className="w-full max-w-md rounded-3xl bg-gradient-to-b from-violet-50/95 to-indigo-100/95 p-8 shadow-2xl shadow-violet-900/30 border border-violet-200/50"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent">
              {weatherData.city}
            </h2>
            <p className="text-sm text-violet-500 mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-violet-100 hover:bg-violet-200 text-violet-600 hover:text-violet-800 flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm"
          >
            <span className="text-lg">✕</span>
          </button>
        </div>

        {/* Weather Icon Section */}
        <div className="relative my-6 flex justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-300/30 to-indigo-300/30 blur-2xl rounded-full"></div>
          <div className="relative bg-gradient-to-br from-violet-100 to-white p-6 rounded-2xl shadow-lg">
            <img
              src={`https:${weatherData.icon}`}
              alt={weatherData.description}
              className="w-24 h-24 drop-shadow-lg"
            />
          </div>
        </div>

        {/* Temperature */}
        <div className="text-center mb-8">
          <div className="flex items-baseline justify-center gap-2">
            <p className="text-6xl font-bold bg-gradient-to-r from-violet-700 to-indigo-700 bg-clip-text text-transparent">
              {Math.round(weatherData.temperature)}°
            </p>
            <span className="text-2xl font-semibold text-violet-600">C</span>
          </div>
          <p className="text-lg font-medium text-violet-600 capitalize mt-2">
            {weatherData.description}
          </p>
        </div>

        {/* Details Grid */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-violet-50 to-white rounded-xl p-4 shadow-sm border border-violet-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-violet-100 to-indigo-100 flex items-center justify-center">
                <span className="text-violet-600 text-lg">🌡️</span>
              </div>
              <p className="text-sm font-medium text-violet-600">Feels Like</p>
            </div>
            <p className="text-2xl font-bold text-violet-800">
              {Math.round(weatherData.feelsLike)}°C
            </p>
          </div>

          <div className="bg-gradient-to-br from-violet-50 to-white rounded-xl p-4 shadow-sm border border-violet-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-violet-100 to-indigo-100 flex items-center justify-center">
                <span className="text-violet-600 text-lg">💧</span>
              </div>
              <p className="text-sm font-medium text-violet-600">Humidity</p>
            </div>
            <p className="text-2xl font-bold text-violet-800">
              {weatherData.humidity}%
            </p>
          </div>

          {/* Additional weather details */}
          <div className="bg-gradient-to-br from-violet-50 to-white rounded-xl p-4 shadow-sm border border-violet-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-violet-100 to-indigo-100 flex items-center justify-center">
                <span className="text-violet-600 text-lg">💨</span>
              </div>
              <p className="text-sm font-medium text-violet-600">Wind</p>
            </div>
            <p className="text-2xl font-bold text-violet-800">
              {weatherData.windSpeed || 'N/A'} km/h
            </p>
          </div>

          <div className="bg-gradient-to-br from-violet-50 to-white rounded-xl p-4 shadow-sm border border-violet-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-violet-100 to-indigo-100 flex items-center justify-center">
                <span className="text-violet-600 text-lg">👁️</span>
              </div>
              <p className="text-sm font-medium text-violet-600">Visibility</p>
            </div>
            <p className="text-2xl font-bold text-violet-800">
              {weatherData.visibility || '5.6'} km
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-violet-200/50">
          <p className="text-center text-sm text-violet-500">
            Last updated: {new Date(weatherData.lastUpdated || Date.now()).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
}