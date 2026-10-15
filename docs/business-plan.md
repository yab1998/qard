# Business Plan — Q4 2026 Launch

Oct 13, 2026 · companion to the [specification](spec.md)

The goal is to have the crowd-qard marketplace online by **31 December 2026** with **one human operator** running **agent-based teams**, funded without outside capital. Legal counsel is **Musa Abdul-Basser**, Partner at Hayes Law and Compliance (see *Legal counsel*). The target bank partner is **Stearns Bank, N.A.**, through its Islamic banking division, **Stearns Salaam**. Company operations run on **Grok Bot** (xAI), or a near alternative. This plan compresses the specification's Phase 0 (foundations) and Phase 1 (Module A) into one quarter. It does so by launching a small, invite-only pilot in one state and deferring everything that is not needed for a first loan.

## Summary

| Item | Plan |
| --- | --- |
| Launch target | Closed pilot live in the week of **14 December 2026**, with buffer to 31 December |
| What goes live | Module A only: campaigns, pledges, browse, disbursement, pro-rata distribution, hardship flow, charity and purification ledgers |
| What waits | Auto-lend (1b), protection fund and zakat circle (phase 2), murabaha and ijara (phases 3–4), native mobile apps |
| Where | One launch state, chosen by counsel from the eight in the spec as the one with the clearest licensing path |
| Pilot size | Invite-only, about 50 borrowers and 200 lenders; first loan $100, pilot maximum loan $500, total pilot book capped at $25,000 |
| Bank partner | **Stearns Bank, N.A. (Stearns Salaam)** for non-interest FBO accounts and ACH; one backup bank kept warm (see *Banking partner*) |
| Counsel | **Musa Abdul-Basser**, Partner, Hayes Law and Compliance (HLC); Of Counsel, NOVA Business Law Group. Engaging firm to be confirmed |
| Team | One operator plus six agent teams running as Grok Bot Team Bots; every action that moves money, decides credit, or speaks for the platform needs the operator's approval |
| Funding | Bootstrapped; Q4 cash need roughly **$30k–$110k**, mostly counsel and banking (see *Budget*) |
| Fallback | If payment rails are not live in time, launch a **pledge-intent** pilot (campaigns and non-binding pledges, no money moves) and switch on lending in Q1 |

## What "online this quarter" means

The long pole is not software. It is the three external gates the spec already requires before a qard can be funded: the Module A fatwa, counsel's opinion for the launch state, and a bank partner holding funds in non-interest FBO accounts. Agents can compress the build to weeks. They cannot compress a bank's onboarding or a board's deliberation. The plan therefore runs four tracks in parallel and defines two launch tiers.

| Tier | Goes live when | What members can do |
| --- | --- | --- |
| **Tier 1 — lending pilot (target)** | All six go/no-go gates pass | Real campaigns, real pledges, real disbursement and repayment in one state |
| **Tier 2 — pledge-intent pilot (fallback)** | Fatwa and counsel gates pass, rails not yet live | Borrowers onboard and post campaigns; lenders make non-binding pledges; no money moves until rails go live. Counsel must confirm this is permissible marketing (see counsel brief A11) |

A public waitlist and information site go live in week 4 under either tier.

## Go/no-go gates for the lending pilot

| # | Gate | Owner | Evidence |
| --- | --- | --- | --- |
| G1 | Module A fatwa issued | Shari'a Board, via the liaison | Written resolution on Q4–Q13, Q31–Q37, Q40 and Q42 (Q39 too if a bank originates) |
| G2 | Counsel's written clearance for the pilot state | Counsel | Part A (A1, A2, A4, A5, A11) and Part D (D1, D2, D4, D5, D8) answered for that state |
| G3 | Payment rails live in production | Operator | Stearns programme agreement signed and the bank's onboarding review passed; FBO account open and non-interest; Stearns Salaam's Shari'a Supervisory Board has cleared the account structure; ACH in and out tested with real $1 transfers |
| G4 | Ledger and distribution proven | Build team, operator sign-off | All ledger invariants pass; a 10,000-loan simulation distributes with zero-cent discrepancy; one full reconciliation against the bank |
| G5 | Contracts and disclosures approved | Counsel and Board | Master qard agreement, pledge terms, charity undertaking, hardship extension, privacy notice, ACH authorisation, each with a Board resolution ID |
| G6 | Information-security programme in place | Operator | GLBA Safeguards Rule written programme; Grok Bot accounts split and configured as in *Agent platform*; data terms in place with every agent platform that touches member data; access review done |

If G1, G2, G4, G5 and G6 pass but G3 does not, launch Tier 2.

## Timeline

Weeks run Monday to Sunday. Week 1 is the current week.

| Week | Dates | Legal and Board | Rails and vendors | Build | Go-to-market |
| --- | --- | --- | --- | --- | --- |
| 1 | Oct 13–18 | Engagement letter (confirm HLC or NOVA as engaging firm; agree whether a consumer-finance specialist joins for Parts A and C); send both briefs; ask counsel for the pilot-state recommendation first; convene the Board | Open talks with Stearns Bank (Salaam division and its fintech-partnerships team); identify one backup bank; shortlist KYC and bank-data vendors | Load the factory backlog; scaffold the app, ledger and rules engine | Name, domain, brand basics |
| 2–3 | Oct 19–Nov 1 | Board session 1 (Q4–Q13, Q31–Q37); counsel's preliminary view on D1 and the pilot state | Stearns term sheet and the bank's onboarding questionnaire; vendor sandboxes | Ledger, distribution engine, rules engine, campaigns, pledges | Waitlist copy, reviewed against counsel's language |
| 4–5 | Nov 2–15 | Pilot state chosen; contract templates drafted; Board session 2 (Q39–Q40, rules sign-off) | Stearns programme approval targeted; production onboarding starts; Stearns Salaam Shari'a board review of the account structure | KYC, bank linking, e-sign, hardship flow, admin and Board console | **Waitlist and information site live**; outreach through community channels |
| 6–7 | Nov 16–29 | **Target: Module A fatwa (G1)**; counsel's written opinion (G2); disclosures (G5) | Stearns onboarding continues (Thanksgiving week is slow) | End-to-end in sandbox; security review; 10,000-loan simulation | Recruit pilot lenders and borrowers from the waitlist |
| 8–9 | Nov 30–Dec 13 | Board signs off on rules-as-code; counsel reviews final screens | **Target: rails live (G3)**; $1 tests | Fix list; reconciliation dry run (G4); Safeguards programme (G6) | Pilot invitations and onboarding |
| 10 | Dec 14–20 | Go/no-go review | — | Production cut-over | **Pilot opens** (Tier 1, or Tier 2 if G3 is late) |
| 11–12 | Dec 21–31 | Monthly internal Shari'a test on pilot transactions | Daily reconciliation | Hot fixes only | First repayments distributed; Q1 plan |

**Critical path:** rails (G3), then the fatwa (G1), then counsel (G2). Rails go first because bank onboarding commonly takes months, which is why the pledge-intent fallback exists. Stearns shortens the path: it already sponsors fintech programmes and runs an Islamic division whose Shari'a board knows the platform's Shari'a Advisor. Its third-party risk and BSA/AML review of a new programme still cannot be compressed by the platform. The fatwa is lower risk because the Shari'a Advisor constitutes the Board, but the Board needs the answered questions in time. Counsel is lower risk now that counsel is identified, provided the pilot-state question is answered first rather than all eight states at once.

## Legal counsel: Musa Abdul-Basser

Musa Abdul-Basser is a capital markets, cross-border transactional and compliance attorney. He has been a Partner at Hayes Law and Compliance since July 2026 and is Of Counsel to NOVA Business Law Group, LLP. Which firm is engaged is still to be confirmed.

| Period | Role |
| --- | --- |
| Jul 2026 – present | Partner, Hayes Law and Compliance |
| Apr 2025 – Jul 2026 | Senior Counsel, Calfee, Halter & Griswold LLP |
| Jan 2019 – Mar 2025 | Chief Legal Officer / Global General Counsel, Wahed Inc. / Wahed Invest LLC |
| Sep 2011 – Oct 2017 | SVP, Legal & Compliance, International Islamic Liquidity Management Corporation (Kuala Lumpur) |
| May 2009 – Oct 2011 | VP, Legal Affairs & Shariah Compliance, The Datestone Group LLC |
| Earlier | Associate at Curtis, Mallet-Prevost, Colt & Mosle; Chadbourne & Parke; Thacher Proffitt & Wood |

**Fit with the counsel brief.** His experience lines up most directly with the questions on the critical path for structure. These are whether lender shares are securities and whether the Platform needs to register (Part D, D1–D3), the murabaha investor pool (Part B), and the meeting point of US regulation and Shari'a compliance in a US Islamic fintech (Wahed). Parts A and C turn on state consumer-lending licensing, money transmission, fair lending and debt collection in eight states. For those, ask him in week 1 whether to bring in a consumer-finance specialist for the state survey, and keep any such cost inside the counsel budget line.

**Conflicts register.** Record counsel's other affiliations (including any compliance or advisory roles) and any personal or professional relationship with the Shari'a Advisor or the operator, alongside the Stearns Salaam overlap below.

## Banking partner: Stearns Bank, N.A.

**Why Stearns.** Stearns Bank, N.A. runs an Islamic banking division, [Stearns Salaam](https://www.stearnsbank.com/salaam). Its deposit and financing products are certified by an independent Shari'a Supervisory Board, and its personal Salaam account [neither earns nor pays interest](https://www.stcloudlive.com/business/muslim-community-served-by-faith-based-division-at-stearns-bank). Separately, Stearns acts as a sponsor bank for fintech programmes. Reported partnerships include [Synctera](https://www.businesswire.com/news/home/20230919506020/en/Banking-as-a-Service-Veteran-Stearns-Bank-Partners-With-Synctera) (2023), [WireFX](https://www.crowdfundinsider.com/2022/10/197897-wirefx-stearns-bank-to-serve-fintechs-payment-firms/) (2022) and [Lithic](https://www.01net.it/lithic-expands-partner-bank-network-with-addition-of-stearns-bank/) (card issuing, 2026). Few banks combine a Shari'a-governed division with an existing fintech sponsorship practice. Stearns is headquartered in St. Cloud, Minnesota, and Minnesota is one of the eight launch states, so counsel is asked whether Minnesota is the natural pilot state (counsel brief A12).

**What the platform needs from Stearns in Q4**

| Need | Detail |
| --- | --- |
| FBO custodial accounts | Hold pledges, undisbursed funds and repayments for members, never commingled with platform money. **Non-interest and non-profit-bearing**, unlike the profit-sharing Salaam savings products |
| ACH origination | Pledge funding, disbursement to borrowers, repayment collection, lender withdrawals; debit push or RTP later |
| Sub-ledger support | Daily statements and transaction files that the ledger team reconciles against the platform's ledger |
| Programme approval | The bank's third-party risk, BSA/AML and compliance review of the platform as a programme partner |
| Shari'a clearance | Stearns Salaam's Shari'a Supervisory Board confirms the account structure fits its standards |
| Later, if counsel advises | A role in originating loans (counsel brief A4; Board brief Q39) |

**Direct or through a programme manager.** Stearns may prefer to onboard a new programme directly, or through a banking-as-a-service platform it already works with, such as Synctera. A programme manager can speed onboarding and provide ledger, KYC and compliance tooling, but it adds fees and a party. This is decided in week 2 or 3 on Stearns's preference and the costs.

**Conflicts of interest.** Sh. Taha Abdul-Basser, Managing Partner of Straightway Ethical Advisory, the platform's Shari'a Advisor and executive liaison to its Shari'a Board, is also listed as a member of the Stearns Salaam Shari'a Supervisory Board. The overlap is an advantage, because both boards will understand the structure. It must still be managed in the open:

- Disclose it in writing to Stearns, to the platform's Shari'a Board and to counsel at the start of talks.
- Sh. Taha recuses from Stearns Salaam board deliberations on this programme, and the other Stearns Salaam board members review it.
- Commercial terms with Stearns are negotiated by the operator with counsel, not by the Shari'a Advisor.
- The conflicts register also records any personal or professional relationship among counsel, the Shari'a Advisor and the operator.

**Backup.** Keep one alternative sponsor bank or community development financial institution warm through November, so that a Stearns delay or decline moves the plan to Tier 2 rather than stopping it.

## Operating model: one operator, agent teams

The operator is the platform's only human. They are the accountable officer for credit, money movement, compliance, security (the GLBA "qualified individual") and member communications, and they hold the Board liaison relationship with Straightway Ethical Advisory. Agents do the work; the operator decides.

The teams run on **Grok Bot** (see *Agent platform* below), one named Team Bot per team, or on a near alternative if Grok Bot cannot meet the data rules. The build team already exists in this repository as the software factory (`/factory`). It can stay on Claude Code or move to Cursor, where Grok Bot runs.

| Team | Does | Never does | Operator approves |
| --- | --- | --- | --- |
| **Build** (existing factory: spec-writer, builder, three reviewers, approver) | Specs, code, tests, reviews, merges | Auto-merge code touching the ledger, distribution, rules engine, payments or contract templates | Every merge in those areas; every production deploy |
| **Compliance and Shari'a desk** | Maps each Board ruling to a rules-engine rule; drafts board papers and liaison answers; tracks Q- and D-question status; prepares the monthly internal Shari'a test sample | Interpret a ruling the Board has not issued; change a rule | Every rule change (after Board sign-off); every paper sent to the Board or counsel |
| **Member operations** | Triages support; checks campaign stories for privacy and fraud flags; prepares the KYC exception queue; takes hardship intake and drafts the case summary | Approve or decline credit; grant or refuse hardship; message a member without approval during the pilot | Every credit exception, hardship decision and campaign publication |
| **Ledger and finance** | Daily reconciliation of ledger against bank; verifies each distribution run; keeps the purification and charity ledgers; month-end pack | Initiate or release any payment | Every payment batch; every reconciliation break |
| **Growth and community** | Waitlist, content, community-channel outreach, lender education, pilot recruiting | Publish any claim about the loan not on counsel's approved list; mention returns of any kind | Every public post and email campaign |
| **Counsel and vendor desk** | Prepares counsel questions and tracks answers; manages vendor onboarding checklists and contracts | Agree terms or sign | Every contract and every message to counsel, the bank or a regulator |

**Hard rules for all agents**

- No agent holds credentials that can move money. Payment initiation needs the operator's second factor.
- Underwriting is deterministic and rule-based, with no language-model judgement in the credit decision, so that ECOA adverse-action reasons are exact and explainable.
- Agents see member personal data only in the member-operations and ledger teams, with redaction by default, and every access is logged.
- Agents do not issue or paraphrase Shari'a rulings to members. Member-facing Shari'a statements come only from Board-approved text.

### Agent platform: Grok Bot

[Grok Bot](https://x.ai/news/introducing-grok-bot) is xAI's always-on agent product. Each Bot is a named teammate with a job and its own memory. Bots work on a persistent cloud computer with a browser, filesystem and terminal, so they keep working when the operator's laptop is closed. They can run in parallel, message each other, hand off work, save a workflow as a **skill** and rerun it on a schedule as a **routine**. They also pause for approval before consequential actions ([docs](https://docs.x.ai/grok-bot/overview)). Grok Bot is in **beta**. It is included with paid Cursor plans and Cursor Teams, or with a linked SuperGrok subscription, with weekly usage and paid on-demand usage. Enterprise access and admin controls are still rolling out ([FAQ](https://docs.x.ai/grok-bot/faq)).

Five facts from xAI's documentation shape how the platform uses it.

| Grok Bot fact (per xAI docs) | Consequence for the platform |
| --- | --- |
| All Bots on an account share one cloud computer, including files, browser sessions and logins, and xAI says not to treat separate Bots as a security boundary | Separate Bots are not separate teams for security purposes. Use **two Grok Bot accounts**: *Ops* for build, growth, the compliance and Shari'a desk, and the counsel and vendor desk, with no member data; and *Member data* for member operations and ledger work, enabled only when G6 data terms are in place |
| Sign-ins, 2FA and CAPTCHAs are human takeovers, and browser sessions then persist on the shared computer | The operator **never** signs the Bot computer into the bank portal, payment rails, KYC admin, production database or e-signature account. Bots work from exports and read-only views the platform's admin console generates |
| Approvals follow the tool, the risk and "Ask first" / Auto-review rules | Configure Ask-first for every send, publish, delete, purchase and production change, matching the operator-approval column above. Write each Bot's standing boundaries into its description |
| Privacy follows Cursor account settings, cloud storage is required (Legacy Privacy Mode unsupported), and deleting a Bot can leave files on the shared computer | Set the training opt-out. Do not put member personal data on Grok Bot until counsel confirms the service-provider terms meet the GLBA Safeguards Rule (counsel brief Part C). Clear the shared computer when a Bot is retired |
| Skills and routines run on schedules | Use routines for the daily reconciliation pack, distribution-run checks, the weekly Board and counsel question tracker, and the Monday metrics report |

**Portability.** Keep every team's runbook as a markdown skill in this repository, not only inside Grok Bot. If Grok Bot's beta terms, enterprise controls or data handling do not meet G6, the same runbooks move to a near alternative (OpenAI's agent products, or Claude Code subagents as the build team already uses) without redesigning the operating model.

**Operator's week (target, about 50 hours)**

| Work | Hours |
| --- | --- |
| Approvals across all teams (merges, payments, credit and hardship exceptions, posts) | 15 |
| Board liaison and counsel | 10 |
| Rails, bank and vendor relationships | 10 |
| Product decisions and pilot member conversations | 10 |
| Security and access review, incident handling | 5 |

Approval load is the operator's bottleneck. If approvals exceed about 15 hours a week, cap pilot onboarding rather than relax the rules.

## Technology choices for speed

- **Mobile-first web app (PWA), not native apps.** It avoids app-store review on the critical path. Native apps move to 2027.
- **One relational database** with the double-entry ledger as the source of truth, and the distribution engine and rules engine as pure functions over it, so every distribution run can be replayed.
- **Bought, not built:** KYC and identity verification, bank-account linking, e-signature and payment rails all come from vendors.
- **Out of the pilot:** auto-lend, the protection fund, the zakat pool, gifts on campaigns and lender share transfers.

## Revenue and unit economics

The spec allows one revenue stream on Module A: a **lender agency fee**, charged on each lender's contribution at disbursement. The borrower is charged nothing.

**Pilot recommendation: waive the lender fee in Q4.** At a $25,000 pilot cap, a 2% fee earns at most $500. Waiving it costs little, and the pilot's real question is whether lenders will lend at zero return in volume. Charging them as well would confound that test. Introduce the fee in Q1 and measure the change in pledging.

**Steady state.** Recycled capital pays the fee again on each new disbursement, so revenue tracks funded volume, not lender capital.

| Monthly funded volume | Revenue at 1% | Revenue at 2% | Revenue at 3% |
| --- | --- | --- | --- |
| $100,000 | $1,000 | $2,000 | $3,000 |
| $250,000 | $2,500 | $5,000 | $7,500 |
| $500,000 | $5,000 | $10,000 | $15,000 |
| $1,000,000 | $10,000 | $20,000 | $30,000 |

With steady-state running costs of about $5,000–$10,000 a month (see below, excluding any salary for the operator), break-even sits at roughly **$250,000–$500,000 funded a month at a 2% fee**. At a $300 average loan, that is about 800–1,700 loans a month. The optional flat membership (spec §Platform revenue model) and the phase 3 murabaha agency fee are the routes to a living wage for the operator, and neither ships this quarter.

**The main business risk** is lender supply. A lender who earns nothing and also pays a fee is giving charity with extra steps. The pilot must show that community motivation, impact reporting and the $5 minimum produce enough pledges to fill campaigns quickly. The key metric is the ratio of pledged to requested dollars.

## Budget (bootstrapped)

These are planning ranges for a one-quarter launch, not quotes, and each must be replaced with a real quote as vendors are chosen. Counsel's fees and the rails provider's set-up and minimums are the two largest unknowns.

| Item | One-off (Q4) | Monthly |
| --- | --- | --- |
| Counsel: pilot-state opinion, Part D, disclosures | $15,000–$60,000 | — |
| Shari'a Board honoraria (Module A fatwa) | $3,000–$10,000 | — |
| Entity formation, registered agent, EIN, bank account | $1,000–$2,500 | — |
| State licence and surety bond, if counsel says the pilot state needs one | $0–$10,000 | — |
| Stearns programme set-up and monthly minimum (and programme-manager fees if one is used) | $0–$15,000 | $500–$3,000 |
| Insurance (cyber, E&O) | $2,000–$6,000 a year | — |
| Grok Bot (Cursor Teams seats or SuperGrok subscriptions for two accounts, plus on-demand usage) | — | $300–$1,500 |
| Cloud hosting, database, monitoring | — | $100–$500 |
| KYC and bank-data vendors (per-check fees at pilot volume) | — | $100–$500 |
| E-signature, email, workspace tools | — | $100–$300 |
| Community marketing (events, printing, small paid tests) | $500–$2,000 | — |
| **Q4 total, including roughly 3 months of monthly costs** | **about $30,000–$110,000** | |

**Capital rules that follow from the spec**

- The platform never fronts loan money. Disbursement happens only from collected pledges, so ACH returns and timing gaps never create platform-funded credit.
- The platform may not indemnify lenders outside the tabarru' fund (Board brief Q28), so there is no loss reserve to fund. Pilot lenders must understand that the full loss of principal is possible, and counsel's D8 disclosure covers this.
- Keep three months of running costs in reserve after launch. If the reserve falls below that, pause new pilot onboarding before cutting compliance work.

## Pilot metrics

| Metric | Target for the pilot |
| --- | --- |
| Pledged ÷ requested dollars | ≥ 1.0 across the pilot |
| Campaigns fully funded within the window | ≥ 80% |
| Median time to fund a $100 first loan | ≤ 48 hours (auto-lend should cut this in Q1) |
| On-time repayment | ≥ 90% of instalments |
| Hardship cases opened | Tracked, no target; every one decided within 3 business days |
| Distribution discrepancies | 0 cents |
| Reconciliation breaks unresolved after 1 business day | 0 |
| Rules-engine blocks | Each reviewed within 1 business day |
| Operator approval hours a week | ≤ 15 |

## Risks

| Risk | Likelihood | Effect | Mitigation |
| --- | --- | --- | --- |
| Stearns onboarding not complete by mid-December | Medium | No real lending in Q4 | Start in week 1; offer a programme manager if Stearns prefers one; Tier 2 pledge-intent launch; one backup bank kept warm |
| Stearns declines the programme | Low–Medium | Rails restart with another bank | Backup bank; the pledge-intent pilot keeps the community engaged |
| Overlap between the Shari'a Advisor and Stearns Salaam's board is seen as a conflict | Medium | Bank or regulator questions; reputational risk | Written disclosure, recusal at Stearns Salaam, commercial terms negotiated by the operator with counsel |
| Grok Bot beta limits, outages or data terms fall short | Medium | Operations slow; member-data teams cannot use it | Two-account split; no member data until G6; runbooks portable to a near alternative |
| Counsel finds lender shares may be securities (D1) | Medium | Structure change; delay | Ask D1 first; prepare the bank-originates or platform-as-lender alternatives (A4, A10) |
| Pilot state needs a lending licence with a long approval | Medium | Delay | Counsel picks the state with the clearest path; bank origination route |
| Lender supply too thin | Medium | Slow funding; borrowers leave | Fee waived; $5 minimum; recruit lenders before borrowers; cap borrower invitations to lender supply |
| One-operator bottleneck or absence | High | Approvals stall; nobody covers | Approval caps; a named back-up approver at the Shari'a Advisor for emergencies; runbooks written by agents |
| Agent error reaches a member or moves money | Low (by design) | Harm, UDAAP exposure | No money credentials for agents; operator approval on every member message during pilot; audit logs |
| Fraud or synthetic identities | Medium | Losses to lenders | KYC, low caps, one active loan per borrower, story review |
| Board timing slips | Low | Delay | Questions answered by the liaison within the turnaround in the Board protocol; rules sign-off batched |

## Q1 2027 (preview)

Turn on the lender fee and measure its effect. Ship auto-lend (phase 1b) once D3 and Q38 are answered. Add a second state. Start phase 2 preparation (protection fund and zakat circle opinions). Decide on hiring a second human, triggered when approval hours exceed 15 a week for four consecutive weeks.
