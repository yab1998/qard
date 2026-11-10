// Pro-rata repayment distribution — spec §"Repayment distribution".
//
// Rule, in one sentence: each payment is split across the lenders in
// proportion to what each is still owed, rounded down to the cent, and the few
// leftover cents go to the lenders with the largest fractional remainders
// (ties to the earliest pledge).
//
// Why "still owed" rather than the spec's "cumulative totals": the spec's
// largest-remainder method on cumulative totals can, on some payment
// sequences, require a lender to hand back a cent they already received (the
// Alabama paradox — reproduced in test/distribution.test.js). Money already
// distributed is never clawed back, so this engine applies the same
// largest-remainder rule to outstanding balances instead. Because every lender
// starts owed exactly their contribution, this is the same pro-rata split; a
// lender who is a cent ahead is owed a cent less and the next payment corrects
// it. What the spec requires still holds and is tested on every payment:
//   - the allocations sum exactly to the payment (no residue)
//   - no lender ever receives more than they are owed
//   - the final payment settles every lender to exactly their share
// Forgiveness needs no special case: a forgiven amount simply stops being owed.
// The rounding rule needs Board sign-off either way (Shari'a brief Q33).
//
// shares: [{ id, outstanding, order }]   order = pledge order, earliest first

export class DistributionError extends Error {}

export function allocate(shares, payment) {
  if (!Number.isInteger(payment) || payment <= 0) {
    throw new DistributionError('Payment must be a positive whole number of cents');
  }
  const owed = shares.reduce((a, s) => a + s.outstanding, 0);
  if (payment > owed) throw new DistributionError('Payment exceeds the outstanding balance');

  let given = 0;
  const rows = shares.map((s) => {
    const num = s.outstanding * payment;
    const rem = num % owed;
    const whole = (num - rem) / owed;
    given += whole;
    return { id: s.id, order: s.order, rem, got: whole };
  });
  const leftover = payment - given;
  if (leftover > 0) {
    const ranked = rows.filter((r) => r.rem > 0).sort((a, b) => b.rem - a.rem || a.order - b.order);
    for (let i = 0; i < leftover; i++) ranked[i].got += 1;
  }
  const allocations = {};
  for (const r of rows) allocations[r.id] = r.got;
  return allocations;
}

// The spec's method as literally written, kept for comparison and tests only.
// Returns each lender's CUMULATIVE entitlement after `cumulativePaid` cents.
export function cumulativeLargestRemainder(shares, cumulativePaid) {
  const W = shares.reduce((a, s) => a + s.contribution, 0);
  const rows = shares.map((s) => {
    const num = s.contribution * cumulativePaid;
    const rem = num % W;
    return { id: s.id, order: s.order, rem, total: (num - rem) / W };
  });
  let leftover = cumulativePaid - rows.reduce((a, r) => a + r.total, 0);
  const ranked = rows.filter((r) => r.rem > 0).sort((a, b) => b.rem - a.rem || a.order - b.order);
  for (let i = 0; i < leftover; i++) ranked[i].total += 1;
  return Object.fromEntries(rows.map((r) => [r.id, r.total]));
}
