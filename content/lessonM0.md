# Distribuir con Firebase App Distribution

<!-- tags: Firebase App Distribution, APK, testers, flutter build apk, distribuir sin tienda,
     firebase appdistribution:distribute, invitación de tester,
     instalar apps de fuentes desconocidas, no se puede instalar la app -->

Antes de las tiendas hay un camino más corto para que otras personas instalen tu app: **Firebase App Distribution**. Subes un APK, eliges a quién se lo mandas y cada persona recibe un correo para instalarlo. No hay revisión, no hay ficha y no cuesta nada.

## El recorrido

```svg
<svg id="dpFlujo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 330" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="dpFlujo-ttl dpFlujo-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="dpFlujo-ttl">Del computador al teléfono de quien prueba</title>
  <desc id="dpFlujo-dsc">Cuatro cajas de izquierda a derecha. Tu computador genera app-release.apk con flutter build apk. Lo subes a Firebase App Distribution y eliges un grupo de testers. Cada tester recibe un correo de invitación. En su teléfono acepta, descarga e instala la app.</desc>
  <defs>
    <style>
      #dpFlujo .title{fill:#161A26;font-size:22px;font-weight:700}
      #dpFlujo .sub{fill:#79809A;font-size:13.5px}
      #dpFlujo .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #dpFlujo .foot{fill:#79809A;font-size:12px}
      #dpFlujo .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #dpFlujo .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #dpFlujo .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#dpFlujo-arrow)}
    </style>
    <marker id="dpFlujo-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="330" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Del computador al teléfono de quien prueba</text>
  <text class="sub" x="48" y="80" data-fit="860">Sin tienda y sin revisión: subes un APK y Firebase les avisa por correo a tus testers.</text>
<rect x="48" y="130" width="168" height="70" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="132" y="156" dy="0.35em" text-anchor="middle" font-size="14.5" font-weight="700" fill="#556074" data-fit="152">Tu computador</text><text x="132" y="175" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="152">flutter build apk</text>
<rect x="280" y="130" width="168" height="70" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="364" y="156" dy="0.35em" text-anchor="middle" font-size="14.5" font-weight="700" fill="#A96C05" data-fit="152">App Distribution</text><text x="364" y="175" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="152">subes el APK</text>
<rect x="512" y="130" width="168" height="70" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text x="596" y="156" dy="0.35em" text-anchor="middle" font-size="14.5" font-weight="700" fill="#C2354F" data-fit="152">Correo</text><text x="596" y="175" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="152">invitación al grupo</text>
<rect x="744" y="130" width="168" height="70" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="828" y="156" dy="0.35em" text-anchor="middle" font-size="14.5" font-weight="700" fill="#3A8235" data-fit="152">Teléfono</text><text x="828" y="175" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="152">descarga e instala</text>
  <path class="link" d="M220,165 L274,165"/>
  <path class="link" d="M452,165 L506,165"/>
  <path class="link" d="M684,165 L738,165"/>
<g transform="translate(48,228)"><rect width="400" height="77" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="372">Para qué sirve</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="372">Que el profesor o tus compañeros prueben la app</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="372">antes de publicarla, en sus propios teléfonos.</text></g>
<g transform="translate(512,228)"><rect width="400" height="77" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#556074" data-fit="372">Qué necesitas</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="372">El proyecto de Firebase de las notificaciones push</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="372">y los correos de quienes van a probar.</text></g>
</svg>
```

Usa el mismo proyecto de Firebase de las notificaciones push: la app Android ya está registrada ahí. Si no lo está, regístrala con `flutterfire configure`.

## 1. Generar el APK

```shell
flutter build apk --release
```

El archivo queda en `build/app/outputs/flutter-apk/app-release.apk`. Mientras no configures un keystore (lo verás en la siguiente lección), Flutter lo firma con la llave de depuración: sirve para probar, no para la tienda.

## 2. Subir y distribuir

```svg
<svg id="dpConsola" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 560" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="dpConsola-ttl dpConsola-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="dpConsola-ttl">App Distribution en la consola de Firebase</title>
  <desc id="dpConsola-dsc">Esquema de la consola de Firebase. En el menú lateral está seleccionado App Distribution. Arriba se elige la app Android. En la pestaña Versiones hay una zona para arrastrar el APK (paso 1). Debajo, la versión subida con el campo Testers y grupos, donde va el grupo clase (paso 2), las notas de la versión (paso 3) y el botón Distribuir (paso 4).</desc>
  <defs>
    <style>
      #dpConsola .title{fill:#161A26;font-size:22px;font-weight:700}
      #dpConsola .sub{fill:#79809A;font-size:13.5px}
      #dpConsola .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #dpConsola .foot{fill:#79809A;font-size:12px}
      #dpConsola .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #dpConsola .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #dpConsola .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#dpConsola-arrow)}
    </style>
    <marker id="dpConsola-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="560" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">App Distribution en la consola de Firebase</text>
  <text class="sub" x="48" y="80" data-fit="860">Sube el APK, elige el grupo, escribe qué cambió y distribuye.</text>
  <rect x="48" y="104" width="864" height="432" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <path d="M48,138 V116 A12,12 0 0 1 60,104 H900 A12,12 0 0 1 912,116 V138 Z" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <circle cx="68" cy="121" r="4.5" fill="#F14C4C"/>  <circle cx="83" cy="121" r="4.5" fill="#E5C07B"/>  <circle cx="98" cy="121" r="4.5" fill="#6BCB77"/>
  <text x="480.0" y="121" dy="0.35em" font-size="13" font-weight="700" fill="#A96C05" text-anchor="middle" data-fit="724">Consola de Firebase · tu proyecto</text>
  <rect x="48" y="138" width="190" height="398" fill="#F7F8FA"/>
  <path d="M238,138 V536" stroke="#D9DEE8" stroke-width="1.25"/>
  <text x="62" y="160" dy="0.35em" font-size="10.5" font-weight="700" fill="#79809A" text-anchor="start" data-fit="166">COMPILACIÓN</text>
  <text x="66" y="186" dy="0.35em" font-size="12.5" font-weight="400" fill="#454C61" text-anchor="start" data-fit="162">Authentication</text>
  <text x="66" y="216" dy="0.35em" font-size="12.5" font-weight="400" fill="#454C61" text-anchor="start" data-fit="162">Cloud Messaging</text>
  <text x="62" y="246" dy="0.35em" font-size="10.5" font-weight="700" fill="#79809A" text-anchor="start" data-fit="166">LANZAMIENTO</text>
  <rect x="54" y="259" width="178" height="26" rx="7" fill="#FFF3DC"/><rect x="54" y="259" width="4" height="26" rx="2" fill="#A96C05"/>
  <text x="66" y="272" dy="0.35em" font-size="12.5" font-weight="700" fill="#A96C05" text-anchor="start" data-fit="162">App Distribution</text>
  <text x="66" y="302" dy="0.35em" font-size="12.5" font-weight="400" fill="#454C61" text-anchor="start" data-fit="162">Crashlytics</text>
  <text x="66" y="332" dy="0.35em" font-size="12.5" font-weight="400" fill="#454C61" text-anchor="start" data-fit="162">Test Lab</text>
  <text x="262" y="164" dy="0.35em" font-size="17" font-weight="700" fill="#161A26" text-anchor="start">App Distribution</text>
  <rect x="700" y="153" width="188" height="22" rx="11" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/><text x="794" y="164" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#A96C05">Android · co.edu.icesi.miapp</text>
  <text x="262" y="198" dy="0.35em" font-size="12.5" font-weight="700" fill="#A96C05" text-anchor="start">Versiones</text>
  <rect x="258" y="211" width="73" height="3" rx="1.5" fill="#A96C05"/>
  <text x="352.8" y="198" dy="0.35em" font-size="12.5" font-weight="400" fill="#556074" text-anchor="start">Testers y grupos</text>
  <text x="494.0" y="198" dy="0.35em" font-size="12.5" font-weight="400" fill="#556074" text-anchor="start">Invitaciones</text>
  <path d="M262,216 H888" stroke="#D9DEE8" stroke-width="1.25"/>
  <rect x="262" y="230" width="626" height="86" rx="10" fill="#F7F8FA" stroke="#9AA1B5" stroke-width="1.5" stroke-dasharray="6 5"/>
  <path d="M575.0,251.0 v-12 m-6,6 l6,-6 l6,6" fill="none" stroke="#556074" stroke-width="1.75"/>
  <text x="575.0" y="265.0" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26" text-anchor="middle" data-fit="606">Arrastra aquí app-release.apk</text>
  <text x="575.0" y="283.0" dy="0.35em" font-size="11.5" font-weight="400" fill="#79809A" text-anchor="middle" data-fit="606">o haz clic para buscarlo</text>
  <circle cx="888" cy="230" r="11" fill="#C2354F"/><text x="888" y="230" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">1</text>
  <rect x="262" y="332" width="626" height="186" rx="10" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <text x="278" y="352" dy="0.35em" font-size="13" font-weight="700" fill="#161A26" text-anchor="start">Versión 1.0.0 (1) · subida</text>
  <text x="278" y="374" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start" data-fit="290">Testers y grupos</text>
  <rect x="278" y="386" width="290" height="30" rx="7" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="288" y="401" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="270"></text>
  <rect x="290" y="390" width="64" height="22" rx="11" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/><text x="322" y="401" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#A96C05">clase ×</text>
  <circle cx="568" cy="374" r="11" fill="#C2354F"/><text x="568" y="374" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">2</text>
  <text x="588" y="374" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start" data-fit="284">Notas de la versión</text>
  <rect x="588" y="386" width="284" height="30" rx="7" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="598" y="401" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="264">Primera versión para la clase</text>
  <circle cx="872" cy="374" r="11" fill="#C2354F"/><text x="872" y="374" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">3</text>
  <text x="278" y="448" dy="0.35em" font-size="12" font-weight="400" fill="#79809A" text-anchor="start">Cada tester del grupo recibe un correo con el enlace.</text>
  <rect x="748" y="470" width="124" height="30" rx="15" fill="#A96C05" stroke="#A96C05" stroke-width="1.5"/>
  <text x="810.0" y="485" dy="0.35em" font-size="12.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">Distribuir</text>
  <circle cx="872" cy="470" r="11" fill="#C2354F"/><text x="872" y="470" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">4</text>
</svg>
```

1. En la consola de Firebase, abre tu proyecto y entra a **App Distribution** desde el menú lateral. Elige la app Android y, la primera vez, pulsa *Comenzar*.
2. En la pestaña *Testers y grupos*, crea un grupo, por ejemplo `clase`, y agrega los correos de quienes van a probar.
3. Vuelve a *Versiones* y arrastra `app-release.apk` (1).
4. En la versión subida, agrega el grupo (2), escribe las notas (3) y pulsa **Distribuir** (4).

## Lo que ve quien prueba

```svg
<svg id="dpTester" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 470" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="dpTester-ttl dpTester-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="dpTester-ttl">Lo que ve quien prueba</title>
  <desc id="dpTester-dsc">Tres teléfonos. En el primero, el correo de Firebase: te invitaron a probar MiApp, con el botón Comenzar. En el segundo, la página de App Distribution en el navegador con la versión 1.0.0 y el botón Descargar. En el tercero, el aviso de Android: para instalar hay que permitir apps de esta fuente, y luego Instalar.</desc>
  <defs>
    <style>
      #dpTester .title{fill:#161A26;font-size:22px;font-weight:700}
      #dpTester .sub{fill:#79809A;font-size:13.5px}
      #dpTester .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #dpTester .foot{fill:#79809A;font-size:12px}
      #dpTester .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #dpTester .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #dpTester .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#dpTester-arrow)}
    </style>
    <marker id="dpTester-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="470" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Lo que ve quien prueba</text>
  <text class="sub" x="48" y="80" data-fit="860">Tres pantallas en el teléfono del tester, de izquierda a derecha.</text>
  <rect x="48" y="104" width="224" height="320" rx="20" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/>
  <rect x="138" y="112" width="44" height="6" rx="3" fill="#2A3040"/>
  <text x="64" y="138" dy="0.35em" font-size="13" font-weight="700" fill="#A96C05" text-anchor="start" data-fit="196">Correo</text>
  <path d="M50,154 H270" stroke="#D9DEE8" stroke-width="1.25"/>
  <rect x="368" y="104" width="224" height="320" rx="20" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/>
  <rect x="458" y="112" width="44" height="6" rx="3" fill="#2A3040"/>
  <text x="384" y="138" dy="0.35em" font-size="13" font-weight="700" fill="#A96C05" text-anchor="start" data-fit="196">Navegador</text>
  <path d="M370,154 H590" stroke="#D9DEE8" stroke-width="1.25"/>
  <rect x="688" y="104" width="224" height="320" rx="20" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/>
  <rect x="778" y="112" width="44" height="6" rx="3" fill="#2A3040"/>
  <text x="704" y="138" dy="0.35em" font-size="13" font-weight="700" fill="#3A8235" text-anchor="start" data-fit="196">Android</text>
  <path d="M690,154 H910" stroke="#D9DEE8" stroke-width="1.25"/>
  <text x="64" y="176" dy="0.35em" font-size="11.5" font-weight="400" fill="#79809A" text-anchor="start">Firebase App Distribution</text>
  <text x="64" y="202" dy="0.35em" font-size="14" font-weight="700" fill="#161A26" text-anchor="start">Te invitaron a probar</text>
  <text x="64" y="222" dy="0.35em" font-size="14" font-weight="700" fill="#161A26" text-anchor="start">MiApp</text>
  <text x="64" y="252" dy="0.35em" font-size="12" font-weight="400" fill="#454C61" text-anchor="start">Acepta la invitación para</text>
  <text x="64" y="270" dy="0.35em" font-size="12" font-weight="400" fill="#454C61" text-anchor="start">descargar la versión.</text>
  <rect x="64" y="296" width="110" height="30" rx="15" fill="#A96C05" stroke="#A96C05" stroke-width="1.5"/>
  <text x="119.0" y="311" dy="0.35em" font-size="12.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">Comenzar</text>
  <circle cx="184" cy="311" r="11" fill="#C2354F"/><text x="184" y="311" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">1</text>
  <text x="384" y="176" dy="0.35em" font-size="14" font-weight="700" fill="#161A26" text-anchor="start">MiApp</text>
  <text x="384" y="196" dy="0.35em" font-size="11.5" font-weight="400" fill="#79809A" text-anchor="start">Iniciaste sesión con tu correo</text>
  <rect x="384" y="220" width="192" height="92" rx="10" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <text class="mono" x="398" y="242" dy="0.35em" font-size="13" font-weight="700" fill="#161A26" text-anchor="start">1.0.0 (1)</text>
  <text x="398" y="262" dy="0.35em" font-size="11" font-weight="400" fill="#79809A" text-anchor="start">Primera versión para la clase</text>
  <rect x="398" y="274" width="104" height="30" rx="15" fill="#A96C05" stroke="#A96C05" stroke-width="1.5"/>
  <text x="450.0" y="289" dy="0.35em" font-size="12.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">Descargar</text>
  <circle cx="514" cy="289" r="11" fill="#C2354F"/><text x="514" y="289" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">2</text>
  <rect x="702" y="170" width="196" height="166" rx="12" fill="#F7F8FA" stroke="#D9DEE8" stroke-width="1.25"/>
  <text x="716" y="194" dy="0.35em" font-size="13.5" font-weight="700" fill="#161A26" text-anchor="start">¿Instalar esta app?</text>
  <text x="716" y="220" dy="0.35em" font-size="11.5" font-weight="400" fill="#454C61" text-anchor="start">Por tu seguridad, el teléfono</text>
  <text x="716" y="237" dy="0.35em" font-size="11.5" font-weight="400" fill="#454C61" text-anchor="start">no instala apps de esta fuente.</text>
  <rect x="716" y="254" width="34" height="18" rx="9" fill="#3A8235"/><circle cx="741" cy="263" r="6.5" fill="#FFFFFF"/>
  <text x="760" y="263" dy="0.35em" font-size="11.5" font-weight="700" fill="#161A26" text-anchor="start">Permitir esta fuente</text>
  <circle cx="894" cy="263" r="11" fill="#C2354F"/><text x="894" y="263" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">3</text>
  <rect x="792" y="292" width="92" height="30" rx="15" fill="#3A8235" stroke="#3A8235" stroke-width="1.5"/>
  <text x="838.0" y="307" dy="0.35em" font-size="12.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">Instalar</text>
  <text x="704" y="368" dy="0.35em" font-size="11.5" font-weight="400" fill="#79809A" text-anchor="start">Solo la primera vez: después</text>
  <text x="704" y="386" dy="0.35em" font-size="11.5" font-weight="400" fill="#79809A" text-anchor="start">las versiones nuevas llegan</text>
  <text x="704" y="404" dy="0.35em" font-size="11.5" font-weight="400" fill="#79809A" text-anchor="start">por correo.</text>
  <text class="foot" x="48" y="442" data-fit="860">El APK de prueba no pasa por Google Play, por eso Android pide permiso para instalarlo.</text>
</svg>
```

El tester abre el correo, acepta la invitación con la misma cuenta de Google que recibió el correo y descarga el APK. La primera vez, Android pide permiso para instalar apps desde el navegador.

Para mandar otra versión, sube el número que va después del `+` en `pubspec.yaml`, vuelve a generar el APK y repite el paso 2. Los testers reciben un correo nuevo.

## Desde la terminal

Si vas a distribuir seguido, la CLI de Firebase lo hace en un solo comando:

```shell
npm install -g firebase-tools
firebase login
firebase appdistribution:distribute build/app/outputs/flutter-apk/app-release.apk \
  --app TU_APP_ID \
  --groups clase \
  --release-notes "Primera versión para la clase"
```

`TU_APP_ID` es el `appId` de Android en `lib/firebase_options.dart` (empieza por `1:`). En Windows, escribe el último comando en una sola línea, sin las `\`.

## ¿Y en iPhone?

App Distribution también reparte archivos IPA, pero Apple solo deja instalarlos en iPhones registrados uno por uno en una cuenta paga. Para iPhone lo práctico es TestFlight, que verás en *Publicar en App Store*.
