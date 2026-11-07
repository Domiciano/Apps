# Notificaciones push

<!-- tags: notificaciones push, FCM, Firebase Cloud Messaging, APNs, topic, token,
     backend, batería, intermediario, notificación con la app cerrada -->

Una notificación push es un mensaje que el servidor le manda al teléfono, aunque la app esté cerrada. Sirve para avisar de algo nuevo: un mensaje en el chat, un like, un recordatorio.

## Una sola conexión

```svg
<svg id="pnUnaConexion" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 400" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="pnUnaConexion-ttl pnUnaConexion-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="pnUnaConexion-ttl">Una sola conexión para todas las apps</title>
  <desc id="pnUnaConexion-dsc">Dos teléfonos. A la izquierda, sin intermediario: cinco apps, cada una con su propia conexión abierta a su servidor, y la batería baja. A la derecha, con FCM: las mismas cinco apps dentro del teléfono, una sola conexión del sistema operativo hacia FCM, y FCM recibe de los servidores de cada app.</desc>
  <defs>
    <style>
      #pnUnaConexion .title{fill:#161A26;font-size:22px;font-weight:700}
      #pnUnaConexion .sub{fill:#79809A;font-size:13.5px}
      #pnUnaConexion .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #pnUnaConexion .foot{fill:#79809A;font-size:12px}
      #pnUnaConexion .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #pnUnaConexion .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #pnUnaConexion .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#pnUnaConexion-arrow)}
    </style>
    <marker id="pnUnaConexion-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="400" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Una sola conexión para todas las apps</text>
  <text class="sub" x="48" y="80" data-fit="860">El sistema operativo mantiene abierta una conexión con FCM, y por ella llegan los avisos de todas las apps.</text>
  <text x="48" y="124" dy="0.35em" font-size="15" font-weight="700" fill="#C2354F" text-anchor="start">Sin intermediario</text>
  <rect x="48" y="140" width="150" height="220" rx="20" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/>
  <rect x="101" y="148" width="44" height="6" rx="3" fill="#2A3040"/>
  <text x="64" y="174" dy="0.35em" font-size="13" font-weight="700" fill="#556074" text-anchor="start" data-fit="122">Teléfono</text>
  <path d="M50,190 H196" stroke="#D9DEE8" stroke-width="1.25"/>
  <rect x="68" y="206" width="110" height="20" rx="6" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>  <text x="78" y="216" dy="0.35em" font-size="11.5" font-weight="700" fill="#3A8235" text-anchor="start">App 1</text>
  <rect x="68" y="234" width="110" height="20" rx="6" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>  <text x="78" y="244" dy="0.35em" font-size="11.5" font-weight="700" fill="#3A8235" text-anchor="start">App 2</text>
  <rect x="68" y="262" width="110" height="20" rx="6" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>  <text x="78" y="272" dy="0.35em" font-size="11.5" font-weight="700" fill="#3A8235" text-anchor="start">App 3</text>
  <rect x="68" y="290" width="110" height="20" rx="6" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>  <text x="78" y="300" dy="0.35em" font-size="11.5" font-weight="700" fill="#3A8235" text-anchor="start">App 4</text>
  <rect x="68" y="318" width="110" height="20" rx="6" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>  <text x="78" y="328" dy="0.35em" font-size="11.5" font-weight="700" fill="#3A8235" text-anchor="start">App 5</text>
  <path d="M178,216 L338,160" fill="none" stroke="#C2354F" stroke-width="2" stroke-dasharray="6 5"/>
<rect x="344" y="146" width="110" height="30" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="399" y="161" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#7439B8" data-fit="94">Servidor 1</text>
  <path d="M178,244 L338,206" fill="none" stroke="#C2354F" stroke-width="2" stroke-dasharray="6 5"/>
<rect x="344" y="192" width="110" height="30" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="399" y="207" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#7439B8" data-fit="94">Servidor 2</text>
  <path d="M178,272 L338,252" fill="none" stroke="#C2354F" stroke-width="2" stroke-dasharray="6 5"/>
<rect x="344" y="238" width="110" height="30" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="399" y="253" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#7439B8" data-fit="94">Servidor 3</text>
  <path d="M178,300 L338,298" fill="none" stroke="#C2354F" stroke-width="2" stroke-dasharray="6 5"/>
<rect x="344" y="284" width="110" height="30" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="399" y="299" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#7439B8" data-fit="94">Servidor 4</text>
  <path d="M178,328 L338,344" fill="none" stroke="#C2354F" stroke-width="2" stroke-dasharray="6 5"/>
<rect x="344" y="330" width="110" height="30" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="399" y="345" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#7439B8" data-fit="94">Servidor 5</text>
  <rect x="68" y="359" width="160" height="22" rx="11" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.25"/><text x="148" y="370" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#C2354F">5 conexiones · batería</text>
  <text x="500" y="124" dy="0.35em" font-size="15" font-weight="700" fill="#3A8235" text-anchor="start">Con FCM</text>
  <rect x="500" y="140" width="150" height="220" rx="20" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/>
  <rect x="553" y="148" width="44" height="6" rx="3" fill="#2A3040"/>
  <text x="516" y="174" dy="0.35em" font-size="13" font-weight="700" fill="#556074" text-anchor="start" data-fit="122">Teléfono</text>
  <path d="M502,190 H648" stroke="#D9DEE8" stroke-width="1.25"/>
  <rect x="520" y="206" width="110" height="20" rx="6" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>  <text x="530" y="216" dy="0.35em" font-size="11.5" font-weight="700" fill="#3A8235" text-anchor="start">App 1</text>
  <rect x="520" y="234" width="110" height="20" rx="6" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>  <text x="530" y="244" dy="0.35em" font-size="11.5" font-weight="700" fill="#3A8235" text-anchor="start">App 2</text>
  <rect x="520" y="262" width="110" height="20" rx="6" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>  <text x="530" y="272" dy="0.35em" font-size="11.5" font-weight="700" fill="#3A8235" text-anchor="start">App 3</text>
  <rect x="520" y="290" width="110" height="20" rx="6" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>  <text x="530" y="300" dy="0.35em" font-size="11.5" font-weight="700" fill="#3A8235" text-anchor="start">App 4</text>
  <rect x="520" y="318" width="110" height="20" rx="6" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>  <text x="530" y="328" dy="0.35em" font-size="11.5" font-weight="700" fill="#3A8235" text-anchor="start">App 5</text>
  <path d="M650,276 L730,276" fill="none" stroke="#A96C05" stroke-width="2"/>
<rect x="736" y="236" width="110" height="80" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="791" y="267" dy="0.35em" text-anchor="middle" font-size="15" font-weight="700" fill="#A96C05" data-fit="94">FCM</text><text x="791" y="286" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="94">Google</text>
  <path d="M846,276 L872,175" fill="none" stroke="#7439B8" stroke-width="2" stroke-dasharray="6 5"/>
<rect x="872" y="146" width="40" height="30" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="892" y="161" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#7439B8" data-fit="24">S1</text>
  <path d="M846,276 L872,221" fill="none" stroke="#7439B8" stroke-width="2" stroke-dasharray="6 5"/>
<rect x="872" y="192" width="40" height="30" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="892" y="207" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#7439B8" data-fit="24">S2</text>
  <path d="M846,276 L872,267" fill="none" stroke="#7439B8" stroke-width="2" stroke-dasharray="6 5"/>
<rect x="872" y="238" width="40" height="30" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="892" y="253" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#7439B8" data-fit="24">S3</text>
  <path d="M846,276 L872,313" fill="none" stroke="#7439B8" stroke-width="2" stroke-dasharray="6 5"/>
<rect x="872" y="284" width="40" height="30" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="892" y="299" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#7439B8" data-fit="24">S4</text>
  <path d="M846,276 L872,359" fill="none" stroke="#7439B8" stroke-width="2" stroke-dasharray="6 5"/>
<rect x="872" y="330" width="40" height="30" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="892" y="345" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#7439B8" data-fit="24">S5</text>
  <rect x="520" y="359" width="160" height="22" rx="11" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/><text x="600" y="370" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#3A8235">1 conexión del sistema</text>
</svg>
```

Si cada app mantuviera abierta su propia conexión con su servidor, la batería se acabaría en pocas horas. Por eso el sistema operativo mantiene **una sola** conexión con un intermediario, y por ella llegan los avisos de todas las apps. En Android ese intermediario es **FCM** (Firebase Cloud Messaging), de Google.

## El viaje de una notificación

```svg
<svg id="pnViaje" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 360" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="pnViaje-ttl pnViaje-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="pnViaje-ttl">El viaje de una notificación</title>
  <desc id="pnViaje-dsc">Tres columnas: la app en el teléfono, FCM y tu backend. Paso 1: la app se suscribe al topic general en FCM. Paso 2: algo pasa y el backend le pide a FCM enviar un mensaje al topic general. Paso 3: FCM se lo entrega a cada teléfono suscrito. Paso 4: el sistema operativo muestra la notificación, aunque la app esté cerrada.</desc>
  <defs>
    <style>
      #pnViaje .title{fill:#161A26;font-size:22px;font-weight:700}
      #pnViaje .sub{fill:#79809A;font-size:13.5px}
      #pnViaje .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #pnViaje .foot{fill:#79809A;font-size:12px}
      #pnViaje .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #pnViaje .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #pnViaje .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#pnViaje-arrow)}
    </style>
    <marker id="pnViaje-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="360" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">El viaje de una notificación</text>
  <text class="sub" x="48" y="80" data-fit="860">La app solo se suscribe. Quien envía es el backend, y FCM se encarga de llegar al teléfono.</text>
<rect x="48" y="150" width="170" height="100" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="133" y="191" dy="0.35em" text-anchor="middle" font-size="16" font-weight="700" fill="#3A8235" data-fit="154">App</text><text x="133" y="210" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="154">teléfono del usuario</text>
<rect x="395" y="150" width="170" height="100" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="480" y="191" dy="0.35em" text-anchor="middle" font-size="16" font-weight="700" fill="#A96C05" data-fit="154">FCM</text><text x="480" y="210" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="154">Firebase</text>
<rect x="742" y="150" width="170" height="100" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="827" y="191" dy="0.35em" text-anchor="middle" font-size="16" font-weight="700" fill="#7439B8" data-fit="154">Backend</text><text x="827" y="210" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="154">tu servidor</text>
  <path class="link" d="M222,172 H389"/>
  <text x="305" y="158" dy="0.35em" font-size="11.5" font-weight="700" fill="#454C61" text-anchor="middle">1 · suscribirse a «general»</text>
  <path class="link" d="M738,200 H571"/>
  <text x="655" y="186" dy="0.35em" font-size="11.5" font-weight="700" fill="#454C61" text-anchor="middle">2 · enviar a «general»</text>
  <path class="link" d="M391,228 H224"/>
  <text x="305" y="244" dy="0.35em" font-size="11.5" font-weight="700" fill="#454C61" text-anchor="middle">3 · entregar</text>
<g transform="translate(48,268)"><rect width="220" height="60" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#3A8235" data-fit="192">4 · El sistema la muestra</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="192">aunque la app esté cerrada</text></g>
<g transform="translate(395,268)"><rect width="517" height="60" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#556074" data-fit="489">Topic o token</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="489">Un topic llega a todos los suscritos. Un token llega a un solo teléfono.</text></g>
</svg>
```

La app nunca envía notificaciones: solo le dice a FCM qué quiere recibir. En el curso lo hace suscribiéndose a un **topic**, un canal con nombre, como `general`. Cuando pasa algo, tu **backend** le pide a FCM que envíe un mensaje a ese topic, y FCM lo entrega a cada teléfono suscrito.

Las lecciones siguientes recorren ese camino en Android: conectar la app con Firebase, generar la llave del backend, recibir en Flutter y enviar desde el backend. En iPhone el intermediario de Apple se llama APNs, y FCM lo usa por dentro: está al final de *Recibir notificaciones en Flutter*.
