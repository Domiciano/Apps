# Leer de la base de datos

<!-- tags: select, eq, ilike, order, range, single y maybeSingle, select anidado, paginación,
     CountOption.exact, or, Cannot coerce the result to a single JSON object,
     Could not find a relationship between -->

Leer siempre tiene la misma forma: `from`, `select`, los filtros que quieras, los modificadores que quieras y un `await`. Esta lección lee los `posts` que sembraste en *Escribir en la base de datos*.

## Anatomía de una consulta

```svg
<svg id="dbConsulta" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 516" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="dbConsulta-ttl dbConsulta-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="dbConsulta-ttl">Anatomía de una consulta</title>
  <desc id="dbConsulta-dsc">Una cadena de cinco piezas: from posts elige la tabla, select elige las columnas, ilike filtra las filas, order y limit ordenan y recortan, y await envía la consulta y devuelve una lista de mapas. Debajo, el efecto sobre diez filas: el filtro deja cuatro, el orden las acomoda por fecha y limit 3 se queda con tres.</desc>
  <defs>
    <style>
      #dbConsulta .title{fill:#161A26;font-size:22px;font-weight:700}
      #dbConsulta .sub{fill:#79809A;font-size:13.5px}
      #dbConsulta .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #dbConsulta .foot{fill:#79809A;font-size:12px}
      #dbConsulta .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #dbConsulta .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #dbConsulta .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#dbConsulta-arrow)}
      #dbConsulta .ar-green{fill:none;stroke:#3A8235;stroke-width:1.75;marker-end:url(#dbConsulta-ar-green)}
    </style>
    <marker id="dbConsulta-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="dbConsulta-ar-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#3A8235"/></marker>
  </defs>
  <rect width="960" height="516" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Anatomía de una consulta</text>
  <text class="sub" x="48" y="80" data-fit="860">Cada método agrega una parte. Nada viaja a Supabase hasta el await.</text>
  <text class="h" x="126" y="118" text-anchor="middle" style="fill:#556074">TABLA</text>
  <rect x="48" y="128" width="156" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.75"/>
  <text class="mono" x="126" y="150" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#556074" data-fit="140">from('posts')</text>
  <text x="126" y="194" text-anchor="middle" font-size="12.5" fill="#454C61" data-fit="148">De dónde leer.</text>
  <text class="h" x="303" y="118" text-anchor="middle" style="fill:#4453C9">COLUMNAS</text>
  <rect x="225" y="128" width="156" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.75"/>
  <text class="mono" x="303" y="150" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#4453C9" data-fit="140">select('…')</text>
  <text x="303" y="194" text-anchor="middle" font-size="12.5" fill="#454C61" data-fit="148">Qué columnas traer.</text>
  <path class="link" d="M206,150 H223"/>
  <text class="h" x="480" y="118" text-anchor="middle" style="fill:#A96C05">FILTROS</text>
  <rect x="402" y="128" width="156" height="44" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.75"/>
  <text class="mono" x="480" y="150" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#A96C05" data-fit="140">.ilike(…)</text>
  <text x="480" y="194" text-anchor="middle" font-size="12.5" fill="#454C61" data-fit="148">Qué filas sirven.</text>
  <path class="link" d="M383,150 H400"/>
  <text class="h" x="657" y="118" text-anchor="middle" style="fill:#7439B8">MODIFICADORES</text>
  <rect x="579" y="128" width="156" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.75"/>
  <text class="mono" x="657" y="150" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#7439B8" data-fit="140">.order().limit()</text>
  <text x="657" y="194" text-anchor="middle" font-size="12.5" fill="#454C61" data-fit="148">En qué orden y cuántas.</text>
  <path class="link" d="M560,150 H577"/>
  <text class="h" x="834" y="118" text-anchor="middle" style="fill:#3A8235">RESULTADO</text>
  <rect x="756" y="128" width="156" height="44" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.75"/>
  <text class="mono" x="834" y="150" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#3A8235" data-fit="140">await</text>
  <text x="834" y="194" text-anchor="middle" font-size="12.5" fill="#454C61" data-fit="148">Una lista de mapas.</text>
  <path class="link" d="M737,150 H754"/>
  <path d="M48,222 H912" stroke="#E4E7EE" stroke-width="1.5"/>
  <text x="48" y="252" font-size="13" font-weight="700" fill="#556074" data-fit="200">10 filas en la tabla</text>
  <rect x="48" y="266" width="200" height="11" rx="3" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1"/>
  <rect x="48" y="281" width="200" height="11" rx="3" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1"/>
  <rect x="48" y="296" width="200" height="11" rx="3" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1"/>
  <rect x="48" y="311" width="200" height="11" rx="3" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1"/>
  <rect x="48" y="326" width="200" height="11" rx="3" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1"/>
  <rect x="48" y="341" width="200" height="11" rx="3" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1"/>
  <rect x="48" y="356" width="200" height="11" rx="3" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1"/>
  <rect x="48" y="371" width="200" height="11" rx="3" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1"/>
  <rect x="48" y="386" width="200" height="11" rx="3" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1"/>
  <rect x="48" y="401" width="200" height="11" rx="3" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1"/>
  <text x="269" y="252" font-size="13" font-weight="700" fill="#A96C05" data-fit="200">ilike deja 4</text>
  <rect x="269" y="266" width="200" height="11" rx="3" fill="none" stroke="#D9DEE8" stroke-width="1" stroke-dasharray="3 3"/>
  <rect x="269" y="281" width="200" height="11" rx="3" fill="#FFF3DC" stroke="#F0C572" stroke-width="1"/>
  <rect x="269" y="296" width="200" height="11" rx="3" fill="none" stroke="#D9DEE8" stroke-width="1" stroke-dasharray="3 3"/>
  <rect x="269" y="311" width="200" height="11" rx="3" fill="none" stroke="#D9DEE8" stroke-width="1" stroke-dasharray="3 3"/>
  <rect x="269" y="326" width="200" height="11" rx="3" fill="#FFF3DC" stroke="#F0C572" stroke-width="1"/>
  <rect x="269" y="341" width="200" height="11" rx="3" fill="none" stroke="#D9DEE8" stroke-width="1" stroke-dasharray="3 3"/>
  <rect x="269" y="356" width="200" height="11" rx="3" fill="#FFF3DC" stroke="#F0C572" stroke-width="1"/>
  <rect x="269" y="371" width="200" height="11" rx="3" fill="none" stroke="#D9DEE8" stroke-width="1" stroke-dasharray="3 3"/>
  <rect x="269" y="386" width="200" height="11" rx="3" fill="none" stroke="#D9DEE8" stroke-width="1" stroke-dasharray="3 3"/>
  <rect x="269" y="401" width="200" height="11" rx="3" fill="#FFF3DC" stroke="#F0C572" stroke-width="1"/>
  <path class="link" d="M251,300 H266"/>
  <text x="490" y="252" font-size="13" font-weight="700" fill="#7439B8" data-fit="200">order: más reciente primero</text>
  <rect x="490" y="266" width="200" height="11" rx="3" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1"/>
  <rect x="490" y="281" width="200" height="11" rx="3" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1"/>
  <rect x="490" y="296" width="200" height="11" rx="3" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1"/>
  <rect x="490" y="311" width="200" height="11" rx="3" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1"/>
  <path class="link" d="M472,300 H487"/>
  <text x="711" y="252" font-size="13" font-weight="700" fill="#3A8235" data-fit="200">limit(3): quedan 3</text>
  <rect x="711" y="266" width="200" height="11" rx="3" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1"/>
  <rect x="711" y="281" width="200" height="11" rx="3" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1"/>
  <rect x="711" y="296" width="200" height="11" rx="3" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1"/>
  <rect x="711" y="311" width="200" height="11" rx="3" fill="none" stroke="#D9DEE8" stroke-width="1" stroke-dasharray="3 3"/>
  <path class="link" d="M693,300 H708"/>
  <g transform="translate(48,428)"><rect width="864" height="60" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#556074" data-fit="836">El orden de la cadena importa</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="836">Primero los filtros y después los modificadores. Sin await solo tienes una consulta a medio armar, no los datos.</text></g>
</svg>
```

```dart
final rows = await _client
    .from('posts')
    .select('id, content, created_at')
    .ilike('content', '%flutter%')
    .order('created_at', ascending: false)
    .limit(10);
```

Hasta el `await` no viaja nada: cada método solo agrega una parte a la consulta. Primero van los filtros y después los modificadores. El resultado es una `List<Map<String, dynamic>>`.

## Todas las filas

```dart
Future<List<Post>> fetchAll() async {
  final rows = await _client.from('posts').select();
  return rows.map(Post.fromJson).toList();
}
```

`select()` trae todas las columnas. Para traer solo algunas, nómbralas: `select('id, content')`.

## Filtrar

Cada filtro recibe la columna y el valor:

```dart
final rows = await _client
    .from('posts')
    .select()
    .eq('profile_id', uid);
```

Los demás funcionan igual:

- `eq` y `neq`: igual y distinto.
- `gt`, `gte`, `lt` y `lte`: mayor, mayor o igual, menor y menor o igual. Sirven con números y con fechas, por ejemplo `.gte('created_at', '2026-10-01')`.
- `like` e `ilike`: contiene un patrón, con `%` como comodín. `ilike` no distingue mayúsculas: `.ilike('content', '%flutter%')` encuentra «Flutter» y «FLUTTER».
- `inFilter`: está en una lista, `.inFilter('profile_id', [uid1, uid2])`.
- `isFilter`: compara con `null`, `.isFilter('deleted_at', null)`.

## Combinar condiciones

Varios filtros encadenados se cumplen **todos a la vez** (AND). Para «uno u otro» (OR) se usa `.or()`, con un texto de la forma `columna.operador.valor` separado por comas:

```dart
.or('content.ilike.%flutter%,content.ilike.%dart%')
```

Dentro de `.or()` se pueden agrupar condiciones con `and(...)`. Así se busca una conversación entre dos personas, sin importar quién la empezó (lo vas a necesitar en el chat):

```dart
.or('and(profile1_id.eq.$a,profile2_id.eq.$b),'
    'and(profile1_id.eq.$b,profile2_id.eq.$a)')
```

Usa un solo `.or()` por consulta: si encadenas dos, el segundo puede pisar al primero.

## Ordenar y limitar

```dart
final rows = await _client
    .from('posts')
    .select()
    .order('created_at', ascending: false)
    .limit(5);
```

`order` es ascendente si no le dices otra cosa, así que para «lo más reciente primero» va `ascending: false`. `limit(5)` se queda con las primeras cinco filas de ese orden.

## Paginar con range

```svg
<svg id="dbRange" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 352" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="dbRange-ttl dbRange-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="dbRange-ttl">Paginar con range</title>
  <desc id="dbRange-dsc">Una fila de 25 casillas numeradas de 0 a 24. La página 0 es range(0, 9), la página 1 es range(10, 19) y la página 2 es range(20, 29), que solo encuentra cinco filas: como llegan menos de diez, ya no hay más páginas.</desc>
  <defs>
    <style>
      #dbRange .title{fill:#161A26;font-size:22px;font-weight:700}
      #dbRange .sub{fill:#79809A;font-size:13.5px}
      #dbRange .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #dbRange .foot{fill:#79809A;font-size:12px}
      #dbRange .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #dbRange .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #dbRange .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#dbRange-arrow)}
    </style>
    <marker id="dbRange-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="352" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Paginar con <tspan class="mono">range</tspan></text>
  <text class="sub" x="48" y="80" data-fit="860">25 posts ordenados del más reciente al más antiguo, en páginas de 10. Los dos extremos de range están incluidos.</text>
  <rect x="50.0" y="168" width="30.6" height="44" rx="6" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/>
  <text class="mono" x="65.3" y="190" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#4453C9">0</text>
  <rect x="84.6" y="168" width="30.6" height="44" rx="6" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/>
  <text class="mono" x="99.8" y="190" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#4453C9">1</text>
  <rect x="119.1" y="168" width="30.6" height="44" rx="6" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/>
  <text class="mono" x="134.4" y="190" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#4453C9">2</text>
  <rect x="153.7" y="168" width="30.6" height="44" rx="6" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/>
  <text class="mono" x="169.0" y="190" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#4453C9">3</text>
  <rect x="188.2" y="168" width="30.6" height="44" rx="6" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/>
  <text class="mono" x="203.5" y="190" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#4453C9">4</text>
  <rect x="222.8" y="168" width="30.6" height="44" rx="6" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/>
  <text class="mono" x="238.1" y="190" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#4453C9">5</text>
  <rect x="257.4" y="168" width="30.6" height="44" rx="6" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/>
  <text class="mono" x="272.6" y="190" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#4453C9">6</text>
  <rect x="291.9" y="168" width="30.6" height="44" rx="6" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/>
  <text class="mono" x="307.2" y="190" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#4453C9">7</text>
  <rect x="326.5" y="168" width="30.6" height="44" rx="6" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/>
  <text class="mono" x="341.8" y="190" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#4453C9">8</text>
  <rect x="361.0" y="168" width="30.6" height="44" rx="6" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/>
  <text class="mono" x="376.3" y="190" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#4453C9">9</text>
  <rect x="395.6" y="168" width="30.6" height="44" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <text class="mono" x="410.9" y="190" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#0F8478">10</text>
  <rect x="430.2" y="168" width="30.6" height="44" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <text class="mono" x="445.4" y="190" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#0F8478">11</text>
  <rect x="464.7" y="168" width="30.6" height="44" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <text class="mono" x="480.0" y="190" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#0F8478">12</text>
  <rect x="499.3" y="168" width="30.6" height="44" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <text class="mono" x="514.6" y="190" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#0F8478">13</text>
  <rect x="533.8" y="168" width="30.6" height="44" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <text class="mono" x="549.1" y="190" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#0F8478">14</text>
  <rect x="568.4" y="168" width="30.6" height="44" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <text class="mono" x="583.7" y="190" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#0F8478">15</text>
  <rect x="603.0" y="168" width="30.6" height="44" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <text class="mono" x="618.2" y="190" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#0F8478">16</text>
  <rect x="637.5" y="168" width="30.6" height="44" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <text class="mono" x="652.8" y="190" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#0F8478">17</text>
  <rect x="672.1" y="168" width="30.6" height="44" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <text class="mono" x="687.4" y="190" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#0F8478">18</text>
  <rect x="706.6" y="168" width="30.6" height="44" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <text class="mono" x="721.9" y="190" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#0F8478">19</text>
  <rect x="741.2" y="168" width="30.6" height="44" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text class="mono" x="756.5" y="190" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#A96C05">20</text>
  <rect x="775.8" y="168" width="30.6" height="44" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text class="mono" x="791.0" y="190" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#A96C05">21</text>
  <rect x="810.3" y="168" width="30.6" height="44" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text class="mono" x="825.6" y="190" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#A96C05">22</text>
  <rect x="844.9" y="168" width="30.6" height="44" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text class="mono" x="860.2" y="190" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#A96C05">23</text>
  <rect x="879.4" y="168" width="30.6" height="44" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text class="mono" x="894.7" y="190" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#A96C05">24</text>
  <path d="M50.0,158 V150 H391.6 V158" fill="none" stroke="#4453C9" stroke-width="1.75"/>
  <text x="220.8" y="140" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9">página 0</text>
  <text class="mono" x="220.8" y="238" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9">range(0, 9)</text>
  <path d="M395.6,158 V150 H737.2 V158" fill="none" stroke="#0F8478" stroke-width="1.75"/>
  <text x="566.4" y="140" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">página 1</text>
  <text class="mono" x="566.4" y="238" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">range(10, 19)</text>
  <path d="M741.2,158 V150 H910.0 V158" fill="none" stroke="#A96C05" stroke-width="1.75"/>
  <text x="825.6" y="140" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">página 2</text>
  <text class="mono" x="825.6" y="238" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">range(20, 29)</text>
  <text x="825.6" y="258" text-anchor="middle" font-size="12" fill="#A96C05" data-fit="170">llegan 5: no hay más</text>
  <path d="M912.0,164 V216" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 3"/>
  <g transform="translate(48,274)"><rect width="420" height="60" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#4453C9" data-fit="392">Para la página p, con páginas de tamaño size</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="392">from = p * size · to = from + size - 1</text></g>
  <g transform="translate(492,274)"><rect width="420" height="60" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#556074" data-fit="392">Siempre con order</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="392">Sin orden fijo, una fila puede salir en dos páginas.</text></g>
</svg>
```

`range(desde, hasta)` toma una franja de filas, y **los dos extremos están incluidos**: `range(0, 9)` son diez filas.

```dart
Future<List<Post>> fetchPage(int page, {int size = 10}) async {
  final from = page * size;
  final rows = await _client
      .from('posts')
      .select()
      .order('created_at', ascending: false)
      .range(from, from + size - 1);
  return rows.map(Post.fromJson).toList();
}
```

Pagina siempre con un `order`: sin él, la base de datos no garantiza el orden y una fila puede salir en dos páginas. Si llegan menos filas que `size`, ya no hay más.

## Pruébalo

Arma una consulta y mira qué filas sobreviven a cada paso y qué devuelve el `await`. Prueba `.single()` con un filtro que deje varias filas.

```interactive
query-builder
```

## Una sola fila

Cuando buscas por llave primaria esperas un `Map`, no una lista:

```dart
final row = await _client
    .from('profiles')
    .select()
    .eq('id', uid)
    .single();
```

`single()` exige **exactamente una** fila. Con cero o con varias lanza `Cannot coerce the result to a single JSON object` (código `PGRST116`). Si puede que no exista, usa `maybeSingle()`: devuelve `null` cuando no hay ninguna.

```dart
final row = await _client
    .from('profiles')
    .select()
    .eq('username', 'ana.dev')
    .maybeSingle();
if (row == null) return null;
```

## Contar

```dart
final total = await _client.from('posts').count(CountOption.exact);

final mine = await _client
    .from('posts')
    .count(CountOption.exact)
    .eq('profile_id', uid);
```

`count` devuelve un `int` y no descarga las filas. Admite los mismos filtros.

## Traer datos relacionados

```svg
<svg id="dbAnidado" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 500" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="dbAnidado-ttl dbAnidado-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="dbAnidado-ttl">Datos relacionados en una consulta</title>
  <desc id="dbAnidado-dsc">A la izquierda, las tablas posts y profiles, unidas porque posts.profile_id referencia a profiles.id. Arriba, el select con author:profiles(username, full_name). A la derecha, el resultado: cada post es un mapa con id, content y created_at, y una llave author que contiene otro mapa con username y full_name.</desc>
  <defs>
    <style>
      #dbAnidado .title{fill:#161A26;font-size:22px;font-weight:700}
      #dbAnidado .sub{fill:#79809A;font-size:13.5px}
      #dbAnidado .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #dbAnidado .foot{fill:#79809A;font-size:12px}
      #dbAnidado .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #dbAnidado .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #dbAnidado .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#dbAnidado-arrow)}
      #dbAnidado .ar-indigo{fill:none;stroke:#4453C9;stroke-width:1.75;marker-end:url(#dbAnidado-ar-indigo)}
    </style>
    <marker id="dbAnidado-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="dbAnidado-ar-indigo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#4453C9"/></marker>
  </defs>
  <rect width="960" height="500" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Datos relacionados en una consulta</text>
  <text class="sub" x="48" y="80" data-fit="860">Supabase sigue la llave foránea de posts a profiles y mete el autor dentro de cada post.</text>
  <rect x="48" y="104" width="864" height="34" rx="8" fill="#1F2430"/>
  <text class="mono" x="64" y="121" dy="0.35em" font-size="13" fill="#C9CFDA" data-fit="832">.select('id, content, created_at, <tspan fill="#A9B4F2" font-weight="700">author:profiles(username, full_name)</tspan>')</text>
  <rect x="48" y="164" width="352" height="176" rx="12" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="2"/>
  <path d="M48,204 V176 A12,12 0 0 1 60,164 H388 A12,12 0 0 1 400,176 V204 Z" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="2"/>
  <text class="mono" x="62" y="184" dy="0.35em" font-size="14" font-weight="700" fill="#556074">posts</text>
  <text class="mono" x="62" y="221" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26">id</text>
  <text class="mono" x="172" y="221" dy="0.35em" font-size="12" fill="#79809A" data-fit="182">9b1e04d7…</text>
  <rect x="360" y="211" width="28" height="20" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text x="374" y="221" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#A96C05">PK</text>
  <rect x="53" y="242" width="342" height="26" rx="6" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/>
  <text class="mono" x="62" y="255" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26">profile_id</text>
  <text class="mono" x="172" y="255" dy="0.35em" font-size="12" fill="#4453C9" data-fit="182">3f2a9c1e…</text>
  <rect x="360" y="245" width="28" height="20" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text x="374" y="255" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#A96C05">FK</text>
  <path d="M49,272 H399" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="62" y="289" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26">content</text>
  <text class="mono" x="172" y="289" dy="0.35em" font-size="12" fill="#79809A" data-fit="216">'Mi primer post'</text>
  <path d="M49,306 H399" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="62" y="323" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26">created_at</text>
  <text class="mono" x="172" y="323" dy="0.35em" font-size="12" fill="#79809A" data-fit="216">2026-10-18…</text>
  <rect x="48" y="364" width="352" height="108" rx="12" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="2"/>
  <path d="M48,404 V376 A12,12 0 0 1 60,364 H388 A12,12 0 0 1 400,376 V404 Z" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="2"/>
  <text class="mono" x="62" y="384" dy="0.35em" font-size="14" font-weight="700" fill="#4453C9">profiles</text>
  <rect x="53" y="408" width="342" height="26" rx="6" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/>
  <text class="mono" x="62" y="421" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26">id</text>
  <text class="mono" x="172" y="421" dy="0.35em" font-size="12" fill="#4453C9" data-fit="182">3f2a9c1e…</text>
  <rect x="360" y="411" width="28" height="20" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text x="374" y="421" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#A96C05">PK</text>
  <path d="M49,438 H399" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="62" y="455" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26">username</text>
  <text class="mono" x="172" y="455" dy="0.35em" font-size="12" fill="#79809A" data-fit="216">ana.dev</text>
  <path class="ar-indigo" d="M400,255 H420 V421 H402"/>
  <text x="428" y="338" dy="0.35em" font-size="11.5" font-weight="700" fill="#4453C9">FK</text>
  <rect x="480" y="164" width="432" height="252" rx="12" fill="#1F2430"/>
  <text class="h" x="496" y="186" style="fill:#9AA3B5">CADA ELEMENTO DE LA LISTA</text>
  <text class="mono" x="500" y="214" dy="0.35em" font-size="12.5" fill="#C9CFDA" xml:space="preserve" data-fit="396">{</text>
  <text class="mono" x="500" y="236" dy="0.35em" font-size="12.5" fill="#C9CFDA" xml:space="preserve" data-fit="396">  "id": "9b1e04d7…",</text>
  <text class="mono" x="500" y="258" dy="0.35em" font-size="12.5" fill="#C9CFDA" xml:space="preserve" data-fit="396">  "content": "Mi primer post",</text>
  <text class="mono" x="500" y="280" dy="0.35em" font-size="12.5" fill="#C9CFDA" xml:space="preserve" data-fit="396">  "created_at": "2026-10-18T10:05…",</text>
  <rect x="492" y="291" width="408" height="22" fill="#4453C9" fill-opacity="0.35"/>
  <text class="mono" x="500" y="302" dy="0.35em" font-size="12.5" fill="#FFFFFF" xml:space="preserve" data-fit="396">  "author": {</text>
  <rect x="492" y="313" width="408" height="22" fill="#4453C9" fill-opacity="0.2"/>
  <text class="mono" x="500" y="324" dy="0.35em" font-size="12.5" fill="#FFFFFF" xml:space="preserve" data-fit="396">    "username": "ana.dev",</text>
  <rect x="492" y="335" width="408" height="22" fill="#4453C9" fill-opacity="0.2"/>
  <text class="mono" x="500" y="346" dy="0.35em" font-size="12.5" fill="#FFFFFF" xml:space="preserve" data-fit="396">    "full_name": "Ana Gómez"</text>
  <rect x="492" y="357" width="408" height="22" fill="#4453C9" fill-opacity="0.35"/>
  <text class="mono" x="500" y="368" dy="0.35em" font-size="12.5" fill="#FFFFFF" xml:space="preserve" data-fit="396">  }</text>
  <text class="mono" x="500" y="390" dy="0.35em" font-size="12.5" fill="#C9CFDA" xml:space="preserve" data-fit="396">}</text>
  <text class="mono" x="480" y="452" font-size="12.5" fill="#4453C9" font-weight="700">json['author']['username']</text>
  <text x="702" y="452" font-size="12.5" fill="#454C61" data-fit="200">→ 'ana.dev'</text>
</svg>
```

Como `posts.profile_id` es una llave foránea hacia `profiles`, Supabase puede traer el autor de cada post en la misma consulta. Se nombra la tabla relacionada dentro del `select`, con sus columnas entre paréntesis:

```dart
final rows = await _client
    .from('posts')
    .select('id, content, created_at, '
        'author:profiles(username, full_name)')
    .order('created_at', ascending: false);
```

`author:` es un alias: sin él, la llave del mapa se llamaría `profiles`. En el modelo se lee como un mapa dentro del mapa: `json['author']['username']`.

- Para **filtrar por la tabla relacionada**, agrega `!inner` y filtra con el alias: `.select('*, author:profiles!inner(username)').eq('author.username', 'ana.dev')`.
- Para **contar relacionados** sin traerlos: `.select('*, likes(count)')`. Lo usarás en el laboratorio.
- Si no existe la llave foránea, Supabase responde `Could not find a relationship between 'posts' and 'profiles'`.

La relación también se recorre al revés: desde `profiles`, `select('username, posts(content)')` trae cada perfil con la **lista** de sus posts.

## Y en tiempo real

Todo lo anterior es una foto: lee la tabla en el momento del `await`. Para que la app se entere sola de los cambios se usa `stream()`, que verás en la sección *Realtime*.
