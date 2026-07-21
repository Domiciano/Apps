# Acceso a Galería y Cámara

Esta lección te enseñará cómo permitir que tu aplicación Flutter acceda a la cámara del dispositivo para tomar fotos o a la galería para seleccionar imágenes existentes.

## 1. Instalación de dependencias

Para empezar, necesitas añadir la librería `image_picker` a tu proyecto, la cual gestiona el acceso a la cámara y galería.

Abre tu terminal y ejecuta el siguiente comando en la raíz de tu proyecto Flutter:

```bash
flutter pub add image_picker
```

Esto añadirá la dependencia a tu archivo `pubspec.yaml`.

## 2. Uso de ImagePicker

El widget `ImagePicker` nos provee de los métodos necesarios para abrir la cámara o la galería del dispositivo.

## Seleccionar imagen desde la galería

Para permitir al usuario seleccionar una foto de su galería, puedes usar el método `pickImage` con `ImageSource.gallery`.

```dart
import 'package:image_picker/image_picker.dart';
import 'dart:io';

// ... dentro de tu widget

final picker = ImagePicker();

Future<void> _pickImageFromGallery() async {
  final pickedFile = await picker.pickImage(source: ImageSource.gallery);

  if (pickedFile == null) {
    // El usuario no seleccionó una imagen.
    return;
  }

  final file = File(pickedFile.path);
  // Ahora tienes el archivo de la imagen y puedes usarlo.
  // Por ejemplo, mostrarlo en un widget Image.file(file)
}
```

## Tomar una foto con la cámara

De forma similar, para abrir la cámara y permitir al usuario tomar una foto, usa `ImageSource.camera`.

```dart
import 'package:image_picker/image_picker.dart';
import 'dart:io';

// ... dentro de tu widget

final picker = ImagePicker();

Future<void> _takePhotoWithCamera() async {
  final pickedFile = await picker.pickImage(source: ImageSource.camera);

  if (pickedFile == null) {
    // El usuario canceló la captura.
    return;
  }

  final file = File(pickedFile.path);
  // Ahora tienes el archivo de la imagen capturada.
}
```

## Integración en un Widget

El siguiente es un fragmento de cómo integrarías estos métodos en botones dentro de un widget.

```dart
// ... dentro de tu StateFulWidget

ElevatedButton.icon(
  onPressed: () => _pickImageFromGallery(),
  icon: const Icon(Icons.photo_library),
  label: const Text('Seleccionar desde galería'),
),

ElevatedButton.icon(
  onPressed: () => _takePhotoWithCamera(),
  icon: const Icon(Icons.camera_alt),
  label: const Text('Tomar foto con cámara'),
),
```

## 3. Configuración adicional para macOS

Si tu aplicación va a correr en macOS, necesitas declarar los permisos de acceso a archivos en los archivos de entitlements. Añade la siguiente clave en `macos/Runner/DebugProfile.entitlements` y en `macos/Runner/Release.entitlements`:

```xml
<key>com.apple.security.files.user-selected.read-only</key>
<true/>
```

Sin esta configuración, el selector de imágenes no tendrá permiso para leer archivos del sistema en macOS.
