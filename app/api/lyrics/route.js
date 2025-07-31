export const config = {
  runtime: "nodejs",
  regions: ["iad1"],
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const artist = searchParams.get("artist");
    const title = searchParams.get("title");

    if (!artist || !title) {
      return Response.json({ error: "Missing artist or title" }, { status: 400 });
    }

    const externalUrl = `https://dab.yeet.su/api/lyrics?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(title)}`;

    const res = await fetch(externalUrl, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://musify-blue-xi.vercel.app",
      },
    });

    if (!res.ok) {
      return Response.json({ error: `Lyrics not found`, status: res.status }, { status: res.status });
    }

    const text = await res.text();
    const data = JSON.parse(text);
    return Response.json(data);
  } catch (error) {
    console.error("Lyrics fetch failed:", error);
    return Response.json({ error: "Server error while fetching lyrics" }, { status: 500 });
  }
}
