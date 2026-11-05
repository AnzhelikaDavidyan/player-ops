import styles from './Profile.module.scss'

interface LoadErrorProps {
  /** Finishes the sentence "Could not load …". */
  what: string
  onRetry: () => void
}

export function LoadError({ what, onRetry }: LoadErrorProps) {
  return (
    <div className={styles.empty} role="alert">
      <h2>Could not load {what}</h2>
      <p>The API did not answer. Is json-server running (npm run dev:all)?</p>
      <button type="button" className={styles.primary} onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}

interface LoadingRowsProps {
  label: string
  rows: number
}

export function LoadingRows({ label, rows }: LoadingRowsProps) {
  return (
    <div aria-busy="true" aria-label={label}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className={styles.skelRow}>
          <div
            className={styles.skel}
            style={{ width: `${50 + ((i * 37) % 45)}%` }}
          />
        </div>
      ))}
    </div>
  )
}
