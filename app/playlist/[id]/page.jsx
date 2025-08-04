"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchplaylistsByID } from "@/actions/fetchingSongs";
import { useColorTheme } from "@/components/ColorThemeContext";
import { formatTime } from "@/app/[id]/Player";

export default function PlaylistPage() {
  const { id } = useParams();
  const router = useRouter();
  const [playlist, setPlaylist] = useState(null);
  const [error, setError] = useState(null);

  const {
    colors: { bgColor, accentColor },
  } = useColorTheme();

  useEffect(() => {
    const getPlaylist = async () => {
      try {
        const data = await fetchplaylistsByID(id);
        setPlaylist(data.data);
      } catch (err) {
        console.error("Failed to fetch playlist:", err);
        setError("Unable to load playlist.");
      }
    };

    if (id) getPlaylist();
  }, [id]);

  const getTotalDuration = (songs) => {
    const totalMs = songs?.reduce(
      (sum, song) => sum + (parseInt(song?.duration) || 0),
      0
    );
    return formatTime(totalMs);
  };

  const getYear = (song) => {
    // Try to extract year from known fields
    if (song.year) return song.year;
    if (song.releaseDate) return new Date(song.releaseDate).getFullYear();
    return "—";
  };

console.log(playlist)

  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!playlist) return <div className="text-white p-4">Loading...</div>;

  return (
    <div className="p-4 text-white">
      {/* Playlist Header */}
      <div className="flex items-center gap-6 mb-6">
        <img
          src={playlist.image?.[2]?.url}
          alt={playlist.name}
          className="w-50 h-50 rounded-xl object-cover shadow-lg"
        />
        <div>
          <h1 className="text-4xl font-bold">{playlist.name}</h1>
          <p className="text-sm mt-2 text-gray-400">
            {playlist.songs?.length || 0} songs •{" "}
            {getTotalDuration(playlist.songs)}
          </p>
          <p className="text-gray-400 text-sm mt-1">{playlist.description}</p>
        </div>
      </div>

      {/* Songs List */}
      <h2 className="text-2xl font-semibold mb-4">Tracks</h2>
      <ul className="space-y-3">
        {playlist.songs.map((song, index) => (
          <li
            key={song.id}
            className="flex justify-between items-center bg-neutral-900 hover:bg-neutral-800 transition-colors duration-200 p-3 rounded-md border border-transparent hover:border"
            style={{ borderColor: accentColor }}
            onClick={() => router.push(`/${song.id}`)}
          >
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm w-6">{index + 1}</span>
              <img
                src={song.image?.[1]?.url || song.image?.[0]?.url}
                alt={song.name}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="flex flex-col">
                <span className="text-base">{song.name}</span>
                <span className="text-sm text-gray-500">
                  {song.artists?.primary?.map((a) => a.name).join(", ") ||
                    "Unknown"}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-400 flex items-center gap-6">
              <div className="relative group w-28 text-right text-sm text-gray-400">
                {/* Duration (default) */}
                <span className="block group-hover:hidden  absolute top-0 right-0 ">
                  {formatTime(song.duration)}
                </span>

                {/* Full release date on hover */}
                <span className="hidden group-hover:block absolute top-0 right-0 w-full">
                  {getYear(song)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
