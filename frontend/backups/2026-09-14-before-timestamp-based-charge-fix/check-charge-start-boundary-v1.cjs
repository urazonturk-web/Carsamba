// Tests the ACTUAL app/index.tsx charge-accumulation logic (onPressIn, the
// useFrameCallback frame loop, onPressOut, cancelCharge) extracted from the
// real source via TypeScript AST, run in a sandboxed VM -- not a separate
// hand-written reproduction. Mirrors the existing work/check-touch-time.cjs
// pattern used by this project.
const fs = require('fs'), vm = require('vm'), assert = require('assert/strict');
const root = '/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend';
const ts = require(root + '/node_modules/typescript');

function compile(file, imports = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports, require: id => imports[id] });
  return exports;
}
const cfg = compile(root + '/src/game/config.ts'), C = cfg.CONFIG;
const jump = compile(root + '/src/game/jump.ts', { './config': cfg });
const landing = compile(root + '/src/game/landing.ts', { './config': cfg });

const srcText = fs.readFileSync(root + '/app/index.tsx', 'utf8');
const src = ts.createSourceFile('index.tsx', srcText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

const varNodes = new Map();
let frameCallbackNode = null;
function visit(n) {
  if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.initializer) varNodes.set(n.name.text, n.initializer);
  if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === 'useFrameCallback') {
    frameCallbackNode = n.arguments[0];
  }
  ts.forEachChild(n, visit);
}
visit(src);
assert.ok(frameCallbackNode, 'useFrameCallback callback not found in app/index.tsx -- source shape changed');

const ctx = {
  ...cfg, ...jump, ...landing, Math, Date,
  W: 393, H: 852, PW: 54, PH: 54, CHARACTER_WIDTH: 54 * 2.16, CHARACTER_HEIGHT: 54 * 2.16,
  lerp: (a, b, t) => a + (b - a) * t,
  useCallback: f => f, runOnUI: f => f, runOnJS: f => f, setGameReady: () => {},
  withTiming: v => v, withSpring: v => v, withSequence: (...a) => a[a.length - 1],
  reportJump: () => {}, onLanding: () => {}, onGameOver: () => {}, pushDebug: () => {},
  __DEV__: true,
  console,
};
vm.createContext(ctx);
for (const [name, n] of varNodes) if (n.getText(src).startsWith('useSharedValue')) ctx[name] = { value: vm.runInContext(n.arguments[0].getText(src), ctx) };
function evalNode(n) { return vm.runInContext(ts.transpileModule('(' + n.getText(src) + ')', { compilerOptions: { target: ts.ScriptTarget.ES2020 } }).outputText, ctx); }
for (const name of ['rand', 'makeNextPlatform', 'initWorld']) ctx[name] = evalNode(varNodes.get(name));
for (const name of ['onPressIn', 'onPressOut', 'cancelCharge']) ctx[name] = evalNode(varNodes.get(name));
ctx.frameTick = evalNode(frameCallbackNode);

// Confirm the new boundary-guard shared value actually exists in the real
// source (fails loudly if the fix was reverted or renamed).
assert.ok('chargeStartPending' in ctx, 'chargeStartPending shared value not found -- boundary fix appears missing from app/index.tsx');

function reset() {
  ctx.phase.value = 0; // IDLE
  ctx.running.value = 1;
  ctx.platforms.value = [];
  ctx.charge.value = 0;
  ctx.chargeStartPending.value = 0;
  ctx.touchStartedAt.value = 0;
}
function tick(ms) { ctx.frameTick({ timeSincePreviousFrame: ms, timestamp: 0, timeSinceFirstFrame: 0 }); }
const EPS = 1e-9;

// ---------------------------------------------------------------------
// 1) Charging starts NEAR THE END of a long frame interval (Codex's exact
//    example): interval is 150ms, press-down happens 10ms before the next
//    tick. The tick must NOT credit the 140ms that preceded the press.
// ---------------------------------------------------------------------
reset();
ctx.onPressIn({ nativeEvent: { timestamp: 1000 } }); // press at t=1000ms (native clock)
tick(150); // first frame tick after press; rawDt=150ms spans mostly pre-press time
assert.ok(ctx.charge.value < EPS, `expected 0 charge credited on the boundary tick, got ${ctx.charge.value}`);
console.log('PASS charge-start boundary: 150ms interval with press 10ms before next tick credits 0, not 150ms');

// Subsequent normal-cadence ticks must resume accumulating correctly.
tick(16.7);
assert.ok(Math.abs(ctx.charge.value - 16.7 / 1000 / C.maxChargeDuration) < 1e-6, `expected one frame worth of charge after boundary tick, got ${ctx.charge.value}`);
console.log('PASS charge-start boundary: next tick after the boundary accumulates normally');

// ---------------------------------------------------------------------
// 2) Charging starts MIDWAY through a normal (non-hitch) frame: also must
//    not overcredit, just undercredit by the small pre-press fraction.
// ---------------------------------------------------------------------
reset();
ctx.onPressIn({ nativeEvent: { timestamp: 2000 } });
tick(16.7); // a perfectly ordinary frame interval, press happened partway through it
assert.ok(ctx.charge.value < EPS, `expected 0 on the very first tick even for an ordinary-length interval, got ${ctx.charge.value}`);
tick(16.7);
assert.ok(Math.abs(ctx.charge.value - 16.7 / 1000 / C.maxChargeDuration) < 1e-6);
console.log('PASS charge-start boundary: ordinary-length first interval also does not overcredit');

// ---------------------------------------------------------------------
// 3) A hitch ENTIRELY WITHIN an existing hold must still fully catch up
//    (this is last round's fix; confirm the new guard did not reintroduce
//    the under-credit bug for genuine mid-hold hitches).
// ---------------------------------------------------------------------
reset();
ctx.onPressIn({ nativeEvent: { timestamp: 3000 } });
tick(16.7); // boundary tick, credits 0 (expected, see test 1)
tick(16.7); // normal
tick(150);  // hitch, fully inside the hold -- must credit the full 150ms
const expectedAfterHitch = (16.7 + 150) / 1000 / C.maxChargeDuration;
assert.ok(Math.abs(ctx.charge.value - expectedAfterHitch) < 1e-6, `expected mid-hold hitch to be fully credited, got ${ctx.charge.value} vs ${expectedAfterHitch}`);
console.log('PASS charge-start boundary: mid-hold hitch still fully catches up (no regression on last round\'s fix)');

// ---------------------------------------------------------------------
// 4) Cancellation, then a NEW hold: the new hold's first tick must not
//    inherit any credit from the gap between cancel and the new press.
// ---------------------------------------------------------------------
reset();
ctx.onPressIn({ nativeEvent: { timestamp: 4000 } });
tick(16.7);
tick(16.7);
ctx.cancelCharge();
assert.equal(ctx.phase.value, 0);
assert.equal(ctx.charge.value, 0);
assert.equal(ctx.chargeStartPending.value, 0);
// A long gap passes (simulating idle time) before the next press.
ctx.onPressIn({ nativeEvent: { timestamp: 4500 } });
tick(300); // long interval spanning [cancel .. new press .. this tick]
assert.ok(ctx.charge.value < EPS, `expected new hold after cancel to credit 0 on its first tick, got ${ctx.charge.value}`);
console.log('PASS charge-start boundary: cancel + new hold does not inherit the idle gap');

// ---------------------------------------------------------------------
// 5) Launch physics is untouched: native-timestamp-derived c/vx/vy must be
//    identical regardless of what the visual charge accumulator saw.
// ---------------------------------------------------------------------
for (const ms of [0, 20, 50, 100, 130, 450, 600]) {
  reset();
  ctx.onPressIn({ nativeEvent: { timestamp: 10000 } });
  ctx.charge.value = 0.37; // arbitrary stale visual value, must not affect launch
  ctx.onPressOut({ nativeEvent: { timestamp: 10000 + ms } });
  const expectedC = Math.min(1, ms / 450);
  assert.ok(Math.abs(ctx.releasedCharge.value - expectedC) < 1e-9, `launch charge changed for ${ms}ms hold`);
  const v = jump.jumpVelocity(expectedC, ctx.W);
  assert.ok(Math.abs(ctx.vx.value - v.vx) < 1e-8 && Math.abs(ctx.vy.value - v.vy) < 1e-8, `launch velocity changed for ${ms}ms hold`);
}
console.log('PASS launch physics unaffected by the visual-charge boundary fix (0/20/50/100/130/450/600ms)');

console.log('\nALL PASS');
