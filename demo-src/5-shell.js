
/* ===== SHELL: render, router, events, tour, init ===== */
const SHELL_CSS = `@media (max-width:1023px){.cwrap{height:100%;min-height:0}.cfooter{display:none}}
.noticecard h3{margin-bottom:2px}`;
const NOTICE = {
  home: ["Customers see nearby shops and book in under a minute.", "Quick rebook reuses the saved haircut preference (Objective 3c).", "Only the partner shop is bookable; the others are COMING SOON."],
  shop: ["Services show sample prices; payment is made at the shop (out of scope: online payment).", "Barbers are previewed before booking (Objective 3b)."],
  styles: ["Haircut preference is the core feature (Objective 3c).", "Trending styles are managed by the shop owner."],
  "book/style": ["Customers pick a style photo or upload their own reference (Objective 3c).", "Skipping is allowed; the barber then asks at the shop."],
  "book/barber": ["Guard number, top length, beard and notes travel with the booking.", "Saved as the customer's usual for one-tap rebooking."],
  "book/schedule": ["Objective 3a: online appointment scheduling.", "Taken slots are blocked automatically, so double booking cannot happen.", "Longer styles need longer free windows."],
  "book/review": ["The review step shows everything the barber will read.", "The slot is re-checked at confirmation."],
  confirm: ["Objective 3d: confirmation and notification (Email and SMS previews only).", "Reminder simulation shows how no-shows are reduced."],
  bookings: ["Objective 3e: appointment history, reschedule and cancel.", "Rating a Done booking feeds the owner's Feedback screen."],
  profile: ["Profile keeps the saved preferences and visit history (Objective 3e).", "Data privacy follows RA 10173."]
};
const OWNER_TITLES = { queue: "Today's queue", walkin: "Walk-in", barbers: "Barbers & hours", gallery: "Style gallery", reports: "Reports", feedback: "Feedback" };
let lastKey = "", routeChanged = false, needScroll = false;
const THEMES = [["clay", "Clay"], ["brutal", "Neo-brutal"]];
function loadTheme() { try { const t = localStorage.getItem("barberbook-theme"); if (t === "brutal" || t === "clay") return t; } catch (e) {} return "clay"; }
function applyTheme() { document.documentElement.setAttribute("data-theme", state.ui.theme || "clay"); }

function demobarHtml() {
  const ui = state.ui, sp = splitOn(), c = ui.role === "c";
  return `<span class="ttl">BarberBook PH · Interactive prototype</span>
  <div class="seg-dark" role="group" aria-label="View"><button data-act="setRole" data-r="c" class="${c || sp ? "on" : ""}">Customer view</button><button data-act="setRole" data-r="o" class="${!c || sp ? "on" : ""}">Owner view</button></div>
  <div class="seg-dark" role="group" aria-label="Theme">${THEMES.map(([k, l]) => `<button data-act="setTheme" data-t="${k}" class="${(ui.theme || "clay") === k ? "on" : ""}">${l}</button>`).join("")}</div>
  ${window.innerWidth >= 1280 ? `<button class="dbtn ${ui.split ? "on" : ""}" data-act="toggleSplit">${icon("split", 15)} Side by side</button>` : ""}
  ${!sp && window.innerWidth >= 1024 ? `<button class="dbtn ${ui.notice ? "on" : ""}" data-act="toggleNotice">What to notice</button>` : ""}
  <button class="dbtn" data-act="tourStart">${icon("play", 14)} Guided tour</button>
  <button class="dbtn" data-act="askReset">${icon("reset", 14)} Reset demo</button>`;
}
function phoneHtml() {
  const ui = state.ui, r = custScreen(ui.croute) || { html: "", title: "", back: null, tab: "" };
  const tabs = [["home", "Home", "home"], ["styles", "Styles", "scissors"], ["bookings", "Bookings", "cal"], ["profile", "Profile", "user"]];
  const t = new Date(nowDate());
  return `<div class="phone-frame"><div class="pstatus"><span>${fmtTime(t.getHours() * 60 + t.getMinutes()).replace(" ", "")}</span><span>PH</span></div>
  <div class="capp"><div class="cbar">${r.back ? `<button class="btn icon sm" data-act="go" data-to="${esc(r.back)}" aria-label="Back">${icon("back", 18)}</button>` : ""}<span class="logo">Barber<b>BOOK</b> PH</span><span class="b up tiny" style="margin-left:auto">${esc(r.title || "")}</span></div>
  <div class="cbody ${routeChanged ? "enter" : ""}" data-keep="cbody">${r.html}</div>
  <nav class="ctabs" aria-label="Customer">${tabs.map(([k, l, i]) => `<button data-act="go" data-to="${k}" class="${r.tab === k ? "on" : ""}">${icon(i, 20)}<span>${l}</span></button>`).join("")}</nav></div></div>`;
}
function noticeHtml() {
  const ui = state.ui; if (!ui.notice) return "";
  const key = ui.croute, items = NOTICE[key] || NOTICE[key.replace(/\/.*/, "")] || NOTICE.home;
  return `<aside class="side card yellow noticecard" aria-label="What to notice"><h3>What to notice</h3><ul>${items.map(i => `<li>${esc(i)}</li>`).join("")}</ul></aside>`;
}
function footerHtml(cls) {
  return `<div class="footer ${cls}">Prototype for the capstone project BarberBook PH: An Online Appointment and Haircut Preference System for Local Barbershops. Sample data only. [School name] · [Year]</div>`;
}
function modalHtml() {
  const m = state.ui.modal; if (!m || !MODALS[m.type]) return "";
  return `<div class="backdrop" data-act="backdrop"><div class="modal" role="dialog" aria-modal="true">${MODALS[m.type](m)}</div></div>`;
}
function render() {
  const ui = state.ui, sp = splitOn(); applyTheme();
  document.body.className = (sp || ui.role === "c" ? "role-c" : "role-o") + (sp ? " split" : "");
  const ae = document.activeElement, fid = ae && ae.id, sel = ae && ae.selectionStart != null ? [ae.selectionStart, ae.selectionEnd] : null;
  const stage = $("#stage"), keep = {}; document.querySelectorAll("[data-keep]").forEach(e => keep[e.dataset.keep] = e.scrollTop);
  const stTop = stage.scrollTop;
  const key = (sp ? "s" : ui.role) + "|" + ui.croute + "|" + ui.oroute;
  routeChanged = key !== lastKey; lastKey = key;
  $("#demobar").innerHTML = demobarHtml();
  let body;
  if (sp) body = `<div class="splitwrap">${phoneHtml()}<div class="opane" data-keep="opane">${ownerView()}</div></div>${footerHtml("cfooter")}`;
  else if (ui.role === "c") body = `<div class="cwrap">${phoneHtml()}${noticeHtml()}</div>${footerHtml("cfooter")}`;
  else body = `${ownerView()}${footerHtml("")}`;
  stage.innerHTML = body + modalHtml();
  if (!routeChanged) { stage.scrollTop = stTop; document.querySelectorAll("[data-keep]").forEach(e => { if (keep[e.dataset.keep] != null) e.scrollTop = keep[e.dataset.keep]; }); }
  else stage.scrollTop = 0;
  if (fid) { const n = document.getElementById(fid); if (n) { n.focus(); if (sel) try { n.setSelectionRange(sel[0], sel[1]); } catch (e) {} } }
  if (ui.fresh && ui.croute === "confirm") setTimeout(() => { ui.fresh = false; }, 1500);
  if (ui.flash && (sp || ui.role === "o")) { const id = ui.flash; setTimeout(() => { if (ui.flash === id) ui.flash = null; }, 1800); }
  requestAnimationFrame(drawTour);
}
store.subscribe(render);

/* ===== ROUTER ===== */
const CROUTES = ["home", "shop", "styles", "bookings", "profile", "book/style", "book/barber", "book/schedule", "book/review", "confirm"];
const OROUTES = Object.keys(OWNER_TITLES);
function parseHash() {
  const h = location.hash.replace(/^#\/?/, ""), parts = h.split("/"), r = parts.shift(), path = parts.join("/");
  if (r === "o") { state.ui.role = "o"; state.ui.oroute = OROUTES.includes(path) ? path : "queue"; }
  else {
    state.ui.role = "c"; state.ui.croute = CROUTES.includes(path) ? path : "home";
    if (state.ui.croute.startsWith("book/") && !state.draft) { startBooking({}); }
  }
}
window.addEventListener("hashchange", () => { parseHash(); render(); });

/* ===== ACTIONS (shell) ===== */
Object.assign(ACTIONS, {
  go(ds) { location.hash = "#/c/" + ds.to; },
  ogo(ds) { state.ui.oroute = ds.to; state.ui.drawer = null; if (!splitOn()) location.hash = "#/o/" + ds.to; else commit(); },
  back() { history.back(); },
  closeModal() { closeModal(); },
  backdrop(ds, ev) { if (ev.target.classList.contains("backdrop")) closeModal(); },
  setRole(ds) { location.hash = ds.r === "c" ? "#/c/" + state.ui.croute : "#/o/" + state.ui.oroute; if (splitOn()) { state.ui.role = ds.r; commit(); } },
  setTheme(ds) { state.ui.theme = ds.t; try { localStorage.setItem("barberbook-theme", ds.t); } catch (e) {} commit(); },
  toggleSplit() { state.ui.split = !state.ui.split; commit(); },
  toggleNotice() { state.ui.notice = !state.ui.notice; commit(); },
  askReset() { openModal({ type: "confirmReset" }); },
  doReset() {
    const split = state.ui.split, ui = freshUi(); ui.split = split; ui.theme = state.ui.theme;
    Object.assign(state, seedState(), { ui, draft: null }); persist(); lastKey = "";
    location.hash = "#/c/home"; parseHash(); render(); toast("Demo reset to the sample data.", "blue");
  },
  tourStart() { state.ui.modal = null; tourGo(0); },
  tourNext() { const i = state.ui.tour.i; if (i >= TOUR.length - 1) tourExit(); else tourGo(i + 1); },
  tourBack() { const i = state.ui.tour.i; if (i > 0) tourGo(i - 1); },
  tourExit() { tourExit(); }
});
MODALS.confirmReset = () => `<h2>Reset demo?</h2><p class="muted" style="margin-bottom:14px">This restores the sample bookings, styles and barbers. Anything you added will be removed.</p>
  <div class="row"><button class="btn secondary grow" data-act="closeModal">Keep my data</button><button class="btn danger grow" data-act="doReset">Reset demo</button></div>`;

/* ===== EVENT DELEGATION ===== */
document.addEventListener("click", e => {
  const t = e.target.closest("[data-act]"); if (!t || t.disabled) return;
  const f = ACTIONS[t.dataset.act]; if (f) f(t.dataset, e);
});
document.addEventListener("input", e => {
  const t = e.target; if (!t.dataset || !t.dataset.in) return;
  setPath(t.dataset.in, t.dataset.num ? Number(t.value) : t.value);
  if (t.dataset.render) commit(); else persist();
});
document.addEventListener("change", e => {
  const t = e.target; if (!t.dataset) return;
  if (t.dataset.file) { const f = ACTIONS[t.dataset.file]; if (f) f(t.dataset, e); return; }
  if (!t.dataset.ch) return;
  let v = t.type === "checkbox" ? t.checked : t.value; if (t.dataset.num) v = Number(v);
  setPath(t.dataset.ch, v); commit();
});
document.addEventListener("keydown", e => {
  const ui = state.ui;
  if (ui.tour) { if (e.key === "ArrowRight") ACTIONS.tourNext(); else if (e.key === "ArrowLeft") ACTIONS.tourBack(); else if (e.key === "Escape") tourExit(); return; }
  if (e.key === "Escape") { if (ui.modal) closeModal(); else if (ui.drawer) { ui.drawer = null; commit(); } }
});
let rz; window.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(render, 120); });
window.addEventListener("storage", e => {
  if (e.key !== KEY || !e.newValue) return;
  try { const d = JSON.parse(e.newValue); PERSIST.forEach(k => { state[k] = d[k]; }); render(); } catch (err) {}
});

/* ===== TOUR ===== */
function tourEnsureDraft() { if (!state.draft) startBooking({}); }
function ensureBooking() {
  const ui = state.ui;
  if (!ui.lastBookingId || !state.bookings.some(b => b.id === ui.lastBookingId)) ui.lastBookingId = quickCreateDemoBooking();
  ui.fresh = true; ui.flash = ui.lastBookingId;
}
function cardTarget() {
  const ui = state.ui, td = todayKey();
  const id = ui.lastBookingId || (state.bookings.find(b => b.date === td && b.status === "inchair") || state.bookings.find(b => b.date === td) || {}).id;
  ui.drawer = id || null;
}
const TOUR = [
  { r: "c/home", sel: "[data-tour=home-hero]", t: "Online booking", x: "Customers book online instead of waiting in line." },
  { r: "c/home", sel: "[data-tour=rebook]", t: "Quick rebook", x: "Saved preferences make repeat bookings one tap." },
  { r: "c/book/style", sel: "[data-tour=style-grid]", t: "Style gallery", x: "Customers show exactly what they want, with trending styles or their own photo.", pre: tourEnsureDraft },
  { r: "c/book/barber", sel: "[data-tour=prefs]", t: "Haircut preferences", x: "Guard number, top length, beard, notes. Saved to the profile.", pre: tourEnsureDraft },
  { r: "c/book/schedule", sel: "[data-tour=slots]", t: "Schedule", x: "Only free slots can be picked. No double booking.", pre: tourEnsureDraft },
  { r: "c/confirm", sel: "[data-tour=ticket]", t: "Confirmation", x: "Instant confirmation with Email and SMS previews and reminders.", pre: ensureBooking },
  { r: "o/queue", sel: "[data-tour=timeline]", t: "Owner queue", x: "The owner sees the day at a glance.", pre: () => { state.ui.drawer = null; } },
  { r: "o/queue", sel: "[data-tour=pcard]", t: "Preference card", x: "The barber reads this before the cut. This is our main feature.", pre: cardTarget },
  { r: "o/reports", sel: "[data-tour=reports]", t: "Reports", x: "Simple reports for staffing and shop hours.", pre: () => { state.ui.drawer = null; } },
  { r: "o/feedback", sel: "[data-tour=feedback]", t: "Feedback", x: "Ratings help measure customer satisfaction.", pre: () => { state.ui.drawer = null; } }
];
function tourGo(i) {
  const s = TOUR[i]; state.ui.tour = { i }; state.ui.modal = null;
  if (s.pre) s.pre();
  if (s.r.startsWith("o/")) { state.ui.role = "o"; state.ui.oroute = s.r.slice(2); } else { state.ui.role = "c"; state.ui.croute = s.r.slice(2); }
  try { history.replaceState(null, "", "#/" + s.r); } catch (e) {}
  needScroll = true; render();
}
function tourExit() { state.ui.tour = null; state.ui.drawer = state.ui.drawer; $("#tour").innerHTML = ""; commit(); }
function drawTour() {
  const box = $("#tour"), t = state.ui.tour; if (!box) return;
  if (!t) { box.innerHTML = ""; return; }
  const s = TOUR[t.i], el = document.querySelector(s.sel);
  if (el && needScroll) { el.scrollIntoView({ block: "center", inline: "nearest" }); needScroll = false; }
  const r = el ? el.getBoundingClientRect() : null, vw = innerWidth, vh = innerHeight, cw = Math.min(340, vw - 20);
  let hole = "", top = vh / 2 - 90, left = (vw - cw) / 2;
  if (r && r.width) {
    const p = 6, hl = Math.max(4, r.left - p), ht = Math.max(4, r.top - p), hw = Math.min(vw - 8, r.width + 2 * p), hh = Math.min(vh - 8, r.height + 2 * p);
    hole = `<div class="hole" style="left:${hl}px;top:${ht}px;width:${hw}px;height:${hh}px"></div>`;
    top = ht + hh + 12; if (top + 190 > vh) top = Math.max(8, ht - 200);
    left = Math.min(Math.max(10, hl), vw - cw - 10);
  } else hole = `<div class="hole" style="left:50%;top:50%;width:0;height:0"></div>`;
  box.innerHTML = `${hole}<div class="tc" role="dialog" aria-label="Guided tour" style="top:${top}px;left:${left}px;width:${cw}px">
    <div class="tiny b up muted">Step ${t.i + 1} of ${TOUR.length}</div><h3>${esc(s.t)}</h3><p>${esc(s.x)}</p>
    <div class="tdots">${TOUR.map((_, k) => `<i class="${k <= t.i ? "on" : ""}"></i>`).join("")}</div>
    <div class="row"><button class="btn secondary sm" data-act="tourBack" ${t.i === 0 ? "disabled" : ""}>Back</button><button class="btn sm grow" data-act="tourNext">${t.i === TOUR.length - 1 ? "Finish" : "Next"}</button><button class="btn secondary sm" data-act="tourExit">Exit</button></div></div>`;
}
window.addEventListener("scroll", () => requestAnimationFrame(drawTour), true);

/* ===== INIT ===== */
(function init() {
  const st = document.createElement("style");
  st.textContent = SHELL_CSS + (typeof EXTRA_CSS_A !== "undefined" ? EXTRA_CSS_A : "") + (typeof EXTRA_CSS_B !== "undefined" ? EXTRA_CSS_B : "");
  document.head.appendChild(st);
  state.ui.theme = loadTheme(); applyTheme();
  parseHash(); render();
  setInterval(() => { if (!state.ui.modal && !document.activeElement.matches("input,textarea,select")) render(); }, 60000);
})();
