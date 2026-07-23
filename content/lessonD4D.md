# Image

El widget `Image` es esencial para mostrar elementos visuales en tu aplicación. Flutter te permite cargar imágenes tanto desde los assets de tu proyecto como directamente desde una URL en internet.

## Agregar Imágenes desde Assets

Para usar imágenes que vienen con tu aplicación (assets), necesitas configurarlas en el archivo `pubspec.yaml` y luego referenciarlas en tu código.

1.  Abre el archivo `pubspec.yaml` (ubicado en la raíz de tu proyecto).
2.  Busca la sección `flutter:` (no la de `dependencies`).
3.  Añade la clave `assets:` y especifica la carpeta donde guardarás tus imágenes. Por ejemplo, si tus imágenes están en una carpeta llamada `assets` en la raíz de tu proyecto:

```yaml
flutter:
  assets:
    - assets/
```

4.  Crea la carpeta `assets` en la raíz de tu proyecto y coloca allí tus imágenes (por ejemplo, `logo.png`).
5.  Ejecuta `flutter pub get` en tu terminal para que Flutter reconozca los nuevos assets.

## Mostrar una Imagen Local (desde Assets)

Una vez configurados los assets, puedes mostrar una imagen local usando `Image.asset`.

```dart
Image.asset(
  'assets/logo.png', // Ruta relativa a la carpeta assets
  width: 200,
  height: 100,
  fit: BoxFit.contain, // Ajusta la imagen dentro de sus límites
)
```

## Mostrar una Imagen desde Internet

Para mostrar imágenes alojadas en una URL, utiliza `Image.network`. Flutter las descargará y mostrará automáticamente.

```dart
Image.network(
  'https://flutter.dev/images/flutter-logo-sharing.png', // URL de la imagen
  width: 300,
  fit: BoxFit.cover, // Cubre el área disponible, recortando si es necesario
)
```

## Ejemplo Completo

Aquí tienes un ejemplo completo y funcional que demuestra cómo mostrar imágenes desde la red y desde assets (simulando un asset con un `Container` de color si no tienes uno real).

```dart trycode=ccb80513dd8e632aadd3a499337b055b
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ejemplo Image Widget',
      home: Scaffold(
        appBar: AppBar(title: const Text('Widget Image')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              const Text('Imagen desde Internet:'),
              const SizedBox(height: 10),
              Image.network(
                'https://yt3.googleusercontent.com/2__G-ckA66-4JgXPlHTGZvg8CoUIgDU6qYFnJqW-AsVeJvBRT4hCjXz4XMOjIqm4m7v431lT=s900-c-k-c0x00ffffff-no-rj',
                width: 250,
                height: 250,
                fit: BoxFit.cover,
              ),
              const SizedBox(height: 30),
              const Text('Imagen desde Assets (simulada):'),
              const SizedBox(height: 10),
              // Para un ejemplo real con assets, necesitarías:
              // Image.asset('assets/my_local_image.png', width: 200, height: 200),
              Container(
                width: 200,
                height: 200,
                color: Colors.grey[300],
                child: const Center(child: Text('Asset Image Placeholder')),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

.
