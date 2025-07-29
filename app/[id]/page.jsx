// app/songs/[id]/page.jsx

"use client";

import { use, useEffect } from "react";
import { usePlayerContext } from "@/context/PlayerContext";
import Player from "./Player";

export default function SongDetailPage({ params }) {
  const { id } = use(params);
  const { playSong,currentSong } = usePlayerContext();

  useEffect(() => {
    if (currentSong?.id === id) return;

    async function fetchSong() {
      const res = await fetch(
        `https://jiosavan-api2.vercel.app/api/songs/${id}`
      );
      const data = await res.json();
      const song = data?.data[0];

      if (song) {
        playSong({
          ...song,
          audioSrc: song.downloadUrl[4]?.url,
        });
      }
    }

    fetchSong();
  }, [id]);

  return (
   <Player />
  );
}
