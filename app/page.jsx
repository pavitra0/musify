"use client";

import { usePlayerContext } from "@/context/PlayerContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SearchBar from "../components/SearchBar";
import SongResults from "../components/SongResults";
import { useColorTheme } from "../components/ColorThemeContext";
import NowPlayingBar from "@/components/NowPlayingBar";
import MainSection from "@/components/MainSection";

export default function SearchPage() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { colors } = useColorTheme();
  const bgColor = colors?.bgColor || "#0f0f0f";
  const accentColor = colors?.accentColor || "#22c55e";

  async function handleSearch(searchTerm) {
    const trimmedTerm = searchTerm.trim().toLowerCase();

    try {
      setLoading(true);
      setSongs([]);

      const res = await fetch(
        `https://jiosavan-api2.vercel.app/api/search/songs?query=${encodeURIComponent(
          trimmedTerm
        )}&page=1&limit=20`
      );

      if (!res.ok) throw new Error("Failed to fetch songs");

      const data = await res.json();
      const results = data?.data?.results ?? [];
      setSongs(results);
    } catch (error) {
      console.error("Search Error:", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen  flex flex-col items-center pb-10"
      style={{
        background: `linear-gradient(to bottom, ${bgColor}, #111827)`,
      }}
    >
      <div className="w-full max-w-3xl px-4 mt-16">
        <SearchBar onSearch={handleSearch} accentColor={accentColor} />

        {loading ? (
          <p className="text-gray-400 text-center mt-8">Searching for songs…</p>
        ) : (
          <SongResults data={songs} />
        )}

        <MainSection />

        <NowPlayingBar />
      </div>
    </div>
  );
}
