"use client";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { usePlayerContext } from "@/context/PlayerContext";

export default function NowPlayingBar({ track }) {
  const { playSong, togglePlay, isPlaying, currentSong } = usePlayerContext();

  if (!track) return null;

  console.log(playSong,currentSong)

  const isCurrentTrack = currentSong === track.audioSrc;

  const handlePlay = () => {
    if (!isCurrentTrack) {
      playSong(track.audioSrc); // play new track
    } else {
      togglePlay(); // toggle play/pause for current track
    }
  };

  return (
    <div className="fixed left-0 right-0 bottom-0 bg-gray-800 border-t border-gray-700 px-6 py-3 flex items-center justify-between z-20">
      {/* Track Info */}
      <div className="flex items-center gap-3">
        <img
          src={track.image}
          alt={track.title}
          className="w-10 h-10 rounded"
        />
        <div>
          <div className="font-semibold">{track.title}</div>
          <div className="text-xs text-gray-400">{track.artist}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 items-center">
        <button>
          <ChevronLeft />
        </button>

        <button
          onClick={handlePlay}
          className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition"
        >
          {isCurrentTrack && isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </button>

        <button>
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
