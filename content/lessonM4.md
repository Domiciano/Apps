# Publicar en App Store

<!-- tags: App Store Connect, Transporter, TestFlight, Bundle ID, SKU, App Review,
     capturas iPhone 6,9 pulgadas, cumplimiento de exportación, ITSAppUsesNonExemptEncryption,
     Agregar para revisión, Apple Developer Program, build number -->

Necesitas el **Apple Developer Program** (pago anual) y el IPA de *Generación de artefactos*.

## El camino

```svg
<svg id="asRuta" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 360" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="asRuta-ttl asRuta-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="asRuta-ttl">El camino hasta el App Store</title>
  <desc id="asRuta-dsc">Seis pasos en dos filas: crear la app en App Store Connect, subir el IPA con Transporter, probarlo en TestFlight, llenar la página de la versión, completar información, precio y privacidad, y enviar a revisión.</desc>
  <defs>
    <style>
      #asRuta .title{fill:#161A26;font-size:22px;font-weight:700}
      #asRuta .sub{fill:#79809A;font-size:13.5px}
      #asRuta .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #asRuta .foot{fill:#79809A;font-size:12px}
      #asRuta .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #asRuta .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #asRuta .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#asRuta-arrow)}
    </style>
    <marker id="asRuta-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="360" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">El camino hasta el App Store</text>
  <text class="sub" x="48" y="80" data-fit="860">Primero existe la app en App Store Connect; después le subes builds y eliges uno para revisión.</text>
<rect x="48" y="116" width="256" height="64" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="176" y="139" dy="0.35em" text-anchor="middle" font-size="14.5" font-weight="700" fill="#4453C9" data-fit="240">Crear la app</text><text x="176" y="158" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="240">Bundle ID y SKU</text>
  <circle cx="52" cy="120" r="11" fill="#C2354F"/><text x="52" y="120" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">1</text>
<rect x="352" y="116" width="256" height="64" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="480" y="139" dy="0.35em" text-anchor="middle" font-size="14.5" font-weight="700" fill="#7439B8" data-fit="240">Subir el IPA</text><text x="480" y="158" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="240">con Transporter</text>
  <circle cx="356" cy="120" r="11" fill="#C2354F"/><text x="356" y="120" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">2</text>
  <path class="link" d="M308,148 L346,148"/>
<rect x="656" y="116" width="256" height="64" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="784" y="139" dy="0.35em" text-anchor="middle" font-size="14.5" font-weight="700" fill="#556074" data-fit="240">TestFlight</text><text x="784" y="158" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="240">opcional</text>
  <circle cx="660" cy="120" r="11" fill="#C2354F"/><text x="660" y="120" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">3</text>
  <path class="link" d="M612,148 L650,148"/>
<rect x="48" y="230" width="256" height="64" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="176" y="253" dy="0.35em" text-anchor="middle" font-size="14.5" font-weight="700" fill="#4453C9" data-fit="240">Página de la versión</text><text x="176" y="272" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="240">capturas y textos</text>
  <circle cx="52" cy="234" r="11" fill="#C2354F"/><text x="52" y="234" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">4</text>
<rect x="352" y="230" width="256" height="64" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="480" y="253" dy="0.35em" text-anchor="middle" font-size="14.5" font-weight="700" fill="#4453C9" data-fit="240">Información de la app</text><text x="480" y="272" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="240">precio y privacidad</text>
  <circle cx="356" cy="234" r="11" fill="#C2354F"/><text x="356" y="234" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">5</text>
  <path class="link" d="M308,262 L346,262"/>
<rect x="656" y="230" width="256" height="64" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="784" y="253" dy="0.35em" text-anchor="middle" font-size="14.5" font-weight="700" fill="#3A8235" data-fit="240">Enviar a revisión</text><text x="784" y="272" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="240">App Review</text>
  <circle cx="660" cy="234" r="11" fill="#C2354F"/><text x="660" y="234" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">6</text>
  <path class="link" d="M612,262 L650,262"/>
  <path class="link" d="M864,184 V206 H176 V226"/>
  <text class="foot" x="48" y="332" data-fit="860">Necesitas el Apple Developer Program (pago anual) desde el paso 1: sin él no aparece App Store Connect.</text>
</svg>
```

La app tiene que existir en App Store Connect **antes** de subir el IPA. Si no existe, Transporter rechaza el archivo.

## 1. Crear la app

```svg
<svg id="asNueva" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="asNueva-ttl asNueva-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="asNueva-ttl">Nueva app en App Store Connect</title>
  <desc id="asNueva-dsc">Esquema del formulario Nueva app: plataforma iOS (paso 1), nombre (paso 2), idioma principal (paso 3), ID del paquete co.edu.icesi.miapp (paso 4), SKU (paso 5) y acceso de usuario. Abajo, los botones Cancelar y Crear.</desc>
  <defs>
    <style>
      #asNueva .title{fill:#161A26;font-size:22px;font-weight:700}
      #asNueva .sub{fill:#79809A;font-size:13.5px}
      #asNueva .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #asNueva .foot{fill:#79809A;font-size:12px}
      #asNueva .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #asNueva .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #asNueva .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#asNueva-arrow)}
    </style>
    <marker id="asNueva-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="540" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Nueva app en App Store Connect</text>
  <text class="sub" x="48" y="80" data-fit="860">Apps → botón + → Nueva app. El ID del paquete tiene que ser el mismo Bundle ID de Xcode.</text>
  <rect x="48" y="104" width="864" height="412" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <path d="M48,138 V116 A12,12 0 0 1 60,104 H900 A12,12 0 0 1 912,116 V138 Z" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/>
  <circle cx="68" cy="121" r="4.5" fill="#F14C4C"/>  <circle cx="83" cy="121" r="4.5" fill="#E5C07B"/>  <circle cx="98" cy="121" r="4.5" fill="#6BCB77"/>
  <text x="480.0" y="121" dy="0.35em" font-size="13" font-weight="700" fill="#4453C9" text-anchor="middle" data-fit="724">App Store Connect</text>
  <text x="72" y="154" dy="0.35em" font-size="12.5" font-weight="700" fill="#4453C9" text-anchor="start">Apps</text>
  <rect x="68" y="167" width="37" height="3" rx="1.5" fill="#4453C9"/>
  <text x="126.8" y="154" dy="0.35em" font-size="12.5" font-weight="400" fill="#556074" text-anchor="start">Usuarios y acceso</text>
  <text x="275.2" y="154" dy="0.35em" font-size="12.5" font-weight="400" fill="#556074" text-anchor="start">Pagos</text>
  <rect x="210" y="184" width="540" height="316" rx="12" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="1.5"/>
  <text x="234" y="208" dy="0.35em" font-size="16" font-weight="700" fill="#161A26" text-anchor="start">Nueva app</text>
  <text x="234" y="236" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start">Plataformas</text>
  <rect x="335" y="229" width="14" height="14" rx="3" fill="#4453C9" stroke="#4453C9" stroke-width="1.75"/><path d="M338,236 l3,3 l6,-6" fill="none" stroke="#FFFFFF" stroke-width="2"/>
  <text x="358" y="236" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start">iOS</text>
  <rect x="405" y="229" width="14" height="14" rx="3" fill="#FFFFFF" stroke="#9AA1B5" stroke-width="1.75"/>
  <text x="428" y="236" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start">macOS</text>
  <circle cx="494" cy="236" r="11" fill="#C2354F"/><text x="494" y="236" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">1</text>
  <text x="234" y="256" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start" data-fit="230">Nombre</text>
  <rect x="234" y="268" width="230" height="30" rx="7" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="244" y="283" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="210">Muro Icesi</text>
  <circle cx="474" cy="280" r="11" fill="#C2354F"/><text x="474" y="280" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">2</text>
  <text x="496" y="256" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start" data-fit="230">Idioma principal</text>
  <rect x="496" y="268" width="230" height="30" rx="7" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="506" y="283" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="210">Español (México)</text>
  <path d="M704,280 l6,6 l6,-6" fill="none" stroke="#556074" stroke-width="1.75"/>
  <circle cx="736" cy="280" r="11" fill="#C2354F"/><text x="736" y="280" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">3</text>
  <text x="234" y="318" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start" data-fit="230">ID del paquete</text>
  <rect x="234" y="330" width="230" height="30" rx="7" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="244" y="345" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="210">co.edu.icesi.miapp</text>
  <path d="M442,342 l6,6 l6,-6" fill="none" stroke="#556074" stroke-width="1.75"/>
  <circle cx="474" cy="342" r="11" fill="#C2354F"/><text x="474" y="342" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">4</text>
  <text x="496" y="318" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start" data-fit="230">SKU</text>
  <rect x="496" y="330" width="230" height="30" rx="7" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>
  <text class="mono" x="506" y="345" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="210">miapp-001</text>
  <circle cx="736" cy="342" r="11" fill="#C2354F"/><text x="736" y="342" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">5</text>
  <text x="234" y="384" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start">Acceso de usuario</text>
  <circle cx="382" cy="384" r="7.5" fill="#FFFFFF" stroke="#4453C9" stroke-width="1.75"/><circle cx="382" cy="384" r="4" fill="#4453C9"/>
  <text x="398" y="384" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start">Acceso total</text>
  <rect x="520" y="454" width="100" height="30" rx="15" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="1.5"/>
  <text x="570.0" y="469" dy="0.35em" font-size="12.5" font-weight="700" fill="#4453C9" text-anchor="middle">Cancelar</text>
  <rect x="632" y="454" width="94" height="30" rx="15" fill="#4453C9" stroke="#4453C9" stroke-width="1.5"/>
  <text x="679.0" y="469" dy="0.35em" font-size="12.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">Crear</text>
</svg>
```

En [App Store Connect](https://appstoreconnect.apple.com), entra a *Apps*, pulsa **+** y luego *Nueva app*. El ID del paquete aparece en la lista si Xcode ya lo registró al firmar; si no aparece, regístralo en [developer.apple.com](https://developer.apple.com/account) → *Identifiers*. El SKU es un código interno tuyo, cualquiera sirve.

## 2. Subir el IPA

```svg
<svg id="asTransporter" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 530" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="asTransporter-ttl asTransporter-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="asTransporter-ttl">Subir el IPA con Transporter</title>
  <desc id="asTransporter-dsc">A la izquierda, la app Transporter: una zona para arrastrar el IPA (paso 1) y la fila de MiApp 1.0.0 con el botón Entregar (paso 2). Una flecha lleva a la derecha, a la pestaña TestFlight de App Store Connect: la compilación 1.0.0 (1), primero procesando y luego con el aviso Falta información de cumplimiento y el botón Gestionar (paso 3).</desc>
  <defs>
    <style>
      #asTransporter .title{fill:#161A26;font-size:22px;font-weight:700}
      #asTransporter .sub{fill:#79809A;font-size:13.5px}
      #asTransporter .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #asTransporter .foot{fill:#79809A;font-size:12px}
      #asTransporter .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #asTransporter .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #asTransporter .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#asTransporter-arrow)}
    </style>
    <marker id="asTransporter-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="530" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Subir el IPA con Transporter</text>
  <text class="sub" x="48" y="80" data-fit="860">Transporter lo envía; App Store Connect lo procesa y lo muestra en TestFlight.</text>
  <rect x="48" y="104" width="380" height="330" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <path d="M48,138 V116 A12,12 0 0 1 60,104 H416 A12,12 0 0 1 428,116 V138 Z" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <circle cx="68" cy="121" r="4.5" fill="#F14C4C"/>  <circle cx="83" cy="121" r="4.5" fill="#E5C07B"/>  <circle cx="98" cy="121" r="4.5" fill="#6BCB77"/>
  <text x="238.0" y="121" dy="0.35em" font-size="13" font-weight="700" fill="#7439B8" text-anchor="middle" data-fit="240">Transporter</text>
  <rect x="70" y="156" width="336" height="120" rx="10" fill="#F7F8FA" stroke="#9AA1B5" stroke-width="1.5" stroke-dasharray="6 5"/>
  <path d="M238.0,194.0 v-12 m-6,6 l6,-6 l6,6" fill="none" stroke="#556074" stroke-width="1.75"/>
  <text x="238.0" y="208.0" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26" text-anchor="middle" data-fit="316">Arrastra aquí el .ipa</text>
  <text x="238.0" y="226.0" dy="0.35em" font-size="11.5" font-weight="400" fill="#79809A" text-anchor="middle" data-fit="316">build/ios/ipa/</text>
  <circle cx="406" cy="156" r="11" fill="#C2354F"/><text x="406" y="156" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">1</text>
  <rect x="70" y="296" width="336" height="58" rx="10" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <text x="84" y="316" dy="0.35em" font-size="13" font-weight="700" fill="#161A26" text-anchor="start">Muro Icesi</text>
  <text class="mono" x="84" y="336" dy="0.35em" font-size="11.5" font-weight="400" fill="#79809A" text-anchor="start">1.0.0 (1) · iOS</text>
  <rect x="296" y="310" width="96" height="30" rx="15" fill="#7439B8" stroke="#7439B8" stroke-width="1.5"/>
  <text x="344.0" y="325" dy="0.35em" font-size="12.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">Entregar</text>
  <circle cx="406" cy="325" r="11" fill="#C2354F"/><text x="406" y="325" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">2</text>
  <path class="link" d="M436,270 L486,270"/>
  <rect x="494" y="104" width="418" height="330" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <path d="M494,138 V116 A12,12 0 0 1 506,104 H900 A12,12 0 0 1 912,116 V138 Z" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/>
  <circle cx="514" cy="121" r="4.5" fill="#F14C4C"/>  <circle cx="529" cy="121" r="4.5" fill="#E5C07B"/>  <circle cx="544" cy="121" r="4.5" fill="#6BCB77"/>
  <text x="703.0" y="121" dy="0.35em" font-size="13" font-weight="700" fill="#4453C9" text-anchor="middle" data-fit="278">App Store Connect · TestFlight</text>
  <text x="516" y="162" dy="0.35em" font-size="14" font-weight="700" fill="#161A26" text-anchor="start">Compilaciones · iOS</text>
  <rect x="516" y="186" width="374" height="62" rx="10" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <text class="mono" x="530" y="206" dy="0.35em" font-size="13" font-weight="700" fill="#161A26" text-anchor="start">1.0.0 (1)</text>
  <text x="530" y="228" dy="0.35em" font-size="12" font-weight="400" fill="#556074" text-anchor="start" data-fit="260">Procesando…</text>
  <rect x="516" y="262" width="374" height="62" rx="10" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <text class="mono" x="530" y="282" dy="0.35em" font-size="13" font-weight="700" fill="#161A26" text-anchor="start">1.0.0 (1)</text>
  <text x="530" y="304" dy="0.35em" font-size="12" font-weight="700" fill="#A96C05" text-anchor="start" data-fit="260">Falta información de cumplimiento</text>
  <rect x="786" y="276" width="92" height="30" rx="15" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="1.5"/>
  <text x="832.0" y="291" dy="0.35em" font-size="12.5" font-weight="700" fill="#4453C9" text-anchor="middle">Gestionar</text>
  <circle cx="890" cy="262" r="11" fill="#C2354F"/><text x="890" y="262" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">3</text>
  <text x="516" y="364" dy="0.35em" font-size="12" font-weight="400" fill="#79809A" text-anchor="start">Unos minutos después de entregar.</text>
<g transform="translate(48,452)"><rect width="864" height="60" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="836">Cumplimiento de exportación</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="836">Si la app solo usa HTTPS, responde que no usa cifrado propio. Se pregunta una vez por build.</text></g>
</svg>
```

1. Instala **Transporter** desde la Mac App Store y entra con tu Apple ID.
2. Arrastra el `.ipa` de `build/ios/ipa/` (1) y pulsa **Entregar** (2).
3. Unos minutos después, el build aparece en la pestaña *TestFlight*. Si dice *Falta información de cumplimiento*, pulsa **Gestionar** (3) y responde que la app no usa cifrado propio.

Para que no te lo pregunte en cada build, agrega esto en `ios/Runner/Info.plist`, dentro de `<dict>`:

```xml
<key>ITSAppUsesNonExemptEncryption</key>
<false/>
```

## 3. TestFlight

Es opcional, pero sirve para probar el build en un iPhone de verdad antes de la revisión. En *TestFlight → Pruebas internas*, crea un grupo y agrega personas de tu equipo de App Store Connect. Instalan la app **TestFlight** en su iPhone y desde ahí descargan tu build.

## 4. La página de la versión

```svg
<svg id="asVersion" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 660" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="asVersion-ttl asVersion-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="asVersion-ttl">La página de la versión</title>
  <desc id="asVersion-dsc">Esquema de la página de la versión en App Store Connect: capturas del iPhone de 6,9 pulgadas (paso 1), texto promocional y descripción (paso 2), palabras clave y URL de soporte (paso 3), la compilación elegida con el botón más (paso 4), los datos de inicio de sesión para la revisión (paso 5) y el botón Agregar para revisión (paso 6).</desc>
  <defs>
    <style>
      #asVersion .title{fill:#161A26;font-size:22px;font-weight:700}
      #asVersion .sub{fill:#79809A;font-size:13.5px}
      #asVersion .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #asVersion .foot{fill:#79809A;font-size:12px}
      #asVersion .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #asVersion .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #asVersion .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#asVersion-arrow)}
    </style>
    <marker id="asVersion-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="660" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">La página de la versión</text>
  <text class="sub" x="48" y="80" data-fit="860">Distribución → 1.0 Preparar para el envío. De arriba abajo, y al final, Agregar para revisión.</text>
  <rect x="48" y="104" width="864" height="532" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <path d="M48,138 V116 A12,12 0 0 1 60,104 H900 A12,12 0 0 1 912,116 V138 Z" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/>
  <circle cx="68" cy="121" r="4.5" fill="#F14C4C"/>  <circle cx="83" cy="121" r="4.5" fill="#E5C07B"/>  <circle cx="98" cy="121" r="4.5" fill="#6BCB77"/>
  <text x="480.0" y="121" dy="0.35em" font-size="13" font-weight="700" fill="#4453C9" text-anchor="middle" data-fit="724">App Store Connect · Muro Icesi</text>
  <rect x="48" y="138" width="200" height="498" fill="#F7F8FA"/>
  <path d="M248,138 V636" stroke="#D9DEE8" stroke-width="1.25"/>
  <text x="62" y="160" dy="0.35em" font-size="10.5" font-weight="700" fill="#79809A" text-anchor="start" data-fit="176">APP PARA IOS</text>
  <rect x="54" y="173" width="188" height="26" rx="7" fill="#EEF1FF"/><rect x="54" y="173" width="4" height="26" rx="2" fill="#4453C9"/>
  <text x="66" y="186" dy="0.35em" font-size="12.5" font-weight="700" fill="#4453C9" text-anchor="start" data-fit="172">1.0 Preparar envío</text>
  <text x="62" y="216" dy="0.35em" font-size="10.5" font-weight="700" fill="#79809A" text-anchor="start" data-fit="176">GENERAL</text>
  <text x="66" y="242" dy="0.35em" font-size="12.5" font-weight="400" fill="#454C61" text-anchor="start" data-fit="172">Información de la app</text>
  <text x="66" y="272" dy="0.35em" font-size="12.5" font-weight="400" fill="#454C61" text-anchor="start" data-fit="172">Precio y disponibilidad</text>
  <text x="66" y="302" dy="0.35em" font-size="12.5" font-weight="400" fill="#454C61" text-anchor="start" data-fit="172">Privacidad de la app</text>
  <text x="272" y="164" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start">Capturas · iPhone 6,9"</text>
  <text class="mono" x="888" y="164" dy="0.35em" font-size="11" font-weight="400" fill="#79809A" text-anchor="end">1320 × 2868</text>
  <rect x="272" y="176" width="40" height="78" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <path d="M279,237 L288,211 L295,227 L300,219 L306,237 Z" fill="#C4CBD8"/>
  <rect x="322" y="176" width="40" height="78" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <path d="M329,237 L338,211 L345,227 L350,219 L356,237 Z" fill="#C4CBD8"/>
  <rect x="372" y="176" width="40" height="78" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <path d="M379,237 L388,211 L395,227 L400,219 L406,237 Z" fill="#C4CBD8"/>
  <rect x="422" y="176" width="40" height="78" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <path d="M429,237 L438,211 L445,227 L450,219 L456,237 Z" fill="#C4CBD8"/>
  <circle cx="482" cy="176" r="11" fill="#C2354F"/><text x="482" y="176" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">1</text>
  <text x="272" y="272" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start" data-fit="296">Texto promocional</text>
  <rect x="272" y="284" width="296" height="30" rx="7" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="282" y="299" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="276">Tu clase en un solo muro</text>
  <text x="592" y="272" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start" data-fit="296">Descripción</text>
  <rect x="592" y="284" width="296" height="30" rx="7" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="602" y="299" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="276">Publica fotos, da me gusta…</text>
  <circle cx="888" cy="272" r="11" fill="#C2354F"/><text x="888" y="272" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">2</text>
  <text x="272" y="334" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start" data-fit="296">Palabras clave</text>
  <rect x="272" y="346" width="296" height="30" rx="7" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="282" y="361" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="276">muro,fotos,chat,icesi</text>
  <text x="592" y="334" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start" data-fit="296">URL de soporte</text>
  <rect x="592" y="346" width="296" height="30" rx="7" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>
  <text class="mono" x="602" y="361" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="276">tusitio.com/soporte</text>
  <circle cx="888" cy="334" r="11" fill="#C2354F"/><text x="888" y="334" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">3</text>
  <text x="272" y="398" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start">Compilación</text>
  <rect x="272" y="410" width="616" height="40" rx="8" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>
  <circle cx="292" cy="430" r="10" fill="#4453C9"/><path d="M287,430 h10 M292,425 v10" stroke="#FFFFFF" stroke-width="2"/>
  <text class="mono" x="312" y="430" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start">1.0.0 (1) · elegida de TestFlight</text>
  <circle cx="888" cy="410" r="11" fill="#C2354F"/><text x="888" y="410" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">4</text>
  <text x="272" y="474" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start">Información para la revisión · inicio de sesión</text>
  <text x="272" y="476" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start" data-fit="296"></text>
  <rect x="272" y="488" width="296" height="30" rx="7" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>
  <text class="mono" x="282" y="503" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="276">revisor@icesi.edu.co</text>
  <text x="592" y="476" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start" data-fit="296"></text>
  <rect x="592" y="488" width="296" height="30" rx="7" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="602" y="503" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="276">••••••••</text>
  <circle cx="888" cy="488" r="11" fill="#C2354F"/><text x="888" y="488" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">5</text>
  <text x="272" y="546" dy="0.35em" font-size="12" font-weight="400" fill="#79809A" text-anchor="start">Sin una cuenta de prueba, Apple rechaza las apps con inicio de sesión.</text>
  <rect x="708" y="580" width="180" height="30" rx="15" fill="#4453C9" stroke="#4453C9" stroke-width="1.5"/>
  <text x="798.0" y="595" dy="0.35em" font-size="12.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">Agregar para revisión</text>
  <circle cx="900" cy="595" r="11" fill="#C2354F"/><text x="900" y="595" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">6</text>
</svg>
```

En *Distribución*, abre **1.0 Preparar para el envío** y llénala de arriba abajo. Las capturas de 6,9 pulgadas salen del simulador del iPhone Pro Max más grande, con `Cmd + S`. En *Compilación* (4), pulsa **+** y elige el build que subiste. Si la app tiene inicio de sesión, pon una cuenta de prueba en la información para la revisión (5).

## 5. Información, precio y privacidad

```svg
<svg id="asInfo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 420" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="asInfo-ttl asInfo-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="asInfo-ttl">Información, precio y privacidad</title>
  <desc id="asInfo-dsc">Tres tarjetas. Información de la app: categoría y clasificación por edades, que es un cuestionario. Precio y disponibilidad: gratis y los países. Privacidad de la app: la URL de la política de privacidad y los tipos de datos que recopila la app, por ejemplo correo y nombre, vinculados al usuario.</desc>
  <defs>
    <style>
      #asInfo .title{fill:#161A26;font-size:22px;font-weight:700}
      #asInfo .sub{fill:#79809A;font-size:13.5px}
      #asInfo .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #asInfo .foot{fill:#79809A;font-size:12px}
      #asInfo .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #asInfo .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #asInfo .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#asInfo-arrow)}
    </style>
    <marker id="asInfo-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="420" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Información, precio y privacidad</text>
  <text class="sub" x="48" y="80" data-fit="860">Tres páginas del menú General que se llenan una sola vez.</text>
  <rect x="48" y="112" width="272" height="250" rx="12" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="1.5"/>
  <path d="M48,150 V124 A12,12 0 0 1 60,112 H308 A12,12 0 0 1 320,124 V150 Z" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/>
  <text x="64" y="131" dy="0.35em" font-size="14" font-weight="700" fill="#4453C9" text-anchor="start" data-fit="240">Información de la app</text>
  <text x="64" y="176" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start" data-fit="240">Categoría</text>
  <rect x="64" y="188" width="240" height="30" rx="7" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="74" y="203" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="220">Redes sociales</text>
  <text x="64" y="250" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start" data-fit="240">Clasificación por edades</text>
  <rect x="64" y="262" width="240" height="30" rx="7" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="74" y="277" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="220">cuestionario → 4+</text>
  <circle cx="304" cy="112" r="11" fill="#C2354F"/><text x="304" y="112" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">1</text>
  <rect x="344" y="112" width="272" height="250" rx="12" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="1.5"/>
  <path d="M344,150 V124 A12,12 0 0 1 356,112 H604 A12,12 0 0 1 616,124 V150 Z" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/>
  <text x="360" y="131" dy="0.35em" font-size="14" font-weight="700" fill="#4453C9" text-anchor="start" data-fit="240">Precio y disponibilidad</text>
  <text x="360" y="176" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start" data-fit="240">Precio</text>
  <rect x="360" y="188" width="240" height="30" rx="7" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="370" y="203" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="220">Gratis (USD 0)</text>
  <text x="360" y="250" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start" data-fit="240">Disponibilidad</text>
  <rect x="360" y="262" width="240" height="30" rx="7" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="370" y="277" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="220">Colombia o todos</text>
  <circle cx="600" cy="112" r="11" fill="#C2354F"/><text x="600" y="112" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">2</text>
  <rect x="640" y="112" width="272" height="250" rx="12" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="1.5"/>
  <path d="M640,150 V124 A12,12 0 0 1 652,112 H900 A12,12 0 0 1 912,124 V150 Z" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/>
  <text x="656" y="131" dy="0.35em" font-size="14" font-weight="700" fill="#4453C9" text-anchor="start" data-fit="240">Privacidad de la app</text>
  <text x="656" y="176" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start" data-fit="240">Política de privacidad</text>
  <rect x="656" y="188" width="240" height="30" rx="7" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="666" y="203" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="220">tusitio.com/privacidad</text>
  <text x="656" y="250" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start" data-fit="240">Datos que recopila</text>
  <rect x="656" y="262" width="240" height="30" rx="7" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="666" y="277" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="220">correo y nombre</text>
  <circle cx="896" cy="112" r="11" fill="#C2354F"/><text x="896" y="112" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">3</text>
  <text class="foot" x="48" y="392" data-fit="860">Lo que declares en privacidad tiene que coincidir con lo que la app hace: Apple lo revisa.</text>
</svg>
```

Se llenan una sola vez, desde el menú *General*. La clasificación por edades es un cuestionario. En privacidad necesitas una URL pública con tu política, la misma de Google Play, y declarar qué datos guarda la app.

## 6. Enviar a revisión

De vuelta en la página de la versión, pulsa **Agregar para revisión** y luego **Enviar a App Review**. La revisión suele tardar uno o dos días. Si Apple rechaza la app, el motivo llega como mensaje en App Store Connect: corrige, sube un build nuevo y vuelve a enviar.

## Publicar una actualización

1. En `pubspec.yaml`, sube el número después del `+` y el nombre: `1.0.0+1` → `1.0.1+2`. Apple no acepta dos builds con el mismo número en la misma versión.
2. Genera el IPA otra vez con `flutter build ipa` y entrégalo con Transporter.
3. En *Distribución*, pulsa **+** junto a *App para iOS*, escribe la versión nueva (`1.0.1`), elige el build y envíala a revisión.
