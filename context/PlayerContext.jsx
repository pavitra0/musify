"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { Howl } from "howler";

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const howlRef = useRef(null); // ✅ Use ref so Howl instance persists without triggering re-renders

  const playSong = (song) => {
    if (!song || !song.audioSrc) return;

    // ✅ Stop and unload previous instance
    if (howlRef.current) {
      howlRef.current.stop();
      howlRef.current.unload();
      howlRef.current = null;
    }

    const newHowl = new Howl({
      src: [song.audioSrc],
      html5: true,
      onend: () => setIsPlaying(false),
    });

    howlRef.current = newHowl;
    setCurrentSong(song);
    newHowl.play();
    setIsPlaying(true);
  };

  const togglePlay = () => {
    const howl = howlRef.current;
    if (!howl) return;

    if (howl.playing()) {
      howl.pause();
      setIsPlaying(false);
    } else {
      howl.play();
      setIsPlaying(true);
    }
  };

  const setTrackOnly = (song) => {
    setCurrentSong(song);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        playSong,
        togglePlay,
        setTrackOnly,
        howl: howlRef.current, // ✅ make howl available for progress tracking
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayerContext = () => useContext(PlayerContext);
