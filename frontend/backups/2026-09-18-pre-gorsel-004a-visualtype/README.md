# Snapshot: pre-GORSEL-004A state (2026-09-18)

Taken immediately before implementing the `visualType`/chimney-asset
architecture (GORSEL-004A). At this point `isSmokyPlatform(id)` is still the
live mechanism gating `ColumnSmoke`, and `PlatformView` renders every
platform identically (plain brick tower, no chimney art). GORSEL-004B (real
iPhone shows no smoke at all) is still open and unrelated to this checkpoint.

## Restore

```bash
cp backups/2026-09-18-pre-gorsel-004a-visualtype/index.tsx app/index.tsx
cp backups/2026-09-18-pre-gorsel-004a-visualtype/ColumnSmoke.tsx src/game/ColumnSmoke.tsx
cp backups/2026-09-18-pre-gorsel-004a-visualtype/procedural-course.ts src/game/procedural-course.ts
cp backups/2026-09-18-pre-gorsel-004a-visualtype/reference-course.ts src/game/reference-course.ts
```

`src/game/copy.ts` and `assets/environment/chimney-platform.png` are not
covered by this checkpoint (unrelated / additive-only, not modified by
GORSEL-004A besides being introduced by it in the asset's case).
