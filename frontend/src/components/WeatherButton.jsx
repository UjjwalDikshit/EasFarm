import { useState } from "react";
import { getUserLocation } from "../utils/location";
import WeatherCard from "./WeatherCard";
import axiosClient from "../utils/axiosClient";
import { CloudSun, Loader2, AlertCircle } from "lucide-react";

export default function WeatherButton() {
  const [weather, setWeather] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (loading) return;

    try {
      setLoading(true);
      setError(false);
      const { lat, lon } = await getUserLocation();
      const response = await axiosClient.get("/api/weather", {
        params: { lat, lon },
      });
      setWeather(response.data);
      setOpen(true);
    } catch (err) {
      console.error(err);
      setError(true);
      setTimeout(() => setError(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-flex items-center w-full md:w-auto">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`
          flex items-center gap-2 w-full md:w-auto px-3 py-2 rounded-lg 
          transition-all duration-200 active:scale-95
          ${error ? "bg-error/20 text-error" : "hover:bg-white/10"}
          ${loading ? "cursor-wait opacity-70" : "cursor-pointer"}
        `}
      >
        <div className="relative">
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : error ? (
            <AlertCircle size={18} />
          ) : (
            <CloudSun size={18} className="text-yellow-400" />
          )}
        </div>
        
        <span className="text-sm font-medium whitespace-nowrap">
          {loading ? "Locating..." : error ? "Failed" : "Weather"}
        </span>
      </button>

      {open && weather && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm md:absolute md:inset-auto md:top-full md:right-0 md:mt-2 md:p-0 md:bg-transparent md:backdrop-blur-none">
          <div 
            className="animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <WeatherCard weather={weather} onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}