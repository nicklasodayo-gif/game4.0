# Red Giant Interactive Platform (Enterprise Monorepo)

A Turbo + pnpm monorepo for the Red Giant activation game: a touch-kiosk
puzzle game (`kiosk-player`), an admin dashboard for viewing leaderboards
and analytics (`admin-dashboard`), shared packages (`game-engine`, `ui`),
and a FastAPI backend.

```
red-giant-interactive-platform/
├── apps/
│   ├── admin-dashboard/   # React + Vite + TS admin UI (auth, leaderboard, analytics)
│   └── kiosk-player/      # React + Vite + TS touch-kiosk puzzle game
├── packages/
│   ├── game-engine/       # Pure puzzle logic, stats, validation, hooks (TS)
│   └── ui/                # Shared, theme-driven React components (TS)
├── backend/               # FastAPI + SQLAlchemy + JWT auth
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

## What was restored / built here

This monorepo did not exist before — it was constructed using the
standalone `activation-platform` Vite/React app (previously fixed in this
conversation) as the seed for `kiosk-player`, converted to TypeScript and
split across the packages above. `admin-dashboard` and `backend/` are new.
See the conversation history for the detailed list of what was added and
why; in short:

- `kiosk-player`'s missing `index.html`, `vite.config.ts`, `tsconfig.json`,
  Tailwind/PostCSS configs, `src/main.tsx`, and `public/` assets were all
  created (this is what fixes the "Could not auto-determine entry point" /
  blank-screen problem).
- Game logic (shuffle, statistics, validation, timers) was extracted into
  `packages/game-engine` so both apps and the backend's expectations line
  up on the same puzzle rules.
- Shared visual components moved into `packages/ui`, refactored to accept
  `theme`/`fonts` as props instead of importing one specific brand's
  config module directly (the original pattern would have made the shared
  package secretly depend on the kiosk app).
- A real FastAPI backend was written with JWT auth, game/score/lead
  endpoints, and analytics endpoints, and both frontends were wired to
  call it (`services/api.ts` in kiosk-player, `lib/api.ts` in
  admin-dashboard). The kiosk queues leads/scores in `localStorage` and
  flushes them to the backend in the background, so it keeps working if
  the network briefly drops.
- Along the way, a real bug in the original `useGameTimer` hook was fixed:
  `resume()` called an undefined `onTimeUpdate` instead of `onTick`.

## ⚠️ Verification limitations (please read)

This was built in a sandboxed environment with **no network access**, so
I could not run `pnpm install`, `pnpm dev`, or `pnpm build` here. What I
verified instead, using tools available offline:

- **Every** `.ts`/`.tsx` file in `apps/` and `packages/` (45 files) parses
  with **zero syntax errors** (checked with the TypeScript compiler's
  parser directly).
- **Every** `.py` file in `backend/` (14 files) compiles with **zero
  syntax errors** (checked with `py_compile`).
- All relative imports and all `@red-giant/game-engine` / `@red-giant/ui`
  cross-package imports resolve to real files on disk — no dangling
  imports.
- All `package.json`, `tsconfig*.json`, and `turbo.json` files are valid
  JSON; `pnpm-workspace.yaml` is valid YAML and includes `apps/*` and
  `packages/*` as required.

**What is *not* verified**, because it requires an actual `pnpm install`
and a live Node/Python environment:
- Full TypeScript *type-checking* (only syntax was checked — a wrong
  prop name or type mismatch wouldn't show up until `pnpm type-check`).
- That declared npm dependency versions are all mutually compatible.
- That `pnpm dev` / `pnpm build` actually succeed end-to-end.
- That the FastAPI backend actually boots and its endpoints behave as
  written (no `fastapi`/`uvicorn` install was possible here either).

Please run the steps below on a machine with network access and treat
the first `pnpm install` / `pnpm build` as the real first test — if
anything surfaces, it's most likely a small type or dependency-version
fix, not a structural problem.

## Getting started

### 1. Frontend (apps + packages)

```bash
# from the repo root
corepack enable   # ensures the right pnpm version (see packageManager in package.json)
pnpm install
cp apps/kiosk-player/.env.example apps/kiosk-player/.env
cp apps/admin-dashboard/.env.example apps/admin-dashboard/.env

pnpm dev     # runs kiosk-player (5173) + admin-dashboard (5174) via turbo
pnpm build   # builds all apps/packages via turbo
```

Open `http://localhost:5173/?brand=redgiant` (or `cocacola` / `demo`) for
the kiosk game, and `http://localhost:5174` for the admin dashboard.

### 2. Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # edit SECRET_KEY, ADMIN_EMAIL, ADMIN_PASSWORD
python seed.py               # creates the default admin user
uvicorn app.main:app --reload --port 8000
```

The API will be at `http://localhost:8000`. Interactive docs (Swagger UI)
are automatically available at `http://localhost:8000/docs`.

### 3. Log into the admin dashboard

Use the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `backend/.env` (whatever you
set before running `seed.py`) at `http://localhost:5174/login`.

## Monorepo mechanics

- **pnpm workspace**: `pnpm-workspace.yaml` includes `apps/*` and
  `packages/*`. `workspace:*` in each app's `package.json` links to the
  local package source directly — no separate build step needed for
  `packages/*` during development, since Vite aliases resolve
  `@red-giant/game-engine` and `@red-giant/ui` straight to their `src/`
  directories (see each app's `vite.config.ts`).
- **Turbo**: `turbo.json` defines `dev`, `build`, `lint`, and
  `type-check` tasks. `build`/`type-check` depend on `^build` (i.e.
  dependencies build first); `dev` is long-running and uncached.
- **TypeScript project references**: each app/package has its own
  `tsconfig.json` extending the shared `tsconfig.base.json`; `kiosk-player`
  and `admin-dashboard` reference both `packages/*` for `tsc -b` build
  ordering.
