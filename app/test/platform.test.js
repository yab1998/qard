import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Platform } from '../src/core/platform.js';
import { RuleViolation } from '../src/core/rules.js';
import { checkInvariants } from '../src/core/invariants.js';
import { buildView } from '../src/core/views.js';
import { seededPlatform } from '../src/core/seed.js';

function setup() {
  const p = new Platform();
  p.dispatch({ type: 'registerMember', name: 'Op', roles: ['operator'] }); // M1
  for (const n of ['Lender One', 'Lender Two', 'Lender Three', 'Borrower B']) p.dispatch({ type: 'registerMember', name: n }); // M2-M4, M5
  for (const m of ['M2', 'M3', 'M4']) p.dispatch({ type: 'deposit', actor: m, amount: 20000 });
  return p;
}
function fund(p, pledges = { M2: 5000, M3: 3500, M4: 1500 }, extra = {}) {
  const target = extra.target ?? Object.values(pledges).reduce((a, b) => a + b, 0);
  const c = p.dispatch({ type: 'createCampaign', actor: 'M5', target, purpose: 'Car repair', installments: 3, everyDays: 14, ...extra });
  p.dispatch({ type: 'approveCampaign', actor: 'M1', campaign: c });
  for (const [m, a] of Object.entries(pledges)) p.dispatch({ type: 'pledge', actor: m, campaign: c, amount: a });
  return c;
}
const allOk = (p) => assert.deepEqual(checkInvariants(p).filter((i) => !i.ok), []);

test('full life of a loan: pledge, disburse, repay, every lender made exactly whole', () => {
  const p = setup();
  const c = fund(p);
  assert.equal(p.campaigns[c].status, 'FullyPledged');
  const l = p.dispatch({ type: 'disburse', actor: 'M1', campaign: c });
  assert.equal(p.wallet('M2'), 15000);
  for (const amt of [3333, 1, 2999, 3667]) p.dispatch({ type: 'repay', actor: 'M5', loan: l, amount: amt });
  assert.equal(p.loans[l].status, 'RepaidInFull');
  assert.equal(p.wallet('M2'), 20000);
  assert.equal(p.wallet('M3'), 20000);
  assert.equal(p.wallet('M4'), 20000);
  allOk(p);
});

test('the borrower cannot pay more than the principal', () => {
  const p = setup();
  const l = p.dispatch({ type: 'disburse', actor: 'M1', campaign: fund(p) });
  assert.throws(() => p.dispatch({ type: 'repay', actor: 'M5', loan: l, amount: 10001 }), RuleViolation);
  assert.equal(p.loans[l].paid, 0);
  allOk(p);
});

test('pledge rules: $5 multiples, no overfunding, no self-funding', () => {
  const p = setup();
  const c = fund(p, { M2: 5000 }, { target: 10000 });
  assert.throws(() => p.dispatch({ type: 'pledge', actor: 'M3', campaign: c, amount: 1234 }), /PLEDGE-MINIMUM/);
  assert.throws(() => p.dispatch({ type: 'pledge', actor: 'M3', campaign: c, amount: 5500 }), /PLEDGE-NO-OVERFUNDING/);
  p.dispatch({ type: 'deposit', actor: 'M5', amount: 5000 });
  assert.throws(() => p.dispatch({ type: 'pledge', actor: 'M5', campaign: c, amount: 500 }), /PLEDGE-NO-SELF-FUNDING/);
  assert.equal(p.rejections.length, 3);
  allOk(p);
});

test('a pledge can be withdrawn while open and comes back in full', () => {
  const p = setup();
  const c = fund(p, { M2: 5000 }, { target: 10000 });
  p.dispatch({ type: 'withdrawPledge', actor: 'M2', campaign: c });
  assert.equal(p.wallet('M2'), 20000);
  allOk(p);
});

test('a campaign that ends below its minimum releases every pledge, no fee', () => {
  const p = setup();
  const c = fund(p, { M2: 2000 }, { target: 10000, minimum: 6000 });
  p.dispatch({ type: 'advanceClock', actor: 'M1', days: 8 });
  assert.equal(p.campaigns[c].status, 'Cancelled');
  assert.equal(p.wallet('M2'), 20000);
  allOk(p);
});

test('partial funding needs the borrower to accept', () => {
  const p = setup();
  const c = fund(p, { M2: 4000, M3: 3000 }, { target: 10000, minimum: 6000 });
  p.dispatch({ type: 'advanceClock', actor: 'M1', days: 8 });
  assert.equal(p.campaigns[c].status, 'BelowTarget');
  assert.throws(() => p.dispatch({ type: 'disburse', actor: 'M1', campaign: c }));
  p.dispatch({ type: 'acceptPartial', actor: 'M5', campaign: c });
  const l = p.dispatch({ type: 'disburse', actor: 'M1', campaign: c });
  assert.equal(p.loans[l].principal, 7000);
  allOk(p);
});

test("forgiveness reduces only the forgiving lender's share", () => {
  const p = setup();
  const l = p.dispatch({ type: 'disburse', actor: 'M1', campaign: fund(p) });
  p.dispatch({ type: 'repay', actor: 'M5', loan: l, amount: 3333 });
  p.dispatch({ type: 'forgive', actor: 'M4', loan: l, amount: 1000 }); // M4 was owed 1000 after receiving 500
  assert.equal(p.outstanding(p.loans[l]), 10000 - 3333 - 1000);
  p.dispatch({ type: 'repay', actor: 'M5', loan: l, amount: 5667 });
  assert.equal(p.loans[l].status, 'RepaidInFull');
  assert.equal(p.wallet('M2'), 20000);
  assert.equal(p.wallet('M3'), 20000);
  assert.equal(p.wallet('M4'), 19000); // lent 1500, received 500, forgave 1000
  allOk(p);
});

test('late payment adds nothing; hardship extension binds all lenders and hides the reason', () => {
  const p = setup();
  const l = p.dispatch({ type: 'disburse', actor: 'M1', campaign: fund(p) });
  p.dispatch({ type: 'advanceClock', actor: 'M1', days: 15 });
  assert.equal(p.loans[l].status, 'PaymentLate');
  assert.equal(p.outstanding(p.loans[l]), 10000);
  p.dispatch({ type: 'declareHardship', actor: 'M5', loan: l, note: 'Lost my job' });
  p.dispatch({ type: 'decideHardship', actor: 'M1', loan: l, grant: true, days: 30 });
  assert.equal(p.loans[l].status, 'Repaying');
  assert.equal(p.outstanding(p.loans[l]), 10000);
  const lenderSees = JSON.stringify(buildView(p, 'M2'));
  assert.ok(!lenderSees.includes('Lost my job'));
  assert.equal(buildView(p, 'M2').lender.shares[0].extensionGranted, true);
  allOk(p);
});

test('wilful delay: the undertaking goes to charity, never to lenders or the platform', () => {
  const p = setup();
  const l = p.dispatch({ type: 'disburse', actor: 'M1', campaign: fund(p) });
  p.dispatch({ type: 'advanceClock', actor: 'M1', days: 15 });
  p.dispatch({ type: 'markWilfulDelay', actor: 'M1', loan: l });
  const before = ['M2', 'M3', 'M4'].map((m) => p.wallet(m));
  p.dispatch({ type: 'payCharity', actor: 'M5', loan: l });
  assert.equal(p.ledger.balance('charity'), 500);
  assert.deepEqual(['M2', 'M3', 'M4'].map((m) => p.wallet(m)), before);
  assert.equal(p.outstanding(p.loans[l]), 10000);
  allOk(p);
});

test('default after the cure period adds nothing to the debt', () => {
  const p = setup();
  const l = p.dispatch({ type: 'disburse', actor: 'M1', campaign: fund(p) });
  p.dispatch({ type: 'advanceClock', actor: 'M1', days: 60 });
  assert.equal(p.loans[l].status, 'DefaultAfterCure');
  assert.equal(p.outstanding(p.loans[l]), 10000);
  assert.equal(p.borrowLimit('M5'), 0);
  allOk(p);
});

test('tips, late fees, paid priority and overpayment are blocked and logged', () => {
  const p = setup();
  const l = p.dispatch({ type: 'disburse', actor: 'M1', campaign: fund(p) });
  for (const kind of ['tip', 'late_fee', 'priority', 'overpay']) {
    assert.throws(() => p.dispatch({ type: 'attemptForbidden', actor: 'M1', kind, loan: l }), RuleViolation);
  }
  assert.deepEqual(p.rejections.map((r) => r.rule), ['TX-ALLOWLIST', 'TX-ALLOWLIST', 'DISTRIBUTION-PARI-PASSU', 'BORROWER-PRINCIPAL-ONLY']);
  assert.equal(p.ledger.entries.filter((e) => e.type === 'tip' || e.type === 'late_fee').length, 0);
  allOk(p);
});

test('limits: $100 first loan, one loan at a time, operator-only actions', () => {
  const p = setup();
  assert.throws(() => p.dispatch({ type: 'createCampaign', actor: 'M5', target: 15000, purpose: 'Car repair' }), /limit/);
  const c = fund(p);
  assert.throws(() => p.dispatch({ type: 'createCampaign', actor: 'M5', target: 5000, purpose: 'Car repair' }), /one open campaign/);
  assert.throws(() => p.dispatch({ type: 'disburse', actor: 'M2', campaign: c }), /operator/);
});

test('sitr: a campaign shows first name only, and the story only if the borrower opts in', () => {
  const p = setup();
  fund(p, { M2: 500 }, { target: 10000, story: 'private details', showStory: false });
  const seen = JSON.stringify(buildView(p, 'M3').browse);
  assert.ok(!seen.includes('private details'));
  assert.ok(!seen.includes('Borrower B'));
  assert.ok(seen.includes('Borrower'));
});

test('replaying the command log rebuilds identical state', () => {
  const p = seededPlatform();
  p.dispatch({ type: 'repay', actor: 'M7', loan: 'L1', amount: 2500 });
  try { p.dispatch({ type: 'pledge', actor: 'M2', campaign: 'C2', amount: 123 }); } catch {}
  const q = Platform.replay(JSON.parse(JSON.stringify(p.log)));
  assert.deepEqual([...q.ledger.balances], [...p.ledger.balances]);
  assert.deepEqual(q.loans, p.loans);
  assert.deepEqual(q.rejections, p.rejections);
  allOk(q);
});
