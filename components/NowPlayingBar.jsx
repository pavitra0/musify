import { ChevronLeft, ChevronRight, Play } from "lucide-react";

export default function NowPlayingBar({ track }) {
  if (!track) return null;
  return (
    <div className="fixed left-0 right-0 bottom-0 bg-gray-800 border-t border-gray-700 px-6 py-3 flex items-center justify-between z-20">
      <div className="flex items-center gap-3">
        <img
          src={track.image}
          alt={track.title}
          className="w-10 h-10 rounded"
        />
        <div>
          <div className="font-semibold">{track.title}</div>
          <div className="text-xs text-gray-400">{track.artist}</div>
        </div>
      </div>
      {/* Media controls can be added here */}
      <div className="flex gap-2">
        <button>
          <ChevronLeft />
        </button>
        <button>
          <Play />
        </button>
        <button>
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
