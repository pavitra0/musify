// For Next.js App Router

import { NextResponse } from 'next/server';

export async function GET(req) {
  const url = new URL(req.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'Missing download URL' }, { status: 400 });
  }

  const res = await fetch(targetUrl);
  const buffer = await res.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'attachment',
    },
  });
}
