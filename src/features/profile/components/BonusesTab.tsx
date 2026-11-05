import { formatDate, formatEur } from '@/shared/lib/format'
import {
  useGetBonusesQuery,
  useGetPlayerAssignmentsQuery,
} from '../api/profileApi'
import { LoadError, LoadingRows } from './TabStates'
import styles from './Profile.module.scss'

interface BonusesTabProps {
  playerId: string
}

export function BonusesTab({ playerId }: BonusesTabProps) {
  const assignments = useGetPlayerAssignmentsQuery(playerId)
  const bonuses = useGetBonusesQuery()

  // An assignment only stores bonusId; the name comes from the bonuses list.
  const nameOf = (bonusId: string) =>
    bonuses.data?.find((b) => b.id === bonusId)?.name ?? bonusId

  return (
    <section className={styles.panel}>
      <header className={styles.panelHead}>
        <h2>Assigned bonuses</h2>
      </header>
      {assignments.isLoading || bonuses.isLoading ? (
        <LoadingRows label="Loading bonuses" rows={3} />
      ) : assignments.isError || bonuses.isError ? (
        <LoadError
          what="the bonuses"
          onRetry={() => {
            if (assignments.isError) void assignments.refetch()
            if (bonuses.isError) void bonuses.refetch()
          }}
        />
      ) : assignments.data && assignments.data.length > 0 ? (
        <ul className={styles.list}>
          {assignments.data.map((a) => (
            <li key={a.id}>
              <span className={styles.stack}>
                <span>{nameOf(a.bonusId)}</span>
                <small>
                  {a.reason}
                  {a.amountOverride !== null &&
                    ` · amount ${formatEur(a.amountOverride)}`}
                </small>
              </span>
              <span className={styles.time}>
                expires {formatDate(a.expiresAt)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.none}>No bonuses assigned manually.</p>
      )}
    </section>
  )
}
