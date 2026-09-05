# PRD — Charge Jump (working title)

## Original Problem Statement
Build the first playable vertical slice of a cross-platform iOS/Android mobile arcade
game (Expo + React Native) focused ONLY on making the core HOLD → CHARGE → RELEASE → JUMP
mechanic feel excellent. Portrait, ~9:16, touch-first. Original code/visuals inspired only
by the generic spring-jump concept. Do NOT build the full game — smallest polished playable
slice. Stop after the slice is playable and wait for physics feedback.

## User Choices
- Visual vibe: Calm & minimal, light background
- Placeholder character: simple blob/jelly (temporary physics-test character)
- Debug mode: ON by default
- Haptics: minimal (perfect landing only)
- Explicitly: keep this build minimal, no scope creep. Wait for feedback before adding
  multiplayer, final characters, coins, shops, power-ups, detailed backgrounds, etc.

## Architecture
- Fully client-side. No backend, no database, no external integrations.
- Frontend: Expo Router single screen `app/index.tsx`.
- Physics/game loop runs on the Reanimated UI thread via `useFrameCallback` (60fps),
  state held in shared values; only rare events (landing, game over) cross to JS via runOnJS.
- Best score persisted locally with `@/src/utils/storage` (AsyncStorage), key `jumpcharge.bestScore`.
- All tunable gameplay values centralized in `src/game/config.ts` (CONFIG) + `DEBUG_MODE` flag.
- Colors from `src/theme.ts` (calm-minimal light game palette).

## Core Requirements (static)
- One placeholder blob with charge squash/stretch, max-charge shake, launch squash, landing pulse.
- Hold to charge (max ~1.7s, capped), release to jump; longer hold → more horizontal + vertical.
- No air steering; parabolic gravity; responsive, predictable, skill-based feel.
- Procedural platforms always reachable; 2–4 upcoming visible; forgiving early platforms.
- Fair, slightly forgiving landing detection.
- Perfect-landing center zone → "PERFECT!", bonus score, particle burst + light haptic.
- Score (+1 land, +2 perfect); Game Over with Score/Best/Play Again; instant restart.
- Smooth horizontal camera keeping player left-middle; gentle vertical follow; follow the fall.
- Simple light background with lightweight parallax hills.
- Dev-only debug overlay (charge%, vx, vy, next dist, next width, land offset, fps).
- Object pooling + cleanup of off-screen platforms for performance.

## Implemented (2026-06)
- [x] Blob character with full squash-and-stretch across charge/air/land + max-charge shake (2026-06)
- [x] Hold-and-release charging with capped max charge and immediate launch on release (2026-06)
- [x] Parabolic jump physics on the UI thread @ 60fps, no air steering (2026-06)
- [x] Procedural platform generation (reachable gaps, gentle first platforms) + pooling/cleanup (2026-06)
- [x] Fair landing detection with horizontal + vertical forgiveness (2026-06)
- [x] Perfect landing (center zone, PERFECT! pop, particle burst, light haptic) (2026-06)
- [x] Score + persisted Best (AsyncStorage) (2026-06)
- [x] Falling → camera follows → Game Over overlay → instant Play Again (2026-06)
- [x] Smooth horizontal camera (player anchored left-middle) + gentle vertical level tracking (2026-06)
- [x] Light background with two lightweight parallax hill layers (2026-06)
- [x] Centralized CONFIG module + DEBUG_MODE toggle (2026-06)
- [x] Dev debug overlay with live telemetry (2026-06)
- [x] Tuned jump balance so a light tap clears the min gap and full charge comfortably
      overshoots (skill window), verified via automated play to score 7 at 60fps (2026-06)

## Backlog (reserved for later milestones — DO NOT build without user go-ahead)
- P1: physics fine-tuning based on user feedback (values live in `src/game/config.ts`)
- P2: final characters + selection, comedy backgrounds, coins/shop/IAP, power-ups
  (Rewind/Shield), combo system, risk/golden platforms, achievements/missions/daily,
  multiplayer/online, ranked, ads, accounts/login.

## Next Tasks
- Await user feedback on the feel of charge, trajectory, gravity, landing fairness, and camera.
- Adjust CONFIG values per feedback (gravity, min/max jump forces, gaps, perfect tolerance, camera smoothing).
