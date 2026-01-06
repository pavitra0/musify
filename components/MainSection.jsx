"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  fetchAlbumByID,
  fetchplaylistsByID,
  searchAlbumByQuery,
  searchPlayListByQuery,
} from "../actions/fetchingSongs";
import { useColorTheme } from "./ColorThemeContext";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

function MainSection() {
  const [trending, setTrending] = useState([]);
  const [latestSongs, setLatestSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likedSongs, setLikedSongs] = useState([]);

  const router = useRouter();
  const { colors } = useColorTheme();
  const bgColor = colors?.bgColor || "#0f0f0f";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = JSON.parse(localStorage.getItem("likedSongs")) || [];
      setLikedSongs(stored);
    }
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [songData, latestData, albumData, playlistData] =
          await Promise.all([
            fetchplaylistsByID(82914609),
            fetchplaylistsByID(110858205),
            searchAlbumByQuery("japanese"),
            searchPlayListByQuery("english"),
          ]);

        setTrending(songData.data.songs);
        setLatestSongs(latestData.data.songs);
        setAlbums(albumData.data.results);
        setPlaylists(playlistData.data.results);
      } catch (err) {
        console.error("Data fetching error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // ✅ Memoized lookups
  const albumMap = useMemo(() => {
    return new Map(albums.map((album) => [album.id, album]));
  }, [albums]);

  const playlistMap = useMemo(() => {
    return new Map(playlists.map((p) => [p.id, p]));
  }, [playlists]);

  async function handleClick(type, id) {
    if (type === "song") {
      router.push(`/song/${id}`);
    }
    if (type === "album") {
      const album = albumMap.get(id);
      if (album) {
        router.push(`/album/${album.id}`);
      }
    }
    if (type === "playlist") {
      const playlist = playlistMap.get(id);
      if (playlist) {
        router.push(`/playlist/${playlist.id}`);
      }
    }
  }

  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  const SectionSlider = ({ title, items, type }) => (
    <section className="space-y-1">
      {items.length ? <h2 className="text-xl font-bold">{title}</h2> : null}
      <div
        className="grid grid-flow-col auto-cols-max gap-4 overflow-x-auto scroll-smooth scrollbar-thin pb-2"
        style={{ gridTemplateRows: "repeat(2, 2)" }}
      >
        {items.map((item, i) => {
          const image =
            item.image?.[1]?.url || item.image?.[0]?.url || "/placeholder.jpg";
          const name = item.name || item.title;
          const artistNames = item.artists?.primary
            ?.map((artist) => artist.name)
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
              className="relative w-36 sm:w-40 md:w-48 bg-neutral-900/60 backdrop-blur-md border border-white/10 rounded-xl hover:scale-105 hover:bg-neutral-900/40 transition-all duration-300 p-3 shadow-lg"
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

  useEffect(() => {
    if (
      likedSongs?.length > 0 ||
      trending?.length > 0 ||
      latestSongs?.length > 0 ||
      albums?.length > 0 ||
      playlists?.length > 0
    ) {
      setLoading(false);
    }
  }, [likedSongs, trending, latestSongs, albums, playlists]);

  if (loading) {
    return (
      <main className="flex justify-center items-center h-screen text-white">
        <LoaderCircle className="animate-spin h-10 w-10" />
      </main>
    );
  }

  return (
    <main className="text-white p-4 space-y-4">
      {Array.isArray(likedSongs) && likedSongs.length > 0 && (
        <SectionSlider title="Liked Songs ❤️" items={likedSongs} type="song" />
      )}
      <SectionSlider
        title="You Might Like These"
        items={trending}
        type="song"
      />
      <SectionSlider title="Latest Songs" items={latestSongs} type="song" />
      <SectionSlider title="Albums" items={albums} type="album" />
      <SectionSlider title="Playlists" items={playlists} type="playlist" />
    </main>
  );
}

export default MainSection;
