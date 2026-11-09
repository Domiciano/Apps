# Conversaciones entre dos personas

<!-- tags: conversations, user1_id y user2_id, buscar o crear, maybeSingle, conversation_id,
     insert con select, unique, sort de la pareja, chat conmigo mismo,
     duplicate key value violates unique constraint -->

En el Laboratorio 8 el chat no es una sala general: cada pareja de usuarios tiene su propia conversación. Esta lección explica cómo se guarda eso en la base de datos y qué hace la app cuando tocas a alguien en la lista: buscar la conversación de los dos y crearla si todavía no existe.

## El modelo de datos

```svg
<svg id="rtConvModelo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 520" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="rtConvModelo-ttl rtConvModelo-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="rtConvModelo-ttl">El modelo de datos del chat</title>
  <desc id="rtConvModelo-dsc">Tres tablas. profiles con id, username y full_name. conversations con id, user1_id y user2_id, que referencian a profiles, y created_at. messages con id, conversation_id, que referencia a conversations, sender_id, que referencia a profiles, content, image_path y created_at. Una nota dice que la pareja user1_id, user2_id es única y que user1_id es siempre el menor de los dos.</desc>
  <defs>
    <style>
      #rtConvModelo .title{fill:#161A26;font-size:22px;font-weight:700}
      #rtConvModelo .sub{fill:#79809A;font-size:13.5px}
      #rtConvModelo .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #rtConvModelo .foot{fill:#79809A;font-size:12px}
      #rtConvModelo .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #rtConvModelo .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #rtConvModelo .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#rtConvModelo-arrow)}
      #rtConvModelo .ar-amber{fill:none;stroke:#A96C05;stroke-width:1.75;marker-end:url(#rtConvModelo-ar-amber)}
      #rtConvModelo .ar-teal{fill:none;stroke:#0F8478;stroke-width:1.75;marker-end:url(#rtConvModelo-ar-teal)}
    </style>
    <marker id="rtConvModelo-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="rtConvModelo-ar-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#A96C05"/></marker>
    <marker id="rtConvModelo-ar-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#0F8478"/></marker>
  </defs>
  <rect width="960" height="520" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">El modelo de datos del chat</text>
  <text class="sub" x="48" y="80" data-fit="860">Una conversación une a dos perfiles. Cada mensaje pertenece a una conversación.</text>
  <rect x="48" y="112" width="230" height="142" rx="12" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="2"/>
  <path d="M48,152 V124 A12,12 0 0 1 60,112 H266 A12,12 0 0 1 278,124 V152 Z" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="2"/>
  <text class="mono" x="62" y="132" dy="0.35em" font-size="14" font-weight="700" fill="#4453C9">profiles</text>
  <text class="mono" x="62" y="169" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26">id</text>
  <rect x="238" y="159" width="28" height="20" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text x="252" y="169" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#A96C05">PK</text>
  <path d="M49,186 H277" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="62" y="203" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26">username</text>
  <path d="M49,220 H277" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="62" y="237" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26">full_name</text>
  <rect x="360" y="112" width="250" height="176" rx="12" fill="#FFFFFF" stroke="#F0C572" stroke-width="2"/>
  <path d="M360,152 V124 A12,12 0 0 1 372,112 H598 A12,12 0 0 1 610,124 V152 Z" fill="#FFF3DC" stroke="#F0C572" stroke-width="2"/>
  <text class="mono" x="374" y="132" dy="0.35em" font-size="14" font-weight="700" fill="#A96C05">conversations</text>
  <text class="mono" x="374" y="169" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26">id</text>
  <rect x="570" y="159" width="28" height="20" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text x="584" y="169" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#A96C05">PK</text>
  <rect x="365" y="190" width="240" height="26" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text class="mono" x="374" y="203" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26">user1_id</text>
  <rect x="570" y="193" width="28" height="20" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text x="584" y="203" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#A96C05">FK</text>
  <rect x="365" y="224" width="240" height="26" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text class="mono" x="374" y="237" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26">user2_id</text>
  <rect x="570" y="227" width="28" height="20" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text x="584" y="237" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#A96C05">FK</text>
  <path d="M361,254 H609" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="374" y="271" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26">created_at</text>
  <rect x="682" y="112" width="230" height="244" rx="12" fill="#FFFFFF" stroke="#86D3CA" stroke-width="2"/>
  <path d="M682,152 V124 A12,12 0 0 1 694,112 H900 A12,12 0 0 1 912,124 V152 Z" fill="#E3F6F3" stroke="#86D3CA" stroke-width="2"/>
  <text class="mono" x="696" y="132" dy="0.35em" font-size="14" font-weight="700" fill="#0F8478">messages</text>
  <text class="mono" x="696" y="169" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26">id</text>
  <rect x="872" y="159" width="28" height="20" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text x="886" y="169" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#A96C05">PK</text>
  <rect x="687" y="190" width="220" height="26" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <text class="mono" x="696" y="203" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26">conversation_id</text>
  <rect x="872" y="193" width="28" height="20" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text x="886" y="203" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#A96C05">FK</text>
  <path d="M683,220 H911" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="696" y="237" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26">sender_id</text>
  <rect x="872" y="227" width="28" height="20" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text x="886" y="237" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#A96C05">FK</text>
  <path d="M683,254 H911" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="696" y="271" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26">content</text>
  <path d="M683,288 H911" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="696" y="305" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26">image_path</text>
  <path d="M683,322 H911" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="696" y="339" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26">created_at</text>
  <path class="ar-amber" d="M360,203 H322 V169 H282"/>
  <path class="ar-amber" d="M360,237 H322 V169"/>
  <path class="ar-teal" d="M682,203 H646 V169 H614"/>
  <path class="link" d="M797,356 V380 H163 V258"/>
  <text x="480" y="370" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#556074">messages.sender_id → profiles.id: quién lo escribió</text>
  <g transform="translate(48,404)"><rect width="420" height="77" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="14" y="23" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="392">unique (user1_id, user2_id)</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="392">Entre dos personas hay una sola conversación.</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="392">user1_id es siempre el menor de los dos ids.</text></g>
  <g transform="translate(492,404)"><rect width="420" height="77" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="14" y="23" font-size="13.5" font-weight="700" fill="#0F8478" data-fit="392">conversation_id</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="392">El stream y la paginación filtran por él:</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="392">cada chat solo ve sus mensajes.</text></g>
</svg>
```

- **`conversations`** une a dos perfiles: `user1_id` y `user2_id`.
- **`messages`** ya no flota sola: cada mensaje tiene su `conversation_id`. Quién lo escribió sigue en `sender_id`.

La tabla `conversations` tiene dos reglas que valen la pena:

```sql
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user1_id uuid not null references public.profiles(id) on delete cascade,
  user2_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user1_id, user2_id),
  check (user1_id <= user2_id)
);
```

`unique` impide dos filas con la misma pareja. `check` obliga a guardar el id menor en `user1_id`. Con las dos juntas, entre dos personas solo puede haber una conversación.

## Las tablas con datos

```svg
<svg id="rtConvEjemplo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 690" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="rtConvEjemplo-ttl rtConvEjemplo-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="rtConvEjemplo-ttl">Las tablas con datos</title>
  <desc id="rtConvEjemplo-dsc">Tabla profiles con Ana (7c2e…), Beto (1a9d…) y Caro (b45f…). Tabla conversations con tres filas: e81b… entre 1a9d… y 7c2e…, que es Beto con Ana; 5d0a… entre 7c2e… y 7c2e…, Ana consigo misma; y 93fc… entre 1a9d… y b45f…, Beto con Caro. Tabla messages con cinco filas, cada una con su conversation_id, su sender_id y su texto.</desc>
  <defs>
    <style>
      #rtConvEjemplo .title{fill:#161A26;font-size:22px;font-weight:700}
      #rtConvEjemplo .sub{fill:#79809A;font-size:13.5px}
      #rtConvEjemplo .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #rtConvEjemplo .foot{fill:#79809A;font-size:12px}
      #rtConvEjemplo .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #rtConvEjemplo .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #rtConvEjemplo .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#rtConvEjemplo-arrow)}
    </style>
    <marker id="rtConvEjemplo-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="690" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Las tablas con datos</text>
  <text class="sub" x="48" y="80" data-fit="860">Tres personas, tres conversaciones y sus mensajes. El color une cada mensaje con su conversación.</text>
  <rect x="48" y="112" width="240" height="160" rx="12" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="2"/>
  <path d="M48,148 V124 A12,12 0 0 1 60,112 H276 A12,12 0 0 1 288,124 V148 Z" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="2"/>
  <text class="mono" x="62" y="130" dy="0.35em" font-size="14" font-weight="700" fill="#4453C9">profiles</text>
  <text class="mono" x="60" y="162" dy="0.35em" font-size="11.5" font-weight="700" fill="#556074">id</text>
  <text class="mono" x="170" y="162" dy="0.35em" font-size="11.5" font-weight="700" fill="#556074">username</text>
  <path d="M49,176 H287" stroke="#D9DEE8" stroke-width="1.25"/>
  <text class="mono" x="60" y="192" dy="0.35em" font-size="12" fill="#161A26" data-fit="92">7c2e…</text>
  <text class="mono" x="170" y="192" dy="0.35em" font-size="12" fill="#161A26" data-fit="112">ana</text>
  <text class="mono" x="60" y="224" dy="0.35em" font-size="12" fill="#161A26" data-fit="92">1a9d…</text>
  <text class="mono" x="170" y="224" dy="0.35em" font-size="12" fill="#161A26" data-fit="112">beto</text>
  <text class="mono" x="60" y="256" dy="0.35em" font-size="12" fill="#161A26" data-fit="92">b45f…</text>
  <text class="mono" x="170" y="256" dy="0.35em" font-size="12" fill="#161A26" data-fit="112">caro</text>
  <rect x="336" y="112" width="576" height="160" rx="12" fill="#FFFFFF" stroke="#F0C572" stroke-width="2"/>
  <path d="M336,148 V124 A12,12 0 0 1 348,112 H900 A12,12 0 0 1 912,124 V148 Z" fill="#FFF3DC" stroke="#F0C572" stroke-width="2"/>
  <text class="mono" x="350" y="130" dy="0.35em" font-size="14" font-weight="700" fill="#A96C05">conversations</text>
  <text class="mono" x="348" y="162" dy="0.35em" font-size="11.5" font-weight="700" fill="#556074">id</text>
  <text class="mono" x="458" y="162" dy="0.35em" font-size="11.5" font-weight="700" fill="#556074">user1_id</text>
  <text class="mono" x="588" y="162" dy="0.35em" font-size="11.5" font-weight="700" fill="#556074">user2_id</text>
  <text class="mono" x="718" y="162" dy="0.35em" font-size="11.5" font-weight="700" fill="#556074"></text>
  <path d="M337,176 H911" stroke="#D9DEE8" stroke-width="1.25"/>
  <rect x="341" y="180" width="566" height="24" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text class="mono" x="348" y="192" dy="0.35em" font-size="12" fill="#161A26" data-fit="92">e81b…</text>
  <text class="mono" x="458" y="192" dy="0.35em" font-size="12" fill="#161A26" data-fit="112">1a9d…</text>
  <text class="mono" x="588" y="192" dy="0.35em" font-size="12" fill="#161A26" data-fit="112">7c2e…</text>
  <text x="718" y="192" dy="0.35em" font-size="12" fill="#161A26" data-fit="188">«Beto y Ana»</text>
  <rect x="341" y="212" width="566" height="24" rx="6" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.25"/>
  <text class="mono" x="348" y="224" dy="0.35em" font-size="12" fill="#161A26" data-fit="92">5d0a…</text>
  <text class="mono" x="458" y="224" dy="0.35em" font-size="12" fill="#161A26" data-fit="112">7c2e…</text>
  <text class="mono" x="588" y="224" dy="0.35em" font-size="12" fill="#161A26" data-fit="112">7c2e…</text>
  <text x="718" y="224" dy="0.35em" font-size="12" fill="#161A26" data-fit="188">«Ana consigo»</text>
  <rect x="341" y="244" width="566" height="24" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <text class="mono" x="348" y="256" dy="0.35em" font-size="12" fill="#161A26" data-fit="92">93fc…</text>
  <text class="mono" x="458" y="256" dy="0.35em" font-size="12" fill="#161A26" data-fit="112">1a9d…</text>
  <text class="mono" x="588" y="256" dy="0.35em" font-size="12" fill="#161A26" data-fit="112">b45f…</text>
  <text x="718" y="256" dy="0.35em" font-size="12" fill="#161A26" data-fit="188">«Beto y Caro»</text>
  <rect x="48" y="300" width="864" height="224" rx="12" fill="#FFFFFF" stroke="#86D3CA" stroke-width="2"/>
  <path d="M48,336 V312 A12,12 0 0 1 60,300 H900 A12,12 0 0 1 912,312 V336 Z" fill="#E3F6F3" stroke="#86D3CA" stroke-width="2"/>
  <text class="mono" x="62" y="318" dy="0.35em" font-size="14" font-weight="700" fill="#0F8478">messages</text>
  <text class="mono" x="60" y="350" dy="0.35em" font-size="11.5" font-weight="700" fill="#556074">conversation_id</text>
  <text class="mono" x="260" y="350" dy="0.35em" font-size="11.5" font-weight="700" fill="#556074">sender_id</text>
  <text class="mono" x="430" y="350" dy="0.35em" font-size="11.5" font-weight="700" fill="#556074">content</text>
  <path d="M49,364 H911" stroke="#D9DEE8" stroke-width="1.25"/>
  <rect x="53" y="368" width="854" height="24" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text class="mono" x="60" y="380" dy="0.35em" font-size="12" fill="#161A26" data-fit="182">e81b…</text>
  <text class="mono" x="260" y="380" dy="0.35em" font-size="12" fill="#161A26" data-fit="152">7c2e…</text>
  <text class="mono" x="430" y="380" dy="0.35em" font-size="12" fill="#161A26" data-fit="476">hola Beto</text>
  <rect x="53" y="400" width="854" height="24" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text class="mono" x="60" y="412" dy="0.35em" font-size="12" fill="#161A26" data-fit="182">e81b…</text>
  <text class="mono" x="260" y="412" dy="0.35em" font-size="12" fill="#161A26" data-fit="152">1a9d…</text>
  <text class="mono" x="430" y="412" dy="0.35em" font-size="12" fill="#161A26" data-fit="476">¡hola Ana!</text>
  <rect x="53" y="432" width="854" height="24" rx="6" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.25"/>
  <text class="mono" x="60" y="444" dy="0.35em" font-size="12" fill="#161A26" data-fit="182">5d0a…</text>
  <text class="mono" x="260" y="444" dy="0.35em" font-size="12" fill="#161A26" data-fit="152">7c2e…</text>
  <text class="mono" x="430" y="444" dy="0.35em" font-size="12" fill="#161A26" data-fit="476">comprar pan</text>
  <rect x="53" y="464" width="854" height="24" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <text class="mono" x="60" y="476" dy="0.35em" font-size="12" fill="#161A26" data-fit="182">93fc…</text>
  <text class="mono" x="260" y="476" dy="0.35em" font-size="12" fill="#161A26" data-fit="152">b45f…</text>
  <text class="mono" x="430" y="476" dy="0.35em" font-size="12" fill="#161A26" data-fit="476">¿vamos al lab?</text>
  <rect x="53" y="496" width="854" height="24" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text class="mono" x="60" y="508" dy="0.35em" font-size="12" fill="#161A26" data-fit="182">e81b…</text>
  <text class="mono" x="260" y="508" dy="0.35em" font-size="12" fill="#161A26" data-fit="152">7c2e…</text>
  <text class="mono" x="430" y="508" dy="0.35em" font-size="12" fill="#161A26" data-fit="476">te espero a las 2</text>
  <g transform="translate(48,546)"><rect width="420" height="77" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="392">Beto y Ana</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="392">1a9d… es menor que 7c2e…: Beto queda en user1_id,</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="392">sin importar quién abrió el chat primero.</text></g>
  <g transform="translate(492,546)"><rect width="420" height="77" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#7439B8" data-fit="392">Ana consigo misma</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="392">Los dos ids son el de Ana. La regla &lt;= lo permite:</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="392">es su chat de notas.</text></g>
  <text class="foot" x="48" y="662" data-fit="860">Los ids son uuid: aquí se muestran sus primeras cuatro letras.</text>
</svg>
```

Para abrir el chat de Ana con Beto, la app necesita un solo dato: el id de su conversación, `e81b…`. Con él, el Stream pide los mensajes con `conversation_id = e81b…` y los de las otras parejas nunca llegan.

## Obtener la conversación o crearla

Esto es lo que pasa cuando tocas a alguien en la lista. Elige quién eres, toca un contacto y mira cada paso de `openWith`. Luego cambia de persona y abre la misma pareja desde el otro lado:

```interactive
conversation-open
```

El archivo completo:

```dart
/// The only file that talks to the conversations table.
class SupabaseConversationDataSource {
  static const table = 'conversations';

  final SupabaseClient _client = Supabase.instance.client;

  Future<String> openWith(String contactId) async {
    final me = _client.auth.currentUser!.id;
    final pair = [me, contactId]..sort();
    try {
      final found = await _client
          .from(table)
          .select('id')
          .eq('user1_id', pair[0])
          .eq('user2_id', pair[1])
          .maybeSingle();
      if (found != null) return found['id'] as String;
      final created = await _client
          .from(table)
          .insert({'user1_id': pair[0], 'user2_id': pair[1]})
          .select('id')
          .single();
      return created['id'] as String;
    } on PostgrestException catch (e) {
      throw Exception(e.message);
    }
  }
}
```

Tres decisiones lo hacen funcionar:

- **`sort` arma la misma pareja desde los dos lados.** Si Ana abre el chat, la pareja es `[me, contactId]` = `[7c2e…, 1a9d…]`; si lo abre Beto, es `[1a9d…, 7c2e…]`. Ordenada, las dos quedan `[1a9d…, 7c2e…]` y el `select` encuentra la misma fila. Sin `sort`, cada uno crearía la suya y vería la mitad de los mensajes.
- **`maybeSingle` y no `single`.** Que no haya fila es un caso normal, no un error: `maybeSingle` devuelve `null` y el código sigue a crearla. `single` lanzaría una `PostgrestException`.
- **`insert(...).select('id').single()`.** Un `insert` solo no devuelve nada. Con `.select('id')` devuelve la fila recién creada, y así se conoce el `id` que le puso `gen_random_uuid()` sin hacer otra consulta.

Si eliges tu propio usuario, la pareja es tu id repetido: `user1_id <= user2_id` lo permite, y tienes un chat de notas contigo.

## Dónde se usa

`ContactsBloc` llama a `OpenConversationUseCase` con el perfil que tocaste. El caso de uso pide el id al repositorio, que delega en este data source, y arma una `Conversation` con el id y el contacto. Con ella se abre `ChatScreen`, y `ChatBloc` la recibe en su constructor: a partir de ahí, todo el chat filtra por `conversation.id`.

Si las dos personas abren el chat por primera vez en el mismo instante, los dos `select` pueden no encontrar nada y los dos intentan el `insert`. `unique` deja pasar solo uno: el otro falla con `duplicate key value violates unique constraint`. Basta con volver a tocar el contacto, y esta vez el `select` la encuentra.
