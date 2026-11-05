import { useNavigate } from 'react-router'
import { useUiStore } from '@/shared/store/uiStore'
import type { Player } from '@/types'
import type { PlayerSortKey, PlayersQuery } from '../api/playersApi'
import { PLAYER_COLUMNS } from './playerColumns'
import styles from './PlayersTable.module.scss'

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
  const hiddenColumns = useUiStore((s) => s.hiddenColumns)
  const columns = PLAYER_COLUMNS.filter(
    (c) => c.id === 'player' || !hiddenColumns.includes(c.id),
  )

  const toggleSort = (key: PlayerSortKey) => {
    if (key === sort) onSort({ sort, order: order === 'asc' ? 'desc' : 'asc' })
    else onSort({ sort: key, order: DESC_FIRST.includes(key) ? 'desc' : 'asc' })
  }

  return (
    <div className={styles.wrap}>
      <table className={styles.table} aria-busy={stale} data-stale={stale}>
        <thead>
          <tr>
            {columns.map((col) => {
              const active = col.sort === sort
              return (
                <th
                  key={col.id}
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
            <tr key={p.id} onClick={() => navigate(`/players/${p.id}`)}>
              {columns.map((col) => (
                <td
                  key={col.id}
                  className={
                    col.align === 'right'
                      ? styles.right
                      : col.muted
                        ? styles.muted
                        : undefined
                  }
                >
                  {col.cell(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
