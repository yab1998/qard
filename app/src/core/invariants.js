// Ledger invariants from spec §"Technical architecture and data model",
// checked against the whole state. Gate G4 requires all of them to pass.
import { sum } from './money.js';

export function checkInvariants(p) {
  const out = [];
  const add = (name, problems) => out.push({ name, ok: problems.length === 0, problems: problems.slice(0, 5) });
  const L = p.ledger;
  const loans = Object.values(p.loans);

  add('The ledger balances: every transaction sums to zero', L.trialBalance() === 0 ? [] : [`trial balance is ${L.trialBalance()}`]);

  add('Custodial cash is fully accounted for (wallets + pledges + charity = money received)',
    L.balance('world') + L.sumPrefix('wallet:') + L.sumPrefix('pledge:') + L.balance('charity') + L.balance('purification') === 0 ? [] : ['cash accounts do not tie to the outside world']);

  add("Lender shares sum to the principal disbursed", loans.filter((l) => sum(l.shares.map((s) => s.contribution)) !== l.principal).map((l) => l.id));

  add('Borrower payments never exceed principal (net of forgiveness), and equal it when repaid', loans.filter((l) => {
    const owed = l.principal - l.forgiven;
    return l.paid > owed || (l.status === 'RepaidInFull' && l.paid !== owed) || -L.balance(`obligation:${l.id}`) !== owed - l.paid;
  }).map((l) => l.id));

  const badShares = [];
  for (const l of loans) for (const s of l.shares) {
    const owed = s.contribution - s.forgiven;
    if (s.received > owed) badShares.push(`${l.id}/${s.lender} received more than lent`);
    if (L.balance(`share:${l.id}:${s.lender}`) !== owed - s.received) badShares.push(`${l.id}/${s.lender} ledger mismatch`);
    if (l.status === 'RepaidInFull' && s.received !== owed) badShares.push(`${l.id}/${s.lender} not settled exactly`);
  }
  add('No lender receives more than they lent; each is settled exactly when the loan is repaid', badShares);

  add("Each payment's distribution sums exactly to the payment — no residue with the platform",
    p.distributions.filter((d) => sum(Object.values(d.allocations)) !== d.payment || Object.values(d.allocations).some((v) => v < 0)).map((d) => d.id));

  const badPledges = [];
  for (const c of Object.values(p.campaigns)) {
    const held = L.sumPrefix(`pledge:${c.id}:`);
    const expected = ['Open', 'FullyPledged', 'BelowTarget', 'PartialAccepted'].includes(c.status) ? p.pledged(c) : 0;
    if (held !== expected) badPledges.push(c.id);
    if (p.pledged(c) > c.target) badPledges.push(`${c.id} overfunded`);
  }
  add('Pledges are held intact, earn nothing, and are released in full when a campaign fails', badPledges);

  const neg = [];
  for (const [k, v] of L.balances) if (k.startsWith('wallet:') && v < 0) neg.push(k);
  add('No wallet is ever negative (the platform never fronts money)', neg);

  add('Charity-undertaking receipts sit only in the charity account',
    L.balance('charity') === sum(loans.map((l) => l.charityPaid)) ? [] : ['charity account does not match undertakings paid']);

  add('Every contract cites a Board ruling reference', Object.values(p.contracts).filter((k) => !k.rulingRef).map((k) => k.id));

  return out;
}
