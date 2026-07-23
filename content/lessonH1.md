# Instalación de supabase

Supabase es una alternativa de código abierto a Firebase que ofrece una base de datos Postgres, autenticación, almacenamiento y mucho más. 

## 1. Configuración del Proyecto en Supabase

Antes de empezar, necesitas una cuenta en Supabase y un proyecto nuevo.

- Ve a [Supabase](https://supabase.com/)
- Crea una organización
- Crea un proyecto
- En el panel de tu proyecto, ve a `Authentication` y asegúrate de que el proveedor de `email` esté habilitado.

## 2. Instalación de Dependencias

Agrega el paquete `supabase_flutter` a tu archivo `pubspec.yaml` para poder interactuar con Supabase.

```yaml
dependencies:
  flutter:
    sdk: flutter
  supabase_flutter: ^2.10.1 
```

Luego, ejecuta `flutter pub get` en tu terminal para instalar el paquete.

## 3. Inicialización de Supabase en Flutter

Debes inicializar el cliente de Supabase en tu archivo `main.dart` antes de ejecutar la aplicación. Esto permite que el cliente de Supabase esté disponible en toda tu app.

```dart
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Supabase.initialize(
    url: 'TU_SUPABASE_URL',
    anonKey: 'TU_PUBLISHABLE_KEY',
  );
  runApp(MyApp());
}

// Obtén una referencia al cliente de Supabase
final supabase = Supabase.instance.client;
```

Recuerda reemplazar `TU_SUPABASE_URL` y `TU_PUBLISHABLE_KEY` con las credenciales de tu proyecto.

## Objetos

User → te da información de la identidad del usuario en Supabase Auth.
Ejemplo: id, email, estado de confirmación, metadatos.
Sirve para saber quién es ese usuario aunque aún no esté loggeado.

Session → representa una sesión activa (autenticación vigente).
Incluye los tokens (access_token, refresh_token), tiempo de expiración y referencia al User.
Es lo que te dice “este usuario ya está autenticado y puede hacer peticiones a la API”.
