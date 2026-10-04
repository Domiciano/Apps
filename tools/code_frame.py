"""Genera los frames de código anotado en SVG de las lecciones del Seminario.

Editor oscuro a la izquierda, panel claro a la derecha con el resultado dibujado, y una
flecha de cada propiedad del código a lo que cambia en el resultado. Hermano de
console_frame.py. Ver CLAUDE.md → "Código: frame de editor SVG".

Uso, desde un script propio (ver tools/sesion2_figuras.py):

    import sys; sys.path.insert(0, 'tools')
    from code_frame import frame
    svg = frame(dict(
        id='txAnatomia',                      # único en todo el sitio; prefija CSS e ids
        title='Las partes de un <tspan class="mono">Text</tspan>',
        title_plain='Las partes de un Text',
        desc='Descripción accesible de lo que muestra la figura.',
        sub='Una línea que explica qué mirar.',
        file='lib/main.dart',                 # nombre en la barra del editor
        code=["Text(", "  'Hola',", ")"],     # una cadena por línea, con su sangría
        panel='RESULTADO',                    # rótulo del panel derecho
        result='<text …>Hola</text>',         # SVG del panel; (0,0) es su esquina, mide 360 de ancho
        arrows=[dict(line=1, find="'Hola'", to=(40, 80), color='amber', lane=0)],
        cards=[('amber', 'Título', ['línea 1', 'línea 2'])],   # tarjetas bajo el frame
    ))

`arrows`: `line` es el índice de la línea de código y `find` el texto que se resalta en
ella. `to` es el punto del panel donde termina la flecha. `lane` (0 a 3) elige el carril
vertical entre el editor y el panel, para que dos flechas no se monten. Con `end='v'` la
flecha sale recta de su línea y baja al punto. Con `via=[(x, y)]` pasa primero por esos
puntos del panel, para rodear el dibujo y llegar desde abajo.
Después de generar: validar con check.py y mirar el render de la skill svg-diagrams.
"""

import re
from xml.sax.saxutils import escape

CW = 7.8            # ancho de un carácter mono a 13 px
LH = 24             # alto de línea
EX, EW = 48, 456    # editor
PX, PW = 552, 360   # panel
TX = EX + 20        # x del texto
Y0 = 112
BAR = 32

TONES = {
    'amber': ('#F2C069', '#A96C05', '#FFF3DC'),
    'green': ('#9FD68D', '#3A8235', '#E8F6E3'),
    'violet': ('#C9A6EE', '#7439B8', '#F4EBFF'),
    'indigo': ('#A9B4F2', '#4453C9', '#EEF1FF'),
    'rose': ('#F3A3B2', '#C2354F', '#FFEBEF'),
    'teal': ('#86D3CA', '#0F8478', '#E3F6F3'),
}

KEYWORDS = {'const', 'return', 'class', 'extends', 'final', 'void', 'import', 'super',
            'required', 'this', 'null', 'true', 'false', 'flutter', 'assets'}
TOKEN = re.compile(r"""('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(@?[A-Za-z_][A-Za-z0-9_]*)|(\d+(?:\.\d+)?)|(\s+)|(.)""")


def highlight(line):
    out = []
    for m in TOKEN.finditer(line):
        s, word, num, space, other = m.groups()
        if s:
            out.append(f'<tspan class="s">{escape(s)}</tspan>')
        elif word:
            rest = line[m.end():]
            if word in KEYWORDS or word.startswith('@'):
                cls = 'k'
            elif word[0].isupper():
                cls = 'c'
            elif rest.startswith(':'):
                cls = 'p'
            else:
                cls = ''
            out.append(f'<tspan class="{cls}">{word}</tspan>' if cls else word)
        elif num:
            out.append(f'<tspan class="n">{num}</tspan>')
        else:
            out.append(escape(space or other))
    return ''.join(out)


def frame(spec):
    fid = spec['id']
    code = spec['code']
    arrows = spec.get('arrows', [])
    cards = spec.get('cards', [])
    first = Y0 + BAR + 28
    box_h = max(BAR + 28 + LH * (len(code) - 1) + 24, spec.get('min_h', 0))
    n = len(cards)
    gap = 16
    full = PX + PW - EX
    cw = (full - gap * (n - 1)) / n if n else 0
    body_max = max((len(c[2]) for c in cards), default=0)
    card_h = 52 + 19 * body_max + 12
    cy = Y0 + box_h + 24
    height = cy + (card_h + 32 if n else 8)
    if spec.get('foot'):
        height += 24
    used = sorted({a['color'] for a in arrows})

    out = []
    a = out.append
    a(f'<svg id="{fid}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 {height:.0f}" width="100%" '
      f'style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="{fid}-ttl {fid}-dsc" '
      f"font-family=\"ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif\">")
    a(f'  <title id="{fid}-ttl">{escape(spec["title_plain"])}</title>')
    a(f'  <desc id="{fid}-dsc">{escape(spec["desc"])}</desc>')
    a('  <defs>\n    <style>')
    a(f'      #{fid} .title{{fill:#161A26;font-size:22px;font-weight:700}}')
    a(f'      #{fid} .sub{{fill:#79809A;font-size:13.5px}}')
    a(f"      #{fid} .mono{{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}}")
    a(f'      #{fid} .cl{{font-size:13px;fill:#C9CFDA}}')
    a(f'      #{fid} .s{{fill:#A8D8A0}} #{fid} .n{{fill:#F2B880}} #{fid} .c{{fill:#7FD1E8}}')
    a(f'      #{fid} .p{{fill:#D5B8F5}} #{fid} .k{{fill:#F08FB0}}')
    a(f'      #{fid} .h{{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}}')
    a(f'      #{fid} .ct{{fill:#161A26;font-size:14px;font-weight:700}}')
    a(f'      #{fid} .cb{{fill:#454C61;font-size:13px}}')
    a(f'      #{fid} .rt{{fill:#161A26;font-size:14px}} #{fid} .rs{{fill:#79809A;font-size:12px}}')
    a(f'      #{fid} .foot{{fill:#79809A;font-size:12px}}')
    for c in used:
        bright, strong, _ = TONES[c]
        a(f'      #{fid} .hl-{c}{{fill:{bright};fill-opacity:.16;stroke:{bright};stroke-width:1.5}}')
        a(f'      #{fid} .ld-{c}{{fill:none;stroke:{bright};stroke-width:1.5;stroke-dasharray:3 4}}')
        a(f'      #{fid} .ar-{c}{{fill:none;stroke:{strong};stroke-width:1.75;marker-end:url(#{fid}-ar-{c})}}')
    a('    </style>')
    for c in used:
        a(f'    <marker id="{fid}-ar-{c}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" '
          f'markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="{TONES[c][1]}"/></marker>')
    a('  </defs>')
    a(f'  <rect width="960" height="{height:.0f}" rx="16" fill="#FBFBFD"/>')
    a(f'  <text class="title" x="48" y="56">{spec["title"]}</text>')
    a(f'  <text class="sub" x="48" y="80" data-fit="860">{escape(spec["sub"])}</text>')

    a(f'  <rect x="{EX}" y="{Y0}" width="{EW}" height="{box_h}" rx="12" fill="#1F2430"/>')
    a(f'  <path d="M{EX},{Y0+12} A12,12 0 0 1 {EX+12},{Y0} H{EX+EW-12} A12,12 0 0 1 {EX+EW},{Y0+12} V{Y0+BAR} H{EX} Z" fill="#2A3040"/>')
    a(f'  <circle cx="{EX+20}" cy="{Y0+16}" r="5" fill="#F14C4C"/><circle cx="{EX+36}" cy="{Y0+16}" r="5" fill="#E5C07B"/><circle cx="{EX+52}" cy="{Y0+16}" r="5" fill="#6BCB77"/>')
    a(f'  <text class="mono" x="{EX+EW/2:.0f}" y="{Y0+16}" dy="0.35em" text-anchor="middle" fill="#9AA3B5" font-size="12" data-fit="{EW-140}">{escape(spec.get("file", "main.dart"))}</text>')

    a(f'  <rect x="{PX}" y="{Y0}" width="{PW}" height="{box_h}" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>')
    a(f'  <text class="h" x="{PX+16}" y="{Y0+16}" dy="0.35em" data-fit="{PW-32}">{escape(spec.get("panel", "RESULTADO"))}</text>')
    a(f'  <path d="M{PX},{Y0+BAR} H{PX+PW}" stroke="#D9DEE8" stroke-width="1.5"/>')

    for ar in arrows:
        line = code[ar['line']]
        col = line.index(ar['find'])
        y = first + ar['line'] * LH
        x = TX + col * CW - 4
        w = len(ar['find']) * CW + 8
        a(f'  <rect class="hl-{ar["color"]}" x="{x:.1f}" y="{y-16}" width="{w:.1f}" height="22" rx="5"/>')

    for i, line in enumerate(code):
        if not line.strip():
            continue
        indent = len(line) - len(line.lstrip())
        text = line.strip()
        a(f'  <text class="cl mono" font-size="13" x="{TX + indent*CW:.1f}" y="{first + i*LH}" '
          f'textLength="{len(text)*CW:.1f}" lengthAdjust="spacingAndGlyphs" data-fit="{EW-24}">{highlight(text)}</text>')

    a(f'  <g transform="translate({PX},{Y0+BAR})">')
    a(spec.get('result', ''))
    a('  </g>')

    for ar in arrows:
        c = ar['color']
        line = code[ar['line']]
        y = first + ar['line'] * LH - 5
        x1 = TX + (line.index(ar['find']) + len(ar['find'])) * CW + 4
        xe = TX + len(line.rstrip()) * CW + 6
        edge = EX + EW
        tx, ty = PX + ar['to'][0], Y0 + BAR + ar['to'][1]
        a(f'  <path class="ld-{c}" d="M{max(x1, xe):.1f},{y} H{edge}"/>')
        if ar.get('end') == 'v':
            a(f'  <path class="ar-{c}" d="M{edge},{y} H{tx} V{ty}"/>')
        elif abs(ty - y) < 1:
            a(f'  <path class="ar-{c}" d="M{edge},{y} H{tx}"/>')
        else:
            lx = edge + 10 + 9 * ar.get('lane', 0)
            d = f'M{edge},{y} H{lx}'
            for vx, vy in ar.get('via', []):
                d += f' V{Y0 + BAR + vy} H{PX + vx}'
            a(f'  <path class="ar-{c}" d="{d} V{ty} H{tx}"/>')

    for k, (color, title, body) in enumerate(cards):
        cx = EX + k * (cw + gap)
        a(f'  <g transform="translate({cx:.1f},{cy:.0f})">')
        a(f'    <rect width="{cw:.1f}" height="{card_h}" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>')
        a(f'    <circle cx="24" cy="26" r="7" fill="{TONES[color][2]}" stroke="{TONES[color][1]}" stroke-width="2"/>')
        a(f'    <text class="ct mono" x="42" y="26" dy="0.35em" data-fit="{cw-58:.0f}">{escape(title)}</text>')
        for j, b in enumerate(body):
            a(f'    <text class="cb" x="16" y="{60 + j*19}" data-fit="{cw-32:.0f}">{b}</text>')
        a('  </g>')

    if spec.get('foot'):
        a(f'  <text class="foot" x="48" y="{height-28:.0f}" data-fit="860">{escape(spec["foot"])}</text>')
    a('</svg>')
    return '\n'.join(out) + '\n'
