# BarberBook PH — Interactive Demo Build Spec (for Claude Code)

> **How to use this file:** Put this file in an empty folder, open Claude Code in that folder, and paste the prompt in Section 0. Claude Code will read this spec and build a single HTML file you can double-click to open. No server, no login, no install.

---

## 0. Paste-ready prompt for Claude Code

```
Read BarberBook_PH_Demo_Build_Spec_for_Claude_Code.md in this folder and build exactly what it describes.

Deliverable: ONE self-contained file named barberbook-demo.html (all HTML, CSS, JS inline, no build step, no frameworks, no CDN scripts). It must open by double-clicking it, work offline, and have NO login.

Follow the Neo-Brutalist design system in Section 3 exactly. Implement every screen in Sections 5 and 6, the live customer-to-owner sync in Section 7, and the guided tour in Section 8. Seed the data from Section 4.

Work in this order: (1) design tokens and base components, (2) state store + seed data, (3) customer screens, (4) owner screens, (5) sync, tour, and polish, (6) testing.

When done, test it with Playwright (Chromium is installed): run every flow in the Section 10 acceptance checklist, take screenshots at 390x844 (phone) and 1440x900 (desktop), fix anything broken or ugly, then report which checklist items pass.
```

---

## 1. What this demo is for

BarberBook PH is a capstone project: **an online appointment and haircut preference system for local barbershops in the Philippines.** This HTML file is a **clickable prototype** to show the adviser and panel what the finished website will look and feel like, before the real Laravel + MySQL version is built.

It must demonstrate every feature named in the thesis (Statement of the Problem, question 3):

| Thesis feature | Where it appears in the demo |
|---|---|
| Online appointment scheduling | Customer: Schedule screen (calendar + time slots) |
| Barber and schedule availability | Customer: Barber screen; Owner: Barbers & Hours |
| Haircut preference selection and recording | Customer: Style Gallery + Preferences; Owner: Preference Card in the queue |
| Appointment confirmation and notifications | Customer: Confirmation screen, simulated Email + SMS previews, reminder simulation |
| Customer profile and appointment history | Customer: My Bookings, Profile |
| Barbershop appointment management | Owner: Queue, Walk-in, Barbers & Hours, Style Gallery Manager, Reports, Feedback |

**The one thing the panel must remember:** the customer's haircut preference (style photo + guard number + length on top + beard + notes) travels with the booking and **the barber reads it before the cut.** Make that moment look great.

**Out of scope (must match the thesis delimitations):** no real login, no online payment ("Pay at the shop" note), no AI/AR hairstyle preview, no real email/SMS sending (show previews only), no backend.

---

## 2. Technical rules

- **Single file:** `barberbook-demo.html`. Everything inline. Vanilla JavaScript (ES2020), no libraries, no CDN scripts.
- **Fonts:** Load *Outfit* from Google Fonts with a `<link>` (weights 500, 600, 700, 800, 900). The fallback stack must still look right offline: `'Outfit', 'Poppins', 'Segoe UI', Arial, sans-serif`.
- **Icons:** Inline SVG only (write a small `icon(name)` helper returning SVG strings). No emoji as UI icons.
- **Images:** No external images. Hairstyle "photos" are drawn as **inline SVG head illustrations** (see 3.6), each style visibly different (fade, two block, fringe, buzz, etc.). "Upload my own photo" uses `FileReader` to preview the chosen image locally.
- **Routing:** Hash-based (`#/c/home`, `#/c/styles`, `#/o/queue`, and so on). Browser back button works.
- **State:** One `store` object with `getState()`, `setState(patch)`, and `subscribe(fn)`. Every screen re-renders from state. Persist to `localStorage` under the key `barberbook-demo-v1`. Wrap every read and write in `try/catch`, and fall back to in-memory if storage is blocked.
- **Config at the top of the script** so the group can personalize it without hunting:
  ```js
  const CONFIG = {
    partnerShopName: "Kings Cut Barbershop",   // change to your partner shop
    municipality: "Tanza, Cavite",
    demoCustomerName: "Juan Dela Cruz",
    currency: "PHP",
    today: null  // null = use the real date; or "2026-11-10" to freeze the demo date
  };
  ```
- **Dates:** Use the real current date (or `CONFIG.today`) so the calendar always shows upcoming days. Format dates for the Philippines: "Tue, Nov 10, 2026" and times as "1:00 PM".
- **Responsive:** The customer app is mobile-first. On screens wider than 1024px, show it inside a phone frame (390px wide) in the center, with a "What to notice" side panel (Section 8.2). The owner dashboard uses the full width with a left sidebar. Below 768px, the sidebar collapses to a bottom tab bar.
- **Accessibility:** Real `<button>` elements, visible focus styles (see tokens), `aria-live="polite"` region for toasts, color is never the only signal (taken slots get a strike-through and the label "Taken"), respect `prefers-reduced-motion`.
- **Code organization inside the file:** clearly commented sections in this order: `CONFIG`, `TOKENS/CSS`, `ICONS`, `SEED DATA`, `STORE`, `HELPERS (dates, money, ids)`, `COMPONENTS`, `CUSTOMER SCREENS`, `OWNER SCREENS`, `ROUTER`, `TOUR`, `INIT`.

---

## 3. Design system: Neo-Brutalism (this is also the theme of the real website)

### 3.1 Tokens (use exactly)

```css
:root{
  --blue:#1E50FF;          /* page background, hero, active nav on dark */
  --yellow:#FFE600;        /* primary buttons, active tabs, highlights */
  --yellow-hover:#EDD400;
  --yellow-soft:#FEF08A;   /* tags, secondary badges, notice boxes */
  --ice:#E2F1F8;           /* dashboard canvas, image placeholders */
  --card:#FFFFFF;
  --ink:#000000;           /* borders, text, shadows */
  --ink-2:#111827;         /* body text alternative */
  --muted:#333333;
  --green:#22C55E;         /* confirmed, done, success */
  --red:#EF4444;           /* cancel, no-show, destructive */
  --amber:#F59E0B;         /* pending, reminders */

  --bw:2.5px;              /* default border width */
  --r-sm:8px; --r-md:12px; --r-lg:16px; --r-pill:9999px;

  --sh-sm:2px 2px 0 #000;
  --sh-md:4px 4px 0 #000;
  --sh-lg:6px 6px 0 #000;
  --sh-xl:8px 8px 0 #000;

  --font:'Outfit','Poppins','Segoe UI',Arial,sans-serif;
  --ease:cubic-bezier(.2,.9,.3,1.2);
}
```

### 3.2 Rules

- **Every** card, button, input, chip, badge, and image frame has a solid black border (`2px` to `3px`).
- **Shadows are hard offsets, never blurred.** No `rgba` blur shadows anywhere.
- **Headings:** weight 800 to 900, UPPERCASE, `letter-spacing:-0.02em`. **Body:** weight 500 to 600, black on white, cream, or ice.
- **Backgrounds:** the customer app hero and the landing strip use `--blue`, content sits on white cards. The owner dashboard canvas is `--ice`.
- **Rotated badges:** small UPPERCASE tags with `rotate(-3deg)` or `rotate(3deg)`, `--yellow-soft` or `--green` background, black border, `--sh-sm`. Use them for "TRENDING", "NEW", "YOUR USUAL", "OPEN NOW", "RECOMMENDED", and similar.
- **Status colors:** Pending = amber, Confirmed = blue with white text, In chair = yellow, Done = green, Cancelled = gray with strike-through, No-show = red with white text.

### 3.3 Components (build these first, reuse everywhere)

| Component | Spec |
|---|---|
| `.btn` (primary) | yellow bg, black 2.5px border, radius 10px, `--sh-md`, weight 800 uppercase. **Hover:** `translate(-2px,-2px)` + `--sh-lg`. **Active:** `translate(2px,2px)` + `1px 1px 0 #000`. Transition 120ms. |
| `.btn.secondary` | white bg, same mechanics |
| `.btn.danger` | red bg, white text |
| `.btn.icon` | square 44x44, icon centered |
| `.card` | white, 2.5px border, radius 14px, `--sh-md`. `.card.hover` lifts on hover the same way as buttons. |
| `.chip` | pill, 2px border, weight 700. `.chip.on` = blue bg, white text, `--sh-sm` |
| `.badge` | rotated tag described above |
| `.input`, `.select`, `.textarea` | white, 2px border, radius 8px. **Focus:** `background:#FFFAEC; outline:2px solid #000; outline-offset:2px` |
| `.stepper` | [−] value [+] with black-bordered square buttons (for guard number 0 to 8) |
| `.toggle` | brutalist switch: 2px border track, black knob, yellow track when on |
| `.segmented` | row of buttons, active one yellow with `--sh-sm` |
| `.stepbar` | 4 numbered circles (Style → Barber → Schedule → Review) connected by thick 3px black lines. Done = black fill with a yellow check, current = yellow, upcoming = white |
| `.toast` | slides in from the top-right (desktop) or top (mobile), card style, colored left icon block, auto-hides after 4s, stack up to 3 |
| `.modal` | centered card with `--sh-xl`, backdrop `rgba(0,0,0,.45)`; closes with Esc or a click on the backdrop |
| `.phone-frame` | 390x844 inner, 3px black border, radius 36px, `--sh-xl`, black status bar showing the time and "PH" |
| `.empty` | friendly empty state with an icon, a one-line message, and an action button |

### 3.4 Motion (make it feel alive, but never slow)

- Screen change: new screen slides up 12px and fades in (200ms, `--ease`).
- Cards in lists: staggered entrance, 40ms apart, max 8 items.
- Selecting a style, barber, or slot: a 1.05 "pop" scale and the shadow grows.
- Confirm booking: the check mark stamps in (scale 0 → 1.15 → 1 with a slight rotation), plus a short burst of 20 yellow/blue/black square confetti pieces (CSS only, 900ms).
- A new booking arriving in the owner queue: the row flashes yellow once and a "NEW" badge wiggles in.
- Everything is disabled under `prefers-reduced-motion: reduce`.

### 3.5 Layout reference

- **Customer header:** yellow app bar, black bottom border, logo "BARBER**BOOK** PH" ("BOOK" in blue), weight 900.
- **Customer bottom tabs:** Home · Styles · Bookings · Profile. Active tab = yellow block.
- **Owner sidebar:** white, 3px black right border, nav items are boxed tabs that turn yellow with `3px 3px 0 #000` when active: Queue · Walk-in · Barbers & Hours · Style Gallery · Reports · Feedback.

### 3.6 Hairstyle illustrations (inline SVG)

Write `styleArt(styleId)` that returns a 160x160 SVG: an ice-blue square, a simple black-outlined head and shoulders (front view), and a hair shape drawn per style (thick black 3px outline, hair filled black or dark gray, with lighter faded sides for fades). Minimum distinct styles: Mid Taper Fade, Low Fade, High Skin Fade, Two Block, Textured Fringe, French Crop, Buzz Cut, Crew Cut, Side Part (Classic), Pompadour, Mullet (modern), Kids' Cut. They should look like clean flat icons, not realistic drawings. Label each card "Reference image" in small text.

---

## 4. Seed data

```js
shops: [
  { id:"s1", name: CONFIG.partnerShopName, area:"Poblacion, " + CONFIG.municipality, distanceKm:1.2, rating:4.8, reviews:126,
    hours:"9:00 AM – 7:00 PM", openDays:[0,1,2,3,4,5,6], partner:true },
  { id:"s2", name:"Fadez Manila Barber Lounge", area:"Trece Martires", distanceKm:3.4, rating:4.5, reviews:89, comingSoon:true },
  { id:"s3", name:"The Gentlemen's Chair", area:"Imus", distanceKm:5.0, rating:4.4, reviews:54, comingSoon:true }
]
// Only s1 is bookable. s2 and s3 show a "COMING SOON" badge (this matches the thesis: tested in one partner shop, designed for more).

services: [
  { id:"sv1", name:"Haircut", price:150, mins:30 },
  { id:"sv2", name:"Haircut + Beard Trim", price:220, mins:45 },
  { id:"sv3", name:"Haircut + Hair Wash", price:200, mins:40 },
  { id:"sv4", name:"Kids' Haircut (12 and below)", price:120, mins:25 },
  { id:"sv5", name:"Beard Trim Only", price:100, mins:15 }
]
// Mark all prices as sample prices: "Sample prices. Final prices come from the partner shop."

barbers: [
  { id:"b1", name:"Kuya Ramil", specialty:"Fades, skin fade", rating:4.9, years:8, days:[1,2,3,4,5,6], start:"09:00", end:"18:00", breakAt:"12:00" },
  { id:"b2", name:"Jhun", specialty:"Classic, scissor cut", rating:4.6, years:5, days:[0,1,2,3,5,6], start:"10:00", end:"19:00", breakAt:"13:00" },
  { id:"b3", name:"Paolo", specialty:"Textured, two block, kids", rating:4.7, years:3, days:[0,2,3,4,5,6], start:"09:00", end:"17:00", breakAt:"12:00" }
]
// days: 0=Sun … 6=Sat. Slots are every 30 minutes. The break removes one 60-minute block.

styles: 12 items { id, name, category: "Trending"|"Fades"|"Classic"|"Textured"|"Kids", mins, trending:boolean, hidden:false }
// Trending = Mid Taper Fade, Two Block, Textured Fringe, Modern Mullet.

customer (the demo user, already "signed in"; there is NO login screen):
{ name: CONFIG.demoCustomerName, mobile:"0917 123 4567", email:"juan.delacruz@example.com",
  favoriteBarber:"b1",
  savedPrefs:{ styleId:"midtaper", guard:2, top:"Keep it long (scissor only)", beard:"Line-up only",
               extras:["No hair product"], notes:"Please don't cut the top too short. May cowlick sa likod." } }

bookings (pre-seeded so the queue and reports look alive):
- 10 to 14 bookings for TODAY across the 3 barbers with sample Filipino names (Mark T., Aldrin R., Josh T., Kevin S., Carlo M., Renz P., Migs D., Paulo V., JM C., Rafael B., Ian G.), mixed statuses: 2 Done, 1 In chair, the rest Confirmed. 1 of them is a Walk-in.
- Some bookings on the next 5 days so that some slots show as Taken.
- 3 past bookings for Juan (Done, with 1 not yet rated so the rating flow can be demoed).
- 20 to 30 bookings in the past 7 days for Reports (include 2 No-shows and 1 Cancelled).

feedback: 6 seeded reviews (4 to 5 stars, short Taglish comments like "Solid fade, sulit!" and "Hindi na ako naghintay, galing.")
```

Booking numbers use the format `BB-2026-00147`, increasing.

---

## 5. Customer side (mobile-first, inside the phone frame on desktop)

### C1 · Home
- Blue hero: "BOOK YOUR NEXT HAIRCUT IN UNDER A MINUTE." A search input filters shops by name or area.
- If Juan has an upcoming booking, show a yellow **"Your next cut"** card with the date, time, barber, and a countdown ("in 2 days"), with buttons for View / Reschedule.
- **Quick rebook:** a card saying "Book YOUR USUAL: Mid Taper Fade with Kuya Ramil" that jumps straight to the Schedule step with the style, barber, and preferences prefilled. (This shows the value of saved preferences.)
- Shop list cards (distance, rating, "OPEN NOW" badge based on the current time). Tapping the partner shop opens C2.

### C2 · Shop detail
- Shop header card: name, address, hours, rating.
- Services and sample prices list (select one; the default is Haircut).
- Barbers preview row.
- A small "PAY AT THE SHOP" notice (the system only reserves the slot).
- CTA: **BOOK AN APPOINTMENT →** starts the booking flow with the stepbar.

### C3 · Step 1 — Choose a style
- Category chips: Trending · Fades · Classic · Textured · Kids · All.
- 2-column grid of style cards (SVG art, name, duration, "TRENDING" badge where it applies).
- Selected card: yellow background, `--sh-lg`, check badge.
- **"Upload my own photo"** button: opens the file picker and shows a preview thumbnail inside a card labeled "Your reference photo (sent to the barber)". It is stored in memory as a data URL for this session only.
- "Skip, I'll decide at the shop" link (allowed, and the booking shows "No style selected").

### C4 · Step 2 — Barber + haircut preferences
- Barber cards: avatar initials in a colored circle, name, specialty, rating, and "Next free: 1:30 PM today" calculated from the slots. Plus an "Any available barber · fastest schedule" option.
- **Haircut preferences** panel (prefilled from `savedPrefs` with a "YOUR USUAL" badge):
  - Guard number on the sides: stepper 0 to 8 (with a small diagram label "0 = skin, 8 = long")
  - Length on top: segmented: *Short · Medium · Keep it long (scissor only)*
  - Beard: segmented: *None · Line-up only · Full trim*
  - Extras chips: Trim eyebrows · No hair product · Hair wash · Hard part
  - Notes to barber: textarea (max 200 chars with a counter)
  - Checkbox: **"Save as my usual"** (checked by default)

### C5 · Step 3 — Schedule
- Month calendar (current month + next month navigation). Past days and the barber's days off are disabled. Days with no free slots show a small "FULL" tag.
- The time-slot grid for the chosen barber and day is **duration-aware**: a slot is free only if the whole service + style duration fits before the next booking, the break, or closing time. Taken slots are shown struck-through with the label "Taken" and cannot be clicked.
- If "Any available barber" was chosen, merge the slots of all barbers and auto-assign the barber, showing "Assigned to Paolo".
- Helper text: "Slots already taken are hidden automatically, so double booking will not happen."

### C6 · Step 4 — Review
- Summary rows: Barbershop, Service, Barber, Haircut (thumbnail + name), Preferences (guard, top, beard, extras, notes), Date, Time, Duration, **Total (sample)**.
- Notice: "Payment is made at the shop. The system only reserves your slot."
- Buttons: **CONFIRM BOOKING** / Edit (goes back to any step while keeping choices).
- **Double-booking guard:** on confirm, re-check the slot. If it was taken in the meantime (for example, by a walk-in the owner added in the other tab or view), show a red modal "Sorry, that slot was just taken" and send the user back to the Schedule step. Make this demoable (see Section 7).

### C7 · Confirmation
- Big stamped check mark + confetti. Title "YOUR SLOT IS RESERVED". Booking ticket card (booking no., shop, barber, date/time, style thumbnail).
- Two side-by-side **message previews**, clearly labeled "Preview only — not actually sent in this demo":
  - **Email** card: subject "Your BarberBook PH booking BB-2026-00148 is confirmed" with a short body.
  - **SMS** card, drawn like a phone message bubble: "BarberBook PH: Hi Juan! Your haircut with Kuya Ramil is confirmed for Tue Nov 10, 1:00 PM at Kings Cut. Reply or open the app to reschedule. Ref BB-2026-00148"
- Buttons: **Add to my calendar** (generates and downloads a real `.ics` file), **Simulate reminder** (fires an amber toast plus an SMS bubble: "Reminder: your haircut is in 1 hour…"), Go to My Bookings.

### C8 · My Bookings
- Tabs: Upcoming · Past · Cancelled.
- Booking cards with a status badge. For Upcoming: **Reschedule** (re-opens Schedule with everything prefilled, then updates the same booking number) and **Cancel** (confirm modal, requires a reason chip: "Schedule conflict / Feeling sick / Found another time / Other").
- For Past + Done + unrated: a **RATE YOUR CUT** button that opens C10.

### C9 · Profile
- Customer info card (static, labeled "Demo account, no login in this prototype").
- **My usual** preference card with an Edit button (edits `savedPrefs`).
- Favorite barber.
- Appointment history list (all past bookings with style thumbnails): "7 visits since Aug 2026".
- A small "Data privacy" note: "Your details are used only for your bookings (RA 10173, Data Privacy Act of 2012)."

### C10 · Rate & feedback (modal)
- 5 big brutalist star buttons, quick tags (Sulit · On time · Exactly what I asked · Friendly · Clean shop), and an optional comment. On submit: a success toast, and the review appears in Owner → Feedback.

---

## 6. Owner side ("Barbershop Owner" view, full-width dashboard)

A top **role switcher** (Section 7) moves between the Customer and Owner views. No login.

### O1 · Today's Queue (default owner screen)
- KPI row (4 cards): Bookings today · Open slots left · In chair now · No-shows this week.
- **Timeline board:** one column per barber, rows by time (9 AM to 7 PM), booking blocks sized by duration and colored by status. A red "now" line moves with the real time.
- A list view toggle (table: time, customer, barber, service, status, actions).
- Clicking a booking opens the **Preference Card drawer** (the hero moment): big style illustration or the uploaded reference photo, guard number shown as a big number in a yellow box, length on top, beard, extras, notes in a yellow-soft sticky-note style, plus "Last visit: Mid Taper Fade, #2 guard (Oct 12)". Title: "READ THIS BEFORE THE CUT."
- Status actions inside the drawer: Start (In chair) → Done, or No-show, or Cancel. Each change updates KPIs, the customer's My Bookings, and Reports immediately.

### O2 · Walk-in
- A quick form: customer name (optional "Walk-in guest"), service, style (optional), barber or "first available", with "Now" or pick a time. It shows only valid free slots.
- On save, the booking is added with the "WALK-IN" badge and **blocks that slot for online customers** (demonstrates no double booking between walk-ins and online bookings).

### O3 · Barbers & Hours
- One card per barber: working days (7 day toggles), start/end time selects, break time, "Day off today" toggle, and an "Add barber" form.
- Changes affect the customer Schedule screen instantly.

### O4 · Style Gallery Manager
- Grid of all styles with: Trending toggle, Hide/Show toggle, edit name/duration, and "Add style" (choose one of the SVG art presets + name + category + minutes).
- The customer gallery reflects the changes instantly (the "Trending styles are updated by the shop" feature).

### O5 · Reports
Pure inline SVG charts (no libraries), brutalist style: black 2px axes, bars filled blue/yellow with black borders, value labels on the bars.
- Bookings per day (last 7 days) — bar chart.
- Bookings per barber (this week) — horizontal bars.
- Top 5 requested styles — horizontal bars.
- Status breakdown this week (Done / No-show / Cancelled) — a stacked bar or three KPI cards with percentages.
- Busiest hours — a simple 7x10 heat grid (day x hour) using 4 shades of blue.
- Filter: This week · Last week · This month. **Export CSV** button (downloads the bookings table).
- A small note: "Reports help the owner decide shop hours and staffing (Significance of the Study)."

### O6 · Feedback
- Average rating (big number), rating distribution bars, and a list of reviews with stars, tags, date, and barber.

---

## 7. Live sync between the Customer and Owner views (the "wow")

- A sticky **demo bar** at the very top (black background, yellow text): `BARBERBOOK PH · INTERACTIVE PROTOTYPE` · role switcher `[ CUSTOMER VIEW | OWNER VIEW ]` · `[ ▶ GUIDED TOUR ]` · `[ ⟲ RESET DEMO ]`.
- **Split mode (desktop only, ≥1280px):** a toggle "Side by side" shows the Customer phone on the left and the Owner Queue on the right at the same time. When the customer confirms a booking, it appears in the owner queue instantly with a yellow flash and a "NEW" badge, and the owner gets a toast: "New booking: Juan Dela Cruz · Mid Taper Fade · 1:00 PM · Kuya Ramil."
- Both views read from the same store, so status changes made by the owner (Done, No-show) show up immediately in the customer's My Bookings, and "Done" enables "Rate your cut".
- **Double-booking demo:** in split mode, the owner can add a walk-in at the exact time the customer is about to confirm. The customer then gets the "slot was just taken" modal. Add a tour step for this.
- Also sync across browser tabs with the `storage` event (a nice bonus if two laptops or tabs are used).
- **Reset demo:** a confirm modal, then restore the seed data and go to Home.

---

## 8. Presenter helpers

### 8.1 Guided tour (10 steps)
An overlay with a spotlight cut-out around the target element, a card with a step title, one or two sentences, and Back / Next / Exit buttons. Keyboard: arrows and Esc. Steps:
1. Home: "Customers book online instead of waiting in line."
2. Quick rebook: "Saved preferences make repeat bookings one tap."
3. Style gallery: "Customers show exactly what they want, with trending styles or their own photo."
4. Preferences: "Guard number, top length, beard, notes. Saved to the profile."
5. Schedule: "Only free slots can be picked. No double booking."
6. Confirmation: "Instant confirmation with Email and SMS previews and reminders."
7. Owner queue: "The owner sees the day at a glance."
8. Preference card: "The barber reads this before the cut. This is our main feature."
9. Reports: "Simple reports for staffing and shop hours."
10. Feedback: "Ratings help measure customer satisfaction."

The tour switches roles and routes automatically, and it may prefill a demo booking so each step has content.

### 8.2 "What to notice" side panel (desktop, customer view)
Next to the phone frame, a white card lists 3 to 4 bullets that change per screen, linking each screen to a thesis objective (for example, on Schedule: "Objective 3a: online appointment scheduling; taken slots are blocked automatically"). A small toggle hides it.

### 8.3 Footer
"Prototype for the capstone project BarberBook PH: An Online Appointment and Haircut Preference System for Local Barbershops. Sample data only. [School name] · [Year]" (with the placeholders left for the group).

---

## 9. Copy and tone

- UI language: English, with light, friendly Taglish in sample data and reviews only (for example, "Sulit!", "May cowlick sa likod").
- Buttons in UPPERCASE with an arrow where it moves forward: `CONTINUE →`, `CONFIRM BOOKING →`.
- Every empty state has a helpful sentence and an action.
- Never show "Lorem ipsum". Never show real phone numbers or emails other than the fake ones above.

---

## 10. Acceptance checklist (Claude Code must test all of these with Playwright)

**Load and theme**
- [ ] Opens by double-clicking `barberbook-demo.html` (file://), no console errors.
- [ ] All borders black, all shadows hard offset (no blurred shadows), headings uppercase 800+.
- [ ] Works at 390x844 and 1440x900; no horizontal scroll on phone.

**Customer**
- [ ] Search filters shops; only the partner shop is bookable, others show "COMING SOON".
- [ ] Full booking: style → barber + prefs → date + slot → review → confirm → confirmation with booking number.
- [ ] Taken slots cannot be selected; long styles block overlapping slots; days off are disabled.
- [ ] "Any available barber" auto-assigns a barber.
- [ ] Upload my own photo shows a preview and appears on the owner Preference Card.
- [ ] "Save as my usual" updates Profile → My usual; Quick rebook uses it.
- [ ] Add to calendar downloads a valid `.ics`. Simulate reminder shows the toast + SMS bubble.
- [ ] Reschedule keeps the same booking number and moves the slot; the old slot becomes free.
- [ ] Cancel requires a reason; the booking moves to Cancelled and its slot is freed.
- [ ] Rating a Done booking adds it to Owner → Feedback and updates the average.

**Owner**
- [ ] The queue shows seeded bookings; the "now" line is at the correct time.
- [ ] Preference Card drawer shows the style art or photo, guard, top, beard, extras, and notes.
- [ ] Status changes update KPIs, Reports, and the customer's My Bookings instantly.
- [ ] A walk-in blocks the slot for online booking.
- [ ] Barber day-off/hours changes affect customer slots immediately.
- [ ] Hiding a style removes it from the customer gallery; Trending toggles move it into or out of the Trending chip.
- [ ] Reports render all charts with labels; the filter changes the data; Export CSV downloads.

**Sync and presenter**
- [ ] Side-by-side mode: a new customer booking appears in the owner queue with a flash + toast.
- [ ] The double-booking race shows the "slot was just taken" modal.
- [ ] Guided tour runs all 10 steps without errors, including role switches.
- [ ] Reset demo restores the seed data.
- [ ] Reload keeps the state (localStorage); it still works if storage is blocked.
- [ ] `prefers-reduced-motion` disables the animations.

**Deliver:** `barberbook-demo.html` plus a `screenshots/` folder (home, gallery, preferences, schedule, confirmation, owner queue, preference card, reports; phone and desktop versions).

---

## 11. Notes for the real system later (not for this demo)

This prototype's screens map directly to the Laravel build in the thesis: the store's objects become MySQL tables (`shops`, `services`, `barbers`, `barber_hours`, `styles`, `customers`, `customer_preferences`, `bookings`, `feedback`, `notifications`), the hash routes become Laravel routes, and the simulated Email/SMS previews become real Gmail SMTP and SMS gateway jobs. Keep the same design tokens in the real CSS so the prototype and the final system look identical.
