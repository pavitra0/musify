"use client";

import React, { useEffect, useState } from "react";
import {
  fetchplaylistsByID,
  searchAlbumByQuery,
  searchPlayListByQuery,
} from "../actions/fetchingSongs";
import { useColorTheme } from "./ColorThemeContext";
import { useRouter } from "next/navigation";

function MainSection() {
  const [trending, setTrending] = useState([]);
  const [latestSongs, setLatestSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const { colors } = useColorTheme();
  const bgColor = colors?.bgColor || "#0f0f0f";
  const accentColor = colors?.accentColor || "#22c55e";

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [songData, latestData, albumData, playlistData] =
          await Promise.all([
            fetchplaylistsByID(110858205),
            fetchplaylistsByID(6689255),
            searchAlbumByQuery("latest"),
            searchPlayListByQuery("Top"),
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

  function handleClick(type,id){
    if(type === 'song'){
      router.push(`/${id}`)
    }
  }

  if (loading) return <div className="text-white p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  const SectionSlider = ({ title, items, type }) => (
    <section>
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar scroll-smooth snap-x">
        {items.map((item, i) => {
          const image = item.image?.[1]?.url || "";
          const name = item.name || item.title;

          return (
            <div
              key={item.id || i}
              onClick={() => handleClick(type,item.id)}
              className="min-w-[140px] sm:min-w-[160px] bg-neutral-800 rounded-xl shadow-md p-2 snap-start hover:scale-105 transition-transform duration-200"
              style={{ backgroundColor: bgColor }}
            >
              <img
                src={image}
                alt={name}
                className="rounded-md mb-2 w-full aspect-square object-cover"
              />
              <p className="text-sm font-semibold truncate">{name}</p>
              {item.primaryArtists && (
                <p className="text-xs text-gray-400 truncate">
                  {item.primaryArtists}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );

  return (
    <main className="text-white p-4 space-y-8">
      <SectionSlider title="Trending Songs" items={trending} type="song" />
      <SectionSlider title="Latest Songs" items={latestSongs} type="song" />
      <SectionSlider title="Albums" items={albums} type="album" />
      <SectionSlider title="Playlists" items={playlists} type="playlist" />
    </main>
  );
}

export default MainSection;
