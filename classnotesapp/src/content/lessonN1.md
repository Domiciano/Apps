[t] Inyección de dependencias con GetIt

Hasta ahora hemos construido cada capa de nuestra arquitectura creando las instancias a mano, directamente en el `BlocProvider`. Eso funciona, pero tiene un problema: cada vez que necesitas el `SignupBloc` en una pantalla tienes que construir toda la cadena de objetos desde cero.

[st] El problema: instanciación manual

Así se ve lo que hemos estado haciendo en la capa UI:

[code:dart]
BlocProvider(
  create: (_) => SignupBloc(
    signupUsecase: SignupUsecase(
      repository: AuthRepositoryImpl(
        dataSource: SupabaseAuthDataSource(
          supabase: Supabase.instance.client,
        ),
      ),
    ),
  ),
  child: SignupScreen(),
)
[endcode]

Cada vez que se crea esta pantalla, se instancian todos los objetos de nuevo. Si `AuthRepositoryImpl` se usa en 3 pantallas distintas, tenemos 3 instancias diferentes. Eso no es lo que queremos.

[st] ¿Qué es GetIt?

`GetIt` es un service locator: un registro central donde registras tus objetos una sola vez y luego los pides desde cualquier parte del código sin necesidad de pasarlos por constructores o contextos.

[list]
Registras las dependencias al iniciar la app, una sola vez.
Desde cualquier widget o clase pides la instancia con `sl<MiClase>()`.
Puedes controlar si se crea una instancia nueva cada vez o si siempre se reutiliza la misma.
No necesitas `BuildContext` para obtener las dependencias.
[endlist]

[st] 1. Instalación

Agrega `get_it` al `pubspec.yaml`:

[code:yaml]
dependencies:
  flutter:
    sdk: flutter
  supabase_flutter: ^2.10.1
  flutter_bloc: ^9.1.0
  get_it: ^8.0.3
[endcode]

Luego ejecuta:

[code:bash]
flutter pub get
[endcode]

[st] 2. Crear el archivo de inyección

Crea un archivo `lib/injection_container.dart`. Aquí vivirá toda la configuración de dependencias de la app.

[code:dart]
import 'package:get_it/get_it.dart';

// Auth
import 'package:appmovil261/features/auth/data/sources/auth_data_source.dart';
import 'package:appmovil261/features/auth/data/repo/auth_repo_impl.dart';
import 'package:appmovil261/features/auth/domain/repo/auth_repo.dart';
import 'package:appmovil261/features/auth/domain/usecases/login_usecase.dart';
import 'package:appmovil261/features/auth/domain/usecases/logout_usecase.dart';
import 'package:appmovil261/features/auth/domain/usecases/signup_usecase.dart';
import 'package:appmovil261/features/login/ui/bloc/login_bloc.dart';
import 'package:appmovil261/features/signup/ui/bloc/signup_bloc.dart';

// Chat
import 'package:appmovil261/features/chat/data/sources/chat_data_source.dart';
import 'package:appmovil261/features/chat/data/repository/chat_repository_impl.dart';
import 'package:appmovil261/features/chat/domain/repository/chat_repository.dart';
import 'package:appmovil261/features/chat/domain/usecases/get_or_create_conversation_usecase.dart';
import 'package:appmovil261/features/chat/domain/usecases/get_profiles_usecase.dart';
import 'package:appmovil261/features/chat/domain/usecases/send_message_usecase.dart';
import 'package:appmovil261/features/chat/domain/usecases/watch_messages_usecase.dart';
import 'package:appmovil261/features/chat/ui/bloc/chat_bloc.dart';
import 'package:appmovil261/features/chat/ui/bloc/users_bloc.dart';

// Post
import 'package:appmovil261/features/post/data/sources/post_data_source.dart';
import 'package:appmovil261/features/post/data/repository/post_repository_impl.dart';
import 'package:appmovil261/features/post/domain/repository/post_repository.dart';
import 'package:appmovil261/features/post/domain/usecases/create_post_usecase.dart';
import 'package:appmovil261/features/post/domain/usecases/fetch_posts_usecase.dart';
import 'package:appmovil261/features/post/ui/bloc/post_bloc.dart';
import 'package:appmovil261/features/post/ui/bloc/posts_list_bloc.dart';

// Profile
import 'package:appmovil261/features/profile/data/source/profile_data_source.dart';
import 'package:appmovil261/features/profile/data/repository/profile_repository_impl.dart';
import 'package:appmovil261/features/profile/domain/repository/profile_repository.dart';
import 'package:appmovil261/features/profile/ui/bloc/profile_bloc.dart';

final sl = GetIt.instance;

Future<void> initDependencies() async {
  // ── Auth ────────────────────────────────────────────
  sl.registerLazySingleton(() => AuthDataSource());
  sl.registerLazySingleton<AuthRepo>(() => AuthRepoImpl());
  sl.registerLazySingleton(() => LoginUsecase());
  sl.registerLazySingleton(() => LogoutUsecase());
  sl.registerLazySingleton(() => SignupUsecase());
  sl.registerFactory(() => LoginBloc());
  sl.registerFactory(() => SignupBloc());

  // ── Chat ────────────────────────────────────────────
  sl.registerLazySingleton(() => ChatDataSource());
  sl.registerLazySingleton<ChatRepository>(() => ChatRepositoryImpl());
  sl.registerLazySingleton(() => GetOrCreateConversationUsecase());
  sl.registerLazySingleton(() => GetProfilesUsecase());
  sl.registerLazySingleton(() => SendMessageUsecase());
  sl.registerLazySingleton(() => WatchMessagesUsecase());
  sl.registerFactory(() => ChatBloc());
  sl.registerFactory(() => UsersBloc());

  // ── Post ────────────────────────────────────────────
  sl.registerLazySingleton(() => PostDataSource());
  sl.registerLazySingleton<PostRepository>(() => PostRepositoryImpl());
  sl.registerLazySingleton(() => CreatePostUsecase());
  sl.registerLazySingleton(() => FetchPostsUsecase());
  sl.registerFactory(() => PostBloc());
  sl.registerFactory(() => PostsListBloc());

  // ── Profile ─────────────────────────────────────────
  sl.registerLazySingleton(() => ProfileDataSource());
  sl.registerLazySingleton<ProfileRepository>(() => ProfileRepositoryImpl());
  sl.registerFactory(() => ProfileBloc());
}
[endcode]

`sl()` dentro de un registro le dice a GetIt: "busca en el registro la instancia del tipo que este parámetro espera". No tienes que escribir el tipo explícitamente, lo infiere solo.

[st] Tipos de registro

Hay dos que usarás casi siempre:

[list]
`registerLazySingleton` — crea la instancia la primera vez que se pide y la reutiliza siempre. Ideal para repositorios y data sources.
`registerFactory` — crea una instancia nueva cada vez que se pide. Ideal para BloCs, porque cada pantalla necesita su propio estado limpio.
[endlist]

[st] 3. Inicializar en main.dart

Llama a `initDependencies()` antes de arrancar la app:

[code:dart]
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'injection_container.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Supabase.initialize(
    url: 'TU_SUPABASE_URL',
    anonKey: 'TU_PUBLISHABLE_KEY',
  );

  await initDependencies();

  runApp(const MyApp());
}
[endcode]

El orden importa: primero inicializa Supabase (porque `injection_container.dart` va a pedir `Supabase.instance.client`), luego registra las dependencias.

[st] 4. Usar en la UI

Ahora el `BlocProvider` queda limpio. Solo le pides el BloC al service locator:

[code:dart]
BlocProvider(
  create: (_) => sl<SignupBloc>(),
  child: const SignupScreen(),
)
[endcode]

El `sl<SignupBloc>()` ejecuta el `registerFactory` que definiste, que a su vez llama `sl<SignupUsecase>()`, que llama `sl<AuthRepository>()`, y así toda la cadena se resuelve automáticamente.

[st] Cómo queda el flujo

[mermaid]
flowchart TD
  A([main.dart]) --> B[initDependencies]
  B --> C[Supabase.client → singleton]
  B --> D[SupabaseAuthDataSource → singleton]
  B --> E[AuthRepositoryImpl → singleton]
  B --> F[SignupUsecase → singleton]
  B --> G[SignupBloc → factory]
  H([UI: BlocProvider]) -->|sl&lt;SignupBloc&gt;| G
  G -->|sl&lt;SignupUsecase&gt;| F
  F -->|sl&lt;AuthRepository&gt;| E
  E -->|sl&lt;SupabaseAuthDataSource&gt;| D
  D -->|sl&lt;SupabaseClient&gt;| C
[endmermaid]

[st] Resumen

[list]
Instala `get_it` en `pubspec.yaml`.
Crea `lib/injection_container.dart` con la variable global `sl` y la función `initDependencies()`.
Usa `registerLazySingleton` para data sources y repositories.
Usa `registerFactory` para BloCs.
Llama a `initDependencies()` en `main.dart` antes de `runApp`.
En la UI sustituye la construcción manual por `sl<MiBloc>()`.
[endlist]
