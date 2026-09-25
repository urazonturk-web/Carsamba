# Snapshot: ColumnSmoke integrated, first live (web) run confirmed (2026-09-18)

Not committed to git; this is a local, file-based checkpoint only, taken before
any further changes so this exact state can be restored.

## What this state is

- `GORSEL-004` (column-smoke visual effect) fully applied to the real repo by
  a prior session: `app/index.tsx` (+53 lines, 0 deletions) and new
  `src/game/ColumnSmoke.tsx`. Full rationale/review trail in
  `AI_REVIEW.md` under "GORSEL-004 column-smoke — technical handoff".
- `src/game/procedural-course.ts` also differs from checkpoint commit
  `7b8bd6b` (the course-variety-fix work from 2026-09-16/17, already
  documented in `AI_REVIEW.md` and covered by its own backup folder
  `../2026-09-16-liked-randomized-course-geometry-tightened/`).
- `jump.ts`, `landing.ts`, `config.ts`, camera/charge/score formulas: untouched
  (not included here — restore those from the 2026-09-16 backup folder above
  if ever needed, they haven't changed since).

## What was newly verified in this session (2026-09-18), that wasn't verified before

Previous sessions could not get a live visual run: no full Xcode on this
machine, and an earlier web-preview attempt froze because the browser tab was
backgrounded (React Native Web throttles `requestAnimationFrame` for hidden
tabs). This time the Expo web preview was run with the tab in the
**foreground**:
- App loads, bundles, and renders correctly with `ColumnSmoke.tsx` mounted.
- A real (trusted, not synthetic) press/charge/release was triggered twice;
  console `[jump-measurement]` logs confirmed real physics values each time.
- The physics loop visibly advanced in real time (character flew, fell, and
  the game reached a normal Game Over screen) — confirms the frame loop is
  NOT frozen/broken by the ColumnSmoke integration.
- No console errors during either run.
- **Not yet verified**: actually landing on a "smoky" platform and seeing the
  smoke effect itself — browser automation in this session could not reliably
  produce a medium-length press (only very short ~20-45ms taps), so no
  successful multi-platform run was achieved to reach a smoky platform while
  idle. This remains open; see `AI_REVIEW.md`'s daily summary.

## How to restore this exact state later

```bash
cp backups/2026-09-18-columnsmoke-integrated-and-web-tested/index.tsx app/index.tsx
cp backups/2026-09-18-columnsmoke-integrated-and-web-tested/ColumnSmoke.tsx src/game/ColumnSmoke.tsx
cp backups/2026-09-18-columnsmoke-integrated-and-web-tested/procedural-course.ts src/game/procedural-course.ts
```

Quicker partial rollback (remove only the column-smoke effect, keep everything
else): `git checkout -- app/index.tsx && rm src/game/ColumnSmoke.tsx` (this is
the same rollback already documented in `AI_REVIEW.md`'s GORSEL-004 entry,
since `app/index.tsx`'s only other pending change there was this same one).
