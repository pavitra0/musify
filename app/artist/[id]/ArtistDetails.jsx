"use client";

import { useColorTheme } from "@/components/ColorThemeContext";
import NowPlayingBar from "@/components/NowPlayingBar";
import React, { useState, useEffect } from "react";
import { ArrowDown, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import SongItem from "@/components/SongItem";

function ArtistDetails({ artistDetails, songs }) {
  const router = useRouter();
  const { colors } = useColorTheme();

  const bgColor = colors?.bgColor || "#0f0f0f";
  const accentColor = colors?.accentColor || "#22c55e";

  const [visibleSongs, setVisibleSongs] = useState(10);

  useEffect(() => {
    setVisibleSongs(10);
  }, [artistDetails?.id]);

  if (!artistDetails) return null;

  return (
    <div
      className="h-screen flex flex-col text-white relative"
      style={{
        background: `linear-gradient(to bottom, ${bgColor}, #111827)`,
      }}
    >
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => router.back()}
          style={{ color: accentColor }}
          className="bg-white/20 backdrop-blur p-2 rounded-full hover:scale-110 transition"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Fixed Top Content */}
      <div className="relative flex p-10 flex-col items-center text-center">
        {/* Blurry background image */}
        <img
          src={artistDetails?.image?.[2]?.url || "/placeholder.jpg"}
          alt="blur-bg"
          className="absolute inset-0 w-full h-120 object-cover blur-2xl opacity-30 scale-110 z-0"
        />

        {/* Foreground content */}
        <div className="relative z-10 flex flex-col items-center">
          <img
            src={artistDetails?.image?.[2]?.url || "/placeholder.jpg"}
            alt={artistDetails?.name || "Artist"}
            className="w-80 h-80 rounded-full object-cover border-4 border-white/10 shadow-lg"
          />
          <h2 className="text-2xl font-bold mt-4 pb-6">
            {artistDetails?.name}
          </h2>
        </div>
      </div>

      {/* Scrollable Song List */}
      <div className="flex-1 rounded-2x overflow-y-auto px-6 pb-32">
        <h3 className=" text-lg  font-semibold mb-4">Songs</h3>

        {artistDetails.topSongs?.slice(0, visibleSongs).map((song, index) => (
          <SongItem key={index} song={song} />
        ))}

        {visibleSongs < artistDetails.topSongs?.length && (
          <div className="text-center mt-6">
            <button
              onClick={() => setVisibleSongs((prev) => prev + 10)}
              className="bg-white/10 text-white px-4 py-2 rounded hover:bg-white/20 transition-all"
              style={{ color: accentColor }}
            >
              <ArrowDown />
            </button>
          </div>
        )}
      </div>

      {/* Sticky Player Bar */}
      <div className="sticky bottom-0 w-full z-20">
        <NowPlayingBar />
      </div>
    </div>
  );
}

export default ArtistDetails;
