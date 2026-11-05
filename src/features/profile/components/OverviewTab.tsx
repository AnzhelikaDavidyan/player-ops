import { Link, useLocation } from 'react-router'
import { isNotFound } from '@/shared/api/baseApi'
import { formatDateTime, formatEurWhole } from '@/shared/lib/format'
import type { AuditAction, Limits } from '@/types'
import { useGetLimitsQuery, useGetPlayerHistoryQuery } from '../api/profileApi'
import { tabSearch } from '../hooks/useProfileParams'
import { LoadError, LoadingRows } from './TabStates'
import styles from './Profile.module.scss'

const ACTION_LABELS = {
  'player.status': 'Status changed',
  'limits.update': 'Limits saved',
  'bonus.assign': 'Bonus assigned',
  'bonus.create': 'Bonus created',
  'bonus.update': 'Bonus edited',
  'bonus.status': 'Bonus status',
} as const satisfies Record<AuditAction, string>

const LIMIT_ROWS: { key: keyof Limits; label: string; minutes?: true }[] = [
  { key: 'depositDaily', label: 'Daily deposit limit' },
  { key: 'depositWeekly', label: 'Weekly deposit limit' },
  { key: 'depositMonthly', label: 'Monthly deposit limit' },
  { key: 'lossMonthly', label: 'Monthly loss limit' },
  { key: 'sessionMinutes', label: 'Session length', minutes: true },
]

interface OverviewTabProps {
  playerId: string
}

export function OverviewTab({ playerId }: OverviewTabProps) {
  return (
    <div className={styles.columns}>
      <PlayerHistory playerId={playerId} />
      <LimitsOnFile playerId={playerId} />
    </div>
  )
}

function PlayerHistory({ playerId }: OverviewTabProps) {
  const { data, isLoading, isError, refetch } =
    useGetPlayerHistoryQuery(playerId)

  return (
    <section className={styles.panel}>
      <header className={styles.panelHead}>
        <h2>Player history</h2>
      </header>
      {isLoading ? (
        <LoadingRows label="Loading history" rows={3} />
      ) : isError ? (
        <LoadError what="the history" onRetry={refetch} />
      ) : data && data.length > 0 ? (
        <ul className={styles.list}>
          {data.map((entry) => (
            <li key={entry.id}>
              <span className={styles.stack}>
                <span>{ACTION_LABELS[entry.action]}</span>
                <small>{entry.detail}</small>
              </span>
              <time className={styles.time} dateTime={entry.at}>
                {formatDateTime(entry.at)}
              </time>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.none}>No staff actions on this player yet.</p>
      )}
    </section>
  )
}

function LimitsOnFile({ playerId }: OverviewTabProps) {
  const { state } = useLocation()
  const { data, isLoading, isError, error, refetch } =
    useGetLimitsQuery(playerId)

  return (
    <section className={styles.panel}>
      <header className={styles.panelHead}>
        <h2>Limits on file</h2>
        <Link
          className={styles.button}
          to={{ search: tabSearch('limits') }}
          state={state}
        >
          Edit limits
        </Link>
      </header>
      {isLoading ? (
        <LoadingRows label="Loading limits" rows={5} />
      ) : isError && !isNotFound(error) ? (
        <LoadError what="the limits" onRetry={refetch} />
      ) : data ? (
        <ul className={styles.list}>
          {LIMIT_ROWS.map(({ key, label, minutes }) => {
            const value = Number(data[key])
            return (
              <li key={key}>
                <span>{label}</span>
                <b>{minutes ? `${value} min` : formatEurWhole(value)}</b>
              </li>
            )
          })}
          <li className={styles.lastChanged}>
            <span>Last changed</span>
            <time dateTime={data.updatedAt}>
              {formatDateTime(data.updatedAt)}
            </time>
          </li>
        </ul>
      ) : (
        <p className={styles.none}>No limits set.</p>
      )}
    </section>
  )
}
