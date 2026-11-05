import type { ReactNode } from 'react'
import { formatDate, formatEur } from '@/shared/lib/format'
import { RiskBar } from '@/shared/ui/RiskBar'
import { StatusPill } from '@/shared/ui/StatusPill'
import { VipChip } from '@/shared/ui/VipChip'
import type { Player, PlayerColumnId } from '@/types'
import type { PlayerSortKey } from '../api/playersApi'
import { PlayerLink } from './PlayerLink'
import styles from './PlayersTable.module.scss'

export interface PlayerColumn {
  id: 'player' | PlayerColumnId
  label: string
  /** Server field to sort by; VIP has none because tiers do not sort alphabetically. */
  sort?: PlayerSortKey
  align?: 'right'
  muted?: boolean
  cell: (player: Player) => ReactNode
}

export const PLAYER_COLUMNS: PlayerColumn[] = [
  {
    id: 'player',
    label: 'Player',
    sort: 'username',
    cell: (p) => (
      <span className={styles.who}>
        <PlayerLink player={p} />
        <small className="mono">{p.id}</small>
      </span>
    ),
  },
  {
    id: 'status',
    label: 'Status',
    sort: 'status',
    cell: (p) => <StatusPill status={p.status} />,
  },
  { id: 'country', label: 'Country', sort: 'country', cell: (p) => p.country },
  { id: 'vip', label: 'VIP', cell: (p) => <VipChip tier={p.vipTier} /> },
  {
    id: 'balance',
    label: 'Balance',
    sort: 'balance',
    align: 'right',
    cell: (p) => formatEur(p.balance),
  },
  {
    id: 'risk',
    label: 'Risk',
    sort: 'riskScore',
    cell: (p) => <RiskBar score={p.riskScore} />,
  },
  {
    id: 'registered',
    label: 'Registered',
    sort: 'registeredAt',
    muted: true,
    cell: (p) => formatDate(p.registeredAt),
  },
]

export const HIDEABLE_COLUMNS = PLAYER_COLUMNS.filter(
  (c): c is PlayerColumn & { id: PlayerColumnId } => c.id !== 'player',
)
