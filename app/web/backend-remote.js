// Talks to src/server.js.
export const remoteBackend = {
  async view(as) { return (await fetch(`/api/view?as=${encodeURIComponent(as)}`)).json(); },
  async dispatch(cmd, as) {
    const r = await fetch('/api/dispatch', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ cmd, as }) });
    return r.json();
  },
};
