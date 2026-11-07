# Publicar en Google Play

<!-- tags: Google Play Console, prueba cerrada, 12 testers 14 días, acceso a producción,
     ficha de Play Store, Seguridad de los datos, política de privacidad, versionCode,
     El código de versión ya se usó, firma de apps de Google Play, AAB -->

Necesitas una **cuenta de desarrollador de Google Play** (pago único de USD 25 y verificación de identidad) y el `app-release.aab` de la lección anterior.

## El camino

```svg
<svg id="gpRuta" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 360" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="gpRuta-ttl gpRuta-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="gpRuta-ttl">El camino hasta producción</title>
  <desc id="gpRuta-dsc">Seis pasos en dos filas. Crear la app, completar Configura tu app, llenar la ficha de Play Store, una prueba cerrada con al menos 12 testers durante 14 días seguidos, solicitar acceso a producción y publicar en producción. Los pasos 4 y 5 aplican a cuentas personales creadas desde noviembre de 2023.</desc>
  <defs>
    <style>
      #gpRuta .title{fill:#161A26;font-size:22px;font-weight:700}
      #gpRuta .sub{fill:#79809A;font-size:13.5px}
      #gpRuta .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #gpRuta .foot{fill:#79809A;font-size:12px}
      #gpRuta .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #gpRuta .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #gpRuta .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#gpRuta-arrow)}
    </style>
    <marker id="gpRuta-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="360" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">El camino hasta producción</text>
  <text class="sub" x="48" y="80" data-fit="860">Una cuenta personal nueva pasa por una prueba cerrada antes de poder publicar.</text>
<rect x="48" y="116" width="256" height="64" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="176" y="139" dy="0.35em" text-anchor="middle" font-size="14.5" font-weight="700" fill="#3A8235" data-fit="240">Crear la app</text><text x="176" y="158" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="240">nombre e idioma</text>
  <circle cx="52" cy="120" r="11" fill="#C2354F"/><text x="52" y="120" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">1</text>
<rect x="352" y="116" width="256" height="64" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="480" y="139" dy="0.35em" text-anchor="middle" font-size="14.5" font-weight="700" fill="#3A8235" data-fit="240">Configura tu app</text><text x="480" y="158" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="240">declaraciones</text>
  <circle cx="356" cy="120" r="11" fill="#C2354F"/><text x="356" y="120" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">2</text>
  <path class="link" d="M308,148 L346,148"/>
<rect x="656" y="116" width="256" height="64" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="784" y="139" dy="0.35em" text-anchor="middle" font-size="14.5" font-weight="700" fill="#3A8235" data-fit="240">Ficha de Play Store</text><text x="784" y="158" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="240">textos e imágenes</text>
  <circle cx="660" cy="120" r="11" fill="#C2354F"/><text x="660" y="120" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">3</text>
  <path class="link" d="M612,148 L650,148"/>
<rect x="48" y="230" width="256" height="64" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="176" y="253" dy="0.35em" text-anchor="middle" font-size="14.5" font-weight="700" fill="#A96C05" data-fit="240">Prueba cerrada</text><text x="176" y="272" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="240">12 testers · 14 días</text>
  <circle cx="52" cy="234" r="11" fill="#C2354F"/><text x="52" y="234" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">4</text>
<rect x="352" y="230" width="256" height="64" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="480" y="253" dy="0.35em" text-anchor="middle" font-size="14.5" font-weight="700" fill="#A96C05" data-fit="240">Acceso a producción</text><text x="480" y="272" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="240">un cuestionario</text>
  <circle cx="356" cy="234" r="11" fill="#C2354F"/><text x="356" y="234" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">5</text>
  <path class="link" d="M308,262 L346,262"/>
<rect x="656" y="230" width="256" height="64" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="784" y="253" dy="0.35em" text-anchor="middle" font-size="14.5" font-weight="700" fill="#3A8235" data-fit="240">Producción</text><text x="784" y="272" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="240">revisión y publicación</text>
  <circle cx="660" cy="234" r="11" fill="#C2354F"/><text x="660" y="234" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">6</text>
  <path class="link" d="M612,262 L650,262"/>
  <path class="link" d="M864,184 V206 H176 V226"/>
  <text class="foot" x="48" y="332" data-fit="860">Los pasos en ámbar solo aplican a cuentas personales. Una cuenta de organización va directo a producción.</text>
</svg>
```

Las cuentas personales creadas desde noviembre de 2023 no pueden ir directo a producción: primero hacen una prueba cerrada con **al menos 12 testers durante 14 días seguidos**. Empieza la prueba cuanto antes, porque esos 14 días no se pueden acortar.

## 1. Crear la app

```svg
<svg id="gpCrear" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="gpCrear-ttl gpCrear-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="gpCrear-ttl">Crear la app</title>
  <desc id="gpCrear-dsc">Esquema del formulario Crear app de Google Play Console: nombre de la app (paso 1), idioma predeterminado (paso 2), app o juego (paso 3), gratis o pagada (paso 4), las dos declaraciones marcadas (paso 5) y el botón Crear app.</desc>
  <defs>
    <style>
      #gpCrear .title{fill:#161A26;font-size:22px;font-weight:700}
      #gpCrear .sub{fill:#79809A;font-size:13.5px}
      #gpCrear .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #gpCrear .foot{fill:#79809A;font-size:12px}
      #gpCrear .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #gpCrear .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #gpCrear .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#gpCrear-arrow)}
    </style>
    <marker id="gpCrear-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="540" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Crear la app</text>
  <text class="sub" x="48" y="80" data-fit="860">Todas las apps → Crear app. Nada de esto es el identificador: ese viene en el AAB.</text>
  <rect x="48" y="104" width="864" height="412" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <path d="M48,138 V116 A12,12 0 0 1 60,104 H900 A12,12 0 0 1 912,116 V138 Z" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/>
  <circle cx="68" cy="121" r="4.5" fill="#F14C4C"/>  <circle cx="83" cy="121" r="4.5" fill="#E5C07B"/>  <circle cx="98" cy="121" r="4.5" fill="#6BCB77"/>
  <text x="480.0" y="121" dy="0.35em" font-size="13" font-weight="700" fill="#3A8235" text-anchor="middle" data-fit="724">Google Play Console</text>
  <rect x="48" y="138" width="190" height="378" fill="#F7F8FA"/>
  <path d="M238,138 V516" stroke="#D9DEE8" stroke-width="1.25"/>
  <rect x="54" y="147" width="178" height="26" rx="7" fill="#E8F6E3"/><rect x="54" y="147" width="4" height="26" rx="2" fill="#3A8235"/>
  <text x="66" y="160" dy="0.35em" font-size="12.5" font-weight="700" fill="#3A8235" text-anchor="start" data-fit="162">Todas las apps</text>
  <text x="66" y="190" dy="0.35em" font-size="12.5" font-weight="400" fill="#454C61" text-anchor="start" data-fit="162">Bandeja de entrada</text>
  <text x="66" y="220" dy="0.35em" font-size="12.5" font-weight="400" fill="#454C61" text-anchor="start" data-fit="162">Usuarios y permisos</text>
  <text x="66" y="250" dy="0.35em" font-size="12.5" font-weight="400" fill="#454C61" text-anchor="start" data-fit="162">Detalles de la cuenta</text>
  <text x="262" y="164" dy="0.35em" font-size="17" font-weight="700" fill="#161A26" text-anchor="start">Crear app</text>
  <text x="262" y="192" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start" data-fit="330">Nombre de la app</text>
  <rect x="262" y="204" width="330" height="30" rx="7" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="272" y="219" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="310">Muro Icesi</text>
  <text x="592" y="192" dy="0.35em" font-size="11" font-weight="400" fill="#79809A" text-anchor="end">máx. 30</text>
  <circle cx="612" cy="216" r="11" fill="#C2354F"/><text x="612" y="216" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">1</text>
  <text x="262" y="254" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start" data-fit="330">Idioma predeterminado</text>
  <rect x="262" y="266" width="330" height="30" rx="7" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="272" y="281" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="310">Español (Latinoamérica) – es-419</text>
  <path d="M570,278 l6,6 l6,-6" fill="none" stroke="#556074" stroke-width="1.75"/>
  <circle cx="612" cy="278" r="11" fill="#C2354F"/><text x="612" y="278" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">2</text>
  <text x="262" y="318" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start">App o juego</text>
  <circle cx="270" cy="340" r="7.5" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.75"/><circle cx="270" cy="340" r="4" fill="#3A8235"/>
  <text x="286" y="340" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start">App</text>
  <circle cx="360" cy="340" r="7.5" fill="#FFFFFF" stroke="#9AA1B5" stroke-width="1.75"/>
  <text x="376" y="340" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start">Juego</text>
  <circle cx="452" cy="340" r="11" fill="#C2354F"/><text x="452" y="340" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">3</text>
  <text x="582" y="318" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start">Gratis o pagada</text>
  <circle cx="590" cy="340" r="7.5" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.75"/><circle cx="590" cy="340" r="4" fill="#3A8235"/>
  <text x="606" y="340" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start">Gratis</text>
  <circle cx="690" cy="340" r="7.5" fill="#FFFFFF" stroke="#9AA1B5" stroke-width="1.75"/>
  <text x="706" y="340" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start">Pagada</text>
  <circle cx="792" cy="340" r="11" fill="#C2354F"/><text x="792" y="340" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">4</text>
  <text x="262" y="378" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start">Declaraciones</text>
  <rect x="263" y="393" width="14" height="14" rx="3" fill="#3A8235" stroke="#3A8235" stroke-width="1.75"/><path d="M266,400 l3,3 l6,-6" fill="none" stroke="#FFFFFF" stroke-width="2"/>
  <text x="286" y="400" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="360">Políticas del programa para desarrolladores</text>
  <rect x="263" y="419" width="14" height="14" rx="3" fill="#3A8235" stroke="#3A8235" stroke-width="1.75"/><path d="M266,426 l3,3 l6,-6" fill="none" stroke="#FFFFFF" stroke-width="2"/>
  <text x="286" y="426" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="360">Leyes de exportación de EE. UU.</text>
  <circle cx="614" cy="413" r="11" fill="#C2354F"/><text x="614" y="413" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">5</text>
  <rect x="758" y="470" width="130" height="30" rx="15" fill="#3A8235" stroke="#3A8235" stroke-width="1.5"/>
  <text x="823.0" y="485" dy="0.35em" font-size="12.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">Crear app</text>
</svg>
```

En *Todas las apps*, pulsa **Crear app** y llena el formulario. El nombre se puede cambiar después; el identificador no, pero ese no se escribe aquí: viene dentro del AAB.

## 2. Configura tu app

```svg
<svg id="gpPanel" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 640" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="gpPanel-ttl gpPanel-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="gpPanel-ttl">Configura tu app</title>
  <desc id="gpPanel-dsc">Esquema del panel de Google Play Console con la lista Configura tu app. Filas: acceso a la app, anuncios, clasificación del contenido, público objetivo, seguridad de los datos, apps del gobierno, funciones financieras, salud, política de privacidad, categoría y datos de contacto, y ficha de Play Store principal. Junto a cada fila, la respuesta típica para una app del curso.</desc>
  <defs>
    <style>
      #gpPanel .title{fill:#161A26;font-size:22px;font-weight:700}
      #gpPanel .sub{fill:#79809A;font-size:13.5px}
      #gpPanel .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #gpPanel .foot{fill:#79809A;font-size:12px}
      #gpPanel .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #gpPanel .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #gpPanel .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#gpPanel-arrow)}
    </style>
    <marker id="gpPanel-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="640" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Configura tu app</text>
  <text class="sub" x="48" y="80" data-fit="860">Panel → Configura tu app. Cada fila es un formulario corto; a la derecha, qué responder en una app del curso.</text>
  <rect x="48" y="104" width="864" height="512" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <path d="M48,138 V116 A12,12 0 0 1 60,104 H900 A12,12 0 0 1 912,116 V138 Z" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/>
  <circle cx="68" cy="121" r="4.5" fill="#F14C4C"/>  <circle cx="83" cy="121" r="4.5" fill="#E5C07B"/>  <circle cx="98" cy="121" r="4.5" fill="#6BCB77"/>
  <text x="480.0" y="121" dy="0.35em" font-size="13" font-weight="700" fill="#3A8235" text-anchor="middle" data-fit="724">Google Play Console · Muro Icesi</text>
  <rect x="48" y="138" width="190" height="478" fill="#F7F8FA"/>
  <path d="M238,138 V616" stroke="#D9DEE8" stroke-width="1.25"/>
  <rect x="54" y="147" width="178" height="26" rx="7" fill="#E8F6E3"/><rect x="54" y="147" width="4" height="26" rx="2" fill="#3A8235"/>
  <text x="66" y="160" dy="0.35em" font-size="12.5" font-weight="700" fill="#3A8235" text-anchor="start" data-fit="162">Panel</text>
  <text x="66" y="190" dy="0.35em" font-size="12.5" font-weight="400" fill="#454C61" text-anchor="start" data-fit="162">Estadísticas</text>
  <text x="62" y="220" dy="0.35em" font-size="10.5" font-weight="700" fill="#79809A" text-anchor="start" data-fit="166">PRUEBAS</text>
  <text x="66" y="246" dy="0.35em" font-size="12.5" font-weight="400" fill="#454C61" text-anchor="start" data-fit="162">Prueba interna</text>
  <text x="66" y="276" dy="0.35em" font-size="12.5" font-weight="400" fill="#454C61" text-anchor="start" data-fit="162">Prueba cerrada</text>
  <text x="66" y="306" dy="0.35em" font-size="12.5" font-weight="400" fill="#454C61" text-anchor="start" data-fit="162">Producción</text>
  <text x="62" y="336" dy="0.35em" font-size="10.5" font-weight="700" fill="#79809A" text-anchor="start" data-fit="166">PRESENCIA</text>
  <text x="66" y="362" dy="0.35em" font-size="12.5" font-weight="400" fill="#454C61" text-anchor="start" data-fit="162">Ficha de Play Store</text>
  <text x="62" y="392" dy="0.35em" font-size="10.5" font-weight="700" fill="#79809A" text-anchor="start" data-fit="166">POLÍTICA</text>
  <text x="66" y="418" dy="0.35em" font-size="12.5" font-weight="400" fill="#454C61" text-anchor="start" data-fit="162">Contenido de la app</text>
  <text x="262" y="164" dy="0.35em" font-size="17" font-weight="700" fill="#161A26" text-anchor="start">Configura tu app</text>
  <text x="262" y="188" dy="0.35em" font-size="12" font-weight="400" fill="#79809A" text-anchor="start">Completa todas las tareas antes de enviar una versión.</text>
  <rect x="262" y="214" width="626" height="30" rx="7" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <circle cx="278" cy="229" r="6" fill="none" stroke="#9AA1B5" stroke-width="1.75"/>
  <text x="294" y="229" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26" text-anchor="start" data-fit="230">Acceso a la app</text>
  <text x="532" y="229" dy="0.35em" font-size="12" font-weight="400" fill="#3A8235" text-anchor="start" data-fit="330">usuario y contraseña de prueba</text>
  <path d="M870,224 l5,5 l-5,5" fill="none" stroke="#9AA1B5" stroke-width="1.75"/>
  <rect x="262" y="249" width="626" height="30" rx="7" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <circle cx="278" cy="264" r="6" fill="none" stroke="#9AA1B5" stroke-width="1.75"/>
  <text x="294" y="264" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26" text-anchor="start" data-fit="230">Anuncios</text>
  <text x="532" y="264" dy="0.35em" font-size="12" font-weight="400" fill="#3A8235" text-anchor="start" data-fit="330">No contiene anuncios</text>
  <path d="M870,259 l5,5 l-5,5" fill="none" stroke="#9AA1B5" stroke-width="1.75"/>
  <rect x="262" y="284" width="626" height="30" rx="7" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <circle cx="278" cy="299" r="6" fill="none" stroke="#9AA1B5" stroke-width="1.75"/>
  <text x="294" y="299" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26" text-anchor="start" data-fit="230">Clasificación del contenido</text>
  <text x="532" y="299" dy="0.35em" font-size="12" font-weight="400" fill="#3A8235" text-anchor="start" data-fit="330">cuestionario · todo No</text>
  <path d="M870,294 l5,5 l-5,5" fill="none" stroke="#9AA1B5" stroke-width="1.75"/>
  <rect x="262" y="319" width="626" height="30" rx="7" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <circle cx="278" cy="334" r="6" fill="none" stroke="#9AA1B5" stroke-width="1.75"/>
  <text x="294" y="334" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26" text-anchor="start" data-fit="230">Público objetivo</text>
  <text x="532" y="334" dy="0.35em" font-size="12" font-weight="400" fill="#3A8235" text-anchor="start" data-fit="330">18 años o más</text>
  <path d="M870,329 l5,5 l-5,5" fill="none" stroke="#9AA1B5" stroke-width="1.75"/>
  <rect x="262" y="354" width="626" height="30" rx="7" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <circle cx="278" cy="369" r="6" fill="none" stroke="#9AA1B5" stroke-width="1.75"/>
  <text x="294" y="369" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26" text-anchor="start" data-fit="230">Seguridad de los datos</text>
  <text x="532" y="369" dy="0.35em" font-size="12" font-weight="400" fill="#3A8235" text-anchor="start" data-fit="330">correo y nombre, cifrados en tránsito</text>
  <path d="M870,364 l5,5 l-5,5" fill="none" stroke="#9AA1B5" stroke-width="1.75"/>
  <rect x="262" y="389" width="626" height="30" rx="7" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <circle cx="278" cy="404" r="6" fill="none" stroke="#9AA1B5" stroke-width="1.75"/>
  <text x="294" y="404" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26" text-anchor="start" data-fit="230">Apps del gobierno</text>
  <text x="532" y="404" dy="0.35em" font-size="12" font-weight="400" fill="#3A8235" text-anchor="start" data-fit="330">No</text>
  <path d="M870,399 l5,5 l-5,5" fill="none" stroke="#9AA1B5" stroke-width="1.75"/>
  <rect x="262" y="424" width="626" height="30" rx="7" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <circle cx="278" cy="439" r="6" fill="none" stroke="#9AA1B5" stroke-width="1.75"/>
  <text x="294" y="439" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26" text-anchor="start" data-fit="230">Funciones financieras</text>
  <text x="532" y="439" dy="0.35em" font-size="12" font-weight="400" fill="#3A8235" text-anchor="start" data-fit="330">Ninguna</text>
  <path d="M870,434 l5,5 l-5,5" fill="none" stroke="#9AA1B5" stroke-width="1.75"/>
  <rect x="262" y="459" width="626" height="30" rx="7" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <circle cx="278" cy="474" r="6" fill="none" stroke="#9AA1B5" stroke-width="1.75"/>
  <text x="294" y="474" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26" text-anchor="start" data-fit="230">Salud</text>
  <text x="532" y="474" dy="0.35em" font-size="12" font-weight="400" fill="#3A8235" text-anchor="start" data-fit="330">Ninguna</text>
  <path d="M870,469 l5,5 l-5,5" fill="none" stroke="#9AA1B5" stroke-width="1.75"/>
  <rect x="262" y="494" width="626" height="30" rx="7" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <circle cx="278" cy="509" r="6" fill="none" stroke="#9AA1B5" stroke-width="1.75"/>
  <text x="294" y="509" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26" text-anchor="start" data-fit="230">Política de privacidad</text>
  <text x="532" y="509" dy="0.35em" font-size="12" font-weight="400" fill="#3A8235" text-anchor="start" data-fit="330">una URL pública</text>
  <path d="M870,504 l5,5 l-5,5" fill="none" stroke="#9AA1B5" stroke-width="1.75"/>
  <rect x="262" y="529" width="626" height="30" rx="7" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <circle cx="278" cy="544" r="6" fill="none" stroke="#9AA1B5" stroke-width="1.75"/>
  <text x="294" y="544" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26" text-anchor="start" data-fit="230">Categoría y contacto</text>
  <text x="532" y="544" dy="0.35em" font-size="12" font-weight="400" fill="#3A8235" text-anchor="start" data-fit="330">categoría y tu correo</text>
  <path d="M870,539 l5,5 l-5,5" fill="none" stroke="#9AA1B5" stroke-width="1.75"/>
  <rect x="262" y="564" width="626" height="30" rx="7" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <circle cx="278" cy="579" r="6" fill="none" stroke="#9AA1B5" stroke-width="1.75"/>
  <text x="294" y="579" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26" text-anchor="start" data-fit="230">Ficha de Play Store</text>
  <text x="532" y="579" dy="0.35em" font-size="12" font-weight="400" fill="#3A8235" text-anchor="start" data-fit="330">la figura siguiente</text>
  <path d="M870,574 l5,5 l-5,5" fill="none" stroke="#9AA1B5" stroke-width="1.75"/>
</svg>
```

En el *Panel*, la lista *Configura tu app* tiene un formulario por fila. Dos piden algo que hay que preparar antes:

- **Acceso a la app**: si la app tiene inicio de sesión, crea una cuenta de prueba y pon su correo y contraseña.
- **Política de privacidad**: una URL pública que diga qué datos guarda la app (correo, nombre, fotos) y para qué. Sirve una página de GitHub Pages o de Google Sites.

## 3. La ficha de Play Store

```svg
<svg id="gpFicha" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 580" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="gpFicha-ttl gpFicha-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="gpFicha-ttl">La ficha de Play Store</title>
  <desc id="gpFicha-dsc">Esquema de la ficha principal: nombre de la app (paso 1), descripción breve (paso 2), descripción completa (paso 3), ícono de 512 por 512 (paso 4), gráfico de funciones de 1024 por 500 (paso 5) y al menos dos capturas de teléfono (paso 6). Abajo, el botón Guardar.</desc>
  <defs>
    <style>
      #gpFicha .title{fill:#161A26;font-size:22px;font-weight:700}
      #gpFicha .sub{fill:#79809A;font-size:13.5px}
      #gpFicha .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #gpFicha .foot{fill:#79809A;font-size:12px}
      #gpFicha .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #gpFicha .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #gpFicha .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#gpFicha-arrow)}
    </style>
    <marker id="gpFicha-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="580" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">La ficha de Play Store</text>
  <text class="sub" x="48" y="80" data-fit="860">Presencia en Play Store → Ficha de Play Store principal. Es lo que ve quien busca tu app.</text>
  <rect x="48" y="104" width="864" height="452" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <path d="M48,138 V116 A12,12 0 0 1 60,104 H900 A12,12 0 0 1 912,116 V138 Z" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/>
  <circle cx="68" cy="121" r="4.5" fill="#F14C4C"/>  <circle cx="83" cy="121" r="4.5" fill="#E5C07B"/>  <circle cx="98" cy="121" r="4.5" fill="#6BCB77"/>
  <text x="480.0" y="121" dy="0.35em" font-size="13" font-weight="700" fill="#3A8235" text-anchor="middle" data-fit="724">Google Play Console · Muro Icesi</text>
  <rect x="48" y="138" width="190" height="418" fill="#F7F8FA"/>
  <path d="M238,138 V556" stroke="#D9DEE8" stroke-width="1.25"/>
  <text x="66" y="160" dy="0.35em" font-size="12.5" font-weight="400" fill="#454C61" text-anchor="start" data-fit="162">Panel</text>
  <text x="62" y="190" dy="0.35em" font-size="10.5" font-weight="700" fill="#79809A" text-anchor="start" data-fit="166">PRUEBAS</text>
  <text x="66" y="216" dy="0.35em" font-size="12.5" font-weight="400" fill="#454C61" text-anchor="start" data-fit="162">Prueba cerrada</text>
  <text x="66" y="246" dy="0.35em" font-size="12.5" font-weight="400" fill="#454C61" text-anchor="start" data-fit="162">Producción</text>
  <text x="62" y="276" dy="0.35em" font-size="10.5" font-weight="700" fill="#79809A" text-anchor="start" data-fit="166">PRESENCIA</text>
  <rect x="54" y="289" width="178" height="26" rx="7" fill="#E8F6E3"/><rect x="54" y="289" width="4" height="26" rx="2" fill="#3A8235"/>
  <text x="66" y="302" dy="0.35em" font-size="12.5" font-weight="700" fill="#3A8235" text-anchor="start" data-fit="162">Ficha de Play Store</text>
  <text x="262" y="164" dy="0.35em" font-size="17" font-weight="700" fill="#161A26" text-anchor="start">Ficha de Play Store principal</text>
  <text x="262" y="192" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start" data-fit="290">Nombre de la app</text>
  <rect x="262" y="204" width="290" height="30" rx="7" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="272" y="219" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="270">Muro Icesi</text>
  <text x="552" y="192" dy="0.35em" font-size="11" font-weight="400" fill="#79809A" text-anchor="end">máx. 30</text>
  <circle cx="566" cy="216" r="11" fill="#C2354F"/><text x="566" y="216" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">1</text>
  <text x="588" y="192" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start" data-fit="300">Descripción breve · máx. 80</text>
  <rect x="588" y="204" width="300" height="30" rx="7" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="598" y="219" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="280">Fotos y chat de tu clase</text>
  <circle cx="878" cy="192" r="11" fill="#C2354F"/><text x="878" y="192" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">2</text>
  <text x="262" y="254" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start" data-fit="626">Descripción completa · máx. 4000</text>
  <rect x="262" y="266" width="626" height="52" rx="7" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="272" y="281" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="606">Publica fotos en el muro, da me gusta y conversa…</text>
  <circle cx="878" cy="254" r="11" fill="#C2354F"/><text x="878" y="254" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">3</text>
  <text x="262" y="336" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start">Ícono</text>
  <rect x="262" y="348" width="76" height="76" rx="8" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/>
  <path d="M276,407 L292,382 L306,398 L315,390 L326,407 Z" fill="#9FD68D"/>
  <text x="300.0" y="438" dy="0.35em" font-size="11" font-weight="400" fill="#79809A" text-anchor="middle">512 × 512 PNG</text>
  <circle cx="348" cy="348" r="11" fill="#C2354F"/><text x="348" y="348" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">4</text>
  <text x="382" y="336" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start">Gráfico de funciones</text>
  <rect x="382" y="348" width="160" height="78" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <path d="M411,409 L446,383 L475,399 L494,391 L516,409 Z" fill="#C4CBD8"/>
  <text x="462.0" y="440" dy="0.35em" font-size="11" font-weight="400" fill="#79809A" text-anchor="middle">1024 × 500</text>
  <circle cx="552" cy="348" r="11" fill="#C2354F"/><text x="552" y="348" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">5</text>
  <text x="588" y="336" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start">Capturas del teléfono · mínimo 2</text>
  <rect x="588" y="348" width="46" height="88" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <path d="M596,417 L606,388 L615,406 L620,396 L627,417 Z" fill="#C4CBD8"/>
  <rect x="646" y="348" width="46" height="88" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <path d="M654,417 L664,388 L673,406 L678,396 L685,417 Z" fill="#C4CBD8"/>
  <rect x="704" y="348" width="46" height="88" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <path d="M712,417 L722,388 L731,406 L736,396 L743,417 Z" fill="#C4CBD8"/>
  <circle cx="762" cy="348" r="11" fill="#C2354F"/><text x="762" y="348" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">6</text>
  <rect x="778" y="504" width="110" height="30" rx="15" fill="#3A8235" stroke="#3A8235" stroke-width="1.5"/>
  <text x="833.0" y="519" dy="0.35em" font-size="12.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">Guardar</text>
</svg>
```

Las capturas salen del emulador, con el botón de cámara de su barra lateral. El ícono tiene que medir exactamente 512 × 512 y el gráfico de funciones, 1024 × 500.

## 4. La prueba cerrada

```svg
<svg id="gpPrueba" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 600" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="gpPrueba-ttl gpPrueba-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="gpPrueba-ttl">La prueba cerrada</title>
  <desc id="gpPrueba-dsc">Esquema de la prueba cerrada. Pestaña Testers: una lista de correos con al menos 12 personas (paso 1) y el enlace para unirse que hay que compartirles (paso 2). Debajo, Crear versión: la zona para subir app-release.aab (paso 3), el nombre de la versión (paso 4), las notas (paso 5) y el botón para guardar y publicar en la pista de prueba (paso 6).</desc>
  <defs>
    <style>
      #gpPrueba .title{fill:#161A26;font-size:22px;font-weight:700}
      #gpPrueba .sub{fill:#79809A;font-size:13.5px}
      #gpPrueba .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #gpPrueba .foot{fill:#79809A;font-size:12px}
      #gpPrueba .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #gpPrueba .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #gpPrueba .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#gpPrueba-arrow)}
    </style>
    <marker id="gpPrueba-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="600" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">La prueba cerrada</text>
  <text class="sub" x="48" y="80" data-fit="860">Pruebas → Prueba cerrada. Primero los testers, luego la versión con tu AAB.</text>
  <rect x="48" y="104" width="864" height="472" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <path d="M48,138 V116 A12,12 0 0 1 60,104 H900 A12,12 0 0 1 912,116 V138 Z" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/>
  <circle cx="68" cy="121" r="4.5" fill="#F14C4C"/>  <circle cx="83" cy="121" r="4.5" fill="#E5C07B"/>  <circle cx="98" cy="121" r="4.5" fill="#6BCB77"/>
  <text x="480.0" y="121" dy="0.35em" font-size="13" font-weight="700" fill="#3A8235" text-anchor="middle" data-fit="724">Google Play Console · Muro Icesi</text>
  <rect x="48" y="138" width="190" height="438" fill="#F7F8FA"/>
  <path d="M238,138 V576" stroke="#D9DEE8" stroke-width="1.25"/>
  <text x="66" y="160" dy="0.35em" font-size="12.5" font-weight="400" fill="#454C61" text-anchor="start" data-fit="162">Panel</text>
  <text x="62" y="190" dy="0.35em" font-size="10.5" font-weight="700" fill="#79809A" text-anchor="start" data-fit="166">PRUEBAS</text>
  <text x="66" y="216" dy="0.35em" font-size="12.5" font-weight="400" fill="#454C61" text-anchor="start" data-fit="162">Prueba interna</text>
  <rect x="54" y="233" width="178" height="26" rx="7" fill="#E8F6E3"/><rect x="54" y="233" width="4" height="26" rx="2" fill="#3A8235"/>
  <text x="66" y="246" dy="0.35em" font-size="12.5" font-weight="700" fill="#3A8235" text-anchor="start" data-fit="162">Prueba cerrada</text>
  <text x="66" y="276" dy="0.35em" font-size="12.5" font-weight="400" fill="#454C61" text-anchor="start" data-fit="162">Producción</text>
  <text x="262" y="164" dy="0.35em" font-size="17" font-weight="700" fill="#161A26" text-anchor="start">Prueba cerrada · Alpha</text>
  <text x="262" y="196" dy="0.35em" font-size="12.5" font-weight="400" fill="#556074" text-anchor="start">Versiones</text>
  <text x="352.8" y="196" dy="0.35em" font-size="12.5" font-weight="400" fill="#556074" text-anchor="start">Países</text>
  <text x="422.0" y="196" dy="0.35em" font-size="12.5" font-weight="700" fill="#3A8235" text-anchor="start">Testers</text>
  <rect x="418.0" y="209" width="58" height="3" rx="1.5" fill="#3A8235"/>
  <path d="M262,214 H888" stroke="#D9DEE8" stroke-width="1.25"/>
  <rect x="263" y="231" width="14" height="14" rx="3" fill="#3A8235" stroke="#3A8235" stroke-width="1.75"/><path d="M266,238 l3,3 l6,-6" fill="none" stroke="#FFFFFF" stroke-width="2"/>
  <text x="286" y="238" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="300">Lista «moviles-262» · 14 correos</text>
  <circle cx="558" cy="238" r="11" fill="#C2354F"/><text x="558" y="238" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">1</text>
  <text x="262" y="260" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start" data-fit="400">Enlace para unirse</text>
  <rect x="262" y="272" width="400" height="30" rx="7" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>
  <text class="mono" x="272" y="287" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="380">play.google.com/apps/testing/co.edu…</text>
  <rect x="674" y="272" width="80" height="30" rx="15" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.5"/>
  <text x="714.0" y="287" dy="0.35em" font-size="12.5" font-weight="700" fill="#3A8235" text-anchor="middle">Copiar</text>
  <circle cx="768" cy="287" r="11" fill="#C2354F"/><text x="768" y="287" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">2</text>
  <path d="M262,326 H888" stroke="#D9DEE8" stroke-width="1.25"/>
  <text x="262" y="346" dy="0.35em" font-size="14" font-weight="700" fill="#161A26" text-anchor="start">Crear versión</text>
  <rect x="262" y="364" width="300" height="92" rx="10" fill="#F7F8FA" stroke="#9AA1B5" stroke-width="1.5" stroke-dasharray="6 5"/>
  <path d="M412.0,388.0 v-12 m-6,6 l6,-6 l6,6" fill="none" stroke="#556074" stroke-width="1.75"/>
  <text x="412.0" y="402.0" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26" text-anchor="middle" data-fit="280">Sube app-release.aab</text>
  <text x="412.0" y="420.0" dy="0.35em" font-size="11.5" font-weight="400" fill="#79809A" text-anchor="middle" data-fit="280">Google firma la versión final</text>
  <circle cx="562" cy="364" r="11" fill="#C2354F"/><text x="562" y="364" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">3</text>
  <text x="588" y="364" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start" data-fit="300">Nombre de la versión</text>
  <rect x="588" y="376" width="300" height="30" rx="7" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>
  <text class="mono" x="598" y="391" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="280">1 (1.0.0)</text>
  <circle cx="878" cy="364" r="11" fill="#C2354F"/><text x="878" y="364" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">4</text>
  <text x="588" y="418" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start" data-fit="300">Notas de la versión</text>
  <rect x="588" y="430" width="300" height="30" rx="7" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>
  <text class="mono" x="598" y="445" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="280">&lt;es-419&gt;Primera versión&lt;/es-419&gt;</text>
  <circle cx="878" cy="418" r="11" fill="#C2354F"/><text x="878" y="418" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">5</text>
  <rect x="674" y="520" width="180" height="30" rx="15" fill="#3A8235" stroke="#3A8235" stroke-width="1.5"/>
  <text x="764.0" y="535" dy="0.35em" font-size="12.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">Guardar y publicar</text>
  <circle cx="866" cy="535" r="11" fill="#C2354F"/><text x="866" y="535" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">6</text>
  <text x="262" y="486" dy="0.35em" font-size="12" font-weight="400" fill="#79809A" text-anchor="start">La primera vez, acepta la firma de apps de Google Play.</text>
</svg>
```

1. En *Pruebas → Prueba cerrada*, abre la pista y, en *Testers*, crea una lista con los correos de Gmail de tus testers (1).
2. Crea una versión, sube el AAB (3), pon el nombre y las notas (4 y 5) y pulsa **Guardar y publicar** (6). La primera vez, acepta la firma de apps de Google Play.
3. Cuando Google apruebe la versión, comparte el enlace para unirse (2). Cada tester lo abre, pulsa *Convertirse en tester* e instala la app desde Play Store.

La *Prueba interna* es más rápida (hasta 100 personas y sin revisión), pero no cuenta para el requisito de los 14 días.

## 5. Producción

```svg
<svg id="gpProduccion" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 520" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="gpProduccion-ttl gpProduccion-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="gpProduccion-ttl">De la prueba a producción</title>
  <desc id="gpProduccion-dsc">A la izquierda, la tarjeta del panel Solicitar acceso a producción: 12 testers inscritos, 14 de 14 días y el botón Solicitar acceso (paso 1). A la derecha, Producción: Crear versión (paso 2), Agregar desde la biblioteca para reutilizar el AAB de la prueba (paso 3) y en Resumen de publicación, Enviar cambios a revisión (paso 4).</desc>
  <defs>
    <style>
      #gpProduccion .title{fill:#161A26;font-size:22px;font-weight:700}
      #gpProduccion .sub{fill:#79809A;font-size:13.5px}
      #gpProduccion .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #gpProduccion .foot{fill:#79809A;font-size:12px}
      #gpProduccion .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #gpProduccion .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #gpProduccion .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#gpProduccion-arrow)}
    </style>
    <marker id="gpProduccion-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="520" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">De la prueba a producción</text>
  <text class="sub" x="48" y="80" data-fit="860">Cuando el panel marca los 14 días, se pide el acceso. Con el acceso, la versión va a producción.</text>
  <rect x="48" y="104" width="410" height="300" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <path d="M48,138 V116 A12,12 0 0 1 60,104 H446 A12,12 0 0 1 458,116 V138 Z" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/>
  <circle cx="68" cy="121" r="4.5" fill="#F14C4C"/>  <circle cx="83" cy="121" r="4.5" fill="#E5C07B"/>  <circle cx="98" cy="121" r="4.5" fill="#6BCB77"/>
  <text x="253.0" y="121" dy="0.35em" font-size="13" font-weight="700" fill="#3A8235" text-anchor="middle" data-fit="270">Google Play Console · Panel</text>
  <text x="72" y="162" dy="0.35em" font-size="15" font-weight="700" fill="#161A26" text-anchor="start">Solicitar acceso a producción</text>
  <rect x="73" y="189" width="14" height="14" rx="3" fill="#3A8235" stroke="#3A8235" stroke-width="1.75"/><path d="M76,196 l3,3 l6,-6" fill="none" stroke="#FFFFFF" stroke-width="2"/>
  <text x="96" y="196" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="330">12 testers inscritos en la prueba</text>
  <rect x="73" y="217" width="14" height="14" rx="3" fill="#3A8235" stroke="#3A8235" stroke-width="1.75"/><path d="M76,224 l3,3 l6,-6" fill="none" stroke="#FFFFFF" stroke-width="2"/>
  <text x="96" y="224" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="330">Prueba activa 14 de 14 días</text>
  <rect x="72" y="246" width="362" height="8" rx="4" fill="#E8F6E3"/><rect x="72" y="246" width="362" height="8" rx="4" fill="#3A8235"/>
  <text x="72" y="278" dy="0.35em" font-size="12" font-weight="400" fill="#454C61" text-anchor="start">Luego responde preguntas sobre cómo</text>
  <text x="72" y="296" dy="0.35em" font-size="12" font-weight="400" fill="#454C61" text-anchor="start">probaste la app. Google tarda unos días.</text>
  <rect x="72" y="330" width="160" height="30" rx="15" fill="#3A8235" stroke="#3A8235" stroke-width="1.5"/>
  <text x="152.0" y="345" dy="0.35em" font-size="12.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">Solicitar acceso</text>
  <circle cx="246" cy="345" r="11" fill="#C2354F"/><text x="246" y="345" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">1</text>
  <rect x="502" y="104" width="410" height="300" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <path d="M502,138 V116 A12,12 0 0 1 514,104 H900 A12,12 0 0 1 912,116 V138 Z" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/>
  <circle cx="522" cy="121" r="4.5" fill="#F14C4C"/>  <circle cx="537" cy="121" r="4.5" fill="#E5C07B"/>  <circle cx="552" cy="121" r="4.5" fill="#6BCB77"/>
  <text x="707.0" y="121" dy="0.35em" font-size="13" font-weight="700" fill="#3A8235" text-anchor="middle" data-fit="270">Google Play Console · Producción</text>
  <text x="526" y="162" dy="0.35em" font-size="15" font-weight="700" fill="#161A26" text-anchor="start">Producción</text>
  <rect x="526" y="180" width="140" height="30" rx="15" fill="#3A8235" stroke="#3A8235" stroke-width="1.5"/>
  <text x="596.0" y="195" dy="0.35em" font-size="12.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">Crear versión</text>
  <circle cx="680" cy="195" r="11" fill="#C2354F"/><text x="680" y="195" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">2</text>
  <rect x="526" y="226" width="362" height="58" rx="10" fill="#F7F8FA" stroke="#9AA1B5" stroke-width="1.5" stroke-dasharray="6 5"/>
  <text x="540" y="246" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start">App bundles</text>
  <rect x="540" y="256" width="210" height="30" rx="15" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.5"/>
  <text x="645.0" y="271" dy="0.35em" font-size="12.5" font-weight="700" fill="#3A8235" text-anchor="middle">Agregar desde la biblioteca</text>
  <circle cx="762" cy="271" r="11" fill="#C2354F"/><text x="762" y="271" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">3</text>
  <text x="526" y="312" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start">Resumen de publicación</text>
  <rect x="526" y="328" width="210" height="30" rx="15" fill="#3A8235" stroke="#3A8235" stroke-width="1.5"/>
  <text x="631.0" y="343" dy="0.35em" font-size="12.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">Enviar cambios a revisión</text>
  <circle cx="750" cy="343" r="11" fill="#C2354F"/><text x="750" y="343" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">4</text>
<g transform="translate(48,424)"><rect width="864" height="60" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#556074" data-fit="836">Tiempos</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="836">La revisión de la primera versión puede tardar varios días. Las siguientes suelen tardar horas.</text></g>
</svg>
```

Cuando el panel marque los 14 días, pulsa **Solicitar acceso a producción** (1) y responde el cuestionario. Con el acceso aprobado, en *Producción* crea una versión (2), reutiliza el AAB de la prueba desde la biblioteca (3) y, en *Resumen de publicación*, pulsa **Enviar cambios a revisión** (4).

## Publicar una actualización

```svg
<svg id="gpVersiones" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 430" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="gpVersiones-ttl gpVersiones-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="gpVersiones-ttl">Versionar: nombre visible y número que siempre sube</title>
  <desc id="gpVersiones-dsc">Una línea de tiempo con cuatro subidas. 1.0.0+1 se acepta. 1.0.1+2 se acepta. Volver a subir con +2 se rechaza porque el código de versión 2 ya se usó. 1.1.0+3 se acepta. Abajo, qué nombre recibe cada número en Android y en iOS.</desc>
  <defs>
    <style>
      #gpVersiones .title{fill:#161A26;font-size:22px;font-weight:700}
      #gpVersiones .sub{fill:#79809A;font-size:13.5px}
      #gpVersiones .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #gpVersiones .foot{fill:#79809A;font-size:12px}
      #gpVersiones .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #gpVersiones .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #gpVersiones .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#gpVersiones-arrow)}
    </style>
    <marker id="gpVersiones-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="430" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Versionar: nombre visible y número que siempre sube</text>
  <text class="sub" x="48" y="80" data-fit="860">En pubspec.yaml, lo de antes del + es el nombre que ve la gente; lo de después es el número interno.</text>
  <path d="M80,190 H880" stroke="#C4CBD8" stroke-width="2"/>
  <circle cx="140" cy="190" r="9" fill="#3A8235"/>
  <rect x="48" y="120" width="184" height="40" rx="9" fill="#1F2430"/>
  <text class="mono" x="140" y="140" dy="0.35em" font-size="13" font-weight="700" fill="#C9CFDA" text-anchor="middle">version: 1.0.0+1</text>
  <text x="140" y="220" dy="0.35em" font-size="12.5" font-weight="400" fill="#454C61" text-anchor="middle">primera versión</text>
  <rect x="70" y="241" width="140" height="22" rx="11" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/><text x="140" y="252" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#3A8235">aceptada</text>
  <circle cx="366" cy="190" r="9" fill="#3A8235"/>
  <rect x="274" y="120" width="184" height="40" rx="9" fill="#1F2430"/>
  <text class="mono" x="366" y="140" dy="0.35em" font-size="13" font-weight="700" fill="#C9CFDA" text-anchor="middle">version: 1.0.1+2</text>
  <text x="366" y="220" dy="0.35em" font-size="12.5" font-weight="400" fill="#454C61" text-anchor="middle">corrige un error</text>
  <rect x="296" y="241" width="140" height="22" rx="11" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/><text x="366" y="252" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#3A8235">aceptada</text>
  <circle cx="592" cy="190" r="9" fill="#C2354F"/>
  <rect x="500" y="120" width="184" height="40" rx="9" fill="#1F2430"/>
  <text class="mono" x="592" y="140" dy="0.35em" font-size="13" font-weight="700" fill="#C9CFDA" text-anchor="middle">version: 1.0.1+2</text>
  <text x="592" y="220" dy="0.35em" font-size="12.5" font-weight="400" fill="#454C61" text-anchor="middle">se olvidó subir el +</text>
  <rect x="522" y="241" width="140" height="22" rx="11" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.25"/><text x="592" y="252" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#C2354F">rechazada</text>
  <circle cx="818" cy="190" r="9" fill="#3A8235"/>
  <rect x="726" y="120" width="184" height="40" rx="9" fill="#1F2430"/>
  <text class="mono" x="818" y="140" dy="0.35em" font-size="13" font-weight="700" fill="#C9CFDA" text-anchor="middle">version: 1.1.0+3</text>
  <text x="818" y="220" dy="0.35em" font-size="12.5" font-weight="400" fill="#454C61" text-anchor="middle">función nueva</text>
  <rect x="748" y="241" width="140" height="22" rx="11" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/><text x="818" y="252" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#3A8235">aceptada</text>
  <text x="592" y="284" dy="0.35em" font-size="11.5" font-weight="400" fill="#C2354F" text-anchor="middle">Ya se usó el código de versión 2</text>
<g transform="translate(48,312)"><rect width="420" height="77" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#4453C9" data-fit="392">Antes del +  ·  1.0.1</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="392">Android: versionName · iOS: CFBundleShortVersionString</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="392">Lo ve la gente. Súbelo cuando cambie algo visible.</text></g>
<g transform="translate(492,312)"><rect width="420" height="77" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="392">Después del +  ·  2</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="392">Android: versionCode · iOS: CFBundleVersion</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="392">Debe ser mayor que el de la última subida.</text></g>
</svg>
```

1. En `pubspec.yaml`, sube el número que va después del `+`. Si la gente va a notar el cambio, sube también el nombre: `1.0.0+1` → `1.0.1+2`.
2. Genera el AAB otra vez con `flutter build appbundle`.
3. En *Producción → Crear versión*, sube el AAB nuevo, escribe las notas y envía los cambios a revisión.

Si olvidas el paso 1, Play Console rechaza el archivo con un aviso de que ese código de versión ya se usó. El número no tiene que subir de uno en uno: solo tiene que ser mayor que el anterior.

## Video: una publicación completa

Este video es de una publicación de hace un tiempo. Algunas pantallas de la consola cambiaron, pero el recorrido es el mismo.

```youtube
mW98Jjq0hcc | Cómo publicar una app en Google Play
```
