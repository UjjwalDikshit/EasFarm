import { useState } from "react";
import { getUserLocation } from "../utils/location";
import WeatherCard from "./WeatherCard";
import axiosClient from "../utils/axiosClient";

export default function WeatherButton() {
  const [weather, setWeather] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const { lat, lon } = await getUserLocation();
      const data = await  axiosClient.get("/api/weather",{
            params: {lat,lon}
       });
      setWeather(data);
      setOpen(true);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading}
        // className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Loading..." : "Show Weather"}
      </button>
      {open && (
        <WeatherCard weather={weather} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
