// ─────────────────────────────────────────────
//  EXPRESS APP — middleware stack & routes
// ─────────────────────────────────────────────
//  1. Security & parsing middleware (helmet, cors,
//     json, cookies, morgan).
//  2. Arcjet security/rate-limit middleware.
//  3. Routes — mount new route files here.
// ─────────────────────────────────────────────
//  🔧 TO DO when adding a new feature:
//     import the route file, then
//     app.use('/api/your-path', yourRouter);
// ─────────────────────────────────────────────

import express from 'express';
import logger from '#config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from '#routes/auth.routes.js';
import securityMiddleware from '#middleware/security.middleware.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

app.use(securityMiddleware);

app.get('/', (req, res) => {
  logger.info('Hello, Welcome to DRE API!');
  res.status(200).send('Hello, Welcome to DRE API!');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Running to the DRE API!' });
});

app.use('/api/auth', authRoutes);

export default app;
