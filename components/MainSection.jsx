"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  fetchplaylistsByID,
  searchAlbumByQuery,
  searchPlayListByQuery,
} from "../actions/fetchingSongs";
import { useColorTheme } from "./ColorThemeContext";
import { useRouter } from "next/navigation";
import { LoaderCircle, ChevronRight, ChevronLeft } from "lucide-react";

function MainSection() {
  const [trending, setTrending] = useState([]);
  const [latestSongs, setLatestSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likedSongs, setLikedSongs] = useState([]);
  const [recentSongs, setRecentSongs] = useState([]);

  const router = useRouter();
  const { colors } = useColorTheme();
  const bgColor = colors?.bgColor || "#0f0f0f";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = JSON.parse(localStorage.getItem("likedSongs")) || [];
      setLikedSongs(stored);

      const recent = JSON.parse(localStorage.getItem("recentSongs")) || [];
      setRecentSongs(recent);
    }
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [songData, latestData, albumData, playlistData] =
          await Promise.all([
            fetchplaylistsByID(82914609),
            fetchplaylistsByID(110858205),
            searchAlbumByQuery("japanese"),
            searchPlayListByQuery("english"),
          ]);

        setTrending(songData.data.songs);
        setLatestSongs(latestData.data.songs);
        setAlbums(albumData.data.results);
        setPlaylists(playlistData.data.results);
      } catch (err) {
        console.error("Data fetching error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const albumMap = useMemo(() => new Map(albums.map((a) => [a.id, a])), [albums]);
  const playlistMap = useMemo(
    () => new Map(playlists.map((p) => [p.id, p])),
    [playlists]
  );

  async function handleClick(type, id) {
    if (type === "song") router.push(`/song/${id}`);
    if (type === "album") {
      const album = albumMap.get(id);
      if (album) router.push(`/album/${album.id}`);
    }
    if (type === "playlist") {
      const playlist = playlistMap.get(id);
      if (playlist) router.push(`/playlist/${playlist.id}`);
    }
  }

  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  const SectionHeader = ({ title, actionLabel, onAction }) => (
    <div className="flex items-baseline justify-between">
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      {actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="text-sm text-gray-300 hover:text-white transition"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );

  const SectionRail = ({ title, items, type, showDivider = true }) => {
  const railRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  if (!items?.length) return null;

  const updateCanScroll = () => {
    const el = railRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 4);

    const remaining = el.scrollWidth - el.clientWidth - el.scrollLeft;
    setCanScrollRight(remaining > 4);
  };

  const scrollByAmount = (dir) => {
    const el = railRef.current;
    if (!el) return;

    const delta = Math.max(240, Math.floor(el.clientWidth * 0.8));
    el.scrollBy({ left: dir === "right" ? delta : -delta, behavior: "smooth" });
  };

  useEffect(() => {
    updateCanScroll();

    const el = railRef.current;
    if (!el) return;

    const onScroll = () => updateCanScroll();
    el.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => updateCanScroll();
    window.addEventListener("resize", onResize);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [items]);

  return (
    <section className="space-y-3">
      <SectionHeader title={title} />

      <div className="relative overflow-visible">
        {canScrollLeft && (
          <div className="pointer-events-none absolute -left-2 top-0 h-full w-20 bg-gradient-to-r from-black/70 to-transparent rounded-xl z-[1]" />
        )}

        {canScrollRight && (
          <div className="pointer-events-none absolute -right-2 top-0 h-full w-20 bg-gradient-to-l from-black/70 to-transparent rounded-xl z-[1]" />
        )}

        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollByAmount("left")}
            aria-label={`Scroll ${title} left`}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-[2] rounded-full border border-white/10 bg-black/60 backdrop-blur-md p-2 hover:bg-black/80 transition"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollByAmount("right")}
            aria-label={`Scroll ${title} right`}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-[2] rounded-full border border-white/10 bg-black/60 backdrop-blur-md p-2 hover:bg-black/80 transition"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        <div
          ref={railRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
        >
          {items.map((item, i) => {
            const image =
              item.image?.[1]?.url || item.image?.[0]?.url || "/placeholder.jpg";

            const name = item.name || item.title;
            const artistNames = item.artists?.primary
              ?.map((artist) => artist.name)
              .join(", ");

            const duration = item.duration
              ? `${Math.floor(item.duration / 60)}:${(item.duration % 60)
                  .toString()
                  .padStart(2, "0")}`
              : null;

            return (
              <button
                key={item.id || i}
                type="button"
                onClick={() => handleClick(type, item.id)}
                className="shrink-0 text-left relative w-36 sm:w-40 md:w-48 bg-neutral-900/60 backdrop-blur-md border border-white/10 rounded-xl hover:scale-105 hover:bg-neutral-900/40 transition-all duration-300 p-3 shadow-lg"
              >
                <div className="relative group">
                  <img
                    src={image}
                    alt={name}
                    className="w-full aspect-square rounded-md object-cover"
                  />

                  {duration && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition">
                      {duration}
                    </div>
                  )}
                </div>

                <div className="mt-2 min-h-[44px]">
                  <p className="text-sm font-semibold truncate">{name}</p>
                  {artistNames && (
                    <p className="text-xs text-gray-400 truncate">
                      {artistNames}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {showDivider && <hr className="border-white/10" />}
    </section>
  );
};

  const LikedSongsSection = ({ items }) => {
    if (!items?.length) return null;
    const top3 = items.slice(0, 3);

    return (
      <section className="space-y-3">
        <SectionHeader
          title="Liked Songs ❤️"
          actionLabel="See all →"
          onAction={() => router.push("/liked")}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => router.push("/liked")}
            className="text-left bg-neutral-900/60 backdrop-blur-md border border-white/10 rounded-xl p-5 shadow-lg hover:bg-neutral-900/40 transition"
          >
            <div className="text-sm text-gray-300">♥ Liked Songs</div>
            <div className="mt-3 text-2xl font-bold">{items.length} Tracks</div>
          </button>

          <div className="md:col-span-2 bg-neutral-900/40 border border-white/10 rounded-xl p-4">
            <ol className="space-y-2">
              {top3.map((song, idx) => {
                const name = song.name || song.title || "Untitled";
                const artistNames = song.artists?.primary
                  ?.map((artist) => artist.name)
                  .join(", ");

                return (
                  <li key={song.id || idx}>
                    <button
                      type="button"
                      onClick={() => handleClick("song", song.id)}
                      className="w-full text-left flex items-center justify-between gap-3 py-2 px-2 rounded-lg hover:bg-white/5 transition"
                    >
                      <div className="min-w-0 truncate">
                        <span className="text-sm font-semibold">
                          {idx + 1}. {name}
                        </span>
                        {artistNames ? (
                          <span className="text-sm text-gray-400">
                            {" "}
                            - {artistNames}
                          </span>
                        ) : null}
                      </div>
                      <span className="text-gray-500">…</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <hr className="border-white/10" />
      </section>
    );
  };

  const LatestSongsSection = ({ items }) => {
    if (!items?.length) return null;

    return (
      <section className="space-y-3">
        <SectionHeader title="Latest Songs" />

        <div className="bg-neutral-900/40 border border-white/10 rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 gap-3 px-4 py-3 text-xs text-gray-400 border-b border-white/10">
            <div className="col-span-5">Song Name</div>
            <div className="col-span-5">Artist Name</div>
            <div className="col-span-1 text-right">Time</div>
            <div className="col-span-1 text-right">…</div>
          </div>

          <ul>
            {items.slice(0, 8).map((song, i) => {
              const name = song.name || song.title || "Untitled";
              const artistNames = song.artists?.primary
                ?.map((artist) => artist.name)
                .join(", ");

              const duration = song.duration
                ? `${Math.floor(song.duration / 60)}:${(song.duration % 60)
                    .toString()
                    .padStart(2, "0")}`
                : "--:--";

              return (
                <li
                  key={song.id || i}
                  className="border-b border-white/5 last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => handleClick("song", song.id)}
                    className="w-full grid grid-cols-12 gap-3 px-4 py-3 text-left hover:bg-white/5 transition"
                  >
                    <div className="col-span-5 truncate text-sm font-medium">
                      {name}
                    </div>
                    <div className="col-span-5 truncate text-sm text-gray-400">
                      {artistNames || "Unknown"}
                    </div>
                    <div className="col-span-1 text-right text-sm text-gray-300">
                      {duration}
                    </div>
                    <div className="col-span-1 text-right text-gray-500">…</div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <hr className="border-white/10" />
      </section>
    );
  };

  useEffect(() => {
    if (
      trending?.length > 0 ||
      latestSongs?.length > 0 ||
      albums?.length > 0 ||
      playlists?.length > 0 ||
      likedSongs?.length >= 0 ||
      recentSongs?.length >= 0
    ) {
      setLoading(false);
    }
  }, [likedSongs, trending, latestSongs, albums, playlists, recentSongs]);

  if (loading) {
    return (
      <main className="flex justify-center items-center h-screen text-white">
        <LoaderCircle className="animate-spin h-10 w-10" />
      </main>
    );
  }

  return (
    <main className="text-white py-6 space-y-10">
      {Array.isArray(recentSongs) && recentSongs.length > 0 && (
        <SectionRail
          title="Continue Listening"
          items={recentSongs.slice(0, 12)}
          type="song"
        />
      )}

      <LikedSongsSection items={likedSongs} />

      <SectionRail
        title="Recommended For You"
        items={trending}
        type="song"
      />

      <LatestSongsSection items={latestSongs} />

      <SectionRail title="Albums" items={albums} type="album" />
      <SectionRail
        title="Playlists"
        items={playlists}
        type="playlist"
        showDivider={false}
      />
    </main>
  );
}

export default MainSection;
