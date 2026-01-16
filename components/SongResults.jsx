"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Music2 } from "lucide-react";

export default function SearchResults({ data = [], isLoading = false }) {
  const router = useRouter();

  if (!Array.isArray(data)) {
    console.warn("SearchResults expects an array, but got:", data);
    return null;
  }

  if (isLoading) {
    return (
      <div className="bg-neutral-900/95 backdrop-blur-xl rounded-xl border border-neutral-700/50 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="bg-neutral-900/95 backdrop-blur-xl rounded-xl border border-neutral-700/50 shadow-2xl overflow-hidden">
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <Music2 className="w-12 h-12 text-neutral-500 mb-3" />
          <p className="text-neutral-400 text-sm">No results found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900/95 backdrop-blur-xl rounded-xl border border-neutral-700/50 shadow-2xl overflow-hidden">
      <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
        <div className="p-2 space-y-1">
          {data.map((item, index) => (
            <div
              key={item.id || index}
              onClick={() => router.push(`/song/${item.id}`)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-800/80 hover:border-neutral-700 cursor-pointer transition-all duration-200 group border border-transparent"
            >
              <div className="relative flex-shrink-0">
                <img
                  src={item.image?.[1]?.url || item.image?.[0]?.url || ""}
                  alt={item.name || "Song cover"}
                  className="w-14 h-14 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23333' width='100' height='100'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='50' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3E♫%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="flex flex-col justify-center flex-1 min-w-0">
                <p
                  className="text-white font-medium text-sm truncate group-hover:text-purple-300 transition-colors"
                  title={item.name}
                >
                  {item.name}
                </p>
                <p
                  className="text-xs text-neutral-400 truncate mt-0.5 group-hover:text-neutral-300 transition-colors"
                  title={item.artists?.primary?.map((artist) => artist.name).join(", ") || "Unknown Artist"}
                >
                  {item.artists?.primary
                    ?.map((artist) => artist.name)
                    .join(", ") || "Unknown Artist"}
                </p>
              </div>
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
      {data.length >= 20 && (
        <div className="px-4 py-3 border-t border-neutral-700/50 bg-neutral-800/30">
          <p className="text-xs text-neutral-400 text-center">
            Showing top {data.length} results
          </p>
        </div>
      )}
    </div>
  );
}
