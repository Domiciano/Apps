"""Figuras SVG de la sección Realtime DB: «Programación reactiva y Streams» (0063), «El Stream viaja por las
capas» (0094), «Supabase Realtime» (0062) y «Laboratorio 8 · Chat en tiempo real» (0065).

    python3 tools/realtime_figuras.py <carpeta>     escribe un .svg por figura, para revisarlas
    python3 tools/realtime_figuras.py --inject      reemplaza cada bloque ```svg de las cuatro lecciones
                                                    por la figura con el mismo id

No editar los SVG dentro del Markdown: se cambia este script y se vuelve a inyectar.
Colores: un valor que viaja por el stream en índigo, un error en rosa, el cierre en gris, el Stream
como tubería en verde azulado, lo que llega por Future en ámbar, lo mío en verde y la base de datos en
violeta.
"""

import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from bloc_figuras import FAM, head, note, phone, tail  # noqa: E402
from code_frame import frame  # noqa: E402
from database_figuras import legend  # noqa: E402
from storage_figuras import badge, code_bar  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
LESSONS = ['lessonI2.md', 'lessonI2capas.md', 'lessonI1.md', 'lessonH10.md']
FIGS = {}
MINE = ('#1F9D68', '#FFFFFF')
THEIRS = ('#FFFFFF', '#161A26')


def marble(cx, cy, color, text, r=17):
    soft, border, strong = FAM[color]
    return (f'  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{soft}" stroke="{strong}" stroke-width="2"/>'
            f'<text class="mono" x="{cx}" y="{cy}" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" '
            f'fill="{strong}">{text}</text>\n')


def xmark(cx, cy, r=13):
    _, _, strong = FAM['rose']
    return (f'  <path d="M{cx-r},{cy-r} L{cx+r},{cy+r} M{cx+r},{cy-r} L{cx-r},{cy+r}" stroke="{strong}" '
            f'stroke-width="3.5" stroke-linecap="round"/>\n')


def done_bar(x, cy, h=22):
    return f'  <path d="M{x},{cy-h} V{cy+h}" stroke="#556074" stroke-width="4" stroke-linecap="round"/>\n'


def axis(x1, x2, y):
    return f'  <path class="link" d="M{x1},{y} H{x2}"/>\n'


def caption(x, y, text, color='#454C61', size=12, anchor='middle', fit=None, weight=400, mono=False):
    cls = 'class="mono" ' if mono else ''
    f = f' data-fit="{fit}"' if fit else ''
    return (f'  <text {cls}x="{x}" y="{y}" dy="0.35em" text-anchor="{anchor}" font-size="{size}" '
            f'font-weight="{weight}" fill="{color}"{f}>{text}</text>\n')


def bubble(x, y, w, text, mine, h=30, photo=False):
    """Burbuja de chat: x es el borde izquierdo de la columna; se alinea a la derecha si es mía."""
    fill, ink = MINE if mine else THEIRS
    stroke = '' if mine else ' stroke="#DDE1E8" stroke-width="1.25"'
    bh = h + (64 if photo else 0)
    bx = x + (w - (w * 0.72)) if mine else x
    bw = w * 0.72
    o = f'  <rect x="{bx:.0f}" y="{y}" width="{bw:.0f}" height="{bh}" rx="12" fill="{fill}"{stroke}/>\n'
    ty = y + h / 2
    if photo:
        o += (f'  <rect x="{bx+6:.0f}" y="{y+6}" width="{bw-12:.0f}" height="58" rx="8" fill="#FFE3CC" '
              f'stroke="#C2571A" stroke-width="1.25"/>'
              f'<path d="M{bx+16:.0f},{y+56} L{bx+40:.0f},{y+30} L{bx+58:.0f},{y+48} L{bx+70:.0f},{y+38} '
              f'L{bx+bw-16:.0f},{y+56} Z" fill="#C2571A" opacity=".55"/>\n')
        ty = y + 64 + h / 2
    o += (f'  <text x="{bx+10:.0f}" y="{ty:.0f}" dy="0.35em" font-size="11.5" fill="{ink}" '
          f'data-fit="{bw-20:.0f}">{text}</text>\n')
    return o, bh


# ───────────────────────── 0063 · Programación reactiva y Streams ─────────────────────────

def rt_future_stream():
    fid, h = 'rtFutureStream', 430
    s = head(fid, h, 'Un Future entrega una vez. Un Stream entrega muchas veces.',
             'Un Future entrega una vez. Un Stream entrega muchas veces.',
             'El tiempo corre hacia la derecha. Cada círculo es un valor que llega a quien está escuchando.',
             'Dos líneas de tiempo. Arriba, un Future de tipo int: entrega un solo valor, 42, y con eso termina. '
             'Abajo, un Stream de tipo int: entrega 1, 2 y 3, luego un error, luego 4, y al final se cierra. '
             'Debajo de cada evento del Stream se lee qué función de listen lo recibe: onData, onError u onDone.',
             colors=('teal',))
    y1, y2, x0, x1 = 176, 316, 236, 900
    s += caption(48, y1, 'Future&lt;int&gt;', '#A96C05', 15, 'start', weight=700, mono=True)
    s += caption(48, y1 + 22, 'await · un valor', '#79809A', 12, 'start')
    s += axis(x0, x1, y1)
    s += marble(470, y1, 'amber', '42')
    s += done_bar(500, y1)
    s += caption(485, y1 + 40, 'llega y termina', '#A96C05', 12)
    s += caption(48, y2, 'Stream&lt;int&gt;', '#0F8478', 15, 'start', weight=700, mono=True)
    s += caption(48, y2 + 22, 'listen · muchos valores', '#79809A', 12, 'start')
    s += axis(x0, x1, y2)
    for cx, v in ((300, '1'), (400, '2'), (500, '3'), (720, '4')):
        s += marble(cx, y2, 'indigo', v)
        s += caption(cx, y2 + 40, 'onData', '#4453C9', 12, mono=True)
    s += xmark(610, y2)
    s += caption(610, y2 + 40, 'onError', '#C2354F', 12, mono=True)
    s += done_bar(830, y2)
    s += caption(830, y2 + 40, 'onDone', '#556074', 12, mono=True)
    s += legend(236, 384, 'indigo', 'un valor')
    s += legend(356, 384, 'rose', 'un error')
    s += legend(476, 384, 'slate', 'se cerró: no llega nada más')
    return s + tail(h + 6, 'Un error no cierra el stream: después del error todavía llegó el 4.')


FIGS['rtFutureStream'] = rt_future_stream


def rt_map():
    fid, h = 'rtMap', 420
    s = head(fid, h, '<tspan class="mono">map</tspan> transforma cada valor y devuelve otro Stream',
             'map transforma cada valor y devuelve otro Stream',
             'El stream de arriba sigue emitiendo igual. El de abajo emite lo mismo, pero ya transformado.',
             'Arriba, un Stream que emite 1, 2 y 3. En el medio, una caja con el código map de x a x por 10. '
             'Abajo, el Stream que devuelve map: emite 10, 20 y 30, en los mismos instantes que el de arriba. '
             'Una flecha baja de cada valor de arriba a su valor transformado.',
             colors=('teal',))
    y1, y2, x0, x1 = 150, 330, 236, 900
    s += caption(48, y1, 'numbers', '#4453C9', 15, 'start', weight=700, mono=True)
    s += axis(x0, x1, y1)
    s += f'  <rect x="236" y="214" width="664" height="52" rx="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.75"/>\n'
    s += caption(568, 240, 'numbers.map((x) =&gt; x * 10)', '#0F8478', 15, weight=700, mono=True)
    s += caption(48, 240, 'el operador', '#79809A', 12.5, 'start')
    s += caption(48, y2, 'tens', '#0F8478', 15, 'start', weight=700, mono=True)
    s += axis(x0, x1, y2)
    for cx, a, b in ((340, '1', '10'), (520, '2', '20'), (720, '3', '30')):
        s += marble(cx, y1, 'indigo', a)
        s += f'  <path class="ar-teal" d="M{cx},{y1+20} V{208}"/>\n'
        s += f'  <path class="ar-teal" d="M{cx},{272} V{y2-24}"/>\n'
        s += marble(cx, y2, 'teal', b, r=19)
    return s + tail(h, 'En el chat, cada valor es la lista de filas de la tabla, y map la convierte en una lista de Message.')


FIGS['rtMap'] = rt_map


CONSOLE = ['llegó 1', 'llegó 2', 'falló Exception: sin red', 'llegó 3', 'se cerró']


def rt_listen_result():
    o = ''
    colors = ['#4453C9', '#4453C9', '#C2354F', '#4453C9', '#556074']
    for i, (line, c) in enumerate(zip(CONSOLE, colors)):
        o += f'<text class="mono" x="28" y="{34 + i*26}" dy="0.35em" font-size="13" fill="{c}">{line}</text>'
    o += '<path d="M16,172 H344" stroke="#E4E7EE" stroke-width="1.25"/>'
    o += ('<text x="28" y="198" dy="0.35em" font-size="12.5" fill="#79809A">después de cancel(), lo que se emita</text>'
          '<text x="28" y="216" dy="0.35em" font-size="12.5" fill="#79809A">ya no llega a esta suscripción</text>')
    return o


FIGS['rtListen'] = lambda: frame(dict(
    id='rtListen',
    title='Las partes de <tspan class="mono">listen</tspan>',
    title_plain='Las partes de listen',
    desc='Código a la izquierda: final subscription igual a numbers.listen, con una función para cada valor, onError para '
         'los errores y onDone para el cierre; abajo, await subscription.cancel. A la derecha, la consola: llegó 1, llegó 2, '
         'falló Exception sin red, llegó 3 y se cerró. Una flecha une cada función con las líneas que imprime.',
    sub='listen recibe una función por tipo de evento y devuelve la suscripción, que es lo que se cancela.',
    file='main.dart',
    code=[
        'final subscription = numbers.listen(',
        "  (value) => print('llegó $value'),",
        "  onError: (e) => print('falló $e'),",
        "  onDone: () => print('se cerró'),",
        ');',
        '',
        'await subscription.cancel();',
    ],
    panel='CONSOLA',
    result=rt_listen_result(),
    min_h=270,
    arrows=[
        dict(line=1, find='(value)', to=(20, 34), color='indigo', lane=0),
        dict(line=2, find='onError', to=(20, 86), color='rose', lane=1),
        dict(line=3, find='onDone', to=(20, 138), color='teal', lane=2),
        dict(line=6, find='cancel()', to=(20, 198), color='amber', lane=3),
    ],
    cards=[
        ('indigo', '(value) => …', ['Corre una vez', 'por cada valor.']),
        ('rose', 'onError', ['Un error no', 'cierra el stream.']),
        ('teal', 'onDone', ['Corre cuando el', 'productor cierra.']),
        ('amber', 'cancel()', ['Deja de escuchar.', 'Lo llama el oyente.']),
    ],
))


# ───────────────────────── 0094 · El Stream viaja por las capas ─────────────────────────

LAYERS = [
    ('violet', 'ChatScreen', 'BlocBuilder', 'solo ve estados'),
    ('indigo', 'ChatBloc', 'stream.listen(…)', 'el único que escucha'),
    ('green', 'UseCase', '.asyncMap(…)', 'retorna el Stream'),
    ('teal', 'RepositoryImpl', 'return …', 'retorna el Stream'),
    ('teal', 'DataSource', '.stream().map(…)', 'crea el Stream'),
    ('slate', 'Supabase', 'websocket', 'empuja cada cambio'),
]


def rt_capas():
    fid, h = 'rtCapas', 520
    s = head(fid, h, 'Todas las capas retornan el Stream. Solo el Bloc lo escucha.',
             'Todas las capas retornan el Stream. Solo el Bloc lo escucha.',
             'Las llamadas bajan hacia Supabase una sola vez. Los mensajes suben por la tubería todas las veces que haya cambios.',
             'Seis columnas de izquierda a derecha: ChatScreen, ChatBloc, UseCase, RepositoryImpl, DataSource y Supabase. '
             'Arriba, una fila de flechas que van hacia la derecha: la llamada watch baja una sola vez. En el medio, una tubería '
             'verde azulada que nace en Supabase y llega hasta ChatBloc: es el Stream que cada capa retorna. En ChatBloc la '
             'tubería termina en un listen, y de ahí sale una flecha emit hacia ChatScreen. Debajo de cada columna, la línea '
             'de código que le toca a esa capa.',
             colors=('indigo', 'teal', 'violet'))
    w, gap, x0, yb = 128, 19.2, 48, 112
    xs = [x0 + i * (w + gap) for i in range(6)]
    cx = [x + w / 2 for x in xs]
    for i, (color, name, code, role) in enumerate(LAYERS):
        soft, border, strong = FAM[color]
        x = xs[i]
        s += f'  <rect x="{x:.1f}" y="{yb}" width="{w}" height="330" rx="12" fill="{soft}" stroke="{border}" stroke-width="1.5" opacity=".55"/>\n'
        s += caption(cx[i], yb + 22, name, strong, 13.5, weight=700, mono=True, fit=w - 12)
        s += caption(cx[i], yb + 302, code, strong, 11.5, mono=True, fit=w - 12)
        s += caption(cx[i], yb + 320, role, '#454C61', 11.5, fit=w - 12)
    calls = ['add(ChatStarted)', 'call(limit: 15)', 'watchLatest()', 'watchLatest()', '.stream()']
    for i, label in enumerate(calls):
        s += f'  <path class="ar-indigo" d="M{cx[i]+18:.1f},184 H{cx[i+1]-18:.1f}"/>\n'
        s += caption((cx[i] + cx[i + 1]) / 2, 170, label, '#4453C9', 11, mono=True, fit=w + 6)
    s += caption(480, 210, '1 · la llamada baja una sola vez, al abrir el chat', '#4453C9', 12.5, weight=700, fit=600)
    py = 278
    s += f'  <path d="M{cx[5]:.1f},{py} H{cx[1]:.1f}" stroke="#E3F6F3" stroke-width="22" stroke-linecap="round"/>\n'
    s += f'  <path class="ar-teal" d="M{cx[5]-6:.1f},{py} H{cx[1]+30:.1f}"/>\n'
    for i, label in ((4, 'List&lt;Map&gt;'), (3, 'List&lt;Message&gt;'), (2, 'List&lt;Message&gt;'), (1, 'List&lt;Message&gt;')):
        s += caption((cx[i] + cx[i + 1]) / 2, py - 24, label, '#0F8478', 11, mono=True, fit=w + 6)
    s += f'  <circle cx="{cx[1]:.1f}" cy="{py}" r="26" fill="#FFFFFF" stroke="#4453C9" stroke-width="2.5"/>\n'
    s += caption(cx[1], py, 'listen', '#4453C9', 12, weight=700, mono=True)
    s += caption(cx[1], py + 40, 'cancel() en close()', '#4453C9', 11, mono=True, fit=w)
    s += caption(560, py + 40, '2 · cada cambio sube por la tubería que quedó armada', '#0F8478', 12.5, weight=700, fit=500)
    s += f'  <path class="ar-violet" d="M{cx[1]-14:.1f},372 H{cx[0]+14:.1f}"/>\n'
    s += caption((cx[0] + cx[1]) / 2, 358, 'emit(state)', '#7439B8', 11.5, weight=700, mono=True)
    s += caption(xs[2] + 8, 372, '3 · la pantalla solo ve estados, nunca el Stream', '#7439B8', 12.5, 'start', weight=700, fit=560)
    return s + tail(h, 'Si alguien más hiciera listen en el camino, el Bloc ya no sería el único dueño de la suscripción, ni quien la cancela.')


FIGS['rtCapas'] = rt_capas


# ───────────────────────── 0062 · Supabase Realtime ─────────────────────────

def rt_anatomia_result():
    o = ('<text class="h" x="20" y="22" dy="0.35em">messages · lo que llega</text>'
         '<rect x="16" y="40" width="328" height="30" rx="6" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>')
    rows = [('m18', "'nos vemos'", '10:42'), ('m17', "'listo'", '10:41'), ('m16', "'¿y tú?'", '10:40'), ('m15', "'hola'", '10:38')]
    for i, (rid, text, t) in enumerate(rows):
        y = 55 + i * 30
        o += (f'<text class="mono" x="28" y="{y}" dy="0.35em" font-size="12.5" font-weight="700" fill="#7439B8">{rid}</text>'
              f'<text class="mono" x="80" y="{y}" dy="0.35em" font-size="12.5" fill="#161A26">{text}</text>'
              f'<text class="mono" x="330" y="{y}" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">{t}</text>')
        if i:
            o += f'<path d="M16,{y-15} H344" stroke="#E4E7EE" stroke-width="1"/>'
    o += '<text x="28" y="182" dy="0.35em" font-size="12" fill="#79809A">… hasta 15 filas, la más nueva arriba</text>'
    o += ('<rect x="16" y="208" width="200" height="30" rx="15" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/>'
          '<text class="mono" x="116" y="223" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9">'
          'List&lt;Message&gt;</text>')
    return o


FIGS['rtStreamAnatomia'] = lambda: frame(dict(
    id='rtStreamAnatomia',
    title='Las partes de <tspan class="mono">.stream()</tspan>',
    title_plain='Las partes de .stream()',
    desc='Código a la izquierda: client.from messages, punto stream con primaryKey id, punto order por created_at '
         'descendente, punto limit 15 y punto map a Message. A la derecha, lo que llega: las filas de messages con la más '
         'nueva arriba, hasta quince, convertidas en una List de Message.',
    sub='Se escribe casi como un select, pero no se espera con await: se retorna, y emite cada vez que la tabla cambia.',
    file='supabase_message_data_source.dart',
    code=[
        'return _client',
        "    .from('messages')",
        "    .stream(primaryKey: ['id'])",
        "    .order('created_at', ascending: false)",
        '    .limit(15)',
        '    .map((rows) => rows.map(_toMessage).toList());',
    ],
    panel='CADA EMISIÓN',
    result=rt_anatomia_result(),
    min_h=290,
    arrows=[
        dict(line=1, find="'messages'", to=(20, 22), color='violet', lane=0),
        dict(line=2, find="primaryKey: ['id']", to=(24, 85), color='teal', lane=1),
        dict(line=3, find='ascending: false', to=(24, 55), color='amber', lane=2),
        dict(line=4, find='limit(15)', to=(24, 182), color='amber', lane=3),
        dict(line=5, find='map', to=(16, 223), color='indigo', end='v'),
    ],
    cards=[
        ('teal', 'stream(primaryKey)', ['No es consulta: es suscripción.', 'El id identifica cada fila.']),
        ('amber', 'order + limit', ['Se aplican en cada emisión:', 'siempre las 15 más nuevas.']),
        ('indigo', 'map', ['Cada emisión trae filas.', 'El data source da Message.']),
    ],
))


def mini_list(x, y, w, items, new=None, title=''):
    """Una emisión del stream: la lista completa, con la fila nueva resaltada."""
    rh = 24
    o = f'  <rect x="{x}" y="{y}" width="{w}" height="{rh*len(items)+12}" rx="10" fill="#FFFFFF" stroke="#86D3CA" stroke-width="1.75"/>\n'
    for i, it in enumerate(items):
        cy = y + 6 + rh * i + rh / 2
        if it == new:
            o += f'  <rect x="{x+5}" y="{cy-rh/2+2:.0f}" width="{w-10}" height="{rh-4}" rx="5" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>\n'
        o += caption(x + 12, cy, it, '#161A26', 12, 'start', mono=True, fit=w - 20)
    if title:
        o += caption(x + w / 2, y + rh * len(items) + 32, title, '#0F8478', 12, weight=700, fit=w + 30)
    return o


def rt_foto_cambios():
    fid, h = 'rtFotoCambios', 470
    s = head(fid, h, 'Primero la foto completa. Después, la lista otra vez con cada cambio.',
             'Primero la foto completa. Después, la lista otra vez con cada cambio.',
             'Cada emisión del stream trae todas las filas que cumplen order y limit, no solo la nueva.',
             'Arriba, una línea de tiempo con tres momentos: abrir el chat, Ana inserta hola y tú insertas qué tal. Debajo de '
             'cada momento, la lista que emite el stream. Al abrir: m1, m2 y m3, la foto inicial. Cuando Ana inserta: m4 hola '
             'arriba, más m1, m2 y m3. Cuando tú insertas: m5 qué tal arriba, más las cuatro anteriores. La fila nueva está '
             'resaltada en verde en cada lista.',
             colors=('teal',))
    s += caption(48, 140, 'EN LA TABLA', '#556074', 11, 'start', weight=700)
    s += axis(48, 912, 170)
    moments = [(180, 'abrir el chat', 'listen', None, ['m3', 'm2', 'm1'], 'emisión 1 · la foto inicial'),
               (480, "Ana inserta 'hola'", 'insert', 'm4 hola', ['m4 hola', 'm3', 'm2', 'm1'], 'emisión 2'),
               (780, "tú insertas '¿qué tal?'", 'insert', 'm5 ¿qué tal?', ['m5 ¿qué tal?', 'm4 hola', 'm3', 'm2', 'm1'], 'emisión 3')]
    s += caption(48, 228, 'LO QUE EMITE', '#556074', 11, 'start', weight=700)
    for cx, label, kind, new, items, title in moments:
        color = 'indigo' if kind == 'listen' else 'violet'
        s += f'  <circle cx="{cx}" cy="170" r="8" fill="{FAM[color][0]}" stroke="{FAM[color][2]}" stroke-width="2"/>\n'
        s += caption(cx, 196, label, FAM[color][2], 12.5, weight=700, fit=260)
        s += f'  <path class="ar-teal" d="M{cx},210 V246"/>\n'
        s += mini_list(cx - 80, 252, 160, items, new, title)
    return s + tail(h, 'Por eso el Bloc no agrega el mensaje nuevo a mano: reemplaza o junta con la lista que llegó.')


FIGS['rtFotoCambios'] = rt_foto_cambios


def rt_publicacion():
    fid, h = 'rtPublicacion', 470
    s = head(fid, h, 'Quién avisa del cambio', 'Quién avisa del cambio',
             'Escribir sigue siendo un Future. Enterarse es un Stream, y solo funciona si la tabla está en la publicación.',
             'A la izquierda, tu teléfono; a la derecha, el de Ana. En el centro, Supabase con tres cajas: la tabla messages en '
             'Postgres, la publicación supabase_realtime y el servidor Realtime. Tu teléfono manda un insert a la tabla, que es un '
             'Future por HTTP. La tabla avisa a la publicación, la publicación al servidor Realtime, y Realtime empuja la lista '
             'por un websocket a los dos teléfonos, el tuyo incluido.',
             colors=('amber', 'teal', 'violet'))
    s += phone(48, 120, 170, 290, 'Tú')
    s += phone(742, 120, 170, 290, 'Ana')
    for px, mine_first in ((48, True), (742, False)):
        b1, _ = bubble(px + 12, 182, 146, 'hola', not mine_first)
        b2, _ = bubble(px + 12, 222, 146, '¿qué tal?', mine_first)
        s += b1 + b2
    s += f'  <rect x="296" y="112" width="368" height="306" rx="14" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>\n'
    s += caption(314, 132, 'SUPABASE', '#556074', 11, 'start', weight=700)
    boxes = [(160, 'violet', 'tabla messages', 'Postgres'), (250, 'amber', 'publicación supabase_realtime', 'qué tablas se transmiten'),
             (340, 'teal', 'Realtime', 'servidor de websockets')]
    for y, color, name, sub in boxes:
        soft, border, strong = FAM[color]
        s += f'  <rect x="336" y="{y}" width="288" height="56" rx="10" fill="{soft}" stroke="{border}" stroke-width="1.5"/>\n'
        s += caption(480, y + 20, name, strong, 13, weight=700, mono=True, fit=270)
        s += caption(480, y + 40, sub, '#454C61', 11.5, fit=270)
    s += '  <path class="link" d="M480,216 V246"/>\n  <path class="link" d="M480,306 V336"/>\n'
    s += '  <path class="ar-amber" d="M218,232 C260,232 270,188 332,188"/>\n'
    s += caption(258, 168, 'insert', '#A96C05', 12, weight=700, mono=True)
    s += caption(258, 252, 'Future · HTTP', '#A96C05', 11.5)
    s += '  <path class="ar-teal" d="M336,372 C290,372 270,330 222,330"/>\n'
    s += '  <path class="ar-teal" d="M624,372 C670,372 690,330 738,330"/>\n'
    for x in (258, 702):
        s += caption(x, 394, 'Stream', '#0F8478', 11.5, weight=700)
        s += caption(x, 410, 'websocket', '#0F8478', 11.5)
    return s + tail(h, 'Tu propio mensaje también llega por el stream: la app no lo agrega a la lista cuando lo envía.')


FIGS['rtPublicacion'] = rt_publicacion


# ───────────────────────── 0065 · Laboratorio 8 ─────────────────────────

def rt_lab_pantalla():
    fid, h = 'rtLabPantalla', 600
    s = head(fid, h, 'Lo que vas a construir', 'Lo que vas a construir',
             'La misma sala vista desde dos cuentas. Lo de cada quien va a la derecha, en verde.',
             'Dos teléfonos con la pantalla Chat, uno con la cuenta de Ana y otro con la tuya, mostrando la misma conversación. '
             'En el de Ana, sus mensajes van a la derecha en verde y los tuyos a la izquierda en blanco. En el tuyo, al revés. '
             'Uno de los mensajes trae una foto. Abajo de cada teléfono, la barra para escribir, con el botón de foto y el de '
             'enviar. A los lados, notas: al llegar arriba se piden los cinco anteriores, y al llegar un mensaje nuevo la lista '
             'baja sola.',
             colors=('violet', 'amber'))
    convo = [('hola', 'ana', False), ('¡hola! ¿cómo vas?', 'me', False), ('mira el tablero', 'ana', True), ('jaja, listo', 'me', False)]
    for px, who, title in ((292, 'ana', 'Chat · Ana'), (522, 'me', 'Chat · tú')):
        s += phone(px, 112, 196, 420, title)
        y = 168
        for text, author, ph in convo:
            b, bh = bubble(px + 12, y, 172, text, author == who, photo=ph)
            s += b
            y += bh + 10
        s += f'  <path d="M{px+2},{482} H{px+194}" stroke="#D9DEE8" stroke-width="1.5"/>\n'
        s += f'  <rect x="{px+38}" y="{492}" width="116" height="28" rx="14" fill="#F7F8FA" stroke="#DDE1E8" stroke-width="1.25"/>\n'
        s += caption(px + 48, 506, 'Escribe un mensaje', '#79809A', 10, 'start', fit=100)
        s += f'  <rect x="{px+12}" y="{496}" width="20" height="20" rx="4" fill="none" stroke="#556074" stroke-width="1.75"/>\n'
        s += f'  <circle cx="{px+174}" cy="{506}" r="14" fill="#1F9D68"/><path d="M{px+168},{500} L{px+182},{506} L{px+168},{512} Z" fill="#FFFFFF"/>\n'
    s += note(48, 128, 214, 'amber', 'Al llegar arriba', ['OlderMessagesRequested:', 'los 5 anteriores, por Future.', 'Parte 2.'])
    s += '  <path class="ar-amber" d="M262,160 C278,160 280,176 296,176"/>\n'
    s += note(48, 300, 214, 'violet', 'La foto', ['Una sola por mensaje y', 'opcional. Bucket privado.', 'Parte 3.'])
    s += '  <path class="ar-violet" d="M262,330 C320,330 330,300 350,296"/>\n'
    s += note(742, 128, 170, 'green', 'Lo mío', ['isMine: a la derecha,', 'en verde.'])
    s += note(742, 300, 170, 'slate', 'Mensaje nuevo', ['La lista baja sola', 'hasta el final.', 'Ya viene hecho.'])
    return s + tail(h, 'Nadie agrega su mensaje a la lista al enviarlo: aparece porque el stream lo trae, en los dos teléfonos.')


FIGS['rtLabPantalla'] = rt_lab_pantalla


def chip(x, y, n, color='amber'):
    soft, border, strong = FAM[color]
    return (f'<circle cx="{x}" cy="{y}" r="12" fill="{soft}" stroke="{border}" stroke-width="1.5"/>'
            f'<text x="{x}" y="{y}" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="{strong}">{n}</text>\n')


def rt_lab_carpetas():
    fid = 'rtLabCarpetas'
    rows = [
        (0, 'lib/features/chat/', 'slate', '', ''),
        (1, 'domain/entities/message.dart', 'slate', 'Ya viene: isMine, imagePath, imageUrl', ''),
        (1, 'domain/repository/message_repository.dart', 'slate', 'Ya viene: el contrato completo', ''),
        (1, 'domain/usecases/', 'slate', '', ''),
        (2, 'watch_messages_usecase.dart', 'amber', 'call · retorna el Stream', '1 · 3'),
        (2, 'send_message_usecase.dart', 'amber', 'call · inserta', '1 · 3'),
        (2, 'load_older_messages_usecase.dart', 'amber', 'call · Future', '2 · 3'),
        (2, 'pick_chat_image_usecase.dart', 'amber', 'call · abre la galería', '3'),
        (1, 'data/source/', 'slate', '', ''),
        (2, 'supabase_message_data_source.dart', 'teal', 'watchLatest, send, fetchBefore', '1 · 2'),
        (2, 'supabase_chat_image_data_source.dart', 'teal', 'upload, signedUrl', '3'),
        (1, 'data/repository/message_repository_impl.dart', 'teal', 'los seis métodos, delegando', '1 · 2 · 3'),
        (1, 'ui/bloc/chat_event.dart · chat_state.dart', 'slate', 'Ya vienen: eventos y ChatState', ''),
        (1, 'ui/bloc/chat_bloc.dart', 'indigo', 'los on solo imprimen', '1 · 2 · 3'),
        (1, 'ui/screens/chat_screen.dart', 'slate', 'Ya viene: lista, scroll y SnackBar', ''),
        (1, 'ui/components/', 'slate', 'Ya vienen: burbuja y composer', ''),
    ]
    y0, rh = 112, 34
    h = y0 + rh * len(rows) + 64
    s = head(fid, h, 'La estructura de carpetas', 'La estructura de carpetas',
             'En gris lo que ya viene hecho. Con número, la parte del laboratorio en la que lo completas.',
             'Árbol de carpetas de la feature chat del proyecto 262App5. Ya vienen la entidad Message, el contrato '
             'MessageRepository, los eventos, el estado, ChatScreen y los componentes. Te tocan los cuatro casos de uso, los dos '
             'data sources, MessageRepositoryImpl y ChatBloc, marcados con la parte del laboratorio en que se completan: 1 el '
             'chat en tiempo real, 2 la paginación y 3 la imagen.')
    s += f'  <rect x="48" y="96" width="864" height="{rh*len(rows)+20}" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>\n'
    last = {}
    for i, (lvl, name, color, text, step) in enumerate(rows):
        soft, border, strong = FAM[color]
        y = y0 + i * rh + 12
        x = 68 + lvl * 24
        if lvl:
            s += f'  <path d="M{x-14},{last[lvl-1]+13} V{y} H{x-3}" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>\n'
        last[lvl] = y
        w = min(len(name) * 7.5 + 20, 552 - x)
        s += f'  <rect x="{x}" y="{y-13}" width="{w:.0f}" height="26" rx="{8 if name.endswith("/") else 4}" fill="{soft}" stroke="{border}" stroke-width="1.5"/>\n'
        s += f'  <text class="mono" x="{x+10}" y="{y}" dy="0.35em" font-size="12.5" font-weight="600" fill="{strong}" data-fit="{w-14:.0f}">{name}</text>\n'
        if text:
            s += f'  <text x="568" y="{y}" dy="0.35em" font-size="13" fill="#454C61" data-fit="250">{text}</text>\n'
        if step:
            s += ('  ' + chip(886, y, step)) if len(step) == 1 else badge(900 - (len(step) * 7.4 + 16), y, 'amber', step)
    s += '  <text class="h" x="898" y="88" text-anchor="end">PARTE</text>\n'
    return s + tail(h, 'main.dart e injection_container.dart ya registran todo lo del chat: no hay que tocarlos.')


FIGS['rtLabCarpetas'] = rt_lab_carpetas


def stack(x, y, w, n, color, label, h=22, gap=4):
    soft, border, strong = FAM[color]
    o = ''
    for i in range(n):
        o += f'  <rect x="{x}" y="{y + i*(h+gap)}" width="{w}" height="{h}" rx="6" fill="{soft}" stroke="{border}" stroke-width="1.25"/>\n'
    o += caption(x + w / 2, y + n * (h + gap) / 2 - gap / 2, label, strong, 12, weight=700, fit=w - 12)
    return o, n * (h + gap)


def rt_lab_ventana():
    fid, h = 'rtLabVentana', 600
    s = head(fid, h, 'Una ventana en vivo y páginas hacia atrás', 'Una ventana en vivo y páginas hacia atrás',
             'El stream cuida los 15 más nuevos. Lo anterior llega por Future, de 5 en 5, y se queda en el mismo estado.',
             'A la izquierda, la lista del chat de arriba abajo: dos páginas de cinco mensajes en ámbar, que llegaron por Future '
             'al llegar arriba, y debajo quince en verde azulado, que trae el stream. Una flecha arriba dice '
             'OlderMessagesRequested y fetchBefore con el más viejo y limit 5. A la derecha, dos columnas comparan qué pasa '
             'cuando llega un mensaje nuevo: si MessagesUpdated reemplaza la lista, las páginas viejas desaparecen; si junta '
             'por id, se quedan.',
             colors=('amber', 'teal'))
    x, w = 120, 220
    s += caption(x + w / 2, 124, 'ChatState.messages', '#161A26', 13, weight=700, mono=True)
    y = 144
    p2, dy = stack(x, y, w, 3, 'amber', 'página 2 · Future', h=18)
    s += p2
    y += dy + 6
    p1, dy = stack(x, y, w, 5, 'amber', 'página 1 · Future · 5', h=18)
    s += p1
    y += dy + 6
    live, dy = stack(x, y, w, 6, 'teal', 'en vivo · Stream · 15', h=18)
    s += live
    s += caption(x + w / 2, y + dy + 12, 'el más nuevo, abajo', '#79809A', 11.5)
    s += f'  <path class="ar-amber" d="M{x-20},{y-4} V150"/>\n'
    s += caption(x - 32, 300, 'llegar arriba', '#A96C05', 12, 'end', fit=70)
    s += caption(x - 32, 318, 'Parte 2', '#A96C05', 11.5, 'end')
    s += code_bar(x, y + dy + 34, 300, 'fetchBefore(oldest, limit: 5)', fit=272)
    cols = [(470, 'rose', 'Reemplazar', 'messages: event.messages', ['las páginas viejas', 'se pierden'], False),
            (700, 'green', 'Juntar por id', '_merge(state.messages, …)', ['las páginas se quedan', 'y no hay repetidos'], True)]
    s += caption(630, 124, 'LLEGA UN MENSAJE NUEVO', '#556074', 11, weight=700)
    for cx, color, title, code, lines, keep in cols:
        soft, border, strong = FAM[color]
        s += caption(cx + 90, 156, title, strong, 14, weight=700)
        s += caption(cx + 90, 178, code, '#454C61', 11.5, mono=True, fit=210)
        yy = 200
        if keep:
            a, d = stack(cx + 20, yy, 140, 4, 'amber', 'páginas', h=16)
            s += a
            yy += d + 6
        b, d = stack(cx + 20, yy, 140, 6, 'teal', 'los 15 en vivo', h=16)
        s += b
        yy += d + 18
        for i, ln in enumerate(lines):
            s += caption(cx + 90, yy + i * 18, ln, strong, 12.5, weight=700 if i == 0 else 400)
    return s + tail(h, 'Con limit, el stream suelta los mensajes más viejos de su ventana: si el Bloc reemplaza, se van de la pantalla.')


FIGS['rtLabVentana'] = rt_lab_ventana


def rt_lab_foto():
    fid, h = 'rtLabFoto', 430
    s = head(fid, h, 'El camino de una foto en el chat', 'El camino de una foto en el chat',
             'La fila guarda el path. La URL firmada se pide al leer, en el caso de uso, y el repositorio la recuerda.',
             'Dos filas de cajas. Arriba, al enviar: MessageComposer con la foto, SendMessageUseCase que primero sube al bucket '
             'privado chat-images y recibe un path, y luego inserta la fila en messages con image_path. Abajo, al leer: el '
             'stream trae la fila con image_path, WatchMessagesUseCase con asyncMap pide imageUrl, el repositorio firma con '
             'createSignedUrl y guarda la URL, y MessageBubble muestra la foto.',
             colors=('amber', 'teal', 'violet'))

    def row(y, items, color):
        o = ''
        w, gap = 196, 26
        for i, (name, sub, c) in enumerate(items):
            soft, border, strong = FAM[c]
            x = 48 + i * (w + gap)
            o += f'  <rect x="{x}" y="{y}" width="{w}" height="66" rx="10" fill="{soft}" stroke="{border}" stroke-width="1.5"/>\n'
            o += caption(x + w / 2, y + 24, name, strong, 12.5, weight=700, mono=True, fit=w - 14)
            o += caption(x + w / 2, y + 46, sub, '#454C61', 11.5, fit=w - 14)
            if i:
                o += f'  <path class="ar-{color}" d="M{x-gap+3},{y+33} H{x-3}"/>\n'
        return o
    s += caption(48, 124, 'AL ENVIAR · PARTE 3', '#A96C05', 11, 'start', weight=700)
    s += row(140, [('MessageComposer', 'state.photo', 'violet'), ('SendMessageUseCase', 'uploadImage primero', 'amber'),
                   ('chat-images', 'bucket privado · path', 'teal'), ('messages', 'insert con image_path', 'violet')], 'amber')
    s += caption(48, 256, 'AL LEER', '#0F8478', 11, 'start', weight=700)
    s += row(272, [('stream', 'fila con image_path', 'teal'), ('WatchMessagesUseCase', 'asyncMap · imageUrl', 'amber'),
                   ('MessageRepositoryImpl', 'createSignedUrl · lo guarda', 'teal'), ('MessageBubble', 'Image.network(url)', 'violet')], 'teal')
    s += caption(480, 372, 'Sin el mapa de URLs, cada emisión firmaría de nuevo todas las fotos y cada imagen se descargaría otra vez.', '#454C61', 12.5, fit=860)
    return s + tail(h, 'La URL firmada vence en una hora: es la duración que se le pide a createSignedUrl.')


FIGS['rtLabFoto'] = rt_lab_foto


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
