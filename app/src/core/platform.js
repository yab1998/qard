// Qard platform — Module A (community crowd-qard), sandbox build.
//
// One class holds the whole state. Every change goes through dispatch(command).
// Accepted and rejected commands are both kept in an append-only log, and the
// full state can be rebuilt by replaying that log — which is also how the
// platform recovers if a command fails half-way.
import { Ledger } from './ledger.js';
import { allocate } from './distribution.js';
import { RulesEngine, RuleViolation, RULESET_VERSION } from './rules.js';
import { sum } from './money.js';

export class DomainError extends Error {}

export const DEFAULT_CONFIG = {
  startDate: '2026-12-14',       // pilot opening week in the business plan
  minContribution: 500,          // $5 (spec, provisional)
  firstLoanCap: 10000,           // $100 first loan (spec, decided)
  pilotMaxLoan: 50000,           // $500 pilot maximum (business plan)
  // Graduated limit by number of loans repaid on time. The spec says limits
  // "rise with on-time history" but gives no ladder: PLACEHOLDER numbers.
  limitLadder: [10000, 25000, 50000],
  bookCap: 2500000,              // $25,000 total pilot book (business plan)
  fundingWindowDays: 7,
  urgentWindowDays: 3,           // "shorter for urgent categories" — PLACEHOLDER
  cureDays: 30,                  // "defined cure period" — PLACEHOLDER
  hardshipExtensionDays: 30,     // default extension length — PLACEHOLDER
  charityUndertaking: 500,       // fixed charity amount if late without excuse — PLACEHOLDER
  lenderFeeBps: 0,               // lender agency fee waived for the pilot
  contractTemplate: 'master-qard-v0-draft',
  rulingRef: 'PROVISIONAL — Module A fatwa pending (Q4–Q13, Q31–Q40)',
};

export const PURPOSES = ['Rent or housing', 'Car repair', 'Medical bill', 'Utilities', 'Groceries', 'School costs', 'Travel for family', 'Other'];

const OPERATOR_ONLY = new Set(['approveCampaign', 'rejectCampaign', 'disburse', 'decideHardship', 'markWilfulDelay', 'advanceClock', 'attemptForbidden']);

export class Platform {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.log = [];
    this._init();
  }

  _init() {
    this.ledger = new Ledger();
    this.rules = new RulesEngine();
    this.day = 0;
    this.members = {};
    this.campaigns = {};
    this.loans = {};
    this.contracts = {};
    this.distributions = [];
    this.audit = [];
    this.rejections = [];
    this.seq = { M: 0, C: 0, L: 0, K: 0, D: 0, P: 0 };
  }

  // ---- public API ---------------------------------------------------------

  dispatch(cmd) {
    try {
      const result = this._apply(cmd);
      this.log.push({ cmd, ok: true });
      return result;
    } catch (err) {
      if (!(err instanceof DomainError) && !(err instanceof RuleViolation)) {
        this._rebuild();
        throw err;
      }
      const entry = { cmd, ok: false, error: err.message, rule: err.rule?.id || null, day: this.day };
      this.log.push(entry);
      this._rebuild();
      throw err;
    }
  }

  static replay(log, config = {}) {
    const p = new Platform(config);
    p.log = log.slice();
    p._rebuild();
    return p;
  }

  _rebuild() {
    const log = this.log;
    this._init();
    for (const entry of log) {
      if (entry.ok) this._apply(entry.cmd);
      else this.rejections.push({ day: entry.day, type: entry.cmd.type, actor: entry.cmd.actor || null, error: entry.error, rule: entry.rule });
    }
  }

  // ---- helpers --------------------------------------------------------------

  _id(prefix) { return `${prefix}${++this.seq[prefix]}`; }
  _note(type, text, extra = {}) { this.audit.push({ day: this.day, type, text, ...extra }); }
  _member(id) { const m = this.members[id]; if (!m) throw new DomainError('Unknown member'); return m; }
  _campaign(id) { const c = this.campaigns[id]; if (!c) throw new DomainError('Unknown campaign'); return c; }
  _loan(id) { const l = this.loans[id]; if (!l) throw new DomainError('Unknown loan'); return l; }
  _cents(n, what = 'Amount') {
    if (!Number.isInteger(n) || n <= 0) throw new DomainError(`${what} must be a positive amount`);
    return n;
  }

  // Every ledger write goes through the rules engine first.
  _post(tx) {
    const full = { day: this.day, ...tx };
    this.rules.evaluate('ledger', { tx: full }, { day: this.day, what: tx.type });
    return this.ledger.post(full);
  }

  wallet(memberId) { return this.ledger.balance(`wallet:${memberId}`); }
  pledged(c) { return sum(c.pledges.map((p) => p.amount)); }
  outstanding(loan) { return loan.principal - loan.forgiven - loan.paid; }
  shareOutstanding(s) { return s.contribution - s.forgiven - s.received; }

  borrowerRecord(memberId) {
    const loans = Object.values(this.loans).filter((l) => l.borrower === memberId);
    return {
      repaid: loans.filter((l) => l.status === 'RepaidInFull').length,
      onTime: loans.filter((l) => l.status === 'RepaidInFull' && !l.everLate).length,
      active: loans.filter((l) => l.status !== 'RepaidInFull').length,
      defaulted: loans.filter((l) => l.status === 'DefaultAfterCure').length,
    };
  }

  borrowLimit(memberId) {
    const { onTime, defaulted } = this.borrowerRecord(memberId);
    if (defaulted) return 0;
    const ladder = this.config.limitLadder;
    return Math.min(ladder[Math.min(onTime, ladder.length - 1)], this.config.pilotMaxLoan);
  }

  bookOutstanding() {
    const lent = sum(Object.values(this.loans).map((l) => this.outstanding(l)));
    const open = sum(Object.values(this.campaigns)
      .filter((c) => ['Open', 'FullyPledged', 'BelowTarget'].includes(c.status))
      .map((c) => c.target));
    return lent + open;
  }

  // ---- command handling -----------------------------------------------------

  _apply(cmd) {
    if (OPERATOR_ONLY.has(cmd.type)) {
      if (!this.members[cmd.actor]?.roles.includes('operator')) throw new DomainError('Only the operator can do this');
    }
    const handler = this[`_${cmd.type}`];
    if (!handler) throw new DomainError(`Unknown command "${cmd.type}"`);
    return handler.call(this, cmd);
  }

  _registerMember({ name, roles = ['member'] }) {
    if (!name?.trim()) throw new DomainError('A name is required');
    const id = this._id('M');
    // KYC, sanctions screening and bank linking are vendor integrations (stubbed).
    this.members[id] = { id, name: name.trim(), firstName: name.trim().split(/\s+/)[0], roles, kyc: 'sandbox-stub', joinedDay: this.day };
    return id;
  }

  // Simulated ACH in / out of the member's FBO wallet.
  _deposit({ actor, amount }) {
    this._member(actor); this._cents(amount);
    this._post({ type: 'deposit', ref: actor, postings: [{ account: 'world', amount: -amount }, { account: `wallet:${actor}`, amount }] });
  }

  _withdraw({ actor, amount }) {
    this._member(actor); this._cents(amount);
    if (amount > this.wallet(actor)) throw new DomainError('Not enough in your wallet');
    this._post({ type: 'withdrawal', ref: actor, postings: [{ account: `wallet:${actor}`, amount: -amount }, { account: 'world', amount }] });
  }

  _createCampaign({ actor, target, minimum, purpose, urgent = false, story = '', showStory = false, installments = 4, everyDays = 14, charityUndertaking = true }) {
    this._member(actor);
    this._cents(target, 'Target');
    const min = this.config.minContribution;
    if (target % min !== 0) throw new DomainError('Target must be a multiple of $5');
    minimum = minimum ?? target;
    if (!Number.isInteger(minimum) || minimum <= 0 || minimum > target || minimum % min !== 0) {
      throw new DomainError('Minimum usable amount must be a multiple of $5, up to the target');
    }
    if (!PURPOSES.includes(purpose)) throw new DomainError('Choose a purpose category');
    if (!Number.isInteger(installments) || installments < 1 || installments > 12) throw new DomainError('Choose 1 to 12 repayments');
    if (![7, 14, 30].includes(everyDays)) throw new DomainError('Repayments are weekly, fortnightly or monthly');
    const limit = this.borrowLimit(actor);
    if (target > limit) throw new DomainError(limit ? `Your current limit is $${limit / 100}` : 'Borrowing is paused on this account');
    const busy = Object.values(this.campaigns).some((c) => c.borrower === actor && ['Draft', 'Open', 'FullyPledged', 'BelowTarget'].includes(c.status))
      || Object.values(this.loans).some((l) => l.borrower === actor && l.status !== 'RepaidInFull');
    if (busy) throw new DomainError('You can have one open campaign or active loan at a time');
    const id = this._id('C');
    this.campaigns[id] = {
      id, borrower: actor, target, minimum, purpose, urgent: !!urgent,
      story: String(story).slice(0, 600), showStory: !!showStory,
      installments, everyDays, charityUndertaking: !!charityUndertaking,
      status: 'Draft', createdDay: this.day, openedDay: null, closesDay: null, pledges: [], loan: null,
    };
    this._note('campaign', `${id} drafted and sent for review`);
    return id;
  }

  _approveCampaign({ campaign }) {
    const c = this._campaign(campaign);
    if (c.status !== 'Draft') throw new DomainError('Only a draft can be approved');
    if (this.bookOutstanding() + c.target > this.config.bookCap) throw new DomainError('The pilot book cap would be exceeded');
    c.status = 'Open';
    c.openedDay = this.day;
    c.closesDay = this.day + (c.urgent ? this.config.urgentWindowDays : this.config.fundingWindowDays);
    this._note('campaign', `${c.id} approved by the operator and opened`);
  }

  _rejectCampaign({ campaign, reason = '' }) {
    const c = this._campaign(campaign);
    if (c.status !== 'Draft') throw new DomainError('Only a draft can be declined');
    c.status = 'Cancelled'; c.closedReason = `Declined at review${reason ? `: ${reason}` : ''}`;
    this._note('campaign', `${c.id} declined at review`);
  }

  _pledge({ actor, campaign, amount }) {
    this._member(actor);
    const c = this._campaign(campaign);
    if (c.status !== 'Open') throw new DomainError('This campaign is not open for pledges');
    this.rules.evaluate('pledge', { campaign: c, lender: actor, amount, config: this.config }, { day: this.day, what: `pledge to ${c.id}` });
    if (amount > this.wallet(actor)) throw new DomainError('Not enough in your wallet — add funds first');
    this._post({ type: 'pledge', ref: c.id, postings: [{ account: `wallet:${actor}`, amount: -amount }, { account: `pledge:${c.id}:${actor}`, amount }] });
    const existing = c.pledges.find((p) => p.lender === actor);
    if (existing) existing.amount += amount;
    else c.pledges.push({ lender: actor, amount, order: this._id('P'), day: this.day });
    if (this.pledged(c) === c.target) {
      c.status = 'FullyPledged';
      this._note('campaign', `${c.id} reached its target`);
    }
  }

  // A pledge is a promise (waʿd), not yet a qard: the lender can take it back
  // until the campaign closes.
  _withdrawPledge({ actor, campaign }) {
    const c = this._campaign(campaign);
    if (c.status !== 'Open') throw new DomainError('Pledges can be withdrawn only while the campaign is open');
    const p = c.pledges.find((x) => x.lender === actor);
    if (!p) throw new DomainError('You have no pledge on this campaign');
    this._release(c, p);
    c.pledges = c.pledges.filter((x) => x !== p);
  }

  _release(c, p) {
    this._post({ type: 'pledge_release', ref: c.id, postings: [{ account: `pledge:${c.id}:${p.lender}`, amount: -p.amount }, { account: `wallet:${p.lender}`, amount: p.amount }] });
  }

  _cancel(c, reason) {
    for (const p of c.pledges) this._release(c, p);
    c.released = c.pledges; c.pledges = [];
    c.status = 'Cancelled'; c.closedReason = reason;
    this._note('campaign', `${c.id} cancelled (${reason}). All pledges released in full, no fee`);
  }

  _withdrawCampaign({ actor, campaign }) {
    const c = this._campaign(campaign);
    if (c.borrower !== actor) throw new DomainError('Only the borrower can withdraw a campaign');
    if (!['Draft', 'Open', 'BelowTarget', 'FullyPledged'].includes(c.status)) throw new DomainError('This campaign can no longer be withdrawn');
    this._cancel(c, 'withdrawn by the borrower');
  }

  _acceptPartial({ actor, campaign }) {
    const c = this._campaign(campaign);
    if (c.borrower !== actor) throw new DomainError('Only the borrower can accept a partial amount');
    if (c.status !== 'BelowTarget') throw new DomainError('There is no partial amount to accept');
    c.status = 'PartialAccepted';
    this._note('campaign', `${c.id}: borrower accepted the partial amount`);
  }

  _declinePartial({ actor, campaign }) {
    const c = this._campaign(campaign);
    if (c.borrower !== actor) throw new DomainError('Only the borrower can decline');
    if (c.status !== 'BelowTarget') throw new DomainError('There is no partial amount to decline');
    this._cancel(c, 'borrower declined the partial amount');
  }

  // The qard comes into being here, when the borrower takes possession (qabḍ).
  // The operator approves every disbursement (business plan: operator approves
  // every payment batch).
  _disburse({ campaign }) {
    const c = this._campaign(campaign);
    if (!['FullyPledged', 'PartialAccepted'].includes(c.status)) throw new DomainError('This campaign is not ready to disburse');
    const principal = this.pledged(c);
    const loanId = this._id('L');
    const shares = c.pledges.map((p) => ({ lender: p.lender, contribution: p.amount, forgiven: 0, received: 0, order: Number(p.order.slice(1)) }));
    const contractId = this._id('K');
    const contract = {
      id: contractId, loan: loanId, campaign: c.id, type: 'Qard hasan — parallel qards under one master agreement',
      template: this.config.contractTemplate, rulingRef: this.config.rulingRef, rulesetVersion: RULESET_VERSION,
      signedDay: this.day, borrower: c.borrower, collectionAgent: 'Platform (wakīl bi-l-qabḍ)',
      shareTable: shares.map((s) => ({ lender: s.lender, contribution: s.contribution })),
      eSignature: 'vendor-stub',
    };
    this.rules.evaluate('disbursement', { shares, principal, contract }, { day: this.day, what: `disburse ${c.id}` });

    const postings = [{ account: 'world', amount: principal }, { account: `obligation:${loanId}`, amount: -principal }];
    for (const s of shares) {
      postings.push({ account: `pledge:${c.id}:${s.lender}`, amount: -s.contribution });
      postings.push({ account: `share:${loanId}:${s.lender}`, amount: s.contribution });
    }
    this._post({ type: 'disbursement', ref: loanId, postings });

    const per = Math.floor(principal / c.installments);
    const schedule = [];
    for (let i = 1; i <= c.installments; i++) {
      schedule.push({ n: i, dueDay: this.day + i * c.everyDays, amount: i === c.installments ? principal - per * (c.installments - 1) : per, paid: 0 });
    }
    this.contracts[contractId] = contract;
    this.loans[loanId] = {
      id: loanId, campaign: c.id, contract: contractId, borrower: c.borrower, purpose: c.purpose,
      principal, paid: 0, forgiven: 0, shares, schedule, status: 'Repaying',
      disbursedDay: this.day, closedDay: null, lateSince: null, everLate: false,
      hardship: null, extensions: [], charityUndertaking: c.charityUndertaking ? this.config.charityUndertaking : 0,
      charityDue: 0, charityPaid: 0, charityChargedForEpisode: false,
    };
    c.status = 'Disbursed'; c.loan = loanId;
    this._note('loan', `${loanId} disbursed: ${shares.length} lender${shares.length > 1 ? 's' : ''}, contract ${contractId}`);
    return loanId;
  }

  _repay({ actor, loan, amount }) {
    const l = this._loan(loan);
    if (l.borrower !== actor) throw new DomainError('Only the borrower can repay this loan');
    this._cents(amount);
    if (l.status === 'RepaidInFull') throw new DomainError('This loan is already repaid');
    this.rules.evaluate('repayment', { loan: l, amount }, { day: this.day, what: `repayment on ${l.id}` });

    const active = l.shares.filter((s) => this.shareOutstanding(s) > 0);
    const allocations = allocate(active.map((s) => ({ id: s.lender, outstanding: this.shareOutstanding(s), order: s.order })), amount);
    this.rules.evaluate('distribution', { loan: l, payment: amount, allocations }, { day: this.day, what: `distribution on ${l.id}` });

    // One transaction: the borrower's payment arrives and is distributed to
    // every lender the same day.
    const postings = [{ account: 'world', amount: -amount }, { account: `obligation:${l.id}`, amount }];
    for (const s of active) {
      const got = allocations[s.lender];
      postings.push({ account: `wallet:${s.lender}`, amount: got });
      postings.push({ account: `share:${l.id}:${s.lender}`, amount: -got });
    }
    this._post({ type: 'repayment', ref: l.id, postings });
    for (const s of active) s.received += allocations[s.lender];
    l.paid += amount;
    let left = amount;
    for (const inst of l.schedule) {
      const take = Math.min(left, inst.amount - inst.paid);
      inst.paid += take; left -= take;
    }
    this.distributions.push({ id: this._id('D'), loan: l.id, day: this.day, payment: amount, allocations });
    this._refreshLoan(l);
  }

  // Ibrā': a lender forgives part or all of their own share, as sadaqa.
  // It reduces only that lender's share; nobody else's entitlement changes.
  _forgive({ actor, loan, amount }) {
    const l = this._loan(loan);
    const s = l.shares.find((x) => x.lender === actor);
    if (!s) throw new DomainError('You hold no share in this loan');
    this._cents(amount);
    if (amount > this.shareOutstanding(s)) throw new DomainError('You can forgive at most what you are still owed');
    this._post({ type: 'forgiveness', ref: l.id, postings: [{ account: `share:${l.id}:${actor}`, amount: -amount }, { account: `obligation:${l.id}`, amount }] });
    s.forgiven += amount;
    l.forgiven += amount;
    let left = amount; // the borrower's schedule shrinks from the last instalment back
    for (let i = l.schedule.length - 1; i >= 0 && left > 0; i--) {
      const inst = l.schedule[i];
      const take = Math.min(left, inst.amount - inst.paid);
      inst.amount -= take; left -= take;
    }
    this._note('loan', `${l.id}: a lender forgave part of their share`);
    this._refreshLoan(l);
  }

  _declareHardship({ actor, loan, note = '' }) {
    const l = this._loan(loan);
    if (l.borrower !== actor) throw new DomainError('Only the borrower can open a hardship case');
    if (l.status === 'RepaidInFull') throw new DomainError('This loan is already repaid');
    if (l.hardship?.status === 'pending') throw new DomainError('A hardship case is already open');
    l.hardship = { status: 'pending', note: String(note).slice(0, 600), openedDay: this.day, decidedDay: null };
    this._note('hardship', `${l.id}: hardship case opened`);
  }

  // Documented hardship gets a mandatory, fee-free extension that binds every
  // lender on the loan (al-Baqara 2:280). Nothing is added to what is owed.
  _decideHardship({ loan, grant, days }) {
    const l = this._loan(loan);
    if (l.hardship?.status !== 'pending') throw new DomainError('No hardship case is waiting for a decision');
    l.hardship.decidedDay = this.day;
    if (!grant) {
      l.hardship.status = 'declined';
      this._note('hardship', `${l.id}: hardship not documented; no extension`);
      return;
    }
    const ext = Number.isInteger(days) && days > 0 && days <= 180 ? days : this.config.hardshipExtensionDays;
    for (const inst of l.schedule) if (inst.paid < inst.amount) inst.dueDay += ext;
    l.hardship.status = 'granted';
    l.extensions.push({ day: this.day, days: ext });
    if (l.status === 'PaymentLate' || l.status === 'DefaultAfterCure') { l.status = 'Repaying'; l.lateSince = null; }
    this._note('hardship', `${l.id}: fee-free extension of ${ext} days granted to all shares`);
    this._refreshLoan(l);
  }

  // Wilful delay (no hardship): the borrower's own undertaking to give a fixed
  // sum to charity falls due. It never goes to lenders or to the platform.
  _markWilfulDelay({ loan }) {
    const l = this._loan(loan);
    if (l.status !== 'PaymentLate') throw new DomainError('This loan is not late');
    if (l.hardship?.status === 'pending') throw new DomainError('Decide the open hardship case first');
    if (!l.charityUndertaking) throw new DomainError('This borrower gave no charity undertaking at signing');
    if (l.charityChargedForEpisode) throw new DomainError('The undertaking is already due for this delay');
    l.charityDue += l.charityUndertaking;
    l.charityChargedForEpisode = true;
    this._note('loan', `${l.id}: delay without excuse — charity undertaking now due`);
  }

  _payCharity({ actor, loan }) {
    const l = this._loan(loan);
    if (l.borrower !== actor) throw new DomainError('Only the borrower can pay this');
    const due = l.charityDue - l.charityPaid;
    if (due <= 0) throw new DomainError('Nothing is due to charity');
    this._post({ type: 'charity_undertaking', ref: l.id, postings: [{ account: 'world', amount: -due }, { account: 'charity', amount: due }] });
    l.charityPaid += due;
  }

  _refreshLoan(l) {
    if (this.outstanding(l) === 0) {
      if (l.status !== 'RepaidInFull') {
        l.status = 'RepaidInFull'; l.closedDay = this.day; l.lateSince = null;
        this._note('loan', `${l.id} settled in full`);
      }
      return;
    }
    const overdue = l.schedule.some((i) => i.dueDay < this.day && i.paid < i.amount);
    if (overdue && l.status === 'Repaying') {
      l.status = 'PaymentLate'; l.lateSince = this.day; l.everLate = true; l.charityChargedForEpisode = false;
      this._note('loan', `${l.id}: payment late`);
    } else if (!overdue && (l.status === 'PaymentLate' || l.status === 'DefaultAfterCure')) {
      l.status = 'Repaying'; l.lateSince = null;
      this._note('loan', `${l.id}: back on schedule`);
    }
  }

  _advanceClock({ days = 1 }) {
    if (!Number.isInteger(days) || days < 1 || days > 365) throw new DomainError('Advance by 1 to 365 days');
    for (let i = 0; i < days; i++) {
      this.day += 1;
      for (const c of Object.values(this.campaigns)) {
        if (c.status === 'Open' && this.day > c.closesDay) {
          if (this.pledged(c) >= c.minimum) {
            c.status = 'BelowTarget';
            this._note('campaign', `${c.id}: window ended below target; waiting for the borrower`);
          } else {
            this._cancel(c, 'window ended below the minimum');
          }
        }
      }
      for (const l of Object.values(this.loans)) {
        if (l.status === 'RepaidInFull') continue;
        this._refreshLoan(l);
        if (l.status === 'PaymentLate' && l.hardship?.status !== 'pending' && this.day - l.lateSince >= this.config.cureDays) {
          l.status = 'DefaultAfterCure';
          this._note('loan', `${l.id}: in default after the cure period. Shares remain owed to their lenders; nothing is added`);
        }
      }
    }
  }

  // Sandbox self-test: try to post something the rules forbid. Always blocked.
  _attemptForbidden({ kind, loan }) {
    const l = this._loan(loan);
    const lender = l.shares[0].lender;
    if (kind === 'tip') {
      this._post({ type: 'tip', ref: l.id, postings: [{ account: 'world', amount: -200 }, { account: `wallet:${lender}`, amount: 200 }] });
    } else if (kind === 'late_fee') {
      this._post({ type: 'late_fee', ref: l.id, postings: [{ account: 'world', amount: -500 }, { account: `wallet:${lender}`, amount: 500 }] });
    } else if (kind === 'priority') {
      if (l.shares.filter((s) => this.shareOutstanding(s) > 0).length < 2) throw new DomainError('This test needs a loan with at least two lenders still owed');
      // Pay one lender ahead of the others.
      const amount = Math.min(100, this.shareOutstanding(l.shares[0]));
      const allocations = Object.fromEntries(l.shares.map((s, i) => [s.lender, i === 0 ? amount : 0]));
      this.rules.evaluate('distribution', { loan: l, payment: amount, allocations }, { day: this.day, what: 'priority repayment' });
    } else if (kind === 'overpay') {
      this.rules.evaluate('repayment', { loan: l, amount: this.outstanding(l) + 1000 }, { day: this.day, what: 'repayment above principal' });
    } else {
      throw new DomainError('Unknown self-test');
    }
    throw new DomainError('Self-test was not blocked — this is a bug');
  }
}
