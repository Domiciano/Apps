"""Figuras SVG de la sección Storage: «Storage, CDN y caché» (0092), «Acceso a galería y cámara» (0066),
«Subir y mostrar archivos con Supabase Storage» (0067) y «Laboratorio 7 · Foto de perfil» (0069).

    python3 tools/storage_figuras.py <carpeta>     escribe un .svg por figura, para revisarlas
    python3 tools/storage_figuras.py --inject      reemplaza cada bloque ```svg de las cuatro lecciones
                                                   por la figura con el mismo id

No editar los SVG dentro del Markdown: se cambia este script y se vuelve a inyectar.
Colores: la base de datos en índigo, Storage en verde azulado, el CDN en violeta, lo que cambia en ámbar,
lo que se crea en verde y lo que se borra o falla en rosa.
"""

import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from bloc_figuras import FAM, chip, head, note, phone, tail  # noqa: E402
from database_figuras import legend, table  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
LESSONS = ['lessonJ0.md', 'lessonJ1.md', 'lessonJ2.md', 'lessonJ4.md']
FIGS = {}
UID = '3f2a9c1e'
OLD = '9c1e7b20'
NEW = 'e4b05d11'
PHOTO = {1: ('#DCE7FF', '#4453C9'), 2: ('#FFE3CC', '#C2571A')}


def photo(x, y, s, n, crossed=False):
    """Foto de perfil en miniatura: silueta sobre un fondo que cambia con la versión."""
    bg, fg = PHOTO[n]
    o = f'  <rect x="{x}" y="{y}" width="{s}" height="{s}" rx="{s*0.18:.0f}" fill="{bg}" stroke="{fg}" stroke-width="1.5"/>\n'
    o += f'  <circle cx="{x+s/2:.1f}" cy="{y+s*0.4:.1f}" r="{s*0.17:.1f}" fill="{fg}"/>\n'
    o += (f'  <path d="M{x+s*0.2:.1f},{y+s*0.86:.1f} C{x+s*0.24:.1f},{y+s*0.6:.1f} {x+s*0.76:.1f},{y+s*0.6:.1f} '
          f'{x+s*0.8:.1f},{y+s*0.86:.1f} Z" fill="{fg}"/>\n')
    o += (f'  <text x="{x+s-4:.1f}" y="{y+12}" text-anchor="end" font-size="{max(10, s*0.2):.0f}" font-weight="700" '
          f'fill="{fg}">{n}</text>\n')
    if crossed:
        o += f'  <path d="M{x-3},{y-3} L{x+s+3},{y+s+3}" stroke="#C2354F" stroke-width="3" stroke-linecap="round"/>\n'
    return o


def file_icon(x, y, color, name, size='', w=170, crossed=False):
    soft, border, strong = FAM[color]
    dash = ' stroke-dasharray="4 3"' if crossed else ''
    o = (f'  <path d="M{x},{y} H{x+20} L{x+28},{y+8} V{y+34} H{x} Z" fill="{soft}" stroke="{border}" stroke-width="1.5"{dash}/>'
         f'<path d="M{x+20},{y} V{y+8} H{x+28}" fill="none" stroke="{border}" stroke-width="1.5"/>\n')
    deco = ' text-decoration="line-through"' if crossed else ''
    o += f'  <text class="mono" x="{x+38}" y="{y+12}" dy="0.35em" font-size="12.5" font-weight="700" fill="{strong}"{deco} data-fit="{w-40}">{name}</text>\n'
    if size:
        o += f'  <text x="{x+38}" y="{y+29}" dy="0.35em" font-size="11.5" fill="#79809A" data-fit="{w-40}">{size}</text>\n'
    return o


def folder_icon(x, y, color):
    soft, border, _ = FAM[color]
    return (f'  <path d="M{x},{y+4} H{x+11} L{x+15},{y+8} H{x+30} V{y+26} H{x} Z" fill="{soft}" stroke="{border}" '
            f'stroke-width="1.5"/>\n')


def badge(x, y, color, text, w=None):
    soft, border, strong = FAM[color]
    w = w or len(text) * 7.4 + 16
    return (f'  <rect x="{x}" y="{y-11}" width="{w:.0f}" height="22" rx="11" fill="{soft}" stroke="{border}" stroke-width="1.25"/>'
            f'<text x="{x+w/2:.0f}" y="{y}" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="{strong}">{text}</text>\n')


def code_bar(x, y, w, html, h=34, fit=None):
    return (f'  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="#1F2430"/>\n'
            f'  <text class="mono" x="{x+14}" y="{y+h/2:.0f}" dy="0.35em" font-size="12.5" fill="#C9CFDA" '
            f'data-fit="{fit or w-28}">{html}</text>\n')


def panel(x, y, w, h, color, title):
    soft, border, strong = FAM[color]
    return (f'  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="#FFFFFF" stroke="{border}" stroke-width="2"/>\n'
            f'  <path d="M{x},{y+40} V{y+12} A12,12 0 0 1 {x+12},{y} H{x+w-12} A12,12 0 0 1 {x+w},{y+12} V{y+40} Z" '
            f'fill="{soft}" stroke="{border}" stroke-width="2"/>\n'
            f'  <text x="{x+16}" y="{y+20}" dy="0.35em" font-size="14.5" font-weight="700" fill="{strong}" data-fit="{w-32}">{title}</text>\n')


def bullets(x, y, w, lines, gap=20, size=12.5):
    o = ''
    for i, ln in enumerate(lines):
        o += f'  <circle cx="{x+4}" cy="{y + i*gap - 4}" r="2.5" fill="#79809A"/>'
        o += f'<text x="{x+14}" y="{y + i*gap}" font-size="{size}" fill="#454C61" data-fit="{w-14}">{ln}</text>\n'
    return o


# ───────────────────────── 0092 · Storage, CDN y caché ─────────────────────────

def st_donde_va():
    fid, h = 'stDondeVa', 468
    s = head(fid, h, 'Los bytes en Storage, el puntero en la tabla', 'Los bytes en Storage, el puntero en la tabla',
             'La fila del perfil no guarda la foto. Guarda dónde está.',
             'A la izquierda, la tabla profiles con id, username, full_name y avatar_path. avatar_path guarda un texto corto: '
             'la carpeta del usuario y el nombre del archivo. Una flecha va de ese texto al archivo dentro del bucket avatars de '
             'Supabase Storage, a la derecha, que pesa 48 KB. Debajo, qué guarda cada servicio: Postgres guarda filas pequeñas '
             'que se consultan; Storage guarda archivos que se descargan enteros por una URL.',
             colors=('amber',))
    t, c = table(48, 112, 400, 'indigo', 'profiles', [
        ('id', f'{UID}…', 'PK', None), ('username', 'ana.dev', '', None), ('full_name', 'Ana Gómez', '', None),
        ('avatar_path', f"'{UID}…/{NEW}….jpg'", '', 'amber')], vx=124, who='Postgres')
    s += t
    bx, by, bw, bh = 560, 112, 352, 176
    s += panel(bx, by, bw, bh, 'teal', 'bucket avatars')
    s += f'  <text x="{bx+bw-16}" y="{by+20}" dy="0.35em" text-anchor="end" font-size="11.5" fill="#454C61">Storage</text>\n'
    s += folder_icon(bx + 20, by + 56, 'teal')
    s += f'  <text class="mono" x="{bx+60}" y="{by+73}" dy="0.35em" font-size="12.5" font-weight="700" fill="#0F8478">{UID}…/</text>\n'
    s += f'  <path class="tree" d="M{bx+34},{by+86} V{by+128} H{bx+52}"/>\n'
    s += file_icon(bx + 56, by + 112, 'teal', f'{NEW}….jpg', '48 KB · image/jpeg', w=260)
    s += photo(bx + bw - 64, by + 104, 48, 1)
    s += f'  <path class="ar-amber" d="M448,{c[3]:.0f} H504 V{by+128} H{bx+52}"/>\n'
    s += '  ' + note(48, 316, 400, 'indigo', 'Postgres guarda filas', [
        'Texto y números cortos que se filtran, ordenan', 'y unen con otras tablas.'])
    s += '  ' + note(512, 316, 400, 'teal', 'Storage guarda archivos', [
        'Fotos, audios o PDF que se descargan enteros,', 'cada uno por su propia URL.'])
    return s + tail(h, 'Los dos cambian juntos: si se borra el archivo y la fila no se entera, la fila apunta a nada.')


FIGS['stDondeVa'] = st_donde_va


def st_ruta():
    fid, h = 'stRuta', 452
    s = head(fid, h, 'Bucket, path y URL', 'Bucket, path y URL',
             'Lo que guardas en la tabla es el path. La URL se arma a partir de él.',
             'Arriba, tres piezas en fila: el bucket avatars, la carpeta con el id de la persona y el archivo con un nombre '
             'aleatorio. La carpeta y el archivo juntos forman el path, que es lo que se guarda en avatar_path. Abajo, la URL '
             'pública completa dividida en cuatro partes de color: la dirección del proyecto, la ruta de objetos públicos de '
             'Storage, el bucket y el path.')
    parts = [('teal', 'avatars', 'BUCKET', 'Un contenedor con sus reglas'),
             ('indigo', f'{UID}-…', 'CARPETA', 'El id de la persona'),
             ('amber', f'{NEW}-….jpg', 'ARCHIVO', 'Un nombre que no se repite')]
    w, gap, y = 248, 60, 150
    for i, (color, code, label, text) in enumerate(parts):
        soft, border, strong = FAM[color]
        x = 48 + i * (w + gap)
        s += f'  <text class="h" x="{x+w/2:.0f}" y="{y-14}" text-anchor="middle" style="fill:{strong}">{label}</text>\n'
        s += f'  <rect x="{x}" y="{y}" width="{w}" height="44" rx="10" fill="{soft}" stroke="{border}" stroke-width="1.75"/>\n'
        s += f'  <text class="mono" x="{x+w/2:.0f}" y="{y+22}" dy="0.35em" text-anchor="middle" font-size="14" font-weight="700" fill="{strong}">{code}</text>\n'
        s += f'  <text x="{x+w/2:.0f}" y="{y+66}" text-anchor="middle" font-size="12.5" fill="#454C61">{text}</text>\n'
        if i:
            s += f'  <text class="mono" x="{x-gap/2:.0f}" y="{y+22}" dy="0.35em" text-anchor="middle" font-size="22" font-weight="700" fill="#79809A">/</text>\n'
    bx1, bx2 = 48 + w + gap, 48 + 3 * w + 2 * gap
    s += f'  <path d="M{bx1},{y+84} V{y+94} H{bx2} V{y+84}" fill="none" stroke="#A96C05" stroke-width="1.75"/>\n'
    s += f'  <path d="M{(bx1+bx2)/2:.0f},{y+94} V{y+102}" stroke="#A96C05" stroke-width="1.75"/>\n'
    s += (f'  <text x="{(bx1+bx2)/2:.0f}" y="{y+120}" text-anchor="middle" font-size="13" font-weight="700" fill="#A96C05">'
          f'el path · lo que guardas en <tspan class="mono">avatar_path</tspan></text>\n')
    uy = 318
    s += f'  <text class="h" x="48" y="{uy-12}">LA URL PÚBLICA</text>\n'
    s += code_bar(48, uy, 864, (
        '<tspan fill="#C9CFDA">https:&#x2F;&#x2F;xyz.supabase.co</tspan>'
        '<tspan fill="#9AA3B5">/storage/v1/object/public/</tspan>'
        '<tspan fill="#86D3CA" font-weight="700">avatars/</tspan>'
        f'<tspan fill="#F0C572" font-weight="700">{UID}-…/{NEW}-….jpg</tspan>'), h=38)
    cw, x = 7.5, 62
    for n, text, col in [(23, 'tu proyecto', '#556074'), (26, 'objetos públicos de Storage', '#556074'),
                         (8, 'bucket', '#0F8478'), (29, 'path', '#A96C05')]:
        x2 = x + n * cw
        s += f'  <path d="M{x+2:.0f},{uy+46} V{uy+52} H{x2-2:.0f} V{uy+46}" fill="none" stroke="{col}" stroke-width="1.5"/>\n'
        s += f'  <text x="{(x+x2)/2:.0f}" y="{uy+70}" text-anchor="middle" font-size="12" fill="{col}" font-weight="700">{text}</text>\n'
        x = x2
    return s + tail(h, 'getPublicUrl(path) arma esa URL en el teléfono, sin ir a la red. Por eso conviene guardar el path y no la URL.')


FIGS['stRuta'] = st_ruta


def st_publico_privado():
    fid, h = 'stPublicoPrivado', 508
    s = head(fid, h, 'Bucket público y bucket privado', 'Bucket público y bucket privado',
             'Las dos clases de bucket guardan igual. Lo que cambia es quién puede leer.',
             'Dos paneles. En el bucket público, la app arma la URL con getPublicUrl, sin red, y cualquiera que tenga esa URL '
             'descarga el archivo; la URL es siempre la misma, así que se puede guardar en caché. En el bucket privado, la app '
             'pide await createSignedUrl con una duración; Storage revisa la política de lectura y devuelve una URL con un token '
             'que vence. Cada firma es una URL distinta. Abajo: en los dos casos, las políticas deciden quién sube y quién borra.',
             colors=('teal', 'violet'))
    for i, (color, title, call, net, url, tag, lines) in enumerate([
        ('teal', 'Bucket público', "getPublicUrl(path)", 'en el teléfono, sin red',
         '…/object/public/avatars/{path}', 'siempre la misma',
         ['Cualquiera con la URL ve el archivo.', 'La URL no cambia: se puede guardar en caché.', 'Para fotos de perfil, portadas o productos.']),
        ('violet', 'Bucket privado', "await createSignedUrl(path, 3600)", 'Storage revisa la política',
         '…/object/sign/documents/{path}?token=…', 'vence en 3600 s',
         ['Solo quien pasa la política obtiene la URL.', 'Cada firma es distinta y deja de servir al vencer.', 'Para recibos, documentos o fotos de un chat.']),
    ]):
        soft, border, strong = FAM[color]
        x, w = 48 + i * 444, 420
        s += panel(x, 104, w, 300, color, title)
        s += f'  <rect x="{x+16}" y="160" width="{w-32}" height="32" rx="8" fill="{soft}" stroke="{border}" stroke-width="1.25"/>\n'
        s += f'  <text class="mono" x="{x+28}" y="176" dy="0.35em" font-size="12.5" font-weight="700" fill="{strong}" data-fit="{w-56}">{call}</text>\n'
        s += f'  <path class="ar-{color}" d="M{x+w/2:.0f},194 V226"/>\n'
        s += f'  <text x="{x+w/2+10:.0f}" y="212" font-size="12" fill="#454C61">{net}</text>\n'
        s += code_bar(x + 16, 230, w - 32, url, h=32)
        s += badge(x + w - 16 - (len(tag) * 7.4 + 16), 282, color, tag)
        s += bullets(x + 20, 326, w - 40, lines, gap=22)
    s += '  ' + note(48, 424, 864, 'slate', 'Las políticas mandan en los dos', [
        'Quién sube y quién borra lo deciden siempre las políticas. El tipo de bucket solo decide quién puede leer.'])
    return s + '</svg>\n'


FIGS['stPublicoPrivado'] = st_publico_privado


def st_cdn():
    fid, h = 'stCdn', 500
    s = head(fid, h, 'Qué hace un CDN', 'Qué hace un CDN',
             'Copias del archivo en servidores cerca de quien lo pide. El origen solo responde la primera vez.',
             'Tres personas a la izquierda: Ana y Juan en Cali, Lucía en Madrid. En el centro, dos bordes del CDN, uno en '
             'Bogotá y otro en Madrid. A la derecha, el origen: el bucket de Supabase Storage. Ana pide la foto: el borde de '
             'Bogotá no la tiene (MISS), la pide al origen y se queda con una copia. Juan la pide después: el borde de Bogotá '
             'ya la tiene (HIT) y responde sin tocar el origen. Lucía la pide en Madrid: ese borde no la tiene (MISS) y va al origen.',
             colors=('amber', 'green'))
    s += '  <text class="h" x="48" y="120">QUIEN PIDE</text>\n'
    s += '  <text class="h" x="400" y="120">BORDES DEL CDN</text>\n'
    s += '  <text class="h" x="716" y="120">ORIGEN</text>\n'
    people = [('Ana · Cali', 152, 1), ('Juan · Cali', 232, 2), ('Lucía · Madrid', 336, 3)]
    for name, y, n in people:
        s += f'  <rect x="48" y="{y-24}" width="176" height="48" rx="10" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>\n'
        s += chip(72, y, n, 'slate')
        s += f'  <text x="94" y="{y}" dy="0.35em" font-size="13" font-weight="600" fill="#161A26">{name}</text>\n'
    edges = [('CDN · Bogotá', 192), ('CDN · Madrid', 336)]
    for name, y in edges:
        s += f'  <rect x="400" y="{y-34}" width="200" height="68" rx="12" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.75"/>\n'
        s += f'  <text x="416" y="{y-12}" dy="0.35em" font-size="13.5" font-weight="700" fill="#7439B8">{name}</text>\n'
        s += f'  <text x="416" y="{y+12}" dy="0.35em" font-size="12" fill="#454C61">guarda copias por max-age</text>\n'
    s += panel(716, 150, 196, 220, 'teal', 'Storage')
    s += f'  <text class="mono" x="732" y="214" font-size="12" font-weight="700" fill="#0F8478">avatars/</text>\n'
    s += file_icon(732, 230, 'teal', f'{NEW}….jpg', w=168)
    s += photo(770, 288, 56, 1)
    s += f'  <path class="ar-amber" d="M224,146 H312 V178 H398"/>\n'
    s += badge(258, 132, 'amber', 'MISS', 52)
    s += f'  <path class="ar-green" d="M224,232 H312 V206 H398"/>\n'
    s += badge(258, 246, 'green', 'HIT', 52)
    s += f'  <path class="ar-amber" d="M224,336 H398"/>\n'
    s += badge(258, 322, 'amber', 'MISS', 52)
    s += f'  <path class="ar-amber" d="M600,192 H714"/>\n'
    s += f'  <path class="ar-amber" d="M600,336 H714"/>\n'
    s += f'  <text x="657" y="182" text-anchor="middle" font-size="11.5" fill="#A96C05">la pide</text>\n'
    s += f'  <text x="657" y="352" text-anchor="middle" font-size="11.5" fill="#A96C05">la pide</text>\n'
    s += '  ' + note(48, 400, 420, 'amber', 'MISS', ['El borde no la tiene: la trae del origen', 'y se queda con una copia.'])
    s += '  ' + note(492, 400, 420, 'green', 'HIT', ['Responde el borde, más cerca y sin tocar', 'el origen. La copia vale lo que diga max-age.'])
    return s + '</svg>\n'


FIGS['stCdn'] = st_cdn


def st_capas():
    fid, h = 'stCapas', 432
    s = head(fid, h, 'Cuatro lugares donde puede estar la foto', 'Cuatro lugares donde puede estar la foto',
             'Cada capa responde si ya tiene esa URL. Solo si no la tiene, pregunta a la siguiente.',
             'Cuatro cajas en cadena, de izquierda a derecha: ImageCache, la memoria de la app, que se vacía al cerrarla; la '
             'caché en disco de cached_network_image o del navegador, que sobrevive al reinicio; el borde del CDN, que guarda '
             'la copia durante max-age; y el bucket, el origen, que es el único que tiene siempre la versión actual. Debajo, la '
             'llave con la que buscan las cuatro: la URL completa.')
    layers = [('indigo', 'ImageCache', 'memoria de la app', 'se vacía al cerrar la app'),
              ('violet', 'Caché en disco', 'cached_network_image', 'sobrevive al reinicio'),
              ('amber', 'Borde del CDN', 'el servidor más cercano', 'dura lo que diga max-age'),
              ('teal', 'Bucket', 'el origen', 'la única versión actual')]
    w, gap, y = 192, 32, 136
    for i, (color, name, sub, life) in enumerate(layers):
        soft, border, strong = FAM[color]
        x = 48 + i * (w + gap)
        s += f'  <rect x="{x}" y="{y}" width="{w}" height="104" rx="12" fill="{soft}" stroke="{border}" stroke-width="1.75"/>\n'
        s += f'  <text x="{x+16}" y="{y+28}" font-size="15" font-weight="700" fill="{strong}">{name}</text>\n'
        s += f'  <text x="{x+16}" y="{y+50}" font-size="12.5" fill="#454C61" data-fit="{w-28}">{sub}</text>\n'
        s += f'  <path d="M{x+16},{y+66} H{x+w-16}" stroke="{border}" stroke-width="1"/>\n'
        s += f'  <text x="{x+16}" y="{y+88}" font-size="12" fill="{strong}" data-fit="{w-28}">{life}</text>\n'
        if i:
            s += f'  <path class="link" d="M{x-gap+3},{y+52} H{x-3}"/>\n'
    s += f'  <text x="48" y="{y+136}" font-size="12.5" fill="#556074">Si una capa no la tiene, pregunta a la siguiente. La que la tiene, responde y la app no sigue.</text>\n'
    s += f'  <text class="h" x="48" y="{y+178}">LA LLAVE EN LAS CUATRO</text>\n'
    s += code_bar(48, y + 190, 864, f'https:&#x2F;&#x2F;xyz.supabase.co/storage/v1/object/public/avatars/{UID}-…/avatar.jpg')
    return s + tail(h, 'Si la URL no cambia, cualquier capa puede responder con la foto vieja, y la app no tiene cómo enterarse.')


FIGS['stCapas'] = st_capas


def st_mismo_nombre():
    fid, h = 'stMismoNombre', 548
    s = head(fid, h, 'El mismo nombre contra un nombre nuevo', 'El mismo nombre contra un nombre nuevo',
             'Ana cambia su foto. Con el mismo nombre, la URL no cambia y la app sigue mostrando la vieja.',
             'Dos filas de cuatro pasos. Arriba, con el mismo nombre: se sube la foto 1 como avatar.jpg, la app la muestra, se '
             'sube la foto 2 con upsert sobre el mismo avatar.jpg y la URL sigue igual; la app la vuelve a pedir, ImageCache ya '
             'tiene esa URL y muestra la foto 1. Abajo, con nombre aleatorio: la foto 1 es 9c1e….jpg; la foto 2 se sube como '
             'e4b0….jpg, se guarda ese path en el perfil y se borra el anterior; la URL es nueva, ninguna caché la tiene y la '
             'app muestra la foto 2.',
             colors=('rose', 'green'))
    cols = ['1 · Sube la foto 1', '2 · La app la muestra', '3 · Sube la foto 2', '4 · La pide otra vez']
    cw, x0 = 196, 120
    for i, c in enumerate(cols):
        s += f'  <text class="h" x="{x0 + i*cw + 8}" y="124">{c.upper()}</text>\n'
    lanes = [
        ('rose', 'MISMO NOMBRE', 146, [
            ('photo', 1, 'avatar.jpg', ''),
            ('show', 1, 'avatar.jpg', 'MISS · la descarga'),
            ('photo', 2, 'avatar.jpg', 'upsert: la misma URL'),
            ('show', 1, 'avatar.jpg', 'HIT en ImageCache'),
        ], ('rose', '✗ la vieja')),
        ('green', 'NOMBRE ALEATORIO', 336, [
            ('photo', 1, f'{OLD}….jpg', ''),
            ('show', 1, f'{OLD}….jpg', 'MISS · la descarga'),
            ('photo', 2, f'{NEW}….jpg', f'borra {OLD}….jpg'),
            ('show', 2, f'{NEW}….jpg', 'MISS en todas · la descarga'),
        ], ('green', '✓ la nueva')),
    ]
    for color, label, y, steps, (rc, result) in lanes:
        soft, border, strong = FAM[color]
        s += f'  <rect x="48" y="{y}" width="864" height="164" rx="12" fill="#FFFFFF" stroke="{border}" stroke-width="1.75"/>\n'
        s += f'  <text x="64" y="{y+82}" transform="rotate(-90 64 {y+82})" text-anchor="middle" dy="0.35em" font-size="11.5" font-weight="700" letter-spacing=".08em" fill="{strong}">{label}</text>\n'
        for i, (kind, n, name, extra) in enumerate(steps):
            x = x0 + i * cw
            if kind == 'photo':
                s += photo(x + 8, y + 22, 52, n)
                s += f'  <path class="ar-{color}" d="M{x+66},{y+48} H{x+92}"/>\n'
                s += f'  <rect x="{x+96}" y="{y+30}" width="96" height="36" rx="8" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>\n'
                s += f'  <text x="{x+144}" y="{y+48}" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0F8478">bucket</text>\n'
            else:
                s += f'  <rect x="{x+8}" y="{y+16}" width="76" height="104" rx="12" fill="#FFFFFF" stroke="#2A3040" stroke-width="2"/>\n'
                s += photo(x + 22, y + 40, 48, n)
            s += f'  <text class="mono" x="{x+8}" y="{y+140}" font-size="11.5" font-weight="700" fill="#161A26" data-fit="{cw-16}">{name}</text>\n'
            if extra:
                s += f'  <text x="{x+8}" y="{y+156}" font-size="11.5" fill="{strong}" data-fit="{cw-16}">{extra}</text>\n'
        s += badge(x0 + 3 * cw + 96, y + 66, rc, result, 92)
    return s + tail(h, 'Un nombre que nunca se repite deja usar max-age de un año: esa URL jamás va a mostrar otra foto.')


FIGS['stMismoNombre'] = st_mismo_nombre


# ───────────────────────── 0066 · Galería y cámara ─────────────────────────

def st_picker():
    fid, h = 'stPicker', 476
    s = head(fid, h, 'De la galería a unos bytes', 'De la galería a unos bytes',
             'pickImage abre una pantalla del sistema y devuelve un XFile, o null si la persona cancela.',
             'Una cadena de izquierda a derecha: el botón de la app llama pickImage con un source; el sistema abre la galería o '
             'la cámara, que no son de la app; vuelve un XFile, o null si se cancela; readAsBytes lo convierte en un Uint8List, '
             'que sirve para la vista previa con Image.memory o para subirlo a Storage. Abajo, dos barras de tamaño: la foto '
             'original de 4032 por 3024 pesa unos 3 MB; con maxWidth 512 e imageQuality 80 pesa unos 50 KB.',
             colors=('indigo', 'rose'))
    steps = [('indigo', 'pickImage(…)', 'la app la pide'), ('slate', 'Galería · Cámara', 'pantalla del sistema'),
             ('violet', 'XFile?', 'null si cancela'), ('violet', 'readAsBytes()', 'lee el archivo'),
             ('green', 'Uint8List', 'los bytes')]
    w, gap, y = 152, 26, 128
    for i, (color, code, sub) in enumerate(steps):
        soft, border, strong = FAM[color]
        x = 48 + i * (w + gap)
        mono = 'class="mono" ' if i != 1 else ''
        s += f'  <rect x="{x}" y="{y}" width="{w}" height="64" rx="10" fill="{soft}" stroke="{border}" stroke-width="1.75"/>\n'
        s += f'  <text {mono}x="{x+w/2:.0f}" y="{y+24}" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="{strong}" data-fit="{w-16}">{code}</text>\n'
        s += f'  <text x="{x+w/2:.0f}" y="{y+46}" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="{w-16}">{sub}</text>\n'
        if i:
            s += f'  <path class="link" d="M{x-gap+3},{y+32} H{x-3}"/>\n'
    lx = 48 + 4 * (w + gap) + w / 2
    s += f'  <path class="link" d="M{lx-40:.0f},{y+66} V{y+100} H{lx-100:.0f}"/>\n'
    s += f'  <path class="link" d="M{lx+40:.0f},{y+66} V{y+100}"/>\n'
    s += f'  <rect x="{lx-300:.0f}" y="{y+84}" width="196" height="32" rx="8" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>\n'
    s += f'  <text class="mono" x="{lx-202:.0f}" y="{y+100}" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#161A26">Image.memory(bytes)</text>\n'
    s += f'  <text x="{lx-202:.0f}" y="{y+132}" text-anchor="middle" font-size="12" fill="#454C61">vista previa</text>\n'
    s += f'  <rect x="{lx-56:.0f}" y="{y+102}" width="152" height="32" rx="8" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>\n'
    s += f'  <text class="mono" x="{lx+20:.0f}" y="{y+118}" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#0F8478">uploadBinary(…)</text>\n'
    s += f'  <text x="{lx+20:.0f}" y="{y+150}" text-anchor="middle" font-size="12" fill="#454C61">a Storage</text>\n'
    s += '  <path d="M48,316 H912" stroke="#E4E7EE" stroke-width="1.5"/>\n'
    s += '  <text class="h" x="48" y="346">CUÁNTO PESA LO QUE SUBES</text>\n'
    s += '  <rect x="48" y="360" width="864" height="28" rx="6" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.25"/>\n'
    s += '  <text x="60" y="374" dy="0.35em" font-size="12.5" font-weight="700" fill="#C2354F">Sin límites · 4032 × 3024 · unos 3 MB</text>\n'
    s += '  <rect x="48" y="398" width="16" height="28" rx="4" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>\n'
    s += '  <text x="76" y="412" dy="0.35em" font-size="12.5" font-weight="700" fill="#3A8235">maxWidth: 512, imageQuality: 80 · 512 × 384 · unos 50 KB</text>\n'
    return s + tail(h, 'Para un avatar de 100 píxeles en pantalla, 512 píxeles sobran. Achicar en el teléfono ahorra datos al subir y al bajar.')


FIGS['stPicker'] = st_picker


def st_permisos():
    fid, h = 'stPermisos', 396
    s = head(fid, h, 'Qué pide cada plataforma', 'Qué pide cada plataforma',
             'image_picker usa la galería y la cámara del sistema. Algunas plataformas exigen declararlo antes.',
             'Cuatro tarjetas. Android: nada que declarar, usa el selector de fotos del sistema. iOS: dos textos en '
             'ios/Runner/Info.plist, NSPhotoLibraryUsageDescription y NSCameraUsageDescription; sin el de cámara, la app se '
             'cierra al abrirla; el simulador no tiene cámara. macOS: el permiso de leer archivos elegidos en los entitlements; '
             'solo galería. Web: abre el selector de archivos del navegador.')
    cards = [
        ('green', 'Android', 'nada que declarar', ['Usa el selector de fotos del sistema.']),
        ('indigo', 'iOS', 'ios/Runner/Info.plist', ['NSPhotoLibraryUsageDescription', 'NSCameraUsageDescription',
                                                    'Sin el de cámara, la app se cierra al abrirla.']),
        ('violet', 'macOS', '*.entitlements', ['com.apple.security.files.user-selected.read-only', 'Solo galería: image_picker no abre la cámara.']),
        ('amber', 'Web', 'nada que declarar', ['Abre el selector de archivos del navegador.']),
    ]
    w, ch = 420, 100
    for i, (color, name, where, lines) in enumerate(cards):
        soft, border, strong = FAM[color]
        x, y = 48 + (i % 2) * (w + 24), 104 + (i // 2) * (ch + 16)
        s += f'  <rect x="{x}" y="{y}" width="{w}" height="{ch}" rx="12" fill="#FFFFFF" stroke="{border}" stroke-width="1.75"/>\n'
        s += f'  <rect x="{x}" y="{y}" width="8" height="{ch}" rx="4" fill="{strong}"/>\n'
        s += f'  <text x="{x+24}" y="{y+28}" font-size="15" font-weight="700" fill="{strong}">{name}</text>\n'
        s += f'  <text class="mono" x="{x+w-16}" y="{y+28}" text-anchor="end" font-size="12" font-weight="700" fill="#454C61" data-fit="250">{where}</text>\n'
        for k, ln in enumerate(lines):
            mono = 'class="mono" ' if ln.startswith(('NS', 'com.')) else ''
            s += f'  <text {mono}x="{x+24}" y="{y + 54 + k*18}" font-size="12.5" fill="#454C61" data-fit="{w-40}">{ln}</text>\n'
    return s + tail(h, 'El simulador de iOS no tiene cámara: prueba la cámara en un teléfono de verdad y la galería en el simulador.')


FIGS['stPermisos'] = st_permisos


# ───────────────────────── 0067 · Subir y mostrar ─────────────────────────

def st_subida():
    fid, h = 'stSubida', 556
    s = head(fid, h, 'Cambiar la foto: subir, apuntar, borrar', 'Cambiar la foto: subir, apuntar, borrar',
             'Tres operaciones contra dos servicios, en este orden. Mostrarla no necesita red para la URL.',
             'Tres columnas: la app, el bucket avatars de Storage y la tabla profiles de Postgres. Paso 1: uploadBinary sube '
             'la foto nueva con un nombre aleatorio y aparece en el bucket. Paso 2: update cambia avatar_path de la fila al '
             'path nuevo. Paso 3: remove borra el archivo anterior del bucket. Paso 4: getPublicUrl arma la URL en el teléfono '
             'e Image.network la descarga.',
             colors=('green', 'amber', 'rose', 'indigo'))
    s += '  <text class="h" x="48" y="118">LA APP</text>\n'
    s += '  <text class="h" x="560" y="118">STORAGE · avatars</text>\n'
    s += '  <text class="h" x="760" y="118">POSTGRES · profiles</text>\n'
    s += '  <path d="M544,128 V456" stroke="#E4E7EE" stroke-width="1.5" stroke-dasharray="4 4"/>\n'
    s += '  <path d="M744,128 V456" stroke="#E4E7EE" stroke-width="1.5" stroke-dasharray="4 4"/>\n'
    rows = [
        ('green', '1', f"uploadBinary('{UID}/{NEW}.jpg', bytes)", 'storage'),
        ('amber', '2', f"update({{'avatar_path': '{UID}/{NEW}.jpg'}})", 'db'),
        ('rose', '3', f"remove(['{UID}/{OLD}.jpg'])", 'storage'),
        ('indigo', '4', 'getPublicUrl(path) → Image.network(url)', 'local'),
    ]
    for k, (color, n, code, where) in enumerate(rows):
        soft, border, strong = FAM[color]
        y = 156 + k * 78
        s += chip(60, y + 18, n, color)
        s += f'  <rect x="80" y="{y}" width="420" height="36" rx="8" fill="{soft}" stroke="{border}" stroke-width="1.25"/>\n'
        s += f'  <text class="mono" x="92" y="{y+18}" dy="0.35em" font-size="12" font-weight="700" fill="{strong}" data-fit="396">{code}</text>\n'
        if where == 'storage':
            s += f'  <path class="ar-{color}" d="M500,{y+18} H556"/>\n'
        elif where == 'db':
            s += f'  <path class="ar-{color}" d="M500,{y+18} H756"/>\n'
        else:
            s += f'  <text x="512" y="{y+18}" dy="0.35em" font-size="12" fill="#4453C9">en el teléfono</text>\n'
    s += file_icon(566, 136, 'green', f'{NEW}….jpg', 'nuevo', w=170)
    s += file_icon(566, 292, 'rose', f'{OLD}….jpg', 'borrado', w=170, crossed=True)
    s += f'  <rect x="760" y="214" width="152" height="36" rx="8" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>\n'
    s += f'  <text class="mono" x="770" y="226" dy="0.35em" font-size="11" fill="#79809A">avatar_path</text>\n'
    s += f'  <text class="mono" x="770" y="241" dy="0.35em" font-size="11.5" font-weight="700" fill="#A96C05">{UID}/{NEW}…</text>\n'
    s += '  ' + note(48, 476, 864, 'slate', 'Si algo falla a mitad de camino', [
        'En 1, nada cambió. En 2 o 3, sobra un archivo, pero el perfil nunca apunta a un archivo que no existe.'])
    return s + '</svg>\n'


FIGS['stSubida'] = st_subida


def st_politicas():
    fid, h = 'stPoliticas', 504
    s = head(fid, h, 'Cada quien en su carpeta', 'Cada quien en su carpeta',
             'Cada archivo es una fila de storage.objects. La política compara la primera carpeta del nombre con quien pide.',
             'Arriba, la fila de storage.objects que crea un upload: bucket_id avatars y name con la carpeta y el archivo. '
             'storage.foldername(name) parte el nombre en carpetas y el índice 1 es la primera: el id de la persona. La política '
             'la compara con auth.uid(). Ana sube a su carpeta: coinciden y el upload pasa. Beto intenta subir a la carpeta de '
             'Ana: no coinciden y Storage responde 403, new row violates row-level security policy.',
             colors=('green', 'rose'))
    t, c = table(48, 108, 452, 'teal', 'storage.objects', [
        ('bucket_id', "'avatars'", '', None), ('name', f"'{UID}…/{NEW}….jpg'", '', 'amber'),
        ('owner_id', f'{UID}…', '', None)], vx=128, who='una fila por archivo')
    s += t
    s += code_bar(540, 108, 372, '(storage.foldername(name))[1]', h=36)
    s += f'  <path class="link" d="M500,{c[1]:.0f} H520 V126 H538"/>\n'
    s += f'  <text x="540" y="168" font-size="12.5" fill="#454C61">parte el nombre en carpetas y toma la primera</text>\n'
    s += badge(540, 196, 'amber', f"'{UID}…'", 120)
    s += f'  <text class="mono" x="676" y="196" dy="0.35em" font-size="14" font-weight="700" fill="#556074">=</text>\n'
    s += code_bar(700, 178, 212, 'auth.uid()::text', h=36)
    for i, (color, who, uid, ok, lines) in enumerate([
        ('green', 'Ana sube a su carpeta', UID, '✓ pasa', ['auth.uid() es ' + UID + '…', 'y la carpeta también.']),
        ('rose', 'Beto sube a la carpeta de Ana', '7d10a4b2', '✗ 403', ['auth.uid() es 7d10a4b2…: no coincide.',
                                                                         'new row violates row-level security policy']),
    ]):
        soft, border, strong = FAM[color]
        x = 48 + i * 444
        s += f'  <rect x="{x}" y="264" width="420" height="104" rx="12" fill="{soft}" stroke="{border}" stroke-width="1.75"/>\n'
        s += f'  <text x="{x+16}" y="292" font-size="14" font-weight="700" fill="{strong}">{who}</text>\n'
        s += badge(x + 420 - 80, 288, color, ok, 64)
        for k, ln in enumerate(lines):
            mono = 'class="mono" ' if 'violates' in ln else ''
            s += f'  <text {mono}x="{x+16}" y="{322 + k*20}" font-size="12.5" fill="#454C61" data-fit="388">{ln}</text>\n'
    s += '  ' + note(48, 392, 864, 'slate', 'Tres políticas, una por operación', [
        'insert para subir, select para ver la carpeta propia y delete para borrar. remove() necesita las dos últimas.',
        'No hay política de update: un upsert sobre un nombre que ya existe falla con 403.'])
    return s + '</svg>\n'


FIGS['stPoliticas'] = st_politicas


# ───────────────────────── 0069 · Laboratorio 7 ─────────────────────────

def mini_post(x, y, w, n, user, text):
    o = f'  <rect x="{x}" y="{y}" width="{w}" height="58" rx="8" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>\n'
    if n:
        o += photo(x + 8, y + 9, 28, n)
    else:
        o += f'  <circle cx="{x+22}" cy="{y+23}" r="14" fill="#3ECF8E"/><text x="{x+22}" y="{y+23}" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">{user[0].upper()}</text>\n'
    o += f'  <text x="{x+44}" y="{y+18}" dy="0.35em" font-size="11" font-weight="700" fill="#161A26" data-fit="{w-52}">@{user}</text>\n'
    o += f'  <text x="{x+44}" y="{y+38}" dy="0.35em" font-size="11" fill="#454C61" data-fit="{w-52}">{text}</text>\n'
    return o


def st_lab_pantallas():
    fid, h = 'stLabPantallas', 600
    s = head(fid, h, 'Lo que vas a construir', 'Lo que vas a construir',
             'La cámara del perfil abre una hoja con dos opciones. La foto nueva aparece en el perfil y en cada post tuyo.',
             'Tres teléfonos. El primero es ProfilePage con la foto de Ana, un botón de cámara sobre la foto y sus últimos posts. '
             'El segundo es la misma pantalla con una hoja abierta abajo: Elegir de la galería y Tomar una foto. El tercero es '
             'FeedPage: cada post muestra la foto de su autor, y quien no tiene foto muestra su inicial.',
             colors=('violet',))
    pw, ph, py = 232, 420, 132
    xs = [48, 364, 680]
    for x, (screen, page) in zip(xs, [('HomeScreen', 'ProfilePage'), ('HomeScreen', 'hoja de la cámara'), ('HomeScreen', 'FeedPage')]):
        s += f'  <text class="mono" x="{x+pw/2:.0f}" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#7439B8">{screen} <tspan fill="#0F8478">· {page}</tspan></text>\n'
    for k, x in enumerate(xs[:2]):
        s += '  ' + phone(x, py, pw, ph, 'Perfil')
        s += photo(x + pw / 2 - 40, py + 58, 80, 2)
        s += f'  <circle cx="{x+pw/2+34:.0f}" cy="{py+130}" r="15" fill="#1F9D68"/>\n'
        s += (f'  <path transform="translate({x+pw/2+26:.0f},{py+123})" d="M0,3 H4 L6,0 H10 L12,3 H16 V14 H0 Z" fill="none" '
              f'stroke="#FFFFFF" stroke-width="1.5"/><circle cx="{x+pw/2+34:.0f}" cy="{py+131}" r="3.2" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>\n')
        s += f'  <text x="{x+pw/2:.0f}" y="{py+164}" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#161A26">Ana Gómez</text>\n'
        s += f'  <text x="{x+pw/2:.0f}" y="{py+182}" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#79809A">@ana.dev</text>\n'
        s += mini_post(x + 16, py + 204, pw - 32, 2, 'ana.dev', 'Mi primer post')
        s += mini_post(x + 16, py + 270, pw - 32, 2, 'ana.dev', 'Hoy vimos Storage')
    sx = xs[1]
    s += f'  <rect x="{sx+3}" y="{py+42}" width="{pw-6}" height="{ph-45}" rx="0" fill="#161A26" fill-opacity=".35"/>\n'
    s += f'  <path d="M{sx+3},{py+ph-128} H{sx+pw-3} V{py+ph-18} A15,15 0 0 1 {sx+pw-18},{py+ph-3} H{sx+18} A15,15 0 0 1 {sx+3},{py+ph-18} Z" fill="#FFFFFF"/>\n'
    for k, (label, icon) in enumerate([('Elegir de la galería', 'g'), ('Tomar una foto', 'c')]):
        y = py + ph - 100 + k * 44
        s += f'  <rect x="{sx+20}" y="{y-8}" width="16" height="16" rx="3" fill="none" stroke="#454C61" stroke-width="1.5"/>\n'
        s += f'  <text x="{sx+48}" y="{y}" dy="0.35em" font-size="13" fill="#161A26">{label}</text>\n'
    fx = xs[2]
    s += '  ' + phone(fx, py, pw, ph, 'Muro')
    for k, (n, u, t) in enumerate([(2, 'ana.dev', 'Hoy vimos Storage'), (1, 'juanpa', 'Mi foto nueva!'),
                                   (0, 'lu.mora', 'Aún sin foto'), (2, 'ana.dev', 'Mi primer post')]):
        s += mini_post(fx + 16, py + 58 + k * 68, pw - 32, n, u, t)
    s += f'  <path class="ar-violet" d="M{xs[0]+pw/2+50:.0f},{py+130} C{xs[0]+pw+40:.0f},{py+130} {xs[1]-30:.0f},{py+ph-100} {sx+14:.0f},{py+ph-100}"/>\n'
    return s + tail(h, 'Mientras sube, la foto del perfil muestra un indicador de carga. Si algo falla, un SnackBar dice por qué.')


FIGS['stLabPantallas'] = st_lab_pantallas


def st_lab_modelo():
    fid, h = 'stLabModelo', 432
    s = head(fid, h, 'Lo que agrega la migración', 'Lo que agrega la migración',
             'Una columna en profiles, un bucket público y tres políticas sobre storage.objects.',
             'A la izquierda, la tabla profiles con su nueva columna avatar_path, que puede ser nula. A la derecha, el bucket '
             'avatars: público, con un límite de 2 MB por archivo y solo imágenes JPEG, PNG o WebP. Debajo del bucket, tres '
             'políticas para usuarios con sesión: insert, select y delete, todas sobre la carpeta propia.',
             colors=('amber',))
    t, c = table(48, 112, 360, 'indigo', 'profiles', [
        ('id', '', 'PK · FK', None), ('username', '', '', None), ('full_name', '', '', None),
        ('avatar_path', 'text · puede ser null', '', 'amber')], vx=124)
    s += t
    s += panel(456, 112, 456, 168, 'teal', 'bucket avatars')
    for k, (badge_txt, text) in enumerate([('public', 'cualquiera lee por URL'), ('2 MB', 'tamaño máximo por archivo'),
                                           ('jpeg · png · webp', 'los únicos tipos que acepta')]):
        y = 176 + k * 32
        s += badge(472, y, 'teal', badge_txt, 132)
        s += f'  <text x="620" y="{y}" dy="0.35em" font-size="12.5" fill="#454C61">{text}</text>\n'
    s += f'  <path class="ar-amber" d="M408,{c[3]:.0f} H432 V196 H454"/>\n'
    s += f'  <text class="h" x="456" y="314">POLÍTICAS EN STORAGE.OBJECTS · ROL AUTHENTICATED</text>\n'
    for k, (op, text) in enumerate([('insert', 'subir'), ('select', 'ver'), ('delete', 'borrar')]):
        x = 456 + k * 156
        s += f'  <rect x="{x}" y="328" width="144" height="52" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>\n'
        s += f'  <text class="mono" x="{x+14}" y="348" font-size="13" font-weight="700" fill="#556074">{op}</text>\n'
        s += f'  <text x="{x+14}" y="368" font-size="12" fill="#454C61">{text} en su carpeta</text>\n'
    s += '  ' + note(48, 310, 360, 'amber', 'avatar_path empieza en null', [
        'Quien no ha subido foto no tiene path:', 'la app muestra la inicial del nombre.'])
    return s + tail(h, 'El orden importa: la columna y el bucket existen antes que las políticas que los nombran.')


FIGS['stLabModelo'] = st_lab_modelo


def st_lab_carpetas():
    fid = 'stLabCarpetas'
    rows = [
        (0, 'lib/', 'slate', '', ''),
        (1, 'components/avatar.dart', 'slate', 'Ya viene: la foto redonda o la inicial', ''),
        (1, 'features/', 'slate', '', ''),
        (2, 'avatar/', 'slate', 'Todo lo de la foto que no es pantalla', ''),
        (3, 'domain/entities/', 'slate', 'Ya viene: PhotoSource y PickedPhoto', ''),
        (3, 'domain/repository/avatar_repository.dart', 'amber', 'El contrato · vacío', '1'),
        (3, 'domain/usecases/change_avatar_usecase.dart', 'amber', 'El caso de uso · vacío', '2'),
        (3, 'data/source/device_photo_data_source.dart', 'teal', 'La galería y la cámara · vacío', '3'),
        (3, 'data/source/supabase_avatar_data_source.dart', 'teal', 'El bucket · vacío', '3'),
        (3, 'data/repository/avatar_repository_impl.dart', 'teal', 'Cumple el contrato · vacío', '3'),
        (2, 'auth/', 'slate', 'Profile ya trae avatarPath y avatarUrl', ''),
        (3, 'domain/repository/profile_repository.dart', 'amber', 'Le falta una operación', '1'),
        (3, 'data/source/supabase_profile_data_source.dart', 'teal', 'Leer y guardar avatar_path', '4'),
        (2, 'posts/data/source/supabase_post_data_source.dart', 'teal', 'La foto del autor', '4'),
        (2, 'home/ui/', 'slate', 'Ya viene: ProfilePage, la hoja y PostCard', ''),
        (3, 'bloc/feed_bloc.dart', 'violet', 'Evento y estado listos · el on solo imprime', '5'),
    ]
    y0, rh = 112, 34
    h = y0 + rh * len(rows) + 64
    s = head(fid, h, 'La estructura de carpetas', 'La estructura de carpetas',
             'En gris lo que ya viene hecho. Con número, lo que te toca y en qué paso.',
             'Árbol de carpetas del proyecto 262AppsLab7. Ya vienen el componente Avatar, las entidades PhotoSource y '
             'PickedPhoto, Profile con avatarPath y avatarUrl, y toda la interfaz. Están vacíos o incompletos y numerados por '
             'paso: el contrato AvatarRepository y la operación nueva de ProfileRepository (1), ChangeAvatarUseCase (2), los dos '
             'data sources de la foto y AvatarRepositoryImpl (3), leer avatar_path en los data sources de perfiles y de posts '
             '(4) y el on de FeedBloc (5).')
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
            s += f'  <text x="568" y="{y}" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">{text}</text>\n'
        if step:
            s += '  ' + chip(886, y, step)
    s += '  <text class="h" x="898" y="88" text-anchor="end">PASO</text>\n'
    return s + tail(h, 'main.dart no cambia: FeedBloc crea su caso de uso, y cada capa crea la siguiente.')


FIGS['stLabCarpetas'] = st_lab_carpetas


def st_lab_caso():
    fid, h = 'stLabCaso', 520
    s = head(fid, h, 'Lo que hace ChangeAvatarUseCase', 'Lo que hace ChangeAvatarUseCase',
             'Seis llamadas a dos repositorios. Si la persona cancela, termina en la primera.',
             'Una lista numerada con el repositorio de cada llamada. 1, AvatarRepository.pick: si devuelve null, termina. 2, '
             'ProfileRepository.getProfile para recordar el path anterior. 3, AvatarRepository.upload sube los bytes con un nombre '
             'nuevo y devuelve el path. 4, ProfileRepository.updateAvatarPath guarda ese path. 5, AvatarRepository.remove borra el '
             'archivo anterior, si había. 6, ProfileRepository.getProfile devuelve el perfil con la URL nueva.')
    calls = [('teal', 'AvatarRepository', 'pick(source)', 'null si la persona cancela: no sigue'),
             ('indigo', 'ProfileRepository', 'getProfile(id)', 'recuerda el avatarPath anterior'),
             ('teal', 'AvatarRepository', 'upload(photo)', 'nombre nuevo · devuelve el path'),
             ('indigo', 'ProfileRepository', 'updateAvatarPath(id, path)', 'el perfil apunta a la foto nueva'),
             ('teal', 'AvatarRepository', 'remove(oldPath)', 'solo si había una foto antes'),
             ('indigo', 'ProfileRepository', 'getProfile(id)', 'el perfil con su avatarUrl nueva')]
    for k, (color, repo, call, text) in enumerate(calls):
        soft, border, strong = FAM[color]
        y = 112 + k * 56
        s += chip(64, y + 20, k + 1, color)
        s += f'  <rect x="88" y="{y}" width="216" height="40" rx="8" fill="{soft}" stroke="{border}" stroke-width="1.25"/>\n'
        s += f'  <text class="mono" x="100" y="{y+20}" dy="0.35em" font-size="12.5" font-weight="700" fill="{strong}">{repo}</text>\n'
        s += f'  <rect x="316" y="{y}" width="260" height="40" rx="8" fill="#1F2430"/>\n'
        s += f'  <text class="mono" x="330" y="{y+20}" dy="0.35em" font-size="12.5" fill="#C9CFDA" data-fit="232">{call}</text>\n'
        s += f'  <text x="592" y="{y+20}" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">{text}</text>\n'
    s += '  ' + note(48, 456, 864, 'amber', 'Antes de subir, una regla del dominio', [
        'Si la foto pesa más de 2 MB, el caso de uso lanza su propio mensaje sin ir hasta Storage.'])
    return s + '</svg>\n'


FIGS['stLabCaso'] = st_lab_caso


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
