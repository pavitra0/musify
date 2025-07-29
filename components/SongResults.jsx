"use client";

import React from "react";

import { useRouter } from "next/navigation";
import { useColorTheme } from "./ColorThemeContext";

export default function SearchResults({ data = [] }) {
  const router = useRouter();
  const { colors } = useColorTheme();

  const bgColor = colors?.bgColor || "#0f0f0f";
  const accentColor = colors?.accentColor || "#22c55e";

  // Safeguard: If data is not an array
  if (!Array.isArray(data)) {
    console.warn("SearchResults expects an array, but got:", data);
    return <p className="text-gray-400 mt-8">No results found.</p>;
  }

  const renderImage = (images) => {
    if (!images || images.length === 0) return null;
    const bestImage =
      images.find((img) => img.quality === "150x150") || images[0];
    return (
      <img
        src={bestImage.url}
        alt="cover"
        className="w-16 h-16 object-cover rounded-lg"
      />
    );
  };

  return (
    <div className="space-y-4 mt-8 overflow-hidden">
      {data.map((song) => (
        <div
          key={song.id}
          onClick={() => router.push(`/${song.id}`)}
          className="flex items-center justify-between p-3 rounded-lg bg-[#232020] hover:bg-[#1c1c1c] transition cursor-pointer"
          style={{ backgroundColor: bgColor }}
        >
          <div className="flex items-center gap-4">
            {renderImage(song.image)}
            <div>
              <p
                className="text-white text-sm font-medium"
                style={{
                  color: accentColor,
                }}
              >
                {song.name}
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <p
              className="text-gray-500 text-xs mt-1"
              style={{
                color: accentColor,
              }}
            >
              {song.artists?.primary?.map((a) => a.name).join(", ") ||
                "Unknown Artist"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
