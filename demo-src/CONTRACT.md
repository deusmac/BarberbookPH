# Shared contract (read before writing)
Final file = concatenation of demo-src parts inside one <script>: 2-core.js, 2b-glue.js, 3-customer.js, 4-owner.js, 5-shell.js.
Strict mode, vanilla ES2020, no libraries. Read 2-core.js and 2b-glue.js FIRST: they already define CONFIG, icon(), helpers ($, esc, pad, fmtTime, fmtDate, fmtShort, dkey, parseKey, addDays, todayKey, nowMin, hhmm, toHHMM, money, initials, ACTIVE, STATUS, COLORS, diffDays, dow), `state` (data + ui + draft), `store`, `commit()` (persist + re-render), domain logic (getStyle, getBarber, getService, visibleStyles, durFor, barberWorks, isFree, pool, candidateTimes, freeBarbers, dayHasFree, pickAuto, nextFree, isUpcoming, myBookings, upcomingMine, newBookingNo, avgRating, lastVisit), plus ACTIONS, MODALS, toast(), openModal(), closeModal(), go(), setPath(), splitOn().
Do not redefine anything from those files. No em dashes and no emojis anywhere in code or copy.

## Rendering model
Every screen is a function returning an HTML string. The shell (5-shell.js, written by the lead) re-renders everything from `state` on every commit(), so NEVER cache DOM nodes. Mutate `state` (or call setPath) then call `commit()`.
## Event wiring (done by the shell via delegation, you only emit attributes)
- `data-act="name"` (+ any `data-*`): click calls `ACTIONS.name(dataset, event)`. Define handlers with `Object.assign(ACTIONS, { name(ds, ev){...} })`.
- `data-in="state.path"`: text input/textarea `input` event runs setPath(path, value); add `data-render="1"` if the screen must re-render while typing (give such inputs a stable `id` so focus is restored). Add `data-num="1"` to store a Number.
- `data-ch="state.path"`: select/checkbox `change` event runs setPath(path, value) then commit(). (`data-num="1"` supported; for a checkbox the value stored is its checked boolean.)
- `data-file="actionName"`: file input `change` calls ACTIONS.actionName(dataset, event).
- Modals: `openModal({type:"x", ...})` stores in state.ui.modal; register `MODALS.x = m => "<h2>Title</h2>...buttons using data-act=closeModal..."`. The shell wraps in backdrop + .modal card. Close via `data-act="closeModal"` (shell registers it). Escape/backdrop close handled by shell.
- `toast(msg, type)` for notifications.
- Use `data-tour="name"` attributes on the elements listed for you below.
## Style rules
Use the CSS classes already in 1-head.html (btn, btn secondary/danger/sm/block/icon, card, card hover, chip, chip on, badge, input, select, textarea, lbl, stepper, toggle, segmented, stepbar, empty, st-pill st-<status>, grid2, kpis, kpi, board, t table, etc.). Read that file's CSS. Neo-Brutalist: black borders, hard shadows, UPPERCASE headings. Add any extra CSS via a `const EXTRA_CSS_A` / `EXTRA_CSS_B` string at the top of your file (shell injects them into a <style>); prefer existing classes.
## Draft shape (owned by customer part) state.draft
{shopId:"s1", serviceId, styleId|"" , photo:dataURL|null, barberId:"any"|id, prefs:{guard,top,beard,extras:[],notes}, usual:bool(prefs still equal to saved usual), saveUsual:true, date:"YYYY-MM-DD"|"", start:minutes|null, assigned:barberId|null, rescheduleId:null|bookingNo, step}
Booking object (in state.bookings): {id, shopId, cid:"juan"|null, name, barberId, serviceId, styleId, photo, prefs:{guard,top,beard,extras,notes}, date, start(minutes), dur, status(pending|confirmed|inchair|done|cancelled|noshow), walkin, rated, created, cancelReason?}
## Navigation
Customer routes (strings passed to go()/data-to): home, shop, styles, bookings, profile, book/style, book/barber, book/schedule, book/review, confirm. Shell handles `data-act="go" data-to="<route>"` and `data-act="ogo" data-to="<ownerRoute>"` and `data-act="back"` (history back).
Owner routes: queue, walkin, barbers, gallery, reports, feedback.
