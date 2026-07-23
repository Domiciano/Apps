# Estado en Flutter

En Flutter, la interfaz de usuario se construye a partir de widgets. Hasta ahora, hemos trabajado principalmente con `StatelessWidget`, que son widgets que no cambian con el tiempo una vez que se construyen. Pero, ¿qué pasa cuando necesitamos que nuestra interfaz reaccione a la interacción del usuario o a cambios en los datos? Aquí es donde entran en juego los `StatefulWidget` y el concepto de "estado".

## ¿Qué es el Estado en Flutter?

El "estado" de un widget es la información que puede cambiar durante la vida útil del widget. Cuando el estado de un `StatefulWidget` cambia, Flutter reconstruye (redibuja) solo la parte de la interfaz de usuario que depende de ese estado, haciendo que la UI sea dinámica y reactiva.

## StatelessWidget vs. StatefulWidget

- `StatelessWidget` Son widgets que no tienen estado interno que pueda cambiar. Su apariencia depende únicamente de los argumentos que se les pasan durante su construcción. Son ideales para elementos estáticos como textos, iconos o imágenes que no necesitan actualizarse.
- `StatefulWidget` Son widgets que pueden mantener un estado que cambia con el tiempo. Cuando su estado cambia, Flutter llama al método `build` nuevamente para redibujar el widget y reflejar los cambios. Son necesarios para elementos interactivos como botones, campos de texto, o cualquier componente que necesite actualizarse visualmente.

## Anatomía de un StatefulWidget

Un Widget con estado se compone de dos clases

El `StatefulWidget` es la clase pública que hereda de `StatefulWidget`. Su principal responsabilidad es crear una instancia de la clase `State`.

```dart
class MyStatefulWidget extends StatefulWidget {
  const MyStatefulWidget({super.key});
  @override
  State<MyStatefulWidget> createState() => MyStatefulWidgetState();
}
```

La clase `State` es la clase privada que hereda de `State<TuWidget>`. Aquí es donde se mantiene el estado mutable del widget y donde se define el método `build` que describe la interfaz de usuario.

```dart
class MyStatefulWidgetState extends State<MyStatefulWidget> {
  @override
  Widget build(BuildContext context) {
    return ...;
  }
  @override
  void dispose() {
    super.dispose();
  }
}
```

También tiene un método `dispose` que se ejecuta cuando se desmonta el componente. Útil para liberar recursos que se hayan instanciado para el funcionamiento del componente

## Actualizando el Estado con `setState()`

Para que Flutter sepa que el estado de un `StatefulWidget` ha cambiado y que necesita redibujar la interfaz de usuario, debes llamar al método `setState()`. Cualquier cambio de estado que ocurra dentro de una llamada a `setState()` provocará que Flutter reconstruya el widget.

```dart
class MyCounterState extends State<MyCounter> {
  int _counter = 0; // El estado del widget

  void _incrementCounter() {
    setState(() {
      _counter++; // Cambiamos el estado
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Contador: $_counter'),
        ElevatedButton(
          onPressed: _incrementCounter,
          child: Text('Incrementar'),
        ),
      ],
    );
  }
}
```

## Ejemplo Completo: Un Contador Simple

Aquí tienes un ejemplo completo y funcional de un contador simple que puedes pegar directamente en DartPad. Cada vez que presiones el botón, el contador se incrementará y la interfaz de usuario se actualizará.

```dart trycode=38fb3f8f0af6f1a2d2bbcc37467f1b6e
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: const CounterScreen(),
    );
  }
}

class CounterScreen extends StatefulWidget {
  const CounterScreen({super.key});

  @override
  State<CounterScreen> createState() => _CounterScreenState();
}

class _CounterScreenState extends State<CounterScreen> {
  int _counter = 0; // El estado mutable de este widget

  void _incrementCounter() {
    setState(() {
      _counter++; // Incrementa el contador
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          children: <Widget>[
            Text(
              '$_counter'
            ),
            ElevatedButton(
              onPressed: _incrementCounter,
              child: const Text('Incrementar'),
            ),
          ],
        ),
      ),
    );
  }
}
```

.
