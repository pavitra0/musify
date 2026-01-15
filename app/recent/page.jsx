"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import NowPlayingBar from "@/components/NowPlayingBar";
import { SidebarProvider } from "@/components/layout/SidebarContext";
import { History } from "lucide-react";

function RecentPage() {
  const [recentSongs, setRecentSongs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = JSON.parse(localStorage.getItem("recentSongs")) || [];
      setRecentSongs(stored);
    }
  }, []);

  function handleClick(id) {
    router.push(`/song/${id}`);
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-neutral-950 to-black text-white flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <History className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Recent</h1>
                  <p className="text-gray-400">
                    {recentSongs.length}{" "}
                    {recentSongs.length === 1 ? "song" : "songs"}
                  </p>
                </div>
              </div>

              {recentSongs.length === 0 ? (
                <div className="text-center py-20">
                  <History className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                  <h2 className="text-xl font-semibold mb-2">
                    No recent songs
                  </h2>
                  <p className="text-gray-400">
                    Start playing songs to see them here
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {recentSongs.map((song) => {
                    const image =
                      song.image?.[1]?.url ||
                      song.image?.[0]?.url ||
                      "/placeholder.jpg";
                    const name = song.name || song.title;
                    const artistNames = song.artists?.primary
                      ?.map((artist) => artist.name)
                      .join(", ");

                    return (
                      <div
                        key={song.id}
                        onClick={() => handleClick(song.id)}
                        className="relative bg-neutral-900/60 backdrop-blur-md border border-white/10 rounded-xl hover:scale-105 hover:bg-neutral-900/40 transition-all duration-300 p-3 shadow-lg cursor-pointer group"
                      >
                        <div className="relative">
                          <img
                            src={image}
                            alt={name}
                            className="w-full aspect-square rounded-md object-cover"
                          />
                        </div>
                        <p className="text-sm font-semibold mt-2 truncate">
                          {name}
                        </p>
                        {artistNames && (
                          <p className="text-xs text-gray-400 truncate">
                            {artistNames}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </main>
        </div>
        <NowPlayingBar />
      </div>
    </SidebarProvider>
  );
}

export default RecentPage;

