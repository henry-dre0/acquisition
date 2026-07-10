// ─────────────────────────────────────────────
//  DRIZZLE CONFIG — migration generator settings
// ─────────────────────────────────────────────
//  Reads DATABASE_URL from .env at migration time.
//  Schema files live in src/models/.
//  Output goes to the drizzle/ folder.
//
//  🔧 Commands:
//     npm run db:generate  → create migration from schema changes
//     npm run db:migrate   → apply pending migrations
//     npm run db:studio    → open Drizzle Studio (GUI)
// ─────────────────────────────────────────────

import 'dotenv/config';

export default {
  schema: './src/models/*.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};
