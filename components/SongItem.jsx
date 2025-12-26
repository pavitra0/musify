"use client";

import React from "react";
import { Play } from "lucide-react";
import { usePlayerContext } from "../context/PlayerContext";
import { useRouter } from "next/navigation";
import { formatTime } from "@/app/song/[id]/Player";

const SongItem = ({ song }) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between py-3 px-4 bg-white/5 hover:bg-white/10 transition rounded-lg mb-3 cursor-pointer">
      <div
        onClick={() => router.push(`/song/${song.id}`)}
        className="flex items-center gap-4"
      >
        <img
          src={song.image[0].url || "/placeholder.jpg"}
          alt={song.name}
          className="w-12 h-12 object-cover rounded"
        />
        <div>
          <p className="text-sm font-semibold text-white truncate w-[280px]">
            {song.name}
          </p>
           <span className="text-sm text-gray-500">
                  {song?.artists?.primary.slice(0,4).map((artist) => artist.name).join(', ')}
                </span>
        </div>
      </div>
      <div>
        <p className="font-bold text-sm">{formatTime(song.duration)}</p>
      </div>
    </div>
  );
};

export default SongItem;
