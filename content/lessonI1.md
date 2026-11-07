# Supabase Realtime

<!-- tags: .stream(primaryKey), supabase_realtime, alter publication, Realtime, websocket,
     foto inicial del stream, order y limit en un stream, el insert no aparece en tiempo real,
     permission denied for table messages, primaryKey -->

Supabase puede avisar cuando una tabla cambia. La app abre un **websocket** y, cada vez que hay un `insert`, un `update` o un `delete`, el servidor le empuja los datos. En Flutter eso se ve como un `Stream`, que se pide con `.stream()`.

## Escribir es un Future, enterarse es un Stream

```svg
<svg id="rtPublicacion" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 470" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="rtPublicacion-ttl rtPublicacion-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="rtPublicacion-ttl">Quién avisa del cambio</title>
  <desc id="rtPublicacion-dsc">A la izquierda, tu teléfono; a la derecha, el de Ana. En el centro, Supabase con tres cajas: la tabla messages en Postgres, la publicación supabase_realtime y el servidor Realtime. Tu teléfono manda un insert a la tabla, que es un Future por HTTP. La tabla avisa a la publicación, la publicación al servidor Realtime, y Realtime empuja la lista por un websocket a los dos teléfonos, el tuyo incluido.</desc>
  <defs>
    <style>
      #rtPublicacion .title{fill:#161A26;font-size:22px;font-weight:700}
      #rtPublicacion .sub{fill:#79809A;font-size:13.5px}
      #rtPublicacion .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #rtPublicacion .foot{fill:#79809A;font-size:12px}
      #rtPublicacion .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #rtPublicacion .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #rtPublicacion .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#rtPublicacion-arrow)}
      #rtPublicacion .ar-amber{fill:none;stroke:#A96C05;stroke-width:1.75;marker-end:url(#rtPublicacion-ar-amber)}
      #rtPublicacion .ar-teal{fill:none;stroke:#0F8478;stroke-width:1.75;marker-end:url(#rtPublicacion-ar-teal)}
      #rtPublicacion .ar-violet{fill:none;stroke:#7439B8;stroke-width:1.75;marker-end:url(#rtPublicacion-ar-violet)}
    </style>
    <marker id="rtPublicacion-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="rtPublicacion-ar-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#A96C05"/></marker>
    <marker id="rtPublicacion-ar-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#0F8478"/></marker>
    <marker id="rtPublicacion-ar-violet" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#7439B8"/></marker>
  </defs>
  <rect width="960" height="470" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Quién avisa del cambio</text>
  <text class="sub" x="48" y="80" data-fit="860">Escribir sigue siendo un Future. Enterarse es un Stream, y solo funciona si la tabla está en la publicación.</text>
<rect x="48" y="120" width="170" height="290" rx="18" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/><text x="64" y="144" dy="0.35em" font-size="14" font-weight="600" fill="#161A26">Tú</text><path d="M50,162 H216" stroke="#D9DEE8" stroke-width="1.5"/>
<rect x="742" y="120" width="170" height="290" rx="18" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/><text x="758" y="144" dy="0.35em" font-size="14" font-weight="600" fill="#161A26">Ana</text><path d="M744,162 H910" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="60" y="182" width="105" height="30" rx="12" fill="#FFFFFF" stroke="#DDE1E8" stroke-width="1.25"/>
  <text x="70" y="197" dy="0.35em" font-size="11.5" fill="#161A26" data-fit="85">hola</text>
  <rect x="101" y="222" width="105" height="30" rx="12" fill="#1F9D68"/>
  <text x="111" y="237" dy="0.35em" font-size="11.5" fill="#FFFFFF" data-fit="85">¿qué tal?</text>
  <rect x="795" y="182" width="105" height="30" rx="12" fill="#1F9D68"/>
  <text x="805" y="197" dy="0.35em" font-size="11.5" fill="#FFFFFF" data-fit="85">hola</text>
  <rect x="754" y="222" width="105" height="30" rx="12" fill="#FFFFFF" stroke="#DDE1E8" stroke-width="1.25"/>
  <text x="764" y="237" dy="0.35em" font-size="11.5" fill="#161A26" data-fit="85">¿qué tal?</text>
  <rect x="296" y="112" width="368" height="306" rx="14" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text x="314" y="132" dy="0.35em" text-anchor="start" font-size="11" font-weight="700" fill="#556074">SUPABASE</text>
  <rect x="336" y="160" width="288" height="56" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="480" y="180" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#7439B8" data-fit="270">tabla messages</text>
  <text x="480" y="200" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="400" fill="#454C61" data-fit="270">Postgres</text>
  <rect x="336" y="250" width="288" height="56" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="480" y="270" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#A96C05" data-fit="270">publicación supabase_realtime</text>
  <text x="480" y="290" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="400" fill="#454C61" data-fit="270">qué tablas se transmiten</text>
  <rect x="336" y="340" width="288" height="56" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="480" y="360" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#0F8478" data-fit="270">Realtime</text>
  <text x="480" y="380" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="400" fill="#454C61" data-fit="270">servidor de websockets</text>
  <path class="link" d="M480,216 V246"/>
  <path class="link" d="M480,306 V336"/>
  <path class="ar-amber" d="M218,232 C260,232 270,188 332,188"/>
  <text class="mono" x="258" y="168" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#A96C05">insert</text>
  <text x="258" y="252" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="400" fill="#A96C05">Future · HTTP</text>
  <path class="ar-teal" d="M336,372 C290,372 270,330 222,330"/>
  <path class="ar-teal" d="M624,372 C670,372 690,330 738,330"/>
  <text x="258" y="394" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0F8478">Stream</text>
  <text x="258" y="410" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="400" fill="#0F8478">websocket</text>
  <text x="702" y="394" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0F8478">Stream</text>
  <text x="702" y="410" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="400" fill="#0F8478">websocket</text>
  <text class="foot" x="48" y="442" data-fit="860">Tu propio mensaje también llega por el stream: la app no lo agrega a la lista cuando lo envía.</text>
</svg>
```

Escribir no cambia: un `insert` sigue siendo un `Future` por HTTP. Lo nuevo es el otro camino: el servidor **Realtime** escucha los cambios de las tablas que están en la publicación `supabase_realtime`, y se los manda a cada app suscrita. A la tuya también, así que tu propio mensaje te llega por el mismo Stream que los de los demás.

## Activar Realtime en una tabla

Una tabla nueva no está en la publicación. Se agrega en la misma migración que la crea. Son cuatro pasos, todos desde la carpeta del proyecto.

**1. Conectarse a tu proyecto.** `init` crea la carpeta `supabase/` y `link` la conecta con tu proyecto. `login` solo hace falta si nunca lo corriste en este computador:

```shell
npx supabase login
npx supabase init
npx supabase link --project-ref TU_IDENTIFICADOR
```

**2. Traer las migraciones anteriores.** Tu proyecto ya tiene aplicadas las de los laboratorios pasados, pero la carpeta nueva no las conoce. Sin ellas, el `db push` se niega con `Remote migration versions not found in local migrations directory`:

```shell
npx supabase migration fetch --linked
```

**3. Crear la migración nueva.** El comando crea un archivo vacío en `supabase/migrations/`:

```shell
npx supabase migration new create_messages
```

Pega en ese archivo:

```sql
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null default '',
  image_path text,
  created_at timestamptz not null default now()
);

grant select, insert on public.messages to authenticated;

alter publication supabase_realtime add table public.messages;
```

**4. Aplicarla en Supabase.**

```shell
npx supabase db push
```

El `grant` es el mismo de siempre: sin `select`, Realtime tampoco puede mandarte las filas. En el curso las tablas no usan RLS, así que no hace falta ninguna política.

## Las partes de .stream()

```svg
<svg id="rtStreamAnatomia" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 560" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="rtStreamAnatomia-ttl rtStreamAnatomia-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="rtStreamAnatomia-ttl">Las partes de .stream()</title>
  <desc id="rtStreamAnatomia-dsc">Código a la izquierda: client.from messages, punto stream con primaryKey id, punto order por created_at descendente, punto limit 15 y punto map a Message. A la derecha, lo que llega: las filas de messages con la más nueva arriba, hasta quince, convertidas en una List de Message.</desc>
  <defs>
    <style>
      #rtStreamAnatomia .title{fill:#161A26;font-size:22px;font-weight:700}
      #rtStreamAnatomia .sub{fill:#79809A;font-size:13.5px}
      #rtStreamAnatomia .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #rtStreamAnatomia .cl{font-size:13px;fill:#C9CFDA}
      #rtStreamAnatomia .s{fill:#A8D8A0} #rtStreamAnatomia .n{fill:#F2B880} #rtStreamAnatomia .c{fill:#7FD1E8}
      #rtStreamAnatomia .p{fill:#D5B8F5} #rtStreamAnatomia .k{fill:#F08FB0}
      #rtStreamAnatomia .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #rtStreamAnatomia .ct{fill:#161A26;font-size:14px;font-weight:700}
      #rtStreamAnatomia .cb{fill:#454C61;font-size:13px}
      #rtStreamAnatomia .rt{fill:#161A26;font-size:14px} #rtStreamAnatomia .rs{fill:#79809A;font-size:12px}
      #rtStreamAnatomia .foot{fill:#79809A;font-size:12px}
      #rtStreamAnatomia .hl-amber{fill:#F2C069;fill-opacity:.16;stroke:#F2C069;stroke-width:1.5}
      #rtStreamAnatomia .ld-amber{fill:none;stroke:#F2C069;stroke-width:1.5;stroke-dasharray:3 4}
      #rtStreamAnatomia .ar-amber{fill:none;stroke:#A96C05;stroke-width:1.75;marker-end:url(#rtStreamAnatomia-ar-amber)}
      #rtStreamAnatomia .hl-indigo{fill:#A9B4F2;fill-opacity:.16;stroke:#A9B4F2;stroke-width:1.5}
      #rtStreamAnatomia .ld-indigo{fill:none;stroke:#A9B4F2;stroke-width:1.5;stroke-dasharray:3 4}
      #rtStreamAnatomia .ar-indigo{fill:none;stroke:#4453C9;stroke-width:1.75;marker-end:url(#rtStreamAnatomia-ar-indigo)}
      #rtStreamAnatomia .hl-teal{fill:#86D3CA;fill-opacity:.16;stroke:#86D3CA;stroke-width:1.5}
      #rtStreamAnatomia .ld-teal{fill:none;stroke:#86D3CA;stroke-width:1.5;stroke-dasharray:3 4}
      #rtStreamAnatomia .ar-teal{fill:none;stroke:#0F8478;stroke-width:1.75;marker-end:url(#rtStreamAnatomia-ar-teal)}
      #rtStreamAnatomia .hl-violet{fill:#C9A6EE;fill-opacity:.16;stroke:#C9A6EE;stroke-width:1.5}
      #rtStreamAnatomia .ld-violet{fill:none;stroke:#C9A6EE;stroke-width:1.5;stroke-dasharray:3 4}
      #rtStreamAnatomia .ar-violet{fill:none;stroke:#7439B8;stroke-width:1.75;marker-end:url(#rtStreamAnatomia-ar-violet)}
    </style>
    <marker id="rtStreamAnatomia-ar-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#A96C05"/></marker>
    <marker id="rtStreamAnatomia-ar-indigo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#4453C9"/></marker>
    <marker id="rtStreamAnatomia-ar-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#0F8478"/></marker>
    <marker id="rtStreamAnatomia-ar-violet" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#7439B8"/></marker>
  </defs>
  <rect width="960" height="560" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Las partes de <tspan class="mono">.stream()</tspan></text>
  <text class="sub" x="48" y="80" data-fit="860">Se escribe casi como un select, pero no se espera con await: se retorna, y emite cada vez que la tabla cambia.</text>
  <rect x="48" y="112" width="456" height="290" rx="12" fill="#1F2430"/>
  <path d="M48,124 A12,12 0 0 1 60,112 H492 A12,12 0 0 1 504,124 V144 H48 Z" fill="#2A3040"/>
  <circle cx="68" cy="128" r="5" fill="#F14C4C"/><circle cx="84" cy="128" r="5" fill="#E5C07B"/><circle cx="100" cy="128" r="5" fill="#6BCB77"/>
  <text class="mono" x="276" y="128" dy="0.35em" text-anchor="middle" fill="#9AA3B5" font-size="12" data-fit="316">supabase_message_data_source.dart</text>
  <rect x="552" y="112" width="360" height="290" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="568" y="128" dy="0.35em" data-fit="328">CADA EMISIÓN</text>
  <path d="M552,144 H912" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect class="hl-violet" x="142.0" y="180" width="86.0" height="22" rx="5"/>
  <rect class="hl-teal" x="157.6" y="204" width="148.4" height="22" rx="5"/>
  <rect class="hl-amber" x="259.0" y="228" width="132.8" height="22" rx="5"/>
  <rect class="hl-amber" x="103.0" y="252" width="78.2" height="22" rx="5"/>
  <rect class="hl-indigo" x="103.0" y="276" width="31.4" height="22" rx="5"/>
  <text class="cl mono" font-size="13" x="68.0" y="172" textLength="109.2" lengthAdjust="spacingAndGlyphs" data-fit="432"><tspan class="k">return</tspan> _client</text>
  <text class="cl mono" font-size="13" x="99.2" y="196" textLength="132.6" lengthAdjust="spacingAndGlyphs" data-fit="432">.from(<tspan class="s">'messages'</tspan>)</text>
  <text class="cl mono" font-size="13" x="99.2" y="220" textLength="210.6" lengthAdjust="spacingAndGlyphs" data-fit="432">.stream(<tspan class="p">primaryKey</tspan>: [<tspan class="s">'id'</tspan>])</text>
  <text class="cl mono" font-size="13" x="99.2" y="244" textLength="296.4" lengthAdjust="spacingAndGlyphs" data-fit="432">.order(<tspan class="s">'created_at'</tspan>, <tspan class="p">ascending</tspan>: <tspan class="k">false</tspan>)</text>
  <text class="cl mono" font-size="13" x="99.2" y="268" textLength="78.0" lengthAdjust="spacingAndGlyphs" data-fit="432">.limit(<tspan class="n">15</tspan>)</text>
  <text class="cl mono" font-size="13" x="99.2" y="292" textLength="358.8" lengthAdjust="spacingAndGlyphs" data-fit="432">.map((rows) =&gt; rows.map(_toMessage).toList());</text>
  <g transform="translate(552,144)">
<text class="h" x="20" y="22" dy="0.35em">messages · lo que llega</text><rect x="16" y="40" width="328" height="30" rx="6" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="28" y="55" dy="0.35em" font-size="12.5" font-weight="700" fill="#7439B8">m18</text><text class="mono" x="80" y="55" dy="0.35em" font-size="12.5" fill="#161A26">'nos vemos'</text><text class="mono" x="330" y="55" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">10:42</text><text class="mono" x="28" y="85" dy="0.35em" font-size="12.5" font-weight="700" fill="#7439B8">m17</text><text class="mono" x="80" y="85" dy="0.35em" font-size="12.5" fill="#161A26">'listo'</text><text class="mono" x="330" y="85" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">10:41</text><path d="M16,70 H344" stroke="#E4E7EE" stroke-width="1"/><text class="mono" x="28" y="115" dy="0.35em" font-size="12.5" font-weight="700" fill="#7439B8">m16</text><text class="mono" x="80" y="115" dy="0.35em" font-size="12.5" fill="#161A26">'¿y tú?'</text><text class="mono" x="330" y="115" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">10:40</text><path d="M16,100 H344" stroke="#E4E7EE" stroke-width="1"/><text class="mono" x="28" y="145" dy="0.35em" font-size="12.5" font-weight="700" fill="#7439B8">m15</text><text class="mono" x="80" y="145" dy="0.35em" font-size="12.5" fill="#161A26">'hola'</text><text class="mono" x="330" y="145" dy="0.35em" text-anchor="end" font-size="12" fill="#79809A">10:38</text><path d="M16,130 H344" stroke="#E4E7EE" stroke-width="1"/><text x="28" y="182" dy="0.35em" font-size="12" fill="#79809A">… hasta 15 filas, la más nueva arriba</text><rect x="16" y="208" width="200" height="30" rx="15" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/><text class="mono" x="116" y="223" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9">List&lt;Message&gt;</text>
  </g>
  <path class="ld-violet" d="M237.8,191 H504"/>
  <path class="ar-violet" d="M504,191 H514 V166 H572"/>
  <path class="ld-teal" d="M315.8,215 H504"/>
  <path class="ar-teal" d="M504,215 H523 V229 H576"/>
  <path class="ld-amber" d="M401.6,239 H504"/>
  <path class="ar-amber" d="M504,239 H532 V199 H576"/>
  <path class="ld-amber" d="M183.2,263 H504"/>
  <path class="ar-amber" d="M504,263 H541 V326 H576"/>
  <path class="ld-indigo" d="M464.0,287 H504"/>
  <path class="ar-indigo" d="M504,287 H568 V367"/>
  <g transform="translate(48.0,426)">
    <rect width="277.3" height="102" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
    <circle cx="24" cy="26" r="7" fill="#E3F6F3" stroke="#0F8478" stroke-width="2"/>
    <text class="ct mono" x="42" y="26" dy="0.35em" data-fit="219">stream(primaryKey)</text>
    <text class="cb" x="16" y="60" data-fit="245">No es consulta: es suscripción.</text>
    <text class="cb" x="16" y="79" data-fit="245">El id identifica cada fila.</text>
  </g>
  <g transform="translate(341.3,426)">
    <rect width="277.3" height="102" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
    <circle cx="24" cy="26" r="7" fill="#FFF3DC" stroke="#A96C05" stroke-width="2"/>
    <text class="ct mono" x="42" y="26" dy="0.35em" data-fit="219">order + limit</text>
    <text class="cb" x="16" y="60" data-fit="245">Se aplican en cada emisión:</text>
    <text class="cb" x="16" y="79" data-fit="245">siempre las 15 más nuevas.</text>
  </g>
  <g transform="translate(634.7,426)">
    <rect width="277.3" height="102" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
    <circle cx="24" cy="26" r="7" fill="#EEF1FF" stroke="#4453C9" stroke-width="2"/>
    <text class="ct mono" x="42" y="26" dy="0.35em" data-fit="219">map</text>
    <text class="cb" x="16" y="60" data-fit="245">Cada emisión trae filas.</text>
    <text class="cb" x="16" y="79" data-fit="245">El data source da Message.</text>
  </g>
</svg>
```

`.stream()` se escribe casi como un `select`, pero no se espera con `await`: se **retorna**. `primaryKey` le dice al SDK con qué columna reconocer cada fila cuando llega un cambio. `order` y `limit` se aplican en cada emisión, así que el Stream siempre trae las 15 más nuevas.

## Cada emisión es la lista completa

```svg
<svg id="rtFotoCambios" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 470" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="rtFotoCambios-ttl rtFotoCambios-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="rtFotoCambios-ttl">Primero la foto completa. Después, la lista otra vez con cada cambio.</title>
  <desc id="rtFotoCambios-dsc">Arriba, una línea de tiempo con tres momentos: abrir el chat, Ana inserta hola y tú insertas qué tal. Debajo de cada momento, la lista que emite el stream. Al abrir: m1, m2 y m3, la foto inicial. Cuando Ana inserta: m4 hola arriba, más m1, m2 y m3. Cuando tú insertas: m5 qué tal arriba, más las cuatro anteriores. La fila nueva está resaltada en verde en cada lista.</desc>
  <defs>
    <style>
      #rtFotoCambios .title{fill:#161A26;font-size:22px;font-weight:700}
      #rtFotoCambios .sub{fill:#79809A;font-size:13.5px}
      #rtFotoCambios .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #rtFotoCambios .foot{fill:#79809A;font-size:12px}
      #rtFotoCambios .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #rtFotoCambios .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #rtFotoCambios .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#rtFotoCambios-arrow)}
      #rtFotoCambios .ar-teal{fill:none;stroke:#0F8478;stroke-width:1.75;marker-end:url(#rtFotoCambios-ar-teal)}
    </style>
    <marker id="rtFotoCambios-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="rtFotoCambios-ar-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#0F8478"/></marker>
  </defs>
  <rect width="960" height="470" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Primero la foto completa. Después, la lista otra vez con cada cambio.</text>
  <text class="sub" x="48" y="80" data-fit="860">Cada emisión del stream trae todas las filas que cumplen order y limit, no solo la nueva.</text>
  <text x="48" y="140" dy="0.35em" text-anchor="start" font-size="11" font-weight="700" fill="#556074">EN LA TABLA</text>
  <path class="link" d="M48,170 H912"/>
  <text x="48" y="228" dy="0.35em" text-anchor="start" font-size="11" font-weight="700" fill="#556074">LO QUE EMITE</text>
  <circle cx="180" cy="170" r="8" fill="#EEF1FF" stroke="#4453C9" stroke-width="2"/>
  <text x="180" y="196" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="260">abrir el chat</text>
  <path class="ar-teal" d="M180,210 V246"/>
  <rect x="100" y="252" width="160" height="84" rx="10" fill="#FFFFFF" stroke="#86D3CA" stroke-width="1.75"/>
  <text class="mono" x="112" y="270.0" dy="0.35em" text-anchor="start" font-size="12" font-weight="400" fill="#161A26" data-fit="140">m3</text>
  <text class="mono" x="112" y="294.0" dy="0.35em" text-anchor="start" font-size="12" font-weight="400" fill="#161A26" data-fit="140">m2</text>
  <text class="mono" x="112" y="318.0" dy="0.35em" text-anchor="start" font-size="12" font-weight="400" fill="#161A26" data-fit="140">m1</text>
  <text x="180.0" y="356" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#0F8478" data-fit="190">emisión 1 · la foto inicial</text>
  <circle cx="480" cy="170" r="8" fill="#F4EBFF" stroke="#7439B8" stroke-width="2"/>
  <text x="480" y="196" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="260">Ana inserta 'hola'</text>
  <path class="ar-teal" d="M480,210 V246"/>
  <rect x="400" y="252" width="160" height="108" rx="10" fill="#FFFFFF" stroke="#86D3CA" stroke-width="1.75"/>
  <rect x="405" y="260" width="150" height="20" rx="5" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>
  <text class="mono" x="412" y="270.0" dy="0.35em" text-anchor="start" font-size="12" font-weight="400" fill="#161A26" data-fit="140">m4 hola</text>
  <text class="mono" x="412" y="294.0" dy="0.35em" text-anchor="start" font-size="12" font-weight="400" fill="#161A26" data-fit="140">m3</text>
  <text class="mono" x="412" y="318.0" dy="0.35em" text-anchor="start" font-size="12" font-weight="400" fill="#161A26" data-fit="140">m2</text>
  <text class="mono" x="412" y="342.0" dy="0.35em" text-anchor="start" font-size="12" font-weight="400" fill="#161A26" data-fit="140">m1</text>
  <text x="480.0" y="380" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#0F8478" data-fit="190">emisión 2</text>
  <circle cx="780" cy="170" r="8" fill="#F4EBFF" stroke="#7439B8" stroke-width="2"/>
  <text x="780" y="196" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="260">tú insertas '¿qué tal?'</text>
  <path class="ar-teal" d="M780,210 V246"/>
  <rect x="700" y="252" width="160" height="132" rx="10" fill="#FFFFFF" stroke="#86D3CA" stroke-width="1.75"/>
  <rect x="705" y="260" width="150" height="20" rx="5" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>
  <text class="mono" x="712" y="270.0" dy="0.35em" text-anchor="start" font-size="12" font-weight="400" fill="#161A26" data-fit="140">m5 ¿qué tal?</text>
  <text class="mono" x="712" y="294.0" dy="0.35em" text-anchor="start" font-size="12" font-weight="400" fill="#161A26" data-fit="140">m4 hola</text>
  <text class="mono" x="712" y="318.0" dy="0.35em" text-anchor="start" font-size="12" font-weight="400" fill="#161A26" data-fit="140">m3</text>
  <text class="mono" x="712" y="342.0" dy="0.35em" text-anchor="start" font-size="12" font-weight="400" fill="#161A26" data-fit="140">m2</text>
  <text class="mono" x="712" y="366.0" dy="0.35em" text-anchor="start" font-size="12" font-weight="400" fill="#161A26" data-fit="140">m1</text>
  <text x="780.0" y="404" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#0F8478" data-fit="190">emisión 3</text>
  <text class="foot" x="48" y="442" data-fit="860">Por eso el Bloc no agrega el mensaje nuevo a mano: reemplaza o junta con la lista que llegó.</text>
</svg>
```

Al suscribirte llega primero la **foto inicial**: las filas que ya hay. Después, con cada cambio, llega **la lista otra vez**, ya con la fila nueva, no solo la fila nueva. Por eso el Bloc no agrega mensajes a mano: recibe la lista y la pone en el estado.

## Pruébalo

```interactive
realtime-chat
```

Escribe en los dos teléfonos: cada mensaje sale como `insert` y vuelve a los dos por Realtime, a la derecha en el de quien lo envió. Luego quita `messages` de la publicación y envía otro: la fila entra a la tabla, pero nadie se entera. *Reabrir* hace una suscripción nueva, y su foto inicial sí trae la fila.

## Cuando algo falla

- **El insert funciona pero no aparece en ningún teléfono.** La tabla no está en `supabase_realtime`. Revisa la migración y que hayas hecho `db push`.
- **`permission denied for table messages`.** Falta el `grant` para `authenticated`.
- **Los mensajes aparecen en desorden.** Falta el `order` en el `.stream()`, o la vista no está usando la lista tal como llega.
