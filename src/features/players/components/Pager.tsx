import styles from './Pager.module.scss'

interface PagerProps {
  page: number
  pageSize: number
  total: number
  onPage: (page: number) => void
}

export function Pager({ page, pageSize, total, onPage }: PagerProps) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className={styles.pager}>
      <span className={styles.muted}>
        {total === 0 ? '0 players' : `${from}–${to} of ${total} players`}
      </span>
      <span className={styles.controls}>
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
        >
          Previous
        </button>
        <span className={styles.muted}>
          Page {page} / {pages}
        </span>
        <button
          type="button"
          disabled={page >= pages}
          onClick={() => onPage(page + 1)}
        >
          Next
        </button>
      </span>
    </div>
  )
}
