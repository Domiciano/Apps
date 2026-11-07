"""Figuras SVG de la sección Push notifications: «Notificaciones push» (0074), «Conectar la app con
Firebase» (0075), «La llave del backend» (0076), «Recibir notificaciones en Flutter» (0077) y
«Enviar notificaciones desde el backend» (0078).

    python3 tools/push_figuras.py <carpeta>     escribe un .svg por figura, para revisarlas
    python3 tools/push_figuras.py --inject      reemplaza cada bloque ```svg de las cinco lecciones
                                                por la figura con el mismo id

No editar los SVG dentro del Markdown: se cambia este script y se vuelve a inyectar.
Colores: FCM ámbar, el backend violeta, la app y el teléfono verdes, Apple índigo y lo prohibido rosa.
Reutiliza las piezas de panel de deploy_figuras.py.
"""

import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from bloc_figuras import FAM, box, head, note, tail  # noqa: E402
from deploy_figuras import INK, LINE, MUTED, arrow, button, mini_phone, sidebar, step, text, window  # noqa: E402
from storage_figuras import badge, file_icon, folder_icon  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
LESSONS = ['lessonK0.md', 'lessonK1.md', 'lessonK2.md', 'lessonK3.md', 'lessonK4.md']
FIGS = {}


def label_on(x1, y1, x2, y2, s, color='slate'):
    _, _, strong = FAM[color]
    return text((x1 + x2) / 2, (y1 + y2) / 2 - 12, s, 11.5, strong, 700, 'middle')


def line(x1, y1, x2, y2, color, dash=False):
    _, _, strong = FAM[color]
    d = ' stroke-dasharray="6 5"' if dash else ''
    return f'  <path d="M{x1},{y1} L{x2},{y2}" fill="none" stroke="{strong}" stroke-width="2"{d}/>\n'


# ───────────────────────── 0074 · Notificaciones push ─────────────────────────

def pn_una_conexion():
    fid, h = 'pnUnaConexion', 400
    s = head(fid, h, 'Una sola conexión para todas las apps', 'Una sola conexión para todas las apps',
             'El sistema operativo mantiene abierta una conexión con FCM, y por ella llegan los avisos de todas las apps.',
             'Dos teléfonos. A la izquierda, sin intermediario: cinco apps, cada una con su propia conexión abierta a '
             'su servidor, y la batería baja. A la derecha, con FCM: las mismas cinco apps dentro del teléfono, una '
             'sola conexión del sistema operativo hacia FCM, y FCM recibe de los servidores de cada app.')
    for i, (x, title, ok) in enumerate([(48, 'Sin intermediario', False), (500, 'Con FCM', True)]):
        s += text(x, 124, title, 15, FAM['green' if ok else 'rose'][2], 700)
        s += mini_phone(x, 140, 150, 220, 'Teléfono', 'slate')
        for j in range(5):
            s += (f'  <rect x="{x+20}" y="{206 + j*28}" width="110" height="20" rx="6" fill="{FAM["green"][0]}" '
                  f'stroke="{FAM["green"][1]}" stroke-width="1.25"/>')
            s += text(x + 30, 216 + j * 28, f'App {j+1}', 11.5, FAM['green'][2], 700)
        if not ok:
            for j in range(5):
                s += line(x + 130, 216 + j * 28, x + 290, 160 + j * 46, 'rose', dash=True)
                s += box(x + 296, 146 + j * 46, 110, 30, 'violet', f'Servidor {j+1}', mono=False, fs=12)
            s += badge(x + 20, 380 - 10, 'rose', '5 conexiones · batería', w=160)
        else:
            s += line(x + 150, 276, x + 230, 276, 'amber')
            s += box(x + 236, 236, 110, 80, 'amber', 'FCM', 'Google', mono=False, fs=15)
            for j in range(5):
                s += line(x + 346, 276, x + 372, 160 + j * 46 + 15, 'violet', dash=True)
                s += box(x + 372, 146 + j * 46, 40, 30, 'violet', f'S{j+1}', mono=False, fs=12)
            s += badge(x + 20, 370, 'green', '1 conexión del sistema', w=160)
    return s + '</svg>\n'


FIGS['pnUnaConexion'] = pn_una_conexion


def pn_viaje():
    fid, h = 'pnViaje', 360
    s = head(fid, h, 'El viaje de una notificación', 'El viaje de una notificación',
             'La app solo se suscribe. Quien envía es el backend, y FCM se encarga de llegar al teléfono.',
             'Tres columnas: la app en el teléfono, FCM y tu backend. Paso 1: la app se suscribe al topic general en '
             'FCM. Paso 2: algo pasa y el backend le pide a FCM enviar un mensaje al topic general. Paso 3: FCM se lo '
             'entrega a cada teléfono suscrito. Paso 4: el sistema operativo muestra la notificación, aunque la app '
             'esté cerrada.')
    s += box(48, 150, 170, 100, 'green', 'App', 'teléfono del usuario', mono=False, fs=16)
    s += box(395, 150, 170, 100, 'amber', 'FCM', 'Firebase', mono=False, fs=16)
    s += box(742, 150, 170, 100, 'violet', 'Backend', 'tu servidor', mono=False, fs=16)
    s += '  <path class="link" d="M222,172 H389"/>\n' + text(305, 158, '1 · suscribirse a «general»', 11.5, '#454C61', 700, 'middle')
    s += '  <path class="link" d="M738,200 H571"/>\n' + text(655, 186, '2 · enviar a «general»', 11.5, '#454C61', 700, 'middle')
    s += '  <path class="link" d="M391,228 H224"/>\n' + text(305, 244, '3 · entregar', 11.5, '#454C61', 700, 'middle')
    s += note(48, 268, 220, 'green', '4 · El sistema la muestra', ['aunque la app esté cerrada'])
    s += note(395, 268, 517, 'slate', 'Topic o token', ['Un topic llega a todos los suscritos. Un token llega a un solo teléfono.'])
    return s + '</svg>\n'


FIGS['pnViaje'] = pn_viaje


# ───────────────────────── 0075 · Conectar la app con Firebase ─────────────────────────

def pn_configure():
    fid, h = 'pnConfigure', 420
    s = head(fid, h, 'Lo que deja flutterfire configure', 'Lo que deja flutterfire configure',
             'Un comando registra la app en Firebase y escribe tres cosas en el proyecto.',
             'A la izquierda, la terminal con el comando flutterfire configure. Una flecha lleva al proyecto: '
             'lib/firebase_options.dart con las opciones para inicializar Firebase, android/app/google-services.json '
             'con la configuración de Android, y los dos archivos de Gradle con el plugin google-services.')
    s += f'  <rect x="48" y="150" width="300" height="80" rx="10" fill="#1F2430"/>\n'
    s += text(66, 176, '$ flutterfire configure', 13.5, '#C9CFDA', 700, mono=True)
    s += text(66, 204, '  --project=TU_PROYECTO', 13.5, '#C9CFDA', mono=True)
    s += arrow(356, 190, 420, 190)
    s += f'  <rect x="428" y="112" width="484" height="270" rx="12" fill="#FFFFFF" stroke="{LINE}" stroke-width="1.5"/>\n'
    s += folder_icon(448, 126, 'slate') + text(488, 143, 'mi_app', 13.5, INK, 700, mono=True)
    s += file_icon(468, 168, 'amber', 'lib/firebase_options.dart', 'las opciones de Firebase.initializeApp', w=420)
    s += file_icon(468, 228, 'green', 'android/app/google-services.json', 'la app Android registrada en Firebase', w=420)
    s += file_icon(468, 288, 'slate', 'settings.gradle.kts · app/build.gradle.kts', 'el plugin com.google.gms.google-services', w=420)
    s += note(48, 258, 300, 'amber', 'No son secretos', ['Identifican la app; se pueden', 'subir al repositorio.'])
    return s + '</svg>\n'


FIGS['pnConfigure'] = pn_configure


# ───────────────────────── 0076 · La llave del backend ─────────────────────────

def pn_llave():
    fid, h = 'pnLlave', 500
    s = head(fid, h, 'Generar la llave de la cuenta de servicio', 'Generar la llave de la cuenta de servicio',
             'Configuración del proyecto → Cuentas de servicio → Generar nueva clave privada.',
             'Esquema de la consola de Firebase en Configuración del proyecto. Pestañas arriba, con Cuentas de '
             'servicio seleccionada (paso 1). En el panel, SDK de Firebase Admin con la cuenta firebase-adminsdk y el '
             'botón Generar nueva clave privada (paso 2). Un diálogo confirma con Generar clave (paso 3) y se '
             'descarga un archivo JSON.')
    s += window(48, 104, 864, 340, 'Consola de Firebase · Configuración del proyecto', 'amber')
    x = 72
    tabs = ['General', 'Cloud Messaging', 'Integraciones', 'Cuentas de servicio']
    cx = x
    for t in tabs:
        on = t == 'Cuentas de servicio'
        s += text(cx, 164, t, 12.5, FAM['amber'][2] if on else '#556074', 700 if on else 400)
        w = len(t) * 7.2 + 26
        if on:
            s += f'  <rect x="{cx-4}" y="176" width="{w-14:.0f}" height="3" rx="1.5" fill="{FAM["amber"][2]}"/>\n'
            s += step(cx + w - 6, 164, 1)
        cx += w
    s += f'  <path d="M{x},182 H888" stroke="{LINE}" stroke-width="1.25"/>\n'
    s += text(x, 210, 'SDK de Firebase Admin', 15, INK, 700)
    s += text(x, 234, 'Cuenta de servicio de Firebase', 12, '#556074', 700)
    s += text(x, 254, 'firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com', 12.5, INK, mono=True)
    s += button(x, 290, 'Generar nueva clave privada', 'amber', w=230)
    s += step(x + 244, 305, 2)
    s += f'  <rect x="430" y="318" width="458" height="108" rx="12" fill="#FFFFFF" stroke="{FAM["amber"][1]}" stroke-width="1.5"/>\n'
    s += text(450, 342, 'Generar nueva clave privada', 13.5, INK, 700)
    s += text(450, 364, 'Guárdala en un lugar seguro: no se puede volver a descargar.', 11.5, '#454C61')
    s += button(780, 384, 'Generar clave', 'amber', w=96)
    s += step(888, 384, 3)
    s += file_icon(450, 382, 'rose', 'tu-proyecto-firebase-adminsdk.json', '', w=320)
    return s + tail(h, 'Ese JSON es la identidad del backend: vive en el servidor, nunca dentro de la app.')


FIGS['pnLlave'] = pn_llave


# ───────────────────────── 0077 · Recibir notificaciones en Flutter ─────────────────────────

def pn_estados():
    fid, h = 'pnEstados', 400
    s = head(fid, h, 'Quién muestra la notificación', 'Quién muestra la notificación',
             'Depende de si la app está abierta. Con la app abierta, Android no la muestra: lo hace tu código.',
             'Tres columnas. App abierta: llega a onMessage y la muestra flutter_local_notifications, porque Android no '
             'muestra nada por su cuenta. App en segundo plano: el sistema muestra la notificación y además corre '
             'onBackgroundMessage. App cerrada: igual que en segundo plano.')
    cols = [('Abierta', 'onMessage', 'flutter_local_notifications', 'tu código la muestra', 'green'),
            ('Segundo plano', 'onBackgroundMessage', 'el sistema', 'se muestra sola', 'amber'),
            ('Cerrada', 'onBackgroundMessage', 'el sistema', 'se muestra sola', 'amber')]
    for i, (state, handler, who, why, c) in enumerate(cols):
        x = 48 + i * 296
        s += mini_phone(x + 76, 110, 120, 150, state, 'slate')
        if i == 0:
            s += f'  <rect x="{x+90}" y="176" width="92" height="64" rx="6" fill="{FAM["green"][0]}"/>\n'
        else:
            s += f'  <rect x="{x+90}" y="176" width="92" height="64" rx="6" fill="#EFF1F5"/>\n'
        s += f'  <rect x="{x+84}" y="166" width="104" height="22" rx="6" fill="#FFFFFF" stroke="{FAM[c][2]}" stroke-width="1.5"/>\n'
        s += text(x + 136, 177, 'Nuevo mensaje', 10.5, FAM[c][2], 700, 'middle')
        s += box(x, 280, 272, 44, 'violet', handler, mono=True, fs=13)
        s += text(x + 136, 344, f'la muestra: {who}', 12.5, INK, 700, 'middle')
        s += text(x + 136, 364, why, 12, MUTED, anchor='middle')
    return s + '</svg>\n'


FIGS['pnEstados'] = pn_estados


def pn_apple():
    fid, h = 'pnApple', 440
    s = head(fid, h, 'En iPhone, FCM entrega a través de APNs', 'En iPhone, FCM entrega a través de APNs',
             'Tu backend sigue hablando solo con FCM. FCM le pasa el mensaje a APNs, el servicio de Apple.',
             'Diagrama de arquitectura. El backend envía a FCM. Hacia Android, FCM entrega por su propia capa de '
             'transporte. Hacia iPhone, FCM reenvía el mensaje a APNs, el servicio de notificaciones de Apple, que lo '
             'entrega al iPhone. Para que FCM pueda hablar con APNs, se sube a Firebase la llave de autenticación de '
             'APNs, un archivo .p8 con su Key ID y el Team ID.')
    s += box(48, 196, 170, 80, 'violet', 'Backend', 'tu servidor', mono=False, fs=16)
    s += box(330, 196, 170, 80, 'amber', 'FCM', 'Firebase', mono=False, fs=16)
    s += arrow(222, 236, 324, 236)
    s += box(742, 120, 170, 70, 'green', 'Android', 'teléfono', mono=False, fs=15)
    s += f'  <path class="link" d="M504,222 C600,200 640,160 736,155"/>\n'
    s += text(600, 150, 'transporte de Android', 11.5, FAM['green'][2], 700, 'end')
    s += box(560, 280, 140, 70, 'indigo', 'APNs', 'Apple', mono=False, fs=15)
    s += box(742, 280, 170, 70, 'indigo', 'iPhone', 'teléfono', mono=False, fs=15)
    s += f'  <path class="link" d="M504,252 C530,280 530,310 554,314"/>\n'
    s += arrow(704, 315, 736, 315)
    s += f'  <rect x="330" y="306" width="170" height="64" rx="10" fill="#FFFFFF" stroke="{FAM["indigo"][1]}" stroke-width="1.5" stroke-dasharray="5 4"/>\n'
    s += text(415, 326, 'llave de APNs (.p8)', 12, FAM['indigo'][2], 700, 'middle', mono=True)
    s += text(415, 348, 'Key ID · Team ID', 11.5, '#454C61', anchor='middle')
    s += f'  <path d="M415,300 V282" stroke="{FAM["indigo"][2]}" stroke-width="1.75" stroke-dasharray="3 3"/>\n'
    s += note(48, 300, 250, 'slate', 'El backend no cambia', ['Envía igual que para Android.'])
    return s + tail(h, 'La llave .p8 se crea en la cuenta de Apple Developer y se sube en la consola de Firebase.')


FIGS['pnApple'] = pn_apple


# ───────────────────────── 0078 · Enviar desde el backend ─────────────────────────

def pn_backend():
    fid, h = 'pnBackend', 380
    s = head(fid, h, 'La llave vive en el backend', 'La llave vive en el backend',
             'La app le avisa al backend; el backend, con la llave, le pide a FCM que envíe.',
             'De izquierda a derecha: la app hace una petición a tu backend. El backend tiene la llave JSON de la '
             'cuenta de servicio, con ella obtiene un token de acceso de Google y hace POST a la API v1 de FCM. FCM '
             'entrega a los teléfonos suscritos. Abajo, tachado: la llave dentro de la app, que cualquiera podría '
             'extraer del APK.')
    s += box(48, 140, 170, 80, 'green', 'App', 'pide enviar', mono=False, fs=16)
    s += box(316, 140, 220, 80, 'violet', 'Backend', 'con la llave JSON', mono=False, fs=16)
    s += box(634, 140, 170, 80, 'amber', 'FCM', 'API v1', mono=False, fs=16)
    s += arrow(222, 180, 310, 180) + text(266, 166, 'HTTP', 11.5, MUTED, anchor='middle')
    s += arrow(540, 180, 628, 180) + text(584, 166, 'POST + token', 11.5, MUTED, anchor='middle')
    s += arrow(808, 180, 836, 180)
    s += text(842, 180, 'teléfonos', 12, INK, 700)
    s += f'  <rect x="48" y="256" width="420" height="80" rx="10" fill="{FAM["rose"][0]}" stroke="{FAM["rose"][1]}" stroke-width="1.5"/>\n'
    s += text(68, 280, '✕  Nunca: la llave dentro de la app', 13.5, FAM['rose'][2], 700)
    s += text(68, 304, 'Cualquiera la extrae del APK y controla tu proyecto.', 12.5, '#454C61')
    s += note(492, 256, 420, 'violet', 'En el curso', ['FCMNode, en Spring Boot, corre en tu computador.'])
    return s + '</svg>\n'


FIGS['pnBackend'] = pn_backend


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
