# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server at http://localhost:3000
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
```

## Environment Setup

Create `.env.local` in the project root:
```
NEXT_PUBLIC_API_URL=http://localhost:5164
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

The backend (NextUp.Api) must be running at `localhost:5164`. Next.js rewrites proxy `/api/*` and `/auth/*` requests to the backend — see `next.config.js`.

## Architecture

**Next.js 13.5.6 with Pages Router** (not App Router). JavaScript only, no TypeScript.

### Authentication & Route Protection

Auth state lives in `contexts/AuthContext.js` and is provided globally via `_app.js`. The context exposes `user`, `loading`, `isAuthenticated`, `login`, `logout`, and `checkAuth`. Session persistence is handled by calling `/auth/me` on mount using an HTTP-only JWT cookie.

Two HOCs in `hocs/withAuth.js` protect pages:
- `withAuth(Component, requiredRoles?)` — redirects unauthenticated users to `/login`; if roles are specified, redirects wrong-role users to their role's dashboard
- `withGuest(Component)` — redirects already-authenticated users away from guest pages (login, register)

Three user roles: `Player`, `Coach`, `AthleticDirector`. Role-based redirect destinations:
- `Player` → `/player/dashboard`
- `Coach` → `/coach/dashboard`
- `AthleticDirector` → `/athletic-director/dashboard`

### API Layer

All API calls go through `lib/api.js`, which wraps native `fetch` in a `req()` helper. The helper always sends `credentials: 'include'` for cookie-based auth. Import and call individual named exports (e.g., `import { fetchTeams } from '../lib/api'`).

Note: The README mentions Axios, but the codebase uses native `fetch`.

### Styling

Mix of Tailwind CSS (v4) and plain CSS files in `styles/`. `globals.css` is imported globally in `_app.js`. Role-specific CSS files (`ad-dashboard.css`, `navbar-modern.css`) are imported per-page rather than globally.

### Shared Utilities

- `lib/positions.js` — Football position normalization (`normalizePosition`), position-specific stat field definitions (`positionStatsMap`), and helpers for grouping/categorizing players by position (`groupPlayersByPosition`, `categorizePositions`). Used by coach and player pages that render stat forms.
- `components/RoleNavBar.js` — Navigation bar rendered globally in `_app.js`, adapts based on auth role.
- `components/PlayerStatsCard.js` — Reusable card for displaying player statistics.
