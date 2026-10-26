# Subir y mostrar archivos con Supabase Storage

<!-- tags: storage.buckets en config.toml, supabase seed buckets, bucket público y privado,
     getPublicUrl, createSignedUrl, uploadBinary, avatar_path, Object not found,
     new row violates row-level security policy, URL firmada,
     exp claim timestamp check failed, StorageException -->

Ya tienes los bytes de una foto. En esta lección los guardas en un bucket, apuntas el perfil a ellos y los muestras. Se usan dos buckets, los mismos del laboratorio: `avatars`, **público**, para las fotos de perfil, y `post-images`, **privado**, para las imágenes de los posts. Son seis pasos, en el orden en que se hacen.

## Paso 1 · Declarar los buckets en config.toml

Storage se configura igual que el Auth de *Configurando los servicios*: en `supabase/config.toml`. Agrega al final del archivo:

```toml
[storage]
enabled = true

[storage.buckets.avatars]
public = true
file_size_limit = "2MiB"
allowed_mime_types = ["image/jpeg", "image/png", "image/webp"]

[storage.buckets.post-images]
public = false
file_size_limit = "2MiB"
allowed_mime_types = ["image/jpeg", "image/png", "image/webp"]
```

- Cada `[storage.buckets.<nombre>]` declara un bucket.
- `public = true` deja ver cada foto a quien tenga su URL. `public = false` exige una URL firmada.
- `file_size_limit` y `allowed_mime_types` hacen que Storage rechace archivos de más de 2 MB y todo lo que no sea una imagen.

## Paso 2 · Crear los buckets en tu proyecto

```shell
npx supabase seed buckets --linked
```

`seed buckets` crea en el proyecto vinculado cada bucket que declara `config.toml`. Si después cambias algo, corre el mismo comando y actualiza los que ya existen. En el dashboard, en `Storage`, aparecen los dos, y solo `avatars` lleva la etiqueta *Public*.

También se pueden crear a mano en `Storage > New bucket`, con el interruptor *Public bucket*. Con `config.toml` quedan escritos en el proyecto y se repiten igual en cualquier computador.

## Paso 3 · Abrirlos a quien inició sesión

```svg
<svg id="stRegla" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 452" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="stRegla-ttl stRegla-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="stRegla-ttl">Una sola regla para un bucket privado</title>
  <desc id="stRegla-dsc">A la izquierda, la política del bucket privado post-images: for all, to authenticated, using y with check bucket_id igual a post-images. A la derecha, dos columnas. Con sesión: subir, firmar una URL, ver la foto con esa URL y borrar, todo permitido. Sin sesión: subir responde 403, firmar responde Object not found y la URL pública responde 400. Abajo, lo que la regla no distingue: cualquiera con sesión puede borrar la imagen de otra persona.</desc>
  <defs>
    <style>
      #stRegla .title{fill:#161A26;font-size:22px;font-weight:700}
      #stRegla .sub{fill:#79809A;font-size:13.5px}
      #stRegla .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #stRegla .foot{fill:#79809A;font-size:12px}
      #stRegla .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #stRegla .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #stRegla .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#stRegla-arrow)}
      #stRegla .ar-green{fill:none;stroke:#3A8235;stroke-width:1.75;marker-end:url(#stRegla-ar-green)}
      #stRegla .ar-rose{fill:none;stroke:#C2354F;stroke-width:1.75;marker-end:url(#stRegla-ar-rose)}
    </style>
    <marker id="stRegla-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="stRegla-ar-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#3A8235"/></marker>
    <marker id="stRegla-ar-rose" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#C2354F"/></marker>
  </defs>
  <rect width="960" height="452" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Una sola regla para un bucket privado</text>
  <text class="sub" x="48" y="80" data-fit="860">Un bucket privado empieza cerrado. Una política abre todo a quien inició sesión, y a nadie más.</text>
  <rect x="48" y="108" width="400" height="200" rx="12" fill="#1F2430"/>
  <text class="mono" x="66" y="138" font-size="12.5" fill="#C9CFDA" data-fit="364">create policy "post-images: autenticados"</text>
  <text class="mono" x="66" y="166" font-size="12.5" fill="#C9CFDA" data-fit="364">on storage.objects</text>
  <text class="mono" x="66" y="194" font-size="12.5" fill="#F0C572" data-fit="364">for all</text>
  <text class="mono" x="66" y="222" font-size="12.5" fill="#86D3CA" data-fit="364">to authenticated</text>
  <text class="mono" x="66" y="250" font-size="12.5" fill="#A9B4F2" data-fit="364">using (bucket_id = 'post-images')</text>
  <text class="mono" x="66" y="278" font-size="12.5" fill="#A9B4F2" data-fit="364">with check (bucket_id = 'post-images');</text>
  <rect x="48" y="328" width="16" height="16" rx="4" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/><text x="72" y="336" dy="0.35em" font-size="12.5" fill="#454C61">for all · subir, ver, firmar y borrar</text>
  <rect x="48" y="352" width="16" height="16" rx="4" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/><text x="72" y="360" dy="0.35em" font-size="12.5" fill="#454C61">to authenticated · solo con sesión</text>
  <rect x="48" y="376" width="16" height="16" rx="4" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/><text x="72" y="384" dy="0.35em" font-size="12.5" fill="#454C61">bucket_id · solo en este bucket</text>
  <rect x="480" y="108" width="208" height="240" rx="12" fill="#FFFFFF" stroke="#9FD68D" stroke-width="2"/>
  <path d="M480,148 V120 A12,12 0 0 1 492,108 H676 A12,12 0 0 1 688,120 V148 Z" fill="#E8F6E3" stroke="#9FD68D" stroke-width="2"/>
  <text x="496" y="128" dy="0.35em" font-size="14.5" font-weight="700" fill="#3A8235" data-fit="176">Con sesión</text>
  <text class="mono" x="494" y="172" font-size="11.5" fill="#161A26" data-fit="180">uploadBinary</text>
  <text x="494" y="190" font-size="12" font-weight="700" fill="#3A8235" data-fit="180">✓</text>
  <text class="mono" x="494" y="216" font-size="11.5" fill="#161A26" data-fit="180">createSignedUrl</text>
  <text x="494" y="234" font-size="12" font-weight="700" fill="#3A8235" data-fit="180">✓</text>
  <text class="mono" x="494" y="260" font-size="11.5" fill="#161A26" data-fit="180">GET de la URL firmada</text>
  <text x="494" y="278" font-size="12" font-weight="700" fill="#3A8235" data-fit="180">✓</text>
  <text class="mono" x="494" y="304" font-size="11.5" fill="#161A26" data-fit="180">remove</text>
  <text x="494" y="322" font-size="12" font-weight="700" fill="#3A8235" data-fit="180">✓</text>
  <rect x="704" y="108" width="208" height="240" rx="12" fill="#FFFFFF" stroke="#F3A3B2" stroke-width="2"/>
  <path d="M704,148 V120 A12,12 0 0 1 716,108 H900 A12,12 0 0 1 912,120 V148 Z" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="2"/>
  <text x="720" y="128" dy="0.35em" font-size="14.5" font-weight="700" fill="#C2354F" data-fit="176">Sin sesión</text>
  <text class="mono" x="718" y="172" font-size="11.5" fill="#161A26" data-fit="180">uploadBinary</text>
  <text x="718" y="190" font-size="12" font-weight="700" fill="#C2354F" data-fit="180">403</text>
  <text class="mono" x="718" y="216" font-size="11.5" fill="#161A26" data-fit="180">createSignedUrl</text>
  <text x="718" y="234" font-size="12" font-weight="700" fill="#C2354F" data-fit="180">Object not found</text>
  <text class="mono" x="718" y="260" font-size="11.5" fill="#161A26" data-fit="180">GET de la URL pública</text>
  <text x="718" y="278" font-size="12" font-weight="700" fill="#C2354F" data-fit="180">400</text>
  <text class="mono" x="718" y="304" font-size="11.5" fill="#161A26" data-fit="180">remove</text>
  <text x="718" y="322" font-size="12" font-weight="700" fill="#C2354F" data-fit="180">0 archivos</text>
  <g transform="translate(480,364)"><rect width="432" height="60" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="404">Lo que no distingue</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="404">Cualquiera con sesión puede borrar la imagen de otra persona.</text></g>
</svg>
```

Un bucket privado empieza cerrado: sin una política, nadie puede subir ni leer. Uno público deja leer por URL, pero subir y borrar también necesitan política. En los dos basta una sola, y va en una migración junto con la columna que apunta a la foto:

```shell
npx supabase migration new create_avatars
```

```sql
alter table public.profiles add column avatar_path text;

create policy "avatars: usuarios autenticados"
on storage.objects for all to authenticated
using (bucket_id = 'avatars')
with check (bucket_id = 'avatars');
```

```shell
npx supabase db push
```

La de `post-images` es igual, cambiando el nombre del bucket. `for all` cubre subir, ver, firmar y borrar. `to authenticated` deja fuera a quien no inició sesión. Es la regla mínima, y tiene un precio: cualquiera con sesión puede borrar el archivo de otra persona. Para el curso basta.

## Paso 4 · Subir

Cada foto lleva un nombre nuevo, un UUID, dentro de la carpeta de quien la sube:

```shell
flutter pub add uuid
```

```dart
final SupabaseClient _client = Supabase.instance.client;
final Uuid _uuid = const Uuid();

Future<String> upload(Uint8List bytes) async {
  final uid = _client.auth.currentUser!.id;
  final path = '$uid/${_uuid.v4()}.jpg';
  await _client.storage.from('avatars').uploadBinary(
    path,
    bytes,
    fileOptions: const FileOptions(
      contentType: 'image/jpeg',
      cacheControl: '31536000',
    ),
  );
  return path;
}
```

- `uploadBinary` recibe bytes. `upload` recibe un `File` de `dart:io`, que no existe en web.
- `uploadBinary` devuelve `avatars/<path>`, con el bucket adelante. Guarda el `path` que armaste tú.
- En `post-images` se sube igual: solo cambia el nombre del bucket.

## Paso 5 · Apuntar el perfil y borrar la anterior

```svg
<svg id="stSubida" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 556" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="stSubida-ttl stSubida-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="stSubida-ttl">Cambiar la foto: subir, apuntar, borrar</title>
  <desc id="stSubida-dsc">Tres columnas: la app, el bucket avatars de Storage y la tabla profiles de Postgres. Paso 1: uploadBinary sube la foto nueva con un nombre aleatorio y aparece en el bucket. Paso 2: update cambia avatar_path de la fila al path nuevo. Paso 3: remove borra el archivo anterior del bucket. Paso 4: getPublicUrl arma la URL en el teléfono e Image.network la descarga.</desc>
  <defs>
    <style>
      #stSubida .title{fill:#161A26;font-size:22px;font-weight:700}
      #stSubida .sub{fill:#79809A;font-size:13.5px}
      #stSubida .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #stSubida .foot{fill:#79809A;font-size:12px}
      #stSubida .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #stSubida .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #stSubida .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#stSubida-arrow)}
      #stSubida .ar-green{fill:none;stroke:#3A8235;stroke-width:1.75;marker-end:url(#stSubida-ar-green)}
      #stSubida .ar-amber{fill:none;stroke:#A96C05;stroke-width:1.75;marker-end:url(#stSubida-ar-amber)}
      #stSubida .ar-rose{fill:none;stroke:#C2354F;stroke-width:1.75;marker-end:url(#stSubida-ar-rose)}
      #stSubida .ar-indigo{fill:none;stroke:#4453C9;stroke-width:1.75;marker-end:url(#stSubida-ar-indigo)}
    </style>
    <marker id="stSubida-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="stSubida-ar-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#3A8235"/></marker>
    <marker id="stSubida-ar-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#A96C05"/></marker>
    <marker id="stSubida-ar-rose" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#C2354F"/></marker>
    <marker id="stSubida-ar-indigo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#4453C9"/></marker>
  </defs>
  <rect width="960" height="556" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Cambiar la foto: subir, apuntar, borrar</text>
  <text class="sub" x="48" y="80" data-fit="860">Tres operaciones contra dos servicios, en este orden. La URL para mostrarla se arma en el teléfono.</text>
  <text class="h" x="48" y="118">LA APP</text>
  <text class="h" x="560" y="118">STORAGE · avatars</text>
  <text class="h" x="760" y="118">POSTGRES · profiles</text>
  <path d="M544,128 V456" stroke="#E4E7EE" stroke-width="1.5" stroke-dasharray="4 4"/>
  <path d="M744,128 V456" stroke="#E4E7EE" stroke-width="1.5" stroke-dasharray="4 4"/>
<circle cx="60" cy="174" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="60" y="174" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">1</text>
  <rect x="80" y="156" width="420" height="36" rx="8" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>
  <text class="mono" x="92" y="174" dy="0.35em" font-size="12" font-weight="700" fill="#3A8235" data-fit="396">uploadBinary('3f2a9c1e/e4b05d11.jpg', bytes)</text>
  <path class="ar-green" d="M500,174 H556"/>
<circle cx="60" cy="252" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="60" y="252" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">2</text>
  <rect x="80" y="234" width="420" height="36" rx="8" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text class="mono" x="92" y="252" dy="0.35em" font-size="12" font-weight="700" fill="#A96C05" data-fit="396">update({'avatar_path': '3f2a9c1e/e4b05d11.jpg'})</text>
  <path class="ar-amber" d="M500,252 H756"/>
<circle cx="60" cy="330" r="12" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text x="60" y="330" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#C2354F">3</text>
  <rect x="80" y="312" width="420" height="36" rx="8" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.25"/>
  <text class="mono" x="92" y="330" dy="0.35em" font-size="12" font-weight="700" fill="#C2354F" data-fit="396">remove(['3f2a9c1e/9c1e7b20.jpg'])</text>
  <path class="ar-rose" d="M500,330 H556"/>
<circle cx="60" cy="408" r="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="60" y="408" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9">4</text>
  <rect x="80" y="390" width="420" height="36" rx="8" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/>
  <text class="mono" x="92" y="408" dy="0.35em" font-size="12" font-weight="700" fill="#4453C9" data-fit="396">getPublicUrl(path) → Image.network(url)</text>
  <text x="512" y="408" dy="0.35em" font-size="12" fill="#4453C9">en el teléfono</text>
  <path d="M566,136 H586 L594,144 V170 H566 Z" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><path d="M586,136 V144 H594" fill="none" stroke="#9FD68D" stroke-width="1.5"/>
  <text class="mono" x="604" y="148" dy="0.35em" font-size="12.5" font-weight="700" fill="#3A8235" data-fit="130">e4b05d11….jpg</text>
  <text x="604" y="165" dy="0.35em" font-size="11.5" fill="#79809A" data-fit="130">nuevo</text>
  <path d="M566,292 H586 L594,300 V326 H566 Z" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5" stroke-dasharray="4 3"/><path d="M586,292 V300 H594" fill="none" stroke="#F3A3B2" stroke-width="1.5"/>
  <text class="mono" x="604" y="304" dy="0.35em" font-size="12.5" font-weight="700" fill="#C2354F" text-decoration="line-through" data-fit="130">9c1e7b20….jpg</text>
  <text x="604" y="321" dy="0.35em" font-size="11.5" fill="#79809A" data-fit="130">borrado</text>
  <rect x="760" y="214" width="152" height="36" rx="8" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text class="mono" x="770" y="226" dy="0.35em" font-size="11" fill="#79809A">avatar_path</text>
  <text class="mono" x="770" y="241" dy="0.35em" font-size="11.5" font-weight="700" fill="#A96C05">3f2a9c1e/e4b05d11…</text>
  <g transform="translate(48,476)"><rect width="864" height="60" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#556074" data-fit="836">Si algo falla a mitad de camino</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="836">En 1, nada cambió. En 2 o 3, sobra un archivo, pero el perfil nunca apunta a un archivo que no existe.</text></g>
</svg>
```

```dart
await _client
    .from('profiles')
    .update({'avatar_path': path})
    .eq('id', uid);

if (oldPath != null) {
  await _client.storage.from('avatars').remove([oldPath]);
}
```

`remove` recibe una lista y devuelve los archivos que borró. Si no borró nada, devuelve una lista vacía, sin error.

## Paso 6 · Mostrar

### Bucket público: getPublicUrl

```dart
final url = _client.storage.from('avatars').getPublicUrl(path);
```

```dart
Image.network(
  url,
  fit: BoxFit.cover,
  errorBuilder: (context, error, stackTrace) => const Icon(Icons.person),
)
```

`getPublicUrl` no hace ninguna petición: solo arma el texto de la URL. Por eso no lleva `await`. Como la URL no cambia, el CDN y la app pueden guardar la foto en caché, y el nombre aleatorio evita que muestren una vieja.

### Bucket privado: createSignedUrl

En un bucket privado, `getPublicUrl` arma una URL que responde `400`. Hay que pedirle a Storage una URL firmada, que sí va a la red y por eso lleva `await`:

```dart
final url = await _client.storage
    .from('post-images')
    .createSignedUrl(path, 3600);
```

El `3600` son los segundos que vale la URL. Para una lista, como las imágenes de una página del muro, se pide una URL por imagen. Storage también puede firmar varios paths en una sola petición con `createSignedUrlsResult`, pero no hace falta para empezar.

Cada firma es una URL distinta, así que ninguna caché la reconoce y la imagen se descarga cada vez que firmas. Firma al cargar la pantalla, no en cada `build`.

## Cuando algo falla

Todo error de Storage llega como `StorageException`, con `message` y `statusCode`:

- **`new row violates row-level security policy`** (403). No hay sesión, o la migración del paso 3 no se subió.
- **`Object not found`** (404) al firmar. El path no existe, o no hay sesión. Storage no distingue entre los dos casos.
- **`400` al abrir una URL de `getPublicUrl`**. El bucket es privado: usa `createSignedUrl`.
- **`"exp" claim timestamp check failed`** (400) al abrir una URL firmada. La firma venció: vuelve a cargar la pantalla para firmar de nuevo.
- **`mime type text/plain is not supported`** (415). El tipo no está en `allowed_mime_types`. Revisa el `contentType`.
- **`The object exceeded the maximum allowed size`** (413). El archivo pasa del `file_size_limit`. Usa `maxWidth` e `imageQuality` al elegirlo.
- **`Bucket not found`** (404). El nombre está mal escrito, o falta el paso 2.
