# Configurando los servicios

<!-- tags: npx supabase, supabase login, supabase link, supabase db push, supabase config push, tabla profiles,
     permission denied for table profiles, contraseña hasheada, UID del usuario, auth.users, Access token not provided,
     grant a authenticated -->

En *Instalación de supabase* creaste la organización, el proyecto y copiaste la `publishable key`. Falta preparar los dos servicios que usa un registro de usuarios: el módulo de Auth y la base de datos. Primero, cómo se reparten el trabajo. Después se configuran desde la consola.

## Dos lugares para un mismo usuario

```svg
<svg id="svDos" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 484" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="svDos-ttl svDos-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="svDos-ttl">Dos lugares para un mismo usuario</title>
  <desc id="svDos-dsc">Dos registros lado a lado. A la izquierda, auth.users, que maneja el módulo de Auth: id, email, encrypted_password, email_confirmed_at y last_sign_in_at. A la derecha, profiles, una tabla que diseñas tú en la base de datos: id, username y full_name. Auth responde quién eres; profiles guarda cómo te llamas y lo que la app necesite.</desc>
  <defs>
    <style>
      #svDos .title{fill:#161A26;font-size:22px;font-weight:700}
      #svDos .sub{fill:#79809A;font-size:13.5px}
      #svDos .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #svDos .foot{fill:#79809A;font-size:12px}
      #svDos .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #svDos .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #svDos .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#svDos-arrow)}
    </style>
    <marker id="svDos-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="484" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Dos lugares para un mismo usuario</text>
  <text class="sub" x="48" y="80" data-fit="860">Auth guarda lo necesario para saber quién eres. Todo lo demás sobre el usuario va en una tabla tuya.</text>
  <rect x="48" y="112" width="416" height="220" rx="12" fill="#FFFFFF" stroke="#F0C572" stroke-width="2"/>
  <path d="M48,152 V124 A12,12 0 0 1 60,112 H452 A12,12 0 0 1 464,124 V152 Z" fill="#FFF3DC" stroke="#F0C572" stroke-width="2"/>
  <text class="mono" x="64" y="132" dy="0.35em" font-size="14" font-weight="700" fill="#A96C05">auth.users</text>
  <text x="448" y="132" dy="0.35em" text-anchor="end" font-size="12" fill="#454C61" data-fit="266">MÓDULO DE AUTH</text>
  <text class="mono" x="64" y="170" dy="0.35em" font-size="13" font-weight="400" fill="#161A26">id</text>
  <text class="mono" x="238" y="170" dy="0.35em" font-size="12.5" fill="#79809A" data-fit="212">3f2a9c1e-7b…</text>
  <path d="M49,188 H463" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="64" y="206" dy="0.35em" font-size="13" font-weight="400" fill="#161A26">email</text>
  <text class="mono" x="238" y="206" dy="0.35em" font-size="12.5" fill="#79809A" data-fit="212">ana@icesi.edu.co</text>
  <path d="M49,224 H463" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="64" y="242" dy="0.35em" font-size="13" font-weight="400" fill="#161A26">encrypted_password</text>
  <text class="mono" x="238" y="242" dy="0.35em" font-size="12.5" fill="#79809A" data-fit="212">$2a$10$N9qo8uLOickgx2Z…</text>
  <path d="M49,260 H463" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="64" y="278" dy="0.35em" font-size="13" font-weight="400" fill="#161A26">email_confirmed_at</text>
  <text class="mono" x="238" y="278" dy="0.35em" font-size="12.5" fill="#79809A" data-fit="212">2026-10-05 09:14</text>
  <path d="M49,296 H463" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="64" y="314" dy="0.35em" font-size="13" font-weight="400" fill="#161A26">last_sign_in_at</text>
  <text class="mono" x="238" y="314" dy="0.35em" font-size="12.5" fill="#79809A" data-fit="212">2026-10-05 09:15</text>
  <rect x="496" y="112" width="416" height="148" rx="12" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="2"/>
  <path d="M496,152 V124 A12,12 0 0 1 508,112 H900 A12,12 0 0 1 912,124 V152 Z" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="2"/>
  <text class="mono" x="512" y="132" dy="0.35em" font-size="14" font-weight="700" fill="#4453C9">profiles</text>
  <text x="896" y="132" dy="0.35em" text-anchor="end" font-size="12" fill="#454C61" data-fit="266">TU BASE DE DATOS</text>
  <text class="mono" x="512" y="170" dy="0.35em" font-size="13" font-weight="400" fill="#161A26">id</text>
  <text class="mono" x="686" y="170" dy="0.35em" font-size="12.5" fill="#79809A" data-fit="212">3f2a9c1e-7b…</text>
  <path d="M497,188 H911" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="512" y="206" dy="0.35em" font-size="13" font-weight="400" fill="#161A26">username</text>
  <text class="mono" x="686" y="206" dy="0.35em" font-size="12.5" fill="#79809A" data-fit="212">ana.dev</text>
  <path d="M497,224 H911" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="512" y="242" dy="0.35em" font-size="13" font-weight="400" fill="#161A26">full_name</text>
  <text class="mono" x="686" y="242" dy="0.35em" font-size="12.5" fill="#79809A" data-fit="212">Ana Gómez</text>
  <g transform="translate(496,272)"><rect width="416" height="77" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#4453C9" data-fit="388">La diseñas tú</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="388">Nombre, username, foto, carrera: lo que tu app necesite.</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="388">Auth no tiene columnas para eso.</text></g>
  <g transform="translate(48,348)"><rect width="416" height="77" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="388">La maneja Supabase</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="388">Tu app nunca escribe aquí directamente:</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="388">usa signUp y signInWithPassword.</text></g>
  <g transform="translate(496,365)"><rect width="416" height="60" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#556074" data-fit="388">La pregunta de cada una</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="388">Auth: ¿quién eres? · profiles: ¿qué sabemos de ti?</text></g>
  <text class="foot" x="48" y="456" data-fit="860">auth.users tiene más columnas. Estas son las que importan para entender el registro y el inicio de sesión.</text>
</svg>
```

El módulo de Auth solo guarda lo que necesita para identificarte. No tiene dónde poner un nombre, un `username` o una foto. Esos datos van en una tabla de la base de datos, que creas tú.

## La contraseña no se guarda

```svg
<svg id="svHash" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 416" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="svHash-ttl svHash-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="svHash-ttl">La contraseña no se guarda</title>
  <desc id="svHash-dsc">La contraseña MiClave123 que escribe el usuario pasa por la función bcrypt y se convierte en un hash, que es lo único que Auth guarda en la columna encrypted_password. Del hash no se puede volver a la contraseña. Al iniciar sesión, Auth hashea lo que el usuario escribe y compara los dos hashes.</desc>
  <defs>
    <style>
      #svHash .title{fill:#161A26;font-size:22px;font-weight:700}
      #svHash .sub{fill:#79809A;font-size:13.5px}
      #svHash .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #svHash .foot{fill:#79809A;font-size:12px}
      #svHash .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #svHash .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #svHash .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#svHash-arrow)}
      #svHash .ar-rose{fill:none;stroke:#C2354F;stroke-width:1.75;marker-end:url(#svHash-ar-rose)}
    </style>
    <marker id="svHash-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="svHash-ar-rose" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#C2354F"/></marker>
  </defs>
  <rect width="960" height="416" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">La contraseña no se guarda</text>
  <text class="sub" x="48" y="80" data-fit="860">Auth guarda un hash: el resultado de pasar la contraseña por una función que no tiene camino de vuelta.</text>
  <rect x="48" y="112" width="240" height="104" rx="12" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="2"/>
  <text class="h" x="64" y="136" style="fill:#556074" data-fit="210">LO QUE ESCRIBE EL USUARIO</text>
  <rect x="64" y="148" width="208" height="30" rx="6" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.25"/>
  <text class="mono" x="168" y="163" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#556074" data-fit="196">MiClave123</text>
  <text x="64" y="200" font-size="12.5" fill="#454C61" data-fit="210">Viaja cifrada hasta Supabase.</text>
  <rect x="360" y="112" width="240" height="104" rx="12" fill="#FFFFFF" stroke="#F0C572" stroke-width="2"/>
  <text class="h" x="376" y="136" style="fill:#A96C05" data-fit="210">FUNCIÓN HASH</text>
  <rect x="376" y="148" width="208" height="30" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text class="mono" x="480" y="163" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="196">bcrypt</text>
  <text x="376" y="200" font-size="12.5" fill="#454C61" data-fit="210">Solo funciona en un sentido.</text>
  <rect x="672" y="112" width="240" height="104" rx="12" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="2"/>
  <text class="h" x="688" y="136" style="fill:#4453C9" data-fit="210">LO QUE GUARDA AUTH</text>
  <rect x="688" y="148" width="208" height="30" rx="6" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/>
  <text class="mono" x="792" y="163" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="196">$2a$10$N9qo8uLOickgx2Z…</text>
  <text x="688" y="200" font-size="12.5" fill="#454C61" data-fit="210">En encrypted_password.</text>
  <path class="link" d="M288,164 H358"/>
  <path class="link" d="M600,164 H670"/>
  <path class="ar-rose" stroke-dasharray="5 4" d="M792,216 V248 H168 V218"/>
  <rect x="388" y="236" width="184" height="24" rx="12" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/>
  <text x="480" y="248" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#C2354F">no hay camino de vuelta</text>
  <g transform="translate(48,284)"><rect width="416" height="77" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="388">Al iniciar sesión</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="388">Auth hashea lo que escribes y compara los dos hashes.</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="388">Nunca compara contraseñas.</text></g>
  <g transform="translate(496,284)"><rect width="416" height="77" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#556074" data-fit="388">Por eso existe «olvidé mi contraseña»</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="388">Nadie puede decirte cuál era, ni Supabase ni el profesor.</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="388">Solo se puede cambiar por una nueva.</text></g>
  <text class="foot" x="48" y="388" data-fit="860">Tampoco guardes contraseñas tú: ni en profiles, ni en un print, ni en el estado del Bloc más tiempo del necesario.</text>
</svg>
```

Auth nunca guarda la contraseña tal como se escribió. Guarda su *hash*, y de un hash no se puede volver a la contraseña. Si alguien llegara a leer la tabla, no tendría las contraseñas de nadie.

## El UID une las dos partes

```svg
<svg id="svUid" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 440" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="svUid-ttl svUid-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="svUid-ttl">El UID une las dos partes</title>
  <desc id="svUid-dsc">Flujo del registro en tres pasos. Uno: la app envía correo y contraseña al módulo de Auth, que crea la cuenta. Dos: Auth devuelve el UID de esa cuenta. Tres: la app guarda en la tabla profiles una fila cuyo id es ese mismo UID, junto con el username. Las dos filas quedan unidas por el mismo valor.</desc>
  <defs>
    <style>
      #svUid .title{fill:#161A26;font-size:22px;font-weight:700}
      #svUid .sub{fill:#79809A;font-size:13.5px}
      #svUid .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #svUid .foot{fill:#79809A;font-size:12px}
      #svUid .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #svUid .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #svUid .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#svUid-arrow)}
      #svUid .ar-green{fill:none;stroke:#3A8235;stroke-width:1.75;marker-end:url(#svUid-ar-green)}
    </style>
    <marker id="svUid-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="svUid-ar-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#3A8235"/></marker>
  </defs>
  <rect width="960" height="440" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">El UID une las dos partes</text>
  <text class="sub" x="48" y="80" data-fit="860">Auth le pone a cada cuenta un identificador único. Tu tabla usa ese mismo valor como id de la fila.</text>
  <rect x="48" y="112" width="160" height="248" rx="18" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/><text x="64" y="136" dy="0.35em" font-size="14" font-weight="600" fill="#161A26">Registro</text><path d="M50,154 H206" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="64" y="168" width="128" height="26" rx="6" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="74" y="181" dy="0.35em" font-size="12" fill="#79809A">correo</text>
  <rect x="64" y="204" width="128" height="26" rx="6" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="74" y="217" dy="0.35em" font-size="12" fill="#79809A">contraseña</text>
  <rect x="64" y="240" width="128" height="26" rx="6" fill="#F5F6FA" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="74" y="253" dy="0.35em" font-size="12" fill="#79809A">username</text>
  <rect x="64" y="290" width="128" height="28" rx="14" fill="#4453C9"/>
  <text x="128" y="304" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#FFFFFF">Registrarme</text>
  <path class="link" d="M208,172 H430"/>
  <text x="332" y="163" text-anchor="middle" font-size="12.5" font-weight="600" fill="#556074">correo + contraseña</text>
  <path class="ar-green" stroke-dasharray="5 4" d="M432,200 H210"/>
  <text x="332" y="218" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">el UID de la cuenta</text>
  <path class="link" d="M208,254 H320 V316 H430"/>
  <text x="376" y="307" text-anchor="middle" font-size="12.5" font-weight="600" fill="#556074">UID + username</text>
  <circle cx="232" cy="172" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="232" y="172" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">1</text>
  <circle cx="408" cy="200" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="408" y="200" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">2</text>
  <circle cx="232" cy="254" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="232" y="254" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">3</text>
  <rect x="432" y="112" width="224" height="104" rx="12" fill="#FFFFFF" stroke="#F0C572" stroke-width="2"/>
  <path d="M432,152 V124 A12,12 0 0 1 444,112 H644 A12,12 0 0 1 656,124 V152 Z" fill="#FFF3DC" stroke="#F0C572" stroke-width="2"/>
  <text class="mono" x="448" y="132" dy="0.35em" font-size="14" font-weight="700" fill="#A96C05">auth.users</text>
  <rect x="438" y="156" width="212" height="24" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text class="mono" x="448" y="168" dy="0.35em" font-size="13" font-weight="700" fill="#161A26">id</text>
  <text class="mono" x="524" y="168" dy="0.35em" font-size="12.5" fill="#A96C05" data-fit="118">3f2a9c1e-7b…</text>
  <path d="M433,184 H655" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="448" y="200" dy="0.35em" font-size="13" font-weight="400" fill="#161A26">email</text>
  <text class="mono" x="524" y="200" dy="0.35em" font-size="12.5" fill="#79809A" data-fit="118">ana@icesi…</text>
  <rect x="432" y="264" width="224" height="104" rx="12" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="2"/>
  <path d="M432,304 V276 A12,12 0 0 1 444,264 H644 A12,12 0 0 1 656,276 V304 Z" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="2"/>
  <text class="mono" x="448" y="284" dy="0.35em" font-size="14" font-weight="700" fill="#4453C9">profiles</text>
  <rect x="438" y="308" width="212" height="24" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text class="mono" x="448" y="320" dy="0.35em" font-size="13" font-weight="700" fill="#161A26">id</text>
  <text class="mono" x="524" y="320" dy="0.35em" font-size="12.5" fill="#A96C05" data-fit="118">3f2a9c1e-7b…</text>
  <path d="M433,336 H655" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="448" y="352" dy="0.35em" font-size="13" font-weight="400" fill="#161A26">username</text>
  <text class="mono" x="524" y="352" dy="0.35em" font-size="12.5" fill="#79809A" data-fit="118">ana.dev</text>
  <path d="M544,216 V264" stroke="#A96C05" stroke-width="2.5" fill="none"/>
  <text x="554" y="240" dy="0.35em" font-size="12.5" font-weight="700" fill="#A96C05">mismo UID</text>
  <g transform="translate(688,112)"><rect width="224" height="77" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="196">1 · Auth crea la cuenta</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="196">Guarda el correo y el hash</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="196">de la contraseña.</text></g>
  <g transform="translate(688,200)"><rect width="224" height="77" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#3A8235" data-fit="196">2 · Devuelve el UID</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="196">El identificador único</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="196">de esa cuenta.</text></g>
  <g transform="translate(688,288)"><rect width="224" height="77" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#4453C9" data-fit="196">3 · La app guarda el perfil</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="196">Con ese mismo UID</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="196">como id de la fila.</text></g>
  <text class="foot" x="48" y="412" data-fit="860">Con el UID de quien inició sesión siempre se encuentra su perfil, y nadie más tiene ese valor.</text>
</svg>
```

Cada cuenta tiene un identificador único, el UID. La fila del perfil usa ese mismo valor como `id`. Así no hace falta repetir el correo en tu tabla: con el UID de quien inició sesión se llega a su perfil.

## Desde la consola

```svg
<svg id="sbPasos" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 384" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="sbPasos-ttl sbPasos-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="sbPasos-ttl">Cuatro pasos desde la consola</title>
  <desc id="sbPasos-dsc">Cuatro pasos en orden: comprobar que el comando supabase funciona con npx, conectar la carpeta con el proyecto usando supabase login y supabase link, crear la tabla profiles con supabase db push y configurar el Auth por email con supabase config push.</desc>
  <defs>
    <style>
      #sbPasos .title{fill:#161A26;font-size:22px;font-weight:700}
      #sbPasos .sub{fill:#79809A;font-size:13.5px}
      #sbPasos .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #sbPasos .foot{fill:#79809A;font-size:12px}
      #sbPasos .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #sbPasos .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #sbPasos .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#sbPasos-arrow)}
    </style>
    <marker id="sbPasos-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="384" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Cuatro pasos desde la consola</text>
  <text class="sub" x="48" y="80" data-fit="860">El proyecto ya existe. Lo que falta es crear la tabla y ajustar el Auth, y eso se hace con comandos.</text>
  <g transform="translate(48,112)"><rect width="424" height="100" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
    <circle cx="28" cy="28" r="12" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="28" y="28" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#556074">1</text>
    <text x="50" y="28" dy="0.35em" font-size="14.5" font-weight="700" fill="#161A26" data-fit="350">El comando supabase</text>
    <rect x="16" y="46" width="392" height="24" rx="6" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.25"/>
    <text class="mono" x="26" y="58" dy="0.35em" font-size="12" font-weight="600" fill="#556074" data-fit="372">npx supabase --version</text>
    <text x="16" y="88" font-size="12.5" fill="#454C61" data-fit="392">Se ejecuta con npx, que viene con Node.js.</text>
  </g>
  <g transform="translate(488,112)"><rect width="424" height="100" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
    <circle cx="28" cy="28" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="28" y="28" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">2</text>
    <text x="50" y="28" dy="0.35em" font-size="14.5" font-weight="700" fill="#161A26" data-fit="350">Conectar con tu proyecto</text>
    <rect x="16" y="46" width="392" height="24" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
    <text class="mono" x="26" y="58" dy="0.35em" font-size="12" font-weight="600" fill="#A96C05" data-fit="372">npx supabase login · npx supabase link</text>
    <text x="16" y="88" font-size="12.5" fill="#454C61" data-fit="392">Autorizas la consola y eliges el proyecto.</text>
  </g>
  <g transform="translate(48,228)"><rect width="424" height="100" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
    <circle cx="28" cy="28" r="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="28" y="28" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9">3</text>
    <text x="50" y="28" dy="0.35em" font-size="14.5" font-weight="700" fill="#161A26" data-fit="350">La tabla profiles</text>
    <rect x="16" y="46" width="392" height="24" rx="6" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/>
    <text class="mono" x="26" y="58" dy="0.35em" font-size="12" font-weight="600" fill="#4453C9" data-fit="372">npx supabase db push</text>
    <text x="16" y="88" font-size="12.5" fill="#454C61" data-fit="392">Sube el SQL de la tabla y sus permisos.</text>
  </g>
  <g transform="translate(488,228)"><rect width="424" height="100" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
    <circle cx="28" cy="28" r="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="28" y="28" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">4</text>
    <text x="50" y="28" dy="0.35em" font-size="14.5" font-weight="700" fill="#161A26" data-fit="350">El Auth por email</text>
    <rect x="16" y="46" width="392" height="24" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
    <text class="mono" x="26" y="58" dy="0.35em" font-size="12" font-weight="600" fill="#0F8478" data-fit="372">npx supabase config push</text>
    <text x="16" y="88" font-size="12.5" fill="#454C61" data-fit="392">Registro activo, sin confirmación de correo.</text>
  </g>
  <text class="foot" x="48" y="356" data-fit="860">Todos los comandos se ejecutan dentro de la carpeta de tu proyecto de Flutter.</text>
</svg>
```

Vas a necesitar dos datos de *Instalación de supabase*: el identificador de tu proyecto, que son las veinte letras de tu `Project URL`, y la contraseña de la base de datos.

## 1. El comando supabase

El comando se ejecuta con `npx`, que viene con Node.js. No hay que instalar nada más, y funciona igual en Windows, macOS y Linux. Comprueba que tienes Node:

```shell
node --version
```

Si el comando no existe, instala la versión LTS desde [nodejs.org](https://nodejs.org/) y abre una terminal nueva.

Todos los comandos empiezan por `npx supabase`. La primera vez, `npx` pregunta si puede descargar el paquete: responde `y`.

```shell
npx supabase --version
```

## 2. Conectar con tu proyecto

Abre la terminal en la carpeta `moviles_auth`, tu proyecto de Flutter. Autoriza la consola con tu cuenta; este comando abre el navegador una vez:

```shell
npx supabase login
```

Sin ese paso, los demás comandos responden `Access token not provided`.

Crea la carpeta `supabase/` y conéctala con tu proyecto:

```shell
npx supabase init
npx supabase link --project-ref TU_IDENTIFICADOR
```

Si este comando o los siguientes piden una contraseña, es la de la base de datos.

## 3. La tabla profiles

Una tabla se crea con una **migración**: un archivo SQL que el comando ejecuta en la base de datos.

```shell
npx supabase migration new create_profiles
```

```svg
<svg id="sbCarpetas" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 442" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="sbCarpetas-ttl sbCarpetas-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="sbCarpetas-ttl">La carpeta supabase</title>
  <desc id="sbCarpetas-dsc">Árbol de carpetas: dentro del proyecto de Flutter, junto a lib y pubspec.yaml, la carpeta supabase contiene config.toml y la carpeta migrations, con un archivo SQL cuyo nombre empieza por la fecha y termina en create_profiles.</desc>
  <defs>
    <style>
      #sbCarpetas .title{fill:#161A26;font-size:22px;font-weight:700}
      #sbCarpetas .sub{fill:#79809A;font-size:13.5px}
      #sbCarpetas .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #sbCarpetas .foot{fill:#79809A;font-size:12px}
      #sbCarpetas .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #sbCarpetas .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #sbCarpetas .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#sbCarpetas-arrow)}
    </style>
    <marker id="sbCarpetas-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="442" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">La carpeta <tspan class="mono">supabase/</tspan></text>
  <text class="sub" x="48" y="80" data-fit="860">La configuración del proyecto de Supabase vive junto al código de la app, como archivos.</text>
  <rect x="48" y="96" width="864" height="286" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="68" y="111" width="118" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="78" y="124" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="106">moviles_auth/</text>
  <text x="484" y="124" dy="0.35em" font-size="13" fill="#454C61" data-fit="400">Tu proyecto de Flutter</text>
  <path d="M80,137 V162 H93" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="96" y="149" width="50" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="106" y="162" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="38">lib/</text>
  <text x="484" y="162" dy="0.35em" font-size="13" fill="#454C61" data-fit="400">El código Dart</text>
  <path d="M80,137 V200 H93" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="96" y="187" width="110" height="26" rx="4" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="106" y="200" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="98">pubspec.yaml</text>
  <path d="M80,137 V238 H93" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="96" y="225" width="88" height="26" rx="8" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="106" y="238" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="76">supabase/</text>
  <text x="484" y="238" dy="0.35em" font-size="13" fill="#454C61" data-fit="400">La crea npx supabase init</text>
  <path d="M108,251 V276 H121" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="124" y="263" width="102" height="26" rx="4" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="134" y="276" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="90">config.toml</text>
  <text x="484" y="276" dy="0.35em" font-size="13" fill="#454C61" data-fit="400">La configuración del proyecto. Aquí va el Auth</text>
  <path d="M108,251 V314 H121" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="124" y="301" width="102" height="26" rx="8" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="134" y="314" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="90">migrations/</text>
  <text x="484" y="314" dy="0.35em" font-size="13" fill="#454C61" data-fit="400">Los cambios de la base de datos, en orden</text>
  <path d="M136,327 V352 H149" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="152" y="339" width="275" height="26" rx="4" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="162" y="352" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="263">20261004120000_create_profiles.sql</text>
  <text x="484" y="352" dy="0.35em" font-size="13" fill="#454C61" data-fit="400">El SQL de la tabla profiles</text>
  <text class="foot" x="48" y="414" data-fit="860">El número al inicio del archivo es la fecha y la hora en que lo creaste: el tuyo será distinto.</text>
</svg>
```

Abre el archivo que apareció en `supabase/migrations/` y escribe:

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  full_name text not null
);

grant select, insert, update on public.profiles to authenticated;
```

Son dos cosas, en orden:

- **La tabla.** Su `id` es el UID de la cuenta, y si la cuenta se borra, el perfil se borra con ella.
- **El permiso.** `grant` deja que los usuarios con sesión iniciada usen la tabla desde la app. Sin esa línea, Flutter recibe `permission denied for table profiles`.

Súbela:

```shell
npx supabase db push
```

Para cambiar la tabla más adelante no edites este archivo: crea otra migración con el cambio y vuelve a ejecutar `npx supabase db push`.

## 4. El Auth por email

La configuración del proyecto está en `supabase/config.toml`. Reemplaza todo su contenido por estas líneas, que activan el registro por email y quitan la confirmación de correo:

```toml
project_id = "moviles_auth"

[auth]
enabled = true

[auth.email]
enable_signup = true
enable_confirmations = false
```

Con la confirmación activada, quien se registra no puede iniciar sesión hasta abrir un enlace que le llega al correo. Para aprender, estorba.

Lo que el archivo no menciona queda como está en la nube. Antes de subirlo, mira qué va a cambiar:

```shell
npx supabase config diff
```

Y súbelo. El comando muestra cada cambio y pide confirmación:

```shell
npx supabase config push
```

## Comprobar

Este comando lista las migraciones. La tuya debe aparecer en las dos columnas, la local y la remota:

```shell
npx supabase migration list
```

En el dashboard, la tabla `profiles` aparece en `Table Editor`, todavía vacía. Las cuentas que se registren aparecerán en `Authentication > Users`.
