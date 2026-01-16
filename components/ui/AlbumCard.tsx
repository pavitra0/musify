"use client";

import React from "react";
import { Collection } from "@/hooks/useMusicData";

interface AlbumCardProps {
  item: Collection;
  onClick?: () => void;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ item, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-start rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-400/60 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.75)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      <div className="relative w-full aspect-square overflow-hidden">
        <img
          src={item.coverUrl}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="w-full px-3 pt-2 pb-3 text-left space-y-1">
        <p className="text-sm font-semibold truncate">{item.name}</p>
        {item.description && (
          <p className="text-xs text-gray-400 line-clamp-2">
            {item.description}
          </p>
        )}
      </div>
    </button>
  );
};

export default AlbumCard;


