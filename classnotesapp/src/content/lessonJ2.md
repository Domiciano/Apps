# Subir Archivos a Supabase Storage

En la lección anterior, aprendiste a seleccionar imágenes de la galería y a tomar fotos con la cámara. Ahora, ¿cómo guardamos esos archivos de forma permanente? En esta lección, aprenderás a subir las imágenes a un servicio de almacenamiento en la nube llamado Supabase Storage.

## 1. Requisito: Cliente de Supabase

Asegúrate de tener la dependencia de `supabase_flutter` en tu `pubspec.yaml` y de haberla instalado.

```bash
flutter pub add supabase_flutter
```

Además, tu aplicación necesita inicializar Supabase para poder comunicarte con sus servicios. Generalmente, esto se hace en tu archivo `main.dart` antes de `runApp()`.

```dart
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Supabase.initialize(
    url: 'TU_SUPABASE_URL',
    anonKey: 'TU_SUPABASE_ANON_KEY',
  );

  runApp(const MyApp());
}
```

No olvides reemplazar `TU_SUPABASE_URL` y `TU_SUPABASE_ANON_KEY` con tus credenciales reales de Supabase.

## 2. Lógica para subir la imagen

Una vez que tienes el `File` de la imagen (obtenido con `image_picker`), puedes usar el cliente de Supabase para subirlo a un "bucket" de almacenamiento.

El proceso es el siguiente:
1.  Obtener la instancia del cliente de Supabase.
2.  Crear un nombre de archivo único para evitar sobreescribir archivos.
3.  Llamar al método `upload()` del bucket de storage.
4.  (Opcional) Obtener la URL pública para poder ver la imagen.

## Ejemplo completo: Uniendo ImagePicker y Supabase

Aquí tienes una función que combina la selección de imagen y la subida a Supabase. Esta función fue la que inspiró la lección anterior.

```dart
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

// ... dentro de tu StatefulWidget

final supabase = Supabase.instance.client;
final picker = ImagePicker();
File? _imageFile;
String? _publicUrl;

Future<void> _pickAndUploadImage(ImageSource source) async {
  try {
    final picked = await picker.pickImage(source: source);
    if (picked == null) return;

    final file = File(picked.path);
    // Crear un nombre de archivo único basado en la fecha y hora
    final fileName = 'img_${DateTime.now().millisecondsSinceEpoch.toString()}.jpg';

    // Subir imagen al bucket 'alfa'
    await supabase.storage.from('alfa').upload(fileName, file);

    // Obtener URL pública
    final url = supabase.storage.from('alfa').getPublicUrl(fileName);

    // Actualizar el estado para mostrar la imagen
    // setState(() {
    //   _imageFile = file;
    //   _publicUrl = url;
    // });

  } catch (e) {
    // Manejar el error
    print('Error al subir la imagen: $e');
  }
}
```

En este código, `alfa` es el nombre del bucket en Supabase Storage. Asegúrate de que exista y tenga los permisos correctos para la subida de archivos.

## 3. Acceder a los Archivos Subidos

Una vez que el archivo está en tu bucket de Supabase, necesitas una forma de acceder a él para mostrarlo en tu aplicación. Hay dos maneras principales de obtener la URL de un archivo.

## a) URL Pública (`getPublicUrl`)

Este método genera una URL permanente y pública para tu archivo. Cualquiera con el enlace podrá acceder al archivo, siempre y cuando las políticas de tu bucket lo permitan (por ejemplo, una política de lectura pública).

```dart
// Obtener URL pública y permanente
final String publicUrl = supabase.storage
    .from('beta') // Asegúrate de usar el nombre de tu bucket
    .getPublicUrl(fileName);
```

Usa este método para archivos que no son sensibles, como avatares públicos, imágenes de productos, etc.

## b) URL Firmada (`createSignedUrl`)

Este método genera una URL temporal y segura. La URL contiene una firma única que le da acceso al archivo por un tiempo limitado que tú defines. Es la forma más segura de dar acceso a archivos privados.

```dart
// Crear una URL firmada que expira en 1 hora (3600 segundos)
final String signedUrl = await supabase.storage
    .from('beta') // Asegúrate de usar el nombre de tu bucket
    .createSignedUrl(fileName, 60 * 60);
```

Esta URL es ideal para contenido sensible o de pago, asegurando que el enlace no pueda ser compartido y usado indefinidamente.

## Mostrando la imagen en Flutter

Independientemente del método que uses para obtener la URL, puedes usar el widget `Image.network()` para mostrar la imagen en tu aplicación.

```dart
// ... en tu widget
if (_publicUrl != null)
  Image.network(
    _publicUrl!,
    height: 200, // Ejemplo de tamaño
    fit: BoxFit.cover, // Ejemplo de ajuste
  )
```

.
