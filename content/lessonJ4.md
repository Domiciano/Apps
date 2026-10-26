# Laboratorio 7 · Foto de perfil

<!-- tags: ChangeAvatarUseCase, avatar_path, uploadBinary, getPublicUrl, nombre aleatorio uuid,
     AvatarChangeRequested, image_picker, new row violates row-level security policy,
     la foto no se actualiza, PGRST201 more than one relationship, qué va en cada capa -->

El muro del Laboratorio 6 ya funciona, pero todos aparecen con una letra en vez de una cara. Vas a dejar que cada persona suba su foto de perfil desde la galería o la cámara. La foto se guarda en Storage con un nombre que nunca se repite, su path queda apuntado en `profiles` y aparece en el perfil y junto a cada post.

La interfaz ya está hecha. Lo que falta es lo de adentro, igual que en el muro.

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

El punto de partida es este proyecto: [github.com/Domiciano/262AppsLab7](https://github.com/Domiciano/262AppsLab7). Es el Laboratorio 6 resuelto, más la interfaz de la foto.

```shell
git clone https://github.com/Domiciano/262AppsLab7
cd 262AppsLab7
flutter pub get
```

Pon en `lib/main.dart` la `Project URL` y la `publishable key` de tu proyecto de Supabase. Después copia en la raíz la carpeta `supabase/` de tu Laboratorio 6, que ya trae tu `link` y las migraciones de `profiles`, `posts` y `likes`.

## El modelo de datos

```svg
<svg id="stLabModelo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 432" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="stLabModelo-ttl stLabModelo-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="stLabModelo-ttl">Lo que agrega la migración</title>
  <desc id="stLabModelo-dsc">A la izquierda, la tabla profiles con su nueva columna avatar_path, que puede ser nula. A la derecha, el bucket avatars: público, con un límite de 2 MB por archivo y solo imágenes JPEG, PNG o WebP. Debajo del bucket, tres políticas para usuarios con sesión: insert, select y delete, todas sobre la carpeta propia.</desc>
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
  <text class="title" x="48" y="56">Lo que agrega la migración</text>
  <text class="sub" x="48" y="80" data-fit="860">Una columna en profiles, un bucket público y tres políticas sobre storage.objects.</text>
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
  <rect x="472" y="165" width="132" height="22" rx="11" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/><text x="538" y="176" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0F8478">public</text>
  <text x="620" y="176" dy="0.35em" font-size="12.5" fill="#454C61">cualquiera lee por URL</text>
  <rect x="472" y="197" width="132" height="22" rx="11" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/><text x="538" y="208" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0F8478">2 MB</text>
  <text x="620" y="208" dy="0.35em" font-size="12.5" fill="#454C61">tamaño máximo por archivo</text>
  <rect x="472" y="229" width="132" height="22" rx="11" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/><text x="538" y="240" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0F8478">jpeg · png · webp</text>
  <text x="620" y="240" dy="0.35em" font-size="12.5" fill="#454C61">los únicos tipos que acepta</text>
  <path class="ar-amber" d="M408,271 H432 V196 H454"/>
  <text class="h" x="456" y="314">POLÍTICAS EN STORAGE.OBJECTS · ROL AUTHENTICATED</text>
  <rect x="456" y="328" width="144" height="52" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="470" y="348" font-size="13" font-weight="700" fill="#556074">insert</text>
  <text x="470" y="368" font-size="12" fill="#454C61">subir en su carpeta</text>
  <rect x="612" y="328" width="144" height="52" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="626" y="348" font-size="13" font-weight="700" fill="#556074">select</text>
  <text x="626" y="368" font-size="12" fill="#454C61">ver en su carpeta</text>
  <rect x="768" y="328" width="144" height="52" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="782" y="348" font-size="13" font-weight="700" fill="#556074">delete</text>
  <text x="782" y="368" font-size="12" fill="#454C61">borrar en su carpeta</text>
  <g transform="translate(48,310)"><rect width="360" height="77" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="332">avatar_path empieza en null</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="332">Quien no ha subido foto no tiene path:</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="332">la app muestra la inicial del nombre.</text></g>
  <text class="foot" x="48" y="404" data-fit="860">El orden importa: la columna y el bucket existen antes que las políticas que los nombran.</text>
</svg>
```

Es la migración que viste en *Subir y mostrar archivos*. Créala:

```shell
npx supabase migration new create_avatars
```

En el archivo que termina en `create_avatars.sql`:

```sql
alter table public.profiles add column avatar_path text;

insert into storage.buckets
  (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 2097152,
   array['image/jpeg', 'image/png', 'image/webp']);

create policy "avatars: subir a la carpeta propia"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "avatars: ver la carpeta propia"
on storage.objects for select to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "avatars: borrar de la carpeta propia"
on storage.objects for delete to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);
```

```shell
npx supabase db push
```

En el dashboard, `Storage` muestra el bucket `avatars`, marcado como público.

## Lo que ya viene

```svg
<svg id="stLabCarpetas" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 720" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="stLabCarpetas-ttl stLabCarpetas-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="stLabCarpetas-ttl">La estructura de carpetas</title>
  <desc id="stLabCarpetas-dsc">Árbol de carpetas del proyecto 262AppsLab7. Ya vienen el componente Avatar, las entidades PhotoSource y PickedPhoto, Profile con avatarPath y avatarUrl, y toda la interfaz. Están vacíos o incompletos y numerados por paso: el contrato AvatarRepository y la operación nueva de ProfileRepository (1), ChangeAvatarUseCase (2), los dos data sources de la foto y AvatarRepositoryImpl (3), leer avatar_path en los data sources de perfiles y de posts (4) y el on de FeedBloc (5).</desc>
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
  <rect width="960" height="720" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">La estructura de carpetas</text>
  <text class="sub" x="48" y="80" data-fit="860">En gris lo que ya viene hecho. Con número, lo que te toca y en qué paso.</text>
  <rect x="48" y="96" width="864" height="564" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="68" y="111" width="50" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="78" y="124" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="36">lib/</text>
  <path d="M78,137 V158 H89" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="92" y="145" width="185" height="26" rx="4" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="102" y="158" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="171">components/avatar.dart</text>
  <text x="568" y="158" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">Ya viene: la foto redonda o la inicial</text>
  <path d="M78,137 V192 H89" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="92" y="179" width="88" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="102" y="192" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="74">features/</text>
  <path d="M102,205 V226 H113" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="116" y="213" width="72" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="126" y="226" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="58">avatar/</text>
  <text x="568" y="226" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">Todo lo de la foto que no es pantalla</text>
  <path d="M126,239 V260 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="247" width="140" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="150" y="260" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="126">domain/entities/</text>
  <text x="568" y="260" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">Ya viene: PhotoSource y PickedPhoto</text>
  <path d="M126,239 V294 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="281" width="320" height="26" rx="4" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="150" y="294" dy="0.35em" font-size="12.5" font-weight="600" fill="#A96C05" data-fit="306">domain/repository/avatar_repository.dart</text>
  <text x="568" y="294" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">El contrato · vacío</text>
  <circle cx="886" cy="294" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="886" y="294" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">1</text>
  <path d="M126,239 V328 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="315" width="335" height="26" rx="4" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="150" y="328" dy="0.35em" font-size="12.5" font-weight="600" fill="#A96C05" data-fit="321">domain/usecases/change_avatar_usecase.dart</text>
  <text x="568" y="328" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">El caso de uso · vacío</text>
  <circle cx="886" cy="328" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="886" y="328" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">2</text>
  <path d="M126,239 V362 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="349" width="328" height="26" rx="4" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="150" y="362" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="314">data/source/device_photo_data_source.dart</text>
  <text x="568" y="362" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">La galería y la cámara · vacío</text>
  <circle cx="886" cy="362" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="886" y="362" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">3</text>
  <path d="M126,239 V396 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="383" width="350" height="26" rx="4" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="150" y="396" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="336">data/source/supabase_avatar_data_source.dart</text>
  <text x="568" y="396" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">El bucket · vacío</text>
  <circle cx="886" cy="396" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="886" y="396" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">3</text>
  <path d="M126,239 V430 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="417" width="342" height="26" rx="4" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="150" y="430" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="328">data/repository/avatar_repository_impl.dart</text>
  <text x="568" y="430" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">Cumple el contrato · vacío</text>
  <circle cx="886" cy="430" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="886" y="430" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">3</text>
  <path d="M102,205 V464 H113" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="116" y="451" width="58" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="126" y="464" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="44">auth/</text>
  <text x="568" y="464" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">Profile ya trae avatarPath y avatarUrl</text>
  <path d="M126,477 V498 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="485" width="328" height="26" rx="4" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="150" y="498" dy="0.35em" font-size="12.5" font-weight="600" fill="#A96C05" data-fit="314">domain/repository/profile_repository.dart</text>
  <text x="568" y="498" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">Le falta una operación</text>
  <circle cx="886" cy="498" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="886" y="498" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">1</text>
  <path d="M126,477 V532 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="519" width="358" height="26" rx="4" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="150" y="532" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="344">data/source/supabase_profile_data_source.dart</text>
  <text x="568" y="532" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">Leer y guardar avatar_path</text>
  <circle cx="886" cy="532" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="886" y="532" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">4</text>
  <path d="M102,205 V566 H113" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="116" y="553" width="380" height="26" rx="4" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="126" y="566" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="366">posts/data/source/supabase_post_data_source.dart</text>
  <text x="568" y="566" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">La foto del autor</text>
  <circle cx="886" cy="566" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="886" y="566" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">4</text>
  <path d="M102,205 V600 H113" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="116" y="587" width="80" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="126" y="600" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="66">home/ui/</text>
  <text x="568" y="600" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">Ya viene: ProfilePage, la hoja y PostCard</text>
  <path d="M126,613 V634 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="621" width="162" height="26" rx="4" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="150" y="634" dy="0.35em" font-size="12.5" font-weight="600" fill="#7439B8" data-fit="148">bloc/feed_bloc.dart</text>
  <text x="568" y="634" dy="0.35em" font-size="13" fill="#454C61" data-fit="290">Evento y estado listos · el on solo imprime</text>
  <circle cx="886" cy="634" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="886" y="634" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">5</text>
  <text class="h" x="898" y="88" text-anchor="end">PASO</text>
  <text class="foot" x="48" y="692" data-fit="860">main.dart no cambia: FeedBloc crea su caso de uso, y cada capa crea la siguiente.</text>
</svg>
```

- **Todo el Laboratorio 6.** El muro, los «me gusta», publicar y el perfil.
- **`image_picker` y `uuid`** en el `pubspec.yaml`, con los permisos de iOS y macOS ya declarados.
- **Las entidades.** `PhotoSource` (`gallery` o `camera`), `PickedPhoto` (los bytes y la extensión), `Profile` con `avatarPath` y `avatarUrl`, y `Post` con `authorAvatarUrl`. Todos los campos de la foto pueden ser `null`.
- **Toda la interfaz.** El componente `Avatar` pinta la foto, o la inicial si la URL es `null`. `ProfilePage` tiene el botón de cámara, `HomeScreen` abre la hoja con las dos opciones y `PostCard` ya muestra la foto del autor.
- **El estado.** `FeedState` trae `avatarStatus`: `idle`, `uploading` o `failure`. `HomeScreen` muestra un `SnackBar` con `errorMessage` cuando llega `failure`.

Corre la app, entra al perfil, toca la cámara y elige una opción. El evento aparece en la consola, pero la foto no cambia:

```text
FeedBloc recibió AvatarChangeRequested(gallery)
```

## Paso 1 · Los contratos

`avatar/domain/repository/avatar_repository.dart`

```dart
abstract class AvatarRepository {
  Future<PickedPhoto?> pick(PhotoSource source);
  Future<String> upload(PickedPhoto photo);
  Future<void> remove(String path);
}
```

`upload` devuelve el path con el que quedó guardada la foto. Al contrato de perfiles, en `auth/domain/repository/profile_repository.dart`, le falta una operación:

```dart
Future<void> updateAvatarPath(String id, String path);
```

## Paso 2 · El caso de uso

`avatar/domain/usecases/change_avatar_usecase.dart`

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

```dart
class ChangeAvatarUseCase {
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
    // TODO: subir la foto, guardar su path en el perfil,
    // borrar before.avatarPath si no es null
    // y devolver el perfil leído de nuevo
  }
}
```

El orden importa. Si la subida falla, nada cambió. Si falla al borrar, sobra un archivo, pero el perfil nunca apunta a una foto que no existe.

## Paso 3 · Los data sources de la foto

`avatar/data/source/device_photo_data_source.dart` es el único archivo que usa `image_picker`. Su `pick` abre la galería o la cámara según el `PhotoSource`, con `maxWidth: 512`, `maxHeight: 512` e `imageQuality: 80`, como en *Acceso a galería y cámara*. Devuelve `null` si la persona cancela. Si no cancela, devuelve un `PickedPhoto` con `readAsBytes()` y la extensión del nombre del archivo, en minúscula.

`avatar/data/source/supabase_avatar_data_source.dart` es el único archivo que usa `_client.storage`:

```dart
class SupabaseAvatarDataSource {
  static const bucket = 'avatars';
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

  Future<void> remove(String path) async {
    // TODO: remove con una lista de un solo path,
    // y StorageException convertida en Exception
  }
}
```

- La primera carpeta es `_uid`: sin ella, la política rechaza la subida con `new row violates row-level security policy`.
- El nombre es un UUID nuevo en cada subida. Es lo que evita que la app siga mostrando la foto vieja.

`avatar/data/repository/avatar_repository_impl.dart` crea los dos data sources como campos y cumple el contrato delegando: `pick` en el del teléfono, `upload` y `remove` en el de Storage.

## Paso 4 · Del path a la URL

En `auth/data/source/supabase_profile_data_source.dart`, `getProfile` lee `avatar_path` y arma la URL:

```dart
final path = row['avatar_path'] as String?;
return Profile(
  id: row['id'] as String,
  username: row['username'] as String,
  fullName: row['full_name'] as String,
  avatarPath: path,
  avatarUrl: path == null
      ? null
      : _client.storage.from('avatars').getPublicUrl(path),
);
```

Agrega también `updateAvatarPath`, un `update` de `avatar_path` filtrado por `id`, y complétalo en `ProfileRepositoryImpl`.

En `posts/data/source/supabase_post_data_source.dart`, agrega `avatar_path` a las columnas del autor:

```dart
'author:profiles!profile_id(username, full_name, avatar_path), '
```

Luego, en `_toPost`, arma `authorAvatarUrl` igual que en el perfil. El `!profile_id` ya venía del Laboratorio 6: `likes` también une posts con perfiles, y sin esa pista la consulta falla con `PGRST201`.

## Paso 5 · FeedBloc

`home/ui/bloc/feed_bloc.dart`

Crea el caso de uso como campo, `final ChangeAvatarUseCase _changeAvatar = ChangeAvatarUseCase();`, y reemplaza el `debugPrint` del `on`:

```dart
Future<void> _onAvatarChangeRequested(
  AvatarChangeRequested event,
  Emitter<FeedState> emit,
) async {
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
}
```

`add(FeedStarted())` vuelve a cargar el muro, porque tus posts siguen con la URL de la foto anterior.

Corre la app de nuevo: la foto aparece en el perfil y en tus posts.

## La prueba

Con dos cuentas, en dos emuladores o una después de la otra:

- Sube una foto desde la galería. En `Storage > avatars` aparece una carpeta con tu id y, adentro, un archivo con nombre de UUID. En `Table Editor > profiles`, `avatar_path` tiene ese mismo path.
- Cambia la foto dos veces. La app muestra siempre la última. En tu carpeta queda **un solo archivo**, y su nombre es distinto cada vez.
- Desde la otra cuenta, abre el muro: tus posts muestran tu foto. Los de quien no tiene foto muestran su inicial.
- Abre la URL de tu foto en el navegador, sin sesión: se ve, porque el bucket es público.
- Toca la cámara y cancela: no aparece ningún error y la foto no cambia.

## Retos

- **Quitar la foto.** Una opción más en la hoja que borra el archivo y deja `avatar_path` en `null`.
- **Fotos privadas.** Pasa el bucket a privado, agrega a la política de `select` a cualquier usuario con sesión y usa `createSignedUrlsResult` para firmar todas las fotos de una página del muro en una sola petición.
- **Caché en disco.** Cambia `Image.network` por `cached_network_image` en `Avatar` y comprueba que, al reabrir la app sin red, las fotos siguen ahí.
- **Una foto por post.** Una columna `image_path` en `posts`, un bucket `post-images` y la foto debajo del texto en `PostCard`.
