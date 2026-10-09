# BarberBook PH

Capstone project: an online appointment and haircut preference system for local barbershops (Philippines).

- `web/`: the real system (Laravel 12). See `docs/DEPLOY.md` to run and deploy it, `docs/PRODUCTION_PLAN.md` for scope.
- `barberbook-demo.html`: the clickable prototype. Single file, no login, works offline. Double-click to open.
- `demo-src/`: source parts. Edit these, then run `sh demo-src/build.sh` to rebuild `barberbook-demo.html`.
- `BarberBook_PH_Demo_Build_Spec_for_Claude_Code.md`: the build spec the demo follows.
- `handoff/`: the original thesis backup and handoff package (chapters, decks, UI sources, uploads).
- `screenshots/`: phone (390x844) and desktop (1440x900) captures of the demo.

The demo has two selectable themes (Clay, default, and Neo-brutal). Use the theme switch in the demo bar. See spec section 3.7.

Personalize the demo in the `CONFIG` block at the top of the script (shop name, municipality, customer name, frozen date).
