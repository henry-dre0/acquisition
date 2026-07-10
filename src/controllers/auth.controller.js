// ─────────────────────────────────────────────
//  AUTH CONTROLLER — HTTP handlers for auth
// ─────────────────────────────────────────────
//  Each function:
//    1. Validates req.body with Zod
//    2. Delegates to auth service
//    3. Sets JWT cookie on success
//    4. Returns JSON response
//
//  🔧 TO DO: add middleware to attach req.user
//     so signout can read the user context.
// ─────────────────────────────────────────────

import { signupSchema, signInSchema } from "#validations/auth.validation.js";
import { FormatValidationError } from "#utils/format.js";
import logger from "#config/logger.js";
import { jwttoken } from "#utils/jwt.js";
import { cookies } from "#utils/cookies.js";
import { createUser, authenticateUser } from "#services/auth.service.js";

/**
 * POST /api/auth/sign-up
 * Validates → creates user → signs JWT → sets cookie → 201
 */
export const signup = async (req, res, next) => {
  try {
    const validationResult = signupSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: FormatValidationError(validationResult.error),
      });
    }

    const { name, email, password, role } = validationResult.data;

    const user = await createUser({ name, email, password, role});

    const token = jwttoken.sign({ id: user.id, email: user.email, role: user.role });
    cookies.set(res, "jwttoken", token);

    logger.info(`User registered successfully: ${email}`);
    res.status(201).json({
      message: "User registered",
      user,
    });
  } catch (e) {
    logger.error("signup error", e);

    if (e.message === "user with this email already exists") {
      return res.status(409).json({ error: "Email already exists" });
    }

    next(e);
  }
};

/**
 * POST /api/auth/sign-in
 * Validates → authenticates → signs JWT → sets cookie → 200
 * Returns 401 for both "User not found" and "Invalid password"
 * (don't reveal which field is wrong).
 */
export const signin = async (req, res, next) => {
  try {
    const validationResult = signInSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: FormatValidationError(validationResult.error),
      });
    }

    const { email, password } = validationResult.data;

    const user = await authenticateUser({ email, password });

    const token = jwttoken.sign({ id: user.id, email: user.email, role: user.role });
    cookies.set(res, "jwttoken", token);

    logger.info(`User signed in successfully: ${email}`);
    res.status(200).json({
      message: "User signed in",
      user,
    });
  } catch (e) {
    logger.error("signin error", e);

    if (e.message === "User not found" || e.message === "Invalid password") {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    next(e);
  }
};

/**
 * POST /api/auth/sign-out
 * Clears the JWT cookie → 200
 */
export const signout = async (req, res, next) => {
  try {
    cookies.clear(res, "jwttoken");

    logger.info("User signed out successfully");
    res.status(200).json({ message: "User signed out" });
  } catch (e) {
    logger.error("signout error", e);
    next(e);
  }
};
