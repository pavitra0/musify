export async function fetchArtist(id) {
  try {
    const res = await fetch(`https://jiosavan-api2.vercel.app/api/artists/${id}?songCount=50`);
    if (!res.ok) throw new Error("Failed to fetch artist");

    const data = await res.json();
    return data?.data;
  } catch (error) {
    console.error("Artist Fetch Error:", error.message);
    return null;
  }
}

export async function fetchArtistSongs(id) {
  try {
    const res = await fetch(`https://jiosavan-api2.vercel.app/api/artists/${id}`);
    if (!res.ok) throw new Error("Failed to fetch artist songs");

    const data = await res.json();
  
    return data?.data;
  } catch (error) {
    console.error("Artist Songs Fetch Error:", error.message);
    return [];
  }
}
