"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import NowPlayingBar from "@/components/NowPlayingBar";
import SearchBar from "@/components/SearchBar";
import { SidebarProvider } from "@/components/layout/SidebarContext";

export default function SearchPage() {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-neutral-950 to-black text-white flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-3xl font-bold mb-6">Search</h1>
              <SearchBar />
              <p className="text-gray-400 text-center py-12">
                Search for songs, artists, albums, and playlists
              </p>
            </div>
          </main>
        </div>
        <NowPlayingBar />
      </div>
    </SidebarProvider>
  );
}

