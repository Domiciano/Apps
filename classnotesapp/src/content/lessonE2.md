# Navegación Avanzada

En la lección anterior, aprendimos los fundamentos de la navegación. Ahora, exploraremos técnicas más avanzadas que son cruciales para construir aplicaciones complejas: la gestión del historial de navegación y el paso de argumentos entre pantallas.

## Limpiar el Historial de Navegación (Backstack)

Como vimos brevemente, hay escenarios donde no queremos que el usuario pueda regresar a la pantalla anterior. El caso más común es después de un inicio de sesión exitoso o al pasar una pantalla de bienvenida (splash screen). En estos casos, la pantalla anterior debe ser eliminada del historial (o "backstack").

Para lograr esto, usamos el método `Navigator.pushNamedAndRemoveUntil`. Este método no solo nos lleva a una nueva pantalla, sino que también elimina las anteriores según una condición que nosotros definimos.

```dart
// Ejemplo: Navegar desde Login a Home, eliminando la pantalla de Login del historial.
onPressed: () {
  Navigator.pushNamedAndRemoveUntil(
    context,
    '/home', // La nueva ruta a la que navegamos
    (Route<dynamic> route) => false, // Condición para eliminar las rutas anteriores
  );
}
```

La clave está en el tercer parámetro. Es una función que se ejecuta para cada una de las rutas en el historial. Si la función devuelve `false`, la ruta es eliminada. Al usar `(route) => false`, le decimos a Flutter que elimine **todas** las rutas anteriores, dejando únicamente la nueva (`/home`) en el historial. Como resultado, el usuario no verá un botón para regresar.

## Pasar Argumentos a una Ruta

Es muy común necesitar enviar datos de una pantalla a otra. Por ejemplo, una lista de productos que, al tocar uno, nos lleva a una pantalla de detalles para ese producto específico. Necesitamos pasar el ID o el objeto completo del producto.

El método `Navigator.pushNamed` tiene un parámetro opcional llamado `arguments` para este propósito.

`Paso 1` Enviar los datos

Al llamar a `pushNamed`, pasamos los datos que queremos enviar en el parámetro `arguments`.

```dart
// Enviando un String simple como argumento
onPressed: () {
  Navigator.pushNamed(
    context,
    '/details',
    arguments: 'Hola desde la pantalla de inicio',
  );
}
```

`Paso 2` Recibir los datos

En la pantalla de destino, podemos acceder a estos argumentos usando `ModalRoute`.

```dart
// En el método build de la pantalla de detalles (DetailsScreen)

@override
Widget build(BuildContext context) {
  // Extraemos los argumentos
  final String message = ModalRoute.of(context)!.settings.arguments as String;

  return Scaffold(
    appBar: AppBar(
      title: const Text('Pantalla de Detalles'),
    ),
    body: Center(
      child: Text(message), // Mostramos el mensaje recibido
    ),
  );
}
```

Es importante hacer un casting (`as String`) porque los argumentos son de tipo `Object?`. Debemos asegurarnos de que el tipo que recibimos es el que esperamos.

## Pasar Argumentos con un Objeto Personalizado

Enviar un `String` es útil, pero a menudo necesitamos enviar objetos más complejos. Podemos crear una clase para encapsular los argumentos y asegurar la consistencia y la seguridad de tipos.

`Paso 1` Crear la clase de argumentos

```dart trycode=fcaedf11986a08bea7c2ae9cc4223875
// Un objeto simple para pasar como argumento
class ScreenArguments {
  final String title;
  final String message;

  ScreenArguments(this.title, this.message);
}
```

`Paso 2` Enviar el objeto

```dart trycode=7a0d89245b3093d02e7c0627779fea37
// Navegar y pasar el objeto ScreenArguments
onPressed: () {
  Navigator.pushNamed(
    context,
    '/details',
    arguments: ScreenArguments(
      'Título Personalizado',
      'Este es un mensaje desde un objeto.',
    ),
  );
}
```

`Paso 3` Recibir y usar el objeto

```dart trycode=ca6dcc63fd3d67474cc0c1e229ab2d2c
// En la pantalla de detalles
@override
Widget build(BuildContext context) {
  final args = ModalRoute.of(context)!.settings.arguments as ScreenArguments;

  return Scaffold(
    appBar: AppBar(
      title: Text(args.title), // Usamos el título del objeto
    ),
    body: Center(
      child: Text(args.message), // Usamos el mensaje del objeto
    ),
  );
}
```

Este método es mucho más robusto y es el recomendado para pasar datos complejos entre pantallas.

## Devolver Datos de una Pantalla

Así como enviamos datos hacia adelante, a menudo necesitamos que una pantalla devuelva un resultado a la pantalla que la abrió. Por ejemplo, una pantalla que pide al usuario que elija entre "Sí" o "No" y devuelve esa elección.

Esto se logra combinando `Navigator.pop()` en la pantalla secundaria con `await` en la llamada de `Navigator.push()` en la pantalla principal.

`Paso 1` Esperar el resultado

En la pantalla principal, cuando navegamos a la pantalla de selección, usamos `await` para pausar la ejecución y esperar a que la pantalla de selección se cierre y devuelva un valor.

```dart
// En la pantalla principal, dentro de un método async

Future<void> _navigateAndDisplaySelection(BuildContext context) async {
  // Esperamos el resultado de la pantalla de selección.
  final result = await Navigator.push(
    context,
    MaterialPageRoute(builder: (context) => const SelectionScreen()),
  );

  // Después de que la pantalla de selección devuelve un resultado,
  // ¡actualizamos la UI!
  if (context.mounted && result != null) {
    ScaffoldMessenger.of(context)
      ..removeCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text('$result')));
  }
}
```

`Paso 2` Devolver el resultado

En la pantalla de selección, cuando el usuario toma una decisión, usamos `Navigator.pop()` para cerrar la pantalla y pasar el resultado de vuelta.

```dart
// En la pantalla de selección, dentro de los botones

// Botón "Sí"
ElevatedButton(
  onPressed: () {
    // Cierra la pantalla y devuelve "¡Sí!" como resultado.
    Navigator.pop(context, '¡Sí!');
  },
  child: const Text('¡Sí!'),
)

// Botón "No"
ElevatedButton(
  onPressed: () {
    // Cierra la pantalla y devuelve "¡No!" como resultado.
    Navigator.pop(context, '¡No!');
  },
  child: const Text('¡No!'),
)
```

Al presionar un botón, la `SelectionScreen` se cierra y el `String` correspondiente se devuelve al `Future` que estaba esperando en la pantalla principal.

## Ejemplo Completo

Aquí tienes un ejemplo completo y funcional para DartPad que demuestra cómo pasar un objeto personalizado de una pantalla a otra y cómo la segunda pantalla puede devolver un dato a la primera.

```dart trycode=09ce64cecc2c69e03a226e109e55b139
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: 'Navegación Avanzada',
      home: HomeScreen(),
    );
  }
}

// --- Pantalla Principal ---
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _selection = "Aún no has elegido.";

  // Método para navegar y esperar un resultado
  Future<void> _navigateToSelectionScreen(BuildContext context) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const SelectionScreen()),
    );

    // Si hay un resultado, actualizamos el estado
    if (result != null) {
      setState(() {
        _selection = result;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pantalla Principal'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(_selection, style: const TextStyle(fontSize: 20)),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => _navigateToSelectionScreen(context),
              child: const Text('Abrir pantalla de selección'),
            ),
          ],
        ),
      ),
    );
  }
}

// --- Pantalla de Selección ---
class SelectionScreen extends StatelessWidget {
  const SelectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Elige una opción'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            ElevatedButton(
              onPressed: () {
                // Devolver 'Opción A' como resultado
                Navigator.pop(context, 'Has elegido la Opción A');
              },
              child: const Text('Opción A'),
            ),
            ElevatedButton(
              onPressed: () {
                // Devolver 'Opción B' como resultado
                Navigator.pop(context, 'Has elegido la Opción B');
              },
              child: const Text('Opción B'),
            ),
          ],
        ),
      ),
    );
  }
}
```

.
