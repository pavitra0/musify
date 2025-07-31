export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const artist = searchParams.get("artist");
    const title = searchParams.get("title");

    if (!artist || !title) {
      return Response.json(
        { error: "Missing artist or title" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `https://dab.yeet.su/api/lyrics?artist=${artist}&title=${title}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      console.error(
        "Failed to fetch from external API:",
        res.status,
        res.statusText
      );
      return Response.json(
        { error: "Lyrics not found" },
        { status: res.status }
      );
    }

    const text = await res.text();
    try {
      const data = JSON.parse(text);
      return Response.json(data);
    } catch (jsonError) {
      console.error("Invalid JSON from lyrics API:", text);
      return Response.json(
        { error: "Invalid response from lyrics provider" },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("Internal error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
