// BarberBook PH — Neo-Brutalist deck. Shapes carry objectName "anim:<step>:<effect>:<slot>" for the animation post-processor.
const pptxgen = require('pptxgenjs');
const React = require('react');
const RDS = require('react-dom/server');
const sharp = require('sharp');
const fa = require('react-icons/fa6');
const fs = require('fs');

const BLUE = '1E50FF', YEL = 'FFE600', YSOFT = 'FEF08A', ICE = 'E2F1F8', BLK = '000000', WHT = 'FFFFFF', GRN = '22C55E', RED = 'EF4444', GRAY = '333333';
const F = 'Arial';
const W = 13.333;

const iconCache = {};
async function icon(name, color) {
  const k = name + color; if (iconCache[k]) return iconCache[k];
  const svg = RDS.renderToStaticMarkup(React.createElement(fa[name], { color: '#' + color, size: 256 }));
  return (iconCache[k] = 'image/png;base64,' + (await sharp(Buffer.from(svg)).png().toBuffer()).toString('base64'));
}
const sh = (o = 5) => ({ type: 'outer', color: BLK, blur: 0, offset: o, angle: 45, opacity: 1 });
const A = (step, eff = 'float', slot = 0) => `anim:${step}:${eff}:${slot}`;
const border = (w = 2.25) => ({ color: BLK, width: w });
function imgSize(p) { const b = fs.readFileSync(p); return [b.readUInt32BE(16), b.readUInt32BE(20)]; }

(async () => {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.title = 'BarberBook PH Preliminary Presentation';
  const RR = pres.shapes.ROUNDED_RECTANGLE;

  const card = (s, o) => s.addShape(RR, { x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: o.r ?? 0.12, fill: { color: o.fill || WHT }, line: border(o.bw), shadow: o.noShadow ? undefined : sh(o.so || 5), objectName: o.tag, rotate: o.rot });
  const txt = (s, t, o) => s.addText(t, { fontFace: F, color: BLK, margin: 0, valign: 'top', isTextBox: true, ...o });
  const badge = (s, t, o) => s.addText(t, {
    x: o.x, y: o.y, w: o.w, h: o.h || 0.42, shape: RR, rectRadius: 0.08, fill: { color: o.fill || YSOFT }, line: border(2), shadow: sh(3),
    rotate: o.rot ?? -3, fontFace: F, fontSize: o.fs || 12, bold: true, color: o.color || BLK, align: 'center', valign: 'middle', margin: 0, objectName: o.tag, isTextBox: true,
  });
  const iconDot = async (s, name, x, y, d, tag, bg = YEL, fg = BLK) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: bg }, line: border(2), objectName: tag });
    s.addImage({ data: await icon(name, fg), x: x + d * 0.26, y: y + d * 0.26, w: d * 0.48, h: d * 0.48, objectName: tag });
  };
  const header = (s, badgeText, title, sub, dark) => {
    badge(s, badgeText, { x: 0.6, y: 0.35, w: Math.max(1.6, badgeText.length * 0.13 + 0.5), fill: dark ? YEL : YEL, rot: -3, tag: A(0, 'zoom') });
    txt(s, title.toUpperCase(), { x: 0.6, y: 0.9, w: 12.1, h: 0.75, fontSize: 32, bold: true, color: dark ? WHT : BLK, valign: 'middle' });
    if (sub) txt(s, sub, { x: 0.6, y: 1.62, w: 12.1, h: 0.4, fontSize: 15, color: dark ? 'DCE6FF' : GRAY });
  };
  const src = (s, t, dark) => txt(s, t, { x: 0.6, y: 7.0, w: 12.1, h: 0.3, fontSize: 9.5, italic: true, color: dark ? 'DCE6FF' : GRAY });
  const hl = (t, o = {}) => ({ text: t, options: { highlight: 'FFFF00', color: BLK, ...o } });
  const arrowLine = (s, x1, y1, x2, y2, tag, w = 3) => s.addShape(pres.shapes.LINE, {
    x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.max(Math.abs(x2 - x1), 0.001), h: Math.max(Math.abs(y2 - y1), 0.001),
    flipH: x2 < x1, flipV: y2 < y1, line: { color: BLK, width: w, endArrowType: 'triangle' }, objectName: tag,
  });

  // ============ 1. TITLE ============
  let s = pres.addSlide(); s.background = { color: BLUE };
  s.addImage({ path: 'img/nb_hero.jpg', x: 6.45, y: 0.3, w: 6.9, h: 6.9, objectName: A(1, 'zoom') });
  badge(s, 'CAPSTONE PROPOSAL  ·  PRELIMINARY', { x: 0.6, y: 0.7, w: 4.1, fill: YEL, rot: -3, tag: A(2, 'zoom') });
  s.addText([{ text: 'BARBERBOOK', options: { breakLine: true } }, { text: 'PH', options: { color: BLUE } }], {
    x: 0.6, y: 1.35, w: 5.6, h: 2.05, shape: RR, rectRadius: 0.12, fill: { color: WHT }, line: border(3), shadow: sh(8),
    fontFace: F, fontSize: 48, bold: true, color: BLK, margin: 14, valign: 'middle', objectName: A(3, 'float'), isTextBox: true,
  });
  s.addText('An Online Appointment and Haircut Preference System for Local Barbershops', {
    x: 0.6, y: 3.7, w: 5.6, h: 1.05, shape: RR, rectRadius: 0.1, fill: { color: YEL }, line: border(2.5), shadow: sh(5),
    fontFace: F, fontSize: 18, bold: true, color: BLK, margin: 10, valign: 'middle', objectName: A(4, 'float'), isTextBox: true,
  });
  txt(s, [
    { text: 'PROPONENTS', options: { bold: true, color: YEL, breakLine: true, fontSize: 12 } },
    hl('[Member 1]  ·  [Member 2]  ·  [Member 3]  ·  [Member 4]', { breakLine: true }),
    { text: ' ', options: { breakLine: true, fontSize: 6 } },
    { text: 'ADVISER', options: { bold: true, color: YEL, breakLine: true, fontSize: 12 } },
    hl('[Name of Adviser]', { breakLine: true }),
    { text: ' ', options: { breakLine: true, fontSize: 6 } },
    hl('[College / Department], [Name of School]', { breakLine: true }),
    { text: 'October 2026', options: { color: 'DCE6FF' } },
  ], { x: 0.6, y: 5.05, w: 5.6, h: 2.1, fontSize: 13, color: WHT, objectName: A(5, 'fade') });
  s.addNotes('Good [morning/afternoon]. We are [group name/members], and our proposed capstone project is BarberBook PH, an online appointment and haircut preference system for local barbershops. The look you see here, cobalt blue, yellow, thick black outlines, is the actual theme we will use for the website itself.');

  // ============ 2. PROBLEM ============
  s = pres.addSlide(); s.background = { color: ICE };
  header(s, 'THE PROBLEM', 'What we saw at the barbershop', 'Walk-ins, chat reservations, and a notebook are still the "system" in most local shops');
  card(s, { x: 0.6, y: 2.2, w: 6.1, h: 3.95, tag: A(1, 'zoom') });
  s.addImage({ path: 'img/nb_waiting.png', x: 0.72, y: 2.32, w: 5.86, h: 5.86 * 1280 / 2000, objectName: A(1, 'zoom') });
  const probs = [
    ['FaHourglassHalf', 'Long, uncertain waiting', '1 to 2 hours on weekends, paydays, and before fiestas.'],
    ['FaCalendarXmark', 'Overlapping reservations', 'Messenger and text bookings get buried and clash.'],
    ['FaCommentDots', 'Hard to explain the haircut', '"Semi-kalbo," "yung dati lang po." Nothing is written down.'],
    ['FaBellSlash', 'Forgotten appointments', 'No confirmation or reminder, so slots go to waste.'],
    ['FaBookOpen', 'No organized customer records', 'No easy view of regulars or the most requested barber.'],
  ];
  for (let i = 0; i < probs.length; i++) {
    const y = 2.2 + i * 0.83, t = A(2, 'float', i);
    card(s, { x: 7.1, y, w: 5.6, h: 0.68, r: 0.1, so: 4, tag: t });
    await iconDot(s, probs[i][0], 7.2, y + 0.09, 0.5, t);
    txt(s, [{ text: probs[i][1].toUpperCase(), options: { bold: true, fontSize: 12.5, breakLine: true } }, { text: probs[i][2], options: { fontSize: 11, color: GRAY } }],
      { x: 7.85, y: y + 0.07, w: 4.75, h: 0.58, objectName: t });
  }
  src(s, 'Based on the proponents\' initial observation. Replace the waiting-time figure with your actual interview data from the partner barbershop.');
  s.addNotes('These are the five problems we observed. [Share one real story from your interview here.] The third one, explaining the haircut, is the one most booking systems ignore. That is our main selling point.');

  // ============ 3. WHY NOW ============
  s = pres.addSlide(); s.background = { color: ICE };
  header(s, 'WHY NOW', 'Why this matters now', 'Customers are already online, and barbershops are part of the MSME backbone');
  const stats = [['98M', 'internet users in the Philippines', '83.8% of the population', 'Kemp (2026)', YEL], ['137M', 'cellular mobile connections', 'more connections than people', 'Kemp (2026)', WHT], ['99.63%', 'of PH businesses are MSMEs', '1,241,733 of 1,246,373 (2023)', 'DTI (n.d.)', WHT], ['90.43%', 'are micro enterprises', 'small budgets, no room for paid software', 'DTI (n.d.)', YEL]];
  stats.forEach((st, i) => {
    const x = 0.6 + i * 3.1, t = A(1, 'zoom', i);
    card(s, { x, y: 2.25, w: 2.8, h: 3.0, fill: st[4], so: 6, tag: t });
    txt(s, st[0], { x: x + 0.22, y: 2.45, w: 2.4, h: 0.95, fontSize: 42, bold: true, objectName: t, valign: 'middle' });
    txt(s, st[1].toUpperCase(), { x: x + 0.22, y: 3.45, w: 2.4, h: 0.75, fontSize: 13, bold: true, objectName: t });
    txt(s, st[2], { x: x + 0.22, y: 4.2, w: 2.4, h: 0.55, fontSize: 11.5, color: GRAY, objectName: t });
    badge(s, st[3], { x: x + 1.2, y: 4.95, w: 1.45, h: 0.36, fs: 10, fill: WHT, rot: 3, tag: t });
  });
  s.addText([{ text: 'SO WHAT?  ', options: { bold: true, color: YEL } }, { text: 'Filipinos already book rides, food, and bills on their phones. A free, web-based booking tool fits both the customer\'s habits and the owner\'s budget.' }], {
    x: 0.6, y: 5.75, w: 12.1, h: 0.95, shape: RR, rectRadius: 0.1, fill: { color: BLUE }, line: border(2.5), shadow: sh(5), fontFace: F, fontSize: 15.5, color: WHT, margin: 12, valign: 'middle', objectName: A(2, 'float'), isTextBox: true,
  });
  src(s, 'Sources: Kemp, S. (2026). Digital 2026: The Philippines. DataReportal. | Department of Trade and Industry. (n.d.). 2023 Philippine MSME statistics.');
  s.addNotes('These numbers come from DataReportal and the DTI. Customers are ready for online booking, and barbershops are micro enterprises that need something affordable.');

  // ============ 4. INTRODUCING ============
  s = pres.addSlide(); s.background = { color: BLUE };
  header(s, 'MEET THE SYSTEM', 'Introducing BarberBook PH', null, true);
  card(s, { x: 0.6, y: 1.85, w: 5.5, h: 5.0, so: 7, tag: A(1, 'float') });
  txt(s, 'A mobile-friendly website where customers book a slot, pick their barber, and save exactly how they want their hair cut, before they even arrive.', { x: 0.9, y: 2.05, w: 4.95, h: 1.15, fontSize: 15, bold: true, objectName: A(1, 'float') });
  const intro = [['FaCalendarCheck', 'Book a real time slot', 'Taken slots are hidden. No double booking.'], ['FaScissors', 'Choose a style from photos', 'Trending, fades, classic, textured, or upload.'], ['FaUserCheck', 'Save your preferences', 'Guard no., length on top, beard trim, notes.'], ['FaChartColumn', 'Owner dashboard', 'Daily queue, schedules, booking reports.']];
  for (let i = 0; i < intro.length; i++) {
    const y = 3.3 + i * 0.86, t = A(2, 'float', i);
    await iconDot(s, intro[i][0], 0.9, y, 0.55, t);
    txt(s, [{ text: intro[i][1].toUpperCase(), options: { bold: true, fontSize: 12.5, breakLine: true } }, { text: intro[i][2], options: { fontSize: 11.5, color: GRAY } }], { x: 1.6, y: y + 0.02, w: 4.3, h: 0.75, objectName: t });
  }
  const [pw, ph] = imgSize('img/nb_screen1.png'); const scrH = 4.75, scrW = scrH * pw / ph;
  [['img/nb_screen1.png', 6.55, 2.05], ['img/nb_screen2.png', 8.7, 1.75], ['img/nb_screen6.png', 10.85, 2.05]].forEach(([p, x, y], i) => s.addImage({ path: p, x, y, w: scrW, h: scrH, objectName: A(3, 'float', i) }));
  badge(s, 'NO DOWNLOAD NEEDED', { x: 10.35, y: 1.35, w: 2.5, fill: GRN, rot: 4, tag: A(4, 'zoom') });
  s.addNotes('This is BarberBook PH. It is web-based, so it opens in any phone browser with no download. The four key features are time-slot booking, the style gallery, saved preferences, and the owner dashboard.');

  // ============ 5. SOP ============
  s = pres.addSlide(); s.background = { color: ICE };
  header(s, 'CHAPTER 1', 'Statement of the Problem', 'Six questions this study will answer');
  const sop = [['Existing practices', 'Scheduling, customer info, barber availability, preference records, confirmation and tracking'], ['Problems encountered', 'Waiting time, scheduling conflicts, communicating preferences, missed appointments, records'], ['Needed features', 'Online scheduling, availability, preference selection, notifications, profile, shop management'], ['How it improves', 'Booking appointments and communicating haircut preferences between customers and shops'], ['Acceptability', 'Functionality, usability, efficiency, reliability, and user satisfaction'], ['Improvements', 'Enhancements proposed from the evaluation and user feedback']];
  sop.forEach((q, i) => {
    const col = i % 3, row = Math.floor(i / 3), x = 0.6 + col * 4.1, y = 2.25 + row * 2.4, t = A(1, 'zoom', i);
    card(s, { x, y, w: 3.8, h: 2.1, tag: t });
    s.addText(String(i + 1), { x: x + 0.25, y: y + 0.25, w: 0.65, h: 0.65, shape: RR, rectRadius: 0.08, fill: { color: i === 4 ? BLUE : YEL }, line: border(2), fontFace: F, fontSize: 24, bold: true, color: i === 4 ? WHT : BLK, align: 'center', valign: 'middle', margin: 0, objectName: t, isTextBox: true });
    txt(s, q[0].toUpperCase(), { x: x + 1.05, y: y + 0.25, w: 2.6, h: 0.65, fontSize: 14, bold: true, valign: 'middle', objectName: t });
    txt(s, q[1], { x: x + 0.25, y: y + 1.05, w: 3.35, h: 0.95, fontSize: 11.5, color: GRAY, objectName: t });
  });
  s.addNotes('Questions 1 and 2 are answered by the interview, observation, and survey. Question 3 becomes our feature list. Question 4 is answered by the developed system. Questions 5 and 6 come from the evaluation.');

  // ============ 6. FEATURES ============
  s = pres.addSlide(); s.background = { color: ICE };
  header(s, 'FEATURES', 'Every feature answers a problem');
  const feats = [['FaCalendarDays', 'Online slot booking', 'Long waiting time and double booking'], ['FaImages', 'Hairstyle gallery', 'Difficulty in explaining the desired haircut'], ['FaUserTie', 'Preferred barber', 'Can\'t request a favorite barber in advance'], ['FaSliders', 'Saved preferences', 'Barber asks the same questions every visit'], ['FaEnvelopeOpenText', 'Email / SMS reminders', 'Forgotten appointments and no-shows'], ['FaTableColumns', 'Owner dashboard', 'Schedule only written in a notebook'], ['FaStar', 'Rating and feedback', 'No record of customer satisfaction']];
  for (let i = 0; i < feats.length; i++) {
    const y = 1.95 + i * 0.7, t = A(1, 'float', i);
    s.addText(feats[i][1].toUpperCase(), { x: 1.35, y, w: 4.1, h: 0.55, shape: RR, rectRadius: 0.08, fill: { color: YEL }, line: border(2), shadow: sh(3), fontFace: F, fontSize: 13, bold: true, color: BLK, margin: 8, valign: 'middle', objectName: t, isTextBox: true });
    await iconDot(s, feats[i][0], 0.6, y + 0.01, 0.53, t, BLK, YEL);
    s.addImage({ data: await icon('FaArrowRightLong', BLK), x: 5.7, y: y + 0.12, w: 0.6, h: 0.32, objectName: t });
    s.addText(feats[i][2], { x: 6.55, y, w: 6.15, h: 0.55, shape: RR, rectRadius: 0.08, fill: { color: WHT }, line: border(2), shadow: sh(3), fontFace: F, fontSize: 13, color: BLK, margin: 8, valign: 'middle', objectName: t, isTextBox: true });
  }
  s.addNotes('We built the feature list directly from the problems. If a panelist asks why a feature exists, we point to the problem it solves.');

  // ============ 7. THEORETICAL FRAMEWORK (native) ============
  s = pres.addSlide(); s.background = { color: ICE };
  header(s, 'CHAPTER 1', 'Theoretical Framework', 'Four theories and models the study stands on');
  const cx = 5.07, cy = 3.55, cw = 3.2, ch = 1.6;
  s.addText([{ text: 'BARBERBOOK PH', options: { bold: true, fontSize: 20, breakLine: true } }, { text: 'Online Appointment and Haircut Preference System', options: { fontSize: 11.5 } }], {
    x: cx, y: cy, w: cw, h: ch, shape: RR, rectRadius: 0.12, fill: { color: BLUE }, line: border(3), shadow: sh(7), fontFace: F, color: WHT, align: 'center', valign: 'middle', margin: 10, objectName: A(1, 'zoom'), isTextBox: true,
  });
  const th = [
    ['TECHNOLOGY ACCEPTANCE MODEL', 'Davis (1989); Venkatesh et al. (2003)', 'People use it if it is useful and easy to use.', 0.6, 2.2, YEL],
    ['DELONE & MCLEAN IS SUCCESS', 'DeLone and McLean (2003)', 'Quality leads to use, satisfaction, and net benefits.', 9.03, 2.2, WHT],
    ['PSYCHOLOGY OF WAITING LINES', 'Maister (1985); Taylor (1994)', 'Uncertain waits feel longer. A fixed slot fixes that.', 0.6, 5.05, WHT],
    ['ISO/IEC 25010 QUALITY MODEL', 'ISO (2011, 2023)', 'The basis of our evaluation questionnaire.', 9.03, 5.05, YEL],
  ];
  const tw = 3.7, thh = 1.55;
  th.forEach((t0, i) => {
    const t = A(2 + i, 'float');
    card(s, { x: t0[3], y: t0[4], w: tw, h: thh, fill: t0[5], tag: t });
    txt(s, [{ text: t0[0], options: { bold: true, fontSize: 14, breakLine: true } }, { text: t0[1], options: { fontSize: 11, italic: true, color: GRAY, breakLine: true } }, { text: t0[2], options: { fontSize: 13.5 } }], { x: t0[3] + 0.2, y: t0[4] + 0.12, w: tw - 0.4, h: thh - 0.24, valign: 'middle', objectName: t });
    const left = t0[3] < 5, top = t0[4] < 4;
    const x1 = left ? t0[3] + tw : t0[3], y1 = t0[4] + thh / 2;
    const x2 = left ? cx - 0.05 : cx + cw + 0.05, y2 = top ? cy + 0.35 : cy + ch - 0.35;
    arrowLine(s, x1, y1, x2, y2, A(2 + i, 'wipe', 1));
  });
  s.addNotes('Explain each box in one sentence. TAM (Davis, 1989): usefulness and ease of use. DeLone and McLean (2003): quality leads to use, satisfaction, and benefits. Maister (1985): uncertain waits feel longer. ISO/IEC 25010: the basis of our evaluation questionnaire.');

  // ============ 8. CONCEPTUAL FRAMEWORK (native IPO) ============
  s = pres.addSlide(); s.background = { color: ICE };
  header(s, 'CHAPTER 1', 'Conceptual Framework', 'Input-Process-Output model with a feedback loop');
  const colW = 3.55, gapW = 0.72, top = 2.35, colH = 3.85;
  const cols = [
    ['INPUT', WHT, BLK, [['Knowledge', 'Existing practices, problems, and needed features'], ['Software', 'HTML5, CSS3, JS, Bootstrap, PHP (Laravel), MySQL, XAMPP, VS Code, GitHub, Figma'], ['Hardware', 'Laptop (8 GB RAM+), Android/iOS phone, internet']]],
    ['PROCESS', YEL, BLK, [['Agile development', 'Requirements > design (DFD, ERD, use case, UI) > Sprint 1: booking > Sprint 2: gallery and preferences > Sprint 3: dashboard and notifications > testing > deployment'], ['Evaluation', 'ISO/IEC 25010 questionnaire, weighted mean']]],
    ['OUTPUT', BLUE, WHT, [['BarberBook PH', 'Online Appointment and Haircut Preference System'], ['Results', 'Acceptability in functionality, usability, efficiency, reliability, user satisfaction'], ['Proposed improvements', '']]],
  ];
  cols.forEach((c, i) => {
    const x = 0.6 + i * (colW + gapW), t = A(1 + i * 2, i === 2 ? 'zoom' : 'float');
    card(s, { x, y: top, w: colW, h: colH, fill: c[1], so: 6, tag: t });
    badge(s, c[0], { x: x + 0.25, y: top - 0.25, w: 1.5, fill: i === 2 ? YEL : BLK, color: i === 2 ? BLK : WHT, rot: -3, fs: 13, tag: t });
    const runs = [];
    c[3].forEach(([h, b], j) => { runs.push({ text: h.toUpperCase(), options: { bold: true, fontSize: 12, breakLine: true } }); if (b) runs.push({ text: b, options: { fontSize: 11, breakLine: j < c[3].length - 1 } }); if (j < c[3].length - 1) runs.push({ text: ' ', options: { fontSize: 5, breakLine: true } }); });
    txt(s, runs, { x: x + 0.25, y: top + 0.4, w: colW - 0.5, h: colH - 0.55, color: c[2], objectName: t });
    if (i < 2) s.addShape(pres.shapes.RIGHT_ARROW, { x: x + colW + 0.1, y: top + colH / 2 - 0.25, w: gapW - 0.2, h: 0.5, fill: { color: BLK }, line: border(1), objectName: A(2 + i * 2, 'wipe') });
  });
  const pX = 0.6 + (colW + gapW) + colW / 2, oX = 0.6 + 2 * (colW + gapW) + colW / 2, fbY = top + colH + 0.45;
  s.addShape(pres.shapes.LINE, { x: oX, y: top + colH + 0.06, w: 0.001, h: fbY - top - colH - 0.06, line: { color: BLK, width: 3 }, objectName: A(6, 'wipe', 0) });
  s.addShape(pres.shapes.LINE, { x: pX, y: fbY, w: oX - pX, h: 0.001, flipH: true, line: { color: BLK, width: 3 }, objectName: A(6, 'wipe', 1) });
  arrowLine(s, pX, fbY, pX, top + colH + 0.1, A(6, 'wipe', 2));
  badge(s, 'FEEDBACK', { x: (pX + oX) / 2 - 0.7, y: fbY - 0.2, w: 1.4, h: 0.38, fill: YSOFT, rot: 0, fs: 11, tag: A(7, 'zoom') });
  s.addNotes('Input is what we need: knowledge, software, and hardware. Process is Agile development in three sprints, then evaluation. Output is the system and its acceptability results. The feedback loop means user comments go back into improving the system after every sprint.');

  // ============ 9. HOW IT WORKS ============
  s = pres.addSlide(); s.background = { color: BLUE };
  header(s, 'USER JOURNEY', 'From home screen to confirmed slot', null, true);
  const steps = [['img/nb_screen1.png', 'Find a shop'], ['img/nb_screen2.png', 'Choose a style'], ['img/nb_screen3.png', 'Barber + prefs'], ['img/nb_screen4.png', 'Pick a free slot'], ['img/nb_screen6.png', 'Confirmed!'], ['img/nb_screen7.png', 'Owner queue']];
  const sw = 1.82, sgap = (12.1 - 6 * sw) / 5, sH = sw * ph / pw;
  steps.forEach(([p, lab], i) => {
    const x = 0.6 + i * (sw + sgap), t = A(1, 'float', i);
    s.addImage({ path: p, x, y: 1.85, w: sw, h: sH, objectName: t });
    s.addText(`${i + 1}  ${lab.toUpperCase()}`, { x: x - 0.02, y: 1.85 + sH + 0.2, w: sw + 0.04, h: 0.45, shape: RR, rectRadius: 0.08, fill: { color: i === 5 ? GRN : YEL }, line: border(2), shadow: sh(3), fontFace: F, fontSize: 10.5, bold: true, color: BLK, align: 'center', valign: 'middle', margin: 0, objectName: t, isTextBox: true });
  });
  src(s, 'Screens 1 to 5: customer side. Screen 6: the barbershop owner\'s dashboard. Proposed design in the website\'s actual theme.', true);
  s.addNotes('Walk through the six screens. Emphasize screen 3, the saved haircut preferences, and screen 4, where taken slots are hidden automatically so double booking cannot happen.');

  // ============ 10. RRL ============
  s = pres.addSlide(); s.background = { color: ICE };
  header(s, 'CHAPTER 2', 'What 46 sources told us', 'Review of Related Literature and Studies');
  const regions = [['8', 'Indonesia', 'barbershop booking systems (web, Android, Laravel, CodeIgniter)', WHT], ['2', 'Malaysia', 'barber booking app and centralized barbershop management', WHT], ['8', 'Philippines', 'appointment and reservation systems + MSME record-keeping studies', YEL]];
  regions.forEach((r, i) => {
    const y = 2.25 + i * 1.5, t = A(1, 'zoom', i);
    card(s, { x: 0.6, y, w: 5.5, h: 1.25, fill: r[3], tag: t });
    s.addText(r[0], { x: 0.8, y: y + 0.2, w: 0.85, h: 0.85, shape: RR, rectRadius: 0.08, fill: { color: BLUE }, line: border(2), fontFace: F, fontSize: 28, bold: true, color: WHT, align: 'center', valign: 'middle', margin: 0, objectName: t, isTextBox: true });
    txt(s, [{ text: (r[1] + ' studies').toUpperCase(), options: { bold: true, fontSize: 14, breakLine: true } }, { text: r[2], options: { fontSize: 11.5, color: GRAY } }], { x: 1.85, y: y + 0.15, w: 4.1, h: 0.95, valign: 'middle', objectName: t });
  });
  card(s, { x: 6.6, y: 2.25, w: 6.1, h: 4.25, tag: A(2, 'float') });
  badge(s, 'KEY LESSONS', { x: 6.85, y: 2.0, w: 1.75, fill: YEL, rot: 3, tag: A(2, 'float') });
  const lessons = [['Uncertain waits feel longer', 'Maister (1985); Taylor (1994)'], ['SMS reminders increase attendance', 'Guy et al. (2012)'], ['Barber-client trust drives loyalty', 'Price and Arnould (1999)'], ['Chat bookings cause schedule clashes', 'Hidayat and Wibowo (2023)'], ['Cancellation and reports need extra care', 'Rusdi and Isnin (2024)'], ['ISO 25010 is standard in PH system studies', 'Concepcion et al. (2026); Ramento et al. (2024)']];
  for (let i = 0; i < lessons.length; i++) {
    const y = 2.55 + i * 0.63, t = A(3, 'float', i);
    s.addImage({ data: await icon('FaSquareCheck', BLUE), x: 6.9, y: y + 0.05, w: 0.32, h: 0.32, objectName: t });
    txt(s, [{ text: lessons[i][0], options: { bold: true, fontSize: 13, breakLine: true } }, { text: lessons[i][1], options: { fontSize: 10.5, italic: true, color: GRAY } }], { x: 7.35, y, w: 5.2, h: 0.6, objectName: t });
  }
  s.addNotes('Chapter 2 has 46 references. The foreign studies show barbershops in Indonesia and Malaysia face the same problems. The local studies show online reservation systems are well accepted by Filipino users when evaluated with ISO 25010.');

  // ============ 11. GAP ============
  s = pres.addSlide(); s.background = { color: BLUE };
  header(s, 'RESEARCH GAP', 'Most systems stop at the schedule', 'The haircut itself is left out. That is where we come in.', true);
  const bl = (arr) => arr.map((t, i) => ({ text: t, options: { bullet: { code: '25A0' }, breakLine: i < arr.length - 1 } }));
  card(s, { x: 0.6, y: 2.35, w: 5.3, h: 3.9, fill: WHT, so: 7, tag: A(1, 'float') });
  txt(s, 'WHAT REVIEWED SYSTEMS FOCUS ON', { x: 0.9, y: 2.55, w: 4.8, h: 0.45, fontSize: 14, bold: true, color: GRAY, objectName: A(1, 'float') });
  txt(s, bl(['Online booking of a date and time', 'Queue numbers and waiting estimates', 'Avoiding schedule clashes', 'Online payment (some systems)', 'Mostly built abroad or for non-barbershop settings in the PH']), { x: 0.9, y: 3.1, w: 4.8, h: 3.0, fontSize: 14, paraSpaceAfter: 9, objectName: A(1, 'float') });
  await iconDot(s, 'FaArrowRight', 6.2, 3.85, 0.9, A(2, 'zoom'), YEL, BLK);
  card(s, { x: 7.4, y: 2.35, w: 5.3, h: 3.9, fill: YEL, so: 7, tag: A(3, 'float') });
  txt(s, 'WHAT BARBERBOOK PH ADDS', { x: 7.7, y: 2.55, w: 4.8, h: 0.45, fontSize: 14, bold: true, objectName: A(3, 'float') });
  txt(s, bl(['Hairstyle gallery attached to the booking', 'Saved haircut preferences the barber reads before the cut', 'Preferred barber or "any available"', 'Reminders + owner dashboard + reports in one', 'Built and evaluated for a Filipino barbershop']), { x: 7.7, y: 3.1, w: 4.8, h: 3.0, fontSize: 14, paraSpaceAfter: 9, objectName: A(3, 'float') });
  badge(s, 'OUR EDGE', { x: 11.2, y: 2.1, w: 1.5, fill: GRN, rot: 5, fs: 13, tag: A(4, 'zoom') });
  src(s, 'Based on the published descriptions of the studies reviewed in Chapter 2.', true);
  s.addNotes('Existing systems handle the schedule. We also handle the haircut itself, through the gallery and saved preferences, which the literature shows matters for satisfaction and loyalty in personal services.');

  // ============ 12. SCOPE ============
  s = pres.addSlide(); s.background = { color: ICE };
  header(s, 'CHAPTER 1', 'Scope and delimitations', 'What the system will and will not do');
  const inScope = ['Customer registration and login', 'Shop listing with hours, services, prices', 'Hairstyle gallery by category', 'Preferred barber selection', 'Saved preferences and notes', 'Calendar and time-slot booking', 'Reschedule and cancel', 'Email / SMS confirmation and reminder', 'Owner dashboard and reports', 'Rating and feedback'];
  const outScope = ['Online payment (paid at the shop)', 'Payroll, inventory, full accounting', 'AI or AR hairstyle preview', 'More than one partner shop in testing', 'Offline use (needs internet)'];
  card(s, { x: 0.6, y: 2.3, w: 7.7, h: 4.15, tag: A(1, 'float') });
  badge(s, 'IN SCOPE', { x: 0.85, y: 2.05, w: 1.5, fill: GRN, rot: -3, tag: A(1, 'float') });
  for (let i = 0; i < inScope.length; i++) {
    const col = i % 2, row = Math.floor(i / 2), x = 0.9 + col * 3.7, y = 2.7 + row * 0.72, t = A(2, 'fade', row);
    s.addImage({ data: await icon('FaCircleCheck', '16A34A'), x, y: y + 0.07, w: 0.3, h: 0.3, objectName: t });
    txt(s, inScope[i], { x: x + 0.42, y, w: 3.2, h: 0.45, fontSize: 13, bold: true, valign: 'middle', objectName: t });
  }
  card(s, { x: 8.75, y: 2.3, w: 3.95, h: 4.15, fill: YSOFT, tag: A(3, 'float') });
  badge(s, 'OUT OF SCOPE', { x: 9.0, y: 2.05, w: 1.9, fill: RED, color: WHT, rot: 3, tag: A(3, 'float') });
  for (let i = 0; i < outScope.length; i++) {
    const y = 2.75 + i * 0.72, t = A(4, 'fade', i);
    s.addImage({ data: await icon('FaCircleXmark', 'DC2626'), x: 9.0, y: y + 0.07, w: 0.3, h: 0.3, objectName: t });
    txt(s, outScope[i], { x: 9.42, y, w: 3.15, h: 0.6, fontSize: 13, bold: true, objectName: t });
  }
  txt(s, [{ text: 'Setting: ', options: { bold: true } }, hl('[Partner Barbershop], [Municipality/City]'), { text: '   ·   October 2026 to March 2027   ·   Walk-ins are still encoded manually by the owner.' }], { x: 0.6, y: 6.7, w: 12.1, h: 0.35, fontSize: 11.5, color: GRAY });
  s.addNotes('Delimitations protect the study. If asked why there is no online payment: most local barbershops still collect cash, a payment gateway adds fees and security requirements, and our focus is waiting, scheduling, and communication.');

  // ============ 13. METHODOLOGY ============
  s = pres.addSlide(); s.background = { color: ICE };
  header(s, 'METHODOLOGY', 'How we will build it: Agile, in three sprints', 'Show the owner a working part after every sprint, then improve it right away');
  const tl = [['OCT 2026', 'Topic approval, concept paper'], ['OCT-NOV', 'Interview, survey, requirements'], ['NOV-DEC', 'System design, Chapters 1-3'], ['DEC 2026', 'Sprint 1: accounts and booking'], ['JAN 2027', 'Sprint 2: gallery and preferences'], ['JAN-FEB', 'Sprint 3: dashboard, notifications'], ['FEB 2027', 'Testing and evaluation'], ['MAR 2027', 'Revision, documentation, defense']];
  s.addShape(pres.shapes.RECTANGLE, { x: 0.9, y: 3.2, w: 11.55, h: 0.12, fill: { color: BLK }, line: { color: BLK, width: 0.5 }, objectName: A(1, 'wipe') });
  tl.forEach((t0, i) => {
    const x = 0.6 + i * 1.53, sprint = i >= 3 && i <= 5, t = A(2, 'zoom', i);
    s.addShape(pres.shapes.OVAL, { x: x + 0.47, y: 3.03, w: 0.46, h: 0.46, fill: { color: sprint ? YEL : WHT }, line: border(2.5), objectName: t });
    txt(s, t0[0], { x, y: 2.5, w: 1.4, h: 0.4, fontSize: 12, bold: true, align: 'center', color: sprint ? BLUE : BLK, objectName: t });
    txt(s, t0[1], { x: x - 0.02, y: 3.65, w: 1.45, h: 0.9, fontSize: 11, align: 'center', color: GRAY, objectName: t });
  });
  badge(s, '3 SPRINTS', { x: 5.55, y: 4.55, w: 1.6, fill: YEL, rot: -3, tag: A(3, 'zoom') });
  const tools = [['FaCode', 'Front end', 'HTML5, CSS3, JavaScript, Bootstrap'], ['FaServer', 'Back end', 'PHP with Laravel'], ['FaDatabase', 'Database', 'MySQL (XAMPP locally)'], ['FaPenRuler', 'Design / versioning', 'Figma, VS Code, GitHub']];
  for (let i = 0; i < tools.length; i++) {
    const x = 0.6 + i * 3.1, t = A(4, 'float', i);
    card(s, { x, y: 5.25, w: 2.8, h: 1.45, so: 4, tag: t });
    await iconDot(s, tools[i][0], x + 0.2, 5.43, 0.5, t);
    txt(s, tools[i][1].toUpperCase(), { x: x + 0.85, y: 5.43, w: 1.85, h: 0.5, fontSize: 12, bold: true, valign: 'middle', objectName: t });
    txt(s, tools[i][2], { x: x + 0.2, y: 6.05, w: 2.5, h: 0.55, fontSize: 11, color: GRAY, objectName: t });
  }
  s.addNotes('We chose Agile because the owner will likely request changes after seeing the first version. The yellow dots are the three development sprints. All tools are free, which keeps the system affordable for a micro enterprise.');

  // ============ 14. EVALUATION ============
  s = pres.addSlide(); s.background = { color: ICE };
  header(s, 'EVALUATION', 'How we will evaluate it', 'ISO/IEC 25010-based questionnaire, four-point Likert scale, weighted mean');
  txt(s, 'RESPONDENTS', { x: 0.6, y: 2.2, w: 4, h: 0.35, fontSize: 12, bold: true, color: GRAY });
  [['1', 'owner'], ['3-5', 'barbers'], ['30', 'regular customers']].forEach((r, i) => {
    const y = 2.6 + i * 1.3, t = A(1, 'zoom', i);
    card(s, { x: 0.6, y, w: 4.0, h: 1.05, fill: i === 2 ? YEL : WHT, tag: t });
    txt(s, r[0], { x: 0.85, y, w: 1.5, h: 1.05, fontSize: 32, bold: true, valign: 'middle', color: BLUE, objectName: t });
    txt(s, r[1].toUpperCase(), { x: 2.35, y, w: 2.1, h: 1.05, fontSize: 14, bold: true, valign: 'middle', objectName: t });
  });
  txt(s, 'CRITERIA', { x: 5.05, y: 2.2, w: 3, h: 0.35, fontSize: 12, bold: true, color: GRAY });
  const crit = [['FaGears', 'Functionality'], ['FaHandPointer', 'Usability'], ['FaBolt', 'Efficiency'], ['FaShieldHalved', 'Reliability'], ['FaFaceSmile', 'User satisfaction']];
  for (let i = 0; i < crit.length; i++) {
    const y = 2.6 + i * 0.77, t = A(2, 'float', i);
    card(s, { x: 5.05, y, w: 3.1, h: 0.58, r: 0.08, so: 3, bw: 2, tag: t });
    txt(s, crit[i][1].toUpperCase(), { x: 5.75, y, w: 2.3, h: 0.58, fontSize: 13, bold: true, valign: 'middle', objectName: t });
    await iconDot(s, crit[i][0], 5.15, y + 0.06, 0.46, t, BLUE, WHT);
  }
  txt(s, 'INTERPRETATION SCALE', { x: 8.65, y: 2.2, w: 4, h: 0.35, fontSize: 12, bold: true, color: GRAY });
  const scale = [['4', '3.26-4.00', 'Highly Acceptable'], ['3', '2.51-3.25', 'Acceptable'], ['2', '1.76-2.50', 'Slightly Acceptable'], ['1', '1.00-1.75', 'Not Acceptable']];
  const hdr = ['Scale', 'Mean', 'Interpretation'].map(h => ({ text: h, options: { bold: true, color: BLK, fill: { color: YEL } } }));
  s.addTable([hdr].concat(scale.map(r => r.map(c => ({ text: c, options: { fill: { color: WHT } } })))), { x: 8.65, y: 2.6, w: 4.05, colW: [0.75, 1.2, 2.1], fontFace: F, fontSize: 12, color: BLK, border: { type: 'solid', pt: 2, color: BLK }, rowH: 0.52, valign: 'middle', objectName: A(3, 'fade') });
  txt(s, [hl('Proposed scale. Confirm ranges and descriptors with your adviser.')], { x: 8.65, y: 5.4, w: 4.05, h: 0.5, fontSize: 10.5, italic: true });
  s.addNotes('The instrument is adapted from ISO/IEC 25010. Respondents rate each item from 1 to 4, we compute the weighted mean per criterion, and interpret it using this scale.');

  // ============ 15. TITLE OPTIONS ============
  s = pres.addSlide(); s.background = { color: ICE };
  header(s, 'FOR APPROVAL', 'Proposed title options', 'Three options for the adviser\'s guidance');
  const opts = [['OPTION 1', 'BarberBook PH', 'An Online Appointment and Haircut Preference System for Local Barbershops', 'Current working title. Already matches the Statement of the Problem.', YEL], ['OPTION 2', 'TrimTime', 'A Web-Based Appointment Scheduling and Hairstyle Preference Management System for Barbershops in [Municipality]', 'More technical wording and a specific locale.', WHT], ['OPTION 3', 'GupitGo', 'A Mobile-Responsive Booking and Haircut Preference Recording System for Local Barbershops with Customer Records Management', 'Local and catchy, with a record-keeping angle.', WHT]];
  opts.forEach((o, i) => {
    const x = 0.6 + i * 4.15, t = A(1, 'float', i);
    card(s, { x, y: 2.35, w: 3.85, h: 3.9, fill: o[4], so: 7, tag: t });
    txt(s, o[0], { x: x + 0.3, y: 2.6, w: 3.2, h: 0.35, fontSize: 12, bold: true, color: BLUE, objectName: t });
    txt(s, o[1].toUpperCase(), { x: x + 0.3, y: 2.95, w: 3.3, h: 0.7, fontSize: 26, bold: true, valign: 'middle', objectName: t });
    txt(s, o[2], { x: x + 0.3, y: 3.75, w: 3.25, h: 1.85, fontSize: 13.5, objectName: t });
    txt(s, o[3], { x: x + 0.3, y: 5.4, w: 3.25, h: 0.75, fontSize: 11, italic: true, color: GRAY, objectName: t });
  });
  badge(s, 'RECOMMENDED', { x: 2.75, y: 2.1, w: 1.85, fill: GRN, rot: 4, tag: A(2, 'zoom') });
  s.addNotes('We would like the adviser\'s guidance on the final title. Option 1 is our recommendation because it already matches our research questions.');

  // ============ 16. CLOSE ============
  s = pres.addSlide(); s.background = { color: BLUE };
  s.addImage({ data: await icon('FaScissors', YEL), x: 10.3, y: 0.9, w: 1.9, h: 1.9, objectName: A(4, 'zoom'), rotate: 20 });
  s.addText('SALAMAT PO!', { x: 0.9, y: 1.9, w: 8.4, h: 1.9, shape: RR, rectRadius: 0.14, fill: { color: WHT }, line: border(3.5), shadow: sh(10), fontFace: F, fontSize: 70, bold: true, color: BLK, align: 'center', valign: 'middle', margin: 0, rotate: -2, objectName: A(1, 'zoom'), isTextBox: true });
  s.addText('QUESTIONS? SUGGESTIONS? WE\'RE READY.', { x: 2.2, y: 4.25, w: 6.2, h: 0.75, shape: RR, rectRadius: 0.1, fill: { color: YEL }, line: border(2.5), shadow: sh(5), fontFace: F, fontSize: 18, bold: true, color: BLK, align: 'center', valign: 'middle', margin: 0, rotate: 2, objectName: A(2, 'float'), isTextBox: true });
  txt(s, [{ text: 'BARBERBOOK PH', options: { bold: true, color: YEL, breakLine: true } }, hl('[Member 1]  ·  [Member 2]  ·  [Member 3]  ·  [Member 4]')], { x: 0.9, y: 5.7, w: 9, h: 0.9, fontSize: 14, color: WHT, objectName: A(3, 'fade') });
  s.addNotes('Thank the panel and open the floor. Use the "Questions Your Panel Will Probably Ask" section of the group guide to prepare.');

  await pres.writeFile({ fileName: 'Deck2_raw.pptx' });
  console.log('ok');
})();
