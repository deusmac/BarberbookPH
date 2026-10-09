# BarberBook PH

Capstone project: an online appointment and haircut preference system for local barbershops (Philippines).

- `web/`: the real system (Laravel 12, email notifications, Claude, Clay and Brutal themes). Run locally with the steps in `docs/DEPLOY.md`; demo logins after `php artisan db:seed --class=DemoSeeder`: customer `juan@example.com` / `password`, owner from `.env` (`OWNER_EMAIL` / `OWNER_PASSWORD`). `docs/PRODUCTION_PLAN.md` has the scope.
- `barberbook-demo.html`: the clickable prototype. Single file, no login, works offline. Double-click to open.
- `demo-src/`: source parts. Edit these, then run `sh demo-src/build.sh` to rebuild `barberbook-demo.html`.
- `BarberBook_PH_Demo_Build_Spec_for_Claude_Code.md`: the build spec the demo follows.
- `handoff/`: the original thesis backup and handoff package (chapters, decks, UI sources, uploads).
- `screenshots/`: phone (390x844) and desktop (1440x900) captures of the demo.

The demo has two selectable themes (Clay, default, and Neo-brutal). Use the theme switch in the demo bar. See spec section 3.7.

Personalize the demo in the `CONFIG` block at the top of the script (shop name, municipality, customer name, frozen date).

Project memory for agents and contributors: `CLAUDE.md`. History: `CHANGELOG.md`.
