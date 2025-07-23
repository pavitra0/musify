"use client";

import { useEffect, useRef, useState } from "react";
import ColorThief from "color-thief-browser";
import { Howl } from "howler";
import {
  Heart,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Music,
  Menu,
  Download,
} from "lucide-react";

function lightenColor(rgb, factor = 0.1) {
  return rgb.map((c) => Math.min(255, Math.floor(c + (255 - c) * factor)));
}

function darkenColor(rgb, factor = 0.1) {
  return rgb.map((c) => Math.max(0, Math.floor(c * (1 - factor))));
}

function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const min = Math.floor(sec / 60);
  const secLeft = Math.floor(sec % 60);
  return `${min}:${String(secLeft).padStart(2, "0")}`;
}

export default function Player({ song, audioSrc }) {
  const imgRef = useRef(null);
  const soundRef = useRef(null);
  const intervalRef = useRef(null);

  const [bgColor, setBgColor] = useState("#1e293b");
  const [accentColor, setAccentColor] = useState("#334155");
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    if (!imgRef.current) return;

    const img = imgRef.current;

    const handleLoad = () => {
      try {
        const color = new ColorThief().getColor(img);
        const dark = darkenColor(color, 0.55);
        const light = lightenColor(color, 0.55);
        const bg = `rgb(${dark.join(",")})`;
        const accent = `rgb(${light.join(",")})`;

        setBgColor(bg);
        setAccentColor(accent);

        // Set CSS variables globally (optional for other components)
        document.documentElement.style.setProperty("--bg-color", bg);
        document.documentElement.style.setProperty("--accent-color", accent);
      } catch (err) {
        console.error("ColorThief error:", err);
      }
    };

    if (img.complete) handleLoad();
    else {
      img.addEventListener("load", handleLoad);
      return () => img.removeEventListener("load", handleLoad);
    }
  }, [song?.image?.[1]?.url]);

  useEffect(() => {
    if (!audioSrc) return;

    if (soundRef.current) {
      soundRef.current.unload();
    }

    const sound = new Howl({
      src: [audioSrc],
      html5: true,
      onload: () => setDuration(sound.duration()),
      onend: () => setIsPlaying(false),
    });

    soundRef.current = sound;

    return () => sound.unload();
  }, [audioSrc]);

  const togglePlay = () => {
    const sound = soundRef.current;
    if (!sound) return;

    if (isPlaying) {
      sound.pause();
    } else {
      sound.play();
    }

    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (!isPlaying || !soundRef.current) return;

    intervalRef.current = setInterval(() => {
      const current = soundRef.current.seek();
      const rounded = Math.floor(current);
      if (rounded !== Math.floor(position)) {
        setPosition(current);
      }
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, position]);

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (soundRef.current) {
      soundRef.current.seek(time);
      setPosition(time);
    }
  };

  const handleDownload = () => {
    if (!audioSrc) return;

    const link = document.createElement("a");
    link.href = audioSrc;
    link.setAttribute("download", `${song?.name || "song"}.mp3`);
    link.setAttribute("target", `_blank`);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between text-white px-6 py-10 transition-colors duration-700"
      style={{
        background: bgColor,
      }}
    >
      {/* Hidden image for ColorThief */}
      <img
        ref={imgRef}
        src={song?.image?.[1]?.url || "/placeholder.jpg"}
        alt="Color source"
        className="hidden"
        crossOrigin="anonymous"
      />

      {/* Cover */}
      <img
        src={song?.image?.[2]?.url || "/placeholder.jpg"}
        alt={song?.title || "Song cover"}
        className="w-82 h-82 mt-14 rounded-xl object-cover shadow-lg"
      />

      {/* Title & Artist */}
      <div className="text-center gap-2 mt-8">
        <h2 className="text-2xl font-bold">{song?.name}</h2>
        <p className="text-gray-300">
          {song?.artists?.primary?.map((s) => s.name).join(", ") ||
            "Unknown Artist"}
        </p>
      </div>

      {/* Progress */}
      <div className="w-full mt-4">
        <div className="flex justify-between text-sm text-gray-300 mb-1">
          <span>{formatTime(position)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          min="0"
          max={duration}
          value={position}
          step="0.5"
          onChange={handleSeek}
          className="w-full h-3 appearance-none rounded-lg outline-none"
          style={{
            background: accentColor,
            color: "white",
          }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-8 mt-6">
        <Heart size={24} color={accentColor} className="cursor-pointer" />
        <SkipBack size={30} color={accentColor} className="cursor-pointer" />
        <div
          className={`bg-white/20 rounded-${
            isPlaying ? "full" : "lg"
          } w-14 h-14 flex items-center justify-center shadow-lg cursor-pointer transition-all`}
          onClick={togglePlay}
        >
          {isPlaying ? (
            <Pause size={30} color={accentColor} />
          ) : (
            <Play size={30} color={accentColor} />
          )}
        </div>
        <SkipForward size={30} color={accentColor} className="cursor-pointer" />
        <Repeat size={22} color={accentColor} className="cursor-pointer" />
      </div>

      {/* Bottom Bar */}
      <div className="w-full flex justify-center gap-6 text-white mt-6">
        <Download
          size={24}
          color={accentColor}
          className="cursor-pointer"
          onClick={handleDownload}
        />
      </div>
    </div>
  );
}
