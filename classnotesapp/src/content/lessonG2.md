# Objeto como estado en Cubit

Ya hemos visto como tener un estado como lista. Pero qué pasa si quiero representar un sólo objeto y no una lista. Estilo un objeto profile sobre una pantalla de Profile?

El principio es exactamente el mismo. En lugar de que nuestra clase de estado contenga una lista, contendrá una única instancia de nuestro objeto. También es común incluir un estado para representar cuándo el perfil se está cargando o si ha ocurrido un error.

Veamos un ejemplo para un perfil de usuario.

## 1. Definir el Estado del Perfil

Primero, definimos la clase `ProfileState` que manejará los diferentes estados posibles: inicial, carga, éxito (con los datos del perfil) y error.

```dart
// Se puede usar una clase abstracta o una clase con estados enumerados

abstract class ProfileState {}

class ProfileInitial extends ProfileState {}

class ProfileLoading extends ProfileState {}

class ProfileSuccess extends ProfileState {
  final UserProfile profile;
  ProfileSuccess(this.profile);
}

class ProfileError extends ProfileState {
  final String message;
  ProfileError(this.message);
}

// Modelo para el perfil de usuario
class UserProfile {
  final String name;
  final String email;
  UserProfile({required this.name, required this.email});
}
```

## 2. Crear el Cubit del Perfil

El `ProfileCubit` manejará la lógica para cargar el perfil.

```dart
class ProfileCubit extends Cubit<ProfileState> {
  ProfileCubit() : super(ProfileInitial());

  Future<void> fetchProfile() async {
    try {
      emit(ProfileLoading());
      // Simula una llamada a una API
      await Future.delayed(const Duration(seconds: 2));
      final profile = UserProfile(name: 'Juan Perez', email: 'juan.perez@example.com');
      emit(ProfileSuccess(profile));
    } catch (e) {
      emit(ProfileError('No se pudo cargar el perfil.'));
    }
  }
}
```

## 3. Usar el Cubit en la UI

Finalmente, en la UI, usamos `BlocBuilder` para reaccionar a los diferentes estados del perfil y mostrar la información correspondiente.

```dart
class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => ProfileCubit()..fetchProfile(), // Carga el perfil al iniciar
      child: Scaffold(
        appBar: AppBar(title: const Text('Perfil de Usuario')),
        body: BlocBuilder<ProfileCubit, ProfileState>(
          builder: (context, state) {
            if (state is ProfileLoading) {
              return const Center(child: CircularProgressIndicator());
            } else if (state is ProfileSuccess) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('Nombre: ${state.profile.name}', style: const TextStyle(fontSize: 24)),
                    Text('Email: ${state.profile.email}', style: const TextStyle(fontSize: 24)),
                  ],
                ),
              );
            } else if (state is ProfileError) {
              return Center(child: Text(state.message, style: const TextStyle(color: Colors.red)));
            } else {
              return const Center(child: Text('Presiona el botón para cargar el perfil'));
            }
          },
        ),
      ),
    );
  }
}
```

Este enfoque nos da un control muy granular sobre la UI, permitiéndote mostrar diferentes widgets para cada estado posible de nuestro objeto.
