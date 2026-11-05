import { Link, useLocation } from 'react-router'
import type { Player } from '@/types'

interface PlayerLinkProps {
  player: Player
}

/** The whole row opens the profile; this link keeps it keyboard reachable. */
export function PlayerLink({ player }: PlayerLinkProps) {
  const { search } = useLocation()
  return (
    <Link
      to={`/players/${player.id}`}
      state={{ listSearch: search }}
      onClick={(e) => e.stopPropagation()}
    >
      {player.username}
    </Link>
  )
}
