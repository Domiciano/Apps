"""Figuras SVG de la lección «Laboratorio 5 a nivel conceptual» (0090).

    python3 tools/lab5_figuras.py <carpeta>     escribe un .svg por figura, para revisarlas
    python3 tools/lab5_figuras.py --inject      reemplaza cada bloque ```svg de content/lab5concept.md
                                                por la figura con el mismo id

No editar los SVG dentro del Markdown: se cambia este script y se vuelve a inyectar.
Colores por capa, iguales en todas las figuras: presentación violeta, UseCase ámbar, contratos del
dominio índigo, datos teal, Supabase gris, éxito verde, error rosa.
"""

import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from bloc_figuras import FAM, box, chip, head, note, tail  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
LESSONS = ['lab5concept.md']
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
             'datos, AuthRepositoryImpl y ProfileRepositoryImpl implementan esos contratos con SupabaseAuthDataSource, que habla con '
             'Supabase Auth y con la tabla profiles.')
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
    s += '  ' + box(280, 512, 400, 44, 'teal', 'SupabaseAuthDataSource')
    s += '  ' + box(232, 614, 200, 44, 'slate', 'Supabase Auth', mono=False)
    s += '  ' + box(528, 614, 200, 44, 'slate', 'tabla profiles', mono=False)
    return s + tail(h, 'Los dos contratos son del dominio. Quién los cumple, y con qué servicio, es asunto de la capa de datos.')


FIGS['l5Mapa'] = l5_mapa


def l5_secuencia():
    fid, h = 'l5Secuencia', 548
    s = head(fid, h, 'El <tspan class="mono">UseCase</tspan> pone el orden', 'El UseCase pone el orden',
             'Primero la cuenta, después el perfil. El segundo paso usa lo que devolvió el primero.',
             'Diagrama de secuencia. RegisterBloc le pide el registro a SignUpUseCase. Paso 1: el UseCase llama a signUp en '
             'AuthRepository y recibe un AuthUser con su id. Paso 2: el UseCase llama a createProfile en ProfileRepository con ese id y '
             'el username. Cuando el perfil queda guardado, el UseCase le devuelve el AuthUser a RegisterBloc.',
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
    s += msg(356, 374, 830, 'createProfile(id, username)', 720, mono=True)
    s += msg(404, 832, 376, 'perfil guardado', 720, dashed=True, color='#3A8235', bold=True)
    s += msg(452, 362, 146, 'AuthUser', 253, dashed=True, color='#3A8235', bold=True)
    s += '  ' + chip(398, 256, 1) + '  ' + chip(398, 356, 2)
    s += '  ' + note(152, 292, 198, 'amber', 'El orden importa', ['El paso 2 necesita el id', 'que devuelve el paso 1.'])
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
