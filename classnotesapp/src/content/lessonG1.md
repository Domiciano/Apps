# Cubit y estados

En esta lección, exploraremos cómo manejar el estado en una aplicación de Flutter utilizando `Cubit`, una solución ligera y predecible para la gestión de estado que forma parte del ecosistema `flutter_bloc`.

## ¿Qué es un Cubit?

Un `Cubit` es una clase que se encarga de almacenar y exponer un estado observable.
A diferencia de otras soluciones más complejas, un Cubit ofrece una API sencilla: expone funciones que pueden ser llamadas para actualizar y emitir nuevos estados.

Su principal ventaja es que centraliza el estado en un único punto, separándolo del árbol de componentes.
De esta forma, evitamos el problema del prop-drilling (pasar estados y funciones manualmente a través de múltiples niveles de widgets) y logramos una gestión de estado más limpia y desacoplada.

## Paso 1: Configuración del Proyecto

Primero, creamos un nuevo proyecto de Flutter y agregamos la dependencia `flutter_bloc`.

## Crear el Proyecto

```bash
flutter create --org icesi.edu.co cubitexample
```

## Agregar Dependencia

Abre tu archivo `pubspec.yaml` y agrega `flutter_bloc` a las dependencias:

```yaml
dependencies:
  flutter:
    sdk: flutter
  flutter_bloc: ^9.1.1
```

Luego, ejecuta `flutter pub get` en tu terminal para instalar el paquete.

## Paso 2: Definiendo el Estado

El estado es la información que nuestra UI mostrará. En este caso, queremos manejar una lista de contactos.

## Modelo de Datos

Primero, definimos un modelo `Contact` para representar cada contacto.

```dart
class Contact {
  final String id;
  final String name;
  final String email;
  final String phone;

  Contact({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
  });
}
```

## Clase de Estado

Luego, creamos una clase `ContactState` que contendrá la lista de contactos. Es una buena práctica hacer que el estado sea inmutable.

```dart
class ContactState {
  final List<Contact> contacts;

  ContactState({this.contacts = const []});
}
```

## Paso 3: Creando el Cubit

El `Cubit` será responsable de manejar la lógica de negocio y emitir nuevos estados.

```dart
import 'package:cubitexample/state/ContactState.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ContactCubit extends Cubit<ContactState> {
  // El estado inicial se pasa al constructor de la superclase.
  ContactCubit() : super(ContactState());

  // Función para agregar un nuevo contacto
  void addProfile(Contact contact) {
    // Creamos una nueva lista con el contacto agregado
    final updatedContacts = [...state.contacts, contact];
    // Emitimos un nuevo estado con la lista actualizada
    emit(ContactState(contacts: updatedContacts));
  }

  // Función para eliminar un contacto por su ID
  void removeProfile(String id) {
    // Filtramos la lista para excluir el contacto a eliminar
    final updatedContacts = state.contacts.where((c) => c.id != id).toList();
    // Emitimos un nuevo estado
    emit(ContactState(contacts: updatedContacts));
  }
}
```

- `ContactCubit` extiende `Cubit<ContactState>`, lo que significa que manejará estados de tipo `ContactState`.
- El estado inicial se establece en el constructor (`super(ContactState())`).
- Las funciones `addProfile` y `removeProfile` emiten nuevos estados usando `emit()`. Es crucial crear una nueva instancia del estado en lugar de mutar la existente.

## Paso 4: Integrando el Cubit en la UI

Ahora, conectaremos nuestro `Cubit` a la interfaz de usuario de Flutter.

## BlocProvider

Para que un `Cubit` esté disponible en el árbol de widgets, usamos `BlocProvider`. Este widget crea e inyecta una instancia del `Cubit`.

```dart
class ContactScreen extends StatelessWidget {
  const ContactScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // BlocProvider crea y provee el ContactCubit al árbol de widgets.
    return BlocProvider(
      create: (_) => ContactCubit(),
      child: Scaffold(
        // ... el resto de la UI
      ),
    );
  }
}
```

## BlocBuilder

Para escuchar los cambios de estado y reconstruir la UI, usamos `BlocBuilder`.

```dart
// ... dentro del Scaffold
body: BlocBuilder<ContactCubit, ContactState>(
  builder: (context, state) {
    // El builder se ejecuta cada vez que el estado cambia.
    return SafeArea(
      child: Column(
        children: [
          ElevatedButton(
            onPressed: () {
              // Accedemos al Cubit y llamamos a la función para agregar un contacto.
              context.read<ContactCubit>().addProfile(
                Contact(
                  id: "Alfa",
                  name: "Señor Kevin",
                  email: "senorkevin@gmail.com",
                  phone: "3117182279",
                ),
              );
            },
            child: Text("Agregar datos"),
          ),
          Expanded(
            child: ListView(
              // Usamos la lista de contactos del estado actual.
              children: state.contacts.map((c) {
                return ListTile(title: Text(c.name));
              }).toList(),
            ),
          ),
        ],
      ),
    );
  },
),
```

- `BlocBuilder<ContactCubit, ContactState>` se suscribe a `ContactCubit` y reconstruye su `builder` en respuesta a nuevos `ContactState`.
- `context.read<ContactCubit>()` nos da acceso a la instancia del `Cubit` sin suscribirnos a los cambios. Es ideal para llamar funciones en eventos como `onPressed`.

## Ejemplo completo en un sólo script

Finalmente, aquí está el código completo para `main.dart` que une todo.

```dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// --- Clases de Estado y Modelo ---
class Contact {
  final String id;
  final String name;
  final String email;
  final String phone;
  Contact({required this.id, required this.name, required this.email, required this.phone});
}

class ContactState {
  final List<Contact> contacts;
  ContactState({this.contacts = const []});
}

// --- Cubit ---
class ContactCubit extends Cubit<ContactState> {
  ContactCubit() : super(ContactState());

  void addProfile(Contact contact) {
    emit(ContactState(contacts: [...state.contacts, contact]));
  }

  void removeProfile(String id) {
    emit(ContactState(contacts: [...state.contacts.where((c) => c.id != id)]));
  }
}

// --- Aplicación Principal ---
void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Cubit Example',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const ContactScreen(),
    );
  }
}

// --- Pantalla de Contactos ---
class ContactScreen extends StatelessWidget {
  const ContactScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => ContactCubit(),
      child: Scaffold(
        appBar: AppBar(title: const Text('Contactos con Cubit')),
        body: BlocBuilder<ContactCubit, ContactState>(
          builder: (context, state) {
            return Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: ElevatedButton(
                    onPressed: () {
                      final newContact = Contact(
                        id: DateTime.now().toString(), // ID único
                        name: "Nuevo Contacto",
                        email: "nuevo@example.com",
                        phone: "123456789",
                      );
                      context.read<ContactCubit>().addProfile(newContact);
                    },
                    child: const Text("Agregar Contacto"),
                  ),
                ),
                Expanded(
                  child: ListView.builder(
                    itemCount: state.contacts.length,
                    itemBuilder: (context, index) {
                      final contact = state.contacts[index];
                      return ListTile(
                        title: Text(contact.name),
                        subtitle: Text(contact.email),
                        trailing: IconButton(
                          icon: const Icon(Icons.delete, color: Colors.red),
                          onPressed: () {
                            context.read<ContactCubit>().removeProfile(contact.id);
                          },
                        ),
                      );
                    },
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
```

¿Qué tal si requiero un objeto como estado?
