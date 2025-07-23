import Player from './Player';

export default async function SongDetailPage({ params }) {
  const { id } = params;

  const res = await fetch(`https://jiosavan-api2.vercel.app/api/songs/${id}`);
  if (!res.ok) {
    return <div className="text-white p-4">Failed to load song.</div>;
  }

  const song = await res.json();
 

  return <Player song={song?.data[0]} audioSrc={song?.data[0].downloadUrl[4].url} />;
}
