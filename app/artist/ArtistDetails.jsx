import React from 'react'

function ArtistDetails({artist}) {
  return (
    <div>{artist?.name || ''}</div>
  )
}

export default ArtistDetails