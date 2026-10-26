# Acceso a galería y cámara

<!-- tags: image_picker, pickImage, ImageSource.camera, XFile, readAsBytes, Image.memory,
     maxWidth e imageQuality, NSCameraUsageDescription, MissingPluginException,
     camera_access_denied, Camera not available, foto de la galería -->

Antes de guardar una foto en la nube hay que conseguirla. `image_picker` abre la galería del sistema, o la cámara, y te devuelve la foto elegida. En el curso usamos la galería. Esta lección termina con los bytes de la foto en memoria y una vista previa en pantalla. Subirlos es la siguiente.

## Instalar

```shell
flutter pub add image_picker
```

`image_picker` es un *plugin*: trae código nativo de Android e iOS. Después de agregarlo, detén la app y vuelve a correrla. Con hot reload o hot restart el código nativo no se carga, y la primera llamada falla con `MissingPluginException`.

## De la galería a unos bytes

```svg
<svg id="stPicker" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 476" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="stPicker-ttl stPicker-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="stPicker-ttl">De la galería a unos bytes</title>
  <desc id="stPicker-dsc">Una cadena de izquierda a derecha: el botón de la app llama pickImage con un source; el sistema abre la galería o la cámara, que no son de la app; vuelve un XFile, o null si se cancela; readAsBytes lo convierte en un Uint8List, que sirve para la vista previa con Image.memory o para subirlo a Storage. Abajo, dos barras de tamaño: la foto original de 4032 por 3024 pesa unos 3 MB; con maxWidth 512 e imageQuality 80 pesa unos 50 KB.</desc>
  <defs>
    <style>
      #stPicker .title{fill:#161A26;font-size:22px;font-weight:700}
      #stPicker .sub{fill:#79809A;font-size:13.5px}
      #stPicker .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #stPicker .foot{fill:#79809A;font-size:12px}
      #stPicker .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #stPicker .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #stPicker .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#stPicker-arrow)}
      #stPicker .ar-indigo{fill:none;stroke:#4453C9;stroke-width:1.75;marker-end:url(#stPicker-ar-indigo)}
      #stPicker .ar-rose{fill:none;stroke:#C2354F;stroke-width:1.75;marker-end:url(#stPicker-ar-rose)}
    </style>
    <marker id="stPicker-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="stPicker-ar-indigo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#4453C9"/></marker>
    <marker id="stPicker-ar-rose" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#C2354F"/></marker>
  </defs>
  <rect width="960" height="476" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">De la galería a unos bytes</text>
  <text class="sub" x="48" y="80" data-fit="860">pickImage abre una pantalla del sistema y devuelve un XFile, o null si la persona cancela.</text>
  <rect x="48" y="128" width="152" height="64" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.75"/>
  <text class="mono" x="124" y="152" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#4453C9" data-fit="136">pickImage(…)</text>
  <text x="124" y="174" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="136">la app la pide</text>
  <rect x="226" y="128" width="152" height="64" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.75"/>
  <text x="302" y="152" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#556074" data-fit="136">Galería · Cámara</text>
  <text x="302" y="174" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="136">pantalla del sistema</text>
  <path class="link" d="M203,160 H223"/>
  <rect x="404" y="128" width="152" height="64" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.75"/>
  <text class="mono" x="480" y="152" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#7439B8" data-fit="136">XFile?</text>
  <text x="480" y="174" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="136">null si cancela</text>
  <path class="link" d="M381,160 H401"/>
  <rect x="582" y="128" width="152" height="64" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.75"/>
  <text class="mono" x="658" y="152" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#7439B8" data-fit="136">readAsBytes()</text>
  <text x="658" y="174" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="136">lee el archivo</text>
  <path class="link" d="M559,160 H579"/>
  <rect x="760" y="128" width="152" height="64" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.75"/>
  <text class="mono" x="836" y="152" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#3A8235" data-fit="136">Uint8List</text>
  <text x="836" y="174" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="136">los bytes</text>
  <path class="link" d="M737,160 H757"/>
  <path class="link" d="M796,194 V228 H736"/>
  <path class="link" d="M876,194 V228"/>
  <rect x="536" y="212" width="196" height="32" rx="8" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.25"/>
  <text class="mono" x="634" y="228" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#161A26">Image.memory(bytes)</text>
  <text x="634" y="260" text-anchor="middle" font-size="12" fill="#454C61">vista previa</text>
  <rect x="780" y="230" width="152" height="32" rx="8" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <text class="mono" x="856" y="246" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#0F8478">uploadBinary(…)</text>
  <text x="856" y="278" text-anchor="middle" font-size="12" fill="#454C61">a Storage</text>
  <path d="M48,316 H912" stroke="#E4E7EE" stroke-width="1.5"/>
  <text class="h" x="48" y="346">CUÁNTO PESA LO QUE SUBES</text>
  <rect x="48" y="360" width="864" height="28" rx="6" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.25"/>
  <text x="60" y="374" dy="0.35em" font-size="12.5" font-weight="700" fill="#C2354F">Sin límites · 4032 × 3024 · unos 3 MB</text>
  <rect x="48" y="398" width="16" height="28" rx="4" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>
  <text x="76" y="412" dy="0.35em" font-size="12.5" font-weight="700" fill="#3A8235">maxWidth: 512, imageQuality: 80 · 512 × 384 · unos 50 KB</text>
  <text class="foot" x="48" y="448" data-fit="860">Para un avatar de 100 píxeles en pantalla, 512 píxeles sobran. Achicar en el teléfono ahorra datos al subir y al bajar.</text>
</svg>
```

`pickImage` abre una pantalla que no es tuya: la galería del sistema. Cuando la persona elige, recibes un `XFile`. Si cancela, recibes `null`, y eso no es un error: simplemente no hay foto.

```dart
final ImagePicker _picker = ImagePicker();
Uint8List? _bytes;

Future<void> _pickFromGallery() async {
  final file = await _picker.pickImage(
    source: ImageSource.gallery,
    maxWidth: 512,
    maxHeight: 512,
    imageQuality: 80,
  );
  if (file == null) return;
  final bytes = await file.readAsBytes();
  setState(() => _bytes = bytes);
}
```

- `maxWidth` y `maxHeight` achican la foto en el teléfono, sin deformarla. `imageQuality` va de 0 a 100 y comprime el JPEG. Una foto de cámara pesa varios megas, y un avatar no necesita más de 512 píxeles.
- `readAsBytes()` funciona igual en Android, iOS y web. `File` de `dart:io` no existe en web, y para subir a Storage solo necesitas los bytes.

## Mostrar la vista previa

```dart
Column(
  children: [
    if (_bytes != null)
      Container(
        width: 120,
        height: 120,
        clipBehavior: Clip.antiAlias,
        decoration: const BoxDecoration(shape: BoxShape.circle),
        child: Image.memory(_bytes!, fit: BoxFit.cover),
      ),
    ElevatedButton.icon(
      onPressed: () => _pickFromGallery(),
      icon: const Icon(Icons.photo_library_outlined),
      label: const Text('Elegir de la galería'),
    ),
  ],
)
```

`Image.memory` pinta la foto a partir de los bytes, sin red. El `Container` con `clipBehavior` la recorta en círculo.

## La cámara

Para tomar la foto en vez de elegirla, cambia `ImageSource.gallery` por `ImageSource.camera`. Es lo único que cambia.

`image_picker` no le pregunta a la persona si quiere galería o cámara: abre la que le digas. Si la app ofrece las dos, la pregunta la hace la app, por ejemplo con dos botones. En el laboratorio usamos solo la galería, que funciona igual en el simulador y en el teléfono.

## Qué pide cada plataforma

```svg
<svg id="stPermisos" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 396" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="stPermisos-ttl stPermisos-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="stPermisos-ttl">Qué pide cada plataforma</title>
  <desc id="stPermisos-dsc">Cuatro tarjetas. Android: nada que declarar, usa el selector de fotos del sistema. iOS: dos textos en ios/Runner/Info.plist, NSPhotoLibraryUsageDescription y NSCameraUsageDescription; sin el de cámara, la app se cierra al abrirla; el simulador no tiene cámara. macOS: el permiso de leer archivos elegidos en los entitlements; solo galería. Web: abre el selector de archivos del navegador.</desc>
  <defs>
    <style>
      #stPermisos .title{fill:#161A26;font-size:22px;font-weight:700}
      #stPermisos .sub{fill:#79809A;font-size:13.5px}
      #stPermisos .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #stPermisos .foot{fill:#79809A;font-size:12px}
      #stPermisos .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #stPermisos .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #stPermisos .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#stPermisos-arrow)}
    </style>
    <marker id="stPermisos-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="396" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Qué pide cada plataforma</text>
  <text class="sub" x="48" y="80" data-fit="860">image_picker usa la galería y la cámara del sistema. Algunas plataformas exigen declararlo antes.</text>
  <rect x="48" y="104" width="420" height="100" rx="12" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.75"/>
  <rect x="48" y="104" width="8" height="100" rx="4" fill="#3A8235"/>
  <text x="72" y="132" font-size="15" font-weight="700" fill="#3A8235">Android</text>
  <text class="mono" x="452" y="132" text-anchor="end" font-size="12" font-weight="700" fill="#454C61" data-fit="250">nada que declarar</text>
  <text x="72" y="158" font-size="12.5" fill="#454C61" data-fit="380">Usa el selector de fotos del sistema.</text>
  <rect x="492" y="104" width="420" height="100" rx="12" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="1.75"/>
  <rect x="492" y="104" width="8" height="100" rx="4" fill="#4453C9"/>
  <text x="516" y="132" font-size="15" font-weight="700" fill="#4453C9">iOS</text>
  <text class="mono" x="896" y="132" text-anchor="end" font-size="12" font-weight="700" fill="#454C61" data-fit="250">ios/Runner/Info.plist</text>
  <text class="mono" x="516" y="158" font-size="12.5" fill="#454C61" data-fit="380">NSPhotoLibraryUsageDescription</text>
  <text class="mono" x="516" y="176" font-size="12.5" fill="#454C61" data-fit="380">NSCameraUsageDescription</text>
  <text x="516" y="194" font-size="12.5" fill="#454C61" data-fit="380">Sin el de cámara, la app se cierra al abrirla.</text>
  <rect x="48" y="220" width="420" height="100" rx="12" fill="#FFFFFF" stroke="#C9A6EE" stroke-width="1.75"/>
  <rect x="48" y="220" width="8" height="100" rx="4" fill="#7439B8"/>
  <text x="72" y="248" font-size="15" font-weight="700" fill="#7439B8">macOS</text>
  <text class="mono" x="452" y="248" text-anchor="end" font-size="12" font-weight="700" fill="#454C61" data-fit="250">*.entitlements</text>
  <text class="mono" x="72" y="274" font-size="12.5" fill="#454C61" data-fit="380">com.apple.security.files.user-selected.read-only</text>
  <text x="72" y="292" font-size="12.5" fill="#454C61" data-fit="380">Solo galería: image_picker no abre la cámara.</text>
  <rect x="492" y="220" width="420" height="100" rx="12" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.75"/>
  <rect x="492" y="220" width="8" height="100" rx="4" fill="#A96C05"/>
  <text x="516" y="248" font-size="15" font-weight="700" fill="#A96C05">Web</text>
  <text class="mono" x="896" y="248" text-anchor="end" font-size="12" font-weight="700" fill="#454C61" data-fit="250">nada que declarar</text>
  <text x="516" y="274" font-size="12.5" fill="#454C61" data-fit="380">Abre el selector de archivos del navegador.</text>
  <text class="foot" x="48" y="368" data-fit="860">El simulador de iOS no tiene cámara: prueba la cámara en un teléfono de verdad y la galería en el simulador.</text>
</svg>
```

En iOS, agrega estas llaves dentro del `<dict>` de `ios/Runner/Info.plist`: la de fotos para la galería, y la de cámara solo si también la usas. El texto es el que el sistema le muestra a la persona cuando le pide permiso:

```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>La app usa tus fotos para elegir tu foto de perfil.</string>
<key>NSCameraUsageDescription</key>
<string>La app usa la cámara para tomar tu foto de perfil.</string>
```

En macOS, en `macos/Runner/DebugProfile.entitlements` y en `Release.entitlements`:

```xml
<key>com.apple.security.files.user-selected.read-only</key>
<true/>
```

## Cuando algo falla

- **`MissingPluginException`**. Agregaste el plugin con la app corriendo. Detenla y córrela de nuevo.
- **La app se cierra en iOS al abrir la cámara**. Falta `NSCameraUsageDescription` en `Info.plist`.
- **`PlatformException(camera_access_denied)`** o **`photo_access_denied`**. La persona negó el permiso. Atrápalo con `on PlatformException` y dile cómo activarlo en los ajustes.
- **«Camera not available.» en el simulador de iOS**. El simulador no tiene cámara: prueba la galería ahí y la cámara en un teléfono.

## Y en una app con capas

Aquí `image_picker` se llama desde el widget, para verlo funcionar. En el laboratorio no se queda ahí: va en un `DataSource`, y el resto de la app recibe solo los bytes. Por qué, en *image_picker desde Clean Architecture*.
