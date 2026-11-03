import { NavLink, Outlet } from 'react-router'

export function Layout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">Player Ops</div>
        <nav>
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/players">Players</NavLink>
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
