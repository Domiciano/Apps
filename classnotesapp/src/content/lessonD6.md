# ScaffoldMessenger

El `ScaffoldMessenger` es un widget crucial en Flutter que permite mostrar `SnackBar`, `BottomSheet` y otros mensajes temporales de manera consistente, incluso cuando el `Scaffold` subyacente cambia o se reconstruye. Resuelve problemas comunes relacionados con la gestión de `SnackBar` en el árbol de widgets.

## ¿Por qué necesitamos ScaffoldMessenger?

`ScaffoldMessenger` introduce un `ScaffoldMessengerState` que persiste a través de los cambios de `Scaffold`, proporcionando un `context` estable para mostrar mensajes. Esto evita que el contexto se rompa, por ejemplo, cuando hacemos una transición entre pantallas.

## Uso Básico de SnackBar con ScaffoldMessenger

La forma más común de usar `ScaffoldMessenger` es para mostrar `SnackBar`. Puedes acceder a él a través de `ScaffoldMessenger.of(context)`.

```dart
// Mostrar un SnackBar simple
ElevatedButton(
  onPressed: () {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('¡Hola desde un SnackBar!'),
      ),
    );
  },
  child: const Text('Mostrar SnackBar'),
)
```

## SnackBar con Acción

Los `SnackBar` pueden incluir una acción, como un botón para deshacer una operación.

```dart
// Mostrar un SnackBar con una acción
ElevatedButton(
  onPressed: () {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Elemento eliminado.'),
        action: SnackBarAction(
          label: 'Deshacer',
          onPressed: () {
            // Código para deshacer la acción
            print('Acción deshecha!');
          },
        ),
      ),
    );
  },
  child: const Text('Mostrar SnackBar con Acción'),
)
```

## Gestionar Múltiples SnackBar

Si intentas mostrar varios `SnackBar`s rápidamente, por defecto se pondrán en cola. A menudo, querrás que un nuevo `SnackBar` reemplace al anterior. Para esto, puedes usar `removeCurrentSnackBar()` antes de mostrar el nuevo.

El operador de cascada (`..`) es muy útil aquí para encadenar estas operaciones:

```dart
// Reemplazar el SnackBar actual con uno nuevo
ElevatedButton(
  onPressed: () {
    ScaffoldMessenger.of(context)
      ..removeCurrentSnackBar() // Elimina cualquier SnackBar visible
      ..showSnackBar(
        const SnackBar(content: Text('Este es un nuevo mensaje!')),
      );
  },
  child: const Text('Reemplazar SnackBar'),
)
```

## Ejemplo Completo

Aquí tienes un ejemplo completo y funcional para DartPad que demuestra el uso de `ScaffoldMessenger` para mostrar diferentes tipos de `SnackBar`s.

```dart trycode=b84dcf85c28f01a6b3304bd19693944b
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ScaffoldMessenger Demo',
      home: Builder(
        // Builder es necesario para obtener un contexto que tenga un Scaffold
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('ScaffoldMessenger Demo')),
          body: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                ElevatedButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('¡SnackBar simple!'),
                      ),
                    );
                  },
                  child: const Text('Mostrar SnackBar Simple'),
                ),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: const Text('Elemento eliminado.'),
                        action: SnackBarAction(
                          label: 'Deshacer',
                          onPressed: () {
                            print('Acción deshecha!');
                          },
                        ),
                      ),
                    );
                  },
                  child: const Text('Mostrar SnackBar con Acción'),
                ),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context)
                      ..removeCurrentSnackBar()
                      ..showSnackBar(
                        const SnackBar(content: Text('¡Este es un nuevo mensaje!')),
                      );
                  },
                  child: const Text('Reemplazar SnackBar'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
```

.
