/* ===== CUSTOMER SIDE: hairstyle art, screens C1-C10, booking flow, customer actions and modals ===== */
const EXTRA_CSS_A = `
.starbtn{width:52px;height:52px;border:2.5px solid #000;border-radius:10px;background:#fff;box-shadow:var(--sh-sm);display:grid;place-items:center;transition:transform 120ms,box-shadow 120ms}
.starbtn:hover{transform:translate(-2px,-2px);box-shadow:var(--sh-md)}
.starbtn:active{transform:translate(2px,2px);box-shadow:none}
.starbtn.on{background:var(--yellow)}
.starbtn.on svg{fill:#000}
.cu-thumb-row{display:flex;gap:12px;align-items:flex-start}
.cu-photo{width:100%;max-height:220px;object-fit:cover;border:2px solid #000;border-radius:8px;margin-top:8px;display:block}
`;

/* ===== HAIRSTYLE ART (flat icons, reference only) ===== */
const ART_DEFS = {
  midtaper: { top: "M46 60 C38 24 122 24 114 60 C106 48 54 48 46 60 Z", sides: ["M46 60 L46 90 L55 90 L55 54 Z", "M114 60 L114 90 L105 90 L105 54 Z"] },
  lowfade: { top: "M46 54 C40 22 120 22 114 54 C108 44 52 44 46 54 Z", sides: ["M46 54 L46 104 L56 104 L56 48 Z", "M114 54 L114 104 L104 104 L104 48 Z"] },
  highfade: { top: "M56 26 C60 12 100 12 104 26 L106 40 C92 34 68 34 54 40 Z", sides: ["M46 58 L46 22 L58 22 L56 58 Z", "M114 58 L114 22 L102 22 L104 58 Z"] },
  twoblock: { top: "M46 46 L46 30 C46 18 114 18 114 30 L114 46 C100 40 60 40 46 46 Z", sides: ["M46 46 L46 74 L54 74 L54 46 Z", "M114 46 L114 74 L106 74 L106 46 Z"] },
  fringe: { top: "M46 60 C40 24 120 24 114 60 L110 46 L100 56 L92 42 L82 54 L72 42 L62 56 L52 44 Z" },
  frenchcrop: { top: "M48 50 C46 30 114 30 112 50 C104 42 90 46 84 40 C76 46 60 42 48 50 Z" },
  buzz: { top: "M47 50 C45 36 115 36 113 50 C100 44 60 44 47 50 Z", fill: "#4B5563" },
  crew: { top: "M46 56 L46 36 C46 28 114 28 114 36 L114 56 C104 48 56 48 46 56 Z", fill: "#1F2937" },
  sidepart: { top: "M46 56 C42 26 122 22 114 56 C108 40 92 34 78 36 C66 38 56 42 46 56 Z", part: "M70 36 L62 50" },
  pompadour: { top: "M44 56 C30 18 60 2 80 4 C104 2 130 18 116 56 C106 40 54 40 44 56 Z" },
  mullet: { back: ["M42 50 L32 124 L48 128 L52 60 Z", "M118 50 L128 124 L112 128 L108 60 Z"], top: "M47 52 C46 30 114 30 113 52 C100 44 60 44 47 52 Z" },
  kids: { top: "M46 62 C40 24 120 24 114 62 L114 50 C104 38 56 38 46 50 Z", small: true },
  generic: { top: "M48 56 C46 32 114 32 112 56 C104 46 56 46 48 56 Z" }
};
function styleArt(styleId) {
  const def = ART_DEFS[styleId] || ART_DEFS.generic;
  const st = getStyle(styleId);
  const label = st ? st.name : "Hairstyle";
  const shape = (d, f) => `<path d="${d}" fill="${f}" stroke="#000" stroke-width="3" stroke-linejoin="round"/>`;
  const back = (def.back || []).map(d => shape(d, "#111")).join("");
  const sides = (def.sides || []).map(d => shape(d, "#6B7280")).join("");
  const part = def.part ? `<path d="${def.part}" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>` : "";
  const figure = shape("M20 160 C20 128 46 116 80 116 C114 116 140 128 140 160 Z", "#fff") +
    `<rect x="68" y="102" width="24" height="20" fill="#F5D0B0" stroke="#000" stroke-width="3"/>` +
    `<ellipse cx="48" cy="78" rx="6" ry="9" fill="#F5D0B0" stroke="#000" stroke-width="3"/>` +
    `<ellipse cx="112" cy="78" rx="6" ry="9" fill="#F5D0B0" stroke="#000" stroke-width="3"/>` +
    `<ellipse cx="80" cy="72" rx="32" ry="38" fill="#F5D0B0" stroke="#000" stroke-width="3"/>` +
    sides + shape(def.top, def.fill || "#111") + part +
    `<circle cx="68" cy="74" r="2.8" fill="#000"/><circle cx="92" cy="74" r="2.8" fill="#000"/>` +
    `<path d="M70 91 Q80 98 90 91" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round"/>`;
  const inner = def.small ? `<g transform="translate(16 20) scale(0.8)">${figure}</g>` : figure;
  return `<svg viewBox="0 0 160 160" width="160" height="160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(label)} reference image"><rect width="160" height="160" fill="#E2F1F8"/>${back}${inner}</svg>`;
}
function styleThumb(styleId, size) {
  const sz = size ? ` style="width:${size}px;max-width:100%"` : "";
  return `<div class="art"${sz}>${styleArt(styleId)}</div>`;
}

/* ===== SHARED UI PIECES ===== */
function stepbar(cur) {
  const labels = ["Style", "Barber", "Schedule", "Review"];
  return '<div class="stepbar" role="list" aria-label="Booking steps">' + labels.map((l, i) => {
    const n = i + 1, cls = n < cur ? "done" : n === cur ? "cur" : "";
    return `<div class="st ${cls}" role="listitem"><span class="dot">${n < cur ? icon("check", 16) : n}</span>${l}</div>` + (n < 4 ? '<span class="ln"></span>' : "");
  }).join("") + "</div>";
}
const CAT_LIST = ["Trending", "Fades", "Classic", "Textured", "Kids", "All"];
const TOP_OPTS = ["Short", "Medium", "Keep it long (scissor only)"];
const BEARD_OPTS = ["None", "Line-up only", "Full trim"];
const EXTRA_OPTS = ["Trim eyebrows", "No hair product", "Hair wash", "Hard part"];
const RATE_TAGS = ["Sulit", "On time", "Exactly what I asked", "Friendly", "Clean shop"];
const CANCEL_REASONS = ["Schedule conflict", "Feeling sick", "Found another time", "Other"];

function catChips() {
  return `<div class="row wrap" role="group" aria-label="Style categories">` +
    CAT_LIST.map(c => `<button class="chip ${state.ui.cat === c ? "on" : ""}" data-act="setCat" data-v="${c}">${c}</button>`).join("") + "</div>";
}
function catStyles() {
  const c = state.ui.cat;
  return visibleStyles().filter(s => c === "All" ? true : c === "Trending" ? s.trending : s.category === c);
}
function styleGrid(ctx, selId) {
  const list = catStyles();
  if (!list.length) {
    return `<div class="empty">${icon("img", 40)}<p class="muted">No styles in this category yet.</p><button class="btn secondary sm" data-act="setCat" data-v="All">SHOW ALL STYLES</button></div>`;
  }
  return `<div class="styles-grid stag">` + list.map(s => {
    const sel = selId === s.id;
    return `<button class="scard ${sel ? "sel" : ""}" data-act="pickStyle" data-id="${esc(s.id)}" data-ctx="${ctx}" aria-pressed="${sel ? "true" : "false"}">` +
      (s.trending ? '<span class="badge y bd">TRENDING</span>' : "") +
      (sel ? `<span class="chk">${icon("check", 16)}</span>` : "") +
      styleThumb(s.id) +
      `<div class="b up">${esc(s.name)}</div><div class="tiny muted">${s.mins} min · Reference image</div></button>`;
  }).join("") + "</div>";
}
function avatarHtml(b) {
  const i = Math.max(0, state.barbers.indexOf(b));
  return `<span class="avatar" style="background:${COLORS[i % COLORS.length]}">${esc(initials(b.name))}</span>`;
}
function emptyBox(msg, label, route) {
  return `<div class="empty">${icon("info", 40)}<p class="muted">${msg}</p><button class="btn sm" data-act="go" data-to="${route}">${label}</button></div>`;
}
const partnerShop = () => state.shops.find(s => s.partner) || state.shops[0];
function shopOpen() {
  const sh = partnerShop(), m = nowMin();
  return m >= 540 && m < 1140 && sh.openDays.includes(dow(todayKey()));   // 9:00 AM to 7:00 PM
}
const bookingById = id => state.bookings.find(x => x.id === id);
const sortAt = (a, b) => (a.date + toHHMM(a.start)).localeCompare(b.date + toHHMM(b.start));
function bookingsFor(tab) {
  const today = todayKey(), all = myBookings();
  if (tab === "cancelled") return all.filter(b => b.status === "cancelled").sort((a, b) => sortAt(b, a));
  if (tab === "past") return all.filter(b => b.status === "done" || b.status === "noshow" || (isUpcoming(b) && b.date < today)).sort((a, b) => sortAt(b, a));
  return all.filter(b => isUpcoming(b) && b.date >= today).sort(sortAt);
}
function prefsFrom(p) {
  p = p || {};
  return { guard: Number(p.guard) || 0, top: p.top || TOP_OPTS[1], beard: p.beard || BEARD_OPTS[0], extras: [...(p.extras || [])], notes: p.notes || "" };
}
function isUsual() {
  const d = state.draft, sp = state.customer.savedPrefs;
  if (!d) return false;
  const p = d.prefs;
  return p.guard === sp.guard && p.top === sp.top && p.beard === sp.beard &&
    (p.extras || []).join("|") === (sp.extras || []).join("|") && (p.notes || "") === (sp.notes || "");
}
function prefsForm(p, t) {
  const notesPath = t === "modal" ? "ui.modal.prefs.notes" : "draft.prefs.notes";
  const seg = (opts, cur, act) => `<div class="segmented">` + opts.map(o =>
    `<button class="${cur === o ? "on" : ""}" data-act="${act}" data-t="${t}" data-v="${esc(o)}">${esc(o)}</button>`).join("") + "</div>";
  return `<div class="col">
    <div><div class="tiny b up">Guard number on the sides</div>
      <div class="row sp" style="margin-top:6px"><div class="stepper"><button data-act="guardMinus" data-t="${t}" aria-label="Lower guard">${icon("minus", 18)}</button><span class="val">${p.guard}</span><button data-act="guardPlus" data-t="${t}" aria-label="Raise guard">${icon("plus", 18)}</button></div><span class="tiny muted">0 = skin, 8 = long</span></div></div>
    <div><div class="tiny b up">Length on top</div><div style="margin-top:6px">${seg(TOP_OPTS, p.top, "setTop")}</div></div>
    <div><div class="tiny b up">Beard</div><div style="margin-top:6px">${seg(BEARD_OPTS, p.beard, "setBeard")}</div></div>
    <div><div class="tiny b up">Extras</div><div class="row wrap" style="margin-top:6px">` +
    EXTRA_OPTS.map(x => `<button class="chip ${p.extras.includes(x) ? "on" : ""}" data-act="toggleExtra" data-t="${t}" data-v="${esc(x)}">${esc(x)}</button>`).join("") + `</div></div>
    <div><div class="tiny b up">Notes to barber</div>
      <textarea class="textarea" maxlength="200" data-in="${notesPath}" placeholder="Tell the barber what to watch out for">${esc(p.notes)}</textarea>
      <div class="tiny muted" style="text-align:right">${(p.notes || "").length}/200</div></div>
  </div>`;
}
function prefsOf(ds) { return ds.t === "modal" ? state.ui.modal.prefs : ensureDraft().prefs; }
function photoBlock(d) {
  if (d.photo) {
    return `<section class="card"><div class="tiny b up">Your reference photo (sent to the barber)</div>` +
      `<img class="cu-photo" src="${d.photo}" alt="Reference photo you uploaded">` +
      `<div class="row" style="margin-top:10px"><button class="btn secondary sm" data-act="clearPhoto">REMOVE PHOTO</button></div></section>`;
  }
  return `<label class="btn secondary block" style="cursor:pointer">${icon("upload", 18)} UPLOAD MY OWN PHOTO` +
    `<input type="file" accept="image/*" data-file="photoPicked" style="display:none"></label>`;
}
function readPhoto(file, cb) {
  const fr = new FileReader();
  fr.onload = () => {
    const img = new Image();
    img.onload = () => {
      try {
        const sc = Math.min(1, 640 / Math.max(img.width, img.height));
        const cv = document.createElement("canvas");
        cv.width = Math.round(img.width * sc); cv.height = Math.round(img.height * sc);
        cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        cb(cv.toDataURL("image/jpeg", 0.85));
      } catch (e) { cb(fr.result); }
    };
    img.onerror = () => cb(fr.result);
    img.src = fr.result;
  };
  fr.readAsDataURL(file);
}
function confettiHtml() {
  let h = '<div class="confetti" aria-hidden="true">';
  for (let i = 0; i < 20; i++) {
    const r = rng(i * 17 + 5);
    const x = Math.round(r() * 280 - 140), y = Math.round(r() * 220 - 150), rot = Math.round(r() * 720 - 360), delay = Math.round(r() * 120);
    h += `<i style="--x:${x}px;--y:${y}px;--r:${rot}deg;background:${["#FFE600", "#1E50FF", "#000000"][i % 3]};animation-delay:${delay}ms"></i>`;
  }
  return h + "</div>";
}
function downloadIcs(b) {
  const z = n => String(n).padStart(2, "0");
  const stamp = (k, m) => k.replace(/-/g, "") + "T" + z(Math.floor(m / 60)) + z(m % 60) + "00";
  const now = new Date();
  const dtstamp = `${now.getUTCFullYear()}${z(now.getUTCMonth() + 1)}${z(now.getUTCDate())}T${z(now.getUTCHours())}${z(now.getUTCMinutes())}${z(now.getUTCSeconds())}Z`;
  const ics = s => String(s).replace(/\\/g, "\\\\").replace(/[,;]/g, m => "\\" + m).replace(/\n/g, "\\n");
  const bar = getBarber(b.barberId), st = getStyle(b.styleId), sh = partnerShop();
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//BarberBook PH Demo//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "BEGIN:VEVENT",
    `UID:${b.id}@barberbook-demo`, `DTSTAMP:${dtstamp}`, `DTSTART:${stamp(b.date, b.start)}`, `DTEND:${stamp(b.date, b.start + b.dur)}`,
    `SUMMARY:${ics("Haircut at " + sh.name)}`, `LOCATION:${ics(sh.area)}`,
    `DESCRIPTION:${ics((st ? st.name : "Haircut") + " with " + (bar ? bar.name : "your barber") + ". Ref " + b.id + ". Pay at the shop.")}`,
    "END:VEVENT", "END:VCALENDAR"];
  const url = URL.createObjectURL(new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = `${b.id}.ics`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/* ===== DRAFT + BOOKING FLOW ===== */
function newDraft(opts = {}) {
  const c = state.customer;
  return { shopId: "s1", serviceId: opts.serviceId || "sv1", styleId: opts.styleId || "", skipped: false, photo: null,
    barberId: opts.barberId || c.favoriteBarber || "any", prefs: prefsFrom(c.savedPrefs), usual: true, saveUsual: true,
    date: "", start: null, assigned: null, rescheduleId: null, step: 1 };
}
function ensureDraft() { if (!state.draft) state.draft = newDraft(); return state.draft; }
function startBooking(opts = {}) {
  const prev = state.draft;
  if (opts.rescheduleBooking) {
    const b = opts.rescheduleBooking;
    state.draft = { shopId: "s1", serviceId: b.serviceId, styleId: b.styleId || "", skipped: !b.styleId, photo: b.photo || null,
      barberId: b.barberId, prefs: prefsFrom(b.prefs), usual: false, saveUsual: true, date: b.date, start: b.start,
      assigned: b.barberId, rescheduleId: b.id, step: 3 };
  } else {
    state.draft = newDraft({ styleId: opts.styleId, barberId: opts.barberId,
      serviceId: prev && !prev.rescheduleId ? prev.serviceId : "sv1" });
  }
  commit();
  go(opts.jumpTo || (opts.rescheduleBooking ? "book/schedule" : "book/style"));
}
function firstAvailable(sel, dur, rid) {
  const t = todayKey();
  for (let i = 0; i <= 60; i++) { const k = addDays(t, i); if (dayHasFree(k, sel, dur, rid)) return k; }
  return null;
}
function confirmBooking() {
  const d = state.draft;
  if (!d || !d.date || d.start == null) { toast("Pick a date and time first.", "amber"); return go("book/schedule"); }
  const dur = durFor(d.serviceId, d.styleId);
  const fixed = d.barberId === "any" ? null : getBarber(d.barberId);
  const b = d.barberId === "any" ? pickAuto(d.date, d.start, dur, d.rescheduleId)
    : (fixed && isFree(fixed, d.date, d.start, dur, d.rescheduleId) ? fixed : null);
  if (!b) { d.start = null; openModal({ type: "taken" }); return go("book/schedule"); }
  const st = getStyle(d.styleId);
  const fields = { barberId: b.id, serviceId: d.serviceId, styleId: d.styleId || "", photo: d.photo || null,
    prefs: prefsFrom(d.prefs), date: d.date, start: d.start, dur, status: "confirmed" };
  const old = d.rescheduleId ? bookingById(d.rescheduleId) : null;
  let bk;
  if (old) {
    Object.assign(old, fields); bk = old;
    toast(`Rescheduled: ${bk.id} now ${fmtShort(d.date)}, ${fmtTime(d.start)} with ${b.name}`, "blue");
  } else {
    bk = { id: newBookingNo(), shopId: "s1", cid: state.customer.id, name: state.customer.name, walkin: false, rated: false, created: todayKey(), ...fields };
    state.bookings.push(bk);
    toast(`New booking: ${state.customer.name} · ${st ? st.name : "No style selected"} · ${fmtTime(d.start)} · ${b.name}`, "blue");
  }
  if (d.saveUsual) {
    const sp = state.customer.savedPrefs;
    state.customer.savedPrefs = { ...prefsFrom(d.prefs), styleId: d.styleId || sp.styleId };
  }
  d.assigned = b.id;
  state.ui.lastBookingId = bk.id; state.ui.flash = bk.id; state.ui.reminder = false; state.ui.fresh = true;
  commit();
  go("confirm");
}
function quickCreateDemoBooking() {
  const last = state.bookings.find(x => x.id === state.ui.lastBookingId && isUpcoming(x));
  if (last) return last.id;
  const sp = state.customer.savedPrefs, dur = durFor("sv1", sp.styleId), t = todayKey();
  for (let i = 1; i <= 14; i++) {
    const date = addDays(t, i);
    for (const s of candidateTimes(date, "any")) {
      const b = pickAuto(date, s, dur, null);
      if (!b) continue;
      const bk = { id: newBookingNo(), shopId: "s1", cid: state.customer.id, name: state.customer.name, barberId: b.id,
        serviceId: "sv1", styleId: sp.styleId || "", photo: null, prefs: prefsFrom(sp), date, start: s, dur,
        status: "confirmed", walkin: false, rated: false, created: t };
      state.bookings.push(bk);
      state.ui.lastBookingId = bk.id; state.ui.flash = bk.id;
      persist();
      return bk.id;
    }
  }
  return null;
}

/* ===== SCHEDULE HELPERS ===== */
function calOf(k) { const [y, m] = k.split("-").map(Number); return { y, m: m - 1 }; }
function slotList(date, sel, dur, rid) {
  const bs = pool(sel).filter(b => barberWorks(b, date));
  const today = todayKey();
  const fits = t => bs.some(b => t >= hhmm(b.start) && t + dur <= hhmm(b.end) &&
    !(b.breakAt && t < hhmm(b.breakAt) + 60 && t + dur > hhmm(b.breakAt)));
  return candidateTimes(date, sel).filter(fits).map(t => ({
    t, free: freeBarbers(date, t, dur, sel, rid).length > 0, past: date === today && t < nowMin()
  }));
}
function calHtml(sel, dur, rid) {
  const c = state.ui.cal, d = state.draft, today = todayKey();
  const days = new Date(c.y, c.m + 1, 0).getDate();
  const lead = new Date(c.y, c.m, 1).getDay();
  let h = '<div class="cal">' + DAYS.map(x => `<div class="dh">${x}</div>`).join("");
  for (let i = 0; i < lead; i++) h += "<span></span>";
  for (let n = 1; n <= days; n++) {
    const k = `${c.y}-${pad(c.m + 1)}-${pad(n)}`;
    const off = !pool(sel).some(b => barberWorks(b, k));
    const dis = k < today || off;
    const full = !dis && !dayHasFree(k, sel, dur, rid);
    const cls = [d.date === k ? "on" : "", k === today ? "today" : ""].join(" ").trim();
    h += `<button class="${cls}" data-act="pickDate" data-d="${k}" ${dis ? "disabled" : ""} aria-label="${k}">${n}${full ? '<span class="full">FULL</span>' : ""}</button>`;
  }
  return h + "</div>";
}

/* ===== SCREENS ===== */
function homeHtml() {
  const nxt = bookingsFor("upcoming")[0];
  let nextCard = "";
  if (nxt) {
    const bar = getBarber(nxt.barberId), st = getStyle(nxt.styleId);
    const n = diffDays(nxt.date, todayKey());
    const when = n <= 0 ? "today" : n === 1 ? "tomorrow" : `in ${n} days`;
    nextCard = `<section class="card yellow" aria-label="Your next cut">
      <div class="row sp"><span class="badge">Your next cut</span><span class="tiny b up">${when}</span></div>
      <div class="b up" style="font-size:20px;margin-top:8px">${fmtDate(nxt.date)}</div>
      <div class="b">${fmtTime(nxt.start)}</div>
      <div class="small">${esc(st ? st.name : "No style selected")} with ${esc(bar ? bar.name : "any barber")}</div>
      <div class="row wrap" style="margin-top:10px"><button class="btn secondary sm" data-act="go" data-to="bookings">VIEW</button><button class="btn secondary sm" data-act="resched" data-id="${esc(nxt.id)}">RESCHEDULE</button></div>
    </section>`;
  }
  const sp = state.customer.savedPrefs, usualSt = getStyle(sp.styleId), fav = getBarber(state.customer.favoriteBarber);
  const quick = `<section class="card soft" data-tour="rebook">
    <div class="tiny b up">Quick rebook</div>
    <p class="b up" style="font-size:18px;margin:6px 0 10px">Book YOUR USUAL: ${esc(usualSt ? usualSt.name : "Haircut")} with ${esc(fav ? fav.name : "any barber")}</p>
    <button class="btn block" data-act="quick">BOOK NOW →</button></section>`;
  const q = state.ui.search.trim().toLowerCase();
  const shops = state.shops.filter(s => !q || s.name.toLowerCase().includes(q) || s.area.toLowerCase().includes(q));
  const shopCard = s => {
    if (s.comingSoon) {
      return `<div class="card" aria-disabled="true" style="opacity:.75">
        <div class="row sp"><div class="b up">${esc(s.name)}</div><span class="badge r">COMING SOON</span></div>
        <div class="small muted" style="margin-top:4px">${esc(s.area)}</div>
        <div class="row small" style="margin-top:6px">${icon("star", 14)} ${s.rating} (${s.reviews} reviews)</div></div>`;
    }
    return `<button class="card hover" data-act="go" data-to="shop">
      <div class="row sp"><div class="b up" style="font-size:18px">${esc(s.name)}</div>${shopOpen() ? '<span class="badge g">OPEN NOW</span>' : '<span class="badge">CLOSED NOW</span>'}</div>
      <div class="small muted" style="margin-top:4px">${esc(s.area)} · ${s.distanceKm} km away</div>
      <div class="row small" style="margin-top:6px">${icon("star", 14)} <b>${s.rating}</b> (${s.reviews} reviews) · ${esc(s.hours || "")}</div>
      <div class="tiny b up" style="margin-top:8px">Bookable now</div></button>`;
  };
  const list = shops.length ? shops.map(shopCard).join("") :
    `<div class="empty">${icon("store", 40)}<p class="muted">No shops match "${esc(state.ui.search)}".</p><button class="btn secondary sm" data-act="clearSearch">CLEAR SEARCH</button></div>`;
  return `<section class="hero" data-tour="home-hero">
      <h1>BOOK YOUR NEXT HAIRCUT IN UNDER A MINUTE.</h1>
      <input class="input" id="shopSearch" type="search" placeholder="Search shops by name or area" value="${esc(state.ui.search)}" data-in="ui.search" data-render="1" aria-label="Search shops">
    </section>
    ${nextCard}
    ${quick}
    <div class="b up">Shops near ${esc(CONFIG.municipality)}</div>
    <div class="col stag">${list}</div>`;
}
function shopHtml() {
  const sh = partnerShop(), d = state.draft, curSv = (d && d.serviceId) || "sv1";
  const svs = state.services.map(sv => `<button class="bcard ${curSv === sv.id ? "sel" : ""}" data-act="pickService" data-id="${esc(sv.id)}">
      <div class="grow"><div class="b up">${esc(sv.name)}</div><div class="small muted">About ${sv.mins} min</div></div>
      <div class="b">${money(sv.price)}</div></button>`).join("");
  const bars = state.barbers.map(b => `<div class="card" style="min-width:170px;flex:none">${avatarHtml(b)}
      <div class="b up" style="margin-top:8px">${esc(b.name)}</div><div class="tiny muted">${esc(b.specialty)}</div>
      <div class="small row">${icon("star", 14)} ${b.rating.toFixed(1)}</div>
      <div class="tiny">Next free: ${esc(nextFree(b))}</div></div>`).join("");
  return `<section class="card">
      <div class="row sp"><div class="b up" style="font-size:22px">${esc(sh.name)}</div>${shopOpen() ? '<span class="badge g">OPEN NOW</span>' : ""}</div>
      <div class="small" style="margin-top:6px">${esc(sh.area)}</div>
      <div class="small">Hours: ${esc(sh.hours)}</div>
      <div class="row small" style="margin-top:4px">${icon("star", 14)} <b>${sh.rating}</b> (${sh.reviews} reviews)</div>
    </section>
    <h3 class="up">Services</h3>
    <div class="col stag">${svs}</div>
    <p class="tiny muted">Sample prices. Final prices come from the partner shop.</p>
    <h3 class="up">Barbers</h3>
    <div class="row scroll-x" style="gap:10px;overflow-x:auto">${bars}</div>
    <div class="notice">PAY AT THE SHOP. The system only reserves your slot.</div>
    <button class="btn block" data-act="startBook">BOOK AN APPOINTMENT →</button>`;
}
function stylesHtml() {
  return `<h2 class="up">Style gallery</h2>
    <p class="small muted">Tap a style to start a booking with it. All images are reference images.</p>
    ${catChips()}
    ${styleGrid("gallery", null)}`;
}
function styleStepHtml() {
  const d = ensureDraft(); d.step = 1;
  return stepbar(1) + `<div class="col">
    <div class="small muted">Pick the cut you want. Images are references, and your barber confirms the cut in the chair.</div>
    ${catChips()}
    <div data-tour="style-grid">${styleGrid("book", d.styleId)}</div>
    ${photoBlock(d)}
    <button class="btn secondary block" data-act="skipStyle">SKIP, I'LL DECIDE AT THE SHOP</button>
    <button class="btn block" data-act="toStep" data-to="book/barber">CONTINUE →</button>
  </div>`;
}
function barberHtml() {
  const d = ensureDraft(); d.step = 2; d.usual = isUsual();
  const any = `<button class="bcard ${d.barberId === "any" ? "sel" : ""}" data-act="pickBarber" data-id="any">
      <span class="avatar" style="background:#000;color:var(--yellow)">ANY</span>
      <div class="grow"><div class="b up">Any available barber</div><div class="small muted">Fastest schedule. We assign the barber for you.</div></div></button>`;
  const cards = state.barbers.map(b => `<button class="bcard ${d.barberId === b.id ? "sel" : ""}" data-act="pickBarber" data-id="${esc(b.id)}">
      ${avatarHtml(b)}
      <div class="grow"><div class="b up">${esc(b.name)}</div><div class="small muted">${esc(b.specialty)}</div>
      <div class="small row">${icon("star", 14)} ${b.rating.toFixed(1)} · Next free: ${esc(nextFree(b))}</div></div></button>`).join("");
  return stepbar(2) + `<div class="col">
    <div class="col stag">${any}${cards}</div>
    <section class="card" data-tour="prefs">
      <div class="row sp"><div class="b up">Haircut preferences</div>${d.usual ? '<span class="badge g">YOUR USUAL</span>' : ""}</div>
      <div style="margin-top:12px">${prefsForm(d.prefs, "draft")}</div>
      <label class="row" style="margin-top:12px;gap:8px"><input type="checkbox" data-ch="draft.saveUsual" ${d.saveUsual ? "checked" : ""}> <span class="small b">Save as my usual</span></label>
    </section>
    <button class="btn block" data-act="toStep" data-to="book/schedule">CONTINUE →</button>
  </div>`;
}
function scheduleHtml() {
  const d = ensureDraft(); d.step = 3;
  const sel = d.barberId, dur = durFor(d.serviceId, d.styleId), rid = d.rescheduleId, today = todayKey();
  if (!d.date || d.date < today) {
    const k = firstAvailable(sel, dur, rid);
    if (k) { d.date = k; state.ui.cal = calOf(k); }
  }
  if (d.start != null && (!d.date || !freeBarbers(d.date, d.start, dur, sel, rid).length)) d.start = null;
  if (sel === "any" && d.start != null) { const a = pickAuto(d.date, d.start, dur, rid); d.assigned = a ? a.id : null; }
  else d.assigned = sel === "any" ? null : sel;

  const c = state.ui.cal, base = nowDate();
  const bIdx = base.getFullYear() * 12 + base.getMonth(), cIdx = c.y * 12 + c.m;
  const slots = d.date ? slotList(d.date, sel, dur, rid) : [];
  const slotHtml = slots.length ? slots.map(s => s.free
    ? `<button class="slot ${d.start === s.t ? "on" : ""}" data-act="pickSlot" data-m="${s.t}">${fmtTime(s.t)}</button>`
    : `<button class="slot taken" disabled>${fmtTime(s.t)}<small>${s.past ? "Past" : "Taken"}</small></button>`).join("")
    : `<p class="muted" style="grid-column:1/-1">No openings on this day. Pick another date above.</p>`;
  const assigned = sel === "any" && d.start != null && d.assigned ? getBarber(d.assigned) : null;
  const barLabel = sel === "any" ? "any available barber" : esc(getBarber(sel).name);
  return stepbar(3) + `<div class="col">
    <div class="notice">Duration: ${dur} min (service plus haircut). Barber: ${barLabel}.</div>
    <section class="card" data-tour="calendar">
      <div class="row sp">
        <button class="btn icon secondary" data-act="calNav" data-d="-1" aria-label="Previous month" ${cIdx <= bIdx ? "disabled" : ""}>${icon("back", 18)}</button>
        <div class="b up">${MONTHS_L[c.m]} ${c.y}</div>
        <button class="btn icon secondary" data-act="calNav" data-d="1" aria-label="Next month" ${cIdx >= bIdx + 1 ? "disabled" : ""}>${icon("arrow", 18)}</button>
      </div>
      <div style="margin-top:10px">${calHtml(sel, dur, rid)}</div>
    </section>
    <section class="card">
      <div class="b up">Time slots${d.date ? " · " + esc(fmtShort(d.date)) : ""}</div>
      <div class="slots" data-tour="slots" style="margin-top:10px">${slotHtml}</div>
      ${assigned ? `<div class="notice" style="margin-top:10px">Assigned to ${esc(assigned.name)}</div>` : ""}
      <p class="tiny muted" style="margin-top:10px">Taken slots cannot be booked, so double booking will not happen.</p>
    </section>
    <button class="btn block" data-act="toStep" data-to="book/review">CONTINUE →</button>
  </div>`;
}
function reviewHtml() {
  const d = state.draft;
  if (!d || !d.date || d.start == null) return emptyBox("Your booking details are missing.", "PICK A TIME", "book/schedule");
  d.step = 4;
  const dur = durFor(d.serviceId, d.styleId), sv = getService(d.serviceId), st = getStyle(d.styleId), shop = partnerShop();
  const bar = d.barberId === "any" ? (d.assigned ? getBarber(d.assigned) : null) : getBarber(d.barberId);
  const p = prefsFrom(d.prefs);
  const barberCell = d.barberId === "any" ? (bar ? `Assigned to ${esc(bar.name)}` : "Any available barber") : esc(bar ? bar.name : "");
  const rows = [
    ["Barbershop", `${esc(shop.name)}<br><span class="muted">${esc(shop.area)}</span>`],
    ["Service", `${esc(sv.name)}`],
    ["Barber", barberCell],
    ["Haircut", `<div class="cu-thumb-row" style="align-items:center">${styleThumb(d.styleId, 56)}<span class="b up">${esc(st ? st.name : "No style selected")}</span></div>` +
      (d.photo ? `<img class="cu-photo" src="${d.photo}" alt="Reference photo you uploaded" style="max-height:120px">` : "")],
    ["Preferences", `Guard ${p.guard} · ${esc(p.top)} · ${esc(p.beard)}<br>Extras: ${esc(p.extras.length ? p.extras.join(", ") : "None")}` +
      (p.notes ? `<br>Notes: ${esc(p.notes)}` : "")],
    ["Date", esc(fmtDate(d.date))],
    ["Time", `${fmtTime(d.start)} - ${fmtTime(d.start + dur)}`],
    ["Duration", `${dur} min`],
    ["Total (sample)", `${money(sv.price)} (sample price)`]
  ];
  return stepbar(4) + `<div class="col">
    <dl class="card" style="padding:6px 14px">${rows.map(([k, v]) => `<div class="sumrow"><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
    <div class="notice">Payment is made at the shop. The system only reserves your slot.</div>
    <button class="btn block" data-act="confirm">CONFIRM BOOKING →</button>
    <div class="row wrap" style="gap:8px">
      <button class="btn secondary sm" data-act="go" data-to="book/style">EDIT STYLE</button>
      <button class="btn secondary sm" data-act="go" data-to="book/barber">EDIT BARBER</button>
      <button class="btn secondary sm" data-act="go" data-to="book/schedule">EDIT TIME</button>
    </div>
  </div>`;
}
function confirmHtml(fresh) {
  const b = bookingById(state.ui.lastBookingId);
  state.draft = null;
  if (!b) return emptyBox("No booking to show yet.", "BOOK A HAIRCUT", "home");
  const st = getStyle(b.styleId), bar = getBarber(b.barberId), sh = partnerShop();
  const first = state.customer.name.split(" ")[0];
  const when = `${fmtShort(b.date)}, ${fmtTime(b.start)}`;
  const barName = bar ? bar.name : "your barber";
  const styleName = st ? st.name : "haircut";
  return `<div class="col" style="position:relative">
    ${fresh ? confettiHtml() : ""}
    <div class="row" style="justify-content:center"><div class="${fresh ? "stamp" : ""}" style="width:96px;height:96px;border:3px solid #000;border-radius:50%;background:#000;color:var(--yellow);display:grid;place-items:center;box-shadow:var(--sh-md)">${icon("check", 56)}</div></div>
    <h2 class="up" style="text-align:center">Your slot is reserved</h2>
    <div class="ticket" data-tour="ticket">
      <div class="tp row sp"><span class="b up">Booking no.</span><span class="b">${esc(b.id)}</span></div>
      <div class="cu-thumb-row" style="padding:12px 14px">
        <div style="width:72px;flex:none">${styleThumb(b.styleId, 72)}</div>
        <div class="grow"><div class="b up">${esc(styleName)}</div><div class="small">${esc(sh.name)}</div>
          <div class="small">with ${esc(barName)}</div><div class="b" style="margin-top:4px">${esc(when)}</div></div>
      </div>
    </div>
    <div class="tiny b up">Preview only, not actually sent in this demo</div>
    <div class="mail"><div class="mh">Subject: Your BarberBook PH booking ${esc(b.id)} is confirmed</div>
      <div style="padding:10px 12px;font-size:13px;line-height:1.45">Hi ${esc(first)}, your ${esc(styleName)} with ${esc(barName)} is confirmed for ${esc(when)} at ${esc(sh.name)}. Payment is made at the shop. To change the time, open My Bookings and tap Reschedule.</div></div>
    <div class="sms">BarberBook PH: Hi ${esc(first)}! Your haircut with ${esc(barName)} is confirmed for ${esc(when)} at ${esc(sh.name)}. Reply or open the app to reschedule. Ref ${esc(b.id)}</div>
    ${state.ui.reminder ? `<div class="sms" style="align-self:flex-end;border-radius:14px 14px 2px 14px">Reminder: your haircut is in 1 hour. ${esc(barName)} is ready for you at ${esc(sh.name)}, ${esc(fmtTime(b.start))}.</div>` : ""}
    <button class="btn block" data-act="ics" data-id="${esc(b.id)}">ADD TO MY CALENDAR</button>
    <button class="btn secondary block" data-act="reminder">SIMULATE REMINDER</button>
    <button class="btn secondary block" data-act="go" data-to="bookings">GO TO MY BOOKINGS →</button>
  </div>`;
}
function bookCard(b) {
  const st = getStyle(b.styleId), bar = getBarber(b.barberId);
  const live = b.status === "confirmed" || b.status === "pending";
  let act = "";
  if (live) act = `<div class="row wrap" style="margin-top:10px"><button class="btn secondary sm" data-act="resched" data-id="${esc(b.id)}">RESCHEDULE</button><button class="btn danger sm" data-act="askCancel" data-id="${esc(b.id)}">CANCEL</button></div>`;
  else if (b.status === "done" && !b.rated) act = `<div style="margin-top:10px"><button class="btn sm" data-act="rate" data-id="${esc(b.id)}">RATE YOUR CUT</button></div>`;
  else if (b.status === "done") act = `<div class="tiny muted" style="margin-top:8px">Thanks for rating this cut.</div>`;
  const reason = b.status === "cancelled" && b.cancelReason ? `<div class="small muted">Reason: ${esc(b.cancelReason)}</div>` : "";
  return `<article class="card">
    <div class="row sp"><span class="tiny b">${esc(b.id)}</span><span class="st-pill st-${b.status}">${STATUS[b.status]}</span></div>
    <div class="cu-thumb-row" style="margin-top:10px">
      <div style="width:72px;flex:none">${styleThumb(b.styleId, 72)}</div>
      <div class="grow"><div class="b up">${esc(st ? st.name : "No style selected")}</div>
        <div class="small">${esc(fmtDate(b.date))}</div>
        <div class="small b">${fmtTime(b.start)} - ${fmtTime(b.start + b.dur)}</div>
        <div class="small muted">with ${esc(bar ? bar.name : "any barber")} · ${esc(CONFIG.partnerShopName)}</div>${reason}</div>
    </div>${act}</article>`;
}
function bookingsHtml() {
  const tab = state.ui.btab || "upcoming";
  const list = bookingsFor(tab);
  const tabs = [["upcoming", "Upcoming"], ["past", "Past"], ["cancelled", "Cancelled"]]
    .map(([k, l]) => `<button class="${tab === k ? "on" : ""}" data-act="bookTab" data-v="${k}">${l}</button>`).join("");
  let body;
  if (list.length) body = `<div class="col stag">${list.map(bookCard).join("")}</div>`;
  else if (tab === "upcoming") body = `<div class="empty">${icon("cal", 40)}<p class="muted">No upcoming cuts yet.</p><button class="btn sm" data-act="startBook">BOOK A HAIRCUT</button></div>`;
  else if (tab === "past") body = `<div class="empty">${icon("cal", 40)}<p class="muted">Finished cuts will show up here.</p><button class="btn secondary sm" data-act="go" data-to="home">BROWSE SHOPS</button></div>`;
  else body = `<div class="empty">${icon("cal", 40)}<p class="muted">No cancelled bookings.</p><button class="btn secondary sm" data-act="go" data-to="home">BROWSE SHOPS</button></div>`;
  return `<div class="segmented" role="tablist">${tabs}</div>${body}`;
}
function profileHtml() {
  const c = state.customer, sp = c.savedPrefs, usual = getStyle(sp.styleId);
  const past = bookingsFor("past");
  const visits = myBookings().filter(b => b.status === "done").length;
  const favs = state.barbers.map(b => `<button class="chip ${c.favoriteBarber === b.id ? "on" : ""}" data-act="setFav" data-id="${esc(b.id)}">${esc(b.name)}</button>`).join("");
  const history = past.length ? past.map(b => {
    const st = getStyle(b.styleId);
    return `<div class="card row" style="padding:10px;gap:10px">${styleThumb(b.styleId, 44)}
      <div class="grow"><div class="b up small">${esc(st ? st.name : "No style selected")}</div><div class="tiny muted">${esc(fmtDate(b.date))}</div></div>
      <span class="st-pill st-${b.status}">${STATUS[b.status]}</span></div>`;
  }).join("") : `<div class="empty"><p class="muted">No visits yet. Your finished cuts will appear here.</p><button class="btn sm" data-act="startBook">BOOK A CUT</button></div>`;
  return `<section class="card">
      <div class="b up" style="font-size:20px">${esc(c.name)}</div>
      <div class="small">${esc(c.mobile)}</div><div class="small">${esc(c.email)}</div>
      <p class="tiny muted" style="margin-top:8px">Demo account, no login in this prototype.</p>
    </section>
    <section class="card">
      <div class="row sp"><div class="b up">My usual</div><button class="btn secondary sm" data-act="editPrefs">EDIT</button></div>
      <div class="cu-thumb-row" style="margin-top:10px">
        <div style="width:64px;flex:none">${styleThumb(sp.styleId || "", 64)}</div>
        <div class="grow"><div class="b up">${esc(usual ? usual.name : "No style")}</div>
          <div class="small">Guard ${sp.guard} · Top: ${esc(sp.top)}</div>
          <div class="small">Beard: ${esc(sp.beard)}</div>
          <div class="small">Extras: ${esc((sp.extras || []).join(", ") || "None")}</div>
          <div class="small">Notes: ${esc(sp.notes || "None")}</div></div>
      </div>
    </section>
    <section class="card"><div class="b up">Favorite barber</div><div class="row wrap" style="margin-top:10px">${favs}</div></section>
    <section>
      <div class="b up">Appointment history</div>
      <p class="small muted">${visits} visits since Aug 2026</p>
      <div class="col stag">${history}</div>
    </section>
    <div class="notice">Your details are used only for your bookings (RA 10173, Data Privacy Act of 2012).</div>`;
}

function custScreen(route) {
  const r = route || "home";
  const fresh = r === "confirm" && state.ui.fresh === true;   // the stamp and confetti play once
  if (r === "confirm") state.ui.fresh = false;
  if (r === "shop") return { html: shopHtml(), title: partnerShop().name, back: "home", tab: "home" };
  if (r === "styles") return { html: stylesHtml(), title: "Styles", back: null, tab: "styles" };
  if (r === "bookings") return { html: bookingsHtml(), title: "My bookings", back: null, tab: "bookings" };
  if (r === "profile") return { html: profileHtml(), title: "Profile", back: null, tab: "profile" };
  if (r === "book/style") return { html: styleStepHtml(), title: "Choose a style", back: "shop", tab: "" };
  if (r === "book/barber") return { html: barberHtml(), title: "Barber and prefs", back: "book/style", tab: "" };
  if (r === "book/schedule") return { html: scheduleHtml(), title: "Pick a time", back: "book/barber", tab: "" };
  if (r === "book/review") return { html: reviewHtml(), title: "Review", back: "book/schedule", tab: "" };
  if (r === "confirm") return { html: confirmHtml(fresh), title: "Booked", back: null, tab: "" };
  return { html: homeHtml(), title: "BarberBook PH", back: null, tab: "home" };
}

/* ===== ACTIONS (customer) ===== */
Object.assign(ACTIONS, {
  pickService(ds) { ensureDraft().serviceId = ds.id; commit(); },
  pickStyle(ds) {
    if (ds.ctx === "book" && state.draft) { state.draft.styleId = ds.id; state.draft.skipped = false; commit(); }
    else startBooking({ styleId: ds.id });
  },
  setCat(ds) { state.ui.cat = ds.v; commit(); },
  startBook() { startBooking({}); },
  quick() {
    const sp = state.customer.savedPrefs;
    startBooking({ styleId: sp.styleId, barberId: state.customer.favoriteBarber, jumpTo: "book/schedule" });
  },
  skipStyle() { const d = ensureDraft(); d.styleId = ""; d.skipped = true; commit(); go("book/barber"); },
  clearPhoto() { ensureDraft().photo = null; commit(); },
  photoPicked(ds, ev) {
    const f = ev.target.files && ev.target.files[0];
    ev.target.value = "";
    if (!f) return;
    if (!/^image\//.test(f.type)) return toast("That file is not an image.", "red");
    readPhoto(f, url => { ensureDraft().photo = url; toast("Photo added. The barber will see it.", "green"); commit(); });
  },
  pickBarber(ds) {
    const d = ensureDraft();
    d.barberId = ds.id;
    const dur = durFor(d.serviceId, d.styleId);
    if (d.start != null && d.date && !freeBarbers(d.date, d.start, dur, ds.id, d.rescheduleId).length) d.start = null;
    commit();
  },
  guardPlus(ds) { const p = prefsOf(ds); p.guard = Math.min(8, Number(p.guard) + 1); commit(); },
  guardMinus(ds) { const p = prefsOf(ds); p.guard = Math.max(0, Number(p.guard) - 1); commit(); },
  setTop(ds) { prefsOf(ds).top = ds.v; commit(); },
  setBeard(ds) { prefsOf(ds).beard = ds.v; commit(); },
  toggleExtra(ds) {
    const p = prefsOf(ds), i = p.extras.indexOf(ds.v);
    if (i >= 0) p.extras.splice(i, 1); else p.extras.push(ds.v);
    commit();
  },
  pickDate(ds) { const d = ensureDraft(); d.date = ds.d; d.start = null; d.assigned = null; commit(); },
  pickSlot(ds) { ensureDraft().start = Number(ds.m); commit(); },
  calNav(ds) {
    const c = state.ui.cal, base = nowDate();
    const bIdx = base.getFullYear() * 12 + base.getMonth();
    const next = c.y * 12 + c.m + Number(ds.d);
    if (next < bIdx || next > bIdx + 1) return;
    state.ui.cal = { y: Math.floor(next / 12), m: next % 12 };
    commit();
  },
  toStep(ds) {
    const d = ensureDraft(), to = ds.to;
    if (to === "book/barber" && !d.styleId && !d.skipped && !d.photo) return toast("Pick a style, or skip this step.", "amber");
    if (to === "book/review" && (!d.date || d.start == null)) return toast("Pick a date and time slot first.", "amber");
    go(to);
  },
  confirm() { confirmBooking(); },
  bookTab(ds) { state.ui.btab = ds.v; commit(); },
  resched(ds) { const b = bookingById(ds.id); if (b) startBooking({ rescheduleBooking: b }); },
  askCancel(ds) { openModal({ type: "cancel", id: ds.id, reason: "" }); },
  setReason(ds) { if (state.ui.modal) state.ui.modal.reason = ds.v; commit(); },
  doCancel() {
    const m = state.ui.modal, b = m && bookingById(m.id);
    if (!b) return closeModal();
    if (!m.reason) return toast("Pick a reason first.", "amber");
    b.status = "cancelled"; b.cancelReason = m.reason;
    closeModal();
    toast(`Cancelled ${b.id}. The slot is free again.`, "amber");
  },
  rate(ds) { openModal({ type: "rate", id: ds.id, stars: 0, tags: [], comment: "" }); },
  setStars(ds) { if (state.ui.modal) state.ui.modal.stars = Number(ds.v); commit(); },
  toggleTag(ds) {
    const m = state.ui.modal;
    if (!m) return;
    const i = m.tags.indexOf(ds.v);
    if (i >= 0) m.tags.splice(i, 1); else m.tags.push(ds.v);
    commit();
  },
  submitRate() {
    const m = state.ui.modal, b = m && bookingById(m.id);
    if (!b) return closeModal();
    if (!m.stars) return toast("Tap a star first.", "amber");
    state.feedback.push({ id: "f" + Date.now().toString(36), name: "Juan D.", barberId: b.barberId, stars: m.stars,
      tags: m.tags.slice(), comment: (m.comment || "").trim(), date: todayKey() });
    b.rated = true;
    closeModal();
    toast("Rating sent. It now appears in the owner's Feedback list.", "green");
  },
  reminder() { state.ui.reminder = true; toast("Reminder: your haircut is in 1 hour. Preview only.", "amber"); commit(); },
  ics(ds) { const b = bookingById(ds.id); if (!b) return; downloadIcs(b); toast("Calendar file downloaded.", "green"); },
  editPrefs() { openModal({ type: "editPrefs", prefs: prefsFrom(state.customer.savedPrefs) }); },
  savePrefs() {
    const m = state.ui.modal;
    if (!m) return;
    state.customer.savedPrefs = { ...prefsFrom(m.prefs), styleId: state.customer.savedPrefs.styleId };
    closeModal();
    toast("Saved as your usual.", "green");
  },
  setFav(ds) { state.customer.favoriteBarber = ds.id; commit(); },
  clearSearch() { state.ui.search = ""; commit(); },
  toSchedule() {
    state.ui.modal = null;
    if (state.draft) state.draft.start = null;
    commit();
    go("book/schedule");
  }
});

/* ===== MODALS (customer) ===== */
Object.assign(MODALS, {
  taken() {
    return `<div style="background:var(--red);color:#fff;border:2.5px solid #000;border-radius:10px;padding:10px 12px;margin-bottom:12px">
      <h2 style="color:#fff;margin:0">Sorry, that slot was just taken</h2></div>
      <p class="small">Someone else booked this time a moment ago. Pick another time, and your style and barber choices stay as they are.</p>
      <div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn danger" data-act="toSchedule">BACK TO SCHEDULE →</button></div>`;
  },
  cancel(m) {
    const b = bookingById(m.id);
    const info = b ? `${esc(b.id)} · ${esc(fmtDate(b.date))}, ${fmtTime(b.start)}` : "";
    return `<h2>Cancel this booking?</h2>
      <p class="small">${info}. Tell the shop why so the slot can be filled.</p>
      <div class="tiny b up" style="margin:10px 0 6px">Reason</div>
      <div class="row wrap" style="gap:8px">` +
      CANCEL_REASONS.map(r => `<button class="chip ${m.reason === r ? "on" : ""}" data-act="setReason" data-v="${esc(r)}">${esc(r)}</button>`).join("") +
      `</div>
      <div class="row" style="justify-content:flex-end;gap:8px;margin-top:16px">
        <button class="btn secondary" data-act="closeModal">KEEP BOOKING</button>
        <button class="btn danger" data-act="doCancel">CANCEL BOOKING</button>
      </div>`;
  },
  rate(m) {
    const b = bookingById(m.id);
    const bar = b && getBarber(b.barberId), st = b && getStyle(b.styleId);
    const tags = m.tags || [];
    const stars = [1, 2, 3, 4, 5].map(n => `<button class="starbtn ${m.stars >= n ? "on" : ""}" data-act="setStars" data-v="${n}" aria-label="${n} star${n > 1 ? "s" : ""}">${icon("star", 30)}</button>`).join("");
    const chips = RATE_TAGS.map(t => `<button class="chip ${tags.includes(t) ? "on" : ""}" data-act="toggleTag" data-v="${esc(t)}">${esc(t)}</button>`).join("");
    return `<h2>Rate your cut</h2>
      <p class="small muted">${esc(st ? st.name : "Haircut")} with ${esc(bar ? bar.name : "your barber")}</p>
      <div class="row wrap" style="gap:8px;margin:12px 0">${stars}</div>
      <div class="row wrap" style="gap:8px">${chips}</div>
      <div class="tiny b up" style="margin:12px 0 6px">Comment (optional)</div>
      <textarea class="textarea" maxlength="300" data-in="ui.modal.comment" placeholder="Anything the barber should know">${esc(m.comment || "")}</textarea>
      <div class="row" style="justify-content:flex-end;gap:8px;margin-top:14px">
        <button class="btn secondary" data-act="closeModal">LATER</button>
        <button class="btn" data-act="submitRate">SUBMIT RATING →</button>
      </div>`;
  },
  editPrefs(m) {
    const p = m.prefs || prefsFrom(state.customer.savedPrefs);
    return `<h2>My usual</h2>
      <p class="small muted">Saved preferences prefill every new booking.</p>
      <div style="margin-top:12px">${prefsForm(p, "modal")}</div>
      <div class="row" style="justify-content:flex-end;gap:8px;margin-top:14px">
        <button class="btn secondary" data-act="closeModal">CANCEL</button>
        <button class="btn" data-act="savePrefs">SAVE MY USUAL</button>
      </div>`;
  }
});

/* ===== GUIDED TOUR SUPPORT ===== */
// quickCreateDemoBooking() is called by the tour: it returns the id of Juan's just-made or newly created booking.
