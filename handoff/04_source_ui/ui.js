// ---------- icons (24px, stroke) ----------
const P = {
  home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  scis: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.1 8.1L20 20M8.1 15.9L20 4"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  star: '<path d="M12 3l2.7 5.6 6.2.9-4.5 4.4 1 6.1L12 17l-5.5 3 1-6.1L3 9.5l6.2-.9z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<path d="M4 12l5 5L20 6"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c.8-3.5 3.6-5 7-5s6.2 1.5 7 5"/><circle cx="17" cy="7" r="2.5"/><path d="M17 12c2.5 0 4.3 1.3 5 4"/>',
  grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
  msg: '<path d="M4 5h16v11H9l-5 4z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  pin: '<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  cam: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  arr: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 6l9 7 9-7"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  walk: '<circle cx="13" cy="4" r="2"/><path d="M10 21l2-7 3 3v5M8 12l2-5 4 1 3 4"/>',
  heart: '<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
  down: '<path d="M12 4v12M6 10l6 6 6-6M4 20h16"/>',
  filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
  sms: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 18h4"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  sparkle: '<path d="M12 3v6M12 15v6M3 12h6M15 12h6"/>',
};
const I = (n, sw = 2.4, c = 'currentColor', s = 20) => `<svg class="ic" viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${P[n]}</svg>`;

// ---------- hairstyle art ----------
function hair(style, size = 120, bg = '#E2F1F8') {
  const CAP = 'M28 58 C25 20 95 20 92 58 L90 58 C88 50 84 46 78 45 C66 42 54 42 42 45 C36 46 32 50 30 58 Z';
  const cap = (c='#111') => `<path d="${CAP}" fill="${c}"/>`;
  const sides = (c) => `<path d="M28 50 L33 49 L33 66 L28 64Z M92 50 L87 49 L87 66 L92 64Z" fill="${c}"/>`;
  const H = {
    midtaper: cap() + sides('#8a8a8a') + '<path d="M44 44 C52 38 70 38 78 44 L76 36 C66 30 54 30 44 36Z" fill="#000"/>',
    lowfade: cap() + sides('#555'),
    skin: '<path d="M32 50 C30 22 90 22 88 50 C84 44 76 42 60 42 C44 42 36 44 32 50Z" fill="#111"/>',
    twoblock: cap() + sides('#9a9a9a') + '<path d="M36 46 C40 60 50 56 54 50 C58 58 68 58 72 50 C76 56 84 56 86 46 C76 40 46 40 36 46Z" fill="#111"/>',
    fringe: cap() + sides('#777') + '<path d="M34 47 L40 57 L45 49 L51 58 L56 49 L62 57 L67 49 L73 56 L78 48 L86 52 L84 44 C70 38 50 38 36 44Z" fill="#111"/>',
    buzz: '<path d="M30 56 C28 26 92 26 90 56 C88 48 80 42 60 42 C40 42 32 48 30 56Z" fill="#555"/>',
    crop: cap() + sides('#666') + '<path d="M36 44 L84 44 L84 51 L36 51Z" fill="#111"/>',
    pomp: '<path d="M30 56 C22 12 74 -2 98 24 C100 34 94 46 90 56 C88 48 80 44 60 43 C42 43 34 48 30 56Z" fill="#111"/>' + sides('#888'),
    part: cap() + '<path d="M46 43 L42 30" stroke="#E2F1F8" stroke-width="3"/><path d="M47 44 C60 34 80 36 88 50 L90 44 C82 32 60 28 47 40Z" fill="#000"/>',
    mullet: '<path d="M26 58 C20 76 22 92 28 100 L38 98 C34 86 34 72 36 60Z M94 58 C100 76 98 92 92 100 L82 98 C86 86 86 72 84 60Z" fill="#111"/>' + cap(),
    crew: '<path d="M29 57 C26 22 94 22 91 57 L89 57 C87 50 82 44 60 43 C38 44 33 50 31 57Z" fill="#222"/>' + sides('#999'),
    kids: '<path d="M27 62 C22 18 98 18 93 62 C90 52 84 50 78 52 C70 46 50 46 42 52 C36 50 30 52 27 62Z" fill="#4a3320"/>',
  };
  return `<svg viewBox="0 0 120 120" width="${size}" height="${size}" style="display:block"><rect width="120" height="120" fill="${bg}"/>
  <path d="M18 120 C20 98 38 92 60 92 C82 92 100 98 102 120Z" fill="#fff" stroke="#000" stroke-width="3"/>
  <rect x="50" y="80" width="20" height="16" fill="#E9C9A5" stroke="#000" stroke-width="3"/>
  <ellipse cx="60" cy="62" rx="30" ry="34" fill="#E9C9A5" stroke="#000" stroke-width="3"/>
  <ellipse cx="29" cy="66" rx="5" ry="8" fill="#E9C9A5" stroke="#000" stroke-width="2.5"/><ellipse cx="91" cy="66" rx="5" ry="8" fill="#E9C9A5" stroke="#000" stroke-width="2.5"/>
  ${H[style] || H.midtaper}
  <circle cx="50" cy="66" r="2.6"/><circle cx="70" cy="66" r="2.6"/><path d="M53 80 Q60 84 67 80" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round"/></svg>`;
}
const STY = [['midtaper', 'Mid Taper Fade', '45 min', 'TRENDING'], ['twoblock', 'Two Block', '50 min', 'TRENDING'], ['fringe', 'Textured Fringe', '40 min', 'HOT'], ['mullet', 'Modern Mullet', '50 min', 'NEW'], ['crop', 'French Crop', '40 min', ''], ['buzz', 'Buzz Cut', '25 min', '']];

const phone = (inner, tabs) => `<div class="phone"><div class="sb"><span>9:41</span><span class="isl"></span><span>PH ▮▮▮</span></div>${inner}${tabs || ''}</div>`;
const tabbar = (on) => `<div class="tabs">${[['home', 'Home'], ['scis', 'Styles'], ['cal', 'Bookings'], ['user', 'Profile']].map(([i, t], k) => `<div class="${k === on ? 'on' : ''}">${I(i, 2.4)}${t}</div>`).join('')}</div>`;
const bar = (t, back = true, right = '') => `<div class="bar">${back ? `<div class="back">←</div>` : ''}<div class="t">${t}</div>${right}</div>`;
const logobar = () => `<div class="bar"><div class="logo" style="flex:1">Barber<b>Book</b> PH</div><div class="back" style="position:relative">${I('bell', 2.4, '#000', 18)}<span style="position:absolute;top:-6px;right:-6px;width:16px;height:16px;border-radius:50%;background:#EF4444;border:2px solid #000;font-size:9px;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800">2</span></div></div>`;
const steps = (n) => `<div class="steps">${[1, 2, 3, 4].map(i => `<div class="d ${i < n ? 'done' : i === n ? 'cur' : ''}">${i < n ? '✓' : i}</div>${i < 4 ? `<div class="l ${i >= n ? 'o' : ''}"></div>` : ''}`).join('')}</div>`;
const av = (t, c) => `<div class="av" style="background:${c}">${t}</div>`;
const shot = (id, html) => `<div class="shot" id="${id}">${html}</div>`;

const S = {};
// ================= MOBILE =================
S.m_splash = phone(`<div style="flex:1;background:#1E50FF;position:relative;overflow:hidden" class="">
  <div class="dots" style="position:absolute;inset:0;opacity:.18"></div>
  <div style="position:absolute;left:34px;top:70px"><span class="badge y" style="font-size:13px">No more pila!</span></div>
  <div style="position:absolute;right:30px;top:120px"><span class="badge g p" style="font-size:13px">Saved prefs</span></div>
  <div style="position:absolute;left:50%;top:185px;transform:translateX(-50%) rotate(-4deg)" class="card"><div style="border-radius:12px;overflow:hidden">${hair('midtaper', 200, '#FFE600')}</div></div>
  <div style="position:absolute;left:24px;right:24px;top:450px">
   <div class="card" style="padding:18px 20px;box-shadow:6px 6px 0 #000"><div class="logo" style="font-size:34px;line-height:1">Barber<b>Book</b><br>PH</div>
   <p style="font-weight:600;font-size:14px;margin-top:10px">Book the barber. Save your cut. Skip the wait.</p></div>
   <div class="btn" style="margin-top:22px;font-size:16px">Get started ${I('arr', 3)}</div>
   <p style="color:#fff;text-align:center;font-size:12px;font-weight:600;margin-top:14px">Demo account · no login needed</p>
  </div></div>`);

S.m_home = phone(`${logobar()}<div class="body" style="padding:0">
  <div style="background:#1E50FF;border-bottom:3px solid #000;padding:16px 18px 18px;color:#fff">
    <p style="font-weight:600;font-size:13px">Magandang umaga, Juan 👋</p>
    <h2 style="font-size:22px;line-height:1.15;margin-top:4px">Book your next haircut in under a minute.</h2>
    <div class="in" style="margin-top:12px;color:#555;box-shadow:3px 3px 0 #000">${I('search', 2.4, '#000', 18)} Search barbershop or city…</div>
  </div>
  <div style="padding:16px 18px">
   <div class="card" style="background:#FFE600;padding:14px;position:relative"><span class="badge b" style="position:absolute;top:-10px;right:14px">Your next cut</span>
    <div class="row">${av('KR', '#fff')}<div style="flex:1"><p style="font-weight:800;font-size:15px">Tue, Nov 10 · 1:00 PM</p><p style="font-size:12px;font-weight:600">Kuya Ramil · Mid Taper Fade</p></div><div class="sq" style="width:52px;height:52px;background:#fff;flex-direction:column"><b style="font-size:20px;line-height:1">2</b><small style="font-size:9px;font-weight:800">DAYS</small></div></div>
    <div class="row" style="margin-top:10px"><div class="btn w sm" style="flex:1">View</div><div class="btn k sm" style="flex:1">Reschedule</div></div></div>
   <div class="card" style="padding:12px;margin-top:16px;display:flex;gap:12px;align-items:center"><div class="sq" style="overflow:hidden;width:56px;height:56px">${hair('midtaper', 56)}</div><div style="flex:1"><span class="badge">Your usual</span><p style="font-weight:800;font-size:14px;margin-top:4px">Quick rebook</p><p style="font-size:11.5px" class="mut">Mid Taper · #2 guard · Kuya Ramil</p></div><div class="back" style="background:#FFE600">${I('arr', 3, '#000', 18)}</div></div>
   <div class="row sp" style="margin:18px 0 8px"><h3 style="font-size:15px">Nearby shops</h3><span style="font-size:12px;font-weight:700;text-decoration:underline">See map</span></div>
   ${[['Kings Cut Barbershop', 'Poblacion, Tanza · 1.2 km', '4.8', 'OPEN NOW', 'g'], ['Fadez Manila Lounge', 'Trece Martires · 3.4 km', '4.5', 'SOON', 'a']].map(s => `<div class="card" style="padding:10px;margin-bottom:10px;display:flex;gap:10px;align-items:center"><div class="sq" style="width:50px;height:50px;background:#FEF08A">${I('scis', 2.4, '#000', 24)}</div><div style="flex:1"><p style="font-weight:800;font-size:13.5px">${s[0]}</p><p style="font-size:11px" class="mut">${s[1]}</p><p class="stars">★★★★★ <b>${s[2]}</b></p></div><span class="badge ${s[4]} p">${s[3]}</span></div>`).join('')}
  </div></div>`, tabbar(0));

S.m_shop = phone(`<div style="height:200px;background:#FFE600;border-bottom:3px solid #000;position:relative;flex:none" class="dots">
  <div class="back" style="position:absolute;left:16px;top:14px">←</div><div class="back" style="position:absolute;right:16px;top:14px">${I('heart', 2.4, '#000', 18)}</div>
  <div style="position:absolute;left:50%;top:34px;transform:translateX(-50%)" class="sq"><div style="width:120px;height:120px;background:#fff;border-radius:8px;display:flex;align-items:center;justify-content:center">${I('scis', 2.2, '#000', 70)}</div></div>
  <span class="badge g" style="position:absolute;right:18px;bottom:14px;font-size:12px">Open now</span></div>
  <div class="body">
   <h2 style="font-size:21px">Kings Cut Barbershop</h2>
   <p class="row mut" style="font-size:12px;font-weight:600;gap:4px;margin-top:4px">${I('pin', 2.4, '#000', 14)} Poblacion, Tanza, Cavite · 9 AM – 7 PM</p>
   <p class="stars" style="margin-top:4px">★★★★★ <b>4.8</b> <span class="mut">(126 reviews)</span></p>
   <p class="lbl" style="margin-top:14px">Services <span class="mut" style="text-transform:none;font-weight:600">(sample prices)</span></p>
   ${[['Haircut', '30 min', '150', 1], ['Haircut + Beard Trim', '45 min', '220', 0], ['Haircut + Hair Wash', '40 min', '200', 0], ['Kids\' Haircut', '25 min', '120', 0]].map(s => `<div class="row sp" style="border:2px solid #000;border-radius:10px;padding:9px 12px;margin-bottom:7px;${s[3] ? 'background:#FFE600;box-shadow:3px 3px 0 #000' : ''}"><div><p style="font-weight:800;font-size:13px">${s[0]}</p><p style="font-size:11px" class="mut">${s[1]}</p></div><b style="font-size:14px">₱${s[2]}</b></div>`).join('')}
   <p class="lbl" style="margin-top:12px">Barbers</p>
   <div class="row">${[['KR', 'Ramil', '#FFE600'], ['JH', 'Jhun', '#FEF08A'], ['PA', 'Paolo', '#E2F1F8']].map(b => `<div style="text-align:center;font-size:11px;font-weight:700">${av(b[0], b[2])}${b[1]}</div>`).join('')}
    <div style="flex:1;margin-left:6px;border:2px dashed #000;border-radius:10px;padding:8px;font-size:10.5px;font-weight:700">💵 Pay at the shop. We only reserve your slot.</div></div>
  </div><div style="padding:14px 18px 22px;border-top:3px solid #000;flex:none"><div class="btn">Book an appointment ${I('arr', 3)}</div></div>`);

S.m_gallery = phone(`${bar('Choose a style')}<div class="body">${steps(1)}
  <div class="row" style="gap:6px;flex-wrap:nowrap;overflow:hidden;margin-bottom:12px"><span class="chip on">🔥 Trending</span><span class="chip">Fades</span><span class="chip">Classic</span><span class="chip">Textured</span><span class="chip">Kids</span></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">${STY.slice(0, 4).map((s, i) => `<div class="card" style="overflow:hidden;position:relative;${i === 0 ? 'background:#FFE600;box-shadow:5px 5px 0 #1E50FF' : ''}">
   ${s[3] ? `<span class="badge ${i === 3 ? 'g' : 'y'}" style="position:absolute;top:6px;left:6px;z-index:2">${s[3]}</span>` : ''}${i === 0 ? `<div style="position:absolute;top:6px;right:6px;z-index:2;width:26px;height:26px;border-radius:50%;background:#000;color:#FFE600;display:flex;align-items:center;justify-content:center;font-weight:900;border:2px solid #000">✓</div>` : ''}
   <div style="border-bottom:2.5px solid #000">${hair(s[0], 158)}</div><div style="padding:8px 10px"><p style="font-weight:800;font-size:13px">${s[1]}</p><p style="font-size:11px" class="mut">${s[2]} · Reference image</p></div></div>`).join('')}</div>
  <div class="btn w" style="margin-top:14px">${I('cam', 2.4)} Upload my own photo</div>
  </div><div style="padding:12px 18px 22px;border-top:3px solid #000;flex:none"><div class="btn">Continue · Mid Taper Fade ${I('arr', 3)}</div></div>`);

S.m_upload = phone(`${bar('Your reference')}<div class="body">${steps(1)}
  <div class="card" style="padding:0;overflow:hidden;position:relative"><div style="height:300px;background:linear-gradient(135deg,#1E50FF,#6b8bff);display:flex;align-items:center;justify-content:center;border-bottom:2.5px solid #000">${hair('twoblock', 230, 'transparent')}</div>
   <span class="badge y" style="position:absolute;top:12px;left:12px">From your gallery</span>
   <div style="padding:12px 14px"><p style="font-weight:800">my_peg_haircut.jpg</p><p style="font-size:11.5px" class="mut">This photo will be sent to your barber with your booking.</p></div></div>
  <p class="lbl" style="margin-top:16px">Closest match in the gallery</p>
  <div class="row">${['twoblock', 'fringe', 'crop'].map((h, i) => `<div class="card" style="overflow:hidden;flex:1;${i === 0 ? 'background:#FFE600' : ''}"><div style="border-bottom:2px solid #000">${hair(h, 100)}</div><p style="font-size:10.5px;font-weight:800;padding:5px 7px">${['Two Block', 'Textured Fringe', 'French Crop'][i]}</p></div>`).join('')}</div>
  <div class="row" style="margin-top:16px;border:2px dashed #000;border-radius:10px;padding:10px;font-size:11.5px;font-weight:600">${I('shield', 2.4, '#000', 22)} Photos are only seen by the shop you booked. (RA 10173)</div>
  </div><div style="padding:12px 18px 22px;border-top:3px solid #000;flex:none" class="row"><div class="btn w" style="flex:1">Change</div><div class="btn" style="flex:2">Use this photo ${I('arr', 3)}</div></div>`);

S.m_barber = phone(`${bar('Choose your barber')}<div class="body">${steps(2)}
  ${[['KR', 'Kuya Ramil', 'Fades, skin fade · 8 yrs', '4.9', 'Next free: 1:00 PM', '#FFE600', 1], ['JH', 'Jhun', 'Classic, scissor cut · 5 yrs', '4.6', 'Next free: 2:30 PM', '#FEF08A', 0], ['PA', 'Paolo', 'Textured, two block, kids · 3 yrs', '4.7', 'Next free: 11:00 AM', '#E2F1F8', 0]].map(b => `<div class="card" style="padding:12px;margin-bottom:12px;display:flex;gap:12px;align-items:center;position:relative;${b[6] ? 'background:#FFE600;box-shadow:5px 5px 0 #000' : ''}">
   ${b[6] ? '<span class="badge b p" style="position:absolute;top:-10px;right:12px">Your favorite</span>' : ''}${av(b[0], b[6] ? '#fff' : b[5])}<div style="flex:1"><p style="font-weight:800;font-size:15px">${b[1]}</p><p style="font-size:11.5px" class="mut">${b[2]}</p><p class="row" style="gap:6px;margin-top:3px;font-size:11.5px;font-weight:700">★ ${b[3]} <span class="st ${b[6] ? 'c' : 'i'}" style="font-size:9.5px">${b[4]}</span></p></div>
   <div style="width:26px;height:26px;border-radius:50%;border:2.5px solid #000;background:${b[6] ? '#000' : '#fff'};display:flex;align-items:center;justify-content:center;color:#FFE600;font-weight:900">${b[6] ? '✓' : ''}</div></div>`).join('')}
  <div class="card" style="padding:12px;display:flex;gap:12px;align-items:center;border-style:dashed;box-shadow:none"><div class="av" style="background:#fff">${I('sparkle', 2.4, '#000', 20)}</div><div style="flex:1"><p style="font-weight:800;font-size:14px">Any available barber</p><p style="font-size:11.5px" class="mut">Fastest schedule. We'll assign one.</p></div></div>
  <div class="row" style="margin-top:16px;gap:8px;font-size:12px;font-weight:600"><span class="badge a">Tip</span>Your favorite barber is saved in your profile.</div>
  </div><div style="padding:12px 18px 22px;border-top:3px solid #000;flex:none"><div class="btn">Next: my preferences ${I('arr', 3)}</div></div>`);

S.m_prefs = phone(`${bar('My haircut details')}<div class="body">${steps(2)}
  <div class="row sp"><p class="lbl" style="margin:0">Guard no. on the sides</p><span class="badge">Your usual</span></div>
  <div class="row" style="margin:8px 0 4px"><div class="stp"><div>−</div><div>#2</div><div>+</div></div><div style="flex:1;font-size:11px;font-weight:600" class="mut">0 = skin · 8 = long<div style="display:flex;gap:3px;margin-top:6px">${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<div style="flex:1;height:${8 + i * 2.5}px;align-self:flex-end;border:1.5px solid #000;background:${i === 2 ? '#1E50FF' : '#fff'}"></div>`).join('')}</div></div></div>
  <p class="lbl" style="margin-top:14px">Length on top</p><div class="seg"><div>Short</div><div>Medium</div><div class="on">Keep it long</div></div>
  <p class="lbl" style="margin-top:14px">Beard</p><div class="seg"><div>None</div><div class="on">Line-up</div><div>Full trim</div></div>
  <p class="lbl" style="margin-top:14px">Extras</p><div class="row" style="flex-wrap:wrap;gap:7px"><span class="chip on">No hair product</span><span class="chip">Trim eyebrows</span><span class="chip on">Hard part</span><span class="chip">Hair wash</span></div>
  <p class="lbl" style="margin-top:14px">Notes to barber</p><div class="in" style="height:74px;align-items:flex-start;background:#FEF08A;font-weight:600">"Please don't cut the top too short. May cowlick sa likod."</div><p style="text-align:right;font-size:10px;font-weight:700;margin-top:3px">58 / 200</p>
  <div class="row" style="margin-top:6px;font-size:12.5px;font-weight:700"><div class="sq" style="width:22px;height:22px;background:#000;color:#FFE600;border-radius:6px;font-size:13px">✓</div>Save as my usual</div>
  </div><div style="padding:12px 18px 22px;border-top:3px solid #000;flex:none"><div class="btn">Next: pick a schedule ${I('arr', 3)}</div></div>`);

S.m_sched = phone(`${bar('Pick a schedule')}<div class="body">${steps(3)}
  <div class="row sp" style="margin-bottom:8px"><div class="back">‹</div><h3 style="font-size:16px">November 2026</h3><div class="back">›</div></div>
  <div class="cal">${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => `<div class="h">${d}</div>`).join('')}
   ${[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(d => `<div class="c ${d < 9 ? 'x' : d === 10 ? 'on' : d === 12 ? 'f' : ''}">${d}${[9, 11, 13, 14].includes(d) ? '<span class="dot"></span>' : ''}${d === 12 ? '<small style="position:absolute;left:0;right:0;bottom:-1px;font-size:7px;font-weight:900">FULL</small>' : ''}</div>`).join('')}</div>
  <div class="row sp" style="margin:16px 0 8px"><h3 style="font-size:14px">Tue, Nov 10 · Kuya Ramil</h3><span class="st c">45 min</span></div>
  <div class="slots">${[['9:00', ''], ['9:30', 'x'], ['10:00', 'x'], ['10:30', ''], ['11:00', ''], ['12:00', 'b'], ['1:00', 'on'], ['1:30', 'x'], ['2:00', 'x'], ['3:00', ''], ['4:00', ''], ['5:00', 'x']].map(([t, c]) => `<div class="slot ${c === 'b' ? 'x' : c}">${t}${c === 'x' ? '<small>Taken</small>' : c === 'b' ? '<small>Break</small>' : c === 'on' ? '<small>PM ✓</small>' : '<small>&nbsp;</small>'}</div>`).join('')}</div>
  <div class="row" style="margin-top:14px;background:#E2F1F8;border:2px solid #000;border-radius:10px;padding:10px;font-size:11.5px;font-weight:600">${I('shield', 2.4, '#000', 24)} Taken slots can't be picked, so double booking will not happen.</div>
  </div><div style="padding:12px 18px 22px;border-top:3px solid #000;flex:none"><div class="btn">Review booking ${I('arr', 3)}</div></div>`);

S.m_review = phone(`${bar('Review booking')}<div class="body">${steps(4)}
  <div class="card" style="padding:0;overflow:hidden"><div class="row" style="background:#1E50FF;color:#fff;padding:12px 14px;border-bottom:2.5px solid #000"><div class="sq" style="overflow:hidden;width:64px;height:64px;background:#fff">${hair('midtaper', 64)}</div><div><p style="font-weight:800;font-size:16px;text-transform:uppercase">Mid Taper Fade</p><p style="font-size:12px;font-weight:600">Haircut + Beard Trim · 45 min</p></div></div>
   <div style="padding:6px 14px 12px">${[['Barbershop', 'Kings Cut'], ['Barber', 'Kuya Ramil'], ['Date', 'Tue, Nov 10, 2026'], ['Time', '1:00 – 1:45 PM'], ['Sides', '#2 guard'], ['Top', 'Keep it long'], ['Beard', 'Line-up only'], ['Extras', 'No product, hard part']].map(r => `<div class="row sp" style="border-bottom:2px dashed #000;padding:7px 0;font-size:12.5px"><span class="mut" style="font-weight:600">${r[0]}</span><b>${r[1]}</b></div>`).join('')}
   <div style="background:#FEF08A;border:2px solid #000;border-radius:8px;padding:8px;margin-top:9px;font-size:11.5px;font-weight:600">📝 "Please don't cut the top too short. May cowlick sa likod."</div>
   <div class="row sp" style="margin-top:10px"><h3 style="font-size:16px">Total (sample)</h3><h3 style="font-size:20px">₱220.00</h3></div></div></div>
  <p style="font-size:11px;font-weight:600;text-align:center;margin-top:10px">💵 Payment is made at the shop. The system only reserves your slot.</p>
  </div><div style="padding:12px 18px 22px;border-top:3px solid #000;flex:none" class="row"><div class="btn w" style="flex:1">Edit</div><div class="btn" style="flex:2.4">Confirm booking ${I('check', 3)}</div></div>`);

const confetti = () => Array.from({ length: 26 }, (_, i) => { const c = ['#FFE600', '#1E50FF', '#000', '#22C55E', '#EF4444'][i % 5]; const x = (i * 37) % 360 + 10, y = (i * 53) % 230 + 10, r = (i * 47) % 90; return `<div style="position:absolute;left:${x}px;top:${y}px;width:${8 + i % 3 * 3}px;height:${8 + i % 2 * 5}px;background:${c};border:1.5px solid #000;transform:rotate(${r}deg)"></div>`; }).join('');
S.m_confirm = phone(`<div class="body" style="background:#fff;position:relative">${confetti()}
  <div style="text-align:center;margin-top:36px;position:relative"><div style="width:110px;height:110px;margin:0 auto;border-radius:50%;background:#22C55E;border:4px solid #000;box-shadow:6px 6px 0 #000;display:flex;align-items:center;justify-content:center;transform:rotate(-8deg)">${I('check', 4, '#000', 64)}</div>
  <h2 style="font-size:26px;margin-top:22px;line-height:1.1">Your slot is<br>reserved!</h2><p style="font-size:13px;font-weight:600;margin-top:8px" class="mut">A confirmation was sent to your email and SMS.</p></div>
  <div class="card" style="background:#FEF08A;margin-top:18px;padding:0;position:relative;overflow:visible"><span class="badge k" style="position:absolute;top:-12px;left:14px;font-size:12px">BB-2026-00148</span>
   <div style="padding:18px 16px 10px">${[['Shop', 'Kings Cut Barbershop'], ['Barber', 'Kuya Ramil'], ['When', 'Tue, Nov 10 · 1:00 PM'], ['Style', 'Mid Taper Fade #2']].map(r => `<div class="row sp" style="border-bottom:2px dashed #000;padding:6px 0;font-size:12.5px"><span style="font-weight:600">${r[0]}</span><b>${r[1]}</b></div>`).join('')}</div>
   <div style="display:flex;border-top:2.5px dashed #000"><div style="flex:1;padding:10px;text-align:center;font-size:11px;font-weight:800">SHOW THIS AT THE SHOP</div><div style="width:64px;border-left:2.5px dashed #000;padding:6px"><div style="width:50px;height:50px;background:repeating-conic-gradient(#000 0 25%,#fff 0 50%) 0 0/10px 10px;border:2px solid #000"></div></div></div></div>
  <div class="btn w" style="margin-top:18px">${I('cal', 2.4)} Add to my calendar</div>
  <div class="row" style="margin-top:10px"><div class="btn w sm" style="flex:1">Reschedule</div><div class="btn k sm" style="flex:1">My bookings</div></div>
  </div>`);

S.m_notif = phone(`<div style="flex:1;background:linear-gradient(160deg,#1E50FF 0%,#0a2a9e 100%);position:relative;padding:20px 16px;color:#fff" >
  <div class="dots" style="position:absolute;inset:0;opacity:.12"></div>
  <div style="text-align:center;position:relative;margin-top:26px"><p style="font-size:16px;font-weight:700">Monday, November 9</p><p style="font-size:78px;font-weight:800;line-height:1;letter-spacing:-.04em">9:41</p></div>
  ${[['sms', 'SMS · BarberBook PH', 'now', 'Hi Juan! Your haircut with Kuya Ramil is confirmed for Tue Nov 10, 1:00 PM at Kings Cut. Ref BB-2026-00148', '#FFE600'], ['bell', 'Reminder', 'tomorrow 12:00 PM', 'Your haircut is in 1 hour. Arrive 5 minutes early. Tap to reschedule.', '#fff'], ['mail', 'Email · Gmail', '2m ago', 'Booking confirmed: BB-2026-00148 · Mid Taper Fade', '#FEF08A']].map((n, i) => `<div class="card" style="position:relative;margin-top:${i ? 12 : 34}px;padding:12px 14px;background:${n[4]};color:#000;${i === 1 ? 'transform:rotate(-1.5deg)' : ''}"><div class="row sp"><div class="row" style="gap:7px;font-size:11.5px;font-weight:800;text-transform:uppercase"><div class="sq" style="width:26px;height:26px;background:#000;border-radius:7px">${I(n[0], 2.4, '#FFE600', 15)}</div>${n[1]}</div><span style="font-size:10.5px;font-weight:700">${n[2]}</span></div><p style="font-size:12.5px;font-weight:600;margin-top:7px;line-height:1.4">${n[3]}</p></div>`).join('')}
  <div style="position:absolute;bottom:26px;left:0;right:0;text-align:center"><span class="badge y" style="font-size:12px">Preview · not sent in demo</span></div></div>`);

const BOOKINGS_BODY = `
  <div class="seg" style="margin-bottom:14px"><div class="on">Upcoming</div><div>Past</div><div>Cancelled</div></div>
  <div class="card" style="padding:0;overflow:hidden;margin-bottom:14px"><div class="row sp" style="background:#FFE600;padding:9px 12px;border-bottom:2.5px solid #000"><b style="font-size:12px">BB-2026-00148</b><span class="st c">Confirmed</span></div>
   <div class="row" style="padding:12px"><div class="sq" style="overflow:hidden;width:60px;height:60px">${hair('midtaper', 60)}</div><div style="flex:1"><p style="font-weight:800;font-size:14px">Tue, Nov 10 · 1:00 PM</p><p style="font-size:11.5px" class="mut">Kuya Ramil · Mid Taper Fade · 45 min</p></div></div>
   <div class="row" style="padding:0 12px 12px"><div class="btn w sm" style="flex:1">${I('cal', 2.4, '#000', 14)} Reschedule</div><div class="btn r sm" style="flex:1">${I('x', 2.6, '#fff', 14)} Cancel</div></div></div>
  <p class="lbl">Recent</p>
  ${[['Oct 12', 'Mid Taper Fade', 'Kuya Ramil', 'd', 'Done', 1], ['Sep 14', 'Mid Taper Fade', 'Kuya Ramil', 'd', 'Done', 0], ['Aug 20', 'Two Block', 'Paolo', 'n', 'No-show', 0]].map(b => `<div class="card" style="padding:10px 12px;margin-bottom:10px;display:flex;align-items:center;gap:10px"><div class="sq" style="width:44px;height:44px;background:#E2F1F8;flex-direction:column"><b style="font-size:10px">${b[0].split(' ')[0].toUpperCase()}</b><b style="font-size:16px;line-height:1">${b[0].split(' ')[1]}</b></div><div style="flex:1"><p style="font-weight:800;font-size:13px">${b[1]}</p><p style="font-size:11px" class="mut">${b[2]}</p></div>${b[5] ? '<div class="btn sm">★ Rate</div>' : `<span class="st ${b[3]}">${b[4]}</span>`}</div>`).join('')}
  `;
S.m_bookings = phone(`${bar('My bookings', false)}<div class="body">${BOOKINGS_BODY}</div>`, tabbar(2));

S.m_cancel = phone(`${bar('My bookings', false)}<div class="body" style="filter:blur(0)"><div style="position:absolute;inset:0;background:rgba(0,0,0,.5);z-index:3"></div>
  ${BOOKINGS_BODY}
  <div class="card" style="position:absolute;left:14px;right:14px;bottom:14px;z-index:4;padding:20px 18px;box-shadow:8px 8px 0 #000;border-width:3px">
   <div class="row sp"><h3 style="font-size:19px">Cancel booking?</h3><div class="back">✕</div></div>
   <p style="font-size:12.5px;font-weight:600;margin-top:6px" class="mut">BB-2026-00148 · Tue, Nov 10 · 1:00 PM with Kuya Ramil. Your slot will be given to another customer.</p>
   <p class="lbl" style="margin-top:14px">Reason</p>
   <div class="row" style="flex-wrap:wrap;gap:7px"><span class="chip on">Schedule conflict</span><span class="chip">Feeling sick</span><span class="chip">Found another time</span><span class="chip">Other</span></div>
   <div class="row" style="margin-top:14px;background:#E2F1F8;border:2px solid #000;border-radius:10px;padding:10px;font-size:11.5px;font-weight:700">💡 Want to move it instead? <u style="margin-left:auto">Reschedule</u></div>
   <div class="row" style="margin-top:16px"><div class="btn w" style="flex:1">Keep it</div><div class="btn r" style="flex:1.4">Yes, cancel</div></div></div>
  </div>`, tabbar(2));

S.m_profile = phone(`<div style="background:#1E50FF;border-bottom:3px solid #000;padding:18px;color:#fff;flex:none;position:relative"><div class="row">${av('JD', '#FFE600')}<div style="flex:1"><h3 style="font-size:18px">Juan Dela Cruz</h3><p style="font-size:12px;font-weight:600">0917 123 4567 · Tanza, Cavite</p></div><div class="back">${I('gear', 2.4, '#000', 18)}</div></div>
  <div class="row" style="margin-top:14px;gap:8px">${[['7', 'visits'], ['4.9', 'avg rating'], ['0', 'no-shows']].map(k => `<div class="card" style="flex:1;padding:8px;text-align:center;color:#000;box-shadow:3px 3px 0 #000"><b style="font-size:20px">${k[0]}</b><p style="font-size:10px;font-weight:700;text-transform:uppercase">${k[1]}</p></div>`).join('')}</div></div>
  <div class="body">
   <div class="card" style="padding:12px;background:#FFE600;position:relative"><span class="badge b" style="position:absolute;top:-10px;left:12px">My usual</span><div class="row" style="margin-top:4px"><div class="sq" style="overflow:hidden;width:70px;height:70px;background:#fff">${hair('midtaper', 70)}</div><div style="flex:1;font-size:12px;font-weight:600;line-height:1.55"><b style="font-size:14px">Mid Taper Fade</b><br>Sides #2 · Top: keep it long<br>Beard: line-up · No product</div></div><div class="btn w sm" style="margin-top:10px">Edit my usual</div></div>
   <div class="row sp" style="margin:16px 0 8px"><h3 style="font-size:14px">Favorite barber</h3></div>
   <div class="card row" style="padding:10px">${av('KR', '#FEF08A')}<div style="flex:1"><b>Kuya Ramil</b><p style="font-size:11px" class="mut">5 of your 7 visits</p></div><span class="badge p">★ 4.9</span></div>
   <div class="row sp" style="margin:16px 0 8px"><h3 style="font-size:14px">History</h3><span style="font-size:11px;font-weight:700;text-decoration:underline">See all</span></div>
   <div class="row" style="gap:8px">${['midtaper', 'midtaper', 'twoblock', 'midtaper'].map((h, i) => `<div class="card" style="overflow:hidden;flex:1;box-shadow:3px 3px 0 #000"><div style="border-bottom:2px solid #000">${hair(h, 72)}</div><p style="font-size:9.5px;font-weight:800;padding:3px 5px">${['OCT 12', 'SEP 14', 'AUG 20', 'JUL 19'][i]}</p></div>`).join('')}</div>
   <p style="font-size:10px;font-weight:600;margin-top:12px" class="mut">🔒 Your details are used only for your bookings (Data Privacy Act of 2012).</p>
  </div>`, tabbar(3));

S.m_rate = phone(`${bar('Rate your cut')}<div class="body">
  <div style="text-align:center"><div class="card" style="display:inline-block;overflow:hidden;transform:rotate(-3deg)">${hair('midtaper', 150, '#FFE600')}</div>
  <h3 style="font-size:18px;margin-top:14px">How was your haircut?</h3><p style="font-size:12px;font-weight:600" class="mut">Mid Taper Fade with Kuya Ramil · Oct 12</p></div>
  <div class="row" style="justify-content:center;gap:8px;margin-top:14px">${[1, 2, 3, 4, 5].map(i => `<div class="sq" style="width:52px;height:52px;background:${i <= 5 ? '#FFE600' : '#fff'};box-shadow:3px 3px 0 #000;font-size:26px">★</div>`).join('')}</div>
  <p style="text-align:center;font-weight:800;margin-top:8px">SOLID! 5 / 5</p>
  <p class="lbl" style="margin-top:12px">What went well?</p>
  <div class="row" style="flex-wrap:wrap;gap:7px"><span class="chip on">Exactly what I asked</span><span class="chip on">On time</span><span class="chip on">Sulit</span><span class="chip">Friendly</span><span class="chip">Clean shop</span></div>
  <p class="lbl" style="margin-top:14px">Comment (optional)</p><div class="in" style="height:70px;align-items:flex-start;font-weight:600">"Hindi na ako naghintay. Tamang-tama yung fade, galing!"</div>
  </div><div style="padding:12px 18px 22px;border-top:3px solid #000;flex:none"><div class="btn">Submit rating ${I('arr', 3)}</div></div>`);

// owner mobile
S.m_oqueue = phone(`<div class="bar" style="background:#000;color:#fff;border-color:#000"><div class="logo" style="flex:1;color:#fff">Shop<b style="color:#FFE600">Owner</b></div><span class="badge y">Kings Cut</span></div><div class="body" style="background:#E2F1F8">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">${[['12', 'Bookings today', '#FFE600'], ['3', 'Open slots', '#fff'], ['1', 'In chair now', '#fff'], ['2', 'No-shows (wk)', '#fff']].map(k => `<div class="card kpi" style="background:${k[2]};padding:10px 12px"><div class="n" style="font-size:28px">${k[0]}</div><div class="k" style="font-size:10px">${k[1]}</div></div>`).join('')}</div>
  <div class="row sp" style="margin:16px 0 8px"><h3 style="font-size:15px">Today's queue</h3><span class="chip y" style="padding:4px 10px">All barbers ▾</span></div>
  ${[['9:00', 'Mark T.', 'Crew Cut · Jhun', 'd', 'Done'], ['10:00', 'Aldrin R.', 'Low Fade · Ramil', 'd', 'Done'], ['11:00', 'Carlo M.', 'Two Block · Paolo', 'i', 'In chair'], ['1:00', 'Juan D.', 'Mid Taper #2 · Ramil', 'c', 'Confirmed', 1], ['1:30', 'Walk-in guest', 'Haircut · Jhun', 'p', 'Walk-in']].map(q => `<div class="card" style="padding:9px 11px;margin-bottom:8px;display:flex;align-items:center;gap:10px;${q[5] ? 'background:#FEF08A;box-shadow:4px 4px 0 #1E50FF' : ''}"><b style="font-size:13px;width:40px">${q[0]}</b><div style="flex:1"><p style="font-weight:800;font-size:13px">${q[1]} ${q[5] ? '<span class="badge r" style="font-size:9px;padding:1px 6px">NEW</span>' : ''}</p><p style="font-size:11px" class="mut">${q[2]}</p></div><span class="st ${q[3]}">${q[4]}</span></div>`).join('')}
  <div class="btn k" style="margin-top:6px">${I('walk', 2.4, '#FFE600')} Add walk-in</div>
  </div>`, `<div class="tabs">${[['grid', 'Queue'], ['walk', 'Walk-in'], ['users', 'Barbers'], ['chart', 'Reports']].map(([i, t], k) => `<div class="${k === 0 ? 'on' : ''}">${I(i, 2.4)}${t}</div>`).join('')}</div>`);

S.m_pcard = phone(`<div class="bar" style="background:#000;color:#fff"><div class="back">←</div><div class="t">Customer · 1:00 PM</div></div><div class="body" style="background:#E2F1F8">
  <div style="text-align:center"><span class="badge r" style="font-size:13px;transform:rotate(-2deg)">Read this before the cut!</span></div>
  <div class="card" style="margin-top:14px;padding:0;overflow:hidden"><div class="row" style="padding:12px;border-bottom:2.5px solid #000">${av('JD', '#FFE600')}<div style="flex:1"><b style="font-size:15px">Juan Dela Cruz</b><p style="font-size:11px" class="mut">7th visit · Regular · ★ gives 4.9</p></div><span class="st c">Confirmed</span></div>
   <div style="display:flex"><div style="border-right:2.5px solid #000">${hair('midtaper', 150)}</div><div style="flex:1;padding:10px;display:flex;flex-direction:column;gap:8px">
    <div class="sq" style="background:#FFE600;flex-direction:column;padding:6px;box-shadow:3px 3px 0 #000"><small style="font-size:9px;font-weight:800">SIDES GUARD</small><b style="font-size:36px;line-height:1">#2</b></div>
    <p style="font-size:11px;font-weight:700;line-height:1.5">TOP: keep long<br>BEARD: line-up<br>NO product · hard part</p></div></div></div>
  <div style="background:#FEF08A;border:2.5px solid #000;border-radius:4px;padding:12px;margin-top:14px;box-shadow:4px 4px 0 #000;transform:rotate(1deg);font-weight:600;font-size:13px">📝 "Please don't cut the top too short. May cowlick sa likod."</div>
  <div class="card" style="margin-top:14px;padding:10px 12px;font-size:12px;font-weight:600"><b>LAST VISIT:</b> Oct 12 · Mid Taper Fade #2 with Kuya Ramil · rated ★★★★★</div>
  <div class="row" style="margin-top:16px"><div class="btn r sm" style="flex:1">No-show</div><div class="btn sm" style="flex:2;font-size:13px;padding:12px">${I('scis', 2.4)} Start (in chair)</div></div>
  </div>`);

// ================= WEB =================
const browser = (url, inner) => `<div class="browser"><div class="chrome"><div class="dt" style="background:#EF4444"></div><div class="dt" style="background:#FFE600"></div><div class="dt" style="background:#22C55E"></div><div class="url">🔒 ${url}</div></div>${inner}</div>`;
const side = (on) => `<div class="side"><div class="logo" style="font-size:22px;margin-bottom:6px">Barber<b>Book</b> PH</div><span class="badge y" style="align-self:flex-start;margin-bottom:12px">Owner · Kings Cut</span>
  ${[['grid', 'Today\'s Queue'], ['walk', 'Walk-in'], ['users', 'Barbers & Hours'], ['scis', 'Style Gallery'], ['chart', 'Reports'], ['star', 'Feedback']].map(([i, t], k) => `<div class="nav ${k === on ? 'on' : ''}">${I(i, 2.4)}${t}</div>`).join('')}
  <div style="flex:1"></div><div class="card" style="padding:12px;background:#E2F1F8;box-shadow:3px 3px 0 #000;font-size:12px;font-weight:600">${av('RM', '#FFE600')}<p style="margin-top:6px"><b>Mang Rudy</b><br>Shop owner</p></div></div>`;

S.w_landing = browser('barberbook.ph', `<div style="flex:1;background:#1E50FF;position:relative;overflow:hidden">
  <div class="dots" style="position:absolute;inset:0;opacity:.16"></div>
  <div class="row sp" style="position:relative;padding:20px 60px;background:#fff;border-bottom:3px solid #000"><div class="logo" style="font-size:26px">Barber<b>Book</b> PH</div><div class="row" style="gap:28px;font-weight:700;font-size:15px"><span>How it works</span><span>Styles</span><span>For barbershops</span><div class="btn sm" style="font-size:13px;padding:10px 18px">Book now →</div></div></div>
  <div style="position:relative;display:flex;padding:56px 60px;gap:40px">
   <div style="flex:1.1;color:#fff"><span class="badge y" style="font-size:14px">🇵🇭 Made for local barbershops</span>
    <h1 style="font-size:78px;line-height:.95;margin-top:22px;letter-spacing:-.04em">No more<br><span style="background:#FFE600;color:#000;padding:0 14px;border:4px solid #000;box-shadow:8px 8px 0 #000;display:inline-block;transform:rotate(-2deg);margin:10px 0">pila.</span><br>Just your cut.</h1>
    <p style="font-size:19px;font-weight:600;margin-top:22px;max-width:560px">Book a slot, pick your barber, and save exactly how you want your hair cut. Your barber reads it before you even sit down.</p>
    <div class="row" style="margin-top:28px;gap:18px"><div class="btn" style="font-size:17px;padding:18px 28px">Book your haircut ${I('arr', 3)}</div><div class="btn w" style="font-size:17px;padding:18px 28px">I own a barbershop</div></div>
    <div class="row" style="margin-top:32px;gap:14px">${[['60 sec', 'to book'], ['0', 'double bookings'], ['12+', 'hairstyles']].map(k => `<div class="card" style="padding:12px 18px;color:#000"><b style="font-size:26px">${k[0]}</b><p style="font-size:12px;font-weight:700;text-transform:uppercase">${k[1]}</p></div>`).join('')}</div></div>
   <div style="flex:.9;position:relative;height:640px">
    <div style="position:absolute;left:20px;top:40px;transform:rotate(-6deg)" class="card"><div style="overflow:hidden;border-radius:12px">${hair('twoblock', 240, '#FEF08A')}</div></div>
    <div style="position:absolute;right:10px;top:0;transform:rotate(5deg)" class="card"><div style="overflow:hidden;border-radius:12px">${hair('midtaper', 260, '#FFE600')}</div></div>
    <div style="position:absolute;left:90px;top:330px;transform:rotate(2deg)" class="card"><div style="overflow:hidden;border-radius:12px">${hair('fringe', 230, '#fff')}</div></div>
    <div style="position:absolute;right:30px;top:340px;width:250px;padding:16px;transform:rotate(-3deg)" class="card"><span class="badge g">Confirmed</span><p style="font-weight:800;font-size:16px;margin-top:8px">Tue · 1:00 PM</p><p style="font-size:13px;font-weight:600">Kuya Ramil · #2 guard</p></div>
    <span class="badge r" style="position:absolute;left:0;top:300px;font-size:16px;transform:rotate(-8deg)">Trending!</span></div></div></div>`);

S.w_book = browser('barberbook.ph/book/kings-cut', `<div style="flex:1;background:#E2F1F8;display:flex;flex-direction:column">
  <div class="row sp" style="padding:16px 40px;background:#FFE600;border-bottom:3px solid #000"><div class="logo" style="font-size:22px">Barber<b>Book</b> PH</div><div style="width:520px">${steps(1).replace('margin:2px 0 14px', 'margin:0')}</div><div class="row">${av('JD', '#fff')}<b>Juan</b></div></div>
  <div style="flex:1;display:flex;gap:28px;padding:28px 40px">
   <div style="flex:1"><div class="row sp"><h2 style="font-size:30px">Choose your style</h2><div class="in" style="width:300px">${I('search', 2.4, '#000', 16)} Search styles…</div></div>
    <div class="row" style="gap:8px;margin:16px 0"><span class="chip on">🔥 Trending</span><span class="chip">Fades</span><span class="chip">Classic</span><span class="chip">Textured</span><span class="chip">Kids</span><span class="chip">All 12</span></div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px">${STY.concat([['part', 'Side Part', '40 min', ''], ['pomp', 'Pompadour', '50 min', '']]).map((s, i) => `<div class="card" style="overflow:hidden;position:relative;${i === 0 ? 'background:#FFE600;box-shadow:6px 6px 0 #1E50FF' : ''}">${s[3] ? `<span class="badge ${s[3] === 'NEW' ? 'g' : 'y'}" style="position:absolute;top:8px;left:8px">${s[3]}</span>` : ''}<div style="border-bottom:2.5px solid #000">${hair(s[0], 232)}</div><div style="padding:9px 12px"><p style="font-weight:800;font-size:14px">${s[1]}</p><p style="font-size:12px" class="mut">${s[2]}</p></div></div>`).join('')}</div></div>
   <div style="width:340px"><div class="card" style="padding:0;overflow:hidden;box-shadow:6px 6px 0 #000"><div style="background:#000;color:#FFE600;padding:12px 16px;font-weight:800;text-transform:uppercase">Your booking</div><div style="padding:14px 16px">
    ${[['Shop', 'Kings Cut Barbershop'], ['Service', 'Haircut + Beard'], ['Style', 'Mid Taper Fade'], ['Barber', '— next step'], ['Schedule', '— step 3']].map(r => `<div class="row sp" style="border-bottom:2px dashed #000;padding:8px 0;font-size:13px"><span class="mut" style="font-weight:600">${r[0]}</span><b>${r[1]}</b></div>`).join('')}
    <div class="row sp" style="margin-top:12px"><h3>Total (sample)</h3><h3 style="font-size:22px">₱220</h3></div><div class="btn" style="margin-top:14px">Continue ${I('arr', 3)}</div><div class="btn w" style="margin-top:10px">${I('cam', 2.4)} Upload my own photo</div></div></div>
    <div class="card" style="margin-top:18px;padding:14px;background:#FEF08A;font-size:13px;font-weight:600"><span class="badge b">Tip</span><p style="margin-top:8px">Your saved usual (Mid Taper, #2) is preselected. Change it anytime.</p></div></div></div></div>`);

const tl = (bk) => { // barber timeline
  const hrs = ['9 AM', '10', '11', '12 PM', '1', '2', '3', '4', '5']; const bs = [['Kuya Ramil', '#FFE600'], ['Jhun', '#FEF08A'], ['Paolo', '#E2F1F8']];
  const top = 44, rowH = 60;
  return `<div class="card" style="padding:0;overflow:hidden;position:relative;height:${top + rowH * 9 + 6}px;display:flex">
   <div style="width:70px;border-right:2.5px solid #000;padding-top:${top}px;background:#fff">${hrs.map(h => `<div style="height:${rowH}px;font-size:11px;font-weight:800;padding:4px 8px;border-top:1.5px dashed #999">${h}</div>`).join('')}</div>
   ${bs.map((b, c) => `<div style="flex:1;border-right:${c < 2 ? '2.5px solid #000' : '0'};position:relative"><div class="row" style="height:${top}px;padding:0 12px;background:${b[1]};border-bottom:2.5px solid #000;font-weight:800;font-size:13px;gap:8px">${av(b[0].split(' ').pop().slice(0, 2).toUpperCase(), '#fff').replace('width:44px;height:44px', '')}${b[0]}</div>
     ${hrs.map(() => `<div style="height:${rowH}px;border-top:1.5px dashed #bbb"></div>`).join('')}
     ${bk.filter(x => x[0] === c).map(x => `<div style="position:absolute;left:8px;right:8px;top:${top + x[1] * rowH + 3}px;height:${x[2] * rowH - 6}px;border:2.5px solid #000;border-radius:9px;box-shadow:3px 3px 0 #000;padding:3px 9px;font-size:11.5px;line-height:1.25;font-weight:700;overflow:hidden;background:${{ d: '#22C55E', i: '#FFE600', c: '#fff', p: '#F59E0B', n: '#EF4444' }[x[4]]};${x[5] ? 'outline:3px solid #1E50FF;outline-offset:2px' : ''}"><div class="row sp"><b>${x[3]}</b>${x[5] ? '<span class="badge r" style="font-size:9px;padding:1px 5px">NEW</span>' : ''}</div><span style="font-size:10.5px">${x[6]}</span></div>`).join('')}</div>`).join('')}
   <div style="position:absolute;left:70px;right:0;top:${top + 3.67 * rowH}px;border-top:3px solid #EF4444"><span style="position:absolute;right:6px;top:-11px;background:#EF4444;color:#fff;font-size:10px;font-weight:800;padding:1px 6px;border:2px solid #000;border-radius:5px">NOW 12:40</span></div></div>`;
};
const RH=52;
const BK = [[0, 0, 1, 'Mark T.', 'd', 0, 'Low Fade'], [0, 1, .75, 'Aldrin R.', 'd', 0, 'Skin Fade'], [0, 2, 1, 'Renz P.', 'd', 0, 'Crew Cut'], [0, 4, .75, 'Juan D.', 'c', 1, 'Mid Taper #2'], [0, 5.5, .75, 'Migs D.', 'c', 0, 'Two Block'], [0, 7, 1, 'Ian G.', 'c', 0, 'Mullet'],
  [1, 1, .75, 'Josh T.', 'd', 0, 'Side Part'], [1, 2.5, .5, 'Walk-in', 'd', 0, 'Haircut'], [1, 3.25, 1, 'Paulo V.', 'i', 0, 'Pompadour · in chair'], [1, 6, .75, 'JM C.', 'c', 0, 'Crop'], [1, 8, .5, 'Walk-in', 'p', 0, 'Beard trim'],
  [2, 0, .5, 'Kevin S.', 'n', 0, 'No-show'], [2, 2, 1, 'Carlo M.', 'd', 0, 'Two Block'], [2, 4.5, .5, 'Rafael B.', 'c', 0, 'Kids cut'], [2, 5, 1, 'Leo A.', 'c', 0, 'Fringe'], [2, 7.5, .75, 'Ben F.', 'c', 0, 'Buzz']];

S.w_queue = browser('barberbook.ph/owner/queue', `<div class="wbody">${side(0)}<div class="main">
  <div class="row sp"><div><span class="badge">Tuesday, Nov 10, 2026</span><h2 style="font-size:30px;margin-top:6px">Today's queue</h2></div><div class="row"><div class="seg" style="width:220px;background:#fff"><div class="on">Timeline</div><div>List</div></div><div class="btn k">${I('walk', 2.4, '#FFE600')} Add walk-in</div></div></div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin:18px 0">${[['16', 'Bookings today', '#FFE600', '+3 vs last Tue'], ['5', 'Open slots left', '#fff', 'until 7 PM'], ['1', 'In chair now', '#fff', 'Paolo V. · Jhun'], ['2', 'No-shows this week', '#fff', '4% of bookings']].map(k => `<div class="card kpi" style="background:${k[2]}"><div class="k">${k[1]}</div><div class="n">${k[0]}</div><div style="font-size:11.5px;font-weight:600" class="mut">${k[3]}</div></div>`).join('')}</div>
  ${tl(BK)}
  <div class="card" style="position:absolute;right:40px;bottom:30px;width:330px;padding:14px;background:#FEF08A;box-shadow:6px 6px 0 #000;transform:rotate(1.5deg)"><div class="row sp"><span class="badge r">New booking</span><span style="font-size:11px;font-weight:700">just now</span></div><p style="font-weight:800;margin-top:8px">Juan Dela Cruz · 1:00 PM</p><p style="font-size:12px;font-weight:600">Mid Taper Fade #2 · Kuya Ramil · booked online</p></div>
  </div></div>`);

S.w_pcard = browser('barberbook.ph/owner/queue/BB-2026-00148', `<div class="wbody">${side(0)}<div class="main" style="padding:0">
  <div style="position:absolute;inset:0;padding:24px 28px;opacity:.35;filter:grayscale(.3)">${tl(BK)}</div><div style="position:absolute;inset:0;background:rgba(0,0,0,.35)"></div>
  <div style="position:absolute;top:0;right:0;bottom:0;width:640px;background:#fff;border-left:4px solid #000;box-shadow:-10px 0 0 #000;padding:26px 30px;overflow:hidden">
   <div class="row sp"><span class="badge r" style="font-size:15px">Read this before the cut!</span><div class="back">✕</div></div>
   <div class="row" style="margin-top:18px">${av('JD', '#FFE600').replace('44px;height:44px', '60px;height:60px')}<div style="flex:1"><h2 style="font-size:26px">Juan Dela Cruz</h2><p style="font-weight:600;font-size:13px" class="mut">1:00 – 1:45 PM · Kuya Ramil · Haircut + Beard · 7th visit</p></div><span class="st c" style="font-size:13px">Confirmed</span></div>
   <div style="display:flex;gap:18px;margin-top:20px"><div class="card" style="overflow:hidden;box-shadow:5px 5px 0 #000">${hair('midtaper', 250)}<p style="padding:8px 12px;font-weight:800;border-top:2.5px solid #000;text-transform:uppercase">Mid Taper Fade</p></div>
    <div style="flex:1;display:flex;flex-direction:column;gap:12px"><div class="card" style="background:#FFE600;padding:10px;text-align:center"><small style="font-weight:800;font-size:11px">SIDES · GUARD</small><div style="font-size:64px;font-weight:900;line-height:1">#2</div></div>
     ${[['Top', 'Keep it long (scissor only)'], ['Beard', 'Line-up only'], ['Extras', 'No product · Hard part']].map(r => `<div class="card" style="padding:8px 12px;box-shadow:3px 3px 0 #000"><small style="font-weight:800;font-size:10.5px;text-transform:uppercase" class="mut">${r[0]}</small><p style="font-weight:800;font-size:14px">${r[1]}</p></div>`).join('')}</div></div>
   <div style="background:#FEF08A;border:3px solid #000;padding:14px 16px;margin-top:20px;box-shadow:5px 5px 0 #000;transform:rotate(-.8deg);font-weight:700;font-size:16px">📝 "Please don't cut the top too short. May cowlick sa likod."</div>
   <div class="card" style="margin-top:18px;padding:12px 14px;font-size:13px;font-weight:600;background:#E2F1F8"><b>HISTORY:</b> Oct 12 Mid Taper #2 ★★★★★ · Sep 14 Mid Taper #2 ★★★★★ · Aug 20 Two Block (no-show)</div>
   <div class="row" style="margin-top:22px;gap:14px"><div class="btn r" style="flex:1">No-show</div><div class="btn w" style="flex:1">Reschedule</div><div class="btn" style="flex:2;font-size:16px">${I('scis', 2.6)} Start · in chair</div></div></div>
  </div></div>`);

S.w_walkin = browser('barberbook.ph/owner/walk-in', `<div class="wbody">${side(1)}<div class="main"><h2 style="font-size:30px">Add a walk-in</h2><p style="font-weight:600;margin-top:4px" class="mut">Walk-ins block the slot so online customers can't book it.</p>
  <div style="display:flex;gap:26px;margin-top:22px"><div class="card" style="flex:1.2;padding:24px;box-shadow:6px 6px 0 #000">
   <p class="lbl">Customer name</p><div class="in">Walk-in guest <span class="mut" style="margin-left:auto;font-size:11px">(optional)</span></div>
   <p class="lbl" style="margin-top:16px">Service</p><div class="row" style="gap:10px;flex-wrap:wrap"><span class="chip on" style="font-size:13px;padding:9px 14px">Haircut · 30 min</span><span class="chip" style="font-size:13px;padding:9px 14px">Haircut + Beard · 45</span><span class="chip" style="font-size:13px;padding:9px 14px">Kids · 25</span><span class="chip" style="font-size:13px;padding:9px 14px">Beard only · 15</span></div>
   <p class="lbl" style="margin-top:16px">Style (optional)</p><div class="row" style="gap:10px">${['crew', 'lowfade', 'buzz', 'part', 'kids'].map((h, i) => `<div class="card" style="overflow:hidden;box-shadow:3px 3px 0 #000;${i === 1 ? 'outline:3px solid #1E50FF;outline-offset:2px' : ''}">${hair(h, 88)}</div>`).join('')}</div>
   <p class="lbl" style="margin-top:16px">Barber</p><div class="seg"><div class="on">First available</div><div>Kuya Ramil</div><div>Jhun</div><div>Paolo</div></div>
   <p class="lbl" style="margin-top:16px">When</p><div class="row"><div class="seg" style="width:220px"><div class="on">Now</div><div>Pick time</div></div><div class="in" style="flex:1;background:#E2F1F8;font-weight:700">⏱ Next free: <b>1:30 PM · Jhun</b> (auto-assigned)</div></div>
   <div class="btn k" style="margin-top:22px;font-size:16px">${I('plus', 3, '#FFE600')} Add to queue</div></div>
   <div style="flex:1"><div class="card" style="padding:18px;background:#FFE600"><h3>Right now</h3><div class="row" style="margin-top:12px;gap:12px">${[['2', 'waiting'], ['1', 'in chair'], ['~15 min', 'est. wait']].map(k => `<div class="card" style="flex:1;padding:10px;text-align:center;box-shadow:3px 3px 0 #000"><b style="font-size:22px">${k[0]}</b><p style="font-size:11px;font-weight:700;text-transform:uppercase">${k[1]}</p></div>`).join('')}</div></div>
    <div class="card" style="padding:18px;margin-top:20px"><h3 style="font-size:15px">Walk-ins today</h3>${[['9:40', 'Walk-in guest', 'Haircut · Jhun', 'd', 'Done'], ['11:15', 'Tomas L.', 'Kids · Paolo', 'd', 'Done'], ['1:30', 'Walk-in guest', 'Beard · Jhun', 'p', 'Waiting']].map(q => `<div class="row" style="border-bottom:2px dashed #000;padding:10px 0"><b style="width:52px">${q[0]}</b><div style="flex:1"><b style="font-size:13px">${q[1]}</b><p style="font-size:11.5px" class="mut">${q[2]}</p></div><span class="st ${q[3]}">${q[4]}</span></div>`).join('')}</div></div></div></div></div>`);

S.w_barbers = browser('barberbook.ph/owner/barbers', `<div class="wbody">${side(2)}<div class="main"><div class="row sp"><h2 style="font-size:30px">Barbers & hours</h2><div class="btn">${I('plus', 3)} Add barber</div></div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:22px">${[['KR', 'Kuya Ramil', 'Fades, skin fade', '#FFE600', [1, 1, 1, 1, 1, 1, 0], '9:00 AM', '6:00 PM', '12:00 PM', 0, '4.9', '142'], ['JH', 'Jhun', 'Classic, scissor cut', '#FEF08A', [1, 1, 1, 0, 1, 1, 1], '10:00 AM', '7:00 PM', '1:00 PM', 0, '4.6', '118'], ['PA', 'Paolo', 'Textured, two block, kids', '#E2F1F8', [0, 1, 1, 1, 1, 1, 1], '9:00 AM', '5:00 PM', '12:00 PM', 1, '4.7', '96']].map(b => `<div class="card" style="padding:0;overflow:hidden;box-shadow:6px 6px 0 #000">
   <div class="row" style="background:${b[3]};padding:16px;border-bottom:2.5px solid #000">${av(b[0], '#fff')}<div style="flex:1"><h3 style="font-size:18px">${b[1]}</h3><p style="font-size:12px;font-weight:600">${b[2]}</p></div><span class="badge p">★ ${b[9]}</span></div>
   <div style="padding:16px"><p class="lbl">Working days</p><div class="row" style="gap:6px">${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => `<div class="sq" style="width:34px;height:34px;font-weight:800;font-size:13px;background:${b[4][i] ? '#000' : '#fff'};color:${b[4][i] ? '#FFE600' : '#000'}">${d}</div>`).join('')}</div>
    <div class="row" style="margin-top:14px;gap:10px"><div style="flex:1"><p class="lbl">Start</p><div class="in">${b[5]} ▾</div></div><div style="flex:1"><p class="lbl">End</p><div class="in">${b[6]} ▾</div></div></div>
    <p class="lbl" style="margin-top:14px">Break</p><div class="in">${b[7]} · 60 min ▾</div>
    <div class="row sp" style="margin-top:16px;border:2px solid #000;border-radius:10px;padding:10px 12px;${b[8] ? 'background:#FEF08A' : ''}"><b style="font-size:13px">Day off today</b><div class="tog ${b[8] ? 'on' : ''}"></div></div>
    <p style="font-size:12px;font-weight:600;margin-top:12px" class="mut">${b[10]} cuts this month</p></div></div>`).join('')}</div>
  <div class="card" style="margin-top:22px;padding:14px 18px;background:#1E50FF;color:#fff;font-weight:700" class="row">⚡ Changes update the customer booking calendar instantly.</div></div></div>`);

S.w_styles = browser('barberbook.ph/owner/styles', `<div class="wbody">${side(3)}<div class="main"><div class="row sp"><div><h2 style="font-size:30px">Style gallery</h2><p style="font-weight:600" class="mut">What customers see when they choose a haircut.</p></div><div class="row"><div class="in" style="width:240px">${I('search', 2.4, '#000', 16)} Search…</div><div class="btn">${I('plus', 3)} Add style</div></div></div>
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:18px;margin-top:20px">${[['midtaper', 'Mid Taper Fade', 1, 1, 48], ['twoblock', 'Two Block', 1, 1, 37], ['fringe', 'Textured Fringe', 1, 1, 29], ['mullet', 'Modern Mullet', 1, 1, 12], ['crop', 'French Crop', 0, 1, 21], ['buzz', 'Buzz Cut', 0, 1, 18], ['part', 'Side Part', 0, 1, 15], ['pomp', 'Pompadour', 0, 0, 3], ['lowfade', 'Low Fade', 0, 1, 26], ['kids', 'Kids\' Cut', 0, 1, 14]].map(s => `<div class="card" style="overflow:hidden;${s[3] ? '' : 'opacity:.55'}"><div style="position:relative;border-bottom:2.5px solid #000">${hair(s[0], 198)}${s[2] ? '<span class="badge y" style="position:absolute;top:8px;left:8px">Trending</span>' : ''}${s[3] ? '' : '<span class="badge k" style="position:absolute;top:8px;right:8px">Hidden</span>'}</div>
   <div style="padding:9px 11px"><p style="font-weight:800;font-size:13.5px">${s[1]}</p><p style="font-size:11px;font-weight:600" class="mut">${s[4]} bookings this month</p>
   <div class="row sp" style="margin-top:7px;font-size:11px;font-weight:700"><span class="row" style="gap:5px">🔥<div class="tog ${s[2] ? 'on' : ''}" style="transform:scale(.75);margin:-4px"></div></span><span class="row" style="gap:5px">👁<div class="tog ${s[3] ? 'on' : ''}" style="transform:scale(.75);margin:-4px"></div></span></div></div></div>`).join('')}</div></div></div>`);

const bars = (data, w, h, color, max) => { const bw = w / data.length; return `<svg width="${w}" height="${h + 30}" style="display:block">${data.map((d, i) => { const bh = d[1] / max * h; return `<rect x="${i * bw + 8}" y="${h - bh}" width="${bw - 16}" height="${bh}" fill="${d[2] || color}" stroke="#000" stroke-width="2.5"/><text x="${i * bw + bw / 2}" y="${h - bh - 7}" text-anchor="middle" font-size="13" font-weight="800" font-family="Poppins">${d[1]}</text><text x="${i * bw + bw / 2}" y="${h + 20}" text-anchor="middle" font-size="12" font-weight="700" font-family="Poppins">${d[0]}</text>`; }).join('')}<line x1="0" y1="${h}" x2="${w}" y2="${h}" stroke="#000" stroke-width="3"/></svg>`; };
const hbars = (data, w, max) => data.map(d => `<div class="row" style="margin-bottom:9px;gap:10px"><b style="width:120px;font-size:12.5px">${d[0]}</b><div style="flex:1;height:26px;position:relative"><div style="width:${d[1] / max * 100}%;height:100%;background:${d[2]};border:2.5px solid #000;box-shadow:2px 2px 0 #000"></div></div><b style="width:30px;font-size:13px">${d[1]}</b></div>`).join('');

S.w_reports = browser('barberbook.ph/owner/reports', `<div class="wbody">${side(4)}<div class="main"><div class="row sp"><h2 style="font-size:30px">Reports</h2><div class="row"><div class="seg" style="background:#fff;width:330px"><div class="on">This week</div><div>Last week</div><div>Month</div></div><div class="btn w">${I('down', 2.6)} Export CSV</div></div></div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin:18px 0">${[['94', 'Bookings', '#FFE600'], ['87%', 'Completed', '#fff'], ['4%', 'No-show rate', '#fff'], ['₱18.9k', 'Est. sales (sample)', '#fff']].map(k => `<div class="card kpi" style="background:${k[2]}"><div class="k">${k[1]}</div><div class="n">${k[0]}</div></div>`).join('')}</div>
  <div style="display:grid;grid-template-columns:1.25fr 1fr;gap:20px">
   <div class="card" style="padding:18px"><h3 style="font-size:15px;margin-bottom:12px">Bookings per day</h3>${bars([['Mon', 11], ['Tue', 16, '#FFE600'], ['Wed', 9], ['Thu', 12], ['Fri', 15], ['Sat', 19], ['Sun', 12]], 600, 190, '#1E50FF', 23)}</div>
   <div class="card" style="padding:18px"><h3 style="font-size:15px;margin-bottom:14px">Per barber</h3>${hbars([['Kuya Ramil', 38, '#FFE600'], ['Jhun', 31, '#1E50FF'], ['Paolo', 25, '#FEF08A']], 400, 40)}<h3 style="font-size:15px;margin:16px 0 12px">Top styles</h3>${hbars([['Mid Taper', 24, '#FFE600'], ['Two Block', 17, '#1E50FF'], ['Fringe', 12, '#FEF08A']], 400, 26)}</div>
   <div class="card" style="padding:18px;grid-column:1/3"><div class="row sp"><h3 style="font-size:15px">Busiest hours</h3><div class="row" style="gap:6px;font-size:11px;font-weight:700">Less ${['#fff', '#b9c9ff', '#6b8bff', '#1E50FF'].map(c => `<div style="width:18px;height:18px;border:2px solid #000;background:${c}"></div>`).join('')} More</div></div>
    <div style="display:grid;grid-template-columns:60px repeat(10,1fr);gap:5px;margin-top:10px;font-size:11px;font-weight:800">${['', '9', '10', '11', '12', '1', '2', '3', '4', '5', '6'].map(h => `<div style="text-align:center">${h}</div>`).join('')}${['Mon', 'Tue', 'Wed', 'Sat'].map((d, r) => `<div>${d}</div>` + Array.from({ length: 10 }, (_, c) => { const v = (r * 7 + c * 3 + (c > 6 ? 3 : 0) + (r === 3 ? 2 : 0)) % 4; return `<div style="height:24px;border:2px solid #000;background:${['#fff', '#b9c9ff', '#6b8bff', '#1E50FF'][v]}"></div>`; }).join('')).join('')}</div></div></div></div></div>`);

S.w_feedback = browser('barberbook.ph/owner/feedback', `<div class="wbody">${side(5)}<div class="main"><h2 style="font-size:30px">Customer feedback</h2>
  <div style="display:flex;gap:22px;margin-top:20px"><div style="width:340px"><div class="card" style="padding:22px;background:#FFE600;text-align:center;box-shadow:6px 6px 0 #000"><div style="font-size:72px;font-weight:900;line-height:1">4.8</div><div style="font-size:26px">★★★★★</div><p style="font-weight:700">from 126 ratings</p></div>
   <div class="card" style="padding:18px;margin-top:20px">${[[5, 98], [4, 21], [3, 5], [2, 1], [1, 1]].map(r => `<div class="row" style="gap:8px;margin-bottom:8px"><b style="width:26px">${r[0]}★</b><div style="flex:1;height:18px;border:2px solid #000"><div style="width:${r[1] / 98 * 100}%;height:100%;background:#1E50FF"></div></div><b style="width:28px;font-size:12px">${r[1]}</b></div>`).join('')}</div>
   <div class="card" style="padding:16px;margin-top:20px"><p class="lbl">Top tags</p><div class="row" style="flex-wrap:wrap;gap:7px"><span class="chip on">Exactly what I asked · 64</span><span class="chip">On time · 51</span><span class="chip">Sulit · 47</span><span class="chip">Friendly · 33</span></div></div></div>
   <div style="flex:1;display:grid;grid-template-columns:1fr 1fr;gap:18px;align-content:start">${[['Juan D.', 5, 'Hindi na ako naghintay. Tamang-tama yung fade, galing!', 'Kuya Ramil', 'Mid Taper', '#FEF08A', -1], ['Carlo M.', 5, 'Sulit! Nabasa ni Paolo yung notes ko, perfect two block.', 'Paolo', 'Two Block', '#fff', 1], ['Josh T.', 4, 'Smooth booking. Konting delay lang ng 5 mins.', 'Jhun', 'Side Part', '#fff', 0], ['Aldrin R.', 5, 'First time ko mag-book online sa barbershop. Ang dali!', 'Kuya Ramil', 'Skin Fade', '#fff', -1], ['Renz P.', 5, 'Saved na yung #2 guard ko, di ko na kailangan i-explain.', 'Kuya Ramil', 'Crew Cut', '#FFE600', 1], ['Migs D.', 4, 'Clean shop, friendly. Sana may Sunday slot si Ramil.', 'Jhun', 'Two Block', '#fff', 0]].map(f => `<div class="card" style="padding:16px;background:${f[5]};transform:rotate(${f[6] * .6}deg)"><div class="row sp"><div class="row">${av(f[0].slice(0, 2).toUpperCase(), '#E2F1F8')}<div><b>${f[0]}</b><p style="font-size:14px">${'★'.repeat(f[1])}${'☆'.repeat(5 - f[1])}</p></div></div><span class="badge p">${f[4]}</span></div><p style="font-weight:600;font-size:14px;margin-top:10px">"${f[2]}"</p><p style="font-size:11.5px;font-weight:700;margin-top:8px" class="mut">Barber: ${f[3]} · Nov 2026</p></div>`).join('')}</div></div></div></div>`);

// design system sheet
S.ds = `<div style="width:1500px;background:#fff;border:4px solid #000;border-radius:18px;box-shadow:14px 14px 0 #000;padding:34px;display:grid;grid-template-columns:1fr 1fr;gap:34px">
 <div><p class="lbl">Colors</p><div class="row" style="gap:12px">${[['#1E50FF', 'Cobalt', '#fff'], ['#FFE600', 'Yellow'], ['#FEF08A', 'Soft yellow'], ['#E2F1F8', 'Ice'], ['#000', 'Ink', '#fff'], ['#22C55E', 'Success'], ['#EF4444', 'Danger', '#fff'], ['#F59E0B', 'Pending']].map(c => `<div style="text-align:center"><div class="card" style="width:74px;height:74px;background:${c[0]}"></div><p style="font-size:11px;font-weight:800;margin-top:8px">${c[1]}</p><p style="font-size:10px" class="mut">${c[0]}</p></div>`).join('')}</div>
  <p class="lbl" style="margin-top:28px">Typography</p><h1 style="font-size:54px;line-height:1">Book your cut.</h1><p style="font-size:18px;font-weight:600;margin-top:6px">Body text · Medium 500–600 · high contrast</p><p style="font-size:13px" class="mut">Headings: ExtraBold 800–900, uppercase, tight tracking (-0.02em)</p>
  <p class="lbl" style="margin-top:28px">Shadows & borders</p><div class="row" style="gap:22px">${[2, 4, 6, 8].map(n => `<div class="card" style="width:90px;height:64px;box-shadow:${n}px ${n}px 0 #000;display:flex;align-items:center;justify-content:center;font-weight:800">${n}px</div>`).join('')}</div></div>
 <div><p class="lbl">Buttons</p><div class="row" style="gap:14px;flex-wrap:wrap"><div class="btn">Primary ${I('arr', 3)}</div><div class="btn w">Secondary</div><div class="btn k">Dark</div><div class="btn r">Cancel</div><div class="btn" style="transform:translate(-2px,-2px);box-shadow:6px 6px 0 #000">Hover ↗</div><div class="btn" style="transform:translate(2px,2px);box-shadow:1px 1px 0 #000">Pressed ↘</div></div>
  <p class="lbl" style="margin-top:24px">Chips, badges & status</p><div class="row" style="gap:8px;flex-wrap:wrap"><span class="chip on">Selected</span><span class="chip">Chip</span><span class="badge">Your usual</span><span class="badge g p">Open now</span><span class="badge r">New</span><span class="st c">Confirmed</span><span class="st i">In chair</span><span class="st d">Done</span><span class="st p">Pending</span><span class="st n">No-show</span></div>
  <p class="lbl" style="margin-top:24px">Inputs & controls</p><div class="row" style="gap:14px;flex-wrap:wrap"><div class="in" style="width:220px">${I('search', 2.4, '#000', 16)} Search…</div><div class="in" style="width:200px;background:#FFFAEC;outline:2px solid #000;outline-offset:2px">Focused input</div><div class="stp"><div>−</div><div>#2</div><div>+</div></div><div class="tog on"></div><div class="tog"></div></div>
  <div class="seg" style="margin-top:16px;width:360px"><div>Short</div><div>Medium</div><div class="on">Keep it long</div></div>
  <p class="lbl" style="margin-top:24px">Time slots</p><div class="slots" style="width:360px"><div class="slot">9:00<small>&nbsp;</small></div><div class="slot on">1:00<small>Selected</small></div><div class="slot x">2:00<small>Taken</small></div></div></div></div>`;

document.body.innerHTML = Object.entries(S).map(([k, v]) => shot(k, v)).join('');
