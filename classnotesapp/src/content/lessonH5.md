# Clean Architecure

Hasta ahora, ya hemos trabajado con BLoC para separar la lógica de presentación, y con repositorios y datasources para estructurar cómo accedemos a la información. La Clean Architecture, propuesta por Robert C. Martin (Uncle Bob), lo que hace es darle un marco más completo a esta idea: dividir la app en capas bien definidas que reducen la dependencia entre UI, lógica de negocio y fuentes de datos.

En Flutter, estas capas suelen verse así

`Domain Layer`
El corazón de la app. Contiene entidades (nuestros modelos puros), use cases (la lógica de negocio) y contratos de repositorios.

`Data Layer`
Implementa los repositorios y conecta con las fuentes de datos (API, base de datos local, etc.).

`Presentation Layer`
 Maneja la UI y el estado con BLoC, consumiendo los use cases del dominio.

![Imagen](blocclean.png "icon")

[Fuente](https://dev.to/princetomarappdev/clean-code-architecture-and-bloc-in-flutter-a-comprehensive-guide-for-beginners-and-experts-33k8)

La idea clave es que:

`1` El dominio no depende de nada externo.

`2` El data layer depende del dominio (porque implementa sus contratos).

`3` El presentation layer depende del dominio (porque usa los casos de uso) pero no sabe nada de cómo llegan los datos realmente.

Esto hace que el código sea más mantenible, escalable y testeable.

Vamos a seguir la siguiente estructura de carpetas

```plain
lib/
├── features/
│   ├── auth/
│   │   ├── data/
│   │   │   ├── models/
│   │   │   ├── datasources/
│   │   │   └── repositories/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   └── usecases/
│   │   │   └── repositories/
│   │   └── presentation/
│   │       ├── bloc/
│   │       └── screens/
│   │
│   ├── user/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   │
│   └── tasks/
│       ├── data/
│       ├── domain/
│       └── presentation/
│
└── core/
```

Vamos a hacer concesiones. En nuestros proyectos, al estar usando un BaaS (Backend as a service) podríamos entender el modelo de dominio, como el modelo de toda la aplicación. Para aplicaciones de mayor escala, hay una diferencia entre los datos recibidos y el modelo de dominio. Los primeros tienen que ver más con los DTO y los segundos más con el modelo puro de la app.

De forma general, para las capas de UseCases, Repository y DataSource debemos usar el principio de inversión de control de SOLID. De modo que tenemos que crear clases abstractas para las definiciones y clases concretas para las implementaciones.

# Flujo de Registro

## Capa de Data Source

Aca solo vamos a hacer operaciones de CRUD simples

```dart
// data/datasources/auth_datasource.dart
abstract class AuthDataSource {
  Future<String> signUp(String email, String password);
  //Deveulva el userId, que será necesario para crear el registro el Profile
}

// data/datasources/profile_datasource.dart
abstract class ProfileDataSource {
  Future<void> createProfile(String userId, String name);
}
```

Implemente las clases abstractas donde debe usar el acceso porporcionado por el SDK de Supabase.

## Abstract Repository

Aca debemos tener en cuenta que las clases abstractas deben ir en el dominio y que las clases concretas que extiendan de estas deben ir en la capa de `data`.

```dart
// domain/repositories/user_repository.dart
abstract class UserRepository {
  Future<void> registerUser(String email, String password, String name);
}
```

## Implementación de Repository

La implementación de repository, ya fuera del dominio puede tener dependencias, en este caso la de los diferentes datasources. Aquí es donde se orquesta la lógica.

```dart
// data/repositories/user_repository_impl.dart
class UserRepositoryImpl implements UserRepository {
  final AuthDataSource authDataSource = AuthDataSourceImpl();
  final ProfileDataSource profileDataSource = ProfileDataSourceImpl();

  UserRepositoryImpl(this.authDataSource, this.profileDataSource);

  @override
  Future<void> registerUser(String email, String password, String name) async {
    final userId = await authDataSource.signUp(email, password);
    await profileDataSource.createProfile(userId, name);
  }
}
```

Como se evidencia, se hace la operación de registro en el servicio de GoTrue y posteriormente se usa PostgREST para enviar el user.

## Capa Use Case

La capa de UseCases modela los flujos de la aplicación, donde cada clase se enfoca en una tarea del dominio. En lugar de tener lógica repartida entre BLoCs o Repositorios, cada flujo (registro, login, búsqueda, etc.) se centraliza en un caso de uso, que orquesta la interacción con los repositorios de datos.

En esta capa, al tratarse de lógica de dominio específica, no es necesario definir una combinación de interfaz e implementación. La razón es que un caso de uso no suele tener múltiples variantes: su responsabilidad es única y concreta. En cambio, lo que sí hace el caso de uso es apoyarse en repositorios definidos como interfaces para acceder a los datos, manteniendo así la independencia de la capa de dominio frente a los detalles de infraestructura.

```dart
// domain/usecases/register_user_usecase.dart
class RegisterUserUseCase {
  final UserRepository repository = UserRepositoryImpl();

  Future<void> execute(String email, String password, String name) {
    return repository.registerUser(email, password, name);
  }
}
```

Lo que sigue de aquí en adelante es la estructura de BloC, es decir, modelar eventos, estados y las funciones que reciben eventos para emitir estados.

## BloC

Finalmente el BLoC lo que utiliza es el UseCase para realizar su operación.

```dart
import 'package:flutter_bloc/flutter_bloc.dart';

class RegisterBloc extends Bloc<RegisterEvent, RegisterState> {
  final RegisterUserUseCase registerUserUseCase = RegisterUserUseCase();

  RegisterBloc() : super(RegisterIdle()) {
    on<SubmitRegisterEvent>(_onSubmitRegister);
  }

  Future<void> _onSubmitRegister(
    SubmitRegisterEvent event,
    Emitter<RegisterState> emit,
  ) async {
    emit(RegisterLoading());
    try {
      await registerUserUseCase.execute(
        event.email,
        event.password,
        event.name,
      );
      emit(RegisterSuccess());
    } catch (e) {
      emit(RegisterError("No se pudo registrar el usuario"));
    }
  }
}
```

Modele usted los estados y eventos. No olvide que debe crear un evento y un estado abstracto generales para luego extender los eventos y estados específicos.
