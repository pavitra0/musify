{
  // "use client";
  // import { useEffect, useRef, useState } from "react";
  // import { useParams, useRouter } from "next/navigation";
  // import { Howl } from "howler";
  // import ColorThief from "color-thief-browser";
  // import {
  //   Heart,
  //   SkipBack,
  //   Play,
  //   Pause,
  //   SkipForward,
  //   Repeat,
  //   Download,
  //   ChevronDown,
  //   ChevronUp,
  //   X,
  // } from "lucide-react";
  // import { fetchSongSuggestions } from "@/actions/fetchingSongs";
  // import { motion } from "framer-motion";
  // import { useColorTheme } from "@/components/ColorThemeContext";
  // import Suggestions from "@/components/Suggestions";
  // function formatTime(seconds) {
  //   if (isNaN(seconds)) return "0:00";
  //   const mins = Math.floor(seconds / 60);
  //   const secs = Math.floor(seconds % 60)
  //     .toString()
  //     .padStart(2, "0");
  //   return `${mins}:${secs}`;
  // }
  // function lighten(rgb, factor = 0.35) {
  //   return rgb.map((c) => Math.min(255, Math.floor(c + (255 - c) * factor)));
  // }
  // function darken(rgb, factor = 0.5) {
  //   return rgb.map((c) => Math.max(0, Math.floor(c * (1 - factor))));
  // }
  // export default function Player({ song, audioSrc }) {
  //   const params = useParams();
  //   const imgRef = useRef(null);
  //   const soundRef = useRef(null);
  //   const intervalRef = useRef(null);
  //   const router = useRouter();
  //   const { setColors } = useColorTheme();
  //   const [isPlaying, setIsPlaying] = useState(false);
  //   const [showSuggestions, setShowSuggestions] = useState(false);
  //   const [duration, setDuration] = useState(0);
  //   const [position, setPosition] = useState(0);
  //   const [bgColor, setBgColor] = useState("#1e293b");
  //   const [accentColor, setAccentColor] = useState("#334155");
  //   const [currentIndex, setCurrentIndex] = useState(null);
  //   const [artistId, setArtistId] = useState(null);
  //   const [suggestions, setSuggestions] = useState([]);
  //   // Load suggestions based on ID
  //   useEffect(() => {
  //     async function func() {
  //       if (!params.id) return;
  //       const results = await fetchSongSuggestions(params.id);
  //       setSuggestions(results);
  //       const current = results.findIndex(
  //         (s) => String(s.id) === String(params.id)
  //       );
  //       setCurrentIndex(current >= 0 ? current : null);
  //     }
  //     func();
  //   }, [params.id]);
  //   // Set up color extraction from image
  //   useEffect(() => {
  //     const img = imgRef.current;
  //     if (!img) return;
  //     const handleLoad = () => {
  //       try {
  //         const color = new ColorThief().getColor(img);
  //         const dark = darken(color);
  //         const light = lighten(color);
  //         const bg = `rgb(${dark.join(",")})`;
  //         const accent = `rgb(${light.join(",")})`;
  //         // Avoid unnecessary state updates
  //         if (bg !== bgColor) setBgColor(bg);
  //         if (accent !== accentColor) setAccentColor(accent);
  //         setColors({ bgColor: bg, accentColor: accent });
  //         document.documentElement.style.setProperty("--bg-color", bg);
  //         document.documentElement.style.setProperty("--accent-color", accent);
  //       } catch (e) {
  //         console.error("ColorThief error", e);
  //       }
  //     };
  //     if (img.complete) handleLoad();
  //     else {
  //       img.addEventListener("load", handleLoad);
  //       return () => img.removeEventListener("load", handleLoad);
  //     }
  //   }, [song?.image?.[1]?.url]);
  //   // Initialize sound
  //   useEffect(() => {
  //     if (!audioSrc) return;
  //     if (soundRef.current) {
  //       soundRef.current.unload();
  //     }
  //     const sound = new Howl({
  //       src: [audioSrc],
  //       html5: true,
  //       onload: () => {
  //         setDuration(sound.duration());
  //         sound.play();
  //         setIsPlaying(true);
  //       },
  //       onend: () => setIsPlaying(false),
  //     });
  //     soundRef.current = sound;
  //     return () => sound.unload();
  //   }, [audioSrc]);
  //   // Handle playing
  //   useEffect(() => {
  //     if (!isPlaying || !soundRef.current) return;
  //     intervalRef.current = setInterval(() => {
  //       const current = soundRef.current.seek();
  //       setPosition(current);
  //     }, 1000);
  //     return () => clearInterval(intervalRef.current);
  //   }, [isPlaying]);
  //   const togglePlay = () => {
  //     if (!soundRef.current) return;
  //     if (isPlaying) {
  //       soundRef.current.pause();
  //     } else {
  //       soundRef.current.play();
  //     }
  //     setIsPlaying(!isPlaying);
  //   };
  //   const handleSeek = (e) => {
  //     const time = parseFloat(e.target.value);
  //     if (soundRef.current) {
  //       soundRef.current.seek(time);
  //       setPosition(time);
  //     }
  //   };
  //   const handleSkipForward = () => {
  //     if (suggestions.length === 0 || currentIndex === null) return;
  //     const nextIndex = (currentIndex + 1) % suggestions.length;
  //     const nextSong = suggestions[nextIndex];
  //     router.push(`/search/${nextSong.id}`);
  //   };
  //   const handleSkipBack = () => {
  //     if (suggestions.length === 0 || currentIndex === null) return;
  //     const prevIndex =
  //       (currentIndex - 1 + suggestions.length) % suggestions.length;
  //     const prevSong = suggestions[prevIndex];
  //     router.push(`/search/${prevSong.id}`);
  //   };
  //   const handleDownload = () => {
  //     const link = document.createElement("a");
  //     link.href = audioSrc;
  //     link.setAttribute("download", `${song?.name || "song"}.mp3`);
  //     link.setAttribute("target", "_blank");
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   };
  //   // console.log(song)
  //   return (
  //     <div
  //       className="min-h-screen flex flex-col items-center justify-between text-white px-6 py-10 transition-colors duration-700"
  //       style={{
  //         background: `linear-gradient(to bottom, ${bgColor}, #111827)`,
  //       }}
  //     >
  //       {/* Hidden image for ColorThief */}
  //       <img
  //         ref={imgRef}
  //         src={song?.image?.[1]?.url || "/placeholder.jpg"}
  //         alt="ColorThief Image"
  //         className="hidden"
  //         crossOrigin="anonymous"
  //       />
  //       {/* Cover */}
  //       <img
  //         src={song?.image?.[2]?.url || "/placeholder.jpg"}
  //         alt={song?.title || "Cover"}
  //         className="w-80 h-80 mt-14 rounded-xl object-cover shadow-lg"
  //       />
  //       {/* Title & Artist */}
  //       <div className="text-center mt-8">
  //         <h2 className="text-2xl font-bold">{song?.name}</h2>
  //         <div className="text-gray-300 text-sm flex flex-wrap gap-1">
  //           {song?.artists?.primary?.length > 0
  //             ? song.artists.primary.map((s, i, arr) => (
  //                 <span key={s.id} className="flex">
  //                   <p
  //                     onClick={() => setArtistId(s.id)}
  //                     className="cursor-pointer hover:underline"
  //                   >
  //                     {s.name}
  //                   </p>
  //                   {i < arr.length - 1 && <span className="ml-1">,</span>}
  //                 </span>
  //               ))
  //             : "Unknown"}
  //         </div>
  //       </div>
  //       {/* Progress */}
  //       <div className="w-full mt-4">
  //         <div className="flex justify-between text-sm text-gray-300 mb-1">
  //           <span>{formatTime(position)}</span>
  //           <span>{formatTime(duration)}</span>
  //         </div>
  //         <input
  //           type="range"
  //           min="0"
  //           max={duration}
  //           value={position}
  //           step="0.5"
  //           onChange={handleSeek}
  //           className="w-full h-2 rounded-lg outline-none"
  //           style={{ backgroundColor: accentColor }}
  //         />
  //       </div>
  //       {/* Controls */}
  //       <div className="flex items-center justify-center gap-8 mt-6">
  //         <Heart size={22} color={accentColor} className="cursor-pointer" />
  //         <SkipBack
  //           size={28}
  //           onClick={handleSkipBack}
  //           color={accentColor}
  //           className="cursor-pointer"
  //         />
  //         <motion.button
  //           whileHover={{ scale: 1.1 }}
  //           whileTap={{ scale: 0.9 }}
  //           animate={{
  //             borderRadius: isPlaying ? "12px" : "50%", // morph shape
  //             width: isPlaying ? "56px" : "56px", // w-16 vs w-14
  //             height: isPlaying ? "56px" : "56px", // h-10 vs h-14
  //             backgroundColor: isPlaying
  //               ? "rgba(255,255,255,0.3)"
  //               : "rgba(255,255,255,0.2)",
  //           }}
  //           transition={{ type: "spring", stiffness: 300, damping: 20 }}
  //           onClick={togglePlay}
  //           className="flex items-center justify-center cursor-pointer text-white"
  //         >
  //           {isPlaying ? (
  //             <Pause size={26} color={accentColor} />
  //           ) : (
  //             <Play size={28} color={accentColor} />
  //           )}
  //         </motion.button>
  //         <SkipForward
  //           size={28}
  //           onClick={handleSkipForward}
  //           color={accentColor}
  //           className="cursor-pointer"
  //         />
  //         <Repeat size={20} color={accentColor} className="cursor-pointer" />
  //       </div>
  //       {/* Bottom Bar */}
  //       <div className="mt-6">
  //         <Download
  //           size={24}
  //           color={accentColor}
  //           onClick={handleDownload}
  //           className="cursor-pointer"
  //         />
  //       </div>
  //       {/* Toggle Arrow */}
  //       <div
  //         onClick={() => setShowSuggestions(!showSuggestions)}
  //         className="mt-8 cursor-pointer"
  //       >
  //         {showSuggestions ? (
  //           <ChevronDown size={28} color={accentColor} />
  //         ) : (
  //           <ChevronUp size={28} color={accentColor} />
  //         )}
  //       </div>
  //       {/* Suggestions Panel */}
  //       {artistId && <ArtistDetail artistId={artistId} />}
  //       <Suggestions
  //         setShowSuggestions={setShowSuggestions}
  //         showSuggestions={showSuggestions}
  //         suggestions={suggestions}
  //         bgColor={bgColor}
  //         accentColor={accentColor}
  //       />
  //     </div>
  //   );
  // }
}

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ColorThief from "color-thief-browser";
import {
  Heart,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Download,
  ChevronDown,
  ChevronUp,
  X,
  ArrowLeft,
  Search,
} from "lucide-react";
import { fetchSongSuggestions } from "@/actions/fetchingSongs";
import { motion } from "framer-motion";
import { useColorTheme } from "@/components/ColorThemeContext";
import Suggestions from "@/components/Suggestions";
import { usePlayerContext } from "../../context/PlayerContext";

export function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

function lighten(rgb, factor = 0.35) {
  return rgb.map((c) => Math.min(255, Math.floor(c + (255 - c) * factor)));
}
function darken(rgb, factor = 0.5) {
  return rgb.map((c) => Math.max(0, Math.floor(c * (1 - factor))));
}

export default function Player() {
  const params = useParams();
  const imgRef = useRef(null);
  const soundRef = useRef(null);
  const intervalRef = useRef(null);

  const router = useRouter();

  const { setColors } = useColorTheme();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [bgColor, setBgColor] = useState("#1e293b");
  const [accentColor, setAccentColor] = useState("#334155");
  const [currentIndex, setCurrentIndex] = useState(null);

  const [suggestions, setSuggestions] = useState([]);

  const { currentSong: song, isPlaying, togglePlay, howl } = usePlayerContext();

  // Load suggestions based on ID
  useEffect(() => {
    async function func() {
      if (!params.id) return;
      const results = await fetchSongSuggestions(params.id);
      setSuggestions(results);
      const current = results.findIndex(
        (s) => String(s.id) === String(params.id)
      );

      setCurrentIndex(current >= 0 ? current : null);
    }
    func();
  }, [params.id]);

  // Set up color extraction from image
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const handleLoad = () => {
      try {
        const color = new ColorThief().getColor(img);
        const dark = darken(color);
        const light = lighten(color);
        const bg = `rgb(${dark.join(",")})`;
        const accent = `rgb(${light.join(",")})`;

        // Avoid unnecessary state updates
        if (bg !== bgColor) setBgColor(bg);
        if (accent !== accentColor) setAccentColor(accent);
        setColors({ bgColor: bg, accentColor: accent });

        document.documentElement.style.setProperty("--bg-color", bg);
        document.documentElement.style.setProperty("--accent-color", accent);
      } catch (e) {
        console.error("ColorThief error", e);
      }
    };

    if (img.complete) handleLoad();
    else {
      img.addEventListener("load", handleLoad);
      return () => img.removeEventListener("load", handleLoad);
    }
  }, [song?.image?.[1]?.url]);

  // Handle playing
  useEffect(() => {
    if (!howl || !isPlaying) return;

    const id = setInterval(() => {
      setPosition(howl.seek());
      setDuration(howl.duration());
    }, 500);

    return () => clearInterval(id);
  }, [howl, isPlaying]);

  const handleSeek = (e) => {
    const value = parseFloat(e.target.value);
    if (howl) {
      howl.seek(value);
      setPosition(value);
    }
  };

  const handleSkipForward = () => {
    // if (suggestions.length === 0 || currentIndex === null) return;

    const nextIndex = (currentIndex + 1) % suggestions.length;
    const nextSong = suggestions[nextIndex];
    console.log('next',nextSong)
    router.push(`/${nextSong.id}`);
  };

  const handleSkipBack = () => {
    // if (suggestions.length === 0 || currentIndex === null) return;

    const prevIndex =
      (currentIndex - 1 + suggestions.length) % suggestions.length;
    const prevSong = suggestions[prevIndex];
    router.push(`/${prevSong.id}`);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = audioSrc;
    link.setAttribute("download", `${song?.name || "song"}.mp3`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // console.log(song)

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between text-white px-6 py-10 transition-colors duration-700"
      style={{
        background: `linear-gradient(to bottom, ${bgColor}, #111827)`,
      }}
    >
      <button
        onClick={() => router.push('/')}
        style={{ color: accentColor }}
        className="absolute top-6 left-6 z-10 bg-white/20 backdrop-blur p-2 rounded-full hover:scale-110 cursor-pointer transition-all"
      >
        <Search size={20} />
      </button>

      {/* Hidden image for ColorThief */}

      <img
        ref={imgRef}
        src={song?.image?.[1]?.url || "/placeholder.jpg"}
        alt="ColorThief Image"
        className="hidden"
        crossOrigin="anonymous"
      />

      {/* Cover */}

      <img
        src={song?.image?.[2]?.url || "/placeholder.jpg"}
        alt={song?.title || "Cover"}
        className="w-80 h-80 mt-14 rounded-xl object-cover shadow-lg"
      />

      {/* Title & Artist */}
      <div className="text-center mt-8">
        <h2 className="text-2xl font-extrabold mb-4">{song?.name}</h2>
        <div className="w-full flex justify-center">
          <div className="text-gray-300 text-sm flex flex-wrap gap-1 justify-center text-center">
            {song?.artists?.primary?.length > 0
              ? song.artists.primary.map((s, i, arr) => (
                  <span key={s.id} className="flex">
                    <p
                      onClick={() => router.push(`/artist/${s.id}`)}
                      className="cursor-pointer font-bold hover:scale-130 transition-all"
                    >
                      {s.name.trim()}
                    </p>
                    {i < arr.length - 1 && <span>,</span>}
                  </span>
                ))
              : "Unknown"}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full mt-4">
        <div className="flex justify-between text-sm text-gray-300 mb-1">
          <span className="font-bold">{formatTime(position)}</span>
          <span className="font-bold">{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          min="0"
          max={duration}
          value={position}
          step="0.5"
          onChange={handleSeek}
          className="w-full h-2 rounded-lg outline-none"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-8 mt-6">
        <Heart size={22} color={accentColor} className="cursor-pointer" />
        <SkipBack
          size={28}
          onClick={handleSkipBack}
          color={accentColor}
          className="cursor-pointer"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            borderRadius: isPlaying ? "12px" : "50%", // morph shape
            width: isPlaying ? "56px" : "56px", // w-16 vs w-14
            height: isPlaying ? "56px" : "56px", // h-10 vs h-14
            backgroundColor: isPlaying
              ? "rgba(255,255,255,0.3)"
              : "rgba(255,255,255,0.2)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={togglePlay}
          className="flex items-center justify-center cursor-pointer text-white"
        >
          {isPlaying ? (
            <Pause size={26} color={accentColor} />
          ) : (
            <Play size={28} color={accentColor} />
          )}
        </motion.button>

        <SkipForward
          size={28}
          onClick={handleSkipForward}
          color={accentColor}
          className="cursor-pointer"
        />
        <Repeat size={20} color={accentColor} className="cursor-pointer" />
      </div>

      {/* Bottom Bar */}
      <div className="mt-6">
        <Download
          size={24}
          color={accentColor}
          onClick={handleDownload}
          className="cursor-pointer"
        />
      </div>
      {/* Toggle Arrow */}
      <div
        onClick={() => setShowSuggestions(!showSuggestions)}
        className="mt-8 cursor-pointer"
      >
        {showSuggestions ? (
          <ChevronDown size={28} color={accentColor} />
        ) : (
          <ChevronUp size={28} color={accentColor} />
        )}
      </div>

      {/* Suggestions Panel */}

      <Suggestions
        setShowSuggestions={setShowSuggestions}
        showSuggestions={showSuggestions}
        suggestions={suggestions}
        bgColor={bgColor}
        accentColor={accentColor}
      />
    </div>
  );
}
