export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const artist = searchParams.get("artist");
  const title = searchParams.get("title");

  const res = await fetch(`https://dab.yeet.su/api/lyrics?artist=${artist}&title=${title}`);
  const data = await res.json();

  return Response.json(data);
}
