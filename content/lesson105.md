# Entendiendo BlocProvider y BlocBuilder

<!-- tags: BlocProvider, BlocBuilder, context.read, alcance del Bloc en el árbol, Could not find the correct Provider,
     qué se redibuja con cada estado, ProviderNotFoundException, create y child, builder y state, buildWhen -->

En las lecciones anteriores `BlocProvider` y `BlocBuilder` aparecieron siempre juntos y ya escritos. Aquí se miran por separado y despacio: qué hace cada uno, qué significa cada parámetro y dónde tiene que ir en el árbol de widgets. Todos los ejemplos usan el catálogo de productos: `ProductsBloc`, `LoadProductsEvent` y los estados `ProductsLoadingState`, `ProductsLoadedState` y `ProductsErrorState`.

## BlocProvider: dónde vive el Bloc

Un `Bloc` es un objeto de Dart, no un widget. Alguien tiene que crearlo, guardarlo mientras la pantalla esté abierta y entregárselo a los widgets que lo necesitan. Ese alguien es `BlocProvider`.

```svg
<svg id="bpArbol" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 616" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="bpArbol-ttl bpArbol-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="bpArbol-ttl">El Bloc cuelga del árbol de widgets</title>
  <desc id="bpArbol-dsc">Árbol de widgets: MaterialApp, debajo BlocProvider, que guarda un ProductsBloc, y debajo ProductsScreen, Scaffold, AppBar, BlocBuilder con su ListView y un FloatingActionButton. Una zona resaltada marca que todos los widgets que están debajo del BlocProvider pueden alcanzar el Bloc, y que MaterialApp, que está arriba, no.</desc>
  <defs>
    <style>
      #bpArbol .title{fill:#161A26;font-size:22px;font-weight:700}
      #bpArbol .sub{fill:#79809A;font-size:13.5px}
      #bpArbol .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #bpArbol .foot{fill:#79809A;font-size:12px}
      #bpArbol .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #bpArbol .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #bpArbol .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#bpArbol-arrow)}
    </style>
    <marker id="bpArbol-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="616" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">El <tspan class="mono">Bloc</tspan> cuelga del árbol de widgets</text>
  <text class="sub" x="48" y="80" data-fit="860">BlocProvider es un widget más del árbol. Guarda el Bloc y lo deja al alcance de todo lo que tiene debajo.</text>
  <rect x="48" y="264" width="544" height="296" rx="14" fill="#E8F6E3" fill-opacity=".55" stroke="#9FD68D" stroke-width="1.5" stroke-dasharray="6 5"/>
  <text class="h" x="576" y="288" text-anchor="end" fill="#3A8235" style="fill:#3A8235" data-fit="230">AQUÍ SE ALCANZA EL BLOC</text>
  <path class="tree" d="M192,152 V184 M192,232 V304 M192,344 V376 M192,416 V432 M128,448 V432 H472 V448 M276,432 V448 M276,488 V512"/>
  <path d="M312,208 H392" stroke="#4453C9" stroke-width="1.75" stroke-dasharray="4 4" fill="none"/>
  <text x="352" y="198" text-anchor="middle" font-size="12" font-weight="600" fill="#4453C9">guarda</text>
  <rect x="72" y="112" width="240" height="40" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="192" y="132" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="224">MaterialApp</text>
  <rect x="72" y="184" width="240" height="48" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="2.5"/><text class="mono" x="192" y="208" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="224">BlocProvider</text>
  <rect x="392" y="184" width="184" height="48" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="484" y="208" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#4453C9" data-fit="168">ProductsBloc</text>
  <rect x="72" y="304" width="240" height="40" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="192" y="324" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="224">ProductsScreen</text>
  <rect x="72" y="376" width="240" height="40" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="192" y="396" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="224">Scaffold</text>
  <rect x="72" y="448" width="112" height="40" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="128" y="468" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="96">AppBar</text>
  <rect x="200" y="448" width="152" height="40" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="276" y="468" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#7439B8" data-fit="136">BlocBuilder</text>
  <rect x="368" y="448" width="208" height="40" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="472" y="468" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#0F8478" data-fit="192">FloatingActionButton</text>
  <rect x="200" y="512" width="152" height="36" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="276" y="530" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="136">ListView</text>
  <g transform="translate(624,112)"><rect width="288" height="77" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#556074" data-fit="260">Arriba del provider</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="260">MaterialApp no puede pedir el Bloc:</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="260">está por encima de quien lo guarda.</text></g>
  <g transform="translate(624,200)"><rect width="288" height="77" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#4453C9" data-fit="260">Una sola instancia</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="260">BlocProvider crea el Bloc una vez y lo</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="260">conserva mientras siga en el árbol.</text></g>
  <g transform="translate(624,304)"><rect width="288" height="94" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#3A8235" data-fit="260">Debajo del provider</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="260">Cualquier descendiente lo alcanza,</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="260">sin importar cuántos niveles haya</text><text x="14" y="77" font-size="12.5" fill="#454C61" data-fit="260">en medio. Nadie lo pasa por constructor.</text></g>
  <g transform="translate(624,432)"><rect width="288" height="94" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#7439B8" data-fit="260">Quién lo usa aquí</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="260">BlocBuilder lo escucha para dibujar</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="260">la lista. El botón lo usa para</text><text x="14" y="77" font-size="12.5" fill="#454C61" data-fit="260">lanzar un evento.</text></g>
  <text class="foot" x="48" y="588" data-fit="860">El Bloc no es un widget y no se dibuja: BlocProvider es el widget que lo sostiene dentro del árbol.</text>
</svg>
```

- `BlocProvider` **sí** es un widget, y por eso ocupa un lugar en el árbol. No dibuja nada: su trabajo es sostener el `Bloc`.
- Todo widget que quede **debajo** de él puede pedir el `Bloc`, esté a un nivel o a diez. Nadie tiene que pasarlo por constructor de widget en widget.
- Lo que está **arriba** o **al lado** no lo ve.

## Las partes de un BlocProvider

```svg
<svg id="bpAnatomia" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 585" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="bpAnatomia-ttl bpAnatomia-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="bpAnatomia-ttl">Las partes de un BlocProvider</title>
  <desc id="bpAnatomia-dsc">Un BlocProvider de ProductsBloc anotado: create construye el ProductsBloc, con ProductState como estado inicial, y el provider lo guarda; child es ProductsScreen, la parte del árbol que queda con el Bloc a su alcance.</desc>
  <defs>
    <style>
      #bpAnatomia .title{fill:#161A26;font-size:22px;font-weight:700}
      #bpAnatomia .sub{fill:#79809A;font-size:13.5px}
      #bpAnatomia .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #bpAnatomia .cl{font-size:13px;fill:#C9CFDA}
      #bpAnatomia .s{fill:#A8D8A0} #bpAnatomia .n{fill:#F2B880} #bpAnatomia .c{fill:#7FD1E8}
      #bpAnatomia .p{fill:#D5B8F5} #bpAnatomia .k{fill:#F08FB0}
      #bpAnatomia .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #bpAnatomia .ct{fill:#161A26;font-size:14px;font-weight:700}
      #bpAnatomia .cb{fill:#454C61;font-size:13px}
      #bpAnatomia .rt{fill:#161A26;font-size:14px} #bpAnatomia .rs{fill:#79809A;font-size:12px}
      #bpAnatomia .foot{fill:#79809A;font-size:12px}
      #bpAnatomia .hl-amber{fill:#F2C069;fill-opacity:.16;stroke:#F2C069;stroke-width:1.5}
      #bpAnatomia .ld-amber{fill:none;stroke:#F2C069;stroke-width:1.5;stroke-dasharray:3 4}
      #bpAnatomia .ar-amber{fill:none;stroke:#A96C05;stroke-width:1.75;marker-end:url(#bpAnatomia-ar-amber)}
      #bpAnatomia .hl-indigo{fill:#A9B4F2;fill-opacity:.16;stroke:#A9B4F2;stroke-width:1.5}
      #bpAnatomia .ld-indigo{fill:none;stroke:#A9B4F2;stroke-width:1.5;stroke-dasharray:3 4}
      #bpAnatomia .ar-indigo{fill:none;stroke:#4453C9;stroke-width:1.75;marker-end:url(#bpAnatomia-ar-indigo)}
      #bpAnatomia .hl-violet{fill:#C9A6EE;fill-opacity:.16;stroke:#C9A6EE;stroke-width:1.5}
      #bpAnatomia .ld-violet{fill:none;stroke:#C9A6EE;stroke-width:1.5;stroke-dasharray:3 4}
      #bpAnatomia .ar-violet{fill:none;stroke:#7439B8;stroke-width:1.75;marker-end:url(#bpAnatomia-ar-violet)}
    </style>
    <marker id="bpAnatomia-ar-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#A96C05"/></marker>
    <marker id="bpAnatomia-ar-indigo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#4453C9"/></marker>
    <marker id="bpAnatomia-ar-violet" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#7439B8"/></marker>
  </defs>
  <rect width="960" height="585" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Las partes de un <tspan class="mono">BlocProvider</tspan></text>
  <text class="sub" x="48" y="80" data-fit="860">Dos parámetros: create dice cómo se construye el Bloc y child dice quién lo va a poder usar.</text>
  <rect x="48" y="112" width="456" height="296" rx="12" fill="#1F2430"/>
  <path d="M48,124 A12,12 0 0 1 60,112 H492 A12,12 0 0 1 504,124 V144 H48 Z" fill="#2A3040"/>
  <circle cx="68" cy="128" r="5" fill="#F14C4C"/><circle cx="84" cy="128" r="5" fill="#E5C07B"/><circle cx="100" cy="128" r="5" fill="#6BCB77"/>
  <text class="mono" x="276" y="128" dy="0.35em" text-anchor="middle" fill="#9AA3B5" font-size="12" data-fit="316">lib/main.dart</text>
  <rect x="552" y="112" width="360" height="296" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="568" y="128" dy="0.35em" data-fit="328">LO QUE QUEDA ARMADO</text>
  <path d="M552,144 H912" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect class="hl-amber" x="64.0" y="156" width="210.8" height="22" rx="5"/>
  <rect class="hl-indigo" x="79.6" y="180" width="54.8" height="22" rx="5"/>
  <rect class="hl-violet" x="79.6" y="204" width="47.0" height="22" rx="5"/>
  <text class="cl mono" font-size="13" x="68.0" y="172" textLength="210.6" lengthAdjust="spacingAndGlyphs" data-fit="432"><tspan class="c">BlocProvider</tspan>&lt;<tspan class="c">ProductsBloc</tspan>&gt;(</text>
  <text class="cl mono" font-size="13" x="83.6" y="196" textLength="390.0" lengthAdjust="spacingAndGlyphs" data-fit="432"><tspan class="p">create</tspan>: (context) =&gt; <tspan class="c">ProductsBloc</tspan>(<tspan class="c">ProductState</tspan>()),</text>
  <text class="cl mono" font-size="13" x="83.6" y="220" textLength="234.0" lengthAdjust="spacingAndGlyphs" data-fit="432"><tspan class="p">child</tspan>: <tspan class="k">const</tspan> <tspan class="c">ProductsScreen</tspan>(),</text>
  <text class="cl mono" font-size="13" x="68.0" y="244" textLength="7.8" lengthAdjust="spacingAndGlyphs" data-fit="432">)</text>
  <g transform="translate(552,144)">
<rect x="40" y="20" width="296" height="224" rx="12" fill="#FFF3DC" fill-opacity=".6" stroke="#F0C572" stroke-width="2"/><text class="mono" x="56" y="42" dy="0.35em" font-size="13.5" font-weight="700" fill="#A96C05">BlocProvider</text><rect x="56" y="68" width="264" height="48" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="188" y="83" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#4453C9" data-fit="248">ProductsBloc</text><text x="188" y="102" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="248">la instancia que se guarda</text>
<text x="188" y="148" text-anchor="middle" font-size="12" font-weight="600" fill="#A96C05" data-fit="250">al alcance de todo lo que hay en child</text><path d="M188,156 V168" stroke="#A96C05" stroke-width="1.75" fill="none"/><path d="M182,164 L188,172 L194,164" stroke="#A96C05" stroke-width="1.75" fill="none"/><rect x="56" y="178" width="264" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="188" y="191" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#7439B8" data-fit="248">ProductsScreen</text><text x="188" y="210" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="248">y todos sus descendientes</text>

  </g>
  <path class="ld-amber" d="M284.6,167 H504"/>
  <path class="ar-amber" d="M504,167 H532 V184 H592"/>
  <path class="ld-indigo" d="M479.6,191 H504"/>
  <path class="ar-indigo" d="M504,191 H523 V236 H608"/>
  <path class="ld-violet" d="M323.6,215 H504"/>
  <path class="ar-violet" d="M504,215 H514 V344 H608"/>
  <g transform="translate(48.0,432)">
    <rect width="277.3" height="121" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
    <circle cx="24" cy="26" r="7" fill="#FFF3DC" stroke="#A96C05" stroke-width="2"/>
    <text class="ct mono" x="42" y="26" dy="0.35em" data-fit="219">BlocProvider&lt;T&gt;</text>
    <text class="cb" x="16" y="60" data-fit="245">El tipo entre &lt; &gt; es la etiqueta</text>
    <text class="cb" x="16" y="79" data-fit="245">con la que después se busca</text>
    <text class="cb" x="16" y="98" data-fit="245">el Bloc desde un widget.</text>
  </g>
  <g transform="translate(341.3,432)">
    <rect width="277.3" height="121" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
    <circle cx="24" cy="26" r="7" fill="#EEF1FF" stroke="#4453C9" stroke-width="2"/>
    <text class="ct mono" x="42" y="26" dy="0.35em" data-fit="219">create</text>
    <text class="cb" x="16" y="60" data-fit="245">Una función que construye el</text>
    <text class="cb" x="16" y="79" data-fit="245">Bloc con su estado inicial.</text>
    <text class="cb" x="16" y="98" data-fit="245">Se ejecuta una sola vez.</text>
  </g>
  <g transform="translate(634.7,432)">
    <rect width="277.3" height="121" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
    <circle cx="24" cy="26" r="7" fill="#F4EBFF" stroke="#7439B8" stroke-width="2"/>
    <text class="ct mono" x="42" y="26" dy="0.35em" data-fit="219">child</text>
    <text class="cb" x="16" y="60" data-fit="245">La pantalla que queda debajo.</text>
    <text class="cb" x="16" y="79" data-fit="245">Solo ella y sus hijos</text>
    <text class="cb" x="16" y="98" data-fit="245">ven el Bloc.</text>
  </g>
</svg>
```

```dart
BlocProvider<ProductsBloc>(
  create: (context) => ProductsBloc(ProductState()),
  child: const ProductsScreen(),
)
```

`ProductState()` es el estado inicial: con él arranca el `Bloc` antes de recibir cualquier evento.

En este curso el `BlocProvider` va en la tabla de rutas, envolviendo a la `Screen`:

```dart
@override
Widget build(BuildContext context) {
  return MaterialApp(
    title: 'FakeStore',
    theme: ThemeData(colorScheme: .fromSeed(seedColor: Colors.deepPurple)),
    initialRoute: '/products',
    routes: {
      '/products': (context) => BlocProvider<ProductsBloc>(
        create: (context) => ProductsBloc(ProductState()),
        child: const ProductsScreen(),
      ),
    },
  );
}
```

## La carga inicial: initState

```svg
<svg id="bpInitState" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 616" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="bpInitState-ttl bpInitState-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="bpInitState-ttl">El primer evento sale de initState</title>
  <desc id="bpInitState-dsc">Animación en cinco pasos del ciclo de vida de ProductsScreen. Uno: createState crea el State. Dos: initState corre una sola vez y lanza LoadProductsEvent al ProductsBloc con context.read y add. Tres: build dibuja la pantalla con el estado inicial. Cuatro: el Bloc emite un estado nuevo y BlocBuilder vuelve a ejecutar builder, ahora con los productos. Cinco: dispose, cuando la pantalla sale del árbol.</desc>
  <defs>
    <style>
      #bpInitState .title{fill:#161A26;font-size:22px;font-weight:700}
      #bpInitState .sub{fill:#79809A;font-size:13.5px}
      #bpInitState .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #bpInitState .foot{fill:#79809A;font-size:12px}
      #bpInitState .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #bpInitState .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #bpInitState .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#bpInitState-arrow)}
      #bpInitState .ar-teal{fill:none;stroke:#0F8478;stroke-width:1.75;marker-end:url(#bpInitState-ar-teal)}
      #bpInitState .ar-green{fill:none;stroke:#3A8235;stroke-width:1.75;marker-end:url(#bpInitState-ar-green)}
      #bpInitState .an{opacity:0;animation-duration:15s;animation-iteration-count:infinite;animation-timing-function:linear}
      #bpInitState .ls{animation:bpInitState-a4 15s linear infinite}
      #bpInitState .st{animation:bpInitState-hide 15s linear infinite}
      #bpInitState .a1{animation-name:bpInitState-a1}
      @keyframes bpInitState-a1{0%{opacity:0} 2%{opacity:1} 18%{opacity:1} 20%{opacity:0} 100%{opacity:0}}
      #bpInitState .a2{animation-name:bpInitState-a2}
      @keyframes bpInitState-a2{0%{opacity:0} 20%{opacity:0} 22%{opacity:1} 38%{opacity:1} 40%{opacity:0} 100%{opacity:0}}
      #bpInitState .a3{animation-name:bpInitState-a3}
      @keyframes bpInitState-a3{0%{opacity:0} 40%{opacity:0} 42%{opacity:1} 58%{opacity:1} 60%{opacity:0} 100%{opacity:0}}
      #bpInitState .a4{animation-name:bpInitState-a4}
      @keyframes bpInitState-a4{0%{opacity:0} 60%{opacity:0} 62%{opacity:1} 78%{opacity:1} 80%{opacity:0} 100%{opacity:0}}
      #bpInitState .a5{animation-name:bpInitState-a5}
      @keyframes bpInitState-a5{0%{opacity:0} 80%{opacity:0} 82%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #bpInitState .a34{animation-name:bpInitState-a34}
      @keyframes bpInitState-a34{0%{opacity:0} 40%{opacity:0} 42%{opacity:1} 78%{opacity:1} 80%{opacity:0} 100%{opacity:0}}
      #bpInitState .tk1{animation-name:bpInitState-tk1}
      #bpInitState .tk2{animation-name:bpInitState-tk2}
      @keyframes bpInitState-hide{from{opacity:0}to{opacity:0}}
      @keyframes bpInitState-tk1{0%,23%{opacity:0;transform:translate(0,0)}25%{opacity:1;transform:translate(0,0)}36%{opacity:1;transform:translate(304px,0)}38%,100%{opacity:0;transform:translate(304px,0)}}
      @keyframes bpInitState-tk2{0%,62%{opacity:0;transform:translate(0,0)}64%{opacity:1;transform:translate(0,0)}67%{opacity:1;transform:translate(0,52px)}76%{opacity:1;transform:translate(-424px,52px)}78%,100%{opacity:0;transform:translate(-424px,52px)}}
      @media (prefers-reduced-motion: reduce){#bpInitState .an,#bpInitState .ls,#bpInitState .st{animation:none}}
    </style>
    <marker id="bpInitState-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="bpInitState-ar-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#0F8478"/></marker>
    <marker id="bpInitState-ar-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#3A8235"/></marker>
  </defs>
  <rect width="960" height="616" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">El primer evento sale de <tspan class="mono">initState</tspan></text>
  <text class="sub" x="48" y="80" data-fit="860">El ciclo de vida de ProductsScreen, paso a paso: initState corre una sola vez y ahí se le pide al Bloc la carga inicial.</text>
  <text class="h" x="48" y="124" data-fit="288">CICLO DE VIDA DE PRODUCTSSCREEN</text>
  <path class="link" d="M212,204 V230"/><path class="link" d="M212,284 V310"/><path class="link" d="M212,364 V414"/>
  <text x="226" y="393" font-size="12" fill="#79809A" data-fit="200">mientras siga en el árbol</text>
  <rect x="88" y="152" width="248" height="52" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="212" y="169" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="232">createState()</text><text x="212" y="188" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="232">Flutter crea el State</text>
  <circle cx="60" cy="178" r="12" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="60" y="178" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#556074">1</text>
  <rect x="88" y="232" width="248" height="52" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="2.5"/><text class="mono" x="212" y="249" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#0F8478" data-fit="232">initState()</text><text x="212" y="268" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="232">una sola vez</text>
  <circle cx="60" cy="258" r="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="60" y="258" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">2</text>
  <rect x="88" y="312" width="248" height="52" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="212" y="329" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#7439B8" data-fit="232">build()</text><text x="212" y="348" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="232">cada vez que hay que dibujar</text>
  <circle cx="60" cy="338" r="12" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="60" y="338" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8">3</text>
  <rect x="88" y="416" width="248" height="52" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="212" y="433" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="232">dispose()</text><text x="212" y="452" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="232">al salir del árbol</text>
  <circle cx="60" cy="442" r="12" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="60" y="442" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#556074">5</text>
  <g transform="translate(624,112)"><rect width="288" height="94" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#0F8478" data-fit="260">Por qué en initState</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="260">Corre una vez, al entrar al árbol.</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="260">build corre muchas: un add ahí</text><text x="14" y="77" font-size="12.5" fill="#454C61" data-fit="260">repetiría la carga con cada dibujo.</text></g>
  <rect x="640" y="230" width="240" height="56" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="760" y="249" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#4453C9" data-fit="224">ProductsBloc</text><text x="760" y="268" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="224">guardado en el BlocProvider</text>
  <path class="ar-teal" d="M336,258 H638"/>
  <text class="mono" x="488" y="246" text-anchor="middle" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="280">context.read&lt;ProductsBloc&gt;()</text>
  <text class="mono" x="488" y="278" text-anchor="middle" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="280">.add(LoadProductsEvent())</text>
  <path class="ar-green" d="M760,286 V338 H338"/>
  <circle cx="788" cy="312" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="788" y="312" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">4</text>
  <text class="mono" x="548" y="328" text-anchor="middle" font-size="12.5" font-weight="600" fill="#3A8235" data-fit="280">emit(estado nuevo)</text>
  <text x="548" y="358" text-anchor="middle" font-size="12" fill="#454C61" data-fit="380">BlocBuilder vuelve a ejecutar builder</text>
  <text class="h" x="640" y="376" data-fit="240">LO QUE SE VE</text>
  <rect x="640" y="388" width="240" height="160" rx="18" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/><text x="656" y="412" dy="0.35em" font-size="14" font-weight="600" fill="#161A26">Catálogo</text><path d="M642,430 H878" stroke="#D9DEE8" stroke-width="1.5"/>
  <g class="an a3"><rect x="656" y="440" width="208" height="30" rx="7" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.25"/><rect x="668" y="451" width="96" height="8" rx="4" fill="#C4CBD8"/><rect x="656" y="474" width="208" height="30" rx="7" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.25"/><rect x="668" y="485" width="132" height="8" rx="4" fill="#C4CBD8"/><rect x="656" y="508" width="208" height="30" rx="7" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.25"/><rect x="668" y="519" width="72" height="8" rx="4" fill="#C4CBD8"/></g>
  <g class="ls"><rect x="656" y="440" width="208" height="30" rx="7" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.25"/><text x="668" y="455" dy="0.35em" font-size="13" fill="#161A26" data-fit="188">Manzana</text><rect x="656" y="474" width="208" height="30" rx="7" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.25"/><text x="668" y="489" dy="0.35em" font-size="13" fill="#161A26" data-fit="188">Jugo de mora</text><rect x="656" y="508" width="208" height="30" rx="7" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.25"/><text x="668" y="523" dy="0.35em" font-size="13" fill="#161A26" data-fit="188">Leche</text></g>
  <rect class="an a1" x="82" y="146" width="260" height="64" rx="14" fill="none" stroke="#556074" stroke-width="3"/>
  <rect class="an a2" x="82" y="226" width="260" height="64" rx="14" fill="none" stroke="#0F8478" stroke-width="3"/>
  <rect class="an a34" x="82" y="306" width="260" height="64" rx="14" fill="none" stroke="#7439B8" stroke-width="3"/>
  <rect class="an a5" x="82" y="410" width="260" height="64" rx="14" fill="none" stroke="#556074" stroke-width="3"/>
  <rect class="an a4" x="634" y="224" width="252" height="68" rx="14" fill="none" stroke="#4453C9" stroke-width="3"/>
  <circle class="an tk1" cx="336" cy="258" r="8" fill="#0F8478" stroke="#FFFFFF" stroke-width="2"/>
  <circle class="an tk2" cx="760" cy="286" r="8" fill="#3A8235" stroke="#FFFFFF" stroke-width="2"/>
  <rect x="48" y="492" width="544" height="64" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <g class="an a1"><circle cx="76" cy="524" r="12" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="76" y="524" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#556074">1</text><text x="100" y="519" font-size="13" font-weight="600" fill="#161A26" data-fit="476">Flutter crea el State de ProductsScreen.</text><text x="100" y="537" font-size="13" fill="#454C61" data-fit="476">Todavía no hay nada dibujado.</text></g>
  <g class="an a2"><circle cx="76" cy="524" r="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="76" y="524" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">2</text><text x="100" y="519" font-size="13" font-weight="600" fill="#161A26" data-fit="476">initState corre una sola vez y lanza</text><text x="100" y="537" font-size="13" fill="#454C61" data-fit="476">LoadProductsEvent al Bloc que tiene encima.</text></g>
  <g class="an a3"><circle cx="76" cy="524" r="12" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="76" y="524" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8">3</text><text x="100" y="519" font-size="13" font-weight="600" fill="#161A26" data-fit="476">build dibuja la pantalla con el estado inicial,</text><text x="100" y="537" font-size="13" fill="#454C61" data-fit="476">el ProductState() que recibió el Bloc en create.</text></g>
  <g class="an a4"><circle cx="76" cy="524" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="76" y="524" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">4</text><text x="100" y="519" font-size="13" font-weight="600" fill="#161A26" data-fit="476">El Bloc emite un estado nuevo y la lista se dibuja</text><text x="100" y="537" font-size="13" fill="#454C61" data-fit="476">con los productos. initState no se repite.</text></g>
  <g class="an a5"><circle cx="76" cy="524" r="12" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="76" y="524" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#556074">5</text><text x="100" y="519" font-size="13" font-weight="600" fill="#161A26" data-fit="476">Al salir de la pantalla corre dispose</text><text x="100" y="537" font-size="13" fill="#454C61" data-fit="476">y el State se descarta.</text></g>
  <g class="st"><text x="68" y="519" font-size="13" font-weight="600" fill="#161A26" data-fit="508">initState corre una vez; build, cada vez que llega un estado.</text><text x="68" y="537" font-size="13" fill="#454C61" data-fit="508">Por eso el primer evento se lanza desde initState.</text></g>
  <text class="foot" x="48" y="588" data-fit="860">El BlocProvider ya está arriba cuando corre initState: por eso context.read encuentra el Bloc.</text>
</svg>
```

`create` solo construye el `Bloc`; no le lanza ningún evento. La carga inicial la pide la propia pantalla en su `initState`, que se ejecuta una sola vez, cuando `ProductsScreen` entra al árbol y ya tiene el `BlocProvider` encima:

```dart
class _ProductsScreenState extends State<ProductsScreen> {
  @override
  void initState() {
    super.initState();
    context.read<ProductsBloc>().add(LoadProductsEvent());
  }
}
```

## Alcanzar el Bloc: context.read

Para usar el `Bloc` desde un widget se le pide al `context`:

```dart
context.read<ProductsBloc>().add(LoadProductsEvent());
```

`context.read<ProductsBloc>()` busca **hacia arriba** en el árbol, empezando en el widget dueño de ese `context`, hasta encontrar un `BlocProvider<ProductsBloc>`. Lo que devuelve es el `Bloc`, y sobre él se llama `add`.

La búsqueda sube y nunca baja. De ahí sale el error más común con `BlocProvider`:

```svg
<svg id="bpContext" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 520" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="bpContext-ttl bpContext-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="bpContext-ttl">context.read busca hacia arriba</title>
  <desc id="bpContext-dsc">Dos árboles comparados. En el que no funciona, ProductsScreen crea el BlocProvider dentro de su propio build y usa su propio context: la búsqueda sube hasta MaterialApp, no encuentra el provider y lanza ProviderNotFoundException. En el que funciona, el BlocProvider está arriba de ProductsScreen y la búsqueda lo encuentra en el primer paso.</desc>
  <defs>
    <style>
      #bpContext .title{fill:#161A26;font-size:22px;font-weight:700}
      #bpContext .sub{fill:#79809A;font-size:13.5px}
      #bpContext .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #bpContext .foot{fill:#79809A;font-size:12px}
      #bpContext .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #bpContext .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #bpContext .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#bpContext-arrow)}
      #bpContext .ar-rose{fill:none;stroke:#C2354F;stroke-width:1.75;marker-end:url(#bpContext-ar-rose)}
      #bpContext .ar-green{fill:none;stroke:#3A8235;stroke-width:1.75;marker-end:url(#bpContext-ar-green)}
    </style>
    <marker id="bpContext-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="bpContext-ar-rose" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#C2354F"/></marker>
    <marker id="bpContext-ar-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#3A8235"/></marker>
  </defs>
  <rect width="960" height="520" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56"><tspan class="mono">context.read</tspan> busca hacia arriba</text>
  <text class="sub" x="48" y="80" data-fit="860">La búsqueda empieza en el widget dueño del context y sube. Lo que ese widget tiene debajo no cuenta.</text>
  <rect x="48" y="104" width="424" height="352" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="68" y="120" width="119" height="24" rx="12" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/>
  <text x="80" y="132" dy="0.35em" font-size="12" font-weight="700" letter-spacing=".08em" fill="#C2354F">NO FUNCIONA</text>
  <path class="tree" d="M172,208 V224 M172,264 V280 M172,320 V336"/>
  <rect x="72" y="168" width="200" height="40" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="172" y="188" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="184">MaterialApp</text>
  <rect x="72" y="224" width="200" height="40" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="172" y="244" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="184">ProductsScreen</text>
  <rect x="84" y="214" width="68" height="20" rx="10" fill="#4453C9"/>
  <text class="mono" x="118" y="224" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">context</text>
  <rect x="72" y="280" width="200" height="40" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="2.5"/><text class="mono" x="172" y="300" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="184">BlocProvider</text>
  <rect x="72" y="336" width="200" height="40" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="172" y="356" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="184">Scaffold</text>
  <path class="ar-rose" d="M272,244 H296 V152"/>
  <text x="312" y="180" font-size="12.5" font-weight="700" fill="#C2354F" data-fit="150">Sube y no encuentra</text>
  <text x="312" y="197" font-size="12.5" fill="#454C61" data-fit="150">ningún provider arriba.</text>
  <text x="312" y="292" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="150">Está debajo.</text>
  <text x="312" y="309" font-size="12.5" fill="#454C61" data-fit="150">La búsqueda nunca</text>
  <text x="312" y="326" font-size="12.5" fill="#454C61" data-fit="150">mira hacia abajo.</text>
  <rect x="72" y="408" width="376" height="32" rx="8" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/>
  <text class="mono" x="260" y="424" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#C2354F" data-fit="352">ProviderNotFoundException</text>
  <rect x="488" y="104" width="424" height="352" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="508" y="120" width="93" height="24" rx="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/>
  <text x="520" y="132" dy="0.35em" font-size="12" font-weight="700" letter-spacing=".08em" fill="#3A8235">FUNCIONA</text>
  <path class="tree" d="M612,208 V224 M612,264 V280 M612,320 V336"/>
  <rect x="512" y="168" width="200" height="40" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="612" y="188" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="184">MaterialApp</text>
  <rect x="512" y="224" width="200" height="40" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="2.5"/><text class="mono" x="612" y="244" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="184">BlocProvider</text>
  <rect x="512" y="280" width="200" height="40" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="612" y="300" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="184">ProductsScreen</text>
  <rect x="524" y="270" width="68" height="20" rx="10" fill="#4453C9"/>
  <text class="mono" x="558" y="280" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">context</text>
  <rect x="512" y="336" width="200" height="40" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="612" y="356" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="184">Scaffold</text>
  <path class="ar-green" d="M712,300 H736 V244 H716"/>
  <text x="752" y="262" font-size="12.5" font-weight="700" fill="#3A8235" data-fit="150">Sube un nivel</text>
  <text x="752" y="279" font-size="12.5" fill="#454C61" data-fit="150">y lo encuentra.</text>
  <text x="752" y="348" font-size="12.5" fill="#454C61" data-fit="150">Scaffold y sus hijos</text>
  <text x="752" y="365" font-size="12.5" fill="#454C61" data-fit="150">también lo alcanzan.</text>
  <rect x="512" y="408" width="376" height="32" rx="8" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/>
  <text class="mono" x="700" y="424" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235" data-fit="352">devuelve el ProductsBloc</text>
  <text class="foot" x="48" y="492" data-fit="860">La etiqueta azul marca de quién es el context que se usó para buscar: el de ProductsScreen en los dos casos.</text>
</svg>
```

Este es el código del lado izquierdo. `ProductsScreen` crea el `BlocProvider` dentro de su propio `build` y usa su propio `context` para buscarlo:

```dart
class ProductsScreen extends StatelessWidget {
  const ProductsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => ProductsBloc(ProductState()),
      child: Scaffold(
        floatingActionButton: FloatingActionButton(
          onPressed: () => context.read<ProductsBloc>().add(LoadProductsEvent()),
          child: const Icon(Icons.refresh),
        ),
      ),
    );
  }
}
```

Ese `context` es el de `ProductsScreen`, y `ProductsScreen` está **arriba** del `BlocProvider` que ella misma devuelve. Al tocar el botón, la app falla con:

```text
Error: Could not find the correct Provider<ProductsBloc> above this ProductsScreen Widget
```

El mensaje dice exactamente lo que pasó: no hay un provider *above*, arriba, de `ProductsScreen`.

## BlocBuilder: dibujar cada estado

`BlocProvider` deja el `Bloc` al alcance, pero no dibuja nada. Para que la pantalla cambie cuando el `Bloc` emite un estado hace falta alguien que esté escuchando: `BlocBuilder`.

```svg
<svg id="bbAnatomia" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 642" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="bbAnatomia-ttl bbAnatomia-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="bbAnatomia-ttl">Las partes de un BlocBuilder</title>
  <desc id="bbAnatomia-dsc">Un BlocBuilder de ProductsBloc y ProductsState anotado. El primer tipo dice a qué Bloc escucha, el parámetro state del builder es el estado que el Bloc acaba de emitir, y lo que el builder devuelve, un ListView con un ListTile por producto, es lo que aparece en la pantalla.</desc>
  <defs>
    <style>
      #bbAnatomia .title{fill:#161A26;font-size:22px;font-weight:700}
      #bbAnatomia .sub{fill:#79809A;font-size:13.5px}
      #bbAnatomia .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #bbAnatomia .cl{font-size:13px;fill:#C9CFDA}
      #bbAnatomia .s{fill:#A8D8A0} #bbAnatomia .n{fill:#F2B880} #bbAnatomia .c{fill:#7FD1E8}
      #bbAnatomia .p{fill:#D5B8F5} #bbAnatomia .k{fill:#F08FB0}
      #bbAnatomia .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #bbAnatomia .ct{fill:#161A26;font-size:14px;font-weight:700}
      #bbAnatomia .cb{fill:#454C61;font-size:13px}
      #bbAnatomia .rt{fill:#161A26;font-size:14px} #bbAnatomia .rs{fill:#79809A;font-size:12px}
      #bbAnatomia .foot{fill:#79809A;font-size:12px}
      #bbAnatomia .hl-green{fill:#9FD68D;fill-opacity:.16;stroke:#9FD68D;stroke-width:1.5}
      #bbAnatomia .ld-green{fill:none;stroke:#9FD68D;stroke-width:1.5;stroke-dasharray:3 4}
      #bbAnatomia .ar-green{fill:none;stroke:#3A8235;stroke-width:1.75;marker-end:url(#bbAnatomia-ar-green)}
      #bbAnatomia .hl-indigo{fill:#A9B4F2;fill-opacity:.16;stroke:#A9B4F2;stroke-width:1.5}
      #bbAnatomia .ld-indigo{fill:none;stroke:#A9B4F2;stroke-width:1.5;stroke-dasharray:3 4}
      #bbAnatomia .ar-indigo{fill:none;stroke:#4453C9;stroke-width:1.75;marker-end:url(#bbAnatomia-ar-indigo)}
      #bbAnatomia .hl-violet{fill:#C9A6EE;fill-opacity:.16;stroke:#C9A6EE;stroke-width:1.5}
      #bbAnatomia .ld-violet{fill:none;stroke:#C9A6EE;stroke-width:1.5;stroke-dasharray:3 4}
      #bbAnatomia .ar-violet{fill:none;stroke:#7439B8;stroke-width:1.75;marker-end:url(#bbAnatomia-ar-violet)}
    </style>
    <marker id="bbAnatomia-ar-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#3A8235"/></marker>
    <marker id="bbAnatomia-ar-indigo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#4453C9"/></marker>
    <marker id="bbAnatomia-ar-violet" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#7439B8"/></marker>
  </defs>
  <rect width="960" height="642" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Las partes de un <tspan class="mono">BlocBuilder</tspan></text>
  <text class="sub" x="48" y="80" data-fit="860">Escucha a un Bloc y, cada vez que llega un estado, ejecuta builder para volver a dibujar.</text>
  <rect x="48" y="112" width="456" height="372" rx="12" fill="#1F2430"/>
  <path d="M48,124 A12,12 0 0 1 60,112 H492 A12,12 0 0 1 504,124 V144 H48 Z" fill="#2A3040"/>
  <circle cx="68" cy="128" r="5" fill="#F14C4C"/><circle cx="84" cy="128" r="5" fill="#E5C07B"/><circle cx="100" cy="128" r="5" fill="#6BCB77"/>
  <text class="mono" x="276" y="128" dy="0.35em" text-anchor="middle" fill="#9AA3B5" font-size="12" data-fit="316">lib/screens/products_screen.dart</text>
  <rect x="552" y="112" width="360" height="372" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="568" y="128" dy="0.35em" data-fit="328">LO QUE PASA CON CADA ESTADO</text>
  <path d="M552,144 H912" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect class="hl-indigo" x="157.6" y="156" width="101.6" height="22" rx="5"/>
  <rect class="hl-green" x="227.8" y="180" width="47.0" height="22" rx="5"/>
  <rect class="hl-violet" x="95.2" y="276" width="132.8" height="22" rx="5"/>
  <text class="cl mono" font-size="13" x="68.0" y="172" textLength="319.8" lengthAdjust="spacingAndGlyphs" data-fit="432"><tspan class="c">BlocBuilder</tspan>&lt;<tspan class="c">ProductsBloc</tspan>, <tspan class="c">ProductsState</tspan>&gt;(</text>
  <text class="cl mono" font-size="13" x="83.6" y="196" textLength="210.6" lengthAdjust="spacingAndGlyphs" data-fit="432"><tspan class="p">builder</tspan>: (context, state) {</text>
  <text class="cl mono" font-size="13" x="99.2" y="220" textLength="280.8" lengthAdjust="spacingAndGlyphs" data-fit="432">if (state is <tspan class="c">ProductsLoadingState</tspan>) {</text>
  <text class="cl mono" font-size="13" x="114.8" y="244" textLength="319.8" lengthAdjust="spacingAndGlyphs" data-fit="432"><tspan class="k">return</tspan> <tspan class="k">const</tspan> <tspan class="c">CircularProgressIndicator</tspan>();</text>
  <text class="cl mono" font-size="13" x="99.2" y="268" textLength="7.8" lengthAdjust="spacingAndGlyphs" data-fit="432">}</text>
  <text class="cl mono" font-size="13" x="99.2" y="292" textLength="124.8" lengthAdjust="spacingAndGlyphs" data-fit="432"><tspan class="k">return</tspan> <tspan class="c">ListView</tspan>(</text>
  <text class="cl mono" font-size="13" x="114.8" y="316" textLength="85.8" lengthAdjust="spacingAndGlyphs" data-fit="432"><tspan class="p">children</tspan>: [</text>
  <text class="cl mono" font-size="13" x="130.4" y="340" textLength="288.6" lengthAdjust="spacingAndGlyphs" data-fit="432">for (<tspan class="k">final</tspan> product in state.products)</text>
  <text class="cl mono" font-size="13" x="146.0" y="364" textLength="280.8" lengthAdjust="spacingAndGlyphs" data-fit="432"><tspan class="c">ListTile</tspan>(<tspan class="p">title</tspan>: <tspan class="c">Text</tspan>(product.name)),</text>
  <text class="cl mono" font-size="13" x="114.8" y="388" textLength="15.6" lengthAdjust="spacingAndGlyphs" data-fit="432">],</text>
  <text class="cl mono" font-size="13" x="99.2" y="412" textLength="15.6" lengthAdjust="spacingAndGlyphs" data-fit="432">);</text>
  <text class="cl mono" font-size="13" x="83.6" y="436" textLength="15.6" lengthAdjust="spacingAndGlyphs" data-fit="432">},</text>
  <text class="cl mono" font-size="13" x="68.0" y="460" textLength="7.8" lengthAdjust="spacingAndGlyphs" data-fit="432">)</text>
  <g transform="translate(552,144)">
<rect x="110" y="14" width="140" height="40" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="180" y="34" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#4453C9" data-fit="124">ProductsBloc</text>
<path class="ar-green" d="M180,54 V76"/><text class="mono" x="190" y="66" dy="0.35em" font-size="12" fill="#3A8235">emit</text><rect x="60" y="78" width="240" height="34" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="180" y="95" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#3A8235" data-fit="224">ProductsLoadedState</text>
<path class="ar-violet" d="M180,112 V136"/><text class="mono" x="190" y="124" dy="0.35em" font-size="12" fill="#7439B8">builder</text><rect x="96" y="138" width="168" height="190" rx="18" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/><text x="112" y="162" dy="0.35em" font-size="14" font-weight="600" fill="#161A26">Catálogo</text><path d="M98,180 H262" stroke="#D9DEE8" stroke-width="1.5"/>
<rect x="108" y="190" width="144" height="30" rx="7" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.25"/><text x="120" y="205" dy="0.35em" font-size="13" fill="#161A26" data-fit="124">Manzana</text><rect x="108" y="230" width="144" height="30" rx="7" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.25"/><text x="120" y="245" dy="0.35em" font-size="13" fill="#161A26" data-fit="124">Jugo de mora</text><rect x="108" y="270" width="144" height="30" rx="7" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.25"/><text x="120" y="285" dy="0.35em" font-size="13" fill="#161A26" data-fit="124">Leche</text>

  </g>
  <path class="ld-indigo" d="M393.8,167 H504"/>
  <path class="ar-indigo" d="M504,167 H532 V178 H662"/>
  <path class="ld-green" d="M300.2,191 H504"/>
  <path class="ar-green" d="M504,191 H523 V239 H612"/>
  <path class="ld-violet" d="M230.0,287 H504"/>
  <path class="ar-violet" d="M504,287 H514 V388 H648"/>
  <g transform="translate(48.0,508)">
    <rect width="277.3" height="102" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
    <circle cx="24" cy="26" r="7" fill="#EEF1FF" stroke="#4453C9" stroke-width="2"/>
    <text class="ct mono" x="42" y="26" dy="0.35em" data-fit="219">&lt;ProductsBloc, ...&gt;</text>
    <text class="cb" x="16" y="60" data-fit="245">A qué Bloc escucha. Lo busca</text>
    <text class="cb" x="16" y="79" data-fit="245">solo, hacia arriba, en el árbol.</text>
  </g>
  <g transform="translate(341.3,508)">
    <rect width="277.3" height="102" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
    <circle cx="24" cy="26" r="7" fill="#E8F6E3" stroke="#3A8235" stroke-width="2"/>
    <text class="ct mono" x="42" y="26" dy="0.35em" data-fit="219">state</text>
    <text class="cb" x="16" y="60" data-fit="245">El estado que acaba de llegar,</text>
    <text class="cb" x="16" y="79" data-fit="245">de tipo ProductsState.</text>
  </g>
  <g transform="translate(634.7,508)">
    <rect width="277.3" height="102" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
    <circle cx="24" cy="26" r="7" fill="#F4EBFF" stroke="#7439B8" stroke-width="2"/>
    <text class="ct mono" x="42" y="26" dy="0.35em" data-fit="219">return</text>
    <text class="cb" x="16" y="60" data-fit="245">Los widgets para ese estado.</text>
    <text class="cb" x="16" y="79" data-fit="245">Es lo que queda en pantalla.</text>
  </g>
</svg>
```

```dart
BlocBuilder<ProductsBloc, ProductsState>(
  builder: (context, state) {
    if (state is ProductsLoadingState) {
      return const CircularProgressIndicator();
    }
    return ListView(
      children: [
        for (final product in state.products)
          ListTile(title: Text(product.name)),
      ],
    );
  },
)
```

## Un estado, un dibujo

`builder` es una función de estado a widgets. No guarda nada entre una llamada y la siguiente: mira el estado que le llegó y decide qué devolver.

```svg
<svg id="bbEstados" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 548" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="bbEstados-ttl bbEstados-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="bbEstados-ttl">Un estado, un dibujo</title>
  <desc id="bbEstados-dsc">Tres columnas. Con ProductsLoadingState el builder devuelve un indicador de progreso; con ProductsLoadedState, la lista de tres productos; con ProductsErrorState, el mensaje de error que trae el estado.</desc>
  <defs>
    <style>
      #bbEstados .title{fill:#161A26;font-size:22px;font-weight:700}
      #bbEstados .sub{fill:#79809A;font-size:13.5px}
      #bbEstados .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #bbEstados .foot{fill:#79809A;font-size:12px}
      #bbEstados .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #bbEstados .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #bbEstados .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#bbEstados-arrow)}
      #bbEstados .ar-amber{fill:none;stroke:#A96C05;stroke-width:1.75;marker-end:url(#bbEstados-ar-amber)}
      #bbEstados .ar-green{fill:none;stroke:#3A8235;stroke-width:1.75;marker-end:url(#bbEstados-ar-green)}
      #bbEstados .ar-rose{fill:none;stroke:#C2354F;stroke-width:1.75;marker-end:url(#bbEstados-ar-rose)}
    </style>
    <marker id="bbEstados-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="bbEstados-ar-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#A96C05"/></marker>
    <marker id="bbEstados-ar-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#3A8235"/></marker>
    <marker id="bbEstados-ar-rose" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#C2354F"/></marker>
  </defs>
  <rect width="960" height="548" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Un estado, un dibujo</text>
  <text class="sub" x="48" y="80" data-fit="860">builder es una función: recibe el estado y devuelve los widgets que le corresponden. Mismo estado, misma pantalla.</text>
  <text class="h" x="192" y="124" text-anchor="middle">LLEGA EL ESTADO</text>
  <rect x="76" y="136" width="232" height="40" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="192" y="156" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="216">ProductsLoadingState</text>
  <path class="ar-amber" d="M192,176 V222"/>
  <rect x="202" y="188" width="64" height="22" rx="6" fill="#FBFBFD"/>
  <text class="mono" x="206" y="199" dy="0.35em" font-size="12" font-weight="600" fill="#A96C05">builder</text>
  <rect x="100" y="226" width="184" height="220" rx="18" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/><text x="116" y="250" dy="0.35em" font-size="14" font-weight="600" fill="#161A26">Catálogo</text><path d="M102,268 H282" stroke="#D9DEE8" stroke-width="1.5"/>
  <circle cx="192" cy="352" r="20" fill="none" stroke="#FFF3DC" stroke-width="5"/><path d="M192,332 A20,20 0 0 1 212,352" fill="none" stroke="#A96C05" stroke-width="5" stroke-linecap="round"/>
  <text class="mono" x="192" y="472" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="600" fill="#454C61" data-fit="250">CircularProgressIndicator()</text>
  <text class="h" x="480" y="124" text-anchor="middle">LLEGA EL ESTADO</text>
  <rect x="364" y="136" width="232" height="40" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="480" y="156" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#3A8235" data-fit="216">ProductsLoadedState</text>
  <path class="ar-green" d="M480,176 V222"/>
  <rect x="490" y="188" width="64" height="22" rx="6" fill="#FBFBFD"/>
  <text class="mono" x="494" y="199" dy="0.35em" font-size="12" font-weight="600" fill="#3A8235">builder</text>
  <rect x="388" y="226" width="184" height="220" rx="18" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/><text x="404" y="250" dy="0.35em" font-size="14" font-weight="600" fill="#161A26">Catálogo</text><path d="M390,268 H570" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="402" y="282" width="156" height="30" rx="7" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/><text x="414" y="297" dy="0.35em" font-size="13" fill="#161A26" data-fit="136">Manzana</text><rect x="402" y="324" width="156" height="30" rx="7" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/><text x="414" y="339" dy="0.35em" font-size="13" fill="#161A26" data-fit="136">Jugo de mora</text><rect x="402" y="366" width="156" height="30" rx="7" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/><text x="414" y="381" dy="0.35em" font-size="13" fill="#161A26" data-fit="136">Leche</text>
  <text class="mono" x="480" y="472" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="600" fill="#454C61" data-fit="250">ListView(children: [...])</text>
  <text class="h" x="768" y="124" text-anchor="middle">LLEGA EL ESTADO</text>
  <rect x="652" y="136" width="232" height="40" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text class="mono" x="768" y="156" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#C2354F" data-fit="216">ProductsErrorState</text>
  <path class="ar-rose" d="M768,176 V222"/>
  <rect x="778" y="188" width="64" height="22" rx="6" fill="#FBFBFD"/>
  <text class="mono" x="782" y="199" dy="0.35em" font-size="12" font-weight="600" fill="#C2354F">builder</text>
  <rect x="676" y="226" width="184" height="220" rx="18" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/><text x="692" y="250" dy="0.35em" font-size="14" font-weight="600" fill="#161A26">Catálogo</text><path d="M678,268 H858" stroke="#D9DEE8" stroke-width="1.5"/>
  <circle cx="768" cy="330" r="18" fill="#FFEBEF" stroke="#C2354F" stroke-width="2"/>
  <text x="768" y="330" dy="0.35em" text-anchor="middle" font-size="20" font-weight="700" fill="#C2354F">!</text>
  <text x="768" y="374" dy="0.35em" text-anchor="middle" font-size="14" fill="#161A26" data-fit="156">Sin conexión</text>
  <text class="mono" x="768" y="472" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="600" fill="#454C61" data-fit="250">Text(state.message)</text>
  <text class="foot" x="48" y="520" data-fit="860">La pantalla no recuerda nada por su cuenta: si debe verse distinta, es porque llegó otro estado.</text>
</svg>
```

```dart
BlocBuilder<ProductsBloc, ProductsState>(
  builder: (context, state) {
    if (state is ProductsLoadingState) {
      return const Center(child: CircularProgressIndicator());
    }
    if (state is ProductsErrorState) {
      return Center(child: Text(state.message));
    }
    return ListView(
      children: [
        for (final product in state.products)
          ListTile(title: Text(product.name)),
      ],
    );
  },
)
```

Dos cosas que `builder` **no** debe hacer:

- **Lanzar eventos por su cuenta.** Un `add` dentro de `builder` produce un estado, que vuelve a ejecutar `builder`, que vuelve a lanzar el evento. Los eventos se lanzan desde un `onPressed`, un `onSubmitted` o el `initState` de la pantalla.
- **Navegar o mostrar un `SnackBar`.** `builder` solo devuelve widgets, y Flutter lo puede ejecutar más veces de las que crees.

## Qué se vuelve a dibujar

Cuando llega un estado no se reconstruye la pantalla entera. Solo se vuelve a ejecutar `builder`, y con él lo que `builder` devuelve.

```svg
<svg id="bbAlcance" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 588" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="bbAlcance-ttl bbAlcance-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="bbAlcance-ttl">Qué se vuelve a dibujar</title>
  <desc id="bbAlcance-dsc">Árbol de una pantalla: Scaffold con un AppBar y un Column; dentro del Column, un SearchField y un BlocBuilder con un ListView de tres ListTile. Una zona resaltada rodea al BlocBuilder y a todo lo que tiene debajo: es lo único que se reconstruye cuando llega un estado. AppBar y SearchField quedan fuera y no se reconstruyen.</desc>
  <defs>
    <style>
      #bbAlcance .title{fill:#161A26;font-size:22px;font-weight:700}
      #bbAlcance .sub{fill:#79809A;font-size:13.5px}
      #bbAlcance .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #bbAlcance .foot{fill:#79809A;font-size:12px}
      #bbAlcance .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #bbAlcance .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #bbAlcance .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#bbAlcance-arrow)}
    </style>
    <marker id="bbAlcance-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="588" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Qué se vuelve a dibujar</text>
  <text class="sub" x="48" y="80" data-fit="860">Solo lo que está dentro del BlocBuilder se reconstruye con cada estado. El resto de la pantalla no se entera.</text>
  <rect x="336" y="256" width="304" height="268" rx="14" fill="#F4EBFF" fill-opacity=".6" stroke="#C9A6EE" stroke-width="1.5" stroke-dasharray="6 5"/>
  <text class="h" x="488" y="504" text-anchor="middle" style="fill:#7439B8" data-fit="280">SE RECONSTRUYE CON CADA ESTADO</text>
  <path class="tree" d="M272,152 V172 M152,192 V172 H392 V192 M392,232 V252 M232,272 V252 H488 V272 M488,312 V352 M488,392 V412 M394,432 V412 H582 V432 M488,412 V432"/>
  <rect x="192" y="112" width="160" height="40" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="272" y="132" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="144">Scaffold</text>
  <rect x="72" y="192" width="160" height="40" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="152" y="212" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="144">AppBar</text>
  <rect x="312" y="192" width="160" height="40" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="392" y="212" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="144">Column</text>
  <rect x="152" y="272" width="160" height="40" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="232" y="292" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="144">SearchField</text>
  <rect x="408" y="272" width="160" height="40" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="2.5"/><text class="mono" x="488" y="292" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#7439B8" data-fit="144">BlocBuilder</text>
  <rect x="408" y="352" width="160" height="40" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="488" y="372" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#7439B8" data-fit="144">ListView</text>
  <rect x="352" y="432" width="84" height="36" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="394" y="450" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="68">ListTile</text>
  <rect x="446" y="432" width="84" height="36" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="488" y="450" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="68">ListTile</text>
  <rect x="540" y="432" width="84" height="36" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="582" y="450" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="68">ListTile</text>
  <g transform="translate(672,112)"><rect width="240" height="94" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#556074" data-fit="212">Fuera del BlocBuilder</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="212">AppBar y SearchField no se</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="212">reconstruyen: no dependen</text><text x="14" y="77" font-size="12.5" fill="#454C61" data-fit="212">del estado del Bloc.</text></g>
  <g transform="translate(672,272)"><rect width="240" height="94" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#7439B8" data-fit="212">Dentro del BlocBuilder</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="212">builder se ejecuta otra vez</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="212">con cada estado, y todo lo</text><text x="14" y="77" font-size="12.5" fill="#454C61" data-fit="212">que devuelve se rehace.</text></g>
  <g transform="translate(672,432)"><rect width="240" height="94" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="212">La regla</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="212">Envuelve solo lo que cambia</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="212">con el estado. Entre más</text><text x="14" y="77" font-size="12.5" fill="#454C61" data-fit="212">abajo esté, menos se rehace.</text></g>
  <text class="foot" x="48" y="560" data-fit="860">Menos widgets reconstruidos es menos trabajo por cada estado. Se nota cuando los estados llegan seguido.</text>
</svg>
```

Por eso `BlocBuilder` se pone **lo más abajo posible**, envolviendo solo la parte de la pantalla que depende del estado. Si envuelve al `Scaffold` completo funciona igual, pero con cada estado se rehace también lo que no cambió.

Cuando una parte depende de un solo dato del estado, `buildWhen` deja pasar únicamente los estados que la afectan. Recibe el estado anterior y el nuevo, y devuelve `true` si hay que redibujar:

```dart
BlocBuilder<ProductsBloc, ProductsState>(
  buildWhen: (previous, current) =>
      previous.selectedCategory != current.selectedCategory,
  builder: (context, state) {
    return Text(state.selectedCategory ?? 'Todos');
  },
)
```

## Los dos juntos

```svg
<svg id="bbCiclo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 576" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="bbCiclo-ttl bbCiclo-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="bbCiclo-ttl">Los dos juntos: el ciclo completo</title>
  <desc id="bbCiclo-dsc">Un marco BlocProvider de ProductsBloc rodea a la vista y al Bloc. Paso 1: el botón Recargar de la vista llama a context.read y add para lanzar LoadProductsEvent al ProductsBloc. Paso 2: el Bloc emite un estado. Paso 3: BlocBuilder recibe ese estado, ejecuta builder y redibuja la lista.</desc>
  <defs>
    <style>
      #bbCiclo .title{fill:#161A26;font-size:22px;font-weight:700}
      #bbCiclo .sub{fill:#79809A;font-size:13.5px}
      #bbCiclo .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #bbCiclo .foot{fill:#79809A;font-size:12px}
      #bbCiclo .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #bbCiclo .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #bbCiclo .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#bbCiclo-arrow)}
      #bbCiclo .ar-teal{fill:none;stroke:#0F8478;stroke-width:1.75;marker-end:url(#bbCiclo-ar-teal)}
      #bbCiclo .ar-green{fill:none;stroke:#3A8235;stroke-width:1.75;marker-end:url(#bbCiclo-ar-green)}
    </style>
    <marker id="bbCiclo-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="bbCiclo-ar-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#0F8478"/></marker>
    <marker id="bbCiclo-ar-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#3A8235"/></marker>
  </defs>
  <rect width="960" height="576" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Los dos juntos: el ciclo completo</text>
  <text class="sub" x="48" y="80" data-fit="860">BlocProvider pone el Bloc al alcance. Con eso, la vista le lanza eventos y BlocBuilder dibuja lo que el Bloc responde.</text>
  <rect x="48" y="120" width="864" height="304" rx="14" fill="#FFF3DC" fill-opacity=".45" stroke="#F0C572" stroke-width="2"/>
  <rect x="72" y="106" width="232" height="28" rx="8" fill="#FFF3DC" stroke="#F0C572" stroke-width="2"/>
  <text class="mono" x="188" y="120" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#A96C05" data-fit="216">BlocProvider&lt;ProductsBloc&gt;</text>
  <rect x="72" y="156" width="320" height="244" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="92" y="182">VISTA · ProductsScreen</text>
  <rect x="96" y="200" width="272" height="76" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="232" y="229" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#7439B8" data-fit="256">BlocBuilder</text><text x="232" y="248" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="256">dibuja el estado que llega</text>
  <rect x="96" y="300" width="272" height="76" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="232" y="329" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#0F8478" data-fit="256">IconButton</text><text x="232" y="348" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="256">Recargar · onPressed lanza un evento</text>
  <rect x="672" y="200" width="216" height="176" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="2.5"/><text class="mono" x="780" y="279" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#4453C9" data-fit="200">ProductsBloc</text><text x="780" y="298" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="200">pide los datos y decide</text>
  <path class="ar-green" d="M672,238 H370"/>
  <path class="ar-teal" d="M368,338 H670"/>
  <circle cx="644" cy="238" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="644" y="238" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">2</text>
  <circle cx="396" cy="238" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="396" y="238" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">3</text>
  <circle cx="396" cy="338" r="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="396" y="338" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">1</text>
  <text class="mono" x="520" y="222" text-anchor="middle" font-size="12.5" font-weight="600" fill="#3A8235" data-fit="210">emit(ProductsLoadedState)</text>
  <text class="mono" x="520" y="262" text-anchor="middle" font-size="12.5" font-weight="600" fill="#3A8235" data-fit="210">builder(context, state)</text>
  <text class="mono" x="532" y="322" text-anchor="middle" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="230">context.read&lt;ProductsBloc&gt;()</text>
  <text class="mono" x="532" y="362" text-anchor="middle" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="230">.add(LoadProductsEvent())</text>
  <circle cx="60" cy="462" r="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="60" y="462" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">1</text>
  <text x="82" y="462" dy="0.35em" font-size="14" font-weight="700" fill="#161A26" data-fit="230">La vista avisa</text>
  <text x="48" y="494" font-size="12.5" fill="#454C61" data-fit="272">context.read alcanza el Bloc</text>
  <text x="48" y="511" font-size="12.5" fill="#454C61" data-fit="272">y add le lanza el evento.</text>
  <circle cx="356" cy="462" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="356" y="462" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">2</text>
  <text x="378" y="462" dy="0.35em" font-size="14" font-weight="700" fill="#161A26" data-fit="230">El Bloc responde</text>
  <text x="344" y="494" font-size="12.5" fill="#454C61" data-fit="272">Hace su trabajo y entrega</text>
  <text x="344" y="511" font-size="12.5" fill="#454C61" data-fit="272">un estado nuevo con emit.</text>
  <circle cx="652" cy="462" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="652" y="462" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">3</text>
  <text x="674" y="462" dy="0.35em" font-size="14" font-weight="700" fill="#161A26" data-fit="230">BlocBuilder redibuja</text>
  <text x="640" y="494" font-size="12.5" fill="#454C61" data-fit="272">Ejecuta builder con ese estado</text>
  <text x="640" y="511" font-size="12.5" fill="#454C61" data-fit="272">y cambia la pantalla.</text>
  <text class="foot" x="48" y="548" data-fit="860">Sin BlocProvider no habría nada que alcanzar; sin BlocBuilder, los estados llegarían y nadie los dibujaría.</text>
</svg>
```

El recorrido completo de un toque en **Recargar**:

1. **La vista avisa.** El `onPressed` del botón usa `context.read<ProductsBloc>()` para alcanzar el `Bloc` y le lanza `LoadProductsEvent` con `add`.
2. **El `Bloc` responde.** Atiende el evento, pide los datos y entrega estados con `emit`.
3. **`BlocBuilder` redibuja.** Por cada estado ejecuta `builder`, y la pantalla cambia.

La `Screen` completa. El `BlocProvider` no aparece aquí: está arriba, en la tabla de rutas.

```dart
class ProductsScreen extends StatefulWidget {
  const ProductsScreen({super.key});

  @override
  State<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  @override
  void initState() {
    super.initState();
    context.read<ProductsBloc>().add(LoadProductsEvent());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Catálogo'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () =>
                context.read<ProductsBloc>().add(LoadProductsEvent()),
          ),
        ],
      ),
      body: BlocBuilder<ProductsBloc, ProductsState>(
        builder: (context, state) {
          if (state is ProductsLoadingState) {
            return const Center(child: CircularProgressIndicator());
          }
          if (state is ProductsErrorState) {
            return Center(child: Text(state.message));
          }
          return ListView(
            children: [
              for (final product in state.products)
                ListTile(title: Text(product.name)),
            ],
          );
        },
      ),
    );
  }
}
```

No hay ningún `setState`: el estado vive en el `Bloc`. La pantalla es un `StatefulWidget` solo para tener `initState`, que es donde lanza el primer evento.
