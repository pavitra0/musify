"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function SearchResults({ data = [] }) {
  const router = useRouter();

  if (!Array.isArray(data)) {
    console.warn("SearchResults expects an array, but got:", data);
    return <p className="text-gray-400 mt-8">No results found.</p>;
  }


if(!data.length) return null
  

  return (
    <div className="absolute left-0 right-0 mt-2 bg-black rounded-md border border-neutral-700 max-h-[400px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 p-2 z-50 shadow-lg w-full max-w-xl mx-auto">
      {data.map((item) => (
        <div
          key={item.id}
          onClick={() => router.push(`/song/${item.id}`)}
          className="flex items-center gap-3 p-4 hover:bg-[#1c1c1c] rounded cursor-pointer transition h-16"
        >
          <img
            src={item.image?.[1]?.url || item.image?.[0]?.url || ""}
            alt="cover"
            className="w-12 h-12 object-cover rounded-md flex-shrink-0"
          />
          <div className="flex flex-col justify-center w-full overflow-hidden">
            <p
              className="text-white font-medium truncate"
              title={item.name}
            >
              {item.name}
            </p>
            <p
              className="text-sm text-gray-400 truncate"
              title={item.artists?.primary?.map((artist) => artist.name).join(", ")}
            >
              {item.artists?.primary
                ?.map((artist) => artist.name)
                .join(", ")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
