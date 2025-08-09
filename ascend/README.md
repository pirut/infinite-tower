# Ascend: The Infinite Tower

Expo React Native app (TypeScript). Navigation via React Navigation with bottom tabs. State via Zustand, data via React Query.

- Start: `npx expo start`
- Test: `npm test`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`

Project structure:

- `src/screens/*` baseline tabs (Home, Run, Upgrades, Events, Leaderboards, Profile)
- `src/components`, `src/gameplay`, `src/shared`, `src/services`, `src/state`, `src/hooks`, `src/assets`
- CI at `.github/workflows/ci.yml`

---

Progress:

- TASK 0: Done — Expo app, TS strict, navigation tabs, Jest/ESLint/Prettier
- TASK 1: Done (baseline) — Supabase client/env, migrations (0001), RLS policies, edge function stubs; anon auth + profile bootstrap
- TASK 2: Done — Shared logic (`rng`, `curves`, `combat`, `floorGen`, `loot`, `meta`, `scoring`) with tests and >85% coverage
- TASK 3: Core loop implemented — Skia scene, one‑thumb drag, auto‑fire, collisions, hit particles, basic screen shake; floor clear → chest → loot roll; run persistence (start/update/close)
- TASK 4: In progress — Added `profiles.upgrades` JSON, Stats tab with "Power" upgrade purchase (coins), optimistic sync via React Query

Next:

- Finish TASK 4: Skill tree tabs, cosmetics placeholders, treasure floor gating by keys
- TASK 5: Implement `grant_daily_login` and streak claim UI
