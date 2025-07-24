"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Howl } from "howler";
import ColorThief from "color-thief-browser";
import {
  Heart,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Download,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { fetchSongSuggestions } from "@/actions/fetchingSongs";
import { motion, AnimatePresence, animate } from "framer-motion";

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

function lighten(rgb, factor = 0.35) {
  return rgb.map((c) => Math.min(255, Math.floor(c + (255 - c) * factor)));
}
function darken(rgb, factor = 0.5) {
  return rgb.map((c) => Math.max(0, Math.floor(c * (1 - factor))));
}

export default function Player({ song, audioSrc }) {
  const params = useParams();
  const imgRef = useRef(null);
  const soundRef = useRef(null);
  const intervalRef = useRef(null);

  const router = useRouter();

  const [isPlaying, setIsPlaying] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [bgColor, setBgColor] = useState("#1e293b");
  const [accentColor, setAccentColor] = useState("#334155");
  const [suggestions, setSuggestions] = useState([]);

  // Load suggestions based on ID
  useEffect(() => {
    async function func() {
      if (!params.id) return;
      const results = await fetchSongSuggestions(params.id);
      setSuggestions(results);
    }
    func();
  }, [params.id]);

  // Set up color extraction from image
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const handleLoad = () => {
      try {
        const color = new ColorThief().getColor(img);
        const dark = darken(color);
        const light = lighten(color);
        const bg = `rgb(${dark.join(",")})`;
        const accent = `rgb(${light.join(",")})`;

        setBgColor(bg);
        setAccentColor(accent);

        document.documentElement.style.setProperty("--bg-color", bg);
        document.documentElement.style.setProperty("--accent-color", accent);
      } catch (e) {
        console.error("ColorThief error", e);
      }
    };

    if (img.complete) handleLoad();
    else {
      img.addEventListener("load", handleLoad);
      return () => img.removeEventListener("load", handleLoad);
    }
  }, [song?.image?.[1]?.url]);

  // Initialize sound
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

  // Handle playing
  useEffect(() => {
    if (!isPlaying || !soundRef.current) return;

    intervalRef.current = setInterval(() => {
      const current = soundRef.current.seek();
      setPosition(current);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  const togglePlay = () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (soundRef.current) {
      soundRef.current.seek(time);
      setPosition(time);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = audioSrc;
    link.setAttribute("download", `${song?.name || "song"}.mp3`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  console.log(suggestions);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between text-white px-6 py-10 transition-colors duration-700"
      style={{
        background: `linear-gradient(to bottom, ${bgColor}, #111827)`,
      }}
    >
      {/* Hidden image for ColorThief */}
      <img
        ref={imgRef}
        src={song?.image?.[1]?.url || "/placeholder.jpg"}
        alt="ColorThief Image"
        className="hidden"
        crossOrigin="anonymous"
      />

      {/* Cover */}
      <img
        src={song?.image?.[2]?.url || "/placeholder.jpg"}
        alt={song?.title || "Cover"}
        className="w-80 h-80 mt-14 rounded-xl object-cover shadow-lg"
      />

      {/* Title & Artist */}
      <div className="text-center mt-8">
        <h2 className="text-2xl font-bold">{song?.name}</h2>
        <p className="text-gray-300 text-sm">
          {song?.artists?.primary?.map((s) => s.name).join(", ") || "Unknown"}
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
          className="w-full h-2 rounded-lg outline-none"
          style={{ background: accentColor }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-8 mt-6">
        <Heart size={22} color={accentColor} className="cursor-pointer" />
        <SkipBack size={28} color={accentColor} className="cursor-pointer" />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            borderRadius: isPlaying ? "12px" : "50%", // morph shape
            width: isPlaying ? "56px" : "56px", // w-16 vs w-14
            height: isPlaying ? "56px" : "56px", // h-10 vs h-14
            backgroundColor: isPlaying
              ? "rgba(255,255,255,0.3)"
              : "rgba(255,255,255,0.2)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={togglePlay}
          className="flex items-center justify-center cursor-pointer text-white"
        >
          {isPlaying ? (
            <Pause size={26} color={accentColor} />
          ) : (
            <Play size={28} color={accentColor} />
          )}
        </motion.button>

        <SkipForward size={28} color={accentColor} className="cursor-pointer" />
        <Repeat size={20} color={accentColor} className="cursor-pointer" />
      </div>

      {/* Bottom Bar */}
      <div className="mt-6">
        <Download
          size={24}
          color={accentColor}
          onClick={handleDownload}
          className="cursor-pointer"
        />
      </div>
      {/* Toggle Arrow */}
      <div
        onClick={() => setShowSuggestions(!showSuggestions)}
        className="mt-8 cursor-pointer"
      >
        {showSuggestions ? (
          <ChevronDown size={28} color={accentColor} />
        ) : (
          <ChevronUp size={28} color={accentColor} />
        )}
      </div>

      {/* Suggestions Panel */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
            className="fixed bottom-0 left-0 w-full max-h-[80vh] overflow-y-auto z-50 backdrop-blur-md bg-white/5 border-t border-white/10 rounded-t-2xl p-5 shadow-[0_-2px_30px_rgba(0,0,0,0.3)]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-white tracking-wide">
                You Might Also Like
              </h3>
              <button
                onClick={() => setShowSuggestions(false)}
                className="text-gray-300 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {suggestions.map((sugg) => (
                <div
                  key={sugg.id}
                  className="flex items-center gap-4 bg-white/10 hover:bg-white/15 transition p-3 rounded-lg shadow-md cursor-pointer"
                  onClick={() => router.push(`/search/${sugg.id}`)}
                >
                  <img
                    src={sugg.image?.[1]?.url || sugg.image?.[0]?.url}
                    alt={sugg.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-white font-medium truncate">
                      {sugg.name}
                    </p>
                    <p className="text-gray-300 text-sm truncate">
                      {sugg?.artists?.primary[0].name || "Unknown Artist"}
                    </p>
                  </div>
                  <button className="text-white/70 hover:text-white">
                    <Play className="w-6 h-6" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
