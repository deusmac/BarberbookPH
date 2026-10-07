// BarberBook PH — UI Showcase deck (Neo-Brutalist). Shapes tagged "anim:<step>:<effect>:<slot>" for animate.py
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const BLUE = '1E50FF', YEL = 'FFE600', YSOFT = 'FEF08A', ICE = 'E2F1F8', BLK = '000000', WHT = 'FFFFFF', GRN = '22C55E', RED = 'EF4444', GRAY = '333333';
const F = 'Arial';
const sh = (o = 5) => ({ type: 'outer', color: BLK, blur: 0, offset: o, angle: 45, opacity: 1 });
const A = (step, eff = 'float', slot = 0) => `anim:${step}:${eff}:${slot}`;
const border = (w = 2.25) => ({ color: BLK, width: w });
const size = (p) => { const b = fs.readFileSync(p); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };
const O = (n) => `out/${n}.png`;
const [pw, ph] = size(O('m_home')); const PR = pw / ph;
const [bw, bh] = size(O('w_queue')); const BR = bw / bh;

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = 'BarberBook PH UI Showcase';
const RR = pres.shapes.ROUNDED_RECTANGLE;

const txt = (s, t, o) => s.addText(t, { fontFace: F, color: BLK, margin: 0, valign: 'top', isTextBox: true, ...o });
const badge = (s, t, o) => s.addText(t, { x: o.x, y: o.y, w: o.w, h: o.h || 0.42, shape: RR, rectRadius: 0.08, fill: { color: o.fill || YEL }, line: border(2), shadow: sh(3), rotate: o.rot ?? -3, fontFace: F, fontSize: o.fs || 12, bold: true, color: o.color || BLK, align: 'center', valign: 'middle', margin: 0, objectName: o.tag, isTextBox: true });
const card = (s, o) => s.addShape(RR, { x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: o.r ?? 0.12, fill: { color: o.fill || WHT }, line: border(o.bw), shadow: o.noShadow ? undefined : sh(o.so || 5), objectName: o.tag, rotate: o.rot });
const header = (s, b, t, sub, dark) => {
  badge(s, b, { x: 0.6, y: 0.3, w: Math.max(1.5, b.length * 0.125 + 0.5), rot: -3, tag: A(0, 'zoom') });
  txt(s, t.toUpperCase(), { x: 0.6, y: 0.78, w: 12.1, h: 0.62, fontSize: 28, bold: true, color: dark ? WHT : BLK, valign: 'middle' });
  if (sub) txt(s, sub, { x: 0.6, y: 1.38, w: 12.1, h: 0.36, fontSize: 14, color: dark ? 'DCE6FF' : GRAY });
};
const phone = (s, name, x, y, h, tag, rot) => s.addImage({ path: O(name), x, y, w: h * PR, h, objectName: tag, rotate: rot });
const browser = (s, name, x, y, w, tag) => s.addImage({ path: O(name), x, y, w, h: w / BR, objectName: tag });
// numbered callouts column
const callouts = (s, items, x, y, w, step, dark, gap = 1.05) => items.forEach((c, i) => {
  const t = A(step, 'float', i), yy = y + i * gap;
  s.addText(String(i + 1), { x, y: yy, w: 0.5, h: 0.5, shape: pres.shapes.OVAL, fill: { color: i === 0 ? YEL : WHT }, line: border(2), fontFace: F, fontSize: 16, bold: true, color: BLK, align: 'center', valign: 'middle', margin: 0, objectName: t, isTextBox: true });
  txt(s, [{ text: c[0].toUpperCase(), options: { bold: true, fontSize: 14, breakLine: true } }, { text: c[1], options: { fontSize: 12, color: dark ? 'DCE6FF' : GRAY } }], { x: x + 0.65, y: yy - 0.02, w: w - 0.65, h: gap - 0.1, color: dark ? WHT : BLK, objectName: t });
});
const label = (s, t, x, y, w, tag, fill = YEL) => s.addText(t, { x, y, w, h: 0.38, shape: RR, rectRadius: 0.08, fill: { color: fill }, line: border(2), shadow: sh(3), fontFace: F, fontSize: 10.5, bold: true, color: fill === BLK ? YEL : BLK, align: 'center', valign: 'middle', margin: 0, objectName: tag, isTextBox: true });

let s;
// 1 TITLE
s = pres.addSlide(); s.background = { color: BLUE };
browser(s, 'w_landing', 5.9, 0.55, 7.0, A(1, 'float'));
phone(s, 'm_prefs', 6.0, 2.35, 4.9, A(2, 'float', 0), -6);
phone(s, 'm_home', 8.35, 2.05, 5.2, A(2, 'float', 1));
phone(s, 'm_pcard', 10.75, 2.35, 4.9, A(2, 'float', 2), 6);
badge(s, 'UI SHOWCASE · MOBILE + WEB', { x: 0.6, y: 0.8, w: 3.6, rot: -3, tag: A(3, 'zoom') });
s.addText([{ text: 'THIS IS HOW', options: { breakLine: true } }, { text: 'BARBERBOOK PH', options: { color: BLUE, breakLine: true } }, { text: 'WILL LOOK.' }], { x: 0.6, y: 1.45, w: 5.0, h: 2.35, shape: RR, rectRadius: 0.12, fill: { color: WHT }, line: border(3), shadow: sh(8), fontFace: F, fontSize: 34, bold: true, color: BLK, margin: 14, valign: 'middle', objectName: A(4, 'float'), isTextBox: true });
txt(s, 'Sample screens for the customer app and the barbershop dashboard, in the actual theme of the website.', { x: 0.6, y: 4.1, w: 4.9, h: 0.9, fontSize: 15, bold: true, color: WHT, objectName: A(5, 'fade') });
[['17', 'mobile screens'], ['9', 'web screens'], ['1', 'design system']].forEach((k, i) => {
  const t = A(6, 'zoom', i), x = 0.6 + i * 1.65;
  s.addText([{ text: k[0], options: { fontSize: 28, bold: true, breakLine: true } }, { text: k[1].toUpperCase(), options: { fontSize: 9.5, bold: true } }], { x, y: 5.25, w: 1.45, h: 1.15, shape: RR, rectRadius: 0.1, fill: { color: i === 0 ? YEL : WHT }, line: border(2.5), shadow: sh(4), fontFace: F, color: BLK, align: 'center', valign: 'middle', margin: 4, objectName: t, isTextBox: true });
});
s.addNotes('This deck shows sample screens of BarberBook PH. Everything uses the actual website theme: cobalt blue, yellow, thick black outlines, and hard shadows. These are proposed designs, and the final screens will be adjusted after the interview with the partner barbershop.');

// 2 DESIGN SYSTEM
s = pres.addSlide(); s.background = { color: ICE };
header(s, 'DESIGN SYSTEM', 'One look, every screen', 'Neo-Brutalism: bold colors, thick outlines, hard shadows, buttons that feel like real buttons');
{ const [w, h] = size(O('ds')); const W2 = 11.2; s.addImage({ path: O('ds'), x: (13.333 - W2) / 2, y: 1.95, w: W2, h: W2 * h / w, objectName: A(1, 'float') }); }
badge(s, 'PRESS ME! →', { x: 9.6, y: 1.72, w: 1.7, fill: GRN, rot: 4, tag: A(2, 'zoom') });
txt(s, [{ text: 'Why this style? ', options: { bold: true, color: BLUE } }, { text: 'High contrast makes every button easy to find on a small phone screen, even outdoors or for older customers. It also makes the brand memorable.' }], { x: 0.6, y: 6.6, w: 12.1, h: 0.6, fontSize: 13.5, objectName: A(3, 'fade') });
s.addNotes('This is the design system. Every screen uses the same colors, fonts, buttons, and controls, so the system looks consistent. Buttons shift when pressed, like physical buttons.');

// 3 SECTION: MOBILE
const section = (num, title, sub, imgs) => {
  s = pres.addSlide(); s.background = { color: BLUE };
  imgs.forEach((n, i) => phone(s, n, 5.7 + i * 2.3, 1.0 + (i % 2) * 0.5, 5.6, A(1, 'float', i), i === 1 ? 0 : (i ? 4 : -4)));
  s.addText(num, { x: 0.6, y: 1.6, w: 1.5, h: 1.5, shape: RR, rectRadius: 0.1, fill: { color: YEL }, line: border(3), shadow: sh(6), fontFace: F, fontSize: 54, bold: true, color: BLK, align: 'center', valign: 'middle', margin: 0, rotate: -4, objectName: A(2, 'zoom'), isTextBox: true });
  txt(s, title.toUpperCase(), { x: 0.6, y: 3.4, w: 5.5, h: 1.6, fontSize: 40, bold: true, color: WHT, objectName: A(3, 'float') });
  txt(s, sub, { x: 0.6, y: 5.05, w: 5.2, h: 1.2, fontSize: 16, bold: true, color: 'DCE6FF', objectName: A(4, 'fade') });
};
section('01', 'The customer app', 'Mobile-first. Opens in any phone browser, no download needed. From home screen to confirmed slot in under a minute.', ['m_splash', 'm_home', 'm_gallery']);
s.addNotes('Part one: the customer side on mobile. Most customers will book using their phones.');

// device slide helpers
const devSlide = (b, t, sub, phones, co, opts = {}) => {
  s = pres.addSlide(); s.background = { color: opts.dark ? BLUE : ICE };
  header(s, b, t, sub, opts.dark);
  const H = opts.h || 5.0, gap = opts.gap || 0.4, y = 1.95;
  phones.forEach((p, i) => {
    const x = 0.6 + i * (H * PR + gap);
    phone(s, p[0], x, y, H, A(1, 'float', i));
    if (p[1]) label(s, p[1], x + 0.2, y + H - 0.12, H * PR - 0.5, A(2, 'zoom', i), p[2] || YEL);
  });
  const cx = 0.6 + phones.length * (H * PR + gap) + 0.15;
  if (co) callouts(s, co, cx, opts.cy || 2.1, 12.75 - cx, 3, opts.dark, opts.cgap);
  return s;
};

devSlide('FIRST IMPRESSION', 'Welcome and home', 'Friendly, fast, and personal from the first tap', [['m_splash', 'SPLASH'], ['m_home', 'HOME']], [
  ['No login in the demo', 'The prototype opens straight to a sample account, "Juan."'],
  ['Your next cut', 'Upcoming booking with a countdown, plus View and Reschedule.'],
  ['Quick rebook', 'One tap books "your usual": same style, same barber, same guard.'],
  ['Nearby shops', 'Open-now badges, ratings, and distance. More shops can be added later.'],
]);
s.addNotes('The home screen shows the next appointment and a quick rebook card. Quick rebook uses the saved haircut preferences, which is a key feature.');

devSlide('STEP 1', 'Shop and style gallery', 'Customers show exactly what they want, before they arrive', [['m_shop', 'SHOP'], ['m_gallery', 'STYLE GALLERY'], ['m_upload', 'OWN PHOTO']], [
  ['Services and prices', 'Sample prices. Payment is still made at the shop.'],
  ['Trending styles', 'The shop updates the gallery, so new styles show up here.'],
  ['Upload your own', 'Customers can send their own reference photo to the barber.'],
], { h: 4.95, gap: 0.35, cgap: 1.35 });
s.addNotes('Step 1 is choosing a haircut. Customers pick from the gallery or upload their own photo, which answers the problem of explaining the haircut.');

devSlide('STEP 2 · OUR MAIN FEATURE', 'Barber + haircut preferences', 'Guard number, top length, beard, extras, and notes, saved for next time', [['m_barber', 'PICK A BARBER'], ['m_prefs', 'MY DETAILS', GRN]], [
  ['Favorite barber', 'Shows each barber\'s next free time, or "any available."'],
  ['Guard number stepper', 'From #0 skin to #8. No more guessing "semi-kalbo."'],
  ['Top, beard, extras', 'Simple taps instead of long explanations.'],
  ['Notes + save as usual', 'Written once, remembered every visit.'],
]);
badge(s, 'THE PART NOBODY ELSE DOES', { x: 9.1, y: 6.45, w: 3.6, fill: RED, color: WHT, rot: -2, fs: 12, tag: A(4, 'zoom') });
s.addNotes('This is our main feature. The customer records exactly how they want their haircut, and it is saved to the profile. The barber will see all of this before the cut.');

devSlide('STEP 3–4', 'Schedule and review', 'Only free slots can be picked. Everything is checked before confirming.', [['m_sched', 'PICK A SLOT'], ['m_review', 'REVIEW']], [
  ['Smart calendar', 'Past days and days off are disabled. Full days are tagged.'],
  ['No double booking', 'Taken slots and breaks are crossed out and can\'t be tapped.'],
  ['Duration-aware', 'A 45-minute cut only fits where 45 free minutes exist.'],
  ['Full summary', 'Style, preferences, notes, time, and sample total before confirming.'],
]);
s.addNotes('The schedule screen solves double booking. Taken slots cannot be selected, and the system checks the style duration so bookings never overlap.');

devSlide('CONFIRMATION', 'Confirmed, reminded, never forgotten', 'Instant confirmation plus email and SMS reminders', [['m_confirm', 'CONFIRMED!', GRN], ['m_notif', 'NOTIFICATIONS']], [
  ['Booking number', 'A ticket to show at the shop, and it can be added to the phone calendar.'],
  ['SMS confirmation', 'Sent right after booking.'],
  ['Reminder', 'Sent before the appointment to cut no-shows (Guy et al., 2012).'],
  ['Email copy', 'For customers who prefer email.'],
]);
s.addNotes('After confirming, customers get a booking number and notifications. Research shows SMS reminders increase attendance, which is why we included them.');

devSlide('MY BOOKINGS', 'Reschedule, cancel, rate', 'Customers stay in control, and the shop gets feedback', [['m_bookings', 'MY BOOKINGS'], ['m_cancel', 'CANCEL', RED], ['m_rate', 'RATE YOUR CUT']], [
  ['Easy changes', 'Reschedule keeps the same booking number.'],
  ['Cancel with a reason', 'The slot is freed for other customers right away.'],
  ['Rate the cut', 'Stars and quick tags measure user satisfaction.'],
], { h: 4.95, gap: 0.35, cgap: 1.35 });
s.addNotes('Customers can reschedule, cancel with a reason, and rate their haircut. Ratings feed the owner dashboard and support the user-satisfaction evaluation.');

devSlide('PROFILE', 'It remembers you', 'Saved preferences and appointment history in one place', [['m_profile', 'PROFILE']], [
  ['My usual', 'Style, guard number, top, beard, and extras, editable anytime.'],
  ['Favorite barber', 'Based on the customer\'s own history.'],
  ['Visual history', 'Every past haircut with the date, useful for "same as last time."'],
  ['Data privacy', 'Details are used only for bookings, following RA 10173.'],
], { cy: 2.2, cgap: 1.15 });
{ const [w, h] = size(O('m_rate')); }
s.addNotes('The profile keeps the customer\'s preferences and history. This directly answers the research question about customer profile and appointment history.');

// SECTION 02 owner mobile
section('02', 'For the barbershop', 'The owner and barbers see the day at a glance, on the phone or on a computer.', ['m_oqueue', 'm_pcard', 'w_x'].slice(0, 2));
s.addNotes('Part two: the barbershop side. The owner can use the dashboard on a phone during the day.');

devSlide('OWNER · MOBILE', 'The queue in your pocket', 'Today\'s bookings, walk-ins, and the preference card', [['m_oqueue', "TODAY'S QUEUE", BLK], ['m_pcard', 'BEFORE THE CUT', RED]], [
  ['Live queue', 'New online bookings pop in with a NEW badge.'],
  ['Status in one tap', 'Confirmed, in chair, done, or no-show.'],
  ['Read before the cut', 'The barber sees the style, the guard number, and the notes.'],
  ['Walk-ins too', 'Encoded by the owner so the schedule stays complete.'],
]);
s.addNotes('On the phone, the owner sees the queue, and the barber opens the preference card before starting the haircut. This is where our main feature pays off.');

// SECTION 03 web
s = pres.addSlide(); s.background = { color: BLUE };
browser(s, 'w_landing', 5.6, 1.1, 7.3, A(1, 'float'));
s.addText('03', { x: 0.6, y: 1.6, w: 1.5, h: 1.5, shape: RR, rectRadius: 0.1, fill: { color: YEL }, line: border(3), shadow: sh(6), fontFace: F, fontSize: 54, bold: true, align: 'center', valign: 'middle', margin: 0, rotate: -4, objectName: A(2, 'zoom'), isTextBox: true });
txt(s, 'THE WEB VERSION', { x: 0.6, y: 3.4, w: 5, h: 1.2, fontSize: 40, bold: true, color: WHT, objectName: A(3, 'float') });
txt(s, 'The same system on a laptop: a public landing page, desktop booking, and the full owner dashboard.', { x: 0.6, y: 4.75, w: 4.8, h: 1.3, fontSize: 16, bold: true, color: 'DCE6FF', objectName: A(4, 'fade') });
s.addNotes('Part three: the web version for laptops and desktop computers, which is what the owner will use at the counter.');

const webSlide = (b, t, sub, img, co, opts = {}) => {
  s = pres.addSlide(); s.background = { color: opts.dark ? BLUE : ICE };
  header(s, b, t, sub, opts.dark);
  const w = opts.w || 8.3;
  browser(s, img, 0.6, 1.95, w, A(1, 'float'));
  if (co) callouts(s, co, 0.6 + w + 0.4, 2.1, 12.75 - (0.6 + w + 0.4), 2, opts.dark, opts.cgap || 1.2);
  return s;
};
webSlide('LANDING PAGE', 'barberbook.ph', 'The public website that customers and shop owners see first', 'w_landing', [
  ['Bold promise', '"No more pila. Just your cut."'],
  ['Two paths', 'Book a haircut, or sign up a barbershop.'],
  ['Proof points', 'Booking time, zero double booking, style count.'],
  ['Same theme', 'Matches the app, so the brand stays consistent.'],
]);
s.addNotes('This is the landing page. It explains the value in one line and gives two clear actions.');

webSlide('DESKTOP BOOKING', 'Book on a big screen', 'Style grid, step tracker, and a live booking summary', 'w_book', [
  ['4-step tracker', 'Style, barber, schedule, review. Always visible.'],
  ['Bigger gallery', '4 columns of styles with search and filters.'],
  ['Live summary', 'The booking card updates as the customer picks.'],
]);
s.addNotes('Customers can also book on a laptop. The summary on the right updates with every choice.');

webSlide('OWNER DASHBOARD', "Today's queue", 'Every barber, every booking, one timeline', 'w_queue', [
  ['KPI cards', 'Bookings, open slots, in chair, no-shows.'],
  ['Barber timeline', 'Color-coded by status, with a live "NOW" line.'],
  ['New booking alert', 'Online bookings pop up instantly with a NEW badge.'],
  ['Add walk-in', 'One button away, always on top.'],
]);
s.addNotes('This replaces the notebook. The owner sees all barbers and bookings on one timeline, color-coded by status.');

webSlide('THE HERO SCREEN', 'Read this before the cut', 'Click any booking and the barber sees exactly what the customer wants', 'w_pcard', [
  ['Style reference', 'Gallery image or the customer\'s own photo.'],
  ['Guard in big numbers', '#2 is impossible to miss.'],
  ['Top, beard, extras', 'Clear, one line each.'],
  ['Notes + history', 'The customer\'s own words and past visits.'],
]);
badge(s, 'SOLVES "YUNG DATI LANG PO"', { x: 9.85, y: 6.6, w: 3.0, fill: YEL, rot: -2, fs: 11, tag: A(3, 'zoom') });
s.addNotes('This is the most important screen for the barber. It turns vague requests like "yung dati lang po" into exact, written instructions.');

// walk-in + barbers side by side
s = pres.addSlide(); s.background = { color: ICE };
header(s, 'SHOP MANAGEMENT', 'Walk-ins and barber hours', 'Walk-ins block the slot for online customers, and hours update the calendar instantly');
browser(s, 'w_walkin', 0.6, 2.0, 6.0, A(1, 'float', 0));
browser(s, 'w_barbers', 6.75, 2.0, 6.0, A(1, 'float', 1));
label(s, 'WALK-IN FORM', 0.9, 2.0 + 6.0 / BR + 0.1, 2.2, A(2, 'zoom', 0));
label(s, 'BARBERS & HOURS', 7.05, 2.0 + 6.0 / BR + 0.1, 2.4, A(2, 'zoom', 1));
txt(s, [{ text: 'Walk-ins still welcome. ', options: { bold: true } }, { text: 'Customers without internet are served as usual. The owner encodes them in seconds so there is never a double booking between walk-ins and online bookings.' }], { x: 0.6, y: 6.35, w: 12.1, h: 0.75, fontSize: 13, objectName: A(3, 'fade') });
s.addNotes('Walk-ins are still accepted, as stated in our delimitations. The owner encodes them, and the slot is blocked for online customers.');

webSlide('STYLE GALLERY MANAGER', 'The shop controls the gallery', 'Mark styles as trending, hide old ones, add new ones', 'w_styles', [
  ['Trending toggle', 'Moves a style into the Trending tab for customers.'],
  ['Hide or show', 'Retired styles disappear from the app.'],
  ['Usage count', 'See which styles customers book the most.'],
]);
s.addNotes('The owner manages the hairstyle gallery, so trending styles stay updated, which is one of our objectives.');

webSlide('REPORTS', 'Numbers the owner can use', 'Bookings per day, per barber, top styles, and busiest hours', 'w_reports', [
  ['Weekly KPIs', 'Bookings, completion rate, no-show rate.'],
  ['Per day and per barber', 'Helps decide staffing and days off.'],
  ['Busiest hours', 'A heat map for shop hours and promos.'],
  ['Export CSV', 'For records and simple bookkeeping.'],
]);
s.addNotes('Reports help the owner decide on shop hours and staffing. This supports the significance of the study for barbershop owners.');

webSlide('FEEDBACK', 'What customers are saying', 'Ratings and comments after every appointment', 'w_feedback', [
  ['Average rating', 'A big, simple score.'],
  ['Top tags', '"Exactly what I asked" shows the preference feature works.'],
  ['Per-barber reviews', 'Useful for coaching and recognition.'],
]);
s.addNotes('Feedback gives a record of customer satisfaction, which the old notebook system never had.');

// LIVE SYNC
s = pres.addSlide(); s.background = { color: BLUE };
header(s, 'THE WOW MOMENT', 'One booking, two screens, instantly', 'The customer confirms on the phone, and it appears in the shop dashboard right away', true);
phone(s, 'm_confirm', 0.9, 1.95, 5.1, A(1, 'float'));
s.addText('→', { x: 3.65, y: 3.85, w: 1.0, h: 1.0, shape: pres.shapes.OVAL, fill: { color: YEL }, line: border(3), shadow: sh(5), fontFace: F, fontSize: 36, bold: true, color: BLK, align: 'center', valign: 'middle', margin: 0, objectName: A(2, 'zoom'), isTextBox: true });
browser(s, 'w_queue', 4.95, 2.05, 7.8, A(3, 'float'));
badge(s, 'LIVE! NO REFRESH', { x: 10.6, y: 1.65, w: 2.2, fill: GRN, rot: 4, tag: A(4, 'zoom') });
label(s, 'CUSTOMER · PHONE', 1.0, 1.95 + 5.1 + 0.02, 2.2, A(1, 'float'));
label(s, 'OWNER · LAPTOP', 5.2, 2.05 + 7.8 / BR + 0.1, 2.2, A(3, 'float'), BLK);
s.addNotes('This is what we will demo live. When a customer confirms, the booking appears on the owner\'s dashboard right away, and the slot is blocked so no one else can take it.');

// WALL OF SCREENS
s = pres.addSlide(); s.background = { color: ICE };
header(s, 'EVERY SCREEN', '17 mobile screens, 9 web screens', 'A complete, consistent system, customer and shop side');
const wall = ['m_splash', 'm_home', 'm_shop', 'm_gallery', 'm_upload', 'm_barber', 'm_prefs', 'm_sched', 'm_review', 'm_confirm', 'm_notif', 'm_bookings', 'm_cancel', 'm_profile', 'm_rate', 'm_oqueue', 'm_pcard'];
const wh = 2.45, ww = wh * PR, wg = (12.1 - 9 * ww) / 8;
wall.forEach((n, i) => { const r = i < 9 ? 0 : 1, c = r ? i - 9 : i; phone(s, n, 0.6 + c * (ww + wg) + (r ? (ww + wg) / 2 : 0), 1.95 + r * 2.6, wh, A(1, 'zoom', i % 9)); });
s.addNotes('Here are all 17 mobile screens together. They share one design system, so the app feels like one product.');

// CLOSING
s = pres.addSlide(); s.background = { color: BLUE };
phone(s, 'm_confirm', 9.0, 0.7, 6.1, A(3, 'float'), 6);
s.addText([{ text: 'EXCITED?', options: { breakLine: true } }, { text: 'SO ARE WE.', options: { color: BLUE } }], { x: 0.8, y: 1.3, w: 7.4, h: 2.4, shape: RR, rectRadius: 0.14, fill: { color: WHT }, line: border(3.5), shadow: sh(10), fontFace: F, fontSize: 54, bold: true, color: BLK, align: 'left', valign: 'middle', margin: 22, rotate: -2, objectName: A(1, 'zoom'), isTextBox: true });
s.addText([{ text: 'Coming to ' }, { text: '[Partner Barbershop]', options: { highlight: 'FFFF00' } }, { text: ' · 2027' }], { x: 1.3, y: 4.2, w: 6.4, h: 0.8, shape: RR, rectRadius: 0.1, fill: { color: YEL }, line: border(2.5), shadow: sh(5), fontFace: F, fontSize: 18, bold: true, color: BLK, align: 'center', valign: 'middle', margin: 0, rotate: 2, objectName: A(2, 'float'), isTextBox: true });
txt(s, 'Proposed designs only. Final colors, photos, and shop details will follow the interview with the partner barbershop.', { x: 0.8, y: 5.6, w: 7.5, h: 0.8, fontSize: 13, bold: true, color: 'DCE6FF', objectName: A(4, 'fade') });
s.addNotes('Close by reminding the panel that these are proposed designs and will be refined with the partner barbershop.');

pres.writeFile({ fileName: 'Showcase_raw.pptx' }).then(() => console.log('ok'));
