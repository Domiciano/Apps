"""Figuras SVG de la sección Storage: «Storage, CDN y caché» (0092), «Acceso a galería y cámara» (0066),
«Subir y mostrar archivos con Supabase Storage» (0067), «image_picker desde Clean Architecture» (0093)
y «Laboratorio 7 · Foto de perfil» (0069).

    python3 tools/storage_figuras.py <carpeta>     escribe un .svg por figura, para revisarlas
    python3 tools/storage_figuras.py --inject      reemplaza cada bloque ```svg de las cuatro lecciones
                                                   por la figura con el mismo id

No editar los SVG dentro del Markdown: se cambia este script y se vuelve a inyectar.
Colores: la base de datos en índigo, Storage en verde azulado, el CDN en violeta, lo que cambia en ámbar,
lo que se crea en verde y lo que se borra o falla en rosa.
"""

import math
import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from bloc_figuras import FAM, chip, head, note, phone, tail  # noqa: E402
from database_figuras import legend, table  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
LESSONS = ['lessonJ0.md', 'lessonJ1.md', 'lessonJ2.md', 'lessonJ2clean.md', 'lessonJ4.md']
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
         ['Cualquiera con la URL ve el archivo.', 'La URL no cambia: se puede guardar en caché.', 'Para logos, portadas o fotos de productos.']),
        ('violet', 'Bucket privado', "await createSignedUrl(path, 3600)", 'Storage revisa la política',
         '…/object/sign/documents/{path}?token=…', 'vence en 3600 s',
         ['Solo quien pasa la política obtiene la URL.', 'Cada firma es distinta y deja de servir al vencer.', 'Para fotos de perfil, recibos o documentos.']),
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
             'Tres operaciones contra dos servicios, en este orden. La URL para mostrarla se arma en el teléfono.',
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


def st_regla():
    fid, h = 'stRegla', 452
    s = head(fid, h, 'Una sola regla para un bucket privado', 'Una sola regla para un bucket privado',
             'Un bucket privado empieza cerrado. Una política abre todo a quien inició sesión, y a nadie más.',
             'A la izquierda, la política del bucket privado post-images: for all, to authenticated, using y with check bucket_id igual a post-images. A la '
             'derecha, dos columnas. Con sesión: subir, firmar una URL, ver la foto con esa URL y borrar, todo permitido. Sin '
             'sesión: subir responde 403, firmar responde Object not found y la URL pública responde 400. Abajo, lo que la '
             'regla no distingue: cualquiera con sesión puede borrar la imagen de otra persona.',
             colors=('green', 'rose'))
    s += f'  <rect x="48" y="108" width="400" height="200" rx="12" fill="#1F2430"/>\n'
    lines = [('create policy "post-images: autenticados"', '#C9CFDA'), ('on storage.objects', '#C9CFDA'),
             ('for all', '#F0C572'), ('to authenticated', '#86D3CA'), ("using (bucket_id = 'post-images')", '#A9B4F2'),
             ("with check (bucket_id = 'post-images');", '#A9B4F2')]
    for k, (ln, col) in enumerate(lines):
        s += f'  <text class="mono" x="66" y="{138 + k*28}" font-size="12.5" fill="{col}" data-fit="364">{ln}</text>\n'
    for k, (color, text) in enumerate([('amber', 'for all · subir, ver, firmar y borrar'),
                                       ('teal', 'to authenticated · solo con sesión'),
                                       ('indigo', 'bucket_id · solo en este bucket')]):
        s += legend(48, 336 + k * 24, color, text)
    cols = [('green', 'Con sesión', [('uploadBinary', '✓'), ('createSignedUrl', '✓'), ('GET de la URL firmada', '✓'),
                                     ('remove', '✓')]),
            ('rose', 'Sin sesión', [('uploadBinary', '403'), ('createSignedUrl', 'Object not found'),
                                    ('GET de la URL pública', '400'), ('remove', '0 archivos')])]
    for i, (color, title, rows) in enumerate(cols):
        soft, border, strong = FAM[color]
        x = 480 + i * 224
        s += panel(x, 108, 208, 240, color, title)
        for k, (op, res) in enumerate(rows):
            y = 172 + k * 44
            s += f'  <text class="mono" x="{x+14}" y="{y}" font-size="11.5" fill="#161A26" data-fit="180">{op}</text>\n'
            s += f'  <text x="{x+14}" y="{y+18}" font-size="12" font-weight="700" fill="{strong}" data-fit="180">{res}</text>\n'
    s += '  ' + note(480, 364, 432, 'amber', 'Lo que no distingue', [
        'Cualquiera con sesión puede borrar la imagen de otra persona.'])
    return s + '</svg>\n'


FIGS['stRegla'] = st_regla


# ───────────────────────── 0093 · image_picker desde Clean Architecture ─────────────────────────

KIND = {'view': ('#F4EBFF', '#C9A6EE', '#7439B8'), 'dom': ('#FFF3DC', '#F0C572', '#A96C05'),
        'contract': ('#FFFFFF', '#F0C572', '#A96C05'), 'entity': ('#FFFFFF', '#E3B95A', '#8A5A04'),
        'data': ('#E3F6F3', '#86D3CA', '#0F8478'), 'ext': ('#F4F5F8', '#9AA1B2', '#454C61'),
        'lib': ('#FFEBEF', '#F3A3B2', '#C2354F')}


def node(cx, cy, w, kind, text, h=30, fs=12.5, mono=True):
    soft, border, strong = KIND[kind]
    cls = 'class="mono" ' if mono else ''
    return (f'  <rect x="{cx-w/2:.0f}" y="{cy-h/2:.0f}" width="{w}" height="{h}" rx="8" fill="{soft}" stroke="{border}" stroke-width="1.75"/>'
            f'<text {cls}x="{cx:.0f}" y="{cy:.0f}" dy="0.35em" text-anchor="middle" font-size="{fs}" font-weight="700" fill="{strong}" data-fit="{w-12}">{text}</text>\n')


def arc_label(fid, key, cx, cy, r, a1, a2, text, ink, size=16):
    """Texto curvo sobre un anillo, de a1 a a2 en grados (0 a la derecha, positivo hacia abajo)."""
    x1, y1 = cx + r * math.cos(math.radians(a1)), cy + r * math.sin(math.radians(a1))
    x2, y2 = cx + r * math.cos(math.radians(a2)), cy + r * math.sin(math.radians(a2))
    sweep = 1 if a2 > a1 else 0
    pid = f'{fid}-arc-{key}'
    return (f'  <path id="{pid}" d="M{x1:.1f},{y1:.1f} A{r},{r} 0 0 {sweep} {x2:.1f},{y2:.1f}" fill="none"/>'
            f'<text font-size="{size}" font-weight="700" letter-spacing=".02em" fill="{ink}">'
            f'<textPath href="#{pid}" startOffset="50%" text-anchor="middle">{text}</textPath></text>\n')


def cl_preguntas():
    fid, h = 'clPreguntas', 412
    s = head(fid, h, 'Tres preguntas antes de usar una librería', 'Tres preguntas antes de usar una librería',
             'Sirven para cualquier paquete. Aquí, respondidas para image_picker.',
             'Tres tarjetas. Una: ¿con qué habla fuera de tu código? Con la galería del sistema, así que va en '
             'un DataSource, en el anillo de afuera. Dos: ¿qué tipos propios trae? XFile e ImageSource, que se quedan en '
             'ese DataSource; el dominio define el suyo, PickedPhoto. Tres: ¿qué necesita de verdad el '
             'caso de uso? Los bytes de la foto y su extensión, que es lo único que cruza al dominio.')
    cards = [
        ('slate', '¿Con qué habla fuera', 'de tu código?', 'Con la galería del sistema', 'del teléfono.',
         'teal', 'Va en un DataSource,', 'en el anillo de afuera.'),
        ('slate', '¿Qué tipos propios', 'trae?', 'XFile e ImageSource.', '',
         'rose', 'Se quedan en ese DataSource.', 'El dominio define el suyo.'),
        ('slate', '¿Qué necesita de verdad', 'el caso de uso?', 'Los bytes de la foto', 'y su extensión.',
         'amber', 'PickedPhoto: lo único', 'que cruza al dominio.'),
    ]
    w, gap = 272, 24
    for i, (_, q1, q2, a1, a2, color, c1, c2) in enumerate(cards):
        soft, border, strong = FAM[color]
        x = 48 + i * (w + gap)
        s += f'  <rect x="{x}" y="108" width="{w}" height="248" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>\n'
        s += '  ' + chip(x + 28, 138, i + 1, 'slate')
        s += f'  <text x="{x+50}" y="134" font-size="14.5" font-weight="700" fill="#161A26">{q1}</text>\n'
        s += f'  <text x="{x+50}" y="154" font-size="14.5" font-weight="700" fill="#161A26">{q2}</text>\n'
        s += f'  <text class="h" x="{x+20}" y="194">CON IMAGE_PICKER</text>\n'
        s += f'  <text x="{x+20}" y="218" font-size="13" fill="#454C61" data-fit="{w-40}">{a1}</text>\n'
        if a2:
            s += f'  <text x="{x+20}" y="237" font-size="13" fill="#454C61" data-fit="{w-40}">{a2}</text>\n'
        s += f'  <rect x="{x+12}" y="272" width="{w-24}" height="68" rx="10" fill="{soft}" stroke="{border}" stroke-width="1.5"/>\n'
        s += f'  <text x="{x+26}" y="298" font-size="13" font-weight="700" fill="{strong}" data-fit="{w-52}">{c1}</text>\n'
        s += f'  <text x="{x+26}" y="320" font-size="13" font-weight="700" fill="{strong}" data-fit="{w-52}">{c2}</text>\n'
    return s + tail(h, 'supabase_flutter responde igual: habla con Supabase, trae PostgrestException y StorageException, y vive en sus DataSource.')


FIGS['clPreguntas'] = cl_preguntas


def cl_circulo():
    fid, h = 'clCirculo', 990
    cx, cy = 480, 500
    s = head(fid, h, 'Dónde va cada pieza', 'Dónde va cada pieza',
             'image_picker y supabase_flutter quedan en el borde. El centro no sabe que existen.',
             'El diagrama circular de arquitectura limpia con cuatro anillos: afuera, en azul, Devices, UI y DB; luego, en verde, '
             'Presenters y Gateways; luego, en rojo, Use Cases; y en el centro, en amarillo, Entities. En una línea vertical, de '
             'arriba abajo: ProfilePage en UI, FeedBloc en Presenters, ChangeAvatarUseCase en Use Cases, '
             'PickedPhoto en Entities, el contrato AvatarRepository en Use Cases y AvatarRepositoryImpl en Gateways. Abajo, en '
             'el anillo de afuera, DevicePhotoDataSource y SupabaseAvatarDataSource. Fuera del círculo, la galería '
             'del teléfono, a la que se llega con image_picker, y Supabase Storage, a la que se llega con supabase_flutter.')
    for r, fill in [(380, '#6E93EC'), (282, '#6EE98A'), (182, '#EE7070'), (90, '#ECEE72')]:
        s += f'  <circle cx="{cx}" cy="{cy}" r="{r}" fill="#FFFFFF"/><circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}" fill-opacity="0.42" stroke="#FFFFFF" stroke-width="2"/>\n'
    for key, r, a1, a2, text, ink in [
        ('ui', 352, -150, -118, 'UI', '#1E2A55'), ('dev', 350, 162, 136, 'Devices', '#1E2A55'),
        ('db', 350, 64, 50, 'DB', '#1E2A55'), ('pre', 252, -162, -122, 'Presenters', '#1B4D2A'),
        ('gw', 252, 160, 126, 'Gateways', '#1B4D2A'), ('uc', 150, -172, -120, 'Use Cases', '#5A1A1A'),
    ]:
        s += arc_label(fid, key, cx, cy, r, a1, a2, text, ink)
    s += f'  <text x="{cx}" y="{cy+64}" text-anchor="middle" font-size="16" font-weight="700" fill="#4F4F14">Entities</text>\n'
    ds_y = cy + 318
    links = [(cy - 315, cy - 247), (cy - 217, cy - 151), (cy - 121, cy - 15), (cy + 15, cy + 121), (cy + 151, cy + 217)]
    for y1, y2 in links:
        s += f'  <path d="M{cx},{y1} V{y2}" stroke="#556074" stroke-width="1.5"/>\n'
    s += f'  <path d="M{cx},{cy+247} V{cy+272} H{cx-95} V{ds_y-15}" fill="none" stroke="#556074" stroke-width="1.5"/>\n'
    s += f'  <path d="M{cx},{cy+272} H{cx+95} V{ds_y-15}" fill="none" stroke="#556074" stroke-width="1.5"/>\n'
    s += node(cx, cy - 330, 150, 'view', 'ProfilePage')
    s += node(cx, cy - 232, 130, 'view', 'FeedBloc')
    s += node(cx, cy - 136, 200, 'dom', 'ChangeAvatarUseCase')
    s += node(cx, cy, 136, 'entity', 'PickedPhoto')
    s += node(cx, cy + 136, 170, 'contract', 'AvatarRepository')
    s += node(cx, cy + 232, 200, 'data', 'AvatarRepositoryImpl')
    s += node(cx - 95, ds_y, 182, 'data', 'DevicePhotoDataSource', fs=11.5)
    s += node(cx + 95, ds_y, 182, 'data', 'SupabaseAvatarDataSource', fs=11.5)
    by = 918
    for x, name, lib in [(cx - 300, 'Teléfono · galería', 'image_picker'),
                         (cx + 60, 'Supabase Storage', 'supabase_flutter')]:
        s += f'  <rect x="{x}" y="{by}" width="240" height="44" rx="12" fill="#F4F5F8" stroke="#9AA1B2" stroke-width="1.5" stroke-dasharray="6 4"/>\n'
        s += f'  <text x="{x+120}" y="{by+22}" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#454C61">{name}</text>\n'
    for x1, x2, lib in [(cx - 95, cx - 180, 'image_picker'), (cx + 95, cx + 180, 'supabase_flutter')]:
        s += f'  <path d="M{x1},{ds_y+15} V{ds_y+52} H{x2} V{by-2}" fill="none" stroke="#C2354F" stroke-width="1.75" stroke-dasharray="5 4"/>\n'
        lx = x2 + (-8 if x2 < cx else 8)
        anchor = 'end' if x2 < cx else 'start'
        s += f'  <text class="mono" x="{lx}" y="{by-14}" text-anchor="{anchor}" font-size="12.5" font-weight="700" fill="#C2354F">{lib}</text>\n'
    s += f'  <text x="48" y="{by+22}" dy="0.35em" font-size="12" fill="#79809A">fuera de la app</text>\n'
    return s + '</svg>\n'


FIGS['clCirculo'] = cl_circulo


def cl_frontera():
    fid, h = 'clFrontera', 476
    s = head(fid, h, 'La frontera: cada lado habla su idioma', 'La frontera: cada lado habla su idioma',
             'DevicePhotoDataSource traduce en los dos sentidos. Los tipos de image_picker no pasan de ahí.',
             'A la izquierda, DevicePhotoDataSource, en la capa de datos: es el único archivo con el import de image_picker y '
             'usa ImageSource y XFile. A la derecha, el dominio, sin ningún import de image_picker: pide pick() y recibe un '
             'PickedPhoto. En medio, una línea punteada: la frontera. Hacia adentro, pick() llega sin datos y el DataSource elige '
             'ImageSource.gallery. Hacia afuera, el XFile se traduce a un PickedPhoto con los bytes y la extensión.',
             colors=('rose', 'amber'))
    s += panel(48, 104, 404, 300, 'teal', 'DevicePhotoDataSource · datos')
    s += panel(560, 104, 352, 300, 'amber', 'Dominio')
    s += '  <path d="M506,96 V412" stroke="#9AA1B2" stroke-width="2" stroke-dasharray="7 5"/>\n'
    s += '  <text class="h" x="506" y="430" text-anchor="middle">LA FRONTERA</text>\n'
    s += code_bar(64, 160, 372, "import 'package:image_picker/…';", h=32)
    s += code_bar(576, 160, 320, '<tspan fill="#9AA1B2">sin imports de image_picker</tspan>', h=32)
    rows = [(236, 'ImageSource.gallery', 'pick()', 'entra: elige la galería', 'ar-amber', True),
            (330, 'XFile', 'PickedPhoto(bytes, extension)', 'sale y se traduce', 'ar-rose', False)]
    for y, left, right, verb, cls, inward in rows:
        s += node(250, y, 220, 'lib', left)
        s += node(736, y, 300, 'dom', right)
        if inward:
            s += f'  <path class="ar-amber" d="M584,{y} H364"/>\n'
        else:
            s += f'  <path class="ar-rose" d="M362,{y} H584"/>\n'
        s += f'  <rect x="394" y="{y-26}" width="158" height="20" rx="4" fill="#FBFBFD"/>\n'
        s += f'  <text x="473" y="{y-12}" text-anchor="middle" font-size="12" font-weight="700" fill="#454C61">{verb}</text>\n'
    s += f'  <text x="64" y="384" font-size="12.5" fill="#454C61">Los tipos de la librería, en rosa.</text>\n'
    s += f'  <text x="576" y="384" font-size="12.5" fill="#454C61">Los tipos propios, en ámbar.</text>\n'
    return s + tail(h, 'Si mañana cambias image_picker por otra librería, solo cambia este archivo. El caso de uso ni se entera.')


FIGS['clFrontera'] = cl_frontera


def cl_viaje():
    fid, h = 'clViaje', 668
    s = head(fid, h, 'El viaje de una foto de la galería', 'El viaje de una foto de la galería',
             'Baja como pick(), sin datos, y sube como PickedPhoto. image_picker solo aparece en el último tramo.',
             'Un diagrama de secuencia con seis columnas: ProfilePage, FeedBloc, ChangeAvatarUseCase, AvatarRepositoryImpl, '
             'DevicePhotoDataSource y la galería del teléfono. Bajan, de izquierda a derecha: el evento AvatarChangeRequested, '
             'la llamada al caso de uso, pick en el repositorio, pick en el DataSource y pickImage con '
             'ImageSource.gallery hacia la galería. Suben de vuelta: la galería devuelve un XFile, el DataSource lo convierte en '
             'PickedPhoto y ese PickedPhoto llega al caso de uso, que sube la foto, guarda el path y borra la anterior. Luego '
             'el caso de uso devuelve el Profile al Bloc, que emite el estado con la foto nueva para ProfilePage.',
             colors=('amber', 'rose', 'violet', 'teal'))
    cols = [('view', 'ProfilePage', ''), ('view', 'FeedBloc', ''), ('dom', 'ChangeAvatar', 'UseCase'),
            ('data', 'AvatarRepository', 'Impl'), ('data', 'DevicePhoto', 'DataSource'), ('ext', 'Galería', '')]
    xs = [120 + i * 144 for i in range(6)]
    for x, (kind, l1, l2) in zip(xs, cols):
        soft, border, strong = KIND[kind]
        s += f'  <path d="M{x},144 V{h-60}" stroke="#D9DEE8" stroke-width="1.5" stroke-dasharray="4 4"/>\n'
        s += f'  <rect x="{x-68}" y="102" width="136" height="42" rx="8" fill="{soft}" stroke="{border}" stroke-width="1.75"/>\n'
        lines = [l1, l2] if l2 else [l1]
        for i, ln in enumerate(lines):
            ly = 123 + (i * 15 - 7.5 if l2 else 0)
            s += f'  <text class="mono" x="{x}" y="{ly:.1f}" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="{strong}" data-fit="124">{ln}</text>\n'
    msgs = [
        (0, 1, 'AvatarChangeRequested', 'violet', False), (1, 2, 'call()', 'amber', False),
        (2, 3, 'pick()', 'amber', False), (3, 4, 'pick()', 'amber', False),
        (4, 5, 'pickImage(ImageSource.gallery)', 'rose', False), (5, 4, 'XFile', 'rose', True),
        (4, 3, 'PickedPhoto', 'amber', True), (3, 2, 'PickedPhoto', 'amber', True),
        (2, 1, 'Profile', 'amber', True), (1, 0, 'FeedState(profile)', 'violet', True),
    ]
    y = 186
    for k, (a, b, label, color, back) in enumerate(msgs):
        _, _, strong = FAM[color]
        x1, x2 = xs[a], xs[b]
        dash = ' stroke-dasharray="6 4"' if back else ''
        end = x2 - 4 if x2 > x1 else x2 + 4
        s += f'  <path class="ar-{color}" d="M{x1},{y} H{end}"{dash}/>\n'
        s += f'  <text class="mono" x="{(x1+x2)/2:.0f}" y="{y-8}" text-anchor="middle" font-size="11.5" font-weight="700" fill="{strong}">{label}</text>\n'
        y += 40
        if k == 7:
            s += f'  <rect x="{xs[2]-120}" y="{y-14}" width="240" height="40" rx="8" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>\n'
            s += f'  <text x="{xs[2]}" y="{y+6}" dy="0.35em" text-anchor="middle" font-size="12" fill="#A96C05" font-weight="700">sube, apunta y borra · Storage</text>\n'
            y += 52
    s += legend(48, h - 30, 'amber', 'tipos del dominio')
    s += legend(220, h - 30, 'rose', 'tipos de image_picker')
    s += legend(420, h - 30, 'violet', 'eventos y estados del Bloc')
    return s + '</svg>\n'


FIGS['clViaje'] = cl_viaje


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
             'La cámara del perfil abre la galería del teléfono. La foto elegida aparece en el perfil y en cada post tuyo.',
             'Tres teléfonos. El primero es ProfilePage con la foto de Ana, un botón de cámara sobre la foto y sus últimos posts. '
             'El segundo es la galería del sistema, que abre image_picker: una cuadrícula de fotos para elegir una. El tercero es '
             'FeedPage: cada post muestra la foto de su autor, y quien no tiene foto muestra su inicial.',
             colors=('violet',))
    pw, ph, py = 232, 420, 132
    xs = [48, 364, 680]
    labels = [('HomeScreen', 'ProfilePage'), ('image_picker', 'galería del sistema'), ('HomeScreen', 'FeedPage')]
    for x, (screen, page) in zip(xs, labels):
        s += f'  <text class="mono" x="{x+pw/2:.0f}" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#7439B8">{screen} <tspan fill="#0F8478">· {page}</tspan></text>\n'
    x = xs[0]
    s += '  ' + phone(x, py, pw, ph, 'Perfil')
    s += photo(x + pw / 2 - 40, py + 58, 80, 2)
    s += f'  <circle cx="{x+pw/2+34:.0f}" cy="{py+130}" r="15" fill="#1F9D68"/>\n'
    s += (f'  <path transform="translate({x+pw/2+26:.0f},{py+123})" d="M0,3 H4 L6,0 H10 L12,3 H16 V14 H0 Z" fill="none" '
          f'stroke="#FFFFFF" stroke-width="1.5"/><circle cx="{x+pw/2+34:.0f}" cy="{py+131}" r="3.2" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>\n')
    s += f'  <text x="{x+pw/2:.0f}" y="{py+164}" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#161A26">Ana Gómez</text>\n'
    s += f'  <text x="{x+pw/2:.0f}" y="{py+182}" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#79809A">@ana.dev</text>\n'
    s += mini_post(x + 16, py + 204, pw - 32, 2, 'ana.dev', 'Mi primer post')
    s += mini_post(x + 16, py + 270, pw - 32, 2, 'ana.dev', 'Hoy vimos Storage')
    gx = xs[1]
    s += '  ' + phone(gx, py, pw, ph, 'Recientes')
    tile, gap = 62, 8
    for r in range(4):
        for c in range(3):
            tx, ty = gx + 16 + c * (tile + gap), py + 58 + r * (tile + gap)
            if r == 1 and c == 1:
                s += photo(tx, ty, tile, 2)
                s += f'  <rect x="{tx-3}" y="{ty-3}" width="{tile+6}" height="{tile+6}" rx="13" fill="none" stroke="#1F9D68" stroke-width="3"/>\n'
            else:
                shade = ['#E4E7EE', '#D9DEE8', '#EFF1F5'][(r + c) % 3]
                s += f'  <rect x="{tx}" y="{ty}" width="{tile}" height="{tile}" rx="8" fill="{shade}"/>\n'
    s += f'  <text x="{gx+pw/2:.0f}" y="{py+ph-40}" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#79809A">no es de la app: la abre el sistema</text>\n'
    fx = xs[2]
    s += '  ' + phone(fx, py, pw, ph, 'Muro')
    for k, (n, u, t_) in enumerate([(2, 'ana.dev', 'Hoy vimos Storage'), (1, 'juanpa', 'Mi foto nueva!'),
                                    (0, 'lu.mora', 'Aún sin foto'), (2, 'ana.dev', 'Mi primer post')]):
        s += mini_post(fx + 16, py + 58 + k * 68, pw - 32, n, u, t_)
    s += f'  <path class="ar-violet" d="M{xs[0]+pw/2+50:.0f},{py+130} C{xs[0]+pw+20:.0f},{py+130} {xs[1]-40:.0f},{py+200} {gx-6},{py+200}"/>\n'
    s += f'  <path class="ar-violet" d="M{gx+pw+6},{py+200} C{xs[2]-40:.0f},{py+200} {xs[2]-40:.0f},{py+90} {fx-6},{py+90}"/>\n'
    return s + tail(h, 'Mientras sube, la foto del perfil muestra un indicador de carga. Si algo falla, un SnackBar dice por qué.')


FIGS['stLabPantallas'] = st_lab_pantallas


def st_lab_modelo():
    fid, h = 'stLabModelo', 432
    s = head(fid, h, 'Lo que agrega la parte 1', 'Lo que agrega la parte 1',
             'Un bucket público, declarado en config.toml. La columna y la regla van en una migración.',
             'A la izquierda, la tabla profiles con su nueva columna avatar_path, que puede ser nula. A la derecha, el bucket '
             'avatars declarado en config.toml: público, con un límite de 2 MB por archivo y solo imágenes JPEG, PNG o WebP; lo '
             'crea npx supabase seed buckets --linked. Debajo, una sola política para usuarios con sesión, sobre todo el bucket.',
             colors=('amber',))
    t, c = table(48, 112, 360, 'indigo', 'profiles', [
        ('id', '', 'PK · FK', None), ('username', '', '', None), ('full_name', '', '', None),
        ('avatar_path', 'text · puede ser null', '', 'amber')], vx=124)
    s += t
    s += panel(456, 112, 456, 168, 'teal', 'bucket avatars')
    s += f'  <text class="mono" x="896" y="132" dy="0.35em" text-anchor="end" font-size="11.5" fill="#454C61">config.toml</text>\n'
    for k, (badge_txt, text) in enumerate([('público', 'cualquiera lee por URL'), ('2 MiB', 'tamaño máximo por archivo'),
                                           ('jpeg · png · webp', 'los únicos tipos que acepta')]):
        y = 176 + k * 32
        s += badge(472, y, 'teal', badge_txt, 132)
        s += f'  <text x="620" y="{y}" dy="0.35em" font-size="12.5" fill="#454C61">{text}</text>\n'
    s += f'  <path class="ar-amber" d="M408,{c[3]:.0f} H432 V196 H454"/>\n'
    s += f'  <text class="h" x="456" y="314">LA MIGRACIÓN · UNA SOLA POLÍTICA</text>\n'
    s += code_bar(456, 328, 456, 'for all to authenticated · bucket_id = \'avatars\'', h=40)
    s += '  ' + note(48, 310, 360, 'amber', 'avatar_path empieza en null', [
        'Quien no ha subido foto no tiene path:', 'la app muestra la inicial del nombre.'])
    return s + tail(h, 'La parte 2 repite lo mismo con un bucket privado, post-images, y una columna image_path en posts.')


FIGS['stLabModelo'] = st_lab_modelo


def st_lab_carpetas():
    fid = 'stLabCarpetas'
    rows = [
        (0, 'lib/', 'slate', '', ''),
        (1, 'components/avatar.dart', 'slate', 'Ya viene: la foto redonda o la inicial', ''),
        (1, 'features/', 'slate', '', ''),
        (2, 'avatar/domain/', 'slate', 'Ya viene: entidades y AvatarRepository', ''),
        (3, 'usecases/change_avatar_usecase.dart', 'amber', 'call · vacío', '1'),
        (2, 'avatar/data/', 'slate', '', ''),
        (3, 'source/device_photo_data_source.dart', 'teal', 'pick · vacío', '1'),
        (3, 'source/supabase_avatar_data_source.dart', 'teal', 'upload y remove · vacíos', '1'),
        (3, 'repository/avatar_repository_impl.dart', 'teal', 'los tres · vacíos', '1'),
        (2, 'auth/data/', 'slate', 'Ya viene: el Laboratorio 5', ''),
        (3, 'source/supabase_profile_data_source.dart', 'teal', 'updateAvatarPath vacío · URL pública', '1'),
        (2, 'posts/domain/usecases/', 'slate', '', ''),
        (3, 'pick_post_image_usecase.dart', 'amber', 'call · vacío', '2'),
        (3, 'publish_post_usecase.dart', 'amber', 'Del Lab 6 · subir la foto', '2'),
        (2, 'posts/data/', 'slate', '', ''),
        (3, 'source/supabase_post_data_source.dart', 'teal', 'avatar_path · image_path firmado', '1 · 2'),
        (3, 'source/supabase_post_image_data_source.dart', 'teal', 'upload · vacío', '2'),
        (3, 'repository/post_repository_impl.dart', 'teal', 'pickImage y uploadImage · vacíos', '2'),
        (2, 'home/ui/bloc/feed_bloc.dart', 'violet', 'el on de la foto solo imprime', '1'),
        (2, 'home/ui/screens/home_screen.dart', 'violet', 'onChangePhoto: () {}', '1'),
        (2, 'compose/ui/bloc/compose_bloc.dart', 'violet', 'los on de la foto solo imprimen', '2'),
        (2, 'compose/ui/screens/compose_screen.dart', 'violet', 'Agregar foto: () {}', '2'),
    ]
    y0, rh = 112, 34
    h = y0 + rh * len(rows) + 64
    s = head(fid, h, 'La estructura de carpetas', 'La estructura de carpetas',
             'En gris lo que ya viene hecho. Con número, la parte del laboratorio en la que lo completas.',
             'Árbol de carpetas del proyecto Apps262Lab7. Ya vienen el componente Avatar, las entidades, '
             'los contratos y toda la interfaz. Marcados con 1, los archivos de la parte 1: ChangeAvatarUseCase, los dos data '
             'sources de la foto, AvatarRepositoryImpl, el data source de perfiles, el de posts, FeedBloc y el botón de HomeScreen. Marcados con 2, los de '
             'la parte 2: PickPostImageUseCase, PublishPostUseCase, el data source de imágenes de posts, PostRepositoryImpl, el '
             'data source de posts, ComposeBloc y el botón de ComposeScreen.')
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
            s += ('  ' + chip(886, y, step)) if len(step) == 1 else badge(846, y, 'amber', step, 52)
    s += '  <text class="h" x="898" y="88" text-anchor="end">PARTE</text>\n'
    return s + tail(h, 'main.dart no cambia: cada Bloc crea sus casos de uso, y cada capa crea la siguiente.')


FIGS['stLabCarpetas'] = st_lab_carpetas


def st_lab_caso():
    fid, h = 'stLabCaso', 520
    s = head(fid, h, 'Lo que hace ChangeAvatarUseCase', 'Lo que hace ChangeAvatarUseCase',
             'Seis llamadas a dos repositorios. Si la persona cancela, termina en la primera.',
             'Una lista numerada con el repositorio de cada llamada. 1, AvatarRepository.pick: si devuelve null, termina. 2, '
             'ProfileRepository.getProfile para recordar el path anterior. 3, AvatarRepository.upload sube los bytes con un nombre '
             'nuevo y devuelve el path. 4, ProfileRepository.updateAvatarPath guarda ese path. 5, AvatarRepository.remove borra el '
             'archivo anterior, si había. 6, ProfileRepository.getProfile devuelve el perfil con la URL nueva.')
    calls = [('teal', 'AvatarRepository', 'pick()', 'null si la persona cancela: no sigue'),
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


def st_lab_composer():
    fid, h = 'stLabComposer', 600
    s = head(fid, h, 'Parte 2 · Un post con imagen', 'Parte 2 · Un post con imagen',
             'El composer adjunta la foto y la muestra antes de publicar. Al publicar, primero sube la foto y después crea el post.',
             'Dos teléfonos y una lista. El primero es ComposeScreen con el texto escrito, la vista previa de la foto con un '
             'botón para quitarla y el botón Publicar. El segundo es el muro con el post publicado: autor, texto y la imagen '
             'debajo. A la derecha, lo que hace PublishPostUseCase en orden: valida que haya texto o foto, sube la foto al '
             'bucket post-images y recibe su path, y crea el post con content e image_path.',
             colors=('violet',))
    pw, ph, py = 232, 420, 132
    xs = [48, 316]
    for x, (screen, page) in zip(xs, [('ComposeScreen', ''), ('HomeScreen', 'FeedPage')]):
        s += f'  <text class="mono" x="{x+pw/2:.0f}" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#7439B8">{screen}' \
             + (f' <tspan fill="#0F8478">· {page}</tspan>' if page else '') + '</text>\n'
    cx = xs[0]
    s += '  ' + phone(cx, py, pw, ph, 'Nuevo post')
    s += f'  <rect x="{cx+16}" y="{py+58}" width="{pw-32}" height="70" rx="8" fill="#F5F6FA" stroke="#4453C9" stroke-width="1.5"/>\n'
    s += f'  <text x="{cx+26}" y="{py+78}" dy="0.35em" font-size="12" fill="#161A26">Atardecer desde la U</text>\n'
    s += f'  <rect x="{cx+16}" y="{py+142}" width="{pw-32}" height="140" rx="10" fill="#FFE3CC" stroke="#C2571A" stroke-width="1.5"/>\n'
    s += f'  <circle cx="{cx+pw/2-30:.0f}" cy="{py+196}" r="18" fill="#F5A35C"/>\n'
    s += f'  <path d="M{cx+24},{py+272} L{cx+90},{py+214} L{cx+130},{py+246} L{cx+170},{py+206} L{cx+pw-24},{py+272} Z" fill="#C2571A" fill-opacity=".55"/>\n'
    s += f'  <circle cx="{cx+pw-36}" cy="{py+162}" r="13" fill="#FFFFFF" stroke="#C2571A" stroke-width="1.5"/>\n'
    s += f'  <text x="{cx+pw-36}" y="{py+162}" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#C2571A">×</text>\n'
    s += f'  <rect x="{cx+16}" y="{py+300}" width="{pw-32}" height="34" rx="17" fill="#1F9D68"/>\n'
    s += f'  <text x="{cx+pw/2:.0f}" y="{py+317}" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#FFFFFF">Publicar</text>\n'
    s += f'  <text x="{cx+pw/2:.0f}" y="{py+356}" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#79809A">sin foto: botón Agregar foto</text>\n'
    fx = xs[1]
    s += '  ' + phone(fx, py, pw, ph, 'Muro')
    s += f'  <rect x="{fx+16}" y="{py+58}" width="{pw-32}" height="236" rx="8" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>\n'
    s += photo(fx + 24, py + 66, 28, 2)
    s += f'  <text x="{fx+60}" y="{py+80}" dy="0.35em" font-size="11" font-weight="700" fill="#161A26">@ana.dev</text>\n'
    s += f'  <text x="{fx+28}" y="{py+112}" dy="0.35em" font-size="11.5" fill="#454C61">Atardecer desde la U</text>\n'
    s += f'  <rect x="{fx+28}" y="{py+128}" width="{pw-56}" height="130" rx="10" fill="#FFE3CC" stroke="#C2571A" stroke-width="1.25"/>\n'
    s += f'  <circle cx="{fx+pw/2-26:.0f}" cy="{py+176}" r="16" fill="#F5A35C"/>\n'
    s += f'  <path d="M{fx+34},{py+250} L{fx+92},{py+196} L{fx+128},{py+226} L{fx+164},{py+190} L{fx+pw-34},{py+250} Z" fill="#C2571A" fill-opacity=".55"/>\n'
    s += f'  <text x="{fx+28}" y="{py+278}" dy="0.35em" font-size="11" fill="#C2354F">♥ 0</text>\n'
    s += f'  <path class="ar-violet" d="M{cx+pw+4},{py+317} H{fx-6}"/>\n'
    rx = 588
    s += f'  <text class="h" x="{rx}" y="146">PUBLISHPOSTUSECASE, EN ORDEN</text>\n'
    steps = [('slate', 'Valida', 'texto o foto · máximo 280'), ('teal', 'uploadImage(photo)', 'sube a post-images · path'),
             ('indigo', 'create(text, imagePath: path)', 'inserta en posts')]
    for k, (color, code, sub) in enumerate(steps):
        soft, border, strong = FAM[color]
        y = 166 + k * 96
        s += chip(rx + 12, y + 30, k + 1, color)
        s += f'  <rect x="{rx+34}" y="{y}" width="290" height="60" rx="10" fill="{soft}" stroke="{border}" stroke-width="1.5"/>\n'
        mono = '' if k == 0 else 'class="mono" '
        s += f'  <text {mono}x="{rx+48}" y="{y+22}" dy="0.35em" font-size="12.5" font-weight="700" fill="{strong}" data-fit="264">{code}</text>\n'
        s += f'  <text x="{rx+48}" y="{y+42}" dy="0.35em" font-size="12" fill="#454C61" data-fit="264">{sub}</text>\n'
        if k:
            s += f'  <path class="link" d="M{rx+179},{y-34} V{y-2}"/>\n'
    s += '  ' + note(rx, 462, 324, 'amber', 'La foto sube primero', [
        'Si sube y el insert falla, sobra un archivo.', 'Al revés quedaría un post sin su imagen.'])
    return s + '</svg>\n'


FIGS['stLabComposer'] = st_lab_composer


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
