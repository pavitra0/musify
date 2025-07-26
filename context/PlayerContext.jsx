// context/PlayerContext.jsx
"use client";
import { createContext, useContext, useState, useRef, useEffect } from "react";
import { Howl } from "howler";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);

  const soundRef = useRef(null);
  const intervalRef = useRef(null);

const playSong = (songUrl) => {
  console.log("Playing song in context:", songUrl);

  if (soundRef.current) {
    soundRef.current.stop();
  }

  const sound = new Howl({
    src: [songUrl],
    html5: true,
    onplay: () => {
      setIsPlaying(true);
      setDuration(sound.duration());
    },
    onend: () => setIsPlaying(false),
  });

  sound.play();
  soundRef.current = sound;
  setCurrentSong(songUrl); // 👈 This must run
};


  const togglePlay = () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      soundRef.current.pause();
      setIsPlaying(false);
    } else {
      soundRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (value) => {
    if (soundRef.current) {
      soundRef.current.seek(value);
      setPosition(value);
    }
  };

  useEffect(() => {
    if (!isPlaying || !soundRef.current) return;

    intervalRef.current = setInterval(() => {
      const current = soundRef.current.seek();
      setPosition(typeof current === "number" ? current : 0);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  return (
    <PlayerContext.Provider
      value={{
        position,
        duration,
        isPlaying,
        togglePlay,
        handleSeek,
        setDuration,
        soundRef,
        playSong,
        currentSong,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => useContext(PlayerContext);
