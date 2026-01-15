"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { searchArtistByQuery } from "@/actions/fetchingSongs";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import NowPlayingBar from "@/components/NowPlayingBar";
import { SidebarProvider } from "@/components/layout/SidebarContext";
import { LoaderCircle, Mic2 } from "lucide-react";

function ArtistsPage() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const artistData = await searchArtistByQuery("popular");
        setArtists(artistData?.data?.results || []);
      } catch (err) {
        console.error("Data fetching error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  function handleClick(id) {
    router.push(`/artist/${id}`);
  }

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-neutral-950 to-black text-white flex">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Navbar />
            <main className="flex-1 flex justify-center items-center">
              <LoaderCircle className="animate-spin h-10 w-10" />
            </main>
          </div>
          <NowPlayingBar />
        </div>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-neutral-950 to-black text-white flex">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Navbar />
            <main className="flex-1 flex justify-center items-center">
              <div className="text-red-500">Error: {error}</div>
            </main>
          </div>
          <NowPlayingBar />
        </div>
      </SidebarProvider>
    );
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
                <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <Mic2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Artists</h1>
                  <p className="text-gray-400">
                    {artists.length} {artists.length === 1 ? "artist" : "artists"}
                  </p>
                </div>
              </div>

              {artists.length === 0 ? (
                <div className="text-center py-20">
                  <Mic2 className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                  <h2 className="text-xl font-semibold mb-2">No artists found</h2>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {artists.map((artist) => {
                    const image =
                      artist.image?.[1]?.url ||
                      artist.image?.[0]?.url ||
                      "/placeholder.jpg";
                    const name = artist.name || artist.title;

                    return (
                      <div
                        key={artist.id}
                        onClick={() => handleClick(artist.id)}
                        className="relative bg-neutral-900/60 backdrop-blur-md border border-white/10 rounded-xl hover:scale-105 hover:bg-neutral-900/40 transition-all duration-300 p-3 shadow-lg cursor-pointer group"
                      >
                        <div className="relative">
                          <img
                            src={image}
                            alt={name}
                            className="w-full aspect-square rounded-full object-cover"
                          />
                        </div>
                        <p className="text-sm font-semibold mt-2 truncate text-center">
                          {name}
                        </p>
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

export default ArtistsPage;

