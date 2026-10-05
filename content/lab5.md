# Laboratorio 5: Registro de usuarios

<!-- tags: SignUpUseCase, AuthUser y Profile, AuthRepository, ProfileRepository, RegisterBloc, copyWith,
     signUp, tabla profiles, BlocListener, permission denied for table profiles,
     Null check operator used on a null value, Clean Architecture -->

Vas a construir el registro de usuarios con `Supabase`, organizado con Clean Architecture y `Bloc`. Registrar no es una operación sino dos: crear la cuenta en Auth y guardar el perfil en la base de datos. La Parte 1 lo arma en nueve pasos, de la capa de adentro hacia la de afuera. En la Parte 2 construyes el inicio de sesión por tu cuenta.

## Un formulario, dos destinos

```svg
<svg id="l5Form" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 488" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="l5Form-ttl l5Form-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="l5Form-ttl">Un formulario, dos destinos</title>
  <desc id="l5Form-dsc">El formulario Crear cuenta tiene cinco campos. Nombre de usuario y nombre completo van a la tabla profiles. Correo y contraseña van a Supabase Auth. La confirmación de la contraseña no se envía: solo se compara en la pantalla.</desc>
  <defs>
    <style>
      #l5Form .title{fill:#161A26;font-size:22px;font-weight:700}
      #l5Form .sub{fill:#79809A;font-size:13.5px}
      #l5Form .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #l5Form .foot{fill:#79809A;font-size:12px}
      #l5Form .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #l5Form .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #l5Form .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#l5Form-arrow)}
      #l5Form .ar-indigo{fill:none;stroke:#4453C9;stroke-width:1.75;marker-end:url(#l5Form-ar-indigo)}
      #l5Form .ar-amber{fill:none;stroke:#A96C05;stroke-width:1.75;marker-end:url(#l5Form-ar-amber)}
    </style>
    <marker id="l5Form-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="l5Form-ar-indigo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#4453C9"/></marker>
    <marker id="l5Form-ar-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#A96C05"/></marker>
  </defs>
  <rect width="960" height="488" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Un formulario, dos destinos</text>
  <text class="sub" x="48" y="80" data-fit="860">El formulario de registro pide cinco datos, pero no todos van al mismo lugar.</text>
  <rect x="48" y="112" width="256" height="312" rx="18" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/><text x="64" y="136" dy="0.35em" font-size="14" font-weight="600" fill="#161A26">Crear cuenta</text><path d="M50,154 H302" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="64" y="168" width="224" height="28" rx="6" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="76" y="182" dy="0.35em" font-size="12.5" fill="#454C61">Nombre de usuario</text>
  <rect x="64" y="208" width="224" height="28" rx="6" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="76" y="222" dy="0.35em" font-size="12.5" fill="#454C61">Nombre completo</text>
  <rect x="64" y="248" width="224" height="28" rx="6" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="76" y="262" dy="0.35em" font-size="12.5" fill="#454C61">Correo</text>
  <rect x="64" y="288" width="224" height="28" rx="6" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="76" y="302" dy="0.35em" font-size="12.5" fill="#454C61">Contraseña</text>
  <rect x="64" y="328" width="224" height="28" rx="6" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="76" y="342" dy="0.35em" font-size="12.5" fill="#454C61">Confirmar contraseña</text>
  <rect x="64" y="376" width="224" height="30" rx="15" fill="#4453C9"/>
  <text x="176" y="391" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#FFFFFF">Registrarme</text>
  <path class="ar-indigo" d="M288,182 H440 V160 H622"/>
  <path d="M288,222 H440 V182" fill="none" stroke="#4453C9" stroke-width="1.75"/>
  <path class="ar-amber" d="M288,262 H480 V284 H622"/>
  <path d="M288,302 H480 V284" fill="none" stroke="#A96C05" stroke-width="1.75"/>
  <path class="link" stroke-dasharray="5 4" d="M288,342 H440 V398 H622"/>
  <text x="531" y="150" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9">van a tu tabla</text>
  <text x="551" y="274" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">van a Auth</text>
  <text x="531" y="388" text-anchor="middle" font-size="12.5" font-weight="600" fill="#556074">no se envía</text>
  <rect x="624" y="128" width="288" height="64" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="768" y="151" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#4453C9" data-fit="272">profiles</text><text x="768" y="170" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="272">username · full_name</text>
  <rect x="624" y="252" width="288" height="64" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="768" y="275" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="272">Supabase Auth</text><text x="768" y="294" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="272">correo · contraseña</text>
  <g transform="translate(624,360)"><rect width="288" height="77" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#556074" data-fit="260">Se queda en la pantalla</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="260">Solo se compara con la contraseña</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="260">antes de lanzar el evento.</text></g>
  <text class="foot" x="48" y="460" data-fit="860">SignUpUseCase reparte los datos: primero Auth y después profiles, con el id que Auth devolvió.</text>
</svg>
```

Por eso hay dos entidades y dos repositorios, uno por destino. El correo y la contraseña van a Auth, que devuelve el `id` de la cuenta. Con ese `id` se guarda la fila del perfil.

## El mapa

```svg
<svg id="l5Ruta" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 760" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="l5Ruta-ttl l5Ruta-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="l5Ruta-ttl">El mapa del laboratorio</title>
  <desc id="l5Ruta-dsc">Mapa de capas de la Parte 1, con dos columnas: Auth a la izquierda y el perfil a la derecha. Dominio: AuthUser y Profile en el paso 1, AuthRepository y ProfileRepository en el 2, SignUpUseCase en el 3, que usa los dos contratos en orden. Datos: SupabaseAuthDataSource y AuthRepositoryImpl en el paso 4, SupabaseProfileDataSource y ProfileRepositoryImpl en el 5. Presentación: RegisterBloc en el paso 6, main.dart en el 7, RegisterScreen en el 8 y HomeScreen en el 9. Abajo, Supabase Auth y la tabla profiles.</desc>
  <defs>
    <style>
      #l5Ruta .title{fill:#161A26;font-size:22px;font-weight:700}
      #l5Ruta .sub{fill:#79809A;font-size:13.5px}
      #l5Ruta .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #l5Ruta .foot{fill:#79809A;font-size:12px}
      #l5Ruta .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #l5Ruta .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #l5Ruta .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#l5Ruta-arrow)}
    </style>
    <marker id="l5Ruta-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="760" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">El mapa del laboratorio</text>
  <text class="sub" x="48" y="80" data-fit="860">Cada caja es una clase y el número dice en qué paso la construyes. A la izquierda, lo de Auth. A la derecha, lo del perfil.</text>
  <rect x="48" y="104" width="864" height="104" rx="14" fill="#F4EBFF" fill-opacity=".5" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="h" x="68" y="134" style="fill:#7439B8" data-fit="150">PRESENTACIÓN</text>
  <text x="68" y="154" font-size="12.5" fill="#454C61" data-fit="150">Pantallas y Bloc</text>
  <rect x="48" y="224" width="864" height="184" rx="14" fill="#FFF3DC" fill-opacity=".5" stroke="#F0C572" stroke-width="1.5"/>
  <text class="h" x="68" y="254" style="fill:#A96C05" data-fit="150">DOMINIO</text>
  <text x="68" y="274" font-size="12.5" fill="#454C61" data-fit="150">Reglas y contratos</text>
  <rect x="48" y="424" width="864" height="168" rx="14" fill="#E3F6F3" fill-opacity=".5" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="h" x="68" y="454" style="fill:#0F8478" data-fit="150">DATOS</text>
  <text x="68" y="474" font-size="12.5" fill="#454C61" data-fit="150">Habla con Supabase</text>
  <rect x="48" y="608" width="864" height="88" rx="14" fill="#EFF1F5" fill-opacity=".5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="h" x="68" y="638" style="fill:#556074" data-fit="150">SUPABASE</text>
  <text x="68" y="658" font-size="12.5" fill="#454C61" data-fit="150">Servicio externo</text>
  <path class="link" d="M480,162 H502"/>
  <path class="link" d="M352,162 H338"/>
  <path class="link" stroke-dasharray="5 4" d="M768,162 H634"/>
  <text x="700" y="152" text-anchor="middle" font-size="12" font-weight="600" fill="#556074">arma</text>
  <path class="link" d="M568,184 V254"/>
  <path class="link" d="M540,300 V318 H392 V338"/>
  <path class="link" d="M596,300 V318 H744 V338"/>
  <text x="530" y="334" text-anchor="end" font-size="12" font-weight="700" fill="#A96C05">1.º</text>
  <text x="606" y="334" font-size="12" font-weight="700" fill="#A96C05">2.º</text>
  <path class="link" stroke-dasharray="5 4" d="M392,452 V386"/>
  <path class="link" stroke-dasharray="5 4" d="M744,452 V386"/>
  <text x="402" y="441" font-size="12" font-weight="600" fill="#556074">implementa</text>
  <text x="754" y="441" font-size="12" font-weight="600" fill="#556074">implementa</text>
  <path class="link" d="M392,496 V526"/>
  <path class="link" d="M744,496 V526"/>
  <path class="link" d="M392,572 V628"/>
  <path class="link" d="M744,572 V628"/>
  <rect x="216" y="140" width="120" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="276" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="104">HomeScreen</text>
  <circle cx="222" cy="142" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="222" y="142" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">9</text>
  <rect x="352" y="140" width="128" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="416" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="112">RegisterScreen</text>
  <circle cx="358" cy="142" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="358" y="142" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">8</text>
  <rect x="504" y="140" width="128" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="568" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="112">RegisterBloc</text>
  <circle cx="510" cy="142" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="510" y="142" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">6</text>
  <rect x="768" y="140" width="128" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="832" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="112">main.dart</text>
  <circle cx="774" cy="142" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="774" y="142" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">7</text>
  <rect x="316" y="256" width="152" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="392" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="136">AuthUser</text>
  <circle cx="322" cy="258" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="322" y="258" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">1</text>
  <rect x="492" y="256" width="152" height="44" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="568" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="136">SignUpUseCase</text>
  <circle cx="498" cy="258" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="498" y="258" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">3</text>
  <rect x="668" y="256" width="152" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="744" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="136">Profile</text>
  <circle cx="674" cy="258" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="674" y="258" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">1</text>
  <rect x="304" y="340" width="176" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="392" y="362" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="160">AuthRepository</text>
  <circle cx="310" cy="342" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="310" y="342" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">2</text>
  <rect x="656" y="340" width="176" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="744" y="362" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="160">ProfileRepository</text>
  <circle cx="662" cy="342" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="662" y="342" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">2</text>
  <rect x="304" y="452" width="176" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="392" y="474" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="160">AuthRepositoryImpl</text>
  <circle cx="310" cy="454" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="310" y="454" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">4</text>
  <rect x="656" y="452" width="176" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="744" y="474" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="160">ProfileRepositoryImpl</text>
  <circle cx="662" cy="454" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="662" y="454" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">5</text>
  <rect x="288" y="528" width="208" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="392" y="550" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="192">SupabaseAuthDataSource</text>
  <circle cx="294" cy="530" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="294" y="530" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">4</text>
  <rect x="636" y="528" width="216" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="744" y="550" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="200">SupabaseProfileDataSource</text>
  <circle cx="642" cy="530" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="642" y="530" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">5</text>
  <rect x="304" y="630" width="176" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="392" y="652" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="160">Supabase Auth</text>
  <rect x="656" y="630" width="176" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="744" y="652" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="160">tabla profiles</text>
  <text class="foot" x="48" y="732" data-fit="860">SignUpUseCase es la única pieza que conoce las dos columnas: primero crea la cuenta y después guarda el perfil.</text>
</svg>
```

El dominio no sabe que existe Supabase. Si mañana cambia el proveedor, solo se reescribe la capa de datos. En cada paso vuelve a aparecer este mapa, con lo que estás escribiendo resaltado.

## Preparación

Necesitas el proyecto de Supabase de *Instalación de supabase*, con la tabla `profiles` y el Auth por email que dejaste listos en *Configurando los servicios*.

El punto de partida es este proyecto de Flutter: [github.com/Domiciano/262App3](https://github.com/Domiciano/262App3). Trae las tres pantallas ya dibujadas, la navegación entre ellas y el tema. No tiene `Supabase` ni `Bloc` conectados: eso es lo que construyes aquí.

```shell
git clone https://github.com/Domiciano/262App3
cd 262App3
flutter pub get
```

Las dependencias ya vienen en su `pubspec.yaml`:

```yaml
dependencies:
  flutter_bloc: ^9.1.1
  supabase_flutter: ^2.18.0
```

```svg
<svg id="l5Carpetas" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 856" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="l5Carpetas-ttl l5Carpetas-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="l5Carpetas-ttl">La estructura de carpetas</title>
  <desc id="l5Carpetas-dsc">Árbol de carpetas dentro de lib: main.dart y features. En features, auth con domain (entities, repository y usecases) y data (source y repository); register con ui (bloc y screens); home con su pantalla; y login, que es la Parte 2. Cada archivo indica el paso del laboratorio en que se crea.</desc>
  <defs>
    <style>
      #l5Carpetas .title{fill:#161A26;font-size:22px;font-weight:700}
      #l5Carpetas .sub{fill:#79809A;font-size:13.5px}
      #l5Carpetas .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #l5Carpetas .foot{fill:#79809A;font-size:12px}
      #l5Carpetas .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #l5Carpetas .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #l5Carpetas .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#l5Carpetas-arrow)}
    </style>
    <marker id="l5Carpetas-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="856" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">La estructura de carpetas</text>
  <text class="sub" x="48" y="80" data-fit="860">auth/ guarda lo que se comparte. register/ y login/ solo tienen su pantalla y su Bloc.</text>
  <rect x="48" y="96" width="864" height="700" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="68" y="111" width="50" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="78" y="124" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="38">lib/</text>
  <path d="M78,137 V158 H89" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="92" y="145" width="88" height="26" rx="4" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="102" y="158" dy="0.35em" font-size="12.5" font-weight="600" fill="#7439B8" data-fit="76">main.dart</text>
  <text x="516" y="158" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">Inicializa Supabase y arma las rutas</text>
  <circle cx="880" cy="158" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="158" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">7</text>
  <path d="M78,137 V192 H89" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="92" y="179" width="88" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="102" y="192" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="76">features/</text>
  <path d="M102,205 V226 H113" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="116" y="213" width="58" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="126" y="226" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="46">auth/</text>
  <text x="516" y="226" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">Lo que comparten registro y login</text>
  <path d="M126,239 V260 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="247" width="72" height="26" rx="8" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="150" y="260" dy="0.35em" font-size="12.5" font-weight="600" fill="#A96C05" data-fit="60">domain/</text>
  <text x="516" y="260" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">No importa nada de Flutter ni de Supabase</text>
  <path d="M150,273 V294 H161" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="164" y="281" width="192" height="26" rx="4" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="174" y="294" dy="0.35em" font-size="12.5" font-weight="600" fill="#A96C05" data-fit="180">entities/auth_user.dart</text>
  <text x="516" y="294" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">Lo que devuelve Auth</text>
  <circle cx="880" cy="294" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="294" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">1</text>
  <path d="M150,273 V328 H161" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="164" y="315" width="178" height="26" rx="4" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="174" y="328" dy="0.35em" font-size="12.5" font-weight="600" fill="#A96C05" data-fit="166">entities/profile.dart</text>
  <text x="516" y="328" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">Lo que guardas en tu tabla</text>
  <circle cx="880" cy="328" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="328" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">1</text>
  <path d="M150,273 V362 H161" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="164" y="349" width="252" height="26" rx="4" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="174" y="362" dy="0.35em" font-size="12.5" font-weight="600" fill="#A96C05" data-fit="240">repository/auth_repository.dart</text>
  <text x="516" y="362" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">El contrato de autenticación</text>
  <circle cx="880" cy="362" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="362" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">2</text>
  <path d="M150,273 V396 H161" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="164" y="383" width="275" height="26" rx="4" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="174" y="396" dy="0.35em" font-size="12.5" font-weight="600" fill="#A96C05" data-fit="263">repository/profile_repository.dart</text>
  <text x="516" y="396" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">El contrato del perfil</text>
  <circle cx="880" cy="396" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="396" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">2</text>
  <path d="M150,273 V430 H161" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="164" y="417" width="238" height="26" rx="4" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="174" y="430" dy="0.35em" font-size="12.5" font-weight="600" fill="#A96C05" data-fit="226">usecases/sign_up_usecase.dart</text>
  <text x="516" y="430" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">Registrar: los dos pasos, en orden</text>
  <circle cx="880" cy="430" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="430" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">3</text>
  <path d="M126,239 V464 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="451" width="58" height="26" rx="8" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="150" y="464" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="46">data/</text>
  <text x="516" y="464" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">El único lugar que conoce a Supabase</text>
  <path d="M150,477 V498 H161" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="164" y="485" width="298" height="26" rx="4" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="174" y="498" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="286">source/supabase_auth_data_source.dart</text>
  <text x="516" y="498" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">Las llamadas a Auth</text>
  <circle cx="880" cy="498" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="498" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">4</text>
  <path d="M150,477 V532 H161" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="164" y="519" width="290" height="26" rx="4" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="174" y="532" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="278">repository/auth_repository_impl.dart</text>
  <text x="516" y="532" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">Cumple el contrato</text>
  <circle cx="880" cy="532" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="532" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">4</text>
  <path d="M150,477 V566 H161" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="164" y="553" width="320" height="26" rx="4" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="174" y="566" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="308">source/supabase_profile_data_source.dart</text>
  <text x="516" y="566" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">El insert en profiles</text>
  <circle cx="880" cy="566" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="566" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">5</text>
  <path d="M150,477 V600 H161" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="164" y="587" width="312" height="26" rx="4" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="174" y="600" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="300">repository/profile_repository_impl.dart</text>
  <text x="516" y="600" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">Cumple el contrato</text>
  <circle cx="880" cy="600" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="600" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">5</text>
  <path d="M102,205 V634 H113" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="116" y="621" width="110" height="26" rx="8" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="126" y="634" dy="0.35em" font-size="12.5" font-weight="600" fill="#7439B8" data-fit="98">register/ui/</text>
  <text x="516" y="634" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">La pantalla de registro y su Bloc</text>
  <path d="M126,647 V668 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="655" width="58" height="26" rx="8" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="150" y="668" dy="0.35em" font-size="12.5" font-weight="600" fill="#7439B8" data-fit="46">bloc/</text>
  <text x="516" y="668" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">register_bloc · register_event · register_state</text>
  <circle cx="880" cy="668" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="668" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">6</text>
  <path d="M126,647 V702 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="689" width="230" height="26" rx="4" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="150" y="702" dy="0.35em" font-size="12.5" font-weight="600" fill="#7439B8" data-fit="218">screens/register_screen.dart</text>
  <text x="516" y="702" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">Ya viene dibujada: se conecta</text>
  <circle cx="880" cy="702" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="702" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">8</text>
  <path d="M102,205 V736 H113" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="116" y="723" width="260" height="26" rx="4" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="126" y="736" dy="0.35em" font-size="12.5" font-weight="600" fill="#7439B8" data-fit="248">home/ui/screens/home_screen.dart</text>
  <text x="516" y="736" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">A donde llega quien se registra</text>
  <circle cx="880" cy="736" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="736" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">9</text>
  <path d="M102,205 V770 H113" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="116" y="757" width="88" height="26" rx="8" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="126" y="770" dy="0.35em" font-size="12.5" font-weight="600" fill="#7439B8" data-fit="76">login/ui/</text>
  <text x="516" y="770" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">La Parte 2, con la misma forma</text>
  <text class="h" x="892" y="88" text-anchor="end">PASO</text>
  <text class="foot" x="48" y="828" data-fit="860">Los nombres de archivo van en minúscula y con guion bajo.</text>
</svg>
```

En los bloques de código se omiten los `import`: el editor los sugiere.

## Paso 1 · Las dos entidades

```svg
<svg id="l5P1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 760" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="l5P1-ttl l5P1-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="l5P1-ttl">Paso 1 · Las dos entidades</title>
  <desc id="l5P1-dsc">El mapa del laboratorio en el paso 1. Se escribe: AuthUser, Profile. Las piezas de los pasos anteriores aparecen marcadas como hechas y las de los pasos siguientes, atenuadas.</desc>
  <defs>
    <style>
      #l5P1 .title{fill:#161A26;font-size:22px;font-weight:700}
      #l5P1 .sub{fill:#79809A;font-size:13.5px}
      #l5P1 .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #l5P1 .foot{fill:#79809A;font-size:12px}
      #l5P1 .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #l5P1 .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #l5P1 .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#l5P1-arrow)}
    </style>
    <marker id="l5P1-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="760" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Paso 1 · Las dos entidades</text>
  <text class="sub" x="48" y="80" data-fit="860">Resaltado, lo que escribes en este paso. Con marca verde, lo que ya está. En gris, lo que falta.</text>
  <rect x="48" y="104" width="864" height="104" rx="14" fill="#F4EBFF" fill-opacity=".5" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="h" x="68" y="134" style="fill:#7439B8" data-fit="150">PRESENTACIÓN</text>
  <text x="68" y="154" font-size="12.5" fill="#454C61" data-fit="150">Pantallas y Bloc</text>
  <rect x="48" y="224" width="864" height="184" rx="14" fill="#FFF3DC" fill-opacity=".5" stroke="#F0C572" stroke-width="1.5"/>
  <text class="h" x="68" y="254" style="fill:#A96C05" data-fit="150">DOMINIO</text>
  <text x="68" y="274" font-size="12.5" fill="#454C61" data-fit="150">Reglas y contratos</text>
  <rect x="48" y="424" width="864" height="168" rx="14" fill="#E3F6F3" fill-opacity=".5" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="h" x="68" y="454" style="fill:#0F8478" data-fit="150">DATOS</text>
  <text x="68" y="474" font-size="12.5" fill="#454C61" data-fit="150">Habla con Supabase</text>
  <rect x="48" y="608" width="864" height="88" rx="14" fill="#EFF1F5" fill-opacity=".5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="h" x="68" y="638" style="fill:#556074" data-fit="150">SUPABASE</text>
  <text x="68" y="658" font-size="12.5" fill="#454C61" data-fit="150">Servicio externo</text>
  <path class="link" d="M480,162 H502"/>
  <path class="link" d="M352,162 H338"/>
  <path class="link" stroke-dasharray="5 4" d="M768,162 H634"/>
  <text x="700" y="152" text-anchor="middle" font-size="12" font-weight="600" fill="#556074">arma</text>
  <path class="link" d="M568,184 V254"/>
  <path class="link" d="M540,300 V318 H392 V338"/>
  <path class="link" d="M596,300 V318 H744 V338"/>
  <text x="530" y="334" text-anchor="end" font-size="12" font-weight="700" fill="#A96C05">1.º</text>
  <text x="606" y="334" font-size="12" font-weight="700" fill="#A96C05">2.º</text>
  <path class="link" stroke-dasharray="5 4" d="M392,452 V386"/>
  <path class="link" stroke-dasharray="5 4" d="M744,452 V386"/>
  <text x="402" y="441" font-size="12" font-weight="600" fill="#556074">implementa</text>
  <text x="754" y="441" font-size="12" font-weight="600" fill="#556074">implementa</text>
  <path class="link" d="M392,496 V526"/>
  <path class="link" d="M744,496 V526"/>
  <path class="link" d="M392,572 V628"/>
  <path class="link" d="M744,572 V628"/>
  <rect x="216" y="140" width="120" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="276" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="104">HomeScreen</text>
  <rect x="352" y="140" width="128" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="416" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="112">RegisterScreen</text>
  <rect x="504" y="140" width="128" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="568" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="112">RegisterBloc</text>
  <rect x="768" y="140" width="128" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="832" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="112">main.dart</text>
  <rect x="311" y="251" width="162" height="54" rx="14" fill="none" stroke="#4453C9" stroke-width="3"/>
  <rect x="316" y="256" width="152" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="392" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="136">AuthUser</text>
  <circle cx="322" cy="258" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="322" y="258" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">1</text>
  <rect x="492" y="256" width="152" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="568" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="136">SignUpUseCase</text>
  <rect x="663" y="251" width="162" height="54" rx="14" fill="none" stroke="#4453C9" stroke-width="3"/>
  <rect x="668" y="256" width="152" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="744" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="136">Profile</text>
  <circle cx="674" cy="258" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="674" y="258" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">1</text>
  <rect x="304" y="340" width="176" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="392" y="362" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="160">AuthRepository</text>
  <rect x="656" y="340" width="176" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="744" y="362" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="160">ProfileRepository</text>
  <rect x="304" y="452" width="176" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="392" y="474" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="160">AuthRepositoryImpl</text>
  <rect x="656" y="452" width="176" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="744" y="474" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="160">ProfileRepositoryImpl</text>
  <rect x="288" y="528" width="208" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="392" y="550" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="192">SupabaseAuthDataSource</text>
  <rect x="636" y="528" width="216" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="744" y="550" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="200">SupabaseProfileDataSource</text>
  <rect x="304" y="630" width="176" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="392" y="652" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="160">Supabase Auth</text>
  <rect x="656" y="630" width="176" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="744" y="652" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="160">tabla profiles</text>
  <text class="foot" x="48" y="732" data-fit="860">El mapa es el mismo en todos los pasos: solo cambia lo que está resaltado.</text>
</svg>
```

`auth/domain/entities/auth_user.dart` · `profile.dart`

`AuthUser` es lo que devuelve Auth: `id` y `email`. `Profile` es lo que guardas tú: ese mismo `id`, `username` y `fullName`. La contraseña no está en ninguna de las dos: solo viaja hasta Auth.

```dart
class AuthUser {
  final String id;
  final String email;

  const AuthUser({required this.id, required this.email});
}
```

```dart
class Profile {
  // TODO: id, username y fullName
}
```

## Paso 2 · Los dos contratos

```svg
<svg id="l5P2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 760" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="l5P2-ttl l5P2-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="l5P2-ttl">Paso 2 · Los dos contratos</title>
  <desc id="l5P2-dsc">El mapa del laboratorio en el paso 2. Se escribe: AuthRepository, ProfileRepository. Las piezas de los pasos anteriores aparecen marcadas como hechas y las de los pasos siguientes, atenuadas.</desc>
  <defs>
    <style>
      #l5P2 .title{fill:#161A26;font-size:22px;font-weight:700}
      #l5P2 .sub{fill:#79809A;font-size:13.5px}
      #l5P2 .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #l5P2 .foot{fill:#79809A;font-size:12px}
      #l5P2 .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #l5P2 .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #l5P2 .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#l5P2-arrow)}
    </style>
    <marker id="l5P2-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="760" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Paso 2 · Los dos contratos</text>
  <text class="sub" x="48" y="80" data-fit="860">Resaltado, lo que escribes en este paso. Con marca verde, lo que ya está. En gris, lo que falta.</text>
  <rect x="48" y="104" width="864" height="104" rx="14" fill="#F4EBFF" fill-opacity=".5" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="h" x="68" y="134" style="fill:#7439B8" data-fit="150">PRESENTACIÓN</text>
  <text x="68" y="154" font-size="12.5" fill="#454C61" data-fit="150">Pantallas y Bloc</text>
  <rect x="48" y="224" width="864" height="184" rx="14" fill="#FFF3DC" fill-opacity=".5" stroke="#F0C572" stroke-width="1.5"/>
  <text class="h" x="68" y="254" style="fill:#A96C05" data-fit="150">DOMINIO</text>
  <text x="68" y="274" font-size="12.5" fill="#454C61" data-fit="150">Reglas y contratos</text>
  <rect x="48" y="424" width="864" height="168" rx="14" fill="#E3F6F3" fill-opacity=".5" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="h" x="68" y="454" style="fill:#0F8478" data-fit="150">DATOS</text>
  <text x="68" y="474" font-size="12.5" fill="#454C61" data-fit="150">Habla con Supabase</text>
  <rect x="48" y="608" width="864" height="88" rx="14" fill="#EFF1F5" fill-opacity=".5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="h" x="68" y="638" style="fill:#556074" data-fit="150">SUPABASE</text>
  <text x="68" y="658" font-size="12.5" fill="#454C61" data-fit="150">Servicio externo</text>
  <path class="link" d="M480,162 H502"/>
  <path class="link" d="M352,162 H338"/>
  <path class="link" stroke-dasharray="5 4" d="M768,162 H634"/>
  <text x="700" y="152" text-anchor="middle" font-size="12" font-weight="600" fill="#556074">arma</text>
  <path class="link" d="M568,184 V254"/>
  <path class="link" d="M540,300 V318 H392 V338"/>
  <path class="link" d="M596,300 V318 H744 V338"/>
  <text x="530" y="334" text-anchor="end" font-size="12" font-weight="700" fill="#A96C05">1.º</text>
  <text x="606" y="334" font-size="12" font-weight="700" fill="#A96C05">2.º</text>
  <path class="link" stroke-dasharray="5 4" d="M392,452 V386"/>
  <path class="link" stroke-dasharray="5 4" d="M744,452 V386"/>
  <text x="402" y="441" font-size="12" font-weight="600" fill="#556074">implementa</text>
  <text x="754" y="441" font-size="12" font-weight="600" fill="#556074">implementa</text>
  <path class="link" d="M392,496 V526"/>
  <path class="link" d="M744,496 V526"/>
  <path class="link" d="M392,572 V628"/>
  <path class="link" d="M744,572 V628"/>
  <rect x="216" y="140" width="120" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="276" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="104">HomeScreen</text>
  <rect x="352" y="140" width="128" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="416" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="112">RegisterScreen</text>
  <rect x="504" y="140" width="128" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="568" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="112">RegisterBloc</text>
  <rect x="768" y="140" width="128" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="832" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="112">main.dart</text>
  <rect x="316" y="256" width="152" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="392" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="136">AuthUser</text>
  <circle cx="322" cy="258" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M317.5,258 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="492" y="256" width="152" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="568" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="136">SignUpUseCase</text>
  <rect x="668" y="256" width="152" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="744" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="136">Profile</text>
  <circle cx="674" cy="258" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M669.5,258 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="299" y="335" width="186" height="54" rx="14" fill="none" stroke="#4453C9" stroke-width="3"/>
  <rect x="304" y="340" width="176" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="392" y="362" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="160">AuthRepository</text>
  <circle cx="310" cy="342" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="310" y="342" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">2</text>
  <rect x="651" y="335" width="186" height="54" rx="14" fill="none" stroke="#4453C9" stroke-width="3"/>
  <rect x="656" y="340" width="176" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="744" y="362" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="160">ProfileRepository</text>
  <circle cx="662" cy="342" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="662" y="342" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">2</text>
  <rect x="304" y="452" width="176" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="392" y="474" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="160">AuthRepositoryImpl</text>
  <rect x="656" y="452" width="176" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="744" y="474" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="160">ProfileRepositoryImpl</text>
  <rect x="288" y="528" width="208" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="392" y="550" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="192">SupabaseAuthDataSource</text>
  <rect x="636" y="528" width="216" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="744" y="550" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="200">SupabaseProfileDataSource</text>
  <rect x="304" y="630" width="176" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="392" y="652" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="160">Supabase Auth</text>
  <rect x="656" y="630" width="176" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="744" y="652" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="160">tabla profiles</text>
  <text class="foot" x="48" y="732" data-fit="860">El mapa es el mismo en todos los pasos: solo cambia lo que está resaltado.</text>
</svg>
```

`auth/domain/repository/auth_repository.dart` · `profile_repository.dart`

Un contrato dice qué se puede pedir, sin decir quién lo cumple. Hay uno por destino, y cada uno habla con su propia entidad.

```dart
abstract class AuthRepository {
  Future<AuthUser> signUp({
    required String email,
    required String password,
  });
}
```

```dart
abstract class ProfileRepository {
  Future<void> createProfile(Profile profile);
}
```

## Paso 3 · SignUpUseCase

```svg
<svg id="l5P3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 760" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="l5P3-ttl l5P3-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="l5P3-ttl">Paso 3 · SignUpUseCase</title>
  <desc id="l5P3-dsc">El mapa del laboratorio en el paso 3. Se escribe: SignUpUseCase. Las piezas de los pasos anteriores aparecen marcadas como hechas y las de los pasos siguientes, atenuadas.</desc>
  <defs>
    <style>
      #l5P3 .title{fill:#161A26;font-size:22px;font-weight:700}
      #l5P3 .sub{fill:#79809A;font-size:13.5px}
      #l5P3 .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #l5P3 .foot{fill:#79809A;font-size:12px}
      #l5P3 .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #l5P3 .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #l5P3 .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#l5P3-arrow)}
    </style>
    <marker id="l5P3-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="760" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Paso 3 · SignUpUseCase</text>
  <text class="sub" x="48" y="80" data-fit="860">Resaltado, lo que escribes en este paso. Con marca verde, lo que ya está. En gris, lo que falta.</text>
  <rect x="48" y="104" width="864" height="104" rx="14" fill="#F4EBFF" fill-opacity=".5" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="h" x="68" y="134" style="fill:#7439B8" data-fit="150">PRESENTACIÓN</text>
  <text x="68" y="154" font-size="12.5" fill="#454C61" data-fit="150">Pantallas y Bloc</text>
  <rect x="48" y="224" width="864" height="184" rx="14" fill="#FFF3DC" fill-opacity=".5" stroke="#F0C572" stroke-width="1.5"/>
  <text class="h" x="68" y="254" style="fill:#A96C05" data-fit="150">DOMINIO</text>
  <text x="68" y="274" font-size="12.5" fill="#454C61" data-fit="150">Reglas y contratos</text>
  <rect x="48" y="424" width="864" height="168" rx="14" fill="#E3F6F3" fill-opacity=".5" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="h" x="68" y="454" style="fill:#0F8478" data-fit="150">DATOS</text>
  <text x="68" y="474" font-size="12.5" fill="#454C61" data-fit="150">Habla con Supabase</text>
  <rect x="48" y="608" width="864" height="88" rx="14" fill="#EFF1F5" fill-opacity=".5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="h" x="68" y="638" style="fill:#556074" data-fit="150">SUPABASE</text>
  <text x="68" y="658" font-size="12.5" fill="#454C61" data-fit="150">Servicio externo</text>
  <path class="link" d="M480,162 H502"/>
  <path class="link" d="M352,162 H338"/>
  <path class="link" stroke-dasharray="5 4" d="M768,162 H634"/>
  <text x="700" y="152" text-anchor="middle" font-size="12" font-weight="600" fill="#556074">arma</text>
  <path class="link" d="M568,184 V254"/>
  <path class="link" d="M540,300 V318 H392 V338"/>
  <path class="link" d="M596,300 V318 H744 V338"/>
  <text x="530" y="334" text-anchor="end" font-size="12" font-weight="700" fill="#A96C05">1.º</text>
  <text x="606" y="334" font-size="12" font-weight="700" fill="#A96C05">2.º</text>
  <path class="link" stroke-dasharray="5 4" d="M392,452 V386"/>
  <path class="link" stroke-dasharray="5 4" d="M744,452 V386"/>
  <text x="402" y="441" font-size="12" font-weight="600" fill="#556074">implementa</text>
  <text x="754" y="441" font-size="12" font-weight="600" fill="#556074">implementa</text>
  <path class="link" d="M392,496 V526"/>
  <path class="link" d="M744,496 V526"/>
  <path class="link" d="M392,572 V628"/>
  <path class="link" d="M744,572 V628"/>
  <rect x="216" y="140" width="120" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="276" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="104">HomeScreen</text>
  <rect x="352" y="140" width="128" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="416" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="112">RegisterScreen</text>
  <rect x="504" y="140" width="128" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="568" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="112">RegisterBloc</text>
  <rect x="768" y="140" width="128" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="832" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="112">main.dart</text>
  <rect x="316" y="256" width="152" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="392" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="136">AuthUser</text>
  <circle cx="322" cy="258" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M317.5,258 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="487" y="251" width="162" height="54" rx="14" fill="none" stroke="#A96C05" stroke-width="3"/>
  <rect x="492" y="256" width="152" height="44" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="568" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="136">SignUpUseCase</text>
  <circle cx="498" cy="258" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="498" y="258" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">3</text>
  <rect x="668" y="256" width="152" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="744" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="136">Profile</text>
  <circle cx="674" cy="258" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M669.5,258 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="304" y="340" width="176" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="392" y="362" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="160">AuthRepository</text>
  <circle cx="310" cy="342" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M305.5,342 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="656" y="340" width="176" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="744" y="362" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="160">ProfileRepository</text>
  <circle cx="662" cy="342" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M657.5,342 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="304" y="452" width="176" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="392" y="474" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="160">AuthRepositoryImpl</text>
  <rect x="656" y="452" width="176" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="744" y="474" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="160">ProfileRepositoryImpl</text>
  <rect x="288" y="528" width="208" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="392" y="550" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="192">SupabaseAuthDataSource</text>
  <rect x="636" y="528" width="216" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="744" y="550" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="200">SupabaseProfileDataSource</text>
  <rect x="304" y="630" width="176" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="392" y="652" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="160">Supabase Auth</text>
  <rect x="656" y="630" width="176" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="744" y="652" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="160">tabla profiles</text>
  <text class="foot" x="48" y="732" data-fit="860">El mapa es el mismo en todos los pasos: solo cambia lo que está resaltado.</text>
</svg>
```

`auth/domain/usecases/sign_up_usecase.dart`

Es la única pieza que conoce los dos contratos, y la que decide el orden: primero la cuenta y después el perfil, con el `id` que devolvió Auth.

```dart
class SignUpUseCase {
  final AuthRepository _auth;
  final ProfileRepository _profiles;

  SignUpUseCase(this._auth, this._profiles);

  Future<Profile> call({
    required String username,
    required String fullName,
    required String email,
    required String password,
  }) async {
    final user = await _auth.signUp(email: email, password: password);
    final profile = Profile(id: user.id, username: username, fullName: fullName);
    // TODO: guardar el perfil con _profiles y devolverlo
  }
}
```

Si `createProfile` falla, la cuenta ya existe y quedó sin perfil. Atrapar esa excepción y decidir qué hacer le toca a este `UseCase`, no al `Bloc`. La lección *Laboratorio 5 a nivel conceptual* muestra una salida.

## Paso 4 · Los datos de Auth

```svg
<svg id="l5P4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 760" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="l5P4-ttl l5P4-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="l5P4-ttl">Paso 4 · Los datos de Auth</title>
  <desc id="l5P4-dsc">El mapa del laboratorio en el paso 4. Se escribe: AuthRepositoryImpl, SupabaseAuthDataSource. Las piezas de los pasos anteriores aparecen marcadas como hechas y las de los pasos siguientes, atenuadas.</desc>
  <defs>
    <style>
      #l5P4 .title{fill:#161A26;font-size:22px;font-weight:700}
      #l5P4 .sub{fill:#79809A;font-size:13.5px}
      #l5P4 .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #l5P4 .foot{fill:#79809A;font-size:12px}
      #l5P4 .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #l5P4 .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #l5P4 .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#l5P4-arrow)}
    </style>
    <marker id="l5P4-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="760" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Paso 4 · Los datos de Auth</text>
  <text class="sub" x="48" y="80" data-fit="860">Resaltado, lo que escribes en este paso. Con marca verde, lo que ya está. En gris, lo que falta.</text>
  <rect x="48" y="104" width="864" height="104" rx="14" fill="#F4EBFF" fill-opacity=".5" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="h" x="68" y="134" style="fill:#7439B8" data-fit="150">PRESENTACIÓN</text>
  <text x="68" y="154" font-size="12.5" fill="#454C61" data-fit="150">Pantallas y Bloc</text>
  <rect x="48" y="224" width="864" height="184" rx="14" fill="#FFF3DC" fill-opacity=".5" stroke="#F0C572" stroke-width="1.5"/>
  <text class="h" x="68" y="254" style="fill:#A96C05" data-fit="150">DOMINIO</text>
  <text x="68" y="274" font-size="12.5" fill="#454C61" data-fit="150">Reglas y contratos</text>
  <rect x="48" y="424" width="864" height="168" rx="14" fill="#E3F6F3" fill-opacity=".5" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="h" x="68" y="454" style="fill:#0F8478" data-fit="150">DATOS</text>
  <text x="68" y="474" font-size="12.5" fill="#454C61" data-fit="150">Habla con Supabase</text>
  <rect x="48" y="608" width="864" height="88" rx="14" fill="#EFF1F5" fill-opacity=".5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="h" x="68" y="638" style="fill:#556074" data-fit="150">SUPABASE</text>
  <text x="68" y="658" font-size="12.5" fill="#454C61" data-fit="150">Servicio externo</text>
  <path class="link" d="M480,162 H502"/>
  <path class="link" d="M352,162 H338"/>
  <path class="link" stroke-dasharray="5 4" d="M768,162 H634"/>
  <text x="700" y="152" text-anchor="middle" font-size="12" font-weight="600" fill="#556074">arma</text>
  <path class="link" d="M568,184 V254"/>
  <path class="link" d="M540,300 V318 H392 V338"/>
  <path class="link" d="M596,300 V318 H744 V338"/>
  <text x="530" y="334" text-anchor="end" font-size="12" font-weight="700" fill="#A96C05">1.º</text>
  <text x="606" y="334" font-size="12" font-weight="700" fill="#A96C05">2.º</text>
  <path class="link" stroke-dasharray="5 4" d="M392,452 V386"/>
  <path class="link" stroke-dasharray="5 4" d="M744,452 V386"/>
  <text x="402" y="441" font-size="12" font-weight="600" fill="#556074">implementa</text>
  <text x="754" y="441" font-size="12" font-weight="600" fill="#556074">implementa</text>
  <path class="link" d="M392,496 V526"/>
  <path class="link" d="M744,496 V526"/>
  <path class="link" d="M392,572 V628"/>
  <path class="link" d="M744,572 V628"/>
  <rect x="216" y="140" width="120" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="276" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="104">HomeScreen</text>
  <rect x="352" y="140" width="128" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="416" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="112">RegisterScreen</text>
  <rect x="504" y="140" width="128" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="568" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="112">RegisterBloc</text>
  <rect x="768" y="140" width="128" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="832" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="112">main.dart</text>
  <rect x="316" y="256" width="152" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="392" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="136">AuthUser</text>
  <circle cx="322" cy="258" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M317.5,258 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="492" y="256" width="152" height="44" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="568" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="136">SignUpUseCase</text>
  <circle cx="498" cy="258" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M493.5,258 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="668" y="256" width="152" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="744" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="136">Profile</text>
  <circle cx="674" cy="258" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M669.5,258 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="304" y="340" width="176" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="392" y="362" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="160">AuthRepository</text>
  <circle cx="310" cy="342" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M305.5,342 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="656" y="340" width="176" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="744" y="362" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="160">ProfileRepository</text>
  <circle cx="662" cy="342" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M657.5,342 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="299" y="447" width="186" height="54" rx="14" fill="none" stroke="#0F8478" stroke-width="3"/>
  <rect x="304" y="452" width="176" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="392" y="474" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="160">AuthRepositoryImpl</text>
  <circle cx="310" cy="454" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="310" y="454" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">4</text>
  <rect x="656" y="452" width="176" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="744" y="474" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="160">ProfileRepositoryImpl</text>
  <rect x="283" y="523" width="218" height="54" rx="14" fill="none" stroke="#0F8478" stroke-width="3"/>
  <rect x="288" y="528" width="208" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="392" y="550" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="192">SupabaseAuthDataSource</text>
  <circle cx="294" cy="530" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="294" y="530" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">4</text>
  <rect x="636" y="528" width="216" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="744" y="550" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="200">SupabaseProfileDataSource</text>
  <rect x="304" y="630" width="176" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="392" y="652" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="160">Supabase Auth</text>
  <rect x="656" y="630" width="176" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="744" y="652" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="160">tabla profiles</text>
  <text class="foot" x="48" y="732" data-fit="860">El mapa es el mismo en todos los pasos: solo cambia lo que está resaltado.</text>
</svg>
```

`auth/data/source/supabase_auth_data_source.dart`

El único archivo que usa el SDK de Auth. Convierte la respuesta de Supabase en tu `AuthUser`.

```dart
class SupabaseAuthDataSource {
  final SupabaseClient _client;

  SupabaseAuthDataSource(this._client);

  Future<AuthUser> signUp({
    required String email,
    required String password,
  }) async {
    final response = await _client.auth.signUp(email: email, password: password);
    // TODO: convertir response.user en un AuthUser
  }
}
```

- `signUp` lanza `AuthException` si algo falla, por ejemplo si el correo ya está registrado.
- `response.user` puede ser `null`. Valídalo antes de usar `user!`, o verás `Null check operator used on a null value`.

`auth/data/repository/auth_repository_impl.dart`

Cumple el contrato delegando en el data source.

```dart
class AuthRepositoryImpl implements AuthRepository {
  final SupabaseAuthDataSource _dataSource;

  AuthRepositoryImpl(this._dataSource);

  @override
  Future<AuthUser> signUp({
    required String email,
    required String password,
  }) {
    // TODO
  }
}
```

## Paso 5 · Los datos del perfil

```svg
<svg id="l5P5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 760" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="l5P5-ttl l5P5-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="l5P5-ttl">Paso 5 · Los datos del perfil</title>
  <desc id="l5P5-dsc">El mapa del laboratorio en el paso 5. Se escribe: ProfileRepositoryImpl, SupabaseProfileDataSource. Las piezas de los pasos anteriores aparecen marcadas como hechas y las de los pasos siguientes, atenuadas.</desc>
  <defs>
    <style>
      #l5P5 .title{fill:#161A26;font-size:22px;font-weight:700}
      #l5P5 .sub{fill:#79809A;font-size:13.5px}
      #l5P5 .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #l5P5 .foot{fill:#79809A;font-size:12px}
      #l5P5 .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #l5P5 .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #l5P5 .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#l5P5-arrow)}
    </style>
    <marker id="l5P5-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="760" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Paso 5 · Los datos del perfil</text>
  <text class="sub" x="48" y="80" data-fit="860">Resaltado, lo que escribes en este paso. Con marca verde, lo que ya está. En gris, lo que falta.</text>
  <rect x="48" y="104" width="864" height="104" rx="14" fill="#F4EBFF" fill-opacity=".5" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="h" x="68" y="134" style="fill:#7439B8" data-fit="150">PRESENTACIÓN</text>
  <text x="68" y="154" font-size="12.5" fill="#454C61" data-fit="150">Pantallas y Bloc</text>
  <rect x="48" y="224" width="864" height="184" rx="14" fill="#FFF3DC" fill-opacity=".5" stroke="#F0C572" stroke-width="1.5"/>
  <text class="h" x="68" y="254" style="fill:#A96C05" data-fit="150">DOMINIO</text>
  <text x="68" y="274" font-size="12.5" fill="#454C61" data-fit="150">Reglas y contratos</text>
  <rect x="48" y="424" width="864" height="168" rx="14" fill="#E3F6F3" fill-opacity=".5" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="h" x="68" y="454" style="fill:#0F8478" data-fit="150">DATOS</text>
  <text x="68" y="474" font-size="12.5" fill="#454C61" data-fit="150">Habla con Supabase</text>
  <rect x="48" y="608" width="864" height="88" rx="14" fill="#EFF1F5" fill-opacity=".5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="h" x="68" y="638" style="fill:#556074" data-fit="150">SUPABASE</text>
  <text x="68" y="658" font-size="12.5" fill="#454C61" data-fit="150">Servicio externo</text>
  <path class="link" d="M480,162 H502"/>
  <path class="link" d="M352,162 H338"/>
  <path class="link" stroke-dasharray="5 4" d="M768,162 H634"/>
  <text x="700" y="152" text-anchor="middle" font-size="12" font-weight="600" fill="#556074">arma</text>
  <path class="link" d="M568,184 V254"/>
  <path class="link" d="M540,300 V318 H392 V338"/>
  <path class="link" d="M596,300 V318 H744 V338"/>
  <text x="530" y="334" text-anchor="end" font-size="12" font-weight="700" fill="#A96C05">1.º</text>
  <text x="606" y="334" font-size="12" font-weight="700" fill="#A96C05">2.º</text>
  <path class="link" stroke-dasharray="5 4" d="M392,452 V386"/>
  <path class="link" stroke-dasharray="5 4" d="M744,452 V386"/>
  <text x="402" y="441" font-size="12" font-weight="600" fill="#556074">implementa</text>
  <text x="754" y="441" font-size="12" font-weight="600" fill="#556074">implementa</text>
  <path class="link" d="M392,496 V526"/>
  <path class="link" d="M744,496 V526"/>
  <path class="link" d="M392,572 V628"/>
  <path class="link" d="M744,572 V628"/>
  <rect x="216" y="140" width="120" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="276" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="104">HomeScreen</text>
  <rect x="352" y="140" width="128" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="416" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="112">RegisterScreen</text>
  <rect x="504" y="140" width="128" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="568" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="112">RegisterBloc</text>
  <rect x="768" y="140" width="128" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="832" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="112">main.dart</text>
  <rect x="316" y="256" width="152" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="392" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="136">AuthUser</text>
  <circle cx="322" cy="258" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M317.5,258 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="492" y="256" width="152" height="44" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="568" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="136">SignUpUseCase</text>
  <circle cx="498" cy="258" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M493.5,258 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="668" y="256" width="152" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="744" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="136">Profile</text>
  <circle cx="674" cy="258" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M669.5,258 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="304" y="340" width="176" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="392" y="362" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="160">AuthRepository</text>
  <circle cx="310" cy="342" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M305.5,342 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="656" y="340" width="176" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="744" y="362" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="160">ProfileRepository</text>
  <circle cx="662" cy="342" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M657.5,342 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="304" y="452" width="176" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="392" y="474" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="160">AuthRepositoryImpl</text>
  <circle cx="310" cy="454" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M305.5,454 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="651" y="447" width="186" height="54" rx="14" fill="none" stroke="#0F8478" stroke-width="3"/>
  <rect x="656" y="452" width="176" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="744" y="474" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="160">ProfileRepositoryImpl</text>
  <circle cx="662" cy="454" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="662" y="454" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">5</text>
  <rect x="288" y="528" width="208" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="392" y="550" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="192">SupabaseAuthDataSource</text>
  <circle cx="294" cy="530" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M289.5,530 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="631" y="523" width="226" height="54" rx="14" fill="none" stroke="#0F8478" stroke-width="3"/>
  <rect x="636" y="528" width="216" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="744" y="550" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="200">SupabaseProfileDataSource</text>
  <circle cx="642" cy="530" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="642" y="530" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">5</text>
  <rect x="304" y="630" width="176" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="392" y="652" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="160">Supabase Auth</text>
  <rect x="656" y="630" width="176" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="744" y="652" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="160">tabla profiles</text>
  <text class="foot" x="48" y="732" data-fit="860">El mapa es el mismo en todos los pasos: solo cambia lo que está resaltado.</text>
</svg>
```

```svg
<svg id="l5Tabla" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 424" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="l5Tabla-ttl l5Tabla-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="l5Tabla-ttl">La tabla profiles</title>
  <desc id="l5Tabla-dsc">Dos tablas. auth.users la maneja Supabase Auth y tiene id y email. profiles la creas tú y tiene id, username y full_name. El id de profiles es llave primaria y a la vez referencia al id de auth.users: cada perfil lleva el mismo id de su cuenta.</desc>
  <defs>
    <style>
      #l5Tabla .title{fill:#161A26;font-size:22px;font-weight:700}
      #l5Tabla .sub{fill:#79809A;font-size:13.5px}
      #l5Tabla .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #l5Tabla .foot{fill:#79809A;font-size:12px}
      #l5Tabla .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #l5Tabla .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #l5Tabla .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#l5Tabla-arrow)}
    </style>
    <marker id="l5Tabla-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="424" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">La tabla <tspan class="mono">profiles</tspan></text>
  <text class="sub" x="48" y="80" data-fit="860">Supabase Auth guarda la cuenta. El username y el nombre van en una tabla tuya, unida a la cuenta por el mismo id.</text>
  <rect x="96" y="116" width="296" height="164" rx="12" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="2"/>
  <path d="M96,160 V128 A12,12 0 0 1 108,116 H380 A12,12 0 0 1 392,128 V160 Z" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="2"/>
  <text class="mono" x="112" y="138" dy="0.35em" font-size="14" font-weight="700" fill="#556074">auth.users</text>
  <text x="376" y="138" dy="0.35em" text-anchor="end" font-size="12" fill="#454C61" data-fit="150">la maneja Supabase Auth</text>
  <text class="mono" x="112" y="180" dy="0.35em" font-size="13.5" font-weight="700" fill="#161A26">id</text>
  <text class="mono" x="226" y="180" dy="0.35em" font-size="12.5" fill="#79809A">uuid</text>
  <rect x="345" y="169" width="31" height="22" rx="11" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text x="361" y="180" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#A96C05">PK</text>
  <path d="M97,200 H391" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="112" y="220" dy="0.35em" font-size="13.5" font-weight="400" fill="#161A26">email</text>
  <text class="mono" x="226" y="220" dy="0.35em" font-size="12.5" fill="#79809A">text</text>
  <path d="M97,240 H391" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="112" y="260" dy="0.35em" font-size="13.5" font-weight="400" fill="#161A26">…</text>
  <text class="mono" x="226" y="260" dy="0.35em" font-size="12.5" fill="#79809A"></text>
  <rect x="568" y="116" width="296" height="164" rx="12" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="2"/>
  <path d="M568,160 V128 A12,12 0 0 1 580,116 H852 A12,12 0 0 1 864,128 V160 Z" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="2"/>
  <text class="mono" x="584" y="138" dy="0.35em" font-size="14" font-weight="700" fill="#4453C9">profiles</text>
  <text x="848" y="138" dy="0.35em" text-anchor="end" font-size="12" fill="#454C61" data-fit="150">la creaste tú</text>
  <text class="mono" x="584" y="180" dy="0.35em" font-size="13.5" font-weight="700" fill="#161A26">id</text>
  <text class="mono" x="698" y="180" dy="0.35em" font-size="12.5" fill="#79809A">uuid</text>
  <rect x="780" y="169" width="68" height="22" rx="11" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text x="814" y="180" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#A96C05">PK · FK</text>
  <path d="M569,200 H863" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="584" y="220" dy="0.35em" font-size="13.5" font-weight="400" fill="#161A26">username</text>
  <text class="mono" x="698" y="220" dy="0.35em" font-size="12.5" fill="#79809A">text</text>
  <path d="M569,240 H863" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="584" y="260" dy="0.35em" font-size="13.5" font-weight="400" fill="#161A26">full_name</text>
  <text class="mono" x="698" y="260" dy="0.35em" font-size="12.5" fill="#79809A">text</text>
  <path class="link" d="M568,180 H394"/>
  <text x="480" y="170" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">el mismo id</text>
  <text x="480" y="200" text-anchor="middle" font-size="12" fill="#454C61">references</text>
  <g transform="translate(96,300)"><rect width="296" height="60" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#556074" data-fit="268">Paso 1 del registro</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="268">signUp crea esta fila y devuelve su id.</text></g>
  <g transform="translate(568,300)"><rect width="296" height="77" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#4453C9" data-fit="268">Paso 2 del registro</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="268">createProfile inserta aquí ese mismo id</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="268">junto con username y full_name.</text></g>
  <text class="foot" x="48" y="396" data-fit="860">on delete cascade: si se borra la cuenta, su perfil se borra con ella.</text>
</svg>
```

Es la tabla que creaste en *Configurando los servicios*, con su permiso. Comprueba en el `Table Editor` del dashboard que existe antes de seguir. Si falta, o si le falta el `grant`, el `insert` falla con `permission denied for table profiles`.

La tabla tiene tres columnas: `id`, `username` y `full_name`. Si la creaste cuando todavía no tenía `full_name`, agrégala con otra migración:

```shell
npx supabase migration new add_full_name_to_profiles
```

```sql
alter table public.profiles add column full_name text not null default '';
```

```shell
npx supabase db push
```

`auth/data/source/supabase_profile_data_source.dart`

En Dart el campo se llama `fullName`; en la tabla, la columna es `full_name`. Este archivo es el único que conoce esa diferencia.

```dart
class SupabaseProfileDataSource {
  final SupabaseClient _client;

  SupabaseProfileDataSource(this._client);

  Future<void> createProfile(Profile profile) async {
    await _client.from('profiles').insert({
      'id': profile.id,
      'username': profile.username,
      'full_name': profile.fullName,
    });
  }
}
```

El `insert` funciona porque después de `signUp` ya hay una sesión, y el `grant` de la tabla deja escribir a quien la inició.

`auth/data/repository/profile_repository_impl.dart`

`ProfileRepositoryImpl` cumple su contrato igual que `AuthRepositoryImpl`: recibe el data source por constructor y delega en él.

## Paso 6 · RegisterBloc

```svg
<svg id="l5P6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 760" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="l5P6-ttl l5P6-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="l5P6-ttl">Paso 6 · RegisterBloc</title>
  <desc id="l5P6-dsc">El mapa del laboratorio en el paso 6. Se escribe: RegisterBloc. Las piezas de los pasos anteriores aparecen marcadas como hechas y las de los pasos siguientes, atenuadas.</desc>
  <defs>
    <style>
      #l5P6 .title{fill:#161A26;font-size:22px;font-weight:700}
      #l5P6 .sub{fill:#79809A;font-size:13.5px}
      #l5P6 .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #l5P6 .foot{fill:#79809A;font-size:12px}
      #l5P6 .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #l5P6 .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #l5P6 .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#l5P6-arrow)}
    </style>
    <marker id="l5P6-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="760" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Paso 6 · RegisterBloc</text>
  <text class="sub" x="48" y="80" data-fit="860">Resaltado, lo que escribes en este paso. Con marca verde, lo que ya está. En gris, lo que falta.</text>
  <rect x="48" y="104" width="864" height="104" rx="14" fill="#F4EBFF" fill-opacity=".5" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="h" x="68" y="134" style="fill:#7439B8" data-fit="150">PRESENTACIÓN</text>
  <text x="68" y="154" font-size="12.5" fill="#454C61" data-fit="150">Pantallas y Bloc</text>
  <rect x="48" y="224" width="864" height="184" rx="14" fill="#FFF3DC" fill-opacity=".5" stroke="#F0C572" stroke-width="1.5"/>
  <text class="h" x="68" y="254" style="fill:#A96C05" data-fit="150">DOMINIO</text>
  <text x="68" y="274" font-size="12.5" fill="#454C61" data-fit="150">Reglas y contratos</text>
  <rect x="48" y="424" width="864" height="168" rx="14" fill="#E3F6F3" fill-opacity=".5" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="h" x="68" y="454" style="fill:#0F8478" data-fit="150">DATOS</text>
  <text x="68" y="474" font-size="12.5" fill="#454C61" data-fit="150">Habla con Supabase</text>
  <rect x="48" y="608" width="864" height="88" rx="14" fill="#EFF1F5" fill-opacity=".5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="h" x="68" y="638" style="fill:#556074" data-fit="150">SUPABASE</text>
  <text x="68" y="658" font-size="12.5" fill="#454C61" data-fit="150">Servicio externo</text>
  <path class="link" d="M480,162 H502"/>
  <path class="link" d="M352,162 H338"/>
  <path class="link" stroke-dasharray="5 4" d="M768,162 H634"/>
  <text x="700" y="152" text-anchor="middle" font-size="12" font-weight="600" fill="#556074">arma</text>
  <path class="link" d="M568,184 V254"/>
  <path class="link" d="M540,300 V318 H392 V338"/>
  <path class="link" d="M596,300 V318 H744 V338"/>
  <text x="530" y="334" text-anchor="end" font-size="12" font-weight="700" fill="#A96C05">1.º</text>
  <text x="606" y="334" font-size="12" font-weight="700" fill="#A96C05">2.º</text>
  <path class="link" stroke-dasharray="5 4" d="M392,452 V386"/>
  <path class="link" stroke-dasharray="5 4" d="M744,452 V386"/>
  <text x="402" y="441" font-size="12" font-weight="600" fill="#556074">implementa</text>
  <text x="754" y="441" font-size="12" font-weight="600" fill="#556074">implementa</text>
  <path class="link" d="M392,496 V526"/>
  <path class="link" d="M744,496 V526"/>
  <path class="link" d="M392,572 V628"/>
  <path class="link" d="M744,572 V628"/>
  <rect x="216" y="140" width="120" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="276" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="104">HomeScreen</text>
  <rect x="352" y="140" width="128" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="416" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="112">RegisterScreen</text>
  <rect x="499" y="135" width="138" height="54" rx="14" fill="none" stroke="#7439B8" stroke-width="3"/>
  <rect x="504" y="140" width="128" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="568" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="112">RegisterBloc</text>
  <circle cx="510" cy="142" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="510" y="142" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">6</text>
  <rect x="768" y="140" width="128" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="832" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="112">main.dart</text>
  <rect x="316" y="256" width="152" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="392" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="136">AuthUser</text>
  <circle cx="322" cy="258" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M317.5,258 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="492" y="256" width="152" height="44" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="568" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="136">SignUpUseCase</text>
  <circle cx="498" cy="258" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M493.5,258 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="668" y="256" width="152" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="744" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="136">Profile</text>
  <circle cx="674" cy="258" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M669.5,258 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="304" y="340" width="176" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="392" y="362" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="160">AuthRepository</text>
  <circle cx="310" cy="342" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M305.5,342 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="656" y="340" width="176" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="744" y="362" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="160">ProfileRepository</text>
  <circle cx="662" cy="342" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M657.5,342 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="304" y="452" width="176" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="392" y="474" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="160">AuthRepositoryImpl</text>
  <circle cx="310" cy="454" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M305.5,454 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="656" y="452" width="176" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="744" y="474" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="160">ProfileRepositoryImpl</text>
  <circle cx="662" cy="454" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M657.5,454 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="288" y="528" width="208" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="392" y="550" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="192">SupabaseAuthDataSource</text>
  <circle cx="294" cy="530" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M289.5,530 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="636" y="528" width="216" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="744" y="550" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="200">SupabaseProfileDataSource</text>
  <circle cx="642" cy="530" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M637.5,530 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="304" y="630" width="176" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="392" y="652" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="160">Supabase Auth</text>
  <rect x="656" y="630" width="176" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="744" y="652" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="160">tabla profiles</text>
  <text class="foot" x="48" y="732" data-fit="860">El mapa es el mismo en todos los pasos: solo cambia lo que está resaltado.</text>
</svg>
```

`register/ui/bloc/register_event.dart` · `register_state.dart` · `register_bloc.dart`

```svg
<svg id="l5Estado" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="l5Estado-ttl l5Estado-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="l5Estado-ttl">Un solo estado, cuatro momentos</title>
  <desc id="l5Estado-dsc">Cuatro columnas, una por valor de RegisterStatus. En initial la pantalla muestra el formulario. En loading, el formulario con un indicador de progreso en lugar del botón; copyWith cambia solo status. En success la app navega a la pantalla de inicio; copyWith cambia status y profile. En failure vuelve el formulario con el mensaje de error; copyWith cambia status y errorMessage.</desc>
  <defs>
    <style>
      #l5Estado .title{fill:#161A26;font-size:22px;font-weight:700}
      #l5Estado .sub{fill:#79809A;font-size:13.5px}
      #l5Estado .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #l5Estado .foot{fill:#79809A;font-size:12px}
      #l5Estado .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #l5Estado .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #l5Estado .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#l5Estado-arrow)}
    </style>
    <marker id="l5Estado-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="540" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Un solo estado, cuatro momentos</text>
  <text class="sub" x="48" y="80" data-fit="860">RegisterState es una sola clase. El momento lo dice el campo status, y copyWith cambia solo lo que hace falta.</text>
  <rect x="54" y="108" width="192" height="36" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="150" y="126" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#556074" data-fit="176">status: initial</text>
  <path class="link" d="M150,144 V166"/>
  <rect x="70" y="170" width="160" height="216" rx="18" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/><text x="86" y="194" dy="0.35em" font-size="14" font-weight="600" fill="#161A26">Crear cuenta</text><path d="M72,212 H228" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="86" y="228" width="128" height="26" rx="6" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="96" y="241" dy="0.35em" font-size="12" fill="#79809A">correo</text>
  <rect x="86" y="264" width="128" height="26" rx="6" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="96" y="277" dy="0.35em" font-size="12" fill="#79809A">contraseña</text>
  <rect x="86" y="306" width="128" height="28" rx="14" fill="#4453C9"/>
  <text x="150" y="320" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#FFFFFF">Registrarme</text>
  <text class="h" x="150" y="414" text-anchor="middle">SE CREA CON</text>
  <rect x="54" y="424" width="192" height="26" rx="6" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.25"/>
  <text class="mono" x="150" y="437" dy="0.35em" text-anchor="middle" font-size="12" font-weight="600" fill="#556074" data-fit="180">const RegisterState()</text>
  <text x="150" y="468" text-anchor="middle" font-size="12.5" fill="#454C61" data-fit="190">el estado de arranque</text>
  <rect x="274" y="108" width="192" height="36" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="370" y="126" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#A96C05" data-fit="176">status: loading</text>
  <path class="link" d="M370,144 V166"/>
  <rect x="290" y="170" width="160" height="216" rx="18" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/><text x="306" y="194" dy="0.35em" font-size="14" font-weight="600" fill="#161A26">Crear cuenta</text><path d="M292,212 H448" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="306" y="228" width="128" height="26" rx="6" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="316" y="241" dy="0.35em" font-size="12" fill="#79809A">correo</text>
  <rect x="306" y="264" width="128" height="26" rx="6" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="316" y="277" dy="0.35em" font-size="12" fill="#79809A">contraseña</text>
  <circle cx="370" cy="320" r="13" fill="none" stroke="#FFF3DC" stroke-width="5"/><path d="M370,307 A13,13 0 0 1 383,320" fill="none" stroke="#A96C05" stroke-width="5" stroke-linecap="round"/>
  <text class="h" x="370" y="414" text-anchor="middle">copyWith CAMBIA</text>
  <rect x="274" y="424" width="192" height="26" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text class="mono" x="370" y="437" dy="0.35em" text-anchor="middle" font-size="12" font-weight="600" fill="#A96C05" data-fit="180">status</text>
  <text x="370" y="468" text-anchor="middle" font-size="12.5" fill="#454C61" data-fit="190">lo demás se conserva</text>
  <rect x="494" y="108" width="192" height="36" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="590" y="126" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#3A8235" data-fit="176">status: success</text>
  <path class="link" d="M590,144 V166"/>
  <rect x="510" y="170" width="160" height="216" rx="18" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/><text x="526" y="194" dy="0.35em" font-size="14" font-weight="600" fill="#161A26">Perfil</text><path d="M512,212 H668" stroke="#D9DEE8" stroke-width="1.5"/>
  <circle cx="590" cy="274" r="18" fill="#E8F6E3" stroke="#3A8235" stroke-width="2"/>
  <path d="M582,274 l6,6 l11,-12" fill="none" stroke="#3A8235" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="590" y="318" dy="0.35em" text-anchor="middle" font-size="13" fill="#161A26" data-fit="140">@ana.dev</text>
  <text class="h" x="590" y="414" text-anchor="middle">copyWith CAMBIA</text>
  <rect x="494" y="424" width="192" height="26" rx="6" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>
  <text class="mono" x="590" y="437" dy="0.35em" text-anchor="middle" font-size="12" font-weight="600" fill="#3A8235" data-fit="180">status · profile</text>
  <text x="590" y="468" text-anchor="middle" font-size="12.5" fill="#454C61" data-fit="190">llega el Profile</text>
  <rect x="714" y="108" width="192" height="36" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text class="mono" x="810" y="126" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#C2354F" data-fit="176">status: failure</text>
  <path class="link" d="M810,144 V166"/>
  <rect x="730" y="170" width="160" height="216" rx="18" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/><text x="746" y="194" dy="0.35em" font-size="14" font-weight="600" fill="#161A26">Crear cuenta</text><path d="M732,212 H888" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="746" y="228" width="128" height="26" rx="6" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="756" y="241" dy="0.35em" font-size="12" fill="#79809A">correo</text>
  <rect x="746" y="264" width="128" height="26" rx="6" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="756" y="277" dy="0.35em" font-size="12" fill="#79809A">contraseña</text>
  <rect x="746" y="306" width="128" height="28" rx="14" fill="#4453C9"/>
  <text x="810" y="320" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#FFFFFF">Registrarme</text>
  <text x="810" y="358" dy="0.35em" text-anchor="middle" font-size="12" font-weight="600" fill="#C2354F" data-fit="140">El correo ya existe</text>
  <text class="h" x="810" y="414" text-anchor="middle">copyWith CAMBIA</text>
  <rect x="714" y="424" width="192" height="26" rx="6" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.25"/>
  <text class="mono" x="810" y="437" dy="0.35em" text-anchor="middle" font-size="12" font-weight="600" fill="#C2354F" data-fit="180">status · errorMessage</text>
  <text x="810" y="468" text-anchor="middle" font-size="12.5" fill="#454C61" data-fit="190">llega el mensaje</text>
  <text class="foot" x="48" y="512" data-fit="860">LoginState se arma igual en la Parte 2, con su propio LoginStatus.</text>
</svg>
```

El estado es una sola clase con `copyWith`, la misma estrategia del Laboratorio 4.

```dart
abstract class RegisterEvent {}

class RegisterSubmitted extends RegisterEvent {
  // TODO: username, fullName, email y password
}
```

```dart
enum RegisterStatus { initial, loading, success, failure }

class RegisterState {
  final RegisterStatus status;
  final Profile? profile;
  final String? errorMessage;

  const RegisterState({
    this.status = RegisterStatus.initial,
    this.profile,
    this.errorMessage,
  });

  // TODO: copyWith
}
```

```dart
class RegisterBloc extends Bloc<RegisterEvent, RegisterState> {
  final SignUpUseCase _signUp;

  RegisterBloc(this._signUp) : super(const RegisterState()) {
    on<RegisterSubmitted>(_onSubmitted);
  }

  Future<void> _onSubmitted(
    RegisterSubmitted event,
    Emitter<RegisterState> emit,
  ) async {
    // TODO: loading, y después success con el Profile o failure con el mensaje
  }
}
```

El `Bloc` no sabe que registrar son dos pasos: llama a `_signUp` una vez y espera el `Profile`.

## Paso 7 · main.dart

```svg
<svg id="l5P7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 760" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="l5P7-ttl l5P7-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="l5P7-ttl">Paso 7 · main.dart</title>
  <desc id="l5P7-dsc">El mapa del laboratorio en el paso 7. Se escribe: main.dart. Las piezas de los pasos anteriores aparecen marcadas como hechas y las de los pasos siguientes, atenuadas.</desc>
  <defs>
    <style>
      #l5P7 .title{fill:#161A26;font-size:22px;font-weight:700}
      #l5P7 .sub{fill:#79809A;font-size:13.5px}
      #l5P7 .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #l5P7 .foot{fill:#79809A;font-size:12px}
      #l5P7 .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #l5P7 .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #l5P7 .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#l5P7-arrow)}
    </style>
    <marker id="l5P7-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="760" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Paso 7 · main.dart</text>
  <text class="sub" x="48" y="80" data-fit="860">Resaltado, lo que escribes en este paso. Con marca verde, lo que ya está. En gris, lo que falta.</text>
  <rect x="48" y="104" width="864" height="104" rx="14" fill="#F4EBFF" fill-opacity=".5" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="h" x="68" y="134" style="fill:#7439B8" data-fit="150">PRESENTACIÓN</text>
  <text x="68" y="154" font-size="12.5" fill="#454C61" data-fit="150">Pantallas y Bloc</text>
  <rect x="48" y="224" width="864" height="184" rx="14" fill="#FFF3DC" fill-opacity=".5" stroke="#F0C572" stroke-width="1.5"/>
  <text class="h" x="68" y="254" style="fill:#A96C05" data-fit="150">DOMINIO</text>
  <text x="68" y="274" font-size="12.5" fill="#454C61" data-fit="150">Reglas y contratos</text>
  <rect x="48" y="424" width="864" height="168" rx="14" fill="#E3F6F3" fill-opacity=".5" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="h" x="68" y="454" style="fill:#0F8478" data-fit="150">DATOS</text>
  <text x="68" y="474" font-size="12.5" fill="#454C61" data-fit="150">Habla con Supabase</text>
  <rect x="48" y="608" width="864" height="88" rx="14" fill="#EFF1F5" fill-opacity=".5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="h" x="68" y="638" style="fill:#556074" data-fit="150">SUPABASE</text>
  <text x="68" y="658" font-size="12.5" fill="#454C61" data-fit="150">Servicio externo</text>
  <path class="link" d="M480,162 H502"/>
  <path class="link" d="M352,162 H338"/>
  <path class="link" stroke-dasharray="5 4" d="M768,162 H634"/>
  <text x="700" y="152" text-anchor="middle" font-size="12" font-weight="600" fill="#556074">arma</text>
  <path class="link" d="M568,184 V254"/>
  <path class="link" d="M540,300 V318 H392 V338"/>
  <path class="link" d="M596,300 V318 H744 V338"/>
  <text x="530" y="334" text-anchor="end" font-size="12" font-weight="700" fill="#A96C05">1.º</text>
  <text x="606" y="334" font-size="12" font-weight="700" fill="#A96C05">2.º</text>
  <path class="link" stroke-dasharray="5 4" d="M392,452 V386"/>
  <path class="link" stroke-dasharray="5 4" d="M744,452 V386"/>
  <text x="402" y="441" font-size="12" font-weight="600" fill="#556074">implementa</text>
  <text x="754" y="441" font-size="12" font-weight="600" fill="#556074">implementa</text>
  <path class="link" d="M392,496 V526"/>
  <path class="link" d="M744,496 V526"/>
  <path class="link" d="M392,572 V628"/>
  <path class="link" d="M744,572 V628"/>
  <rect x="216" y="140" width="120" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="276" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="104">HomeScreen</text>
  <rect x="352" y="140" width="128" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="416" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="112">RegisterScreen</text>
  <rect x="504" y="140" width="128" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="568" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="112">RegisterBloc</text>
  <circle cx="510" cy="142" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M505.5,142 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="763" y="135" width="138" height="54" rx="14" fill="none" stroke="#7439B8" stroke-width="3"/>
  <rect x="768" y="140" width="128" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="832" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="112">main.dart</text>
  <circle cx="774" cy="142" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="774" y="142" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">7</text>
  <rect x="316" y="256" width="152" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="392" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="136">AuthUser</text>
  <circle cx="322" cy="258" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M317.5,258 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="492" y="256" width="152" height="44" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="568" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="136">SignUpUseCase</text>
  <circle cx="498" cy="258" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M493.5,258 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="668" y="256" width="152" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="744" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="136">Profile</text>
  <circle cx="674" cy="258" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M669.5,258 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="304" y="340" width="176" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="392" y="362" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="160">AuthRepository</text>
  <circle cx="310" cy="342" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M305.5,342 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="656" y="340" width="176" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="744" y="362" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="160">ProfileRepository</text>
  <circle cx="662" cy="342" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M657.5,342 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="304" y="452" width="176" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="392" y="474" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="160">AuthRepositoryImpl</text>
  <circle cx="310" cy="454" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M305.5,454 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="656" y="452" width="176" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="744" y="474" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="160">ProfileRepositoryImpl</text>
  <circle cx="662" cy="454" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M657.5,454 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="288" y="528" width="208" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="392" y="550" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="192">SupabaseAuthDataSource</text>
  <circle cx="294" cy="530" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M289.5,530 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="636" y="528" width="216" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="744" y="550" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="200">SupabaseProfileDataSource</text>
  <circle cx="642" cy="530" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M637.5,530 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="304" y="630" width="176" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="392" y="652" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="160">Supabase Auth</text>
  <rect x="656" y="630" width="176" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="744" y="652" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="160">tabla profiles</text>
  <text class="foot" x="48" y="732" data-fit="860">El mapa es el mismo en todos los pasos: solo cambia lo que está resaltado.</text>
</svg>
```

`main.dart`

El proyecto ya trae `App` con el tema y las tres rutas. Falta inicializar `Supabase` y envolver `/register` en su `BlocProvider`. El `create` es el único lugar donde se arma la cadena completa, con sus dos ramas.

```dart
Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Supabase.initialize(url: 'TU_URL', publishableKey: 'TU_PUBLISHABLE_KEY');
  runApp(const App());
}
```

```dart
'/register': (_) => BlocProvider(
      create: (_) => RegisterBloc(
        SignUpUseCase(
          AuthRepositoryImpl(
            SupabaseAuthDataSource(Supabase.instance.client),
          ),
          ProfileRepositoryImpl(
            SupabaseProfileDataSource(Supabase.instance.client),
          ),
        ),
      ),
      child: const RegisterScreen(),
    ),
```

La `Project URL` y la `publishable key` se copian como en *Instalación de supabase*.

## Paso 8 · RegisterScreen

```svg
<svg id="l5P8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 760" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="l5P8-ttl l5P8-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="l5P8-ttl">Paso 8 · RegisterScreen</title>
  <desc id="l5P8-dsc">El mapa del laboratorio en el paso 8. Se escribe: RegisterScreen. Las piezas de los pasos anteriores aparecen marcadas como hechas y las de los pasos siguientes, atenuadas.</desc>
  <defs>
    <style>
      #l5P8 .title{fill:#161A26;font-size:22px;font-weight:700}
      #l5P8 .sub{fill:#79809A;font-size:13.5px}
      #l5P8 .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #l5P8 .foot{fill:#79809A;font-size:12px}
      #l5P8 .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #l5P8 .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #l5P8 .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#l5P8-arrow)}
    </style>
    <marker id="l5P8-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="760" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Paso 8 · RegisterScreen</text>
  <text class="sub" x="48" y="80" data-fit="860">Resaltado, lo que escribes en este paso. Con marca verde, lo que ya está. En gris, lo que falta.</text>
  <rect x="48" y="104" width="864" height="104" rx="14" fill="#F4EBFF" fill-opacity=".5" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="h" x="68" y="134" style="fill:#7439B8" data-fit="150">PRESENTACIÓN</text>
  <text x="68" y="154" font-size="12.5" fill="#454C61" data-fit="150">Pantallas y Bloc</text>
  <rect x="48" y="224" width="864" height="184" rx="14" fill="#FFF3DC" fill-opacity=".5" stroke="#F0C572" stroke-width="1.5"/>
  <text class="h" x="68" y="254" style="fill:#A96C05" data-fit="150">DOMINIO</text>
  <text x="68" y="274" font-size="12.5" fill="#454C61" data-fit="150">Reglas y contratos</text>
  <rect x="48" y="424" width="864" height="168" rx="14" fill="#E3F6F3" fill-opacity=".5" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="h" x="68" y="454" style="fill:#0F8478" data-fit="150">DATOS</text>
  <text x="68" y="474" font-size="12.5" fill="#454C61" data-fit="150">Habla con Supabase</text>
  <rect x="48" y="608" width="864" height="88" rx="14" fill="#EFF1F5" fill-opacity=".5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="h" x="68" y="638" style="fill:#556074" data-fit="150">SUPABASE</text>
  <text x="68" y="658" font-size="12.5" fill="#454C61" data-fit="150">Servicio externo</text>
  <path class="link" d="M480,162 H502"/>
  <path class="link" d="M352,162 H338"/>
  <path class="link" stroke-dasharray="5 4" d="M768,162 H634"/>
  <text x="700" y="152" text-anchor="middle" font-size="12" font-weight="600" fill="#556074">arma</text>
  <path class="link" d="M568,184 V254"/>
  <path class="link" d="M540,300 V318 H392 V338"/>
  <path class="link" d="M596,300 V318 H744 V338"/>
  <text x="530" y="334" text-anchor="end" font-size="12" font-weight="700" fill="#A96C05">1.º</text>
  <text x="606" y="334" font-size="12" font-weight="700" fill="#A96C05">2.º</text>
  <path class="link" stroke-dasharray="5 4" d="M392,452 V386"/>
  <path class="link" stroke-dasharray="5 4" d="M744,452 V386"/>
  <text x="402" y="441" font-size="12" font-weight="600" fill="#556074">implementa</text>
  <text x="754" y="441" font-size="12" font-weight="600" fill="#556074">implementa</text>
  <path class="link" d="M392,496 V526"/>
  <path class="link" d="M744,496 V526"/>
  <path class="link" d="M392,572 V628"/>
  <path class="link" d="M744,572 V628"/>
  <rect x="216" y="140" width="120" height="44" rx="10" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text class="mono" x="276" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A3AAB8" data-fit="104">HomeScreen</text>
  <rect x="347" y="135" width="138" height="54" rx="14" fill="none" stroke="#7439B8" stroke-width="3"/>
  <rect x="352" y="140" width="128" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="416" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="112">RegisterScreen</text>
  <circle cx="358" cy="142" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="358" y="142" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">8</text>
  <rect x="504" y="140" width="128" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="568" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="112">RegisterBloc</text>
  <circle cx="510" cy="142" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M505.5,142 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="768" y="140" width="128" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="832" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="112">main.dart</text>
  <circle cx="774" cy="142" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M769.5,142 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="316" y="256" width="152" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="392" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="136">AuthUser</text>
  <circle cx="322" cy="258" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M317.5,258 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="492" y="256" width="152" height="44" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="568" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="136">SignUpUseCase</text>
  <circle cx="498" cy="258" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M493.5,258 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="668" y="256" width="152" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="744" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="136">Profile</text>
  <circle cx="674" cy="258" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M669.5,258 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="304" y="340" width="176" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="392" y="362" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="160">AuthRepository</text>
  <circle cx="310" cy="342" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M305.5,342 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="656" y="340" width="176" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="744" y="362" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="160">ProfileRepository</text>
  <circle cx="662" cy="342" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M657.5,342 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="304" y="452" width="176" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="392" y="474" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="160">AuthRepositoryImpl</text>
  <circle cx="310" cy="454" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M305.5,454 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="656" y="452" width="176" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="744" y="474" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="160">ProfileRepositoryImpl</text>
  <circle cx="662" cy="454" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M657.5,454 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="288" y="528" width="208" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="392" y="550" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="192">SupabaseAuthDataSource</text>
  <circle cx="294" cy="530" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M289.5,530 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="636" y="528" width="216" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="744" y="550" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="200">SupabaseProfileDataSource</text>
  <circle cx="642" cy="530" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M637.5,530 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="304" y="630" width="176" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="392" y="652" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="160">Supabase Auth</text>
  <rect x="656" y="630" width="176" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="744" y="652" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="160">tabla profiles</text>
  <text class="foot" x="48" y="732" data-fit="860">El mapa es el mismo en todos los pasos: solo cambia lo que está resaltado.</text>
</svg>
```

`register/ui/screens/register_screen.dart`

La pantalla ya está dibujada. Hoy guarda `_isLoading` con `setState`, y `_submit()` navega directo a `/home`. Las dos validaciones que trae, campos vacíos y contraseñas distintas, se quedan en la pantalla. Lo demás pasa al `Bloc`:

- `_submit()` lanza `RegisterSubmitted` en lugar de navegar.
- El formulario toma del estado el `isLoading` del `PrimaryButton` y el mensaje del `ErrorMessage`.
- Navegar le toca a `BlocListener`, que usa los mismos tipos que `BlocBuilder` pero, en lugar de dibujar, ejecuta algo una vez por estado.

```dart
body: BlocListener<RegisterBloc, RegisterState>(
  listener: (context, state) {
    if (state.status == RegisterStatus.success) {
      Navigator.pushReplacementNamed(context, '/home', arguments: state.profile);
    }
  },
  child: BlocBuilder<RegisterBloc, RegisterState>(
    builder: (context, state) {
      // TODO: el formulario que ya existe, con el isLoading y el
      // ErrorMessage tomados de state
    },
  ),
),
```

## Paso 9 · HomeScreen y la prueba

```svg
<svg id="l5P9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 760" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="l5P9-ttl l5P9-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="l5P9-ttl">Paso 9 · HomeScreen y la prueba</title>
  <desc id="l5P9-dsc">El mapa del laboratorio en el paso 9. Se escribe: HomeScreen. Las piezas de los pasos anteriores aparecen marcadas como hechas y las de los pasos siguientes, atenuadas.</desc>
  <defs>
    <style>
      #l5P9 .title{fill:#161A26;font-size:22px;font-weight:700}
      #l5P9 .sub{fill:#79809A;font-size:13.5px}
      #l5P9 .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #l5P9 .foot{fill:#79809A;font-size:12px}
      #l5P9 .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #l5P9 .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #l5P9 .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#l5P9-arrow)}
    </style>
    <marker id="l5P9-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="760" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Paso 9 · HomeScreen y la prueba</text>
  <text class="sub" x="48" y="80" data-fit="860">Resaltado, lo que escribes en este paso. Con marca verde, lo que ya está. En gris, lo que falta.</text>
  <rect x="48" y="104" width="864" height="104" rx="14" fill="#F4EBFF" fill-opacity=".5" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="h" x="68" y="134" style="fill:#7439B8" data-fit="150">PRESENTACIÓN</text>
  <text x="68" y="154" font-size="12.5" fill="#454C61" data-fit="150">Pantallas y Bloc</text>
  <rect x="48" y="224" width="864" height="184" rx="14" fill="#FFF3DC" fill-opacity=".5" stroke="#F0C572" stroke-width="1.5"/>
  <text class="h" x="68" y="254" style="fill:#A96C05" data-fit="150">DOMINIO</text>
  <text x="68" y="274" font-size="12.5" fill="#454C61" data-fit="150">Reglas y contratos</text>
  <rect x="48" y="424" width="864" height="168" rx="14" fill="#E3F6F3" fill-opacity=".5" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="h" x="68" y="454" style="fill:#0F8478" data-fit="150">DATOS</text>
  <text x="68" y="474" font-size="12.5" fill="#454C61" data-fit="150">Habla con Supabase</text>
  <rect x="48" y="608" width="864" height="88" rx="14" fill="#EFF1F5" fill-opacity=".5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="h" x="68" y="638" style="fill:#556074" data-fit="150">SUPABASE</text>
  <text x="68" y="658" font-size="12.5" fill="#454C61" data-fit="150">Servicio externo</text>
  <path class="link" d="M480,162 H502"/>
  <path class="link" d="M352,162 H338"/>
  <path class="link" stroke-dasharray="5 4" d="M768,162 H634"/>
  <text x="700" y="152" text-anchor="middle" font-size="12" font-weight="600" fill="#556074">arma</text>
  <path class="link" d="M568,184 V254"/>
  <path class="link" d="M540,300 V318 H392 V338"/>
  <path class="link" d="M596,300 V318 H744 V338"/>
  <text x="530" y="334" text-anchor="end" font-size="12" font-weight="700" fill="#A96C05">1.º</text>
  <text x="606" y="334" font-size="12" font-weight="700" fill="#A96C05">2.º</text>
  <path class="link" stroke-dasharray="5 4" d="M392,452 V386"/>
  <path class="link" stroke-dasharray="5 4" d="M744,452 V386"/>
  <text x="402" y="441" font-size="12" font-weight="600" fill="#556074">implementa</text>
  <text x="754" y="441" font-size="12" font-weight="600" fill="#556074">implementa</text>
  <path class="link" d="M392,496 V526"/>
  <path class="link" d="M744,496 V526"/>
  <path class="link" d="M392,572 V628"/>
  <path class="link" d="M744,572 V628"/>
  <rect x="211" y="135" width="130" height="54" rx="14" fill="none" stroke="#7439B8" stroke-width="3"/>
  <rect x="216" y="140" width="120" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="276" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="104">HomeScreen</text>
  <circle cx="222" cy="142" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="222" y="142" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">9</text>
  <rect x="352" y="140" width="128" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="416" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="112">RegisterScreen</text>
  <circle cx="358" cy="142" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M353.5,142 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="504" y="140" width="128" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="568" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="112">RegisterBloc</text>
  <circle cx="510" cy="142" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M505.5,142 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="768" y="140" width="128" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="832" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="112">main.dart</text>
  <circle cx="774" cy="142" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M769.5,142 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="316" y="256" width="152" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="392" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="136">AuthUser</text>
  <circle cx="322" cy="258" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M317.5,258 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="492" y="256" width="152" height="44" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="568" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="136">SignUpUseCase</text>
  <circle cx="498" cy="258" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M493.5,258 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="668" y="256" width="152" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="744" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="136">Profile</text>
  <circle cx="674" cy="258" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M669.5,258 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="304" y="340" width="176" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="392" y="362" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="160">AuthRepository</text>
  <circle cx="310" cy="342" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M305.5,342 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="656" y="340" width="176" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="744" y="362" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="160">ProfileRepository</text>
  <circle cx="662" cy="342" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M657.5,342 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="304" y="452" width="176" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="392" y="474" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="160">AuthRepositoryImpl</text>
  <circle cx="310" cy="454" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M305.5,454 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="656" y="452" width="176" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="744" y="474" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="160">ProfileRepositoryImpl</text>
  <circle cx="662" cy="454" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M657.5,454 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="288" y="528" width="208" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="392" y="550" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="192">SupabaseAuthDataSource</text>
  <circle cx="294" cy="530" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M289.5,530 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="636" y="528" width="216" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="744" y="550" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="200">SupabaseProfileDataSource</text>
  <circle cx="642" cy="530" r="10" fill="#E8F6E3" stroke="#3A8235" stroke-width="1.5"/><path d="M637.5,530 l3,3.2 l5.5,-6.4" fill="none" stroke="#3A8235" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="304" y="630" width="176" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="392" y="652" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="160">Supabase Auth</text>
  <rect x="656" y="630" width="176" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="744" y="652" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="160">tabla profiles</text>
  <text class="foot" x="48" y="732" data-fit="860">El mapa es el mismo en todos los pasos: solo cambia lo que está resaltado.</text>
</svg>
```

`main.dart`

`HomeScreen` hoy muestra datos de ejemplo. La ruta `/home` recibe el `Profile` que mandó el registro y se lo pasa:

```dart
'/home': (context) {
  final profile = ModalRoute.of(context)!.settings.arguments as Profile;
  return HomeScreen(username: profile.username, fullName: profile.fullName);
},
```

El correo sigue con el valor de ejemplo: lo conectas en la Parte 2.

Registra una cuenta y comprueba en el dashboard las dos mitades del registro:

- En `Authentication > Users` aparece la cuenta, con su UID.
- En `Table Editor > profiles` aparece una fila cuyo `id` es ese mismo UID, con el `username` y el `full_name` que escribiste.

## Parte 2 · El inicio de sesión

`LoginScreen` ya está dibujada. Constrúyelo tú, con la misma forma del registro y sin guía:

- **Los contratos.** Agrega `signIn` y `signOut` a `AuthRepository`, y `getProfile` a `ProfileRepository`. Cada uno con su data source y su implementación.
- **`SignInUseCase`.** También son dos pasos: `signIn` devuelve el `AuthUser` y, con su `id`, `getProfile` trae el perfil.
- **`LoginBloc`.** Con su `LoginStatus` y `copyWith`, y la ruta `/login` envuelta en su `BlocProvider`.
- **`LoginScreen`.** Conectada igual que `RegisterScreen`.
- **`HomeScreen`.** Ahora sí con el correo real, el del `AuthUser`.
- **`Cerrar sesión`.** Un `SignOutUseCase` que el botón llama antes de volver a `/login`. Sin eso, la sesión sigue abierta en Supabase aunque la app muestre el login.

Esto es todo lo que necesitas del SDK:

```dart
final response = await _client.auth.signInWithPassword(email: email, password: password);
await _client.auth.signOut();
final row = await _client.from('profiles').select().eq('id', id).single();
```
