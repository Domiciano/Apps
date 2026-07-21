# Clase: Introducción a Google Maps en Flutter

Todo conocemos Google Maps, así que no necesita mayor introducción. Salvo que Google ha dispuesto Componentes UI para que los desarrolladores puedan integrar y utilizar mapas dentro de sus propias aplicaciones.

## Crear un nuevo proyecto Flutter

El primer paso es crear un nuevo proyecto de Flutter. Puedes hacerlo desde tu IDE (como VS Code o Android Studio) o utilizando la línea de comandos:

```bash
flutter create maps_hello_world
cd maps_hello_world
```

Esto creará una nueva aplicación de Flutter con la estructura básica.

## Agregar dependencias al pubspec.yaml

Abre el archivo `pubspec.yaml` en la raíz de tu proyecto y agrega las siguientes dependencias:

```yaml
dependencies:
  flutter:
    sdk: flutter
  google_maps_flutter: ^2.9.0
```

Luego, ejecuta el siguiente comando en tu terminal para obtener las nuevas dependencias:

```bash
flutter pub get
```

## Configurar claves de API de Google Maps

Para que Google Maps funcione, necesitas una clave de API y configurarla para Android e iOS.

## Obtener una API Key

1. Ve a la Google Cloud Console https://console.cloud.google.com/.
2. Crea un nuevo proyecto (o selecciona uno existente).
3. En el menú de navegación, ve a "APIs y servicios" > "Biblioteca".
4. Busca y habilita las siguientes APIs:
   - `Maps SDK for Android`
   - `Maps SDK for iOS`
5. En el menú de navegación, ve a "APIs y servicios" > "Credenciales".
6. Haz clic en "Crear credenciales" > "Clave de API".
7. Copia la clave generada.

## Android

En el archivo `android/app/src/main/AndroidManifest.xml`, agrega la siguiente etiqueta `<meta-data>` dentro de la etiqueta `<application>`:

```xml
<manifest ...>
    <application ...>
        <meta-data
            android:name="com.google.android.geo.API_KEY"
            android:value="TU_API_KEY_AQUI"/>
        <!-- Otras configuraciones de la aplicación -->
    </application>
</manifest>
```

Reemplaza `TU_API_KEY_AQUI` con la clave de API que obtuviste.

## iOS

En el archivo `ios/Runner/AppDelegate.swift`, agrega la siguiente línea dentro del método `application(_:didFinishLaunchingWithOptions:)`:

```swift
import UIKit
import Flutter
import GoogleMaps // Asegúrate de importar GoogleMaps

@UIApplicationMain
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    GMSServices.provideAPIKey("TU_API_KEY_AQUI") // Agrega esta línea
    GeneratedPluginRegistrant.register(with: self)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}
```

Reemplaza `TU_API_KEY_AQUI` con tu clave de API.

## Hola Mundo de Google Maps

Ahora, vamos a mostrar un mapa básico en tu aplicación.

## Crea un archivo lib/map_screen.dart:

Crea un nuevo archivo llamado `map_screen.dart` dentro de la carpeta `lib` y pega el siguiente código:

```dart
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  late GoogleMapController mapController;

  final LatLng _center = const LatLng(37.4219999, -122.0840575); // Google HQ

  void _onMapCreated(GoogleMapController controller) {
    mapController = controller;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Hola Google Maps')),
      body: GoogleMap(
        onMapCreated: _onMapCreated,
        initialCameraPosition: CameraPosition(
          target: _center,
          zoom: 14.0,
        ),
      ),
    );
  }
}
```

## Y en main.dart:

Modifica tu archivo `lib/main.dart` para que se vea así:

```dart
import 'package:flutter/material.dart';
import 'map_screen.dart'; // Importa tu nueva pantalla de mapa

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      home: MapScreen(), // Usa MapScreen como la pantalla principal
    );
  }
}
```

Ejecuta tu app: deberías ver el mapa centrado en Mountain View (la sede de Google).
