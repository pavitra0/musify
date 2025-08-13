import { fetchArtist, fetchArtistSongs } from "@/actions/fetchartist"
import ArtistDetails from "./ArtistDetails"


async function ArtistDetailsPage({params}) {
  const {id} = params

const artistDetails = await fetchArtist(id)


  return (
    <ArtistDetails artistDetails={artistDetails}  />
  )
}

export default ArtistDetailsPage