"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchAlbumByID } from "@/actions/fetchingSongs";
import { useColorTheme } from "@/components/ColorThemeContext";
import { useRouter } from "next/navigation";
import { formatTime } from "@/app/song/[id]/Player";

export default function AlbumPage() {
  const { id } = useParams();
  const [albumData, setAlbumData] = useState(null);
  const [error, setError] = useState(null);
  const {
    colors: { bgColor, accentColor },
  } = useColorTheme();

  const router = useRouter();

  useEffect(() => {
    const getAlbum = async () => {
      try {
        const data = await fetchAlbumByID(id);
        setAlbumData(data.data);
      } catch (err) {
        console.error("Failed to fetch album:", err);
        setError("Unable to load album.");
      }
    };

    if (id) getAlbum();
  }, [id]);

  const getTotalDuration = (songs) => {
    const totalMs = songs?.reduce(
      (sum, song) => sum + (parseInt(song?.duration) || 0),
      0
    );

    return `${formatTime(totalMs)}`;
  };

  console.log(albumData)

  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!albumData) return <div className="text-white p-4">Loading...</div>;

  return (
    <div className="p-4 text-white">
      {/* Header */}
      <div className="flex items-center gap-6 mb-6">
        <img
          src={albumData.image?.[2]?.url}
          alt={albumData.name}
          className="w-40 h-40 rounded-xl object-cover shadow-lg"
        />
        <div>
          <h1 className="text-4xl  font-bold">{albumData.name}</h1>
          <p className="text-gray-400 mt-1">{albumData.primaryArtists}</p>
          <p className="text-sm mt-2 text-gray-400">
            {albumData.songs?.length || 0} songs •{" "}
            {getTotalDuration(albumData.songs)}
          </p>
          <p className="text-sm mt-2 text-gray-400">{albumData.description}</p>
        </div>
      </div>

      {/* Songs List */}
      <h2 className="text-2xl font-semibold mb-4">Tracks</h2>
      <ul className="space-y-3">
        {albumData.songs.map((song, index) => (
          <li
            key={song.id}
            className="flex justify-between items-center bg-neutral-900 hover:bg-neutral-800 transition-colors duration-200 p-3 rounded-md border border-transparent hover:border"
            onClick={() => router.push(`/song/${song.id}`)}
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm w-6">{index + 1}</span>
             
              <div className="flex flex-col">
                <span className="text-base">{song.name}</span>
                <span className="text-sm text-gray-500">
                  {song?.artists?.primary.map((artist) => artist.name)}
                </span>
              </div>
            </div>
            <span className="text-sm text-gray-400">
              {formatTime(song.duration)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
