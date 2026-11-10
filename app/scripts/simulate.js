// Gate G4 (business plan): "a 10,000-loan simulation distributes with
// zero-cent discrepancy". Runs every loan through the real platform — rules
// engine, ledger and all — with random lenders, odd-cent payments, partial
// forgiveness, late payments and hardship extensions.
import { Platform } from '../src/core/platform.js';
import { checkInvariants } from '../src/core/invariants.js';
import { fmt } from '../src/core/money.js';

const LOANS = Number(process.argv[2] || 10000);
let seed = Number(process.argv[3] || 20261214);
const rnd = (n) => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed % n; };

const p = new Platform({ bookCap: Number.MAX_SAFE_INTEGER, limitLadder: [50000], firstLoanCap: 50000 });
p.dispatch({ type: 'registerMember', name: 'Operator', roles: ['operator'] });
const LENDERS = 400;
const lenders = [];
for (let i = 0; i < LENDERS; i++) {
  const id = p.dispatch({ type: 'registerMember', name: `Lender ${i}` });
  p.dispatch({ type: 'deposit', actor: id, amount: 100000000 });
  lenders.push(id);
}
const deposited = 100000000;

const t0 = Date.now();
let payments = 0, forgiveness = 0, extensions = 0, maxDrift = 0, shareCount = 0, principalTotal = 0;
for (let n = 0; n < LOANS; n++) {
  const b = p.dispatch({ type: 'registerMember', name: `Borrower ${n}` });
  const target = 500 * (4 + rnd(97)); // $20 – $500
  const c = p.dispatch({ type: 'createCampaign', actor: b, target, purpose: 'Other', installments: 1 + rnd(8), everyDays: [7, 14, 30][rnd(3)] });
  p.dispatch({ type: 'approveCampaign', actor: 'M1', campaign: c });
  let left = target; const used = new Set();
  while (left > 0) {
    let l; do { l = lenders[rnd(LENDERS)]; } while (used.has(l));
    used.add(l);
    const amt = Math.min(left, 500 * (1 + rnd(rnd(4) === 0 ? 40 : 6)));
    p.dispatch({ type: 'pledge', actor: l, campaign: c, amount: amt });
    left -= amt;
  }
  const loanId = p.dispatch({ type: 'disburse', actor: 'M1', campaign: c });
  const loan = p.loans[loanId];
  shareCount += loan.shares.length; principalTotal += loan.principal;

  while (loan.status !== 'RepaidInFull') {
    const roll = rnd(100);
    if (roll < 4) {
      const s = loan.shares[rnd(loan.shares.length)];
      const out = p.shareOutstanding(s);
      if (out > 0) { p.dispatch({ type: 'forgive', actor: s.lender, loan: loanId, amount: 1 + rnd(out) }); forgiveness++; continue; }
    }
    if (roll >= 4 && roll < 7 && loan.hardship?.status !== 'pending') {
      p.dispatch({ type: 'declareHardship', actor: b, loan: loanId });
      p.dispatch({ type: 'decideHardship', actor: 'M1', loan: loanId, grant: true });
      extensions++; continue;
    }
    const owed = p.outstanding(loan);
    const amt = rnd(3) === 0 ? Math.min(owed, 1 + rnd(700)) : Math.min(owed, 1 + rnd(owed));
    p.dispatch({ type: 'repay', actor: b, loan: loanId, amount: amt });
    payments++;
    // Drift from each lender's exact pro-rata line, in cents (only meaningful before any forgiveness).
    if (loan.forgiven === 0) {
      for (const s of loan.shares) {
        const d = Math.abs(s.received * loan.principal - s.contribution * loan.paid) / loan.principal;
        if (d > maxDrift) maxDrift = d;
      }
    }
  }
  for (const s of loan.shares) {
    if (s.received !== s.contribution - s.forgiven) throw new Error(`Discrepancy on ${loanId}`);
  }
}

const inv = checkInvariants(p);
const failed = inv.filter((i) => !i.ok);
// Every lender's wallet must equal deposits minus exactly what they forgave.
let walletGap = 0;
const forgivenBy = {};
for (const l of Object.values(p.loans)) for (const s of l.shares) forgivenBy[s.lender] = (forgivenBy[s.lender] || 0) + s.forgiven;
for (const id of lenders) walletGap += Math.abs(p.wallet(id) - (deposited - (forgivenBy[id] || 0)));

console.log(`Loans simulated            ${LOANS.toLocaleString()}`);
console.log(`Principal lent             ${fmt(principalTotal)}`);
console.log(`Lender shares              ${shareCount.toLocaleString()}`);
console.log(`Borrower payments          ${payments.toLocaleString()}`);
console.log(`Forgiveness events         ${forgiveness.toLocaleString()}`);
console.log(`Hardship extensions        ${extensions.toLocaleString()}`);
console.log(`Ledger transactions        ${p.ledger.entries.length.toLocaleString()}`);
console.log(`Rule checks passed         ${Object.values(p.rules.passes).reduce((a, b) => a + b, 0).toLocaleString()}`);
console.log(`Transactions blocked       ${p.rejections.length}`);
console.log(`Largest mid-loan drift     ${maxDrift.toFixed(2)} cents from the exact pro-rata line (always 0 at settlement)`);
console.log(`Discrepancy at settlement  ${walletGap} cents`);
console.log(`Invariants                 ${inv.length - failed.length} of ${inv.length} pass`);
console.log(`Time                       ${((Date.now() - t0) / 1000).toFixed(1)}s`);
if (failed.length || walletGap) { console.error(failed); process.exit(1); }
