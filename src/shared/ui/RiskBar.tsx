import styles from './RiskBar.module.scss'

interface RiskBarProps {
  /** 0–100 */
  score: number
}

/** Green below 45, amber from 45, red from 75. */
export function RiskBar({ score }: RiskBarProps) {
  const level = score >= 75 ? 'high' : score >= 45 ? 'medium' : 'low'
  return (
    <span className={styles.risk}>
      <span className={styles.track} aria-hidden="true">
        <span className={styles[level]} style={{ width: `${score}%` }} />
      </span>
      <span className="mono">{score}</span>
      <span className="visually-hidden">{level} risk</span>
    </span>
  )
}
