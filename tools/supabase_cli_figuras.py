"""Figuras SVG de «Alternativa: Configurar Supabase desde la terminal» (0091).

    python3 tools/supabase_cli_figuras.py <carpeta>     escribe un .svg por figura, para revisarlas
    python3 tools/supabase_cli_figuras.py --inject      reemplaza cada bloque ```svg de content/lessonH1cli.md
                                                        por la figura con el mismo id

No editar los SVG dentro del Markdown: se cambia este script y se vuelve a inyectar.
"""

import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from bloc_figuras import FAM, chip, head, tail  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
LESSONS = ['lessonH1cli.md']
FIGS = {}


def sb_pasos():
    fid, h = 'sbPasos', 400
    s = head(fid, h, 'Seis pasos, casi todos en la terminal', 'Seis pasos, casi todos en la terminal',
             'El navegador solo aparece una vez, para autorizar la terminal. Lo demás son comandos.',
             'Seis pasos en orden: comprobar que hay Node.js, iniciar sesión con supabase login, crear el proyecto con supabase projects create, '
             'obtener la clave con supabase projects api-keys, crear la tabla con supabase db push y configurar el Auth con supabase '
             'config push. Solo el inicio de sesión abre el navegador.')
    steps = [
        ('slate', 'Tener Node.js', 'node --version', 'El CLI se ejecuta con npx.'),
        ('amber', 'Iniciar sesión', 'npx supabase login', 'Abre el navegador para autorizar.'),
        ('indigo', 'Crear el proyecto', 'npx supabase projects create', 'Te da la URL del proyecto.'),
        ('indigo', 'Obtener la clave', 'npx supabase projects api-keys', 'La publishable key para Flutter.'),
        ('teal', 'Crear la tabla', 'npx supabase db push', 'Sube el SQL de profiles.'),
        ('teal', 'Configurar el Auth', 'npx supabase config push', 'Email activo, sin confirmación.'),
    ]
    for i, (color, title, cmd, text) in enumerate(steps):
        soft, border, strong = FAM[color]
        x = 48 + (i % 3) * 296
        y = 112 + (i // 3) * 124
        s += f'  <g transform="translate({x},{y})"><rect width="272" height="108" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>\n'
        s += '    ' + chip(28, 28, i + 1, color)
        s += f'    <text x="50" y="28" dy="0.35em" font-size="14.5" font-weight="700" fill="#161A26" data-fit="206">{title}</text>\n'
        s += f'    <rect x="16" y="48" width="240" height="24" rx="6" fill="{soft}" stroke="{border}" stroke-width="1.25"/>\n'
        s += f'    <text class="mono" x="26" y="60" dy="0.35em" font-size="12" font-weight="600" fill="{strong}" data-fit="222">{cmd}</text>\n'
        s += f'    <text x="16" y="92" font-size="12.5" fill="#454C61" data-fit="240">{text}</text>\n  </g>\n'
    return s + tail(h, 'Los pasos 5 y 6 se ejecutan dentro de la carpeta de tu proyecto de Flutter.')


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
