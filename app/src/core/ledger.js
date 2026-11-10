// Immutable double-entry ledger. Every transaction's postings sum to zero.
//
// Accounts
//   world                 everything outside the platform (members' own banks)
//   wallet:<member>       member funds held in the bank partner's FBO account
//   pledge:<camp>:<mem>   pledged funds — still the lender's property (amana)
//   share:<loan>:<mem>    a lender's outstanding qard claim (positive = owed to lender)
//   obligation:<loan>     the borrower's debt (negative = owed by borrower)
//   charity               charity-undertaking receipts, never revenue
//   purification          impermissible income awaiting payment to charity
import { isCents, sum } from './money.js';

export class LedgerError extends Error {}

export class Ledger {
  constructor() {
    this.entries = [];
    this.balances = new Map();
  }

  post({ type, ref, day, postings, memo = '' }) {
    if (!postings?.length) throw new LedgerError('A transaction needs postings');
    for (const p of postings) {
      if (!isCents(p.amount)) throw new LedgerError(`Non-integer amount on ${p.account}`);
    }
    if (sum(postings.map((p) => p.amount)) !== 0) {
      throw new LedgerError(`Unbalanced transaction (${type})`);
    }
    const entry = Object.freeze({
      seq: this.entries.length + 1,
      type, ref, day, memo,
      postings: Object.freeze(postings.filter((p) => p.amount !== 0).map((p) => Object.freeze({ ...p }))),
    });
    for (const p of entry.postings) {
      this.balances.set(p.account, (this.balances.get(p.account) || 0) + p.amount);
    }
    this.entries.push(entry);
    return entry;
  }

  balance(account) {
    return this.balances.get(account) || 0;
  }

  sumPrefix(prefix) {
    let t = 0;
    for (const [k, v] of this.balances) if (k.startsWith(prefix)) t += v;
    return t;
  }

  trialBalance() {
    let t = 0;
    for (const v of this.balances.values()) t += v;
    return t;
  }
}
