# Laboratorio 5 a nivel conceptual

<!-- tags: SignUpUseCase, flujo de registro, quién llama a createProfile, AuthRepository, ProfileRepository,
     secuencia en el UseCase, cuenta creada sin perfil, tabla profiles, capa de dominio, excepción en el registro -->

El Laboratorio 5 pide registrar un usuario: crear su cuenta y guardar su perfil. Eso son dos operaciones, y esta lección muestra, sin código, qué capa decide el orden entre ellas.

## El registro son dos pasos

```svg
<svg id="l5Mapa" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 736" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="l5Mapa-ttl l5Mapa-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="l5Mapa-ttl">El registro, capa por capa</title>
  <desc id="l5Mapa-dsc">Mapa de capas del registro. En presentación, RegisterScreen le manda un evento a RegisterBloc. RegisterBloc llama a SignUpUseCase, en el dominio, que usa dos contratos: primero AuthRepository y después ProfileRepository. En la capa de datos, AuthRepositoryImpl usa SupabaseAuthDataSource, que habla con Supabase Auth, y ProfileRepositoryImpl usa SupabaseProfileDataSource, que habla con la tabla profiles.</desc>
  <defs>
    <style>
      #l5Mapa .title{fill:#161A26;font-size:22px;font-weight:700}
      #l5Mapa .sub{fill:#79809A;font-size:13.5px}
      #l5Mapa .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #l5Mapa .foot{fill:#79809A;font-size:12px}
      #l5Mapa .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #l5Mapa .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #l5Mapa .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#l5Mapa-arrow)}
    </style>
    <marker id="l5Mapa-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="736" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">El registro, capa por capa</text>
  <text class="sub" x="48" y="80" data-fit="860">Registrar un usuario son dos operaciones contra Supabase. Solo una pieza sabe que son dos y en qué orden van.</text>
  <rect x="48" y="104" width="864" height="96" rx="14" fill="#F4EBFF" fill-opacity=".5" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="h" x="68" y="134" style="fill:#7439B8" data-fit="150">PRESENTACIÓN</text>
  <text x="68" y="154" font-size="12.5" fill="#454C61" data-fit="150">Muestra y avisa</text>
  <rect x="48" y="216" width="864" height="176" rx="14" fill="#FFF3DC" fill-opacity=".5" stroke="#F0C572" stroke-width="1.5"/>
  <text class="h" x="68" y="246" style="fill:#A96C05" data-fit="150">DOMINIO</text>
  <text x="68" y="266" font-size="12.5" fill="#454C61" data-fit="150">Decide el orden</text>
  <rect x="48" y="408" width="864" height="168" rx="14" fill="#E3F6F3" fill-opacity=".5" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="h" x="68" y="438" style="fill:#0F8478" data-fit="150">DATOS</text>
  <text x="68" y="458" font-size="12.5" fill="#454C61" data-fit="150">Habla con Supabase</text>
  <rect x="48" y="592" width="864" height="88" rx="14" fill="#EFF1F5" fill-opacity=".5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="h" x="68" y="622" style="fill:#556074" data-fit="150">SUPABASE</text>
  <text x="68" y="642" font-size="12.5" fill="#454C61" data-fit="150">Servicio externo</text>
  <path class="link" d="M432,154 H526"/>
  <text x="480" y="146" text-anchor="middle" font-size="12" font-weight="600" fill="#556074">evento</text>
  <path class="link" d="M628,176 V208 H480 V242"/>
  <text x="554" y="202" text-anchor="middle" font-size="12" font-weight="600" fill="#556074">llama</text>
  <path class="link" d="M440,292 V308 H332 V322"/>
  <path class="link" d="M520,292 V308 H628 V322"/>
  <path class="link" stroke-dasharray="5 4" d="M332,436 V370"/>
  <path class="link" stroke-dasharray="5 4" d="M628,436 V370"/>
  <text x="342" y="404" font-size="12" font-weight="600" fill="#556074">implementa</text>
  <text x="638" y="404" font-size="12" font-weight="600" fill="#556074">implementa</text>
  <path class="link" d="M332,480 V510"/>
  <path class="link" d="M628,480 V510"/>
  <path class="link" d="M332,556 V612"/>
  <path class="link" d="M628,556 V612"/>
  <rect x="232" y="132" width="200" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="332" y="154" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#7439B8" data-fit="184">RegisterScreen</text>
  <rect x="528" y="132" width="200" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="628" y="154" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#7439B8" data-fit="184">RegisterBloc</text>
  <rect x="380" y="244" width="200" height="48" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="2.5"/><text class="mono" x="480" y="268" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="184">SignUpUseCase</text>
  <rect x="232" y="324" width="200" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="332" y="346" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#4453C9" data-fit="184">AuthRepository</text>
  <rect x="528" y="324" width="200" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="628" y="346" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#4453C9" data-fit="184">ProfileRepository</text>
  <circle cx="386" cy="308" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="386" y="308" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">1</text>
  <circle cx="574" cy="308" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="574" y="308" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">2</text>
  <text x="748" y="262" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="150">Aquí se decide el</text>
  <text x="748" y="279" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="150">orden: 1 y luego 2.</text>
  <rect x="232" y="436" width="200" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="332" y="458" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#0F8478" data-fit="184">AuthRepositoryImpl</text>
  <rect x="528" y="436" width="200" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="628" y="458" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#0F8478" data-fit="184">ProfileRepositoryImpl</text>
  <rect x="220" y="512" width="224" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="332" y="534" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="208">SupabaseAuthDataSource</text>
  <rect x="516" y="512" width="224" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="628" y="534" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="208">SupabaseProfileDataSource</text>
  <rect x="232" y="614" width="200" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="332" y="636" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="184">Supabase Auth</text>
  <rect x="528" y="614" width="200" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="628" y="636" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="184">tabla profiles</text>
  <text class="foot" x="48" y="708" data-fit="860">Los dos contratos son del dominio. Quién los cumple, y con qué servicio, es asunto de la capa de datos.</text>
</svg>
```

Crear la cuenta le toca a Supabase Auth. Guardar el perfil, con el `username` y el nombre, le toca a la tabla `profiles`. Son dos servicios, y por eso todo viene de a dos: dos entidades, `AuthUser` y `Profile`; dos contratos, `AuthRepository` y `ProfileRepository`; y dos data sources. La única pieza que conoce a los dos es `SignUpUseCase`.

## El UseCase pone el orden

```svg
<svg id="l5Secuencia" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 548" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="l5Secuencia-ttl l5Secuencia-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="l5Secuencia-ttl">El UseCase pone el orden</title>
  <desc id="l5Secuencia-dsc">Diagrama de secuencia. RegisterBloc le pide el registro a SignUpUseCase. Paso 1: el UseCase llama a signUp en AuthRepository y recibe un AuthUser con su id. Paso 2: con ese id arma un Profile y llama a createProfile en ProfileRepository. Cuando el perfil queda guardado, el UseCase le devuelve el Profile a RegisterBloc.</desc>
  <defs>
    <style>
      #l5Secuencia .title{fill:#161A26;font-size:22px;font-weight:700}
      #l5Secuencia .sub{fill:#79809A;font-size:13.5px}
      #l5Secuencia .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #l5Secuencia .foot{fill:#79809A;font-size:12px}
      #l5Secuencia .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #l5Secuencia .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #l5Secuencia .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#l5Secuencia-arrow)}
      #l5Secuencia .ar-green{fill:none;stroke:#3A8235;stroke-width:1.75;marker-end:url(#l5Secuencia-ar-green)}
    </style>
    <marker id="l5Secuencia-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="l5Secuencia-ar-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#3A8235"/></marker>
  </defs>
  <rect width="960" height="548" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">El <tspan class="mono">UseCase</tspan> pone el orden</text>
  <text class="sub" x="48" y="80" data-fit="860">Primero la cuenta, después el perfil. El segundo paso usa lo que devolvió el primero.</text>
  <path d="M144,156 V480" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 5"/>
  <rect x="56" y="112" width="176" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="144" y="134" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#7439B8" data-fit="160">RegisterBloc</text>
  <path d="M368,156 V480" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 5"/>
  <rect x="280" y="112" width="176" height="44" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="2.5"/><text class="mono" x="368" y="134" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="160">SignUpUseCase</text>
  <path d="M608,156 V480" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 5"/>
  <rect x="520" y="112" width="176" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="608" y="134" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#4453C9" data-fit="160">AuthRepository</text>
  <path d="M832,156 V480" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="4 5"/>
  <rect x="744" y="112" width="176" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="832" y="134" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#4453C9" data-fit="160">ProfileRepository</text>
  <rect x="362" y="188" width="12" height="268" rx="4" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <path class="link" d="M144,204 H360"/>
  <text x="253" y="195" text-anchor="middle" font-size="12.5" font-weight="600" fill="#556074" data-fit="216">pide el registro</text>
  <path class="link" d="M374,256 H606"/>
  <text class="mono" x="500" y="247" text-anchor="middle" font-size="12.5" font-weight="600" fill="#556074" data-fit="216">signUp(email, password)</text>
  <path class="ar-green" stroke-dasharray="5 4" d="M608,304 H376"/>
  <text x="492" y="295" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235" data-fit="216">AuthUser, con su id</text>
  <path class="link" d="M374,356 H830"/>
  <text class="mono" x="720" y="347" text-anchor="middle" font-size="12.5" font-weight="600" fill="#556074" data-fit="216">createProfile(profile)</text>
  <path class="ar-green" stroke-dasharray="5 4" d="M832,404 H376"/>
  <text x="720" y="395" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235" data-fit="216">perfil guardado</text>
  <path class="ar-green" stroke-dasharray="5 4" d="M362,452 H146"/>
  <text x="253" y="443" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235" data-fit="216">Profile</text>
  <circle cx="398" cy="256" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="398" y="256" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">1</text>
  <circle cx="398" cy="356" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="398" y="356" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">2</text>
  <g transform="translate(152,292)"><rect width="198" height="77" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="170">El orden importa</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="170">El Profile se arma con el id</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="170">que devuelve el paso 1.</text></g>
  <text class="foot" x="48" y="520" data-fit="860">RegisterBloc hace una sola llamada. No sabe que por dentro hay dos pasos.</text>
</svg>
```

El perfil se guarda con el `id` de la cuenta, así que la cuenta va primero. Ese orden es una regla del registro, no un detalle de Supabase. `SignUpUseCase` la escribe una sola vez: llama a `signUp`, espera el `AuthUser`, con su `id` arma el `Profile` y llama a `createProfile`.

## Por qué no en otra capa

```svg
<svg id="l5Donde" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 476" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="l5Donde-ttl l5Donde-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="l5Donde-ttl">Dónde se escribe la secuencia</title>
  <desc id="l5Donde-dsc">Tres opciones comparadas. Escribir la secuencia en el Bloc no sirve: otra pantalla que registre tendría que repetirla. Escribirla en el DataSource tampoco: queda escondida en el código de Supabase y se pierde al cambiar de proveedor. Escribirla en el UseCase sí: queda en un solo lugar, sin Flutter ni Supabase.</desc>
  <defs>
    <style>
      #l5Donde .title{fill:#161A26;font-size:22px;font-weight:700}
      #l5Donde .sub{fill:#79809A;font-size:13.5px}
      #l5Donde .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #l5Donde .foot{fill:#79809A;font-size:12px}
      #l5Donde .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #l5Donde .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #l5Donde .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#l5Donde-arrow)}
    </style>
    <marker id="l5Donde-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="476" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Dónde se escribe la secuencia</text>
  <text class="sub" x="48" y="80" data-fit="860">El «1 y luego 2» se puede escribir en tres lugares. Solo en uno queda bien.</text>
  <g transform="translate(48,104)"><rect width="272" height="312" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
    <rect x="20" y="18" width="40" height="24" rx="12" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/>
    <text x="40" y="30" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#C2354F">NO</text>
    <text x="72" y="30" dy="0.35em" font-size="15" font-weight="700" fill="#161A26" data-fit="180">En el Bloc</text>
    <path class="tree" d="M100,104 V116 M100,160 V172"/>
    <rect x="24" y="60" width="152" height="44" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="2.5"/><text class="mono" x="100" y="82" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#C2354F" data-fit="136">RegisterBloc</text>
    <path d="M176,82 H190" stroke="#C2354F" stroke-width="1.75"/>
    <rect x="190" y="68" width="62" height="28" rx="14" fill="#C2354F"/>
    <text x="221" y="82" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#FFFFFF">1 → 2</text>
    <rect x="24" y="116" width="152" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="100" y="138" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#556074" data-fit="136">SignUpUseCase</text>
    <rect x="24" y="172" width="152" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="100" y="194" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#556074" data-fit="136">DataSource</text>
    <text x="24" y="250" font-size="12.5" fill="#454C61" data-fit="228">Otra pantalla que registre</text>
    <text x="24" y="268" font-size="12.5" fill="#454C61" data-fit="228">tendría que repetir el orden.</text>
    <text x="24" y="286" font-size="12.5" fill="#454C61" data-fit="228">La vista termina decidiendo.</text>
  </g>
  <g transform="translate(344,104)"><rect width="272" height="312" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
    <rect x="20" y="18" width="40" height="24" rx="12" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/>
    <text x="40" y="30" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#C2354F">NO</text>
    <text x="72" y="30" dy="0.35em" font-size="15" font-weight="700" fill="#161A26" data-fit="180">En el DataSource</text>
    <path class="tree" d="M100,104 V116 M100,160 V172"/>
    <rect x="24" y="60" width="152" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="100" y="82" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#556074" data-fit="136">RegisterBloc</text>
    <rect x="24" y="116" width="152" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="100" y="138" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#556074" data-fit="136">SignUpUseCase</text>
    <rect x="24" y="172" width="152" height="44" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="2.5"/><text class="mono" x="100" y="194" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#C2354F" data-fit="136">DataSource</text>
    <path d="M176,194 H190" stroke="#C2354F" stroke-width="1.75"/>
    <rect x="190" y="180" width="62" height="28" rx="14" fill="#C2354F"/>
    <text x="221" y="194" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#FFFFFF">1 → 2</text>
    <text x="24" y="250" font-size="12.5" fill="#454C61" data-fit="228">El orden queda escondido en</text>
    <text x="24" y="268" font-size="12.5" fill="#454C61" data-fit="228">el código de Supabase. Cambiar</text>
    <text x="24" y="286" font-size="12.5" fill="#454C61" data-fit="228">de proveedor se lo lleva.</text>
  </g>
  <g transform="translate(640,104)"><rect width="272" height="312" rx="12" fill="#FFFFFF" stroke="#9FD68D" stroke-width="2.5"/>
    <rect x="20" y="18" width="40" height="24" rx="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/>
    <text x="40" y="30" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#3A8235">SÍ</text>
    <text x="72" y="30" dy="0.35em" font-size="15" font-weight="700" fill="#161A26" data-fit="180">En el UseCase</text>
    <path class="tree" d="M100,104 V116 M100,160 V172"/>
    <rect x="24" y="60" width="152" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="100" y="82" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#556074" data-fit="136">RegisterBloc</text>
    <rect x="24" y="116" width="152" height="44" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="2.5"/><text class="mono" x="100" y="138" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235" data-fit="136">SignUpUseCase</text>
    <path d="M176,138 H190" stroke="#3A8235" stroke-width="1.75"/>
    <rect x="190" y="124" width="62" height="28" rx="14" fill="#3A8235"/>
    <text x="221" y="138" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#FFFFFF">1 → 2</text>
    <rect x="24" y="172" width="152" height="44" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="100" y="194" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#556074" data-fit="136">DataSource</text>
    <text x="24" y="250" font-size="12.5" fill="#454C61" data-fit="228">Un solo lugar, sin Flutter ni</text>
    <text x="24" y="268" font-size="12.5" fill="#454C61" data-fit="228">Supabase. Se lee de corrido y</text>
    <text x="24" y="286" font-size="12.5" fill="#454C61" data-fit="228">se prueba sin pantalla ni red.</text>
  </g>
  <text class="foot" x="48" y="448" data-fit="860">La etiqueta «1 → 2» marca quién encadena signUp y createProfile en cada opción.</text>
</svg>
```

El `Bloc` podría encadenar los dos pasos, y la capa de datos también. En ambos casos la app funciona, pero la regla queda en el lugar equivocado: en la vista, donde se repite, o en el código de Supabase, donde se pierde al cambiar de proveedor.

## Si el segundo paso falla

```svg
<svg id="l5Falla" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 400" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="l5Falla-ttl l5Falla-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="l5Falla-ttl">Si el segundo paso falla</title>
  <desc id="l5Falla-dsc">Cuatro momentos. Uno: signUp sale bien y la cuenta queda creada en Supabase Auth. Dos: createProfile falla y lanza una excepción. Tres: SignUpUseCase la atrapa, cierra la sesión y lanza un error propio del dominio. Cuatro: RegisterBloc recibe ese error, emite el estado de error y la pantalla muestra el mensaje.</desc>
  <defs>
    <style>
      #l5Falla .title{fill:#161A26;font-size:22px;font-weight:700}
      #l5Falla .sub{fill:#79809A;font-size:13.5px}
      #l5Falla .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #l5Falla .foot{fill:#79809A;font-size:12px}
      #l5Falla .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #l5Falla .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #l5Falla .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#l5Falla-arrow)}
      #l5Falla .ar-rose{fill:none;stroke:#C2354F;stroke-width:1.75;marker-end:url(#l5Falla-ar-rose)}
    </style>
    <marker id="l5Falla-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="l5Falla-ar-rose" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#C2354F"/></marker>
  </defs>
  <rect width="960" height="400" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Si el segundo paso falla</text>
  <text class="sub" x="48" y="80" data-fit="860">La cuenta ya existe y el perfil no. La excepción sube, y quien decide qué hacer con ella es el UseCase.</text>
  <g transform="translate(48,112)"><rect width="204" height="180" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
    <circle cx="28" cy="32" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="28" y="32" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">1</text>
    <text class="mono" x="16" y="70" font-size="14" font-weight="700" fill="#161A26" data-fit="176">signUp</text>
    <text x="16" y="93" font-size="13" fill="#454C61" data-fit="176">Sale bien. La cuenta</text>
    <text x="16" y="111" font-size="13" fill="#454C61" data-fit="176">queda creada en</text>
    <text x="16" y="129" font-size="13" fill="#454C61" data-fit="176">Supabase Auth.</text>
    <rect x="16" y="142" width="172" height="24" rx="6" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>
    <text x="102" y="154" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#3A8235" data-fit="160">cuenta creada</text>
  </g>
  <g transform="translate(268,112)"><rect width="204" height="180" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
    <circle cx="28" cy="32" r="12" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text x="28" y="32" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#C2354F">2</text>
    <text class="mono" x="16" y="70" font-size="14" font-weight="700" fill="#161A26" data-fit="176">createProfile</text>
    <text x="16" y="93" font-size="13" fill="#454C61" data-fit="176">El insert falla y</text>
    <text x="16" y="111" font-size="13" fill="#454C61" data-fit="176">lanza una excepción.</text>
    <text x="16" y="129" font-size="13" fill="#454C61" data-fit="176">No hay perfil.</text>
    <rect x="16" y="142" width="172" height="24" rx="6" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.25"/>
    <text x="102" y="154" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#C2354F" data-fit="160">lanza excepción</text>
  </g>
  <g transform="translate(488,112)"><rect width="204" height="180" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
    <circle cx="28" cy="32" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="28" y="32" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">3</text>
    <text class="mono" x="16" y="70" font-size="14" font-weight="700" fill="#161A26" data-fit="176">SignUpUseCase</text>
    <text x="16" y="93" font-size="13" fill="#454C61" data-fit="176">La atrapa, cierra la</text>
    <text x="16" y="111" font-size="13" fill="#454C61" data-fit="176">sesión y lanza un</text>
    <text x="16" y="129" font-size="13" fill="#454C61" data-fit="176">error del dominio.</text>
    <rect x="16" y="142" width="172" height="24" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
    <text x="102" y="154" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#A96C05" data-fit="160">try · catch</text>
  </g>
  <g transform="translate(708,112)"><rect width="204" height="180" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
    <circle cx="28" cy="32" r="12" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="28" y="32" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8">4</text>
    <text class="mono" x="16" y="70" font-size="14" font-weight="700" fill="#161A26" data-fit="176">RegisterBloc</text>
    <text x="16" y="93" font-size="13" fill="#454C61" data-fit="176">Emite el estado de</text>
    <text x="16" y="111" font-size="13" fill="#454C61" data-fit="176">error. La pantalla</text>
    <text x="16" y="129" font-size="13" fill="#454C61" data-fit="176">muestra el mensaje.</text>
    <rect x="16" y="142" width="172" height="24" rx="6" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.25"/>
    <text x="102" y="154" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#7439B8" data-fit="160">estado de error</text>
  </g>
  <path d="M48,316 V324 H692 V316" fill="none" stroke="#F0C572" stroke-width="2"/>
  <text class="h" x="370" y="346" text-anchor="middle" style="fill:#A96C05" data-fit="600">LO COORDINA EL USECASE</text>
  <path d="M708,316 V324 H912 V316" fill="none" stroke="#C9A6EE" stroke-width="2"/>
  <text class="h" x="810" y="346" text-anchor="middle" style="fill:#7439B8" data-fit="200">SOLO MUESTRA</text>
  <text class="foot" x="48" y="372" data-fit="860">Dejar pasar la excepción, reintentar o cerrar la sesión: cualquiera de las tres es una decisión del UseCase.</text>
</svg>
```

Los dos pasos no son una sola operación: puede quedar una cuenta sin perfil. `createProfile` avisa con una excepción, y `SignUpUseCase` la atrapa con manejo de excepciones. Qué hacer después también es parte de la secuencia, así que se decide ahí mismo. El `Bloc` solo convierte el error en un estado.
