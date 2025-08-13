'use client'

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import SongResults from "./SongResults";
import { useState, useEffect } from "react";

export default function SearchBar() {
  const [input, setInput] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [isLoading,setLoading] = useState(false)
  const [data,setData] = useState([])
  const router = useRouter();

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(input.trim());
    }, 600);

    return () => clearTimeout(handler);
  }, [input]);

  // Trigger search when debounced value changes
  useEffect(() => {
    if (debouncedValue) {
      handleSearch(debouncedValue);
    }
  }, [debouncedValue, handleSearch]);

  function handleSubmit(e) {
    e.preventDefault();
    if (input.trim()) {
      router.push(`/search/${encodeURIComponent(input.trim())}`);
    }
  }


    async function handleSearch(searchTerm) {
    const trimmedTerm = searchTerm.trim().toLowerCase();

    try {
      setLoading(true);
      const res = await fetch(
        `https://jiosavan-api2.vercel.app/api/search/songs?query=${encodeURIComponent(
          trimmedTerm
        )}&page=1&limit=20`
      );

      if (!res.ok) throw new Error("Failed to fetch songs");

      const data = await res.json();
      const results = data?.data?.results || []

      setData(results);
    } catch (error) {
      console.error("Search Error:", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full flex flex-col items-start pb-4">
      {/* Search Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl flex mt-12 mb-4"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search for songs, artists, albums…"
          className="text-white flex-1 px-4 py-2 rounded-l-md border-none text-lg outline-none "
        />
      </form>

      {/* Show results only if there's input */}
      {input.trim() && (
        <div className="w-full max-w-xl">
          <SongResults data={data} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
}
