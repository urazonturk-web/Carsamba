# Snapshot: liked randomized-course state (2026-09-16)

User played this exact state and confirmed it feels better than the earlier
randomized-course playtest. Saved so it can be restored even if a later
change turns out worse. Not committed to git; this is a local, file-based
checkpoint only.

## What this state is

- `EXPERIMENTAL_COURSE = true`, `EXPERIMENTAL_PHYSICS = false` in `src/game/config.ts`.
- Procedural generator's late-difficulty ranges tightened: `gapLate.max` 380->260,
  `heightVarLate` 300->180 (only takes effect when `EXPERIMENTAL_COURSE=true`).
- No physics/jump-curve change (`horizontalChargePlateau` still 1, unchanged).
- Procedural generator itself lives in `src/game/procedural-course.ts` (extracted
  from `app/index.tsx`, same behavior as before extraction).
- See `/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend/AI_REVIEW.md`
  for the full evidence trail and both Codex review rounds behind this state.

## How to restore this exact state later

If `src/game/config.ts`, `app/index.tsx`, `src/game/procedural-course.ts`,
`src/game/jump.ts`, or `src/game/landing.ts` are changed later and the result
is worse, copy the files from this folder back over the live ones:

```bash
cp backups/2026-09-16-liked-randomized-course-geometry-tightened/config.ts src/game/config.ts
cp backups/2026-09-16-liked-randomized-course-geometry-tightened/index.tsx app/index.tsx
cp backups/2026-09-16-liked-randomized-course-geometry-tightened/procedural-course.ts src/game/procedural-course.ts
cp backups/2026-09-16-liked-randomized-course-geometry-tightened/jump.ts src/game/jump.ts
cp backups/2026-09-16-liked-randomized-course-geometry-tightened/landing.ts src/game/landing.ts
```

Quicker partial rollback (keep everything else, just turn off the randomized
course): set `EXPERIMENTAL_COURSE = false` in `src/game/config.ts` -- goes
back to the fixed, measured reference course.
