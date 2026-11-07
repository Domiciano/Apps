"""Figuras SVG de la sección Deploy: «Distribuir con Firebase App Distribution» (0095),
«Generación de artefactos: AAB e IPA» (0080), «Publicar en Google Play» (0082) y
«Publicar en App Store» (0083).

    python3 tools/deploy_figuras.py <carpeta>     escribe un .svg por figura, para revisarlas
    python3 tools/deploy_figuras.py --inject      reemplaza cada bloque ```svg de las cuatro lecciones
                                                  por la figura con el mismo id

No editar los SVG dentro del Markdown: se cambia este script y se vuelve a inyectar.
Los paneles son esquemas de las pantallas, sin logos: lo que importa es dónde está cada campo
y en qué orden se llena. Colores por herramienta: Firebase ámbar, Google Play verde, Xcode gris,
App Store Connect índigo y Transporter violeta. Los pasos van numerados con círculos rosa.
"""

import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from bloc_figuras import FAM, box, head, note, tail  # noqa: E402
from storage_figuras import badge, file_icon, folder_icon  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
LESSONS = ['lessonM0.md', 'lessonM1.md', 'lessonM3.md', 'lessonM4.md']
FIGS = {}
INK, MUTED, LINE = '#161A26', '#79809A', '#D9DEE8'


# ───────────────────────── piezas de los paneles ─────────────────────────

def text(x, y, s, size=12.5, fill='#454C61', weight=400, anchor='start', mono=False, fit=None):
    cls = ' class="mono"' if mono else ''
    fit = f' data-fit="{fit}"' if fit else ''
    return (f'  <text{cls} x="{x}" y="{y}" dy="0.35em" font-size="{size}" font-weight="{weight}" fill="{fill}" '
            f'text-anchor="{anchor}"{fit}>{s}</text>\n')


def window(x, y, w, h, product, color):
    soft, border, strong = FAM[color]
    o = f'  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="#FFFFFF" stroke="{LINE}" stroke-width="1.5"/>\n'
    o += (f'  <path d="M{x},{y+34} V{y+12} A12,12 0 0 1 {x+12},{y} H{x+w-12} A12,12 0 0 1 {x+w},{y+12} V{y+34} Z" '
          f'fill="{soft}" stroke="{border}" stroke-width="1.5"/>\n')
    for i, c in enumerate(('#F14C4C', '#E5C07B', '#6BCB77')):
        o += f'  <circle cx="{x+20+i*15}" cy="{y+17}" r="4.5" fill="{c}"/>'
    o += '\n' + text(x + w / 2, y + 17, product, 13, strong, 700, 'middle', fit=w - 140)
    return o


def sidebar(x, y, w, h, items, active, color):
    """items: lista de rótulos; los que empiezan con '  ' van sangrados y los que empiezan con '#' son títulos."""
    soft, border, strong = FAM[color]
    o = f'  <rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#F7F8FA"/>\n'
    o += f'  <path d="M{x+w},{y} V{y+h}" stroke="{LINE}" stroke-width="1.25"/>\n'
    cy = y + 22
    for item in items:
        if item.startswith('#'):
            o += text(x + 14, cy, item[1:].upper(), 10.5, MUTED, 700, fit=w - 24)
            cy += 26
            continue
        indent = 26 if item.startswith('  ') else 14
        label = item.strip()
        if item.lstrip() == active:
            o += f'  <rect x="{x+6}" y="{cy-13}" width="{w-12}" height="26" rx="7" fill="{soft}"/>'
            o += f'<rect x="{x+6}" y="{cy-13}" width="4" height="26" rx="2" fill="{strong}"/>\n'
            o += text(x + indent + 4, cy, label, 12.5, strong, 700, fit=w - indent - 14)
        else:
            o += text(x + indent + 4, cy, label, 12.5, '#454C61', fit=w - indent - 14)
        cy += 30
    return o


def field(x, y, w, label, value, hint=None, h=30, mono=False, empty=False):
    o = text(x, y, label, 12, '#556074', 700, fit=w)
    o += f'  <rect x="{x}" y="{y+12}" width="{w}" height="{h}" rx="7" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>\n'
    o += text(x + 10, y + 12 + 15, value, 12.5, '#9AA1B5' if empty else INK, mono=mono, fit=w - 20)
    if hint:
        o += text(x + w, y, hint, 11, MUTED, anchor='end')
    return o


def select(x, y, w, label, value):
    o = field(x, y, w, label, value)
    return o + f'  <path d="M{x+w-22},{y+24} l6,6 l6,-6" fill="none" stroke="#556074" stroke-width="1.75"/>\n'


def option(x, y, label, on, kind='radio', color='green', fit=None):
    _, _, strong = FAM[color]
    if kind == 'radio':
        o = f'  <circle cx="{x+8}" cy="{y}" r="7.5" fill="#FFFFFF" stroke="{strong if on else "#9AA1B5"}" stroke-width="1.75"/>'
        if on:
            o += f'<circle cx="{x+8}" cy="{y}" r="4" fill="{strong}"/>'
    else:
        o = (f'  <rect x="{x+1}" y="{y-7}" width="14" height="14" rx="3" fill="{strong if on else "#FFFFFF"}" '
             f'stroke="{strong if on else "#9AA1B5"}" stroke-width="1.75"/>')
        if on:
            o += f'<path d="M{x+4},{y} l3,3 l6,-6" fill="none" stroke="#FFFFFF" stroke-width="2"/>'
    return o + '\n' + text(x + 24, y, label, 12.5, INK, fit=fit)


def button(x, y, label, color, solid=True, w=None):
    soft, border, strong = FAM[color]
    w = w or round(len(label) * 7.3 + 30)
    fill, ink, stroke = (strong, '#FFFFFF', strong) if solid else ('#FFFFFF', strong, border)
    return (f'  <rect x="{x}" y="{y}" width="{w}" height="30" rx="15" fill="{fill}" stroke="{stroke}" stroke-width="1.5"/>\n'
            + text(x + w / 2, y + 15, label, 12.5, ink, 700, 'middle'))


def drop(x, y, w, h, line1, line2=''):
    o = (f'  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="#F7F8FA" stroke="#9AA1B5" '
         f'stroke-width="1.5" stroke-dasharray="6 5"/>\n')
    cy = y + h / 2 - (8 if line2 else 0)
    o += f'  <path d="M{x+w/2},{cy-14} v-12 m-6,6 l6,-6 l6,6" fill="none" stroke="#556074" stroke-width="1.75"/>\n'
    o += text(x + w / 2, cy, line1, 12.5, INK, 700, 'middle', fit=w - 20)
    if line2:
        o += text(x + w / 2, cy + 18, line2, 11.5, MUTED, anchor='middle', fit=w - 20)
    return o


def step(x, y, n):
    soft, border, strong = FAM['rose']
    return (f'  <circle cx="{x}" cy="{y}" r="11" fill="{strong}"/>'
            f'<text x="{x}" y="{y}" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" '
            f'fill="#FFFFFF">{n}</text>\n')


def picture(x, y, w, h, label, color='slate'):
    soft, border, strong = FAM[color]
    o = f'  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{soft}" stroke="{border}" stroke-width="1.5"/>\n'
    o += (f'  <path d="M{x+w*0.18:.0f},{y+h*0.78:.0f} L{x+w*0.4:.0f},{y+h*0.45:.0f} L{x+w*0.58:.0f},{y+h*0.66:.0f} '
          f'L{x+w*0.7:.0f},{y+h*0.55:.0f} L{x+w*0.84:.0f},{y+h*0.78:.0f} Z" fill="{border}"/>\n')
    if label:
        o += text(x + w / 2, y + h + 14, label, 11, MUTED, anchor='middle')
    return o


def mini_phone(x, y, w, h, title, color='slate'):
    soft, border, strong = FAM[color]
    return (f'  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="20" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/>\n'
            f'  <rect x="{x+w/2-22:.0f}" y="{y+8}" width="44" height="6" rx="3" fill="#2A3040"/>\n'
            + text(x + 16, y + 34, title, 13, strong, 700, fit=w - 28)
            + f'  <path d="M{x+2},{y+50} H{x+w-2}" stroke="{LINE}" stroke-width="1.25"/>\n')


def arrow(x1, y1, x2, y2):
    return f'  <path class="link" d="M{x1},{y1} L{x2},{y2}"/>\n'


def tab_bar(x, y, labels, active, color):
    _, _, strong = FAM[color]
    o = ''
    cx = x
    for label in labels:
        w = len(label) * 7.2 + 20
        on = label == active
        o += text(cx + 10, y, label, 12.5, strong if on else '#556074', 700 if on else 400)
        if on:
            o += f'  <rect x="{cx+6}" y="{y+13}" width="{w-12:.0f}" height="3" rx="1.5" fill="{strong}"/>\n'
        cx += w + 6
    return o


# ───────────────────────── 0095 · Firebase App Distribution ─────────────────────────

def dp_flujo():
    fid, h = 'dpFlujo', 330
    s = head(fid, h, 'Del computador al teléfono de quien prueba', 'Del computador al teléfono de quien prueba',
             'Sin tienda y sin revisión: subes un APK y Firebase les avisa por correo a tus testers.',
             'Cuatro cajas de izquierda a derecha. Tu computador genera app-release.apk con flutter build apk. '
             'Lo subes a Firebase App Distribution y eliges un grupo de testers. Cada tester recibe un correo de '
             'invitación. En su teléfono acepta, descarga e instala la app.')
    xs = [48, 280, 512, 744]
    data = [('slate', 'Tu computador', 'flutter build apk'), ('amber', 'App Distribution', 'subes el APK'),
            ('rose', 'Correo', 'invitación al grupo'), ('green', 'Teléfono', 'descarga e instala')]
    for x, (c, t, sub) in zip(xs, data):
        s += box(x, 130, 168, 70, c, t, sub, mono=False, fs=14.5)
    for x in xs[:-1]:
        s += arrow(x + 172, 165, x + 226, 165)
    s += note(48, 228, 400, 'amber', 'Para qué sirve', ['Que el profesor o tus compañeros prueben la app', 'antes de publicarla, en sus propios teléfonos.'])
    s += note(512, 228, 400, 'slate', 'Qué necesitas', ['El proyecto de Firebase de las notificaciones push', 'y los correos de quienes van a probar.'])
    return s + '</svg>\n'


FIGS['dpFlujo'] = dp_flujo


def dp_consola():
    fid, h = 'dpConsola', 560
    s = head(fid, h, 'App Distribution en la consola de Firebase', 'App Distribution en la consola de Firebase',
             'Sube el APK, elige el grupo, escribe qué cambió y distribuye.',
             'Esquema de la consola de Firebase. En el menú lateral está seleccionado App Distribution. Arriba se '
             'elige la app Android. En la pestaña Versiones hay una zona para arrastrar el APK (paso 1). Debajo, la '
             'versión subida con el campo Testers y grupos, donde va el grupo clase (paso 2), las notas de la versión '
             '(paso 3) y el botón Distribuir (paso 4).')
    s += window(48, 104, 864, 432, 'Consola de Firebase · tu proyecto', 'amber')
    s += sidebar(48, 138, 190, 398, ['#Compilación', 'Authentication', 'Cloud Messaging', '#Lanzamiento',
                                      'App Distribution', 'Crashlytics', 'Test Lab'], 'App Distribution', 'amber')
    x = 262
    s += text(x, 164, 'App Distribution', 17, INK, 700)
    s += badge(700, 164, 'amber', 'Android · co.edu.icesi.miapp', w=188)
    s += tab_bar(x - 10, 198, ['Versiones', 'Testers y grupos', 'Invitaciones'], 'Versiones', 'amber')
    s += f'  <path d="M{x},216 H888" stroke="{LINE}" stroke-width="1.25"/>\n'
    s += drop(x, 230, 626, 86, 'Arrastra aquí app-release.apk', 'o haz clic para buscarlo')
    s += step(x + 626, 230, 1)
    s += f'  <rect x="{x}" y="332" width="626" height="186" rx="10" fill="#FFFFFF" stroke="{LINE}" stroke-width="1.25"/>\n'
    s += text(x + 16, 352, 'Versión 1.0.0 (1) · subida', 13, INK, 700)
    s += field(x + 16, 374, 290, 'Testers y grupos', '')
    s += badge(x + 28, 401, 'amber', 'clase ×', w=64)
    s += step(x + 306, 374, 2)
    s += field(x + 326, 374, 284, 'Notas de la versión', 'Primera versión para la clase')
    s += step(x + 610, 374, 3)
    s += text(x + 16, 448, 'Cada tester del grupo recibe un correo con el enlace.', 12, MUTED)
    s += button(x + 486, 470, 'Distribuir', 'amber', w=124)
    s += step(x + 610, 470, 4)
    return s + '</svg>\n'


FIGS['dpConsola'] = dp_consola


def dp_tester():
    fid, h = 'dpTester', 470
    s = head(fid, h, 'Lo que ve quien prueba', 'Lo que ve quien prueba',
             'Tres pantallas en el teléfono del tester, de izquierda a derecha.',
             'Tres teléfonos. En el primero, el correo de Firebase: te invitaron a probar MiApp, con el botón '
             'Comenzar. En el segundo, la página de App Distribution en el navegador con la versión 1.0.0 y el botón '
             'Descargar. En el tercero, el aviso de Android: para instalar hay que permitir apps de esta fuente, y '
             'luego Instalar.')
    xs = [48, 368, 688]
    titles = ['Correo', 'Navegador', 'Android']
    for x, t in zip(xs, titles):
        s += mini_phone(x, 104, 224, 320, t, 'amber' if t != 'Android' else 'green')
    x = xs[0]
    s += text(x + 16, 176, 'Firebase App Distribution', 11.5, MUTED)
    s += text(x + 16, 202, 'Te invitaron a probar', 14, INK, 700)
    s += text(x + 16, 222, 'MiApp', 14, INK, 700)
    s += text(x + 16, 252, 'Acepta la invitación para', 12, '#454C61')
    s += text(x + 16, 270, 'descargar la versión.', 12, '#454C61')
    s += button(x + 16, 296, 'Comenzar', 'amber', w=110)
    s += step(x + 136, 311, 1)
    x = xs[1]
    s += text(x + 16, 176, 'MiApp', 14, INK, 700)
    s += text(x + 16, 196, 'Iniciaste sesión con tu correo', 11.5, MUTED)
    s += f'  <rect x="{x+16}" y="220" width="192" height="92" rx="10" fill="#FFFFFF" stroke="{LINE}" stroke-width="1.25"/>\n'
    s += text(x + 30, 242, '1.0.0 (1)', 13, INK, 700, mono=True)
    s += text(x + 30, 262, 'Primera versión para la clase', 11, MUTED)
    s += button(x + 30, 274, 'Descargar', 'amber', w=104)
    s += step(x + 146, 289, 2)
    x = xs[2]
    s += f'  <rect x="{x+14}" y="170" width="196" height="166" rx="12" fill="#F7F8FA" stroke="{LINE}" stroke-width="1.25"/>\n'
    s += text(x + 28, 194, '¿Instalar esta app?', 13.5, INK, 700)
    s += text(x + 28, 220, 'Por tu seguridad, el teléfono', 11.5, '#454C61')
    s += text(x + 28, 237, 'no instala apps de esta fuente.', 11.5, '#454C61')
    s += f'  <rect x="{x+28}" y="254" width="34" height="18" rx="9" fill="#3A8235"/><circle cx="{x+53}" cy="263" r="6.5" fill="#FFFFFF"/>\n'
    s += text(x + 72, 263, 'Permitir esta fuente', 11.5, INK, 700)
    s += step(x + 206, 263, 3)
    s += button(x + 104, 292, 'Instalar', 'green', w=92)
    s += text(x + 16, 368, 'Solo la primera vez: después', 11.5, MUTED)
    s += text(x + 16, 386, 'las versiones nuevas llegan', 11.5, MUTED)
    s += text(x + 16, 404, 'por correo.', 11.5, MUTED)
    return s + tail(h, 'El APK de prueba no pasa por Google Play, por eso Android pide permiso para instalarlo.')


FIGS['dpTester'] = dp_tester


# ───────────────────────── 0080 · Generación de artefactos ─────────────────────────

def ar_flujo():
    fid, h = 'arFlujo', 380
    s = head(fid, h, 'Un artefacto por tienda', 'Un artefacto por tienda',
             'Los dos salen del mismo proyecto y de la misma versión del pubspec.yaml.',
             'Dos filas. Arriba, Android: la versión del pubspec, el keystore con key.properties, el comando flutter '
             'build appbundle, el archivo app-release.aab y Google Play. Abajo, iOS, solo en un Mac: la versión del '
             'pubspec, la firma en Xcode con el Team y el Bundle ID, el comando flutter build ipa, el archivo .ipa, '
             'Transporter y App Store Connect.')
    rows = [
        (140, 'green', 'Android', [('slate', 'pubspec.yaml', 'version'), ('amber', 'keystore', 'key.properties'),
                                    ('slate', 'flutter build', 'appbundle'), ('green', 'app-release', '.aab'),
                                    ('green', 'Google Play', 'Play Console')]),
        (262, 'indigo', 'iOS · solo Mac', [('slate', 'pubspec.yaml', 'version'), ('amber', 'Xcode', 'Team · Bundle ID'),
                                           ('slate', 'flutter build', 'ipa'), ('indigo', 'miapp', '.ipa'),
                                           ('indigo', 'App Store', 'por Transporter')]),
    ]
    for y, color, label, items in rows:
        s += text(48, y + 30, label, 14, FAM[color][2], 700)
        for i, (c, t, sub) in enumerate(items):
            x = 176 + i * 150
            s += box(x, y, 126, 62, c, t, sub, mono=False, fs=13.5)
            if i:
                s += arrow(x - 22, y + 31, x - 4, y + 31)
    return s + tail(h, 'El keystore y la cuenta de Apple son lo único que no viene en el proyecto: cada quien crea los suyos.')


FIGS['arFlujo'] = ar_flujo


def ar_android():
    fid, h = 'arAndroid', 460
    s = head(fid, h, 'Tres archivos para firmar el AAB', 'Tres archivos para firmar el AAB',
             'El keystore vive fuera del proyecto. key.properties dice dónde está y build.gradle.kts lo lee.',
             'A la izquierda, la carpeta de usuario con upload-keystore.jks, fuera del proyecto y con respaldo. A la '
             'derecha, el proyecto mi_app: dentro de android está key.properties, que no se sube a git, y dentro de '
             'android/app está build.gradle.kts, que lee key.properties para firmar. Flechas: build.gradle.kts lee '
             'key.properties, y key.properties apunta al keystore.')
    s += f'  <rect x="48" y="112" width="300" height="190" rx="12" fill="#FFFFFF" stroke="{LINE}" stroke-width="1.5"/>\n'
    s += folder_icon(68, 128, 'slate') + text(108, 145, 'Carpeta de usuario', 13.5, INK, 700)
    s += file_icon(88, 184, 'amber', 'upload-keystore.jks', 'tu llave de firma', w=240)
    s += badge(88, 262, 'rose', 'fuera del proyecto · haz respaldo', w=232)
    s += f'  <rect x="412" y="112" width="500" height="250" rx="12" fill="#FFFFFF" stroke="{LINE}" stroke-width="1.5"/>\n'
    s += folder_icon(432, 128, 'slate') + text(472, 145, 'mi_app', 13.5, INK, 700, mono=True)
    s += folder_icon(452, 172, 'slate') + text(492, 189, 'android', 13, INK, 700, mono=True)
    s += file_icon(472, 210, 'amber', 'key.properties', 'contraseñas y ruta del keystore', w=260)
    s += badge(740, 227, 'rose', 'en .gitignore', w=110)
    s += folder_icon(472, 260, 'slate') + text(512, 277, 'app', 13, INK, 700, mono=True)
    s += file_icon(492, 298, 'green', 'build.gradle.kts', 'firma el release con esos datos', w=280)
    s += f'  <path class="link" d="M482,312 C458,300 452,250 466,236"/>\n'
    s += text(418, 274, 'lee', 11.5, MUTED)
    s += f'  <path class="link" d="M472,226 C420,226 380,206 352,206"/>\n'
    s += text(360, 196, 'apunta a', 11.5, MUTED)
    s += note(48, 320, 300, 'rose', 'Si pierdes el keystore', ['No podrás firmar actualizaciones', 'con la misma llave.'])
    return s + tail(h, 'pubspec.yaml no cambia de lugar: de su línea version salen el nombre y el número de cada artefacto.')


FIGS['arAndroid'] = ar_android


def ar_xcode():
    fid, h = 'arXcode', 490
    s = head(fid, h, 'La firma en Xcode', 'La firma en Xcode',
             'Runner → Signing &amp; Capabilities. Con la firma automática, Xcode crea los certificados por ti.',
             'Esquema de Xcode con el proyecto Runner abierto. A la izquierda, el target Runner seleccionado. Arriba, '
             'la pestaña Signing and Capabilities. En el panel: la casilla Automatically manage signing marcada '
             '(paso 1), el Team con tu cuenta del Apple Developer Program (paso 2) y el Bundle Identifier '
             'co.edu.icesi.miapp (paso 3).')
    s += window(48, 104, 864, 340, 'Runner.xcworkspace', 'slate')
    s += sidebar(48, 138, 190, 306, ['#Project', 'Runner', '#Targets', 'Runner '], 'Runner ', 'slate')
    x = 262
    s += tab_bar(x - 10, 164, ['General', 'Signing &amp; Capabilities', 'Info', 'Build Settings'],
                 'Signing &amp; Capabilities', 'indigo')
    s += f'  <path d="M{x},182 H888" stroke="{LINE}" stroke-width="1.25"/>\n'
    s += option(x + 10, 214, 'Automatically manage signing', True, 'check', 'indigo')
    s += step(x + 270, 214, 1)
    s += select(x + 10, 244, 400, 'Team', 'Tu nombre (Apple Developer Program)')
    s += step(x + 430, 268, 2)
    s += field(x + 10, 304, 400, 'Bundle Identifier', 'co.edu.icesi.miapp', mono=True)
    s += step(x + 430, 328, 3)
    s += text(x + 10, 376, 'Signing Certificate', 12, '#556074', 700)
    s += text(x + 10, 396, 'Apple Development · lo crea Xcode', 12.5, MUTED)
    s += note(712, 228, 176, 'indigo', 'El Bundle ID', ['es único y no se', 'cambia después.'])
    return s + tail(h, 'Con un Team personal gratuito se puede probar en tu iPhone, pero no generar un IPA para la tienda.')


FIGS['arXcode'] = ar_xcode


# ───────────────────────── 0082 · Google Play ─────────────────────────

PLAY = 'Google Play Console'


def gp_ruta():
    fid, h = 'gpRuta', 360
    s = head(fid, h, 'El camino hasta producción', 'El camino hasta producción',
             'Una cuenta personal nueva pasa por una prueba cerrada antes de poder publicar.',
             'Seis pasos en dos filas. Crear la app, completar Configura tu app, llenar la ficha de Play Store, '
             'una prueba cerrada con al menos 12 testers durante 14 días seguidos, solicitar acceso a producción y '
             'publicar en producción. Los pasos 4 y 5 aplican a cuentas personales creadas desde noviembre de 2023.')
    items = [('green', 'Crear la app', 'nombre e idioma'), ('green', 'Configura tu app', 'declaraciones'),
             ('green', 'Ficha de Play Store', 'textos e imágenes'), ('amber', 'Prueba cerrada', '12 testers · 14 días'),
             ('amber', 'Acceso a producción', 'un cuestionario'), ('green', 'Producción', 'revisión y publicación')]
    for i, (c, t, sub) in enumerate(items):
        x = 48 + (i % 3) * 304
        y = 116 if i < 3 else 230
        s += box(x, y, 256, 64, c, t, sub, mono=False, fs=14.5)
        s += step(x + 4, y + 4, i + 1)
        if i % 3:
            s += arrow(x - 44, y + 32, x - 6, y + 32)
    s += '  <path class="link" d="M864,184 V206 H176 V226"/>\n'
    return s + tail(h, 'Los pasos en ámbar solo aplican a cuentas personales. Una cuenta de organización va directo a producción.')


FIGS['gpRuta'] = gp_ruta


def gp_crear():
    fid, h = 'gpCrear', 540
    s = head(fid, h, 'Crear la app', 'Crear la app',
             'Todas las apps → Crear app. Nada de esto es el identificador: ese viene en el AAB.',
             'Esquema del formulario Crear app de Google Play Console: nombre de la app (paso 1), idioma '
             'predeterminado (paso 2), app o juego (paso 3), gratis o pagada (paso 4), las dos declaraciones '
             'marcadas (paso 5) y el botón Crear app.')
    s += window(48, 104, 864, 412, PLAY, 'green')
    s += sidebar(48, 138, 190, 378, ['Todas las apps', 'Bandeja de entrada', 'Usuarios y permisos',
                                      'Detalles de la cuenta'], 'Todas las apps', 'green')
    x = 262
    s += text(x, 164, 'Crear app', 17, INK, 700)
    s += field(x, 192, 330, 'Nombre de la app', 'Muro Icesi', hint='máx. 30')
    s += step(x + 350, 216, 1)
    s += select(x, 254, 330, 'Idioma predeterminado', 'Español (Latinoamérica) – es-419')
    s += step(x + 350, 278, 2)
    s += text(x, 318, 'App o juego', 12, '#556074', 700)
    s += option(x, 340, 'App', True) + option(x + 90, 340, 'Juego', False)
    s += step(x + 190, 340, 3)
    s += text(x + 320, 318, 'Gratis o pagada', 12, '#556074', 700)
    s += option(x + 320, 340, 'Gratis', True) + option(x + 420, 340, 'Pagada', False)
    s += step(x + 530, 340, 4)
    s += text(x, 378, 'Declaraciones', 12, '#556074', 700)
    s += option(x, 400, 'Políticas del programa para desarrolladores', True, 'check', fit=360)
    s += option(x, 426, 'Leyes de exportación de EE. UU.', True, 'check', fit=360)
    s += step(x + 352, 413, 5)
    s += button(x + 496, 470, 'Crear app', 'green', w=130)
    return s + '</svg>\n'


FIGS['gpCrear'] = gp_crear


def gp_panel():
    fid, h = 'gpPanel', 640
    s = head(fid, h, 'Configura tu app', 'Configura tu app',
             'Panel → Configura tu app. Cada fila es un formulario corto; a la derecha, qué responder en una app del curso.',
             'Esquema del panel de Google Play Console con la lista Configura tu app. Filas: acceso a la app, '
             'anuncios, clasificación del contenido, público objetivo, seguridad de los datos, apps del gobierno, '
             'funciones financieras, salud, política de privacidad, categoría y datos de contacto, y ficha de Play '
             'Store principal. Junto a cada fila, la respuesta típica para una app del curso.')
    s += window(48, 104, 864, 512, PLAY + ' · Muro Icesi', 'green')
    s += sidebar(48, 138, 190, 478, ['Panel', 'Estadísticas', '#Pruebas', 'Prueba interna', 'Prueba cerrada',
                                      'Producción', '#Presencia', 'Ficha de Play Store', '#Política',
                                      'Contenido de la app'], 'Panel', 'green')
    x = 262
    s += text(x, 164, 'Configura tu app', 17, INK, 700)
    s += text(x, 188, 'Completa todas las tareas antes de enviar una versión.', 12, MUTED)
    rows = [('Acceso a la app', 'usuario y contraseña de prueba'), ('Anuncios', 'No contiene anuncios'),
            ('Clasificación del contenido', 'cuestionario · todo No'), ('Público objetivo', '18 años o más'),
            ('Seguridad de los datos', 'correo y nombre, cifrados en tránsito'),
            ('Apps del gobierno', 'No'), ('Funciones financieras', 'Ninguna'), ('Salud', 'Ninguna'),
            ('Política de privacidad', 'una URL pública'),
            ('Categoría y contacto', 'categoría y tu correo'), ('Ficha de Play Store', 'la figura siguiente')]
    for i, (name, ans) in enumerate(rows):
        y = 214 + i * 35
        s += f'  <rect x="{x}" y="{y}" width="626" height="30" rx="7" fill="#FFFFFF" stroke="{LINE}" stroke-width="1.25"/>\n'
        s += f'  <circle cx="{x+16}" cy="{y+15}" r="6" fill="none" stroke="#9AA1B5" stroke-width="1.75"/>\n'
        s += text(x + 32, y + 15, name, 12.5, INK, 700, fit=230)
        s += text(x + 270, y + 15, ans, 12, FAM['green'][2], fit=330)
        s += f'  <path d="M{x+608},{y+10} l5,5 l-5,5" fill="none" stroke="#9AA1B5" stroke-width="1.75"/>\n'
    return s + '</svg>\n'


FIGS['gpPanel'] = gp_panel


def gp_ficha():
    fid, h = 'gpFicha', 580
    s = head(fid, h, 'La ficha de Play Store', 'La ficha de Play Store',
             'Presencia en Play Store → Ficha de Play Store principal. Es lo que ve quien busca tu app.',
             'Esquema de la ficha principal: nombre de la app (paso 1), descripción breve (paso 2), descripción '
             'completa (paso 3), ícono de 512 por 512 (paso 4), gráfico de funciones de 1024 por 500 (paso 5) y al '
             'menos dos capturas de teléfono (paso 6). Abajo, el botón Guardar.')
    s += window(48, 104, 864, 452, PLAY + ' · Muro Icesi', 'green')
    s += sidebar(48, 138, 190, 418, ['Panel', '#Pruebas', 'Prueba cerrada', 'Producción', '#Presencia',
                                      'Ficha de Play Store'], 'Ficha de Play Store', 'green')
    x = 262
    s += text(x, 164, 'Ficha de Play Store principal', 17, INK, 700)
    s += field(x, 192, 290, 'Nombre de la app', 'Muro Icesi', hint='máx. 30')
    s += step(x + 304, 216, 1)
    s += field(x + 326, 192, 300, 'Descripción breve · máx. 80', 'Fotos y chat de tu clase')
    s += step(x + 616, 192, 2)
    s += field(x, 254, 626, 'Descripción completa · máx. 4000', 'Publica fotos en el muro, da me gusta y conversa…', h=52)
    s += step(x + 616, 254, 3)
    s += text(x, 336, 'Ícono', 12, '#556074', 700)
    s += picture(x, 348, 76, 76, '512 × 512 PNG', 'green')
    s += step(x + 86, 348, 4)
    s += text(x + 120, 336, 'Gráfico de funciones', 12, '#556074', 700)
    s += picture(x + 120, 348, 160, 78, '1024 × 500', 'slate')
    s += step(x + 290, 348, 5)
    s += text(x + 326, 336, 'Capturas del teléfono · mínimo 2', 12, '#556074', 700)
    for i in range(3):
        s += picture(x + 326 + i * 58, 348, 46, 88, '', 'slate')
    s += step(x + 500, 348, 6)
    s += button(x + 516, 504, 'Guardar', 'green', w=110)
    return s + '</svg>\n'


FIGS['gpFicha'] = gp_ficha


def gp_prueba():
    fid, h = 'gpPrueba', 600
    s = head(fid, h, 'La prueba cerrada', 'La prueba cerrada',
             'Pruebas → Prueba cerrada. Primero los testers, luego la versión con tu AAB.',
             'Esquema de la prueba cerrada. Pestaña Testers: una lista de correos con al menos 12 personas '
             '(paso 1) y el enlace para unirse que hay que compartirles (paso 2). Debajo, Crear versión: la zona para '
             'subir app-release.aab (paso 3), el nombre de la versión (paso 4), las notas (paso 5) y el botón para '
             'guardar y publicar en la pista de prueba (paso 6).')
    s += window(48, 104, 864, 472, PLAY + ' · Muro Icesi', 'green')
    s += sidebar(48, 138, 190, 438, ['Panel', '#Pruebas', 'Prueba interna', 'Prueba cerrada', 'Producción'],
                 'Prueba cerrada', 'green')
    x = 262
    s += text(x, 164, 'Prueba cerrada · Alpha', 17, INK, 700)
    s += tab_bar(x - 10, 196, ['Versiones', 'Países', 'Testers'], 'Testers', 'green')
    s += f'  <path d="M{x},214 H888" stroke="{LINE}" stroke-width="1.25"/>\n'
    s += option(x, 238, 'Lista «moviles-262» · 14 correos', True, 'check', fit=300)
    s += step(x + 296, 238, 1)
    s += field(x, 260, 400, 'Enlace para unirse', 'play.google.com/apps/testing/co.edu…', mono=True)
    s += button(x + 412, 272, 'Copiar', 'green', solid=False, w=80)
    s += step(x + 506, 287, 2)
    s += f'  <path d="M{x},326 H888" stroke="{LINE}" stroke-width="1.25"/>\n'
    s += text(x, 346, 'Crear versión', 14, INK, 700)
    s += drop(x, 364, 300, 92, 'Sube app-release.aab', 'Google firma la versión final')
    s += step(x + 300, 364, 3)
    s += field(x + 326, 364, 300, 'Nombre de la versión', '1 (1.0.0)', mono=True)
    s += step(x + 616, 364, 4)
    s += field(x + 326, 418, 300, 'Notas de la versión', '&lt;es-419&gt;Primera versión&lt;/es-419&gt;', mono=True)
    s += step(x + 616, 418, 5)
    s += button(x + 412, 520, 'Guardar y publicar', 'green', w=180)
    s += step(x + 604, 535, 6)
    s += text(x, 486, 'La primera vez, acepta la firma de apps de Google Play.', 12, MUTED)
    return s + '</svg>\n'


FIGS['gpPrueba'] = gp_prueba


def gp_produccion():
    fid, h = 'gpProduccion', 520
    s = head(fid, h, 'De la prueba a producción', 'De la prueba a producción',
             'Cuando el panel marca los 14 días, se pide el acceso. Con el acceso, la versión va a producción.',
             'A la izquierda, la tarjeta del panel Solicitar acceso a producción: 12 testers inscritos, 14 de 14 días '
             'y el botón Solicitar acceso (paso 1). A la derecha, Producción: Crear versión (paso 2), Agregar desde la '
             'biblioteca para reutilizar el AAB de la prueba (paso 3) y en Resumen de publicación, Enviar cambios a '
             'revisión (paso 4).')
    s += window(48, 104, 410, 300, PLAY + ' · Panel', 'green')
    x = 72
    s += text(x, 162, 'Solicitar acceso a producción', 15, INK, 700)
    s += option(x, 196, '12 testers inscritos en la prueba', True, 'check', fit=330)
    s += option(x, 224, 'Prueba activa 14 de 14 días', True, 'check', fit=330)
    s += f'  <rect x="{x}" y="246" width="362" height="8" rx="4" fill="{FAM["green"][0]}"/><rect x="{x}" y="246" width="362" height="8" rx="4" fill="{FAM["green"][2]}"/>\n'
    s += text(x, 278, 'Luego responde preguntas sobre cómo', 12, '#454C61')
    s += text(x, 296, 'probaste la app. Google tarda unos días.', 12, '#454C61')
    s += button(x, 330, 'Solicitar acceso', 'green', w=160)
    s += step(x + 174, 345, 1)
    s += window(502, 104, 410, 300, PLAY + ' · Producción', 'green')
    x = 526
    s += text(x, 162, 'Producción', 15, INK, 700)
    s += button(x, 180, 'Crear versión', 'green', w=140)
    s += step(x + 154, 195, 2)
    s += f'  <rect x="{x}" y="226" width="362" height="58" rx="10" fill="#F7F8FA" stroke="#9AA1B5" stroke-width="1.5" stroke-dasharray="6 5"/>\n'
    s += text(x + 14, 246, 'App bundles', 12, '#556074', 700)
    s += button(x + 14, 256, 'Agregar desde la biblioteca', 'green', solid=False, w=210)
    s += step(x + 236, 271, 3)
    s += text(x, 312, 'Resumen de publicación', 12, '#556074', 700)
    s += button(x, 328, 'Enviar cambios a revisión', 'green', w=210)
    s += step(x + 224, 343, 4)
    s += note(48, 424, 864, 'slate', 'Tiempos', ['La revisión de la primera versión puede tardar varios días. Las siguientes suelen tardar horas.'])
    return s + '</svg>\n'


FIGS['gpProduccion'] = gp_produccion


def gp_versiones():
    fid, h = 'gpVersiones', 430
    s = head(fid, h, 'Versionar: nombre visible y número que siempre sube', 'Versionar: nombre visible y número que siempre sube',
             'En pubspec.yaml, lo de antes del + es el nombre que ve la gente; lo de después es el número interno.',
             'Una línea de tiempo con cuatro subidas. 1.0.0+1 se acepta. 1.0.1+2 se acepta. Volver a subir con +2 se '
             'rechaza porque el código de versión 2 ya se usó. 1.1.0+3 se acepta. Abajo, qué nombre recibe cada '
             'número en Android y en iOS.')
    s += '  <path d="M80,190 H880" stroke="#C4CBD8" stroke-width="2"/>\n'
    items = [('1.0.0+1', 'primera versión', True), ('1.0.1+2', 'corrige un error', True),
             ('1.0.1+2', 'se olvidó subir el +', False), ('1.1.0+3', 'función nueva', True)]
    for i, (v, why, ok) in enumerate(items):
        cx = 140 + i * 226
        c = 'green' if ok else 'rose'
        soft, border, strong = FAM[c]
        s += f'  <circle cx="{cx}" cy="190" r="9" fill="{strong}"/>\n'
        s += f'  <rect x="{cx-92}" y="120" width="184" height="40" rx="9" fill="#1F2430"/>\n'
        s += text(cx, 140, f'version: {v}', 13, '#C9CFDA', 700, 'middle', mono=True)
        s += text(cx, 220, why, 12.5, '#454C61', anchor='middle')
        s += badge(cx - 70, 252, c, 'aceptada' if ok else 'rechazada', w=140)
    s += text(592, 284, 'Ya se usó el código de versión 2', 11.5, FAM['rose'][2], anchor='middle')
    s += note(48, 312, 420, 'indigo', 'Antes del +  ·  1.0.1', ['Android: versionName · iOS: CFBundleShortVersionString',
                                                                 'Lo ve la gente. Súbelo cuando cambie algo visible.'])
    s += note(492, 312, 420, 'amber', 'Después del +  ·  2', ['Android: versionCode · iOS: CFBundleVersion',
                                                              'Debe ser mayor que el de la última subida.'])
    return s + '</svg>\n'


FIGS['gpVersiones'] = gp_versiones


# ───────────────────────── 0083 · App Store ─────────────────────────

ASC = 'App Store Connect'


def as_ruta():
    fid, h = 'asRuta', 360
    s = head(fid, h, 'El camino hasta el App Store', 'El camino hasta el App Store',
             'Primero existe la app en App Store Connect; después le subes builds y eliges uno para revisión.',
             'Seis pasos en dos filas: crear la app en App Store Connect, subir el IPA con Transporter, probarlo en '
             'TestFlight, llenar la página de la versión, completar información, precio y privacidad, y enviar a '
             'revisión.')
    items = [('indigo', 'Crear la app', 'Bundle ID y SKU'), ('violet', 'Subir el IPA', 'con Transporter'),
             ('slate', 'TestFlight', 'opcional'), ('indigo', 'Página de la versión', 'capturas y textos'),
             ('indigo', 'Información de la app', 'precio y privacidad'), ('green', 'Enviar a revisión', 'App Review')]
    for i, (c, t, sub) in enumerate(items):
        x = 48 + (i % 3) * 304
        y = 116 if i < 3 else 230
        s += box(x, y, 256, 64, c, t, sub, mono=False, fs=14.5)
        s += step(x + 4, y + 4, i + 1)
        if i % 3:
            s += arrow(x - 44, y + 32, x - 6, y + 32)
    s += '  <path class="link" d="M864,184 V206 H176 V226"/>\n'
    return s + tail(h, 'Necesitas el Apple Developer Program (pago anual) desde el paso 1: sin él no aparece App Store Connect.')


FIGS['asRuta'] = as_ruta


def as_nueva():
    fid, h = 'asNueva', 540
    s = head(fid, h, 'Nueva app en App Store Connect', 'Nueva app en App Store Connect',
             'Apps → botón + → Nueva app. El ID del paquete tiene que ser el mismo Bundle ID de Xcode.',
             'Esquema del formulario Nueva app: plataforma iOS (paso 1), nombre (paso 2), idioma principal (paso 3), '
             'ID del paquete co.edu.icesi.miapp (paso 4), SKU (paso 5) y acceso de usuario. Abajo, los botones '
             'Cancelar y Crear.')
    s += window(48, 104, 864, 412, ASC, 'indigo')
    s += tab_bar(62, 154, ['Apps', 'Usuarios y acceso', 'Pagos'], 'Apps', 'indigo')
    s += f'  <rect x="210" y="184" width="540" height="316" rx="12" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="1.5"/>\n'
    x = 234
    s += text(x, 208, 'Nueva app', 16, INK, 700)
    s += text(x, 236, 'Plataformas', 12, '#556074', 700)
    s += option(x + 100, 236, 'iOS', True, 'check', 'indigo') + option(x + 170, 236, 'macOS', False, 'check', 'indigo')
    s += step(x + 260, 236, 1)
    s += field(x, 256, 230, 'Nombre', 'Muro Icesi')
    s += step(x + 240, 280, 2)
    s += select(x + 262, 256, 230, 'Idioma principal', 'Español (México)')
    s += step(x + 502, 280, 3)
    s += select(x, 318, 230, 'ID del paquete', 'co.edu.icesi.miapp')
    s += step(x + 240, 342, 4)
    s += field(x + 262, 318, 230, 'SKU', 'miapp-001', mono=True)
    s += step(x + 502, 342, 5)
    s += text(x, 384, 'Acceso de usuario', 12, '#556074', 700)
    s += option(x + 140, 384, 'Acceso total', True, 'radio', 'indigo')
    s += button(x + 286, 454, 'Cancelar', 'indigo', solid=False, w=100)
    s += button(x + 398, 454, 'Crear', 'indigo', w=94)
    return s + '</svg>\n'


FIGS['asNueva'] = as_nueva


def as_transporter():
    fid, h = 'asTransporter', 530
    s = head(fid, h, 'Subir el IPA con Transporter', 'Subir el IPA con Transporter',
             'Transporter lo envía; App Store Connect lo procesa y lo muestra en TestFlight.',
             'A la izquierda, la app Transporter: una zona para arrastrar el IPA (paso 1) y la fila de MiApp 1.0.0 '
             'con el botón Entregar (paso 2). Una flecha lleva a la derecha, a la pestaña TestFlight de App Store '
             'Connect: la compilación 1.0.0 (1), primero procesando y luego con el aviso Falta información de '
             'cumplimiento y el botón Gestionar (paso 3).')
    s += window(48, 104, 380, 330, 'Transporter', 'violet')
    x = 70
    s += drop(x, 156, 336, 120, 'Arrastra aquí el .ipa', 'build/ios/ipa/')
    s += step(x + 336, 156, 1)
    s += f'  <rect x="{x}" y="296" width="336" height="58" rx="10" fill="#FFFFFF" stroke="{LINE}" stroke-width="1.25"/>\n'
    s += text(x + 14, 316, 'Muro Icesi', 13, INK, 700)
    s += text(x + 14, 336, '1.0.0 (1) · iOS', 11.5, MUTED, mono=True)
    s += button(x + 226, 310, 'Entregar', 'violet', w=96)
    s += step(x + 336, 325, 2)
    s += arrow(436, 270, 486, 270)
    s += window(494, 104, 418, 330, ASC + ' · TestFlight', 'indigo')
    x = 516
    s += text(x, 162, 'Compilaciones · iOS', 14, INK, 700)
    for i, (state, c) in enumerate([('Procesando…', 'slate'), ('Falta información de cumplimiento', 'amber')]):
        y = 186 + i * 76
        s += f'  <rect x="{x}" y="{y}" width="374" height="62" rx="10" fill="#FFFFFF" stroke="{LINE}" stroke-width="1.25"/>\n'
        s += text(x + 14, y + 20, '1.0.0 (1)', 13, INK, 700, mono=True)
        s += text(x + 14, y + 42, state, 12, FAM[c][2], 700 if c == 'amber' else 400, fit=260)
    s += button(x + 270, 276, 'Gestionar', 'indigo', solid=False, w=92)
    s += step(x + 374, 262, 3)
    s += text(x, 364, 'Unos minutos después de entregar.', 12, MUTED)
    s += note(48, 452, 864, 'amber', 'Cumplimiento de exportación',
              ['Si la app solo usa HTTPS, responde que no usa cifrado propio. Se pregunta una vez por build.'])
    return s + '</svg>\n'


FIGS['asTransporter'] = as_transporter


def as_version():
    fid, h = 'asVersion', 660
    s = head(fid, h, 'La página de la versión', 'La página de la versión',
             'Distribución → 1.0 Preparar para el envío. De arriba abajo, y al final, Agregar para revisión.',
             'Esquema de la página de la versión en App Store Connect: capturas del iPhone de 6,9 pulgadas '
             '(paso 1), texto promocional y descripción (paso 2), palabras clave y URL de soporte (paso 3), la '
             'compilación elegida con el botón más (paso 4), los datos de inicio de sesión para la revisión '
             '(paso 5) y el botón Agregar para revisión (paso 6).')
    s += window(48, 104, 864, 532, ASC + ' · Muro Icesi', 'indigo')
    s += sidebar(48, 138, 200, 498, ['#App para iOS', '1.0 Preparar envío', '#General', 'Información de la app',
                                      'Precio y disponibilidad', 'Privacidad de la app'], '1.0 Preparar envío', 'indigo')
    x = 272
    s += text(x, 164, 'Capturas · iPhone 6,9"', 12, '#556074', 700)
    s += text(x + 616, 164, '1320 × 2868', 11, MUTED, anchor='end', mono=True)
    for i in range(4):
        s += picture(x + i * 50, 176, 40, 78, '', 'slate')
    s += step(x + 210, 176, 1)
    s += field(x, 272, 296, 'Texto promocional', 'Tu clase en un solo muro')
    s += field(x + 320, 272, 296, 'Descripción', 'Publica fotos, da me gusta…')
    s += step(x + 616, 272, 2)
    s += field(x, 334, 296, 'Palabras clave', 'muro,fotos,chat,icesi')
    s += field(x + 320, 334, 296, 'URL de soporte', 'tusitio.com/soporte', mono=True)
    s += step(x + 616, 334, 3)
    s += text(x, 398, 'Compilación', 12, '#556074', 700)
    s += f'  <rect x="{x}" y="410" width="616" height="40" rx="8" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>\n'
    s += f'  <circle cx="{x+20}" cy="430" r="10" fill="{FAM["indigo"][2]}"/>'
    s += f'<path d="M{x+15},430 h10 M{x+20},425 v10" stroke="#FFFFFF" stroke-width="2"/>\n'
    s += text(x + 40, 430, '1.0.0 (1) · elegida de TestFlight', 12.5, INK, mono=True)
    s += step(x + 616, 410, 4)
    s += text(x, 474, 'Información para la revisión · inicio de sesión', 12, '#556074', 700)
    s += field(x, 476, 296, '', 'revisor@icesi.edu.co', mono=True)
    s += field(x + 320, 476, 296, '', '••••••••')
    s += step(x + 616, 488, 5)
    s += text(x, 546, 'Sin una cuenta de prueba, Apple rechaza las apps con inicio de sesión.', 12, MUTED)
    s += button(x + 436, 580, 'Agregar para revisión', 'indigo', w=180)
    s += step(x + 628, 595, 6)
    return s + '</svg>\n'


FIGS['asVersion'] = as_version


def as_info():
    fid, h = 'asInfo', 420
    s = head(fid, h, 'Información, precio y privacidad', 'Información, precio y privacidad',
             'Tres páginas del menú General que se llenan una sola vez.',
             'Tres tarjetas. Información de la app: categoría y clasificación por edades, que es un cuestionario. '
             'Precio y disponibilidad: gratis y los países. Privacidad de la app: la URL de la política de privacidad '
             'y los tipos de datos que recopila la app, por ejemplo correo y nombre, vinculados al usuario.')
    cards = [
        ('Información de la app', [('Categoría', 'Redes sociales'), ('Clasificación por edades', 'cuestionario → 4+')]),
        ('Precio y disponibilidad', [('Precio', 'Gratis (USD 0)'), ('Disponibilidad', 'Colombia o todos')]),
        ('Privacidad de la app', [('Política de privacidad', 'tusitio.com/privacidad'),
                                  ('Datos que recopila', 'correo y nombre')]),
    ]
    for i, (title, fields) in enumerate(cards):
        x = 48 + i * 296
        s += f'  <rect x="{x}" y="112" width="272" height="250" rx="12" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="1.5"/>\n'
        s += f'  <path d="M{x},150 V124 A12,12 0 0 1 {x+12},112 H{x+260} A12,12 0 0 1 {x+272},124 V150 Z" fill="{FAM["indigo"][0]}" stroke="#A9B4F2" stroke-width="1.5"/>\n'
        s += text(x + 16, 131, title, 14, FAM['indigo'][2], 700, fit=240)
        for j, (label, value) in enumerate(fields):
            s += field(x + 16, 176 + j * 74, 240, label, value)
        s += step(x + 256, 112, i + 1)
    return s + tail(h, 'Lo que declares en privacidad tiene que coincidir con lo que la app hace: Apple lo revisa.')


FIGS['asInfo'] = as_info


def main():
    if len(sys.argv) > 1 and sys.argv[1] == '--inject':
        done = set()
        for name in LESSONS:
            path = ROOT / 'content' / name
            text_ = path.read_text(encoding='utf-8')

            def swap(m):
                done.add(m.group(1))
                return '```svg\n' + FIGS[m.group(1)]() + '```'
            new = re.sub(r'```svg\n<svg id="(\w+)".*?```', swap, text_, flags=re.S)
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
