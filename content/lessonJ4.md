# Laboratorio 7 · Fotos en el muro

<!-- tags: ChangeAvatarUseCase, createSignedUrlsResult, seed buckets --linked, bucket público y privado,
     avatar_path, image_path, UnimplementedError, PublishPostUseCase con foto,
     Object not found, new row violates row-level security policy, qué va en cada capa -->

El muro del Laboratorio 6 funciona, pero todos aparecen con una letra en vez de una cara, y los posts solo tienen texto. Este laboratorio tiene dos partes:

- **Parte 1 · Foto de perfil.** Cada persona sube su foto desde la galería o la cámara. La foto aparece en su perfil y junto a cada post suyo.
- **Parte 2 · Posts con imagen (avanzada).** El composer deja adjuntar una foto al post.

Las fotos de perfil van en un **bucket público**: cada una tiene una URL fija que cualquiera puede abrir. Las de los posts van en un **bucket privado**: solo quien inició sesión las ve, con URLs firmadas.

## Lo que vas a construir

```svg
<svg id="stLabPantallas" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 600" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="stLabPantallas-ttl stLabPantallas-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="stLabPantallas-ttl">Lo que vas a construir</title>
  <desc id="stLabPantallas-dsc">Tres teléfonos. El primero es ProfilePage con la foto de Ana, un botón de cámara sobre la foto y sus últimos posts. El segundo es la misma pantalla con una hoja abierta abajo: Elegir de la galería y Tomar una foto. El tercero es FeedPage: cada post muestra la foto de su autor, y quien no tiene foto muestra su inicial.</desc>
  <defs>
    <style>
      #stLabPantallas .title{fill:#161A26;font-size:22px;font-weight:700}
      #stLabPantallas .sub{fill:#79809A;font-size:13.5px}
      #stLabPantallas .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #stLabPantallas .foot{fill:#79809A;font-size:12px}
      #stLabPantallas .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #stLabPantallas .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #stLabPantallas .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#stLabPantallas-arrow)}
      #stLabPantallas .ar-violet{fill:none;stroke:#7439B8;stroke-width:1.75;marker-end:url(#stLabPantallas-ar-violet)}
    </style>
    <marker id="stLabPantallas-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="stLabPantallas-ar-violet" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#7439B8"/></marker>
  </defs>
  <rect width="960" height="600" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Lo que vas a construir</text>
  <text class="sub" x="48" y="80" data-fit="860">La cámara del perfil abre una hoja con dos opciones. La foto nueva aparece en el perfil y en cada post tuyo.</text>
  <text class="mono" x="164" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#7439B8">HomeScreen <tspan fill="#0F8478">· ProfilePage</tspan></text>
  <text class="mono" x="480" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#7439B8">HomeScreen <tspan fill="#0F8478">· hoja de la cámara</tspan></text>
  <text class="mono" x="796" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#7439B8">HomeScreen <tspan fill="#0F8478">· FeedPage</tspan></text>
  <rect x="48" y="132" width="232" height="420" rx="18" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/><text x="64" y="156" dy="0.35em" font-size="14" font-weight="600" fill="#161A26">Perfil</text><path d="M50,174 H278" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="124.0" y="190" width="80" height="80" rx="14" fill="#FFE3CC" stroke="#C2571A" stroke-width="1.5"/>
  <circle cx="164.0" cy="222.0" r="13.6" fill="#C2571A"/>
  <path d="M140.0,258.8 C143.2,238.0 184.8,238.0 188.0,258.8 Z" fill="#C2571A"/>
  <text x="200.0" y="202" text-anchor="end" font-size="16" font-weight="700" fill="#C2571A">2</text>
  <circle cx="198" cy="262" r="15" fill="#1F9D68"/>
  <path transform="translate(190,255)" d="M0,3 H4 L6,0 H10 L12,3 H16 V14 H0 Z" fill="none" stroke="#FFFFFF" stroke-width="1.5"/><circle cx="198" cy="263" r="3.2" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>
  <text x="164" y="296" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#161A26">Ana Gómez</text>
  <text x="164" y="314" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#79809A">@ana.dev</text>
  <rect x="64" y="336" width="200" height="58" rx="8" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <rect x="72" y="345" width="28" height="28" rx="5" fill="#FFE3CC" stroke="#C2571A" stroke-width="1.5"/>
  <circle cx="86.0" cy="356.2" r="4.8" fill="#C2571A"/>
  <path d="M77.6,369.1 C78.7,361.8 93.3,361.8 94.4,369.1 Z" fill="#C2571A"/>
  <text x="96.0" y="357" text-anchor="end" font-size="10" font-weight="700" fill="#C2571A">2</text>
  <text x="108" y="354" dy="0.35em" font-size="11" font-weight="700" fill="#161A26" data-fit="148">@ana.dev</text>
  <text x="108" y="374" dy="0.35em" font-size="11" fill="#454C61" data-fit="148">Mi primer post</text>
  <rect x="64" y="402" width="200" height="58" rx="8" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <rect x="72" y="411" width="28" height="28" rx="5" fill="#FFE3CC" stroke="#C2571A" stroke-width="1.5"/>
  <circle cx="86.0" cy="422.2" r="4.8" fill="#C2571A"/>
  <path d="M77.6,435.1 C78.7,427.8 93.3,427.8 94.4,435.1 Z" fill="#C2571A"/>
  <text x="96.0" y="423" text-anchor="end" font-size="10" font-weight="700" fill="#C2571A">2</text>
  <text x="108" y="420" dy="0.35em" font-size="11" font-weight="700" fill="#161A26" data-fit="148">@ana.dev</text>
  <text x="108" y="440" dy="0.35em" font-size="11" fill="#454C61" data-fit="148">Hoy vimos Storage</text>
  <rect x="364" y="132" width="232" height="420" rx="18" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/><text x="380" y="156" dy="0.35em" font-size="14" font-weight="600" fill="#161A26">Perfil</text><path d="M366,174 H594" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="440.0" y="190" width="80" height="80" rx="14" fill="#FFE3CC" stroke="#C2571A" stroke-width="1.5"/>
  <circle cx="480.0" cy="222.0" r="13.6" fill="#C2571A"/>
  <path d="M456.0,258.8 C459.2,238.0 500.8,238.0 504.0,258.8 Z" fill="#C2571A"/>
  <text x="516.0" y="202" text-anchor="end" font-size="16" font-weight="700" fill="#C2571A">2</text>
  <circle cx="514" cy="262" r="15" fill="#1F9D68"/>
  <path transform="translate(506,255)" d="M0,3 H4 L6,0 H10 L12,3 H16 V14 H0 Z" fill="none" stroke="#FFFFFF" stroke-width="1.5"/><circle cx="514" cy="263" r="3.2" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>
  <text x="480" y="296" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#161A26">Ana Gómez</text>
  <text x="480" y="314" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#79809A">@ana.dev</text>
  <rect x="380" y="336" width="200" height="58" rx="8" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <rect x="388" y="345" width="28" height="28" rx="5" fill="#FFE3CC" stroke="#C2571A" stroke-width="1.5"/>
  <circle cx="402.0" cy="356.2" r="4.8" fill="#C2571A"/>
  <path d="M393.6,369.1 C394.7,361.8 409.3,361.8 410.4,369.1 Z" fill="#C2571A"/>
  <text x="412.0" y="357" text-anchor="end" font-size="10" font-weight="700" fill="#C2571A">2</text>
  <text x="424" y="354" dy="0.35em" font-size="11" font-weight="700" fill="#161A26" data-fit="148">@ana.dev</text>
  <text x="424" y="374" dy="0.35em" font-size="11" fill="#454C61" data-fit="148">Mi primer post</text>
  <rect x="380" y="402" width="200" height="58" rx="8" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <rect x="388" y="411" width="28" height="28" rx="5" fill="#FFE3CC" stroke="#C2571A" stroke-width="1.5"/>
  <circle cx="402.0" cy="422.2" r="4.8" fill="#C2571A"/>
  <path d="M393.6,435.1 C394.7,427.8 409.3,427.8 410.4,435.1 Z" fill="#C2571A"/>
  <text x="412.0" y="423" text-anchor="end" font-size="10" font-weight="700" fill="#C2571A">2</text>
  <text x="424" y="420" dy="0.35em" font-size="11" font-weight="700" fill="#161A26" data-fit="148">@ana.dev</text>
  <text x="424" y="440" dy="0.35em" font-size="11" fill="#454C61" data-fit="148">Hoy vimos Storage</text>
  <rect x="367" y="174" width="226" height="375" rx="0" fill="#161A26" fill-opacity=".35"/>
  <path d="M367,424 H593 V534 A15,15 0 0 1 578,549 H382 A15,15 0 0 1 367,534 Z" fill="#FFFFFF"/>
  <rect x="384" y="444" width="16" height="16" rx="3" fill="none" stroke="#454C61" stroke-width="1.5"/>
  <text x="412" y="452" dy="0.35em" font-size="13" fill="#161A26">Elegir de la galería</text>
  <rect x="384" y="488" width="16" height="16" rx="3" fill="none" stroke="#454C61" stroke-width="1.5"/>
  <text x="412" y="496" dy="0.35em" font-size="13" fill="#161A26">Tomar una foto</text>
  <rect x="680" y="132" width="232" height="420" rx="18" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/><text x="696" y="156" dy="0.35em" font-size="14" font-weight="600" fill="#161A26">Muro</text><path d="M682,174 H910" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="696" y="190" width="200" height="58" rx="8" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <rect x="704" y="199" width="28" height="28" rx="5" fill="#FFE3CC" stroke="#C2571A" stroke-width="1.5"/>
  <circle cx="718.0" cy="210.2" r="4.8" fill="#C2571A"/>
  <path d="M709.6,223.1 C710.7,215.8 725.3,215.8 726.4,223.1 Z" fill="#C2571A"/>
  <text x="728.0" y="211" text-anchor="end" font-size="10" font-weight="700" fill="#C2571A">2</text>
  <text x="740" y="208" dy="0.35em" font-size="11" font-weight="700" fill="#161A26" data-fit="148">@ana.dev</text>
  <text x="740" y="228" dy="0.35em" font-size="11" fill="#454C61" data-fit="148">Hoy vimos Storage</text>
  <rect x="696" y="258" width="200" height="58" rx="8" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <rect x="704" y="267" width="28" height="28" rx="5" fill="#DCE7FF" stroke="#4453C9" stroke-width="1.5"/>
  <circle cx="718.0" cy="278.2" r="4.8" fill="#4453C9"/>
  <path d="M709.6,291.1 C710.7,283.8 725.3,283.8 726.4,291.1 Z" fill="#4453C9"/>
  <text x="728.0" y="279" text-anchor="end" font-size="10" font-weight="700" fill="#4453C9">1</text>
  <text x="740" y="276" dy="0.35em" font-size="11" font-weight="700" fill="#161A26" data-fit="148">@juanpa</text>
  <text x="740" y="296" dy="0.35em" font-size="11" fill="#454C61" data-fit="148">Mi foto nueva!</text>
  <rect x="696" y="326" width="200" height="58" rx="8" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <circle cx="718" cy="349" r="14" fill="#3ECF8E"/><text x="718" y="349" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">L</text>
  <text x="740" y="344" dy="0.35em" font-size="11" font-weight="700" fill="#161A26" data-fit="148">@lu.mora</text>
  <text x="740" y="364" dy="0.35em" font-size="11" fill="#454C61" data-fit="148">Aún sin foto</text>
  <rect x="696" y="394" width="200" height="58" rx="8" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <rect x="704" y="403" width="28" height="28" rx="5" fill="#FFE3CC" stroke="#C2571A" stroke-width="1.5"/>
  <circle cx="718.0" cy="414.2" r="4.8" fill="#C2571A"/>
  <path d="M709.6,427.1 C710.7,419.8 725.3,419.8 726.4,427.1 Z" fill="#C2571A"/>
  <text x="728.0" y="415" text-anchor="end" font-size="10" font-weight="700" fill="#C2571A">2</text>
  <text x="740" y="412" dy="0.35em" font-size="11" font-weight="700" fill="#161A26" data-fit="148">@ana.dev</text>
  <text x="740" y="432" dy="0.35em" font-size="11" fill="#454C61" data-fit="148">Mi primer post</text>
  <path class="ar-violet" d="M214,262 C320,262 334,452 378,452"/>
  <text class="foot" x="48" y="572" data-fit="860">Mientras sube, la foto del perfil muestra un indicador de carga. Si algo falla, un SnackBar dice por qué.</text>
</svg>
```

## Preparación

El punto de partida es este proyecto: [github.com/Domiciano/Apps262Lab7](https://github.com/Domiciano/Apps262Lab7). Es el Laboratorio 6 resuelto, más toda la interfaz de las fotos.

```shell
git clone https://github.com/Domiciano/Apps262Lab7
cd Apps262Lab7
flutter pub get
```

Pon en `lib/main.dart` la `Project URL` y la `publishable key` de tu proyecto de Supabase. Después copia en la raíz la carpeta `supabase/` de tu Laboratorio 6, que ya trae tu `link`, tu `config.toml` y las migraciones de `profiles`, `posts` y `likes`.

## Lo que ya viene

```svg
<svg id="stLabCarpetas" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 856" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="stLabCarpetas-ttl stLabCarpetas-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="stLabCarpetas-ttl">La estructura de carpetas</title>
  <desc id="stLabCarpetas-dsc">Árbol de carpetas del proyecto Apps262Lab7. Ya vienen los componentes Avatar y PhotoSourceSheet, las entidades, los contratos y toda la interfaz. Marcados con 1, los archivos de la parte 1: ChangeAvatarUseCase, los dos data sources de la foto, AvatarRepositoryImpl, el data source de perfiles, el de posts y FeedBloc. Marcados con 2, los de la parte 2: PickPostImageUseCase, PublishPostUseCase, el data source de imágenes de posts, PostRepositoryImpl, el data source de posts y ComposeBloc.</desc>
  <defs>
    <style>
      #stLabCarpetas .title{fill:#161A26;font-size:22px;font-weight:700}
      #stLabCarpetas .sub{fill:#79809A;font-size:13.5px}
      #stLabCarpetas .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #stLabCarpetas .foot{fill:#79809A;font-size:12px}
      #stLabCarpetas .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #stLabCarpetas .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #stLabCarpetas .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#stLabCarpetas-arrow)}
    </style>
    <marker id="stLabCarpetas-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="856" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">La estructura de carpetas</text>
  <text class="sub" x="48" y="80" data-fit="860">En gris lo que ya viene hecho. Con número, la parte del laboratorio en la que lo completas.</text>
  <rect x="48" y="96" width="864" height="700" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="68" y="111" width="50" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="78" y="124" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="36">lib/</text>
  <path d="M78,137 V158 H89" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="92" y="145" width="102" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="102" y="158" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="88">components/</text>
  <text x="568" y="158" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">Ya viene: Avatar y PhotoSourceSheet</text>
  <path d="M78,137 V192 H89" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="92" y="179" width="88" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="102" y="192" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="74">features/</text>
  <path d="M102,205 V226 H113" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="116" y="213" width="125" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="126" y="226" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="111">avatar/domain/</text>
  <text x="568" y="226" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">Ya viene: entidades y AvatarRepository</text>
  <path d="M126,239 V260 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="247" width="282" height="26" rx="4" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="150" y="260" dy="0.35em" font-size="12.5" font-weight="600" fill="#A96C05" data-fit="268">usecases/change_avatar_usecase.dart</text>
  <text x="568" y="260" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">call · vacío</text>
  <circle cx="886" cy="260" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="886" y="260" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">1</text>
  <path d="M102,205 V294 H113" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="116" y="281" width="110" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="126" y="294" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="96">avatar/data/</text>
  <path d="M126,307 V328 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="315" width="290" height="26" rx="4" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="150" y="328" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="276">source/device_photo_data_source.dart</text>
  <text x="568" y="328" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">pick · vacío</text>
  <circle cx="886" cy="328" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="886" y="328" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">1</text>
  <path d="M126,307 V362 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="349" width="312" height="26" rx="4" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="150" y="362" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="298">source/supabase_avatar_data_source.dart</text>
  <text x="568" y="362" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">upload y remove · vacíos</text>
  <circle cx="886" cy="362" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="886" y="362" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">1</text>
  <path d="M126,307 V396 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="383" width="305" height="26" rx="4" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="150" y="396" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="291">repository/avatar_repository_impl.dart</text>
  <text x="568" y="396" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">los tres · vacíos</text>
  <circle cx="886" cy="396" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="886" y="396" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">1</text>
  <path d="M102,205 V430 H113" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="116" y="417" width="95" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="126" y="430" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="81">auth/data/</text>
  <text x="568" y="430" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">Ya viene: el Laboratorio 5</text>
  <path d="M126,443 V464 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="451" width="320" height="26" rx="4" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="150" y="464" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="306">source/supabase_profile_data_source.dart</text>
  <text x="568" y="464" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">updateAvatarPath vacío · URL pública</text>
  <circle cx="886" cy="464" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="886" y="464" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">1</text>
  <path d="M102,205 V498 H113" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="116" y="485" width="185" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="126" y="498" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="171">posts/domain/usecases/</text>
  <path d="M126,511 V532 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="519" width="230" height="26" rx="4" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="150" y="532" dy="0.35em" font-size="12.5" font-weight="600" fill="#A96C05" data-fit="216">pick_post_image_usecase.dart</text>
  <text x="568" y="532" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">call · vacío</text>
  <circle cx="886" cy="532" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="886" y="532" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">2</text>
  <path d="M126,511 V566 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="553" width="208" height="26" rx="4" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="150" y="566" dy="0.35em" font-size="12.5" font-weight="600" fill="#A96C05" data-fit="194">publish_post_usecase.dart</text>
  <text x="568" y="566" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">Del Lab 6 · subir la foto</text>
  <circle cx="886" cy="566" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="886" y="566" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">2</text>
  <path d="M102,205 V600 H113" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="116" y="587" width="102" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="126" y="600" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="88">posts/data/</text>
  <path d="M126,613 V634 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="621" width="298" height="26" rx="4" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="150" y="634" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="284">source/supabase_post_data_source.dart</text>
  <text x="568" y="634" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">avatar_path · image_path firmado</text>
  <rect x="846" y="623" width="52" height="22" rx="11" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/><text x="872" y="634" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#A96C05">1 · 2</text>
  <path d="M126,613 V668 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="655" width="342" height="26" rx="4" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="150" y="668" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="328">source/supabase_post_image_data_source.dart</text>
  <text x="568" y="668" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">upload · vacío</text>
  <circle cx="886" cy="668" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="886" y="668" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">2</text>
  <path d="M126,613 V702 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="689" width="290" height="26" rx="4" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="150" y="702" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="276">repository/post_repository_impl.dart</text>
  <text x="568" y="702" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">pickImage y uploadImage · vacíos</text>
  <circle cx="886" cy="702" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="886" y="702" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">2</text>
  <path d="M102,205 V736 H113" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="116" y="723" width="222" height="26" rx="4" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="126" y="736" dy="0.35em" font-size="12.5" font-weight="600" fill="#7439B8" data-fit="208">home/ui/bloc/feed_bloc.dart</text>
  <text x="568" y="736" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">el on de la foto solo imprime</text>
  <circle cx="886" cy="736" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="886" y="736" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">1</text>
  <path d="M102,205 V770 H113" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="116" y="757" width="268" height="26" rx="4" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="126" y="770" dy="0.35em" font-size="12.5" font-weight="600" fill="#7439B8" data-fit="254">compose/ui/bloc/compose_bloc.dart</text>
  <text x="568" y="770" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">los on de la foto solo imprimen</text>
  <circle cx="886" cy="770" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="886" y="770" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">2</text>
  <text class="h" x="898" y="88" text-anchor="end">PARTE</text>
  <text class="foot" x="48" y="828" data-fit="860">main.dart no cambia: cada Bloc crea sus casos de uso, y cada capa crea la siguiente.</text>
</svg>
```

- **La interfaz completa.** `Avatar` pinta la foto, o la inicial si no hay. `PhotoSourceSheet` es la hoja con *Elegir de la galería* y *Tomar una foto*. `ProfilePage` tiene el botón de cámara, `ComposeScreen` la vista previa con *Quitar foto* y `PostCard` la imagen del post.
- **Las entidades y los contratos.** `PhotoSource`, `PickedPhoto`, `Profile` con `avatarPath` y `avatarUrl`, `Post` con `authorAvatarUrl` e `imageUrl`. `AvatarRepository`, `ProfileRepository` y `PostRepository` ya declaran todo lo que el laboratorio necesita.
- **Los eventos y los estados.** `AvatarChangeRequested`, `ComposePhotoRequested`, `ComposePhotoRemoved`, `FeedState.avatarStatus` y `ComposeState.photo`.
- **Los métodos vacíos.** Cada método nuevo de cada capa ya existe con su firma, pero su cuerpo es `throw UnimplementedError()`. Los `on` nuevos de los Bloc solo imprimen el evento.

Corre la app, toca la cámara del perfil y elige una opción. En la consola aparece:

```text
FeedBloc recibió AvatarChangeRequested(gallery)
```

Tu trabajo es reemplazar cada `throw UnimplementedError()` por su código, de afuera hacia adentro.

## Parte 1 · Foto de perfil

Del paso 1 al 9. Al terminar, cada persona tiene su foto en el perfil y en sus posts.

## Paso 1 · El bucket avatars

```svg
<svg id="stLabModelo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 432" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="stLabModelo-ttl stLabModelo-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="stLabModelo-ttl">Lo que agrega la parte 1</title>
  <desc id="stLabModelo-dsc">A la izquierda, la tabla profiles con su nueva columna avatar_path, que puede ser nula. A la derecha, el bucket avatars declarado en config.toml: público, con un límite de 2 MB por archivo y solo imágenes JPEG, PNG o WebP; lo crea npx supabase seed buckets --linked. Debajo, una sola política para usuarios con sesión, sobre todo el bucket.</desc>
  <defs>
    <style>
      #stLabModelo .title{fill:#161A26;font-size:22px;font-weight:700}
      #stLabModelo .sub{fill:#79809A;font-size:13.5px}
      #stLabModelo .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #stLabModelo .foot{fill:#79809A;font-size:12px}
      #stLabModelo .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #stLabModelo .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #stLabModelo .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#stLabModelo-arrow)}
      #stLabModelo .ar-amber{fill:none;stroke:#A96C05;stroke-width:1.75;marker-end:url(#stLabModelo-ar-amber)}
    </style>
    <marker id="stLabModelo-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="stLabModelo-ar-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#A96C05"/></marker>
  </defs>
  <rect width="960" height="432" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Lo que agrega la parte 1</text>
  <text class="sub" x="48" y="80" data-fit="860">Un bucket público, declarado en config.toml. La columna y la regla van en una migración.</text>
  <rect x="48" y="112" width="360" height="176" rx="12" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="2"/>
  <path d="M48,152 V124 A12,12 0 0 1 60,112 H396 A12,12 0 0 1 408,124 V152 Z" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="2"/>
  <text class="mono" x="62" y="132" dy="0.35em" font-size="14" font-weight="700" fill="#4453C9">profiles</text>
  <text class="mono" x="62" y="169" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26">id</text>
  <rect x="333" y="159" width="63" height="20" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text x="364" y="169" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#A96C05">PK · FK</text>
  <path d="M49,186 H407" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="62" y="203" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26">username</text>
  <path d="M49,220 H407" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="62" y="237" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26">full_name</text>
  <rect x="53" y="258" width="350" height="26" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text class="mono" x="62" y="271" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26">avatar_path</text>
  <text class="mono" x="172" y="271" dy="0.35em" font-size="12" fill="#A96C05" data-fit="224">text · puede ser null</text>
  <rect x="456" y="112" width="456" height="168" rx="12" fill="#FFFFFF" stroke="#86D3CA" stroke-width="2"/>
  <path d="M456,152 V124 A12,12 0 0 1 468,112 H900 A12,12 0 0 1 912,124 V152 Z" fill="#E3F6F3" stroke="#86D3CA" stroke-width="2"/>
  <text x="472" y="132" dy="0.35em" font-size="14.5" font-weight="700" fill="#0F8478" data-fit="424">bucket avatars</text>
  <text class="mono" x="896" y="132" dy="0.35em" text-anchor="end" font-size="11.5" fill="#454C61">config.toml</text>
  <rect x="472" y="165" width="132" height="22" rx="11" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/><text x="538" y="176" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0F8478">público</text>
  <text x="620" y="176" dy="0.35em" font-size="12.5" fill="#454C61">cualquiera lee por URL</text>
  <rect x="472" y="197" width="132" height="22" rx="11" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/><text x="538" y="208" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0F8478">2 MiB</text>
  <text x="620" y="208" dy="0.35em" font-size="12.5" fill="#454C61">tamaño máximo por archivo</text>
  <rect x="472" y="229" width="132" height="22" rx="11" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/><text x="538" y="240" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0F8478">jpeg · png · webp</text>
  <text x="620" y="240" dy="0.35em" font-size="12.5" fill="#454C61">los únicos tipos que acepta</text>
  <path class="ar-amber" d="M408,271 H432 V196 H454"/>
  <text class="h" x="456" y="314">LA MIGRACIÓN · UNA SOLA POLÍTICA</text>
  <rect x="456" y="328" width="456" height="40" rx="8" fill="#1F2430"/>
  <text class="mono" x="470" y="348" dy="0.35em" font-size="12.5" fill="#C9CFDA" data-fit="428">for all to authenticated · bucket_id = 'avatars'</text>
  <g transform="translate(48,310)"><rect width="360" height="77" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="332">avatar_path empieza en null</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="332">Quien no ha subido foto no tiene path:</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="332">la app muestra la inicial del nombre.</text></g>
  <text class="foot" x="48" y="404" data-fit="860">La parte 2 repite lo mismo con un bucket privado, post-images, y una columna image_path en posts.</text>
</svg>
```

Al final de `supabase/config.toml`:

```toml
[storage]
enabled = true

[storage.buckets.avatars]
public = true
file_size_limit = "2MiB"
allowed_mime_types = ["image/jpeg", "image/png", "image/webp"]
```

Créalo en tu proyecto:

```shell
npx supabase seed buckets --linked
```

En el dashboard, `Storage` muestra `avatars` con la etiqueta *Public*.

## Paso 2 · La columna y la regla

```shell
npx supabase migration new create_avatars
```

```sql
alter table public.profiles add column avatar_path text;

create policy "avatars: usuarios autenticados"
on storage.objects for all to authenticated
using (bucket_id = 'avatars')
with check (bucket_id = 'avatars');
```

```shell
npx supabase db push
```

Que el bucket sea público solo abre la lectura por URL. Subir y borrar necesitan política, y basta una: abre todo a quien inició sesión.

## Paso 3 · Elegir la foto

`avatar/data/source/device_photo_data_source.dart` es el único archivo que importa `image_picker`. Traduce `PhotoSource` a `ImageSource`, y `XFile` a `PickedPhoto`:

```dart
final ImagePicker _picker = ImagePicker();

Future<PickedPhoto?> pick(PhotoSource source) async {
  final file = await _picker.pickImage(
    source: source == PhotoSource.camera
        ? ImageSource.camera
        : ImageSource.gallery,
    maxWidth: 512,
    maxHeight: 512,
    imageQuality: 80,
  );
  if (file == null) return null;
  return PickedPhoto(
    bytes: await file.readAsBytes(),
    extension: file.name.split('.').last.toLowerCase(),
  );
}
```

## Paso 4 · Subir y borrar en Storage

`avatar/data/source/supabase_avatar_data_source.dart` es el único archivo que usa el bucket `avatars`. Agrega los campos y completa `upload`:

```dart
final SupabaseClient _client = Supabase.instance.client;
final Uuid _uuid = const Uuid();

String get _uid {
  return _client.auth.currentUser!.id;
}

Future<String> upload(PickedPhoto photo) async {
  final path = '$_uid/${_uuid.v4()}.${photo.extension}';
  final type = photo.extension == 'jpg' ? 'jpeg' : photo.extension;
  try {
    await _client.storage.from(bucket).uploadBinary(
      path,
      photo.bytes,
      fileOptions: FileOptions(
        contentType: 'image/$type',
        cacheControl: '31536000',
      ),
    );
    return path;
  } on StorageException catch (e) {
    throw Exception(e.message);
  }
}
```

`remove` es más corto: `_client.storage.from(bucket).remove([path])` dentro del mismo `try`. El nombre es un UUID nuevo en cada subida, así la foto nueva nunca se confunde con la vieja en ninguna caché.

## Paso 5 · El repositorio

`avatar/data/repository/avatar_repository_impl.dart` crea los dos data sources como campos y delega en ellos:

```dart
final DevicePhotoDataSource _device = DevicePhotoDataSource();
final SupabaseAvatarDataSource _storage = SupabaseAvatarDataSource();
```

`pick` va a `_device`. `upload` y `remove` van a `_storage`. Cada método queda de una línea, con `return`.

## Paso 6 · El caso de uso

```svg
<svg id="stLabCaso" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 520" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="stLabCaso-ttl stLabCaso-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="stLabCaso-ttl">Lo que hace ChangeAvatarUseCase</title>
  <desc id="stLabCaso-dsc">Una lista numerada con el repositorio de cada llamada. 1, AvatarRepository.pick: si devuelve null, termina. 2, ProfileRepository.getProfile para recordar el path anterior. 3, AvatarRepository.upload sube los bytes con un nombre nuevo y devuelve el path. 4, ProfileRepository.updateAvatarPath guarda ese path. 5, AvatarRepository.remove borra el archivo anterior, si había. 6, ProfileRepository.getProfile devuelve el perfil con la URL nueva.</desc>
  <defs>
    <style>
      #stLabCaso .title{fill:#161A26;font-size:22px;font-weight:700}
      #stLabCaso .sub{fill:#79809A;font-size:13.5px}
      #stLabCaso .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #stLabCaso .foot{fill:#79809A;font-size:12px}
      #stLabCaso .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #stLabCaso .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #stLabCaso .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#stLabCaso-arrow)}
    </style>
    <marker id="stLabCaso-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="520" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Lo que hace ChangeAvatarUseCase</text>
  <text class="sub" x="48" y="80" data-fit="860">Seis llamadas a dos repositorios. Si la persona cancela, termina en la primera.</text>
<circle cx="64" cy="132" r="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="64" y="132" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">1</text>
  <rect x="88" y="112" width="216" height="40" rx="8" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <text class="mono" x="100" y="132" dy="0.35em" font-size="12.5" font-weight="700" fill="#0F8478">AvatarRepository</text>
  <rect x="316" y="112" width="260" height="40" rx="8" fill="#1F2430"/>
  <text class="mono" x="330" y="132" dy="0.35em" font-size="12.5" fill="#C9CFDA" data-fit="232">pick(source)</text>
  <text x="592" y="132" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">null si la persona cancela: no sigue</text>
<circle cx="64" cy="188" r="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="64" y="188" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9">2</text>
  <rect x="88" y="168" width="216" height="40" rx="8" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/>
  <text class="mono" x="100" y="188" dy="0.35em" font-size="12.5" font-weight="700" fill="#4453C9">ProfileRepository</text>
  <rect x="316" y="168" width="260" height="40" rx="8" fill="#1F2430"/>
  <text class="mono" x="330" y="188" dy="0.35em" font-size="12.5" fill="#C9CFDA" data-fit="232">getProfile(id)</text>
  <text x="592" y="188" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">recuerda el avatarPath anterior</text>
<circle cx="64" cy="244" r="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="64" y="244" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">3</text>
  <rect x="88" y="224" width="216" height="40" rx="8" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <text class="mono" x="100" y="244" dy="0.35em" font-size="12.5" font-weight="700" fill="#0F8478">AvatarRepository</text>
  <rect x="316" y="224" width="260" height="40" rx="8" fill="#1F2430"/>
  <text class="mono" x="330" y="244" dy="0.35em" font-size="12.5" fill="#C9CFDA" data-fit="232">upload(photo)</text>
  <text x="592" y="244" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">nombre nuevo · devuelve el path</text>
<circle cx="64" cy="300" r="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="64" y="300" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9">4</text>
  <rect x="88" y="280" width="216" height="40" rx="8" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/>
  <text class="mono" x="100" y="300" dy="0.35em" font-size="12.5" font-weight="700" fill="#4453C9">ProfileRepository</text>
  <rect x="316" y="280" width="260" height="40" rx="8" fill="#1F2430"/>
  <text class="mono" x="330" y="300" dy="0.35em" font-size="12.5" fill="#C9CFDA" data-fit="232">updateAvatarPath(id, path)</text>
  <text x="592" y="300" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">el perfil apunta a la foto nueva</text>
<circle cx="64" cy="356" r="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="64" y="356" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">5</text>
  <rect x="88" y="336" width="216" height="40" rx="8" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <text class="mono" x="100" y="356" dy="0.35em" font-size="12.5" font-weight="700" fill="#0F8478">AvatarRepository</text>
  <rect x="316" y="336" width="260" height="40" rx="8" fill="#1F2430"/>
  <text class="mono" x="330" y="356" dy="0.35em" font-size="12.5" fill="#C9CFDA" data-fit="232">remove(oldPath)</text>
  <text x="592" y="356" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">solo si había una foto antes</text>
<circle cx="64" cy="412" r="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="64" y="412" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9">6</text>
  <rect x="88" y="392" width="216" height="40" rx="8" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/>
  <text class="mono" x="100" y="412" dy="0.35em" font-size="12.5" font-weight="700" fill="#4453C9">ProfileRepository</text>
  <rect x="316" y="392" width="260" height="40" rx="8" fill="#1F2430"/>
  <text class="mono" x="330" y="412" dy="0.35em" font-size="12.5" fill="#C9CFDA" data-fit="232">getProfile(id)</text>
  <text x="592" y="412" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">el perfil con su avatarUrl nueva</text>
  <g transform="translate(48,456)"><rect width="864" height="60" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="836">Antes de subir, una regla del dominio</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="836">Si la foto pesa más de 2 MB, el caso de uso lanza su propio mensaje sin ir hasta Storage.</text></g>
</svg>
```

`avatar/domain/usecases/change_avatar_usecase.dart`:

```dart
static const maxBytes = 2 * 1024 * 1024;
final AuthRepository _auth = AuthRepositoryImpl();
final ProfileRepository _profiles = ProfileRepositoryImpl();
final AvatarRepository _avatars = AvatarRepositoryImpl();

Future<Profile?> call(PhotoSource source) async {
  final user = _auth.currentUser();
  if (user == null) throw Exception('No hay una sesión iniciada');
  final photo = await _avatars.pick(source);
  if (photo == null) return null;
  if (photo.bytes.length > maxBytes) {
    throw Exception('La foto pesa más de 2 MB');
  }
  final before = await _profiles.getProfile(user.id);
  final path = await _avatars.upload(photo);
  await _profiles.updateAvatarPath(user.id, path);
  final oldPath = before.avatarPath;
  if (oldPath != null) await _avatars.remove(oldPath);
  return _profiles.getProfile(user.id);
}
```

El orden importa: primero sube, después apunta y al final borra. Si algo falla a mitad, sobra un archivo, pero el perfil nunca apunta a una foto que no existe.

## Paso 7 · El perfil

En `auth/data/source/supabase_profile_data_source.dart`, completa `updateAvatarPath`:

```dart
Future<void> updateAvatarPath(String id, String path) async {
  try {
    await _client
        .from('profiles')
        .update({'avatar_path': path})
        .eq('id', id);
  } on PostgrestException catch (e) {
    throw Exception(e.message);
  }
}
```

En `getProfile`, lee `avatar_path` y arma su URL pública. Agrega estos dos campos al `Profile` que ya devuelve:

```dart
final path = row['avatar_path'] as String?;
```

```dart
avatarPath: path,
avatarUrl: path == null
    ? null
    : _client.storage.from('avatars').getPublicUrl(path),
```

En `auth/data/repository/profile_repository_impl.dart`, `updateAvatarPath` delega en el data source.

## Paso 8 · Las fotos del muro

En `posts/data/source/supabase_post_data_source.dart`, pide `avatar_path` en las columnas del autor:

```dart
'author:profiles!profile_id(username, full_name, avatar_path), '
```

Y en `_toPost`, arma su URL igual que en el perfil:

```dart
final avatarPath = author['avatar_path'] as String?;
```

```dart
authorAvatarUrl: avatarPath == null
    ? null
    : _client.storage.from('avatars').getPublicUrl(avatarPath),
```

`getPublicUrl` no va a la red: solo arma el texto de la URL. Por eso alcanza para todos los posts de la página sin hacer más peticiones. Si el autor no tiene foto, queda `null` y `Avatar` muestra la inicial.

## Paso 9 · FeedBloc

En `home/ui/bloc/feed_bloc.dart`, crea el caso de uso como campo, `final ChangeAvatarUseCase _changeAvatar = ChangeAvatarUseCase();`, y reemplaza el `debugPrint`:

```dart
emit(state.copyWith(avatarStatus: AvatarStatus.uploading));
try {
  final profile = await _changeAvatar(event.source);
  if (profile == null) {
    emit(state.copyWith(avatarStatus: AvatarStatus.idle));
    return;
  }
  emit(state.copyWith(profile: profile, avatarStatus: AvatarStatus.idle));
  add(FeedStarted());
} on Exception catch (e) {
  emit(state.copyWith(
    avatarStatus: AvatarStatus.failure,
    errorMessage: _message(e),
  ));
}
```

`add(FeedStarted())` recarga el muro para que tus posts muestren la foto nueva.

## La prueba de la parte 1

- Sube una foto. En `Storage > avatars` aparece una carpeta con tu id y un archivo con nombre de UUID. En `profiles`, `avatar_path` tiene ese path.
- Cambia la foto dos veces. La app muestra la última y en tu carpeta queda un solo archivo.
- Desde otra cuenta, tus posts muestran tu foto. Los de quien no tiene foto, su inicial.
- Toca la cámara y cancela: no pasa nada.
- Abre la URL de tu foto en el navegador, sin sesión: se ve, porque `avatars` es público.

## Parte 2 · Posts con imagen (avanzada)

```svg
<svg id="stLabComposer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 600" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="stLabComposer-ttl stLabComposer-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="stLabComposer-ttl">Parte 2 · Un post con imagen</title>
  <desc id="stLabComposer-dsc">Dos teléfonos y una lista. El primero es ComposeScreen con el texto escrito, la vista previa de la foto con un botón para quitarla y el botón Publicar. El segundo es el muro con el post publicado: autor, texto y la imagen debajo. A la derecha, lo que hace PublishPostUseCase en orden: valida que haya texto o foto, sube la foto al bucket post-images y recibe su path, y crea el post con content e image_path.</desc>
  <defs>
    <style>
      #stLabComposer .title{fill:#161A26;font-size:22px;font-weight:700}
      #stLabComposer .sub{fill:#79809A;font-size:13.5px}
      #stLabComposer .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #stLabComposer .foot{fill:#79809A;font-size:12px}
      #stLabComposer .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #stLabComposer .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #stLabComposer .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#stLabComposer-arrow)}
      #stLabComposer .ar-violet{fill:none;stroke:#7439B8;stroke-width:1.75;marker-end:url(#stLabComposer-ar-violet)}
    </style>
    <marker id="stLabComposer-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="stLabComposer-ar-violet" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#7439B8"/></marker>
  </defs>
  <rect width="960" height="600" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Parte 2 · Un post con imagen</text>
  <text class="sub" x="48" y="80" data-fit="860">El composer adjunta la foto y la muestra antes de publicar. Al publicar, primero sube la foto y después crea el post.</text>
  <text class="mono" x="164" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#7439B8">ComposeScreen</text>
  <text class="mono" x="432" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#7439B8">HomeScreen <tspan fill="#0F8478">· FeedPage</tspan></text>
  <rect x="48" y="132" width="232" height="420" rx="18" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/><text x="64" y="156" dy="0.35em" font-size="14" font-weight="600" fill="#161A26">Nuevo post</text><path d="M50,174 H278" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="64" y="190" width="200" height="70" rx="8" fill="#F5F6FA" stroke="#4453C9" stroke-width="1.5"/>
  <text x="74" y="210" dy="0.35em" font-size="12" fill="#161A26">Atardecer desde la U</text>
  <rect x="64" y="274" width="200" height="140" rx="10" fill="#FFE3CC" stroke="#C2571A" stroke-width="1.5"/>
  <circle cx="134" cy="328" r="18" fill="#F5A35C"/>
  <path d="M72,404 L138,346 L178,378 L218,338 L256,404 Z" fill="#C2571A" fill-opacity=".55"/>
  <circle cx="244" cy="294" r="13" fill="#FFFFFF" stroke="#C2571A" stroke-width="1.5"/>
  <text x="244" y="294" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#C2571A">×</text>
  <rect x="64" y="432" width="200" height="34" rx="17" fill="#1F9D68"/>
  <text x="164" y="449" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#FFFFFF">Publicar</text>
  <text x="164" y="488" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#79809A">sin foto: botón Agregar foto</text>
  <rect x="316" y="132" width="232" height="420" rx="18" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/><text x="332" y="156" dy="0.35em" font-size="14" font-weight="600" fill="#161A26">Muro</text><path d="M318,174 H546" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="332" y="190" width="200" height="236" rx="8" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <rect x="340" y="198" width="28" height="28" rx="5" fill="#FFE3CC" stroke="#C2571A" stroke-width="1.5"/>
  <circle cx="354.0" cy="209.2" r="4.8" fill="#C2571A"/>
  <path d="M345.6,222.1 C346.7,214.8 361.3,214.8 362.4,222.1 Z" fill="#C2571A"/>
  <text x="364.0" y="210" text-anchor="end" font-size="10" font-weight="700" fill="#C2571A">2</text>
  <text x="376" y="212" dy="0.35em" font-size="11" font-weight="700" fill="#161A26">@ana.dev</text>
  <text x="344" y="244" dy="0.35em" font-size="11.5" fill="#454C61">Atardecer desde la U</text>
  <rect x="344" y="260" width="176" height="130" rx="10" fill="#FFE3CC" stroke="#C2571A" stroke-width="1.25"/>
  <circle cx="406" cy="308" r="16" fill="#F5A35C"/>
  <path d="M350,382 L408,328 L444,358 L480,322 L514,382 Z" fill="#C2571A" fill-opacity=".55"/>
  <text x="344" y="410" dy="0.35em" font-size="11" fill="#C2354F">♥ 0</text>
  <path class="ar-violet" d="M284,449 H310"/>
  <text class="h" x="588" y="146">PUBLISHPOSTUSECASE, EN ORDEN</text>
<circle cx="600" cy="196" r="12" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="600" y="196" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#556074">1</text>
  <rect x="622" y="166" width="290" height="60" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text x="636" y="188" dy="0.35em" font-size="12.5" font-weight="700" fill="#556074" data-fit="264">Valida</text>
  <text x="636" y="208" dy="0.35em" font-size="12" fill="#454C61" data-fit="264">texto o foto · máximo 280</text>
<circle cx="600" cy="292" r="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="600" y="292" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">2</text>
  <rect x="622" y="262" width="290" height="60" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="636" y="284" dy="0.35em" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="264">uploadImage(photo)</text>
  <text x="636" y="304" dy="0.35em" font-size="12" fill="#454C61" data-fit="264">sube a post-images · path</text>
  <path class="link" d="M767,228 V260"/>
<circle cx="600" cy="388" r="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="600" y="388" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9">3</text>
  <rect x="622" y="358" width="290" height="60" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/>
  <text class="mono" x="636" y="380" dy="0.35em" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="264">create(text, imagePath: path)</text>
  <text x="636" y="400" dy="0.35em" font-size="12" fill="#454C61" data-fit="264">inserta en posts</text>
  <path class="link" d="M767,324 V356"/>
  <g transform="translate(588,462)"><rect width="324" height="77" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="296">La foto sube primero</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="296">Si sube y el insert falla, sobra un archivo.</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="296">Al revés quedaría un post sin su imagen.</text></g>
</svg>
```

Del paso 10 al 13. Reutiliza lo de la parte 1: el mismo data source del teléfono y el mismo patrón de subida. Lo nuevo es que este bucket es **privado**: las imágenes se muestran con URLs firmadas, y para no hacer una petición por post se firman todas juntas.

## Paso 10 · El bucket post-images

Al final de `supabase/config.toml`:

```toml
[storage.buckets.post-images]
public = false
file_size_limit = "2MiB"
allowed_mime_types = ["image/jpeg", "image/png", "image/webp"]
```

```shell
npx supabase seed buckets --linked
npx supabase migration new create_post_images
```

```sql
alter table public.posts add column image_path text;

create policy "post-images: usuarios autenticados"
on storage.objects for all to authenticated
using (bucket_id = 'post-images')
with check (bucket_id = 'post-images');
```

```shell
npx supabase db push
```

## Paso 11 · Los datos

`posts/data/source/supabase_post_image_data_source.dart` es igual al `upload` del paso 4, con `bucket = 'post-images'`.

En `posts/data/repository/post_repository_impl.dart`, crea dos campos más y delega en ellos. El data source del teléfono es el mismo de la parte 1:

```dart
final DevicePhotoDataSource _device = DevicePhotoDataSource();
final SupabasePostImageDataSource _images =
    SupabasePostImageDataSource();
```

`pickImage` va a `_device.pick`, y `uploadImage` a `_images.upload`.

En `posts/data/source/supabase_post_data_source.dart`, `create` agrega `'image_path': imagePath` al `insert`, y las columnas piden `image_path`:

```dart
'id, content, image_path, created_at, '
```

Para mostrar las imágenes, agrega un método que firma una lista de paths en una sola petición y devuelve el mapa path → URL:

```dart
Future<Map<String, String>> _sign(
  String bucket,
  List<String?> paths,
) async {
  final unique = paths.whereType<String>().toSet().toList();
  if (unique.isEmpty) return {};
  try {
    final results = await _client.storage
        .from(bucket)
        .createSignedUrlsResult(unique, 3600);
    return {
      for (final result in results)
        if (result is SignedUrlSuccess) result.path: result.signedUrl,
    };
  } on StorageException catch (e) {
    throw Exception(e.message);
  }
}
```

`_toPosts` ya existe y es por donde pasan todas las filas. Haz que firme las imágenes antes de convertirlas:

```dart
Future<List<Post>> _toPosts(List<Map<String, dynamic>> rows) async {
  final images = await _sign('post-images', [
    for (final row in rows) row['image_path'] as String?,
  ]);
  return [for (final row in rows) _toPost(row, images)];
}
```

`_toPost` recibe el mapa y saca de ahí la URL de su imagen: `imageUrl: images[row['image_path']]`. Un post sin imagen da `null` y `PostCard` no la pinta.

## Paso 12 · Los casos de uso

`posts/domain/usecases/pick_post_image_usecase.dart` pide la foto y revisa su peso:

```dart
static const maxBytes = 2 * 1024 * 1024;
final PostRepository _posts = PostRepositoryImpl();

Future<PickedPhoto?> call(PhotoSource source) async {
  final photo = await _posts.pickImage(source);
  if (photo == null) return null;
  if (photo.bytes.length > maxBytes) {
    throw Exception('La foto pesa más de 2 MB');
  }
  return photo;
}
```

`posts/domain/usecases/publish_post_usecase.dart` ya trae la validación del Laboratorio 6. Cámbiala para que un post pueda ser solo una foto, y sube la foto antes de crear el post:

```dart
Future<void> call(String content, {PickedPhoto? photo}) async {
  final text = content.trim();
  if (text.isEmpty && photo == null) {
    throw Exception('Escribe algo o agrega una foto');
  }
  if (text.length > maxLength) {
    throw Exception('Máximo $maxLength caracteres');
  }
  final imagePath =
      photo == null ? null : await _posts.uploadImage(photo);
  await _posts.create(text, imagePath: imagePath);
}
```

## Paso 13 · ComposeBloc

En `compose/ui/bloc/compose_bloc.dart`, crea `final PickPostImageUseCase _pickImage = PickPostImageUseCase();` y completa los dos `on` de la foto:

```dart
Future<void> _onPhotoRequested(
  ComposePhotoRequested event,
  Emitter<ComposeState> emit,
) async {
  try {
    final photo = await _pickImage(event.source);
    if (photo == null) return;
    emit(state.copyWith(status: ComposeStatus.initial, photo: photo));
  } on Exception catch (e) {
    emit(state.copyWith(
      status: ComposeStatus.failure,
      errorMessage: e.toString().replaceFirst('Exception: ', ''),
    ));
  }
}
```

`_onPhotoRemoved` emite `state.copyWith(removePhoto: true)`: un `copyWith` normal no puede volver `null` un campo, por eso el estado trae esa bandera. En `_onSubmitted`, pasa la foto al publicar: `await _publish(event.content, photo: state.photo);`.

## La prueba de la parte 2

- Adjunta una foto, quítala y adjunta otra. La vista previa sigue lo que haces.
- Publica con texto y foto, y luego solo con foto. Los dos aparecen en el muro con su imagen.
- Publica sin texto y sin foto: aparece *Escribe algo o agrega una foto*.
- En `Storage > post-images` hay una carpeta con tu id. En `posts`, `image_path` tiene el path.
- Copia la URL de una imagen, espera más de una hora y ábrela: responde `"exp" claim timestamp check failed`. Al recargar el muro se firma de nuevo.

## Retos

- **Cada quien en su carpeta.** Con la regla mínima, cualquiera con sesión puede borrar la foto de otra persona. Cambia la política para que borrar solo se permita si `(storage.foldername(name))[1] = (select auth.uid()::text)`.
- **Quitar la foto de perfil.** Una opción más en la hoja que borra el archivo y deja `avatar_path` en `null`.
- **Caché en disco.** Cambia `Image.network` por `cached_network_image`. ¿Sirve de algo con URLs firmadas que cambian cada vez?
- **Borrar un post con imagen.** Al borrar el post, borra también su archivo del bucket.
