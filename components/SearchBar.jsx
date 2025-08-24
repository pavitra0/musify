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

  const handleClickOutside = () => setShowSearch(false);

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
      onClick={handleClickOutside}
      className="w-full flex flex-col items-start pb-4"
    >
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-xl flex mt-12 mb-4">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="Search for songs, artists, albums…"
          className="text-white flex-1 px-4 py-2 rounded-l-md border-none text-lg outline-none"
        />
      </form>

      {input.trim() && showSearch && (
        <div className="w-full max-w-xl transition-all">
          <SongResults data={data} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
}
