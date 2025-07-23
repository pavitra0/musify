'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from '../../components/SearchBar';
import SongResults from '../../components/SongResults';
import { useColorTheme } from '../../components/ColorThemeContext';

export default function SearchPage() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const cache = useRef({});
  const router = useRouter(); // ✅ Next.js router
    const { colors, setColors } = useColorTheme(); // 🟢 Context used
  const bgColor = colors;
  const accentColor = colors.accentColor;
  console.log(bgColor,accentColor)

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
        `https://jiosavan-api2.vercel.app/api/search?query=${encodeURIComponent(trimmedTerm)}&page=1&limit=10`
      );

      if (!res.ok) throw new Error('Failed to fetch songs');

      const data = await res.json();
      const results = data?.data ?? [];

      cache.current[trimmedTerm] = results;
      setSongs(results);
    } catch (error) {
      console.error('Search Error:', error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectSong(song) {
    router.push(`/search/${song.id}`); // ✅ Go to [id] page
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center">
      <div className="w-full max-w-xl mt-14 px-4">
        <SearchBar onSearch={handleSearch} />
        {loading && <p className="text-gray-400 mt-8">Loading…</p>}
        <SongResults data={songs} onSelectSong={handleSelectSong} />
      </div>
    </div>
  );
}
