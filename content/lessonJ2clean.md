# image_picker desde Clean Architecture

<!-- tags: dónde va image_picker, XFile en el dominio, PickedPhoto, DataSource,
     frontera del dominio, ImageSource, caso de uso subir foto, analizar una librería,
     tipos de una librería en el dominio, DevicePhotoDataSource -->

Con `flutter pub add image_picker` ya puedes abrir la galería desde un botón. En Clean Architecture, la pregunta no es cómo se usa la librería, sino **dónde vive**. Esta lección analiza un solo caso, *cambiar la foto de perfil desde la galería*, y responde cómo pasa la foto por el dominio sin que el dominio sepa que `image_picker` existe.

## Tres preguntas antes de usar una librería

```svg
<svg id="clPreguntas" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 412" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="clPreguntas-ttl clPreguntas-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="clPreguntas-ttl">Tres preguntas antes de usar una librería</title>
  <desc id="clPreguntas-dsc">Tres tarjetas. Una: ¿con qué habla fuera de tu código? Con la galería del sistema, así que va en un DataSource, en el anillo de afuera. Dos: ¿qué tipos propios trae? XFile e ImageSource, que se quedan en ese DataSource; el dominio define el suyo, PickedPhoto. Tres: ¿qué necesita de verdad el caso de uso? Los bytes de la foto y su extensión, que es lo único que cruza al dominio.</desc>
  <defs>
    <style>
      #clPreguntas .title{fill:#161A26;font-size:22px;font-weight:700}
      #clPreguntas .sub{fill:#79809A;font-size:13.5px}
      #clPreguntas .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #clPreguntas .foot{fill:#79809A;font-size:12px}
      #clPreguntas .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #clPreguntas .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #clPreguntas .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#clPreguntas-arrow)}
    </style>
    <marker id="clPreguntas-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="412" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Tres preguntas antes de usar una librería</text>
  <text class="sub" x="48" y="80" data-fit="860">Sirven para cualquier paquete. Aquí, respondidas para image_picker.</text>
  <rect x="48" y="108" width="272" height="248" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <circle cx="76" cy="138" r="12" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="76" y="138" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#556074">1</text>
  <text x="98" y="134" font-size="14.5" font-weight="700" fill="#161A26">¿Con qué habla fuera</text>
  <text x="98" y="154" font-size="14.5" font-weight="700" fill="#161A26">de tu código?</text>
  <text class="h" x="68" y="194">CON IMAGE_PICKER</text>
  <text x="68" y="218" font-size="13" fill="#454C61" data-fit="232">Con la galería del sistema</text>
  <text x="68" y="237" font-size="13" fill="#454C61" data-fit="232">del teléfono.</text>
  <rect x="60" y="272" width="248" height="68" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text x="74" y="298" font-size="13" font-weight="700" fill="#0F8478" data-fit="220">Va en un DataSource,</text>
  <text x="74" y="320" font-size="13" font-weight="700" fill="#0F8478" data-fit="220">en el anillo de afuera.</text>
  <rect x="344" y="108" width="272" height="248" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <circle cx="372" cy="138" r="12" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="372" y="138" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#556074">2</text>
  <text x="394" y="134" font-size="14.5" font-weight="700" fill="#161A26">¿Qué tipos propios</text>
  <text x="394" y="154" font-size="14.5" font-weight="700" fill="#161A26">trae?</text>
  <text class="h" x="364" y="194">CON IMAGE_PICKER</text>
  <text x="364" y="218" font-size="13" fill="#454C61" data-fit="232">XFile e ImageSource.</text>
  <rect x="356" y="272" width="248" height="68" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/>
  <text x="370" y="298" font-size="13" font-weight="700" fill="#C2354F" data-fit="220">Se quedan en ese DataSource.</text>
  <text x="370" y="320" font-size="13" font-weight="700" fill="#C2354F" data-fit="220">El dominio define el suyo.</text>
  <rect x="640" y="108" width="272" height="248" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <circle cx="668" cy="138" r="12" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="668" y="138" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#556074">3</text>
  <text x="690" y="134" font-size="14.5" font-weight="700" fill="#161A26">¿Qué necesita de verdad</text>
  <text x="690" y="154" font-size="14.5" font-weight="700" fill="#161A26">el caso de uso?</text>
  <text class="h" x="660" y="194">CON IMAGE_PICKER</text>
  <text x="660" y="218" font-size="13" fill="#454C61" data-fit="232">Los bytes de la foto</text>
  <text x="660" y="237" font-size="13" fill="#454C61" data-fit="232">y su extensión.</text>
  <rect x="652" y="272" width="248" height="68" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text x="666" y="298" font-size="13" font-weight="700" fill="#A96C05" data-fit="220">PickedPhoto: lo único</text>
  <text x="666" y="320" font-size="13" font-weight="700" fill="#A96C05" data-fit="220">que cruza al dominio.</text>
  <text class="foot" x="48" y="384" data-fit="860">supabase_flutter responde igual: habla con Supabase, trae PostgrestException y StorageException, y vive en sus DataSource.</text>
</svg>
```

Antes de escribir código, se le hacen tres preguntas a la librería. Las respuestas dicen en qué anillo va, qué tipos se quedan afuera y qué tiene que inventar el dominio. Con `image_picker` dan esto: va en un `DataSource`, `XFile` e `ImageSource` no salen de ahí, y el dominio define `PickedPhoto`.

## Dónde va cada pieza

```svg
<svg id="clCirculo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 990" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="clCirculo-ttl clCirculo-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="clCirculo-ttl">Dónde va cada pieza</title>
  <desc id="clCirculo-dsc">El diagrama circular de arquitectura limpia con cuatro anillos: afuera, en azul, Devices, UI y DB; luego, en verde, Presenters y Gateways; luego, en rojo, Use Cases; y en el centro, en amarillo, Entities. En una línea vertical, de arriba abajo: ProfilePage en UI, FeedBloc en Presenters, ChangeAvatarUseCase en Use Cases, PickedPhoto en Entities, el contrato AvatarRepository en Use Cases y AvatarRepositoryImpl en Gateways. Abajo, en el anillo de afuera, DevicePhotoDataSource y SupabaseAvatarDataSource. Fuera del círculo, la galería del teléfono, a la que se llega con image_picker, y Supabase Storage, a la que se llega con supabase_flutter.</desc>
  <defs>
    <style>
      #clCirculo .title{fill:#161A26;font-size:22px;font-weight:700}
      #clCirculo .sub{fill:#79809A;font-size:13.5px}
      #clCirculo .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #clCirculo .foot{fill:#79809A;font-size:12px}
      #clCirculo .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #clCirculo .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #clCirculo .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#clCirculo-arrow)}
    </style>
    <marker id="clCirculo-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="990" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Dónde va cada pieza</text>
  <text class="sub" x="48" y="80" data-fit="860">image_picker y supabase_flutter quedan en el borde. El centro no sabe que existen.</text>
  <circle cx="480" cy="500" r="380" fill="#FFFFFF"/><circle cx="480" cy="500" r="380" fill="#6E93EC" fill-opacity="0.42" stroke="#FFFFFF" stroke-width="2"/>
  <circle cx="480" cy="500" r="282" fill="#FFFFFF"/><circle cx="480" cy="500" r="282" fill="#6EE98A" fill-opacity="0.42" stroke="#FFFFFF" stroke-width="2"/>
  <circle cx="480" cy="500" r="182" fill="#FFFFFF"/><circle cx="480" cy="500" r="182" fill="#EE7070" fill-opacity="0.42" stroke="#FFFFFF" stroke-width="2"/>
  <circle cx="480" cy="500" r="90" fill="#FFFFFF"/><circle cx="480" cy="500" r="90" fill="#ECEE72" fill-opacity="0.42" stroke="#FFFFFF" stroke-width="2"/>
  <path id="clCirculo-arc-ui" d="M175.2,324.0 A352,352 0 0 1 314.7,189.2" fill="none"/><text font-size="16" font-weight="700" letter-spacing=".02em" fill="#1E2A55"><textPath href="#clCirculo-arc-ui" startOffset="50%" text-anchor="middle">UI</textPath></text>
  <path id="clCirculo-arc-dev" d="M147.1,608.2 A350,350 0 0 0 228.2,743.1" fill="none"/><text font-size="16" font-weight="700" letter-spacing=".02em" fill="#1E2A55"><textPath href="#clCirculo-arc-dev" startOffset="50%" text-anchor="middle">Devices</textPath></text>
  <path id="clCirculo-arc-db" d="M633.4,814.6 A350,350 0 0 0 705.0,768.1" fill="none"/><text font-size="16" font-weight="700" letter-spacing=".02em" fill="#1E2A55"><textPath href="#clCirculo-arc-db" startOffset="50%" text-anchor="middle">DB</textPath></text>
  <path id="clCirculo-arc-pre" d="M240.3,422.1 A252,252 0 0 1 346.5,286.3" fill="none"/><text font-size="16" font-weight="700" letter-spacing=".02em" fill="#1B4D2A"><textPath href="#clCirculo-arc-pre" startOffset="50%" text-anchor="middle">Presenters</textPath></text>
  <path id="clCirculo-arc-gw" d="M243.2,586.2 A252,252 0 0 0 331.9,703.9" fill="none"/><text font-size="16" font-weight="700" letter-spacing=".02em" fill="#1B4D2A"><textPath href="#clCirculo-arc-gw" startOffset="50%" text-anchor="middle">Gateways</textPath></text>
  <path id="clCirculo-arc-uc" d="M331.5,479.1 A150,150 0 0 1 405.0,370.1" fill="none"/><text font-size="16" font-weight="700" letter-spacing=".02em" fill="#5A1A1A"><textPath href="#clCirculo-arc-uc" startOffset="50%" text-anchor="middle">Use Cases</textPath></text>
  <text x="480" y="564" text-anchor="middle" font-size="16" font-weight="700" fill="#4F4F14">Entities</text>
  <path d="M480,185 V253" stroke="#556074" stroke-width="1.5"/>
  <path d="M480,283 V349" stroke="#556074" stroke-width="1.5"/>
  <path d="M480,379 V485" stroke="#556074" stroke-width="1.5"/>
  <path d="M480,515 V621" stroke="#556074" stroke-width="1.5"/>
  <path d="M480,651 V717" stroke="#556074" stroke-width="1.5"/>
  <path d="M480,747 V772 H385 V803" fill="none" stroke="#556074" stroke-width="1.5"/>
  <path d="M480,772 H575 V803" fill="none" stroke="#556074" stroke-width="1.5"/>
  <rect x="405" y="155" width="150" height="30" rx="8" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.75"/><text class="mono" x="480" y="170" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="138">ProfilePage</text>
  <rect x="415" y="253" width="130" height="30" rx="8" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.75"/><text class="mono" x="480" y="268" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="118">FeedBloc</text>
  <rect x="380" y="349" width="200" height="30" rx="8" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.75"/><text class="mono" x="480" y="364" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="188">ChangeAvatarUseCase</text>
  <rect x="412" y="485" width="136" height="30" rx="8" fill="#FFFFFF" stroke="#E3B95A" stroke-width="1.75"/><text class="mono" x="480" y="500" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#8A5A04" data-fit="124">PickedPhoto</text>
  <rect x="395" y="621" width="170" height="30" rx="8" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.75"/><text class="mono" x="480" y="636" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="158">AvatarRepository</text>
  <rect x="380" y="717" width="200" height="30" rx="8" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.75"/><text class="mono" x="480" y="732" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="188">AvatarRepositoryImpl</text>
  <rect x="294" y="803" width="182" height="30" rx="8" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.75"/><text class="mono" x="385" y="818" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0F8478" data-fit="170">DevicePhotoDataSource</text>
  <rect x="484" y="803" width="182" height="30" rx="8" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.75"/><text class="mono" x="575" y="818" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0F8478" data-fit="170">SupabaseAvatarDataSource</text>
  <rect x="180" y="918" width="240" height="44" rx="12" fill="#F4F5F8" stroke="#9AA1B2" stroke-width="1.5" stroke-dasharray="6 4"/>
  <text x="300" y="940" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#454C61">Teléfono · galería</text>
  <rect x="540" y="918" width="240" height="44" rx="12" fill="#F4F5F8" stroke="#9AA1B2" stroke-width="1.5" stroke-dasharray="6 4"/>
  <text x="660" y="940" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#454C61">Supabase Storage</text>
  <path d="M385,833 V870 H300 V916" fill="none" stroke="#C2354F" stroke-width="1.75" stroke-dasharray="5 4"/>
  <text class="mono" x="292" y="904" text-anchor="end" font-size="12.5" font-weight="700" fill="#C2354F">image_picker</text>
  <path d="M575,833 V870 H660 V916" fill="none" stroke="#C2354F" stroke-width="1.75" stroke-dasharray="5 4"/>
  <text class="mono" x="668" y="904" text-anchor="start" font-size="12.5" font-weight="700" fill="#C2354F">supabase_flutter</text>
  <text x="48" y="940" dy="0.35em" font-size="12" fill="#79809A">fuera de la app</text>
</svg>
```

Para la arquitectura, `image_picker` y `supabase_flutter` son lo mismo: algo fuera de la app con lo que hay que hablar. Por eso cada uno tiene su `DataSource` en el anillo de afuera. El caso de uso está más adentro y solo conoce el contrato `AvatarRepository`.

## La frontera

```svg
<svg id="clFrontera" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 476" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="clFrontera-ttl clFrontera-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="clFrontera-ttl">La frontera: cada lado habla su idioma</title>
  <desc id="clFrontera-dsc">A la izquierda, DevicePhotoDataSource, en la capa de datos: es el único archivo con el import de image_picker y usa ImageSource y XFile. A la derecha, el dominio, sin ningún import de image_picker: pide pick() y recibe un PickedPhoto. En medio, una línea punteada: la frontera. Hacia adentro, pick() llega sin datos y el DataSource elige ImageSource.gallery. Hacia afuera, el XFile se traduce a un PickedPhoto con los bytes y la extensión.</desc>
  <defs>
    <style>
      #clFrontera .title{fill:#161A26;font-size:22px;font-weight:700}
      #clFrontera .sub{fill:#79809A;font-size:13.5px}
      #clFrontera .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #clFrontera .foot{fill:#79809A;font-size:12px}
      #clFrontera .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #clFrontera .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #clFrontera .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#clFrontera-arrow)}
      #clFrontera .ar-rose{fill:none;stroke:#C2354F;stroke-width:1.75;marker-end:url(#clFrontera-ar-rose)}
      #clFrontera .ar-amber{fill:none;stroke:#A96C05;stroke-width:1.75;marker-end:url(#clFrontera-ar-amber)}
    </style>
    <marker id="clFrontera-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="clFrontera-ar-rose" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#C2354F"/></marker>
    <marker id="clFrontera-ar-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#A96C05"/></marker>
  </defs>
  <rect width="960" height="476" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">La frontera: cada lado habla su idioma</text>
  <text class="sub" x="48" y="80" data-fit="860">DevicePhotoDataSource traduce en los dos sentidos. Los tipos de image_picker no pasan de ahí.</text>
  <rect x="48" y="104" width="404" height="300" rx="12" fill="#FFFFFF" stroke="#86D3CA" stroke-width="2"/>
  <path d="M48,144 V116 A12,12 0 0 1 60,104 H440 A12,12 0 0 1 452,116 V144 Z" fill="#E3F6F3" stroke="#86D3CA" stroke-width="2"/>
  <text x="64" y="124" dy="0.35em" font-size="14.5" font-weight="700" fill="#0F8478" data-fit="372">DevicePhotoDataSource · datos</text>
  <rect x="560" y="104" width="352" height="300" rx="12" fill="#FFFFFF" stroke="#F0C572" stroke-width="2"/>
  <path d="M560,144 V116 A12,12 0 0 1 572,104 H900 A12,12 0 0 1 912,116 V144 Z" fill="#FFF3DC" stroke="#F0C572" stroke-width="2"/>
  <text x="576" y="124" dy="0.35em" font-size="14.5" font-weight="700" fill="#A96C05" data-fit="320">Dominio</text>
  <path d="M506,96 V412" stroke="#9AA1B2" stroke-width="2" stroke-dasharray="7 5"/>
  <text class="h" x="506" y="430" text-anchor="middle">LA FRONTERA</text>
  <rect x="64" y="160" width="372" height="32" rx="8" fill="#1F2430"/>
  <text class="mono" x="78" y="176" dy="0.35em" font-size="12.5" fill="#C9CFDA" data-fit="344">import 'package:image_picker/…';</text>
  <rect x="576" y="160" width="320" height="32" rx="8" fill="#1F2430"/>
  <text class="mono" x="590" y="176" dy="0.35em" font-size="12.5" fill="#C9CFDA" data-fit="292"><tspan fill="#9AA1B2">sin imports de image_picker</tspan></text>
  <rect x="140" y="221" width="220" height="30" rx="8" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.75"/><text class="mono" x="250" y="236" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#C2354F" data-fit="208">ImageSource.gallery</text>
  <rect x="586" y="221" width="300" height="30" rx="8" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.75"/><text class="mono" x="736" y="236" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="288">pick()</text>
  <path class="ar-amber" d="M584,236 H364"/>
  <rect x="394" y="210" width="158" height="20" rx="4" fill="#FBFBFD"/>
  <text x="473" y="224" text-anchor="middle" font-size="12" font-weight="700" fill="#454C61">entra: elige la galería</text>
  <rect x="140" y="315" width="220" height="30" rx="8" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.75"/><text class="mono" x="250" y="330" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#C2354F" data-fit="208">XFile</text>
  <rect x="586" y="315" width="300" height="30" rx="8" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.75"/><text class="mono" x="736" y="330" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="288">PickedPhoto(bytes, extension)</text>
  <path class="ar-rose" d="M362,330 H584"/>
  <rect x="394" y="304" width="158" height="20" rx="4" fill="#FBFBFD"/>
  <text x="473" y="318" text-anchor="middle" font-size="12" font-weight="700" fill="#454C61">sale y se traduce</text>
  <text x="64" y="384" font-size="12.5" fill="#454C61">Los tipos de la librería, en rosa.</text>
  <text x="576" y="384" font-size="12.5" fill="#454C61">Los tipos propios, en ámbar.</text>
  <text class="foot" x="48" y="448" data-fit="860">Si mañana cambias image_picker por otra librería, solo cambia este archivo. El caso de uso ni se entera.</text>
</svg>
```

El dominio define su propio tipo, con lo justo que necesita:

```dart
class PickedPhoto {
  final Uint8List bytes;
  final String extension;

  const PickedPhoto({required this.bytes, required this.extension});
}
```

El contrato habla solo con ese tipo. Pedir una foto no lleva parámetros:

```dart
abstract class AvatarRepository {
  Future<PickedPhoto?> pick();
}
```

Y el `DataSource` es el único archivo que importa `image_picker`. Decide que la foto sale de la galería, con `ImageSource.gallery`, y traduce el `XFile` que vuelve a un `PickedPhoto`:

```dart
import 'package:image_picker/image_picker.dart';

class DevicePhotoDataSource {
  final ImagePicker _picker = ImagePicker();

  Future<PickedPhoto?> pick() async {
    final file = await _picker.pickImage(
      source: ImageSource.gallery,
      maxWidth: 512,
      imageQuality: 80,
    );
    if (file == null) return null;
    return PickedPhoto(
      bytes: await file.readAsBytes(),
      extension: file.name.split('.').last.toLowerCase(),
    );
  }
}
```

## El viaje de una foto

```svg
<svg id="clViaje" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 668" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="clViaje-ttl clViaje-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="clViaje-ttl">El viaje de una foto de la galería</title>
  <desc id="clViaje-dsc">Un diagrama de secuencia con seis columnas: ProfilePage, FeedBloc, ChangeAvatarUseCase, AvatarRepositoryImpl, DevicePhotoDataSource y la galería del teléfono. Bajan, de izquierda a derecha: el evento AvatarChangeRequested, la llamada al caso de uso, pick en el repositorio, pick en el DataSource y pickImage con ImageSource.gallery hacia la galería. Suben de vuelta: la galería devuelve un XFile, el DataSource lo convierte en PickedPhoto y ese PickedPhoto llega al caso de uso, que sube la foto, guarda el path y borra la anterior. Luego el caso de uso devuelve el Profile al Bloc, que emite el estado con la foto nueva para ProfilePage.</desc>
  <defs>
    <style>
      #clViaje .title{fill:#161A26;font-size:22px;font-weight:700}
      #clViaje .sub{fill:#79809A;font-size:13.5px}
      #clViaje .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #clViaje .foot{fill:#79809A;font-size:12px}
      #clViaje .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #clViaje .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #clViaje .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#clViaje-arrow)}
      #clViaje .ar-amber{fill:none;stroke:#A96C05;stroke-width:1.75;marker-end:url(#clViaje-ar-amber)}
      #clViaje .ar-rose{fill:none;stroke:#C2354F;stroke-width:1.75;marker-end:url(#clViaje-ar-rose)}
      #clViaje .ar-violet{fill:none;stroke:#7439B8;stroke-width:1.75;marker-end:url(#clViaje-ar-violet)}
      #clViaje .ar-teal{fill:none;stroke:#0F8478;stroke-width:1.75;marker-end:url(#clViaje-ar-teal)}
    </style>
    <marker id="clViaje-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="clViaje-ar-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#A96C05"/></marker>
    <marker id="clViaje-ar-rose" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#C2354F"/></marker>
    <marker id="clViaje-ar-violet" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#7439B8"/></marker>
    <marker id="clViaje-ar-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#0F8478"/></marker>
  </defs>
  <rect width="960" height="668" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">El viaje de una foto de la galería</text>
  <text class="sub" x="48" y="80" data-fit="860">Baja como pick(), sin datos, y sube como PickedPhoto. image_picker solo aparece en el último tramo.</text>
  <path d="M120,144 V608" stroke="#D9DEE8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <rect x="52" y="102" width="136" height="42" rx="8" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.75"/>
  <text class="mono" x="120" y="123.0" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#7439B8" data-fit="124">ProfilePage</text>
  <path d="M264,144 V608" stroke="#D9DEE8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <rect x="196" y="102" width="136" height="42" rx="8" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.75"/>
  <text class="mono" x="264" y="123.0" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#7439B8" data-fit="124">FeedBloc</text>
  <path d="M408,144 V608" stroke="#D9DEE8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <rect x="340" y="102" width="136" height="42" rx="8" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.75"/>
  <text class="mono" x="408" y="115.5" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#A96C05" data-fit="124">ChangeAvatar</text>
  <text class="mono" x="408" y="130.5" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#A96C05" data-fit="124">UseCase</text>
  <path d="M552,144 V608" stroke="#D9DEE8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <rect x="484" y="102" width="136" height="42" rx="8" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.75"/>
  <text class="mono" x="552" y="115.5" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0F8478" data-fit="124">AvatarRepository</text>
  <text class="mono" x="552" y="130.5" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0F8478" data-fit="124">Impl</text>
  <path d="M696,144 V608" stroke="#D9DEE8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <rect x="628" y="102" width="136" height="42" rx="8" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.75"/>
  <text class="mono" x="696" y="115.5" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0F8478" data-fit="124">DevicePhoto</text>
  <text class="mono" x="696" y="130.5" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0F8478" data-fit="124">DataSource</text>
  <path d="M840,144 V608" stroke="#D9DEE8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <rect x="772" y="102" width="136" height="42" rx="8" fill="#F4F5F8" stroke="#9AA1B2" stroke-width="1.75"/>
  <text class="mono" x="840" y="123.0" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#454C61" data-fit="124">Galería</text>
  <path class="ar-violet" d="M120,186 H260"/>
  <text class="mono" x="192" y="178" text-anchor="middle" font-size="11.5" font-weight="700" fill="#7439B8">AvatarChangeRequested</text>
  <path class="ar-amber" d="M264,226 H404"/>
  <text class="mono" x="336" y="218" text-anchor="middle" font-size="11.5" font-weight="700" fill="#A96C05">call()</text>
  <path class="ar-amber" d="M408,266 H548"/>
  <text class="mono" x="480" y="258" text-anchor="middle" font-size="11.5" font-weight="700" fill="#A96C05">pick()</text>
  <path class="ar-amber" d="M552,306 H692"/>
  <text class="mono" x="624" y="298" text-anchor="middle" font-size="11.5" font-weight="700" fill="#A96C05">pick()</text>
  <path class="ar-rose" d="M696,346 H836"/>
  <text class="mono" x="768" y="338" text-anchor="middle" font-size="11.5" font-weight="700" fill="#C2354F">pickImage(ImageSource.gallery)</text>
  <path class="ar-rose" d="M840,386 H700" stroke-dasharray="6 4"/>
  <text class="mono" x="768" y="378" text-anchor="middle" font-size="11.5" font-weight="700" fill="#C2354F">XFile</text>
  <path class="ar-amber" d="M696,426 H556" stroke-dasharray="6 4"/>
  <text class="mono" x="624" y="418" text-anchor="middle" font-size="11.5" font-weight="700" fill="#A96C05">PickedPhoto</text>
  <path class="ar-amber" d="M552,466 H412" stroke-dasharray="6 4"/>
  <text class="mono" x="480" y="458" text-anchor="middle" font-size="11.5" font-weight="700" fill="#A96C05">PickedPhoto</text>
  <rect x="288" y="492" width="240" height="40" rx="8" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text x="408" y="512" dy="0.35em" text-anchor="middle" font-size="12" fill="#A96C05" font-weight="700">sube, apunta y borra · Storage</text>
  <path class="ar-amber" d="M408,558 H268" stroke-dasharray="6 4"/>
  <text class="mono" x="336" y="550" text-anchor="middle" font-size="11.5" font-weight="700" fill="#A96C05">Profile</text>
  <path class="ar-violet" d="M264,598 H124" stroke-dasharray="6 4"/>
  <text class="mono" x="192" y="590" text-anchor="middle" font-size="11.5" font-weight="700" fill="#7439B8">FeedState(profile)</text>
  <rect x="48" y="630" width="16" height="16" rx="4" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/><text x="72" y="638" dy="0.35em" font-size="12.5" fill="#454C61">tipos del dominio</text>
  <rect x="220" y="630" width="16" height="16" rx="4" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.25"/><text x="244" y="638" dy="0.35em" font-size="12.5" fill="#454C61">tipos de image_picker</text>
  <rect x="420" y="630" width="16" height="16" rx="4" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.25"/><text x="444" y="638" dy="0.35em" font-size="12.5" fill="#454C61">eventos y estados del Bloc</text>
</svg>
```

La petición baja sin datos, como `pick()`, y la foto sube como `PickedPhoto`. `ImageSource` y `XFile` solo aparecen en el último tramo, entre el `DataSource` y el teléfono. El caso de uso se lee sin saber de dónde salió la foto:

```dart
final photo = await _avatars.pick();
if (photo == null) return null;
```

Para él, `null` significa que la persona canceló. Si no canceló, sigue con los bytes: los sube, guarda el path y borra la foto anterior.

## ¿Y si llamo a image_picker desde el botón?

Funciona, pero entonces el `XFile` tiene que viajar por el evento, el `Bloc` y el caso de uso, y todo el camino queda atado a la librería. Además, el widget hace dos trabajos: dibujar y hablar con el sistema. Con la librería en su `DataSource`, el botón solo lanza el evento, y cambiar de librería, o simularla en una prueba, toca un solo archivo.
