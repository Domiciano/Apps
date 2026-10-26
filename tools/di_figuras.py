"""Figuras SVG de «Inyección de dependencias con GetIt» (0079), sobre el Laboratorio 7.

    python3 tools/di_figuras.py <carpeta>     escribe un .svg por figura, para revisarlas
    python3 tools/di_figuras.py --inject      reemplaza cada bloque ```svg de la lección por la figura con el mismo id

No editar los SVG dentro del Markdown: se cambia este script y se vuelve a inyectar.
Colores: la vista y el Bloc en violeta, el dominio en ámbar, los datos en verde azulado, lo que se quita en rosa
y lo que entra en verde.
"""

import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from bloc_figuras import FAM, head, note, tail  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
LESSONS = ['lessonN1.md']
FIGS = {}


def layer_box(x, y, w, h, color, label, name, file):
    soft, border, strong = FAM[color]
    o = f'  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="{soft}" stroke="{border}" stroke-width="1.75"/>\n'
    o += f'  <text class="h" x="{x+14}" y="{y+20}" style="fill:{strong}">{label}</text>\n'
    o += f'  <text class="mono" x="{x+14}" y="{y+40}" font-size="13.5" font-weight="700" fill="{strong}" data-fit="{w-28}">{name}</text>\n'
    o += f'  <text class="mono" x="{x+14}" y="{y+58}" font-size="11" fill="#79809A" data-fit="{w-28}">{file}</text>\n'
    return o


def di_camino():
    fid, h = 'diCamino', 676
    s = head(fid, h, 'Un camino, una línea por capa', 'Un camino, una línea por capa',
             'Publicar un post en el Laboratorio 7. Cada capa deja de crear la siguiente y se la pide a GetIt.',
             'Seis capas en columna, de arriba abajo: la ruta /compose de main.dart, ComposeBloc, PublishPostUseCase, el '
             'contrato PostRepository, PostRepositoryImpl y SupabasePostDataSource. A la derecha de cada una, la línea que '
             'cambia. La ruta pasa de ComposeBloc() a sl&lt;ComposeBloc&gt;(). ComposeBloc pasa de PublishPostUseCase() a sl(). '
             'PublishPostUseCase pasa de PostRepositoryImpl() a sl(), y con eso deja de importar la implementación. '
             'PostRepositoryImpl pasa de SupabasePostDataSource() a sl(). El contrato y el data source no cambian.',
             colors=('violet', 'amber', 'teal'))
    rows = [
        ('violet', 'UI · RUTA', "'/compose'", 'lib/main.dart', 'ComposeBloc()', 'sl&lt;ComposeBloc&gt;()'),
        ('violet', 'BLOC', 'ComposeBloc', 'compose/ui/bloc/compose_bloc.dart', '= PublishPostUseCase();', '= sl();'),
        ('amber', 'CASO DE USO', 'PublishPostUseCase', 'posts/domain/usecases/', '= PostRepositoryImpl();', '= sl();'),
        ('amber', 'CONTRATO', 'PostRepository', 'posts/domain/repository/', '', 'No cambia. Es lo único que el caso de uso conoce ahora.'),
        ('teal', 'IMPLEMENTACIÓN', 'PostRepositoryImpl', 'posts/data/repository/', '= SupabasePostDataSource();', '= sl();'),
        ('teal', 'DATA SOURCE', 'SupabasePostDataSource', 'posts/data/source/', '', 'No cambia: es el final del camino.'),
    ]
    x, w, bh, gap, y0 = 48, 300, 68, 22, 108
    s += '  <text class="h" x="392" y="100">ANTES</text>\n'
    s += '  <text class="h" x="676" y="100">CON GETIT</text>\n'
    for k, (color, label, name, file, before, after) in enumerate(rows):
        y = y0 + k * (bh + gap)
        s += layer_box(x, y, w, bh, color, label, name, file)
        if k:
            arrow = 'ar-amber' if rows[k][0] == 'amber' and rows[k - 1][0] == 'amber' else f'ar-{rows[k-1][0]}'
            s += f'  <path class="{arrow}" d="M{x+w/2:.0f},{y-gap+2} V{y-3}"/>\n'
        cy = y + bh / 2
        if before:
            s += f'  <rect x="392" y="{cy-16:.0f}" width="252" height="32" rx="8" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.25"/>\n'
            s += (f'  <text class="mono" x="404" y="{cy:.0f}" dy="0.35em" font-size="12" fill="#C2354F" '
                  f'text-decoration="line-through" data-fit="228">{before}</text>\n')
            s += f'  <path class="link" d="M648,{cy:.0f} H670"/>\n'
            s += f'  <rect x="676" y="{cy-16:.0f}" width="236" height="32" rx="8" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>\n'
            s += f'  <text class="mono" x="688" y="{cy:.0f}" dy="0.35em" font-size="12.5" font-weight="700" fill="#3A8235" data-fit="212">{after}</text>\n'
        else:
            s += f'  <text x="392" y="{cy:.0f}" dy="0.35em" font-size="12.5" fill="#79809A" data-fit="520">{after}</text>\n'
    return s + tail(h, 'Las demás capas del laboratorio siguen creando la siguiente con su constructor. Pasarlas a GetIt es el reto.')


FIGS['diCamino'] = di_camino


def di_registro():
    fid, h = 'diRegistro', 572
    s = head(fid, h, 'Qué guarda GetIt y cuándo crea cada objeto', 'Qué guarda GetIt y cuándo crea cada objeto',
             'Cuatro registros, de adentro hacia afuera. El Bloc es nuevo cada vez; lo demás se crea una vez y se reutiliza.',
             'A la izquierda, el archivo injection_container.dart con cuatro registros: SupabasePostDataSource, '
             'PostRepository con su implementación y PublishPostUseCase como registerLazySingleton, y ComposeBloc como '
             'registerFactory. A la derecha, dos aperturas seguidas de la pantalla de nuevo post: cada una recibe su propio '
             'ComposeBloc, pero las dos comparten el mismo PublishPostUseCase, el mismo PostRepositoryImpl y el mismo '
             'SupabasePostDataSource.',
             colors=('violet', 'teal'))
    s += '  <rect x="48" y="108" width="452" height="320" rx="12" fill="#1F2430"/>\n'
    s += '  <text class="mono" x="66" y="134" font-size="12" fill="#9AA3B5">lib/injection_container.dart</text>\n'
    lines = [
        ('final sl = GetIt.instance;', '#C9CFDA', ''),
        ('', '', ''),
        ('sl.registerLazySingleton(', '#86D3CA', '() => SupabasePostDataSource());'),
        ('sl.registerLazySingleton&lt;PostRepository&gt;(', '#86D3CA', '() => PostRepositoryImpl());'),
        ('sl.registerLazySingleton(', '#86D3CA', '() => PublishPostUseCase());'),
        ('sl.registerFactory(', '#C9A6EE', '() => ComposeBloc());'),
    ]
    y = 164
    for a, col, b in lines:
        if a:
            s += f'  <text class="mono" x="66" y="{y}" font-size="12" fill="{col}" data-fit="420">{a}</text>\n'
            if b:
                s += f'  <text class="mono" x="86" y="{y+17}" font-size="12" fill="#C9CFDA" data-fit="400">{b}</text>\n'
                y += 17
        y += 24
    s += '  ' + note(48, 452, 420, 'teal', 'registerLazySingleton', [
        'Lo crea la primera vez que alguien lo pide', 'y después entrega siempre el mismo.'])
    s += '  ' + note(492, 452, 420, 'violet', 'registerFactory', [
        'Crea uno nuevo cada vez que se pide:', 'cada pantalla, con su propio estado.'])
    for i, label in enumerate(['Abres Nuevo post', 'La abres otra vez']):
        x = 540 + i * 196
        s += f'  <text class="h" x="{x+88}" y="120" text-anchor="middle">{label.upper()}</text>\n'
        s += f'  <rect x="{x}" y="132" width="176" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.75"/>\n'
        s += f'  <text class="mono" x="{x+88}" y="154" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8">ComposeBloc #{i+1}</text>\n'
        s += f'  <path class="ar-violet" d="M{x+88},178 V{226 if i == 0 else 226}"/>\n'
    shared = [('PublishPostUseCase', 'amber', 228), ('PostRepositoryImpl', 'teal', 306), ('SupabasePostDataSource', 'teal', 384)]
    for k, (name, color, y) in enumerate(shared):
        soft, border, strong = FAM[color]
        s += f'  <rect x="560" y="{y}" width="332" height="44" rx="10" fill="{soft}" stroke="{border}" stroke-width="1.75"/>\n'
        s += f'  <text class="mono" x="726" y="{y+22}" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="{strong}">{name} · el mismo</text>\n'
        if k:
            s += f'  <path class="link" d="M726,{y-32} V{y-3}"/>\n'
    return s + tail(h, 'Los dos Bloc reciben el mismo caso de uso: GetIt no lo vuelve a crear.')


FIGS['diRegistro'] = di_registro


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
