# Escribir en la base de datos

<!-- tags: insert, insert en lote, upsert, update, delete, .select().single(), PostgrestException,
     permission denied for table posts, violates check constraint, UPDATE requires a WHERE clause,
     onConflict, guardar datos en Supabase -->

Toda escritura empieza igual: `_client.from('tabla')` y después la operación. Esta lección usa una tabla `posts`, la misma del Laboratorio 6, junto al `profiles` que ya tienes del Laboratorio 5.

## La tabla posts

```svg
<svg id="dbPosts" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 492" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="dbPosts-ttl dbPosts-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="dbPosts-ttl">La tabla posts</title>
  <desc id="dbPosts-dsc">Tres tablas encadenadas. auth.users tiene id y email. profiles tiene id, username y full_name, y su id referencia a auth.users. posts tiene id, profile_id, content y created_at; su profile_id referencia al id de profiles. El id y el created_at de posts los pone la base de datos; profile_id y content los manda la app.</desc>
  <defs>
    <style>
      #dbPosts .title{fill:#161A26;font-size:22px;font-weight:700}
      #dbPosts .sub{fill:#79809A;font-size:13.5px}
      #dbPosts .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #dbPosts .foot{fill:#79809A;font-size:12px}
      #dbPosts .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #dbPosts .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #dbPosts .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#dbPosts-arrow)}
      #dbPosts .ar-indigo{fill:none;stroke:#4453C9;stroke-width:1.75;marker-end:url(#dbPosts-ar-indigo)}
    </style>
    <marker id="dbPosts-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="dbPosts-ar-indigo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#4453C9"/></marker>
  </defs>
  <rect width="960" height="492" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">La tabla <tspan class="mono">posts</tspan></text>
  <text class="sub" x="48" y="80" data-fit="860">Cada post apunta al perfil de quien lo escribió, y ese perfil a su cuenta de Auth.</text>
  <rect x="48" y="112" width="240" height="108" rx="12" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="2"/>
  <path d="M48,152 V124 A12,12 0 0 1 60,112 H276 A12,12 0 0 1 288,124 V152 Z" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="2"/>
  <text class="mono" x="62" y="132" dy="0.35em" font-size="14" font-weight="700" fill="#556074">auth.users</text>
  <text class="mono" x="62" y="169" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26">id</text>
  <text class="mono" x="140" y="169" dy="0.35em" font-size="12" fill="#79809A" data-fit="102">3f2a9c1e…</text>
  <rect x="248" y="159" width="28" height="20" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text x="262" y="169" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#A96C05">PK</text>
  <path d="M49,186 H287" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="62" y="203" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26">email</text>
  <text class="mono" x="140" y="203" dy="0.35em" font-size="12" fill="#79809A" data-fit="136">ana@icesi…</text>
  <rect x="336" y="112" width="240" height="142" rx="12" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="2"/>
  <path d="M336,152 V124 A12,12 0 0 1 348,112 H564 A12,12 0 0 1 576,124 V152 Z" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="2"/>
  <text class="mono" x="350" y="132" dy="0.35em" font-size="14" font-weight="700" fill="#4453C9">profiles</text>
  <text class="mono" x="350" y="169" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26">id</text>
  <text class="mono" x="440" y="169" dy="0.35em" font-size="12" fill="#79809A" data-fit="90">3f2a9c1e…</text>
  <rect x="536" y="159" width="28" height="20" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text x="550" y="169" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#A96C05">PK</text>
  <path d="M337,186 H575" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="350" y="203" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26">username</text>
  <text class="mono" x="440" y="203" dy="0.35em" font-size="12" fill="#79809A" data-fit="124">ana.dev</text>
  <path d="M337,220 H575" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="350" y="237" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26">full_name</text>
  <text class="mono" x="440" y="237" dy="0.35em" font-size="12" fill="#79809A" data-fit="124">Ana Gómez</text>
  <rect x="624" y="112" width="288" height="176" rx="12" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="2"/>
  <path d="M624,152 V124 A12,12 0 0 1 636,112 H900 A12,12 0 0 1 912,124 V152 Z" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="2"/>
  <text class="mono" x="638" y="132" dy="0.35em" font-size="14" font-weight="700" fill="#4453C9">posts</text>
  <rect x="629" y="156" width="278" height="26" rx="6" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>
  <text class="mono" x="638" y="169" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26">id</text>
  <text class="mono" x="736" y="169" dy="0.35em" font-size="12" fill="#3A8235" data-fit="130">9b1e04d7…</text>
  <rect x="872" y="159" width="28" height="20" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text x="886" y="169" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#A96C05">PK</text>
  <rect x="629" y="190" width="278" height="26" rx="6" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/>
  <text class="mono" x="638" y="203" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26">profile_id</text>
  <text class="mono" x="736" y="203" dy="0.35em" font-size="12" fill="#4453C9" data-fit="130">3f2a9c1e…</text>
  <rect x="872" y="193" width="28" height="20" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text x="886" y="203" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#A96C05">FK</text>
  <rect x="629" y="224" width="278" height="26" rx="6" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/>
  <text class="mono" x="638" y="237" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26">content</text>
  <text class="mono" x="736" y="237" dy="0.35em" font-size="12" fill="#4453C9" data-fit="164">'Mi primer post'</text>
  <rect x="629" y="258" width="278" height="26" rx="6" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>
  <text class="mono" x="638" y="271" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26">created_at</text>
  <text class="mono" x="736" y="271" dy="0.35em" font-size="12" fill="#3A8235" data-fit="164">2026-10-18 10:05</text>
  <path class="link" d="M336,169 H290"/>
  <path class="ar-indigo" d="M624,203 H600 V169 H578"/>
  <rect x="624" y="308" width="16" height="16" rx="4" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/><text x="648" y="316" dy="0.35em" font-size="12.5" fill="#454C61">Los pone la base de datos</text>
  <rect x="624" y="334" width="16" height="16" rx="4" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/><text x="648" y="342" dy="0.35em" font-size="12.5" fill="#454C61">Los mandas tú en el insert</text>
  <g transform="translate(48,316)"><rect width="528" height="77" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#556074" data-fit="500">on delete cascade</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="500">Si se borra la cuenta, se borra su perfil, y con el perfil, sus posts.</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="500">Nunca queda un post sin autor.</text></g>
  <g transform="translate(624,366)"><rect width="288" height="77" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#3A8235" data-fit="260">default</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="260">gen_random_uuid() para el id,</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="260">now() para la fecha.</text></g>
  <text class="foot" x="48" y="464" data-fit="860">El check de content rechaza cualquier texto de más de 280 caracteres, venga de donde venga.</text>
</svg>
```

Crea la migración desde la carpeta de tu proyecto, como hiciste con `profiles`:

```shell
npx supabase migration new create_posts
```

```sql
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (char_length(content) <= 280),
  created_at timestamptz not null default now()
);

grant select, insert, update, delete on public.posts to authenticated;
```

```shell
npx supabase db push
```

El `id` y el `created_at` los pone la base de datos. Tú solo mandas quién escribe y qué escribe.

## Cinco formas de escribir

```svg
<svg id="dbEscrituras" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 464" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="dbEscrituras-ttl dbEscrituras-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="dbEscrituras-ttl">Cinco formas de escribir</title>
  <desc id="dbEscrituras-dsc">Cinco columnas con la misma tabla de posts. insert agrega una fila nueva. insert con una lista agrega tres filas en una sola petición. upsert actualiza la fila si su llave ya existe, o la crea si no. update con eq cambia el contenido de la fila filtrada. delete con eq borra la fila filtrada.</desc>
  <defs>
    <style>
      #dbEscrituras .title{fill:#161A26;font-size:22px;font-weight:700}
      #dbEscrituras .sub{fill:#79809A;font-size:13.5px}
      #dbEscrituras .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #dbEscrituras .foot{fill:#79809A;font-size:12px}
      #dbEscrituras .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #dbEscrituras .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #dbEscrituras .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#dbEscrituras-arrow)}
    </style>
    <marker id="dbEscrituras-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="464" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Cinco formas de escribir</text>
  <text class="sub" x="48" y="80" data-fit="860">La misma tabla después de cada operación. Lo resaltado es lo que cambió.</text>
  <rect x="48" y="108" width="164" height="318" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="58" y="120" width="144" height="28" rx="6" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/>
  <text class="mono" x="130" y="134" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#4453C9" data-fit="136">insert({…})</text>
  <text class="h" x="60" y="172">POSTS</text>
  <rect x="58" y="182" width="144" height="24" rx="5" fill="#F5F6FA" stroke="#D9DEE8" stroke-width="1.25"/>
  <text class="mono" x="66" y="194" dy="0.35em" font-size="11.5" font-weight="700" fill="#454C61">p1</text>
  <text x="92" y="194" dy="0.35em" font-size="11.5" fill="#454C61" data-fit="102">Hola mundo</text>
  <rect x="58" y="212" width="144" height="24" rx="5" fill="#F5F6FA" stroke="#D9DEE8" stroke-width="1.25"/>
  <text class="mono" x="66" y="224" dy="0.35em" font-size="11.5" font-weight="700" fill="#454C61">p2</text>
  <text x="92" y="224" dy="0.35em" font-size="11.5" fill="#454C61" data-fit="102">Hoy hay clase</text>
  <rect x="58" y="242" width="144" height="24" rx="5" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>
  <text class="mono" x="66" y="254" dy="0.35em" font-size="11.5" font-weight="700" fill="#3A8235">p3</text>
  <text x="92" y="254" dy="0.35em" font-size="11.5" fill="#3A8235" data-fit="102">Mi primer post</text>
  <text x="60" y="364" font-size="12.5" fill="#454C61" data-fit="140">Una fila nueva.</text>
  <text x="60" y="382" font-size="12.5" fill="#454C61" data-fit="140">Devuelve nada, o la fila</text>
  <text x="60" y="400" font-size="12.5" fill="#454C61" data-fit="140">con .select().single().</text>
  <rect x="223" y="108" width="164" height="318" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="233" y="120" width="144" height="28" rx="6" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/>
  <text class="mono" x="305" y="134" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#4453C9" data-fit="136">insert([…])</text>
  <text class="h" x="235" y="172">POSTS</text>
  <rect x="233" y="182" width="144" height="24" rx="5" fill="#F5F6FA" stroke="#D9DEE8" stroke-width="1.25"/>
  <text class="mono" x="241" y="194" dy="0.35em" font-size="11.5" font-weight="700" fill="#454C61">p1</text>
  <text x="267" y="194" dy="0.35em" font-size="11.5" fill="#454C61" data-fit="102">Hola mundo</text>
  <rect x="233" y="212" width="144" height="24" rx="5" fill="#F5F6FA" stroke="#D9DEE8" stroke-width="1.25"/>
  <text class="mono" x="241" y="224" dy="0.35em" font-size="11.5" font-weight="700" fill="#454C61">p2</text>
  <text x="267" y="224" dy="0.35em" font-size="11.5" fill="#454C61" data-fit="102">Hoy hay clase</text>
  <rect x="233" y="242" width="144" height="24" rx="5" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>
  <text class="mono" x="241" y="254" dy="0.35em" font-size="11.5" font-weight="700" fill="#3A8235">p3</text>
  <text x="267" y="254" dy="0.35em" font-size="11.5" fill="#3A8235" data-fit="102">Post 1</text>
  <rect x="233" y="272" width="144" height="24" rx="5" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>
  <text class="mono" x="241" y="284" dy="0.35em" font-size="11.5" font-weight="700" fill="#3A8235">p4</text>
  <text x="267" y="284" dy="0.35em" font-size="11.5" fill="#3A8235" data-fit="102">Post 2</text>
  <rect x="233" y="302" width="144" height="24" rx="5" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>
  <text class="mono" x="241" y="314" dy="0.35em" font-size="11.5" font-weight="700" fill="#3A8235">p5</text>
  <text x="267" y="314" dy="0.35em" font-size="11.5" fill="#3A8235" data-fit="102">Post 3</text>
  <text x="235" y="364" font-size="12.5" fill="#454C61" data-fit="140">Varias filas a la vez.</text>
  <text x="235" y="382" font-size="12.5" fill="#454C61" data-fit="140">Si una falla,</text>
  <text x="235" y="400" font-size="12.5" fill="#454C61" data-fit="140">no entra ninguna.</text>
  <rect x="398" y="108" width="164" height="318" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="408" y="120" width="144" height="28" rx="6" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/>
  <text class="mono" x="480" y="134" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#4453C9" data-fit="136">upsert({…})</text>
  <text class="h" x="410" y="172">POSTS</text>
  <rect x="408" y="182" width="144" height="24" rx="5" fill="#F5F6FA" stroke="#D9DEE8" stroke-width="1.25"/>
  <text class="mono" x="416" y="194" dy="0.35em" font-size="11.5" font-weight="700" fill="#454C61">p1</text>
  <text x="442" y="194" dy="0.35em" font-size="11.5" fill="#454C61" data-fit="102">Hola mundo</text>
  <rect x="408" y="212" width="144" height="24" rx="5" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text class="mono" x="416" y="224" dy="0.35em" font-size="11.5" font-weight="700" fill="#A96C05">p2</text>
  <text x="442" y="224" dy="0.35em" font-size="11.5" fill="#A96C05" data-fit="102">Hoy no hay clase</text>
  <text x="410" y="364" font-size="12.5" fill="#454C61" data-fit="140">Si la llave existe,</text>
  <text x="410" y="382" font-size="12.5" fill="#454C61" data-fit="140">actualiza. Si no,</text>
  <text x="410" y="400" font-size="12.5" fill="#454C61" data-fit="140">la crea.</text>
  <rect x="573" y="108" width="164" height="318" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="583" y="120" width="144" height="28" rx="6" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/>
  <text class="mono" x="655" y="134" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#4453C9" data-fit="136">update({…}).eq()</text>
  <text class="h" x="585" y="172">POSTS</text>
  <rect x="583" y="182" width="144" height="24" rx="5" fill="#F5F6FA" stroke="#D9DEE8" stroke-width="1.25"/>
  <text class="mono" x="591" y="194" dy="0.35em" font-size="11.5" font-weight="700" fill="#454C61">p1</text>
  <text x="617" y="194" dy="0.35em" font-size="11.5" fill="#454C61" data-fit="102">Hola mundo</text>
  <rect x="583" y="212" width="144" height="24" rx="5" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text class="mono" x="591" y="224" dy="0.35em" font-size="11.5" font-weight="700" fill="#A96C05">p2</text>
  <text x="617" y="224" dy="0.35em" font-size="11.5" fill="#A96C05" data-fit="102">Texto corregido</text>
  <text x="585" y="364" font-size="12.5" fill="#454C61" data-fit="140">Cambia las filas</text>
  <text x="585" y="382" font-size="12.5" fill="#454C61" data-fit="140">que deja el filtro.</text>
  <text x="585" y="400" font-size="12.5" fill="#454C61" data-fit="140">Sin filtro, error.</text>
  <rect x="748" y="108" width="164" height="318" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="758" y="120" width="144" height="28" rx="6" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/>
  <text class="mono" x="830" y="134" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#4453C9" data-fit="136">delete().eq()</text>
  <text class="h" x="760" y="172">POSTS</text>
  <rect x="758" y="182" width="144" height="24" rx="5" fill="#F5F6FA" stroke="#D9DEE8" stroke-width="1.25"/>
  <text class="mono" x="766" y="194" dy="0.35em" font-size="11.5" font-weight="700" fill="#454C61">p1</text>
  <text x="792" y="194" dy="0.35em" font-size="11.5" fill="#454C61" data-fit="102">Hola mundo</text>
  <rect x="758" y="212" width="144" height="24" rx="5" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.25" stroke-dasharray="4 3"/>
  <text class="mono" x="766" y="224" dy="0.35em" font-size="11.5" font-weight="700" fill="#C2354F">p2</text>
  <text x="792" y="224" dy="0.35em" font-size="11.5" fill="#C2354F" text-decoration="line-through" data-fit="102">Hoy hay clase</text>
  <text x="760" y="364" font-size="12.5" fill="#454C61" data-fit="140">Borra las filas</text>
  <text x="760" y="382" font-size="12.5" fill="#454C61" data-fit="140">que deja el filtro.</text>
  <text x="760" y="400" font-size="12.5" fill="#454C61" data-fit="140">Sin filtro, error.</text>
  <rect x="48" y="436" width="16" height="16" rx="4" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/><text x="72" y="444" dy="0.35em" font-size="12.5" fill="#454C61">nueva</text>
  <rect x="140" y="436" width="16" height="16" rx="4" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/><text x="164" y="444" dy="0.35em" font-size="12.5" fill="#454C61">actualizada</text>
  <rect x="262" y="436" width="16" height="16" rx="4" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.25"/><text x="286" y="444" dy="0.35em" font-size="12.5" fill="#454C61">borrada</text>
</svg>
```

## Insertar un registro

```dart
class SupabasePostDataSource {
  final SupabaseClient _client;

  SupabasePostDataSource(this._client);

  Future<void> create(String content) async {
    await _client.from('posts').insert({
      'profile_id': _client.auth.currentUser!.id,
      'content': content,
    });
  }
}
```

Las llaves del mapa son los nombres de las **columnas**, no los de tus campos en Dart. El `profile_id` sale de la sesión: no se le pide al usuario.

## Recibir lo que insertaste

Un `insert` solo no devuelve nada. Si le encadenas `.select().single()`, la base de datos te devuelve la fila completa, ya con su `id` y su `created_at`.

```dart
Future<Post> create(String content) async {
  final row = await _client
      .from('posts')
      .insert({
        'profile_id': _client.auth.currentUser!.id,
        'content': content,
      })
      .select()
      .single();
  return Post.fromJson(row);
}
```

`row` es un `Map<String, dynamic>`, y `fromJson` lo convierte en tu modelo:

```dart
class Post {
  final String id;
  final String profileId;
  final String content;
  final DateTime createdAt;

  const Post({
    required this.id,
    required this.profileId,
    required this.content,
    required this.createdAt,
  });

  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json['id'] as String,
      profileId: json['profile_id'] as String,
      content: json['content'] as String,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }
}
```

## Insertar en lote

Para guardar varias filas, pasa una **lista** de mapas. Es una sola petición y una sola transacción: si una fila falla, no entra ninguna.

```dart
Future<void> seed() async {
  final uid = _client.auth.currentUser!.id;
  await _client.from('posts').insert([
    {'profile_id': uid, 'content': 'Mi primer post'},
    {'profile_id': uid, 'content': 'Hoy vimos Supabase en clase'},
    {'profile_id': uid, 'content': 'Flutter + Supabase = muro'},
  ]);
}
```

Es mucho más rápido que un `for` con un `await insert` por fila. Úsalo ahora para sembrar unos cuantos posts: los vas a leer en la lección siguiente.

## Insertar o actualizar: upsert

`upsert` mira la llave primaria: si ya hay una fila con ese `id`, la actualiza; si no, la crea. Sirve para un «guardar perfil» que funcione igual la primera vez y las siguientes.

```dart
await _client.from('profiles').upsert({
  'id': _client.auth.currentUser!.id,
  'username': 'ana.dev',
  'full_name': 'Ana María Gómez',
});
```

Si la fila se reconoce por otra columna única, dila con `onConflict`. En el Laboratorio 6 lo usarás para los «me gusta», que no se pueden repetir:

```dart
await _client.from('likes').upsert(
  {'post_id': postId, 'profile_id': uid},
  onConflict: 'post_id,profile_id',
);
```

## Actualizar y borrar

Los dos necesitan un **filtro** que diga qué filas tocar.

```dart
await _client
    .from('posts')
    .update({'content': 'Texto corregido'})
    .eq('id', postId);

await _client.from('posts').delete().eq('id', postId);
```

Sin filtro, Supabase rechaza la operación con `UPDATE requires a WHERE clause` (o `DELETE …`): de lo contrario cambiaría la tabla entera. Si el filtro no encuentra filas, no hay error: simplemente no cambia nada. Encadena `.select()` si necesitas saber qué filas cambiaron.

## Cuando algo falla

Cualquier operación lanza `PostgrestException` si la base de datos la rechaza. Su `message` dice qué pasó y su `code` es el código de Postgres.

```dart
try {
  await _client.from('posts').insert({
    'profile_id': _client.auth.currentUser!.id,
    'content': content,
  });
} on PostgrestException catch (e) {
  throw Exception('No se pudo publicar: ${e.message}');
}
```

Los tres que más vas a ver:

- `permission denied for table posts` (`42501`): falta el `grant` de la migración.
- `new row for relation "posts" violates check constraint` (`23514`): el texto pasa de 280 caracteres.
- `violates foreign key constraint` (`23503`): el `profile_id` no tiene perfil en `profiles`.
