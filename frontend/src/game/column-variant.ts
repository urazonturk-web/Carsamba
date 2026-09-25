// GORSEL-011 (accepted, 2026-09-22): which of the three ChatGPT column
// sprites (wide/tall/medium) a given platform shows. VISUAL ONLY -- purely a
// function of the platform's own stable `id`, same style/hash as
// `classifyPlatformVisualType` in procedural-course.ts (not touched: this is
// a separate, additive module, not a change to platform generation).
export type ColumnVariant = 0 | 1 | 2; // 0 = wide, 1 = tall, 2 = medium

export function classifyColumnVariant(id: number): ColumnVariant {
  "worklet";
  if (id <= 0) return 0;
  const h = (Math.imul(id ^ 0x2545f491, 0x2545f491) >>> 0) % 3;
  return h as ColumnVariant;
}
