// Shari'a rules engine — "rules as code" (spec §Shariah governance).
//
// Every money movement is evaluated here BEFORE it is posted to the ledger.
// A failing rule blocks the transaction and records an alert for compliance.
//
// IMPORTANT: no fatwa has been issued. Every rule below encodes the spec's
// PROPOSED position and carries the question or provisional ruling it is
// waiting on. When the Board rules, each rule gets a real resolution ID and a
// version bump through change control.

export class RuleViolation extends Error {
  constructor(rule, detail) {
    super(`${rule.id}: ${detail}`);
    this.rule = rule;
    this.detail = detail;
  }
}

export const RULESET_VERSION = '0.1.0-provisional';

// Transaction types the ledger will accept. Anything else is refused outright.
const ALLOWED_TX = new Set([
  'deposit', 'withdrawal', 'pledge', 'pledge_release', 'disbursement',
  'repayment', 'forgiveness', 'charity_undertaking', 'purification',
]);

export const RULES = [
  {
    id: 'TX-ALLOWLIST',
    on: ['ledger'],
    basis: 'R1 (provisional); spec §Platform revenue model, "Not permitted"',
    text: 'Only known transaction types can be posted. Tips, late fees, borrower fees, interest and paid priority have no transaction type at all.',
    check: ({ tx }) => (ALLOWED_TX.has(tx.type) ? null : `"${tx.type}" is not a permitted transaction`),
  },
  {
    id: 'LENDER-NO-INCREMENT',
    on: ['distribution'],
    basis: 'Q4–Q13, Q33 (pending); kull qard jarra nafʿan fa-huwa riba',
    text: "A lender's cumulative receipts never exceed that lender's contribution.",
    check: ({ loan, allocations }) => {
      for (const s of loan.shares) {
        const after = s.received + (allocations[s.lender] || 0);
        if (after > s.contribution - s.forgiven) return "a lender would receive more than they lent";
      }
      return null;
    },
  },
  {
    id: 'DISTRIBUTION-NO-RESIDUE',
    on: ['distribution'],
    basis: 'Q33 (pending); spec ledger invariants',
    text: "Each payment's distribution sums exactly to the payment. The platform keeps no residue.",
    check: ({ payment, allocations }) => {
      const total = Object.values(allocations).reduce((a, b) => a + b, 0);
      if (Object.values(allocations).some((v) => v < 0)) return 'negative allocation';
      return total === payment ? null : `distributes ${total} of ${payment} cents`;
    },
  },
  {
    id: 'DISTRIBUTION-PARI-PASSU',
    on: ['distribution'],
    basis: 'Q33 (pending); spec §crowd structure (3)',
    text: 'Every lender on a loan shares every payment in proportion to what they are owed, to within one cent. No lender is repaid ahead of another.',
    check: ({ loan, payment, allocations }) => {
      const owed = loan.shares.reduce((a, s) => a + (s.contribution - s.forgiven - s.received), 0);
      for (const s of loan.shares) {
        const out = s.contribution - s.forgiven - s.received;
        const got = allocations[s.lender] || 0;
        // |got - out*payment/owed| < 1, in integers
        if (Math.abs(got * owed - out * payment) >= owed) return "one lender would be paid ahead of the others";
      }
      return null;
    },
  },
  {
    id: 'BORROWER-PRINCIPAL-ONLY',
    on: ['repayment'],
    basis: 'R1 (provisional); spec §A.6',
    text: 'The borrower repays exactly the principal and nothing more. Extra payments are not accepted through the platform.',
    check: ({ loan, amount }) => {
      const owed = loan.principal - loan.forgiven - loan.paid;
      return amount <= owed ? null : `payment is more than the $${(owed / 100).toFixed(2)} still owed`;
    },
  },
  {
    id: 'PLEDGE-MINIMUM',
    on: ['pledge'],
    basis: 'spec §A.2 (product decision, provisional)',
    text: 'Pledges are made in multiples of the minimum contribution.',
    check: ({ amount, config }) =>
      amount > 0 && amount % config.minContribution === 0 ? null : 'pledge is not a multiple of the minimum contribution',
  },
  {
    id: 'PLEDGE-NO-OVERFUNDING',
    on: ['pledge'],
    basis: 'spec §A.2',
    text: 'Pledges are capped at the campaign target. Overfunding is impossible.',
    check: ({ campaign, amount }) => {
      const pledged = campaign.pledges.reduce((a, p) => a + p.amount, 0);
      return pledged + amount <= campaign.target ? null : 'pledge would exceed the campaign target';
    },
  },
  {
    id: 'PLEDGE-NO-SELF-FUNDING',
    on: ['pledge'],
    basis: 'spec §Risk — campaign integrity',
    text: 'A borrower cannot pledge to their own campaign.',
    check: ({ campaign, lender }) => (campaign.borrower !== lender ? null : 'borrowers cannot fund their own campaign'),
  },
  {
    id: 'QARD-FORMS-AT-DISBURSEMENT',
    on: ['disbursement'],
    basis: 'Q31, Q32 (pending); spec §crowd structure (1)–(2)',
    text: "The lenders' shares equal the principal disbursed, cent for cent, and the contract cites a Board ruling.",
    check: ({ shares, principal, contract }) => {
      const total = shares.reduce((a, s) => a + s.contribution, 0);
      if (total !== principal) return 'shares do not sum to the principal';
      if (!contract?.rulingRef) return 'contract does not reference a Board ruling';
      return null;
    },
  },
  {
    id: 'LATE-PAYMENT-TO-CHARITY-ONLY',
    on: ['ledger'],
    basis: 'Q8 (pending), R2 (provisional); AAOIFI SS 3',
    text: 'Charity-undertaking receipts post only to the charity account — never to a lender or to revenue.',
    check: ({ tx }) => {
      if (tx.type !== 'charity_undertaking') {
        return tx.postings.some((p) => p.account === 'charity' && p.amount > 0) ? 'only a charity undertaking may credit the charity account' : null;
      }
      const ok = tx.postings.every((p) => p.account === 'charity' || p.account === 'world');
      return ok ? null : 'a charity undertaking may only move money from the borrower to charity';
    },
  },
  {
    id: 'PLEDGE-EARNS-NOTHING',
    on: ['ledger'],
    basis: 'Q31 (pending); spec ledger invariants',
    text: 'A pledge leaves the pledge account for exactly what went in: back to the lender, or out as the qard.',
    check: ({ tx }) => {
      if (tx.type === 'pledge' || tx.type === 'pledge_release' || tx.type === 'disbursement') return null;
      return tx.postings.some((p) => p.account.startsWith('pledge:')) ? 'only pledging, release and disbursement may touch pledged funds' : null;
    },
  },
];

export class RulesEngine {
  constructor() {
    this.passes = Object.fromEntries(RULES.map((r) => [r.id, 0]));
    this.blocked = [];
  }

  // Throws RuleViolation on the first failing rule.
  evaluate(kind, ctx, meta = {}) {
    for (const rule of RULES) {
      if (!rule.on.includes(kind)) continue;
      const detail = rule.check(ctx);
      if (detail) {
        this.blocked.push({ rule: rule.id, detail, kind, day: meta.day ?? null, what: meta.what || '' });
        throw new RuleViolation(rule, detail);
      }
      this.passes[rule.id] += 1;
    }
  }
}
