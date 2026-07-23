# Creando y Conectando un Proyecto de Firebase

Esta guía te mostrará cómo iniciar un proyecto en Firebase y conectarlo a tu aplicación de Flutter utilizando las herramientas de línea de comandos de FlutterFire.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado el siguiente software en tu sistema:

- Flutter SDK: El entorno de desarrollo de Flutter debe estar correctamente instalado y configurado en tu PATH.
- Cuenta de Firebase: Necesitas una cuenta de Google para poder crear y administrar proyectos en la Consola de Firebase (https://console.firebase.google.com/)

## Instalación de Firebase CLI

Instale la CLI de Firebase para facilitar la configuración de las notificaciones

```sh
npm install -g firebase-tools
```

Verifique en una nueva consola que tiene el comando `firebase`. Debe logearse con

```sh
firebase login
```

## Instalación de FlutterFire CLI

FlutterFire CLI es una herramienta de línea de comandos que facilita la conexión de tus aplicaciones de Flutter con Firebase. Para instalarla, ejecuta el siguiente comando en tu terminal. Puedes ejecutarlo desde cualquier directorio.

```bash
dart pub global activate flutterfire_cli
```

Este comando descarga y activa la herramienta, dejándola disponible para ser usada en cualquier proyecto de Flutter.

## 2. Conectando tu App de Flutter

Una vez instalada la CLI, navega a la raíz de tu proyecto de Flutter y ejecuta el siguiente comando. Asegúrate de reemplazar `flutterdomibaas` con el ID de tu propio proyecto de Firebase.

```bash
flutterfire configure --project=flutterdomibaas
```

Este comando realiza dos acciones importantes:

- Registra automáticamente tus apps (Android, iOS, web) en el proyecto de Firebase que especificaste.
- Genera un archivo de configuración `lib/firebase_options.dart` en tu proyecto de Flutter.

## El Archivo de Configuración Generado

El comando anterior creará un archivo `firebase_options.dart` que contiene todas las credenciales necesarias para que tu app se conecte con Firebase. Lucirá similar a esto:

```dart
import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart' show defaultTargetPlatform, kIsWeb, TargetPlatform;

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      // ... otras plataformas
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    // ... credenciales web
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: '...',
    appId: '...',
    messagingSenderId: '...',
    projectId: 'flutterdomibaas',
    // ...
  );

  static const FirebaseOptions ios = FirebaseOptions(
    // ... credenciales iOS
  );
}
```

¡Y eso es todo! Con estos pasos, tu aplicación de Flutter ya está configurada para usar los servicios de Firebase.
