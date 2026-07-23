---
title: 'Track 2: Backend Core & Security'
type: 'refactor'
created: '2026-07-23'
status: 'done'
baseline_commit: '7070c643ae0703330dd6062c6b7b4ba6c2413756'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Currently, the backend uses a mock OAuth2 handler that trusts whatever email is sent from the client. It also lacks rate limiting on critical routes (/auth and /ai), exposing the system to resource exhaustion. Finally, the PvP matchmaking logic is tightly coupled with Socket.io room joins and events, preventing future scaling to Redis.

**Approach:** 
1. Replace mock OAuth2 with real server-side token validation for Google and Facebook, using node-fetch to call provider validation endpoints.
2. Implement a custom lightweight in-memory Rate Limiter middleware in backend and apply it to `/api/auth/*` and `/api/ai/*` routes.
3. Abstract the PvP Matchmaking logic behind a clean Interface/Base class and decouple it from Socket.io socket/io dependencies, emitting matches back to the WebSocket handler via a callback interface.

## Boundaries & Constraints

**Always:**
- Keep the rate limiter strictly in-memory (Map-based with periodic cleanup intervals) as the MVP runs single-instance.
- Validate Google ID tokens using Google's tokeninfo API (`https://oauth2.googleapis.com/tokeninfo?id_token=<token>`).
- Validate Facebook access tokens using Facebook Graph API (`https://graph.facebook.com/me?access_token=<token>&fields=id,name,email`).
- Implement a 5-second timeout (using AbortController) on external Google/Facebook API requests.
- Decouple matchmaking entirely from socket joins and socket emissions, using a clean callback `onMatchFound(matchResult)`.

**Ask First:**
- (none)

**Never:**
- Never import or use external rate limiting packages (like express-rate-limit) or OAuth2 SDK packages.
- Never write hardcoded fallback secrets.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Rate Limit Hit | Request to `/api/auth/login` when client has exceeded max requests in the current window | HTTP 429 Too Many Requests with standard JSON error body | Return `TOO_MANY_REQUESTS` code and standard payload. |
| Google OAuth Success | POST `/api/auth/oauth` with `{ provider: 'google', token: 'valid-id-token' }` | Validate token with Google API, return HTTP 200 and standard login response with profile & JWT | Return HTTP 400 `INVALID_TOKEN` if verification fails. |
| Facebook OAuth Success | POST `/api/auth/oauth` with `{ provider: 'facebook', token: 'valid-access-token' }` | Validate token with FB API, return HTTP 200 and standard login response with profile & JWT | Return HTTP 400 `INVALID_TOKEN` if verification fails. |
| OAuth Network Timeout | Timeout (5s) or HTTP error calling Google/Facebook verification API | Respond with HTTP 400 `OAUTH_VERIFICATION_FAILED` or `INVALID_TOKEN` | Handle network errors gracefully and return standard error payload. |

</frozen-after-approval>

## Code Map

- `backend/src/middleware/rateLimiter.js` -- Lightweight in-memory rate limiting middleware
- `backend/src/app.js` -- Configure and apply rate limiting to /api/auth and /api/ai routers
- `backend/src/api/auth.js` -- Real client-server OAuth2 validation implementation
- `backend/src/services/matchmaking.js` -- Refactored matchmaking service separating matching logic from Socket.io
- `backend/src/websocket/pvpHandler.js` -- Refactored websocket handler using the matchmaking callback interface
- `backend/tests/rateLimiter.test.js` -- New unit tests for the custom rate limiter middleware
- `backend/tests/auth.test.js` -- Updated tests verifying real OAuth2 validation and mock integration

## Tasks & Acceptance

**Execution:**
- [x] `backend/src/middleware/rateLimiter.js` -- Implement custom Map-based rate limiter middleware with expiration sweep interval -- Prevents API abuse without external library overhead
- [x] `backend/src/app.js` -- Set up proxy trust and wire rate limiters to auth and AI endpoints -- Protects critical APIs
- [x] `backend/src/api/auth.js` -- Implement Google and Facebook server-side token validation calls using node-fetch with AbortController timeout -- Ensures cryptographic authenticity of OAuth logins
- [x] `backend/src/services/matchmaking.js` -- Refactor to remove socket/io logic, exposing clean `joinQueue(player)`, `leaveQueue(userId)`, and `onMatchFound(callback)` interface -- Decouples matchmaking for future Redis scalability
- [x] `backend/src/websocket/pvpHandler.js` -- Update setup logic to pass `onMatchFound` callback to MatchmakingService and perform socket/room joins inside the handler -- Completes the matchmaking abstraction

**Acceptance Criteria:**
- Given a rate limit configuration, when client sends requests exceeding the configured max requests in a window, then the server responds with HTTP 429 and error code `TOO_MANY_REQUESTS`.
- Given a Google/Facebook provider login, when valid token is supplied, then user profile is retrieved from the provider API, and user is registered or logged in.
- Given a Google/Facebook provider login, when invalid token is supplied, then user validation fails with HTTP 400 and error code `INVALID_TOKEN`.
- Given a matchmaking request, when two users with close ELO are in the queue, then they are matched via the interface callback, and socket room joins/events are successfully coordinated.

## Spec Change Log

## Design Notes

## Verification

**Commands:**
- `npm test` -- expected: all unit and integration tests (including new ones) pass successfully.

## Suggested Review Order

**Rate Limiting & Proxy Trust**

- In-memory rate limiting middleware using Javascript Map and setInterval sweep cleanup.
  [`rateLimiter.js:7`](../../backend/src/middleware/rateLimiter.js#L7)
- Enable Express proxy trust and apply rate limiters to auth and AI endpoints in app configuration.
  [`app.js:15`](../../backend/src/app.js#L15)

**OAuth2 Validation**

- Real token validation using node-fetch directly to Google and Facebook API endpoints.
  [`auth.js:11`](../../backend/src/api/auth.js#L11)
- Verify credentials by validating ID/Access token and retrieving profile email.
  [`auth.js:192`](../../backend/src/api/auth.js#L192)

**Matchmaking & Socket Decoupling**

- Abstract matchmaking interface with clear onMatchFound callback instead of direct socket dependency.
  [`matchmaking.js:21`](../../backend/src/services/matchmaking.js#L21)
- Coordinate rooms and notify matched clients using the matchmaking callback interface.
  [`pvpHandler.js:24`](../../backend/src/websocket/pvpHandler.js#L24)

**Peripherals & Verification**

- Unit tests for custom rate limiting middleware verifying limits and time windows.
  [`rateLimiter.test.js:1`](../../backend/tests/rateLimiter.test.js#L1)
- Unit tests for matchmaking callback interface with mock timers and BOT matching.
  [`matchmaking.test.js:1`](../../backend/tests/matchmaking.test.js#L1)
- Integration tests for auth API verifying mock OAuth token logic.
  [`auth.test.js:228`](../../backend/tests/auth.test.js#L228)
