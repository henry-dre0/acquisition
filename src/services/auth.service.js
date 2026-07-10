// ─────────────────────────────────────────────
//  AUTH SERVICE — business logic for auth
// ─────────────────────────────────────────────
//  Pure database operations & password hashing.
//  Controllers call these, never call DB directly.
//
//  🔧 TO DO: add email verification flow,
//     password reset, refresh tokens.
// ─────────────────────────────────────────────

import logger from "#config/logger.js";
import bcrypt from 'bcrypt';
import {eq} from 'drizzle-orm';
import {db} from '#config/database.js';
import {users} from '#models/user.module.js';

/** Hash a plaintext password with bcrypt (10 rounds). */
export const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);

    } catch (e) {
        logger.error(`Error hashing the password: ${e}`);
        throw new Error('Error hashing');
    }
};

/** Compare a plaintext password against a bcrypt hash. */
export const comparePassword = async (password, hash) => {
    try {
        return await bcrypt.compare(password, hash);
    } catch (e) {
        logger.error(`Error comparing password: ${e}`);
        throw new Error('Error comparing password');
    }
};

/** Find user by email, verify password. Throws on failure. */
export const authenticateUser = async ({ email, password }) => {
    try {
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (!user) throw new Error('User not found');

        const passwordValid = await comparePassword(password, user.password);
        if (!passwordValid) throw new Error('Invalid password');

        logger.info(`User authenticated successfully: ${email}`);
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
            updated_at: user.updated_at
        };
    } catch (e) {
        logger.error(`Error authenticating user: ${e}`);
        throw e;
    }
};

/** Create a new user. Throws if email already exists. */
export const createUser = async ({name, email, password, role = 'user'}) => {
    try {
        const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if(existingUser.length > 0) throw new Error('User already exists');

        const password_hash = await hashPassword(password);

        const [newUser] = await db
            .insert(users)
            .values({name, email, password: password_hash, role})
            .returning({
                id: users.id,
                name: users.name,
                email: users.email, 
                role: users.role, 
                created_at: users.created_at,
                updated_at: users.updated_at
            });

        logger.info(`User ${newUser.email} created successfully`);
        return newUser;

    } catch (e) { 
        logger.error(`Error creating the user: ${e}`);
        throw e;
        
    }
};
