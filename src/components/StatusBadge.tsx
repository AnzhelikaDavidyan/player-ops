import type { PlayerStatus } from '../types/player'

export function StatusBadge({ status }: { status: PlayerStatus }) {
  return <span className={`badge badge-${status}`}>{status}</span>
}
