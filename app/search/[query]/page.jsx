"use client";

import React, { useEffect, useState, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import {
  getArtistbyQuery,
  getSongbyQuery,
  searchAlbumByQuery,
  searchPlayListByQuery,
} from "@/actions/fetchingSongs";
import SearchBar from "@/components/SearchBar";
import NowPlayingBar from "@/components/NowPlayingBar";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/layout/SidebarContext";
import { LoaderCircle } from "lucide-react";

function SearchResultsPage({ params }) {
  const { query } = use(params);

  const search = decodeURIComponent(query);

  const [trending, setTrending] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [artists, setArtists] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (!search.trim()) return;

    const fetchAllData = async () => {
      try {
        const [songData, artistData, albumData, playlistData] =
          await Promise.all([
            getSongbyQuery(search, 20),
            getArtistbyQuery(search, 20),
            searchAlbumByQuery(search),
            searchPlayListByQuery(search),
          ]);
        setTrending(songData?.data?.results || []);
        setAlbums(albumData?.data?.results || []);
        setArtists(artistData?.data?.results || []);
        setPlaylists(playlistData?.data?.results || []);
      } catch (err) {
        console.error("Data fetching error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [query]);

  const albumMap = useMemo(
    () => new Map(albums.map((a) => [a.id, a])),
    [albums]
  );
  const playlistMap = useMemo(
    () => new Map(playlists.map((p) => [p.id, p])),
    [playlists]
  );

  function handleClick(type, id) {
    switch (type) {
      case "song":
        router.push(`/song/${id}`);
        break;
      case "album":
        if (albumMap.has(id)) router.push(`/album/${id}`);
        break;
      case "artist":
        if (artists.some((a) => a.id === id)) router.push(`/artist/${id}`);
        break;
      case "playlist":
        if (playlistMap.has(id)) router.push(`/playlist/${id}`);
        break;
    }
  }

  const SectionSlider = ({ title, items, type }) => (
    <section className="space-y-2">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="flex gap-4 overflow-x-auto scroll-smooth snap-x scrollbar-thin pb-2 cursor-pointer">
        {items.map((item, i) => {
          const image =
            item.image?.[1]?.url || item.image?.[0]?.url || "/placeholder.jpg";
          const name = item.name || item.title;
          const artistNames = item.artists?.primary
            ?.map((a) => a.name)
            .join(", ");
          const duration = item.duration
            ? `${Math.floor(item.duration / 60)}:${(item.duration % 60)
                .toString()
                .padStart(2, "0")}`
            : null;

          return (
            <div
              key={item.id || i}
              onClick={() => handleClick(type, item.id)}
              className="relative w-36 shrink-0 snap-start bg-neutral-800 rounded-xl hover:scale-105 transition-transform duration-200 p-2"
            >
              <div className="relative group">
                <img
                  src={image}
                  alt={name}
                  className="w-full aspect-square rounded-md object-cover"
                />
                {duration && (
                  <div className="absolute bottom-2 right-2 bg-black/60 text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition">
                    {duration}
                  </div>
                )}
              </div>
              <p className="text-sm font-semibold mt-2 truncate">{name}</p>
              {artistNames && (
                <p className="text-xs text-gray-400 truncate">{artistNames}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );

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

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-neutral-950 to-black text-white flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-8">
              <h1 className="text-3xl font-bold">Search Results for "{search}"</h1>
              {trending.length > 0 && (
                <SectionSlider
                  title="Songs"
                  items={trending}
                  type="song"
                />
              )}
              {artists.length > 0 && (
                <SectionSlider title="Artists" items={artists} type="artist" />
              )}
              {albums.length > 0 && (
                <SectionSlider title="Albums" items={albums} type="album" />
              )}
              {playlists.length > 0 && (
                <SectionSlider title="Playlists" items={playlists} type="playlist" />
              )}
            </div>
          </main>
        </div>
        <NowPlayingBar />
      </div>
    </SidebarProvider>
  );
}

export default SearchResultsPage;
