import { players } from '../data/players'
import type { PlayerStatus } from '../types/player'

const statuses: PlayerStatus[] = ['active', 'injured', 'inactive']

export function DashboardPage() {
  return (
    <>
      <h1>Dashboard</h1>
      <div className="stats">
        <div className="stat">
          <span className="stat-value">{players.length}</span>
          <span className="stat-label">Total players</span>
        </div>
        {statuses.map((status) => (
          <div className="stat" key={status}>
            <span className="stat-value">
              {players.filter((player) => player.status === status).length}
            </span>
            <span className="stat-label">{status}</span>
          </div>
        ))}
      </div>
    </>
  )
}
