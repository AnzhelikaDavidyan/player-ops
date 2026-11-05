import { NavLink, Outlet, useMatches } from 'react-router'
import { useGetPlayersTotalQuery } from '@/features/players/api/playersApi'
import { ROLE_LABELS, selectRole } from '@/features/session/sessionSlice'
import { ThemeSelect } from '@/shared/ui/ThemeSelect'
import { useAppSelector } from './hooks'
import type { RouteHandle } from './router'
import styles from './Layout.module.scss'

const MOCK_API = import.meta.env.VITE_MOCK_API === 'true'

export function Layout() {
  const role = useAppSelector(selectRole)
  const { data: playerCount, isError: apiDown } = useGetPlayersTotalQuery()

  // The deepest matched route that declares a title wins.
  const title = useMatches()
    .map((m) => (m.handle as RouteHandle | undefined)?.title)
    .findLast(Boolean)

  return (
    <div className={styles.app}>
      <aside className={styles.rail}>
        <div className={styles.brand}>
          <span className={styles.mark} aria-hidden="true">
            PO
          </span>
          <div>
            <b>PlayerOps</b>
            <small>Player management console</small>
          </div>
        </div>

        <nav className={styles.nav} aria-label="Main">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/players">
            Players
            {playerCount !== undefined && (
              <span className={styles.count}>{playerCount}</span>
            )}
          </NavLink>
          <NavLink to="/bonuses">Bonuses</NavLink>
          <NavLink to="/audit">Audit log</NavLink>
        </nav>

        <div className={styles.user}>
          <span className={styles.label}>Signed in as</span>
          <span>{ROLE_LABELS[role]}</span>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.top}>
          <h1>{title}</h1>
          <div className={styles.topActions}>
            <ThemeSelect />
            <span
              className={styles.sync}
              data-state={apiDown ? 'down' : MOCK_API ? 'demo' : 'live'}
              role="status"
            >
              {apiDown
                ? 'API offline'
                : MOCK_API
                  ? 'Demo data · resets on reload'
                  : 'Live'}
            </span>
          </div>
        </header>
        <section className={styles.view}>
          <Outlet />
        </section>
      </main>
    </div>
  )
}
