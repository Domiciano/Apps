# Instalación de supabase

<!-- tags: supabase_flutter, Supabase.initialize, anonKey, publishable key, Supabase.instance.client, User y Session, WidgetsFlutterBinding.ensureInitialized, Project URL, You must initialize the supabase instance -->

Supabase es una alternativa de código abierto a Firebase que ofrece una base de datos Postgres, autenticación, almacenamiento y mucho más. Esta lección deja la app Flutter conectada a un proyecto de Supabase en la nube. Si prefieres una instancia propia con Docker (self-hosted), el cliente se inicializa igual, con la URL y la clave de esa instancia.

## 1. Configuración del Proyecto en Supabase

Antes de empezar, necesitas una cuenta en Supabase y un proyecto nuevo.

- Ve a [Supabase](https://supabase.com/)
- Crea una organización
- Crea un proyecto
- En el panel de tu proyecto, ve a `Authentication` y asegúrate de que el proveedor de `email` esté habilitado.
- Ve a `Project Settings > API` y copia dos valores: la `Project URL` y la `publishable key` (antes llamada `anon key`). Son las credenciales que usarás en el paso 3.

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

Recuerda reemplazar `TU_SUPABASE_URL` y `TU_PUBLISHABLE_KEY` con las credenciales de tu proyecto. Esa clave es pública por diseño: la seguridad de los datos la dan las políticas de la base de datos, no ocultar la clave. Nunca uses en la app la clave `service_role` (o `secret`): da acceso total.

Si intentas usar `Supabase.instance` antes de `initialize`, Flutter lanza `You must initialize the supabase instance before calling Supabase.instance`. Por eso `main` es `async` y llama a `WidgetsFlutterBinding.ensureInitialized()` primero.

## Objetos

Los dos objetos que devuelve Supabase Auth:

- `User`: la identidad del usuario. Incluye `id`, `email`, estado de confirmación y metadatos.
- `Session`: una sesión activa (autenticación vigente). Incluye los tokens (`access_token`, `refresh_token`), el tiempo de expiración y una referencia al `User`. Es lo que dice "este usuario ya está autenticado y puede hacer peticiones a la API".

Un usuario puede existir sin sesión: por ejemplo, cuando se registra y todavía debe confirmar su correo. En ese caso `user != null` y `session == null`.
