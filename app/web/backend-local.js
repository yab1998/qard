// Runs the whole platform inside the page (used by the single-file demo).
// Same engine, same rules, same ledger — just no server. State resets on reload.
import { seededPlatform } from '../src/core/seed.js';
import { buildView } from '../src/core/views.js';

export function localBackend() {
  let platform = seededPlatform();
  return {
    async view(as) { return buildView(platform, as); },
    async dispatch(cmd, as) {
      let error = null;
      if (cmd.type === 'resetSandbox') platform = seededPlatform();
      else {
        try { platform.dispatch(cmd); } catch (e) { error = { message: e.message, rule: e.rule?.id || null }; }
      }
      return { error, view: buildView(platform, platform.members[as] ? as : 'M1') };
    },
  };
}
