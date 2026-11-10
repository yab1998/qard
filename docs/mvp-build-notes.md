# Sandbox MVP — Build Notes

Nov 10, 2026 · built with Claude (Anthropic's Claude Fable 5.2 model) at Yahya Abdul-Basser's direction · companion to the [specification](spec.md) and [business plan](business-plan.md)

This note explains what was built, how, what it proves, and what it found. The code is in [`app/`](../app/).

## Summary

A working sandbox of **Module A** (the crowd-funded qard hasan marketplace) now exists. It covers the Phase 1 scope in the specification: campaigns, pledges, browse, disbursement, pro-rata repayment distribution, the hardship flow, and the charity ledger. It runs on practice money only.

| Item | Result |
| --- | --- |
| Scope | Module A, as listed under "What goes live" in the business plan. Auto-lend, the protection fund, the zakat circle, murabaha and ijara are not built |
| Gate G4 (software half) | 10,000-loan simulation: **0 cents discrepancy**, 10 of 10 ledger invariants pass |
| Tests | 19 automated tests, all passing |
| Dependencies | None at runtime. Plain JavaScript on Node 20+ |
| What is not real | Money movement, KYC, bank linking, e-signature and sign-in are stubs. No fatwa or legal opinion exists yet, so every Shari'a rule in the code is the specification's *proposed* position |

**Nothing here can move real money, and it should not be shown to members as a product.** It is a proof that the ledger, distribution and rules logic in the specification can be built and hold up under load, and a clickable model for the Board, counsel and the bank to react to.

## What was built

| Part | File | What it does |
| --- | --- | --- |
| Ledger | `app/src/core/ledger.js` | Append-only double-entry ledger in integer cents. A transaction that does not sum to zero is refused |
| Distribution engine | `app/src/core/distribution.js` | Splits each borrower payment across the lenders. A pure function, so every run can be replayed |
| Rules engine | `app/src/core/rules.js` | Eleven rules evaluated before any money movement is posted. A failing rule blocks the transaction and logs it |
| Platform | `app/src/core/platform.js` | The campaign and loan state machines from the specification, plus limits, hardship, forgiveness and the charity undertaking |
| Invariants | `app/src/core/invariants.js` | The ledger invariants from the specification, checked against the whole state |
| Views | `app/src/core/views.js` | What each person may see. The privacy rules (sitr; lenders never told why an extension was granted) are enforced here and tested |
| Web app | `app/web/` | Mobile-first pages for borrower, lender and operator |
| Server | `app/src/server.js` | Small server that stores an append-only command log and rebuilds state by replaying it |
| Simulation | `app/scripts/simulate.js` | The G4 simulation |

To run it: `cd app && npm start`, then open `http://localhost:4173`. `npm test` runs the tests and `npm run simulate` runs the 10,000-loan simulation (about three minutes).

## How it maps to the specification

- **Campaign lifecycle and loan lifecycle** follow the two state diagrams in the specification, state for state. Fund and zakat settlement of a default (Modules B and C) are not built, so a defaulted loan simply remains owed.
- **Pledge, then qard (Q31).** A pledge moves money from the lender's wallet to a pledge account in the lender's name. It can be withdrawn while the campaign is open. The qard is created only at disbursement.
- **Parallel qards (Q32, option a).** Each lender holds a separate share under one master agreement record. One lender's forgiveness does not touch another's share.
- **Pari passu (Q33).** A rule blocks any distribution in which a lender's allocation differs from their pro-rata share by a cent or more.
- **Hardship binds all lenders (Q35).** An extension moves every unpaid due date and adds nothing to the debt. Lenders see that an extension was granted and never the reason.
- **Charity undertaking (Q8) and no collection costs (R2).** Late payment adds nothing. The undertaking, if the borrower gave one, posts only to the charity account.
- **No borrower fee (R1).** There is no transaction type for a tip, a late fee, a borrower fee or interest. The ledger refuses any type it does not know.
- **Operator approval.** Publishing a campaign, releasing a disbursement and deciding a hardship case each need the operator, as in the business plan's operating model.
- **Pilot limits.** $5 minimum contribution, $100 first loan, $500 pilot maximum, $25,000 book cap, 7-day funding window, lender fee waived.

## What the build found

These are the points that need a decision from the Board, counsel or the product owner. They are the main value of having built it.

**1. The rounding rule as written can require taking a cent back from a lender.** The specification distributes by "the largest-remainder method on cumulative totals." On some payment sequences that method lowers a lender's cumulative entitlement from one payment to the next, which would mean reclaiming a cent already paid out. A reproducible case: lenders of $60, $5 and $50, with payments of $8.02, $0.25, $93.19, $2.08, $7.88 and $0.03. It is rare (31 occurrences in about 290,000 simulated payments) but it is real, and it is included as a test.

The sandbox therefore applies the same largest-remainder rule to **what each lender is still owed** instead of to cumulative totals. This never claws back, always sums exactly to the payment, never pays a lender more than they lent, and settles every lender exactly on the final payment. The trade-off: mid-loan, a lender can be a few cents away from their exact pro-rata line (at most 2.6 cents across the 10,000-loan run, and 4.2 cents in a harsher stress test with up to 60 lenders per loan), where the specification's method would hold that to under one cent. At settlement the difference is always zero. **Q33 should put this rounding rule to the Board explicitly.**

**2. Several numbers the code needs are not in the specification.** The sandbox uses placeholders, marked `PLACEHOLDER` in `platform.js`:

| Needed | Placeholder used |
| --- | --- |
| How the borrowing limit rises with on-time history | $100, then $250, then $500 |
| Cure period before default | 30 days |
| Funding window for urgent categories | 3 days |
| Default length of a hardship extension | 30 days |
| Amount of the charity undertaking | $5 |

**3. Open behaviours the sandbox had to pick.** Each is easy to change.

- A borrower may withdraw a campaign even after it is fully pledged, up to disbursement. The state diagram only shows withdrawal while open.
- A borrower in default cannot start a new campaign. Nothing else happens to them.
- Voluntary overpayment (ḥusn al-qaḍā') is refused outright, following the specification's "simplest rule."
- A hardship case that is open pauses the default clock.
- Partial forgiveness shortens the borrower's schedule from the last instalment backwards.

**4. Default in the pilot falls entirely on lenders.** With Modules B and C out of scope, nothing covers a defaulted share. The specification already says this; using the sandbox makes it very visible. Counsel's D8 disclosure matters.

## Results

**Simulation (gate G4).** Every loan runs through the real platform path: rules engine, ledger and distribution.

| Measure | Result |
| --- | --- |
| Loans | 10,000 |
| Principal lent | $2,594,565.00 |
| Lender shares | 72,396 |
| Borrower payments (many at odd cent amounts) | 94,048 |
| Forgiveness events | 3,888 |
| Hardship extensions | 2,927 |
| Ledger transactions | 180,732 |
| Rule checks passed | 1,145,576 |
| Discrepancy at settlement | **0 cents** |
| Ledger invariants | 10 of 10 pass |

G4 also requires "one full reconciliation against the bank." That half cannot be done until a bank partner exists.

**Rules self-test.** The operator console has four buttons that attempt forbidden actions against a live loan: tip a lender, charge a late fee, repay one lender ahead of the others, and collect more than the principal. All four are blocked and logged.

## How it was built

The build was done in one working session by an AI model (Claude Fable 5.2) working from the specification, the business plan and the two briefs in this repository, at Yahya's direction. It has not yet had a human code review.

1. Read the specification and extracted the Module A scope, the two state diagrams, the ledger invariants and the pilot limits.
2. Wrote the money core first (ledger, distribution, rules), with no user interface, so it could be tested alone.
3. Fuzz-tested the distribution engine against random loans. This is where the rounding problem above surfaced: two earlier versions of the engine failed the fuzz test before the current rule was chosen.
4. Wrote the platform state machines on top, then the invariant checker, then the tests and the simulation.
5. Built the web app last, and clicked through every flow in an automated browser on both the server version and the single-file demo.

In the business plan's terms this was the **Build team** working alone, without the reviewer and approver agents in `.claude/agents/`. Code touching the ledger, distribution and rules engine is exactly the code the plan says must never be auto-merged, so it is on a branch for human review and has not been merged to `main`.

## What is deliberately missing

- Real payments, KYC, bank linking and e-signature (all vendor integrations in the plan)
- Sign-in and access control. The sandbox lets one person switch between members. It must not hold real member data
- A relational database. State is an append-only command log, which is enough to prove replayability and not what production needs
- Underwriting from bank data. Limits are a fixed ladder
- Contract text. The agreement is a record with a share table and a placeholder ruling reference
- Credit reporting, collections agency, adverse-action notices
- Auto-lend, protection fund, zakat circle, gifts on campaigns, share transfers

## Suggested next steps

1. Put the rounding rule (finding 1) and the placeholder numbers (finding 2) to the Board and product owner.
2. Walk the Board and counsel through the sandbox. It may be a faster way to get reactions to Q31–Q36 than the briefs alone.
3. Run the factory's three reviewer agents over `app/src/core/` before anything builds on it.
4. Once a bank partner and its programme structure are known, replace the simulated wallet with the bank's sandbox API and build the daily reconciliation.
