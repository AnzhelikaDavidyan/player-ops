import { Link, useNavigate } from 'react-router'
import { formatDate, formatEur } from '@/shared/lib/format'
import { RiskBar } from '@/shared/ui/RiskBar'
import { StatusPill } from '@/shared/ui/StatusPill'
import { VipChip } from '@/shared/ui/VipChip'
import type { Player } from '@/types'
import type { PlayerSortKey, PlayersQuery } from '../api/playersApi'
import styles from './PlayersTable.module.scss'

interface Column {
  label: string
  /** Server field to sort by; VIP has none because tiers do not sort alphabetically. */
  sort?: PlayerSortKey
  align?: 'right'
}

const COLUMNS: Column[] = [
  { label: 'Player', sort: 'username' },
  { label: 'Status', sort: 'status' },
  { label: 'Country', sort: 'country' },
  { label: 'VIP' },
  { label: 'Balance', sort: 'balance', align: 'right' },
  { label: 'Risk', sort: 'riskScore' },
  { label: 'Registered', sort: 'registeredAt' },
]

// Numbers and dates are most useful biggest/newest first.
const DESC_FIRST: PlayerSortKey[] = ['balance', 'riskScore', 'registeredAt']

interface PlayersTableProps {
  players: Player[]
  sort: PlayersQuery['sort']
  order: PlayersQuery['order']
  onSort: (patch: Pick<PlayersQuery, 'sort' | 'order'>) => void
  /** True while a newer page is loading; the current rows stay visible but dimmed. */
  stale: boolean
}

export function PlayersTable({
  players,
  sort,
  order,
  onSort,
  stale,
}: PlayersTableProps) {
  const navigate = useNavigate()

  const toggleSort = (key: PlayerSortKey) => {
    if (key === sort) onSort({ sort, order: order === 'asc' ? 'desc' : 'asc' })
    else onSort({ sort: key, order: DESC_FIRST.includes(key) ? 'desc' : 'asc' })
  }

  return (
    <div className={styles.wrap}>
      <table className={styles.table} aria-busy={stale} data-stale={stale}>
        <thead>
          <tr>
            {COLUMNS.map((col) => {
              const active = col.sort === sort
              return (
                <th
                  key={col.label}
                  scope="col"
                  className={col.align === 'right' ? styles.right : undefined}
                  aria-sort={
                    active
                      ? order === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                >
                  {col.sort ? (
                    <button type="button" onClick={() => toggleSort(col.sort!)}>
                      {col.label}
                      {active && (
                        <span aria-hidden="true">
                          {order === 'asc' ? ' ↑' : ' ↓'}
                        </span>
                      )}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {players.map((p) => (
            // The whole row opens the profile; the username link keeps it keyboard reachable.
            <tr key={p.id} onClick={() => navigate(`/players/${p.id}`)}>
              <td>
                <span className={styles.who}>
                  <Link
                    to={`/players/${p.id}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {p.username}
                  </Link>
                  <small className="mono">{p.id}</small>
                </span>
              </td>
              <td>
                <StatusPill status={p.status} />
              </td>
              <td>{p.country}</td>
              <td>
                <VipChip tier={p.vipTier} />
              </td>
              <td className={styles.right}>{formatEur(p.balance)}</td>
              <td>
                <RiskBar score={p.riskScore} />
              </td>
              <td className={styles.muted}>{formatDate(p.registeredAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
