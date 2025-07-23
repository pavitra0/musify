import React from 'react';

export default function SearchResults({ data }) {
  console.log(data)
  if (!data ) return <p>No results found.</p>;

  const { songs, albums, artists, playlists } = data;

  console.log(songs, albums, artists, playlists)

  const renderImages = (images) => (
    <img
      src={images?.find((img) => img.quality === '150x150')?.url}
      alt="cover"
      className="w-16 h-16 object-cover rounded"
    />
  );

  return (
    <div className="space-y-6">
      {/* 🎵 Songs */}
      {songs?.results?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-2">Songs</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {songs.results.map((song) => (
              <li key={song.id} className="flex gap-4 items-center p-2 bg-gray-800 rounded">
                {renderImages(song.image)}
                <div>
                  <a href={`search/${song.id}`}   rel="noreferrer" className="text-lg font-medium text-green-400 ">
                    {song.title}
                  </a>
                  <p className="text-sm text-gray-400">{song.primaryArtists}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 💿 Albums */}
      {albums?.results?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-2">Albums</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {albums.results.map((album) => (
              <li key={album.id} className="flex gap-4 items-center p-2 bg-gray-800 rounded">
                {renderImages(album.image)}
                <div>
                  <a href={album.url} target="_blank" rel="noreferrer" className="text-lg font-medium text-green-400 hover:underline">
                    {album.title}
                  </a>
                  <p className="text-sm text-gray-400">{album.artist}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 🧑‍🎤 Artists */}
      {artists?.results?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-2">Artists</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {artists.results.map((artist) => (
              <li key={artist.id} className="flex gap-4 items-center p-2 bg-gray-800 rounded">
                {renderImages(artist.image)}
                <div>
                  <span className="text-lg font-medium text-white">{artist.title}</span>
                  <p className="text-sm text-gray-400">{artist.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 🎧 Playlists (if any) */}
      {playlists?.results?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-2">Playlists</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {playlists.results.map((playlist) => (
              <li key={playlist.id} className="flex gap-4 items-center p-2 bg-gray-800 rounded">
                {renderImages(playlist.image)}
                <div>
                  <span className="text-lg font-medium text-white">{playlist.title}</span>
                  <p className="text-sm text-gray-400">{playlist.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
