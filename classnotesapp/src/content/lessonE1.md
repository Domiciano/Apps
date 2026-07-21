# Navegación entre Pantallas

Ya sabemos cómo crear pantallas y los componentes que las componen. El próximo paso es saber cómo navegar entre ellas. Para aprenderlo, necesitamos mínimo dos pantallas. En este ejemplo, usaremos una pantalla de `LoginScreen` y una `MainScreen`.

## Método 1: `Navigator.push`

La forma más directa de navegar es usando el widget `Navigator`. Este componente nativo del framework nos permite hacer "push" (empujar) una nueva pantalla sobre la actual, creando una pila de navegación.

Para lograrlo, nos ubicamos en el botón de login y usamos el método `Navigator.push`. Este método requiere dos parámetros: el `context` (que nos indica dónde estamos en el árbol de widgets) y una `Route` (la ruta a la nueva pantalla).

```dart trycode=3a7334ba4042e7a960d94bb3b2d2589a
// En el onPressed de un botón, por ejemplo:

onPressed: () {
  Navigator.push(
    context,
    MaterialPageRoute(builder: (context) => MainScreen()),
  );
}
```

El `MaterialPageRoute` es un objeto que construye la nueva pantalla. Su propiedad `builder` recibe una función que devuelve una instancia de la pantalla a la que queremos navegar, en este caso, `MainScreen`. Al ejecutar esto, Flutter automáticamente añade un botón de "atrás" en la `AppBar` para volver a la pantalla anterior.

## Método 2: Rutas Nombradas

Una forma más organizada y desacoplada de manejar la navegación es mediante rutas nombradas. En lugar de crear una instancia de la pantalla directamente, le asignamos un identificador (un `String`) a cada pantalla y la llamamos usando ese nombre.

Primero, debemos registrar nuestras rutas en el widget `MaterialApp` en el archivo `main.dart`.

```dart trycode=e4328eaa9aadd0ed884801212ed51b7d
// En main.dart

MaterialApp(
  // La ruta inicial de la app será la que tenga '/'
  initialRoute: '/',
  routes: {
    '/': (context) => LoginScreen(),
    '/main': (context) => MainScreen(),
  },
);
```

Al usar la propiedad `routes`, no debemos declarar la propiedad `home`. La ruta con el `String` `'/'` se considera la pantalla principal.

Luego, para navegar, usamos el método `Navigator.pushNamed`.

```dart trycode=4917fff087935b28ff1c4d989cfadb7b
// En el onPressed del botón de login:

onPressed: () {
  Navigator.pushNamed(context, '/main');
}
```

Este enfoque es muy útil porque nos permite reutilizar las rutas en cualquier parte de la aplicación sin necesidad de importar los archivos de las pantallas.

## Reemplazar la pantalla actual

A veces, no queremos que el usuario pueda volver a la pantalla anterior, como en el caso de un login. Una vez que el usuario se autentica, la pantalla de login debería desaparecer de la pila de navegación.

Para esto, usamos el método `pushNamedAndRemoveUntil`.

```dart trycode=bcf8748ee2a473c9f647a3cfedb7b92f
// En el onPressed del botón de login:

onPressed: () {
  Navigator.pushNamedAndRemoveUntil(
    context,
    '/main',
    (Route<dynamic> route) => false, // Esta función elimina todas las rutas anteriores
  );
}
```

Este método navega a la ruta `/main` y luego elimina todas las pantallas anteriores de la pila. El tercer parámetro es una función que determina qué rutas conservar. Al devolver siempre `false`, nos aseguramos de que todas las rutas anteriores sean eliminadas. Como resultado, la nueva pantalla no tendrá el botón de "atrás", ya que no hay a dónde regresar.

## Ejemplo completo

Aquí tienes un ejemplo completo y funcional que puedes pegar directamente en DartPad. Este código demuestra la navegación entre una pantalla de inicio y una pantalla principal usando rutas nombradas.

```dart trycode=56b20c1f38c194fde8c2db1c35bbfcb6
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ejemplo de Navegación',
      initialRoute: '/',
      routes: {
        '/': (context) => const HomeScreen(),
        '/details': (context) => const DetailsScreen(),
      },
    );
  }
}

// Pantalla de Inicio
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pantalla de Inicio'),
      ),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            // Navegar a la pantalla de detalles
            Navigator.pushNamed(context, '/details');
          },
          child: const Text('Ir a Detalles'),
        ),
      ),
    );
  }
}

// Pantalla de Detalles
class DetailsScreen extends StatelessWidget {
  const DetailsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pantalla de Detalles'),
      ),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            // Regresar a la pantalla de inicio
            Navigator.pop(context);
          },
          child: const Text('Volver al Inicio'),
        ),
      ),
    );
  }
}
```

.
