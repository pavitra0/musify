import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get("artist");
  const title = searchParams.get("title");

  try {
    const response = await fetch(`https://dab.yeet.su/api/lyrics?artist=${artist}&title=${title}`);
    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch lyrics", details: error.message },
      { status: 500 }
    );
  }
}
