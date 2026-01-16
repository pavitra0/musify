"use client";

import { useRouter } from "next/navigation";
import SongResults from "./SongResults";
import { useEffect, useRef, useState } from "react";
import { useClickOutside, useDebounce } from "react-haiku";

export default function SearchBar() {
  const [input, setInput] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(true);
  const ref = useRef(null);

  const handleClickOutside = () => {
    setShowSearch(false);
  };

  useClickOutside(ref, handleClickOutside);

  const debouncedValue = useDebounce(input, 300);

  const handleChange = (event) => {
    setShowSearch(true);
    setInput(event.target.value);
  };

  useEffect(() => {
    if (debouncedValue.trim()) {
      handleSearch(debouncedValue);
    } else {
      setData([]);
    }
  }, [debouncedValue]);

  // Search function
  async function handleSearch(searchTerm) {
    const trimmedTerm = searchTerm.trim().toLowerCase();

    if (!trimmedTerm) return;

    try {
      setLoading(true);
      const res = await fetch(
        `https://jiosavan-api2.vercel.app/api/search/songs?query=${encodeURIComponent(
          trimmedTerm
        )}&page=1&limit=20`
      );

      if (!res.ok) throw new Error("Failed to fetch songs");

      const data = await res.json();
      const results = data?.data?.results || [];

      setData(results);
    } catch (error) {
      console.error("Search Error:", error.message);
    } finally {
      setLoading(false);
    }
  }

  // Handle form submit
  function handleSubmit(e) {
    e.preventDefault();
    handleSearch(input); // Trigger search immediately
    if (input.trim()) {
      router.push(`/search/${encodeURIComponent(input.trim())}`);
    }
  }

    const slicedData = data.slice(1, 6);


  useEffect(() => {
    if (slicedData.length > 0 && typeof window !== "undefined") {
      localStorage.setItem("nextSongs", JSON.stringify(slicedData));
    }
  }, [slicedData]);

  console.log(slicedData)

  return (
    <div
      ref={ref}
      className="w-full relative flex flex-col"
    >
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="w-full relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={handleChange}
            placeholder="Search for songs, artists, albums…"
            className="w-full px-4 py-2.5 pr-10 bg-neutral-800/90 border border-neutral-700/50 rounded-lg text-white text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all backdrop-blur-sm"
          />
          {input && (
            <button
              type="button"
              onClick={() => {
                setInput("");
                setData([]);
                setShowSearch(false);
              }}
              className="absolute right-3 text-neutral-400 hover:text-white transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {input.trim() && showSearch && (
        <div className="absolute top-full left-0 right-0 mt-2 w-full z-50">
          <SongResults data={data} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
}
