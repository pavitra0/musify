"use client";

import { createContext, useContext, useState, useRef, useEffect } from "react";
import { Howl } from "howler";
import { useRouter } from "next/navigation";

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const router = useRouter();

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const howlRef = useRef(null);
  const rafRef = useRef(null);
  const playlistRef = useRef([]);
  const indexRef = useRef(-1);

  // helpers

  useEffect(() => {
    playlistRef.current = playlist;
  }, [playlist]);

  useEffect(() => {
    indexRef.current = currentIndex;
  }, [currentIndex]);

  const stopRAF = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const startProgressLoop = (howl) => {
    stopRAF();

    const step = () => {
      if (!howl) return;
      setProgress(howl.seek() || 0);
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  };

  // controls

  const seekTo = (time) => {
    const howl = howlRef.current;
    if (!howl) return;
    howl.seek(time);
    setProgress(time);
  };

  const playNext = () => {
    const list = playlistRef.current;
    const idx = indexRef.current;
    if (!list.length || idx === -1) return;
    const next = (idx + 1) % list.length;
    router.push(`/song/${list[next].id}`);
  };

  const playPrev = () => {
    const list = playlistRef.current;
    const idx = indexRef.current;
    if (!list.length || idx === -1) return;
    const prev = (idx - 1 + list.length) % list.length;
    router.push(`/song/${list[prev].id}`);
  };

  const playSong = (song, songsList = null, index = -1, skipNav = false) => {
    if (!song || !song.audioSrc) return;

    // reset UI state
    setProgress(0);
    setDuration(0);

    // cleanup old sound
    if (howlRef.current) {
      howlRef.current.stop();
      howlRef.current.unload();
      howlRef.current = null;
    }

    if (songsList?.length) {
      setPlaylist(songsList);
      const idx = index >= 0 ? index : songsList.findIndex(s => s.id === song.id);
      if (idx >= 0) setCurrentIndex(idx);
    }

    const howl = new Howl({
      src: [song.audioSrc],
      html5: true,

      onload: () => {
        setDuration(howl.duration() || 0);
      },

      onplay: () => {
        setIsPlaying(true);
        startProgressLoop(howl);
      },

      onpause: () => {
        setIsPlaying(false);
      },

      onstop: () => {
        setIsPlaying(false);
        stopRAF();
      },

      onend: () => {
        stopRAF();
        playNext();
      },
    });

    howlRef.current = howl;
    setCurrentSong(song);
    howl.play();

    if (!skipNav && song.id) {
      router.push(`/song/${song.id}`);
    }
  };

  const togglePlay = () => {
    const howl = howlRef.current;
    if (!howl) return;
    howl.playing() ? howl.pause() : howl.play();
  };

  const stopSong = () => {
    if (howlRef.current) {
      howlRef.current.stop();
      howlRef.current.unload();
      howlRef.current = null;
    }
    stopRAF();
    setCurrentSong(null);
    setIsPlaying(false);
    setPlaylist([]);
    setCurrentIndex(-1);
    setProgress(0);
    setDuration(0);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        playlist,
        currentIndex,
        progress,
        duration,
        playSong,
        playNext,
        playPrev,
        togglePlay,
        stopSong,
        seekTo,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayerContext = () => useContext(PlayerContext);
