# Changelog

## 2026-10-09 (session 1, continued)
- Real system built in `web/` (Laravel 12): schema, models, AvailabilityService, BookingService, email notifications, auth + roles, customer area, owner area, DemoSeeder, 48 passing tests, browser E2E on SQLite.
- Security review finding fixed: SMS log driver leaked numbers and bodies; then SMS and Semaphore removed entirely on JC's instruction (email only).
- Themes: added Clay (2026-10-08), then Claude beige + orange (default) after JC rejected blue/yellow. Three themes selectable in demo and real app.
- Docs: `docs/PRODUCTION_PLAN.md`, `docs/AGENT_CONTRACT.md`, `docs/DEPLOY.md`, this changelog, `CLAUDE.md`.
- Open: deploy, real Gmail send, MySQL run, owner pages at 390px, Chapter 3.

## 2026-10-07 to 2026-10-08
- Imported the thesis handoff into `deusmac/BarberbookPH` (JC created the repo; the integration cannot).
- Built the single-file demo from the spec with two Haiku agents (customer + owner screens) plus the shell, router, tour and split-screen sync; Playwright-verified; published as a private artifact.
- Added Clay theme and a theme switch to the demo; wrote spec section 3.7.
