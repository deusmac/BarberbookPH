/* ===== OWNER SIDE: queue, walk-in, barbers, gallery, reports, feedback ===== */
const EXTRA_CSS_B = `
.oh h1{margin:2px 0 0;font-size:30px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;line-height:1}
.oart svg{display:block;width:100%;height:auto}
.ostar .ic{fill:transparent}
.ostar.on .ic{fill:var(--yellow)}
.bk{cursor:pointer}
.bk .nm{display:block}
tr.flash td{animation:flash 1.2s ease-out}
.heatc{border:2px solid #000;min-height:34px;display:grid;place-items:center;font-size:11px;font-weight:800}
.ochart{width:100%;overflow:hidden}
`;

const OWNER_NAV = [["queue", "Queue", "cal"], ["walkin", "Walk-in", "walk"], ["barbers", "Barbers &amp; Hours", "users"], ["gallery", "Style Gallery", "img"], ["reports", "Reports", "chart"], ["feedback", "Feedback", "msg"]];
const OWNER_CATS = ["Fades", "Textured", "Classic", "Kids"];
const TIMES30 = (() => { const a = []; for (let m = 360; m <= 1320; m += 30) a.push(m); return a; })(); // 06:00 to 22:00
const BOARD_START = 540, BOARD_ROWS = 20, ROW_PX = 40;          // board covers 9:00 AM to 7:00 PM
const boardTop = m => (m - BOARD_START) / 30 * ROW_PX;
const boardEnd = BOARD_START + BOARD_ROWS * 30;
const inBoard = m => m >= BOARD_START && m < boardEnd;
const qDate = () => state.ui.qdate || todayKey();
const mdy = k => { const d = parseKey(k); return `${MONTHS[d.getMonth()]} ${d.getDate()}`; };
const shortLbl = (s, n = 24) => { s = String(s == null ? "" : s); return s.length > n ? s.slice(0, n - 1) + "." : s; };

function ohead(title, right = "") {
  return `<div class="oh row sp wrap" style="align-items:flex-end"><div><div class="tiny up b muted">${esc(state.shops[0] ? state.shops[0].name : "")} | Owner view</div><h1>${title}</h1></div><div class="row wrap">${right}</div></div>`;
}
const kpiCard = (n, label) => `<div class="card kpi"><b>${n}</b><span>${label}</span></div>`;
const ownerEmpty = (msg, btn, route) => `<div class="card empty">${icon("info", 36)}<div class="b">${esc(msg)}</div>${btn ? `<button class="btn sm" data-act="ogo" data-to="${route}">${esc(btn)}</button>` : ""}</div>`;

/* ----- O1 Queue ----- */
function bookingBlock(x) {
  const st = getStyle(x.styleId), sv = getService(x.serviceId);
  const isNew = x.id === state.ui.flash;
  const h = x.dur / 30 * ROW_PX;
  return `<div class="bk st-${x.status}${isNew ? " flash" : ""}" role="button" tabindex="0" data-act="openCard" data-id="${esc(x.id)}" style="top:${boardTop(x.start)}px;height:${Math.max(h - 3, 20)}px" title="${esc(x.name)} | ${esc(sv ? sv.name : "")}">` +
    `<span class="nm">${fmtTime(x.start)} ${esc(x.name)}${isNew ? ` <span class="badge y wig">NEW</span>` : ""}</span>` +
    `<span>${esc(st ? st.name : (sv ? sv.name : ""))}</span></div>`;
}
function timelineBoard(qd, dayB) {
  const bs = state.barbers, t = todayKey(), nm = nowMin();
  if (!bs.length) return ownerEmpty("No barbers yet.", "Add a barber", "barbers");
  const showNow = qd === t && inBoard(nm);
  let html = `<div class="board" data-tour="timeline" style="--n:${bs.length};--rows:${BOARD_ROWS}"><div class="hd"></div>`;
  html += bs.map(b => `<div class="hd">${esc(b.name)}</div>`).join("");
  html += `<div>${Array.from({ length: BOARD_ROWS }, (_, i) => `<div class="tc">${fmtTime(BOARD_START + i * 30)}</div>`).join("")}</div>`;
  bs.forEach(b => {
    let col = "";
    if (barberWorks(b, qd)) {
      if (b.breakAt && inBoard(hhmm(b.breakAt))) {
        const br = hhmm(b.breakAt);
        col += `<div class="bk brk" style="top:${boardTop(br)}px;height:${60 / 30 * ROW_PX}px"><span class="nm">Break</span></div>`;
      }
    } else {
      col += `<div class="offcol">Day off</div>`;
    }
    dayB.filter(x => x.barberId === b.id && inBoard(x.start)).forEach(x => { col += bookingBlock(x); });
    if (showNow && barberWorks(b, qd)) col += `<div class="nowline" style="top:${boardTop(nm)}px"></div>`;
    html += `<div class="bcol">${col}</div>`;
  });
  return html + `</div><div class="tiny muted">Bookings outside 9:00 AM to 7:00 PM are not drawn on the board. Use List view to see every booking.</div>`;
}
function quickBtn(x) {
  if (x.status === "pending" || x.status === "confirmed") return `<button class="btn sm" data-act="setStatus" data-id="${esc(x.id)}" data-to="inchair">Start</button>`;
  if (x.status === "inchair") return `<button class="btn sm green" data-act="setStatus" data-id="${esc(x.id)}" data-to="done">Done</button>`;
  return "";
}
function listTable(dayB) {
  if (!dayB.length) return ownerEmpty("No bookings on this day yet.", "Add a walk-in", "walkin");
  const rows = dayB.slice().sort((a, b) => a.start - b.start).map(x => {
    const isNew = x.id === state.ui.flash;
    return `<tr class="${isNew ? "flash" : ""}"><td>${fmtTime(x.start)}</td>` +
      `<td><b>${esc(x.name)}</b>${x.walkin ? ` <span class="badge b">Walk-in</span>` : ""}${isNew ? ` <span class="badge y wig">NEW</span>` : ""}</td>` +
      `<td>${esc(getBarber(x.barberId) ? getBarber(x.barberId).name : "")}</td>` +
      `<td>${esc(getService(x.serviceId) ? getService(x.serviceId).name : "")}<div class="tiny muted">${esc(getStyle(x.styleId) ? getStyle(x.styleId).name : "No style")}</div></td>` +
      `<td><span class="st-pill st-${x.status}">${STATUS[x.status]}</span></td>` +
      `<td><div class="row wrap">${quickBtn(x)}<button class="btn secondary sm" data-act="openCard" data-id="${esc(x.id)}">View</button></div></td></tr>`;
  }).join("");
  return `<div class="scroll-x"><table class="t"><thead><tr><th>Time</th><th>Customer</th><th>Barber</th><th>Service</th><th>Status</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
function screenQueue() {
  const qd = qDate(), t = todayKey(), qv = state.ui.qview === "list" ? "list" : "timeline";
  const dayB = state.bookings.filter(b => b.date === qd);
  const todayB = state.bookings.filter(b => b.date === t);
  const booked = todayB.filter(b => b.status !== "cancelled").length;
  const inChair = todayB.filter(b => b.status === "inchair").length;
  const wkStart = addDays(t, -6);
  const noShows = state.bookings.filter(b => b.status === "noshow" && b.date >= wkStart && b.date <= t).length;
  const openTimes = candidateTimes(t, "any").filter(s => freeBarbers(t, s, 30, "any").length).length;
  const kpis = `<div class="kpis">${kpiCard(booked, "Bookings today")}${kpiCard(openTimes, "Open slots left")}${kpiCard(inChair, "In chair now")}${kpiCard(noShows, "No-shows this week")}</div>`;
  const dateNav = `<div class="row wrap"><button class="btn secondary sm" data-act="qNav" data-d="-1" aria-label="Previous day">${icon("back", 16)}</button>` +
    `<div class="card" style="padding:6px 12px;font-weight:900;text-transform:uppercase;text-align:center">${fmtDate(qd)}</div>` +
    `<button class="btn secondary sm" data-act="qNav" data-d="1" aria-label="Next day">${icon("arrow", 16)}</button>` +
    `<button class="btn sm" data-act="qNav" data-d="0">Today</button></div>`;
  const viewToggle = `<div class="segmented" style="width:auto"><button class="${qv === "timeline" ? "on" : ""}" data-act="qView" data-v="timeline">Timeline</button><button class="${qv === "list" ? "on" : ""}" data-act="qView" data-v="list">List</button></div>`;
  const body = qv === "list" ? listTable(dayB) : timelineBoard(qd, dayB);
  return `${ohead("Queue", dateNav + viewToggle)}${kpis}<div class="card">${body}</div>`;
}

/* ----- Preference card drawer ----- */
function drawerHtml() {
  const b = state.bookings.find(x => x.id === state.ui.drawer);
  if (!b) return "";
  const st = getStyle(b.styleId), bar = getBarber(b.barberId), p = b.prefs || {};
  const lv = lastVisit(b);
  const pic = b.photo
    ? `<img src="${b.photo}" alt="Customer reference photo" style="width:100%;display:block;border:2px solid #000;border-radius:8px">`
    : `<div class="oart" style="border:2px solid #000;border-radius:8px;overflow:hidden">${st ? styleArt(st.art || st.id) : `<div class="empty">No style chosen</div>`}</div><div class="tiny muted">Reference image</div>`;
  const extras = (p.extras || []).length ? (p.extras || []).map(e => `<span class="chip">${esc(e)}</span>`).join(" ") : `<span class="small muted">None</span>`;
  const lastTxt = lv
    ? `Last visit: ${esc(getStyle(lv.styleId) ? getStyle(lv.styleId).name : "No style")}, #${esc(lv.prefs && lv.prefs.guard != null ? lv.prefs.guard : "-")} guard (${mdy(lv.date)})`
    : "First visit on record.";
  let acts;
  if (b.status === "pending" || b.status === "confirmed") {
    acts = `<button class="btn" data-act="setStatus" data-id="${esc(b.id)}" data-to="inchair">Start (in chair) →</button>` +
      `<div class="row wrap"><button class="btn danger sm" data-act="setStatus" data-id="${esc(b.id)}" data-to="noshow">No-show</button>` +
      `<button class="btn secondary sm" data-act="ownerAskCancel" data-id="${esc(b.id)}">Cancel</button></div>`;
  } else if (b.status === "inchair") {
    acts = `<button class="btn green" data-act="setStatus" data-id="${esc(b.id)}" data-to="done">Done →</button>`;
  } else {
    acts = `<div class="notice">This booking is closed (${STATUS[b.status]}).</div>`;
  }
  return `<div class="drawer-bd" data-act="closeCard"></div>
<aside class="drawer" data-tour="pcard" role="dialog" aria-label="Preference card">
  <div class="row sp"><span class="badge">Preference card</span><button class="btn secondary icon" data-act="closeCard" aria-label="Close">${icon("x", 18)}</button></div>
  <h2 style="font-size:24px;font-weight:900;text-transform:uppercase;margin:10px 0 2px">READ THIS BEFORE THE CUT.</h2>
  <div class="small muted" style="margin-bottom:12px">${esc(b.name)} at ${fmtTime(b.start)} with ${esc(bar ? bar.name : "")}${b.walkin ? ` <span class="badge b">Walk-in</span>` : ""}</div>
  <div class="col">
    ${pic}
    <div class="pcard-guard"><span class="tiny up b">Guard</span><b>${esc(p.guard != null ? p.guard : "-")}</b></div>
    <div class="card" style="padding:10px"><div class="small"><b>Top:</b> ${esc(p.top || "Not recorded")}</div><div class="small"><b>Beard:</b> ${esc(p.beard || "Not recorded")}</div><div class="small" style="margin-top:6px"><b>Extras:</b> ${extras}</div></div>
    <div><div class="tiny up b" style="margin-bottom:4px">Notes</div><div class="sticky-note">${esc(p.notes || "No notes from the customer.")}</div></div>
    <div class="small"><b>${lastTxt}</b></div>
    <div class="row sp wrap"><span class="st-pill st-${b.status}">${STATUS[b.status]}</span><span class="tiny muted">${esc(b.id)}</span></div>
    <div class="col">${acts}</div>
  </div>
</aside>`;
}

/* ----- O2 Walk-in ----- */
function walkinSlot(w, dur) {
  const t = todayKey();
  if (w.when === "time") { const s = Number(w.time); return s && freeBarbers(t, s, dur, w.barberId).length ? s : null; }
  for (let s = Math.ceil(nowMin() / 5) * 5; s <= 22 * 60; s += 5) if (freeBarbers(t, s, dur, w.barberId).length) return s;
  return null;
}
function screenWalkin() {
  const w = state.ui.walk, t = todayKey();
  const sv = getService(w.serviceId) || state.services[0];
  const dur = durFor(sv.id, w.styleId);
  const slots = candidateTimes(t, w.barberId).filter(s => freeBarbers(t, s, dur, w.barberId).length);
  const timeVal = slots.includes(Number(w.time)) ? Number(w.time) : (slots.length ? slots[0] : "");
  const styleOpts = `<option value="">No style (any)</option>` + visibleStyles().map(s => `<option value="${esc(s.id)}" ${s.id === w.styleId ? "selected" : ""}>${esc(s.name)}</option>`).join("");
  const svcOpts = state.services.map(s => `<option value="${esc(s.id)}" ${s.id === sv.id ? "selected" : ""}>${esc(s.name)} - ${money(s.price)}</option>`).join("");
  const barOpts = `<option value="any" ${w.barberId === "any" ? "selected" : ""}>First available</option>` + state.barbers.map(b => `<option value="${esc(b.id)}" ${b.id === w.barberId ? "selected" : ""}>${esc(b.name)}</option>`).join("");
  const timeOpts = slots.length ? slots.map(s => `<option value="${s}" ${s === timeVal ? "selected" : ""}>${fmtTime(s)}</option>`).join("") : `<option value="">No free slots today</option>`;
  return `${ohead("Walk-in")}
<div class="card" style="max-width:620px"><div class="col">
  <div><label class="lbl" for="walkName">Customer name (optional)</label><input id="walkName" class="input" data-in="ui.walk.name" value="${esc(w.name)}" placeholder="Walk-in guest"></div>
  <div><label class="lbl" for="walkSvc">Service</label><select id="walkSvc" class="select" data-ch="ui.walk.serviceId">${svcOpts}</select></div>
  <div><label class="lbl" for="walkStyle">Style (optional)</label><select id="walkStyle" class="select" data-ch="ui.walk.styleId">${styleOpts}</select></div>
  <div><label class="lbl" for="walkBarber">Barber</label><select id="walkBarber" class="select" data-ch="ui.walk.barberId">${barOpts}</select></div>
  <div><label class="lbl">When</label><div class="segmented"><button class="${w.when === "now" ? "on" : ""}" data-act="walkWhen" data-v="now">Now</button><button class="${w.when === "time" ? "on" : ""}" data-act="walkWhen" data-v="time">Pick a time</button></div></div>
  ${w.when === "time" ? `<div><label class="lbl" for="walkTime">Start time (free slots only)</label><select id="walkTime" class="select" data-ch="ui.walk.time" data-num="1">${timeOpts}</select></div>` : ""}
  <div class="notice">Length: ${dur} min. ${slots.length} start times free today for this choice.</div>
  <div><button class="btn block" data-act="saveWalkin">Add walk-in →</button></div>
</div></div>`;
}

/* ----- O3 Barbers & Hours ----- */
function screenBarbers() {
  const t = todayKey();
  const order = [1, 2, 3, 4, 5, 6, 0];
  const timeOpts = val => TIMES30.map(m => `<option value="${toHHMM(m)}" ${toHHMM(m) === val ? "selected" : ""}>${fmtTime(m)}</option>`).join("");
  const cards = state.barbers.map((b, i) => {
    const off = !!(state.dayOff[b.id] && state.dayOff[b.id][t]);
    return `<div class="card" data-barber="${esc(b.id)}"><div class="col">
      <div class="row sp wrap"><div><div class="b" style="font-size:18px;text-transform:uppercase">${esc(b.name)}</div><div class="small muted">${esc(b.specialty || "")}</div></div><span class="badge ${off ? "r" : "g"}">${off ? "Off today" : "On shift"}</span></div>
      <div><label class="lbl">Working days</label><div class="segmented">${order.map(d => `<button class="${b.days.includes(d) ? "on" : ""}" data-act="toggleDay" data-id="${esc(b.id)}" data-day="${d}">${DAYS[d]}</button>`).join("")}</div></div>
      <div class="grid2">
        <div><label class="lbl" for="st${i}">Start</label><select id="st${i}" class="select" data-ch="barbers.${i}.start">${timeOpts(b.start)}</select></div>
        <div><label class="lbl" for="en${i}">End</label><select id="en${i}" class="select" data-ch="barbers.${i}.end">${timeOpts(b.end)}</select></div>
        <div><label class="lbl" for="br${i}">Break (1 hour)</label><select id="br${i}" class="select" data-ch="barbers.${i}.breakAt">${timeOpts(b.breakAt)}</select></div>
      </div>
      <div class="row sp"><span class="b">Day off today</span><button class="toggle ${off ? "on" : ""}" data-act="dayOffToggle" data-id="${esc(b.id)}" aria-pressed="${off}" aria-label="Day off today"></button></div>
    </div></div>`;
  }).join("");
  const nb = state.ui.nb || { name: "", specialty: "" };
  return `${ohead("Barbers &amp; Hours")}
<div class="grid2">${cards}</div>
<div class="card soft"><div class="b up" style="margin-bottom:8px">Add barber</div><div class="grid2">
  <div><label class="lbl" for="nbName">Name</label><input id="nbName" class="input" data-in="ui.nb.name" value="${esc(nb.name)}" placeholder="e.g. Ramon"></div>
  <div><label class="lbl" for="nbSpec">Specialty</label><input id="nbSpec" class="input" data-in="ui.nb.specialty" value="${esc(nb.specialty)}" placeholder="e.g. Fades, kids"></div>
</div><div style="margin-top:10px"><button class="btn" data-act="addBarber">Add barber →</button></div></div>`;
}

/* ----- O4 Style Gallery ----- */
function screenGallery() {
  const cards = state.styles.map(s => `<div class="card" style="display:flex;flex-direction:column;gap:8px">
    <div class="oart" style="border:2px solid #000;border-radius:8px;overflow:hidden">${styleArt(s.art || s.id)}</div>
    <div class="row sp wrap"><div><div class="b" style="text-transform:uppercase">${esc(s.name)}</div><div class="tiny muted">${esc(s.category)} | ${s.mins} min</div></div>
      <div class="row wrap">${s.hidden ? `<span class="badge">Hidden</span>` : ""}${s.trending ? `<span class="badge y">Trending</span>` : ""}</div></div>
    <div class="row wrap">
      <button class="chip ${s.trending ? "on" : ""}" data-act="toggleTrend" data-id="${esc(s.id)}">Trending ${s.trending ? "on" : "off"}</button>
      <button class="chip ${s.hidden ? "" : "on"}" data-act="toggleHide" data-id="${esc(s.id)}">${s.hidden ? "Hidden" : "Shown"}</button>
      <button class="btn secondary sm" data-act="editStyle" data-id="${esc(s.id)}">Edit</button>
    </div></div>`).join("");
  return `${ohead("Style Gallery", `<button class="btn sm" data-act="addStyle">Add style +</button>`)}
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px">${cards}</div>
<div class="tiny muted">Trending and hidden styles update the customer gallery right away.</div>`;
}

/* ----- O5 Reports ----- */
function rangeOf(r) {
  const t = todayKey();
  if (r === "lastweek") return { from: addDays(t, -13), to: addDays(t, -7), label: "Last week" };
  if (r === "month") { const d = nowDate(); return { from: dkey(new Date(d.getFullYear(), d.getMonth(), 1)), to: t, label: "This month" }; }
  return { from: addDays(t, -6), to: t, label: "This week" };
}
function daysBetween(from, to) { const out = []; for (let k = from; k <= to; k = addDays(k, 1)) out.push(k); return out; }
function vbarSvg(items) { // items: [{l, v}]
  const W = 640, H = 240, pl = 34, pb = 44, pt = 26, pr = 8;
  const max = Math.max(1, ...items.map(i => i.v));
  const n = items.length, slot = (W - pl - pr) / n, bw = Math.min(56, slot * 0.62);
  let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Bar chart">`;
  s += `<line x1="${pl}" y1="${H - pb}" x2="${W - pr}" y2="${H - pb}" stroke="#000" stroke-width="2"/><line x1="${pl}" y1="${pt - 6}" x2="${pl}" y2="${H - pb}" stroke="#000" stroke-width="2"/>`;
  items.forEach((it, i) => {
    const x = pl + i * slot + (slot - bw) / 2, h = it.v / max * (H - pb - pt), y = H - pb - h;
    s += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" fill="#FFE600" stroke="#000" stroke-width="2"/>`;
    s += `<text x="${(x + bw / 2).toFixed(1)}" y="${(y - 6).toFixed(1)}" text-anchor="middle" font-weight="900" font-size="13" fill="#000">${it.v}</text>`;
    s += `<text x="${(x + bw / 2).toFixed(1)}" y="${H - pb + 16}" text-anchor="middle" font-size="11" font-weight="700" fill="#000">${esc(it.l)}</text>`;
  });
  return s + `</svg>`;
}
function hbarSvg(items) { // items: [{l, v}]
  const W = 640, LW = 190, rowH = 34, max = Math.max(1, ...items.map(i => i.v)), bmax = W - LW - 50;
  const H = items.length * rowH + 8;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Horizontal bar chart">`;
  items.forEach((it, i) => {
    const y = i * rowH + 6, w = it.v / max * bmax;
    s += `<text x="${LW - 10}" y="${y + 16}" text-anchor="end" font-size="13" font-weight="800" fill="#000">${esc(shortLbl(it.l))}</text>`;
    s += `<rect x="${LW}" y="${y}" width="${w.toFixed(1)}" height="22" fill="#1E50FF" stroke="#000" stroke-width="2"/>`;
    s += `<text x="${(LW + w + 8).toFixed(1)}" y="${y + 16}" font-size="13" font-weight="900" fill="#000">${it.v}</text>`;
  });
  s += `<line x1="${LW}" y1="0" x2="${LW}" y2="${H}" stroke="#000" stroke-width="2"/></svg>`;
  return s;
}
function heatGrid(inR) {
  const hrs = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  const cnt = {}; let max = 0;
  inR.filter(b => b.status !== "cancelled").forEach(b => {
    const h = Math.floor(b.start / 60); if (h < 9 || h > 18) return;
    const k = dow(b.date) + "-" + h; cnt[k] = (cnt[k] || 0) + 1; max = Math.max(max, cnt[k]);
  });
  const shades = ["#FFFFFF", "#DCE7FF", "#93B4FF", "#4D7BFF", "#1E50FF"];
  const lvl = c => c === 0 ? 0 : Math.min(4, Math.ceil(c / max * 4));
  let h = `<div class="heat" style="grid-template-columns:52px repeat(10,1fr)"><div></div>${hrs.map(x => `<div class="tiny b" style="text-align:center">${fmtTime(x * 60).replace(":00", "")}</div>`).join("")}`;
  [1, 2, 3, 4, 5, 6, 0].forEach(d => {
    h += `<div class="tiny b" style="align-self:center">${DAYS[d]}</div>`;
    hrs.forEach(x => {
      const c = cnt[d + "-" + x] || 0, L = lvl(c);
      h += `<div class="heatc" style="background:${shades[L]};color:${L >= 3 ? "#fff" : "#000"}" title="${DAYS[d]} ${fmtTime(x * 60)}: ${c} bookings">${c || ""}</div>`;
    });
  });
  h += `</div><div class="row tiny muted" style="margin-top:8px"><span>Fewer</span>${shades.slice(1).map(c => `<span style="display:inline-block;width:18px;height:12px;border:2px solid #000;background:${c}"></span>`).join("")}<span>More</span></div>`;
  return h;
}
function screenReports() {
  const range = state.ui.range || "week";
  const r = rangeOf(range);
  const inR = state.bookings.filter(b => b.date >= r.from && b.date <= r.to);
  const days = daysBetween(r.from, r.to);
  const total = inR.length;
  const chips = [["week", "This week"], ["lastweek", "Last week"], ["month", "This month"]]
    .map(([v, l]) => `<button class="chip ${range === v ? "on" : ""}" data-act="setRange" data-v="${v}">${l}</button>`).join("");
  const right = `<div class="row wrap">${chips}<button class="btn sm" data-act="exportCsv">${icon("download", 16)} Export CSV</button></div>`;
  const foot = `<div class="tiny muted">Reports help the owner decide shop hours and staffing (Significance of the Study).</div>`;
  if (!total) {
    return `${ohead("Reports", right)}<div class="card" data-tour="reports">${ownerEmpty("No bookings in " + r.label.toLowerCase() + " yet.", "Add a walk-in", "walkin")}</div>${foot}`;
  }
  const perDay = days.map(d => ({ l: DAYS[dow(d)] + " " + parseKey(d).getDate(), v: inR.filter(b => b.date === d && b.status !== "cancelled").length }));
  const perDayItems = days.length > 10 ? perDay.map((x, i) => ({ ...x, l: String(parseKey(days[i]).getDate()) })) : perDay;
  const perBarber = state.barbers.map(b => ({ l: b.name, v: inR.filter(x => x.barberId === b.id && x.status !== "cancelled").length }));
  const sc = {};
  inR.filter(b => b.status !== "cancelled" && b.styleId).forEach(b => { sc[b.styleId] = (sc[b.styleId] || 0) + 1; });
  const topStyles = Object.entries(sc).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id, v]) => ({ l: getStyle(id) ? getStyle(id).name : id, v }));
  const cnt = k => inR.filter(b => b.status === k).length;
  const pct = n => total ? Math.round(n / total * 100) : 0;
  const statusCards = [["done", "Done"], ["noshow", "No-show"], ["cancelled", "Cancelled"]].map(([k, l]) =>
    `<div class="card kpi"><b>${pct(cnt(k))}%</b><span>${l} (${cnt(k)} of ${total})</span></div>`).join("");
  return `${ohead("Reports", right)}
<div class="col" data-tour="reports">
  <div class="kpis" style="grid-template-columns:repeat(3,1fr)">${statusCards}</div>
  <div class="card"><div class="b up" style="margin-bottom:6px">Bookings per day (${r.label.toLowerCase()})</div><div class="ochart">${vbarSvg(perDayItems)}</div></div>
  <div class="grid2">
    <div class="card"><div class="b up" style="margin-bottom:6px">Bookings per barber</div>${perBarber.length ? `<div class="ochart">${hbarSvg(perBarber)}</div>` : `<div class="small muted">No barbers yet.</div>`}</div>
    <div class="card"><div class="b up" style="margin-bottom:6px">Top 5 requested styles</div>${topStyles.length ? `<div class="ochart">${hbarSvg(topStyles)}</div>` : `<div class="small muted">No style requests in this range.</div>`}</div>
  </div>
  <div class="card"><div class="b up" style="margin-bottom:6px">Busiest hours (day by hour)</div><div class="scroll-x">${heatGrid(inR)}</div></div>
  ${foot}
</div>`;
}

/* ----- O6 Feedback ----- */
function screenFeedback() {
  const f = state.feedback, avg = avgRating();
  const starRow = n => [1, 2, 3, 4, 5].map(i => `<span class="ostar ${i <= n ? "on" : ""}" style="display:inline-flex">${icon("star", 18)}</span>`).join("");
  const dist = [5, 4, 3, 2, 1].map(s => ({ s, n: f.filter(x => x.stars === s).length }));
  const maxN = Math.max(1, ...dist.map(d => d.n));
  const distHtml = dist.map(d => `<div class="row" style="gap:10px"><span class="b" style="width:28px">${d.s}</span><div style="flex:1;height:18px;border:2px solid #000;background:#fff"><div style="height:100%;width:${(d.n / maxN * 100).toFixed(1)}%;background:var(--yellow);border-right:2px solid #000"></div></div><span class="small b" style="width:24px;text-align:right">${d.n}</span></div>`).join("");
  const list = f.slice().sort((a, b) => b.date.localeCompare(a.date)).map(x => `<div class="card"><div class="row sp wrap"><div class="b">${esc(x.name)}</div><div class="tiny muted">${esc(mdy(x.date))}</div></div>
    <div class="row wrap" style="margin:4px 0">${starRow(x.stars)}</div>
    <div class="row wrap" style="gap:6px">${(x.tags || []).map(t => `<span class="chip">${esc(t)}</span>`).join("")}</div>
    <div style="margin-top:6px">"${esc(x.comment)}"</div>
    <div class="tiny muted" style="margin-top:4px">Barber: ${esc(getBarber(x.barberId) ? getBarber(x.barberId).name : "Any barber")}</div></div>`).join("");
  if (!f.length) return `${ohead("Feedback")}<div class="card" data-tour="feedback">${ownerEmpty("No reviews yet. Ratings appear here after a customer rates a finished visit.", "Back to queue", "queue")}</div>`;
  return `${ohead("Feedback")}
<div class="col" data-tour="feedback">
  <div class="grid2">
    <div class="card"><div class="tiny up b">Average rating</div><div style="font-size:64px;font-weight:900;line-height:1">${avg.toFixed(1)}</div><div class="row" style="margin:6px 0">${starRow(Math.round(avg))}</div><div class="small muted">${f.length} reviews</div></div>
    <div class="card"><div class="tiny up b" style="margin-bottom:8px">Rating distribution</div><div class="col" style="gap:6px">${distHtml}</div></div>
  </div>
  <div class="col">${list}</div>
</div>`;
}

/* ----- Shell entry point ----- */
function ownerView() {
  const r = state.ui.oroute || "queue";
  const nav = OWNER_NAV.map(([id, label, ic]) => `<button class="nav${r === id ? " on" : ""}" data-act="ogo" data-to="${id}">${icon(ic, 18)}<span>${label}</span></button>`).join("");
  const side = `<aside class="osb"><div class="brandrow"><span class="logo">BARBER<b>BOOK</b> PH</span></div><div class="tiny muted up b" style="padding:0 4px">${esc(state.shops[0] ? state.shops[0].name : "")}</div><div class="col" style="gap:6px">${nav}</div></aside>`;
  const screens = { queue: screenQueue, walkin: screenWalkin, barbers: screenBarbers, gallery: screenGallery, reports: screenReports, feedback: screenFeedback };
  const body = (screens[r] || screenQueue)();
  return `<div class="odash">${side}<main class="omain">${body}</main>${state.ui.drawer ? drawerHtml() : ""}</div>`;
}

/* ----- Actions ----- */
Object.assign(ACTIONS, {
  qNav(ds) { const d = Number(ds.d); state.ui.qdate = d === 0 ? null : addDays(qDate(), d); commit(); },
  qView(ds) { state.ui.qview = ds.v === "list" ? "list" : "timeline"; commit(); },
  openCard(ds) { state.ui.drawer = ds.id; commit(); },
  closeCard() { state.ui.drawer = null; commit(); },
  ownerAskCancel(ds) { openModal({ type: "cancelBk", id: ds.id }); },
  setStatus(ds) {
    const b = state.bookings.find(x => x.id === ds.id);
    if (!b || !STATUS[ds.to]) return;
    b.status = ds.to;
    if (ds.to === "cancelled") b.cancelReason = "Cancelled by the shop";
    state.ui.modal = null;
    if (ds.to === "done") toast(`Done: ${b.name}. The customer can rate this visit now.`, "green");
    else if (ds.to === "inchair") toast(`${b.name} is in the chair.`, "blue");
    else if (ds.to === "noshow") toast(`${b.name} marked as no-show.`, "red");
    else if (ds.to === "cancelled") toast(`Cancelled: ${b.name}. The slot is open again.`, "amber");
    commit();
  },
  walkWhen(ds) { state.ui.walk.when = ds.v === "time" ? "time" : "now"; commit(); },
  saveWalkin() {
    const w = state.ui.walk, t = todayKey();
    const sv = getService(w.serviceId);
    if (!sv) { toast("Pick a service first.", "red"); return; }
    const dur = durFor(sv.id, w.styleId);
    const s = walkinSlot(w, dur);
    if (s == null) { toast("No free barber for that time. Pick another slot.", "red"); return; }
    const bar = w.barberId === "any" ? pickAuto(t, s, dur) : freeBarbers(t, s, dur, w.barberId)[0];
    if (!bar) { toast("No free barber for that time. Pick another slot.", "red"); return; }
    const b = {
      id: newBookingNo(), shopId: "s1", cid: null, name: (w.name || "").trim() || "Walk-in guest",
      barberId: bar.id, serviceId: sv.id, styleId: w.styleId || "", photo: null,
      prefs: { guard: null, top: "Not recorded", beard: "Not recorded", extras: [], notes: "" },
      date: t, start: s, dur, status: w.when === "now" ? "inchair" : "confirmed", walkin: true, rated: false, created: t
    };
    state.bookings.push(b);
    state.ui.flash = b.id;
    state.ui.walk = { name: "", serviceId: "sv1", styleId: "", barberId: "any", when: "now", time: "" };
    state.ui.qdate = null;
    state.ui.oroute = "queue";
    if (!splitOn()) location.hash = "#/o/queue";
    toast(`Walk-in added: ${b.name} at ${fmtTime(s)} with ${bar.name}.`, "green");
    commit();
  },
  toggleDay(ds) {
    const b = getBarber(ds.id), d = Number(ds.day);
    if (!b) return;
    b.days = b.days.includes(d) ? b.days.filter(x => x !== d) : [...b.days, d].sort((x, y) => x - y);
    commit();
  },
  dayOffToggle(ds) {
    const b = getBarber(ds.id), t = todayKey();
    if (!b) return;
    state.dayOff[b.id] = state.dayOff[b.id] || {};
    if (state.dayOff[b.id][t]) { delete state.dayOff[b.id][t]; toast(`${b.name} is back on shift today.`, "green"); }
    else {
      state.dayOff[b.id][t] = true;
      const n = state.bookings.filter(x => x.barberId === b.id && x.date === t && ACTIVE(x.status)).length;
      toast(n ? `${b.name} is off today. ${n} booking${n > 1 ? "s" : ""} still on the board: reassign ${n > 1 ? "them" : "it"}.` : `${b.name} is off today.`, n ? "amber" : "blue");
    }
    commit();
  },
  addBarber() {
    const nb = state.ui.nb || {};
    const name = (nb.name || "").trim();
    if (!name) { toast("Enter a barber name first.", "red"); return; }
    state.barbers.push({ id: "b" + Date.now().toString(36), name, specialty: (nb.specialty || "").trim() || "All-round cuts", rating: 0, years: 0, days: [1, 2, 3, 4, 5, 6], start: "09:00", end: "18:00", breakAt: "12:00" });
    state.ui.nb = { name: "", specialty: "" };
    toast(`${name} added. Default shift is Mon to Sat, 9:00 AM to 6:00 PM.`, "green");
    commit();
  },
  toggleTrend(ds) { const s = getStyle(ds.id); if (s) { s.trending = !s.trending; commit(); } },
  toggleHide(ds) {
    const s = getStyle(ds.id); if (!s) return;
    s.hidden = !s.hidden;
    toast(`${s.name} is now ${s.hidden ? "hidden from customers" : "shown to customers"}.`, s.hidden ? "amber" : "green");
    commit();
  },
  editStyle(ds) {
    const s = getStyle(ds.id); if (!s) return;
    openModal({ type: "editStyle", id: s.id, name: s.name, mins: s.mins, category: s.category });
  },
  addStyle() { openModal({ type: "addStyle", art: "midtaper", name: "", mins: 40, category: "Fades" }); },
  saveStyle() {
    const m = state.ui.modal; if (!m) return;
    const name = (m.name || "").trim(), mins = Math.round(Number(m.mins));
    if (!name) { toast("Style name is required.", "red"); return; }
    if (!(mins >= 10 && mins <= 180)) { toast("Minutes must be between 10 and 180.", "red"); return; }
    if (m.type === "addStyle") {
      state.styles.push({ id: "s" + Date.now(), name, category: m.category || "Classic", mins, trending: false, hidden: false, art: m.art || "midtaper" });
      toast(`${name} added to the gallery.`, "green");
    } else {
      const s = getStyle(m.id);
      if (!s) { state.ui.modal = null; commit(); return; }
      s.name = name; s.mins = mins; s.category = m.category || s.category;
      toast(`${name} updated.`, "green");
    }
    state.ui.modal = null;
    commit();
  },
  setRange(ds) { state.ui.range = ds.v === "lastweek" || ds.v === "month" ? ds.v : "week"; commit(); },
  exportCsv() {
    const r = rangeOf(state.ui.range || "week");
    const rows = state.bookings.filter(b => b.date >= r.from && b.date <= r.to)
      .sort((a, b) => (a.date + toHHMM(a.start)).localeCompare(b.date + toHHMM(b.start)));
    const q = v => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const head = ["Booking no", "Date", "Time", "Customer", "Barber", "Service", "Style", "Guard", "Duration (min)", "Status", "Walk-in"];
    const lines = [head.map(q).join(",")].concat(rows.map(b => [
      b.id, b.date, fmtTime(b.start), b.name, getBarber(b.barberId) ? getBarber(b.barberId).name : "",
      getService(b.serviceId) ? getService(b.serviceId).name : "", getStyle(b.styleId) ? getStyle(b.styleId).name : "",
      b.prefs && b.prefs.guard != null ? b.prefs.guard : "", b.dur, STATUS[b.status], b.walkin ? "Yes" : "No"
    ].map(q).join(",")));
    const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `barberbook-bookings-${r.from}-to-${r.to}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast(`Exported ${rows.length} booking${rows.length === 1 ? "" : "s"}.`, "green");
  }
});

/* ----- Modals ----- */
Object.assign(MODALS, {
  cancelBk: m => `<h2 style="text-transform:uppercase;margin:0 0 8px">Cancel this booking?</h2>
    <p class="muted">The slot opens up again for online customers. The customer will see it as cancelled.</p>
    <div class="row wrap" style="justify-content:flex-end;margin-top:14px"><button class="btn secondary" data-act="closeModal">Keep booking</button><button class="btn danger" data-act="setStatus" data-id="${esc(m.id)}" data-to="cancelled">Cancel booking</button></div>`,
  editStyle: m => `<h2 style="text-transform:uppercase;margin:0 0 12px">Edit style</h2>
    <div class="col">
      <div><label class="lbl" for="msName">Name</label><input id="msName" class="input" data-in="ui.modal.name" value="${esc(m.name)}"></div>
      <div><label class="lbl" for="msMins">Minutes</label><input id="msMins" type="number" min="10" max="180" step="5" class="input" data-in="ui.modal.mins" data-num="1" value="${esc(m.mins)}"></div>
      <div><label class="lbl" for="msCat">Category</label><select id="msCat" class="select" data-ch="ui.modal.category">${OWNER_CATS.map(c => `<option ${c === m.category ? "selected" : ""}>${c}</option>`).join("")}</select></div>
    </div>
    <div class="row wrap" style="justify-content:flex-end;margin-top:14px"><button class="btn secondary" data-act="closeModal">Cancel</button><button class="btn" data-act="saveStyle">Save style</button></div>`,
  addStyle: m => {
    const arts = [...new Map(state.styles.map(s => [s.art || s.id, s])).values()];
    return `<h2 style="text-transform:uppercase;margin:0 0 12px">Add style</h2>
    <div class="col">
      <div><label class="lbl" for="asArt">Artwork preset</label><select id="asArt" class="select" data-ch="ui.modal.art">${arts.map(s => `<option value="${esc(s.art || s.id)}" ${(s.art || s.id) === m.art ? "selected" : ""}>${esc(s.name)}</option>`).join("")}</select></div>
      <div><label class="lbl" for="asName">Name</label><input id="asName" class="input" data-in="ui.modal.name" value="${esc(m.name)}" placeholder="e.g. Drop Fade"></div>
      <div><label class="lbl" for="asCat">Category</label><select id="asCat" class="select" data-ch="ui.modal.category">${OWNER_CATS.map(c => `<option ${c === m.category ? "selected" : ""}>${c}</option>`).join("")}</select></div>
      <div><label class="lbl" for="asMins">Minutes</label><input id="asMins" type="number" min="10" max="180" step="5" class="input" data-in="ui.modal.mins" data-num="1" value="${esc(m.mins)}"></div>
    </div>
    <div class="row wrap" style="justify-content:flex-end;margin-top:14px"><button class="btn secondary" data-act="closeModal">Cancel</button><button class="btn" data-act="saveStyle">Add style</button></div>`;
  }
});
