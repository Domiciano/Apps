# Alternativa: Configurar Supabase desde la terminal

<!-- tags: Supabase CLI, supabase login, supabase projects create, publishable key desde la terminal, supabase db push,
     supabase config push, Access token not provided, config.toml, migraciones, plan gratuito de Supabase -->

Todo lo que *Instalación de supabase* hace con clics en el dashboard se puede hacer con comandos: crear el proyecto, obtener la `publishable key`, crear una tabla y configurar el inicio de sesión por email. Esta lección lo hace con el CLI oficial, y todo funciona con el plan gratuito.

```svg
<svg id="sbPasos" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 400" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="sbPasos-ttl sbPasos-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="sbPasos-ttl">Seis pasos, casi todos en la terminal</title>
  <desc id="sbPasos-dsc">Seis pasos en orden: comprobar que hay Node.js, iniciar sesión con supabase login, crear el proyecto con supabase projects create, obtener la clave con supabase projects api-keys, crear la tabla con supabase db push y configurar el Auth con supabase config push. Solo el inicio de sesión abre el navegador.</desc>
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
  <rect width="960" height="400" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Seis pasos, casi todos en la terminal</text>
  <text class="sub" x="48" y="80" data-fit="860">El navegador solo aparece una vez, para autorizar la terminal. Lo demás son comandos.</text>
  <g transform="translate(48,112)"><rect width="272" height="108" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
    <circle cx="28" cy="28" r="12" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="28" y="28" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#556074">1</text>
    <text x="50" y="28" dy="0.35em" font-size="14.5" font-weight="700" fill="#161A26" data-fit="206">Tener Node.js</text>
    <rect x="16" y="48" width="240" height="24" rx="6" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.25"/>
    <text class="mono" x="26" y="60" dy="0.35em" font-size="12" font-weight="600" fill="#556074" data-fit="222">node --version</text>
    <text x="16" y="92" font-size="12.5" fill="#454C61" data-fit="240">El CLI se ejecuta con npx.</text>
  </g>
  <g transform="translate(344,112)"><rect width="272" height="108" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
    <circle cx="28" cy="28" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="28" y="28" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">2</text>
    <text x="50" y="28" dy="0.35em" font-size="14.5" font-weight="700" fill="#161A26" data-fit="206">Iniciar sesión</text>
    <rect x="16" y="48" width="240" height="24" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
    <text class="mono" x="26" y="60" dy="0.35em" font-size="12" font-weight="600" fill="#A96C05" data-fit="222">npx supabase login</text>
    <text x="16" y="92" font-size="12.5" fill="#454C61" data-fit="240">Abre el navegador para autorizar.</text>
  </g>
  <g transform="translate(640,112)"><rect width="272" height="108" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
    <circle cx="28" cy="28" r="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="28" y="28" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9">3</text>
    <text x="50" y="28" dy="0.35em" font-size="14.5" font-weight="700" fill="#161A26" data-fit="206">Crear el proyecto</text>
    <rect x="16" y="48" width="240" height="24" rx="6" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/>
    <text class="mono" x="26" y="60" dy="0.35em" font-size="12" font-weight="600" fill="#4453C9" data-fit="222">npx supabase projects create</text>
    <text x="16" y="92" font-size="12.5" fill="#454C61" data-fit="240">Te da la URL del proyecto.</text>
  </g>
  <g transform="translate(48,236)"><rect width="272" height="108" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
    <circle cx="28" cy="28" r="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="28" y="28" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9">4</text>
    <text x="50" y="28" dy="0.35em" font-size="14.5" font-weight="700" fill="#161A26" data-fit="206">Obtener la clave</text>
    <rect x="16" y="48" width="240" height="24" rx="6" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/>
    <text class="mono" x="26" y="60" dy="0.35em" font-size="12" font-weight="600" fill="#4453C9" data-fit="222">npx supabase projects api-keys</text>
    <text x="16" y="92" font-size="12.5" fill="#454C61" data-fit="240">La publishable key para Flutter.</text>
  </g>
  <g transform="translate(344,236)"><rect width="272" height="108" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
    <circle cx="28" cy="28" r="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="28" y="28" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">5</text>
    <text x="50" y="28" dy="0.35em" font-size="14.5" font-weight="700" fill="#161A26" data-fit="206">Crear la tabla</text>
    <rect x="16" y="48" width="240" height="24" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
    <text class="mono" x="26" y="60" dy="0.35em" font-size="12" font-weight="600" fill="#0F8478" data-fit="222">npx supabase db push</text>
    <text x="16" y="92" font-size="12.5" fill="#454C61" data-fit="240">Sube el SQL de profiles.</text>
  </g>
  <g transform="translate(640,236)"><rect width="272" height="108" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
    <circle cx="28" cy="28" r="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="28" y="28" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">6</text>
    <text x="50" y="28" dy="0.35em" font-size="14.5" font-weight="700" fill="#161A26" data-fit="206">Configurar el Auth</text>
    <rect x="16" y="48" width="240" height="24" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
    <text class="mono" x="26" y="60" dy="0.35em" font-size="12" font-weight="600" fill="#0F8478" data-fit="222">npx supabase config push</text>
    <text x="16" y="92" font-size="12.5" fill="#454C61" data-fit="240">Email activo, sin confirmación.</text>
  </g>
  <text class="foot" x="48" y="372" data-fit="860">Los pasos 5 y 6 se ejecutan dentro de la carpeta de tu proyecto de Flutter.</text>
</svg>
```

Necesitas una cuenta en [Supabase](https://supabase.com/). Crearla es lo único que no se puede hacer desde la terminal.

## 1. Tener Node.js

El CLI se ejecuta con `npx`, que viene con Node.js. No hay que instalar nada más, y funciona igual en Windows, macOS y Linux. Comprueba que tienes Node:

```shell
node --version
```

Si el comando no existe, instala la versión LTS desde [nodejs.org](https://nodejs.org/) y abre una terminal nueva.

Todos los comandos de esta lección empiezan por `npx supabase`. La primera vez, `npx` pregunta si puede descargar el paquete: responde `y`.

```shell
npx supabase --version
```

## 2. Iniciar sesión

```shell
npx supabase login
```

El comando abre el navegador para que autorices la terminal, y guarda la sesión en tu computador. Sin este paso, los demás comandos responden `Access token not provided`.

Un proyecto siempre pertenece a una organización. Mira cuáles tienes y copia su id:

```shell
npx supabase orgs list
```

Si la lista sale vacía, crea una. Nace en el plan gratuito:

```shell
npx supabase orgs create "Moviles"
```

## 3. Crear el proyecto

```shell
npx supabase projects create moviles-auth --org-id TU_ORG_ID --db-password "UnaClaveLarga123" --region us-east-1
```

Guarda la contraseña de la base de datos: la vas a necesitar en el paso 5. No uses la opción `--size`, que es de los planes de pago.

El plan gratuito permite dos proyectos activos. Si ya tienes dos, pausa uno desde el dashboard antes de crear otro.

El proyecto tarda uno o dos minutos en quedar listo. Su identificador, el `REFERENCE ID`, aparece aquí:

```shell
npx supabase projects list
```

Con ese identificador se arma la `Project URL` que usa Flutter:

```text
https://TU_PROJECT_REF.supabase.co
```

## 4. Obtener la publishable key

```shell
npx supabase projects api-keys --project-ref TU_PROJECT_REF
```

La que necesitas es la que empieza por `sb_publishable_`. Nunca copies a la app la que empieza por `sb_secret_`.

Si en la lista no hay ninguna `sb_publishable_`, créala. Este comando usa un token personal, que se genera una vez en `Account > Access Tokens` del dashboard:

```shell
curl -X POST "https://api.supabase.com/v1/projects/TU_PROJECT_REF/api-keys?reveal=true" \
  -H "Authorization: Bearer TU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type": "publishable", "name": "flutter_app"}'
```

## 5. Crear la tabla

Los comandos que siguen se ejecutan dentro de la carpeta de tu proyecto de Flutter. El primero crea la carpeta `supabase/` y el segundo la conecta con el proyecto de la nube:

```shell
npx supabase init
npx supabase link --project-ref TU_PROJECT_REF
```

Una tabla se crea con una **migración**: un archivo SQL que el CLI ejecuta en la base de datos.

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

Abre el archivo que apareció en `supabase/migrations/` y escribe el SQL de la tabla:

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null
);
```

Súbelo. El comando pide la contraseña de la base de datos del paso 3:

```shell
npx supabase db push
```

Para cambiar la tabla más adelante no edites este archivo: crea otra migración con el cambio y vuelve a ejecutar `npx supabase db push`.

## 6. Configurar el Auth por email

La configuración del proyecto está en `supabase/config.toml`. Reemplaza todo su contenido por estas líneas, que activan el registro por email y quitan la confirmación de correo:

```toml
project_id = "moviles-auth"

[auth]
enabled = true

[auth.email]
enable_signup = true
enable_confirmations = false
```

Lo que el archivo no menciona queda como está en la nube. Antes de subirlo, mira qué va a cambiar:

```shell
npx supabase config diff
```

Y súbelo. El comando muestra cada cambio y pide confirmación:

```shell
npx supabase config push
```

## 7. Conectar Flutter

Con la URL del paso 3 y la clave del paso 4, la app se inicializa igual que en *Instalación de supabase*:

```dart
await Supabase.initialize(
  url: 'https://TU_PROJECT_REF.supabase.co',
  publishableKey: 'sb_publishable_...',
);
```

La carpeta `supabase/` se puede subir a tu repositorio: no contiene claves ni contraseñas, y deja escrito cómo está configurado el proyecto.
