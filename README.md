# Player Ops

React app for managing players.

## Stack

- [Vite](https://vite.dev/) + React + TypeScript
- [React Router](https://reactrouter.com/) for pages
- oxlint for linting, Prettier for formatting

## Scripts

| Command                | What it does                     |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Start the dev server (port 5173) |
| `npm run build`        | Type-check and build to `dist/`  |
| `npm run preview`      | Serve the production build       |
| `npm run lint`         | Lint with oxlint                 |
| `npm run typecheck`    | Type-check only                  |
| `npm run format`       | Format all files with Prettier   |
| `npm run format:check` | Check formatting without writing |

## Structure

```
src/
  app/         App shell: router (App.tsx) and layout (Layout.tsx)
  pages/       One component per route
  components/  Reusable UI pieces
  data/        Mock data (replace with API calls later)
  types/       Shared TypeScript types
```

## Day 1 (done)

- Scaffolded Vite + React + TypeScript, removed the demo content
- Added React Router with routes: `/`, `/players`, `/players/:playerId`, 404
- Sidebar layout, Dashboard stats, Players table, Player detail page
- Mock player data and a `Player` type
- Prettier config and format/typecheck scripts
