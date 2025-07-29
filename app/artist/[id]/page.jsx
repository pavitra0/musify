import { fetchArtist, fetchArtistSongs } from "@/actions/fetchartist"
import ArtistDetails from "./ArtistDetails"


async function ArtistDetailsPage({params}) {
  const {id} = params

const artistDetails = await fetchArtist(id)
const artistSongs = await fetchArtistSongs(id)
  return (
    <ArtistDetails artistDetails={artistDetails} songs={artistSongs} />
  )
}

export default ArtistDetailsPage