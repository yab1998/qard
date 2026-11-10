// Example data for the sandbox. Every person and figure here is invented.
import { Platform } from './platform.js';

export function seedCommands() {
  const cmds = [];
  const add = (c) => cmds.push(c);
  // M1 operator, M2–M6 lenders, M7–M9 borrowers
  add({ type: 'registerMember', name: 'Operator', roles: ['operator'] });
  for (const n of ['Amina Rahman', 'Yusuf Clarke', 'Khadija Osei', 'Bilal Haddad', 'Maryam Siddiqui', 'Idris Bello', 'Layla Farouk', 'Omar Diallo']) {
    add({ type: 'registerMember', name: n });
  }
  for (const [m, amt] of [['M2', 30000], ['M3', 20000], ['M4', 15000], ['M5', 10000], ['M6', 25000]]) add({ type: 'deposit', actor: m, amount: amt });

  // Idris: a $100 first loan funded by three lenders, one repayment in.
  add({ type: 'createCampaign', actor: 'M7', target: 10000, purpose: 'Car repair', installments: 3, everyDays: 14, story: 'My car failed inspection and I need it to get to work.', showStory: true });
  add({ type: 'approveCampaign', actor: 'M1', campaign: 'C1' });
  add({ type: 'pledge', actor: 'M2', campaign: 'C1', amount: 5000 });
  add({ type: 'pledge', actor: 'M3', campaign: 'C1', amount: 3500 });
  add({ type: 'pledge', actor: 'M4', campaign: 'C1', amount: 1500 });
  add({ type: 'disburse', actor: 'M1', campaign: 'C1' });
  add({ type: 'advanceClock', actor: 'M1', days: 13 });
  add({ type: 'repay', actor: 'M7', loan: 'L1', amount: 3333 });

  // Layla: open campaign, part funded.
  add({ type: 'createCampaign', actor: 'M8', target: 10000, minimum: 6000, purpose: 'Medical bill', installments: 4, everyDays: 14 });
  add({ type: 'approveCampaign', actor: 'M1', campaign: 'C2' });
  add({ type: 'pledge', actor: 'M5', campaign: 'C2', amount: 2500 });
  add({ type: 'pledge', actor: 'M6', campaign: 'C2', amount: 3000 });

  // Omar: draft waiting for the operator's review.
  add({ type: 'createCampaign', actor: 'M9', target: 8000, purpose: 'Utilities', urgent: true, installments: 2, everyDays: 30, story: 'Heating bill is overdue after reduced hours last month.', showStory: false });
  return cmds;
}

export function seededPlatform(config) {
  const p = new Platform(config);
  for (const c of seedCommands()) p.dispatch(c);
  return p;
}
