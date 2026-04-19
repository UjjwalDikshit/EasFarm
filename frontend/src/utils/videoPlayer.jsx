import { useRef, useState } from "react";

export default function VideoPlayer({ src }) {
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    const percent = (video.currentTime / video.duration) * 100;
    setProgress(percent || 0);
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const newTime = (e.target.value / 100) * video.duration;
    video.currentTime = newTime;
  };

  const handleVolume = (e) => {
    const vol = e.target.value;
    setVolume(vol);
    videoRef.current.volume = vol;
  };

  const handleFullscreen = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-black rounded-xl overflow-hidden shadow-lg">
      
      {/* VIDEO */}
      <video
        ref={videoRef}
        src={src}
        className="w-full"
        onTimeUpdate={handleTimeUpdate}
      />

      {/* CONTROLS */}
      <div className="p-3 flex flex-col gap-2 bg-gray-900 text-white">

        {/* Progress */}
        <input
          type="range"
          value={progress}
          onChange={handleSeek}
          className="w-full"
        />

        {/* Buttons */}
        <div className="flex items-center justify-between">

          <button onClick={togglePlay}>
            {isPlaying ? "Pause" : "Play"}
          </button>

          <div className="flex items-center gap-2">
            <span>🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolume}
            />
          </div>

          <button onClick={handleFullscreen}>
            Fullscreen
          </button>

        </div>
      </div>
    </div>
  );
}