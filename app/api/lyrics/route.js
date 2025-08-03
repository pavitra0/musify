// /api/lyrics.js (on Vercel or Netlify)
export default async function handler(req, res) {
  const { artist, title } = req.query;
  const response = await fetch(
    `https://dab.yeet.su/api/lyrics?artist=${artist}&title=${title}`
  );
  const data = await response.json();
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json(data);
}
