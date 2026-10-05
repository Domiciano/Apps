# Laboratorio 5: Flujo de login

<!-- tags: Clean Architecture, AuthRepository, SignInUseCase, SupabaseAuthDataSource, LoginBloc, copyWith,
     LoginStatus, signInWithPassword, signUp, tabla profiles, BlocListener, Null check operator used on a null value -->

Vas a construir el registro y el inicio de sesión con `Supabase`, organizados con Clean Architecture y `Bloc`. Son once pasos, de la capa de adentro hacia la de afuera.

## El mapa

```svg
<svg id="l5Ruta" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 760" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="l5Ruta-ttl l5Ruta-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="l5Ruta-ttl">El mapa del laboratorio</title>
  <desc id="l5Ruta-dsc">Mapa de capas con los once pasos. Dominio: AuthUser en el paso 1, AuthRepository en el 2, SignInUseCase y SignUpUseCase en el 3, ProfileRepository en el 11. Datos: SupabaseAuthDataSource en el paso 4, AuthRepositoryImpl en el 5, ProfileRepositoryImpl en el 11. Presentación: LoginBloc en el paso 6, LoginScreen en el 7, RegisterBloc y RegisterScreen en el 8, y la navegación entre las dos pantallas en el 9. En Supabase, la tabla profiles se revisa en el paso 10.</desc>
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
  <text class="sub" x="48" y="80" data-fit="860">Cada caja es una clase y el número dice en qué paso la construyes. Se avanza de adentro hacia afuera.</text>
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
  <path class="link" d="M392,162 H370"/>
  <path class="link" d="M720,162 H742"/>
  <path class="link" d="M292,184 V254"/>
  <path class="link" d="M820,184 V254"/>
  <path class="link" d="M292,300 V318 H440 V334"/>
  <path class="link" d="M764,300 V318 H520 V334"/>
  <path class="link" d="M860,300 V334"/>
  <path class="link" stroke-dasharray="5 4" d="M480,452 V382"/>
  <path class="link" stroke-dasharray="5 4" d="M808,452 V382"/>
  <text x="490" y="420" font-size="12" font-weight="600" fill="#556074">implementa</text>
  <text x="818" y="420" font-size="12" font-weight="600" fill="#556074">implementa</text>
  <path class="link" d="M480,496 V526"/>
  <path class="link" d="M808,496 V526"/>
  <path class="link" d="M480,572 V628"/>
  <path class="link" d="M808,572 V628"/>
  <rect x="216" y="140" width="152" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="292" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="136">LoginBloc</text>
  <circle cx="222" cy="142" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="222" y="142" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">6</text>
  <rect x="392" y="140" width="152" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="468" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="136">LoginScreen</text>
  <circle cx="398" cy="142" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="398" y="142" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">7</text>
  <rect x="568" y="140" width="152" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="644" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="136">RegisterScreen</text>
  <circle cx="574" cy="142" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="574" y="142" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">8</text>
  <rect x="744" y="140" width="152" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="820" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="136">RegisterBloc</text>
  <circle cx="750" cy="142" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="750" y="142" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">8</text>
  <rect x="216" y="256" width="152" height="44" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="292" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="136">SignInUseCase</text>
  <circle cx="222" cy="258" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="222" y="258" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">3</text>
  <rect x="744" y="256" width="152" height="44" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="820" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="136">SignUpUseCase</text>
  <circle cx="750" cy="258" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="750" y="258" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">3</text>
  <rect x="480" y="256" width="152" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="556" y="278" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="136">AuthUser</text>
  <circle cx="486" cy="258" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="486" y="258" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">1</text>
  <rect x="392" y="336" width="176" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="480" y="358" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="160">AuthRepository</text>
  <circle cx="398" cy="338" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="398" y="338" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">2</text>
  <rect x="720" y="336" width="176" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="808" y="358" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="160">ProfileRepository</text>
  <circle cx="726" cy="338" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="726" y="338" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">11</text>
  <rect x="392" y="452" width="176" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="480" y="474" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="160">AuthRepositoryImpl</text>
  <circle cx="398" cy="454" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="398" y="454" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">5</text>
  <rect x="720" y="452" width="176" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="808" y="474" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="160">ProfileRepositoryImpl</text>
  <circle cx="726" cy="454" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="726" y="454" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">11</text>
  <rect x="392" y="528" width="504" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="644" y="550" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="488">SupabaseAuthDataSource</text>
  <circle cx="398" cy="530" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="398" y="530" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">4</text>
  <rect x="392" y="630" width="176" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="480" y="652" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="160">Supabase Auth</text>
  <rect x="720" y="630" width="176" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="808" y="652" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="160">tabla profiles</text>
  <circle cx="726" cy="632" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="726" y="632" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">10</text>
  <circle cx="556" cy="162" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="556" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">9</text>
  <text class="foot" x="48" y="732" data-fit="860">El paso 9 es la navegación entre las dos pantallas. El 10 revisa la tabla en Supabase y el 11 la usa desde la app.</text>
</svg>
```

El dominio no sabe que existe Supabase. Si mañana cambia el proveedor, solo se reescribe la capa de datos.

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
<svg id="l5Carpetas" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 924" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="l5Carpetas-ttl l5Carpetas-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="l5Carpetas-ttl">La estructura de carpetas</title>
  <desc id="l5Carpetas-dsc">Árbol de carpetas dentro de lib: main.dart y features. En features, auth con domain (entities, repository y usecases) y data (source y repository); login con ui (bloc y screens); register con ui (bloc y screens); y home con su pantalla. Cada archivo indica el paso del laboratorio en que se crea.</desc>
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
  <rect width="960" height="924" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">La estructura de carpetas</text>
  <text class="sub" x="48" y="80" data-fit="860">auth/ guarda lo que se comparte. login/ y register/ solo tienen su pantalla y su Bloc.</text>
  <rect x="48" y="96" width="864" height="768" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="68" y="111" width="50" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="78" y="124" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="38">lib/</text>
  <path d="M78,137 V158 H89" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="92" y="145" width="88" height="26" rx="4" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="102" y="158" dy="0.35em" font-size="12.5" font-weight="600" fill="#7439B8" data-fit="76">main.dart</text>
  <text x="516" y="158" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">Inicializa Supabase y declara las rutas</text>
  <circle cx="880" cy="158" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="158" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">7</text>
  <path d="M78,137 V192 H89" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="92" y="179" width="88" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="102" y="192" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="76">features/</text>
  <path d="M102,205 V226 H113" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="116" y="213" width="58" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="126" y="226" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="46">auth/</text>
  <text x="516" y="226" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">Lo que comparten login y registro</text>
  <path d="M126,239 V260 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="247" width="72" height="26" rx="8" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="150" y="260" dy="0.35em" font-size="12.5" font-weight="600" fill="#A96C05" data-fit="60">domain/</text>
  <text x="516" y="260" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">No importa nada de Flutter ni de Supabase</text>
  <path d="M150,273 V294 H161" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="164" y="281" width="192" height="26" rx="4" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="174" y="294" dy="0.35em" font-size="12.5" font-weight="600" fill="#A96C05" data-fit="180">entities/auth_user.dart</text>
  <text x="516" y="294" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">El usuario, en tus propios términos</text>
  <circle cx="880" cy="294" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="294" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">1</text>
  <path d="M150,273 V328 H161" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="164" y="315" width="252" height="26" rx="4" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="174" y="328" dy="0.35em" font-size="12.5" font-weight="600" fill="#A96C05" data-fit="240">repository/auth_repository.dart</text>
  <text x="516" y="328" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">El contrato de autenticación</text>
  <circle cx="880" cy="328" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="328" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">2</text>
  <path d="M150,273 V362 H161" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="164" y="349" width="275" height="26" rx="4" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="174" y="362" dy="0.35em" font-size="12.5" font-weight="600" fill="#A96C05" data-fit="263">repository/profile_repository.dart</text>
  <text x="516" y="362" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">El contrato del perfil</text>
  <circle cx="880" cy="362" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="362" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">11</text>
  <path d="M150,273 V396 H161" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="164" y="383" width="238" height="26" rx="4" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="174" y="396" dy="0.35em" font-size="12.5" font-weight="600" fill="#A96C05" data-fit="226">usecases/sign_in_usecase.dart</text>
  <text x="516" y="396" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">Iniciar sesión</text>
  <circle cx="880" cy="396" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="396" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">3</text>
  <path d="M150,273 V430 H161" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="164" y="417" width="238" height="26" rx="4" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="174" y="430" dy="0.35em" font-size="12.5" font-weight="600" fill="#A96C05" data-fit="226">usecases/sign_up_usecase.dart</text>
  <text x="516" y="430" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">Registrar</text>
  <circle cx="880" cy="430" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="430" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">3</text>
  <path d="M150,273 V464 H161" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="164" y="451" width="245" height="26" rx="4" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="174" y="464" dy="0.35em" font-size="12.5" font-weight="600" fill="#A96C05" data-fit="233">usecases/sign_out_usecase.dart</text>
  <text x="516" y="464" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">Cerrar sesión</text>
  <circle cx="880" cy="464" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="464" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">3</text>
  <path d="M126,239 V498 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="485" width="58" height="26" rx="8" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="150" y="498" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="46">data/</text>
  <text x="516" y="498" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">El único lugar que conoce a Supabase</text>
  <path d="M150,511 V532 H161" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="164" y="519" width="298" height="26" rx="4" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="174" y="532" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="286">source/supabase_auth_data_source.dart</text>
  <text x="516" y="532" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">Las llamadas al SDK</text>
  <circle cx="880" cy="532" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="532" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">4</text>
  <path d="M150,511 V566 H161" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="164" y="553" width="290" height="26" rx="4" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="174" y="566" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="278">repository/auth_repository_impl.dart</text>
  <text x="516" y="566" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">Cumple el contrato</text>
  <circle cx="880" cy="566" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="566" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">5</text>
  <path d="M150,511 V600 H161" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="164" y="587" width="312" height="26" rx="4" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="174" y="600" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="300">repository/profile_repository_impl.dart</text>
  <text x="516" y="600" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">Cumple el contrato</text>
  <circle cx="880" cy="600" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="600" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">11</text>
  <path d="M102,205 V634 H113" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="116" y="621" width="88" height="26" rx="8" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="126" y="634" dy="0.35em" font-size="12.5" font-weight="600" fill="#7439B8" data-fit="76">login/ui/</text>
  <text x="516" y="634" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">La pantalla de login y su Bloc</text>
  <path d="M126,647 V668 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="655" width="58" height="26" rx="8" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="150" y="668" dy="0.35em" font-size="12.5" font-weight="600" fill="#7439B8" data-fit="46">bloc/</text>
  <text x="516" y="668" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">login_bloc · login_event · login_state</text>
  <circle cx="880" cy="668" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="668" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">6</text>
  <path d="M126,647 V702 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="689" width="208" height="26" rx="4" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="150" y="702" dy="0.35em" font-size="12.5" font-weight="600" fill="#7439B8" data-fit="196">screens/login_screen.dart</text>
  <text x="516" y="702" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">El formulario</text>
  <circle cx="880" cy="702" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="702" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">7</text>
  <path d="M102,205 V736 H113" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="116" y="723" width="110" height="26" rx="8" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="126" y="736" dy="0.35em" font-size="12.5" font-weight="600" fill="#7439B8" data-fit="98">register/ui/</text>
  <text x="516" y="736" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">La misma forma, para el registro</text>
  <path d="M126,749 V770 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="757" width="58" height="26" rx="8" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="150" y="770" dy="0.35em" font-size="12.5" font-weight="600" fill="#7439B8" data-fit="46">bloc/</text>
  <text x="516" y="770" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">register_bloc · register_event · register_state</text>
  <circle cx="880" cy="770" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="770" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">8</text>
  <path d="M126,749 V804 H137" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="140" y="791" width="230" height="26" rx="4" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="150" y="804" dy="0.35em" font-size="12.5" font-weight="600" fill="#7439B8" data-fit="218">screens/register_screen.dart</text>
  <text x="516" y="804" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">El formulario</text>
  <circle cx="880" cy="804" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="804" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">8</text>
  <path d="M102,205 V838 H113" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="116" y="825" width="260" height="26" rx="4" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="126" y="838" dy="0.35em" font-size="12.5" font-weight="600" fill="#7439B8" data-fit="248">home/ui/screens/home_screen.dart</text>
  <text x="516" y="838" dy="0.35em" font-size="13" fill="#454C61" data-fit="316">A donde llega quien inicia sesión</text>
  <circle cx="880" cy="838" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="880" y="838" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">7</text>
  <text class="h" x="892" y="88" text-anchor="end">PASO</text>
  <text class="foot" x="48" y="896" data-fit="860">Los nombres de archivo van en minúscula y con guion bajo.</text>
</svg>
```

En los bloques de código se omiten los `import`: el editor los sugiere.

## Paso 1 · AuthUser

`auth/domain/entities/auth_user.dart`

Tu propio usuario, no el objeto de Supabase. Tiene `id` y `email`.

```dart
class AuthUser {
  // TODO
}
```

## Paso 2 · AuthRepository

`auth/domain/repository/auth_repository.dart`

El contrato: qué se puede pedir, sin decir quién lo cumple.

```dart
abstract class AuthRepository {
  Future<AuthUser> signIn({
    required String email,
    required String password,
  });

  // TODO: signUp

  // TODO: signOut
}
```

## Paso 3 · Los UseCase

`auth/domain/usecases/sign_in_usecase.dart` · `sign_up_usecase.dart` · `sign_out_usecase.dart`

Cada uno recibe el contrato por constructor y expone un método `call`.

```dart
class SignInUseCase {
  // TODO
}

class SignUpUseCase {
  // TODO
}

class SignOutUseCase {
  // TODO
}
```

## Paso 4 · SupabaseAuthDataSource

`auth/data/source/supabase_auth_data_source.dart`

El único archivo que usa el SDK. Convierte la respuesta de Supabase en un `AuthUser`.

```dart
class SupabaseAuthDataSource {
  final SupabaseClient _client;

  SupabaseAuthDataSource(this._client);

  Future<AuthUser> signIn({
    required String email,
    required String password,
  }) async {
    // TODO
  }

  // TODO: signUp

  // TODO: signOut
}
```

Esto es todo lo que necesitas del SDK:

```dart
final signInRes = await _client.auth.signInWithPassword(email: email, password: password);
final signUpRes = await _client.auth.signUp(email: email, password: password);
await _client.auth.signOut();
```

- Las dos primeras devuelven un `AuthResponse` con `user`, y lanzan `AuthException` si algo falla.
- `user` puede ser `null`. Valídalo antes de usar `user!`, o verás `Null check operator used on a null value`.

## Paso 5 · AuthRepositoryImpl

`auth/data/repository/auth_repository_impl.dart`

Cumple el contrato delegando cada método en el data source.

```dart
class AuthRepositoryImpl implements AuthRepository {
  final SupabaseAuthDataSource _dataSource;

  AuthRepositoryImpl(this._dataSource);

  @override
  Future<AuthUser> signIn({
    required String email,
    required String password,
  }) {
    // TODO
  }

  // TODO: signUp

  // TODO: signOut
}
```

## Paso 6 · LoginBloc

`login/ui/bloc/login_event.dart` · `login_state.dart` · `login_bloc.dart`

```svg
<svg id="l5Estado" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="l5Estado-ttl l5Estado-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="l5Estado-ttl">Un solo estado, cuatro momentos</title>
  <desc id="l5Estado-dsc">Cuatro columnas, una por valor de LoginStatus. En initial la pantalla muestra el formulario. En loading, el formulario con un indicador de progreso en lugar del botón; copyWith cambia solo status. En success la app navega a la pantalla de inicio; copyWith cambia status y user. En failure vuelve el formulario con el mensaje de error; copyWith cambia status y errorMessage.</desc>
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
  <text class="sub" x="48" y="80" data-fit="860">LoginState es una sola clase. El momento lo dice el campo status, y copyWith cambia solo lo que hace falta.</text>
  <rect x="54" y="108" width="192" height="36" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="150" y="126" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#556074" data-fit="176">status: initial</text>
  <path class="link" d="M150,144 V166"/>
  <rect x="70" y="170" width="160" height="216" rx="18" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/><text x="86" y="194" dy="0.35em" font-size="14" font-weight="600" fill="#161A26">Login</text><path d="M72,212 H228" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="86" y="228" width="128" height="26" rx="6" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="96" y="241" dy="0.35em" font-size="12" fill="#79809A">correo</text>
  <rect x="86" y="264" width="128" height="26" rx="6" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="96" y="277" dy="0.35em" font-size="12" fill="#79809A">contraseña</text>
  <rect x="86" y="306" width="128" height="28" rx="14" fill="#4453C9"/>
  <text x="150" y="320" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#FFFFFF">Entrar</text>
  <text class="h" x="150" y="414" text-anchor="middle">SE CREA CON</text>
  <rect x="54" y="424" width="192" height="26" rx="6" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.25"/>
  <text class="mono" x="150" y="437" dy="0.35em" text-anchor="middle" font-size="12" font-weight="600" fill="#556074" data-fit="180">const LoginState()</text>
  <text x="150" y="468" text-anchor="middle" font-size="12.5" fill="#454C61" data-fit="190">el estado de arranque</text>
  <rect x="274" y="108" width="192" height="36" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="370" y="126" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#A96C05" data-fit="176">status: loading</text>
  <path class="link" d="M370,144 V166"/>
  <rect x="290" y="170" width="160" height="216" rx="18" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/><text x="306" y="194" dy="0.35em" font-size="14" font-weight="600" fill="#161A26">Login</text><path d="M292,212 H448" stroke="#D9DEE8" stroke-width="1.5"/>
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
  <rect x="510" y="170" width="160" height="216" rx="18" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/><text x="526" y="194" dy="0.35em" font-size="14" font-weight="600" fill="#161A26">Inicio</text><path d="M512,212 H668" stroke="#D9DEE8" stroke-width="1.5"/>
  <circle cx="590" cy="274" r="18" fill="#E8F6E3" stroke="#3A8235" stroke-width="2"/>
  <path d="M582,274 l6,6 l11,-12" fill="none" stroke="#3A8235" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="590" y="318" dy="0.35em" text-anchor="middle" font-size="13" fill="#161A26" data-fit="140">ana@icesi.edu.co</text>
  <text class="h" x="590" y="414" text-anchor="middle">copyWith CAMBIA</text>
  <rect x="494" y="424" width="192" height="26" rx="6" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>
  <text class="mono" x="590" y="437" dy="0.35em" text-anchor="middle" font-size="12" font-weight="600" fill="#3A8235" data-fit="180">status · user</text>
  <text x="590" y="468" text-anchor="middle" font-size="12.5" fill="#454C61" data-fit="190">llega el AuthUser</text>
  <rect x="714" y="108" width="192" height="36" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text class="mono" x="810" y="126" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#C2354F" data-fit="176">status: failure</text>
  <path class="link" d="M810,144 V166"/>
  <rect x="730" y="170" width="160" height="216" rx="18" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/><text x="746" y="194" dy="0.35em" font-size="14" font-weight="600" fill="#161A26">Login</text><path d="M732,212 H888" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="746" y="228" width="128" height="26" rx="6" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="756" y="241" dy="0.35em" font-size="12" fill="#79809A">correo</text>
  <rect x="746" y="264" width="128" height="26" rx="6" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="756" y="277" dy="0.35em" font-size="12" fill="#79809A">contraseña</text>
  <rect x="746" y="306" width="128" height="28" rx="14" fill="#4453C9"/>
  <text x="810" y="320" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#FFFFFF">Entrar</text>
  <text x="810" y="358" dy="0.35em" text-anchor="middle" font-size="12" font-weight="600" fill="#C2354F" data-fit="140">Credenciales inválidas</text>
  <text class="h" x="810" y="414" text-anchor="middle">copyWith CAMBIA</text>
  <rect x="714" y="424" width="192" height="26" rx="6" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.25"/>
  <text class="mono" x="810" y="437" dy="0.35em" text-anchor="middle" font-size="12" font-weight="600" fill="#C2354F" data-fit="180">status · errorMessage</text>
  <text x="810" y="468" text-anchor="middle" font-size="12.5" fill="#454C61" data-fit="190">llega el mensaje</text>
  <text class="foot" x="48" y="512" data-fit="860">RegisterState se arma igual, con su propio RegisterStatus.</text>
</svg>
```

El estado es una sola clase con `copyWith`, la misma estrategia del Laboratorio 4.

```dart
abstract class LoginEvent {}

class LoginSubmitted extends LoginEvent {
  // TODO: email y password
}
```

```dart
enum LoginStatus { initial, loading, success, failure }

class LoginState {
  final LoginStatus status;
  final AuthUser? user;
  final String? errorMessage;

  const LoginState({
    this.status = LoginStatus.initial,
    this.user,
    this.errorMessage,
  });

  // TODO: copyWith
}
```

```dart
class LoginBloc extends Bloc<LoginEvent, LoginState> {
  final SignInUseCase _signIn;

  LoginBloc(this._signIn) : super(const LoginState()) {
    on<LoginSubmitted>(_onSubmitted);
  }

  Future<void> _onSubmitted(
    LoginSubmitted event,
    Emitter<LoginState> emit,
  ) async {
    // TODO: loading, y después success o failure
  }
}
```

## Paso 7 · LoginScreen y las rutas

`main.dart`

El proyecto ya trae `App` con el tema y las tres rutas. Falta inicializar `Supabase` y envolver `/login` en su `BlocProvider`. El `create` es el único lugar donde se arma la cadena completa.

```dart
Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Supabase.initialize(url: 'TU_URL', publishableKey: 'TU_PUBLISHABLE_KEY');
  runApp(const App());
}

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Moviles Auth',
      debugShowCheckedModeBanner: false,
      theme: buildTheme(),
      initialRoute: '/login',
      routes: {
        '/login': (_) => BlocProvider(
              create: (_) => LoginBloc(
                SignInUseCase(
                  AuthRepositoryImpl(
                    SupabaseAuthDataSource(Supabase.instance.client),
                  ),
                ),
              ),
              child: const LoginScreen(),
            ),
        '/register': (_) => const RegisterScreen(),
        '/home': (_) => const HomeScreen(),
      },
    );
  }
}
```

La `Project URL` y la `publishable key` se copian como en *Instalación de supabase*.

`login/ui/screens/login_screen.dart`

La pantalla ya está dibujada. Hoy guarda `_isLoading` y `_errorMessage` con `setState`, y `_submit()` navega directo a `/home`. Reemplaza eso por el `Bloc`: `_submit()` lanza `LoginSubmitted`, y el formulario toma del estado el `isLoading` del `PrimaryButton` y el texto del `ErrorMessage`.

`BlocBuilder` dibuja cada estado. `BlocListener` usa los mismos tipos, pero en lugar de dibujar ejecuta algo una vez por estado: aquí, navegar.

```dart
class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _submit() {
    // TODO: lanzar LoginSubmitted con el correo y la contraseña
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Iniciar sesión')),
      body: BlocListener<LoginBloc, LoginState>(
        listener: (context, state) {
          if (state.status == LoginStatus.success) {
            Navigator.pushReplacementNamed(context, '/home', arguments: state.user);
          }
        },
        child: BlocBuilder<LoginBloc, LoginState>(
          builder: (context, state) {
            // TODO: el formulario que ya existe, con el isLoading y el
            // ErrorMessage tomados de state
          },
        ),
      ),
    );
  }
}
```

`HomeScreen` hoy muestra datos de ejemplo. Haz que reciba el `AuthUser` como argumento de la ruta y muestre su email.

Su botón `Cerrar sesión` hoy solo navega. Pásale un `SignOutUseCase` por constructor, armado en la tabla de rutas igual que el de login:

```dart
'/home': (_) => HomeScreen(
      signOut: SignOutUseCase(
        AuthRepositoryImpl(
          SupabaseAuthDataSource(Supabase.instance.client),
        ),
      ),
    ),
```

Y llámalo antes de navegar. Sin eso, la sesión sigue abierta en Supabase aunque la app muestre el login:

```dart
Future<void> _signOut(BuildContext context) async {
  await signOut();
  if (!context.mounted) return;
  Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
}
```

## Paso 8 · El registro

`register/ui/`

`RegisterScreen` también está dibujada: pide la contraseña dos veces y solo sigue si coinciden. Falta lo de adentro, con la misma forma del login: `RegisterSubmitted`, `RegisterState` con su `RegisterStatus` y `copyWith`, y `RegisterBloc` con `SignUpUseCase`.

Después conecta la pantalla igual que `LoginScreen`: `_submit()` lanza el evento en lugar de navegar, y la ruta `/register` queda envuelta en su propio `BlocProvider`. Los campos de nombre de usuario y nombre completo todavía no se envían: el perfil llega en el Paso 11.

## Paso 9 · La navegación

Los botones que llevan de `LoginScreen` a `/register` y de vuelta a `/login` ya vienen en el proyecto. Comprueba que siguen funcionando ahora que cada ruta tiene su propio `BlocProvider`.

## Paso 10 · La tabla profiles

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

Es la tabla que creaste en *Configurando los servicios*, con su permiso. Comprueba en el `Table Editor` del dashboard que existe antes de seguir. Si falta, o si le falta el `grant`, el `insert` del siguiente paso falla con `permission denied for table profiles`.

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

## Paso 11 · El perfil

`RegisterScreen` ya pide el nombre de usuario y el nombre completo: envíalos en `RegisterSubmitted`. Ahora registrar son dos pasos, y quien los ordena es `SignUpUseCase`: primero `signUp` y, si sale bien, `createProfile` con el `id` que devolvió. La lección *Laboratorio 5 a nivel conceptual* muestra el flujo completo.

- Crea el contrato `ProfileRepository` con `createProfile`, y su `ProfileRepositoryImpl`.
- Extiende `SupabaseAuthDataSource` con el `insert`.
- Ni el `Bloc` ni el `DataSource` encadenan los dos pasos.
- Si `createProfile` falla, `SignUpUseCase` atrapa la excepción y decide qué hacer.

El `insert` funciona porque después de `signUp` ya hay una sesión, y el `grant` de la tabla deja escribir a quien la inició.

```dart
await _client.from('profiles').insert({
  'id': userId,
  'username': username,
  'full_name': fullName,
});
```
