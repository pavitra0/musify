// lib/actions/songActions.js

export async function fetchSongSuggestions(id) {
  if (!id || id.trim() === "") return [];

  try {
    const res = await fetch(
      `https://jiosavan-api2.vercel.app/api/songs/${id}/suggestions`
    );

    if (!res.ok) throw new Error("Failed to fetch suggestions");

    const data = await res.json();
    return data?.data

  } catch (error) {
    console.error("Suggestion Fetch Error:", error.message);
    return [];
  }
}


