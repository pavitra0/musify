// // app/songs/[id]/page.jsx

// "use client";

// import { use, useEffect, useState } from "react";
// import { usePlayerContext } from "@/context/PlayerContext";
// import Player from "./Player";
// import { fetchSongSuggestions } from "@/actions/fetchingSongs";
// import { fetchArtist } from "@/actions/fetchartist";

// export default function SongDetailPage({ params }) {
//   const { id } = use(params);
//   const { playSong, currentSong } = usePlayerContext();
//   const [lyrics, setLyrics] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [artistSongs, setArtistSongs] = useState([])

//   useEffect(() => {
//     if (currentSong?.id && String(currentSong.id) === String(id)) {
//       setLoading(false);
//       return;
//     }

//     async function fetchSong() {
//       try {
//         setLoading(true);

//         // Fetch song details
//         const res = await fetch(
//           `https://jiosavan-api2.vercel.app/api/songs/${id}`
//         );
//         const data = await res.json();
//         const song = data?.data[0];
//         console.log(song, 'from page player')

//         if (!song) {
//           console.error("Song not found");
//           return;
//         }

//         // Format song with audioSrc
//         const formattedSong = {
//           ...song,
//           audioSrc: song.downloadUrl[4]?.url,
//         };

//         // Fetch suggestions for playlist
//         const suggestions = await fetchSongSuggestions(id);
//         const ArtistSongs = await fetchArtist(song.artists.primary[0].id)

//         const formattedSuggestions = suggestions.map((s) => ({
//           ...s,
//           audioSrc: s.downloadUrl?.[4]?.url,
//         }));
//         const formattedArtistSongs = ArtistSongs.topSongs.map((s) => ({
//           ...s,
//           audioSrc: s.downloadUrl?.[4]?.url,
//         }));
//         setArtistSongs(formattedArtistSongs)

//         // Find current song index in suggestions
//         const currentIndex = formattedSuggestions.findIndex(
//           (s) => String(s.id) === String(id)
//         );

//         // If current song is in suggestions, use suggestions as playlist
//         // Otherwise, use current song + suggestions
//         const playlist = currentIndex >= 0 
//           ? formattedSuggestions 
//           : [formattedSong, ...formattedSuggestions];
//         const songIndex = currentIndex >= 0 ? currentIndex : 0;

//         // Start playing with playlist
//         playSong(formattedSong, playlist, songIndex);

//         // Lyrics fetch in background (non-blocking)
//         fetch(
//           `/api/lyrics?artist=${encodeURIComponent(
//             song?.artists?.primary[0]?.name
//           )}&title=${encodeURIComponent(song?.name)}`
//         )
//           .then((res) => res.json())
//           .then((lyricsData) => {
//             setLyrics(lyricsData);
//           })
//           .catch((err) => {
//             console.warn("Lyrics fetch failed:", err);
//           });
//       } catch (error) {
//         console.error("Error fetching song:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchSong();
//   }, [id, currentSong?.id]);

//   return <Player lyrics={lyrics} artistSongs={artistSongs}/>;
// }

"use client";

import { use, useEffect, useState } from "react";
import { usePlayerContext } from "@/context/PlayerContext";
import Player from "./Player";
import { fetchSongSuggestions } from "@/actions/fetchingSongs";
import { fetchArtist } from "@/actions/fetchartist";

export default function SongDetailPage({ params }) {
  const { id } = use(params);
  const { playSong, currentSong } = usePlayerContext();

  const [lyrics, setLyrics] = useState({});
  const [artistSongs, setArtistSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentSong?.id && String(currentSong.id) === String(id)) {
      setLoading(false);
      return;
    }

    async function fetchSong() {
      try {
        setLoading(true);

        // 1️⃣ Fetch song details
        const res = await fetch(
          `https://jiosavan-api2.vercel.app/api/songs/${id}`
        );
        const data = await res.json();
        const song = data?.data?.[0];

        if (!song) return;

        const formattedSong = {
          ...song,
          audioSrc: song.downloadUrl?.[4]?.url,
        };

        // 2️⃣ Fetch suggestions
        let playlist = [];
        let songIndex = 0;

        const suggestions = await fetchSongSuggestions(id);
        const formattedSuggestions = Array.isArray(suggestions)
          ? suggestions.map((s) => ({
              ...s,
              audioSrc: s.downloadUrl?.[4]?.url,
            }))
          : [];

        // 3️⃣ Fallback: artist songs
        let formattedArtistSongs = [];
        if (formattedSuggestions.length === 0) {
          const artistData = await fetchArtist(
            song.artists.primary[0].id
          );

          formattedArtistSongs = artistData?.topSongs?.map((s) => ({
            ...s,
            audioSrc: s.downloadUrl?.[4]?.url,
          })) || [];

          setArtistSongs(formattedArtistSongs);
          playlist = formattedArtistSongs;
        } else {
          playlist = formattedSuggestions;
        }

        // 4️⃣ Ensure current song is in playlist
        const indexInPlaylist = playlist.findIndex(
          (s) => String(s.id) === String(id)
        );

        if (indexInPlaylist === -1) {
          playlist.unshift(formattedSong);
          songIndex = 0;
        } else {
          songIndex = indexInPlaylist;
        }

        // 5️⃣ Play
        playSong(formattedSong, playlist, songIndex);

        // 6️⃣ Fetch lyrics (non-blocking)
        fetch(
          `/api/lyrics?artist=${encodeURIComponent(
            song.artists.primary[0].name
          )}&title=${encodeURIComponent(song.name)}`
        )
          .then((res) => res.json())
          .then(setLyrics)
          .catch(() => {});
      } catch (err) {
        console.error("Error fetching song:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSong();
  }, [id, currentSong?.id]);

  return <Player lyrics={lyrics} ArtistSongs={artistSongs} />;
}
