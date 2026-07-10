// ─────────────────────────────────────────────
//  DATABASE — Neon serverless driver + Drizzle
// ─────────────────────────────────────────────
//  In dev mode (NODE_ENV=development) it
//  configures the driver for Neon Local (HTTP,
//  no WebSockets). In prod it uses defaults.
//
//  🔧 Requires DATABASE_URL in your .env file.
//  🔧 In dev, also needs NEON_FETCH_ENDPOINT
//     (defaults to http://localhost:5432/sql).
// ─────────────────────────────────────────────

import 'dotenv/config';

import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

if (process.env.NODE_ENV === 'development') {
  neonConfig.fetchEndpoint = process.env.NEON_FETCH_ENDPOINT || 'http://localhost:5432/sql';
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql);

export { db, sql };
