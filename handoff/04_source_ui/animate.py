"""Add slide transitions + auto-play entrance animations to a pptxgenjs deck.
Shapes named 'anim:<step>:<effect>:<slot>' are animated. Steps play in order; slots inside a step are staggered."""
import re, sys, zipfile, shutil

SRC, DST = sys.argv[1], sys.argv[2]
STAGGER = 120
DUR = {'float': 550, 'zoom': 420, 'wipe': 450, 'fade': 450}
PRESET = {'float': (42, 0), 'zoom': (53, 16), 'wipe': (22, 8), 'fade': (10, 0)}
TRANS = {1: '<p:fade/>', 24: '<p:split orient="horz" dir="out"/>'}
DEFAULT_TRANS = '<p:push dir="u"/>'


class Ids:
    def __init__(self): self.n = 4
    def __call__(self): self.n += 1; return self.n


def tgt(spid): return f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl>'


def set_vis(ids, spid):
    return (f'<p:set><p:cBhvr><p:cTn id="{ids()}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>'
            f'{tgt(spid)}<p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr>'
            f'<p:to><p:strVal val="visible"/></p:to></p:set>')


def anim(ids, spid, attr, v0, v1, dur):
    def val(v): return f'<p:fltVal val="{v}"/>' if isinstance(v, (int, float)) else f'<p:strVal val="{v}"/>'
    return (f'<p:anim calcmode="lin" valueType="num"><p:cBhvr additive="base"><p:cTn id="{ids()}" dur="{dur}" fill="hold"/>'
            f'{tgt(spid)}<p:attrNameLst><p:attrName>{attr}</p:attrName></p:attrNameLst></p:cBhvr>'
            f'<p:tavLst><p:tav tm="0"><p:val>{val(v0)}</p:val></p:tav><p:tav tm="100000"><p:val>{val(v1)}</p:val></p:tav></p:tavLst></p:anim>')


def effect(ids, spid, filt, dur):
    return f'<p:animEffect transition="in" filter="{filt}"><p:cBhvr><p:cTn id="{ids()}" dur="{dur}"/>{tgt(spid)}</p:cBhvr></p:animEffect>'


def behaviours(ids, spid, eff):
    d = DUR[eff]
    b = set_vis(ids, spid)
    if eff == 'float':
        b += effect(ids, spid, 'fade', d) + anim(ids, spid, 'ppt_x', '#ppt_x', '#ppt_x', d) + anim(ids, spid, 'ppt_y', '#ppt_y+.1', '#ppt_y', d)
    elif eff == 'zoom':
        b += anim(ids, spid, 'ppt_w', 0, '#ppt_w', d) + anim(ids, spid, 'ppt_h', 0, '#ppt_h', d) + effect(ids, spid, 'fade', d)
    elif eff == 'wipe':
        b += effect(ids, spid, 'wipe(left)', d)
    else:
        b += effect(ids, spid, 'fade', d)
    return b


def build_timing(items):
    """items: list of (spid, step, eff, slot) -> timing xml"""
    steps = sorted(set(i[1] for i in items))
    ids = Ids()
    pars, t, first = [], 0, True
    for st in steps:
        group = [i for i in items if i[1] == st]
        end = 0
        for spid, _, eff, slot in group:
            delay = t + slot * STAGGER
            end = max(end, slot * STAGGER + DUR[eff])
            pid, sub = PRESET[eff]
            node = 'afterEffect' if first else 'withEffect'
            first = False
            cid = ids()
            pars.append(f'<p:par><p:cTn id="{cid}" presetID="{pid}" presetClass="entr" presetSubtype="{sub}" fill="hold" nodeType="{node}">'
                        f'<p:stCondLst><p:cond delay="{delay}"/></p:stCondLst><p:childTnLst>{behaviours(ids, spid, eff)}</p:childTnLst></p:cTn></p:par>')
        t += max(end - 150, 200)
    inner = f'<p:par><p:cTn id="4" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>{"".join(pars)}</p:childTnLst></p:cTn></p:par>'
    # renumber: inner cTn id=3 collides with Ids starting at 4? Ids starts at 3 and pre-increments -> first id 4. Outer click par gets id 2.5 -> use unique below.
    return ('<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>'
            '<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>'
            '<p:par><p:cTn id="3" fill="hold"><p:stCondLst><p:cond delay="indefinite"/><p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond></p:stCondLst>'
            f'<p:childTnLst>{inner}</p:childTnLst></p:cTn></p:par>'
            '</p:childTnLst></p:cTn><p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>'
            '<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq>'
            '</p:childTnLst></p:cTn></p:par></p:tnLst></p:timing>')


def process(xml, num):
    items = []
    for m in re.finditer(r'<p:cNvPr id="(\d+)" name="anim:(\d+):(\w+):(\d+)"', xml):
        items.append((int(m.group(1)), int(m.group(2)), m.group(3), int(m.group(4))))
    trans = f'<p:transition spd="med">{TRANS.get(num, DEFAULT_TRANS)}</p:transition>'
    timing = build_timing(items) if items else ''
    xml = re.sub(r'<p:transition.*?</p:transition>|<p:timing>.*?</p:timing>', '', xml, flags=re.S)
    anchor = '</p:clrMapOvr>' if '</p:clrMapOvr>' in xml else '</p:cSld>'
    return xml.replace(anchor, anchor + trans + timing, 1), len(items)


with zipfile.ZipFile(SRC) as zi, zipfile.ZipFile(DST + '.tmp', 'w', zipfile.ZIP_DEFLATED) as zo:
    for it in zi.infolist():
        d = zi.read(it.filename)
        m = re.match(r'ppt/slides/slide(\d+)\.xml$', it.filename)
        if m:
            x, n = process(d.decode('utf8'), int(m.group(1)))
            print(it.filename, 'animated shapes:', n)
            d = x.encode('utf8')
        zo.writestr(it, d)
shutil.move(DST + '.tmp', DST)
