# Brief to US Counsel — Lending, Payments and Securities Questions

**Prepared for:** Musa Abdul-Basser, Partner, Hayes Law and Compliance (HLC); also Of Counsel to NOVA Business Law Group, LLP. Engaging firm to be confirmed. Scope: consumer finance, payments, securities
**Prepared by:** Taha Abdul-Basser, Managing Partner, Straightway Ethical Advisory — Shari'a Advisor to the Platform
**Date:** [to insert]
**Companion document:** [Platform specification](spec.md)
**Status:** draft for counsel review. This brief frames questions and records our working positions; it states no legal conclusions and is not legal advice.

## 1. Purpose and priority

The specification sets out a US consumer **crowd-lending** platform whose core product is a **fee-free qard hasan**: a loan on which the borrower pays nothing beyond principal, and on which the lenders earn nothing. Each loan is funded by **one or more lenders** through a campaign, much as LaunchGood campaigns are funded by many donors, except that backers lend rather than give. The Platform matches borrowers to lenders, collects repayments and distributes them pro rata. Phase 1 (module A, the crowd-qard marketplace) is the near-term build. Phase 3 adds a **murabaha** module funded by an investor pool.

We need three things from you, in this order:

| # | Deliverable | Blocks | Priority |
| --- | --- | --- | --- |
| 1 | **Part A** — licensing and origination position for the qard, state by state | Phase 1 launch | Blocking |
| 2 | **Part D** — the crowd structure: whether lender shares are securities, pledges, auto-lend and fair lending | Phase 1 launch (D3 blocks phase 1b only) | Blocking |
| 3 | **Part C** — confirmation or correction of the regulatory table in [spec §US regulatory considerations](spec.md) | Phase 1 launch | Blocking |
| 4 | **Part B** — securities route for the murabaha investor pool | Phase 3 only | Deferred, not urgent |

Parts A, B and D are open decisions recorded in the specification. Part B does not block Phase 1, and we would rather you spend the near-term effort on Parts A, D and C.

**Timing.** We are targeting a pilot launch in the week of 14 December 2026, so we ask for the pilot-state answer (A11) and D1 by **6 November 2026**, and the remaining Phase 1 answers by **27 November 2026**.

We would like a written memo per Part, answering each numbered question with a direct yes / no / conditioned answer, the authority relied on, and a per-state breakdown where the answer varies by state. Question numbering below is stable; please answer against these numbers so we can track resolution in the specification.

## 2. The fact pattern

Counsel should work from these facts. Anything marked **[TBC]** is a parameter we have not fixed and should not be assumed.

**The loan (module A).**

- A borrower posts a **campaign** for a short-term cash need, stating a target amount, the minimum amount they can use, a purpose and a proposed repayment schedule, with an optional story. By default only the borrower's first name and purpose category are shown.
- Members **pledge** to the campaign in multiples of **$5**. One lender may fund the whole amount, or many may share it. Pledged money is held in the bank partner's FBO account in the lender's name, earns nothing, and may be withdrawn until the campaign closes.
- The campaign is open for a fixed window (**provisional: 7 days**). If the target is met, the loan disburses. If it falls short, the borrower may accept the partial amount if it is at or above their stated minimum; otherwise every pledge is released in full.
- At disbursement one **master qard agreement** is signed. It names the borrower and each lender with their share and appoints the Platform as every lender's collection agent. **Each lender is the creditor of record for their own share.**
- The borrower repays on **one schedule** to the Platform. Each payment is distributed the same day to every lender **pro rata** to their share. No lender ranks ahead of another, and priority cannot be bought.
- Lenders reach campaigns by **browsing** or, in phase 1b, by **auto-lend**: a lender sets a budget and criteria (purpose, location, loan size), and the Platform lends their funds across eligible campaigns in $5 slices and re-lends repayments unless the lender switches this off.
- A lender may **forgive** part or all of their own share at any time. There is no secondary market in shares; a share passes to the lender's estate on death.
- The contract is a **qard hasan**: the borrower repays **principal only**.
- **No finance charge of any kind.** No interest, no origination fee, no service fee, no platform fee, no tip, no donation, no "optional" payment, no late fee, no default fee, no collection-cost recovery. There is no field in the product for a payment above principal, and we propose not to accept one through the Platform at all.
- Amounts: first loan capped at **$100**; maximum loan size **$5,000**; tenor **[TBC]**; repayment in one or more instalments **[TBC]**.
- The Platform charges the **borrower nothing** on the qard — not even allocated overhead. The Platform's revenue on a funded qard is a **lender agency fee** (*wakāla bi-ajr*) paid by each lender on their own contribution. It may be a percentage, is charged on top of the pledge at disbursement, and is not charged if the campaign fails.

**Late payment and default.**

- No late fee to any lender or the Platform. A late borrower may undertake at signing to **donate a fixed amount to a third-party charity** if late without excuse. Proceeds go to a charity account, never to Platform revenue and never to the lenders.
- Documented hardship gets a **mandatory fee-free extension** and a revised schedule, binding on every lender on the loan.
- After a cure period, defaulted principal on opted-in lenders' shares is reimbursed from a member-funded **protection fund**; uncovered shares remain owed to their lenders. The borrower still owes the fund; the fund does not forgive.
- Collections only through **fixed-fee or *juʿāla* agency**. No sale or assignment of defaulted qard at a discount.
- Late payment is reported to credit bureaus (disclosed at signing).

**Funds and accounts.**

- Funds are held at a **bank partner in FBO accounts**; the Platform does not hold member funds directly. The target bank partner is **Stearns Bank, N.A.**, through its Islamic banking division, Stearns Salaam. Stearns already acts as a sponsor bank for fintech programmes (for example through Synctera) and is headquartered in Minnesota, one of the launch states. Accounts are non-interest-bearing; any accrual is booked to a purification ledger and paid to charity quarterly.

**Other revenue (none charged to the borrower).**

- Protection-fund management fee (fixed percentage of contributions, from the fund).
- Optional flat monthly membership for platform access, not required to borrow and not scaled to borrowing.
- Phase 3: murabaha agency fee from the investor pool.

**Phase 2 (module B, C).** A *tabarruʿ* mutual protection fund with surplus carried forward in the fund; a zakat pool for *al-ghārimīn* that may clear an eligible borrower's qard.

**Phase 3 (module D).** For a specific purchase, the investor pool — through the Platform as agent — buys the item from a merchant using a merchant-locked virtual card, takes possession, and resells to the member at cost plus a fixed markup in instalments. Price fixed at contract; no rollover, no rate reset, no late increment. Pool investors expect a return.

**Launch states.** New York, New Jersey, Pennsylvania, Michigan, Illinois, Texas, California, Minnesota.

**Context counsel should weigh.** P2P platforms that sold interest-bearing loan notes to many investors have historically had to register those notes as securities. Our lenders receive no return of any kind, which we believe distinguishes them, but this is the question we most need answered (D1). The reference model (SoLo Funds) layered optional tips and donations on a nominally interest-free loan and drew state enforcement and a CFPB action, including a denied motion to dismiss on the theory that "optional" payments were in effect expected. Our model removes every such payment rather than relabelling it.

## 3. Part A — licensing and origination for the fee-free qard

**A1. Threshold.** In each launch state, does a consumer loan carrying **no interest and no fees whatsoever** require a lending licence or trigger small-loan / consumer-finance law? Identify the statute per state, and state expressly whether licensure in that state turns on charging a finance charge, interest, or any consideration.

**A2. Who is the lender.** Each funding member is the creditor of record for their share, and a single loan may have dozens of lenders holding as little as $5 each. Does that make each funding member a "lender" requiring a licence, or is there a natural-person / de minimis / occasional-lender exemption? Do loan count, frequency, share size or total exposure across many loans (a $5-slice auto-lender may hold shares in hundreds) change the answer? If the Platform arranges, documents, services and collects, does it separately require a loan-broker, credit-services-organisation, or servicing licence in any launch state?

**A3. Servicing and collections.** Does the Platform's servicing, hardship administration, reminder programme and third-party collection agency activity require a debt-collection or servicing licence in any launch state, given that the Platform is not the creditor?

**A4. Bank-partner origination.** If the bank partner originates the loan, the lenders would acquire their shares from it at face value immediately after disbursement, or the bank would lend as the lenders' agent. If the bank partner originates or holds the loan, does that displace state licensing? Please address the current true-lender / "valid when made" landscape and what makes such a programme defensible — who bears the risk, where the economics sit, who markets, who services, and what contractual and operational conditions you would require. Flag any launch state where a bank-partner programme does **not** solve the problem.

**A5. Usury.** Confirm that a loan with no charge of any kind cannot exceed a usury ceiling or a small-loan-act cap in any launch state, and whether any state nonetheless imposes filing, reporting or disclosure duties on such a loan.

**A6. The charity undertaking.** Is a borrower's contractual promise, made at signing, to donate a fixed sum to a **third-party charity** on late payment enforceable in each launch state? Please address: whether it is a penalty or unenforceable liquidated damages; whether it is a "finance charge" or interest **in substance** notwithstanding that the creditor receives nothing; and whether a regulator could treat it as a UDAAP issue notwithstanding that it is disclosed, fixed and payable to charity.

**A7. Credit reporting.** Confirm the permissibility of furnishing positive and negative qard payment data, and any dispute-handling obligations that follow.

**A8. The SoLo comparison.** Our position is that removing the tip, the donation and the paid default protection materially changes the UDAAP analysis. Do you agree, and are there residual "in substance" theories a regulator could press against a zero-charge product?

**A9. Recommendation.** Among (i) licence state by state, (ii) bank-partner origination, (iii) a hybrid, give us a recommendation, with rough cost and timeline per path, and identify any launch state where a path is infeasible. If you recommend dropping any launch state for Phase 1, say so plainly.

**A10. Platform as lender of record.** As an alternative to A4, the Platform (licensed as lender) would originate each loan and the lenders would fund it back-to-back at par. Is this viable in the launch states, and does it change the securities analysis in D1?

**A11. The Q4 2026 pilot.** We aim to open an invite-only pilot in the week of 14 December 2026 (see the [business plan](business-plan.md)): one launch state, about 50 borrowers and 200 lenders, first loan $100, maximum loan $500, total book capped at $25,000, lender fee waived. (a) Which launch state do you recommend for the pilot, and what must be in place there? Please answer this **before** the full eight-state analysis. (b) Does a small, invite-only pilot change any answer in Part A or Part D? (c) If our payment rails are not live in time, may we run a *pledge-intent* pilot, in which borrowers post campaigns and lenders make non-binding pledges, with no money moving and no loan made until the rails go live?

**A12. Stearns Bank.** With Stearns Bank, N.A. as the target bank partner: (a) does a Minnesota-headquartered national bank holding the FBO accounts, and possibly originating the loans, make Minnesota the natural pilot state, or does it not matter? (b) Which of A4 (bank origination), A10 (Platform as lender of record) or member-to-member lending fits a Stearns programme best? (c) What should the programme agreement contain on FBO custody, ACH origination, BSA/AML responsibilities, complaints, audit rights and termination, and should we onboard directly or through a programme manager Stearns already uses? (d) The Platform's Shari'a Advisor's managing partner is also a member of the Stearns Salaam Shari'a Supervisory Board. Are there disclosure or conflict steps you advise beyond those in the [business plan](business-plan.md)?

## 4. Part B — securities route for the Phase 3 murabaha pool

**B1.** Are interests in the murabaha investor pool — with a fixed markup agreed upfront and an expected return — securities? Please apply the investment-contract analysis to this fact pattern specifically, including whether the pooling and the Platform's role as agent and manager supply the required common enterprise and reliance on others' efforts.

**B2.** If they are securities, which exemption do you recommend — Reg CF, Reg A+ Tier 1 or 2, Rule 506(b) or 506(c), intrastate — and why, given the Platform is also sponsor, agent and servicer? Address investor limits, ongoing reporting, and state blue-sky filings.

**B3.** Is the murabaha itself a security, or a credit sale outside securities law? Does the Platform need broker-dealer registration or funding-portal registration for either the pool or the murabaha?

**B4.** Does the pooled vehicle need to register under the Investment Company Act, or can it rely on an exclusion? Which one?

**B5.** **Alternative structure.** Can the bank partner hold the assets and take the asset risk so that members hold something other than a security — a participation, a deposit, or a beneficial interest? What are the securities, banking and true-lender consequences?

**B6.** Subject to your answer on lender shares at D1, confirm that the **qard-only MVP** — modules A, B and C — raises no other securities question. In particular, confirm that the protection fund, with surplus carried forward in the fund and no distribution to contributors, is not an investment contract, and that the zakat pool is not one.

**B7.** **Zakat and charitable solicitation.** What charitable-solicitation registration and disclosure obligations attach to the zakat pool in each launch state? Who is the solicitor — the Platform, the bank partner, or the Shari'a Advisor? Note that eligibility is determined by the Platform's hardship process against criteria certified by the Shari'a Board.

## 4a. Part D — the crowd structure (blocking for Phase 1)

**D1. Are lender shares securities?** Each lender holds a share of a zero-return consumer qard, documented in a master agreement, serviced and distributed by the Platform. Please apply the *Reves* family-resemblance test and the *Howey* investment-contract test to this fact pattern. Address whether the complete absence of any return, fee rebate or other benefit to the lender is decisive; whether pooled pro-rata distribution and reliance on the Platform's servicing supply a common enterprise; and whether the answer changes if a protection fund covers some shares. If shares are or may be securities, what is the least burdensome route (exemption, structure change)?

**D2. Platform registration.** Does the Platform's role — listing campaigns, matching, holding pledges and distributing repayments — require broker-dealer, funding-portal or investment-adviser registration under any answer to D1?

**D3. Auto-lend (phase 1b only).** Does discretionary allocation of a lender's budget across loans in $5 slices, with automatic re-lending of repayments, change the D1 or D2 answer? Is there a design (for example lender confirmation of each allocation, or narrow lender-set criteria) that avoids it?

**D4. Pledges.** Pledged money is held in the bank partner's FBO account in the lender's name, may be withdrawn until the campaign closes, and is released in full if the campaign fails. Confirm that this is not money transmission by the Platform in any launch state, and identify any escrow, Reg E or unclaimed-property duty on pledges and on undistributed repayments (for example of a deceased or sanctioned lender).

**D5. Fair lending.** Lenders choose borrowers by browsing campaign pages and stories, and auto-lend criteria include location and purpose. Does ECOA / Reg B, or state fair-lending law, reach the Platform's ranking and matching or the lenders' own choices? What controls on displayed information and on auto-lend criteria do you recommend to avoid disparate treatment or impact?

**D6. Campaign pages.** Campaign pages solicit loans, not donations. Confirm that no charitable-solicitation or crowdfunding registration is triggered, and say what changes if a campaign may also accept outright gifts to the borrower. What privacy obligations (GLBA, state law) attach to a borrower's published story, and what consent must we obtain?

**D7. Tax.** When a lender forgives part of their share, or a share becomes uncollectable, what are the tax consequences for the borrower (cancellation-of-debt income, Form 1099-C thresholds) and for the lender (bad-debt or charitable treatment)? Does the Platform have any information-reporting duty on distributions of principal?

**D8. Disclosure.** What must each lender be told at pledge — for example loss of principal, no return, no secondary market, binding hardship extensions and pro-rata sharing — and in what form?

## 5. Part C — confirmations on the regulatory table

For each row, our working position is in [spec §US regulatory considerations](spec.md). Please confirm, correct, or qualify, and add anything we have missed.

| Area | Question |
| --- | --- |
| TILA / Reg Z | Confirm the qard has no finance charge and therefore no APR disclosure obligation, and that the Phase 3 murabaha markup is disclosed as a finance charge with an APR |
| State retail instalment sales acts | Is murabaha a credit sale under RISA in the launch states, and what disclosure and fee rules follow? |
| ECOA / Reg B | Adverse-action notice duties where a campaign is not funded or only partly funded, and where underwriting declines |
| FCRA | Permissible-purpose pulls, accuracy and furnishing duties |
| EFTA / Reg E | Form and revocability of ACH authorisations for repayment; error-resolution duties |
| BSA / AML, OFAC | KYC, monitoring and screening as a platform that is not the holder of funds |
| GLBA / state privacy | Privacy notices and information-sharing limits, including sharing with the bank partner and collection agents, and with the AI-agent platforms the Platform uses for operations, principally Grok Bot (xAI, accessed through Cursor), whose privacy follows Cursor account settings and requires cloud storage. Do its service terms meet Safeguards Rule service-provider oversight, and what contract terms must we obtain before any member data is placed on it? |
| UDAAP | Any residual exposure on a product that charges nothing; also the marketing language question — what may we say about "free"? |
| Money transmission | Confirm the bank-partner FBO structure avoids licensure in every launch state |
| ESIGN / UETA | E-signature and record-retention sufficiency for the qard agreement, the charity undertaking and board-approved templates |
| TCPA | Consent requirements for servicing reminders by call and text, and whether the charity undertaking changes the analysis |
| Insurance law | Does the member-funded protection fund constitute insurance or an unauthorised insurer arrangement in any launch state? If so, what structure cures it? |
| Charitable solicitation | Registration and reporting for the zakat pool and for the charity account receiving late-payment donations |
| Debt collection | Third-party and first-party collection conduct rules, given the Platform is not the creditor |

## 6. Deliverables and format

1. **Part A memo** — per-question answers with authority, and a per-state table giving licence required / not required / conditionally required, plus a recommended path per state.
2. **Part B memo** — exemption recommendation and structure, with a comparison of cost, timeline and ongoing obligations.
3. **Part D memo** — per-question answers with authority, with D1 and D3 answered first.
4. **Part C redline** — corrected version of the specification's regulatory table, which we will adopt.
5. **Model disclosure set** — the master qard agreement disclosures, the lender pledge disclosures, the charity undertaking, adverse-action notices, the privacy notice and the ACH authorisation. If you would rather review ours than draft them, tell us and we will produce a first draft.
6. **Phase 1 go / no-go** — a per-state recommendation on launch, with any state you advise excluding.
7. **Open items list** — anything you need from us, and any assumption in §2 you want verified before answering.

## 7. Assumptions we are asking you to challenge

These are the load-bearing assumptions in our current draft. If any is wrong, we would rather hear it now.

- Tenor and instalment structure **[TBC]** do not change the licensing analysis.
- The borrower pays the Platform nothing on a qard; each lender pays an agency fee, which is permissible because the creditor pays it and receives nothing from the borrower.
- Lender shares carry no return of any kind and are therefore not securities.
- No individual lender needs a lending licence, however many $5 shares they hold.
- Deposits sit in bank-partner FBO accounts, so the Platform is not a money transmitter.
- The Platform never acquires a receivable, so there is no sale-of-receivables question in Phase 1 (unless A4 or A10 leads to bank or Platform origination).
- The protection fund is a mutual arrangement among members, not insurance.
- The zakat pool is charitable giving, not an investment.

## 8. Process and liaison

Sh. Taha Abdul-Basser is the executive liaison for the Shari'a Board and is the point of contact for this engagement on Shari'a characterisation. Commercial and programme terms with Stearns Bank are handled by the Platform's operator with counsel, given the Stearns Salaam board overlap noted at A12(d). Where a legal question turns on how a contract is characterised under Shari'a — for example whether a payment is a fee for a service or a benefit tied to the loan — please route it through the liaison so that the legal and Shari'a positions are taken consistently and neither is answered in ignorance of the other. The Shari'a Advisor, Straightway Ethical Advisory, is issuing the companion [Shari'a Board brief](brief-shariah-board.md) in parallel; the two reviews are intended to converge before Phase 1 launches.
