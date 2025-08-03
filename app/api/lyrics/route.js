// app/api/lyrics/route.js
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const artist = searchParams.get('artist');
  const title = searchParams.get('title');

  if (!artist || !title) {
    return NextResponse.json({ error: 'Missing artist or title' }, { status: 400 });
  }

  const apiUrl = `https://lrclib.net/api/get?artist_name=${encodeURIComponent(
    artist
  )}&track_name=${encodeURIComponent(title)}`;

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      return NextResponse.json({ error: 'Lyrics not found' }, { status: 404 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch lyrics' }, { status: 500 });
  }
}
