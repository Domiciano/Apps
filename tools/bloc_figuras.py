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
from code_frame import frame  # noqa: E402

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
    desc='Un BlocProvider de ProductsBloc anotado: create construye el ProductsBloc, con ProductState como estado inicial, y el '
         'provider lo guarda; child es ProductsScreen, la parte del árbol que queda con el Bloc a su alcance.',
    sub='Dos parámetros: create dice cómo se construye el Bloc y child dice quién lo va a poder usar.',
    file='lib/main.dart',
    panel='LO QUE QUEDA ARMADO',
    min_h=296,
    code=[
        "BlocProvider<ProductsBloc>(",
        "  create: (context) => ProductsBloc(ProductState()),",
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
    """Animada: cinco pasos de 3 s. Con freeze=1..5 sale el fotograma fijo de ese paso, para revisarlo."""
    fid, h = 'bpInitState', 616
    s = head(fid, h, 'El primer evento sale de <tspan class="mono">initState</tspan>', 'El primer evento sale de initState',
             'El ciclo de vida de ProductsScreen, paso a paso: initState corre una sola vez y ahí se le pide al Bloc la carga inicial.',
             'Animación en cinco pasos del ciclo de vida de ProductsScreen. Uno: createState crea el State. Dos: initState corre una '
             'sola vez y lanza LoadProductsEvent al ProductsBloc con context.read y add. Tres: build dibuja la pantalla con el estado '
             'inicial. Cuatro: el Bloc emite un estado nuevo y BlocBuilder vuelve a ejecutar builder, ahora con los productos. '
             'Cinco: dispose, cuando la pantalla sale del árbol.',
             colors=('teal', 'green'))
    steps = {1: [(0, 20)], 2: [(20, 40)], 3: [(40, 60)], 4: [(60, 80)], 5: [(80, 100)], 34: [(40, 80)]}
    if freeze:
        css = f'      #{fid} .an,#{fid} .st{{opacity:0}}\n      #{fid} .ls{{opacity:{1 if freeze == 4 else 0}}}\n'
        css += f'      #{fid} .a{freeze}{{opacity:1}}\n'
        if freeze in (3, 4):
            css += f'      #{fid} .a34{{opacity:1}}\n'
        css += f'      #{fid} .tk1{{transform:translate(152px,0)}}\n      #{fid} .tk2{{transform:translate(-200px,52px)}}\n'
    else:
        css = (f'      #{fid} .an{{opacity:0;animation-duration:15s;animation-iteration-count:infinite;animation-timing-function:linear}}\n'
               f'      #{fid} .ls{{animation:{fid}-a4 15s linear infinite}}\n'
               f'      #{fid} .st{{animation:{fid}-hide 15s linear infinite}}\n')
        for k, spans in steps.items():
            css += f'      #{fid} .a{k}{{animation-name:{fid}-a{k}}}\n' + keyframes(f'{fid}-a{k}', spans)
        css += (f'      #{fid} .tk1{{animation-name:{fid}-tk1}}\n      #{fid} .tk2{{animation-name:{fid}-tk2}}\n'
                f'      @keyframes {fid}-hide{{from{{opacity:0}}to{{opacity:0}}}}\n'
                f'      @keyframes {fid}-tk1{{0%,23%{{opacity:0;transform:translate(0,0)}}25%{{opacity:1;transform:translate(0,0)}}'
                f'36%{{opacity:1;transform:translate(304px,0)}}38%,100%{{opacity:0;transform:translate(304px,0)}}}}\n'
                f'      @keyframes {fid}-tk2{{0%,62%{{opacity:0;transform:translate(0,0)}}64%{{opacity:1;transform:translate(0,0)}}'
                f'67%{{opacity:1;transform:translate(0,52px)}}76%{{opacity:1;transform:translate(-424px,52px)}}'
                f'78%,100%{{opacity:0;transform:translate(-424px,52px)}}}}\n'
                f'      @media (prefers-reduced-motion: reduce){{#{fid} .an,#{fid} .ls,#{fid} .st{{animation:none}}}}\n')
    s = s.replace('    </style>', css + '    </style>', 1)

    life = [(1, 152, 'slate', 'createState()', 'Flutter crea el State'),
            (2, 232, 'teal', 'initState()', 'una sola vez'),
            (3, 312, 'violet', 'build()', 'cada vez que hay que dibujar'),
            (5, 416, 'slate', 'dispose()', 'al salir del árbol')]
    s += f'  <text class="h" x="48" y="124" data-fit="288">CICLO DE VIDA DE PRODUCTSSCREEN</text>\n'
    s += '  <path class="link" d="M212,204 V230"/><path class="link" d="M212,284 V310"/><path class="link" d="M212,364 V414"/>\n'
    s += '  <text x="226" y="393" font-size="12" fill="#79809A" data-fit="200">mientras siga en el árbol</text>\n'
    for n, y, color, label, sub in life:
        s += '  ' + box(88, y, 248, 52, color, label, sub=sub, hero=(n == 2))
        s += '  ' + chip(60, y + 26, n, color)
    s += '  ' + note(624, 112, 288, 'teal', 'Por qué en initState', ['Corre una vez, al entrar al árbol.', 'build corre muchas: un add ahí', 'repetiría la carga con cada dibujo.'])
    s += '  ' + box(640, 230, 240, 56, 'indigo', 'ProductsBloc', sub='guardado en el BlocProvider')
    s += '  <path class="ar-teal" d="M336,258 H638"/>\n'
    s += f'  <text class="mono" x="488" y="246" text-anchor="middle" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="280">context.read&lt;ProductsBloc&gt;()</text>\n'
    s += f'  <text class="mono" x="488" y="278" text-anchor="middle" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="280">.add(LoadProductsEvent())</text>\n'
    s += '  <path class="ar-green" d="M760,286 V338 H338"/>\n'
    s += '  ' + chip(788, 312, 4, 'green')
    s += '  <text class="mono" x="548" y="328" text-anchor="middle" font-size="12.5" font-weight="600" fill="#3A8235" data-fit="280">emit(estado nuevo)</text>\n'
    s += '  <text x="548" y="358" text-anchor="middle" font-size="12" fill="#454C61" data-fit="380">BlocBuilder vuelve a ejecutar builder</text>\n'
    s += '  <text class="h" x="640" y="376" data-fit="240">LO QUE SE VE</text>\n'
    s += '  ' + phone(640, 388, 240, 160, 'Catálogo')
    s += '  <g class="an a3">' + ''.join(
        f'<rect x="656" y="{440 + i*34}" width="208" height="30" rx="7" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.25"/>'
        f'<rect x="668" y="{451 + i*34}" width="{w}" height="8" rx="4" fill="#C4CBD8"/>' for i, w in enumerate((96, 132, 72))) + '</g>\n'
    s += '  <g class="ls">' + rows(656, 440, 208, PRODUCTS, gap=34).strip() + '</g>\n'

    for n, y, color, _, _ in life:
        cls = 'a34' if n == 3 else f'a{n}'
        s += f'  <rect class="an {cls}" x="82" y="{y-6}" width="260" height="64" rx="14" fill="none" stroke="{FAM[color][2]}" stroke-width="3"/>\n'
    s += f'  <rect class="an a4" x="634" y="224" width="252" height="68" rx="14" fill="none" stroke="{FAM["indigo"][2]}" stroke-width="3"/>\n'
    s += f'  <circle class="an tk1" cx="336" cy="258" r="8" fill="{FAM["teal"][2]}" stroke="#FFFFFF" stroke-width="2"/>\n'
    s += f'  <circle class="an tk2" cx="760" cy="286" r="8" fill="{FAM["green"][2]}" stroke="#FFFFFF" stroke-width="2"/>\n'

    s += '  <rect x="48" y="492" width="544" height="64" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>\n'
    caps = [(1, 'slate', 'Flutter crea el State de ProductsScreen.', 'Todavía no hay nada dibujado.'),
            (2, 'teal', 'initState corre una sola vez y lanza', 'LoadProductsEvent al Bloc que tiene encima.'),
            (3, 'violet', 'build dibuja la pantalla con el estado inicial,', 'el ProductState() que recibió el Bloc en create.'),
            (4, 'green', 'El Bloc emite un estado nuevo y la lista se dibuja', 'con los productos. initState no se repite.'),
            (5, 'slate', 'Al salir de la pantalla corre dispose', 'y el State se descarta.')]
    for n, color, l1, l2 in caps:
        s += (f'  <g class="an a{n}">' + chip(76, 524, n, color).strip() +
              f'<text x="100" y="519" font-size="13" font-weight="600" fill="#161A26" data-fit="476">{l1}</text>'
              f'<text x="100" y="537" font-size="13" fill="#454C61" data-fit="476">{l2}</text></g>\n')
    s += ('  <g class="st"><text x="68" y="519" font-size="13" font-weight="600" fill="#161A26" data-fit="508">initState corre una vez; build, cada vez que llega un estado.</text>'
          '<text x="68" y="537" font-size="13" fill="#454C61" data-fit="508">Por eso el primer evento se lanza desde initState.</text></g>\n')
    return s + tail(h, 'El BlocProvider ya está arriba cuando corre initState: por eso context.read encuentra el Bloc.')


FIGS['bpInitState'] = bp_init_state


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


def bb_estados():
    fid, h = 'bbEstados', 548
    s = head(fid, h, 'Un estado, un dibujo', 'Un estado, un dibujo',
             'builder es una función: recibe el estado y devuelve los widgets que le corresponden. Mismo estado, misma pantalla.',
             'Tres columnas. Con ProductsLoadingState el builder devuelve un indicador de progreso; con ProductsLoadedState, la lista de '
             'tres productos; con ProductsErrorState, el mensaje de error que trae el estado.',
             colors=('amber', 'green', 'rose'))
    cols = [
        (192, 'amber', 'ProductsLoadingState', 'CircularProgressIndicator()'),
        (480, 'green', 'ProductsLoadedState', 'ListView(children: [...])'),
        (768, 'rose', 'ProductsErrorState', 'Text(state.message)'),
    ]
    for cx, color, state, code in cols:
        s += '  <text class="h" x="{}" y="124" text-anchor="middle">LLEGA EL ESTADO</text>\n'.format(cx)
        s += '  ' + box(cx - 116, 136, 232, 40, color, state)
        s += f'  <path class="ar-{color}" d="M{cx},176 V222"/>\n'
        s += f'  <rect x="{cx+10}" y="188" width="64" height="22" rx="6" fill="#FBFBFD"/>\n'
        s += f'  <text class="mono" x="{cx+14}" y="199" dy="0.35em" font-size="12" font-weight="600" fill="{FAM[color][2]}">builder</text>\n'
        s += '  ' + phone(cx - 92, 226, 184, 220, 'Catálogo')
        if color == 'amber':
            s += '  ' + spinner(cx, 352, 20)
        elif color == 'green':
            s += '  ' + rows(cx - 78, 282, 156, PRODUCTS, 'green', 42)
        else:
            s += f'  <circle cx="{cx}" cy="330" r="18" fill="#FFEBEF" stroke="#C2354F" stroke-width="2"/>\n'
            s += f'  <text x="{cx}" y="330" dy="0.35em" text-anchor="middle" font-size="20" font-weight="700" fill="#C2354F">!</text>\n'
            s += f'  <text x="{cx}" y="374" dy="0.35em" text-anchor="middle" font-size="14" fill="#161A26" data-fit="156">Sin conexión</text>\n'
        s += f'  <text class="mono" x="{cx}" y="472" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="600" fill="#454C61" data-fit="250">{code}</text>\n'
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
