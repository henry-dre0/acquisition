// ─────────────────────────────────────────────
//  JWT — token signing & verification
// ─────────────────────────────────────────────
//  🔧 IMPORTANT: Change JWT_SECRET in production!
//     Set JWT_SECRET in your .env file.
//     The fallback below is for dev only.
//
//  Tokens expire in 1 day (JWT_EXPIRES_IN).
// ─────────────────────────────────────────────

import logger from '#config/logger.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_please_change_in_production';
const JWT_EXPIRES_IN = '1d';

export const jwttoken = {
    sign: (payload) => {
        try {
            return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        } catch (e) {
            logger.error('Failed to authenticate token', e);
            throw new Error('Failed to authenticate token');
        }
    },
    verify: (token) => {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (e) {
            logger.error('Failed to authenticate token', e);
            throw new Error('Failed to authenticate token');
        }
    }
};
