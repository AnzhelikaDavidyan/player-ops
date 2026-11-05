import { Link, useLocation, useParams } from 'react-router'
import { useGetPlayerQuery } from '@/features/players/api/playersApi'
import { isNotFound } from '@/shared/api/baseApi'
import { ComingSoon } from '@/shared/ui/ComingSoon'
import { BonusesTab } from '../components/BonusesTab'
import { OverviewTab } from '../components/OverviewTab'
import { PlayerHeader } from '../components/PlayerHeader'
import { LoadError, LoadingRows } from '../components/TabStates'
import { TransactionsTab } from '../components/TransactionsTab'
import {
  PROFILE_TABS,
  tabSearch,
  useProfileParams,
} from '../hooks/useProfileParams'
import styles from '../components/Profile.module.scss'

export function PlayerProfilePage() {
  const { playerId = '' } = useParams()
  const location = useLocation()
  const { tab } = useProfileParams()

  // currentData, not data: `data` keeps the previous result while a new id
  // loads, which here would show one player's details under another's URL.
  const {
    currentData: player,
    isError,
    error,
    refetch,
  } = useGetPlayerQuery(playerId)

  // The list passes its filters along, so this returns to the same view.
  const listSearch =
    (location.state as { listSearch?: string } | null)?.listSearch ?? ''
  const backLink = (
    <Link className={styles.back} to={`/players${listSearch}`}>
      ← Back to players
    </Link>
  )

  if (isError && isNotFound(error)) {
    return (
      <>
        {backLink}
        <div className={styles.panel}>
          <div className={styles.empty} role="alert">
            <h2>Player {playerId} not found</h2>
            <p>The ID may be wrong, or the data was reset.</p>
          </div>
        </div>
      </>
    )
  }

  if (isError) {
    return (
      <>
        {backLink}
        <div className={styles.panel}>
          <LoadError what="this player" onRetry={refetch} />
        </div>
      </>
    )
  }

  if (!player) {
    return (
      <>
        {backLink}
        <div className={styles.panel}>
          <LoadingRows label="Loading player" rows={6} />
        </div>
      </>
    )
  }

  return (
    <>
      {backLink}
      <PlayerHeader player={player} />

      <nav className={styles.tabs} aria-label="Player sections">
        {PROFILE_TABS.map((t) => (
          <Link
            key={t.id}
            to={{ search: tabSearch(t.id) }}
            state={location.state}
            aria-current={tab === t.id ? 'page' : undefined}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {/* The key resets tab state when the page moves to another player. */}
      <div key={player.id}>
        {tab === 'overview' && <OverviewTab playerId={player.id} />}
        {tab === 'transactions' && <TransactionsTab playerId={player.id} />}
        {tab === 'limits' && (
          <ComingSoon task="The limits form (T6)" when="Day 5" />
        )}
        {tab === 'bonuses' && <BonusesTab playerId={player.id} />}
      </div>
    </>
  )
}
