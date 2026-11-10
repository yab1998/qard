import { test } from 'node:test';
import assert from 'node:assert/strict';
import { allocate, cumulativeLargestRemainder } from '../src/core/distribution.js';

const mk = (contribs) => contribs.map((c, i) => ({ id: `L${i}`, contribution: c, received: 0, order: i }));
const live = (shares) => shares.map((s) => ({ id: s.id, order: s.order, outstanding: s.contribution - s.received }));

test('splits a payment pro rata and gives the odd cent to the largest remainder', () => {
  const a = allocate([{ id: 'A', outstanding: 5000, order: 1 }, { id: 'B', outstanding: 3500, order: 2 }, { id: 'C', outstanding: 1500, order: 3 }], 3333);
  assert.deepEqual(a, { A: 1666, B: 1167, C: 500 });
});

test('ties go to the earliest pledge', () => {
  const a = allocate([{ id: 'late', outstanding: 500, order: 2 }, { id: 'early', outstanding: 500, order: 1 }], 1);
  assert.deepEqual(a, { late: 0, early: 1 });
});

test('refuses a payment above what is owed', () => {
  assert.throws(() => allocate([{ id: 'A', outstanding: 500, order: 1 }], 501));
});

test('random loans: exact sums, never above the share, exact settlement', () => {
  let seed = 42;
  const rnd = (n) => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed % n; };
  for (let t = 0; t < 3000; t++) {
    const shares = mk(Array.from({ length: 1 + rnd(30) }, () => 500 * (1 + rnd(20))));
    const total = shares.reduce((a, s) => a + s.contribution, 0);
    let paid = 0;
    while (paid < total) {
      const p = Math.min(total - paid, 1 + rnd(Math.max(2, Math.floor(total / (1 + rnd(12))))));
      const a = allocate(live(shares).filter((s) => s.outstanding > 0), p);
      let s = 0;
      for (const sh of shares) {
        const got = a[sh.id] || 0;
        assert.ok(got >= 0);
        sh.received += got; s += got;
        assert.ok(sh.received <= sh.contribution);
      }
      assert.equal(s, p);
      paid += p;
    }
    for (const sh of shares) assert.equal(sh.received, sh.contribution);
  }
});

test("the spec's literal cumulative method can demand a cent back (why this engine differs)", () => {
  // Lenders of $60, $5 and $50; payments of these sizes in cents.
  const shares = mk([6000, 500, 5000]);
  let paid = 0; let prev = { L0: 0, L1: 0, L2: 0 }; let clawback = false;
  for (const p of [802, 25, 9319, 208, 788, 3]) {
    paid += p;
    const now = cumulativeLargestRemainder(shares, paid);
    for (const id of Object.keys(now)) if (now[id] < prev[id]) clawback = true;
    prev = now;
  }
  assert.equal(clawback, true);
});
