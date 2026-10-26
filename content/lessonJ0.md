# Storage, CDN y caché

<!-- tags: la foto no se actualiza, bucket, path y URL pública, CDN, Cache-Control max-age,
     ImageCache, nombre de archivo aleatorio, bucket público o privado, URL firmada,
     Supabase Storage, upsert sobre el mismo nombre -->

Todo lo que guardaste hasta ahora cabía en una fila: un nombre, un texto de 280 caracteres, una fecha. Una foto no. Esta lección es solo de ideas: dónde vive un archivo, cómo llega al teléfono y por qué a veces llega una versión vieja. La siguiente pone el código.

## Dónde va cada cosa

```svg
<svg id="stDondeVa" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 468" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="stDondeVa-ttl stDondeVa-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="stDondeVa-ttl">Los bytes en Storage, el puntero en la tabla</title>
  <desc id="stDondeVa-dsc">A la izquierda, la tabla profiles con id, username, full_name y avatar_path. avatar_path guarda un texto corto: la carpeta del usuario y el nombre del archivo. Una flecha va de ese texto al archivo dentro del bucket avatars de Supabase Storage, a la derecha, que pesa 48 KB. Debajo, qué guarda cada servicio: Postgres guarda filas pequeñas que se consultan; Storage guarda archivos que se descargan enteros por una URL.</desc>
  <defs>
    <style>
      #stDondeVa .title{fill:#161A26;font-size:22px;font-weight:700}
      #stDondeVa .sub{fill:#79809A;font-size:13.5px}
      #stDondeVa .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #stDondeVa .foot{fill:#79809A;font-size:12px}
      #stDondeVa .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #stDondeVa .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #stDondeVa .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#stDondeVa-arrow)}
      #stDondeVa .ar-amber{fill:none;stroke:#A96C05;stroke-width:1.75;marker-end:url(#stDondeVa-ar-amber)}
    </style>
    <marker id="stDondeVa-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="stDondeVa-ar-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#A96C05"/></marker>
  </defs>
  <rect width="960" height="468" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Los bytes en Storage, el puntero en la tabla</text>
  <text class="sub" x="48" y="80" data-fit="860">La fila del perfil no guarda la foto. Guarda dónde está.</text>
  <rect x="48" y="112" width="400" height="176" rx="12" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="2"/>
  <path d="M48,152 V124 A12,12 0 0 1 60,112 H436 A12,12 0 0 1 448,124 V152 Z" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="2"/>
  <text class="mono" x="62" y="132" dy="0.35em" font-size="14" font-weight="700" fill="#4453C9">profiles</text>
  <text x="434" y="132" dy="0.35em" text-anchor="end" font-size="11.5" fill="#454C61" data-fit="200">Postgres</text>
  <text class="mono" x="62" y="169" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26">id</text>
  <text class="mono" x="172" y="169" dy="0.35em" font-size="12" fill="#79809A" data-fit="230">3f2a9c1e…</text>
  <rect x="408" y="159" width="28" height="20" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text x="422" y="169" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#A96C05">PK</text>
  <path d="M49,186 H447" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="62" y="203" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26">username</text>
  <text class="mono" x="172" y="203" dy="0.35em" font-size="12" fill="#79809A" data-fit="264">ana.dev</text>
  <path d="M49,220 H447" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="62" y="237" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26">full_name</text>
  <text class="mono" x="172" y="237" dy="0.35em" font-size="12" fill="#79809A" data-fit="264">Ana Gómez</text>
  <rect x="53" y="258" width="390" height="26" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text class="mono" x="62" y="271" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26">avatar_path</text>
  <text class="mono" x="172" y="271" dy="0.35em" font-size="12" fill="#A96C05" data-fit="264">'3f2a9c1e…/e4b05d11….jpg'</text>
  <rect x="560" y="112" width="352" height="176" rx="12" fill="#FFFFFF" stroke="#86D3CA" stroke-width="2"/>
  <path d="M560,152 V124 A12,12 0 0 1 572,112 H900 A12,12 0 0 1 912,124 V152 Z" fill="#E3F6F3" stroke="#86D3CA" stroke-width="2"/>
  <text x="576" y="132" dy="0.35em" font-size="14.5" font-weight="700" fill="#0F8478" data-fit="320">bucket avatars</text>
  <text x="896" y="132" dy="0.35em" text-anchor="end" font-size="11.5" fill="#454C61">Storage</text>
  <path d="M580,172 H591 L595,176 H610 V194 H580 Z" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="620" y="185" dy="0.35em" font-size="12.5" font-weight="700" fill="#0F8478">3f2a9c1e…/</text>
  <path class="tree" d="M594,198 V240 H612"/>
  <path d="M616,224 H636 L644,232 V258 H616 Z" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><path d="M636,224 V232 H644" fill="none" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="654" y="236" dy="0.35em" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="220">e4b05d11….jpg</text>
  <text x="654" y="253" dy="0.35em" font-size="11.5" fill="#79809A" data-fit="220">48 KB · image/jpeg</text>
  <rect x="848" y="216" width="48" height="48" rx="9" fill="#DCE7FF" stroke="#4453C9" stroke-width="1.5"/>
  <circle cx="872.0" cy="235.2" r="8.2" fill="#4453C9"/>
  <path d="M857.6,257.3 C859.5,244.8 884.5,244.8 886.4,257.3 Z" fill="#4453C9"/>
  <text x="892.0" y="228" text-anchor="end" font-size="10" font-weight="700" fill="#4453C9">1</text>
  <path class="ar-amber" d="M448,271 H504 V240 H612"/>
  <g transform="translate(48,316)"><rect width="400" height="77" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#4453C9" data-fit="372">Postgres guarda filas</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="372">Texto y números cortos que se filtran, ordenan</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="372">y unen con otras tablas.</text></g>
  <g transform="translate(512,316)"><rect width="400" height="77" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#0F8478" data-fit="372">Storage guarda archivos</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="372">Fotos, audios o PDF que se descargan enteros,</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="372">cada uno por su propia URL.</text></g>
  <text class="foot" x="48" y="440" data-fit="860">Los dos cambian juntos: si se borra el archivo y la fila no se entera, la fila apunta a nada.</text>
</svg>
```

Postgres es bueno para datos pequeños que se filtran y se ordenan. Para archivos está **Storage**: guarda bytes y entrega cada archivo por su propia URL. La tabla no guarda la foto. Guarda un texto corto que dice dónde está, y la app sigue ese puntero.

## Bucket, path y URL

```svg
<svg id="stRuta" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 452" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="stRuta-ttl stRuta-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="stRuta-ttl">Bucket, path y URL</title>
  <desc id="stRuta-dsc">Arriba, tres piezas en fila: el bucket avatars, la carpeta con el id de la persona y el archivo con un nombre aleatorio. La carpeta y el archivo juntos forman el path, que es lo que se guarda en avatar_path. Abajo, la URL pública completa dividida en cuatro partes de color: la dirección del proyecto, la ruta de objetos públicos de Storage, el bucket y el path.</desc>
  <defs>
    <style>
      #stRuta .title{fill:#161A26;font-size:22px;font-weight:700}
      #stRuta .sub{fill:#79809A;font-size:13.5px}
      #stRuta .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #stRuta .foot{fill:#79809A;font-size:12px}
      #stRuta .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #stRuta .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #stRuta .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#stRuta-arrow)}
    </style>
    <marker id="stRuta-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="452" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Bucket, path y URL</text>
  <text class="sub" x="48" y="80" data-fit="860">Lo que guardas en la tabla es el path. La URL se arma a partir de él.</text>
  <text class="h" x="172" y="136" text-anchor="middle" style="fill:#0F8478">BUCKET</text>
  <rect x="48" y="150" width="248" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.75"/>
  <text class="mono" x="172" y="172" dy="0.35em" text-anchor="middle" font-size="14" font-weight="700" fill="#0F8478">avatars</text>
  <text x="172" y="216" text-anchor="middle" font-size="12.5" fill="#454C61">Un contenedor con sus reglas</text>
  <text class="h" x="480" y="136" text-anchor="middle" style="fill:#4453C9">CARPETA</text>
  <rect x="356" y="150" width="248" height="44" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.75"/>
  <text class="mono" x="480" y="172" dy="0.35em" text-anchor="middle" font-size="14" font-weight="700" fill="#4453C9">3f2a9c1e-…</text>
  <text x="480" y="216" text-anchor="middle" font-size="12.5" fill="#454C61">El id de la persona</text>
  <text class="mono" x="326" y="172" dy="0.35em" text-anchor="middle" font-size="22" font-weight="700" fill="#79809A">/</text>
  <text class="h" x="788" y="136" text-anchor="middle" style="fill:#A96C05">ARCHIVO</text>
  <rect x="664" y="150" width="248" height="44" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.75"/>
  <text class="mono" x="788" y="172" dy="0.35em" text-anchor="middle" font-size="14" font-weight="700" fill="#A96C05">e4b05d11-….jpg</text>
  <text x="788" y="216" text-anchor="middle" font-size="12.5" fill="#454C61">Un nombre que no se repite</text>
  <text class="mono" x="634" y="172" dy="0.35em" text-anchor="middle" font-size="22" font-weight="700" fill="#79809A">/</text>
  <path d="M356,234 V244 H912 V234" fill="none" stroke="#A96C05" stroke-width="1.75"/>
  <path d="M634,244 V252" stroke="#A96C05" stroke-width="1.75"/>
  <text x="634" y="270" text-anchor="middle" font-size="13" font-weight="700" fill="#A96C05">el path · lo que guardas en <tspan class="mono">avatar_path</tspan></text>
  <text class="h" x="48" y="306">LA URL PÚBLICA</text>
  <rect x="48" y="318" width="864" height="38" rx="8" fill="#1F2430"/>
  <text class="mono" x="62" y="337" dy="0.35em" font-size="12.5" fill="#C9CFDA" data-fit="836"><tspan fill="#C9CFDA">https:&#x2F;&#x2F;xyz.supabase.co</tspan><tspan fill="#9AA3B5">/storage/v1/object/public/</tspan><tspan fill="#86D3CA" font-weight="700">avatars/</tspan><tspan fill="#F0C572" font-weight="700">3f2a9c1e-…/e4b05d11-….jpg</tspan></text>
  <path d="M64,364 V370 H232 V364" fill="none" stroke="#556074" stroke-width="1.5"/>
  <text x="148" y="388" text-anchor="middle" font-size="12" fill="#556074" font-weight="700">tu proyecto</text>
  <path d="M236,364 V370 H428 V364" fill="none" stroke="#556074" stroke-width="1.5"/>
  <text x="332" y="388" text-anchor="middle" font-size="12" fill="#556074" font-weight="700">objetos públicos de Storage</text>
  <path d="M432,364 V370 H488 V364" fill="none" stroke="#0F8478" stroke-width="1.5"/>
  <text x="460" y="388" text-anchor="middle" font-size="12" fill="#0F8478" font-weight="700">bucket</text>
  <path d="M492,364 V370 H705 V364" fill="none" stroke="#A96C05" stroke-width="1.5"/>
  <text x="598" y="388" text-anchor="middle" font-size="12" fill="#A96C05" font-weight="700">path</text>
  <text class="foot" x="48" y="424" data-fit="860">getPublicUrl(path) arma esa URL en el teléfono, sin ir a la red. Por eso conviene guardar el path y no la URL.</text>
</svg>
```

Un **bucket** es un contenedor de archivos con sus propias reglas, como una tabla lo es de filas. Dentro, cada archivo tiene un **path**: carpetas y nombre. La carpeta es el id de la persona, para que las reglas puedan decir «cada quien en la suya».

En la tabla se guarda el path, nunca la URL. La URL se arma con el path, y depende del proyecto y del tipo de bucket. Si mañana el bucket pasa a ser privado, las URL guardadas dejan de servir, pero los paths siguen siendo los mismos.

## Público o privado

```svg
<svg id="stPublicoPrivado" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 508" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="stPublicoPrivado-ttl stPublicoPrivado-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="stPublicoPrivado-ttl">Bucket público y bucket privado</title>
  <desc id="stPublicoPrivado-dsc">Dos paneles. En el bucket público, la app arma la URL con getPublicUrl, sin red, y cualquiera que tenga esa URL descarga el archivo; la URL es siempre la misma, así que se puede guardar en caché. En el bucket privado, la app pide await createSignedUrl con una duración; Storage revisa la política de lectura y devuelve una URL con un token que vence. Cada firma es una URL distinta. Abajo: en los dos casos, las políticas deciden quién sube y quién borra.</desc>
  <defs>
    <style>
      #stPublicoPrivado .title{fill:#161A26;font-size:22px;font-weight:700}
      #stPublicoPrivado .sub{fill:#79809A;font-size:13.5px}
      #stPublicoPrivado .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #stPublicoPrivado .foot{fill:#79809A;font-size:12px}
      #stPublicoPrivado .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #stPublicoPrivado .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #stPublicoPrivado .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#stPublicoPrivado-arrow)}
      #stPublicoPrivado .ar-teal{fill:none;stroke:#0F8478;stroke-width:1.75;marker-end:url(#stPublicoPrivado-ar-teal)}
      #stPublicoPrivado .ar-violet{fill:none;stroke:#7439B8;stroke-width:1.75;marker-end:url(#stPublicoPrivado-ar-violet)}
    </style>
    <marker id="stPublicoPrivado-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="stPublicoPrivado-ar-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#0F8478"/></marker>
    <marker id="stPublicoPrivado-ar-violet" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#7439B8"/></marker>
  </defs>
  <rect width="960" height="508" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Bucket público y bucket privado</text>
  <text class="sub" x="48" y="80" data-fit="860">Las dos clases de bucket guardan igual. Lo que cambia es quién puede leer.</text>
  <rect x="48" y="104" width="420" height="300" rx="12" fill="#FFFFFF" stroke="#86D3CA" stroke-width="2"/>
  <path d="M48,144 V116 A12,12 0 0 1 60,104 H456 A12,12 0 0 1 468,116 V144 Z" fill="#E3F6F3" stroke="#86D3CA" stroke-width="2"/>
  <text x="64" y="124" dy="0.35em" font-size="14.5" font-weight="700" fill="#0F8478" data-fit="388">Bucket público</text>
  <rect x="64" y="160" width="388" height="32" rx="8" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <text class="mono" x="76" y="176" dy="0.35em" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="364">getPublicUrl(path)</text>
  <path class="ar-teal" d="M258,194 V226"/>
  <text x="268" y="212" font-size="12" fill="#454C61">en el teléfono, sin red</text>
  <rect x="64" y="230" width="388" height="32" rx="8" fill="#1F2430"/>
  <text class="mono" x="78" y="246" dy="0.35em" font-size="12.5" fill="#C9CFDA" data-fit="360">…/object/public/avatars/{path}</text>
  <rect x="317.6" y="271" width="134" height="22" rx="11" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/><text x="385" y="282" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0F8478">siempre la misma</text>
  <circle cx="72" cy="322" r="2.5" fill="#79809A"/><text x="82" y="326" font-size="12.5" fill="#454C61" data-fit="366">Cualquiera con la URL ve el archivo.</text>
  <circle cx="72" cy="344" r="2.5" fill="#79809A"/><text x="82" y="348" font-size="12.5" fill="#454C61" data-fit="366">La URL no cambia: se puede guardar en caché.</text>
  <circle cx="72" cy="366" r="2.5" fill="#79809A"/><text x="82" y="370" font-size="12.5" fill="#454C61" data-fit="366">Para logos, portadas o fotos de productos.</text>
  <rect x="492" y="104" width="420" height="300" rx="12" fill="#FFFFFF" stroke="#C9A6EE" stroke-width="2"/>
  <path d="M492,144 V116 A12,12 0 0 1 504,104 H900 A12,12 0 0 1 912,116 V144 Z" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="2"/>
  <text x="508" y="124" dy="0.35em" font-size="14.5" font-weight="700" fill="#7439B8" data-fit="388">Bucket privado</text>
  <rect x="508" y="160" width="388" height="32" rx="8" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.25"/>
  <text class="mono" x="520" y="176" dy="0.35em" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="364">await createSignedUrl(path, 3600)</text>
  <path class="ar-violet" d="M702,194 V226"/>
  <text x="712" y="212" font-size="12" fill="#454C61">Storage revisa la política</text>
  <rect x="508" y="230" width="388" height="32" rx="8" fill="#1F2430"/>
  <text class="mono" x="522" y="246" dy="0.35em" font-size="12.5" fill="#C9CFDA" data-fit="360">…/object/sign/documents/{path}?token=…</text>
  <rect x="769.0" y="271" width="127" height="22" rx="11" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.25"/><text x="832" y="282" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#7439B8">vence en 3600 s</text>
  <circle cx="516" cy="322" r="2.5" fill="#79809A"/><text x="526" y="326" font-size="12.5" fill="#454C61" data-fit="366">Solo quien pasa la política obtiene la URL.</text>
  <circle cx="516" cy="344" r="2.5" fill="#79809A"/><text x="526" y="348" font-size="12.5" fill="#454C61" data-fit="366">Cada firma es distinta y deja de servir al vencer.</text>
  <circle cx="516" cy="366" r="2.5" fill="#79809A"/><text x="526" y="370" font-size="12.5" fill="#454C61" data-fit="366">Para fotos de perfil, recibos o documentos.</text>
  <g transform="translate(48,424)"><rect width="864" height="60" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#556074" data-fit="836">Las políticas mandan en los dos</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="836">Quién sube y quién borra lo deciden siempre las políticas. El tipo de bucket solo decide quién puede leer.</text></g>
</svg>
```

En un bucket **público** la URL es fija y cualquiera que la tenga ve el archivo, aunque no use la app. Sirve para lo que igual se muestra a todos, como el logo de una tienda. En uno **privado**, la app pide una **URL firmada**: lleva un token, vence y solo se entrega a quien pasa la política. En este curso las fotos van en buckets privados: solo las ve quien inició sesión.

Ninguno de los dos deja subir sin permiso. Las políticas deciden quién escribe y quién borra en los dos casos.

Una URL firmada cambia cada vez que se pide, así que ninguna caché la reconoce. Eso no vuelve inútil el nombre aleatorio: si la app guarda la URL mientras no vence, o si mañana el bucket pasa a ser público, el nombre que nunca se repite sigue siendo lo que evita la foto vieja.

## Qué hace un CDN

```svg
<svg id="stCdn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 500" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="stCdn-ttl stCdn-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="stCdn-ttl">Qué hace un CDN</title>
  <desc id="stCdn-dsc">Tres personas a la izquierda: Ana y Juan en Cali, Lucía en Madrid. En el centro, dos bordes del CDN, uno en Bogotá y otro en Madrid. A la derecha, el origen: el bucket de Supabase Storage. Ana pide la foto: el borde de Bogotá no la tiene (MISS), la pide al origen y se queda con una copia. Juan la pide después: el borde de Bogotá ya la tiene (HIT) y responde sin tocar el origen. Lucía la pide en Madrid: ese borde no la tiene (MISS) y va al origen.</desc>
  <defs>
    <style>
      #stCdn .title{fill:#161A26;font-size:22px;font-weight:700}
      #stCdn .sub{fill:#79809A;font-size:13.5px}
      #stCdn .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #stCdn .foot{fill:#79809A;font-size:12px}
      #stCdn .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #stCdn .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #stCdn .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#stCdn-arrow)}
      #stCdn .ar-amber{fill:none;stroke:#A96C05;stroke-width:1.75;marker-end:url(#stCdn-ar-amber)}
      #stCdn .ar-green{fill:none;stroke:#3A8235;stroke-width:1.75;marker-end:url(#stCdn-ar-green)}
    </style>
    <marker id="stCdn-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="stCdn-ar-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#A96C05"/></marker>
    <marker id="stCdn-ar-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#3A8235"/></marker>
  </defs>
  <rect width="960" height="500" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Qué hace un CDN</text>
  <text class="sub" x="48" y="80" data-fit="860">Copias del archivo en servidores cerca de quien lo pide. El origen solo responde la primera vez.</text>
  <text class="h" x="48" y="120">QUIEN PIDE</text>
  <text class="h" x="400" y="120">BORDES DEL CDN</text>
  <text class="h" x="716" y="120">ORIGEN</text>
  <rect x="48" y="128" width="176" height="48" rx="10" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
<circle cx="72" cy="152" r="12" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="72" y="152" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#556074">1</text>
  <text x="94" y="152" dy="0.35em" font-size="13" font-weight="600" fill="#161A26">Ana · Cali</text>
  <rect x="48" y="208" width="176" height="48" rx="10" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
<circle cx="72" cy="232" r="12" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="72" y="232" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#556074">2</text>
  <text x="94" y="232" dy="0.35em" font-size="13" font-weight="600" fill="#161A26">Juan · Cali</text>
  <rect x="48" y="312" width="176" height="48" rx="10" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
<circle cx="72" cy="336" r="12" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="72" y="336" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#556074">3</text>
  <text x="94" y="336" dy="0.35em" font-size="13" font-weight="600" fill="#161A26">Lucía · Madrid</text>
  <rect x="400" y="158" width="200" height="68" rx="12" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.75"/>
  <text x="416" y="180" dy="0.35em" font-size="13.5" font-weight="700" fill="#7439B8">CDN · Bogotá</text>
  <text x="416" y="204" dy="0.35em" font-size="12" fill="#454C61">guarda copias por max-age</text>
  <rect x="400" y="302" width="200" height="68" rx="12" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.75"/>
  <text x="416" y="324" dy="0.35em" font-size="13.5" font-weight="700" fill="#7439B8">CDN · Madrid</text>
  <text x="416" y="348" dy="0.35em" font-size="12" fill="#454C61">guarda copias por max-age</text>
  <rect x="716" y="150" width="196" height="220" rx="12" fill="#FFFFFF" stroke="#86D3CA" stroke-width="2"/>
  <path d="M716,190 V162 A12,12 0 0 1 728,150 H900 A12,12 0 0 1 912,162 V190 Z" fill="#E3F6F3" stroke="#86D3CA" stroke-width="2"/>
  <text x="732" y="170" dy="0.35em" font-size="14.5" font-weight="700" fill="#0F8478" data-fit="164">Storage</text>
  <text class="mono" x="732" y="214" font-size="12" font-weight="700" fill="#0F8478">avatars/</text>
  <path d="M732,230 H752 L760,238 V264 H732 Z" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><path d="M752,230 V238 H760" fill="none" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="770" y="242" dy="0.35em" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="128">e4b05d11….jpg</text>
  <rect x="770" y="288" width="56" height="56" rx="10" fill="#DCE7FF" stroke="#4453C9" stroke-width="1.5"/>
  <circle cx="798.0" cy="310.4" r="9.5" fill="#4453C9"/>
  <path d="M781.2,336.2 C783.4,321.6 812.6,321.6 814.8,336.2 Z" fill="#4453C9"/>
  <text x="822.0" y="300" text-anchor="end" font-size="11" font-weight="700" fill="#4453C9">1</text>
  <path class="ar-amber" d="M224,146 H312 V178 H398"/>
  <rect x="258" y="121" width="52" height="22" rx="11" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/><text x="284" y="132" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#A96C05">MISS</text>
  <path class="ar-green" d="M224,232 H312 V206 H398"/>
  <rect x="258" y="235" width="52" height="22" rx="11" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/><text x="284" y="246" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#3A8235">HIT</text>
  <path class="ar-amber" d="M224,336 H398"/>
  <rect x="258" y="311" width="52" height="22" rx="11" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/><text x="284" y="322" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#A96C05">MISS</text>
  <path class="ar-amber" d="M600,192 H714"/>
  <path class="ar-amber" d="M600,336 H714"/>
  <text x="657" y="182" text-anchor="middle" font-size="11.5" fill="#A96C05">la pide</text>
  <text x="657" y="352" text-anchor="middle" font-size="11.5" fill="#A96C05">la pide</text>
  <g transform="translate(48,400)"><rect width="420" height="77" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="392">MISS</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="392">El borde no la tiene: la trae del origen</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="392">y se queda con una copia.</text></g>
  <g transform="translate(492,400)"><rect width="420" height="77" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#3A8235" data-fit="392">HIT</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="392">Responde el borde, más cerca y sin tocar</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="392">el origen. La copia vale lo que diga max-age.</text></g>
</svg>
```

Un **CDN** (*Content Delivery Network*) es una red de servidores repartidos por el mundo que guardan copias de los archivos. La primera persona que pide una foto en una ciudad la trae desde el origen. Las siguientes la reciben de la copia cercana, más rápido y sin cargar el origen. Supabase pone un CDN delante de Storage.

Cuánto dura cada copia lo dice el encabezado `Cache-Control: max-age`, en segundos. Supabase usa 3600 por defecto, y al subir se puede cambiar con `cacheControl`.

## Las cachés del camino

```svg
<svg id="stCapas" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 432" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="stCapas-ttl stCapas-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="stCapas-ttl">Cuatro lugares donde puede estar la foto</title>
  <desc id="stCapas-dsc">Cuatro cajas en cadena, de izquierda a derecha: ImageCache, la memoria de la app, que se vacía al cerrarla; la caché en disco de cached_network_image o del navegador, que sobrevive al reinicio; el borde del CDN, que guarda la copia durante max-age; y el bucket, el origen, que es el único que tiene siempre la versión actual. Debajo, la llave con la que buscan las cuatro: la URL completa.</desc>
  <defs>
    <style>
      #stCapas .title{fill:#161A26;font-size:22px;font-weight:700}
      #stCapas .sub{fill:#79809A;font-size:13.5px}
      #stCapas .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #stCapas .foot{fill:#79809A;font-size:12px}
      #stCapas .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #stCapas .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #stCapas .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#stCapas-arrow)}
    </style>
    <marker id="stCapas-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="432" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Cuatro lugares donde puede estar la foto</text>
  <text class="sub" x="48" y="80" data-fit="860">Cada capa responde si ya tiene esa URL. Solo si no la tiene, pregunta a la siguiente.</text>
  <rect x="48" y="136" width="192" height="104" rx="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.75"/>
  <text x="64" y="164" font-size="15" font-weight="700" fill="#4453C9">ImageCache</text>
  <text x="64" y="186" font-size="12.5" fill="#454C61" data-fit="164">memoria de la app</text>
  <path d="M64,202 H224" stroke="#A9B4F2" stroke-width="1"/>
  <text x="64" y="224" font-size="12" fill="#4453C9" data-fit="164">se vacía al cerrar la app</text>
  <rect x="272" y="136" width="192" height="104" rx="12" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.75"/>
  <text x="288" y="164" font-size="15" font-weight="700" fill="#7439B8">Caché en disco</text>
  <text x="288" y="186" font-size="12.5" fill="#454C61" data-fit="164">cached_network_image</text>
  <path d="M288,202 H448" stroke="#C9A6EE" stroke-width="1"/>
  <text x="288" y="224" font-size="12" fill="#7439B8" data-fit="164">sobrevive al reinicio</text>
  <path class="link" d="M243,188 H269"/>
  <rect x="496" y="136" width="192" height="104" rx="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.75"/>
  <text x="512" y="164" font-size="15" font-weight="700" fill="#A96C05">Borde del CDN</text>
  <text x="512" y="186" font-size="12.5" fill="#454C61" data-fit="164">el servidor más cercano</text>
  <path d="M512,202 H672" stroke="#F0C572" stroke-width="1"/>
  <text x="512" y="224" font-size="12" fill="#A96C05" data-fit="164">dura lo que diga max-age</text>
  <path class="link" d="M467,188 H493"/>
  <rect x="720" y="136" width="192" height="104" rx="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.75"/>
  <text x="736" y="164" font-size="15" font-weight="700" fill="#0F8478">Bucket</text>
  <text x="736" y="186" font-size="12.5" fill="#454C61" data-fit="164">el origen</text>
  <path d="M736,202 H896" stroke="#86D3CA" stroke-width="1"/>
  <text x="736" y="224" font-size="12" fill="#0F8478" data-fit="164">la única versión actual</text>
  <path class="link" d="M691,188 H717"/>
  <text x="48" y="272" font-size="12.5" fill="#556074">Si una capa no la tiene, pregunta a la siguiente. La que la tiene, responde y la app no sigue.</text>
  <text class="h" x="48" y="314">LA LLAVE EN LAS CUATRO</text>
  <rect x="48" y="326" width="864" height="34" rx="8" fill="#1F2430"/>
  <text class="mono" x="62" y="343" dy="0.35em" font-size="12.5" fill="#C9CFDA" data-fit="836">https:&#x2F;&#x2F;xyz.supabase.co/storage/v1/object/public/avatars/3f2a9c1e-…/avatar.jpg</text>
  <text class="foot" x="48" y="404" data-fit="860">Si la URL no cambia, cualquier capa puede responder con la foto vieja, y la app no tiene cómo enterarse.</text>
</svg>
```

El CDN no es la única copia. `Image.network` guarda en memoria, en el `ImageCache`, cada imagen que ya descargó. `cached_network_image` y los navegadores además la guardan en disco. Las cuatro capas buscan con la misma llave: **la URL**. Si la URL es la misma, cualquiera puede contestar con lo que guardó, aunque el archivo del bucket ya sea otro.

## El problema del mismo nombre

```svg
<svg id="stMismoNombre" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 548" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="stMismoNombre-ttl stMismoNombre-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="stMismoNombre-ttl">El mismo nombre contra un nombre nuevo</title>
  <desc id="stMismoNombre-dsc">Dos filas de cuatro pasos. Arriba, con el mismo nombre: se sube la foto 1 como avatar.jpg, la app la muestra, se sube la foto 2 con upsert sobre el mismo avatar.jpg y la URL sigue igual; la app la vuelve a pedir, ImageCache ya tiene esa URL y muestra la foto 1. Abajo, con nombre aleatorio: la foto 1 es 9c1e….jpg; la foto 2 se sube como e4b0….jpg, se guarda ese path en el perfil y se borra el anterior; la URL es nueva, ninguna caché la tiene y la app muestra la foto 2.</desc>
  <defs>
    <style>
      #stMismoNombre .title{fill:#161A26;font-size:22px;font-weight:700}
      #stMismoNombre .sub{fill:#79809A;font-size:13.5px}
      #stMismoNombre .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #stMismoNombre .foot{fill:#79809A;font-size:12px}
      #stMismoNombre .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #stMismoNombre .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #stMismoNombre .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#stMismoNombre-arrow)}
      #stMismoNombre .ar-rose{fill:none;stroke:#C2354F;stroke-width:1.75;marker-end:url(#stMismoNombre-ar-rose)}
      #stMismoNombre .ar-green{fill:none;stroke:#3A8235;stroke-width:1.75;marker-end:url(#stMismoNombre-ar-green)}
    </style>
    <marker id="stMismoNombre-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="stMismoNombre-ar-rose" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#C2354F"/></marker>
    <marker id="stMismoNombre-ar-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#3A8235"/></marker>
  </defs>
  <rect width="960" height="548" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">El mismo nombre contra un nombre nuevo</text>
  <text class="sub" x="48" y="80" data-fit="860">Ana cambia su foto. Con el mismo nombre, la URL no cambia y la app sigue mostrando la vieja.</text>
  <text class="h" x="128" y="124">1 · SUBE LA FOTO 1</text>
  <text class="h" x="324" y="124">2 · LA APP LA MUESTRA</text>
  <text class="h" x="520" y="124">3 · SUBE LA FOTO 2</text>
  <text class="h" x="716" y="124">4 · LA PIDE OTRA VEZ</text>
  <rect x="48" y="146" width="864" height="164" rx="12" fill="#FFFFFF" stroke="#F3A3B2" stroke-width="1.75"/>
  <text x="64" y="228" transform="rotate(-90 64 228)" text-anchor="middle" dy="0.35em" font-size="11.5" font-weight="700" letter-spacing=".08em" fill="#C2354F">MISMO NOMBRE</text>
  <rect x="128" y="168" width="52" height="52" rx="9" fill="#DCE7FF" stroke="#4453C9" stroke-width="1.5"/>
  <circle cx="154.0" cy="188.8" r="8.8" fill="#4453C9"/>
  <path d="M138.4,212.7 C140.5,199.2 167.5,199.2 169.6,212.7 Z" fill="#4453C9"/>
  <text x="176.0" y="180" text-anchor="end" font-size="10" font-weight="700" fill="#4453C9">1</text>
  <path class="ar-rose" d="M186,194 H212"/>
  <rect x="216" y="176" width="96" height="36" rx="8" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <text x="264" y="194" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0F8478">bucket</text>
  <text class="mono" x="128" y="286" font-size="11.5" font-weight="700" fill="#161A26" data-fit="180">avatar.jpg</text>
  <rect x="324" y="162" width="76" height="104" rx="12" fill="#FFFFFF" stroke="#2A3040" stroke-width="2"/>
  <rect x="338" y="186" width="48" height="48" rx="9" fill="#DCE7FF" stroke="#4453C9" stroke-width="1.5"/>
  <circle cx="362.0" cy="205.2" r="8.2" fill="#4453C9"/>
  <path d="M347.6,227.3 C349.5,214.8 374.5,214.8 376.4,227.3 Z" fill="#4453C9"/>
  <text x="382.0" y="198" text-anchor="end" font-size="10" font-weight="700" fill="#4453C9">1</text>
  <text class="mono" x="324" y="286" font-size="11.5" font-weight="700" fill="#161A26" data-fit="180">avatar.jpg</text>
  <text x="324" y="302" font-size="11.5" fill="#C2354F" data-fit="180">MISS · la descarga</text>
  <rect x="520" y="168" width="52" height="52" rx="9" fill="#FFE3CC" stroke="#C2571A" stroke-width="1.5"/>
  <circle cx="546.0" cy="188.8" r="8.8" fill="#C2571A"/>
  <path d="M530.4,212.7 C532.5,199.2 559.5,199.2 561.6,212.7 Z" fill="#C2571A"/>
  <text x="568.0" y="180" text-anchor="end" font-size="10" font-weight="700" fill="#C2571A">2</text>
  <path class="ar-rose" d="M578,194 H604"/>
  <rect x="608" y="176" width="96" height="36" rx="8" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <text x="656" y="194" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0F8478">bucket</text>
  <text class="mono" x="520" y="286" font-size="11.5" font-weight="700" fill="#161A26" data-fit="180">avatar.jpg</text>
  <text x="520" y="302" font-size="11.5" fill="#C2354F" data-fit="180">upsert: la misma URL</text>
  <rect x="716" y="162" width="76" height="104" rx="12" fill="#FFFFFF" stroke="#2A3040" stroke-width="2"/>
  <rect x="730" y="186" width="48" height="48" rx="9" fill="#DCE7FF" stroke="#4453C9" stroke-width="1.5"/>
  <circle cx="754.0" cy="205.2" r="8.2" fill="#4453C9"/>
  <path d="M739.6,227.3 C741.5,214.8 766.5,214.8 768.4,227.3 Z" fill="#4453C9"/>
  <text x="774.0" y="198" text-anchor="end" font-size="10" font-weight="700" fill="#4453C9">1</text>
  <text class="mono" x="716" y="286" font-size="11.5" font-weight="700" fill="#161A26" data-fit="180">avatar.jpg</text>
  <text x="716" y="302" font-size="11.5" fill="#C2354F" data-fit="180">HIT en ImageCache</text>
  <rect x="804" y="201" width="92" height="22" rx="11" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.25"/><text x="850" y="212" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#C2354F">✗ la vieja</text>
  <rect x="48" y="336" width="864" height="164" rx="12" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.75"/>
  <text x="64" y="418" transform="rotate(-90 64 418)" text-anchor="middle" dy="0.35em" font-size="11.5" font-weight="700" letter-spacing=".08em" fill="#3A8235">NOMBRE ALEATORIO</text>
  <rect x="128" y="358" width="52" height="52" rx="9" fill="#DCE7FF" stroke="#4453C9" stroke-width="1.5"/>
  <circle cx="154.0" cy="378.8" r="8.8" fill="#4453C9"/>
  <path d="M138.4,402.7 C140.5,389.2 167.5,389.2 169.6,402.7 Z" fill="#4453C9"/>
  <text x="176.0" y="370" text-anchor="end" font-size="10" font-weight="700" fill="#4453C9">1</text>
  <path class="ar-green" d="M186,384 H212"/>
  <rect x="216" y="366" width="96" height="36" rx="8" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <text x="264" y="384" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0F8478">bucket</text>
  <text class="mono" x="128" y="476" font-size="11.5" font-weight="700" fill="#161A26" data-fit="180">9c1e7b20….jpg</text>
  <rect x="324" y="352" width="76" height="104" rx="12" fill="#FFFFFF" stroke="#2A3040" stroke-width="2"/>
  <rect x="338" y="376" width="48" height="48" rx="9" fill="#DCE7FF" stroke="#4453C9" stroke-width="1.5"/>
  <circle cx="362.0" cy="395.2" r="8.2" fill="#4453C9"/>
  <path d="M347.6,417.3 C349.5,404.8 374.5,404.8 376.4,417.3 Z" fill="#4453C9"/>
  <text x="382.0" y="388" text-anchor="end" font-size="10" font-weight="700" fill="#4453C9">1</text>
  <text class="mono" x="324" y="476" font-size="11.5" font-weight="700" fill="#161A26" data-fit="180">9c1e7b20….jpg</text>
  <text x="324" y="492" font-size="11.5" fill="#3A8235" data-fit="180">MISS · la descarga</text>
  <rect x="520" y="358" width="52" height="52" rx="9" fill="#FFE3CC" stroke="#C2571A" stroke-width="1.5"/>
  <circle cx="546.0" cy="378.8" r="8.8" fill="#C2571A"/>
  <path d="M530.4,402.7 C532.5,389.2 559.5,389.2 561.6,402.7 Z" fill="#C2571A"/>
  <text x="568.0" y="370" text-anchor="end" font-size="10" font-weight="700" fill="#C2571A">2</text>
  <path class="ar-green" d="M578,384 H604"/>
  <rect x="608" y="366" width="96" height="36" rx="8" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <text x="656" y="384" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0F8478">bucket</text>
  <text class="mono" x="520" y="476" font-size="11.5" font-weight="700" fill="#161A26" data-fit="180">e4b05d11….jpg</text>
  <text x="520" y="492" font-size="11.5" fill="#3A8235" data-fit="180">borra 9c1e7b20….jpg</text>
  <rect x="716" y="352" width="76" height="104" rx="12" fill="#FFFFFF" stroke="#2A3040" stroke-width="2"/>
  <rect x="730" y="376" width="48" height="48" rx="9" fill="#FFE3CC" stroke="#C2571A" stroke-width="1.5"/>
  <circle cx="754.0" cy="395.2" r="8.2" fill="#C2571A"/>
  <path d="M739.6,417.3 C741.5,404.8 766.5,404.8 768.4,417.3 Z" fill="#C2571A"/>
  <text x="774.0" y="388" text-anchor="end" font-size="10" font-weight="700" fill="#C2571A">2</text>
  <text class="mono" x="716" y="476" font-size="11.5" font-weight="700" fill="#161A26" data-fit="180">e4b05d11….jpg</text>
  <text x="716" y="492" font-size="11.5" fill="#3A8235" data-fit="180">MISS en todas · la descarga</text>
  <rect x="804" y="391" width="92" height="22" rx="11" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/><text x="850" y="402" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#3A8235">✓ la nueva</text>
  <text class="foot" x="48" y="520" data-fit="860">Un nombre que nunca se repite deja usar max-age de un año: esa URL jamás va a mostrar otra foto.</text>
</svg>
```

Si cada persona tiene un `avatar.jpg` que se sobrescribe, la URL nunca cambia y la foto nueva no llega. En los planes pagos, Supabase limpia su CDN al sobrescribir. La caché del teléfono, en cambio, nunca se entera.

La salida es que cada foto tenga **un nombre que no se repita**, por ejemplo un UUID. Cambiar la foto se vuelve tres pasos: subir con el nombre nuevo, guardar ese path en el perfil y borrar el archivo anterior. La URL nueva no está en ninguna caché, así que todas la piden de nuevo. Y como esa URL nunca va a mostrar otra cosa, puede guardarse en caché por un año.

Hay quien agrega `?v=2` al final de la URL, y el SDK lo hace con el parámetro `cacheNonce`. Funciona, pero ese número también hay que guardarlo en algún lado. Si de todas formas vas a guardar algo, guarda el path nuevo.

## Pruébalo

```interactive
storage-cache
```

Con **Mismo nombre**: abre el perfil, sube una foto nueva y vuelve a abrirlo. Después cierra y abre la app, y por último espera una hora. Mira qué capa responde cada vez. Luego cambia a **Nombre aleatorio** y repite.
