import type { PlayerStatus } from '@/types'
import styles from './StatusPill.module.scss'

const TONE = {
  Active: 'good',
  Suspended: 'warn',
  'Pending KYC': 'info',
  'Self-excluded': 'bad',
  Closed: 'bad',
} as const satisfies Record<PlayerStatus, 'good' | 'warn' | 'info' | 'bad'>

interface StatusPillProps {
  status: PlayerStatus
}

export function StatusPill({ status }: StatusPillProps) {
  return <span className={styles[TONE[status]]}>{status}</span>
}
