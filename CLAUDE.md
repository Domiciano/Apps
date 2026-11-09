# CLAUDE.md

Guía para Claude Code al trabajar en este repositorio.

## Qué es esto

Repositorio del curso **Aplicaciones Móviles** (Flutter · Dart). Contiene:

- `classnotesapp/` — SPA en React + Vite que muestra las notas de clase como un visor
  de lecciones navegable.
- `content/` — las lecciones en Markdown, **en la raíz del repo**.
- `toc.md` — la tabla de contenidos, también en la raíz.

El contenido **no está dentro de `classnotesapp/`**: la app lo descarga en tiempo de
ejecución desde `raw.githubusercontent.com`, así que editar una lección y pushear la
actualiza en el sitio ya desplegado, sin rebuild.

Este repo comparte base de código con `Compunet2-252`. Todo lo que no sea contenido,
tema o remotos debe mantenerse **idéntico** entre los dos — ver el `CLAUDE.md` de la
carpeta contenedora `CoursesPlatform/`.

## Comandos (desde `classnotesapp/`)

```bash
npm install
npm run dev       # servidor de desarrollo con hot reload
npm run build     # build de producción
npm run preview   # previsualizar el build
npm run lint      # ESLint
npm run test      # Vitest
npx vitest run <file>   # un solo archivo de test
```

Alias de import: `@/` → `src/`. Tema por defecto: `dark`.

## Remotos git

Dos remotos, misma rama `main`:

- `origin` → `https://github.com/Domiciano/FlutterLearning` (**renombrado en GitHub a
  `Domiciano/Apps`**; el push se redirige solo y avisa)
- `second` → `https://github.com/DomicianoRincon/FlutterApps`

**El que importa es `second`.** `classnotesapp/src/content/config.js` descarga el
contenido de `raw.githubusercontent.com/DomicianoRincon/FlutterApps/...`, así que
pushear solo a `origin` **no cambia nada de lo que ve un estudiante**.

`origin` tiene credenciales cacheadas. `second` necesita el Personal Access Token, que
vive en `$PAT_GITHUB_DOMICIANO_RINCON` (en `~/.zshrc`, nunca en el repo):

```bash
git push "https://domicianorincon:$PAT_GITHUB_DOMICIANO_RINCON@github.com/domicianorincon/FlutterApps.git" main
```

Nunca escribir el valor literal del token en un archivo ni en un commit.

**Sitio publicado: https://domicianorincon.github.io/FlutterApps/** — es la URL oficial
y es fija. No renombrar el repo `second`: su nombre *es* el segmento de la URL.

## Cómo se escribe una lección

Una lección es un archivo Markdown en `content/` **en la raíz del repo** (hermano de
`classnotesapp/`, no dentro).

### Esqueleto obligatorio

```markdown
# Streams y funciones async*

<!-- tags: Stream, StreamController, async*, yield, await for, StreamBuilder,
     StreamSubscription, broadcast stream, Bad state: Stream has already been listened to -->

Párrafo de entrada que dice de qué va la lección.

## Qué es un Stream

Texto del apartado.

## Escuchar un stream

Texto del apartado.
```

| Elemento | Regla |
|---|---|
| `#` (un solo h1) | Título de la lección. Es lo que se muestra arriba y lo que el asistente cita |
| `<!-- tags: … -->` | **Obligatorio.** Ver abajo |
| `##` | Apartados. Alimentan el índice lateral, el `subsection_dwell` de la analítica y el contexto que se le manda a la IA |
| `###` en adelante | Estructura interna del apartado; no salen en el índice ni cortan la subsección |

### Sin tablas

**Al profesor no le gustan las tablas en las lecciones.** No usar tablas Markdown ni en
lecciones ni en laboratorios nuevos: lo que iría en una tabla se dice en prosa corta, en
una lista, o se dibuja en una figura SVG. Lo mismo con las **estructuras de carpetas**:
van en SVG, no en un bloque de texto con `├──`. El estilo general es figura más uno o dos
párrafos cortos por apartado; en los laboratorios los bloques de código sí se quedan.

### La sección de tags

Va en un **comentario HTML** justo bajo el `#`. GitHub no lo muestra, el visor tampoco:
solo lo leen el asistente de IA y los chips que ve el estudiante.

```markdown
<!-- tags: Stream, StreamBuilder, await for -->
```

Sirve para dos cosas a la vez, y por eso importa:

1. **Contexto de la IA.** Entran en la instrucción del sistema como "Temas de esta
   lección: …". El modelo ya recibe el markdown completo, pero el texto entero no le
   dice *qué es lo importante*; los tags sí. Es la diferencia entre que entienda que
   la lección va de `StreamBuilder` y del `await for`, y que tenga que deducirlo de
   6 KB de prosa.
2. **Los chips** que el estudiante ve bajo el chat. Se muestran los **primeros 6**; el
   resto (hasta 12) sigue yendo al modelo. Escribe primero los que más te interese que
   un estudiante pulse.

**Cómo escribir tags que sirvan.** El criterio es: *¿con qué palabras preguntaría un
estudiante que se atascó en esta lección?* Eso lleva a incluir tres tipos:

| Tipo | Ejemplos (Móviles) |
|---|---|
| El nombre técnico exacto | `StreamBuilder`, `setState`, `BuildContext`, `Navigator.push`, `BlocProvider` |
| El concepto en español, como lo diría el estudiante | `estado de un widget`, `paso de parámetros entre pantallas`, `reconstrucción del árbol` |
| El error o la confusión típica de ese tema | `setState() called after dispose()`, `RenderFlex overflowed`, `Null check operator used on a null value` |

Los del tercer tipo son los que más rinden: son las palabras que aparecen cuando alguien
llega con un problema, no con curiosidad. En Flutter, además, los mensajes de error son
larguísimos y muy reconocibles — vale la pena meter el fragmento por el que un estudiante
buscaría.

**Qué NO poner.** Nada genérico (`Flutter`, `Dart`, `móviles`, `widgets`): no distingue
esta lección de las otras 79 y desperdicia un chip. Tampoco frases largas — más de 42
caracteres se descarta, porque desborda el chip.

**Si no pones tags, la lección sigue funcionando**: se usan los títulos de los `##` como
respaldo. Pero los títulos describen la *estructura* del texto, no el *vocabulario* del
tema, así que el asistente queda peor contextualizado. Anotar es opcional para que nada
se rompa, no porque dé igual.

### Bloques especiales

Markdown estándar (CommonMark + GFM) para todo, más estos bloques cercados:

| Bloque | Para qué |
|---|---|
| ` ```mermaid ` | Diagrama Mermaid |
| ` ```svg ` | SVG en crudo |
| ` ```youtube ` | `<videoId> \| <título>` |
| ` ```dartpad ` | Editor DartPad; el cuerpo es el id del Gist |
| ` ```dart trycode=<gistId> ` | Bloque con pestañas *Código* / *Fire it up!* |

Toda valla cercada **debe declarar lenguaje** (` ```dart `, nunca ` ``` ` a secas): sin
él, el renderizador la confunde con código en línea.

> DartPad corre en un iframe de `dartpad.dev`. Por la política de mismo origen no se
> puede leer el código que escribe el estudiante, ni si compila, ni el error. Solo se
> registra que lo abrió y cuánto tiempo tuvo el foco.

### Figuras SVG generadas

Las figuras explicativas de una lección (código anotado con flechas, árboles de widgets,
ciclos) se generan con un script en `tools/`, igual que en `SeminarioSoftware`:
`tools/code_frame.py` es copia literal del de ese repo y `tools/bloc_figuras.py` trae las
siete de «Entendiendo BlocProvider y BlocBuilder» (0089). `tools/lab5_figuras.py` trae las cuatro
de «Laboratorio 5 a nivel conceptual» (0090), se usa igual y reutiliza los ayudantes del anterior.
`tools/supabase_cli_figuras.py` trae las cinco de «Configurando los servicios» (0091).
`tools/database_figuras.py` trae las ocho de la sección Database: «Escribir en la base de datos» (0059),
«Leer de la base de datos» (0060) y «Laboratorio 6 · Muro» (0061).
`tools/storage_figuras.py` trae las diecinueve de la sección Storage: «Storage, CDN y caché» (0092),
«Acceso a galería y cámara» (0066), «Subir y mostrar archivos con Supabase Storage» (0067),
«image_picker desde Clean Architecture» (0093) y «Laboratorio 7 · Fotos en el muro» (0069).
**Buckets del curso**: `avatars` es público (fotos de perfil, `getPublicUrl`) y `post-images` es
privado (imágenes de posts: la tabla guarda `image_path` y los casos de uso del muro piden una URL firmada
por imagen con `imageUrl` → `createSignedUrl`). Se declaran en
`supabase/config.toml` (`[storage.buckets.<id>]`), se crean con `npx supabase seed buckets --linked` y
se abren con una sola política `for all to authenticated` por bucket. El círculo
de Clean de la 0093 usa la misma convención de anillos que el simulador `register-clean`. Reutiliza `table` y `legend` de `database_figuras.py`.
`tools/di_figuras.py` trae las dos de «Inyección de dependencias con GetIt» (0079), que va justo después del
Laboratorio 7 y migra un solo camino de ese laboratorio con `= sl()`.
`tools/realtime_figuras.py` trae las ocho de la sección **Realtime DB**: «Programación reactiva y Streams»
(0063, `lessonI2.md`), «El Stream viaja por las capas» (0094, `lessonI2capas.md`), «Supabase Realtime» (0062,
`lessonI1.md`) y «Laboratorio 8 · Chat en tiempo real» (0065, `lessonH10.md`). **Convención del curso**: a lo
largo de las capas el `Stream` se retorna y solo el Bloc hace `listen`; la función de `listen` lanza un evento
(`MessagesUpdated`) en vez de emitir, y el Bloc cancela la suscripción en `close()`. El punto de partida del
laboratorio es `Domiciano/262App5` (ramas `main` y `solution`): el Laboratorio 7 resuelto más la feature `chat`,
con la tabla `messages` sin RLS en la publicación `supabase_realtime` y el bucket privado `chat-images`.

`tools/deploy_figuras.py` trae las dieciocho de la sección **Deploy** (2026-11-07): «Distribuir con Firebase
App Distribution» (0095, `lessonM0.md`, primera de la sección), «Generación de artefactos: AAB e IPA» (0080,
`lessonM1.md`, absorbió a la vieja 0081 «Creando IPA iOS», que salió del toc), «Publicar en Google Play» (0082) y
«Publicar en App Store» (0083). Los paneles son esquemas de las pantallas reales (Firebase, Play Console, Xcode,
App Store Connect, Transporter), sin logos, con los pasos numerados en círculos rosa que el texto de la lección
cita como (1), (2)… Colores por herramienta: Firebase ámbar, Play verde, Xcode gris, App Store Connect índigo,
Transporter violeta. El video viejo de publicación en Play va al final de la 0082.

`tools/push_figuras.py` trae las siete de la sección **Push notifications** (2026-11-07), que se reescribió
enfocada en Android: «Notificaciones push» (0074), «Conectar la app con Firebase» (0075), «La llave del backend»
(0076), «Recibir notificaciones en Flutter» (0077) y «Enviar notificaciones desde el backend» (0078). iOS va solo
al final de la 0077 («¿Y en iPhone?»): APNs, la llave `.p8` subida a Firebase y FCM como intermediario hacia APNs
(verificado en la página *FCM Architectural Overview* de Firebase). El código de la 0077 se compiló
(`flutter build apk`) con `firebase_core ^5.1.0`, `firebase_messaging ^17.0.1` y `flutter_local_notifications
^22.3.3`: la 23.0.0 exige `compileSdk` 37 y la plantilla de Flutter 3.44 trae 36, así que se fijó la 22. Reutiliza
las piezas de panel de `deploy_figuras.py`. La 0078 enseña a correr el backend en localhost con
[`Domiciano/FCMNode`](https://github.com/Domiciano/FCMNode) (Spring Boot 4.1, `./mvnw spring-boot:run`): lee la llave
de `fcm-key.json` en su raíz y recibe solo `{"message": {...}}`; sigue aceptando el formato viejo `{data, key}` que
usa el servidor desplegado en `i2thub.icesi.edu.co:5443/fcm/messages`.

```bash
python3 tools/bloc_figuras.py <carpeta>   # un .svg por figura, para validarlas y mirarlas
python3 tools/bloc_figuras.py --inject    # reemplaza cada bloque svg de la lección por su figura
```

**No editar esos SVG dentro del Markdown**: se cambia el script y se vuelve a inyectar. Las
reglas de estilo (id único que prefija todo selector, fondo claro fijo, `viewBox` de 960)
están en el `CLAUDE.md` de `SeminarioSoftware`, sección «Estilo de las lecciones».

**Figuras animadas.** Tres de las de la 0089 (`bpInitState`, `bpRead`, `bbEstados`) se animan
con CSS dentro del propio SVG, por pasos de duración fija. La raíz declara la línea de tiempo
con `data-steps` y `data-step-seconds`, y con eso el visor (`SvgBlock.jsx`) les pone debajo
los botones de anterior, reproducir/pausar y siguiente. Toda animación que siga los pasos
tiene que durar exactamente `pasos × segundos`; los adornos que giran aparte (el indicador de
carga) llevan su propia duración. Cada función acepta `freeze=N` para sacar el fotograma fijo
del paso N y revisarlo, y con «reducir movimiento» la figura queda estática y sin botones.

### Diagramas interactivos

Lo que se entiende tocando va en un bloque ` ```interactive `, cuyo cuerpo es `<id> [opciones]`.
Se portó desde `SeminarioSoftware` el 2026-10-17 (copia literal de
`classnotesapp/src/components/interactive/` y de la línea de `LessonParser.jsx`); las reglas
completas están en el `CLAUDE.md` de ese repo, sección «Diagramas interactivos».

- **Simuladores propios de Móviles**, los dos en la lección 0090, que tiene solo dos secciones.
  Comparten el teléfono con la pantalla de registro de `262App3`, un Supabase simulado
  (`auth.users` y `profiles` persisten entre intentos), el panel de código y el reproductor de pasos
  (`createRegisterSim`). Cada uno aporta sus capas, sus archivos de código y sus pasos.
  A la derecha del teléfono hay pestañas: *Capas* (los bloques), *Clean* (solo en
  `register-clean`: el diagrama circular de arquitectura limpia con la convención que pidió el
  profesor —anillos azul, verde, rojo y amarillo; nombres curvos en inglés (Devices, Web, UI, DB,
  External interfaces · Controllers, Presenters, Gateways · Use Cases · Entities), sin flechas de
  dependencia—. `RegisterScreen` (UI), el Bloc (Presenters) y el UseCase van en un mismo rayo
  vertical; cada rama de datos baja por su propio rayo: contrato (Use Cases) → `Impl` (Gateways)
  → `DataSource` en el **anillo externo** (DB), porque es el que habla con el SDK. Las tablas de
  Supabase van **fuera del círculo**, en un recuadro «Supabase · fuera de la app»: el círculo es
  solo el código de la app móvil. Los anillos usan los colores de la convención con
  transparencia para que las flechas resalten. Las llamadas dentro de una misma capa (UseCase →
  contrato, `Impl` → `DataSource` y sus regresos) tienen su propio paso con flecha (`links` en el
  paso; las del anillo rojo, curvas). (En la pestaña Capas los DataSource siguen en la banda
  «Datos».) Refleja el salto actual como flecha y los
  registros de Supabase; `createCleanCircle`) y *Código*, con una franja abajo que
  marca la capa actual. En `register-clean` la franja sigue al archivo
  resaltado (`fileLayer`); en `register-layers`, a la pieza iluminada (SDK, Supabase).
  - `register-layers` («Review del laboratorio 5»): **el código del laboratorio tal como está
    hoy**. Vista, `Bloc` y SDK de Supabase: el `Bloc` llama directo a `Supabase.instance.client`
    y `HomeScreen` muestra sus valores por defecto.
  - `register-clean` («Aplicando arquitectura limpia»): cómo debería quedar. Presentación,
    dominio (`SignUpUseCase` y los contratos `AuthRepository` y `ProfileRepository`) y datos,
    con una rama `Impl → DataSource` por servicio.
  - **Reglas de los pasos**, cubiertas por pruebas: un solo mensaje entre capas por paso, la
    reacción a su llegada en el paso siguiente, y continuidad (cada paso ocurre en la capa a la
    que llegó el mensaje anterior o en una vecina; tras emitir un estado se vuelve al Bloc antes
    de seguir hacia abajo).
  - Los dos enseñan éxito, correo repetido (`AuthApiException`) y validación en la vista, y
    tienen modo *Paso a paso*. Hubo un interruptor *Falta el grant en profiles* (cuenta sin
    perfil); el profesor lo retiró el 2026-10-17 por innecesario. Si el laboratorio cambia,
    hay que actualizar el simulador que corresponda.
- `query-builder` («Leer de la base de datos», 0060): el estudiante arma una consulta del SDK
  (columnas, dos filtros encadenados, `order`, `limit`/`range`, `single`/`maybeSingle`) sobre una
  tabla `posts` de diez filas y ve qué filas pasan el filtro, cuáles caen en el recorte, el código
  Dart y lo que devuelve el `await` (o la `PostgrestException` de `single`). La lógica es pura y
  exportada (`runQuery`, `queryCode`), con pruebas en `InteractiveBlock.test.jsx`.
- `storage-cache` («Storage, CDN y caché», 0092): el perfil de Ana con su foto y las tres capas que
  la pueden responder (ImageCache, borde del CDN, bucket), con el `avatar_path` de la fila y el código
  de subida. Dos modos: *Mismo nombre* (`avatar.jpg` + `upsert`, `max-age` de 1 h) y *Nombre
  aleatorio* (UUID, `max-age` de un año, borra el anterior). Botones: abrir el perfil, subir, cerrar y
  abrir la app (vacía ImageCache) y esperar 1 hora (vence el CDN del modo fijo). Marca HIT o MISS
  por capa y avisa en rojo cuando la foto mostrada no es la última. Lógica pura y exportada
  (`cacheStart`, `cacheView`, `cacheUpload`, `cacheRestart`, `cacheWait`).
- **Los de Realtime DB** (2026-11-06). Lógica pura y exportada, con pruebas:
  - `future-stream` (0063, 2026-11-07): reemplaza la figura estática `rtFutureStream`. Horizontal: la App arriba,
    el Servidor abajo y el tiempo hacia la derecha, con una línea «ahora» que avanza (Reproducir, Pausar,
    Reiniciar, encima del diagrama). *Future*: la petición sale, la app queda en pausa en el `await` mientras el servidor consulta, y
    vuelve un solo valor. *Stream*: `listen`, canal abierto, la app «sigue libre» y los datos llegan a intervalos
    irregulares, con un error que no cierra, y al final la app hace `cancel()` (sin `onDone`: el Stream de
    Supabase no lo cierra el servidor). Pestañas `int`, `String`, Objeto (`Message`) y Lista de
    objetos (`List<Message>`, cada evento trae la lista completa). Lógica pura y exportada (`fsScenario`, `fsAt`).
  - `stream-pipe` (ya no lo usa ninguna lección desde 2026-11-07, porque gira alrededor de `StreamController`): un `StreamController` (o un `Completer` en modo *Future*) y una tubería por la que
    viaja cada `add`, `addError` y `close` hasta `listen`, con `map` opcional. Muestra la consola, la línea de
    tiempo de lo que llegó, que un error no cierra el stream, el `Bad state` de `add` tras `close` y que tras
    `cancel()` lo emitido ya no llega (`pipeStart`, `pipeAct`).
  - `stream-layers` (0094): una fila por escenario y una columna por capa (ChatScreen, ChatBloc, UseCase,
    RepositoryImpl, DataSource, Supabase). *Abrir el chat* baja la llamada y sube el `Stream` hasta el `listen`
    del Bloc; *Ana envía* y *Tú envías* (el insert baja como `Future`) suben la lista por la tubería; *Cerrar*
    baja la cancelación. Cumple un salto por paso y continuidad dentro de cada fila (`rtLayersScenario`).
  - `realtime-chat` (0062): dos teléfonos (tú y Ana), la tabla `messages` y el interruptor de la publicación.
    Sin publicación, el insert entra pero nadie se entera hasta *Reabrir* (`chatSend`, `chatReopen`, `chatPublish`).
  - `chat-pagination` (0065, parte 2; rehecho el 2026-11-09): un teléfono con el chat (los bloques `m18`, `m19`…,
    los tuyos a la derecha), donde el estudiante escribe un mensaje o sube hasta el tope para pedir los anteriores
    (barra *cargando anteriores…* mientras espera el `Future`). A la derecha, tres pestañas con lo que tiene el
    `ChatBloc` en cada momento: *Parte 1* (`_onOlderRequested` solo imprime), *Parte 2 · cargar anteriores*
    (pasos 5 a 7, pero `MessagesUpdated` aún reemplaza y la siguiente emisión borra las páginas) y *Parte 2 ·
    juntar por id* (con `_merge`). Verde azulado llegó por el Stream, ámbar por `Future` (`pageStart`,
    `pageOlder`, `pageIncoming`, `pageStage`, `pageCode`).
- `flutterStateSims.js` ya **no es idéntico** al de Seminario: tiene además `register-layers`,
  `register-clean`, `query-builder`, `storage-cache`, los cuatro de Realtime DB y unas palabras más en el
  resaltado de Dart. Al sincronizar entre repos, conservar ese bloque.

### Darla de alta en `toc.md`

```
[t] Render de Listas · SEMANA 3
[lesson:url] https://raw.githubusercontent.com/DomicianoRincon/FlutterApps/main/content/lessonXX.md | Streams y async* | lessonStreams
```

- El **tercer campo es el id estable** (SPEC-12) y es la clave contra la que se guarda
  toda la analítica y todo el corpus de preguntas. **Nunca lo cambies** al reorganizar
  el temario: mover, renombrar o reescribir una lección está bien; cambiarle el id parte
  sus datos en dos y no hay forma de reunirlos.
- El `[t]` que la precede aporta dos cosas automáticamente: la **sección del temario**
  (`tocSection`, que ancla cada pregunta al bloque) y, si el título nombra una semana
  (`SEMANA 3`, en cualquier posición del título), la **fecha planeada** de la lección
  (SPEC-13/14).
- ⚠️ **Hoy solo 19 de 80 lecciones nombran semana** en este curso. Sin ella no hay fecha
  planeada y la lección queda fuera de H3 (la alerta temprana del estudio). Al tocar un
  `[t]`, aprovecha para ponerle su `· SEMANA N`.

### Antes de dar por hecha la lección

1. Imágenes locales: tienen que existir en `classnotesapp/src/assets/` y se referencian
   **solo por nombre de archivo**, sin ruta. No se descargan, van en el bundle.
2. Push a **los dos remotos**. `raw.githubusercontent.com` sirve desde `second`.
3. Si cambiaste algo a mitad de semestre —moviste la lección de semana, la reescribiste,
   añadiste una nueva—, anótalo en `analitics/schedule.md` § 4.3 de la carpeta
   contenedora. Sin eso, el análisis ve el temario final y supone que siempre fue así.

## Arquitectura

### Flujo del contenido

1. `src/content/config.js` apunta `tocUrl` a la URL raw de `toc.md`.
2. `App.jsx` la descarga al arrancar; `TableOfContentsParser`
   (`src/utils/tableOfContentsParser.js`) la convierte en un arreglo de secciones —
   `[t]` título, `[d]` divisor, `[lesson:url]` lección.
3. `LessonPage.jsx` resuelve la lección por el id de la ruta y descarga su Markdown
   (con caché en `LessonContentCache`).
4. `LessonParser.jsx` lo convierte en componentes React.

### Rutas

`/{base}/lesson/:lessonId`, donde `lessonId` es el id estable de `toc.md`. Los enlaces
viejos con el ordinal siguen resolviéndose. Los deep links en GitHub Pages funcionan vía
`public/404.html` + el redirect `?p=` de `App.jsx`.

**Base path**: lo fija `.github/workflows/deploy-pages.yml` derivándolo del nombre del
repo. El valor por defecto de `vite.config.js` solo aplica en `npm run dev`. No volver a
fijarlo a mano: como este repo se publica desde dos remotos y cada uno sirve bajo su
propio nombre, un valor fijo rompe la copia del otro.

### Vista de administrador (`/admin`)

`src/admin/` cruza la **lista de clase** que entrega la universidad
(`students/262.md`: una línea por estudiante, `código nombre completo`, sin encabezado)
con los perfiles de Firestore, para responder quién ya entró al visor, con qué correo y
con qué usuario de GitHub, y **quién falta**. Un botón exporta todo a un `.md`. Se llega
desde el menú de cuenta → *Estudiantes*.

Portado desde Compunet2 el 2026-08-25, y **byte a byte idéntico** al de ese repo —
mismos componentes, mismo `adminData.js`, mismo `studentActivity.js`. Solo cambian, como
en el resto de la app, `courseId` (`moviles`) y `courseTerm` (`'262'`, en
`content/config.js`). La documentación completa de cómo funciona el cruce de listas
(las cuatro pasadas de `matchRoster.js`), el panel de actividad por estudiante y sus
invariantes está en el `CLAUDE.md` de Compunet2 — no se duplica aquí porque el código y
el comportamiento son el mismo.

La llave es el custom claim `profesor: true` sobre la cuenta de Firebase (proyecto
`facelogprueba`) — el mismo que exigen las reglas de Firestore. **Pendiente**: asignarlo
a la cuenta del profesor de este curso (ver `classnotesapp/firestore/README.md` → *Marcar
al profesor*) y cargar `students/262.md` desde la propia vista la primera vez que se use.

### Tema

`src/theme/ThemeContext.jsx` con los tokens en `src/theme/colors.js` (azul en este
curso). Persiste la elección en `localStorage`.

## Módulos del estudio de investigación

Documentación completa en `analitics/` de la carpeta contenedora. Lo que vive aquí:

- `src/analytics/` — sensado de interacciones (F1). **Nada se captura sin
  `students.analyticsConsent === true`**, que se recoge en la pantalla de términos y
  condiciones (`src/auth/TermsScreen.jsx`) y es condición de acceso al visor.
- `src/ai/` — asistente con Gemini (F2). El estudiante conecta **su propia** clave de
  API, que vive **solo en `localStorage`** y nunca se escribe en Firestore.
- `src/auth/` — login con Google, perfil y consentimientos. Proyecto Firebase
  `facelogprueba`, `courseId: moviles`.

Los tres son **idénticos byte a byte** a los de `Compunet2-252`; lo único que cambia son
`firebaseConfig.js`, `loginBranding.js`, `colors.js` y `aiCourseHint` en
`content/config.js`. Cualquier cambio de plataforma se escribe una vez y se copia literal.
