"""Figuras SVG de la lección «Entendiendo BlocProvider y BlocBuilder» (0089).

    python3 tools/bloc_figuras.py <carpeta>     escribe un .svg por figura, para revisarlas
    python3 tools/bloc_figuras.py --inject      reemplaza cada bloque ```svg de content/lesson105.md
                                                por la figura con el mismo id

No editar los SVG dentro del Markdown: se cambia este script y se vuelve a inyectar.
Colores por rol, iguales en todas las figuras: BlocProvider ámbar, Bloc índigo, estado verde,
vista y BlocBuilder violeta, evento teal, error rosa, widgets sin papel gris.
"""

import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from code_frame import frame, highlight  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
LESSONS = ['lesson105.md']
SANS = "ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif"
MONO = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace"
FAM = {
    'indigo': ('#EEF1FF', '#A9B4F2', '#4453C9'),
    'violet': ('#F4EBFF', '#C9A6EE', '#7439B8'),
    'amber': ('#FFF3DC', '#F0C572', '#A96C05'),
    'green': ('#E8F6E3', '#9FD68D', '#3A8235'),
    'slate': ('#EFF1F5', '#C4CBD8', '#556074'),
    'rose': ('#FFEBEF', '#F3A3B2', '#C2354F'),
    'teal': ('#E3F6F3', '#86D3CA', '#0F8478'),
}


def head(fid, h, title, plain, sub, desc, colors=()):
    css = ''
    markers = ''
    for c in colors:
        strong = FAM[c][2]
        css += f'      #{fid} .ar-{c}{{fill:none;stroke:{strong};stroke-width:1.75;marker-end:url(#{fid}-ar-{c})}}\n'
        markers += (f'    <marker id="{fid}-ar-{c}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" '
                    f'markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="{strong}"/></marker>\n')
    return f'''<svg id="{fid}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 {h}" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="{fid}-ttl {fid}-dsc" font-family="{SANS}">
  <title id="{fid}-ttl">{plain}</title>
  <desc id="{fid}-dsc">{desc}</desc>
  <defs>
    <style>
      #{fid} .title{{fill:#161A26;font-size:22px;font-weight:700}}
      #{fid} .sub{{fill:#79809A;font-size:13.5px}}
      #{fid} .h{{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}}
      #{fid} .foot{{fill:#79809A;font-size:12px}}
      #{fid} .mono{{font-family:{MONO}}}
      #{fid} .tree{{fill:none;stroke:#C4CBD8;stroke-width:1.75}}
      #{fid} .link{{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#{fid}-arrow)}}
{css}    </style>
    <marker id="{fid}-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
{markers}  </defs>
  <rect width="960" height="{h}" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">{title}</text>
  <text class="sub" x="48" y="80" data-fit="860">{sub}</text>
'''


def tail(h, foot):
    return f'  <text class="foot" x="48" y="{h-28}" data-fit="860">{foot}</text>\n</svg>\n'


def box(x, y, w, h, color, label, sub=None, hero=False, mono=True, fs=13.5):
    soft, border, strong = FAM[color]
    cls = 'class="mono" ' if mono else ''
    cy = y + h / 2 - (9 if sub else 0)
    s = (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="{soft}" stroke="{border}" stroke-width="{2.5 if hero else 1.5}"/>'
         f'<text {cls}x="{x + w/2:.0f}" y="{cy:.0f}" dy="0.35em" text-anchor="middle" font-size="{fs}" font-weight="700" fill="{strong}" data-fit="{w-16}">{label}</text>')
    if sub:
        s += (f'<text x="{x + w/2:.0f}" y="{cy + 19:.0f}" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" '
              f'data-fit="{w-16}">{sub}</text>')
    return s + '\n'


def note(x, y, w, color, title, lines, mono_title=False):
    soft, border, strong = FAM[color]
    h = 34 + 17 * len(lines) + 9
    cls = 'class="mono" ' if mono_title else ''
    s = (f'<g transform="translate({x},{y})"><rect width="{w}" height="{h}" rx="10" fill="{soft}" stroke="{border}" stroke-width="1.5"/>'
         f'<text {cls}x="14" y="23" font-size="13.5" font-weight="700" fill="{strong}" data-fit="{w-28}">{title}</text>')
    for i, ln in enumerate(lines):
        s += f'<text x="14" y="{43 + i*17}" font-size="12.5" fill="#454C61" data-fit="{w-28}">{ln}</text>'
    return s + '</g>\n'


def chip(x, y, n, color='amber'):
    soft, border, strong = FAM[color]
    return (f'<circle cx="{x}" cy="{y}" r="12" fill="{soft}" stroke="{border}" stroke-width="1.5"/>'
            f'<text x="{x}" y="{y}" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="{strong}">{n}</text>\n')


def phone(x, y, w, h, title):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="18" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/>'
            f'<text x="{x+16}" y="{y+24}" dy="0.35em" font-size="14" font-weight="600" fill="#161A26">{title}</text>'
            f'<path d="M{x+2},{y+42} H{x+w-2}" stroke="#D9DEE8" stroke-width="1.5"/>\n')


def rows(x, y, w, names, color='violet', gap=38):
    soft, border, _ = FAM[color]
    s = ''
    for i, name in enumerate(names):
        s += (f'<rect x="{x}" y="{y + i*gap}" width="{w}" height="30" rx="7" fill="{soft}" stroke="{border}" stroke-width="1.25"/>'
              f'<text x="{x+12}" y="{y + i*gap + 15}" dy="0.35em" font-size="13" fill="#161A26" data-fit="{w-20}">{name}</text>')
    return s + '\n'


def spinner(cx, cy, r=18):
    return (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="#FFF3DC" stroke-width="5"/>'
            f'<path d="M{cx},{cy-r} A{r},{r} 0 0 1 {cx+r},{cy}" fill="none" stroke="#A96C05" stroke-width="5" stroke-linecap="round"/>\n')


FIGS = {}
PRODUCTS = ['Manzana', 'Jugo de mora', 'Leche']

# ───────────────────────────── BlocProvider


def bp_arbol():
    fid, h = 'bpArbol', 616
    s = head(fid, h, 'El <tspan class="mono">Bloc</tspan> cuelga del árbol de widgets', 'El Bloc cuelga del árbol de widgets',
             'BlocProvider es un widget más del árbol. Guarda el Bloc y lo deja al alcance de todo lo que tiene debajo.',
             'Árbol de widgets: MaterialApp, debajo BlocProvider, que guarda un ProductsBloc, y debajo ProductsScreen, Scaffold, AppBar, '
             'BlocBuilder con su ListView y un FloatingActionButton. Una zona resaltada marca que todos los widgets que están debajo del '
             'BlocProvider pueden alcanzar el Bloc, y que MaterialApp, que está arriba, no.')
    s += '  <rect x="48" y="264" width="544" height="296" rx="14" fill="#E8F6E3" fill-opacity=".55" stroke="#9FD68D" stroke-width="1.5" stroke-dasharray="6 5"/>\n'
    s += '  <text class="h" x="576" y="288" text-anchor="end" fill="#3A8235" style="fill:#3A8235" data-fit="230">AQUÍ SE ALCANZA EL BLOC</text>\n'
    s += '  <path class="tree" d="M192,152 V184 M192,232 V304 M192,344 V376 M192,416 V432 M128,448 V432 H472 V448 M276,432 V448 M276,488 V512"/>\n'
    s += '  <path d="M312,208 H392" stroke="#4453C9" stroke-width="1.75" stroke-dasharray="4 4" fill="none"/>\n'
    s += '  <text x="352" y="198" text-anchor="middle" font-size="12" font-weight="600" fill="#4453C9">guarda</text>\n'
    s += '  ' + box(72, 112, 240, 40, 'slate', 'MaterialApp')
    s += '  ' + box(72, 184, 240, 48, 'amber', 'BlocProvider', hero=True)
    s += '  ' + box(392, 184, 184, 48, 'indigo', 'ProductsBloc')
    s += '  ' + box(72, 304, 240, 40, 'slate', 'ProductsScreen')
    s += '  ' + box(72, 376, 240, 40, 'slate', 'Scaffold')
    s += '  ' + box(72, 448, 112, 40, 'slate', 'AppBar')
    s += '  ' + box(200, 448, 152, 40, 'violet', 'BlocBuilder')
    s += '  ' + box(368, 448, 208, 40, 'teal', 'FloatingActionButton')
    s += '  ' + box(200, 512, 152, 36, 'slate', 'ListView')
    s += '  ' + note(624, 112, 288, 'slate', 'Arriba del provider', ['MaterialApp no puede pedir el Bloc:', 'está por encima de quien lo guarda.'])
    s += '  ' + note(624, 200, 288, 'indigo', 'Una sola instancia', ['BlocProvider crea el Bloc una vez y lo', 'conserva mientras siga en el árbol.'])
    s += '  ' + note(624, 304, 288, 'green', 'Debajo del provider', ['Cualquier descendiente lo alcanza,', 'sin importar cuántos niveles haya', 'en medio. Nadie lo pasa por constructor.'])
    s += '  ' + note(624, 432, 288, 'violet', 'Quién lo usa aquí', ['BlocBuilder lo escucha para dibujar', 'la lista. El botón lo usa para', 'lanzar un evento.'])
    return s + tail(h, 'El Bloc no es un widget y no se dibuja: BlocProvider es el widget que lo sostiene dentro del árbol.')


FIGS['bpArbol'] = bp_arbol


def bp_anatomia_result():
    o = '<rect x="40" y="20" width="296" height="224" rx="12" fill="#FFF3DC" fill-opacity=".6" stroke="#F0C572" stroke-width="2"/>'
    o += f'<text class="mono" x="56" y="42" dy="0.35em" font-size="13.5" font-weight="700" fill="#A96C05">BlocProvider</text>'
    o += box(56, 68, 264, 48, 'indigo', 'ProductsBloc', sub='la instancia que se guarda')
    o += '<text x="188" y="148" text-anchor="middle" font-size="12" font-weight="600" fill="#A96C05" data-fit="250">al alcance de todo lo que hay en child</text>'
    o += '<path d="M188,156 V168" stroke="#A96C05" stroke-width="1.75" fill="none"/><path d="M182,164 L188,172 L194,164" stroke="#A96C05" stroke-width="1.75" fill="none"/>'
    o += box(56, 178, 264, 44, 'violet', 'ProductsScreen', sub='y todos sus descendientes')
    return o


FIGS['bpAnatomia'] = lambda: frame(dict(
    id='bpAnatomia',
    title='Las partes de un <tspan class="mono">BlocProvider</tspan>',
    title_plain='Las partes de un BlocProvider',
    desc='Un BlocProvider de ProductsBloc anotado: create construye el ProductsBloc, con ProductsState como estado inicial, y el '
         'provider lo guarda; child es ProductsScreen, la parte del árbol que queda con el Bloc a su alcance.',
    sub='Dos parámetros: create dice cómo se construye el Bloc y child dice quién lo va a poder usar.',
    file='lib/main.dart',
    panel='LO QUE QUEDA ARMADO',
    min_h=296,
    code=[
        "BlocProvider<ProductsBloc>(",
        "  create: (context) => ProductsBloc(ProductsState()),",
        "  child: const ProductsScreen(),",
        ")",
    ],
    result=bp_anatomia_result(),
    arrows=[
        dict(line=0, find='BlocProvider<ProductsBloc>', to=(40, 40), color='amber', lane=2),
        dict(line=1, find='create', to=(56, 92), color='indigo', lane=1),
        dict(line=2, find='child', to=(56, 200), color='violet', lane=0),
    ],
    cards=[
        ('amber', 'BlocProvider<T>', ['El tipo entre &lt; &gt; es la etiqueta', 'con la que después se busca', 'el Bloc desde un widget.']),
        ('indigo', 'create', ['Una función que construye el', 'Bloc con su estado inicial.', 'Se ejecuta una sola vez.']),
        ('violet', 'child', ['La pantalla que queda debajo.', 'Solo ella y sus hijos', 'ven el Bloc.']),
    ],
))


def keyframes(name, spans):
    pts = {0: 0, 100: 0}
    for a, b in spans:
        pts.update({a: 0, a + 2: 1, b - 2: 1, b: 0})
    body = ' '.join(f'{k}%{{opacity:{v}}}' for k, v in sorted(pts.items()))
    return f'      @keyframes {name}{{{body}}}\n'


def bp_init_state(freeze=None):
    """Animada: seis pasos de 3 s en tres columnas. Con freeze=1..6 sale el fotograma fijo de ese paso."""
    fid, h = 'bpInitState', 600
    s = head(fid, h, 'El primer evento sale de <tspan class="mono">initState</tspan>', 'El primer evento sale de initState',
             'El ciclo de vida de ProductsScreen, paso a paso: initState corre una sola vez y ahí se le pide al Bloc la carga inicial.',
             'Animación en seis pasos y tres columnas: lo que se ve, el ciclo de vida de ProductsScreen y la capa de Bloc. Uno: '
             'createState crea el State. Dos: initState corre una sola vez y lanza LoadProductsEvent al ProductsBloc con context.read '
             'y add. Tres: build dibuja la pantalla con el estado inicial. Cuatro: el Bloc consigue los datos con un HTTP GET a la '
             'API. Cinco: el Bloc emite un estado nuevo y BlocBuilder vuelve a ejecutar builder, ahora con los productos. Seis: '
             'dispose, cuando la pantalla sale del árbol.',
             colors=('teal', 'green', 'amber'))
    spans = {'a1': [(0, 17)], 'a2': [(17, 33)], 'a3': [(33, 50)], 'a4': [(50, 67)], 'a5': [(67, 83)], 'a6': [(83, 100)],
             'a12': [(0, 33)], 'a34': [(33, 67)], 'a35': [(33, 50), (67, 83)], 'a45': [(50, 83)]}
    if freeze:
        on = {1: ['a1', 'a12'], 2: ['a2', 'a12', 'tk1'], 3: ['a3', 'a35', 'a34'], 4: ['a4', 'a45', 'a34', 'tkG'],
              5: ['a5', 'a35', 'a45', 'tk2'], 6: ['a6']}[freeze]
        css = f'      #{fid} .an,#{fid} .st,#{fid} .ls{{opacity:0}}\n' + ''.join(f'      #{fid} .{c}{{opacity:1}}\n' for c in on)
        css += (f'      #{fid} .tk1{{transform:translate(119px,0)}}\n      #{fid} .tkG{{transform:translate(0,56px)}}\n'
                f'      #{fid} .tk2{{transform:translate(-130px,48px)}}\n')
    else:
        css = (f'      #{fid} .an,#{fid} .ls,#{fid} .st{{animation-duration:18s;animation-iteration-count:infinite;animation-timing-function:linear}}\n'
               f'      #{fid} .an{{opacity:0}}\n      #{fid} .st{{animation-name:{fid}-hide}}\n')
        for k, sp in spans.items():
            css += f'      #{fid} .{k}{{animation-name:{fid}-{k}}}\n' + keyframes(f'{fid}-{k}', sp)

        def travel(name, t0, pts, t1):
            first, last = pts[0][1], pts[-1][1]
            body = f'0%,{t0}%{{opacity:0;transform:translate({first})}}'
            body += ''.join(f'{t}%{{opacity:1;transform:translate({xy})}}' for t, xy in pts)
            body += f'{t1}%,100%{{opacity:0;transform:translate({last})}}'
            return f'      #{fid} .{name}{{animation-name:{fid}-{name}}}\n      @keyframes {fid}-{name}{{{body}}}\n'
        css += travel('tk1', 18, [(20, '0,0'), (30, '238px,0')], 32)
        css += travel('tkG', 51, [(52, '0,0'), (58, '0,112px')], 59)
        css += travel('tkJ', 58, [(59, '0,0'), (65, '0,-112px')], 66)
        css += travel('tk2', 68, [(69, '0,0'), (71, '0,48px')], 72).replace(
            '71%{opacity:1;transform:translate(0,48px)}72%,100%{opacity:0;transform:translate(0,48px)}',
            '71%{opacity:1;transform:translate(0,48px)}79%{opacity:1;transform:translate(-262px,48px)}'
            '81%,100%{opacity:0;transform:translate(-262px,48px)}')
        css += (f'      @keyframes {fid}-hide{{from{{opacity:0}}to{{opacity:0}}}}\n'
                f'      @media (prefers-reduced-motion: reduce){{#{fid} .an,#{fid} .ls,#{fid} .st{{animation:none}}}}\n')
    s = s.replace('    </style>', css + '    </style>', 1)
    s = s.replace(f'<svg id="{fid}"', f'<svg id="{fid}" data-steps="6" data-step-seconds="3"', 1)

    for x, w, label in ((48, 176, 'LO QUE SE VE'), (240, 248, 'CICLO DE VIDA'), (704, 208, 'CAPA DE BLOC')):
        s += f'  <rect x="{x}" y="104" width="{w}" height="364" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>\n'
        s += f'  <text class="h" x="{x+16}" y="128" data-fit="{w-32}">{label}</text>\n'

    s += '  ' + phone(60, 144, 152, 168, 'Catálogo')
    s += '  <g class="an a34">' + ''.join(
        f'<rect x="72" y="{196 + i*34}" width="128" height="30" rx="7" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.25"/>'
        f'<rect x="82" y="{207 + i*34}" width="{w}" height="8" rx="4" fill="#C4CBD8"/>' for i, w in enumerate((64, 88, 48))) + '</g>\n'
    s += '  <g class="ls a5">' + rows(72, 196, 128, PRODUCTS, gap=34).strip() + '</g>\n'
    for cls, text in (('an a12', 'todavía no hay nada'), ('an a34', 'el estado inicial'), ('ls a5', 'los productos'), ('an a6', 'la pantalla se cerró')):
        s += f'  <text class="{cls}" x="136" y="340" text-anchor="middle" font-size="12.5" font-weight="600" fill="#454C61" data-fit="152">{text}</text>\n'

    life = [(1, 144, 'slate', 'createState()', 'Flutter crea el State', 'a1'),
            (2, 220, 'teal', 'initState()', 'una sola vez', 'a2'),
            (3, 296, 'violet', 'build()', 'cada vez que hay que dibujar', 'a35'),
            (6, 396, 'slate', 'dispose()', 'al salir del árbol', 'a6')]
    s += '  <path class="link" d="M380,196 V218"/><path class="link" d="M380,272 V294"/><path class="link" d="M380,348 V394"/>\n'
    for n, y, color, label, sub, _ in life:
        s += '  ' + box(284, y, 192, 52, color, label, sub=sub, hero=(n == 2))
        s += '  ' + chip(260, y + 26, n, color)

    s += '  ' + box(716, 218, 184, 56, 'indigo', 'ProductsBloc', sub='guardado en el BlocProvider')
    s += '  ' + box(716, 388, 184, 48, 'amber', 'API', sub='fuera de la app')
    s += '  <path class="ar-amber" d="M780,274 V386"/><path class="ar-amber" d="M836,388 V276"/>\n'
    s += f'  <text class="mono" x="770" y="318" text-anchor="end" font-size="12" font-weight="600" fill="{FAM["amber"][2]}">GET</text>\n'
    s += f'  <text class="mono" x="846" y="318" font-size="12" font-weight="600" fill="{FAM["amber"][2]}">JSON</text>\n'
    s += '  ' + chip(808, 352, 4, 'amber')
    s += '  <path class="ar-teal" d="M476,246 H714"/>\n'
    s += f'  <text class="mono" x="596" y="234" text-anchor="middle" font-size="12" font-weight="600" fill="#0F8478" data-fit="212">context.read&lt;ProductsBloc&gt;()</text>\n'
    s += f'  <text class="mono" x="596" y="264" text-anchor="middle" font-size="12" font-weight="600" fill="#0F8478" data-fit="212">.add(LoadProductsEvent())</text>\n'
    s += '  <path class="ar-green" d="M740,274 V322 H478"/>\n'
    s += '  ' + chip(684, 322, 5, 'green')
    s += '  <text class="mono" x="584" y="312" text-anchor="middle" font-size="12" font-weight="600" fill="#3A8235" data-fit="170">emit(estado nuevo)</text>\n'
    s += '  <text x="584" y="342" text-anchor="middle" font-size="12" fill="#454C61" data-fit="180">BlocBuilder vuelve a dibujar</text>\n'

    for n, y, color, _, _, cls in life:
        s += f'  <rect class="an {cls}" x="278" y="{y-6}" width="204" height="64" rx="14" fill="none" stroke="{FAM[color][2]}" stroke-width="3"/>\n'
    s += f'  <rect class="an a45" x="710" y="212" width="196" height="68" rx="14" fill="none" stroke="{FAM["indigo"][2]}" stroke-width="3"/>\n'
    s += f'  <rect class="an a4" x="710" y="382" width="196" height="60" rx="14" fill="none" stroke="{FAM["amber"][2]}" stroke-width="3"/>\n'
    for cls, cx, cy, color in (('tk1', 476, 246, 'teal'), ('tkG', 780, 274, 'amber'), ('tkJ', 836, 388, 'amber'), ('tk2', 740, 274, 'green')):
        s += f'  <circle class="an {cls}" cx="{cx}" cy="{cy}" r="8" fill="{FAM[color][2]}" stroke="#FFFFFF" stroke-width="2"/>\n'

    s += '  <rect x="48" y="484" width="864" height="56" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>\n'
    caps = [(1, 'slate', 'Flutter crea el State de ProductsScreen.', 'Todavía no hay nada dibujado.'),
            (2, 'teal', 'initState corre una sola vez y lanza LoadProductsEvent al Bloc.', 'Va aquí y no en build: build corre muchas veces y repetiría la carga.'),
            (3, 'violet', 'build dibuja la pantalla con el estado inicial: el ProductsState() que recibió el Bloc en create.', 'El evento ya salió, pero la respuesta todavía no llega.'),
            (4, 'amber', 'El Bloc atiende el evento y consigue los datos: hace un HTTP GET a la API.', 'La vista no se entera de esta parte: solo espera el estado.'),
            (5, 'green', 'Con la respuesta, el Bloc emite un estado nuevo y BlocBuilder vuelve a dibujar, ahora con los productos.', 'initState no se repite.'),
            (6, 'slate', 'Al salir de la pantalla corre dispose.', 'El State se descarta.')]
    for n, color, l1, l2 in caps:
        s += (f'  <g class="an a{n}">' + chip(76, 512, n, color).strip() +
              f'<text x="100" y="507" font-size="13" font-weight="600" fill="#161A26" data-fit="790">{l1}</text>'
              f'<text x="100" y="525" font-size="13" fill="#454C61" data-fit="790">{l2}</text></g>\n')
    s += ('  <g class="st"><text x="68" y="507" font-size="13" font-weight="600" fill="#161A26" data-fit="820">initState corre una vez; build, cada vez que llega un estado.</text>'
          '<text x="68" y="525" font-size="13" fill="#454C61" data-fit="820">Por eso el primer evento se lanza desde initState.</text></g>\n')
    return s + tail(h, 'El BlocProvider ya está arriba cuando corre initState: por eso context.read encuentra el Bloc.')


FIGS['bpInitState'] = bp_init_state


def travel(fid, name, t0, pts, t1):
    first, last = pts[0][1], pts[-1][1]
    body = f'0%,{t0}%{{opacity:0;transform:translate({first})}}'
    body += ''.join(f'{t}%{{opacity:1;transform:translate({xy})}}' for t, xy in pts)
    body += f'{t1}%,100%{{opacity:0;transform:translate({last})}}'
    return f'      #{fid} .{name}{{animation-name:{fid}-{name}}}\n      @keyframes {fid}-{name}{{{body}}}\n'


def bp_read(freeze=None):
    """Animada: ocho pasos de 3 s, del toque a la respuesta en pantalla. Con freeze=1..8 sale el fotograma fijo de ese paso."""
    fid, h = 'bpRead', 648
    s = head(fid, h, 'Del toque a la respuesta: <tspan class="mono">context.read</tspan>', 'Del toque a la respuesta: context.read',
             'Al tocar el botón, el evento llega al Bloc con context.read; el Bloc consigue los datos y la respuesta vuelve a la pantalla.',
             'Animación en ocho pasos y tres columnas: lo que se ve con el código que se ejecuta, el árbol de widgets y la capa de Bloc. '
             'Uno: el usuario toca el IconButton y corre su onPressed. Dos: el código usa el context de ProductsScreen. Tres: '
             'context.read de ProductsBloc sube por el árbol hasta el BlocProvider y devuelve el ProductsBloc que guarda. Cuatro: add '
             'le entrega LoadProductsEvent. Cinco: el Bloc lo atiende y emite ProductsLoadingState, y la pantalla muestra la carga. '
             'Seis: el Bloc hace un HTTP GET a la API. Siete: con la respuesta emite ProductsLoadedState. Ocho: BlocBuilder ejecuta '
             'builder y la pantalla muestra los productos nuevos.',
             colors=('indigo', 'teal', 'green', 'amber'))
    spans = {f'a{k}': [((k - 1) * 12.5, k * 12.5)] for k in range(1, 9)}
    spans.update({'a23': [(12.5, 37.5)], 'a33': [(31, 37.5)], 'g1': [(0, 50)], 'g2': [(50, 87.5)]})
    if freeze:
        on = {1: ['a1', 'g1'], 2: ['a2', 'a23', 'g1'], 3: ['a3', 'a23', 'a33', 'g1'], 4: ['a4', 'g1', 'tk2'],
              5: ['a5', 'g2', 'tkL'], 6: ['a6', 'g2', 'tkG'], 7: ['a7', 'g2', 'tkE'], 8: ['a8']}[freeze]
        css = f'      #{fid} .an,#{fid} .st,#{fid} .ls{{opacity:0}}\n' + ''.join(f'      #{fid} .{c}{{opacity:1}}\n' for c in on)
        css += (f'      #{fid} .tk2{{transform:translate(298px,-40px)}}\n      #{fid} .tkL,#{fid} .tkE{{transform:translate(-48px,90px)}}\n'
                f'      #{fid} .tkG{{transform:translate(0,44px)}}\n')
    else:
        css = (f'      #{fid} .an,#{fid} .ls,#{fid} .st{{animation-duration:24s;animation-iteration-count:infinite;animation-timing-function:linear}}\n'
               f'      #{fid} .an{{opacity:0}}\n      #{fid} .st{{animation-name:{fid}-hide}}\n'
               f'      #{fid} .spin{{animation:{fid}-spin 1s linear infinite;transform-box:fill-box;transform-origin:center}}\n'
               f'      @keyframes {fid}-spin{{to{{transform:rotate(360deg)}}}}\n')
        for k, sp in spans.items():
            css += f'      #{fid} .{k}{{animation-name:{fid}-{k}}}\n' + keyframes(f'{fid}-{k}', sp)
        css += (f'      #{fid} .tap{{animation-name:{fid}-tap;transform-box:fill-box;transform-origin:center}}\n'
                f'      @keyframes {fid}-tap{{0%,1%{{opacity:0;transform:scale(.3)}}2%{{opacity:.9;transform:scale(.3)}}'
                f'6%{{opacity:0;transform:scale(1.5)}}6.5%{{opacity:.9;transform:scale(.3)}}10.5%,100%{{opacity:0;transform:scale(1.5)}}}}\n')
        css += travel(fid, 'tk1', 25.5, [(26.5, '0,0'), (27.5, '-18px,0'), (30, '-18px,-64px'), (31, '0,-64px')], 32)
        css += travel(fid, 'tk2', 38, [(39, '0,0'), (40.5, '0,44px'), (45, '298px,44px'), (48, '298px,-142px')], 49)
        css += travel(fid, 'tkL', 52, [(53, '0,0'), (54.5, '-48px,0'), (58, '-48px,176px'), (59.5, '-94px,176px')], 60.5)
        css += travel(fid, 'tkG', 63, [(64, '0,0'), (67.5, '0,88px')], 68.5)
        css += travel(fid, 'tkJ', 68, [(69, '0,0'), (72.5, '0,-90px')], 73.5)
        css += travel(fid, 'tkE', 77, [(78, '0,0'), (79.5, '-48px,0'), (83, '-48px,176px'), (84.5, '-94px,176px')], 85.5)
        css += (f'      @keyframes {fid}-hide{{from{{opacity:0}}to{{opacity:0}}}}\n'
                f'      @media (prefers-reduced-motion: reduce){{#{fid} .an,#{fid} .ls,#{fid} .st,#{fid} .spin{{animation:none}}}}\n')
    s = s.replace('    </style>', css + '    </style>', 1)
    s = s.replace(f'<svg id="{fid}"', f'<svg id="{fid}" data-steps="8" data-step-seconds="3"', 1)
    ind, teal, green, amber = (FAM[c][2] for c in ('indigo', 'teal', 'green', 'amber'))

    for x, w, label in ((48, 312, 'LO QUE SE VE'), (376, 256, 'VISTA · ÁRBOL DE WIDGETS'), (704, 208, 'CAPA DE BLOC')):
        s += f'  <rect x="{x}" y="104" width="{w}" height="416" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>\n'
        s += f'  <text class="h" x="{x+16}" y="128" data-fit="{w-32}">{label}</text>\n'

    s += '  ' + phone(60, 144, 288, 152, 'Catálogo')
    s += f'  <circle cx="324" cy="166" r="12" fill="{FAM["teal"][0]}" stroke="{FAM["teal"][1]}" stroke-width="1.5"/>\n'
    s += f'  <path d="M329,166 A5,5 0 1 1 326.5,161.7" fill="none" stroke="{teal}" stroke-width="1.75" stroke-linecap="round"/>\n'
    s += f'  <path d="M324.2,158.6 L327.4,161.9 L323,163.2 Z" fill="{teal}"/>\n'
    s += '  <g class="ls g1">' + rows(72, 196, 264, PRODUCTS, gap=32).strip() + '</g>\n'
    s += '  <g class="an g2"><g class="spin">' + spinner(204, 244, r=16).strip() + '</g></g>\n'
    s += ('  <g class="an a8">' + rows(72, 196, 264, ['Pan'], color='green').strip() +
          rows(72, 228, 264, PRODUCTS[:2], gap=32).strip() + '</g>\n')

    s += '  <text class="h" x="64" y="328" data-fit="280">EL CÓDIGO QUE SE EJECUTA</text>\n'
    s += '  <rect x="60" y="340" width="288" height="156" rx="10" fill="#1F2430"/>\n'
    s += '  <path d="M60,350 A10,10 0 0 1 70,340 H338 A10,10 0 0 1 348,350 V366 H60 Z" fill="#2A3040"/>\n'
    panes = [('ls g1', 'ProductsScreen · IconButton',
              ['onPressed: () => context', '  .read<ProductsBloc>()', '  .add(LoadProductsEvent()),'],
              [('a1', 0, 'onPressed', teal), ('a23', 0, 'context', ind), ('a23', 1, '.read<ProductsBloc>()', ind),
               ('a4', 2, '.add(LoadProductsEvent())', teal)]),
             ('an g2', 'ProductsBloc · on<LoadProductsEvent>',
              ['_onLoad(event, emit) async {', '  emit(ProductsLoadingState());', '  final data = await api.get();',
               '  emit(ProductsLoadedState(data));', '}'],
              [('a5', 1, 'emit(ProductsLoadingState());', green), ('a6', 2, 'await api.get()', amber),
               ('a7', 3, 'emit(ProductsLoadedState(data));', green)]),
             ('an a8', 'ProductsScreen · BlocBuilder',
              ['builder: (context, state) {', '  if (state is ProductsLoadedState) {', '    return ListView(...);', '  }'],
              [('a8', 2, 'return ListView(...);', green)])]
    for cls, tab, lines, marks in panes:
        s += f'  <g class="{cls}"><text class="mono" x="72" y="353" dy="0.35em" font-size="12" fill="#9AA3B5" data-fit="264">{tab.replace("<", "&lt;").replace(">", "&gt;")}</text>'
        for mcls, row, find, color in marks:
            col = lines[row].index(find)
            s += (f'<rect class="an {mcls}" x="{72 + col*7.2 - 4:.1f}" y="{373 + row*22}" width="{len(find)*7.2 + 8:.1f}" height="20" rx="5" '
                  f'fill="{color}" fill-opacity=".45" stroke="{color}" stroke-width="1.5"/>')
        for i, line in enumerate(lines):
            indent = len(line) - len(line.lstrip())
            text = line.strip()
            s += (f'<text class="mono" x="{72 + indent*7.2:.1f}" y="{388 + i*22}" font-size="12" fill="#E6EAF2" textLength="{len(text)*7.2:.1f}" '
                  f'lengthAdjust="spacingAndGlyphs" data-fit="268">{text.replace("<", "&lt;").replace(">", "&gt;")}</text>')
        s += '</g>\n'

    s += '  <path class="tree" d="M516,184 V208 M516,248 V272 M516,312 V336 M516,376 V388 M462,400 V388 H570 V400"/>\n'
    s += f'  <path d="M620,228 H716" stroke="{ind}" stroke-width="1.75" stroke-dasharray="4 4" fill="none"/>\n'
    s += f'  <text x="660" y="218" text-anchor="middle" font-size="12" font-weight="600" fill="{ind}">guarda</text>\n'
    for i, (name, color) in enumerate([('MaterialApp', 'slate'), ('BlocProvider', 'amber'), ('ProductsScreen', 'slate'), ('Scaffold', 'slate')]):
        s += '  ' + box(412, 144 + i*64, 208, 40, color, name, hero=name == 'BlocProvider')
    s += '  ' + box(412, 400, 100, 40, 'teal', 'IconButton', fs=12) + '  ' + box(520, 400, 100, 40, 'violet', 'BlocBuilder', fs=12)
    s += f'  <rect x="424" y="262" width="68" height="20" rx="10" fill="{ind}"/>\n'
    s += '  <text class="mono" x="458" y="272" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">context</text>\n'
    s += '  ' + box(716, 204, 184, 48, 'indigo', 'ProductsBloc', sub='lo guarda el BlocProvider')
    s += '  ' + box(724, 264, 168, 32, 'teal', 'on&lt;LoadProductsEvent&gt;', fs=12)
    s += '  ' + box(792, 388, 108, 48, 'amber', 'API', sub='fuera de la app')
    s += '  <path class="ar-indigo" d="M412,292 H394 V228 H410"/>\n'
    s += '  <path class="ar-teal" d="M462,440 V484 H760 V298"/>\n'
    s += f'  <text class="mono" x="808" y="506" text-anchor="middle" font-size="12" font-weight="600" fill="{teal}" data-fit="196">.add(LoadProductsEvent())</text>\n'
    s += '  <path class="ar-green" d="M716,244 H668 V420 H622"/>\n'
    s += f'  <text class="mono" x="662" y="300" text-anchor="end" font-size="12" font-weight="600" fill="{green}">emit</text>\n'
    s += '  <path class="ar-amber" d="M828,298 V386"/><path class="ar-amber" d="M864,388 V298"/>\n'
    s += f'  <text class="mono" x="820" y="372" text-anchor="end" font-size="12" font-weight="600" fill="{amber}">GET</text>\n'
    s += f'  <text class="mono" x="872" y="372" font-size="12" font-weight="600" fill="{amber}">JSON</text>\n'
    for x, y, n, color in ((412, 400, 1, 'teal'), (620, 272, 2, 'indigo'), (394, 260, 3, 'indigo'), (760, 440, 4, 'teal'),
                           (892, 264, 5, 'teal'), (846, 340, 6, 'amber'), (668, 348, 7, 'green'), (620, 400, 8, 'violet')):
        s += '  ' + chip(x, y, n, color)

    s += f'  <circle class="an a1" cx="324" cy="166" r="16" fill="none" stroke="{teal}" stroke-width="3"/>\n'
    s += f'  <circle class="an tap" cx="324" cy="166" r="24" fill="{teal}" fill-opacity=".35" stroke="{teal}" stroke-width="2"/>\n'
    rings = [('a1', 406, 394, 112, 52, teal), ('a2', 406, 254, 220, 64, ind), ('a33', 406, 202, 220, 52, amber),
             ('a33', 710, 198, 196, 60, ind), ('a5', 718, 258, 180, 44, teal), ('a5', 710, 198, 196, 60, ind),
             ('a6', 786, 382, 120, 60, amber), ('a6', 718, 258, 180, 44, teal), ('a7', 710, 198, 196, 60, ind),
             ('a8', 514, 394, 112, 52, FAM['violet'][2])]
    for cls, x, y, w, hh, color in rings:
        s += f'  <rect class="an {cls}" x="{x}" y="{y}" width="{w}" height="{hh}" rx="14" fill="none" stroke="{color}" stroke-width="3"/>\n'
    s += f'  <path class="an a33" d="M626,228 H710" stroke="{ind}" stroke-width="3.5" fill="none"/>\n'
    for cls, cx, cy, color in (('tk1', 412, 292, ind), ('tk2', 462, 440, teal), ('tkL', 716, 244, green), ('tkG', 828, 298, amber),
                               ('tkJ', 864, 388, amber), ('tkE', 716, 244, green)):
        s += f'  <circle class="an {cls}" cx="{cx}" cy="{cy}" r="8" fill="{color}" stroke="#FFFFFF" stroke-width="2"/>\n'

    s += '  <rect x="48" y="536" width="864" height="56" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>\n'
    caps = [(1, 'teal', 'El usuario toca el botón de recargar.', 'En el árbol es el IconButton: se ejecuta su onPressed.'),
            (2, 'indigo', 'El código usa context.', 'Es el de ProductsScreen: el onPressed está escrito dentro de su build.'),
            (3, 'indigo', 'context.read&lt;ProductsBloc&gt;() sube por el árbol desde ahí.', 'Encuentra el BlocProvider y devuelve el ProductsBloc que guarda.'),
            (4, 'teal', '.add(LoadProductsEvent()) le entrega el evento a ese Bloc.', 'El evento sale de la vista y entra a la capa de Bloc.'),
            (5, 'teal', 'El Bloc atiende el evento en su on&lt;LoadProductsEvent&gt; y emite ProductsLoadingState.', 'BlocBuilder lo recibe y la pantalla muestra la carga.'),
            (6, 'amber', 'El Bloc consigue los datos: hace un HTTP GET a la API y espera la respuesta.', 'La vista no se entera de esta parte.'),
            (7, 'green', 'Con la respuesta, el Bloc emite ProductsLoadedState con los productos.', 'El estado baja hasta el BlocBuilder, que está debajo del mismo BlocProvider.'),
            (8, 'violet', 'BlocBuilder ejecuta builder con ese estado y devuelve la lista.', 'La pantalla muestra los productos nuevos.')]
    for n, color, l1, l2 in caps:
        s += (f'  <g class="an a{n}">' + chip(76, 564, n, color).strip() +
              f'<text x="100" y="559" font-size="13" font-weight="600" fill="#161A26" data-fit="790">{l1}</text>'
              f'<text x="100" y="577" font-size="13" fill="#454C61" data-fit="790">{l2}</text></g>\n')
    s += ('  <g class="st"><text x="68" y="559" font-size="13" font-weight="600" fill="#161A26" data-fit="820">El evento sube al Bloc con context.read y add; la respuesta baja como estado hasta el BlocBuilder.</text>'
          '<text x="68" y="577" font-size="13" fill="#454C61" data-fit="820">Los números marcan el orden de los ocho pasos.</text></g>\n')
    return s + tail(h, 'La vista nunca recibe el Bloc por constructor: lo alcanza a través del context cada vez que lo necesita.')


FIGS['bpRead'] = bp_read


def bp_context():
    fid, h = 'bpContext', 520
    s = head(fid, h, '<tspan class="mono">context.read</tspan> busca hacia arriba', 'context.read busca hacia arriba',
             'La búsqueda empieza en el widget dueño del context y sube. Lo que ese widget tiene debajo no cuenta.',
             'Dos árboles comparados. En el que no funciona, ProductsScreen crea el BlocProvider dentro de su propio build y usa su propio '
             'context: la búsqueda sube hasta MaterialApp, no encuentra el provider y lanza ProviderNotFoundException. En el que funciona, '
             'el BlocProvider está arriba de ProductsScreen y la búsqueda lo encuentra en el primer paso.',
             colors=('rose', 'green'))

    def panel(px, color, label, order, found):
        soft, border, strong = FAM[color]
        o = f'  <rect x="{px}" y="104" width="424" height="352" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>\n'
        o += f'  <rect x="{px+20}" y="120" width="{len(label)*8.6 + 24:.0f}" height="24" rx="12" fill="{soft}" stroke="{border}" stroke-width="1.5"/>\n'
        o += f'  <text x="{px+32}" y="132" dy="0.35em" font-size="12" font-weight="700" letter-spacing=".08em" fill="{strong}">{label}</text>\n'
        o += f'  <path class="tree" d="M{px+124},208 V224 M{px+124},264 V280 M{px+124},320 V336"/>\n'
        for i, name in enumerate(order):
            y = 168 + i * 56
            c = 'amber' if name == 'BlocProvider' else 'slate'
            o += '  ' + box(px + 24, y, 200, 40, c, name, hero=name == 'BlocProvider')
            if name == 'ProductsScreen':
                o += f'  <rect x="{px+36}" y="{y-10}" width="68" height="20" rx="10" fill="#4453C9"/>\n'
                o += f'  <text class="mono" x="{px+70}" y="{y}" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">context</text>\n'
        return o

    s += panel(48, 'rose', 'NO FUNCIONA', ['MaterialApp', 'ProductsScreen', 'BlocProvider', 'Scaffold'], False)
    s += '  <path class="ar-rose" d="M272,244 H296 V152"/>\n'
    s += '  <text x="312" y="180" font-size="12.5" font-weight="700" fill="#C2354F" data-fit="150">Sube y no encuentra</text>\n'
    s += '  <text x="312" y="197" font-size="12.5" fill="#454C61" data-fit="150">ningún provider arriba.</text>\n'
    s += '  <text x="312" y="292" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="150">Está debajo.</text>\n'
    s += '  <text x="312" y="309" font-size="12.5" fill="#454C61" data-fit="150">La búsqueda nunca</text>\n'
    s += '  <text x="312" y="326" font-size="12.5" fill="#454C61" data-fit="150">mira hacia abajo.</text>\n'
    s += '  <rect x="72" y="408" width="376" height="32" rx="8" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/>\n'
    s += '  <text class="mono" x="260" y="424" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#C2354F" data-fit="352">ProviderNotFoundException</text>\n'

    s += panel(488, 'green', 'FUNCIONA', ['MaterialApp', 'BlocProvider', 'ProductsScreen', 'Scaffold'], True)
    s += '  <path class="ar-green" d="M712,300 H736 V244 H716"/>\n'
    s += '  <text x="752" y="262" font-size="12.5" font-weight="700" fill="#3A8235" data-fit="150">Sube un nivel</text>\n'
    s += '  <text x="752" y="279" font-size="12.5" fill="#454C61" data-fit="150">y lo encuentra.</text>\n'
    s += '  <text x="752" y="348" font-size="12.5" fill="#454C61" data-fit="150">Scaffold y sus hijos</text>\n'
    s += '  <text x="752" y="365" font-size="12.5" fill="#454C61" data-fit="150">también lo alcanzan.</text>\n'
    s += '  <rect x="512" y="408" width="376" height="32" rx="8" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/>\n'
    s += '  <text class="mono" x="700" y="424" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235" data-fit="352">devuelve el ProductsBloc</text>\n'
    return s + tail(h, 'La etiqueta azul marca de quién es el context que se usó para buscar: el de ProductsScreen en los dos casos.')


FIGS['bpContext'] = bp_context

# ───────────────────────────── BlocBuilder


def bb_anatomia_result():
    o = box(110, 14, 140, 40, 'indigo', 'ProductsBloc')
    o += '<path class="ar-green" d="M180,54 V76"/><text class="mono" x="190" y="66" dy="0.35em" font-size="12" fill="#3A8235">emit</text>'
    o += box(60, 78, 240, 34, 'green', 'ProductsLoadedState')
    o += '<path class="ar-violet" d="M180,112 V136"/><text class="mono" x="190" y="124" dy="0.35em" font-size="12" fill="#7439B8">builder</text>'
    o += phone(96, 138, 168, 190, 'Catálogo')
    o += rows(108, 190, 144, PRODUCTS, gap=40)
    return o


FIGS['bbAnatomia'] = lambda: frame(dict(
    id='bbAnatomia',
    title='Las partes de un <tspan class="mono">BlocBuilder</tspan>',
    title_plain='Las partes de un BlocBuilder',
    desc='Un BlocBuilder de ProductsBloc y ProductsState anotado. El primer tipo dice a qué Bloc escucha, el parámetro state del builder '
         'es el estado que el Bloc acaba de emitir, y lo que el builder devuelve, un ListView con un ListTile por producto, es lo que '
         'aparece en la pantalla.',
    sub='Escucha a un Bloc y, cada vez que llega un estado, ejecuta builder para volver a dibujar.',
    file='lib/screens/products_screen.dart',
    panel='LO QUE PASA CON CADA ESTADO',
    code=[
        "BlocBuilder<ProductsBloc, ProductsState>(",
        "  builder: (context, state) {",
        "    if (state is ProductsLoadingState) {",
        "      return const CircularProgressIndicator();",
        "    }",
        "    return ListView(",
        "      children: [",
        "        for (final product in state.products)",
        "          ListTile(title: Text(product.name)),",
        "      ],",
        "    );",
        "  },",
        ")",
    ],
    result=bb_anatomia_result(),
    arrows=[
        dict(line=0, find='ProductsBloc', to=(110, 34), color='indigo', lane=2),
        dict(line=1, find='state', to=(60, 95), color='green', lane=1),
        dict(line=5, find='return ListView(', to=(96, 244), color='violet', lane=0),
    ],
    cards=[
        ('indigo', '<ProductsBloc, ...>', ['A qué Bloc escucha. Lo busca', 'solo, hacia arriba, en el árbol.']),
        ('green', 'state', ['El estado que acaba de llegar,', 'de tipo ProductsState.']),
        ('violet', 'return', ['Los widgets para ese estado.', 'Es lo que queda en pantalla.']),
    ],
))


def bb_estados(freeze=None):
    """Animada: dos caminos de dos pasos de 4 s (carga y lista, carga y error). Con freeze=1..4 sale el fotograma fijo de ese paso."""
    fid, h = 'bbEstados', 644
    s = head(fid, h, 'Un estado, un dibujo', 'Un estado, un dibujo',
             'builder es una función: recibe el estado y devuelve los widgets que le corresponden. Mismo estado, misma pantalla.',
             'Animación con dos caminos. A la izquierda, el código de builder con un if por cada estado. A la derecha, el estado que '
             'llega y lo que ve el usuario. Camino feliz: llega ProductsLoadingState, se ejecuta el primer if y se ve un indicador de '
             'carga; después llega ProductsLoadedState, se ejecuta el segundo y se ve la lista de productos. Camino con error: llega '
             'ProductsLoadingState y se ve la carga; después llega ProductsErrorState, se ejecuta el tercer if y se ve Sin conexión.',
             colors=('amber', 'green', 'rose'))
    spans = {'aL': [(0, 25), (50, 75)], 'a2': [(25, 50)], 'a3': [(75, 100)], 'aH': [(0, 50)], 'aE': [(50, 100)],
             'p1': [(0, 25)], 'p3': [(50, 75)]}
    if freeze:
        on = {1: ['aL', 'aH', 'p1'], 2: ['a2', 'aH'], 3: ['aL', 'aE', 'p3'], 4: ['a3', 'aE']}[freeze]
        css = f'      #{fid} .an,#{fid} .ls{{opacity:0}}\n' + ''.join(f'      #{fid} .{c}{{opacity:1}}\n' for c in on)
    else:
        css = (f'      #{fid} .an,#{fid} .ls{{animation-duration:16s;animation-iteration-count:infinite;animation-timing-function:linear}}\n'
               f'      #{fid} .an{{opacity:0}}\n'
               f'      #{fid} .spin{{animation:{fid}-spin 1s linear infinite;transform-box:fill-box;transform-origin:center}}\n'
               f'      @keyframes {fid}-spin{{to{{transform:rotate(360deg)}}}}\n')
        for k, sp in spans.items():
            css += f'      #{fid} .{k}{{animation-name:{fid}-{k}}}\n' + keyframes(f'{fid}-{k}', sp)
        css += f'      @media (prefers-reduced-motion: reduce){{#{fid} .an,#{fid} .ls,#{fid} .spin{{animation:none}}}}\n'
    css += (f'      #{fid} .cl{{font-size:13px;fill:#C9CFDA}}\n'
            f'      #{fid} .s{{fill:#A8D8A0}} #{fid} .n{{fill:#F2B880}} #{fid} .c{{fill:#7FD1E8}}\n'
            f'      #{fid} .p{{fill:#D5B8F5}} #{fid} .k{{fill:#F08FB0}}\n')
    s = s.replace('    </style>', css + '    </style>', 1)
    s = s.replace(f'<svg id="{fid}"', f'<svg id="{fid}" data-steps="4" data-step-seconds="4"', 1)

    states = [('amber', 'ProductsLoadingState', 'CircularProgressIndicator()'),
              ('green', 'ProductsLoadedState', 'ListView(children: [...])'),
              ('rose', 'ProductsErrorState', 'Text(state.message)')]
    code = ['builder: (context, state) {']
    for _, name, widget in states:
        code += [f'  if (state is {name}) {{', f'    return {widget};', '  }']
    code += ['  return SizedBox();', '}']

    def vis(k):
        return {1: 'an aL', 2: 'ls a2', 3: 'an a3'}[k]

    s += '  <rect x="48" y="112" width="456" height="352" rx="12" fill="#1F2430"/>\n'
    s += '  <path d="M48,124 A12,12 0 0 1 60,112 H492 A12,12 0 0 1 504,124 V144 H48 Z" fill="#2A3040"/>\n'
    s += '  <circle cx="68" cy="128" r="5" fill="#F14C4C"/><circle cx="84" cy="128" r="5" fill="#E5C07B"/><circle cx="100" cy="128" r="5" fill="#6BCB77"/>\n'
    s += '  <text class="mono" x="276" y="128" dy="0.35em" text-anchor="middle" fill="#9AA3B5" font-size="12" data-fit="316">lib/screens/products_screen.dart</text>\n'
    for k, (color, _, _) in enumerate(states, 1):
        y = 172 + (3*k - 2) * 24 - 17
        s += (f'  <rect class="{vis(k)}" x="76" y="{y}" width="416" height="72" rx="6" fill="{FAM[color][1]}" fill-opacity=".18" '
              f'stroke="{FAM[color][1]}" stroke-width="1.5"/>\n')
    for i, line in enumerate(code):
        indent = len(line) - len(line.lstrip())
        text = line.strip()
        s += (f'  <text class="cl mono" x="{68 + indent*7.8:.1f}" y="{172 + i*24}" textLength="{len(text)*7.8:.1f}" '
              f'lengthAdjust="spacingAndGlyphs" data-fit="432">{highlight(text)}</text>\n')

    s += '  <rect x="552" y="112" width="360" height="352" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>\n'
    s += '  <text class="h" x="568" y="128" dy="0.35em" data-fit="150">LLEGA EL ESTADO</text>\n'
    for cls, color, label in (('ls aH', 'green', 'CAMINO FELIZ'), ('an aE', 'rose', 'CAMINO CON ERROR')):
        w = len(label) * 8.2 + 20
        s += (f'  <g class="{cls}"><rect x="{900 - w:.0f}" y="118" width="{w:.0f}" height="20" rx="10" fill="{FAM[color][0]}" stroke="{FAM[color][1]}" stroke-width="1.5"/>'
              f'<text x="{900 - w/2:.0f}" y="128" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" letter-spacing=".08em" fill="{FAM[color][2]}">{label}</text></g>\n')
    s += '  <path d="M552,144 H912" stroke="#D9DEE8" stroke-width="1.5"/>\n'
    s += '  <path class="link" d="M732,204 V236"/>\n'
    s += '  <text x="746" y="222" dy="0.35em" font-size="12" font-weight="600" fill="#556074">lo que ve el usuario</text>\n'
    s += '  ' + phone(632, 240, 200, 208, 'Catálogo')
    for k, (color, name, _) in enumerate(states, 1):
        yc = 172 + (3*k - 1) * 24 - 5
        s += f'  <g class="{vis(k)}">' + box(612, 160, 240, 40, color, name).strip()
        s += f'<path class="ar-{color}" d="M612,180 H528 V{yc} H494"/>'
        if k == 1:
            s += '<g class="spin">' + spinner(732, 360).strip() + '</g>'
        elif k == 2:
            s += rows(648, 296, 168, PRODUCTS, color='green').strip()
        else:
            s += ('<circle cx="732" cy="346" r="18" fill="#FFEBEF" stroke="#C2354F" stroke-width="2"/>'
                  '<text x="732" y="346" dy="0.35em" text-anchor="middle" font-size="18" font-weight="700" fill="#C2354F">!</text>'
                  '<text x="732" y="392" text-anchor="middle" font-size="13" fill="#161A26">Sin conexión</text>')
        s += '</g>\n'

    flows = [('green', 'CAMINO FELIZ', 'ls aH', [('amber', 0, 'an p1'), ('green', 1, 'ls a2')]),
             ('rose', 'CAMINO CON ERROR', 'an aE', [('amber', 0, 'an p3'), ('rose', 2, 'an a3')])]
    for n, (color, label, cls, pills) in enumerate(flows):
        x = 48 + n * 440
        s += (f'  <g transform="translate({x},488)"><rect width="424" height="88" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>'
              f'<rect class="{cls}" x="-3" y="-3" width="430" height="94" rx="14" fill="none" stroke="{FAM[color][2]}" stroke-width="3"/>'
              f'<text class="h" x="16" y="24" style="fill:{FAM[color][2]}" data-fit="392">{label}</text>'
              f'<path class="link" d="M196,56 H226"/>')
        for m, (pc, idx, pcls) in enumerate(pills):
            px = 16 + m * 212
            s += (f'<rect x="{px}" y="40" width="180" height="32" rx="8" fill="{FAM[pc][0]}" stroke="{FAM[pc][1]}" stroke-width="1.5"/>'
                  f'<rect class="{pcls}" x="{px-3}" y="37" width="186" height="38" rx="10" fill="none" stroke="{FAM[pc][2]}" stroke-width="2.5"/>'
                  f'<text class="mono" x="{px+90}" y="56" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="{FAM[pc][2]}" data-fit="168">{states[idx][1]}</text>')
        s += '</g>\n'
    return s + tail(h, 'La pantalla no recuerda nada por su cuenta: si debe verse distinta, es porque llegó otro estado.')


FIGS['bbEstados'] = bb_estados


def bb_alcance():
    fid, h = 'bbAlcance', 588
    s = head(fid, h, 'Qué se vuelve a dibujar', 'Qué se vuelve a dibujar',
             'Solo lo que está dentro del BlocBuilder se reconstruye con cada estado. El resto de la pantalla no se entera.',
             'Árbol de una pantalla: Scaffold con un AppBar y un Column; dentro del Column, un SearchField y un BlocBuilder con un ListView '
             'de tres ListTile. Una zona resaltada rodea al BlocBuilder y a todo lo que tiene debajo: es lo único que se reconstruye cuando '
             'llega un estado. AppBar y SearchField quedan fuera y no se reconstruyen.')
    s += '  <rect x="336" y="256" width="304" height="268" rx="14" fill="#F4EBFF" fill-opacity=".6" stroke="#C9A6EE" stroke-width="1.5" stroke-dasharray="6 5"/>\n'
    s += '  <text class="h" x="488" y="504" text-anchor="middle" style="fill:#7439B8" data-fit="280">SE RECONSTRUYE CON CADA ESTADO</text>\n'
    s += ('  <path class="tree" d="M272,152 V172 M152,192 V172 H392 V192 M392,232 V252 M232,272 V252 H488 V272 '
          'M488,312 V352 M488,392 V412 M394,432 V412 H582 V432 M488,412 V432"/>\n')
    s += '  ' + box(192, 112, 160, 40, 'slate', 'Scaffold')
    s += '  ' + box(72, 192, 160, 40, 'slate', 'AppBar')
    s += '  ' + box(312, 192, 160, 40, 'slate', 'Column')
    s += '  ' + box(152, 272, 160, 40, 'slate', 'SearchField')
    s += '  ' + box(408, 272, 160, 40, 'violet', 'BlocBuilder', hero=True)
    s += '  ' + box(408, 352, 160, 40, 'violet', 'ListView')
    for x in (352, 446, 540):
        s += '  ' + box(x, 432, 84, 36, 'violet', 'ListTile', fs=12.5)
    s += '  ' + note(672, 112, 240, 'slate', 'Fuera del BlocBuilder', ['AppBar y SearchField no se', 'reconstruyen: no dependen', 'del estado del Bloc.'])
    s += '  ' + note(672, 272, 240, 'violet', 'Dentro del BlocBuilder', ['builder se ejecuta otra vez', 'con cada estado, y todo lo', 'que devuelve se rehace.'])
    s += '  ' + note(672, 432, 240, 'amber', 'La regla', ['Envuelve solo lo que cambia', 'con el estado. Entre más', 'abajo esté, menos se rehace.'])
    return s + tail(h, 'Menos widgets reconstruidos es menos trabajo por cada estado. Se nota cuando los estados llegan seguido.')


FIGS['bbAlcance'] = bb_alcance


def bb_ciclo():
    fid, h = 'bbCiclo', 576
    s = head(fid, h, 'Los dos juntos: el ciclo completo', 'Los dos juntos: el ciclo completo',
             'BlocProvider pone el Bloc al alcance. Con eso, la vista le lanza eventos y BlocBuilder dibuja lo que el Bloc responde.',
             'Un marco BlocProvider de ProductsBloc rodea a la vista y al Bloc. Paso 1: el botón Recargar de la vista llama a context.read y '
             'add para lanzar LoadProductsEvent al ProductsBloc. Paso 2: el Bloc emite un estado. Paso 3: BlocBuilder recibe ese estado, '
             'ejecuta builder y redibuja la lista.',
             colors=('teal', 'green'))
    s += '  <rect x="48" y="120" width="864" height="304" rx="14" fill="#FFF3DC" fill-opacity=".45" stroke="#F0C572" stroke-width="2"/>\n'
    s += '  <rect x="72" y="106" width="232" height="28" rx="8" fill="#FFF3DC" stroke="#F0C572" stroke-width="2"/>\n'
    s += '  <text class="mono" x="188" y="120" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#A96C05" data-fit="216">BlocProvider&lt;ProductsBloc&gt;</text>\n'
    s += '  <rect x="72" y="156" width="320" height="244" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>\n'
    s += '  <text class="h" x="92" y="182">VISTA · ProductsScreen</text>\n'
    s += '  ' + box(96, 200, 272, 76, 'violet', 'BlocBuilder', sub='dibuja el estado que llega')
    s += '  ' + box(96, 300, 272, 76, 'teal', 'IconButton', sub='Recargar · onPressed lanza un evento')
    s += '  ' + box(672, 200, 216, 176, 'indigo', 'ProductsBloc', sub='pide los datos y decide', hero=True)
    s += '  <path class="ar-green" d="M672,238 H370"/>\n'
    s += '  <path class="ar-teal" d="M368,338 H670"/>\n'
    s += '  ' + chip(644, 238, 2, 'green') + '  ' + chip(396, 238, 3, 'green') + '  ' + chip(396, 338, 1, 'teal')
    s += '  <text class="mono" x="520" y="222" text-anchor="middle" font-size="12.5" font-weight="600" fill="#3A8235" data-fit="210">emit(ProductsLoadedState)</text>\n'
    s += '  <text class="mono" x="520" y="262" text-anchor="middle" font-size="12.5" font-weight="600" fill="#3A8235" data-fit="210">builder(context, state)</text>\n'
    s += '  <text class="mono" x="532" y="322" text-anchor="middle" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="230">context.read&lt;ProductsBloc&gt;()</text>\n'
    s += '  <text class="mono" x="532" y="362" text-anchor="middle" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="230">.add(LoadProductsEvent())</text>\n'
    steps = [
        ('teal', 1, 'La vista avisa', ['context.read alcanza el Bloc', 'y add le lanza el evento.']),
        ('green', 2, 'El Bloc responde', ['Hace su trabajo y entrega', 'un estado nuevo con emit.']),
        ('green', 3, 'BlocBuilder redibuja', ['Ejecuta builder con ese estado', 'y cambia la pantalla.']),
    ]
    for i, (color, n, title, text) in enumerate(steps):
        x = 48 + i * 296
        s += '  ' + chip(x + 12, 462, n, color)
        s += f'  <text x="{x+34}" y="462" dy="0.35em" font-size="14" font-weight="700" fill="#161A26" data-fit="230">{title}</text>\n'
        for j, ln in enumerate(text):
            s += f'  <text x="{x}" y="{494 + j*17}" font-size="12.5" fill="#454C61" data-fit="272">{ln}</text>\n'
    return s + tail(h, 'Sin BlocProvider no habría nada que alcanzar; sin BlocBuilder, los estados llegarían y nadie los dibujaría.')


FIGS['bbCiclo'] = bb_ciclo


def main():
    if len(sys.argv) > 1 and sys.argv[1] == '--inject':
        done = set()
        for name in LESSONS:
            path = ROOT / 'content' / name
            text = path.read_text(encoding='utf-8')

            def swap(m):
                done.add(m.group(1))
                return '```svg\n' + FIGS[m.group(1)]() + '```'
            new = re.sub(r'```svg\n<svg id="(\w+)".*?```', swap, text, flags=re.S)
            path.write_text(new, encoding='utf-8')
        missing = set(FIGS) - done
        print('inyectadas:', len(done), '· sin usar:', sorted(missing) or 'ninguna')
        return
    out = pathlib.Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    for fid, fn in FIGS.items():
        (out / f'{fid}.svg').write_text(fn(), encoding='utf-8')
    print(len(FIGS), 'figuras en', out)


if __name__ == '__main__':
    main()
