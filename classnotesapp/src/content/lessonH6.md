# Laboratorio 5 · Flujo de Registro

Vamos a aplicar lo que hemos aprendido de momento: patrón BloC, el añadido de Clean Architecture y el uso de servicios simples como Auth y DB de Supabase.

Su tarea va a ser construir el flujo de registro que consiste en el siguiente flujo.

`1` El usuario abre la aplicación y accede a la pantalla de registro

`2` El usuario completa el formulario de registro que tiene más datos adicionales a `emial` y `password`. Para este laboratorio tenga al menos en cuenta `name`, aunque usted lo puede modificar de modo que concuerde con su proyecto final.

`3` El sistema usa los datos insertados por el usuario y primero intenta hacer el `signUp`

`4` Una vez autenticado, el sistema intenta hacer el `insert` del `Profile`

`5` Si todo resulta existoso, la aplicacion navega hasta ProfileScreen. Aquí necesitará

```dart
WidgetsBinding.instance.addPostFrameCallback((_) {
  Navigator.pushReplacementNamed(context, '/profile');
});
```

Yo se por qué se lo digo

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
