import { usePlayerContext } from "@/context/PlayerContext";
import { Pause, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useColorTheme } from "./ColorThemeContext";

export default function NowPlayingBar() {
  const { currentSong, isPlaying, togglePlay } = usePlayerContext();

  const router = useRouter()

  const { colors } = useColorTheme()
  
    
    const bgColor = colors?.bgColor || '#0f0f0f'
    const accentColor = colors?.accentColor || '#22c55e'

  if (!currentSong) return null;



  return (
    <div className={`fixed bottom-0 w-full  border-t-white p-4 left-0 text-white  cursor-pointer `}
    onClick={() => router.push(`/${currentSong.id}`)}
    style={{backgroundColor:bgColor}}
    >
      <div className="flex items-center justify-between">
        <div>
          <p 
           style={{color:accentColor}}
          className="font-semibold"
          
          >{currentSong.name}</p>
          <p className="text-sm text-gray-400"
          style={{color:accentColor}}
          >{currentSong?.artists?.primary?.map((artist) => artist.name).join(", ")}
</p>
        </div>
        <button onClick={(e)=>{
          e.stopPropagation();
          togglePlay()
        }}
          
        className="p-3 rounded-2xl transition-all bg-white/20 z-10"
        style={{color:accentColor}}
        >
          {isPlaying ? <Pause /> :  <Play />}
        </button>
      </div>
    </div>
  );
}
