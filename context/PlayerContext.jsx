// // {'v1'}

// "use client";

// import { createContext, useContext, useState, useEffect, useRef } from "react";
// import { Howl } from "howler";
// import { useRouter } from "next/navigation";

// const PlayerContext = createContext();

// export function PlayerProvider({ children }) {
//   const [currentSong, setCurrentSong] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [playlist, setPlaylist] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(-1);
//   const router = useRouter();
//   const howlRef = useRef(null);
//   const playlistRef = useRef([]);
//   const currentIndexRef = useRef(-1);

//   // Keep refs updated
//   useEffect(() => {
//     playlistRef.current = playlist;
//   }, [playlist]);

//   useEffect(() => {
//     currentIndexRef.current = currentIndex;
//   }, [currentIndex]);

//   const playNext = () => {
//     const list = playlistRef.current;
//     const currentIdx = currentIndexRef.current;
    
//     if (!list.length || currentIdx === -1) return;
    
//     const nextIndex = (currentIdx + 1) % list.length;
//     const nextSong = list[nextIndex];
    
//     if (nextSong && nextSong.id) {
//       // Navigate to next song page - the page.jsx will handle playing
//       router.push(`/song/${nextSong.id}`);
//     }
//   };

//   const playPrev = () => {
//     const list = playlistRef.current;
//     const currentIdx = currentIndexRef.current;
    
//     if (!list.length || currentIdx === -1) return;
    
//     const prevIndex = (currentIdx - 1 + list.length) % list.length;
//     const prevSong = list[prevIndex];
    
//     if (prevSong && prevSong.id) {
//       // Navigate to previous song page - the page.jsx will handle playing
//       router.push(`/song/${prevSong.id}`);
//     }
//   };

//   const playSong = (song, songsList = null, index = -1, skipNavigation = false) => {
//     if (!song || !song.audioSrc) return;

//     // ✅ Stop and unload previous instance
//     if (howlRef.current) {
//       howlRef.current.stop();
//       howlRef.current.unload();
//       howlRef.current = null;
//     }

//     // Update playlist if provided
//     if (songsList && songsList.length > 0) {
//       setPlaylist(songsList);
//       const songIndex = index >= 0 ? index : songsList.findIndex(s => s.id === song.id);
//       if (songIndex >= 0) {
//         setCurrentIndex(songIndex);
//       }
//     }

//     const newHowl = new Howl({
//       src: [song.audioSrc],
//       html5: true,
//       onend: () => {
//         setIsPlaying(false);
//         playNext(); // ✅ Auto play next song
//       },
//     });

//     howlRef.current = newHowl;
//     setCurrentSong(song);
//     newHowl.play();
//     setIsPlaying(true);

//     // Navigate to song page if not skipping navigation
//     if (!skipNavigation && song.id) {
//       router.push(`/song/${song.id}`);
//     }
//   };

//   const togglePlay = () => {
//     const howl = howlRef.current;
//     if (!howl) return;

//     if (howl.playing()) {
//       howl.pause();
//       setIsPlaying(false);
//     } else {
//       howl.play();
//       setIsPlaying(true);
//     }
//   };

//   const setTrackOnly = (song) => {
//     setCurrentSong(song);
//   };

//   return (
//     <PlayerContext.Provider
//       value={{
//         currentSong,
//         isPlaying,
//         playlist,
//         currentIndex,
//         playSong,
//         playNext,
//         playPrev,
//         togglePlay,
//         setTrackOnly,
//         howl: howlRef.current, // ✅ make howl available for progress tracking
//       }}
//     >
//       {children}
//     </PlayerContext.Provider>
//   );
// }

// export const usePlayerContext = () => useContext(PlayerContext);

// {'v1'}

"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import { useRouter } from "next/navigation";

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const router = useRouter();
  const howlRef = useRef(null);
  const playlistRef = useRef([]);
  const currentIndexRef = useRef(-1);

  // Keep refs updated
  useEffect(() => {
    playlistRef.current = playlist;
  }, [playlist]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const playNext = () => {
    const list = playlistRef.current;
    const currentIdx = currentIndexRef.current;
    
    if (!list.length || currentIdx === -1) return;
    
    const nextIndex = (currentIdx + 1) % list.length;
    const nextSong = list[nextIndex];

    if (nextSong && nextSong.id) {
      // Navigate to next song page - the page.jsx will handle playing
      router.push(`/song/${nextSong.id}`);
    }
  };

  const playPrev = () => {
    const list = playlistRef.current;
    const currentIdx = currentIndexRef.current;
    
    if (!list.length || currentIdx === -1) return;
    
    const prevIndex = (currentIdx - 1 + list.length) % list.length;
    const prevSong = list[prevIndex];
    
    if (prevSong && prevSong.id) {
      // Navigate to previous song page - the page.jsx will handle playing
      router.push(`/song/${prevSong.id}`);
    }
  };

  const playSong = (song, songsList = null, index = -1, skipNavigation = false) => {
    if (!song || !song.audioSrc) return;

    // ✅ Stop and unload previous instance
    if (howlRef.current) {
      howlRef.current.stop();
      howlRef.current.unload();
      howlRef.current = null;
    }

    // Update playlist if provided
    if (songsList && songsList.length > 0) {
      setPlaylist(songsList);
      const songIndex = index >= 0 ? index : songsList.findIndex(s => s.id === song.id);
      if (songIndex >= 0) {
        setCurrentIndex(songIndex);
      }
    }

    const newHowl = new Howl({
      src: [song.audioSrc],
      html5: true,
      onend: () => {
        setIsPlaying(false);
        playNext(); // ✅ Auto play next song
      },
    });

    howlRef.current = newHowl;
    setCurrentSong(song);
    newHowl.play();
    setIsPlaying(true);

    // Navigate to song page if not skipping navigation
    if (!skipNavigation && song.id) {
      router.push(`/song/${song.id}`);
    }
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
        playlist,
        currentIndex,
        playSong,
        playNext,
        playPrev,
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