# Agent contract (Laravel app in `web/`)

Read first: `docs/PRODUCTION_PLAN.md`, `BarberBook_PH_Demo_Build_Spec_for_Claude_Code.md` (screens and behavior; the working demo is `barberbook-demo.html`, source in `demo-src/`).

## Already built (do not edit; ask the lead if something must change)
- Schema: `database/migrations/2026_10_09_000001_create_barberbook_tables.php` (shops, services, barbers, barber_day_offs, styles, customer_preferences, bookings, feedback, notification_logs) and users (role customer|owner, mobile, shop_id, favorite_barber_id).
- Models in `app/Models`, helpers `app/Support/Fmt.php` (time/date/money/phone) and `app/Support/StyleArt.php` (SVG).
- `app/Services/AvailabilityService.php`: isFree, candidateTimes, freeBarbers, pickAuto, slots(), month(), dayHasFree, nextFreeLabel. Slots are on a 30 minute grid; minutes = minutes after midnight.
- `app/Services/BookingService.php`: create, reschedule, cancel, setStatus, rate, saveUsual, cleanPrefs. EVERY write to bookings must go through it. It throws `App\Exceptions\SlotTakenException` (show the message to the user, send them back to pick another time) and `InvalidArgumentException`.
- `app/Services/NotificationService.php` (email + SMS, called by BookingService, nothing for you to do).
- Auth (`AuthController`), role middleware `role:customer` / `role:owner`, layouts `resources/views/layouts/{app,customer,owner}.blade.php`, `public/css/theme.css` (design system, two themes), `public/css/app.css`, `public/js/app.js` (theme switch, `BB.toast`, forms with `data-confirm="Tap again to confirm"` for a two-tap confirm), `<x-style-art :style="$style"/>`.
- Seeder `DatabaseSeeder` (shop Kings Cut, 3 barbers, 5 services, 12 styles, owner from env).

## Your files only
Create new files; do not edit shared files other than the route file you own. Put page CSS in your own file (`public/css/customer.css` or `owner.css`) loaded with `@push('head')` and page JS in `public/js/customer.js` / `owner.js` via `@push('scripts')`. Views go in `resources/views/customer/` or `owner/`. Controllers in `app/Http/Controllers/Customer` or `Owner`. Tests in `tests/Feature/Customer*Test.php` or `Owner*Test.php`.
Use the CSS classes in `theme.css` (btn, btn secondary, btn danger, btn sm, btn block, card, card yellow, card soft, chip, chip on, badge, input, select, textarea, lbl, stepper, toggle, segmented, stepbar, empty, st-pill st-<status>, slot, slot on, slot taken, cal, scard, bcard, avatar, ticket, sms, mail, stars, pcard-guard, sticky-note, kpi, kpis, board, bcol, bk, table.t, toast). Look at the demo (`demo-src/3-customer.js`, `demo-src/4-owner.js`) for markup to copy. Must look right in both themes (never hard-code black borders or hex colors outside theme tokens `var(--blue)`, `var(--yellow)` etc.). Mobile-first, no horizontal scroll at 390px.

## Security rules (non-negotiable)
- Every POST has `@csrf`. Validate all input with Laravel validation. Escape output with `{{ }}`.
- Authorize ownership: a customer touches only `bookings.user_id = auth()->id()`. An owner touches only rows where `shop_id = auth()->user()->shop_id`. Return 404/403 otherwise. Test it.
- Never trust the browser for price, duration, barber availability or status. Recompute server-side through the services.
- Uploaded reference photos: image only (jpg, png, webp), max 4 MB, stored with `store('references', 'public')`, served through `Storage::url`.
- Phone numbers are shown and stored without a leading plus sign.

## Copy rules
No em dashes, no emojis. Sentence case labels (themes uppercase via CSS). Plain, friendly Taglish only in sample data. Sample prices note: "Sample prices. Final prices come from the partner shop." Payment is made at the shop.

## Done means
`php artisan test` passes (run from `web/`), your pages render without PHP errors for the seeded data, and you list the routes you added. Do not run `migrate:fresh` on the dev database. Commit nothing (the lead commits).
