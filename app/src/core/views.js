// What each person is allowed to see. Privacy rules live here, in code:
//  - sitr: a campaign shows first name and purpose only, unless the borrower
//    chose to share their story (spec §A.1, Q40)
//  - lenders are told an extension was granted, never why (Q35)
//  - lenders never see each other's names; defaulters are never named publicly
import { RULES, RULESET_VERSION } from './rules.js';
import { checkInvariants } from './invariants.js';
import { PURPOSES } from './platform.js';

const LENDER_STATUS = {
  Repaying: 'Repaying', PaymentLate: 'Payment late', DefaultAfterCure: 'In default', RepaidInFull: 'Repaid in full',
};

export function dateOf(p, day) {
  const d = new Date(`${p.config.startDate}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + day);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

function campaignCard(p, c, viewer) {
  const b = p.members[c.borrower];
  const rec = p.borrowerRecord(c.borrower);
  const pledged = p.pledged(c);
  const mine = c.pledges.find((x) => x.lender === viewer);
  return {
    id: c.id, firstName: b.firstName, purpose: c.purpose, urgent: c.urgent,
    story: c.showStory ? c.story : '',
    target: c.target, minimum: c.minimum, pledged, remaining: c.target - pledged,
    lenders: c.pledges.length, status: c.status,
    closes: c.closesDay == null ? null : dateOf(p, c.closesDay),
    daysLeft: c.closesDay == null ? null : Math.max(0, c.closesDay - p.day),
    plan: `${c.installments} repayment${c.installments > 1 ? 's' : ''}, ${c.everyDays === 7 ? 'weekly' : c.everyDays === 14 ? 'every two weeks' : 'monthly'}`,
    record: rec.repaid ? `${rec.onTime} of ${rec.repaid} past loans repaid on time` : 'First loan on Qard',
    myPledge: mine ? mine.amount : 0,
    isMine: c.borrower === viewer,
  };
}

// Ranking uses need, time remaining and track record only — never anything a
// lender gains, because a lender gains nothing (spec §A.3).
function browse(p, viewer) {
  return Object.values(p.campaigns)
    .filter((c) => c.status === 'Open')
    .sort((a, b) => (b.urgent - a.urgent) || (a.closesDay - b.closesDay) || ((b.target - p.pledged(b)) - (a.target - p.pledged(a))))
    .map((c) => campaignCard(p, c, viewer));
}

function lenderView(p, id) {
  const shares = [];
  const helped = new Set();
  for (const l of Object.values(p.loans)) {
    const s = l.shares.find((x) => x.lender === id);
    if (!s) continue;
    helped.add(l.borrower);
    shares.push({
      loan: l.id, firstName: p.members[l.borrower].firstName, purpose: l.purpose,
      contribution: s.contribution, received: s.received, forgiven: s.forgiven,
      outstanding: s.contribution - s.forgiven - s.received,
      status: LENDER_STATUS[l.status], rawStatus: l.status,
      extensionGranted: l.extensions.length > 0,
      nextDue: (() => { const n = l.schedule.find((i) => i.paid < i.amount); return n ? dateOf(p, n.dueDay) : null; })(),
      coLenders: l.shares.length - 1,
    });
  }
  const pledges = Object.values(p.campaigns)
    .filter((c) => ['Open', 'FullyPledged', 'BelowTarget', 'PartialAccepted'].includes(c.status) && c.pledges.some((x) => x.lender === id))
    .map((c) => campaignCard(p, c, id));
  return {
    wallet: p.wallet(id), pledges, shares: shares.reverse(), helped: helped.size,
    lentOut: shares.reduce((a, s) => a + s.outstanding, 0),
    pledgedTotal: pledges.reduce((a, c) => a + c.myPledge, 0),
  };
}

function loanForBorrower(p, l) {
  const next = l.schedule.find((i) => i.paid < i.amount);
  return {
    id: l.id, purpose: l.purpose, principal: l.principal, paid: l.paid, forgiven: l.forgiven,
    outstanding: p.outstanding(l), status: l.status, lenders: l.shares.length,
    schedule: l.schedule.filter((i) => i.amount > 0).map((i) => ({ n: i.n, due: dateOf(p, i.dueDay), amount: i.amount, paid: i.paid, late: i.dueDay < p.day && i.paid < i.amount })),
    nextAmount: next ? next.amount - next.paid : 0,
    hardship: l.hardship ? { status: l.hardship.status } : null,
    extensions: l.extensions.length, charityDue: l.charityDue - l.charityPaid, charityUndertaking: l.charityUndertaking,
    contract: p.contracts[l.contract],
  };
}

function borrowerView(p, id) {
  const campaigns = Object.values(p.campaigns).filter((c) => c.borrower === id);
  const current = campaigns.filter((c) => ['Draft', 'Open', 'FullyPledged', 'BelowTarget', 'PartialAccepted'].includes(c.status)).map((c) => campaignCard(p, c, id))[0] || null;
  const loans = Object.values(p.loans).filter((l) => l.borrower === id);
  const active = loans.find((l) => l.status !== 'RepaidInFull');
  const lastCancelled = campaigns.filter((c) => c.status === 'Cancelled').slice(-1)[0];
  return {
    limit: p.borrowLimit(id), current, loan: active ? loanForBorrower(p, active) : null,
    past: loans.filter((l) => l.status === 'RepaidInFull').map((l) => ({ id: l.id, principal: l.principal, purpose: l.purpose, onTime: !l.everLate, forgiven: l.forgiven })),
    lastCancelled: lastCancelled && !current && !active ? { id: lastCancelled.id, reason: lastCancelled.closedReason } : null,
    canStart: !current && !active,
  };
}

function operatorView(p) {
  const name = (id) => p.members[id]?.name || id;
  const C = Object.values(p.campaigns);
  const Ls = Object.values(p.loans);
  return {
    review: C.filter((c) => c.status === 'Draft').map((c) => ({ ...campaignCard(p, c, null), fullName: name(c.borrower), story: c.story, showStory: c.showStory, limit: p.borrowLimit(c.borrower) })),
    toDisburse: C.filter((c) => ['FullyPledged', 'PartialAccepted'].includes(c.status)).map((c) => ({ ...campaignCard(p, c, null), fullName: name(c.borrower) })),
    hardship: Ls.filter((l) => l.hardship?.status === 'pending').map((l) => ({ loan: l.id, fullName: name(l.borrower), note: l.hardship.note, outstanding: p.outstanding(l), opened: dateOf(p, l.hardship.openedDay) })),
    late: Ls.filter((l) => l.status === 'PaymentLate' || l.status === 'DefaultAfterCure').map((l) => ({
      loan: l.id, fullName: name(l.borrower), status: l.status, outstanding: p.outstanding(l), daysLate: l.lateSince == null ? null : p.day - l.lateSince,
      canCharge: l.status === 'PaymentLate' && l.charityUndertaking > 0 && !l.charityChargedForEpisode && l.hardship?.status !== 'pending',
      charityDue: l.charityDue - l.charityPaid,
    })),
    loans: Ls.map((l) => ({ id: l.id, fullName: name(l.borrower), principal: l.principal, paid: l.paid, forgiven: l.forgiven, outstanding: p.outstanding(l), status: l.status, lenders: l.shares.length })).reverse(),
    book: { outstanding: Ls.reduce((a, l) => a + p.outstanding(l), 0), committed: p.bookOutstanding(), cap: p.config.bookCap, custody: -p.ledger.balance('world'), charity: p.ledger.balance('charity') },
    ledger: p.ledger.entries.slice(-40).reverse().map((e) => ({ seq: e.seq, date: dateOf(p, e.day), type: e.type, ref: e.ref, postings: e.postings })),
    ledgerCount: p.ledger.entries.length,
    rules: RULES.map((r) => ({ id: r.id, text: r.text, basis: r.basis, passes: p.rules.passes[r.id] })),
    rulesetVersion: RULESET_VERSION,
    blocked: p.rejections.filter((r) => r.rule).slice(-12).reverse().map((r) => ({ ...r, date: dateOf(p, r.day) })),
    invariants: checkInvariants(p),
    audit: p.audit.slice(-30).reverse().map((a) => ({ date: dateOf(p, a.day), text: a.text })),
    selfTestLoan: (Ls.find((l) => l.status !== 'RepaidInFull' && l.shares.filter((s) => p.shareOutstanding(s) > 0).length > 1) || {}).id || null,
  };
}

export function buildView(p, viewer) {
  const me = p.members[viewer];
  if (!me) throw new Error('Unknown member');
  const isOp = me.roles.includes('operator');
  return {
    today: dateOf(p, p.day), day: p.day,
    me: { id: me.id, name: me.name, firstName: me.firstName, isOperator: isOp },
    people: Object.values(p.members).map((m) => {
      const b = borrowerView(p, m.id);
      const hint = m.roles.includes('operator') ? 'operator' : b.loan ? 'has a loan' : b.current ? 'has a campaign' : (p.wallet(m.id) > 0 || lenderView(p, m.id).shares.length) ? 'lender' : '';
      return { id: m.id, name: m.name, isOperator: m.roles.includes('operator'), hint };
    }),
    config: { min: p.config.minContribution, purposes: PURPOSES, charityUndertaking: p.config.charityUndertaking, rulingRef: p.config.rulingRef },
    browse: isOp ? [] : browse(p, viewer),
    lender: isOp ? null : lenderView(p, viewer),
    borrower: isOp ? null : borrowerView(p, viewer),
    operator: isOp ? operatorView(p) : null,
  };
}
