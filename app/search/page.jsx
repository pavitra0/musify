"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "../../components/SearchBar";
import SongResults from "../../components/SongResults";
import { useColorTheme } from "../../components/ColorThemeContext";

export default function SearchPage() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const cache = useRef({});
  const router = useRouter();

  const { colors } = useColorTheme();
  const bgColor = colors?.backgroundColor || "#0f0f0f";
  const accentColor = colors?.accentColor || "#22c55e"; // default green-500

  // Load cache from localStorage on first mount
  useEffect(() => {
    const storedCache = localStorage.getItem("songSearchCache");
    if (storedCache) {
      cache.current = JSON.parse(storedCache);
    }
  }, []);

  // Save to localStorage whenever cache updates
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
      const results = data?.data?.results ?? [];

      updateCache(trimmedTerm, results);
      setSongs(results);
    } catch (error) {
      console.error("Search Error:", error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectSong(song) {
    router.push(`/search/${song.id}`);
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-full max-w-2xl px-4 mt-16">
        <SearchBar onSearch={handleSearch} accentColor={accentColor} />
        {loading ? (
          <p className="text-gray-400 text-center mt-8">Searching for songs…</p>
        ) : (
          <SongResults data={songs} onSelectSong={handleSelectSong} />
        )}
      </div>
    </div>
  );
}
