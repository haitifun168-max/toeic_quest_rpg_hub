# Deferred Technical Items & Technical Debt

## Resolved Items (2026-06-29)

- **Date calculation overflow on month boundary** [backend/src/api/user.js:51]
  *Resolution:* Applied math day-clamping (`Math.min(currentDay, maxDaysInTargetMonth)`) inside `user.js` to prevent rollovers on month transitions (e.g. August 31st + 1 month correctly clamps to September 30th). Verified with a new unit test in `goal.test.js`.
  
- **Timer drift in background state** [frontend/src/screens/PlacementTestScreen.js:63]
  *Resolution:* Implemented `startTime` state based on `Date.now()`. The timer calculates elapsed seconds since `startTime` inside `setInterval` to eliminate drift when the app transitions to/from the mobile background state.

---

## Active Deferred Items

*None at this moment. Clean slate.*
