import { PAGE_SIZE, useGetPlayersQuery } from '../api/playersApi'
import { Pager } from '../components/Pager'
import { PlayersFilters } from '../components/PlayersFilters'
import { PlayersTable } from '../components/PlayersTable'
import { PlayersViewBar } from '../components/PlayersViewBar'
import { usePlayerFilters } from '../hooks/usePlayerFilters'
import styles from './PlayersPage.module.scss'

export function PlayersPage() {
  const { filters, setFilters, clearFilters, applySearch, search, isFiltered } =
    usePlayerFilters()

  // When the filters change, RTK Query keeps returning the previous result in
  // `data` while the new one loads (isFetching), so the table never flashes empty.
  // isLoading is only true for the very first load, when there is nothing to show.
  const { data, isLoading, isFetching, isError, refetch } =
    useGetPlayersQuery(filters)

  // A page past the end, from an old link or a hand-edited URL. Filters are not
  // the problem here, so the way out is the first page, not Clear filters.
  const pastLastPage = data !== undefined && data.total > 0

  return (
    <>
      <PlayersFilters
        filters={filters}
        onChange={setFilters}
        onClear={clearFilters}
      />

      <PlayersViewBar search={search} onApply={applySearch} />

      <div className={styles.panel}>
        {isLoading ? (
          <Skeleton rows={PAGE_SIZE} />
        ) : isError ? (
          // Checked before `data`: after a failed filter change `data` still holds
          // the previous result, which would show rows that do not match the URL.
          <div className={styles.empty} role="alert">
            <h2>Could not load players</h2>
            <p>
              The API did not answer. Is json-server running (npm run dev:all)?
            </p>
            <button
              type="button"
              className={styles.primary}
              onClick={() => refetch()}
            >
              Retry
            </button>
          </div>
        ) : data && data.items.length > 0 ? (
          <>
            <PlayersTable
              players={data.items}
              sort={filters.sort}
              order={filters.order}
              onSort={setFilters}
              stale={isFetching}
            />
            <Pager
              page={filters.page}
              pageSize={PAGE_SIZE}
              total={data.total}
              onPage={(page) => setFilters({ page })}
            />
          </>
        ) : pastLastPage ? (
          <div className={styles.empty}>
            <h2>This page is empty</h2>
            <p>Players in this list: {data.total}.</p>
            <button
              type="button"
              className={styles.primary}
              onClick={() => setFilters({ page: 1 })}
            >
              Go to first page
            </button>
          </div>
        ) : (
          <div className={styles.empty}>
            <h2>No players match</h2>
            <p>Try a shorter search or clear a filter.</p>
            {isFiltered && (
              <button
                type="button"
                className={styles.primary}
                onClick={clearFilters}
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      <p className={styles.hint}>
        Search waits 300 ms after you stop typing. Rows open the player profile.
        The previous page stays visible while the next one loads.
      </p>
    </>
  )
}

function Skeleton({ rows }: { rows: number }) {
  return (
    <div aria-busy="true" aria-label="Loading players">
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
