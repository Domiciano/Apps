# Árbol de widgets y Scaffold

En esta lección aprenderás cómo se estructura el árbol de widgets en una app Flutter y el papel fundamental del widget `Scaffold` como base de cualquier pantalla.

```youtube
M5ZQR5ab8IY
```

## ¿Qué es el árbol de widgets?

En Flutter, toda la interfaz de usuario se construye como un árbol de widgets. Cada widget puede tener hijos y propiedades, y juntos forman la jerarquía visual y funcional de la app.

## ¿Qué es Scaffold?

`Scaffold` es un widget que provee la estructura visual básica para una pantalla. Sus dos propiedades principales son:

- AppBar: la barra superior de la pantalla.
- Body: el contenido principal de la pantalla.

## Ejemplo de árbol de widgets y Scaffold

Supongamos que tenemos una app básica con un `MaterialApp`, un `Scaffold` con `AppBar` y un `body` centrado:

```dart trycode=884ff75d3d31d4b644ef359c07b23504
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Árbol de widgets',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Home'),
        backgroundColor: Theme.of(context).colorScheme.primary,
      ),
      body: const Center(
        child: Text('Hola mundo'),
      ),
    );
  }
}
```

## Diagrama del árbol de widgets

```youtube
L84ly8Ef62w
```

```plain
MaterialApp
 └── home: HomeScreen
      └── Scaffold
           ├── appBar: AppBar
           │     └── title: Text('Home')
           └── body: Center
                 └── Text('Hola mundo')
```

- AppBar se crea con la clase `AppBar` y puede tener un título (usualmente un widget `Text`).
- Puedes personalizar el color de fondo de la barra usando `backgroundColor` y el tema de la app.
- El contenido principal se pone en `body`. Puedes usar `Center` para centrar widgets como `Text`.
- Scaffold es la base de cualquier pantalla en Flutter.
- Cada widget puede tener hijos y propiedades (por ejemplo, `home`, `appBar`, `body`).
- El árbol de widgets es dinámico: Flutter lo reconstruye cuando cambian los datos o el estado.
- Dividir la app en widgets pequeños y reutilizables facilita el mantenimiento y la escalabilidad.
- El identificador `key` ayuda a Flutter a rastrear y actualizar widgets de manera eficiente.

¡Listo! Ahora comprendes cómo se compone y por qué es importante el árbol de widgets y el widget Scaffold en Flutter.
