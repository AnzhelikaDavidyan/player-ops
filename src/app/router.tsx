import { createBrowserRouter } from 'react-router'
import { PlayersPage } from '@/features/players/pages/PlayersPage'
import { PlayerProfilePage } from '@/features/profile/pages/PlayerProfilePage'
import { ComingSoon } from '@/shared/ui/ComingSoon'
import { Layout } from './Layout'

/** Per-route data read by Layout (like Angular's route `data`). */
export interface RouteHandle {
  title: string
}

const handle = (title: string): RouteHandle => ({ title })

export const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        {
          index: true,
          handle: handle('Dashboard'),
          element: <ComingSoon task="The dashboard" when="Sun Nov 8" />,
        },
        {
          path: 'players',
          handle: handle('Players'),
          element: <PlayersPage />,
        },
        {
          path: 'players/:playerId',
          handle: handle('Player profile'),
          element: <PlayerProfilePage />,
        },
        {
          path: 'bonuses',
          handle: handle('Bonuses'),
          element: <ComingSoon task="Bonuses (T7)" when="Fri Nov 6" />,
        },
        {
          path: 'audit',
          handle: handle('Audit log'),
          element: <ComingSoon task="The audit log" when="after the MVP" />,
        },
        {
          path: '*',
          handle: handle('Not found'),
          element: (
            <ComingSoon task="This page" when="never: the address is wrong" />
          ),
        },
      ],
    },
  ],
  // '/' locally, '/player-ops/' on GitHub Pages (from Vite's `base`).
  { basename: import.meta.env.BASE_URL },
)
