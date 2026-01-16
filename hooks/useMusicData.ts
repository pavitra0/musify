import { useMemo } from "react";

export interface Artist {
  id: string;
  name: string;
}

export interface Track {
  id: string;
  title: string;
  artists: Artist[];
  duration: number; // seconds
  coverUrl: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  coverUrl: string;
  type: "album" | "playlist" | "liked";
  artists?: Artist[];
}

interface UseMusicDataResult {
  likedSongs: Track[];
  trending: Track[];
  latestSongs: Track[];
  albums: Collection[];
  playlists: Collection[];
}

// Mock data for now – can be swapped with API calls later
const mockArtists: Artist[] = [
  { id: "a1", name: "Yorushika" },
  { id: "a2", name: "Kim Feel" },
  { id: "a3", name: "Keshi" },
  { id: "a4", name: "IU" }
];

const mockTracks: Track[] = [
  {
    id: "t1",
    title: "Algernon",
    artists: [mockArtists[0]],
    duration: 204,
    coverUrl: "/placeholder.jpg"
  },
  {
    id: "t2",
    title: "Sleeplessness",
    artists: [mockArtists[1]],
    duration: 231,
    coverUrl: "/placeholder.jpg"
  },
  {
    id: "t3",
    title: "Setting Sun",
    artists: [mockArtists[0]],
    duration: 248,
    coverUrl: "/placeholder.jpg"
  },
  {
    id: "t4",
    title: "Midnight Drive",
    artists: [mockArtists[2]],
    duration: 198,
    coverUrl: "/placeholder.jpg"
  },
  {
    id: "t5",
    title: "Echoes",
    artists: [mockArtists[3]],
    duration: 214,
    coverUrl: "/placeholder.jpg"
  }
];

const mockAlbums: Collection[] = [
  {
    id: "alb1",
    name: "Night City Lights",
    description: "Lo-fi vibes for late night coding.",
    coverUrl: "/placeholder.jpg",
    type: "album",
    artists: [mockArtists[2]]
  },
  {
    id: "alb2",
    name: "Soft Horizons",
    description: "Warm, gentle indie tracks.",
    coverUrl: "/placeholder.jpg",
    type: "album",
    artists: [mockArtists[0]]
  },
  {
    id: "alb3",
    name: "Neon Skies",
    description: "Future bass & chill electronic.",
    coverUrl: "/placeholder.jpg",
    type: "album",
    artists: [mockArtists[1]]
  }
];

const mockPlaylists: Collection[] = [
  {
    id: "pl1",
    name: "Focus Flow",
    description: "Deep focus beats.",
    coverUrl: "/placeholder.jpg",
    type: "playlist"
  },
  {
    id: "pl2",
    name: "Weekend Drive",
    description: "Feel-good tracks for the road.",
    coverUrl: "/placeholder.jpg",
    type: "playlist"
  },
  {
    id: "pl3",
    name: "Late Night Coding",
    description: "Ambient, instrumental, and lo-fi.",
    coverUrl: "/placeholder.jpg",
    type: "playlist"
  }
];

export function useMusicData(): UseMusicDataResult {
  // In the future this could fetch from an API and memoize transformed data.
  return useMemo(
    () => ({
      likedSongs: mockTracks.slice(0, 3),
      trending: mockTracks,
      latestSongs: mockTracks.slice().reverse(),
      albums: mockAlbums,
      playlists: mockPlaylists
    }),
    []
  );
}


