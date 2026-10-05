"""Figuras SVG de «Laboratorio 5: Registro de usuarios» (0053) y «Laboratorio 5 a nivel conceptual» (0090).

    python3 tools/lab5_figuras.py <carpeta>     escribe un .svg por figura, para revisarlas
    python3 tools/lab5_figuras.py --inject      reemplaza cada bloque ```svg de content/lab5.md y lab5concept.md
                                                por la figura con el mismo id

No editar los SVG dentro del Markdown: se cambia este script y se vuelve a inyectar.
Colores por capa, iguales en todas las figuras: presentación violeta, UseCase ámbar, contratos del
dominio índigo, datos teal, Supabase gris, éxito verde, error rosa.
"""

import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from bloc_figuras import FAM, MONO, box, chip, head, note, phone, spinner, tail  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
LESSONS = ['lab5.md', 'lab5concept.md']
FIGS = {}


def band(y, h, color, label, text):
    soft, border, strong = FAM[color]
    return (f'  <rect x="48" y="{y}" width="864" height="{h}" rx="14" fill="{soft}" fill-opacity=".5" stroke="{border}" stroke-width="1.5"/>\n'
            f'  <text class="h" x="68" y="{y+30}" style="fill:{strong}" data-fit="150">{label}</text>\n'
            f'  <text x="68" y="{y+50}" font-size="12.5" fill="#454C61" data-fit="150">{text}</text>\n')


def l5_mapa():
    fid, h = 'l5Mapa', 736
    s = head(fid, h, 'El registro, capa por capa', 'El registro, capa por capa',
             'Registrar un usuario son dos operaciones contra Supabase. Solo una pieza sabe que son dos y en qué orden van.',
             'Mapa de capas del registro. En presentación, RegisterScreen le manda un evento a RegisterBloc. RegisterBloc llama a '
             'SignUpUseCase, en el dominio, que usa dos contratos: primero AuthRepository y después ProfileRepository. En la capa de '
             'datos, AuthRepositoryImpl usa SupabaseAuthDataSource, que habla con Supabase Auth, y ProfileRepositoryImpl usa '
             'SupabaseProfileDataSource, que habla con la tabla profiles.')
    s += band(104, 96, 'violet', 'PRESENTACIÓN', 'Muestra y avisa')
    s += band(216, 176, 'amber', 'DOMINIO', 'Decide el orden')
    s += band(408, 168, 'teal', 'DATOS', 'Habla con Supabase')
    s += band(592, 88, 'slate', 'SUPABASE', 'Servicio externo')
    s += '  <path class="link" d="M432,154 H526"/>\n'
    s += '  <text x="480" y="146" text-anchor="middle" font-size="12" font-weight="600" fill="#556074">evento</text>\n'
    s += '  <path class="link" d="M628,176 V208 H480 V242"/>\n'
    s += '  <text x="554" y="202" text-anchor="middle" font-size="12" font-weight="600" fill="#556074">llama</text>\n'
    s += '  <path class="link" d="M440,292 V308 H332 V322"/>\n  <path class="link" d="M520,292 V308 H628 V322"/>\n'
    s += '  <path class="link" stroke-dasharray="5 4" d="M332,436 V370"/>\n  <path class="link" stroke-dasharray="5 4" d="M628,436 V370"/>\n'
    s += '  <text x="342" y="404" font-size="12" font-weight="600" fill="#556074">implementa</text>\n'
    s += '  <text x="638" y="404" font-size="12" font-weight="600" fill="#556074">implementa</text>\n'
    s += '  <path class="link" d="M332,480 V510"/>\n  <path class="link" d="M628,480 V510"/>\n'
    s += '  <path class="link" d="M332,556 V612"/>\n  <path class="link" d="M628,556 V612"/>\n'
    s += '  ' + box(232, 132, 200, 44, 'violet', 'RegisterScreen')
    s += '  ' + box(528, 132, 200, 44, 'violet', 'RegisterBloc')
    s += '  ' + box(380, 244, 200, 48, 'amber', 'SignUpUseCase', hero=True)
    s += '  ' + box(232, 324, 200, 44, 'indigo', 'AuthRepository')
    s += '  ' + box(528, 324, 200, 44, 'indigo', 'ProfileRepository')
    s += '  ' + chip(386, 308, 1) + '  ' + chip(574, 308, 2)
    s += '  <text x="748" y="262" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="150">Aquí se decide el</text>\n'
    s += '  <text x="748" y="279" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="150">orden: 1 y luego 2.</text>\n'
    s += '  ' + box(232, 436, 200, 44, 'teal', 'AuthRepositoryImpl')
    s += '  ' + box(528, 436, 200, 44, 'teal', 'ProfileRepositoryImpl')
    s += '  ' + box(220, 512, 224, 44, 'teal', 'SupabaseAuthDataSource', fs=12.5)
    s += '  ' + box(516, 512, 224, 44, 'teal', 'SupabaseProfileDataSource', fs=12.5)
    s += '  ' + box(232, 614, 200, 44, 'slate', 'Supabase Auth', mono=False)
    s += '  ' + box(528, 614, 200, 44, 'slate', 'tabla profiles', mono=False)
    return s + tail(h, 'Los dos contratos son del dominio. Quién los cumple, y con qué servicio, es asunto de la capa de datos.')


FIGS['l5Mapa'] = l5_mapa


def l5_secuencia():
    fid, h = 'l5Secuencia', 548
    s = head(fid, h, 'El <tspan class="mono">UseCase</tspan> pone el orden', 'El UseCase pone el orden',
             'Primero la cuenta, después el perfil. El segundo paso usa lo que devolvió el primero.',
             'Diagrama de secuencia. RegisterBloc le pide el registro a SignUpUseCase. Paso 1: el UseCase llama a signUp en '
             'AuthRepository y recibe un AuthUser con su id. Paso 2: con ese id arma un Profile y llama a createProfile en '
             'ProfileRepository. Cuando el perfil queda guardado, el UseCase le devuelve el Profile a RegisterBloc.',
             colors=('green',))
    cols = [(144, 'violet', 'RegisterBloc', False), (368, 'amber', 'SignUpUseCase', True),
            (608, 'indigo', 'AuthRepository', False), (832, 'indigo', 'ProfileRepository', False)]
    for cx, color, name, hero in cols:
        s += f'  <path d="M{cx},156 V480" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 5"/>\n'
        s += '  ' + box(cx - 88, 112, 176, 44, color, name, hero=hero)
    s += '  <rect x="362" y="188" width="12" height="268" rx="4" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>\n'

    def msg(y, x1, x2, label, lx, dashed=False, color='#556074', mono=False, bold=False):
        cls = 'ar-green' if color == '#3A8235' else 'link'
        dash = ' stroke-dasharray="5 4"' if dashed else ''
        fam = 'class="mono" ' if mono else ''
        return (f'  <path class="{cls}"{dash} d="M{x1},{y} H{x2}"/>\n'
                f'  <text {fam}x="{lx}" y="{y-9}" text-anchor="middle" font-size="12.5" font-weight="{700 if bold else 600}" fill="{color}" data-fit="216">{label}</text>\n')

    s += msg(204, 144, 360, 'pide el registro', 253)
    s += msg(256, 374, 606, 'signUp(email, password)', 500, mono=True)
    s += msg(304, 608, 376, 'AuthUser, con su id', 492, dashed=True, color='#3A8235', bold=True)
    s += msg(356, 374, 830, 'createProfile(profile)', 720, mono=True)
    s += msg(404, 832, 376, 'perfil guardado', 720, dashed=True, color='#3A8235', bold=True)
    s += msg(452, 362, 146, 'Profile', 253, dashed=True, color='#3A8235', bold=True)
    s += '  ' + chip(398, 256, 1) + '  ' + chip(398, 356, 2)
    s += '  ' + note(152, 292, 198, 'amber', 'El orden importa', ['El Profile se arma con el id', 'que devuelve el paso 1.'])
    return s + tail(h, 'RegisterBloc hace una sola llamada. No sabe que por dentro hay dos pasos.')


FIGS['l5Secuencia'] = l5_secuencia


def l5_donde():
    fid, h = 'l5Donde', 476
    s = head(fid, h, 'Dónde se escribe la secuencia', 'Dónde se escribe la secuencia',
             'El «1 y luego 2» se puede escribir en tres lugares. Solo en uno queda bien.',
             'Tres opciones comparadas. Escribir la secuencia en el Bloc no sirve: otra pantalla que registre tendría que repetirla. '
             'Escribirla en el DataSource tampoco: queda escondida en el código de Supabase y se pierde al cambiar de proveedor. '
             'Escribirla en el UseCase sí: queda en un solo lugar, sin Flutter ni Supabase.')
    cards = [
        ('rose', 'NO', 'En el Bloc', 0, ['Otra pantalla que registre', 'tendría que repetir el orden.', 'La vista termina decidiendo.']),
        ('rose', 'NO', 'En el DataSource', 2, ['El orden queda escondido en', 'el código de Supabase. Cambiar', 'de proveedor se lo lleva.']),
        ('green', 'SÍ', 'En el UseCase', 1, ['Un solo lugar, sin Flutter ni', 'Supabase. Se lee de corrido y', 'se prueba sin pantalla ni red.']),
    ]
    layers = ['RegisterBloc', 'SignUpUseCase', 'DataSource']
    for i, (color, tag, title, where, lines) in enumerate(cards):
        soft, border, strong = FAM[color]
        x = 48 + i * 296
        s += f'  <g transform="translate({x},104)"><rect width="272" height="312" rx="12" fill="#FFFFFF" stroke="{border if color == "green" else "#D9DEE8"}" stroke-width="{2.5 if color == "green" else 1.5}"/>\n'
        s += f'    <rect x="20" y="18" width="40" height="24" rx="12" fill="{soft}" stroke="{border}" stroke-width="1.5"/>\n'
        s += f'    <text x="40" y="30" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="{strong}">{tag}</text>\n'
        s += f'    <text x="72" y="30" dy="0.35em" font-size="15" font-weight="700" fill="#161A26" data-fit="180">{title}</text>\n'
        s += '    <path class="tree" d="M100,104 V116 M100,160 V172"/>\n'
        for j, name in enumerate(layers):
            y = 60 + j * 56
            if j == where:
                s += '    ' + box(24, y, 152, 44, color, name, hero=True, fs=12.5)
                s += f'    <path d="M176,{y+22} H190" stroke="{strong}" stroke-width="1.75"/>\n'
                s += f'    <rect x="190" y="{y+8}" width="62" height="28" rx="14" fill="{strong}"/>\n'
                s += f'    <text x="221" y="{y+22}" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#FFFFFF">1 → 2</text>\n'
            else:
                s += '    ' + box(24, y, 152, 44, 'slate', name, fs=12.5)
        for j, ln in enumerate(lines):
            s += f'    <text x="24" y="{250 + j*18}" font-size="12.5" fill="#454C61" data-fit="228">{ln}</text>\n'
        s += '  </g>\n'
    return s + tail(h, 'La etiqueta «1 → 2» marca quién encadena signUp y createProfile en cada opción.')


FIGS['l5Donde'] = l5_donde


def l5_falla():
    fid, h = 'l5Falla', 400
    s = head(fid, h, 'Si el segundo paso falla', 'Si el segundo paso falla',
             'La cuenta ya existe y el perfil no. La excepción sube, y quien decide qué hacer con ella es el UseCase.',
             'Cuatro momentos. Uno: signUp sale bien y la cuenta queda creada en Supabase Auth. Dos: createProfile falla y lanza una '
             'excepción. Tres: SignUpUseCase la atrapa, cierra la sesión y lanza un error propio del dominio. Cuatro: RegisterBloc '
             'recibe ese error, emite el estado de error y la pantalla muestra el mensaje.',
             colors=('rose',))
    cards = [
        ('green', 'signUp', ['Sale bien. La cuenta', 'queda creada en', 'Supabase Auth.'], 'cuenta creada'),
        ('rose', 'createProfile', ['El insert falla y', 'lanza una excepción.', 'No hay perfil.'], 'lanza excepción'),
        ('amber', 'SignUpUseCase', ['La atrapa, cierra la', 'sesión y lanza un', 'error del dominio.'], 'try · catch'),
        ('violet', 'RegisterBloc', ['Emite el estado de', 'error. La pantalla', 'muestra el mensaje.'], 'estado de error'),
    ]
    for i, (color, title, lines, tag) in enumerate(cards):
        soft, border, strong = FAM[color]
        x = 48 + i * 220
        s += f'  <g transform="translate({x},112)"><rect width="204" height="180" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>\n'
        s += '    ' + chip(28, 32, i + 1, color)
        s += f'    <text class="mono" x="16" y="70" font-size="14" font-weight="700" fill="#161A26" data-fit="176">{title}</text>\n'
        for j, ln in enumerate(lines):
            s += f'    <text x="16" y="{93 + j*18}" font-size="13" fill="#454C61" data-fit="176">{ln}</text>\n'
        s += f'    <rect x="16" y="142" width="172" height="24" rx="6" fill="{soft}" stroke="{border}" stroke-width="1.25"/>\n'
        s += f'    <text x="102" y="154" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="{strong}" data-fit="160">{tag}</text>\n  </g>\n'
    s += '  <path d="M48,316 V324 H692 V316" fill="none" stroke="#F0C572" stroke-width="2"/>\n'
    s += '  <text class="h" x="370" y="346" text-anchor="middle" style="fill:#A96C05" data-fit="600">LO COORDINA EL USECASE</text>\n'
    s += '  <path d="M708,316 V324 H912 V316" fill="none" stroke="#C9A6EE" stroke-width="2"/>\n'
    s += '  <text class="h" x="810" y="346" text-anchor="middle" style="fill:#7439B8" data-fit="200">SOLO MUESTRA</text>\n'
    return s + tail(h, 'Dejar pasar la excepción, reintentar o cerrar la sesión: cualquiera de las tres es una decisión del UseCase.')


FIGS['l5Falla'] = l5_falla


# ───────────────────────────── Laboratorio 5: Registro de usuarios


STEPS = {
    1: 'RegisterBloc', 2: 'RegisterScreen', 3: 'Las dos entidades', 4: 'Los dos contratos', 5: 'SignUpUseCase',
    6: 'Los datos de Auth', 7: 'Los datos del perfil', 8: 'main.dart', 9: 'HomeScreen y la prueba',
}
NODES = [
    (216, 140, 120, 'violet', 'HomeScreen', 9), (352, 140, 128, 'violet', 'RegisterScreen', 2),
    (504, 140, 128, 'violet', 'RegisterBloc', 1), (768, 140, 128, 'violet', 'main.dart', 8),
    (316, 256, 152, 'indigo', 'AuthUser', 3), (492, 256, 152, 'amber', 'SignUpUseCase', 5), (668, 256, 152, 'indigo', 'Profile', 3),
    (304, 340, 176, 'indigo', 'AuthRepository', 4), (656, 340, 176, 'indigo', 'ProfileRepository', 4),
    (304, 452, 176, 'teal', 'AuthRepositoryImpl', 6), (656, 452, 176, 'teal', 'ProfileRepositoryImpl', 7),
    (288, 528, 208, 'teal', 'SupabaseAuthDataSource', 6), (636, 528, 216, 'teal', 'SupabaseProfileDataSource', 7),
]


def l5_ruta(step=None):
    """Sin step, el mapa completo con el número de paso de cada pieza. Con step, ese paso resaltado."""
    fid, h = ('l5Ruta' if step is None else f'l5P{step}'), 760
    if step is None:
        s = head(fid, h, 'El mapa del laboratorio', 'El mapa del laboratorio',
                 'Cada caja es una clase y el número dice en qué paso la construyes. A la izquierda, lo de Auth. A la derecha, lo del perfil.',
                 'Mapa de capas de la Parte 1, con dos columnas: Auth a la izquierda y el perfil a la derecha. Presentación: RegisterBloc '
                 'en el paso 1 y RegisterScreen en el 2. Dominio: AuthUser y Profile en el paso 3, AuthRepository y ProfileRepository en '
                 'el 4, SignUpUseCase en el 5, que usa los dos contratos en orden. Datos: SupabaseAuthDataSource y AuthRepositoryImpl en '
                 'el paso 6, SupabaseProfileDataSource y ProfileRepositoryImpl en el 7. De vuelta en presentación, main.dart en el 8 y '
                 'HomeScreen en el 9. Abajo, Supabase Auth y la tabla profiles.')
    else:
        names = ', '.join(n[4] for n in NODES if n[5] == step)
        s = head(fid, h, f'Paso {step} · {STEPS[step]}', f'Paso {step} · {STEPS[step]}',
                 'Resaltado, lo que escribes en este paso. Con marca verde, lo que ya está. En gris, lo que falta.',
                 f'El mapa del laboratorio en el paso {step}. Se escribe: {names}. Las piezas de los pasos anteriores aparecen '
                 'marcadas como hechas y las de los pasos siguientes, atenuadas.')
    s += band(104, 104, 'violet', 'PRESENTACIÓN', 'Pantallas y Bloc')
    s += band(224, 184, 'amber', 'DOMINIO', 'Reglas y contratos')
    s += band(424, 168, 'teal', 'DATOS', 'Habla con Supabase')
    s += band(608, 88, 'slate', 'SUPABASE', 'Servicio externo')
    s += '  <path class="link" d="M480,162 H502"/>\n  <path class="link" d="M352,162 H338"/>\n'
    s += '  <path class="link" stroke-dasharray="5 4" d="M768,162 H634"/>\n'
    s += '  <text x="700" y="152" text-anchor="middle" font-size="12" font-weight="600" fill="#556074">arma</text>\n'
    s += '  <path class="link" d="M568,184 V254"/>\n'
    s += '  <path class="link" d="M540,300 V318 H392 V338"/>\n  <path class="link" d="M596,300 V318 H744 V338"/>\n'
    s += '  <text x="530" y="334" text-anchor="end" font-size="12" font-weight="700" fill="#A96C05">1.º</text>\n'
    s += '  <text x="606" y="334" font-size="12" font-weight="700" fill="#A96C05">2.º</text>\n'
    s += '  <path class="link" stroke-dasharray="5 4" d="M392,452 V386"/>\n  <path class="link" stroke-dasharray="5 4" d="M744,452 V386"/>\n'
    s += '  <text x="402" y="441" font-size="12" font-weight="600" fill="#556074">implementa</text>\n'
    s += '  <text x="754" y="441" font-size="12" font-weight="600" fill="#556074">implementa</text>\n'
    s += '  <path class="link" d="M392,496 V526"/>\n  <path class="link" d="M744,496 V526"/>\n'
    s += '  <path class="link" d="M392,572 V628"/>\n  <path class="link" d="M744,572 V628"/>\n'
    for x, y, w, color, name, n in NODES:
        soft, border, strong = FAM[color]
        if step is not None and n > step:
            s += (f'  <rect x="{x}" y="{y}" width="{w}" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>\n'
                  f'  <text class="mono" x="{x + w/2:.0f}" y="{y+22}" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="{w-16}">{name}</text>\n')
            continue
        active = step is not None and n == step
        if active:
            s += f'  <rect x="{x-5}" y="{y-5}" width="{w+10}" height="54" rx="14" fill="none" stroke="{strong}" stroke-width="3"/>\n'
        s += '  ' + box(x, y, w, 44, color, name, fs=12.5)
        if step is None or active:
            s += '  ' + chip(x + 6, y + 2, n)
        else:
            s += (f'  <circle cx="{x+6}" cy="{y+2}" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/>'
                  f'<path d="M{x+1.5},{y+2} l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n')
    s += '  ' + box(304, 630, 176, 44, 'slate', 'Supabase Auth', mono=False)
    s += '  ' + box(656, 630, 176, 44, 'slate', 'tabla profiles', mono=False)
    foot = ('SignUpUseCase es la única pieza que conoce las dos columnas: primero crea la cuenta y después guarda el perfil.'
            if step is None else 'El mapa es el mismo en todos los pasos: solo cambia lo que está resaltado.')
    return s + tail(h, foot)


FIGS['l5Ruta'] = l5_ruta
for _k in STEPS:
    FIGS[f'l5P{_k}'] = lambda k=_k: l5_ruta(k)


def l5_form():
    fid, h = 'l5Form', 488
    s = head(fid, h, 'Un formulario, dos destinos', 'Un formulario, dos destinos',
             'El formulario de registro pide cinco datos, pero no todos van al mismo lugar.',
             'El formulario Crear cuenta tiene cinco campos. Nombre de usuario y nombre completo van a la tabla profiles. Correo y '
             'contraseña van a Supabase Auth. La confirmación de la contraseña no se envía: solo se compara en la pantalla.',
             colors=('indigo', 'amber'))
    s += '  ' + phone(48, 112, 256, 312, 'Crear cuenta')
    fields = ['Nombre de usuario', 'Nombre completo', 'Correo', 'Contraseña', 'Confirmar contraseña']
    for k, label in enumerate(fields):
        s += f'  <rect x="64" y="{168+k*40}" width="224" height="28" rx="6" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.25"/>\n'
        s += f'  <text x="76" y="{182+k*40}" dy="0.35em" font-size="12.5" fill="#454C61">{label}</text>\n'
    s += '  <rect x="64" y="376" width="224" height="30" rx="15" fill="#4453C9"/>\n'
    s += '  <text x="176" y="391" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#FFFFFF">Registrarme</text>\n'
    s += '  <path class="ar-indigo" d="M288,182 H440 V160 H622"/>\n  <path d="M288,222 H440 V182" fill="none" stroke="#4453C9" stroke-width="1.75"/>\n'
    s += '  <path class="ar-amber" d="M288,262 H480 V284 H622"/>\n  <path d="M288,302 H480 V284" fill="none" stroke="#A96C05" stroke-width="1.75"/>\n'
    s += '  <path class="link" stroke-dasharray="5 4" d="M288,342 H440 V398 H622"/>\n'
    s += '  <text x="531" y="150" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9">van a tu tabla</text>\n'
    s += '  <text x="551" y="274" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">van a Auth</text>\n'
    s += '  <text x="531" y="388" text-anchor="middle" font-size="12.5" font-weight="600" fill="#556074">no se envía</text>\n'
    s += '  ' + box(624, 128, 288, 64, 'indigo', 'profiles', sub='username · full_name')
    s += '  ' + box(624, 252, 288, 64, 'amber', 'Supabase Auth', sub='correo · contraseña', mono=False)
    s += '  ' + note(624, 360, 288, 'slate', 'Se queda en la pantalla', ['Solo se compara con la contraseña', 'antes de lanzar el evento.'])
    return s + tail(h, 'SignUpUseCase reparte los datos: primero Auth y después profiles, con el id que Auth devolvió.')


FIGS['l5Form'] = l5_form


def l5_carpetas():
    fid = 'l5Carpetas'
    rows = [
        (0, 'lib/', 'slate', '', ''),
        (1, 'main.dart', 'violet', 'Inicializa Supabase y arma las rutas', '8'),
        (1, 'features/', 'slate', '', ''),
        (2, 'auth/', 'slate', 'Lo que comparten registro y login', ''),
        (3, 'domain/', 'amber', 'No importa nada de Flutter ni de Supabase', ''),
        (4, 'entities/auth_user.dart', 'amber', 'Lo que devuelve Auth', '3'),
        (4, 'entities/profile.dart', 'amber', 'Lo que guardas en tu tabla', '3'),
        (4, 'repository/auth_repository.dart', 'amber', 'El contrato de autenticación', '4'),
        (4, 'repository/profile_repository.dart', 'amber', 'El contrato del perfil', '4'),
        (4, 'usecases/sign_up_usecase.dart', 'amber', 'Registrar: los dos pasos, en orden', '5'),
        (3, 'data/', 'teal', 'El único lugar que conoce a Supabase', ''),
        (4, 'source/supabase_auth_data_source.dart', 'teal', 'Las llamadas a Auth', '6'),
        (4, 'repository/auth_repository_impl.dart', 'teal', 'Cumple el contrato', '6'),
        (4, 'source/supabase_profile_data_source.dart', 'teal', 'El insert en profiles', '7'),
        (4, 'repository/profile_repository_impl.dart', 'teal', 'Cumple el contrato', '7'),
        (2, 'register/ui/', 'violet', 'La pantalla de registro y su Bloc', ''),
        (3, 'bloc/', 'violet', 'register_bloc · register_event · register_state', '1'),
        (3, 'screens/register_screen.dart', 'violet', 'Ya viene dibujada: se conecta', '2'),
        (2, 'home/ui/screens/home_screen.dart', 'violet', 'A donde llega quien se registra', '9'),
        (2, 'login/ui/', 'violet', 'La Parte 2, con la misma forma', ''),
    ]
    y0, rh = 112, 34
    h = y0 + rh * len(rows) + 64
    s = head(fid, h, 'La estructura de carpetas', 'La estructura de carpetas',
             'auth/ guarda lo que se comparte. register/ y login/ solo tienen su pantalla y su Bloc.',
             'Árbol de carpetas dentro de lib: main.dart y features. En features, auth con domain (entities, repository y usecases) y '
             'data (source y repository); register con ui (bloc y screens); home con su pantalla; y login, que es la Parte 2. Cada archivo indica el '
             'paso del laboratorio en que se crea.')
    s += f'  <rect x="48" y="96" width="864" height="{rh*len(rows)+20}" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>\n'
    last = {}
    for i, (lvl, name, color, text, step) in enumerate(rows):
        soft, border, strong = FAM[color]
        y = y0 + i * rh + 12
        x = 68 + lvl * 24
        if lvl:
            py = last[lvl - 1]
            s += f'  <path d="M{x-14},{py+13} V{y} H{x-3}" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>\n'
        last[lvl] = y
        folder = name.endswith('/')
        w = len(name) * 7.5 + 20
        s += f'  <rect x="{x}" y="{y-13}" width="{w:.0f}" height="26" rx="{8 if folder else 4}" fill="{soft}" stroke="{border}" stroke-width="1.5"/>\n'
        s += f'  <text class="mono" x="{x+10}" y="{y}" dy="0.35em" font-size="12.5" font-weight="600" fill="{strong}" data-fit="{w-12:.0f}">{name}</text>\n'
        if text:
            s += f'  <text x="516" y="{y}" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">{text}</text>\n'
        if step:
            s += '  ' + chip(880, y, step)
    s += f'  <text class="h" x="892" y="88" text-anchor="end">PASO</text>\n'
    return s + tail(h, 'Los nombres de archivo van en minúscula y con guion bajo.')


FIGS['l5Carpetas'] = l5_carpetas


def l5_estado():
    fid, h = 'l5Estado', 540
    s = head(fid, h, 'Un solo estado, cuatro momentos', 'Un solo estado, cuatro momentos',
             'RegisterState es una sola clase. El momento lo dice el campo status, y copyWith cambia solo lo que hace falta.',
             'Cuatro columnas, una por valor de RegisterStatus. En initial la pantalla muestra el formulario. En loading, el formulario con '
             'un indicador de progreso en lugar del botón; copyWith cambia solo status. En success la app navega a la pantalla de '
             'inicio; copyWith cambia status y profile. En failure vuelve el formulario con el mensaje de error; copyWith cambia status y '
             'errorMessage.')
    cols = [
        (150, 'slate', 'initial', 'const RegisterState()', 'el estado de arranque'),
        (370, 'amber', 'loading', 'status', 'lo demás se conserva'),
        (590, 'green', 'success', 'status · profile', 'llega el Profile'),
        (810, 'rose', 'failure', 'status · errorMessage', 'llega el mensaje'),
    ]
    for cx, color, status, change, why in cols:
        soft, border, strong = FAM[color]
        s += '  ' + box(cx - 96, 108, 192, 36, color, f'status: {status}', fs=13)
        s += f'  <path class="link" d="M{cx},144 V166"/>\n'
        px, py = cx - 80, 170
        title = 'Perfil' if status == 'success' else 'Crear cuenta'
        s += '  ' + phone(px, py, 160, 216, title)
        if status == 'success':
            s += f'  <circle cx="{cx}" cy="{py+104}" r="18" fill="#E8F6E3" stroke="#3A8235" stroke-width="2"/>\n'
            s += f'  <path d="M{cx-8},{py+104} l6,6 l11,-12" fill="none" stroke="#3A8235" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>\n'
            s += f'  <text x="{cx}" y="{py+148}" dy="0.35em" text-anchor="middle" font-size="13" fill="#161A26" data-fit="140">@ana.dev</text>\n'
        else:
            for k, label in enumerate(['correo', 'contraseña']):
                s += f'  <rect x="{px+16}" y="{py+58+k*36}" width="128" height="26" rx="6" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.25"/>\n'
                s += f'  <text x="{px+26}" y="{py+71+k*36}" dy="0.35em" font-size="12" fill="#79809A">{label}</text>\n'
            if status == 'loading':
                s += '  ' + spinner(cx, py + 150, 13)
            else:
                s += f'  <rect x="{px+16}" y="{py+136}" width="128" height="28" rx="14" fill="#4453C9"/>\n'
                s += f'  <text x="{cx}" y="{py+150}" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#FFFFFF">Registrarme</text>\n'
            if status == 'failure':
                s += f'  <text x="{cx}" y="{py+188}" dy="0.35em" text-anchor="middle" font-size="12" font-weight="600" fill="#C2354F" data-fit="140">El correo ya existe</text>\n'
        s += f'  <text class="h" x="{cx}" y="414" text-anchor="middle">{"SE CREA CON" if status == "initial" else "copyWith CAMBIA"}</text>\n'
        s += f'  <rect x="{cx-96}" y="424" width="192" height="26" rx="6" fill="{soft}" stroke="{border}" stroke-width="1.25"/>\n'
        s += f'  <text class="mono" x="{cx}" y="437" dy="0.35em" text-anchor="middle" font-size="12" font-weight="600" fill="{strong}" data-fit="180">{change}</text>\n'
        s += f'  <text x="{cx}" y="468" text-anchor="middle" font-size="12.5" fill="#454C61" data-fit="190">{why}</text>\n'
    return s + tail(h, 'LoginState se arma igual en la Parte 2, con su propio LoginStatus.')


FIGS['l5Estado'] = l5_estado


def l5_tabla():
    fid, h = 'l5Tabla', 424
    s = head(fid, h, 'La tabla <tspan class="mono">profiles</tspan>', 'La tabla profiles',
             'Supabase Auth guarda la cuenta. El username y el nombre van en una tabla tuya, unida a la cuenta por el mismo id.',
             'Dos tablas. auth.users la maneja Supabase Auth y tiene id y email. profiles la creas tú y tiene id, username y full_name. El id de '
             'profiles es llave primaria y a la vez referencia al id de auth.users: cada perfil lleva el mismo id de su cuenta.')

    def table(x, color, name, who, cols):
        soft, border, strong = FAM[color]
        o = f'  <rect x="{x}" y="116" width="296" height="{44 + 40*len(cols)}" rx="12" fill="#FFFFFF" stroke="{border}" stroke-width="2"/>\n'
        o += f'  <path d="M{x},160 V128 A12,12 0 0 1 {x+12},116 H{x+284} A12,12 0 0 1 {x+296},128 V160 Z" fill="{soft}" stroke="{border}" stroke-width="2"/>\n'
        o += f'  <text class="mono" x="{x+16}" y="138" dy="0.35em" font-size="14" font-weight="700" fill="{strong}">{name}</text>\n'
        o += f'  <text x="{x+280}" y="138" dy="0.35em" text-anchor="end" font-size="12" fill="#454C61" data-fit="150">{who}</text>\n'
        for i, (col, typ, key) in enumerate(cols):
            y = 180 + i * 40
            if i:
                o += f'  <path d="M{x+1},{y-20} H{x+295}" stroke="#E4E7EE" stroke-width="1.25"/>\n'
            o += f'  <text class="mono" x="{x+16}" y="{y}" dy="0.35em" font-size="13.5" font-weight="{700 if key else 400}" fill="#161A26">{col}</text>\n'
            o += f'  <text class="mono" x="{x+130}" y="{y}" dy="0.35em" font-size="12.5" fill="#79809A">{typ}</text>\n'
            if key:
                o += f'  <rect x="{x+296-16-len(key)*7.4-16:.0f}" y="{y-11}" width="{len(key)*7.4+16:.0f}" height="22" rx="11" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>\n'
                o += f'  <text x="{x+296-24-len(key)*3.7:.0f}" y="{y}" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#A96C05">{key}</text>\n'
        return o

    s += table(96, 'slate', 'auth.users', 'la maneja Supabase Auth', [('id', 'uuid', 'PK'), ('email', 'text', ''), ('…', '', '')])
    s += table(568, 'indigo', 'profiles', 'la creaste tú', [('id', 'uuid', 'PK · FK'), ('username', 'text', ''), ('full_name', 'text', '')])
    s += '  <path class="link" d="M568,180 H394"/>\n'
    s += '  <text x="480" y="170" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">el mismo id</text>\n'
    s += '  <text x="480" y="200" text-anchor="middle" font-size="12" fill="#454C61">references</text>\n'
    s += '  ' + note(96, 300, 296, 'slate', 'Paso 1 del registro', ['signUp crea esta fila y devuelve su id.'])
    s += '  ' + note(568, 300, 296, 'indigo', 'Paso 2 del registro', ['createProfile inserta aquí ese mismo id', 'junto con username y full_name.'])
    return s + tail(h, 'on delete cascade: si se borra la cuenta, su perfil se borra con ella.')


FIGS['l5Tabla'] = l5_tabla


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
