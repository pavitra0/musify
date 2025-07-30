import { LoaderCircleIcon} from "lucide-react";

// app/movie/[id]/loading.js
export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <LoaderCircleIcon className="text-red-500 animate-spin w-16 h-16" />
    </div>
  );
}
