"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Search,
  X,
} from "lucide-react";
import { fetchSongSuggestions } from "@/actions/fetchingSongs";
import { AnimatePresence, motion } from "framer-motion";
import { useColorTheme } from "@/components/ColorThemeContext";
import Suggestions from "@/components/Suggestions";
import { usePlayerContext } from "@/context/PlayerContext";
import AnimatedButton from "@/components/AnimatedButton";

export function formatTime(seconds) {
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

function parseSyncedLyrics(lyricsText) {
  const lines = lyricsText.split("\n");
  return lines
    .map((line) => {
      const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2})\](.*)/);
      if (match) {
        const minutes = parseInt(match[1]);
        const seconds = parseInt(match[2]);
        const milliseconds = parseInt(match[3]) * 10;
        const time = minutes * 60 + seconds + milliseconds / 1000;
        const text = match[4].trim();
        return { time, text };
      }
      return null;
    })
    .filter(Boolean);
}

export default function Player({ lyrics }) {
  const params = useParams();
  const imgRef = useRef(null);
  const soundRef = useRef(null);
  const intervalRef = useRef(null);
  const lyricsContainerRef = useRef(null);

  const router = useRouter();

  const { setColors } = useColorTheme();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);
  const [bgColor, setBgColor] = useState("#1e293b");
  const [accentColor, setAccentColor] = useState("#334155");
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [suggestions, setSuggestions] = useState([]);
  const [likedSongs, setLikedSongs] = useState(() => {
    return JSON.parse(localStorage.getItem("likedSongs")) || [];
  });

  const { currentSong: song, isPlaying, togglePlay, howl } = usePlayerContext();
  const [currentTime, setCurrentTime] = useState(0);
  const isLiked = likedSongs.some((s) => s.id === song?.id);

  const [isSynced, setIsSynced] = useState(false);
  const [lyricsData, setLyricsData] = useState([]);

  const activeIndex = isSynced
    ? lyricsData.findIndex((line, i) => {
        const next = lyricsData[i + 1];
        return currentTime >= line.time && (!next || currentTime < next.time);
      })
    : -1;

  useEffect(() => {
    if (!lyrics) return;

    if (lyrics.syncedLyrics?.length) {
      setIsSynced(true);
      const parsed = parseSyncedLyrics(lyrics.syncedLyrics);
      setLyricsData(parsed);
    } else if (lyrics.plainLyrics) {
      setIsSynced(false);
      setLyricsData(lyrics.plainLyrics); // Plain fallback
    } else {
      setIsSynced(false);
      setLyricsData([]);
    }
  }, [lyrics]);

  useEffect(() => {
    if (!isSynced || !lyricsContainerRef.current || activeIndex === -1) return;

    const container = lyricsContainerRef.current;
    const activeLine = container.querySelector(
      `[data-lyric-index="${activeIndex}"]`
    );

    if (activeLine) {
      activeLine.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeIndex, isSynced]);

  useEffect(() => {
    let interval;
    if (soundRef.current && isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(soundRef.current.seek());
      }, 200);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isFullScreen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFullScreen]);

  // Load suggestions based on ID
  useEffect(() => {
    async function func() {
      if (!params.id) return;
      const results = await fetchSongSuggestions(params.id);
      setSuggestions(results);
      const current = results.findIndex(
        (s) => String(s.id) === String(params.id)
      );

      setCurrentIndex(current >= 0 ? current : null);
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

        // Avoid unnecessary state updates
        if (bg !== bgColor) setBgColor(bg);
        if (accent !== accentColor) setAccentColor(accent);
        setColors({ bgColor: bg, accentColor: accent });

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

  // Handle playing
  useEffect(() => {
    if (!howl || !isPlaying) return;

    const interval = setInterval(() => {
      const time = howl.seek();
      setCurrentTime(typeof time === "number" ? time : 0);
      setPosition(howl.seek());
      setDuration(howl.duration());
    }, 250);

    return () => clearInterval(interval);
  }, [howl, isPlaying]);

  const handleSeek = (e) => {
    const value = parseFloat(e.target.value);
    if (howl) {
      howl.seek(value);
      setPosition(value);
    }
  };

  const handleSkipForward = () => {
    // if (suggestions.length === 0 || currentIndex === null) return;

    const nextIndex = (currentIndex + 1) % suggestions.length;
    const nextSong = suggestions[nextIndex];
    console.log("next", nextSong);
    router.push(`/song/${nextSong.id}`);
  };

  const handleSkipBack = () => {
    // if (suggestions.length === 0 || currentIndex === null) return;

    const prevIndex =
      (currentIndex - 1 + suggestions.length) % suggestions.length;
    const prevSong = suggestions[prevIndex];
    router.push(`/song/${prevSong.id}`);
  };

  const toggleLikeSong = () => {
    if (!song) return;

    const songData = {
      id: song.id,
      name: song.name,
      duration: song.duration,
      image: song.image,
      artists: song.artists,
    };

    const updatedLikedSongs = likedSongs.some((s) => s.id === song.id)
      ? likedSongs.filter((s) => s.id !== song.id)
      : [...likedSongs, songData];

    setLikedSongs(updatedLikedSongs);
    localStorage.setItem("likedSongs", JSON.stringify(updatedLikedSongs));
  };

  const handleDownload = () => {
    const actualUrl = song?.downloadUrl?.[4]?.url;
    if (!actualUrl) return;

    // const fileName = ;
    const downloadUrl = `/api/download?url=${encodeURIComponent(actualUrl)}`;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute(
      "download",
      `${song?.name}-${song?.artists?.primary?.[0]?.name}-${song?.downloadUrl?.[4]?.quality}.mp3`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-between text-white px-6 py-10 transition-colors duration-700"
      style={{
        background: `linear-gradient(to bottom, ${bgColor}, #111827)`,
      }}
      animate={{
        background: `linear-gradient(to bottom, ${bgColor}, #111827)`,
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <button
        onClick={() => router.push("/")}
        style={{ color: accentColor }}
        className="absolute top-6 left-6 z-10 bg-white/20 backdrop-blur p-2 rounded-full hover:scale-110 cursor-pointer transition-all"
      >
        <Search size={20} />
      </button>

      {/* Hidden image for ColorThief */}

      <img
        ref={imgRef}
        src={song?.image?.[1]?.url || "/placeholder.jpg"}
        alt="ColorThief Image"
        className="hidden"
        crossOrigin="anonymous"
      />

      {/* Cover */}
      <div
        className="relative w-[300px] h-[300px] cursor-pointer mt-8  rounded-lg overflow-hidden transition-all "
        onClick={() => setShowLyrics((prev) => !prev)}
      >
        {showLyrics ? (
          <div
            className={`fixed z-50 inset-0 transition-all duration-300 ease-in-out ${
              isFullScreen ? "bg-black flex items-center justify-center" : ""
            }`}
          >
            <div
              ref={lyricsContainerRef}
              className="w-full h-full overflow-y-auto px-6 py-20 text-sm leading-relaxed text-white scroll-smooth text-center"
              style={{
                background: `linear-gradient(to bottom, ${bgColor}, #111827)`,
              }}
            >
              <button
                className="absolute top-4 right-4 text-white bg-white/10 px-3 py-1 rounded text-sm hover:bg-white/20 transition"
                onClick={() => setIsFullScreen(!isFullScreen)}
              >
                {isFullScreen ? <X /> : <X />}
              </button>
              {isSynced ? (
                lyricsData.length > 0 ? (
                  lyricsData.map((line, index) => (
                    <div
                      key={index}
                      data-lyric-index={index}
                      className={`py-3 transition-all font-bold text-xl sm:text-2xl duration-300 ease-in-out ${
                        index === activeIndex
                          ? "text-white font-bold scale-110"
                          : "text-white/50"
                      }`}
                    >
                      {line.text}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 italic mt-4 ">
                    Lyrics not available
                  </div>
                )
              ) : typeof lyricsData === "string" && lyricsData.trim() ? (
                lyricsData.split("\n").map((line, i) => (
                  <div key={i} className="py-3 font-bold text-xl sm:text-2xl ">
                    {line}
                  </div>
                ))
              ) : (
                <div className="text-gray-400 italic mt-4">
                  Lyrics not available
                </div>
              )}
            </div>
          </div>
        ) : (
          <img
            src={song?.image?.[2]?.url || "/placeholder.jpg"}
            alt={song?.title || "Cover"}
            className="w- h-full object-cover transition-all rounded-lg hover:scale-105"
          />
        )}
      </div>

      {/* Title & Artist */}
      <div className="text-center mt-8">
        <h2
          className="text-2xl font-extrabold mb-4"
          onClick={() => router.push(`/album/${song?.album?.id}`)}
        >
          {song?.name}
        </h2>
        <div className="w-full flex justify-center">
          <div className="text-gray-300 text-sm flex flex-wrap gap-1 justify-center text-center">
            {song?.artists?.primary?.length > 0
              ? song.artists.primary.map((s, i, arr) => (
                  <span key={s.id} className="flex">
                    <p
                      onClick={() => router.push(`/artist/${s.id}`)}
                      className="cursor-pointer font-bold hover:scale-105 transition-all"
                    >
                      {s.name.trim()}
                    </p>

                    {i < arr.length - 1 && <span>,</span>}
                  </span>
                ))
              : "Unknown"}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full mt-4">
        <div className="flex justify-between text-sm text-gray-300 mb-1">
          <span className="font-bold">{formatTime(position)}</span>
          <span className="font-bold">{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          min="0"
          max={duration}
          value={position}
          step="0.5"
          onChange={handleSeek}
          className="w-full h-2 rounded-lg outline-none"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <AnimatedButton>
          <Heart
            size={22}
            color={accentColor}
            fill={isLiked ? accentColor : "none"} // ← This adds fill
            onClick={toggleLikeSong}
            className="cursor-pointer transition-colors"
          />
        </AnimatedButton>
        <AnimatedButton>
          <SkipBack
            size={28}
            onClick={handleSkipBack}
            color={accentColor}
            className="cursor-pointer"
          />
        </AnimatedButton>
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
        <AnimatedButton>
          <SkipForward
            size={28}
            onClick={handleSkipForward}
            color={accentColor}
            className="cursor-pointer"
          />
        </AnimatedButton>
        <AnimatedButton>
          <Repeat size={20} color={accentColor} className="cursor-pointer" />
        </AnimatedButton>
      </div>

      {/* Bottom Bar */}
      <AnimatedButton>
        <div className="mt-6">
          <Download
            size={24}
            color={accentColor}
            onClick={handleDownload}
            className="cursor-pointer"
          />
        </div>
      </AnimatedButton>
      {/* Toggle Arrow */}

      <AnimatedButton>
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
      </AnimatedButton>

      {/* Suggestions Panel */}

      <Suggestions
        setShowSuggestions={setShowSuggestions}
        showSuggestions={showSuggestions}
        suggestions={suggestions}
        bgColor={bgColor}
        accentColor={accentColor}
      />
    </motion.div>
  );
}
