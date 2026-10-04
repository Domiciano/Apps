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
`tools/supabase_cli_figuras.py` trae las dos de la lección del CLI de Supabase (0091).

```bash
python3 tools/bloc_figuras.py <carpeta>   # un .svg por figura, para validarlas y mirarlas
python3 tools/bloc_figuras.py --inject    # reemplaza cada bloque svg de la lección por su figura
```

**No editar esos SVG dentro del Markdown**: se cambia el script y se vuelve a inyectar. Las
reglas de estilo (id único que prefija todo selector, fondo claro fijo, `viewBox` de 960)
están en el `CLAUDE.md` de `SeminarioSoftware`, sección «Estilo de las lecciones».

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
