"""Figuras SVG de la sección Database: «Escribir en la base de datos» (0059),
«Leer de la base de datos» (0060) y «Laboratorio 6 · Muro» (0061).

    python3 tools/database_figuras.py <carpeta>     escribe un .svg por figura, para revisarlas
    python3 tools/database_figuras.py --inject      reemplaza cada bloque ```svg de las tres lecciones
                                                    por la figura con el mismo id

No editar los SVG dentro del Markdown: se cambia este script y se vuelve a inyectar.
Colores: la base de datos en índigo, lo que pone Postgres en verde, lo que cambia en ámbar,
lo que se borra en rosa, los filtros en ámbar y los modificadores en violeta.
"""

import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from bloc_figuras import FAM, chip, head, note, phone, tail  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
LESSONS = ['lessonH3.md', 'lessonH7.md', 'lessonH8.md']
FIGS = {}
UID = '3f2a9c1e…'


def table(x, y, w, color, name, rows, vx=None, rh=34, who=''):
    """rows: (columna, valor o tipo, insignia, tono de la fila). Devuelve (svg, centros de fila)."""
    soft, border, strong = FAM[color]
    hh = 40
    vx = vx if vx is not None else w // 2
    o = f'  <rect x="{x}" y="{y}" width="{w}" height="{hh + rh*len(rows)}" rx="12" fill="#FFFFFF" stroke="{border}" stroke-width="2"/>\n'
    o += (f'  <path d="M{x},{y+hh} V{y+12} A12,12 0 0 1 {x+12},{y} H{x+w-12} A12,12 0 0 1 {x+w},{y+12} V{y+hh} Z" '
          f'fill="{soft}" stroke="{border}" stroke-width="2"/>\n')
    o += f'  <text class="mono" x="{x+14}" y="{y+hh/2:.0f}" dy="0.35em" font-size="14" font-weight="700" fill="{strong}">{name}</text>\n'
    if who:
        o += f'  <text x="{x+w-14}" y="{y+hh/2:.0f}" dy="0.35em" text-anchor="end" font-size="11.5" fill="#454C61" data-fit="{w//2}">{who}</text>\n'
    centers = []
    for i, (col, val, badge, tone) in enumerate(rows):
        cy = y + hh + rh * i + rh / 2
        centers.append(cy)
        if tone:
            ts, tb, _ = FAM[tone]
            o += f'  <rect x="{x+5}" y="{cy-rh/2+4:.0f}" width="{w-10}" height="{rh-8}" rx="6" fill="{ts}" stroke="{tb}" stroke-width="1.25"/>\n'
        elif i:
            o += f'  <path d="M{x+1},{cy-rh/2:.0f} H{x+w-1}" stroke="#E4E7EE" stroke-width="1.25"/>\n'
        o += f'  <text class="mono" x="{x+14}" y="{cy:.0f}" dy="0.35em" font-size="12.5" font-weight="{700 if badge else 400}" fill="#161A26">{col}</text>\n'
        if val:
            tcol = FAM[tone][2] if tone else '#79809A'
            o += f'  <text class="mono" x="{x+vx}" y="{cy:.0f}" dy="0.35em" font-size="12" fill="{tcol}" data-fit="{w-vx-12-(len(badge)*7+20 if badge else 0)}">{val}</text>\n'
        if badge:
            bw = len(badge) * 7 + 14
            o += f'  <rect x="{x+w-12-bw}" y="{cy-10:.0f}" width="{bw}" height="20" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>\n'
            o += f'  <text x="{x+w-12-bw/2:.0f}" y="{cy:.0f}" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#A96C05">{badge}</text>\n'
    return o, centers


def legend(x, y, color, text):
    soft, border, _ = FAM[color]
    return (f'  <rect x="{x}" y="{y-8}" width="16" height="16" rx="4" fill="{soft}" stroke="{border}" stroke-width="1.25"/>'
            f'<text x="{x+24}" y="{y}" dy="0.35em" font-size="12.5" fill="#454C61">{text}</text>\n')


# ───────────────────────── 0059 · Escribir ─────────────────────────

def db_posts():
    fid, h = 'dbPosts', 492
    s = head(fid, h, 'La tabla <tspan class="mono">posts</tspan>', 'La tabla posts',
             'Cada post apunta al perfil de quien lo escribió, y ese perfil a su cuenta de Auth.',
             'Tres tablas encadenadas. auth.users tiene id y email. profiles tiene id, username y full_name, y su id referencia a '
             'auth.users. posts tiene id, profile_id, content y created_at; su profile_id referencia al id de profiles. El id y el '
             'created_at de posts los pone la base de datos; profile_id y content los manda la app.',
             colors=('indigo',))
    t1, c1 = table(48, 112, 240, 'slate', 'auth.users', [
        ('id', UID, 'PK', None), ('email', 'ana@icesi…', '', None)], vx=92)
    t2, c2 = table(336, 112, 240, 'indigo', 'profiles', [
        ('id', UID, 'PK', None), ('username', 'ana.dev', '', None), ('full_name', 'Ana Gómez', '', None)], vx=104)
    t3, c3 = table(624, 112, 288, 'indigo', 'posts', [
        ('id', '9b1e04d7…', 'PK', 'green'), ('profile_id', UID, 'FK', 'indigo'),
        ('content', "'Mi primer post'", '', 'indigo'), ('created_at', '2026-10-18 10:05', '', 'green')], vx=112)
    s += t1 + t2 + t3
    s += f'  <path class="link" d="M336,{c2[0]:.0f} H290"/>\n'
    s += f'  <path class="ar-indigo" d="M624,{c3[1]:.0f} H600 V{c2[0]:.0f} H578"/>\n'
    s += legend(624, 316, 'green', 'Los pone la base de datos')
    s += legend(624, 342, 'indigo', 'Los mandas tú en el insert')
    s += '  ' + note(48, 316, 528, 'slate', 'on delete cascade', [
        'Si se borra la cuenta, se borra su perfil, y con el perfil, sus posts.',
        'Nunca queda un post sin autor.'])
    s += '  ' + note(624, 366, 288, 'green', 'default', ['gen_random_uuid() para el id,', 'now() para la fecha.'])
    return s + tail(h, 'El check de content rechaza cualquier texto de más de 280 caracteres, venga de donde venga.')


FIGS['dbPosts'] = db_posts


def db_escrituras():
    fid, h = 'dbEscrituras', 464
    s = head(fid, h, 'Cinco formas de escribir', 'Cinco formas de escribir',
             'La misma tabla después de cada operación. Lo resaltado es lo que cambió.',
             'Cinco columnas con la misma tabla de posts. insert agrega una fila nueva. insert con una lista agrega tres filas en '
             'una sola petición. upsert actualiza la fila si su llave ya existe, o la crea si no. update con eq cambia el contenido de '
             'la fila filtrada. delete con eq borra la fila filtrada.')
    base = [('p1', 'Hola mundo'), ('p2', 'Hoy hay clase')]
    cols = [
        ('insert({…})', 'Una fila nueva.', 'Devuelve nada, o la fila', 'con .select().single().',
         base + [('p3', 'Mi primer post', 'green')]),
        ('insert([…])', 'Varias filas a la vez.', 'Si una falla,', 'no entra ninguna.',
         base + [('p3', 'Post 1', 'green'), ('p4', 'Post 2', 'green'), ('p5', 'Post 3', 'green')]),
        ('upsert({…})', 'Si la llave existe,', 'actualiza. Si no,', 'la crea.',
         [('p1', 'Hola mundo'), ('p2', 'Hoy no hay clase', 'amber')]),
        ('update({…}).eq()', 'Cambia las filas', 'que deja el filtro.', 'Sin filtro, error.',
         [('p1', 'Hola mundo'), ('p2', 'Texto corregido', 'amber')]),
        ('delete().eq()', 'Borra las filas', 'que deja el filtro.', 'Sin filtro, error.',
         [('p1', 'Hola mundo'), ('p2', 'Hoy hay clase', 'rose')]),
    ]
    w, gap, x0 = 164, 11, 48
    for i, (op, l1, l2, l3, rows) in enumerate(cols):
        x = x0 + i * (w + gap)
        s += f'  <rect x="{x}" y="108" width="{w}" height="318" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>\n'
        s += f'  <rect x="{x+10}" y="120" width="{w-20}" height="28" rx="6" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/>\n'
        s += f'  <text class="mono" x="{x+w/2:.0f}" y="134" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#4453C9" data-fit="{w-28}">{op}</text>\n'
        s += f'  <text class="h" x="{x+12}" y="172">POSTS</text>\n'
        for k, row in enumerate(rows):
            rid, text = row[0], row[1]
            tone = row[2] if len(row) > 2 else None
            ry = 182 + k * 30
            soft, border, strong = FAM[tone] if tone else ('#F5F6FA', '#D9DEE8', '#454C61')
            dash = ' stroke-dasharray="4 3"' if tone == 'rose' else ''
            s += f'  <rect x="{x+10}" y="{ry}" width="{w-20}" height="24" rx="5" fill="{soft}" stroke="{border}" stroke-width="1.25"{dash}/>\n'
            s += f'  <text class="mono" x="{x+18}" y="{ry+12}" dy="0.35em" font-size="11.5" font-weight="700" fill="{strong}">{rid}</text>\n'
            deco = ' text-decoration="line-through"' if tone == 'rose' else ''
            s += f'  <text x="{x+44}" y="{ry+12}" dy="0.35em" font-size="11.5" fill="{strong if tone else "#454C61"}"{deco} data-fit="{w-62}">{text}</text>\n'
        for j, line in enumerate((l1, l2, l3)):
            s += f'  <text x="{x+12}" y="{364 + j*18}" font-size="12.5" fill="#454C61" data-fit="{w-24}">{line}</text>\n'
    s += legend(48, 444, 'green', 'nueva')
    s += legend(140, 444, 'amber', 'actualizada')
    s += legend(262, 444, 'rose', 'borrada')
    return s + '</svg>\n'


FIGS['dbEscrituras'] = db_escrituras


# ───────────────────────── 0060 · Leer ─────────────────────────

def db_consulta():
    fid, h = 'dbConsulta', 516
    s = head(fid, h, 'Anatomía de una consulta', 'Anatomía de una consulta',
             'Cada método agrega una parte. Nada viaja a Supabase hasta el await.',
             'Una cadena de cinco piezas: from posts elige la tabla, select elige las columnas, ilike filtra las filas, order y limit '
             'ordenan y recortan, y await envía la consulta y devuelve una lista de mapas. Debajo, el efecto sobre diez filas: el filtro '
             'deja cuatro, el orden las acomoda por fecha y limit 3 se queda con tres.',
             colors=('green',))
    parts = [
        ('slate', "from('posts')", 'TABLA', 'De dónde leer.'),
        ('indigo', "select('…')", 'COLUMNAS', 'Qué columnas traer.'),
        ('amber', ".ilike(…)", 'FILTROS', 'Qué filas sirven.'),
        ('violet', ".order().limit()", 'MODIFICADORES', 'En qué orden y cuántas.'),
        ('green', 'await', 'RESULTADO', 'Una lista de mapas.'),
    ]
    w, gap = 156, 21
    for i, (color, code, label, text) in enumerate(parts):
        soft, border, strong = FAM[color]
        x = 48 + i * (w + gap)
        s += f'  <text class="h" x="{x+w/2:.0f}" y="118" text-anchor="middle" style="fill:{strong}">{label}</text>\n'
        s += f'  <rect x="{x}" y="128" width="{w}" height="44" rx="10" fill="{soft}" stroke="{border}" stroke-width="1.75"/>\n'
        s += f'  <text class="mono" x="{x+w/2:.0f}" y="150" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="{strong}" data-fit="{w-16}">{code}</text>\n'
        s += f'  <text x="{x+w/2:.0f}" y="194" text-anchor="middle" font-size="12.5" fill="#454C61" data-fit="{w-8}">{text}</text>\n'
        if i:
            s += f'  <path class="link" d="M{x-gap+2},150 H{x-2}"/>\n'
    s += '  <path d="M48,222 H912" stroke="#E4E7EE" stroke-width="1.5"/>\n'
    stages = [
        ('10 filas en la tabla', [None] * 10, 'slate'),
        ('ilike deja 4', ['k' if k in (1, 4, 6, 9) else 'x' for k in range(10)], 'amber'),
        ('order: más reciente primero', ['k'] * 4, 'violet'),
        ('limit(3): quedan 3', ['k', 'k', 'k', 'x'], 'green'),
    ]
    sw, sg = 200, 21
    for i, (label, marks, color) in enumerate(stages):
        soft, border, strong = FAM[color]
        x = 48 + i * (sw + sg)
        s += f'  <text x="{x}" y="252" font-size="13" font-weight="700" fill="{strong}" data-fit="{sw}">{label}</text>\n'
        for k, m in enumerate(marks):
            ry = 266 + k * 15
            if m == 'x':
                s += f'  <rect x="{x}" y="{ry}" width="{sw}" height="11" rx="3" fill="none" stroke="#D9DEE8" stroke-width="1" stroke-dasharray="3 3"/>\n'
            else:
                fill = soft if m else '#EFF1F5'
                stroke = border if m else '#C4CBD8'
                s += f'  <rect x="{x}" y="{ry}" width="{sw}" height="11" rx="3" fill="{fill}" stroke="{stroke}" stroke-width="1"/>\n'
        if i:
            s += f'  <path class="link" d="M{x-sg+3},300 H{x-3}"/>\n'
    s += '  ' + note(48, 428, 864, 'slate', 'El orden de la cadena importa', [
        'Primero los filtros y después los modificadores. Sin await solo tienes una consulta a medio armar, no los datos.'])
    return s + '</svg>\n'


FIGS['dbConsulta'] = db_consulta


def db_range():
    fid, h = 'dbRange', 352
    s = head(fid, h, 'Paginar con <tspan class="mono">range</tspan>', 'Paginar con range',
             '25 posts ordenados del más reciente al más antiguo, en páginas de 10. Los dos extremos de range están incluidos.',
             'Una fila de 25 casillas numeradas de 0 a 24. La página 0 es range(0, 9), la página 1 es range(10, 19) y la página 2 es '
             'range(20, 29), que solo encuentra cinco filas: como llegan menos de diez, ya no hay más páginas.')
    n, cw, x0, y = 25, 34.56, 48, 168
    pages = [(0, 9, 'indigo', 'página 0', 'range(0, 9)'), (10, 19, 'teal', 'página 1', 'range(10, 19)'),
             (20, 24, 'amber', 'página 2', 'range(20, 29)')]
    for k in range(n):
        color = next(c for a, b, c, *_ in pages if a <= k <= b)
        soft, border, strong = FAM[color]
        x = x0 + k * cw
        s += f'  <rect x="{x+2:.1f}" y="{y}" width="{cw-4:.1f}" height="44" rx="6" fill="{soft}" stroke="{border}" stroke-width="1.25"/>\n'
        s += f'  <text class="mono" x="{x+cw/2:.1f}" y="{y+22}" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="{strong}">{k}</text>\n'
    for a, b, color, label, code in pages:
        _, border, strong = FAM[color]
        xa, xb = x0 + a * cw + 2, x0 + (b + 1) * cw - 2
        s += f'  <path d="M{xa:.1f},{y-10} V{y-18} H{xb:.1f} V{y-10}" fill="none" stroke="{strong}" stroke-width="1.75"/>\n'
        s += f'  <text x="{(xa+xb)/2:.1f}" y="{y-28}" text-anchor="middle" font-size="12.5" font-weight="700" fill="{strong}">{label}</text>\n'
        s += f'  <text class="mono" x="{(xa+xb)/2:.1f}" y="{y+70}" text-anchor="middle" font-size="12.5" font-weight="700" fill="{strong}">{code}</text>\n'
    xs = x0 + 25 * cw
    s += f'  <text x="{x0 + 22.5*cw:.1f}" y="{y+90}" text-anchor="middle" font-size="12" fill="#A96C05" data-fit="170">llegan 5: no hay más</text>\n'
    s += f'  <path d="M{xs:.1f},{y-4} V{y+48}" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 3"/>\n'
    s += '  ' + note(48, 274, 420, 'indigo', 'Para la página p, con páginas de tamaño size', ['from = p * size · to = from + size - 1'])
    s += '  ' + note(492, 274, 420, 'slate', 'Siempre con order', ['Sin orden fijo, una fila puede salir en dos páginas.'])
    return s + '</svg>\n'


FIGS['dbRange'] = db_range


def db_anidado():
    fid, h = 'dbAnidado', 500
    s = head(fid, h, 'Datos relacionados en una consulta', 'Datos relacionados en una consulta',
             'Supabase sigue la llave foránea de posts a profiles y mete el autor dentro de cada post.',
             'A la izquierda, las tablas posts y profiles, unidas porque posts.profile_id referencia a profiles.id. Arriba, el select '
             'con author:profiles(username, full_name). A la derecha, el resultado: cada post es un mapa con id, content y created_at, '
             'y una llave author que contiene otro mapa con username y full_name.',
             colors=('indigo',))
    s += '  <rect x="48" y="104" width="864" height="34" rx="8" fill="#1F2430"/>\n'
    s += ('  <text class="mono" x="64" y="121" dy="0.35em" font-size="13" fill="#C9CFDA" data-fit="832">'
          '.select(\'id, content, created_at, <tspan fill="#A9B4F2" font-weight="700">author:profiles(username, full_name)</tspan>\')</text>\n')
    t1, c1 = table(48, 164, 352, 'slate', 'posts', [
        ('id', '9b1e04d7…', 'PK', None), ('profile_id', UID, 'FK', 'indigo'),
        ('content', "'Mi primer post'", '', None), ('created_at', '2026-10-18…', '', None)], vx=124)
    t2, c2 = table(48, 364, 352, 'indigo', 'profiles', [
        ('id', UID, 'PK', 'indigo'), ('username', 'ana.dev', '', None)], vx=124)
    s += t1 + t2
    s += f'  <path class="ar-indigo" d="M400,{c1[1]:.0f} H420 V{c2[0]:.0f} H402"/>\n'
    s += f'  <text x="428" y="{(c1[1]+c2[0])/2:.0f}" dy="0.35em" font-size="11.5" font-weight="700" fill="#4453C9">FK</text>\n'
    jx, jy = 480, 164
    s += f'  <rect x="{jx}" y="{jy}" width="432" height="252" rx="12" fill="#1F2430"/>\n'
    s += f'  <text class="h" x="{jx+16}" y="{jy+22}" style="fill:#9AA3B5">CADA ELEMENTO DE LA LISTA</text>\n'
    lines = [
        ('{', None), ('  "id": "9b1e04d7…",', None), ('  "content": "Mi primer post",', None),
        ('  "created_at": "2026-10-18T10:05…",', None), ('  "author": {', 'k'),
        ('    "username": "ana.dev",', 'v'), ('    "full_name": "Ana Gómez"', 'v'), ('  }', 'k'), ('}', None)]
    for i, (ln, kind) in enumerate(lines):
        ly = jy + 50 + i * 22
        if kind:
            s += f'  <rect x="{jx+12}" y="{ly-11}" width="408" height="22" fill="#4453C9" fill-opacity="{0.35 if kind == "k" else 0.2}"/>\n'
        s += f'  <text class="mono" x="{jx+20}" y="{ly}" dy="0.35em" font-size="12.5" fill="{"#FFFFFF" if kind else "#C9CFDA"}" xml:space="preserve" data-fit="396">{ln}</text>\n'
    s += f'  <text class="mono" x="{jx}" y="452" font-size="12.5" fill="#4453C9" font-weight="700">json[\'author\'][\'username\']</text>\n'
    s += f'  <text x="{jx+222}" y="452" font-size="12.5" fill="#454C61" data-fit="200">→ \'ana.dev\'</text>\n'
    return s + '</svg>\n'


FIGS['dbAnidado'] = db_anidado


# ───────────────────────── 0061 · Laboratorio 6 ─────────────────────────

def post_card(x, y, w, user, name, text, likes, mine=False):
    o = f'  <rect x="{x}" y="{y}" width="{w}" height="62" rx="8" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>\n'
    o += f'  <text x="{x+10}" y="{y+16}" dy="0.35em" font-size="11" font-weight="700" fill="#161A26" data-fit="{w-20}">@{user} <tspan font-weight="400" fill="#79809A">· {name}</tspan></text>\n'
    o += f'  <text x="{x+10}" y="{y+34}" dy="0.35em" font-size="11" fill="#454C61" data-fit="{w-20}">{text}</text>\n'
    heart = 'M0,3 C0,-1 5,-2 6,2 C7,-2 12,-1 12,3 C12,6 8,9 6,11 C4,9 0,6 0,3 Z'
    fill = '#C2354F' if mine else 'none'
    o += f'  <path transform="translate({x+10},{y+45})" d="{heart}" fill="{fill}" stroke="#C2354F" stroke-width="1.3"/>\n'
    o += f'  <text x="{x+28}" y="{y+51}" dy="0.35em" font-size="11" fill="#454C61">{likes}</text>\n'
    return o


def nav(x, y, w, active):
    o = f'  <path d="M{x+2},{y} H{x+w-2}" stroke="#D9DEE8" stroke-width="1.5"/>\n'
    for i, label in enumerate(['Muro', 'Perfil']):
        cx = x + w * (0.25 + 0.5 * i)
        on = i == active
        o += f'  <circle cx="{cx:.0f}" cy="{y+16}" r="5" fill="{"#4453C9" if on else "#C4CBD8"}"/>\n'
        o += f'  <text x="{cx:.0f}" y="{y+32}" dy="0.35em" text-anchor="middle" font-size="11" font-weight="{700 if on else 400}" fill="{"#4453C9" if on else "#79809A"}">{label}</text>\n'
    return o


def db_muro_pantallas():
    fid, h = 'dbMuroPantallas', 616
    s = head(fid, h, 'Una Screen con dos Pages, y otra Screen para escribir', 'Una Screen con dos Pages, y otra Screen para escribir',
             'El BottomNavigationBar cambia de Page sin navegar. El botón flotante sí navega, a ComposeScreen.',
             'Tres teléfonos. El primero es HomeScreen mostrando FeedPage: tres tarjetas de post con autor, texto y corazón con su '
             'contador, un botón Mostrar más y la barra inferior con Muro activo. El segundo es la misma HomeScreen mostrando '
             'ProfilePage: nombre, username y los tres últimos posts propios, con Perfil activo. El tercero es ComposeScreen, con un campo '
             'de texto, el contador 42/280 y el botón Publicar. Del botón flotante sale una flecha a ComposeScreen.',
             colors=('violet', 'teal'))
    pw, ph, py = 232, 420, 132
    xs = [48, 364, 680]
    labels = [('HomeScreen', 'FeedPage'), ('HomeScreen', 'ProfilePage'), ('ComposeScreen', '')]
    for x, (screen, page) in zip(xs, labels):
        s += f'  <text class="mono" x="{x+pw/2:.0f}" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#7439B8">{screen}' \
             + (f' <tspan fill="#0F8478">· {page}</tspan>' if page else '') + '</text>\n'
    s += '  ' + phone(xs[0], py, pw, ph, 'Muro')
    s += f'  <rect x="{xs[0]+8}" y="{py+48}" width="{pw-16}" height="{ph-100}" rx="8" fill="#E3F6F3" fill-opacity=".45" stroke="#86D3CA" stroke-dasharray="4 3"/>\n'
    for k, (u, n, t, l, m) in enumerate([('lu.mora', 'Lucía Mora', 'Alguien entendió range?', 3, True),
                                         ('juanpa', 'Juan Pablo', 'Flutter + Supabase = muro', 5, False),
                                         ('ana.dev', 'Ana Gómez', 'Mi primer post', 1, False)]):
        s += post_card(xs[0] + 16, py + 58 + k * 70, pw - 32, u, n, t, l, m)
    s += f'  <rect x="{xs[0]+56}" y="{py+272}" width="{pw-112}" height="28" rx="14" fill="#FFFFFF" stroke="#4453C9" stroke-width="1.5"/>\n'
    s += f'  <text x="{xs[0]+pw/2:.0f}" y="{py+286}" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#4453C9">Mostrar más</text>\n'
    s += f'  <rect x="{xs[0]+pw-60}" y="{py+316}" width="44" height="44" rx="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/>\n'
    s += f'  <text x="{xs[0]+pw-38}" y="{py+338}" dy="0.35em" text-anchor="middle" font-size="18" font-weight="700" fill="#4453C9">+</text>\n'
    s += nav(xs[0], py + ph - 52, pw, 0)

    s += '  ' + phone(xs[1], py, pw, ph, 'Muro')
    s += f'  <rect x="{xs[1]+8}" y="{py+48}" width="{pw-16}" height="{ph-100}" rx="8" fill="#E3F6F3" fill-opacity=".45" stroke="#86D3CA" stroke-dasharray="4 3"/>\n'
    s += f'  <circle cx="{xs[1]+pw/2:.0f}" cy="{py+84}" r="22" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/>\n'
    s += f'  <text x="{xs[1]+pw/2:.0f}" y="{py+84}" dy="0.35em" text-anchor="middle" font-size="15" font-weight="700" fill="#4453C9">AG</text>\n'
    s += f'  <text x="{xs[1]+pw/2:.0f}" y="{py+122}" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#161A26">Ana Gómez</text>\n'
    s += f'  <text x="{xs[1]+pw/2:.0f}" y="{py+140}" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#79809A">@ana.dev</text>\n'
    s += f'  <text class="h" x="{xs[1]+18}" y="{py+168}" style="font-size:10.5px">TUS ÚLTIMOS POSTS</text>\n'
    for k, (t, l) in enumerate([('Mi primer post', 1), ('Hoy vimos Supabase', 0)]):
        s += post_card(xs[1] + 16, py + 178 + k * 70, pw - 32, 'ana.dev', 'Ana Gómez', t, l)
    s += nav(xs[1], py + ph - 52, pw, 1)

    s += '  ' + phone(xs[2], py, pw, ph, 'Nuevo post')
    s += f'  <rect x="{xs[2]+16}" y="{py+60}" width="{pw-32}" height="120" rx="8" fill="#F5F6FA" stroke="#4453C9" stroke-width="1.5"/>\n'
    s += f'  <text x="{xs[2]+26}" y="{py+78}" dy="0.35em" font-size="12" fill="#161A26" data-fit="{pw-52}">Hoy aprendí a paginar con</text>\n'
    s += f'  <text x="{xs[2]+26}" y="{py+96}" dy="0.35em" font-size="12" fill="#161A26" data-fit="{pw-52}">range y order. #flutter</text>\n'
    s += f'  <text x="{xs[2]+pw-16}" y="{py+196}" dy="0.35em" text-anchor="end" font-size="11.5" fill="#79809A">42/280</text>\n'
    s += f'  <rect x="{xs[2]+16}" y="{py+220}" width="{pw-32}" height="34" rx="17" fill="#4453C9"/>\n'
    s += f'  <text x="{xs[2]+pw/2:.0f}" y="{py+237}" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#FFFFFF">Publicar</text>\n'

    lane = py + ph + 34
    fab = xs[0] + pw - 38
    s += f'  <path class="ar-violet" d="M{fab},{py+ph+2} V{lane} H{xs[2]+pw/2:.0f} V{py+ph+4}"/>\n'
    s += f'  <rect x="{xs[1]+16}" y="{lane-12}" width="{pw-32}" height="24" rx="12" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.25"/>\n'
    s += f'  <text class="mono" x="{xs[1]+pw/2:.0f}" y="{lane}" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#7439B8">pushNamed(\'/compose\')</text>\n'
    s += f'  <text x="{fab+8}" y="{py+ph+18}" dy="0.35em" font-size="11" fill="#7439B8">botón +</text>\n'
    gx1, gx2, gy = xs[0] + pw + 6, xs[1] - 6, py + ph - 26
    s += f'  <path class="ar-teal" d="M{gx1+4},{gy} H{gx2}"/>\n'
    s += f'  <path class="ar-teal" d="M{gx2-4},{gy} H{gx1}"/>\n'
    s += f'  <text class="mono" x="{(gx1+gx2)/2:.0f}" y="{gy-28}" text-anchor="middle" font-size="11" font-weight="700" fill="#0F8478">setState</text>\n'
    s += f'  <text class="mono" x="{(gx1+gx2)/2:.0f}" y="{gy-13}" text-anchor="middle" font-size="11" font-weight="700" fill="#0F8478">_index</text>\n'
    return s + '</svg>\n'


FIGS['dbMuroPantallas'] = db_muro_pantallas


def db_muro_modelo():
    fid, h = 'dbMuroModelo', 452
    s = head(fid, h, 'El modelo de datos del muro', 'El modelo de datos del muro',
             'likes une a una persona con un post. Su llave es la pareja: no puede repetirse.',
             'Cuatro tablas. auth.users con id. profiles con id, que referencia a auth.users, username y full_name. posts con id, '
             'profile_id, que referencia a profiles, content y created_at. likes con post_id, que referencia a posts, profile_id, que '
             'referencia a profiles, y created_at. La llave primaria de likes es la pareja post_id y profile_id.',
             colors=('indigo', 'rose'))
    w, gap, y = 200, 21, 112
    xs = [48 + i * (w + gap) for i in range(4)]
    t1, c1 = table(xs[0], y, w, 'slate', 'auth.users', [('id', '', 'PK', None), ('email', '', '', None)], vx=84)
    t2, c2 = table(xs[1], y, w, 'indigo', 'profiles', [('id', '', 'PK · FK', None), ('username', '', '', None),
                                                       ('full_name', '', '', None)], vx=84)
    t3, c3 = table(xs[2], y, w, 'indigo', 'posts', [('id', '', 'PK', None), ('profile_id', '', 'FK', None),
                                                    ('content', '', '', None), ('created_at', '', '', None)], vx=84)
    t4, c4 = table(xs[3], y, w, 'rose', 'likes', [('post_id', '', 'PK · FK', 'rose'), ('profile_id', '', 'PK · FK', 'rose'),
                                                  ('created_at', '', '', None)], vx=84)
    s += t1 + t2 + t3 + t4
    s += f'  <path class="link" d="M{xs[1]},{c2[0]:.0f} H{xs[0]+w+2}"/>\n'
    s += f'  <path class="ar-indigo" d="M{xs[2]},{c3[1]:.0f} H{xs[2]-10} V{c2[0]:.0f} H{xs[1]+w+2}"/>\n'
    s += f'  <path class="ar-rose" d="M{xs[3]},{c4[0]:.0f} H{xs[2]+w+2}"/>\n'
    bottom = y + 40 + 34 * 4
    s += f'  <path class="ar-rose" d="M{xs[3]+w/2:.0f},{y+40+34*3} V{bottom+28} H{xs[1]+w/2:.0f} V{y+40+34*3+2}"/>\n'
    s += f'  <text x="{xs[2]+w/2:.0f}" y="{bottom+20}" text-anchor="middle" font-size="11.5" font-weight="700" fill="#C2354F">likes.profile_id → profiles.id</text>\n'
    s += '  ' + note(48, bottom + 52, 420, 'rose', 'primary key (post_id, profile_id)', [
        'Una persona, un «me gusta» por post. El segundo insert falla:',
        'por eso se usa upsert con onConflict.'], mono_title=True)
    s += '  ' + note(492, bottom + 52, 420, 'slate', 'likes(count) en el select', [
        'Cuenta las filas de likes de cada post sin descargarlas.', 'Llega como [{"count": 3}].'])
    return s + '</svg>\n'


FIGS['dbMuroModelo'] = db_muro_modelo


def db_muro_carpetas():
    fid = 'dbMuroCarpetas'
    rows = [
        (0, 'lib/', 'slate', '', ''),
        (1, 'main.dart', 'violet', 'Conecta las capas en /home y /compose', '6'),
        (1, 'features/', 'slate', '', ''),
        (2, 'auth/ · login/ · register/', 'slate', 'Ya viene: el Laboratorio 5 resuelto', ''),
        (2, 'posts/', 'slate', 'Todo lo del muro que no es pantalla', ''),
        (3, 'domain/entities/post.dart', 'slate', 'Ya viene: el post con su copyWith', ''),
        (3, 'domain/repository/post_repository.dart', 'amber', 'El contrato · vacío', '1'),
        (3, 'domain/usecases/', 'amber', 'Uno por acción · vacíos', '2'),
        (3, 'data/source/supabase_post_data_source.dart', 'teal', 'Las consultas a Supabase · vacío', '3'),
        (3, 'data/repository/post_repository_impl.dart', 'teal', 'Cumple el contrato · vacío', '3'),
        (2, 'home/ui/', 'slate', '', ''),
        (3, 'bloc/feed_bloc.dart', 'violet', 'Eventos y estado listos · on solo imprimen', '4'),
        (3, 'screens/ · pages/ · components/', 'slate', 'Ya viene: HomeScreen, las Pages y PostCard', ''),
        (2, 'compose/ui/', 'slate', '', ''),
        (3, 'bloc/compose_bloc.dart', 'violet', 'Eventos y estado listos · on solo imprime', '5'),
        (3, 'screens/compose_screen.dart', 'slate', 'Ya viene', ''),
    ]
    y0, rh = 112, 34
    h = y0 + rh * len(rows) + 64
    s = head(fid, h, 'La estructura de carpetas', 'La estructura de carpetas',
             'En gris lo que ya viene hecho. Con número, lo que te toca y en qué paso.',
             'Árbol de carpetas del proyecto 262AppsLab6. Ya vienen hechos auth, login y register del '
             'Laboratorio 5, la entidad Post, las pantallas, las Pages y PostCard. Están vacíos y numerados por paso: el contrato '
             'PostRepository (1), los casos de uso (2), el data source y la implementación del repositorio (3), los on de FeedBloc (4) '
             'y de ComposeBloc (5), y la conexión de las capas en main.dart (6).')
    s += f'  <rect x="48" y="96" width="864" height="{rh*len(rows)+20}" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>\n'
    last = {}
    for i, (lvl, name, color, text, step) in enumerate(rows):
        soft, border, strong = FAM[color]
        y = y0 + i * rh + 12
        x = 68 + lvl * 24
        if lvl:
            s += f'  <path d="M{x-14},{last[lvl-1]+13} V{y} H{x-3}" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>\n'
        last[lvl] = y
        w = len(name) * 7.5 + 20
        s += f'  <rect x="{x}" y="{y-13}" width="{w:.0f}" height="26" rx="{8 if name.endswith("/") else 4}" fill="{soft}" stroke="{border}" stroke-width="1.5"/>\n'
        s += f'  <text class="mono" x="{x+10}" y="{y}" dy="0.35em" font-size="12.5" font-weight="600" fill="{strong}" data-fit="{w-12:.0f}">{name}</text>\n'
        if text:
            s += f'  <text x="540" y="{y}" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">{text}</text>\n'
        if step:
            s += '  ' + chip(880, y, step)
    s += '  <text class="h" x="892" y="88" text-anchor="end">PASO</text>\n'
    return s + tail(h, 'Los nombres de archivo van en minúscula y con guion bajo, igual que en el Laboratorio 5.')


FIGS['dbMuroCarpetas'] = db_muro_carpetas


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
