// ─────────────────────────────────────────────
//  LOGGER — Winston structured logging
// ─────────────────────────────────────────────
//  - error.log   → only error-level messages
//  - combined.log → info and above
//  - Console output in non-production envs.
//
//  🔧 LOG_LEVEL env var controls verbosity
//     (debug, info, warn, error).
// ─────────────────────────────────────────────

import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine((
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  )),

  defaultMeta: { service: 'acquisition-Api' },
  transports: [
    new winston.transports.File({ filename: 'Logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'Logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

export default logger;
