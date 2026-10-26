# Subir y mostrar archivos con Supabase Storage

<!-- tags: uploadBinary, getPublicUrl, createSignedUrl, storage.foldername, avatar_path,
     new row violates row-level security policy, The resource already exists,
     mime type is not supported, Bucket not found, FileOptions cacheControl, uuid,
     StorageException -->

Ya tienes los bytes de una foto. Ahora vas a guardarlos en un bucket, apuntar el perfil a ellos y mostrarlos. Todo sigue la idea de la lección de conceptos: cada foto con un nombre nuevo, el path en la tabla y la URL armada en el teléfono.

## Crear el bucket con una migración

El bucket, sus reglas y la columna que apunta a la foto van en una migración, igual que las tablas. Desde la carpeta de tu proyecto:

```shell
npx supabase migration new create_avatars
```

```sql
alter table public.profiles add column avatar_path text;

insert into storage.buckets
  (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 2097152,
   array['image/jpeg', 'image/png', 'image/webp']);

create policy "avatars: subir a la carpeta propia"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "avatars: ver la carpeta propia"
on storage.objects for select to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "avatars: borrar de la carpeta propia"
on storage.objects for delete to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);
```

```shell
npx supabase db push
```

`public: true` deja leer por URL a cualquiera. `file_size_limit` es de 2 MB, en bytes, y `allowed_mime_types` rechaza todo lo que no sea una imagen. Storage revisa las dos reglas antes de guardar.

## Cada quien en su carpeta

```svg
<svg id="stPoliticas" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 504" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="stPoliticas-ttl stPoliticas-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="stPoliticas-ttl">Cada quien en su carpeta</title>
  <desc id="stPoliticas-dsc">Arriba, la fila de storage.objects que crea un upload: bucket_id avatars y name con la carpeta y el archivo. storage.foldername(name) parte el nombre en carpetas y el índice 1 es la primera: el id de la persona. La política la compara con auth.uid(). Ana sube a su carpeta: coinciden y el upload pasa. Beto intenta subir a la carpeta de Ana: no coinciden y Storage responde 403, new row violates row-level security policy.</desc>
  <defs>
    <style>
      #stPoliticas .title{fill:#161A26;font-size:22px;font-weight:700}
      #stPoliticas .sub{fill:#79809A;font-size:13.5px}
      #stPoliticas .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #stPoliticas .foot{fill:#79809A;font-size:12px}
      #stPoliticas .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #stPoliticas .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #stPoliticas .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#stPoliticas-arrow)}
      #stPoliticas .ar-green{fill:none;stroke:#3A8235;stroke-width:1.75;marker-end:url(#stPoliticas-ar-green)}
      #stPoliticas .ar-rose{fill:none;stroke:#C2354F;stroke-width:1.75;marker-end:url(#stPoliticas-ar-rose)}
    </style>
    <marker id="stPoliticas-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="stPoliticas-ar-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#3A8235"/></marker>
    <marker id="stPoliticas-ar-rose" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#C2354F"/></marker>
  </defs>
  <rect width="960" height="504" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Cada quien en su carpeta</text>
  <text class="sub" x="48" y="80" data-fit="860">Cada archivo es una fila de storage.objects. La política compara la primera carpeta del nombre con quien pide.</text>
  <rect x="48" y="108" width="452" height="142" rx="12" fill="#FFFFFF" stroke="#86D3CA" stroke-width="2"/>
  <path d="M48,148 V120 A12,12 0 0 1 60,108 H488 A12,12 0 0 1 500,120 V148 Z" fill="#E3F6F3" stroke="#86D3CA" stroke-width="2"/>
  <text class="mono" x="62" y="128" dy="0.35em" font-size="14" font-weight="700" fill="#0F8478">storage.objects</text>
  <text x="486" y="128" dy="0.35em" text-anchor="end" font-size="11.5" fill="#454C61" data-fit="226">una fila por archivo</text>
  <text class="mono" x="62" y="165" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26">bucket_id</text>
  <text class="mono" x="176" y="165" dy="0.35em" font-size="12" fill="#79809A" data-fit="312">'avatars'</text>
  <rect x="53" y="186" width="442" height="26" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text class="mono" x="62" y="199" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26">name</text>
  <text class="mono" x="176" y="199" dy="0.35em" font-size="12" fill="#A96C05" data-fit="312">'3f2a9c1e…/e4b05d11….jpg'</text>
  <path d="M49,216 H499" stroke="#E4E7EE" stroke-width="1.25"/>
  <text class="mono" x="62" y="233" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26">owner_id</text>
  <text class="mono" x="176" y="233" dy="0.35em" font-size="12" fill="#79809A" data-fit="312">3f2a9c1e…</text>
  <rect x="540" y="108" width="372" height="36" rx="8" fill="#1F2430"/>
  <text class="mono" x="554" y="126" dy="0.35em" font-size="12.5" fill="#C9CFDA" data-fit="344">(storage.foldername(name))[1]</text>
  <path class="link" d="M500,199 H520 V126 H538"/>
  <text x="540" y="168" font-size="12.5" fill="#454C61">parte el nombre en carpetas y toma la primera</text>
  <rect x="540" y="185" width="120" height="22" rx="11" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/><text x="600" y="196" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#A96C05">'3f2a9c1e…'</text>
  <text class="mono" x="676" y="196" dy="0.35em" font-size="14" font-weight="700" fill="#556074">=</text>
  <rect x="700" y="178" width="212" height="36" rx="8" fill="#1F2430"/>
  <text class="mono" x="714" y="196" dy="0.35em" font-size="12.5" fill="#C9CFDA" data-fit="184">auth.uid()::text</text>
  <rect x="48" y="264" width="420" height="104" rx="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.75"/>
  <text x="64" y="292" font-size="14" font-weight="700" fill="#3A8235">Ana sube a su carpeta</text>
  <rect x="388" y="277" width="64" height="22" rx="11" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/><text x="420" y="288" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#3A8235">✓ pasa</text>
  <text x="64" y="322" font-size="12.5" fill="#454C61" data-fit="388">auth.uid() es 3f2a9c1e…</text>
  <text x="64" y="342" font-size="12.5" fill="#454C61" data-fit="388">y la carpeta también.</text>
  <rect x="492" y="264" width="420" height="104" rx="12" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.75"/>
  <text x="508" y="292" font-size="14" font-weight="700" fill="#C2354F">Beto sube a la carpeta de Ana</text>
  <rect x="832" y="277" width="64" height="22" rx="11" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.25"/><text x="864" y="288" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#C2354F">✗ 403</text>
  <text x="508" y="322" font-size="12.5" fill="#454C61" data-fit="388">auth.uid() es 7d10a4b2…: no coincide.</text>
  <text class="mono" x="508" y="342" font-size="12.5" fill="#454C61" data-fit="388">new row violates row-level security policy</text>
  <g transform="translate(48,392)"><rect width="864" height="77" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#556074" data-fit="836">Tres políticas, una por operación</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="836">insert para subir, select para ver la carpeta propia y delete para borrar. remove() necesita las dos últimas.</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="836">No hay política de update: un upsert sobre un nombre que ya existe falla con 403.</text></g>
</svg>
```

Cada archivo de Storage es una fila de la tabla `storage.objects`, y las políticas son las mismas que conoces de Postgres. `storage.foldername(name)` parte el nombre en carpetas. El `[1]` es la primera, y la política exige que sea el id de quien sube.

No hay política de `update` a propósito: ningún archivo se sobrescribe. Para cambiar la foto se sube otra.

## Subir

El nombre sale de un UUID nuevo en cada subida:

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

- `uploadBinary` recibe bytes. Existe también `upload`, que recibe un `File` de `dart:io` y por eso no sirve en web.
- `cacheControl` va en segundos: `31536000` es un año. Como el nombre no se repite, esa URL nunca va a mostrar otra foto.
- `uploadBinary` devuelve `avatars/<path>`, con el bucket adelante. Guarda el `path` que armaste tú, no lo que devuelve.

## Apuntar y borrar

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
  <text class="sub" x="48" y="80" data-fit="860">Tres operaciones contra dos servicios, en este orden. Mostrarla no necesita red para la URL.</text>
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

`remove` recibe una lista y devuelve los archivos que borró. Si la política no lo deja borrar, no lanza error: devuelve una lista vacía y el archivo sigue ahí.

## Mostrar

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

`getPublicUrl` no hace ninguna petición ni comprueba que el archivo exista: solo arma el texto de la URL. Por eso no lleva `await`. Si el archivo no está, el error aparece en `Image.network`, y `errorBuilder` pinta algo en su lugar.

Para traer la foto del autor junto a cada post, pide `avatar_path` en el select anidado y arma la URL en el data source:

```dart
.select('id, content, author:profiles!profile_id(username, avatar_path)')
```

## Bucket privado

Para archivos que no deben circular, el bucket va con `public` en `false` y una política de `select`. La que sigue deja a cada quien leer solo su carpeta:

```sql
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false);

create policy "documents: ver la carpeta propia"
on storage.objects for select to authenticated
using (
  bucket_id = 'documents'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);
```

Las de `insert` y `delete` son como las de `avatars`. Para leer, en vez de `getPublicUrl` se pide una URL firmada, que sí va a la red:

```dart
final url = await _client.storage
    .from('documents')
    .createSignedUrl(path, 3600);
```

```dart
final results = await _client.storage
    .from('documents')
    .createSignedUrlsResult(paths, 3600);
```

- El segundo número es cuántos segundos vale la URL. Después responde `400` con `"exp" claim timestamp check failed`.
- Si la política no deja leer el archivo, `createSignedUrl` lanza `StorageException` con `Object not found`. Storage no dice si el archivo existe.
- `createSignedUrlsResult` firma una lista en una sola petición. Cada resultado es un `SignedUrlSuccess` o un `SignedUrlFailure`. `createSignedUrls`, sin `Result`, quedó obsoleto.
- Cada firma es una URL distinta, así que ninguna caché la reconoce. Si vas a mostrar la misma imagen varias veces, guarda la URL firmada en el estado mientras no venza.

## Cuando algo falla

Todo error de Storage llega como `StorageException`, con `message` y `statusCode`:

- **`new row violates row-level security policy`** (403). La primera carpeta del path no es tu id, o no hay sesión. También sale si usas `upsert: true` sobre un archivo existente, porque no hay política de `update`.
- **`The resource already exists`** (409). Ya hay un archivo con ese path. Con nombres aleatorios no debería pasar.
- **`mime type text/plain is not supported`** (415). El tipo no está en `allowed_mime_types`. Revisa el `contentType`.
- **`The object exceeded the maximum allowed size`** (413). El archivo pasa del `file_size_limit`. Usa `maxWidth` e `imageQuality` al elegirla.
- **`Bucket not found`** (404). El nombre del bucket está mal escrito, o la migración no se subió.
- **La foto vieja sigue apareciendo**. Estás sobrescribiendo el mismo nombre. Vuelve a la lección de conceptos.
