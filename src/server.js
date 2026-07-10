// ─────────────────────────────────────────────
//  SERVER — starts listening on a port
// ─────────────────────────────────────────────
//  Reads PORT from .env, defaults to 3000.
//  Do NOT add logic here — keep it a thin boot.
// ─────────────────────────────────────────────

import app from './App.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
