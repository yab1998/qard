// Qard sandbox UI. One file, no framework: state in, HTML out.
// `backend` is either the remote server or an in-page platform (demo build).

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const usd = (c) => {
  const a = Math.abs(c);
  const whole = Math.floor(a / 100).toLocaleString('en-US');
  const cents = a % 100;
  return `${c < 0 ? '−' : ''}$${whole}${cents ? '.' + String(cents).padStart(2, '0') : ''}`;
};
const usd2 = (c) => `${c < 0 ? '−' : ''}$${Math.floor(Math.abs(c) / 100).toLocaleString('en-US')}.${String(Math.abs(c) % 100).padStart(2, '0')}`;
const pct = (a, b) => (b ? Math.max(0, Math.min(100, Math.round((a / b) * 100))) : 0);

export function start(backend, root = document.getElementById('app')) {
  const ui = { viewer: 'M2', tab: 'lend', flash: null, view: null };

  const TABS_MEMBER = [['lend', 'Lend'], ['mine', 'My lending'], ['borrow', 'Borrow']];
  const TABS_OP = [['queue', 'Queue'], ['loans', 'Loans'], ['ledger', 'Ledger'], ['rules', 'Rules'], ['checks', 'Checks']];

  async function load() {
    ui.view = await backend.view(ui.viewer);
    render();
  }

  async function act(cmd, okMessage) {
    const { error, view } = await backend.dispatch(cmd, ui.viewer);
    ui.view = view;
    if (error) ui.flash = { bad: true, rule: error.rule, text: error.rule ? error.message.replace(`${error.rule}: `, '') : error.message };
    else ui.flash = okMessage ? { text: okMessage } : null;
    render();
  }

  // ---------- pieces ----------
  const statusPill = (s) => {
    const map = { Repaying: 'good', 'Repaid in full': 'good', RepaidInFull: 'good', 'Payment late': 'warn', PaymentLate: 'warn', 'In default': 'bad', DefaultAfterCure: 'bad', Open: 'good', Draft: '', FullyPledged: 'good', BelowTarget: 'warn', PartialAccepted: 'good' };
    const label = { RepaidInFull: 'Repaid in full', PaymentLate: 'Payment late', DefaultAfterCure: 'In default', FullyPledged: 'Fully pledged', BelowTarget: 'Below target', PartialAccepted: 'Partial accepted', Draft: 'In review' }[s] || s;
    return `<span class="pill ${map[s] || ''}">${esc(label)}</span>`;
  };

  const progress = (c) => `
    <div class="meter" role="img" aria-label="${pct(c.pledged, c.target)}% pledged"><i style="width:${pct(c.pledged, c.target)}%"></i></div>
    <div class="row small"><span class="grow num"><b>${usd(c.pledged)}</b> pledged of ${usd(c.target)}</span>
    <span class="muted">${c.lenders} lender${c.lenders === 1 ? '' : 's'}${c.daysLeft != null && c.status === 'Open' ? ` · ${c.daysLeft} day${c.daysLeft === 1 ? '' : 's'} left` : ''}</span></div>`;

  function campaignCard(c, v) {
    const min = v.config.min;
    const options = [];
    for (const d of [500, 1000, 2500, 5000]) if (d <= c.remaining) options.push(d);
    if (c.remaining > 0 && !options.includes(c.remaining)) options.push(c.remaining);
    const canPledge = c.status === 'Open' && !c.isMine && c.remaining >= min;
    return `<article class="card">
      <div class="row"><h3 class="grow">${esc(c.firstName)} · ${esc(c.purpose)}</h3>${c.urgent ? '<span class="pill warn">Urgent</span>' : ''}${c.status !== 'Open' ? statusPill(c.status) : ''}</div>
      ${c.story ? `<p>${esc(c.story)}</p>` : ''}
      ${progress(c)}
      <p class="small muted">Repays in ${esc(c.plan)} · ${esc(c.record)}</p>
      ${c.isMine ? '<p class="small muted">This is your campaign.</p>' : ''}
      ${c.myPledge ? `<div class="row small"><span class="grow">Your pledge: <b class="num">${usd(c.myPledge)}</b></span>${c.status === 'Open' ? `<button class="btn ghost sm" data-act="withdrawPledge" data-campaign="${c.id}">Take pledge back</button>` : ''}</div>` : ''}
      ${canPledge ? `<div class="row">
        <label class="small muted" for="amt-${c.id}">Lend</label>
        <select id="amt-${c.id}">${options.map((o) => `<option value="${o}">${usd(o)}${o === c.remaining ? ' (the rest)' : ''}</option>`).join('')}</select>
        <button class="btn" data-act="pledge" data-campaign="${c.id}">Pledge</button>
      </div>` : ''}
    </article>`;
  }

  function lendTab(v) {
    return `<div class="stack"><h2>Neighbours asking for a loan</h2>
      <p class="lede">You lend, they repay exactly what they borrowed, and you get back exactly what you lent. No interest, no tips, no fees on the borrower. A pledge stays your money until the loan goes out.</p></div>
      ${v.browse.length ? v.browse.map((c) => campaignCard(c, v)).join('') : '<p class="empty">No open campaigns right now.</p>'}`;
  }

  function mineTab(v) {
    const L = v.lender;
    return `<div class="stack"><h2>My lending</h2>
      <div class="stats">
        <div class="stat"><b>${usd2(L.wallet)}</b><span>In your wallet</span></div>
        <div class="stat"><b>${usd2(L.pledgedTotal)}</b><span>Pledged, still yours</span></div>
        <div class="stat"><b>${usd2(L.lentOut)}</b><span>Lent out, still owed</span></div>
        <div class="stat"><b>${L.helped}</b><span>Neighbour${L.helped === 1 ? '' : 's'} helped</span></div>
      </div>
      <div class="row">
        <span class="money">$<input type="number" id="wallet-amt" min="5" step="5" value="50" aria-label="Amount in dollars"></span>
        <button class="btn" data-act="deposit">Add funds</button>
        <button class="btn ghost" data-act="withdraw">Withdraw</button>
        <span class="small muted">Practice money. In the live product this is an ACH transfer to an account at the partner bank that earns no interest.</span>
      </div></div>
      ${L.pledges.length ? `<div class="stack"><h3>Pledges waiting on a campaign</h3>${L.pledges.map((c) => campaignCard(c, v)).join('')}</div>` : ''}
      <div class="stack"><h3>Loans you are part of</h3>
      ${L.shares.length ? L.shares.map((s) => `<article class="card">
        <div class="row"><h3 class="grow">${esc(s.firstName)} · ${esc(s.purpose)}</h3>${statusPill(s.status)}</div>
        <div class="meter" role="img" aria-label="${pct(s.received + s.forgiven, s.contribution)}% settled"><i style="width:${pct(s.received + s.forgiven, s.contribution)}%"></i></div>
        <div class="row small num"><span class="grow">Lent <b>${usd2(s.contribution)}</b> · received back <b>${usd2(s.received)}</b>${s.forgiven ? ` · forgiven <b>${usd2(s.forgiven)}</b>` : ''}</span>
          <span class="muted">${s.outstanding ? `${usd2(s.outstanding)} still owed${s.nextDue ? ` · next due ${esc(s.nextDue)}` : ''}` : 'Settled'}</span></div>
        <p class="small muted">${s.coLenders ? `Shared with ${s.coLenders} other lender${s.coLenders === 1 ? '' : 's'}; every repayment is split pro rata the same day.` : 'You are the only lender on this loan.'}${s.extensionGranted ? ' An extension was granted on this loan.' : ''}</p>
        ${s.outstanding ? `<details><summary>Forgive some or all of what you are owed</summary><div class="inner">
          <p class="muted">Forgiving is a gift (sadaqa). It lowers only your share. Other lenders are not affected.</p>
          <div class="row"><span class="money">$<input type="number" id="forgive-${s.loan}" min="0.01" step="0.01" max="${(s.outstanding / 100).toFixed(2)}" value="${(s.outstanding / 100).toFixed(2)}" aria-label="Amount to forgive"></span>
          <button class="btn ghost sm" data-act="forgive" data-loan="${s.loan}">Forgive this amount</button></div></div></details>` : ''}
      </article>`).join('') : '<p class="empty">You have not lent yet. Pledge to a campaign on the Lend tab.</p>'}</div>`;
  }

  function borrowTab(v) {
    const B = v.borrower;
    let out = `<div class="stack"><h2>Borrow</h2>`;
    if (B.loan) {
      const l = B.loan;
      out += `<article class="card">
        <div class="row"><h3 class="grow">Your loan · ${esc(l.purpose)}</h3>${statusPill(l.status)}</div>
        <div class="stats">
          <div class="stat"><b>${usd2(l.outstanding)}</b><span>Left to repay</span></div>
          <div class="stat"><b>${usd2(l.principal)}</b><span>You received</span></div>
          <div class="stat"><b>${usd2(l.paid)}</b><span>Repaid so far</span></div>
          ${l.forgiven ? `<div class="stat"><b>${usd2(l.forgiven)}</b><span>Forgiven by lenders</span></div>` : ''}
        </div>
        <p class="small muted">You repay exactly what you received${l.forgiven ? ', less what was forgiven' : ''}. Nothing is ever added: no interest, no late fee. Funded by ${l.lenders} lender${l.lenders === 1 ? '' : 's'}; you make one payment and Qard passes it on.</p>
        <div class="tablewrap"><table><thead><tr><th>Payment</th><th>Due</th><th class="r">Amount</th><th class="r">Paid</th><th></th></tr></thead><tbody>
        ${l.schedule.map((i) => `<tr><td>${i.n}</td><td>${esc(i.due)}</td><td class="r">${usd2(i.amount)}</td><td class="r">${usd2(i.paid)}</td><td>${i.paid >= i.amount ? '<span class="pill good">Paid</span>' : i.late ? '<span class="pill warn">Late</span>' : ''}</td></tr>`).join('')}
        </tbody></table></div>
        <div class="row"><span class="money">$<input type="number" id="repay-amt" min="0.01" step="0.01" max="${(l.outstanding / 100).toFixed(2)}" value="${(l.nextAmount / 100).toFixed(2)}" aria-label="Repayment amount"></span>
          <button class="btn" data-act="repay" data-loan="${l.id}">Repay</button>
          <button class="btn ghost" data-act="repayAll" data-loan="${l.id}" data-amount="${l.outstanding}">Pay it all off</button></div>
        ${l.charityDue > 0 ? `<div class="flash bad">Your payment was late without a hardship reason, so the ${usd(l.charityDue)} you undertook to give to charity is now due. It goes to charity only. Your lenders and Qard receive none of it.
          <div class="row" style="margin-top:8px"><button class="btn sm" data-act="payCharity" data-loan="${l.id}">Give ${usd(l.charityDue)} to charity</button></div></div>` : ''}
        ${l.hardship?.status === 'pending' ? '<p class="flash">Your hardship case is with the operator. Nothing is added to what you owe while it is open.</p>'
          : `<details><summary>I am struggling to repay</summary><div class="inner">
            <p class="muted">Tell us what happened. If you are in hardship you get more time, free. Your lenders are told an extension was granted, never the reason.</p>
            <textarea id="hardship-note" placeholder="What changed?" aria-label="What changed?"></textarea>
            <div class="row"><button class="btn ghost sm" data-act="declareHardship" data-loan="${l.id}">Open a hardship case</button></div></div></details>`}
        ${l.extensions ? `<p class="small muted">Extensions granted on this loan: ${l.extensions}.</p>` : ''}
        <details><summary>Your agreement</summary><div class="inner">
          <p>${esc(l.contract.type)}</p>
          <p class="muted">Contract ${esc(l.contract.id)} · template <span class="mono">${esc(l.contract.template)}</span> · ${l.contract.shareTable.length} lender share${l.contract.shareTable.length === 1 ? '' : 's'} totalling ${usd2(l.principal)}</p>
          <p class="muted">Collection agent: ${esc(l.contract.collectionAgent)}</p>
          <p class="muted">Board approval reference: ${esc(l.contract.rulingRef)}</p>
          ${l.charityUndertaking ? `<p class="muted">Your undertaking: ${usd(l.charityUndertaking)} to charity if a payment is late without excuse.</p>` : ''}
        </div></details>
      </article>`;
    } else if (B.current) {
      const c = B.current;
      out += `<article class="card">
        <div class="row"><h3 class="grow">Your campaign · ${esc(c.purpose)}</h3>${statusPill(c.status)}</div>
        ${c.status === 'Draft' ? '<p class="muted">The operator reviews every campaign before it is shown to lenders.</p>' : progress(c)}
        ${c.status === 'FullyPledged' || c.status === 'PartialAccepted' ? '<p class="muted">Funded. The operator releases the money next, and your repayment schedule starts then.</p>' : ''}
        ${c.status === 'BelowTarget' ? `<p>Your campaign closed at ${usd(c.pledged)}, below your ${usd(c.target)} target but above the ${usd(c.minimum)} you said you could use. Take the smaller amount, or decline and every pledge goes back.</p>
          <div class="row"><button class="btn" data-act="acceptPartial" data-campaign="${c.id}">Accept ${usd(c.pledged)}</button><button class="btn ghost" data-act="declinePartial" data-campaign="${c.id}">Decline</button></div>` : ''}
        ${c.status !== 'BelowTarget' ? `<div class="row"><button class="btn danger sm" data-act="withdrawCampaign" data-campaign="${c.id}">Withdraw campaign</button></div>` : ''}
      </article>`;
    } else {
      const max = B.limit / 100;
      out += B.limit === 0 ? '<p class="flash bad">Borrowing is paused on this account while an earlier loan is in default. Nothing has been added to that loan.</p>' : `
      ${B.lastCancelled ? `<p class="flash">Your last campaign closed: ${esc(B.lastCancelled.reason)}. Every pledge went back to its lender.</p>` : ''}
      <p class="lede">Ask your community for a loan of up to <b>${usd(B.limit)}</b>. You repay exactly what you receive. Your limit rises as you repay on time.</p>
      <article class="card"><div class="form-grid">
        <label class="field"><span>How much do you need?</span><span class="money">$<input type="number" id="c-target" min="20" max="${max}" step="5" value="${Math.min(100, max)}"></span><small>In $5 steps, up to ${usd(B.limit)}</small></label>
        <label class="field"><span>Least you could use</span><span class="money">$<input type="number" id="c-min" min="5" max="${max}" step="5" value="${Math.min(100, max)}"></span><small>If pledges stop short of this, everyone gets their money back</small></label>
        <label class="field"><span>What is it for?</span><select id="c-purpose">${v.config.purposes.map((p) => `<option>${esc(p)}</option>`).join('')}</select></label>
        <label class="field"><span>Repay in</span><select id="c-n">${[1, 2, 3, 4, 6, 8].map((n) => `<option value="${n}" ${n === 4 ? 'selected' : ''}>${n} payment${n > 1 ? 's' : ''}</option>`).join('')}</select></label>
        <label class="field"><span>How often</span><select id="c-every"><option value="7">Weekly</option><option value="14" selected>Every two weeks</option><option value="30">Monthly</option></select></label>
      </div>
      <label class="field"><span>Your story (optional)</span><textarea id="c-story" maxlength="600" placeholder="A sentence or two"></textarea></label>
      <label class="check"><input type="checkbox" id="c-show"><span>Show my story to lenders. If you leave this off, lenders see only your first name and the purpose.</span></label>
      <label class="check"><input type="checkbox" id="c-urgent"><span>This is urgent (shorter funding window)</span></label>
      <label class="check"><input type="checkbox" id="c-charity" checked><span>I undertake to give ${usd(v.config.charityUndertaking)} to charity if I pay late without a hardship reason. This is not a fee: it never goes to lenders or to Qard.</span></label>
      <div class="row"><button class="btn" data-act="createCampaign">Send for review</button></div></article>`;
    }
    if (B.past.length) out += `<div class="plain"><h3>Past loans</h3>${B.past.map((l) => `<p class="small">${usd(l.principal)} · ${esc(l.purpose)} · ${l.onTime ? 'repaid on time' : 'repaid'}</p>`).join('')}</div>`;
    return out + '</div>';
  }

  // ---------- operator ----------
  function queueTab(v) {
    const O = v.operator;
    const none = '<p class="empty">Nothing waiting.</p>';
    return `<div class="stack"><h2>Operator queue</h2><p class="lede">Agents prepare, the operator decides. Nothing is published, paid out or extended without an approval here.</p>
      <div class="stats">
        <div class="stat"><b>${usd2(O.book.outstanding)}</b><span>Loans outstanding</span></div>
        <div class="stat"><b>${usd(O.book.committed)} / ${usd(O.book.cap)}</b><span>Pilot book used</span></div>
        <div class="stat"><b>${usd2(O.book.custody)}</b><span>Member money in custody</span></div>
        <div class="stat"><b>${usd2(O.book.charity)}</b><span>Charity account</span></div>
      </div></div>
      <div class="stack"><h3>Campaigns to review</h3>${O.review.length ? O.review.map((c) => `<article class="card">
        <div class="row"><h3 class="grow">${esc(c.fullName)} · ${esc(c.purpose)} · ${usd(c.target)}</h3>${c.urgent ? '<span class="pill warn">Urgent</span>' : ''}</div>
        <p class="small muted">Limit ${usd(c.limit)} · least usable ${usd(c.minimum)} · ${esc(c.plan)} · ${esc(c.record)}</p>
        ${c.story ? `<p>“${esc(c.story)}”</p><p class="small muted">${c.showStory ? 'Borrower chose to show this story to lenders.' : 'Private: lenders will see first name and purpose only.'}</p>` : '<p class="small muted">No story given.</p>'}
        <div class="row"><button class="btn" data-act="approveCampaign" data-campaign="${c.id}">Approve and open</button><button class="btn danger" data-act="rejectCampaign" data-campaign="${c.id}">Decline</button></div></article>`).join('') : none}</div>
      <div class="stack"><h3>Ready to disburse</h3>${O.toDisburse.length ? O.toDisburse.map((c) => `<article class="card">
        <div class="row"><h3 class="grow">${esc(c.fullName)} · ${usd(c.pledged)} from ${c.lenders} lender${c.lenders === 1 ? '' : 's'}</h3>${statusPill(c.status)}</div>
        <p class="small muted">Releasing forms the qard: each pledge becomes that lender's loan, and the master agreement is generated with the share table.</p>
        <div class="row"><button class="btn" data-act="disburse" data-campaign="${c.id}">Release ${usd(c.pledged)} to ${esc(c.firstName)}</button></div></article>`).join('') : none}</div>
      <div class="stack"><h3>Hardship cases</h3>${O.hardship.length ? O.hardship.map((h) => `<article class="card">
        <h3>${esc(h.fullName)} · ${usd2(h.outstanding)} outstanding</h3>
        <p>${h.note ? `“${esc(h.note)}”` : '<span class="muted">No note given.</span>'}</p><p class="small muted">Opened ${esc(h.opened)}. An extension is free and binds every lender on the loan.</p>
        <div class="row"><button class="btn" data-act="grantHardship" data-loan="${h.loan}">Grant 30 more days</button><button class="btn ghost" data-act="denyHardship" data-loan="${h.loan}">Not documented</button></div></article>`).join('') : none}</div>
      <div class="stack"><h3>Late loans</h3>${O.late.length ? O.late.map((l) => `<article class="card">
        <div class="row"><h3 class="grow">${esc(l.fullName)} · ${usd2(l.outstanding)} outstanding</h3>${statusPill(l.status)}</div>
        <p class="small muted">${l.daysLate != null ? `${l.daysLate} day${l.daysLate === 1 ? '' : 's'} late. ` : ''}The amount owed has not changed and cannot.${l.charityDue ? ` Charity undertaking due: ${usd(l.charityDue)}.` : ''}</p>
        ${l.canCharge ? `<div class="row"><button class="btn ghost" data-act="markWilfulDelay" data-loan="${l.loan}">Delay without excuse: charity undertaking falls due</button></div>` : ''}</article>`).join('') : none}</div>`;
  }

  function loansTab(v) {
    const O = v.operator;
    return `<div class="stack"><h2>Loans</h2><div class="tablewrap"><table><thead><tr><th>Loan</th><th>Borrower</th><th>Status</th><th class="r">Lenders</th><th class="r">Principal</th><th class="r">Repaid</th><th class="r">Forgiven</th><th class="r">Owed</th></tr></thead><tbody>
      ${O.loans.map((l) => `<tr><td class="mono">${l.id}</td><td>${esc(l.fullName)}</td><td>${statusPill(l.status)}</td><td class="r">${l.lenders}</td><td class="r">${usd2(l.principal)}</td><td class="r">${usd2(l.paid)}</td><td class="r">${usd2(l.forgiven)}</td><td class="r">${usd2(l.outstanding)}</td></tr>`).join('') || '<tr><td colspan="8" class="muted">No loans yet.</td></tr>'}
      </tbody></table></div></div>
      <div class="stack"><h3>Activity</h3>${O.audit.map((a) => `<p class="small"><span class="muted">${esc(a.date)}</span> · ${esc(a.text)}</p>`).join('')}</div>`;
  }

  function ledgerTab(v) {
    const O = v.operator;
    return `<div class="stack"><h2>Ledger</h2><p class="lede">Double-entry and append-only. Every transaction balances to zero, so money cannot appear, vanish or stick to the platform. Showing the latest ${O.ledger.length} of ${O.ledgerCount}.</p>
      <div>${O.ledger.map((e) => `<div class="entry"><div><div class="mono">#${e.seq}</div><div class="small muted">${esc(e.date)}</div></div>
        <div><div class="small"><b>${esc(e.type.replace(/_/g, ' '))}</b> <span class="muted mono">${esc(e.ref)}</span></div>
        ${e.postings.map((p) => `<div class="post mono"><span>${esc(p.account)}</span><span class="${p.amount < 0 ? 'neg' : ''}">${p.amount < 0 ? '−' : '+'}${usd2(Math.abs(p.amount)).replace('−', '')}</span></div>`).join('')}</div></div>`).join('')}</div></div>`;
  }

  function rulesTab(v) {
    const O = v.operator;
    return `<div class="stack"><h2>Shari'a rules engine</h2>
      <p class="lede">Each rule runs before money moves. A failing rule stops the transaction and logs it. Ruleset <span class="mono">${esc(O.rulesetVersion)}</span>.</p>
      <p class="flash bad">No fatwa has been issued. These rules encode the positions the specification proposes to the Board. Each one shows the question or provisional ruling it is waiting on.</p>
      <div>${O.rules.map((r) => `<div class="rule"><div class="row"><span class="mono grow">${esc(r.id)}</span><span class="small muted num">${r.passes.toLocaleString()} checks passed</span></div><p>${esc(r.text)}</p><p class="small muted">Basis: ${esc(r.basis)}</p></div>`).join('')}</div></div>
      <div class="stack"><h3>Try to break it</h3><p class="lede">Each button attempts something the rules forbid, against a live loan. All of them should be blocked.</p>
      ${O.selfTestLoan ? `<div class="row">
        <button class="btn ghost sm" data-act="forbidden" data-kind="tip" data-loan="${O.selfTestLoan}">Tip a lender $2</button>
        <button class="btn ghost sm" data-act="forbidden" data-kind="late_fee" data-loan="${O.selfTestLoan}">Charge a $5 late fee</button>
        <button class="btn ghost sm" data-act="forbidden" data-kind="priority" data-loan="${O.selfTestLoan}">Repay one lender first</button>
        <button class="btn ghost sm" data-act="forbidden" data-kind="overpay" data-loan="${O.selfTestLoan}">Collect $10 above principal</button></div>` : '<p class="empty">Needs an active loan with two or more lenders.</p>'}</div>
      <div class="stack"><h3>Blocked transactions</h3>${O.blocked.length ? `<div class="tablewrap"><table><thead><tr><th>Date</th><th>Rule</th><th>Why</th></tr></thead><tbody>${O.blocked.map((b) => `<tr><td>${esc(b.date)}</td><td class="mono">${esc(b.rule)}</td><td>${esc(b.error.replace(`${b.rule}: `, ''))}</td></tr>`).join('')}</tbody></table></div>` : '<p class="empty">Nothing has been blocked yet.</p>'}</div>`;
  }

  function checksTab(v) {
    const O = v.operator;
    const bad = O.invariants.filter((i) => !i.ok).length;
    return `<div class="stack"><h2>Ledger checks</h2><p class="lede">The invariants from the specification, recomputed from the whole ledger every time this page loads. ${bad ? `<b>${bad} failing.</b>` : `All ${O.invariants.length} pass.`}</p>
      <div>${O.invariants.map((i) => `<div class="checkrow"><span class="dot ${i.ok ? '' : 'bad'}"></span><div><p>${esc(i.name)}</p>${i.ok ? '' : `<p class="small muted">${esc(i.problems.join(', '))}</p>`}</div></div>`).join('')}</div></div>`;
  }

  // ---------- frame ----------
  function render() {
    const v = ui.view;
    const op = v.me.isOperator;
    const tabs = op ? TABS_OP : TABS_MEMBER;
    if (!tabs.some((t) => t[0] === ui.tab)) ui.tab = tabs[0][0];
    const queueCount = op ? v.operator.review.length + v.operator.toDisburse.length + v.operator.hardship.length : 0;
    const body = { lend: lendTab, mine: mineTab, borrow: borrowTab, queue: queueTab, loans: loansTab, ledger: ledgerTab, rules: rulesTab, checks: checksTab }[ui.tab](v);
    const scroll = window.scrollY;
    root.innerHTML = `
      <header class="bar"><div class="bar-in">
        <div class="brand">Qard <span>Sandbox</span></div>
        <div class="small muted num">Today is ${esc(v.today)}</div>
        <div class="who"><label for="viewer">Viewing as</label>
          <select id="viewer">${v.people.map((p) => `<option value="${p.id}" ${p.id === v.me.id ? 'selected' : ''}>${esc(p.name)}${p.hint ? ` (${esc(p.hint)})` : ''}</option>`).join('')}</select></div>
      </div>
      <nav class="wrap tabs" role="tablist">${tabs.map(([id, label]) => `<button class="tab" role="tab" aria-selected="${ui.tab === id}" data-tab="${id}">${label}${id === 'queue' && queueCount ? `<span class="count">${queueCount}</span>` : ''}</button>`).join('')}</nav></header>
      <div class="notice"><div class="wrap">Practice money only. Nothing here is live, and no fatwa has been issued: Shari'a positions shown are the specification's proposals to the Board.</div></div>
      <main class="wrap">
        ${ui.flash ? `<div class="flash ${ui.flash.bad ? 'bad' : ''}" role="status">${ui.flash.rule ? `Blocked by rule <b>${esc(ui.flash.rule)}</b>: ` : ''}${esc(ui.flash.text)}</div>` : ''}
        ${body}
        <section class="sandbox" aria-label="Sandbox controls">
          <div class="row"><b class="grow small">Sandbox controls</b><span class="small muted">Move time forward to see due dates, late payments and closing campaigns.</span></div>
          <div class="row"><button class="btn ghost sm" data-act="clock" data-days="1">+1 day</button><button class="btn ghost sm" data-act="clock" data-days="7">+1 week</button><button class="btn ghost sm" data-act="clock" data-days="14">+2 weeks</button><button class="btn ghost sm" data-act="clock" data-days="30">+30 days</button>
          <button class="btn danger sm" data-act="reset">Start over</button></div>
        </section>
      </main>`;
    window.scrollTo(0, scroll);
  }

  const cents = (id) => { const el = document.getElementById(id); return el ? Math.round(Number(el.value) * 100) : NaN; };
  const val = (id) => document.getElementById(id)?.value;

  root.addEventListener('change', (e) => {
    if (e.target.id === 'viewer') { ui.viewer = e.target.value; ui.flash = null; load(); }
  });

  root.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-tab]');
    if (tab) { ui.tab = tab.dataset.tab; ui.flash = null; render(); window.scrollTo(0, 0); return; }
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const d = b.dataset; const me = ui.viewer;
    switch (d.act) {
      case 'pledge': return act({ type: 'pledge', actor: me, campaign: d.campaign, amount: Number(val(`amt-${d.campaign}`)) }, 'Pledged. It stays your money until the loan goes out, and you can take it back while the campaign is open.');
      case 'withdrawPledge': return act({ type: 'withdrawPledge', actor: me, campaign: d.campaign }, 'Pledge returned to your wallet in full.');
      case 'deposit': return act({ type: 'deposit', actor: me, amount: cents('wallet-amt') }, 'Funds added.');
      case 'withdraw': return act({ type: 'withdraw', actor: me, amount: cents('wallet-amt') }, 'Withdrawn.');
      case 'forgive': return act({ type: 'forgive', actor: me, loan: d.loan, amount: cents(`forgive-${d.loan}`) }, 'Forgiven. May it be accepted from you.');
      case 'createCampaign': return act({ type: 'createCampaign', actor: me, target: cents('c-target'), minimum: cents('c-min'), purpose: val('c-purpose'), installments: Number(val('c-n')), everyDays: Number(val('c-every')), story: val('c-story'), showStory: document.getElementById('c-show').checked, urgent: document.getElementById('c-urgent').checked, charityUndertaking: document.getElementById('c-charity').checked }, 'Sent to the operator for review.');
      case 'withdrawCampaign': return act({ type: 'withdrawCampaign', actor: me, campaign: d.campaign }, 'Campaign withdrawn. Every pledge went back in full.');
      case 'acceptPartial': return act({ type: 'acceptPartial', actor: me, campaign: d.campaign }, 'Accepted. The operator releases the money next.');
      case 'declinePartial': return act({ type: 'declinePartial', actor: me, campaign: d.campaign }, 'Declined. Every pledge went back in full.');
      case 'repay': return act({ type: 'repay', actor: me, loan: d.loan, amount: cents('repay-amt') }, 'Payment received and passed on to your lenders today.');
      case 'repayAll': return act({ type: 'repay', actor: me, loan: d.loan, amount: Number(d.amount) }, 'Paid in full. Every lender has been made whole.');
      case 'payCharity': return act({ type: 'payCharity', actor: me, loan: d.loan }, 'Given to charity.');
      case 'declareHardship': return act({ type: 'declareHardship', actor: me, loan: d.loan, note: val('hardship-note') }, 'Hardship case opened.');
      case 'approveCampaign': return act({ type: 'approveCampaign', actor: me, campaign: d.campaign }, 'Approved. The campaign is open to lenders.');
      case 'rejectCampaign': return act({ type: 'rejectCampaign', actor: me, campaign: d.campaign }, 'Declined.');
      case 'disburse': return act({ type: 'disburse', actor: me, campaign: d.campaign }, 'Released. The qard is formed and the repayment schedule has started.');
      case 'grantHardship': return act({ type: 'decideHardship', actor: me, loan: d.loan, grant: true, days: 30 }, 'Extension granted on every share. Lenders are told it was granted, not why.');
      case 'denyHardship': return act({ type: 'decideHardship', actor: me, loan: d.loan, grant: false }, 'Recorded as not documented.');
      case 'markWilfulDelay': return act({ type: 'markWilfulDelay', actor: me, loan: d.loan }, "The borrower's charity undertaking is now due.");
      case 'forbidden': return act({ type: 'attemptForbidden', actor: me, kind: d.kind, loan: d.loan });
      case 'clock': return act({ type: 'advanceClock', actor: 'M1', days: Number(d.days) }, `Moved forward ${d.days} day${d.days === '1' ? '' : 's'}.`);
      case 'reset': ui.tab = ui.view.me.isOperator ? 'queue' : 'lend'; return act({ type: 'resetSandbox' }, 'Sandbox reset to the example data.');
    }
  });

  load();
}
