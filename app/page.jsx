"use client";

import { usePlayerContext } from "@/context/PlayerContext"; // 👈 import player context
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react"; // ← don't forget useRef/useEffect
import SearchBar from "../components/SearchBar";
import SongResults from "../components/SongResults";
import { useColorTheme } from "../components/ColorThemeContext";
import NowPlayingBar from "@/components/NowPlayingBar";

export default function SearchPage() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const cache = useRef({});
  const router = useRouter();

  const { colors } = useColorTheme();
  
  const bgColor = colors?.bgColor || "#0f0f0f";
  const accentColor = colors?.accentColor || "#22c55e";

  useEffect(() => {
    const storedCache = localStorage.getItem("songSearchCache");
    if (storedCache) {
      cache.current = JSON.parse(storedCache);
    }
  }, []);

  function updateCache(term, results) {
    cache.current[term] = results;
    localStorage.setItem("songSearchCache", JSON.stringify(cache.current));
  }

  async function handleSearch(searchTerm) {
    const trimmedTerm = searchTerm.trim().toLowerCase();

    if (cache.current[trimmedTerm]) {
      setSongs(cache.current[trimmedTerm]);
      return;
    }

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
      console.log("searchResult",data)
      const results = data?.data?.results ?? [];

      updateCache(trimmedTerm, results);
      setSongs(results);
    } catch (error) {
      console.error("Search Error:", error.message);
    } finally {
      setLoading(false);
    }
  }



  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{
        background: `linear-gradient(to bottom, ${bgColor}, #111827)`,
      }}
    >
      <div className="w-full max-w-2xl px-4 mt-16">
        <SearchBar onSearch={handleSearch} accentColor={accentColor} />

        {loading ? (
          <p className="text-gray-400 text-center mt-8">Searching for songs…</p>
        ) : (
          <SongResults data={songs} />
        )}

        <NowPlayingBar />
      </div>
    </div>
  );
}
