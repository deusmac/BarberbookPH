# BarberBook PH: production build plan

Goal: turn the clickable demo into the real system described in the thesis (Laravel + MySQL, Gmail SMTP email), usable by a real partner barbershop.

## Stack
- Laravel 12, PHP 8.3, Blade views, vanilla JS (no build step needed to run).
- Database: SQLite for local development and tests, MySQL in production (change `.env` only).
- Email: Laravel Mail. `MAIL_MAILER=log` locally, Gmail SMTP in production.
- Timezone: Asia/Manila.
- Themes: Clay (default) and Neo-brutal, switchable, stored in a cookie.

## Scope (matches thesis delimitations)
In: accounts (customer, owner), online booking with duration-aware availability, haircut preferences, confirmation and reminders (email), customer history, reschedule, cancel, ratings, owner queue, walk-ins, barbers and hours, style gallery manager, reports with CSV, feedback.
Out: online payment (pay at the shop), AI/AR hairstyle preview, native mobile apps.

## Phases
1. Foundation: schema, models, services (availability, booking, notifications), auth + roles, layout, CSS, seeders. (lead)
2. Customer area: home, shop, style gallery, booking wizard, confirmation, my bookings, profile. (agent A)
3. Owner area: queue, preference card, walk-in, barbers and hours, styles, reports, feedback. (agent B)
4. Hardening: tests (feature + unit), security pass, README/deploy guide. (lead)

## Rules
- Double booking must be impossible: every create/reschedule/walk-in goes through `BookingService` inside a transaction.
- Never trust the browser: prices, duration and availability are recomputed server-side.
- Phone numbers are stored without a leading plus sign.
- No em dashes and no emojis in code, copy or commits.
