# HANDOFF — BarberBook PH Thesis Project

> **To the new Claude:** Read this whole file first. It is a complete state-of-the-project brief plus a backup index. Do not redo finished work. Unzip this package into your working directory, confirm the files exist, then ask JC what to do next (suggestions in section 10). Don't recap this file back at length; just say you're caught up and ready.

Handoff date: 2026-10-04. Prior assistant: Claude (Cowork session, Sonnet 5.5). Owner: JC (johnc.tiempo@gmail.com; use the email only to identify them).

---

## 1. Project in one paragraph

**BarberBook PH — An Online Appointment and Haircut Preference System for Local Barbershops.** A college capstone/thesis by BS Accountancy + BS IT students (Philippines). Known proponent from the concept paper: **Mark Joshua Tiempo**; other group members unknown, so names are placeholders. Customers book barbers online, pick a haircut style, and save preferences; owners manage a queue, walk-ins, barbers, and reports. The research gap the thesis claims: existing apps (Booksy, Fresha) do scheduling but do not make **haircut preference** the core feature, and are not tailored to small Philippine barbershops.

## 2. What the user originally wanted (and still wants)

- Complete **Chapter 1 and Chapter 2** based on the user's exact Statement of the Problem and the uploaded concept paper.
- Voice: intermediate college-student writing, not jargon-heavy, believable, not detectable as AI. APA 7th, real verified references with in-text citations.
- **Placeholders** for unknown names/data, and **everything the students must edit highlighted yellow**.
- A "dummy version" guide so the group understands what was written.
- A preliminary PowerPoint with images to impress the professor, later restyled with the **Neo-Brutalism** theme and animated.
- Three title options for the group to choose from.
- A spec to have **Claude Code** build a single-file, no-login HTML demo.
- A separate deck showing as many **mobile and web UI screens** as possible.
- JC's style: casual, enthusiastic; wants to "make them excited" and show what Claude is capable of. Keep replies short and warm; no heavy formatting.

## 3. Status: what is DONE

| # | Deliverable | File (in `01_final_deliverables/`) | State |
|---|---|---|---|
| 1 | Chapters 1–2 + title options page + title page + References (≈40 pages) | `Chapters_1-2_BarberBook_PH.docx` | Done; passes Word schema validation |
| 2 | Plain-language group guide (9 pages) | `BarberBook_PH_Simple_Guide_for_the_Group.docx` | Done |
| 3 | First preliminary deck (16 slides, brown/gold, no animation) | `BarberBook_PH_Preliminary_Presentation.pptx` | Superseded by #4 but kept |
| 4 | Preliminary deck, Neo-Brutalist, animated, speaker notes (16 slides) | `BarberBook_PH_Preliminary_Presentation_Animated.pptx` | Done — **the one to use** |
| 5 | Spec to have Claude Code build the demo | `BarberBook_PH_Demo_Build_Spec_for_Claude_Code.md` | Done; the demo itself is NOT built yet |
| 6 | UI showcase deck (24 slides, animated; 17 mobile + 9 web screens + design system) | `BarberBook_PH_UI_Showcase.pptx` | Done |
| 7 | All UI screen PNGs | `04_source_ui/out/*.png` (re-zip if needed; the separate zip was dropped to save space) | Done |

Everything above was delivered to the user. Note: built outputs (Chapters.docx, Guide.docx, Deck2.pptx, Showcase.pptx) are not duplicated in the source folders; rebuilding recreates them.

### Chapter contents (so you don't have to open the docx)
- **Ch.1:** Introduction; Background of the Study; Theoretical Framework (TAM, DeLone & McLean IS Success, Maister's Psychology of Waiting Lines, ISO/IEC 25010); Conceptual Framework (Input–Process–Output with feedback loop, native-drawn figure); Statement of the Problem (6 research questions — the user's exact wording, do not alter); Objectives; Assumptions; Significance; Scope and Delimitation; Definition of Terms (25).
- **Ch.2:** Foreign Literature; Local Literature; Foreign Studies; Local Studies; Related Existing Systems; Synthesis (Table 1 + the research gap).
- **References:** 46 entries (APA 7), listed in `03_source_thesis/refs.txt`. Notable stats used: Kemp 2026 *Digital 2026 Philippines* (98M internet users, 83.8% penetration, 95.8M social identities, 137M mobile connections); DTI MSME stats (1,246,373 enterprises; 99.63% MSMEs; 90.43% micro; 66.97% employment; 87,197 "other service activities"); NEDA PDP 2023–2028; RA 8792; RA 10173.
- **Title page** has placeholders; a separate page lists the 3 title options.

## 4. Design system (Neo-Brutalism) — used by decks, mockups, and the future demo

- Colors: cobalt `#1E50FF`, yellow `#FFE600`, soft yellow `#FEF08A`, ice `#E2F1F8`, black `#000`; status colors green `#22C55E`, red `#EF4444`, amber `#F59E0B`.
- Borders 2.5px solid black, hard offset shadows (4px 4px 0 #000), slightly rotated badges, UPPERCASE 800–900 weight headings, tight letter-spacing.
- Font: Outfit in the web spec (Poppins used for local renders; Arial/Cambria inside pptx).
- Full spec: `02_original_uploads/f1fbebc5-Neo_Brutalism_Theme_and_UI_Specification_1.md`. UI reference mockup: `359ce92f-BarberBook_PH_UI_Mockup.html`.

## 5. Document formatting rules (thesis docx)

Times New Roman 12, double-spaced, US Letter, 1.5" left margin, page number top right, APA 7th. Anything the students must edit is highlighted yellow (`highlight: 'yellow'`). In source text files, placeholders are written `[[like this]]`.

## 6. Package map and how to rebuild everything

```
HANDOFF.md                          <- this file
01_final_deliverables/              <- the 6 finished files (built copies live ONLY here)
02_original_uploads/                <- concept paper, UI mockup html, Neo-Brutalism spec, Word-error screenshot
03_source_thesis/                   <- docx + deck source (build.js, deck2.js, animate.py, fixdocx.py, content .txt files, img/)
04_source_ui/                       <- UI screens + showcase deck source (ui.js, ui.css, shoot.py, deck3.js, out/*.png)
```

Tools needed: Node with global `docx`, `pptxgenjs`, `react`, `react-dom`, `react-icons`, `sharp`; Python with `python-pptx`, `Pillow`, `playwright` (Chromium); LibreOffice (for PDF renders/previews). If Node can't find modules, run `export NODE_PATH=$(npm root -g)`. Copy `03_source_thesis` to `/home/claude/thesis` and `04_source_ui` to `/home/claude/ui` (or run in place).

**Chapters docx**
```
cd 03_source_thesis
node build.js Chapters.docx && python3 fixdocx.py Chapters.docx
```
**Group guide**
```
MODE=guide node build.js Guide.docx && python3 fixdocx.py Guide.docx
```
**Animated preliminary deck**
```
node deck2.js            # writes Deck2_raw.pptx
python3 animate.py Deck2_raw.pptx Deck2.pptx
```
**UI screens + showcase deck**
```
cd 04_source_ui
python3 shoot.py         # Playwright renders ui.html -> out/*.png (transparent, 2x)
node deck3.js            # writes Showcase_raw.pptx
python3 animate.py Showcase_raw.pptx Showcase.pptx
```
(`deck3.js` expects `animate.py` TRANS = `{1:'fade', 24:'split'}`; `thesis/animate.py` has `{1:'fade', 16:'split'}`.)

**Always validate before delivering** (skills at `/mnt/skills/public/`, if available in your environment):
```
python3 /mnt/skills/public/docx/scripts/office/validate.py <file.docx>
python3 /mnt/skills/public/pptx/scripts/office/validate.py <file.pptx>
```
Render to PDF/images with `soffice.py` and view pages before sending.

### Content markup used by `build.js` (txt files)
`PB` page break · `#`/`##` headings · `H2`/`H3` · `P` paragraph · `C` centered · `NOTE` yellow boxed note · `L1`/`L2` numbered (`label|text`) · `B` bullet · `DEF` (`Term.|definition`) · `FIG` (`path|widthIn`) · `CAP` · `TCAP` · `TBL … ENDTBL` (rows `a|b|c|d`) · `REF`. Inline: `**bold**`, `*italic*`, `[[yellow highlight]]`.

### How the animation works
pptxgenjs shapes get `objectName` = `anim:<step>:<effect>:<slot>` (effects: float, zoom, wipe, fade). `animate.py` post-processes slide XML adding `<p:transition>` and `<p:timing>` (auto-play, 120ms stagger). Default transition is push-up. Animations can't be previewed in LibreOffice; tell the user to open in PowerPoint and press F5.

## 7. Lessons learned / known pitfalls (do not repeat)

1. **Word refused to open the first docx** ("experienced an error trying to open the file"). Cause: docx-js emitted `<w:highlightCs/>` and `w:pBdr` children in the wrong order. Fix = `fixdocx.py` (strips `highlightCs`, reorders pBdr to top,left,bottom,right,between,bar). **Run it after every build, and run validate.py.** LibreOffice will happily render files Word rejects, so a LibreOffice preview is not proof.
2. pptxgenjs `margin` arrays are in points vs inches inconsistently — use scalar margins.
3. PIL pasting transparent PNGs: convert to RGBA first.
4. Web screen PNGs came out with gray backgrounds until `shoot.py` injected `body{background:transparent !important}`.
5. `animate.py` timing IDs must be unique (outer par id 3, inner par id 4, counter starts at 4).
6. Web fetch limits: ACM, ResearchGate and some others return 429/403. Do **not** work around blocks with curl/python. Cite only sources actually verified.
7. Only cite references that were confirmed; the 46 in `refs.txt` were verified.

## 8. Open items the GROUP must do (not the assistant)

- Fill every yellow-highlighted placeholder: group member names, adviser, school, department, dates, any local barbershop names/data.
- Choose 1 of the 3 titles and delete the options page.
- Replace placeholder data/screenshots if their real prototype changes.
- Verify each reference in the library/Google Scholar before submitting (the guide tells them how).
- Decide which survey/interview details go in Chapter 3 (not yet written).

## 9. Not done yet

- `barberbook-demo.html` is **not built**. JC plans to hand `BarberBook_PH_Demo_Build_Spec_for_Claude_Code.md` to Claude Code (single file, no login, hash routing, localStorage store, CONFIG block, seed data, customer screens C1–C10, owner screens O1–O6, split-screen live sync, 10-step guided tour, acceptance checklist, paste-ready prompt at the end of the spec).
- Chapter 3 (Methodology) and beyond.
- Adviser/panel feedback revisions.

## 10. Suggested next steps (offer, don't assume)

1. Build the HTML demo from the spec (or confirm JC ran it in Claude Code, and QA the result against the acceptance checklist).
2. Draft Chapter 3: research design (likely Agile/iterative development), respondents/sampling, instruments (Likert-scale questionnaire, ISO/IEC 25010 evaluation), data-gathering, statistical treatment (weighted mean), system development, ethics (RA 10173).
3. Revise Ch.1–2 after adviser comments (edit `ch1body.txt`, `ch2.txt`, `refs.txt`, rebuild with the commands above).
4. Add speaker notes / a defense Q&A deck.

## 11. How to resume (first 3 minutes)

1. Unzip; `ls` the four folders; confirm `03_source_thesis/build.js` and `04_source_ui/ui.js` exist.
2. If you need to edit, rebuild from source (section 6), validate, then deliver the file to the user. Do not hand-edit the docx/pptx unless trivial.
3. Tell JC in one or two warm sentences that you're caught up, and ask what they want next.

## 12. Original user messages (condensed, for tone and intent)

- Initial: uploaded concept paper + UI mockup; asked for Ch.1–2 from the six-question SOP; BS Accountancy/IT students; intermediate student-written; not AI-detectable; real references; deep research; placeholders; yellow highlights; explanation for students; amazing preliminary PPT with images.
- "Give them like three different ideas [for titles] they can just choose from."
- Reported Word error on opening the docx (fixed).
- Uploaded Neo-Brutalism spec: asked for animations on the deck, restyle with the theme, instructions for Claude Code to build a no-login sample HTML, "show them what you're capable of."
- "Give me sample UI mobile base... the most possible UI or interface both web and mobile; let's make them excited."
- Asked for this combined backup + handoff zip.
