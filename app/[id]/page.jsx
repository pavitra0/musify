// app/songs/[id]/page.jsx

"use client";

import { use, useEffect, useState } from "react";
import { usePlayerContext } from "@/context/PlayerContext";
import Player from "./Player";

export default function SongDetailPage({ params }) {
  const { id } = use(params);
  const { playSong, currentSong } = usePlayerContext();
  const [lyrics, setLyrics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentSong?.id === id) {
      setLoading(false);
      return;
    }

    async function fetchSong() {
      try {
        setLoading(true);

        // Fetch song details
        const res = await fetch(
          `https://jiosavan-api2.vercel.app/api/songs/${id}`
        );
        const data = await res.json();
        const song = data?.data[0];

        if (!song) {
          console.error("Song not found");
          return;
        }

        // Start playing immediately
        playSong({
          ...song,
          audioSrc: song.downloadUrl[4]?.url,
        });

        // Lyrics fetch in background (non-blocking)
        fetch(
          `https://musify-blue-xi.vercel.app//api/lyrics?artist=${encodeURIComponent(
            song.artists?.primary[0]?.name
          )}&title=${encodeURIComponent(song.name)}`
        )
          .then((res) => res.json())
          .then((lyricsData) => {
            setLyrics(lyricsData);
          })
          .catch((err) => {
            console.warn("Lyrics fetch failed:", err);
          });
      } catch (error) {
        console.error("Error fetching song:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSong();
  }, [id]);

  return loading ? (
    <div className="text-white p-4 text-center">Loading song...</div>
  ) : (
    <Player lyrics={lyrics} />
  );
}
