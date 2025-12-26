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

// {'v1'}
// "use client";

// import { createContext, useContext, useState, useRef } from "react";
// import { Howl } from "howler";

// const PlayerContext = createContext();

// export function PlayerProvider({ children }) {
//   const [playlist, setPlaylist] = useState([]); // ✅ store all songs
//   const [currentIndex, setCurrentIndex] = useState(-1); // ✅ track current song index
//   const [isPlaying, setIsPlaying] = useState(false);
//   const howlRef = useRef(null);

//   const playSong = (song, songsList = []) => {
//     if (!song || !song.audioSrc) return;

//     // ✅ Update playlist if new list is passed
//     if (songsList.length) {
//       setPlaylist(songsList);
//       setCurrentIndex(songsList.findIndex(s => s.audioSrc === song.audioSrc));
//     }

//     // ✅ Stop old instance
//     if (howlRef.current) {
//       howlRef.current.stop();
//       howlRef.current.unload();
//     }

//     const newHowl = new Howl({
//       src: [song.audioSrc],
//       html5: true,
//       onend: playNext, // ✅ Auto play next
//     });

//     howlRef.current = newHowl;
//     newHowl.play();
//     setIsPlaying(true);
//   };

//   const playNext = () => {
//     if (playlist.length === 0) return;
//     const nextIndex = (currentIndex + 1) % playlist.length;
//     setCurrentIndex(nextIndex);
//     playSong(playlist[nextIndex]);
//   };

//   const playPrev = () => {
//     if (playlist.length === 0) return;
//     const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
//     setCurrentIndex(prevIndex);
//     playSong(playlist[prevIndex]);
//   };

//   const togglePlay = () => {
//     if (!howlRef.current) return;

//     if (howlRef.current.playing()) {
//       howlRef.current.pause();
//       setIsPlaying(false);
//     } else {
//       howlRef.current.play();
//       setIsPlaying(true);
//     }
//   };

//   return (
//     <PlayerContext.Provider
//       value={{
//         playlist,
//         currentIndex,
//         isPlaying,
//         playSong,
//         playNext,
//         playPrev,
//         togglePlay,
//         howl: howlRef.current,
//       }}
//     >
//       {children}
//     </PlayerContext.Provider>
//   );
// }

// export const usePlayerContext = () => useContext(PlayerContext);

// {'v3'}
// "use client";

// import { createContext, useContext, useState, useEffect, useRef } from "react";
// import { Howl } from "howler";
// import { useRouter } from "next/navigation";

// const PlayerContext = createContext();

// export function PlayerProvider({ children }) {
//   const [playlist, setPlaylist] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentSong, setCurrentSong] = useState(null);
//   const router = useRouter()

//   const howlRef = useRef(null);
//   const playlistRef = useRef([]);

//   // Keep ref updated
//   useEffect(() => {
//     playlistRef.current = playlist;
//   }, [playlist]);

//   // Play a song
//   const playSong = (song, list = playlistRef.current, index = 0) => {
//     // if (!song || !song.audioSrc) return;
   
//     if (howlRef.current) {
//       howlRef.current.stop();
//       howlRef.current.unload();
//     }

//     const newHowl = new Howl({
//       src: [song.audioSrc],
//       html5: true,
//       onend: () => playNextFunctional(),
//     });

//     howlRef.current = newHowl;
//     newHowl.play();
//     setIsPlaying(true);
//     setCurrentSong(song);

//     // Update playlist and index
//     if (list.length) {
//       setPlaylist(list);
//       setCurrentIndex(index);
//     }
//   };

//   // Play next song
//   const playNextFunctional = () => {
//     setCurrentIndex((prevIndex) => {
//       const list = playlistRef.current;
//       if (!list.length) return prevIndex;

//       const nextIndex = (prevIndex + 1) % list.length;
//       playSong(list[nextIndex], list, nextIndex);
//       return nextIndex;
//     });
//   };

//   const playPrev = () => {
//     setCurrentIndex((prevIndex) => {
//       const list = playlistRef.current;
//       if (!list.length) return prevIndex;

//       const prev = (prevIndex - 1 + list.length) % list.length;
//       playSong(list[prev], list, prev);
//       return prev;
//     });
//   };

//   const togglePlay = () => {
//     if (!howlRef.current) return;
//     if (howlRef.current.playing()) {
//       howlRef.current.pause();
//       setIsPlaying(false);
//     } else {
//       howlRef.current.play();
//       setIsPlaying(true);
//     }
//   };

//   // Load nextSongs from localStorage on mount
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const storedNextSongs = JSON.parse(localStorage.getItem("nextSongs")) || [];
//       if (storedNextSongs.length) {
//         setPlaylist(storedNextSongs);
//         setCurrentIndex(0);
//       }
//     }
//   }, []);

//   // Play first song once playlist is set
//   useEffect(() => {
//     if (playlist.length) {
//       playSong(playlist[0], playlist, 0);
//     }
//   }, [playlist]);

//   return (
//     <PlayerContext.Provider
//       value={{
//         playlist,
//         currentIndex,
//         currentSong,
//         isPlaying,
//         playSong,
//         playNext: playNextFunctional,
//         playPrev,
//         togglePlay,
//         howl: howlRef.current,
//       }}
//     >
//       {children}
//     </PlayerContext.Provider>
//   );
// }

// export const usePlayerContext = () => useContext(PlayerContext);


// "use client";

// import { createContext, useContext, useState, useEffect, useRef } from "react";
// import { Howl } from "howler";
// import { useRouter } from "next/navigation";

// const PlayerContext = createContext();

// export function PlayerProvider({ children }) {
//   const router = useRouter();
//   const [playlist, setPlaylist] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentSong, setCurrentSong] = useState(null);

//   const howlRef = useRef(null);
//   const playlistRef = useRef([]);

//   // Keep ref updated
//   useEffect(() => {
//     playlistRef.current = playlist;
//   }, [playlist]);

//   // Play a song
//   const playSong = (song, list = playlistRef.current, index = 0) => {
//     if (!song || !song.audioSrc) return;
//     console.log("Playing song:", song);

//     // Stop previous song
//     if (howlRef.current) {
//       howlRef.current.stop();
//       howlRef.current.unload();
//     }

//     const newHowl = new Howl({
//       src: [song.audioSrc],
//       html5: true,
//       onend: () => playNextFunctional(),
//     });

//     howlRef.current = newHowl;
//     newHowl.play();
//     setIsPlaying(true);
//     setCurrentSong(song);

//     // Update playlist and index
//     if (list.length) {
//       setPlaylist(list);
//       setCurrentIndex(index);
//     }

//     // Navigate to song page
//     if (song.id) {
//       router.push(`/song/${song.id}`);
//     }
//   };

//   // Play next song
//   const playNextFunctional = () => {
//     setCurrentIndex((prevIndex) => {
//       const list = playlistRef.current;
//       if (!list.length) return prevIndex;

//       const nextIndex = (prevIndex + 1) % list.length;
//       playSong(list[nextIndex], list, nextIndex);
//       return nextIndex;
//     });
//   };

//   const playPrev = () => {
//     setCurrentIndex((prevIndex) => {
//       const list = playlistRef.current;
//       if (!list.length) return prevIndex;

//       const prev = (prevIndex - 1 + list.length) % list.length;
//       playSong(list[prev], list, prev);
//       return prev;
//     });
//   };

//   const togglePlay = () => {
//     if (!howlRef.current) return;
//     if (howlRef.current.playing()) {
//       howlRef.current.pause();
//       setIsPlaying(false);
//     } else {
//       howlRef.current.play();
//       setIsPlaying(true);
//     }
//   };

//   // Load playlist from localStorage safely
//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const storedNextSongs = JSON.parse(localStorage.getItem("nextSongs")) || [];
//     if (storedNextSongs.length) {
//       setPlaylist(storedNextSongs);
//       setCurrentIndex(0);

//       // Play first song after small delay
//       setTimeout(() => {
//         const firstSong = storedNextSongs[0];
//         playSong(firstSong, storedNextSongs, 0);
//       }, 50);
//     }
//   }, []);

//   return (
//     <PlayerContext.Provider
//       value={{
//         playlist,
//         currentIndex,
//         currentSong,
//         isPlaying,
//         playSong,
//         playNext: playNextFunctional,
//         playPrev,
//         togglePlay,
//         howl: howlRef.current,
//       }}
//     >
//       {children}
//     </PlayerContext.Provider>
//   );
// }

// export const usePlayerContext = () => useContext(PlayerContext);
