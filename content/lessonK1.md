# Conectar la app con Firebase

<!-- tags: Firebase, flutterfire configure, FlutterFire CLI, firebase login, firebase_options.dart,
     google-services.json, com.google.gms.google-services, flutterfire: command not found -->

Para recibir notificaciones, la app tiene que estar registrada en un proyecto de Firebase. Dos herramientas de línea de comandos lo hacen por ti.

## 1. Crear el proyecto

En la [consola de Firebase](https://console.firebase.google.com), pulsa **Crear un proyecto**, ponle un nombre y desactiva Google Analytics: no hace falta. Anota el ID del proyecto, que aparece debajo del nombre.

## 2. Instalar las herramientas

```shell
npm install -g firebase-tools
firebase login
dart pub global activate flutterfire_cli
```

`firebase login` abre el navegador para entrar con tu cuenta de Google. Si después `flutterfire` no se reconoce como comando, agrega la carpeta de paquetes de Dart al `PATH`: `~/.pub-cache/bin` en macOS y `%LOCALAPPDATA%\Pub\Cache\bin` en Windows.

## 3. Conectar la app

Desde la raíz del proyecto Flutter:

```shell
flutterfire configure --project=TU_PROYECTO --platforms=android
```

```svg
<svg id="pnConfigure" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 420" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="pnConfigure-ttl pnConfigure-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="pnConfigure-ttl">Lo que deja flutterfire configure</title>
  <desc id="pnConfigure-dsc">A la izquierda, la terminal con el comando flutterfire configure. Una flecha lleva al proyecto: lib/firebase_options.dart con las opciones para inicializar Firebase, android/app/google-services.json con la configuración de Android, y los dos archivos de Gradle con el plugin google-services.</desc>
  <defs>
    <style>
      #pnConfigure .title{fill:#161A26;font-size:22px;font-weight:700}
      #pnConfigure .sub{fill:#79809A;font-size:13.5px}
      #pnConfigure .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #pnConfigure .foot{fill:#79809A;font-size:12px}
      #pnConfigure .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #pnConfigure .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #pnConfigure .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#pnConfigure-arrow)}
    </style>
    <marker id="pnConfigure-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="420" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Lo que deja flutterfire configure</text>
  <text class="sub" x="48" y="80" data-fit="860">Un comando registra la app en Firebase y escribe tres cosas en el proyecto.</text>
  <rect x="48" y="150" width="300" height="80" rx="10" fill="#1F2430"/>
  <text class="mono" x="66" y="176" dy="0.35em" font-size="13.5" font-weight="700" fill="#C9CFDA" text-anchor="start">$ flutterfire configure</text>
  <text class="mono" x="66" y="204" dy="0.35em" font-size="13.5" font-weight="400" fill="#C9CFDA" text-anchor="start">  --project=TU_PROYECTO</text>
  <path class="link" d="M356,190 L420,190"/>
  <rect x="428" y="112" width="484" height="270" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <path d="M448,130 H459 L463,134 H478 V152 H448 Z" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="488" y="143" dy="0.35em" font-size="13.5" font-weight="700" fill="#161A26" text-anchor="start">mi_app</text>
  <path d="M468,168 H488 L496,176 V202 H468 Z" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><path d="M488,168 V176 H496" fill="none" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="506" y="180" dy="0.35em" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="380">lib/firebase_options.dart</text>
  <text x="506" y="197" dy="0.35em" font-size="11.5" fill="#79809A" data-fit="380">las opciones de Firebase.initializeApp</text>
  <path d="M468,228 H488 L496,236 V262 H468 Z" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><path d="M488,228 V236 H496" fill="none" stroke="#9FD68D" stroke-width="1.5"/>
  <text class="mono" x="506" y="240" dy="0.35em" font-size="12.5" font-weight="700" fill="#3A8235" data-fit="380">android/app/google-services.json</text>
  <text x="506" y="257" dy="0.35em" font-size="11.5" fill="#79809A" data-fit="380">la app Android registrada en Firebase</text>
  <path d="M468,288 H488 L496,296 V322 H468 Z" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><path d="M488,288 V296 H496" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="506" y="300" dy="0.35em" font-size="12.5" font-weight="700" fill="#556074" data-fit="380">settings.gradle.kts · app/build.gradle.kts</text>
  <text x="506" y="317" dy="0.35em" font-size="11.5" fill="#79809A" data-fit="380">el plugin com.google.gms.google-services</text>
<g transform="translate(48,258)"><rect width="300" height="77" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="272">No son secretos</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="272">Identifican la app; se pueden</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="272">subir al repositorio.</text></g>
</svg>
```

El comando registra la app Android en Firebase y escribe tres cosas en tu proyecto. Comprueba que los dos archivos de Gradle quedaron con el plugin; si alguno no lo tiene, agrégalo a mano. En `android/settings.gradle.kts`:

```kotlin
plugins {
    id("com.google.gms.google-services") version "4.4.4" apply false
}
```

Y en `android/app/build.gradle.kts`:

```kotlin
plugins {
    id("com.google.gms.google-services")
}
```

Si más adelante cambias el `applicationId` de la app, vuelve a correr `flutterfire configure`: la configuración está atada a ese identificador.
