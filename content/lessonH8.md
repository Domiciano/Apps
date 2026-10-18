# Laboratorio 6 · Muro

<!-- tags: FeedBloc, BottomNavigationBar, select anidado, range, likes(count), upsert onConflict,
     Mostrar más, debugPrint, copyWith, permission denied for table likes,
     duplicate key value violates unique constraint, qué va en cada capa -->

Vas a construir un muro al estilo de Twitter. Cada usuario publica textos cortos y ve los de todos, del más reciente al más antiguo. Puede dar «me gusta» y, en su perfil, ve sus tres últimas publicaciones. No hay imágenes, porque Storage todavía no lo hemos visto.

La interfaz ya está hecha y los estados ya están modelados. Lo que falta es lo de adentro: qué va en cada capa y cómo se conectan.

## Lo que vas a construir

```svg
<svg id="dbMuroPantallas" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 616" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="dbMuroPantallas-ttl dbMuroPantallas-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="dbMuroPantallas-ttl">Una Screen con dos Pages, y otra Screen para escribir</title>
  <desc id="dbMuroPantallas-dsc">Tres teléfonos. El primero es HomeScreen mostrando FeedPage: tres tarjetas de post con autor, texto y corazón con su contador, un botón Mostrar más y la barra inferior con Muro activo. El segundo es la misma HomeScreen mostrando ProfilePage: nombre, username y los tres últimos posts propios, con Perfil activo. El tercero es ComposeScreen, con un campo de texto, el contador 42/280 y el botón Publicar. Del botón flotante sale una flecha a ComposeScreen.</desc>
  <defs>
    <style>
      #dbMuroPantallas .title{fill:#161A26;font-size:22px;font-weight:700}
      #dbMuroPantallas .sub{fill:#79809A;font-size:13.5px}
      #dbMuroPantallas .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #dbMuroPantallas .foot{fill:#79809A;font-size:12px}
      #dbMuroPantallas .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #dbMuroPantallas .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #dbMuroPantallas .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#dbMuroPantallas-arrow)}
      #dbMuroPantallas .ar-violet{fill:none;stroke:#7439B8;stroke-width:1.75;marker-end:url(#dbMuroPantallas-ar-violet)}
      #dbMuroPantallas .ar-teal{fill:none;stroke:#0F8478;stroke-width:1.75;marker-end:url(#dbMuroPantallas-ar-teal)}
    </style>
    <marker id="dbMuroPantallas-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="dbMuroPantallas-ar-violet" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#7439B8"/></marker>
    <marker id="dbMuroPantallas-ar-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#0F8478"/></marker>
  </defs>
  <rect width="960" height="616" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Una Screen con dos Pages, y otra Screen para escribir</text>
  <text class="sub" x="48" y="80" data-fit="860">El BottomNavigationBar cambia de Page sin navegar. El botón flotante sí navega, a ComposeScreen.</text>
  <text class="mono" x="164" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#7439B8">HomeScreen <tspan fill="#0F8478">· FeedPage</tspan></text>
  <text class="mono" x="480" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#7439B8">HomeScreen <tspan fill="#0F8478">· ProfilePage</tspan></text>
  <text class="mono" x="796" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#7439B8">ComposeScreen</text>
  <rect x="48" y="132" width="232" height="420" rx="18" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/><text x="64" y="156" dy="0.35em" font-size="14" font-weight="600" fill="#161A26">Muro</text><path d="M50,174 H278" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="56" y="180" width="216" height="320" rx="8" fill="#E3F6F3" fill-opacity=".45" stroke="#86D3CA" stroke-dasharray="4 3"/>
  <rect x="64" y="190" width="200" height="62" rx="8" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <text x="74" y="206" dy="0.35em" font-size="11" font-weight="700" fill="#161A26" data-fit="180">@lu.mora <tspan font-weight="400" fill="#79809A">· Lucía Mora</tspan></text>
  <text x="74" y="224" dy="0.35em" font-size="11" fill="#454C61" data-fit="180">Alguien entendió range?</text>
  <path transform="translate(74,235)" d="M0,3 C0,-1 5,-2 6,2 C7,-2 12,-1 12,3 C12,6 8,9 6,11 C4,9 0,6 0,3 Z" fill="#C2354F" stroke="#C2354F" stroke-width="1.3"/>
  <text x="92" y="241" dy="0.35em" font-size="11" fill="#454C61">3</text>
  <rect x="64" y="260" width="200" height="62" rx="8" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <text x="74" y="276" dy="0.35em" font-size="11" font-weight="700" fill="#161A26" data-fit="180">@juanpa <tspan font-weight="400" fill="#79809A">· Juan Pablo</tspan></text>
  <text x="74" y="294" dy="0.35em" font-size="11" fill="#454C61" data-fit="180">Flutter + Supabase = muro</text>
  <path transform="translate(74,305)" d="M0,3 C0,-1 5,-2 6,2 C7,-2 12,-1 12,3 C12,6 8,9 6,11 C4,9 0,6 0,3 Z" fill="none" stroke="#C2354F" stroke-width="1.3"/>
  <text x="92" y="311" dy="0.35em" font-size="11" fill="#454C61">5</text>
  <rect x="64" y="330" width="200" height="62" rx="8" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <text x="74" y="346" dy="0.35em" font-size="11" font-weight="700" fill="#161A26" data-fit="180">@ana.dev <tspan font-weight="400" fill="#79809A">· Ana Gómez</tspan></text>
  <text x="74" y="364" dy="0.35em" font-size="11" fill="#454C61" data-fit="180">Mi primer post</text>
  <path transform="translate(74,375)" d="M0,3 C0,-1 5,-2 6,2 C7,-2 12,-1 12,3 C12,6 8,9 6,11 C4,9 0,6 0,3 Z" fill="none" stroke="#C2354F" stroke-width="1.3"/>
  <text x="92" y="381" dy="0.35em" font-size="11" fill="#454C61">1</text>
  <rect x="104" y="404" width="120" height="28" rx="14" fill="#FFFFFF" stroke="#4453C9" stroke-width="1.5"/>
  <text x="164" y="418" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#4453C9">Mostrar más</text>
  <rect x="220" y="448" width="44" height="44" rx="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/>
  <text x="242" y="470" dy="0.35em" text-anchor="middle" font-size="18" font-weight="700" fill="#4453C9">+</text>
  <path d="M50,500 H278" stroke="#D9DEE8" stroke-width="1.5"/>
  <circle cx="106" cy="516" r="5" fill="#4453C9"/>
  <text x="106" y="532" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#4453C9">Muro</text>
  <circle cx="222" cy="516" r="5" fill="#C4CBD8"/>
  <text x="222" y="532" dy="0.35em" text-anchor="middle" font-size="11" font-weight="400" fill="#79809A">Perfil</text>
  <rect x="364" y="132" width="232" height="420" rx="18" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/><text x="380" y="156" dy="0.35em" font-size="14" font-weight="600" fill="#161A26">Muro</text><path d="M366,174 H594" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="372" y="180" width="216" height="320" rx="8" fill="#E3F6F3" fill-opacity=".45" stroke="#86D3CA" stroke-dasharray="4 3"/>
  <circle cx="480" cy="216" r="22" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/>
  <text x="480" y="216" dy="0.35em" text-anchor="middle" font-size="15" font-weight="700" fill="#4453C9">AG</text>
  <text x="480" y="254" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#161A26">Ana Gómez</text>
  <text x="480" y="272" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#79809A">@ana.dev</text>
  <text class="h" x="382" y="300" style="font-size:10.5px">TUS ÚLTIMOS POSTS</text>
  <rect x="380" y="310" width="200" height="62" rx="8" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <text x="390" y="326" dy="0.35em" font-size="11" font-weight="700" fill="#161A26" data-fit="180">@ana.dev <tspan font-weight="400" fill="#79809A">· Ana Gómez</tspan></text>
  <text x="390" y="344" dy="0.35em" font-size="11" fill="#454C61" data-fit="180">Mi primer post</text>
  <path transform="translate(390,355)" d="M0,3 C0,-1 5,-2 6,2 C7,-2 12,-1 12,3 C12,6 8,9 6,11 C4,9 0,6 0,3 Z" fill="none" stroke="#C2354F" stroke-width="1.3"/>
  <text x="408" y="361" dy="0.35em" font-size="11" fill="#454C61">1</text>
  <rect x="380" y="380" width="200" height="62" rx="8" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <text x="390" y="396" dy="0.35em" font-size="11" font-weight="700" fill="#161A26" data-fit="180">@ana.dev <tspan font-weight="400" fill="#79809A">· Ana Gómez</tspan></text>
  <text x="390" y="414" dy="0.35em" font-size="11" fill="#454C61" data-fit="180">Hoy vimos Supabase</text>
  <path transform="translate(390,425)" d="M0,3 C0,-1 5,-2 6,2 C7,-2 12,-1 12,3 C12,6 8,9 6,11 C4,9 0,6 0,3 Z" fill="none" stroke="#C2354F" stroke-width="1.3"/>
  <text x="408" y="431" dy="0.35em" font-size="11" fill="#454C61">0</text>
  <path d="M366,500 H594" stroke="#D9DEE8" stroke-width="1.5"/>
  <circle cx="422" cy="516" r="5" fill="#C4CBD8"/>
  <text x="422" y="532" dy="0.35em" text-anchor="middle" font-size="11" font-weight="400" fill="#79809A">Muro</text>
  <circle cx="538" cy="516" r="5" fill="#4453C9"/>
  <text x="538" y="532" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#4453C9">Perfil</text>
  <rect x="680" y="132" width="232" height="420" rx="18" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/><text x="696" y="156" dy="0.35em" font-size="14" font-weight="600" fill="#161A26">Nuevo post</text><path d="M682,174 H910" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="696" y="192" width="200" height="120" rx="8" fill="#F5F6FA" stroke="#4453C9" stroke-width="1.5"/>
  <text x="706" y="210" dy="0.35em" font-size="12" fill="#161A26" data-fit="180">Hoy aprendí a paginar con</text>
  <text x="706" y="228" dy="0.35em" font-size="12" fill="#161A26" data-fit="180">range y order. #flutter</text>
  <text x="896" y="328" dy="0.35em" text-anchor="end" font-size="11.5" fill="#79809A">42/280</text>
  <rect x="696" y="352" width="200" height="34" rx="17" fill="#4453C9"/>
  <text x="796" y="369" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#FFFFFF">Publicar</text>
  <path class="ar-violet" d="M242,554 V586 H796 V556"/>
  <rect x="380" y="574" width="200" height="24" rx="12" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.25"/>
  <text class="mono" x="480" y="586" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#7439B8">pushNamed('/compose')</text>
  <text x="250" y="570" dy="0.35em" font-size="11" fill="#7439B8">botón +</text>
  <path class="ar-teal" d="M290,526 H358"/>
  <path class="ar-teal" d="M354,526 H286"/>
  <text class="mono" x="322" y="498" text-anchor="middle" font-size="11" font-weight="700" fill="#0F8478">setState</text>
  <text class="mono" x="322" y="513" text-anchor="middle" font-size="11" font-weight="700" fill="#0F8478">_index</text>
</svg>
```

`HomeScreen` es el anfitrión: un `BottomNavigationBar` cambia entre `FeedPage` y `ProfilePage`. Para escribir, el botón flotante abre `ComposeScreen` con `pushNamed`.

## Preparación

El punto de partida es este proyecto: [github.com/Domiciano/262AppsLab6](https://github.com/Domiciano/262AppsLab6).

```shell
git clone https://github.com/Domiciano/262AppsLab6
cd 262AppsLab6
flutter pub get
```

Pon en `lib/main.dart` la `Project URL` y la `publishable key` de tu proyecto de Supabase. Después copia en la raíz la carpeta `supabase/` de tu proyecto del Laboratorio 5, que ya trae tu `link` y tu migración de `profiles`. Si todavía no creaste `posts`, hazlo como en *Escribir en la base de datos*. Después crea `likes`:

```shell
npx supabase migration new create_likes
```

```sql
create table public.likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, profile_id)
);

grant select, insert, update, delete on public.likes to authenticated;
```

```shell
npx supabase db push
```

```svg
<svg id="dbMuroModelo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 452" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="dbMuroModelo-ttl dbMuroModelo-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="dbMuroModelo-ttl">El modelo de datos del muro</title>
  <desc id="dbMuroModelo-dsc">Cuatro tablas. auth.users con id. profiles con id, que referencia a auth.users, username y full_name. posts con id, profile_id, que referencia a profiles, content y created_at. likes con post_id, que referencia a posts, profile_id, que referencia a profiles, y created_at. La llave primaria de likes es la pareja post_id y profile_id.</desc>
  <defs>
    <style>
      #dbMuroModelo .title{fill:#161A26;font-size:22px;font-weight:700}
      #dbMuroModelo .sub{fill:#79809A;font-size:13.5px}
      #dbMuroModelo .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #dbMuroModelo .foot{fill:#79809A;font-size:12px}
      #dbMuroModelo .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #dbMuroModelo .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #dbMuroModelo .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#dbMuroModelo-arrow)}
      #dbMuroModelo .ar-indigo{fill:none;stroke:#4453C9;stroke-width:1.75;marker-end:url(#dbMuroModelo-ar-indigo)}
      #dbMuroModelo .ar-rose{fill:none;stroke:#C2354F;stroke-width:1.75;marker-end:url(#dbMuroModelo-ar-rose)}
    </style>
    <marker id="dbMuroModelo-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="dbMuroModelo-ar-indigo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#4453C9"/></marker>
    <marker id="dbMuroModelo-ar-rose" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#C2354F"/></marker>
  </defs>
  <rect width="960" height="452" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">El modelo de datos del muro</text>
  <text class="sub" x="48" y="80" data-fit="860">likes une a una persona con un post. Su llave es la pareja: no puede repetirse.</text>
  <rect x="48" y="112" width="200" height="108" rx="12" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="2"/>
  <path d="M48,152 V124 A12,12 0 0 1 60,112 H236 A12,12 0 0 1 248,124 V152 Z" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="2"/>
  <text class="mono" x="62" y="132" dy="0.35em" font-size="14" font-weight="700" fill="#556074">auth.users</text>
  <text class="mono" x="62" y="169" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26">id</text>
  <rect x="208" y="159" width="28" height="20" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text x="222" y="169" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#A96C05">PK</text>
  <path d="M49,186 H247" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="62" y="203" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26">email</text>
  <rect x="269" y="112" width="200" height="142" rx="12" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="2"/>
  <path d="M269,152 V124 A12,12 0 0 1 281,112 H457 A12,12 0 0 1 469,124 V152 Z" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="2"/>
  <text class="mono" x="283" y="132" dy="0.35em" font-size="14" font-weight="700" fill="#4453C9">profiles</text>
  <text class="mono" x="283" y="169" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26">id</text>
  <rect x="394" y="159" width="63" height="20" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text x="426" y="169" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#A96C05">PK · FK</text>
  <path d="M270,186 H468" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="283" y="203" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26">username</text>
  <path d="M270,220 H468" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="283" y="237" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26">full_name</text>
  <rect x="490" y="112" width="200" height="176" rx="12" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="2"/>
  <path d="M490,152 V124 A12,12 0 0 1 502,112 H678 A12,12 0 0 1 690,124 V152 Z" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="2"/>
  <text class="mono" x="504" y="132" dy="0.35em" font-size="14" font-weight="700" fill="#4453C9">posts</text>
  <text class="mono" x="504" y="169" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26">id</text>
  <rect x="650" y="159" width="28" height="20" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text x="664" y="169" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#A96C05">PK</text>
  <path d="M491,186 H689" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="504" y="203" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26">profile_id</text>
  <rect x="650" y="193" width="28" height="20" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text x="664" y="203" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#A96C05">FK</text>
  <path d="M491,220 H689" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="504" y="237" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26">content</text>
  <path d="M491,254 H689" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="504" y="271" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26">created_at</text>
  <rect x="711" y="112" width="200" height="142" rx="12" fill="#FFFFFF" stroke="#F3A3B2" stroke-width="2"/>
  <path d="M711,152 V124 A12,12 0 0 1 723,112 H899 A12,12 0 0 1 911,124 V152 Z" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="2"/>
  <text class="mono" x="725" y="132" dy="0.35em" font-size="14" font-weight="700" fill="#C2354F">likes</text>
  <rect x="716" y="156" width="190" height="26" rx="6" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.25"/>
  <text class="mono" x="725" y="169" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26">post_id</text>
  <rect x="836" y="159" width="63" height="20" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text x="868" y="169" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#A96C05">PK · FK</text>
  <rect x="716" y="190" width="190" height="26" rx="6" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.25"/>
  <text class="mono" x="725" y="203" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26">profile_id</text>
  <rect x="836" y="193" width="63" height="20" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text x="868" y="203" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#A96C05">PK · FK</text>
  <path d="M712,220 H910" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="725" y="237" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26">created_at</text>
  <path class="link" d="M269,169 H250"/>
  <path class="ar-indigo" d="M490,203 H480 V169 H471"/>
  <path class="ar-rose" d="M711,169 H692"/>
  <path class="ar-rose" d="M811,254 V316 H369 V256"/>
  <text x="590" y="308" text-anchor="middle" font-size="11.5" font-weight="700" fill="#C2354F">likes.profile_id → profiles.id</text>
  <g transform="translate(48,340)"><rect width="420" height="77" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text class="mono" x="14" y="23" font-size="13.5" font-weight="700" fill="#C2354F" data-fit="392">primary key (post_id, profile_id)</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="392">Una persona, un «me gusta» por post. El segundo insert falla:</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="392">por eso se usa upsert con onConflict.</text></g>
  <g transform="translate(492,340)"><rect width="420" height="77" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#556074" data-fit="392">likes(count) en el select</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="392">Cuenta las filas de likes de cada post sin descargarlas.</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="392">Llega como [{"count": 3}].</text></g>
</svg>
```

La llave primaria de `likes` es la pareja `(post_id, profile_id)`: una persona no puede dar dos veces «me gusta» al mismo post. Si lo intentas con `insert`, falla con `duplicate key value violates unique constraint`. Por eso se usa `upsert`.

## Lo que ya viene

```svg
<svg id="dbMuroCarpetas" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 720" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="dbMuroCarpetas-ttl dbMuroCarpetas-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="dbMuroCarpetas-ttl">La estructura de carpetas</title>
  <desc id="dbMuroCarpetas-dsc">Árbol de carpetas del proyecto 262AppsLab6. Ya vienen hechos auth, login y register del Laboratorio 5, la entidad Post, las pantallas, las Pages y PostCard. Están vacíos y numerados por paso: el contrato PostRepository (1), los casos de uso (2), el data source y la implementación del repositorio (3), los on de FeedBloc (4) y de ComposeBloc (5), y la conexión de las capas en main.dart (6).</desc>
  <defs>
    <style>
      #dbMuroCarpetas .title{fill:#161A26;font-size:22px;font-weight:700}
      #dbMuroCarpetas .sub{fill:#79809A;font-size:13.5px}
      #dbMuroCarpetas .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #dbMuroCarpetas .foot{fill:#79809A;font-size:12px}
      #dbMuroCarpetas .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #dbMuroCarpetas .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #dbMuroCarpetas .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#dbMuroCarpetas-arrow)}
    </style>
    <marker id="dbMuroCarpetas-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="720" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">La estructura de carpetas</text>
  <text class="sub" x="48" y="80" data-fit="860">En gris lo que ya viene hecho. Con número, lo que te toca y en qué paso.</text>
  <rect x="48" y="96" width="864" height="564" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="68" y="111" width="50" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="78" y="124" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="38">lib/</text>
  <path d="M78,137 V158 H89" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="92" y="145" width="88" height="26" rx="4" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="102" y="158" dy="0.35em" font-size="12.5" font-weight="600" fill="#7439B8" data-fit="76">main.dart</text>
  <text x="540" y="158" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">Conecta las capas en /home y /compose</text>
  <circle cx="880" cy="158" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="158" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">6</text>
  <path d="M78,137 V192 H89" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="92" y="179" width="88" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="102" y="192" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="76">features/</text>
  <path d="M102,205 V226 H113" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="116" y="213" width="215" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="126" y="226" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="203">auth/ · login/ · register/</text>
  <text x="540" y="226" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">Ya viene: el Laboratorio 5 resuelto</text>
  <path d="M102,205 V260 H113" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="116" y="247" width="65" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="126" y="260" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="53">posts/</text>
  <text x="540" y="260" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">Todo lo del muro que no es pantalla</text>
  <path d="M126,273 V294 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="281" width="208" height="26" rx="4" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="150" y="294" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="196">domain/entities/post.dart</text>
  <text x="540" y="294" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">Ya viene: el post con su copyWith</text>
  <path d="M126,273 V328 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="315" width="305" height="26" rx="4" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="150" y="328" dy="0.35em" font-size="12.5" font-weight="600" fill="#A96C05" data-fit="293">domain/repository/post_repository.dart</text>
  <text x="540" y="328" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">El contrato · vacío</text>
  <circle cx="880" cy="328" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="328" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">1</text>
  <path d="M126,273 V362 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="349" width="140" height="26" rx="8" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="150" y="362" dy="0.35em" font-size="12.5" font-weight="600" fill="#A96C05" data-fit="128">domain/usecases/</text>
  <text x="540" y="362" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">Uno por acción · vacíos</text>
  <circle cx="880" cy="362" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="362" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">2</text>
  <path d="M126,273 V396 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="383" width="335" height="26" rx="4" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="150" y="396" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="323">data/source/supabase_post_data_source.dart</text>
  <text x="540" y="396" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">Las consultas a Supabase · vacío</text>
  <circle cx="880" cy="396" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="396" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">3</text>
  <path d="M126,273 V430 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="417" width="328" height="26" rx="4" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="150" y="430" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="316">data/repository/post_repository_impl.dart</text>
  <text x="540" y="430" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">Cumple el contrato · vacío</text>
  <circle cx="880" cy="430" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="430" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">3</text>
  <path d="M102,205 V464 H113" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="116" y="451" width="80" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="126" y="464" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="68">home/ui/</text>
  <path d="M126,477 V498 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="485" width="162" height="26" rx="4" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="150" y="498" dy="0.35em" font-size="12.5" font-weight="600" fill="#7439B8" data-fit="150">bloc/feed_bloc.dart</text>
  <text x="540" y="498" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">Eventos y estado listos · on solo imprimen</text>
  <circle cx="880" cy="498" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="498" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">4</text>
  <path d="M126,477 V532 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="519" width="252" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="150" y="532" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="240">screens/ · pages/ · components/</text>
  <text x="540" y="532" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">Ya viene: HomeScreen, las Pages y PostCard</text>
  <path d="M102,205 V566 H113" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="116" y="553" width="102" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="126" y="566" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="90">compose/ui/</text>
  <path d="M126,579 V600 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="587" width="185" height="26" rx="4" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="150" y="600" dy="0.35em" font-size="12.5" font-weight="600" fill="#7439B8" data-fit="173">bloc/compose_bloc.dart</text>
  <text x="540" y="600" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">Eventos y estado listos · on solo imprime</text>
  <circle cx="880" cy="600" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="600" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">5</text>
  <path d="M126,579 V634 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="621" width="222" height="26" rx="4" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="150" y="634" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="210">screens/compose_screen.dart</text>
  <text x="540" y="634" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">Ya viene</text>
  <text class="h" x="892" y="88" text-anchor="end">PASO</text>
  <text class="foot" x="48" y="692" data-fit="860">Los nombres de archivo van en minúscula y con guion bajo, igual que en el Laboratorio 5.</text>
</svg>
```

- **El registro y el inicio de sesión**, resueltos como en el Laboratorio 5. Cerrar sesión pasa por un `SessionBloc`, y `HomeScreen` vuelve a `/login` con un `BlocListener`.
- **La entidad `Post`**, con el autor, el conteo de «me gusta», si te gusta a ti y su `copyWith`.
- **Toda la interfaz del muro.** `HomeScreen`, `FeedPage`, `ProfilePage`, `PostCard` y `ComposeScreen` ya están dibujadas, y cada botón ya lanza su evento.
- **Los estados.** `FeedState` y `ComposeState`, cada uno con su `status` y su `copyWith`.
- **Los eventos ya llegan.** Cada método `on` de `FeedBloc` y `ComposeBloc` solo tiene un `debugPrint` del evento que recibió.

Corre la app, entra con tu cuenta, toca un corazón y pulsa **Publicar**. Los eventos aparecen en la consola, pero la pantalla no cambia:

```text
FeedBloc recibió FeedStarted()
FeedBloc recibió FeedLikeToggled(Post(9b1e…, @ana.dev, likes: 0))
ComposeBloc recibió ComposeSubmitted('Hola muro')
```

La interfaz ya habla con sus `Bloc`, pero ningún `on` emite un estado. Las clases de `posts/domain` y `posts/data` existen, pero no tienen nada adentro ni se conocen entre sí. Ese es tu trabajo, de adentro hacia afuera.

## Paso 1 · El contrato

`posts/domain/repository/post_repository.dart`

Todo lo que el muro necesita pedir, sin decir quién lo cumple:

```dart
abstract class PostRepository {
  Future<List<Post>> fetchFeed({required int page, required int size});
  Future<List<Post>> fetchMine({int limit = 3});
  Future<void> create(String content);
  Future<void> like(String postId);
  Future<void> unlike(String postId);
}
```

## Paso 2 · Los casos de uso

`posts/domain/usecases/`

Uno por acción: `GetFeedUseCase`, `GetMyPostsUseCase`, `PublishPostUseCase` y `ToggleLikeUseCase`. Cada capa crea directamente la que necesita, igual que en `features/auth`: el caso de uso crea su repositorio como un campo. Casi todos solo delegan; los dos que deciden algo son estos:

```dart
class PublishPostUseCase {
  final PostRepository _posts = PostRepositoryImpl();

  Future<void> call(String content) async {
    final text = content.trim();
    if (text.isEmpty) throw Exception('Escribe algo antes de publicar');
    if (text.length > 280) throw Exception('Máximo 280 caracteres');
    await _posts.create(text);
  }
}
```

```dart
class ToggleLikeUseCase {
  final PostRepository _posts = PostRepositoryImpl();

  Future<Post> call(Post post) async {
    // TODO: like o unlike según post.likedByMe, y devolver el post
    // con likedByMe invertido y likeCount ajustado (copyWith)
  }
}
```

La tabla ya rechaza los textos de más de 280 caracteres, pero validarlo aquí da un mensaje claro sin ir hasta Supabase.

## Paso 3 · El data source

`posts/data/source/supabase_post_data_source.dart`

Es el único archivo que habla con Supabase, y el que usa lo de las dos lecciones anteriores. Una sola consulta trae cada post con su autor, cuántos «me gusta» tiene y si uno de ellos es tuyo.

```dart
class SupabasePostDataSource {
  final SupabaseClient _client = Supabase.instance.client;

  static const _columns = 'id, content, created_at, '
      'author:profiles(username, full_name), '
      'likes(count), '
      'my_like:likes(profile_id)';

  String get _uid => _client.auth.currentUser!.id;

  Future<List<Post>> fetchFeed({required int page, required int size}) async {
    final from = page * size;
    final rows = await _client
        .from('posts')
        .select(_columns)
        .eq('my_like.profile_id', _uid)
        .order('created_at', ascending: false)
        .range(from, from + size - 1);
    return rows.map(_toPost).toList();
  }

  Future<List<Post>> fetchMine({int limit = 3}) async {
    // TODO: las mismas columnas, solo los posts con profile_id = _uid,
    // los más recientes primero y como máximo limit
  }

  Future<void> create(String content) async {
    await _client.from('posts').insert({
      'profile_id': _uid,
      'content': content,
    });
  }

  Future<void> like(String postId) async {
    await _client.from('likes').upsert(
      {'post_id': postId, 'profile_id': _uid},
      onConflict: 'post_id,profile_id',
    );
  }

  Future<void> unlike(String postId) async {
    // TODO: delete en likes con dos filtros: post_id y profile_id
  }

  Post _toPost(Map<String, dynamic> row) {
    final author = row['author'] as Map<String, dynamic>;
    return Post(
      id: row['id'] as String,
      content: row['content'] as String,
      createdAt: DateTime.parse(row['created_at'] as String),
      authorUsername: author['username'] as String,
      authorName: author['full_name'] as String,
      likeCount: (row['likes'] as List).first['count'] as int,
      likedByMe: (row['my_like'] as List).isNotEmpty,
    );
  }
}
```

- `likes(count)` llega como `[{"count": 3}]`: una lista con un solo mapa.
- `my_like` es la misma tabla `likes` con otro alias. El filtro `.eq('my_like.profile_id', _uid)` no quita posts: solo deja dentro de `my_like` tu «me gusta», si existe. Lista vacía significa que no te gusta.

`posts/data/repository/post_repository_impl.dart`

`PostRepositoryImpl` crea su data source como un campo, `final SupabasePostDataSource _dataSource = SupabasePostDataSource();`, y cumple el contrato delegando en él.

## Paso 4 · FeedBloc

`home/ui/bloc/feed_bloc.dart`

Los eventos y el estado ya están. Al `Bloc` le faltan sus tres casos de uso, que crea como campos (`final GetFeedUseCase _getFeed = GetFeedUseCase();`), y en cada `on` el `debugPrint` se reemplaza por la lógica que emite estados. `page` es la última página que ya cargaste, y `pageSize` vale 10. La página siguiente se pide así:

```dart
Future<void> _onMoreRequested(
  FeedMoreRequested event,
  Emitter<FeedState> emit,
) async {
  if (!state.hasMore || state.status == FeedStatus.loading) return;
  emit(state.copyWith(status: FeedStatus.loading));
  try {
    final next = await _getFeed(page: state.page + 1, size: pageSize);
    emit(state.copyWith(
      status: FeedStatus.success,
      posts: [...state.posts, ...next],
      page: state.page + 1,
      hasMore: next.length == pageSize,
    ));
  } on Exception catch (e) {
    emit(state.copyWith(status: FeedStatus.failure, errorMessage: '$e'));
  }
}
```

- **`_onStarted`** carga desde cero: la página `0` del muro y tus últimos tres posts. `HomeScreen` lanza `FeedStarted` en su `initState` y otra vez cuando vuelves de publicar.
- **`_onLikeToggled`** llama a `ToggleLikeUseCase` y reemplaza el post viejo por el que devuelve, en `posts` y en `myPosts`.

## Paso 5 · ComposeBloc

`compose/ui/bloc/compose_bloc.dart`

Crea un `PublishPostUseCase` como campo y llena su único `on`: `loading`, y después `success` o `failure` con el mensaje del caso de uso. `ComposeScreen` ya vuelve al muro cuando el estado llega a `success`.

`main.dart` no cambia: como cada capa crea la siguiente, las rutas solo crean `FeedBloc()` y `ComposeBloc()`.

Corre la app de nuevo: el muro se llena, el corazón cambia y **Publicar** vuelve al muro con tu post arriba.

## La prueba

Con dos cuentas, en dos emuladores o una después de la otra:

- Publica desde las dos. En `Table Editor > posts` aparece cada fila con el `profile_id` de quien la escribió.
- El muro muestra los posts de las dos cuentas, del más reciente al más antiguo, con su `@username`.
- Siembra 25 posts con un insert en lote. Con páginas de 10, **Mostrar más** aparece dos veces y después desaparece.
- Da «me gusta» desde las dos cuentas al mismo post: el contador llega a 2. Quita el tuyo y baja a 1. En `likes` nunca hay dos filas iguales.
- El perfil muestra solo tus tres últimos posts.
- Un texto vacío o de más de 280 caracteres no se publica y muestra el mensaje del caso de uso.

## Retos

- **Scroll infinito.** Quita el botón y pide la página siguiente cuando el `ListView` llegue al final, con un `ScrollController`.
- **Borrar.** Un menú en tus propios posts que los borra. El filtro va por `id`, pero comprueba también el `profile_id`.
- **Respuestas.** Una tabla `comments` y una pantalla de detalle que trae el post con sus respuestas anidadas: `select('*, comments(content, author:profiles(username))')`.
- **Buscar.** Un campo en el muro que filtra con `ilike` sobre `content`.
- **Hashtags.** Toca un `#tema` dentro de un post para ver el muro filtrado por `ilike('content', '%#tema%')`.
