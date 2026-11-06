# Programación reactiva y Streams

<!-- tags: Stream, listen, StreamSubscription, cancel(), Future vs Stream, map de un Stream,
     programación reactiva, onError, onDone, StreamController, asyncMap,
     Bad state: Stream has already been listened to -->

Hasta ahora la app **pregunta**: hace un `select`, espera con `await` y recibe una respuesta. Si después la tabla cambia, la app no se entera hasta que vuelve a preguntar. En un chat eso no sirve: el mensaje de la otra persona tiene que aparecer solo, sin tocar nada.

La programación reactiva le da la vuelta. La app **se suscribe** una vez a un flujo de datos y **reacciona** cada vez que llega algo. En Dart, ese flujo es un `Stream`.

## Preguntar o suscribirse

```svg
<svg id="rtFutureStream" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 430" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="rtFutureStream-ttl rtFutureStream-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="rtFutureStream-ttl">Un Future entrega una vez. Un Stream entrega muchas veces.</title>
  <desc id="rtFutureStream-dsc">Dos líneas de tiempo. Arriba, un Future de tipo int: entrega un solo valor, 42, y con eso termina. Abajo, un Stream de tipo int: entrega 1, 2 y 3, luego un error, luego 4, y al final se cierra. Debajo de cada evento del Stream se lee qué función de listen lo recibe: onData, onError u onDone.</desc>
  <defs>
    <style>
      #rtFutureStream .title{fill:#161A26;font-size:22px;font-weight:700}
      #rtFutureStream .sub{fill:#79809A;font-size:13.5px}
      #rtFutureStream .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #rtFutureStream .foot{fill:#79809A;font-size:12px}
      #rtFutureStream .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #rtFutureStream .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #rtFutureStream .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#rtFutureStream-arrow)}
      #rtFutureStream .ar-teal{fill:none;stroke:#0F8478;stroke-width:1.75;marker-end:url(#rtFutureStream-ar-teal)}
    </style>
    <marker id="rtFutureStream-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="rtFutureStream-ar-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#0F8478"/></marker>
  </defs>
  <rect width="960" height="430" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Un Future entrega una vez. Un Stream entrega muchas veces.</text>
  <text class="sub" x="48" y="80" data-fit="860">El tiempo corre hacia la derecha. Cada círculo es un valor que llega a quien está escuchando.</text>
  <text class="mono" x="48" y="176" dy="0.35em" text-anchor="start" font-size="15" font-weight="700" fill="#A96C05">Future&lt;int&gt;</text>
  <text x="48" y="198" dy="0.35em" text-anchor="start" font-size="12" font-weight="400" fill="#79809A">await · un valor</text>
  <path class="link" d="M236,176 H900"/>
  <circle cx="470" cy="176" r="17" fill="#FFF3DC" stroke="#A96C05" stroke-width="2"/><text class="mono" x="470" y="176" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#A96C05">42</text>
  <path d="M500,154 V198" stroke="#556074" stroke-width="4" stroke-linecap="round"/>
  <text x="485" y="216" dy="0.35em" text-anchor="middle" font-size="12" font-weight="400" fill="#A96C05">llega y termina</text>
  <text class="mono" x="48" y="316" dy="0.35em" text-anchor="start" font-size="15" font-weight="700" fill="#0F8478">Stream&lt;int&gt;</text>
  <text x="48" y="338" dy="0.35em" text-anchor="start" font-size="12" font-weight="400" fill="#79809A">listen · muchos valores</text>
  <path class="link" d="M236,316 H900"/>
  <circle cx="300" cy="316" r="17" fill="#EEF1FF" stroke="#4453C9" stroke-width="2"/><text class="mono" x="300" y="316" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#4453C9">1</text>
  <text class="mono" x="300" y="356" dy="0.35em" text-anchor="middle" font-size="12" font-weight="400" fill="#4453C9">onData</text>
  <circle cx="400" cy="316" r="17" fill="#EEF1FF" stroke="#4453C9" stroke-width="2"/><text class="mono" x="400" y="316" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#4453C9">2</text>
  <text class="mono" x="400" y="356" dy="0.35em" text-anchor="middle" font-size="12" font-weight="400" fill="#4453C9">onData</text>
  <circle cx="500" cy="316" r="17" fill="#EEF1FF" stroke="#4453C9" stroke-width="2"/><text class="mono" x="500" y="316" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#4453C9">3</text>
  <text class="mono" x="500" y="356" dy="0.35em" text-anchor="middle" font-size="12" font-weight="400" fill="#4453C9">onData</text>
  <circle cx="720" cy="316" r="17" fill="#EEF1FF" stroke="#4453C9" stroke-width="2"/><text class="mono" x="720" y="316" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#4453C9">4</text>
  <text class="mono" x="720" y="356" dy="0.35em" text-anchor="middle" font-size="12" font-weight="400" fill="#4453C9">onData</text>
  <path d="M597,303 L623,329 M623,303 L597,329" stroke="#C2354F" stroke-width="3.5" stroke-linecap="round"/>
  <text class="mono" x="610" y="356" dy="0.35em" text-anchor="middle" font-size="12" font-weight="400" fill="#C2354F">onError</text>
  <path d="M830,294 V338" stroke="#556074" stroke-width="4" stroke-linecap="round"/>
  <text class="mono" x="830" y="356" dy="0.35em" text-anchor="middle" font-size="12" font-weight="400" fill="#556074">onDone</text>
  <rect x="236" y="376" width="16" height="16" rx="4" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/><text x="260" y="384" dy="0.35em" font-size="12.5" fill="#454C61">un valor</text>
  <rect x="356" y="376" width="16" height="16" rx="4" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.25"/><text x="380" y="384" dy="0.35em" font-size="12.5" fill="#454C61">un error</text>
  <rect x="476" y="376" width="16" height="16" rx="4" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.25"/><text x="500" y="384" dy="0.35em" font-size="12.5" fill="#454C61">se cerró: no llega nada más</text>
  <text class="foot" x="48" y="408" data-fit="860">Un error no cierra el stream: después del error todavía llegó el 4.</text>
</svg>
```

Un `Future` es una caja que se llena **una sola vez**, con un valor o con un error. Un `Stream` es una tubería por la que pueden llegar **muchos** valores, separados en el tiempo, hasta que el productor la cierra.

Lo que pasa en un Stream es de tres tipos: un **valor**, un **error** o el **cierre**. Un error no cierra el Stream: después pueden seguir llegando valores.

## Escuchar un Stream

```svg
<svg id="rtListen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="rtListen-ttl rtListen-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="rtListen-ttl">Las partes de listen</title>
  <desc id="rtListen-dsc">Código a la izquierda: final subscription igual a numbers.listen, con una función para cada valor, onError para los errores y onDone para el cierre; abajo, await subscription.cancel. A la derecha, la consola: llegó 1, llegó 2, falló Exception sin red, llegó 3 y se cerró. Una flecha une cada función con las líneas que imprime.</desc>
  <defs>
    <style>
      #rtListen .title{fill:#161A26;font-size:22px;font-weight:700}
      #rtListen .sub{fill:#79809A;font-size:13.5px}
      #rtListen .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #rtListen .cl{font-size:13px;fill:#C9CFDA}
      #rtListen .s{fill:#A8D8A0} #rtListen .n{fill:#F2B880} #rtListen .c{fill:#7FD1E8}
      #rtListen .p{fill:#D5B8F5} #rtListen .k{fill:#F08FB0}
      #rtListen .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #rtListen .ct{fill:#161A26;font-size:14px;font-weight:700}
      #rtListen .cb{fill:#454C61;font-size:13px}
      #rtListen .rt{fill:#161A26;font-size:14px} #rtListen .rs{fill:#79809A;font-size:12px}
      #rtListen .foot{fill:#79809A;font-size:12px}
      #rtListen .hl-amber{fill:#F2C069;fill-opacity:.16;stroke:#F2C069;stroke-width:1.5}
      #rtListen .ld-amber{fill:none;stroke:#F2C069;stroke-width:1.5;stroke-dasharray:3 4}
      #rtListen .ar-amber{fill:none;stroke:#A96C05;stroke-width:1.75;marker-end:url(#rtListen-ar-amber)}
      #rtListen .hl-indigo{fill:#A9B4F2;fill-opacity:.16;stroke:#A9B4F2;stroke-width:1.5}
      #rtListen .ld-indigo{fill:none;stroke:#A9B4F2;stroke-width:1.5;stroke-dasharray:3 4}
      #rtListen .ar-indigo{fill:none;stroke:#4453C9;stroke-width:1.75;marker-end:url(#rtListen-ar-indigo)}
      #rtListen .hl-rose{fill:#F3A3B2;fill-opacity:.16;stroke:#F3A3B2;stroke-width:1.5}
      #rtListen .ld-rose{fill:none;stroke:#F3A3B2;stroke-width:1.5;stroke-dasharray:3 4}
      #rtListen .ar-rose{fill:none;stroke:#C2354F;stroke-width:1.75;marker-end:url(#rtListen-ar-rose)}
      #rtListen .hl-teal{fill:#86D3CA;fill-opacity:.16;stroke:#86D3CA;stroke-width:1.5}
      #rtListen .ld-teal{fill:none;stroke:#86D3CA;stroke-width:1.5;stroke-dasharray:3 4}
      #rtListen .ar-teal{fill:none;stroke:#0F8478;stroke-width:1.75;marker-end:url(#rtListen-ar-teal)}
    </style>
    <marker id="rtListen-ar-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#A96C05"/></marker>
    <marker id="rtListen-ar-indigo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#4453C9"/></marker>
    <marker id="rtListen-ar-rose" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#C2354F"/></marker>
    <marker id="rtListen-ar-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#0F8478"/></marker>
  </defs>
  <rect width="960" height="540" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Las partes de <tspan class="mono">listen</tspan></text>
  <text class="sub" x="48" y="80" data-fit="860">listen recibe una función por tipo de evento y devuelve la suscripción, que es lo que se cancela.</text>
  <rect x="48" y="112" width="456" height="270" rx="12" fill="#1F2430"/>
  <path d="M48,124 A12,12 0 0 1 60,112 H492 A12,12 0 0 1 504,124 V144 H48 Z" fill="#2A3040"/>
  <circle cx="68" cy="128" r="5" fill="#F14C4C"/><circle cx="84" cy="128" r="5" fill="#E5C07B"/><circle cx="100" cy="128" r="5" fill="#6BCB77"/>
  <text class="mono" x="276" y="128" dy="0.35em" text-anchor="middle" fill="#9AA3B5" font-size="12" data-fit="316">main.dart</text>
  <rect x="552" y="112" width="360" height="270" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="568" y="128" dy="0.35em" data-fit="328">CONSOLA</text>
  <path d="M552,144 H912" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect class="hl-indigo" x="79.6" y="180" width="62.6" height="22" rx="5"/>
  <rect class="hl-rose" x="79.6" y="204" width="62.6" height="22" rx="5"/>
  <rect class="hl-teal" x="79.6" y="228" width="54.8" height="22" rx="5"/>
  <rect class="hl-amber" x="212.2" y="300" width="70.4" height="22" rx="5"/>
  <text class="cl mono" font-size="13" x="68.0" y="172" textLength="280.8" lengthAdjust="spacingAndGlyphs" data-fit="432"><tspan class="k">final</tspan> subscription = numbers.listen(</text>
  <text class="cl mono" font-size="13" x="83.6" y="196" textLength="257.4" lengthAdjust="spacingAndGlyphs" data-fit="432">(value) =&gt; print(<tspan class="s">'llegó $value'</tspan>),</text>
  <text class="cl mono" font-size="13" x="83.6" y="220" textLength="265.2" lengthAdjust="spacingAndGlyphs" data-fit="432"><tspan class="p">onError</tspan>: (e) =&gt; print(<tspan class="s">'falló $e'</tspan>),</text>
  <text class="cl mono" font-size="13" x="83.6" y="244" textLength="249.6" lengthAdjust="spacingAndGlyphs" data-fit="432"><tspan class="p">onDone</tspan>: () =&gt; print(<tspan class="s">'se cerró'</tspan>),</text>
  <text class="cl mono" font-size="13" x="68.0" y="268" textLength="15.6" lengthAdjust="spacingAndGlyphs" data-fit="432">);</text>
  <text class="cl mono" font-size="13" x="68.0" y="316" textLength="218.4" lengthAdjust="spacingAndGlyphs" data-fit="432">await subscription.cancel();</text>
  <g transform="translate(552,144)">
<text class="mono" x="28" y="34" dy="0.35em" font-size="13" fill="#4453C9">llegó 1</text><text class="mono" x="28" y="60" dy="0.35em" font-size="13" fill="#4453C9">llegó 2</text><text class="mono" x="28" y="86" dy="0.35em" font-size="13" fill="#C2354F">falló Exception: sin red</text><text class="mono" x="28" y="112" dy="0.35em" font-size="13" fill="#4453C9">llegó 3</text><text class="mono" x="28" y="138" dy="0.35em" font-size="13" fill="#556074">se cerró</text><path d="M16,172 H344" stroke="#E4E7EE" stroke-width="1.25"/><text x="28" y="198" dy="0.35em" font-size="12.5" fill="#79809A">después de cancel(), lo que se emita</text><text x="28" y="216" dy="0.35em" font-size="12.5" fill="#79809A">ya no llega a esta suscripción</text>
  </g>
  <path class="ld-indigo" d="M347.0,191 H504"/>
  <path class="ar-indigo" d="M504,191 H514 V178 H572"/>
  <path class="ld-rose" d="M354.8,215 H504"/>
  <path class="ar-rose" d="M504,215 H523 V230 H572"/>
  <path class="ld-teal" d="M339.2,239 H504"/>
  <path class="ar-teal" d="M504,239 H532 V282 H572"/>
  <path class="ld-amber" d="M292.4,311 H504"/>
  <path class="ar-amber" d="M504,311 H541 V342 H572"/>
  <g transform="translate(48.0,406)">
    <rect width="204.0" height="102" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
    <circle cx="24" cy="26" r="7" fill="#EEF1FF" stroke="#4453C9" stroke-width="2"/>
    <text class="ct mono" x="42" y="26" dy="0.35em" data-fit="146">(value) =&gt; …</text>
    <text class="cb" x="16" y="60" data-fit="172">Corre una vez</text>
    <text class="cb" x="16" y="79" data-fit="172">por cada valor.</text>
  </g>
  <g transform="translate(268.0,406)">
    <rect width="204.0" height="102" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
    <circle cx="24" cy="26" r="7" fill="#FFEBEF" stroke="#C2354F" stroke-width="2"/>
    <text class="ct mono" x="42" y="26" dy="0.35em" data-fit="146">onError</text>
    <text class="cb" x="16" y="60" data-fit="172">Un error no</text>
    <text class="cb" x="16" y="79" data-fit="172">cierra el stream.</text>
  </g>
  <g transform="translate(488.0,406)">
    <rect width="204.0" height="102" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
    <circle cx="24" cy="26" r="7" fill="#E3F6F3" stroke="#0F8478" stroke-width="2"/>
    <text class="ct mono" x="42" y="26" dy="0.35em" data-fit="146">onDone</text>
    <text class="cb" x="16" y="60" data-fit="172">Corre cuando el</text>
    <text class="cb" x="16" y="79" data-fit="172">productor cierra.</text>
  </g>
  <g transform="translate(708.0,406)">
    <rect width="204.0" height="102" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
    <circle cx="24" cy="26" r="7" fill="#FFF3DC" stroke="#A96C05" stroke-width="2"/>
    <text class="ct mono" x="42" y="26" dy="0.35em" data-fit="146">cancel()</text>
    <text class="cb" x="16" y="60" data-fit="172">Deja de escuchar.</text>
    <text class="cb" x="16" y="79" data-fit="172">Lo llama el oyente.</text>
  </g>
</svg>
```

`listen` recibe una función para cada tipo de evento y devuelve una `StreamSubscription`. Esa suscripción es lo que hay que guardar, porque es lo único que permite dejar de escuchar con `cancel()`. Si nadie la cancela, la función sigue corriendo cada vez que llega algo, aunque la pantalla ya no exista.

```dart
final controller = StreamController<int>();

final subscription = controller.stream.listen(
  (value) => print('llegó $value'),
  onError: (e) => print('falló $e'),
  onDone: () => print('se cerró'),
);

controller.add(1);
controller.add(2);
await subscription.cancel();
```

`StreamController` es la forma más simple de fabricar un Stream a mano: lo que se le pasa con `add` sale por `controller.stream`. En el chat no lo vas a usar, porque el Stream lo fabrica Supabase.

## Transformar con map

```svg
<svg id="rtMap" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 420" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="rtMap-ttl rtMap-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="rtMap-ttl">map transforma cada valor y devuelve otro Stream</title>
  <desc id="rtMap-dsc">Arriba, un Stream que emite 1, 2 y 3. En el medio, una caja con el código map de x a x por 10. Abajo, el Stream que devuelve map: emite 10, 20 y 30, en los mismos instantes que el de arriba. Una flecha baja de cada valor de arriba a su valor transformado.</desc>
  <defs>
    <style>
      #rtMap .title{fill:#161A26;font-size:22px;font-weight:700}
      #rtMap .sub{fill:#79809A;font-size:13.5px}
      #rtMap .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #rtMap .foot{fill:#79809A;font-size:12px}
      #rtMap .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #rtMap .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #rtMap .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#rtMap-arrow)}
      #rtMap .ar-teal{fill:none;stroke:#0F8478;stroke-width:1.75;marker-end:url(#rtMap-ar-teal)}
    </style>
    <marker id="rtMap-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="rtMap-ar-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#0F8478"/></marker>
  </defs>
  <rect width="960" height="420" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56"><tspan class="mono">map</tspan> transforma cada valor y devuelve otro Stream</text>
  <text class="sub" x="48" y="80" data-fit="860">El stream de arriba sigue emitiendo igual. El de abajo emite lo mismo, pero ya transformado.</text>
  <text class="mono" x="48" y="150" dy="0.35em" text-anchor="start" font-size="15" font-weight="700" fill="#4453C9">numbers</text>
  <path class="link" d="M236,150 H900"/>
  <rect x="236" y="214" width="664" height="52" rx="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.75"/>
  <text class="mono" x="568" y="240" dy="0.35em" text-anchor="middle" font-size="15" font-weight="700" fill="#0F8478">numbers.map((x) =&gt; x * 10)</text>
  <text x="48" y="240" dy="0.35em" text-anchor="start" font-size="12.5" font-weight="400" fill="#79809A">el operador</text>
  <text class="mono" x="48" y="330" dy="0.35em" text-anchor="start" font-size="15" font-weight="700" fill="#0F8478">tens</text>
  <path class="link" d="M236,330 H900"/>
  <circle cx="340" cy="150" r="17" fill="#EEF1FF" stroke="#4453C9" stroke-width="2"/><text class="mono" x="340" y="150" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#4453C9">1</text>
  <path class="ar-teal" d="M340,170 V208"/>
  <path class="ar-teal" d="M340,272 V306"/>
  <circle cx="340" cy="330" r="19" fill="#E3F6F3" stroke="#0F8478" stroke-width="2"/><text class="mono" x="340" y="330" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#0F8478">10</text>
  <circle cx="520" cy="150" r="17" fill="#EEF1FF" stroke="#4453C9" stroke-width="2"/><text class="mono" x="520" y="150" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#4453C9">2</text>
  <path class="ar-teal" d="M520,170 V208"/>
  <path class="ar-teal" d="M520,272 V306"/>
  <circle cx="520" cy="330" r="19" fill="#E3F6F3" stroke="#0F8478" stroke-width="2"/><text class="mono" x="520" y="330" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#0F8478">20</text>
  <circle cx="720" cy="150" r="17" fill="#EEF1FF" stroke="#4453C9" stroke-width="2"/><text class="mono" x="720" y="150" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#4453C9">3</text>
  <path class="ar-teal" d="M720,170 V208"/>
  <path class="ar-teal" d="M720,272 V306"/>
  <circle cx="720" cy="330" r="19" fill="#E3F6F3" stroke="#0F8478" stroke-width="2"/><text class="mono" x="720" y="330" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#0F8478">30</text>
  <text class="foot" x="48" y="392" data-fit="860">En el chat, cada valor es la lista de filas de la tabla, y map la convierte en una lista de Message.</text>
</svg>
```

`map` no escucha nada: devuelve **otro Stream** que emite cada valor ya transformado. Por eso se puede encadenar en una capa y retornar, sin que esa capa tenga que suscribirse.

Si la transformación necesita esperar algo, como pedir la URL firmada de una foto, se usa `asyncMap`. Recibe una función que devuelve un `Future`, y emite el resultado cuando ese `Future` termina.

```dart
Stream<List<Message>> withImages(Stream<List<Message>> messages) {
  return messages.asyncMap((list) => Future.wait(list.map(_withImage)));
}
```

## Pruébalo

```interactive
stream-pipe
```

Agrega dos valores, un error y otro valor: el error no corta nada. Luego cierra y vuelve a agregar: `add` después de `close` lanza un error. Reinicia, cancela la suscripción y agrega: el valor sale del productor, pero nadie lo recibe. Prueba también `map` y el modo `Future`, que solo se completa una vez.

## Un solo oyente

Un Stream normal acepta **un solo** `listen`. El segundo falla con `Bad state: Stream has already been listened to`. Y aunque el Stream permitiera varios oyentes, cada uno sería una suscripción más que alguien tiene que cancelar.

Por eso en el curso la regla es fija: **a lo largo de las capas el Stream se retorna, y solo el Bloc hace `listen`**. La siguiente lección muestra cómo se ve eso en el chat.
