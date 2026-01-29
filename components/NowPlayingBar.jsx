"use client";

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

  if (!currentSong) return null;

  return (
    <div
      className="fixed bottom-0 left-0 w-full border-t border-white/10 p-3 text-white z-50"
      style={{ backgroundColor: bgColor }}
      onClick={() => router.push(`/song/${currentSong.id}`)}
    >
      {/* Progress Bar */}
      <div
        className="absolute top-0 left-0 w-full h-1 bg-white/10"
        onClick={(e) => {
          e.stopPropagation();
          const rect = e.currentTarget.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width;
          seekTo(percent * duration);
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

      <div className="grid grid-cols-3 items-center">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img
            src={currentSong.image?.[1]?.url || "/placeholder.jpg"}
            className="w-12 h-12 rounded-md object-cover"
            alt={currentSong.name}
          />

          <div className="min-w-0">
            <p
              className="font-bold text-sm truncate"
              style={{ color: accentColor }}
            >
              {currentSong.name}
            </p>
            <p className="text-xs text-gray-300 truncate">
              {currentSong.artists?.primary?.map((a) => a.name).join(", ")}
            </p>
          </div>
        </div>

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
        <div className="flex justify-end text-[15px] text-white/60">
          <span>{formatTime(progress)}</span>
          <span className="mx-1">/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
