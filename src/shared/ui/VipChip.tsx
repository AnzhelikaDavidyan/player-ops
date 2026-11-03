import type { VipTier } from '@/types'
import styles from './VipChip.module.scss'

interface VipChipProps {
  tier: VipTier
}

export function VipChip({ tier }: VipChipProps) {
  const premium = tier === 'Gold' || tier === 'Platinum'
  return <span className={premium ? styles.premium : styles.chip}>{tier}</span>
}
