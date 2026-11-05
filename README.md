# PlayerOps

A player management console for a casino and sportsbook back office: players, risk,
responsible-gaming limits, bonuses and an audit log. Built in React to the PlayerOps
UX designs.

## Run it

```bash
npm install
npm run dev:all   # app on http://localhost:5173 + fake API on :3001
```

`dev:all` starts Vite and json-server together. The app calls `/api/...`; Vite proxies
that to json-server, which serves `db.json` as a REST API with a 400 ms delay and
writes every change back into the file. `npm run seed` regenerates `db.json` (30
players, transactions, limits, 6 casino + 5 sport bonuses) and discards your edits.

| Command             | What it does                                   |
| ------------------- | ---------------------------------------------- |
| `npm run dev:all`   | App + API together                             |
| `npm run dev`       | App only (the UI shows "API offline")          |
| `npm run api`       | json-server only                               |
| `npm run seed`      | Rebuild `db.json` from `scripts/seed.mjs`      |
| `npm run typecheck` | Strict type-check; must pass before every push |
| `npm run lint`      | oxlint                                         |
| `npm run build`     | Type-check and build to `dist/`                |
| `npm run format`    | Prettier                                       |

## Stack

- React 19, TypeScript in strict mode (`noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`, `verbatimModuleSyntax`), Vite
- Redux Toolkit + **RTK Query** for server state (cache, tags, invalidation)
- React Router data router; route titles live in `handle`
- Zustand for UI preferences of this browser (theme, columns, saved views), persisted
  to localStorage; server data stays in RTK Query
- React Hook Form + Zod (forms): installed, used from T6
- SCSS modules; colours are CSS variables, shared blocks are mixins
- json-server 0.17.4 as the fake backend

## Structure

```
src/
  app/        store, typed hooks, router, Layout (sidebar + header)
  features/
    players/  api/ (RTK Query endpoints), hooks/, components/, pages/
    session/  role of the signed-in user
  shared/     baseApi, uiStore, useDebounce, formatters, small UI (StatusPill…), styles
  types/      domain models: Player, Transaction, Limits, Bonus, Assignment, AuditEntry
scripts/seed.mjs   generates db.json
```

Code is grouped by feature, so everything about players lives in one folder.
`shared/` holds only things two or more features use.

## Progress

- [x] **T1** Setup: strict TS, `@/` alias, domain types, mixins, json-server, store, layout
- [x] **T2** Players list: RTK Query, filters/sort/page in the URL, 300 ms debounced
      search, loading skeleton, empty and error states, previous page stays visible
- [x] **T5** UI preferences: Zustand store with persist, theme, column picker, saved views
- [ ] T3 Player profile · T4 Change status · T6 Limits form
- [ ] T7–T9 Bonuses · T10 Tests and deploy
