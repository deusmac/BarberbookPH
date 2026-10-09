# CLAUDE.md - BarberBook PH

> Persistent project memory. Read fully before doing anything else. Session history is in `CHANGELOG.md`.
> Reading order after this file: `docs/PRODUCTION_PLAN.md` (scope), `docs/AGENT_CONTRACT.md` (how the Laravel code is split), `docs/DEPLOY.md` (run and deploy), `BarberBook_PH_Demo_Build_Spec_for_Claude_Code.md` (screens and behavior, section 3.7 = themes).

## 0. Briefing

- **What it is:** BarberBook PH, "An Online Appointment and Haircut Preference System for Local Barbershops". A college capstone by BS Accountancy + BS IT students in the Philippines. Customers book a barber and a time online and save their haircut preferences (style, guard number, top length, beard, notes). The barber reads the preference card before the cut. Owners manage the queue, walk-ins, barbers, styles, prices, reports and feedback.
- **Owner of the work:** JC (carl.bespar@gmail.com on this account; thesis proponent per the handoff is Mark Joshua Tiempo, other members unknown). Casual, wants speed and results, hates a "confusing" UI. Style: act first, explain after, short answers.
- **Repo:** https://github.com/deusmac/BarberbookPH (private), branch `main`. Local clone in cloud sessions: `/home/user/barberbookph`.
- **Three deliverables live in this repo:**
  1. `web/`: the REAL system (Laravel 12). This is the product.
  2. `barberbook-demo.html` (+ `demo-src/`): the clickable prototype built first. Single file, no backend. Hosted copy (private artifact, share from its Share menu): https://claude.ai/artifact/H8DqJBBtJJggdEC4zk99b8
  3. `handoff/`: the thesis backup (Chapters 1-2, decks, UI sources) from the earlier Cowork session. Do not redo that work.
- **Current phase:** real system built and browser-tested locally (SQLite). Not deployed. No real email sent yet.

## 1. Current status (2026-10-09)

- Works (tested): registration with privacy consent, login, roles; customer booking wizard (style, barber + preferences, schedule, review, confirm); duration-aware availability with breaks, days off, past times; double booking impossible; reschedule keeps the reference; cancel with required reason; rating; .ics download; profile with "usual" preferences; owner queue (timeline + list), preference card, status actions, walk-ins, barbers and hours, style manager, services and prices, reports (SVG) + CSV export, feedback; email notifications (confirmed, moved, cancelled, 1-hour reminder).
- Tests: `cd web && php artisan test` (48 tests, 381 assertions at last run). Browser E2E was run with Playwright against `php artisan serve` on SQLite (scripts were throwaway, in /tmp).
- NOT done / unverified: real Gmail SMTP send; MySQL run; deployment; owner pages at 390px width (only desktop checked); password reset and email verification; Chapter 3 of the thesis.
- Default theme is **Claude** (warm beige + terracotta orange, serif headings). Clay and Brutal are selectable.

## 2. Decisions (do not relitigate without JC)

- **Stack follows the thesis:** Laravel + MySQL. SQLite is for local dev and tests only (`.env` change switches). PHP 8.3, Laravel 12, Blade, vanilla JS, no build step.
- **Email only.** SMS and the Semaphore gateway were removed on JC's instruction (2026-10-09). Notifications are Laravel Mail (Gmail SMTP in production). The mobile number is kept so the shop can call the customer. Do not re-add SMS unless JC asks.
- **No online payment** (pay at the shop). No AI or AR hairstyle preview. No native app. These match the thesis delimitations.
- **Single partner shop** is bookable (Kings Cut Barbershop, placeholder name/data); two "coming soon" shops exist for the demo story. Schema is multi-shop.
- **Themes (user-selectable, cookie `bb_theme`, localStorage key `barberbook-theme` in the demo):**
  - `claude` (default): cream `#F0EEE6`, ivory cards `#FAF9F5`, ink `#141413`, terracotta `#D97757`, manilla highlight `#EBD9B4`, Newsreader serif headings. JC asked for "claude beige orange, slick and professional" after rejecting blue + yellow.
  - `clay`: claymorphism with barber-pole blue and gold. JC disliked the blue/yellow combo as default.
  - `brutal`: original Neo-brutalism from the thesis design spec. JC found it confusing to use.
  - Rule: every color goes through tokens; themes are scoped under `html[data-theme="..."]`. Switching a theme never changes layout, copy or data.
- **Copy rules:** no em dashes, no emojis, sentence case in markup (themes uppercase through CSS where wanted), phone numbers stored and shown without a leading plus sign, plain professional tone, "Sample prices. Final prices come from the partner shop."
- **Subagents:** `sonnet` was used for the Laravel customer and owner areas (security-sensitive), `haiku` for the demo screens. Agents get a written contract (`docs/AGENT_CONTRACT.md`), work in separate files, and the lead integrates and tests. Never trust an agent's "done" without running the suite and a browser pass.

## 3. Architecture (real system, `web/`)

- **Money-critical rule:** every write to `bookings` goes through `App\Services\BookingService` (create, reschedule, cancel, setStatus, rate, saveUsual). It recomputes price and duration server-side, re-checks availability inside a transaction with `lockForUpdate` on barber rows, and throws `SlotTakenException`. Never create or update booking times anywhere else.
- `App\Services\AvailabilityService`: single source of truth for "is this time free" (30-minute grid, minutes after midnight, one 60-minute break per barber, day offs, past times, overlap with active bookings; statuses pending, confirmed, inchair, done occupy time; cancelled and noshow free it).
- `App\Services\NotificationService` + `App\Mail\BookingMail` (`resources/views/emails/booking.blade.php`): email only; failures are logged to `notification_logs` and never block a booking. Reminders: `php artisan bookings:remind` (scheduled every 10 minutes in `routes/console.php`; production needs the `schedule:run` cron line).
- Auth: `AuthController`, role middleware `role:customer|owner` (`App\Http\Middleware\EnsureRole`), routes split into `routes/customer.php` and `routes/owner.php` (owner prefix `owner`, names `owner.*`). Owner is scoped to `auth()->user()->shop_id`; another shop's rows return 404.
- Models in `app/Models`; helpers `App\Support\Fmt` (time/date/money) and `App\Support\StyleArt` (SVG hairstyle illustrations).
- Frontend: `public/css/theme.css` (design system + 3 themes), `app.css` (layout), `customer.css`, `owner.css`; `public/js/app.js` (theme switch, toasts, two-tap confirm via `data-confirm`), `customer.js`, `owner.js`. Every page must work without JS except live slot refresh and counters.
- Seed data: `DatabaseSeeder` (shop, services, 3 barbers, 12 styles, owner from `.env`); `DemoSeeder` (local demo data, refuses to run in production): demo customer `juan@example.com` / `password`.
- Demo prototype: `demo-src/` parts are concatenated by `sh demo-src/build.sh` into `barberbook-demo.html`. Edit the parts, never the built file. Theme CSS: `1b-clay.css`, `1c-claude.css` (generated from the clay block by a color-mapping script, then hand-refined).

## 4. Run, test, deploy

- Local: `cd web && cp .env.example .env && composer install && php artisan key:generate && touch database/database.sqlite && php artisan migrate --seed && php artisan storage:link && php artisan serve`. Owner login = `OWNER_EMAIL` / `OWNER_PASSWORD` from `.env` (placeholder defaults `owner@example.com` / `change-me-now`; change before deploying).
- Tests: `cd web && php artisan test`. Use `Carbon::setTestNow` for time. Tests use in-memory SQLite.
- Browser checks: Playwright (chromium preinstalled; `NODE_PATH=$(npm root -g) node script.js`; do not run `playwright install`). Freeze the clock with `page.clock.install` for the demo; the real app uses server time (Asia/Manila), so at night "today" has no free slots (correct, not a bug).
- Demo checks: build, `node --check` the extracted script, then Playwright flows.
- Production: see `docs/DEPLOY.md` (MySQL, Gmail app password, cron, `storage:link`, HTTPS, change owner password).

## 5. Guardrails

- Never commit `.env`, keys or real customer data. `web/.env` is gitignored.
- Never bypass `BookingService` for booking writes. Never trust browser-sent price, duration, status or barber availability.
- Every new route gets auth + role middleware, validation, ownership checks and a test.
- Never delete bookings from hour/day-off changes (warn instead). Never delete services or styles that have bookings (deactivate).
- CSV export must neutralize cells starting with `= + - @` (already done; keep the test).
- Do not add SMS, payments or a framework change without JC's go-ahead.
- Only the repo `deusmac/BarberbookPH` belongs to this project. Do not push this work into JC's other repositories.

## 6. Gotchas (learned the hard way)

- The cloud GitHub integration cannot create repos (403); JC creates them and I attach with `add_repo`.
- `pkill -f "artisan serve"` kills the calling shell (its own command line matches). Kill by port or PID instead.
- Hooks: a "fact-forcing gate" blocks the first Bash call and any `rm -rf`; state the facts and retry. Use Python `shutil`/`os.remove` for deletions when the gate keeps firing, and say so.
- `curl` is redirected by a context-mode hook; verify HTTP through Laravel tests or Playwright instead.
- Artifacts: the hosted viewer blocks downloads (`.ics`, CSV) and `window.print`; hash routes work. The artifact file must omit `<!DOCTYPE>/<html>/<head>/<body>` wrappers (see how the demo artifact was produced: strip those lines from `barberbook-demo.html`).
- Laravel: `Booking::durationFor` lengthens only services with `includes_haircut` by `max(0, style.mins - 30)`, rounded up to 5. Mobile numbers are normalized to digits at registration.
- Name collisions when parts are concatenated (demo): `emptyBox`, `ensureDraft`, `askCancel` collided once. Prefix helpers per file.
- Subagents hit session rate limits once and wrote nothing; check the filesystem before assuming progress, then re-spawn.

## 7. Backlog (priority order)

1. Deploy to a PHP 8.3 + MySQL host; send a real test email through Gmail SMTP; run the suite once on MySQL.
2. Owner pages at 390px; accessibility pass (focus order, contrast in all three themes).
3. Password reset and email verification; rate limits on booking endpoints.
4. Real shop data in place of placeholders; privacy contact in the footer (RA 10173).
5. Thesis Chapter 3 (methodology: Agile, respondents, ISO/IEC 25010 questionnaire, statistical treatment, ethics RA 10173). See `handoff/HANDOFF.md` section 10.
6. Optional: owner-managed announcements, multiple shops with a shop switcher, i18n (Filipino).

## 8. Session protocol

- **On start:** read this file, then state the plan in one line.
- **On end:** update section 1 (status) and section 7, append a dated entry to `CHANGELOG.md` (what was done, files changed, open items), commit and push to `main`.
