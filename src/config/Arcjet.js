// ─────────────────────────────────────────────
//  ARCJET — security & rate limiting config
// ─────────────────────────────────────────────
//  Defines three rules that run on every request:
//    1. Shield — blocks SQL injection & common attacks
//    2. detectBot — blocks automated traffic
//    3. slidingWindow — rate limits (5 req / 10s)
//
//  🔧 Requires ARCJET_KEY in your .env file.
//     Get one at https://app.arcjet.com
//
//  🔧 Rules run in "LIVE" mode — they actively block.
//     Switch to "DRY_RUN" to log-only during testing.
// ─────────────────────────────────────────────

import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
      ],
    }),
    slidingWindow({
      mode: "LIVE",
      interval: '10s',
      max: 5,
    }),
  ],
});

export default aj;
