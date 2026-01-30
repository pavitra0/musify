"use client";

import { useState, useRef, useEffect } from "react";
import { usePlayerContext } from "@/context/PlayerContext";
import { Pause, Play, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useColorTheme } from "./ColorThemeContext";

const formatTime = (t = 0) => {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function NowPlayingBar() {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    stopSong,
    progress,
    duration,
    seekTo,
  } = usePlayerContext();

  const router = useRouter();
  const { colors } = useColorTheme();

  const bgColor = colors?.bgColor || "#0f0f0f";
  const accentColor = colors?.accentColor || "#22c55e";

  const barRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const updateSeek = (clientX) => {
    if (!barRef.current || !duration) return;
    const rect = barRef.current.getBoundingClientRect();
    const percent = Math.min(
      Math.max((clientX - rect.left) / rect.width, 0),
      1
    );
    seekTo(percent * duration);
  };

  useEffect(() => {
    const handleMove = (e) => isDragging && updateSeek(e.clientX);
    const handleUp = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [isDragging]);

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50">
      <div
        ref={barRef}
        className="h-1 w-full bg-white/10 cursor-pointer"
        onMouseDown={(e) => {
          e.stopPropagation();
          setIsDragging(true);
          updateSeek(e.clientX);
        }}
      >
        <div
          className="h-full"
          style={{
            width: `${(progress / duration) * 100 || 0}%`,
            backgroundColor: accentColor,
          }}
        />
      </div>

      {/* Player content */}
      <div
        className="relative border-t border-white/10 p-3 text-white"
        style={{ backgroundColor: bgColor }}
        onClick={() => {
          if (!isDragging) router.push(`/song/${currentSong.id}`);
        }}
      >
        <div className="grid grid-cols-3 items-center">
          {/* Song info */}
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={currentSong.image?.[1]?.url || "/placeholder.jpg"}
              className="w-12 h-12 rounded-md object-cover"
              alt={currentSong.name}
            />
            <div className="min-w-0">
              <p className="font-bold text-sm truncate" style={{ color: accentColor }}>
                {currentSong.name}
              </p>
              <p className="text-xs text-gray-300 truncate">
                {currentSong.artists?.primary?.map((a) => a.name).join(", ")}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="p-2 rounded-full bg-white/20"
              style={{ color: accentColor }}
            >
              {isPlaying ? <Pause size={22} /> : <Play size={22} />}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                stopSong();
              }}
              className="p-2 rounded-full bg-white/10"
            >
              <X size={22} />
            </button>
          </div>

          {/* Time */}
          <div className="flex justify-end text-sm text-white/60">
            {formatTime(progress)} / {formatTime(duration)}
          </div>
        </div>
      </div>
    </div>
  );
}
