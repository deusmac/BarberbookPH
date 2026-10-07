"use strict";
/* ===== CONFIG ===== */
const CONFIG = {
  partnerShopName: "Kings Cut Barbershop",   // change to your partner shop
  municipality: "Tanza, Cavite",
  demoCustomerName: "Juan Dela Cruz",
  currency: "PHP",
  today: null  // null = use the real date; or "2026-11-10" to freeze the demo date
};

/* ===== ICONS ===== */
const ICONS = {
  home:'<path d="M3 11l9-8 9 8v10H3z"/>', scissors:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 8L21 19M8.5 16L21 5"/>',
  cal:'<rect x="3" y="5" width="18" height="16"/><path d="M3 10h18M8 3v4M16 3v4"/>', user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-5 4-7 8-7s8 2 8 7"/>',
  check:'<path d="M4 12l5 5L20 6"/>', plus:'<path d="M12 4v16M4 12h16"/>', minus:'<path d="M4 12h16"/>', star:'<path d="M12 3l2.8 5.8 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.3l1.1-6.2L3 9.7l6.2-.9z"/>',
  x:'<path d="M5 5l14 14M19 5L5 19"/>', clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', bell:'<path d="M6 17V11a6 6 0 0112 0v6l2 2H4zM10 21h4"/>',
  phone:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>', mail:'<rect x="3" y="5" width="18" height="14"/><path d="M3 6l9 7 9-7"/>',
  upload:'<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>', trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14"/>', chart:'<path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-8"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h1M3 12h1M3 18h1"/>', grid:'<rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/>',
  back:'<path d="M15 5l-7 7 7 7"/>', arrow:'<path d="M4 12h15M13 6l6 6-6 6"/>', play:'<path d="M7 4l13 8-13 8z"/>', reset:'<path d="M4 4v6h6M4 10a8 8 0 112 8"/>',
  store:'<path d="M3 9l2-5h14l2 5M4 9v11h16V9M3 9h18"/>', msg:'<path d="M4 4h16v12H9l-5 4z"/>', edit:'<path d="M4 20l4-1 11-11-3-3L5 16z"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', download:'<path d="M12 4v12M7 11l5 5 5-5M4 20h16"/>',
  pin:'<path d="M12 22s7-7 7-12a7 7 0 00-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>', walk:'<circle cx="12" cy="5" r="2.5"/><path d="M12 8v7l-3 6M12 15l3 6M8 11l4-3 4 3"/>',
  split:'<rect x="3" y="4" width="18" height="16"/><path d="M12 4v16"/>', users:'<circle cx="9" cy="8" r="3.5"/><circle cx="17" cy="9" r="2.5"/><path d="M2 20c0-4 3-6 7-6s7 2 7 6M16 14c3 0 6 1 6 5"/>',
  img:'<rect x="3" y="4" width="18" height="16"/><circle cx="9" cy="10" r="2"/><path d="M3 18l6-5 5 4 3-3 4 4"/>', info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>'
};
const icon = (n, s = 20) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">${ICONS[n] || ""}</svg>`;

/* ===== HELPERS (dates, money, ids) ===== */
const $ = (s, r = document) => r.querySelector(s);
const pad = n => String(n).padStart(2, "0");
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_L = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function nowDate() {
  const d = new Date();
  if (CONFIG.today) { const [y, m, dd] = CONFIG.today.split("-").map(Number); return new Date(y, m - 1, dd, d.getHours(), d.getMinutes()); }
  return d;
}
const dkey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseKey = k => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
const addDays = (k, n) => { const d = parseKey(k); d.setDate(d.getDate() + n); return dkey(d); };
const todayKey = () => dkey(nowDate());
const nowMin = () => { const d = nowDate(); return d.getHours() * 60 + d.getMinutes(); };
const hhmm = s => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
const toHHMM = m => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
const fmtTime = m => { let h = Math.floor(m / 60); const mm = m % 60; const ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12; return `${h}:${pad(mm)} ${ap}`; };
const fmtDate = k => { const d = parseKey(k); return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`; };
const fmtShort = k => { const d = parseKey(k); return `${DAYS[d.getDay()]} ${MONTHS[d.getMonth()]} ${d.getDate()}`; };
const dow = k => parseKey(k).getDay();
const diffDays = (a, b) => Math.round((parseKey(a) - parseKey(b)) / 864e5);
const money = n => `${CONFIG.currency} ${Number(n).toLocaleString("en-PH")}`;
const initials = n => n.split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();
const ACTIVE = s => s !== "cancelled" && s !== "noshow";
const STATUS = { pending: "Pending", confirmed: "Confirmed", inchair: "In chair", done: "Done", cancelled: "Cancelled", noshow: "No-show" };
const COLORS = ["#FFE600", "#22C55E", "#F59E0B", "#FEF08A", "#93C5FD", "#F9A8D4"];
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const hashStr = s => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };

/* ===== SEED DATA ===== */
const SEED_STYLES = [
  { id: "midtaper", name: "Mid Taper Fade", category: "Fades", mins: 40, trending: true },
  { id: "lowfade", name: "Low Fade", category: "Fades", mins: 35, trending: false },
  { id: "highfade", name: "High Skin Fade", category: "Fades", mins: 45, trending: false },
  { id: "twoblock", name: "Two Block", category: "Textured", mins: 40, trending: true },
  { id: "fringe", name: "Textured Fringe", category: "Textured", mins: 40, trending: true },
  { id: "frenchcrop", name: "French Crop", category: "Classic", mins: 30, trending: false },
  { id: "buzz", name: "Buzz Cut", category: "Classic", mins: 20, trending: false },
  { id: "crew", name: "Crew Cut", category: "Classic", mins: 25, trending: false },
  { id: "sidepart", name: "Side Part (Classic)", category: "Classic", mins: 35, trending: false },
  { id: "pompadour", name: "Pompadour", category: "Classic", mins: 45, trending: false },
  { id: "mullet", name: "Mullet (Modern)", category: "Textured", mins: 45, trending: true },
  { id: "kids", name: "Kids' Cut", category: "Kids", mins: 25, trending: false }
].map(s => ({ ...s, hidden: false, art: s.id }));
const NAMES = ["Mark T.", "Aldrin R.", "Josh T.", "Kevin S.", "Carlo M.", "Renz P.", "Migs D.", "Paulo V.", "JM C.", "Rafael B.", "Ian G.", "Dennis L.", "Bryan A.", "Nico F.", "Ericson H."];
const NOTES = ["", "", "", "Medyo manipis sa gilid, ingat po.", "Konting trim lang sa taas.", "May cowlick sa likod.", "Pantay lang po sa sides."];

function baseData() {
  return {
    v: 1,
    shops: [
      { id: "s1", name: CONFIG.partnerShopName, area: "Poblacion, " + CONFIG.municipality, distanceKm: 1.2, rating: 4.8, reviews: 126, hours: "9:00 AM - 7:00 PM", openDays: [0, 1, 2, 3, 4, 5, 6], partner: true },
      { id: "s2", name: "Fadez Manila Barber Lounge", area: "Trece Martires", distanceKm: 3.4, rating: 4.5, reviews: 89, comingSoon: true },
      { id: "s3", name: "The Gentlemen's Chair", area: "Imus", distanceKm: 5.0, rating: 4.4, reviews: 54, comingSoon: true }
    ],
    services: [
      { id: "sv1", name: "Haircut", price: 150, mins: 30 },
      { id: "sv2", name: "Haircut + Beard Trim", price: 220, mins: 45 },
      { id: "sv3", name: "Haircut + Hair Wash", price: 200, mins: 40 },
      { id: "sv4", name: "Kids' Haircut (12 and below)", price: 120, mins: 25 },
      { id: "sv5", name: "Beard Trim Only", price: 100, mins: 15 }
    ],
    barbers: [
      { id: "b1", name: "Kuya Ramil", specialty: "Fades, skin fade", rating: 4.9, years: 8, days: [1, 2, 3, 4, 5, 6], start: "09:00", end: "18:00", breakAt: "12:00" },
      { id: "b2", name: "Jhun", specialty: "Classic, scissor cut", rating: 4.6, years: 5, days: [0, 1, 2, 3, 5, 6], start: "10:00", end: "19:00", breakAt: "13:00" },
      { id: "b3", name: "Paolo", specialty: "Textured, two block, kids", rating: 4.7, years: 3, days: [0, 2, 3, 4, 5, 6], start: "09:00", end: "17:00", breakAt: "12:00" }
    ],
    styles: SEED_STYLES.map(s => ({ ...s })),
    customer: {
      id: "juan", name: CONFIG.demoCustomerName, mobile: "0917 123 4567", email: "juan.delacruz@example.com", favoriteBarber: "b1",
      savedPrefs: { styleId: "midtaper", guard: 2, top: "Keep it long (scissor only)", beard: "Line-up only", extras: ["No hair product"], notes: "Please don't cut the top too short. May cowlick sa likod." }
    },
    bookings: [], feedback: [], counter: 100, dayOff: {}
  };
}
function calcDur(d, serviceId, styleId) {
  const sv = d.services.find(s => s.id === serviceId) || d.services[0];
  const st = d.styles.find(s => s.id === styleId);
  const extra = st && serviceId !== "sv5" ? Math.max(0, st.mins - 30) : 0;
  return Math.ceil((sv.mins + extra) / 5) * 5;
}
function seedState() {
  const d = baseData(), t = todayKey();
  const mk = (o) => {
    const dur = calcDur(d, o.serviceId, o.styleId);
    d.counter++;
    const b = { id: `BB-${o.date.slice(0, 4)}-${String(d.counter).padStart(5, "0")}`, shopId: "s1", cid: null, photo: null, walkin: false, rated: false, created: o.date,
      prefs: { guard: 2, top: "Medium", beard: "None", extras: [], notes: "" }, ...o, dur };
    d.bookings.push(b); return b;
  };
  const busy = (bid, date, s, dur) => d.bookings.some(x => x.barberId === bid && x.date === date && ACTIVE(x.status) && s < x.start + x.dur && s + dur > x.start);
  const worksOn = (b, date) => b.days.includes(dow(date));
  const gen = (date, perBarber, mode) => {
    const r = rng(hashStr(date)), made = [];
    d.barbers.filter(b => worksOn(b, date)).forEach(b => {
      let n = perBarber(r), tries = 0;
      while (n > 0 && tries++ < 60) {
        const s = hhmm(b.start) + Math.floor(r() * ((hhmm(b.end) - hhmm(b.start)) / 30 - 1)) * 30;
        const svId = r() < .12 ? "sv2" : r() < .15 ? "sv3" : r() < .1 ? "sv4" : "sv1";
        const stId = svId === "sv4" ? "kids" : d.styles[Math.floor(r() * 11)].id;
        const dur = calcDur(d, svId, stId), br = hhmm(b.breakAt);
        if (s + dur > hhmm(b.end) || (s < br + 60 && s + dur > br) || busy(b.id, date, s, dur)) continue;
        made.push(mk({ barberId: b.id, date, start: s, serviceId: svId, styleId: stId, name: NAMES[Math.floor(r() * NAMES.length)], status: "confirmed",
          prefs: { guard: Math.floor(r() * 6), top: ["Short", "Medium", "Keep it long (scissor only)"][Math.floor(r() * 3)], beard: svId === "sv2" ? "Full trim" : "None", extras: r() < .3 ? ["Trim eyebrows"] : [], notes: NOTES[Math.floor(r() * NOTES.length)] } }));
        n--;
      }
    });
    made.sort((a, b) => a.start - b.start);
    return made;
  };
  // today
  const td = gen(t, r => 4 + (r() < .5 ? 1 : 0), "today");
  td.forEach((b, i) => { b.status = i < 2 ? "done" : i === 2 ? "inchair" : "confirmed"; });
  if (td[td.length - 1]) { td[td.length - 1].walkin = true; td[td.length - 1].name = "Walk-in guest"; }
  // next 5 days
  for (let i = 1; i <= 5; i++) gen(addDays(t, i), r => 2 + (r() < .6 ? 1 : 0), "future");
  // past 14 days
  const past = [];
  for (let i = 1; i <= 14; i++) past.push(...gen(addDays(t, -i), r => 1 + (r() < .7 ? 1 : 0), "past"));
  past.forEach((b, i) => { b.status = i === 4 || i === 17 ? "noshow" : i === 9 ? "cancelled" : "done"; b.rated = true; });
  // Juan
  const pickB = (date, pref) => (d.barbers.find(b => b.id === pref && worksOn(b, date)) || d.barbers.find(b => worksOn(b, date))).id;
  [[-10, "midtaper"], [-24, "midtaper"], [-38, "lowfade"]].forEach(([off, st], i) => {
    const date = addDays(t, off), bid = pickB(date, "b1"); let s = 600; while (busy(bid, date, s, 40)) s += 30;
    mk({ barberId: bid, date, start: s, serviceId: "sv1", styleId: st, name: d.customer.name, cid: "juan", status: "done", rated: i > 0, prefs: { ...d.customer.savedPrefs, guard: 2, styleId: undefined } });
  });
  const up = addDays(t, 2), ub = pickB(up, "b1"); let us = 780; while (busy(ub, up, us, 40)) us += 30;
  mk({ barberId: ub, date: up, start: us, serviceId: "sv1", styleId: "midtaper", name: d.customer.name, cid: "juan", status: "confirmed", prefs: { ...d.customer.savedPrefs } });
  const fb = (name, bid, stars, tags, comment, off) => d.feedback.push({ id: "f" + d.feedback.length, name, barberId: bid, stars, tags, comment, date: addDays(t, off) });
  fb("Mark T.", "b1", 5, ["Sulit", "Exactly what I asked"], "Solid fade, sulit!", -1);
  fb("Aldrin R.", "b3", 5, ["On time", "Friendly"], "Hindi na ako naghintay, galing.", -2);
  fb("Kevin S.", "b2", 4, ["Clean shop"], "Ayos yung gupit, malinis pa shop.", -3);
  fb("Josh T.", "b1", 5, ["Exactly what I asked"], "Nakuha agad yung gusto ko, lagi akong dito na.", -4);
  fb("Carlo M.", "b3", 4, ["Friendly", "Sulit"], "Mabait si Paolo, sulit ang presyo.", -5);
  fb("Renz P.", "b2", 5, ["On time"], "On time yung slot ko, walang pila.", -6);
  return d;
}

/* ===== STORE ===== */
const KEY = "barberbook-demo-v1";
const PERSIST = ["v", "shops", "services", "barbers", "styles", "customer", "bookings", "feedback", "counter", "dayOff"];
function freshUi() {
  const d = new Date();
  return { role: "c", croute: "home", oroute: "queue", split: false, notice: true, qdate: null, qview: "timeline", otab: "upcoming", btab: "upcoming", cat: "Trending",
    search: "", cal: { y: nowDate().getFullYear(), m: nowDate().getMonth() }, modal: null, drawer: null, tour: null, lastBookingId: null, fresh: false, flash: null, reminder: false,
    walk: { name: "", serviceId: "sv1", styleId: "", barberId: "any", when: "now", time: "" }, range: "week", gcat: "All", _d: d.getTime() };
}
let state = (() => {
  let data = null;
  try { const s = localStorage.getItem(KEY); if (s) data = JSON.parse(s); } catch (e) { data = null; }
  if (!data || data.v !== 1 || !data.bookings) data = seedState();
  return { ...data, ui: freshUi(), draft: null };
})();
const subs = [];
const store = {
  getState: () => state,
  setState(patch) { Object.assign(state, typeof patch === "function" ? patch(state) : patch); persist(); subs.forEach(f => f(state)); },
  subscribe(fn) { subs.push(fn); }
};
function persist() {
  try { const o = {}; PERSIST.forEach(k => o[k] = state[k]); localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { /* storage blocked: stay in memory */ }
}
const commit = () => store.setState({});

/* ===== DOMAIN LOGIC ===== */
const getStyle = id => state.styles.find(s => s.id === id);
const getBarber = id => state.barbers.find(b => b.id === id);
const getService = id => state.services.find(s => s.id === id);
const visibleStyles = () => state.styles.filter(s => !s.hidden);
const durFor = (svId, stId) => calcDur(state, svId, stId);
function barberWorks(b, date) { return b.days.includes(dow(date)) && !(state.dayOff[b.id] && state.dayOff[b.id][date]); }
function isFree(b, date, start, dur, excludeId) {
  if (!b || date < todayKey()) return false;
  if (!barberWorks(b, date)) return false;
  if (start < hhmm(b.start) || start + dur > hhmm(b.end)) return false;
  if (b.breakAt) { const br = hhmm(b.breakAt); if (start < br + 60 && start + dur > br) return false; }
  if (date === todayKey() && start < nowMin()) return false;
  return !state.bookings.some(x => x.barberId === b.id && x.date === date && x.id !== excludeId && ACTIVE(x.status) && start < x.start + x.dur && start + dur > x.start);
}
const pool = sel => sel === "any" || !sel ? state.barbers : state.barbers.filter(b => b.id === sel);
function candidateTimes(date, sel) {
  const set = new Set();
  pool(sel).filter(b => barberWorks(b, date)).forEach(b => { for (let t = hhmm(b.start); t + 30 <= hhmm(b.end); t += 30) set.add(t); });
  return [...set].sort((a, b) => a - b);
}
const freeBarbers = (date, start, dur, sel, excludeId) => pool(sel).filter(b => isFree(b, date, start, dur, excludeId));
const dayHasFree = (date, sel, dur, excludeId) => candidateTimes(date, sel).some(t => freeBarbers(date, t, dur, sel, excludeId).length);
function pickAuto(date, start, dur, excludeId) {
  const fb = freeBarbers(date, start, dur, "any", excludeId);
  const load = b => state.bookings.filter(x => x.barberId === b.id && x.date === date && ACTIVE(x.status)).length;
  return fb.sort((a, b) => load(a) - load(b))[0] || null;
}
function nextFree(b) {
  const t = todayKey();
  for (let i = 0; i < 8; i++) { const d = addDays(t, i); for (const s of candidateTimes(d, b.id)) if (isFree(b, d, s, 30)) return i === 0 ? `${fmtTime(s)} today` : `${fmtShort(d)} ${fmtTime(s)}`; }
  return "No slots this week";
}
const isUpcoming = b => b.cid === "juan" && (b.status === "confirmed" || b.status === "pending" || b.status === "inchair");
const myBookings = () => state.bookings.filter(b => b.cid === "juan");
const upcomingMine = () => myBookings().filter(isUpcoming).sort((a, b) => (a.date + toHHMM(a.start)).localeCompare(b.date + toHHMM(b.start)));
function newBookingNo() { state.counter++; return `BB-${todayKey().slice(0, 4)}-${String(state.counter).padStart(5, "0")}`; }
function avgRating() { const f = state.feedback; return f.length ? f.reduce((a, x) => a + x.stars, 0) / f.length : 0; }
function lastVisit(b) {
  const prev = state.bookings.filter(x => x.status === "done" && x.id !== b.id && ((b.cid && x.cid === b.cid) || (!b.cid && x.name === b.name && x.name !== "Walk-in guest")) && (x.date < b.date || (x.date === b.date && x.start < b.start)))
    .sort((a, c) => (c.date + toHHMM(c.start)).localeCompare(a.date + toHHMM(a.start)))[0];
  return prev || null;
}
