# Button

Los botones son elementos esenciales para la interacción del usuario en cualquier aplicación. Flutter ofrece varios tipos de botones, cada uno diseñado para un propósito y estilo visual específico. En esta lección, exploraremos los botones más comunes y cómo utilizarlos.

## ElevatedButton: Botón Elevado

El `ElevatedButton` es un botón con una elevación que lo hace parecer que sobresale de la superficie. Es ideal para acciones primarias o destacadas en tu interfaz.

```dart
ElevatedButton(
  onPressed: () {
    // Acción a realizar cuando se presiona el botón
    print('ElevatedButton presionado!');
  },
  child: const Text('Presióname'),
)
```

## TextButton: Botón de Texto

El `TextButton` es un botón de texto plano, sin elevación. Es adecuado para acciones menos prominentes, como opciones en un diálogo o enlaces.

```dart
TextButton(
  onPressed: () {
    print('TextButton presionado!');
  },
  child: const Text('Más Información'),
)
```

## OutlinedButton: Botón con Borde

El `OutlinedButton` es un botón con un borde delgado y sin relleno. Es útil para acciones secundarias que necesitan ser visibles pero no tan prominentes como un `ElevatedButton`.

```dart
OutlinedButton(
  onPressed: () {
    print('OutlinedButton presionado!');
  },
  child: const Text('Ver Detalles'),
)
```

## IconButton: Botón de Icono

El `IconButton` es un botón que solo muestra un icono. Es perfecto para acciones que pueden representarse visualmente, como un botón de "me gusta" o un icono de configuración.

```dart
IconButton(
  icon: const Icon(Icons.favorite),
  onPressed: () {
    print('IconButton presionado!');
  },
  color: Colors.red, // Color del icono
  iconSize: 30.0, // Tamaño del icono
)
```

## Ejemplo Completo

Aquí tienes un ejemplo completo y funcional que demuestra el uso de los diferentes tipos de botones en Flutter.

```dart trycode=34399fb97053ae4160c3d796847add65
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ejemplo Botones',
      home: Scaffold(
        appBar: AppBar(title: const Text('Widgets Button')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              ElevatedButton(
                onPressed: () {
                  print('ElevatedButton presionado!');
                },
                child: const Text('Botón Elevado'),
              ),
              const SizedBox(height: 20),
              TextButton(
                onPressed: () {
                  print('TextButton presionado!');
                },
                child: const Text('Botón de Texto'),
              ),
              const SizedBox(height: 20),
              OutlinedButton(
                onPressed: () {
                  print('OutlinedButton presionado!');
                },
                child: const Text('Botón con Borde'),
              ),
              const SizedBox(height: 20),
              IconButton(
                icon: const Icon(Icons.settings),
                onPressed: () {
                  print('IconButton presionado!');
                },
                color: Colors.blue,
                iconSize: 40.0,
              ),
              const SizedBox(height: 20),
              ElevatedButton.icon(
                onPressed: () {
                  print('ElevatedButton.icon presionado!');
                },
                icon: const Icon(Icons.add),
                label: const Text('Añadir'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

.
