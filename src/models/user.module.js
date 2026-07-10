// ─────────────────────────────────────────────
//  USER MODEL — Drizzle ORM schema for "users"
// ─────────────────────────────────────────────
//  This is the source of truth for the DB table.
//  Drizzle Kit reads this to generate migrations.
//
//  🔧 TO DO: add columns like
//     email_verified_at, reset_token, etc.
// ─────────────────────────────────────────────

import {pgTable, serial, timestamp, varchar} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('user'),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
});
