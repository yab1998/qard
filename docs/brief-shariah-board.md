# Brief to the Shari'a Board — Charter, Scope and Questions for Fatwa

**Prepared for:** the Shari'a Board of the Platform, constituted by Straightway Ethical Advisory
**Prepared by:** Taha Abdul-Basser, Managing Partner, Straightway Ethical Advisory — executive liaison to the Shari'a Board
**Date:** [to insert]
**Companion document:** [Platform specification](spec.md) · [Brief to US counsel](brief-counsel.md)
**Status:** draft for the Board's review. The rulings recorded in the specification were prepared during drafting under the **provisional** label and are presented here for confirmation, revision or rejection — they are not to be treated as issued fatwa.

## 1. Appointment, authority and liaison

The Platform is designed, and its contracts are drafted, by **Straightway Ethical Advisory ("SEA")**, which is the Platform's **Shari'a Advisor** and which will constitute and provide the Platform's **Shari'a Board**.

The Platform does not take a Shari'a position on its own. No module, contract template, fee, ranking rule or collection practice goes live without a written resolution of the Board, and the Board's rulings are to be enforced in code, not only in policy. The specification's governance section sets out the machinery; this brief is where the Board is asked to authorise it.

**Liaison.** Sh. Taha Abdul-Basser is the **executive liaison for the Shari'a Board**. At this stage of development, in that capacity, he answers the Board's questions on the product's design, economics and technical implementation, and channels the Board's questions and rulings between the Board, the Platform's product team and US counsel. Board questions should be addressed to the liaison in the first instance. The intent is that no question reaches the Board unanswered on the facts, and that no ruling is issued on a fact pattern the Board has not actually seen.

**Proposed operating protocol** (for the Board's approval):

| Item | Proposal |
| --- | --- |
| Question routing | All questions from the Platform go to the Board through the liaison; all Board questions go to the Platform through the liaison |
| Turnaround | The liaison answers factual questions within **[TBC]** business days so the Board is never blocked on the facts |
| Response to rulings | The Board's resolutions are recorded, versioned and cited by ID in every affected contract template and rules-engine rule |
| Conflicts | Declared per member per module; a member who advises SEA on the product does not sit in judgment on that module's fatwa. Sh. Taha Abdul-Basser also sits on the Shari'a Supervisory Board of Stearns Salaam, the Islamic division of the target bank partner, Stearns Bank, N.A.; this is disclosed to both boards, and he recuses from Stearns Salaam's review of this programme |
| Confidentiality | Board papers are confidential to the Board, SEA, and the Platform's compliance officer |

## 2. The product, for the Board

The Platform is a US community crowd-lending product. It is modelled on SoLo Funds (neighbours funding neighbours' small emergency needs) and on LaunchGood's campaign mechanics, except that backers make loans rather than donations. A borrower's request is funded by **one or more lenders**, each pledging as little as $5. The Platform matches borrowers to lenders, collects each repayment once and distributes it pro rata to every lender on the loan. It keeps the community model and removes every channel through which a benefit returns to a lender because of the loan.

The reference model's economics rest on optional payments layered onto a nominally interest-free loan: a borrower tip paid to the lender, a borrower donation paid to the platform, and a paid default-protection add-on. The draft specification's Shari'a analysis characterises the tip as an increment on a qard, the loan-linked donation as a benefit to the intermediary tied to the loan, and the paid protection as a fee for a guarantee (*kafāla bi-ajr*). The analysis is set out in [spec §Shariah analysis of the reference model](spec.md), and the Board is asked to confirm it at §5.1 below before it is relied on publicly.

The replacement product has five modules, in four phases:

| Module | Contract | Who funds | What the funder receives | Phase |
| --- | --- | --- | --- | --- |
| A. Community crowd-qard | *Qard hasan*, one or more lenders per loan, Platform as collection agent | Individual members | Nothing — no return of any kind | 1 |
| B. Mutual protection fund | *Tabarruʿ* pool, Platform as *wakīl* | Opt-in lenders | Nothing; surplus carried forward in the fund | 2 |
| C. Zakat relief circle | Zakat to *al-ghārimīn* | Zakat payers | Nothing | 2 |
| D. Goods murabaha | Agency purchase + deferred-price sale | Investor pool | Fixed markup agreed at contract | 3 |
| E. Service ijara | *Ijāra mawṣūfa fī al-dhimma* | Investor pool | Fixed rental margin | 4 |

Phase 1 is the fee-free crowd-qard marketplace alone. It needs no investor-side securities structure and is the only module that must ship first. The crowd structure — how a pledge becomes a qard, how the lenders hold the debt between them, and how repayments are shared — is set out in [spec §Shariah analysis of the crowd structure](spec.md) and is put to the Board at §5.2a.

## 3. Scope of this review

The Board is asked to:

1. Confirm the Shari'a analysis of the reference model and of the removed features (§5.1).
2. Rule on Module A, the fee-free qard and its late-payment and collections path — the blocking fatwa for Phase 1 (§5.2) — and on the crowd structure through which many lenders fund one loan (§5.2a).
3. Confirm the five provisional rulings carried in the draft specification (§4).
4. Rule on the cross-cutting matters in §5.6, several of which affect Phase 1.
5. Approve the governance framework in §6, including the rules-as-code mechanism by which the Board's rulings will constrain live transactions.
6. Note the questions deferred to Phase 2 and 3, and confirm the phase gates in §7.

The Board is **not** asked to opine on US regulatory licensing or securities questions; those are before [counsel](brief-counsel.md). Where the two overlap — in particular on the charity undertaking, on whether the protection fund is insurance, and on bank-partner origination of a crowd-funded loan (Q39) — the liaison will keep the two reviews consistent.

## 4. The provisional rulings in the draft, for confirmation

The specification records these as resolved for the draft. They are presented for confirmation, revision or rejection.

| # | Matter | Provisional ruling |
| --- | --- | --- |
| R1 | Qard fee | A borrower fee is removed in full: no borrower fee, no allocated overhead, no cost recovery charged on the qard |
| R2 | Collection costs | Not recoverable; documented collection costs are not charged to a wilfully late borrower |
| R3 | Tawarruq | Excluded for cash needs through phase 3; to be reconsidered after phase 3 |
| R4 | Protection-fund surplus | Carried forward in the fund — neither refunded to participants nor paid to charity |
| R5 | Zakat settlement of unrecoverable qard | Permitted where the defaulted borrower qualifies as *ghārim*; the zakat pool may clear the outstanding qard including to the creditor-lenders, pro rata, and no lender may direct their own zakat to a debt owed to them |

R1 and R2 shape the entire revenue model and the collections path, and R5 shapes the zakat module. If the Board revises any of them, the specification's revenue model, collections section and module C must be redrafted before build.

## 5. Questions for ruling

### 5.1 The reference model and the removed features

**Q1.** Do you confirm the characterisation that a solicited tip on a qard is *riba al-qard* — that the maxim *kull qard jarra nafʿan fa-huwa riba* applies — and that describing the tip as "optional" does not cure it where the platform makes it customary and lets it drive funding (*al-maʿrūf ʿurfan ka-l-mashrūṭ sharṭan*)?

**Q2.** Do you confirm that a loan-linked donation to the platform is impermissible as designed, and that a paid default-protection add-on is a fee for a guarantee and impermissible?

**Q3.** Do you confirm that a late fee payable to the lender is impermissible, and that a charity undertaking is the correct replacement?

### 5.2 Module A — the fee-free qard (blocking for Phase 1)

**Q4.** Is the fee-free *qard hasan* as described — principal out, principal back, no charge to either party, no return to the lender — valid and permissible, and may the Platform operate it?

**Q5.** **Lender agency fee.** The Platform's revenue on a funded qard is an agency fee (*wakāla bi-ajr*) for matching, collection and distribution, paid by **each lender** on their own contribution. It may be a percentage of that contribution, is charged on top of the pledge at disbursement, is never deducted from the borrower's payments, and is not charged if a campaign fails. Is this permissible, given that each creditor pays it and receives nothing from the borrower? Does it matter that the fee is a percentage rather than a flat sum? Does it matter whether the fee is charged on funding or on a period of servicing?

**Q6.** **Lender motivation.** Lender motivation is non-financial by design: reputation badges, impact dashboards ("you helped 14 neighbours") and the social momentum of a campaign filling up. There are no lending circles; every lender is an individual member. Is there a level of non-financial incentive — ranking, badge, public recognition — at which the incentive itself becomes a benefit tied to the loan and therefore impermissible?

**Q7.** **Repayment above principal.** The draft takes the position that a borrower's voluntary repayment above principal (*ḥusn al-qaḍāʾ*) could in principle be permissible if unstipulated, unsolicited and not customary, but that the product must never prompt, display or rank by it — and that in practice the Platform should **not accept such a payment at all**. Do you confirm that the simple rule (do not accept it) is the correct one for this Platform, or would you permit a channel for it, and if so under what controls?

**Q8.** **The charity undertaking.** A borrower undertakes at signing to donate a fixed sum to a **third-party charity** if late without excuse (*iltizām bi-l-taṣadduq*). Is this permissible? Please address: (a) whether the amount may be fixed at signing; (b) whether it must be a genuine undertaking rather than a disguised penalty; (c) whether the Platform may remit it or whether the borrower must pay the charity directly; (d) whether the charity may be one the Platform selects, and whether the Platform may earn or recover anything in the process; (e) what must be disclosed and what must not be disclosed at signing so that the undertaking is not presented as a price of the loan; and (f) whether the same reasoning permits anything to be charged for actual collection costs, given R2.

**Q9.** **Hardship.** Documented hardship is to trigger a mandatory, fee-free extension and a revised schedule, on the basis of *fa-naẓiratun ilā maysara* (al-Baqara 2:280). Do you confirm that the extension must be fee-free, that the Platform must offer it rather than merely permit it, and that no charge of any kind may attach to it?

**Q10.** **Credit reporting.** Is furnishing a borrower's qard payment performance to credit bureaus permissible, and are there conditions — for example that the practice is disclosed at signing, that it is not used as leverage to extract payment above principal, and that hardship does not produce an adverse mark?

**Q11.** **Collections.** Is collection through fixed-fee or *juʿāla* agency permissible where the collected sum is principal only? Do you confirm the prohibition on selling or assigning defaulted qard at a discount (*bayʿ al-dayn*), and do you confirm that a wilfully late borrower loses borrowing access and reputation but is charged nothing?

**Q12.** **Ranking and discovery.** Campaigns are ranked only by need, fit, time remaining and track record, and never by anything a lender gains. Are the proposed ranking inputs permissible, and what must be excluded? Should the Platform maintain and present an audit log of ranking and auto-lend allocation inputs to the Board?

### 5.2a Module A — the crowd structure (blocking for Phase 1)

Questions Q31 onward are new in the crowd-lending design. Q1–Q30 keep their numbers so that earlier answers remain traceable.

**Q31.** **Pledge, then qard.** A lender's commitment to a campaign is proposed as a promise to lend (*waʿd*), not a qard. Pledged money is held in a non-interest custodial account in the lender's name and remains the lender's property (*amāna*). The lender may withdraw the pledge until the campaign closes, and the qard is formed only at disbursement, on the borrower's possession (*qabḍ*). If the target is not met, the borrower may accept a partial amount at or above a minimum stated in advance; otherwise every pledge is released in full. Do you confirm this analysis, and is the pledge binding on the lender at any point before disbursement?

**Q32.** **Characterisation of the lenders' holding.** Two structures are proposed. Under (a) *parallel qards* (preferred), each lender makes a separate qard of their own contribution under one master agreement, and appoints the Platform as collection agent (*wakīl bi-l-qabḍ*) with pro-rata sharing as a term of the agency. Under (b) *joint debt* (*dayn mushtarak*), the lenders hold one debt in common, so that what one co-creditor receives is shared with the others. Which characterisation does the Board adopt, and what follows from it for forgiveness, protection-fund claims and inheritance?

**Q33.** **Pro-rata distribution and equal rank.** Every repayment is split among the lenders in proportion to their contributions, on the same day, using a deterministic rounding rule under which each lender receives exactly their principal over the life of the loan and never more. No lender may be repaid ahead of another, and earlier or senior repayment may never be offered for a fee, a larger pledge or membership. Do you confirm that pari-passu sharing is required (or merely permitted), that bought priority is a benefit tied to the loan, and that the rounding rule — under which a lender may receive a cent before another on an individual payment but never more in total — is acceptable?

**Q34.** **One agent for many creditors.** The Platform collects from the borrower on a single schedule as agent for every lender, and lenders never contact the borrower directly. Does acting for all creditors at once, while also administering the borrower's schedule and hardship case, raise any conflict the Board requires the Platform to manage?

**Q35.** **Hardship binds every lender.** Because the extension under al-Baqara 2:280 is mandatory, the draft makes a hardship extension binding on every lender on the loan, with no opt-out and no lender entitled to faster repayment than the others. Lenders are told an extension was granted but not why. Do you confirm?

**Q36.** **Individual forgiveness.** Any lender may forgive (*ibrāʾ*) part or all of their own share as sadaqa. This reduces the borrower's balance by that amount and leaves the other lenders' entitlements unchanged. The Platform may present forgiveness as an option to lenders but must never prompt borrowers to ask for it or rank them by it. Is the borrower's acceptance required for the *ibrāʾ* to take effect? Do you approve these controls? May a forgiven amount count towards the lender's zakat, and if so on what conditions?

**Q37.** **Transfer of a share.** No secondary market is offered. A share passes to the lender's estate on death. Should a transfer to another member during the life of the loan ever be permitted, at face value only (*ḥawāla*), or should it be excluded altogether? The draft treats any transfer at a discount (*bayʿ al-dayn*) as prohibited.

**Q38.** **Auto-lend (phase 1b).** A lender may set a budget and criteria, and the Platform then lends their funds to eligible campaigns in $5 slices. Repaid funds are re-lent automatically unless the lender switches this off. Is this a valid standing agency to make qard on the lender's behalf (*tawkīl bi-l-iqrāḍ*)? Must each borrower be identified to the lender before or after the qard is made? Does automatic re-lending of repayments raise any concern?

**Q39.** **Bank-partner origination.** If counsel advises that the bank partner (target: Stearns Bank, N.A.) must originate the loan, the lenders would acquire their shares from the bank at face value immediately after disbursement. Is acquiring a qard receivable from a third party at par, for cash, permissible, and on which characterisation (*ḥawāla*, assignment, agency)? Would the Board prefer a structure in which the bank lends as the lenders' agent, so that the lenders are creditors from the outset?

**Q40.** **Campaign pages and dignity.** Borrowers choose how much of their identity and story to show, and the default is first name and purpose category only (*sitr*). Defaulters are never named publicly. Does the Board require stronger defaults? May a campaign also accept outright gifts (sadaqa) to the borrower that reduce the amount borrowed, as on LaunchGood, given that gifts and loans would then appear side by side?

**Q13.** **Marketing.** May the Platform describe the product as "free" or "interest-free"? What must it not say about the qard in marketing, and what disclosures should accompany every offer?

**Q42.** **Two boards.** Stearns Salaam has its own Shari'a Supervisory Board, which will review the account structure on the bank's side. Which questions does this Board decide alone (the qard, the crowd structure, distribution) and which may it rely on Stearns Salaam's certification for (the custodial account itself)? How should the two boards exchange rulings, given the overlapping member and his recusal at Stearns Salaam?

### 5.3 Module B — the mutual protection fund (Phase 2)

**Q14.** Is the proposed structure — lenders who opt in make a small contribution per loan into a pool on a *tabarruʿ* basis, the Platform managing it as *wakīl* for a fixed disclosed fee, the Platform never guaranteeing principal — a valid *tabarruʿ* arrangement and not a guarantee for a fee (*kafāla bi-ajr*) or commercial insurance?

**Q15.** Do you confirm R4, that surplus is carried forward in the fund and neither refunded to participants nor paid to charity? Please address whether carrying surplus forward indefinitely is sound, and whether a *tabarruʿ* pool that never distributes surplus and never returns it to contributors remains a true *tabarruʿ*.

**Q16.** What is the correct treatment of a claim that reimburses principal only? Do you confirm that the borrower's obligation survives the fund's payment — that the borrower still owes the fund, and that the fund may pursue principal only?

**Q17.** May the Platform's management fee be a percentage of contributions, and may the Board later approve an incentive fee on performance of the fund? What must be disclosed to contributors?

**Q41.** **Mixed cover on one loan.** Opt-in is per lender, so one loan may carry covered and uncovered shares. On default the fund reimburses only covered shares, then stands in those lenders' place for later recoveries on those shares, sharing pro rata with uncovered lenders. Do you confirm that the fund may take the lenders' place in this way, and that uncovered lenders have no claim on the fund?

### 5.4 Module C — the zakat relief circle (Phase 2)

**Q18.** Do you confirm that the zakat pool may be used to clear the qard of an eligible borrower under the *ghārimīn* category, and that the creditor-lenders may receive the settlement sum from the pool, shared pro rata?

**Q19.** **The mechanism.** Zakat requires transfer of ownership (*tamlīk*) to the eligible recipient. Does the Board require that the pool pay the borrower, who then discharges the debt, rather than paying the lender directly on the borrower's behalf? Please rule on the sequencing and on the documentation that evidences it.

**Q20.** Do you confirm the prohibition that no lender may direct their own zakat to a debt owed to them, and what control should the Platform operate to enforce it? The draft proposes that zakat gifts cannot be earmarked to a campaign, and that the allocation engine excludes a donor's gifts from any loan in which that donor holds a share. Is that sufficient, and must it also apply where the donor holds only a $5 share in a large loan?

**Q21.** Who may be appointed to assess *ghārim* eligibility, and what evidence must the Platform retain? Does the Board wish to certify the criteria, to review individual cases, or to delegate case review to the Platform's hardship process against Board-certified criteria with periodic reporting?

### 5.5 Modules D and E — deferred to their phases

**Q22.** Module D: is the proposed murabaha valid — the agent buys the item from the merchant, takes possession (*qabd*, actual or constructive), then sells to the member at cost plus a fixed markup payable in instalments? Please rule on: (a) whether constructive possession suffices and what the ownership record must show; (b) whether the member's promise to purchase is binding (*murabaha li-l-āmir bi-l-shirāʾ*) and what the Platform may do if the member refuses; (c) the merchant-locked card as the purchase mechanism; (d) the prohibition on rollover, rate reset and any late increment; (e) whether a *rahn* or other security may be taken; and (f) the permissibility of the penalty clause directing any delay amount to charity.

**Q23.** Module E: is *ijāra mawṣūfa fī al-dhimma* — the pool contracting for a service such as a repair or tuition from the provider and re-providing it to the member at a fixed deferred price — valid here, and who bears what risk at each stage?

**Q24.** Do you confirm that cash disbursement through *tawarruq* remains excluded through phase 3 (R3), and what would have to change for the Board to reconsider it after phase 3?

### 5.6 Cross-cutting

**Q25.** **Purification.** Impermissible income, such as bank interest credited despite controls, is booked to a purification ledger and paid to charity quarterly. Do you confirm the treatment and the reporting duty to the Board?

**Q26.** **Interest on float.** Do you confirm that non-interest-bearing custodial accounts with the bank partner (target: Stearns Bank, N.A., through Stearns Salaam) are required, rather than Stearns Salaam's profit-sharing savings products, and that any accrual realised notwithstanding controls is purified rather than retained?

**Q27.** **Membership fee.** An optional flat monthly membership for platform access is proposed as *ijāra* of platform access. It must not be required in order to borrow and must not scale with borrowing. Do you confirm this is permissible and that these two conditions are the operative ones?

**Q28.** **Loss and insolvency.** Where a borrower is genuinely insolvent and no fund or zakat route applies, do you confirm that the loss falls on each lender in proportion to their share, as owner of that part of the receivable, and that the Platform may not indemnify any lender outside the *tabarruʿ* fund?

**Q29.** **Rules as code.** The specification proposes that the Board's rulings compile into a versioned rules engine that blocks a failing transaction and alerts compliance — for example "each lender's cumulative receipts ≤ that lender's contribution", "distribution is pro rata on every payment", "no lender-visible field derived from borrower payments above principal" and "no allocation of a donor's zakat to a loan the donor holds a share in". Will the Board approve rulings in an encodable form, and will it review and sign off the rule set derived from each ruling before that rule constrains live transactions?

**Q30.** **Contract templates and disclosure.** May the Board approve a template once, with a version identifier tied to the resolution, so that the Platform can generate per-transaction contracts without a fresh resolution each time? What must each contract show — the Board expects each to display its contract type and the Board's approval reference, and, for the master qard agreement, each lender's share and the pro-rata rule.

## 6. Governance framework to be approved

The Board is asked to approve the following, which the specification commits the Platform to operate:

- **Composition:** at least three qualified scholars, constituted per AAOIFI GS 1, appointed by SEA as Shari'a Advisor.
- **Independence:** the external annual Shari'a audit is performed by an independent firm that is neither the Board's advisor nor the product's designer. The Board is asked to confirm that this independence requirement is met given SEA's dual role as advisor and board provider, and to say what ring-fencing it requires internally.
- **Fatwa per module:** a written resolution per module before that module ships, plus a Shari'a policy manual.
- **Internal Shari'a review:** a compliance officer tests live transactions against the manual monthly, with results reported to the Board.
- **External Shari'a audit:** annual.
- **Change control:** product, pricing, matching-algorithm and contract changes route through a Board-approval workflow in the admin console.
- **Rulings as code:** as at Q29.
- **Disclosure:** each contract shows its contract type and the Board's approval reference.

## 7. Phase gates

| Phase | Ships | Board action required to proceed |
| --- | --- | --- |
| 0. Foundations | Board constituted, policy manual, counsel opinion, bank partner | Constitution, protocol in §1, governance in §6 |
| 1. MVP | Module A (crowd campaigns, browse, pro-rata distribution), hardship flow, charity and purification ledgers, launch states | Fatwa on A: Q4–Q13 and Q31–Q37, Q39–Q40, Q42, plus Q25, Q26, Q30 |
| 1b. Auto-lend | Auto-allocation of lender budgets, re-lending of repayments | Q38; Board approval of the allocation rules |
| 2. Safety net | Modules B and C | Fatwa on B and C: Q14–Q21 and Q41, plus R4 and R5 confirmed |
| 3. Returns | Module D, investor onboarding | Fatwa on D: Q22, Q24 |
| 4. Services | Module E | Fatwa on E: Q23 |

Nothing in phase 1 ships until the Module A fatwa is issued. The Platform will not accept funding on a live qard before that.

**Target timing.** The [business plan](business-plan.md) aims to open an invite-only pilot in one state in the week of 14 December 2026. It asks the Board for the Module A fatwa by **27 November 2026**, and for sign-off of the rules-as-code set derived from it by **11 December 2026**. The plan's fallback, a pilot in which lenders make non-binding pledges and no qard is made, still needs Q31 and Q40 answered.

## 8. What the liaison will bring to the next session

- A written answer to every factual question the Board raises at §5, with the specification's supporting language.
- The draft contract templates for Module A: the master qard agreement with its share table, the pledge terms, the charity undertaking, and the hardship extension.
- A worked example of a crowd-funded loan from pledge to final payment, showing each lender's distribution on every payment, a partial forgiveness and a hardship extension.
- The draft rules-engine rule set derived from R1, R2 and the Module A rulings.
- Counsel's position on the charity undertaking and on whether the protection fund is insurance, once received.
- A revised specification incorporating the Board's rulings, with each ruling cited by ID.
- The operating model for the pilot: one human operator with AI-agent teams running on Grok Bot (xAI) or a near alternative. Agents prepare and draft, never issue or paraphrase Shari'a rulings to members, and never move money; every decision that affects a member is the operator's.
