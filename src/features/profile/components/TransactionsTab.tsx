import { formatDateTime, formatEur } from '@/shared/lib/format'
import {
  TRANSACTION_TYPES,
  type TransactionStatus,
  type TransactionType,
} from '@/types'
import { useGetTransactionsQuery } from '../api/profileApi'
import { useProfileParams } from '../hooks/useProfileParams'
import { LoadError, LoadingRows } from './TabStates'
import styles from './Profile.module.scss'

const STATUS_CLASS = {
  Completed: styles.txCompleted,
  Pending: styles.txPending,
  Failed: styles.txFailed,
} as const satisfies Record<TransactionStatus, string | undefined>

const MONEY_OUT: TransactionType[] = ['Bet', 'Withdrawal']

interface TransactionsTabProps {
  playerId: string
}

export function TransactionsTab({ playerId }: TransactionsTabProps) {
  const { txType, setTxType } = useProfileParams()

  // `data` on purpose: the previous rows stay, dimmed, while a new filter loads.
  const { data, isLoading, isFetching, isError, refetch } =
    useGetTransactionsQuery({ playerId, type: txType })

  return (
    <section className={styles.panel}>
      <header className={styles.panelHead}>
        <div
          className={styles.chips}
          role="group"
          aria-label="Transaction type"
        >
          {(['', ...TRANSACTION_TYPES] as const).map((type) => (
            <button
              key={type}
              type="button"
              aria-pressed={txType === type}
              onClick={() => setTxType(type)}
            >
              {type || 'All'}
            </button>
          ))}
        </div>
      </header>

      {isLoading ? (
        <LoadingRows label="Loading transactions" rows={6} />
      ) : isError ? (
        <LoadError what="the transactions" onRetry={refetch} />
      ) : data && data.length > 0 ? (
        <div className={styles.tableWrap}>
          <table
            className={styles.table}
            aria-busy={isFetching}
            data-stale={isFetching}
          >
            <thead>
              <tr>
                <th scope="col">Time</th>
                <th scope="col">Type</th>
                <th scope="col">Source</th>
                <th scope="col" className={styles.right}>
                  Amount
                </th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((tx) => {
                const out = MONEY_OUT.includes(tx.type)
                return (
                  <tr key={tx.id}>
                    <td className="mono">{formatDateTime(tx.createdAt)}</td>
                    <td>{tx.type}</td>
                    <td className={styles.muted}>{tx.method}</td>
                    <td className={out ? styles.right : styles.moneyIn}>
                      {out ? '−' : '+'}
                      {formatEur(tx.amount)}
                    </td>
                    <td>
                      <span className={STATUS_CLASS[tx.status]}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className={styles.none}>
          No {txType ? `${txType.toLowerCase()} ` : ''}transactions.
        </p>
      )}
    </section>
  )
}
