'use client'

import React from 'react'
import { Play } from 'lucide-react'
import { usePlayerContext } from '../context/PlayerContext'
import { useRouter } from 'next/navigation'

const SongItem = ({ song }) => {
  const { playTrack } = usePlayerContext()

const router = useRouter()


  return (
    <div
      className="flex items-center justify-between py-3 px-4 bg-white/5 hover:bg-white/10 transition rounded-lg mb-3 cursor-pointer"
    
    >
      <div onClick={() => router.push(`/${song.id}`)} className="flex items-center gap-4" >
        <img
          src={song.image[0].url || '/placeholder.jpg'}
          alt={song.name}
          className="w-12 h-12 object-cover rounded"
        />
        <div>
          <p className="text-sm font-semibold text-white truncate w-[280px]">
            {song.name}
          </p>
         {song.playCount && <p className="text-xs text-gray-400">
            {song.playCount} times played.
          </p>}
        </div>
      </div>
      
    </div>
  )
}

export default SongItem
