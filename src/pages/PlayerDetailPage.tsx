import { Link, useParams } from 'react-router'
import { StatusBadge } from '../components/StatusBadge'
import { getPlayer } from '../data/players'
import { NotFoundPage } from './NotFoundPage'

export function PlayerDetailPage() {
  const { playerId = '' } = useParams()
  const player = getPlayer(playerId)

  if (!player) return <NotFoundPage />

  return (
    <>
      <Link to="/players">← Back to players</Link>
      <h1>
        #{player.number} {player.name}
      </h1>
      <dl className="details">
        <dt>Position</dt>
        <dd>{player.position}</dd>
        <dt>Status</dt>
        <dd>
          <StatusBadge status={player.status} />
        </dd>
      </dl>
    </>
  )
}
