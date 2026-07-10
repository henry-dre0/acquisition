// ─────────────────────────────────────────────
//  AUTH ROUTES — maps HTTP verbs + paths to
//                controller functions
// ─────────────────────────────────────────────
//  Mounted at /api/auth in App.js.
//  🔧 Add a new route here when you create
//     a new controller handler.
// ─────────────────────────────────────────────

import express from 'express';
import {signup, signin, signout} from '#controllers/auth.controller.js';

const router = express.Router();

router.post('/sign-up', signup);

router.post('/sign-in', signin);

router.post('/sign-out', signout);

export default router;
