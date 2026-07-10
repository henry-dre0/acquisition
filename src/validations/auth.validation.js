// ─────────────────────────────────────────────
//  AUTH VALIDATION — Zod schemas for request bodies
// ─────────────────────────────────────────────
//  Defines shapes & constraints for sign-up and
//  sign-in payloads. Controllers use safeParse()
//  to validate before touching the service layer.
//
//  🔧 TO DO: add password confirmation field
//     to signupSchema if needed.
// ─────────────────────────────────────────────

import { z } from "zod";

export const signupSchema = z.object({
    name: z.string().min(2).max(255).trim(),
    email: z.string().email().max(255).toLowerCase().trim(),
    password: z.string().min(6).max(128),
    role: z.enum(['user', 'admin']).default('user')   
});

export const signInSchema = z.object({
    email: z.string().email().toLowerCase().trim(),
    password: z.string().min(1),
});
