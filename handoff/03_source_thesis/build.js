const fs = require('fs');
const d = require('docx');
const { Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType, Header, PageNumber, LevelFormat, HeadingLevel, TableLayoutType } = d;

const GUIDE = process.env.MODE === 'guide';
const FONT = GUIDE ? 'Calibri' : 'Times New Roman';
const DOUBLE = GUIDE ? { line: 288, before: 0, after: 140 } : { line: 480, before: 0, after: 0 };
const TW = GUIDE ? 9360 : 8640;

function runs(text, fmt = {}) {
  const out = [];
  const re = /(\*\*.+?\*\*|\[\[.+?\]\]|\*[^*]+?\*)/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(new TextRun({ text: text.slice(last, m.index), font: FONT, size: fmt.size || 24, ...fmt }));
    const t = m[0];
    if (t.startsWith('**')) out.push(...runs(t.slice(2, -2), { ...fmt, bold: true }));
    else if (t.startsWith('[[')) out.push(...runs(t.slice(2, -2), { ...fmt, highlight: 'yellow' }));
    else out.push(...runs(t.slice(1, -1), { ...fmt, italics: true }));
    last = m.index + t.length;
  }
  if (last < text.length) out.push(new TextRun({ text: text.slice(last), font: FONT, size: fmt.size || 24, ...fmt }));
  return out;
}

function img(path, widthIn) {
  const buf = fs.readFileSync(path);
  const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
  const W = widthIn * 96, H = W * h / w;
  return new ImageRun({ type: 'png', data: buf, transformation: { width: W, height: H } });
}

function parse(files) {
  const lines = files.map(f => fs.readFileSync(f, 'utf8')).join('\n').split('\n');
  const kids = [];
  let tbl = null, tcap = null;
  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');
    if (!line) continue;
    if (tbl) {
      if (line === 'ENDTBL') { kids.push(makeTable(tbl)); kids.push(new Paragraph({ spacing: DOUBLE, children: [] })); tbl = null; continue; }
      tbl.push(line.split('|')); continue;
    }
    const sp = line.indexOf(' ');
    const tag = sp > 0 ? line.slice(0, sp) : line;
    const body = sp > 0 ? line.slice(sp + 1) : '';
    switch (tag) {
      case 'PB': kids.push(new Paragraph({ pageBreakBefore: true, children: [] })); break;
      case '#': kids.push(new Paragraph({ heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: DOUBLE, children: runs(body, GUIDE ? { bold: true, size: 40, color: '1B1A17' } : { bold: true }) })); break;
      case '##': kids.push(new Paragraph({ heading: HeadingLevel.HEADING_2, alignment: GUIDE ? AlignmentType.LEFT : AlignmentType.CENTER, border: GUIDE ? { bottom: { style: BorderStyle.SINGLE, size: 8, color: '8A5A2B', space: 2 } } : undefined, spacing: { line: 480, before: 240 }, keepNext: true, children: runs(body, GUIDE ? { bold: true, color: '5A3A1A', size: 30 } : { bold: true }) })); break;
      case 'H2': kids.push(new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: GUIDE ? { before: 200, after: 80 } : { line: 480, before: 120 }, keepNext: true, children: runs(body, GUIDE ? { bold: true, color: '8A5A2B', size: 26 } : { bold: true }) })); break;
      case 'H3': kids.push(new Paragraph({ heading: HeadingLevel.HEADING_4, spacing: DOUBLE, keepNext: true, indent: { left: 0 }, children: runs(body, { bold: true, italics: true }) })); break;
      case 'P': kids.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: DOUBLE, indent: GUIDE ? undefined : { firstLine: 720 }, children: runs(body) })); break;
      case 'C': kids.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: DOUBLE, children: runs(body) })); break;
      case 'NOTE': kids.push(new Paragraph({ spacing: { line: 276, before: 120, after: 240 }, border: { top: b(), left: b(), bottom: b(), right: b() }, children: runs(body, { italics: true, highlight: 'yellow', size: 22 }) })); break;
      case 'L1': case 'L2': {
        const [lab, txt] = body.split('|');
        const left = tag === 'L1' ? 1080 : 1800, hang = tag === 'L1' ? 360 : 540;
        kids.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: DOUBLE, indent: { left, hanging: hang }, children: [new TextRun({ text: lab + '\t', font: FONT, size: 24 }), ...runs(txt)], tabStops: [{ type: 'left', position: left }] }));
        break;
      }
      case 'B': kids.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: DOUBLE, numbering: { reference: 'bul', level: 0 }, children: runs(body) })); break;
      case 'DEF': {
        const [term, txt] = body.split('|');
        kids.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: DOUBLE, indent: { firstLine: 720 }, children: [...runs(term, { bold: true }), new TextRun({ text: ' ', font: FONT, size: 24 }), ...runs(txt)] }));
        break;
      }
      case 'FIG': { const [pth, w] = body.split('|'); kids.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 120 }, keepNext: true, children: [img(pth, parseFloat(w || '6.0'))] })); break; }
      case 'CAP': kids.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 480, after: 120 }, children: runs(body, { italics: true }) })); break;
      case 'TCAP': kids.push(new Paragraph({ alignment: AlignmentType.LEFT, spacing: { line: 480 }, keepNext: true, children: runs(body, { bold: true }) })); break;
      case 'TBL': tbl = []; break;
      case 'REF': kids.push(new Paragraph({ alignment: AlignmentType.LEFT, spacing: DOUBLE, indent: { left: 720, hanging: 720 }, children: runs(body) })); break;
      default: throw new Error('unknown tag ' + tag + ' in: ' + line);
    }
  }
  return kids;
}
function b() { return { style: BorderStyle.SINGLE, size: 6, color: 'B8860B', space: 4 }; }

function makeTable(rows) {
  const n = rows[0].length; const widths = n === 4 ? (GUIDE ? [1900,1700,2800,2960] : [1800, 1500, 2580, 2760]) : n === 2 ? [2900, TW-2900] : n===3 ? [2400,3480,3480] : Array(n).fill(Math.floor(TW/n));
  const cb = { style: BorderStyle.SINGLE, size: 4, color: '000000' };
  return new Table({
    width: { size: TW, type: WidthType.DXA }, columnWidths: widths, layout: TableLayoutType.FIXED,
    rows: rows.map((r, i) => new TableRow({
      tableHeader: i === 0, cantSplit: true,
      children: r.map((c, j) => new TableCell({
        width: { size: widths[j], type: WidthType.DXA },
        borders: { top: cb, bottom: cb, left: cb, right: cb },
        shading: i === 0 ? { type: ShadingType.CLEAR, color: 'auto', fill: 'E7E1D8' } : undefined,
        margins: { top: 60, bottom: 60, left: 90, right: 90 },
        children: [new Paragraph({ spacing: { line: 240 }, children: runs(c, { size: 20, bold: i === 0 }) })]
      }))
    }))
  });
}

function titlePage() {
  const P = (t, o = {}) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 276, after: o.after ?? 0 }, children: runs(t, o.f || {}) });
  return [
    new Paragraph({ pageBreakBefore: true, children: [] }),
    P('[[NAME OF SCHOOL / UNIVERSITY]]', { f: { bold: true } }),
    P('[[Address of the School, City, Province]]'),
    P('[[College / Department]]', { after: 1400 }),
    P('BARBERBOOK PH: AN ONLINE APPOINTMENT AND HAIRCUT', { f: { bold: true } }),
    P('PREFERENCE SYSTEM FOR LOCAL BARBERSHOPS', { f: { bold: true }, after: 1000 }),
    P('A Capstone Project'),
    P('Presented to the Faculty of the'),
    P('[[College / Department]]'),
    P('[[Name of School / University]]', { after: 600 }),
    P('In Partial Fulfillment'),
    P('of the Requirements for the Degree of'),
    P('[[Bachelor of Science in Information Technology / Accountancy / Accounting Information System]]', { after: 1000 }),
    P('by', { after: 200 }),
    P('[[SURNAME, First Name M.I. of Member 1]]'),
    P('[[SURNAME, First Name M.I. of Member 2]]'),
    P('[[SURNAME, First Name M.I. of Member 3]]'),
    P('[[SURNAME, First Name M.I. of Member 4]]', { after: 1000 }),
    P('[[Month Year of Submission]]'),
  ];
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: FONT, size: 24 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 24, bold: true, color: '000000' }, paragraph: { outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 24, bold: true, color: '000000' }, paragraph: { outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 24, bold: true, color: '000000' }, paragraph: { outlineLevel: 2 } },
      { id: 'Heading4', name: 'Heading 4', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 24, bold: true, italics: true, color: '000000' }, paragraph: { outlineLevel: 3 } },
    ]
  },
  numbering: { config: [{ reference: 'bul', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 1080, hanging: 360 } } } }] }] },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, bottom: 1440, left: GUIDE ? 1440 : 2160, right: 1440, header: 720 } } },
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 24 })] })] }) },
    children: (() => {
      if (GUIDE) return parse(['guide.txt']);
      const opts = parse(['opts.txt']);
      return [...opts, ...titlePage(), ...parse(['ch1body.txt', 'ch2.txt', 'refs.txt'])];
    })()
  }]
});
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(process.argv[2] || 'out.docx', buf); console.log('written'); });
