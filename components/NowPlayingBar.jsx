import { usePlayerContext } from "@/context/PlayerContext";
import { Pause, Play, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useColorTheme } from "./ColorThemeContext";

export default function NowPlayingBar() {
  const { currentSong, isPlaying, togglePlay, stopSong } = usePlayerContext();

  const router = useRouter();

  const { colors } = useColorTheme();

  const bgColor = colors?.bgColor || "#0f0f0f";
  const accentColor = colors?.accentColor || "#22c55e";

  if (!currentSong) return null;

  return (
    <div
      className={`fixed bottom-0 w-full border-t border-white/10 p-3 left-0 text-white cursor-pointer z-50`}
      onClick={() => router.push(`/song/${currentSong.id}`)}
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Song Image */}
          <div className="w-12 h-12 rounded-md overflow-hidden shrink-0">
            <img
              src={currentSong.image?.[1]?.url || currentSong.image?.[0]?.url || "/placeholder.jpg"}
              alt={currentSong.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <p style={{ color: accentColor }} className="font-bold text-sm truncate">
              {currentSong.name}
            </p>
            <div className="w-full flex justify-start">
              <div className="text-gray-300 text-xs flex flex-wrap gap-1 justify-start text-center">
                {currentSong?.artists?.primary?.length > 0
                  ? currentSong.artists.primary.slice(0, 4).map((s, i, arr) => (
                      <span key={s.id} className="flex">
                        <p
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/artist/${s.id}`);
                          }}
                          className="cursor-pointer font-bold hover:underline"
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
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="p-2.5 rounded-full transition-all bg-white/20 hover:bg-white/30 z-10 shrink-0"
            style={{ color: accentColor }}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              stopSong();
            }}
            className="p-2.5 rounded-full transition-all bg-white/10 hover:bg-white/20 text-white/80 hover:text-white z-10 shrink-0"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
