"""Figuras SVG de «Configurando los servicios» (0091).

    python3 tools/supabase_cli_figuras.py <carpeta>     escribe un .svg por figura, para revisarlas
    python3 tools/supabase_cli_figuras.py --inject      reemplaza cada bloque ```svg de content/lessonH1cli.md
                                                        por la figura con el mismo id

No editar los SVG dentro del Markdown: se cambia este script y se vuelve a inyectar.
Colores: el módulo de Auth en ámbar, la base de datos en índigo, la consola en teal.
"""

import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from bloc_figuras import FAM, chip, head, note, phone, tail  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
LESSONS = ['lessonH1cli.md']
FIGS = {}
UID = '3f2a9c1e-7b…'
HASH = '$2a$10$N9qo8uLOickgx2Z…'


def record(x, y, w, color, name, who, rows, vx=150, rh=36):
    soft, border, strong = FAM[color]
    hh = 40
    o = f'  <rect x="{x}" y="{y}" width="{w}" height="{hh + rh*len(rows)}" rx="12" fill="#FFFFFF" stroke="{border}" stroke-width="2"/>\n'
    o += (f'  <path d="M{x},{y+hh} V{y+12} A12,12 0 0 1 {x+12},{y} H{x+w-12} A12,12 0 0 1 {x+w},{y+12} V{y+hh} Z" '
          f'fill="{soft}" stroke="{border}" stroke-width="2"/>\n')
    o += f'  <text class="mono" x="{x+16}" y="{y+hh/2:.0f}" dy="0.35em" font-size="14" font-weight="700" fill="{strong}">{name}</text>\n'
    if who:
        o += f'  <text x="{x+w-16}" y="{y+hh/2:.0f}" dy="0.35em" text-anchor="end" font-size="12" fill="#454C61" data-fit="{w-150}">{who}</text>\n'
    for i, (col, val, hot) in enumerate(rows):
        cy = y + hh + rh * i + rh / 2
        if hot:
            o += f'  <rect x="{x+6}" y="{cy-rh/2+4:.0f}" width="{w-12}" height="{rh-8}" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>\n'
        elif i:
            o += f'  <path d="M{x+1},{cy-rh/2:.0f} H{x+w-1}" stroke="#E4E7EE" stroke-width="1.25"/>\n'
        o += f'  <text class="mono" x="{x+16}" y="{cy:.0f}" dy="0.35em" font-size="13" font-weight="{700 if hot else 400}" fill="#161A26">{col}</text>\n'
        o += f'  <text class="mono" x="{x+vx}" y="{cy:.0f}" dy="0.35em" font-size="12.5" fill="{"#A96C05" if hot else "#79809A"}" data-fit="{w-vx-14}">{val}</text>\n'
    return o


def sv_dos():
    fid, h = 'svDos', 484
    s = head(fid, h, 'Dos lugares para un mismo usuario', 'Dos lugares para un mismo usuario',
             'Auth guarda lo necesario para saber quién eres. Todo lo demás sobre el usuario va en una tabla tuya.',
             'Dos registros lado a lado. A la izquierda, auth.users, que maneja el módulo de Auth: id, email, encrypted_password, '
             'email_confirmed_at y last_sign_in_at. A la derecha, profiles, una tabla que diseñas tú en la base de datos: id, username '
             'y name. Auth responde quién eres; profiles guarda cómo te llamas y lo que la app necesite.')
    s += record(48, 112, 416, 'amber', 'auth.users', 'MÓDULO DE AUTH', [
        ('id', UID, False), ('email', 'ana@icesi.edu.co', False), ('encrypted_password', HASH, False),
        ('email_confirmed_at', '2026-10-05 09:14', False), ('last_sign_in_at', '2026-10-05 09:15', False)], vx=190)
    s += record(496, 112, 416, 'indigo', 'profiles', 'TU BASE DE DATOS', [
        ('id', UID, False), ('username', 'ana.dev', False), ('name', 'Ana Gómez', False)], vx=190)
    s += '  ' + note(496, 272, 416, 'indigo', 'La diseñas tú', ['Nombre, username, foto, carrera: lo que tu app necesite.', 'Auth no tiene columnas para eso.'])
    s += '  ' + note(48, 348, 416, 'amber', 'La maneja Supabase', ['Tu app nunca escribe aquí directamente:', 'usa signUp y signInWithPassword.'])
    s += '  ' + note(496, 365, 416, 'slate', 'La pregunta de cada una', ['Auth: ¿quién eres? · profiles: ¿qué sabemos de ti?'])
    return s + tail(h, 'auth.users tiene más columnas. Estas son las que importan para entender el registro y el inicio de sesión.')


FIGS['svDos'] = sv_dos


def sv_hash():
    fid, h = 'svHash', 416
    s = head(fid, h, 'La contraseña no se guarda', 'La contraseña no se guarda',
             'Auth guarda un hash: el resultado de pasar la contraseña por una función que no tiene camino de vuelta.',
             'La contraseña MiClave123 que escribe el usuario pasa por la función bcrypt y se convierte en un hash, que es lo único '
             'que Auth guarda en la columna encrypted_password. Del hash no se puede volver a la contraseña. Al iniciar sesión, Auth '
             'hashea lo que el usuario escribe y compara los dos hashes.',
             colors=('rose',))
    cards = [
        (48, 'slate', 'LO QUE ESCRIBE EL USUARIO', 'MiClave123', 'Viaja cifrada hasta Supabase.'),
        (360, 'amber', 'FUNCIÓN HASH', 'bcrypt', 'Solo funciona en un sentido.'),
        (672, 'indigo', 'LO QUE GUARDA AUTH', HASH, 'En encrypted_password.'),
    ]
    for x, color, label, value, text in cards:
        soft, border, strong = FAM[color]
        s += f'  <rect x="{x}" y="112" width="240" height="104" rx="12" fill="#FFFFFF" stroke="{border}" stroke-width="2"/>\n'
        s += f'  <text class="h" x="{x+16}" y="136" style="fill:{strong}" data-fit="210">{label}</text>\n'
        s += f'  <rect x="{x+16}" y="148" width="208" height="30" rx="6" fill="{soft}" stroke="{border}" stroke-width="1.25"/>\n'
        s += f'  <text class="mono" x="{x+120}" y="163" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="{strong}" data-fit="196">{value}</text>\n'
        s += f'  <text x="{x+16}" y="200" font-size="12.5" fill="#454C61" data-fit="210">{text}</text>\n'
    s += '  <path class="link" d="M288,164 H358"/>\n  <path class="link" d="M600,164 H670"/>\n'
    s += '  <path class="ar-rose" stroke-dasharray="5 4" d="M792,216 V248 H168 V218"/>\n'
    s += '  <rect x="388" y="236" width="184" height="24" rx="12" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/>\n'
    s += '  <text x="480" y="248" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#C2354F">no hay camino de vuelta</text>\n'
    s += '  ' + note(48, 284, 416, 'amber', 'Al iniciar sesión', ['Auth hashea lo que escribes y compara los dos hashes.', 'Nunca compara contraseñas.'])
    s += '  ' + note(496, 284, 416, 'slate', 'Por eso existe «olvidé mi contraseña»', ['Nadie puede decirte cuál era, ni Supabase ni el profesor.', 'Solo se puede cambiar por una nueva.'])
    return s + tail(h, 'Tampoco guardes contraseñas tú: ni en profiles, ni en un print, ni en el estado del Bloc más tiempo del necesario.')


FIGS['svHash'] = sv_hash


def sv_uid():
    fid, h = 'svUid', 440
    s = head(fid, h, 'El UID une las dos partes', 'El UID une las dos partes',
             'Auth le pone a cada cuenta un identificador único. Tu tabla usa ese mismo valor como id de la fila.',
             'Flujo del registro en tres pasos. Uno: la app envía correo y contraseña al módulo de Auth, que crea la cuenta. Dos: Auth '
             'devuelve el UID de esa cuenta. Tres: la app guarda en la tabla profiles una fila cuyo id es ese mismo UID, junto con el '
             'username. Las dos filas quedan unidas por el mismo valor.',
             colors=('green',))
    s += '  ' + phone(48, 112, 160, 248, 'Registro')
    for k, label in enumerate(['correo', 'contraseña', 'username']):
        s += f'  <rect x="64" y="{168+k*36}" width="128" height="26" rx="6" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.25"/>\n'
        s += f'  <text x="74" y="{181+k*36}" dy="0.35em" font-size="12" fill="#79809A">{label}</text>\n'
    s += '  <rect x="64" y="290" width="128" height="28" rx="14" fill="#4453C9"/>\n'
    s += '  <text x="128" y="304" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#FFFFFF">Registrarme</text>\n'
    s += '  <path class="link" d="M208,172 H430"/>\n'
    s += '  <text x="332" y="163" text-anchor="middle" font-size="12.5" font-weight="600" fill="#556074">correo + contraseña</text>\n'
    s += '  <path class="ar-green" stroke-dasharray="5 4" d="M432,200 H210"/>\n'
    s += '  <text x="332" y="218" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">el UID de la cuenta</text>\n'
    s += '  <path class="link" d="M208,254 H320 V316 H430"/>\n'
    s += '  <text x="376" y="307" text-anchor="middle" font-size="12.5" font-weight="600" fill="#556074">UID + username</text>\n'
    s += '  ' + chip(232, 172, 1) + '  ' + chip(408, 200, 2, 'green') + '  ' + chip(232, 254, 3)
    s += record(432, 112, 224, 'amber', 'auth.users', '', [('id', UID, True), ('email', 'ana@icesi…', False)], vx=92, rh=32)
    s += record(432, 264, 224, 'indigo', 'profiles', '', [('id', UID, True), ('username', 'ana.dev', False)], vx=92, rh=32)
    s += '  <path d="M544,216 V264" stroke="#A96C05" stroke-width="2.5" fill="none"/>\n'
    s += '  <text x="554" y="240" dy="0.35em" font-size="12.5" font-weight="700" fill="#A96C05">mismo UID</text>\n'
    s += '  ' + note(688, 112, 224, 'amber', '1 · Auth crea la cuenta', ['Guarda el correo y el hash', 'de la contraseña.'])
    s += '  ' + note(688, 200, 224, 'green', '2 · Devuelve el UID', ['El identificador único', 'de esa cuenta.'])
    s += '  ' + note(688, 288, 224, 'indigo', '3 · La app guarda el perfil', ['Con ese mismo UID', 'como id de la fila.'])
    return s + tail(h, 'Con el UID de quien inició sesión siempre se encuentra su perfil, y nadie más tiene ese valor.')


FIGS['svUid'] = sv_uid


def sb_pasos():
    fid, h = 'sbPasos', 384
    s = head(fid, h, 'Cuatro pasos desde la consola', 'Cuatro pasos desde la consola',
             'El proyecto ya existe. Lo que falta es crear la tabla y ajustar el Auth, y eso se hace con comandos.',
             'Cuatro pasos en orden: comprobar que el comando supabase funciona con npx, conectar la carpeta con el proyecto usando '
             'supabase login y supabase link, crear la tabla profiles con supabase db push y configurar el Auth por email con supabase '
             'config push.')
    steps = [
        ('slate', 'El comando supabase', 'npx supabase --version', 'Se ejecuta con npx, que viene con Node.js.'),
        ('amber', 'Conectar con tu proyecto', 'npx supabase login · npx supabase link', 'Autorizas la consola y eliges el proyecto.'),
        ('indigo', 'La tabla profiles', 'npx supabase db push', 'Sube el SQL de la tabla y sus permisos.'),
        ('teal', 'El Auth por email', 'npx supabase config push', 'Registro activo, sin confirmación de correo.'),
    ]
    for i, (color, title, cmd, text) in enumerate(steps):
        soft, border, strong = FAM[color]
        x = 48 + (i % 2) * 440
        y = 112 + (i // 2) * 116
        s += f'  <g transform="translate({x},{y})"><rect width="424" height="100" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>\n'
        s += '    ' + chip(28, 28, i + 1, color)
        s += f'    <text x="50" y="28" dy="0.35em" font-size="14.5" font-weight="700" fill="#161A26" data-fit="350">{title}</text>\n'
        s += f'    <rect x="16" y="46" width="392" height="24" rx="6" fill="{soft}" stroke="{border}" stroke-width="1.25"/>\n'
        s += f'    <text class="mono" x="26" y="58" dy="0.35em" font-size="12" font-weight="600" fill="{strong}" data-fit="372">{cmd}</text>\n'
        s += f'    <text x="16" y="88" font-size="12.5" fill="#454C61" data-fit="392">{text}</text>\n  </g>\n'
    return s + tail(h, 'Todos los comandos se ejecutan dentro de la carpeta de tu proyecto de Flutter.')


FIGS['sbPasos'] = sb_pasos


def sb_carpetas():
    fid = 'sbCarpetas'
    rows = [
        (0, 'moviles_auth/', 'slate', 'Tu proyecto de Flutter'),
        (1, 'lib/', 'slate', 'El código Dart'),
        (1, 'pubspec.yaml', 'slate', ''),
        (1, 'supabase/', 'teal', 'La crea npx supabase init'),
        (2, 'config.toml', 'teal', 'La configuración del proyecto. Aquí va el Auth'),
        (2, 'migrations/', 'teal', 'Los cambios de la base de datos, en orden'),
        (3, '20261004120000_create_profiles.sql', 'teal', 'El SQL de la tabla profiles'),
    ]
    y0, rh = 112, 38
    h = y0 + rh * len(rows) + 64
    s = head(fid, h, 'La carpeta <tspan class="mono">supabase/</tspan>', 'La carpeta supabase',
             'La configuración del proyecto de Supabase vive junto al código de la app, como archivos.',
             'Árbol de carpetas: dentro del proyecto de Flutter, junto a lib y pubspec.yaml, la carpeta supabase contiene config.toml y '
             'la carpeta migrations, con un archivo SQL cuyo nombre empieza por la fecha y termina en create_profiles.')
    s += f'  <rect x="48" y="96" width="864" height="{rh*len(rows)+20}" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>\n'
    last = {}
    for i, (lvl, name, color, text) in enumerate(rows):
        soft, border, strong = FAM[color]
        y = y0 + i * rh + 12
        x = 68 + lvl * 28
        if lvl:
            s += f'  <path d="M{x-16},{last[lvl-1]+13} V{y} H{x-3}" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>\n'
        last[lvl] = y
        w = len(name) * 7.5 + 20
        s += f'  <rect x="{x}" y="{y-13}" width="{w:.0f}" height="26" rx="{8 if name.endswith("/") else 4}" fill="{soft}" stroke="{border}" stroke-width="1.5"/>\n'
        s += f'  <text class="mono" x="{x+10}" y="{y}" dy="0.35em" font-size="12.5" font-weight="600" fill="{strong}" data-fit="{w-12:.0f}">{name}</text>\n'
        if text:
            s += f'  <text x="484" y="{y}" dy="0.35em" font-size="13" fill="#454C61" data-fit="400">{text}</text>\n'
    return s + tail(h, 'El número al inicio del archivo es la fecha y la hora en que lo creaste: el tuyo será distinto.')


FIGS['sbCarpetas'] = sb_carpetas


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
