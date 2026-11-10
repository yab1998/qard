# Qard sandbox

A working model of Module A (crowd-funded qard hasan) from the [specification](../docs/spec.md). **Practice money only. No fatwa or legal opinion has been issued; every Shari'a rule here is the specification's proposed position.**

See [build notes](../docs/mvp-build-notes.md) for what this proves and what it found.

```
npm start          # http://localhost:4173
npm test           # 19 tests
npm run simulate   # 10,000-loan simulation (gate G4), ~3 minutes
npm run build:demo # single-file browser demo in dist/ (needs: npm install --no-save esbuild)
```

Requires Node 20 or later. No runtime dependencies.

Use the "Viewing as" menu to switch between lenders, borrowers and the operator. "Sandbox controls" at the bottom of each page move the date forward. There is no sign-in: do not put real member data in it.

| Path | Contents |
| --- | --- |
| `src/core/` | Ledger, distribution engine, rules engine, platform state machines, invariants, per-person views |
| `src/server.js` | Server and append-only command log (`data/log.jsonl`) |
| `web/` | The web app |
| `test/` | Tests |
| `scripts/` | Simulation and demo bundler |
