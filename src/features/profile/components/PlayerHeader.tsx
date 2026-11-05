import {
  formatDate,
  formatDateTime,
  formatEur,
  formatEurWhole,
} from '@/shared/lib/format'
import { RiskBar } from '@/shared/ui/RiskBar'
import { StatusPill } from '@/shared/ui/StatusPill'
import { VipChip } from '@/shared/ui/VipChip'
import type { Player } from '@/types'
import styles from './Profile.module.scss'

interface PlayerHeaderProps {
  player: Player
}

export function PlayerHeader({ player }: PlayerHeaderProps) {
  return (
    <section className={styles.header} aria-label="Player summary">
      <div className={styles.identity}>
        <div className={styles.name}>
          <h2>{player.username}</h2>
          <StatusPill status={player.status} />
          <VipChip tier={player.vipTier} />
        </div>
        <p className={styles.meta}>
          <span className="mono">{player.id}</span>
          <span aria-hidden="true">·</span>
          <span>{player.email}</span>
          <span aria-hidden="true">·</span>
          <span>{player.country}</span>
        </p>
      </div>

      <dl className={styles.facts}>
        <div>
          <dt>Balance</dt>
          <dd>{formatEur(player.balance)}</dd>
        </div>
        <div>
          <dt>Risk score</dt>
          <dd>
            <RiskBar score={player.riskScore} />
          </dd>
        </div>
        <div>
          <dt>Lifetime deposits</dt>
          <dd>{formatEurWhole(player.depositsTotal)}</dd>
        </div>
        <div>
          <dt>Net loss</dt>
          <dd>{formatEurWhole(player.netLoss)}</dd>
        </div>
        <div>
          <dt>Registered</dt>
          <dd>{formatDate(player.registeredAt)}</dd>
        </div>
        <div>
          <dt>Last login</dt>
          <dd>{formatDateTime(player.lastLoginAt)}</dd>
        </div>
      </dl>
    </section>
  )
}
