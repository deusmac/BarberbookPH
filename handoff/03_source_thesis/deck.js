const pptxgen = require('pptxgenjs');
const React = require('react');
const RDS = require('react-dom/server');
const sharp = require('sharp');
const fa = require('react-icons/fa6');
const fs = require('fs');

const INK = '1B1A17', BROWN = '8A5A2B', GOLD = 'C9A227', SOFT = 'F3E7D9', MUTED = '6F6A60', LINE = 'E4E0D8', WHITE = 'FFFFFF', RED = 'B3261E', GREEN = '2E7D32';
const HF = 'Cambria', BF = 'Calibri';

async function icon(name, color, size = 256) {
  const svg = RDS.renderToStaticMarkup(React.createElement(fa[name], { color: '#' + color, size }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return 'image/png;base64,' + buf.toString('base64');
}
function imgSize(p) { const b = fs.readFileSync(p); return [b.readUInt32BE(16), b.readUInt32BE(20)]; }

(async () => {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5
  pres.title = 'BarberBook PH Preliminary Presentation';
  const W = 13.333, H = 7.5;

  const title = (s, t, sub) => {
    s.addText(t, { x: 0.6, y: 0.4, w: 12.1, h: 0.8, fontFace: HF, fontSize: 34, bold: true, color: INK, margin: 0, isTextBox: true });
    if (sub) s.addText(sub, { x: 0.6, y: 1.15, w: 12.1, h: 0.45, fontFace: BF, fontSize: 16, color: MUTED, margin: 0, isTextBox: true });
  };
  const circleIcon = async (s, name, x, y, d, bg = BROWN, fg = WHITE) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: bg }, line: { color: bg } });
    s.addImage({ data: await icon(name, fg), x: x + d * 0.25, y: y + d * 0.25, w: d * 0.5, h: d * 0.5 });
  };
  const src = (s, t, dark) => s.addText(t, { x: 0.6, y: 6.95, w: 12.1, h: 0.35, fontFace: BF, fontSize: 10, color: dark ? 'B9B2A6' : MUTED, italic: true, margin: 0, isTextBox: true });
  const hl = (t, o = {}) => ({ text: t, options: { highlight: 'FFFF00', color: INK, ...o } });

  // ---------- 1. Title ----------
  let s = pres.addSlide(); s.background = { color: INK };
  s.addImage({ path: 'img/hero.jpg', x: 6.35, y: 0.35, w: 6.8, h: 6.8 });
  s.addText('CAPSTONE PROJECT PROPOSAL  |  PRELIMINARY PRESENTATION', { x: 0.6, y: 0.9, w: 6, h: 0.4, fontFace: BF, fontSize: 12, bold: true, color: GOLD, charSpacing: 2, margin: 0, isTextBox: true });
  s.addText('BarberBook PH', { x: 0.6, y: 1.45, w: 6, h: 1.1, fontFace: HF, fontSize: 56, bold: true, color: WHITE, margin: 0, isTextBox: true });
  s.addText('An Online Appointment and Haircut Preference System for Local Barbershops', { x: 0.6, y: 2.6, w: 5.6, h: 1.1, fontFace: BF, fontSize: 22, color: SOFT, margin: 0, isTextBox: true });
  s.addText([
    { text: 'Proponents', options: { bold: true, color: GOLD, breakLine: true } },
    hl('[Member 1]  ·  [Member 2]  ·  [Member 3]  ·  [Member 4]', { breakLine: true }),
    { text: ' ', options: { breakLine: true, fontSize: 8 } },
    { text: 'Adviser', options: { bold: true, color: GOLD, breakLine: true } },
    hl('[Name of Adviser]', { breakLine: true }),
    { text: ' ', options: { breakLine: true, fontSize: 8 } },
    hl('[College / Department], [Name of School]', { breakLine: true }),
    { text: 'October 2026', options: { color: 'B9B2A6' } },
  ], { x: 0.6, y: 4.15, w: 5.6, h: 2.6, fontFace: BF, fontSize: 14, color: WHITE, margin: 0, valign: 'top', isTextBox: true });
  s.addNotes('Good [morning/afternoon]. We are [group name/members], and our proposed capstone project is BarberBook PH, an online appointment and haircut preference system for local barbershops. In the next few minutes we will show you the problem we observed, what the system will do, the theories behind it, what other studies have done, and how we plan to build and evaluate it.');

  // ---------- 2. Problem ----------
  s = pres.addSlide(); s.background = { color: WHITE };
  title(s, 'The problem we saw at the barbershop', 'Walk-ins, chat reservations, and a notebook are still the "system" in most local shops');
  s.addImage({ path: 'img/waiting.png', x: 0.6, y: 1.95, w: 6.1, h: 6.1 * 1280 / 2000 });
  const probs = [
    ['FaHourglassHalf', 'Long, uncertain waiting', '1 to 2 hours on weekends, paydays, and before school events or fiestas.'],
    ['FaCalendarXmark', 'Overlapping reservations', 'Bookings through Messenger or text get buried, and two customers end up in the same slot.'],
    ['FaCommentDots', 'Hard to explain the haircut', '"Semi-kalbo," "short on the sides," "yung dati lang po." Nothing is written down.'],
    ['FaBellSlash', 'Forgotten appointments', 'No confirmation or reminder, so reserved slots go to waste.'],
    ['FaBookOpen', 'No organized customer records', 'The owner can\'t easily see weekly customers, regulars, or the most requested barber.'],
  ];
  for (let i = 0; i < probs.length; i++) {
    const y = 1.85 + i * 0.98;
    await circleIcon(s, probs[i][0], 7.1, y, 0.62);
    s.addText([{ text: probs[i][1], options: { bold: true, fontSize: 16, color: INK, breakLine: true } }, { text: probs[i][2], options: { fontSize: 12.5, color: MUTED } }],
      { x: 7.9, y: y - 0.08, w: 4.9, h: 0.9, fontFace: BF, margin: 0, valign: 'top', isTextBox: true });
  }
  src(s, 'Based on the proponents\' initial observation. Replace the waiting-time figure with your actual interview data from the partner barbershop.');
  s.addNotes('These are the five problems we observed. [Share one real story from your interview here.] Notice that the third problem, explaining the haircut, is the one most booking systems ignore. That will be our main selling point.');

  // ---------- 3. Why now ----------
  s = pres.addSlide(); s.background = { color: WHITE };
  title(s, 'Why this matters now', 'Customers are already online, and barbershops are part of the MSME backbone');
  const stats = [
    ['98M', 'internet users in the Philippines', '83.8% of the population', 'Kemp (2026)'],
    ['137M', 'cellular mobile connections', 'more connections than people', 'Kemp (2026)'],
    ['99.63%', 'of Philippine businesses are MSMEs', '1,241,733 of 1,246,373 enterprises (2023)', 'DTI (n.d.)'],
    ['90.43%', 'are micro enterprises', 'small budgets, little room for paid software', 'DTI (n.d.)'],
  ];
  stats.forEach((st, i) => {
    const x = 0.6 + i * 3.08;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.95, w: 2.85, h: 3.2, fill: { color: i < 2 ? INK : SOFT }, line: { color: i < 2 ? INK : SOFT }, rectRadius: 0.12 });
    s.addText(st[0], { x: x + 0.25, y: 2.2, w: 2.4, h: 1.0, fontFace: HF, fontSize: 44, bold: true, color: i < 2 ? GOLD : BROWN, margin: 0, isTextBox: true });
    s.addText(st[1], { x: x + 0.25, y: 3.25, w: 2.4, h: 0.8, fontFace: BF, fontSize: 15, bold: true, color: i < 2 ? WHITE : INK, margin: 0, valign: 'top', isTextBox: true });
    s.addText(st[2], { x: x + 0.25, y: 4.05, w: 2.4, h: 0.6, fontFace: BF, fontSize: 12, color: i < 2 ? 'D9D2C6' : MUTED, margin: 0, valign: 'top', isTextBox: true });
    s.addText(st[3], { x: x + 0.25, y: 4.7, w: 2.4, h: 0.3, fontFace: BF, fontSize: 10, italic: true, color: i < 2 ? 'B9B2A6' : MUTED, margin: 0, isTextBox: true });
  });
  s.addText([{ text: 'So what? ', options: { bold: true, color: BROWN } }, { text: 'Filipino customers already book rides, food, and bills on their phones. A free, web-based booking tool built for small barbershops fits both the customer\'s habits and the owner\'s budget.' }],
    { x: 0.6, y: 5.5, w: 12.1, h: 0.9, fontFace: BF, fontSize: 17, color: INK, margin: 0, isTextBox: true });
  src(s, 'Sources: Kemp, S. (2026). Digital 2026: The Philippines. DataReportal. | Department of Trade and Industry. (n.d.). 2023 Philippine MSME statistics.');
  s.addNotes('These numbers come from DataReportal and the DTI. The point is simple: customers are ready for online booking, and barbershops are micro enterprises that need something affordable.');

  // ---------- 4. Introducing ----------
  s = pres.addSlide(); s.background = { color: WHITE };
  title(s, 'Introducing BarberBook PH');
  s.addText('A mobile-friendly website where customers book a slot, pick their barber, and save exactly how they want their hair cut, before they even arrive.',
    { x: 0.6, y: 1.35, w: 5.3, h: 1.3, fontFace: BF, fontSize: 18, color: INK, margin: 0, valign: 'top', isTextBox: true });
  const intro = [
    ['FaCalendarCheck', 'Book a real time slot', 'Taken slots are hidden, so double booking can\'t happen.'],
    ['FaScissors', 'Choose a style from photos', 'Trending, fades, classic, textured, or upload your own.'],
    ['FaUserCheck', 'Save your preferences', 'Guard number, length on top, beard trim, notes for the barber.'],
    ['FaChartColumn', 'Give the owner a dashboard', 'Daily queue, barber schedules, and simple booking reports.'],
  ];
  for (let i = 0; i < intro.length; i++) {
    const y = 2.85 + i * 1.02;
    await circleIcon(s, intro[i][0], 0.6, y, 0.6);
    s.addText([{ text: intro[i][1], options: { bold: true, fontSize: 15.5, breakLine: true } }, { text: intro[i][2], options: { fontSize: 12.5, color: MUTED } }],
      { x: 1.4, y: y - 0.05, w: 4.5, h: 0.9, fontFace: BF, color: INK, margin: 0, valign: 'top', isTextBox: true });
  }
  [['img/screen1.png', 6.35, 1.2], ['img/screen2.png', 8.6, 0.85], ['img/screen6.png', 10.85, 1.2]].forEach(([p, x, y]) => {
    s.addImage({ path: p, x, y, w: 2.1, h: 4.2, shadow: { type: 'outer', color: '000000', opacity: 0.25, blur: 12, offset: 4, angle: 90 } });
  });
  s.addText('Proposed screens (from the group\'s UI mockup)', { x: 6.35, y: 5.6, w: 6.6, h: 0.3, fontFace: BF, fontSize: 11, italic: true, color: MUTED, align: 'center', margin: 0, isTextBox: true });
  s.addNotes('This is BarberBook PH. It is web-based, so it opens in any phone browser with no download. The four key features are the time slot booking, the style gallery, saved preferences, and the owner dashboard.');

  // ---------- 5. SOP ----------
  s = pres.addSlide(); s.background = { color: WHITE };
  title(s, 'Statement of the Problem', 'Six questions this study will answer');
  const sop = [
    ['Existing practices', 'Scheduling, customer info, barber availability, haircut preference records, confirmation and tracking'],
    ['Problems encountered', 'Waiting time, scheduling conflicts, communicating preferences, missed appointments, customer records'],
    ['Needed features', 'Online scheduling, barber availability, preference selection, notifications, profile and history, shop management'],
    ['How it improves', 'Booking appointments and communicating haircut preferences between customers and barbershops'],
    ['Acceptability', 'Functionality, usability, efficiency, reliability, and user satisfaction'],
    ['Improvements', 'Enhancements proposed from the evaluation and user feedback'],
  ];
  sop.forEach((q, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.6 + col * 4.1, y = 1.95 + row * 2.45;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 3.85, h: 2.2, fill: { color: row === 0 ? SOFT : 'F7F4EF' }, line: { color: LINE }, rectRadius: 0.1 });
    s.addText(String(i + 1), { x: x + 0.25, y: y + 0.2, w: 0.7, h: 0.7, fontFace: HF, fontSize: 36, bold: true, color: BROWN, margin: 0, isTextBox: true });
    s.addText(q[0], { x: x + 1.0, y: y + 0.28, w: 2.7, h: 0.55, fontFace: BF, fontSize: 17, bold: true, color: INK, margin: 0, valign: 'middle', isTextBox: true });
    s.addText(q[1], { x: x + 0.25, y: y + 1.0, w: 3.4, h: 1.05, fontFace: BF, fontSize: 12.5, color: MUTED, margin: 0, valign: 'top', isTextBox: true });
  });
  s.addNotes('These are our six research questions. Questions 1 and 2 are answered by the interview, observation, and survey. Question 3 becomes our feature list. Question 4 is answered by the developed system. Questions 5 and 6 come from the evaluation.');

  // ---------- 6. Features ----------
  s = pres.addSlide(); s.background = { color: WHITE };
  title(s, 'Every feature answers a problem');
  const feats = [
    ['FaCalendarDays', 'Online slot booking', 'Long waiting time and double booking'],
    ['FaImages', 'Hairstyle gallery', 'Difficulty in explaining the desired haircut'],
    ['FaUserTie', 'Preferred barber', 'Can\'t request a favorite barber in advance'],
    ['FaSliders', 'Saved preferences', 'Barber asks the same questions every visit'],
    ['FaEnvelopeOpenText', 'Email / SMS reminders', 'Forgotten appointments and no-shows'],
    ['FaTableColumns', 'Owner dashboard', 'Schedule only written in a notebook'],
    ['FaStar', 'Rating and feedback', 'No record of customer satisfaction'],
  ];
  s.addText('FEATURE', { x: 1.45, y: 1.3, w: 4, h: 0.3, fontFace: BF, fontSize: 11, bold: true, color: MUTED, charSpacing: 2, margin: 0, isTextBox: true });
  s.addText('PROBLEM IT ANSWERS', { x: 6.6, y: 1.3, w: 5, h: 0.3, fontFace: BF, fontSize: 11, bold: true, color: MUTED, charSpacing: 2, margin: 0, isTextBox: true });
  for (let i = 0; i < feats.length; i++) {
    const y = 1.7 + i * 0.72;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 12.1, h: 0.6, fill: { color: i % 2 ? WHITE : 'F7F4EF' }, line: { color: i % 2 ? LINE : 'F7F4EF' }, rectRadius: 0.08 });
    await circleIcon(s, feats[i][0], 0.75, y + 0.07, 0.46);
    s.addText(feats[i][1], { x: 1.45, y, w: 4.3, h: 0.6, fontFace: BF, fontSize: 16, bold: true, color: INK, margin: 0, valign: 'middle', isTextBox: true });
    s.addImage({ data: await icon('FaArrowRightLong', GOLD), x: 5.85, y: y + 0.15, w: 0.45, h: 0.3 });
    s.addText(feats[i][2], { x: 6.6, y, w: 6, h: 0.6, fontFace: BF, fontSize: 15, color: MUTED, margin: 0, valign: 'middle', isTextBox: true });
  }
  s.addNotes('We built the feature list directly from the problems. If a panelist asks why a feature exists, we can point to the problem it solves.');

  // ---------- 7. Theoretical framework ----------
  s = pres.addSlide(); s.background = { color: WHITE };
  title(s, 'Theoretical Framework', 'Four theories and models the study stands on');
  let [iw, ih] = imgSize('img/fig1_theoretical.png');
  let fw = 11.6, fh = fw * ih / iw;
  s.addImage({ path: 'img/fig1_theoretical.png', x: (W - fw) / 2, y: 1.85, w: fw, h: fh });
  s.addText([{ text: 'In short: ', options: { bold: true, color: BROWN } }, { text: 'people use it if it is useful and easy (TAM), it succeeds if it satisfies users and helps the shop (DeLone and McLean), a known appointment feels better than an unknown wait (Maister), and ISO/IEC 25010 tells us how to measure its quality.' }],
    { x: 0.6, y: 6.2, w: 12.1, h: 0.75, fontFace: BF, fontSize: 14.5, color: INK, margin: 0, isTextBox: true });
  s.addNotes('Explain each box in one sentence. TAM by Davis 1989: usefulness and ease of use. DeLone and McLean 2003: quality leads to use, satisfaction, and benefits. Maister 1985: uncertain waits feel longer. ISO/IEC 25010: the basis of our evaluation questionnaire.');

  // ---------- 8. Conceptual framework ----------
  s = pres.addSlide(); s.background = { color: WHITE };
  title(s, 'Conceptual Framework', 'Input-Process-Output model with a feedback loop');
  [iw, ih] = imgSize('img/fig2_conceptual.png');
  fh = 5.35; fw = fh * iw / ih;
  s.addImage({ path: 'img/fig2_conceptual.png', x: (W - fw) / 2, y: 1.8, w: fw, h: fh });
  s.addNotes('Input is what we need: knowledge, software, and hardware. Process is Agile development in three sprints, then evaluation. Output is the system and its acceptability results. The feedback arrow means user comments go back into improving the system after every sprint.');

  // ---------- 9. User journey ----------
  s = pres.addSlide(); s.background = { color: INK };
  s.addText('How it works: from home screen to confirmed slot', { x: 0.6, y: 0.4, w: 12.1, h: 0.8, fontFace: HF, fontSize: 32, bold: true, color: WHITE, margin: 0, isTextBox: true });
  const steps = [['img/screen1.png', 'Find a shop'], ['img/screen2.png', 'Choose a style'], ['img/screen3.png', 'Pick barber + preferences'], ['img/screen4.png', 'Pick a free slot'], ['img/screen6.png', 'Get confirmation'], ['img/screen7.png', 'Owner sees the queue']];
  const sw = 1.85, gap = (12.1 - 6 * sw) / 5;
  steps.forEach(([p, lab], i) => {
    const x = 0.6 + i * (sw + gap);
    s.addImage({ path: p, x, y: 1.45, w: sw, h: sw * 2 });
    s.addShape(pres.shapes.OVAL, { x: x + sw / 2 - 0.22, y: 5.4, w: 0.44, h: 0.44, fill: { color: i === 5 ? GOLD : BROWN }, line: { color: i === 5 ? GOLD : BROWN } });
    s.addText(String(i + 1), { x: x + sw / 2 - 0.22, y: 5.4, w: 0.44, h: 0.44, fontFace: BF, fontSize: 14, bold: true, color: WHITE, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
    s.addText(lab, { x: x - 0.1, y: 5.92, w: sw + 0.2, h: 0.6, fontFace: BF, fontSize: 13, bold: true, color: i === 5 ? GOLD : WHITE, align: 'center', valign: 'top', margin: 0, isTextBox: true });
  });
  s.addText('Screens 1 to 5 are the customer side. Screen 6 is the barbershop owner\'s dashboard.', { x: 0.6, y: 6.85, w: 12.1, h: 0.35, fontFace: BF, fontSize: 11, italic: true, color: 'B9B2A6', margin: 0, isTextBox: true });
  s.addNotes('Walk through the six screens. Emphasize screen 3: the saved haircut preferences. Also mention that taken slots on screen 4 are hidden automatically, which prevents double booking.');

  // ---------- 10. RRL ----------
  s = pres.addSlide(); s.background = { color: WHITE };
  title(s, 'What 46 sources told us', 'Review of Related Literature and Studies');
  const regions = [['8', 'Indonesia', 'barbershop booking systems (web, Android, Laravel, CodeIgniter)'], ['2', 'Malaysia', 'barber booking app and centralized barbershop management'], ['8', 'Philippines', 'appointment and reservation systems + MSME record-keeping studies']];
  regions.forEach((r, i) => {
    const y = 1.9 + i * 1.5;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 5.6, h: 1.3, fill: { color: i === 2 ? INK : SOFT }, line: { color: i === 2 ? INK : SOFT }, rectRadius: 0.1 });
    s.addText(r[0], { x: 0.85, y, w: 1.0, h: 1.3, fontFace: HF, fontSize: 44, bold: true, color: i === 2 ? GOLD : BROWN, valign: 'middle', margin: 0, isTextBox: true });
    s.addText([{ text: r[1] + ' studies', options: { bold: true, fontSize: 16, breakLine: true } }, { text: r[2], options: { fontSize: 12.5, color: i === 2 ? 'D9D2C6' : MUTED } }],
      { x: 1.9, y: y + 0.1, w: 4.1, h: 1.1, fontFace: BF, color: i === 2 ? WHITE : INK, valign: 'middle', margin: 0, isTextBox: true });
  });
  const lessons = [
    ['Uncertain waits feel longer', 'Maister (1985); Taylor (1994)'],
    ['SMS reminders increase attendance', 'Guy et al. (2012)'],
    ['Barber-client trust drives loyalty', 'Price and Arnould (1999)'],
    ['WhatsApp/chat bookings cause clashes', 'Hidayat and Wibowo (2023)'],
    ['Cancellation and reports need extra care', 'Rusdi and Isnin (2024)'],
    ['ISO 25010 is standard in PH system studies', 'Concepcion et al. (2026); Ramento et al. (2024)'],
  ];
  s.addText('KEY LESSONS WE TOOK', { x: 6.8, y: 1.85, w: 6, h: 0.35, fontFace: BF, fontSize: 12, bold: true, color: MUTED, charSpacing: 2, margin: 0, isTextBox: true });
  for (let i = 0; i < lessons.length; i++) {
    const y = 2.3 + i * 0.72;
    s.addImage({ data: await icon('FaCircleCheck', BROWN), x: 6.8, y: y + 0.05, w: 0.32, h: 0.32 });
    s.addText([{ text: lessons[i][0], options: { bold: true, fontSize: 14.5, breakLine: true } }, { text: lessons[i][1], options: { fontSize: 11.5, italic: true, color: MUTED } }],
      { x: 7.25, y, w: 5.5, h: 0.68, fontFace: BF, color: INK, margin: 0, valign: 'top', isTextBox: true });
  }
  s.addNotes('Our Chapter 2 has 46 references. The foreign studies show barbershops in Indonesia and Malaysia already face the same problems. The local studies show that online reservation systems are well accepted by Filipino users when evaluated with ISO 25010.');

  // ---------- 11. Gap ----------
  s = pres.addSlide(); s.background = { color: WHITE };
  title(s, 'The research gap', 'Most systems stop at the schedule. The haircut itself is left out.');
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.95, w: 5.4, h: 3.9, fill: { color: 'F7F4EF' }, line: { color: LINE }, rectRadius: 0.12 });
  s.addText('What reviewed systems focus on', { x: 0.9, y: 2.15, w: 4.9, h: 0.5, fontFace: BF, fontSize: 18, bold: true, color: MUTED, margin: 0, isTextBox: true });
  const left = ['Online booking of a date and time', 'Queue numbers and waiting estimates', 'Avoiding schedule clashes', 'Online payment (some systems)', 'Mostly built for Indonesia, Malaysia, or non-barbershop settings in the PH'];
  s.addText(left.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < left.length - 1 } })), { x: 0.9, y: 2.8, w: 4.9, h: 3.5, fontFace: BF, fontSize: 15, color: INK, paraSpaceAfter: 10, margin: 0, valign: 'top', isTextBox: true });
  await circleIcon(s, 'FaArrowRight', 6.25, 3.5, 0.8, GOLD, INK);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.3, y: 1.95, w: 5.4, h: 3.9, fill: { color: INK }, line: { color: INK }, rectRadius: 0.12 });
  s.addText('What BarberBook PH adds', { x: 7.6, y: 2.15, w: 4.9, h: 0.5, fontFace: BF, fontSize: 18, bold: true, color: GOLD, margin: 0, isTextBox: true });
  const right = ['Hairstyle gallery attached to the booking', 'Saved haircut preferences the barber reads before the cut', 'Preferred barber or "any available"', 'Reminders + owner dashboard + reports in one system', 'Built and evaluated for a Filipino barbershop'];
  s.addText(right.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < right.length - 1 } })), { x: 7.6, y: 2.8, w: 4.9, h: 3.5, fontFace: BF, fontSize: 15, color: WHITE, paraSpaceAfter: 10, margin: 0, valign: 'top', isTextBox: true });
  src(s, 'Based on the published descriptions of the studies reviewed in Chapter 2.');
  s.addNotes('This is our contribution. Existing systems handle the schedule. We also handle the haircut itself, through the gallery and saved preferences, which the literature shows is important for customer satisfaction and loyalty in personal services.');

  // ---------- 12. Scope ----------
  s = pres.addSlide(); s.background = { color: WHITE };
  title(s, 'Scope and delimitations', 'What the system will and will not do');
  const inScope = ['Customer registration and login', 'Shop listing with hours, services, prices', 'Hairstyle gallery by category', 'Preferred barber selection', 'Saved preferences and notes', 'Calendar and time-slot booking', 'Reschedule and cancel', 'Email / SMS confirmation and reminder', 'Owner dashboard and booking reports', 'Rating and feedback'];
  const outScope = ['Online payment (paid at the shop)', 'Payroll, inventory, full accounting', 'AI or AR hairstyle preview', 'More than one partner shop during testing', 'Offline use (needs internet)'];
  s.addText('IN SCOPE', { x: 0.6, y: 1.85, w: 6, h: 0.35, fontFace: BF, fontSize: 13, bold: true, color: GREEN, charSpacing: 2, margin: 0, isTextBox: true });
  for (let i = 0; i < inScope.length; i++) {
    const col = i % 2, row = Math.floor(i / 2), x = 0.6 + col * 3.9, y = 2.35 + row * 0.8;
    s.addImage({ data: await icon('FaCheck', GREEN), x, y: y + 0.07, w: 0.28, h: 0.28 });
    s.addText(inScope[i], { x: x + 0.4, y, w: 3.4, h: 0.45, fontFace: BF, fontSize: 14, color: INK, margin: 0, valign: 'middle', isTextBox: true });
  }
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.6, y: 1.85, w: 4.1, h: 4.9, fill: { color: 'F7F4EF' }, line: { color: LINE }, rectRadius: 0.12 });
  s.addText('OUT OF SCOPE', { x: 8.9, y: 2.05, w: 3.6, h: 0.35, fontFace: BF, fontSize: 13, bold: true, color: RED, charSpacing: 2, margin: 0, isTextBox: true });
  for (let i = 0; i < outScope.length; i++) {
    const y = 2.6 + i * 0.78;
    s.addImage({ data: await icon('FaXmark', RED), x: 8.9, y: y + 0.07, w: 0.28, h: 0.28 });
    s.addText(outScope[i], { x: 9.3, y, w: 3.2, h: 0.6, fontFace: BF, fontSize: 14, color: INK, margin: 0, valign: 'top', isTextBox: true });
  }
  s.addText([{ text: 'Setting: ', options: { bold: true } }, hl('[Partner Barbershop], [Municipality/City]'), { text: '   |   Period: October 2026 to March 2027   |   Walk-ins are still encoded manually by the owner.' }],
    { x: 0.6, y: 6.55, w: 7.8, h: 0.6, fontFace: BF, fontSize: 12, color: MUTED, margin: 0, valign: 'top', isTextBox: true });
  s.addNotes('Delimitations protect the study. If asked why there is no online payment: most local barbershops still collect cash, a payment gateway adds fees and security requirements, and our focus is waiting, scheduling, and communication.');

  // ---------- 13. Methodology ----------
  s = pres.addSlide(); s.background = { color: WHITE };
  title(s, 'How we will build it: Agile, in three sprints', 'Show the owner a working part after every sprint, then improve it right away');
  const tl = [['Oct 2026', 'Topic approval and concept paper'], ['Oct to Nov', 'Interview, survey, requirements'], ['Nov to Dec', 'System design, Chapters 1 to 3'], ['Dec 2026', 'Sprint 1: accounts and booking'], ['Jan 2027', 'Sprint 2: gallery and preferences'], ['Jan to Feb', 'Sprint 3: dashboard and notifications'], ['Feb 2027', 'Testing and evaluation'], ['Mar 2027', 'Revision, documentation, defense']];
  s.addShape(pres.shapes.LINE, { x: 0.9, y: 3.3, w: 11.5, h: 0, line: { color: LINE, width: 4 } });
  tl.forEach((t, i) => {
    const x = 0.6 + i * 1.53, sprint = i >= 3 && i <= 5;
    s.addShape(pres.shapes.OVAL, { x: x + 0.5, y: 3.1, w: 0.4, h: 0.4, fill: { color: sprint ? GOLD : BROWN }, line: { color: WHITE, width: 2 } });
    s.addText(t[0], { x, y: 2.45, w: 1.4, h: 0.45, fontFace: BF, fontSize: 13, bold: true, color: sprint ? BROWN : INK, align: 'center', margin: 0, isTextBox: true });
    s.addText(t[1], { x: x - 0.02, y: 3.7, w: 1.45, h: 1.0, fontFace: BF, fontSize: 12, color: MUTED, align: 'center', valign: 'top', margin: 0, isTextBox: true });
  });
  const tools = [['FaCode', 'Front end', 'HTML5, CSS3, JavaScript, Bootstrap'], ['FaServer', 'Back end', 'PHP with Laravel'], ['FaDatabase', 'Database', 'MySQL (XAMPP for local testing)'], ['FaPenRuler', 'Design and versioning', 'Figma, VS Code, GitHub']];
  for (let i = 0; i < tools.length; i++) {
    const x = 0.6 + i * 3.08;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 5.0, w: 2.85, h: 1.6, fill: { color: 'F7F4EF' }, line: { color: LINE }, rectRadius: 0.1 });
    await circleIcon(s, tools[i][0], x + 0.2, 5.2, 0.5);
    s.addText(tools[i][1], { x: x + 0.85, y: 5.2, w: 1.9, h: 0.5, fontFace: BF, fontSize: 14, bold: true, color: INK, margin: 0, valign: 'middle', isTextBox: true });
    s.addText(tools[i][2], { x: x + 0.2, y: 5.8, w: 2.5, h: 0.7, fontFace: BF, fontSize: 12, color: MUTED, margin: 0, valign: 'top', isTextBox: true });
  }
  s.addNotes('We chose Agile because the owner will likely have new requests after seeing the first version. The gold dots are the three development sprints. All tools are free, which keeps the system affordable for a micro enterprise.');

  // ---------- 14. Evaluation ----------
  s = pres.addSlide(); s.background = { color: WHITE };
  title(s, 'How we will evaluate it', 'ISO/IEC 25010-based questionnaire, four-point Likert scale, weighted mean');
  const resp = [['1', 'owner'], ['3 to 5', 'barbers'], ['30', 'regular customers']];
  s.addText('RESPONDENTS (PURPOSIVE SAMPLING)', { x: 0.6, y: 1.85, w: 5, h: 0.35, fontFace: BF, fontSize: 12, bold: true, color: MUTED, charSpacing: 2, margin: 0, isTextBox: true });
  resp.forEach((r, i) => {
    const y = 2.3 + i * 1.3;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 4.2, h: 1.1, fill: { color: SOFT }, line: { color: SOFT }, rectRadius: 0.1 });
    s.addText(r[0], { x: 0.85, y, w: 1.8, h: 1.1, fontFace: HF, fontSize: 34, bold: true, color: BROWN, valign: 'middle', margin: 0, isTextBox: true });
    s.addText(r[1], { x: 2.6, y, w: 2.1, h: 1.1, fontFace: BF, fontSize: 17, bold: true, color: INK, valign: 'middle', margin: 0, isTextBox: true });
  });
  s.addText('CRITERIA', { x: 5.3, y: 1.85, w: 3, h: 0.35, fontFace: BF, fontSize: 12, bold: true, color: MUTED, charSpacing: 2, margin: 0, isTextBox: true });
  const crit = [['FaGears', 'Functionality'], ['FaHandPointer', 'Usability'], ['FaBolt', 'Efficiency'], ['FaShieldHalved', 'Reliability'], ['FaFaceSmile', 'User satisfaction']];
  for (let i = 0; i < crit.length; i++) {
    const y = 2.3 + i * 0.78;
    await circleIcon(s, crit[i][0], 5.3, y, 0.55, INK, GOLD);
    s.addText(crit[i][1], { x: 6.05, y, w: 2.3, h: 0.55, fontFace: BF, fontSize: 16, bold: true, color: INK, valign: 'middle', margin: 0, isTextBox: true });
  }
  s.addText('INTERPRETATION SCALE', { x: 8.8, y: 1.85, w: 4, h: 0.35, fontFace: BF, fontSize: 12, bold: true, color: MUTED, charSpacing: 2, margin: 0, isTextBox: true });
  const scale = [['4', '3.26 to 4.00', 'Highly Acceptable'], ['3', '2.51 to 3.25', 'Acceptable'], ['2', '1.76 to 2.50', 'Slightly Acceptable'], ['1', '1.00 to 1.75', 'Not Acceptable']];
  const rows = [[{ text: 'Scale', options: { bold: true, color: WHITE, fill: { color: INK } } }, { text: 'Mean range', options: { bold: true, color: WHITE, fill: { color: INK } } }, { text: 'Interpretation', options: { bold: true, color: WHITE, fill: { color: INK } } }]]
    .concat(scale.map((r, i) => r.map(c => ({ text: c, options: { fill: { color: i % 2 ? WHITE : 'F7F4EF' } } }))));
  s.addTable(rows, { x: 8.8, y: 2.3, w: 3.9, colW: [0.7, 1.35, 1.85], fontFace: BF, fontSize: 12.5, color: INK, border: { type: 'solid', pt: 0.75, color: LINE }, rowH: 0.5, valign: 'middle' });
  s.addText([hl('Proposed scale. Confirm the ranges and descriptors with your adviser.')], { x: 8.8, y: 5.0, w: 3.9, h: 0.6, fontFace: BF, fontSize: 11, italic: true, margin: 0, isTextBox: true });
  s.addNotes('The evaluation instrument is adapted from ISO/IEC 25010. Respondents rate each item from 1 to 4. We compute the weighted mean per criterion and interpret it using this scale.');

  // ---------- 15. Title options ----------
  s = pres.addSlide(); s.background = { color: WHITE };
  title(s, 'Proposed title options for approval', 'We prepared three options for the adviser\'s guidance');
  const opts = [
    ['OPTION 1', 'BarberBook PH', 'An Online Appointment and Haircut Preference System for Local Barbershops', 'Current working title. Already matches the Statement of the Problem.', true],
    ['OPTION 2', 'TrimTime', 'A Web-Based Appointment Scheduling and Hairstyle Preference Management System for Barbershops in [Municipality]', 'More technical wording and a specific locale.', false],
    ['OPTION 3', 'GupitGo', 'A Mobile-Responsive Booking and Haircut Preference Recording System for Local Barbershops with Customer Records Management', 'Local and catchy, with a record-keeping angle.', false],
  ];
  opts.forEach((o, i) => {
    const x = 0.6 + i * 4.1;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.9, w: 3.85, h: 4.1, fill: { color: o[4] ? INK : 'F7F4EF' }, line: { color: o[4] ? INK : LINE }, rectRadius: 0.12 });
    s.addText(o[0] + (o[4] ? '  ·  RECOMMENDED' : ''), { x: x + 0.3, y: 2.15, w: 3.3, h: 0.35, fontFace: BF, fontSize: 11, bold: true, color: GOLD, charSpacing: 2, margin: 0, isTextBox: true });
    s.addText(o[1], { x: x + 0.3, y: 2.55, w: 3.3, h: 0.75, fontFace: HF, fontSize: 30, bold: true, color: o[4] ? WHITE : BROWN, margin: 0, isTextBox: true });
    s.addText(o[2], { x: x + 0.3, y: 3.4, w: 3.3, h: 2.0, fontFace: BF, fontSize: 15, color: o[4] ? SOFT : INK, margin: 0, valign: 'top', isTextBox: true });
    s.addText(o[3], { x: x + 0.3, y: 5.0, w: 3.3, h: 0.9, fontFace: BF, fontSize: 12, italic: true, color: o[4] ? 'B9B2A6' : MUTED, margin: 0, valign: 'top', isTextBox: true });
  });
  s.addNotes('We would like the adviser\'s guidance on the final title. Option 1 is our recommendation because it already matches our research questions.');

  // ---------- 16. Close ----------
  s = pres.addSlide(); s.background = { path: 'img/closebg.jpg' };
  s.addImage({ data: await icon('FaScissors', GOLD), x: 0.8, y: 1.6, w: 0.9, h: 0.9 });
  s.addText('Salamat po!', { x: 0.8, y: 2.7, w: 9, h: 1.2, fontFace: HF, fontSize: 60, bold: true, color: WHITE, margin: 0, isTextBox: true });
  s.addText('We welcome your questions, comments, and suggestions.', { x: 0.8, y: 3.95, w: 9, h: 0.6, fontFace: BF, fontSize: 22, color: SOFT, margin: 0, isTextBox: true });
  s.addText([{ text: 'BarberBook PH', options: { bold: true, color: GOLD, breakLine: true } }, hl('[Member 1]  ·  [Member 2]  ·  [Member 3]  ·  [Member 4]')], { x: 0.8, y: 5.3, w: 9, h: 0.9, fontFace: BF, fontSize: 14, color: WHITE, margin: 0, isTextBox: true });
  s.addNotes('Thank the panel and open the floor. Refer to the "Questions Your Panel Will Probably Ask" section of the group guide to prepare.');

  await pres.writeFile({ fileName: 'Deck.pptx' });
  console.log('ok');
})();
