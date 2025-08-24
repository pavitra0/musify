"use client";

import { usePlayerContext } from "@/context/PlayerContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SearchBar from "../components/SearchBar";
import { useColorTheme } from "../components/ColorThemeContext";
import NowPlayingBar from "@/components/NowPlayingBar";
import MainSection from "@/components/MainSection";

export default function SearchPage() {
  // const [songs, setSongs] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const router = useRouter();

  const { colors } = useColorTheme();
  const bgColor = colors?.bgColor || "#0f0f0f";
  // const accentColor = colors?.accentColor || "#22c55e";

  // async function handleSearch(searchTerm) {
  //   const trimmedTerm = searchTerm.trim().toLowerCase();

  //   try {
  //     setLoading(true);
  //     const res = await fetch(
  //       `https://jiosavan-api2.vercel.app/api/search/songs?query=${encodeURIComponent(
  //         trimmedTerm
  //       )}&page=1&limit=20`
  //     );

  //     if (!res.ok) throw new Error("Failed to fetch songs");

  //     const data = await res.json();
  //     const results = data?.data?.results || []

  //     setSongs(results);
  //   } catch (error) {
  //     console.error("Search Error:", error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  return (
    <div
      className="min-h-screen  flex flex-col items-center pb-10"
      style={{
        background: `linear-gradient(to bottom, ${bgColor}, #111827)`,
      }}
    >
      <div className="w-full  px-4 ">
        <SearchBar 
        // onSearch={handleSearch}
        //   data={songs}
        //    isLoading={loading}
            />

     

        <MainSection />

        <NowPlayingBar />
      </div>
    </div>
  );
}
