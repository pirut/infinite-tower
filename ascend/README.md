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
- TASK 0: Done — Expo app, TS strict, navigation tabs, Jest/ESLint/Prettier, CI workflow
- TASK 1: Wiring in place — Supabase client, env, migrations, edge function stubs; anon auth + profile bootstrap
- TASK 2: Shared logic and tests added; Jest enforces >85% coverage on `src/shared/*`

Next: Implement gameplay loop skeleton (Skia engine, controls) for TASK 3.