# Listas y estados

En las lecciones anteriores, hemos trabajado principalmente con `StatelessWidget`, que son widgets que no cambian una vez que se construyen. Sin embargo, la mayoría de las aplicaciones necesitan interactuar con el usuario y mostrar datos que cambian con el tiempo. Para esto, necesitamos `StatefulWidget`.

## Usemos el `StatefulWidget`

Como hemos visto, un `StatefulWidget` es un widget que puede cambiar su apariencia. Puede hacerlo, entre otros, ante eventos del usuario. 

## El Modelo de Datos: `Reminder`

Para nuestra aplicación de recordatorios, definiremos una clase simple `Reminder` que contendrá la descripción de cada recordatorio.

```dart trycode=008afc2e841bfb8d9c31964290b4b97a
class Reminder {
  final String description;

  const Reminder({required this.description});
}
```

## Construyendo la Aplicación de Recordatorios

Nuestra aplicación tendrá un `TextField` para ingresar nuevos recordatorios y un `ElevatedButton` para agregarlos a una lista. La lista de recordatorios se mostrará en un `ListView`.

La clave aquí es que la lista de `Reminder`s y el texto del `TextField` serán parte del estado de nuestro `StatefulWidget`.

```dart trycode=857175190ca4a1f809f78a6ba695e01a
import 'package:flutter/material.dart';

// Modelo de datos para un recordatorio
class Reminder {
  final String description;

  const Reminder({required this.description});
}

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Aplicación de Recordatorios',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: const ReminderScreen(),
    );
  }
}

// StatefulWidget para la pantalla de recordatorios
class ReminderScreen extends StatefulWidget {
  const ReminderScreen({super.key});

  @override
  State<ReminderScreen> createState() => _ReminderScreenState();
}

class _ReminderScreenState extends State<ReminderScreen> {
  // Lista de recordatorios que es parte del estado
  final List<Reminder> _reminders = [];
  // Controlador para el TextField
  final TextEditingController _textController = TextEditingController();

  // Método para agregar un nuevo recordatorio
  void _addReminder() {
    // Verificamos que el TextField no esté vacío
    if (_textController.text.isNotEmpty) {
      // setState notifica a Flutter que el estado ha cambiado
      // y que el widget debe reconstruirse.
      setState(() {
        _reminders.add(Reminder(description: _textController.text));
        _textController.clear(); // Limpiamos el TextField
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Mis Recordatorios')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _textController,
                    decoration: const InputDecoration(
                      labelText: 'Nuevo Recordatorio',
                      border: OutlineInputBorder(),
                    ),
                    onSubmitted: (_) => _addReminder(), // Agrega al presionar Enter
                  ),
                ),
                const SizedBox(width: 8),
                ElevatedButton(
                  onPressed: _addReminder,
                  child: const Text('Agregar'),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: _reminders.length,
              itemBuilder: (context, index) {
                return Card(
                  margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  child: ListTile(
                    title: Text(_reminders[index].description),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _textController.dispose(); // Liberar recursos del controlador
    super.dispose();
  }
}
```

## Explicación del Estado

*   **`_reminders`**: Esta lista se declara dentro de la clase `_ReminderScreenState`. Esto significa que su valor se mantiene mientras el `State` del `ReminderScreen` exista. Cuando agregamos un nuevo recordatorio, modificamos esta lista.
*   **`_textController`**: Similarmente, el controlador del `TextField` se mantiene en el estado para poder acceder y limpiar el texto.
*   **`setState(() { ... });`**: Este es el método mágico. Cuando llamas a `setState`, le estás diciendo a Flutter: "¡Oye, algo en mi estado ha cambiado y necesito que reconstruyas mi widget para reflejar esos cambios!". Flutter entonces ejecuta el método `build` de nuevo, y la interfaz de usuario se actualiza para mostrar la lista de recordatorios con el nuevo elemento.
*   **`dispose()`**: Es importante liberar los recursos de los `TextEditingController` cuando el widget ya no se necesita para evitar fugas de memoria.

Esta lección te da una base sólida para entender cómo los `StatefulWidget` te permiten crear interfaces de usuario dinámicas y reactivas en Flutter.
