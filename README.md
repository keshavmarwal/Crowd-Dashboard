# Crowd Management System - Dashboard

Responsive single-page dashboard for live crowd analytics (occupancy, footfall, dwell time,
demographics, entry/exit records). Built for the Kloudspot Frontend Engineer assessment.

## Tech stack
React (Vite) · React Router · Tailwind CSS · Axios · TanStack Query · Recharts · Socket.IO client

## Getting started
```bash
npm install
cp .env.example .env     # optional, default API URL is already set
npm run dev
```
Build for production: `npm run build` (output in `dist/`).

## Test accounts (staging)
- `test@test.com` / `1234567890`
- `dummy@example.com` / `1234567890`

## Project structure
```
src/
  api/         axios client (token interceptor, 401 handling) + endpoint functions
  socket/      Socket.IO connection and event hooks
  context/     AuthContext (token, user, login, logout, auto-logout on expiry)
  hooks/       useAuth and data hooks
  components/  layout / cards / charts / common
  pages/       Login, Overview, CrowdEntries
  routes/      ProtectedRoute
  utils/       JWT decode, token storage, timezone + formatting helpers
```

## Key decisions
- **Auth:** JWT stored in localStorage, attached by an axios interceptor. Tokens last ~1 hour,
  so the app logs out automatically on expiry and on any 401. The token is never logged.
- **"Today" uses the selected site's timezone**, not the browser's (`utils/time.js`), because the
  API expects `fromUtc` / `toUtc` as UTC epoch millis.
- **Comparison ("10% more than yesterday")** has no API of its own, so each metric is fetched for
  the selected day and for the previous day. For *today* the previous window is yesterday **up to the
  same time of day**, so a half-finished day is not compared with a full one.
- **The API's `entryLocal` / `exitLocal` strings are UTC, not local time.** The table formats
  `entryUtc` / `exitUtc` in the selected site's timezone instead.
- Future hours are returned as `0` by the occupancy API; the charts treat them as "no data yet" so
  the line stops at the LIVE marker.
- **Realtime:** one Socket.IO connection (websocket transport) is opened after login and closed on
  logout (`context/RealtimeContext.jsx`). Payload parsing is isolated in `utils/realtime.js`.
  Alerts are kept per site; the Live Occupancy figure is only taken from the socket once every zone
  of the site has reported (otherwise the API value is shown), so a half-filled sum is never displayed.
  In `npm run dev` the first raw socket payloads are printed in the browser console.
- All data comes from the backend APIs; the UI holds no backend logic.

## Deployment
`vercel.json` and `public/_redirects` provide the SPA fallback for Vercel / Netlify.

## Status
- [x] Project setup, API layer, auth, protected routes, login page
- [x] App layout (collapsible sidebar, header, site + date filter)
- [x] Overview dashboard (cards, occupancy chart, demographics)
- [x] Crowd Entries table with pagination
- [x] Socket.IO: `live_occupancy` drives the Live Occupancy card + chart marker, `alert` fills the Alerts drawer
- [ ] Polish: responsive check, README screenshots, deploy
