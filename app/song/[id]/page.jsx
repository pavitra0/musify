// // app/songs/[id]/page.jsx

"use client";

import { use, useEffect, useState } from "react";
import { usePlayerContext } from "@/context/PlayerContext";
import Player from "./Player";
import { fetchSongSuggestions } from "@/actions/fetchingSongs";

export default function SongDetailPage({ params }) {
  const { id } = use(params);
  const { playSong, currentSong } = usePlayerContext();
  const [lyrics, setLyrics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentSong?.id && String(currentSong.id) === String(id)) {
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
        console.log(song, 'from page player')

        if (!song) {
          console.error("Song not found");
          return;
        }

        // Format song with audioSrc
        const formattedSong = {
          ...song,
          audioSrc: song.downloadUrl[4]?.url,
        };

        // Fetch suggestions for playlist
        const suggestions = await fetchSongSuggestions(id);
        const formattedSuggestions = suggestions.map((s) => ({
          ...s,
          audioSrc: s.downloadUrl?.[4]?.url,
        }));

        // Find current song index in suggestions
        const currentIndex = formattedSuggestions.findIndex(
          (s) => String(s.id) === String(id)
        );

        // If current song is in suggestions, use suggestions as playlist
        // Otherwise, use current song + suggestions
        const playlist = currentIndex >= 0 
          ? formattedSuggestions 
          : [formattedSong, ...formattedSuggestions];
        const songIndex = currentIndex >= 0 ? currentIndex : 0;

        // Start playing with playlist
        playSong(formattedSong, playlist, songIndex);

        // Lyrics fetch in background (non-blocking)
        fetch(
          `/api/lyrics?artist=${encodeURIComponent(
            song?.artists?.primary[0]?.name
          )}&title=${encodeURIComponent(song?.name)}`
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
  }, [id, currentSong?.id]);

  return <Player lyrics={lyrics} />;
}
