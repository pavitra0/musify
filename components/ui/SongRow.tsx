"use client";

import React from "react";
import { Track } from "@/hooks/useMusicData";

interface SongRowProps {
  index: number;
  track: Track;
  onClick?: () => void;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const SongRow: React.FC<SongRowProps> = ({ index, track, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group grid grid-cols-[auto,1fr,auto] md:grid-cols-[auto,1fr,auto,auto] gap-3 items-center w-full px-3 py-2 rounded-lg text-left text-sm text-gray-200 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition"
    >
      <span className="w-5 text-xs text-gray-500 group-hover:text-gray-300">
        {index}
      </span>
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-10 w-10 rounded-md overflow-hidden bg-neutral-800 flex-shrink-0">
          <img
            src={track.coverUrl}
            alt={track.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="truncate text-sm font-medium">{track.title}</span>
          <span className="truncate text-xs text-gray-400">
            {track.artists.map((a) => a.name).join(", ")}
          </span>
        </div>
      </div>
      <span className="hidden md:inline text-xs text-gray-400">
        {track.artists[0]?.name}
      </span>
      <span className="justify-self-end text-xs text-gray-400">
        {formatDuration(track.duration)}
      </span>
    </button>
  );
};

export default SongRow;


