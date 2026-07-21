# Conceptos iniciales

## Creando Componentes en Flutter

En Flutter, la interfaz de usuario se construye a partir de pequeños bloques de construcción llamados `Widgets`. Piensa en ellos como si fueran piezas de Lego: puedes combinar varios widgets simples para crear interfaces complejas y reutilizables. A este proceso lo llamamos "componetizar".

## Definiendo un Componente (Widget)

Un widget es simplemente una clase de Dart que hereda de `StatelessWidget` o `StatefulWidget`. Para empezar, nos enfocaremos en los `StatelessWidget`, que son componentes simples sin estado interno.

Crear un widget es tan fácil como crear una clase y definir su apariencia en el método `build`.

```dart
import 'package:flutter/material.dart';

// Definimos nuestro nuevo widget llamado SaludoWidget
class SaludoWidget extends StatelessWidget {
  // El constructor
  const SaludoWidget({super.key});

  @override
  Widget build(BuildContext context) {
    // El método build devuelve el widget que se mostrará en pantalla
    return const Text(
      '¡Hola, desde nuestro primer componente!',
      style: TextStyle(fontSize: 20, color: Colors.white),
    );
  }
}
```

## ¿Por qué usamos `super.key`?

El parámetro `key` es un identificador que Flutter usa para diferenciar un widget de otro. Al pasarlo con `super.key`, le estamos dando una `Key` (o llave) única a nuestro widget.

Imagina que tienes una lista de widgets idénticos. Si uno de ellos cambia, se elimina o se mueve, Flutter necesita una forma de saber exactamente cuál de ellos fue afectado para poder actualizar la pantalla de manera eficiente. La `Key` le da esa información. Esto ayuda a Flutter a gestionar el rendimiento.

Desde Dart 2.17, la forma más simple de hacerlo es usando `super-parameters`, que nos permite pasar el parámetro `key` directamente al constructor de la superclase (`StatelessWidget` en este caso) usando `super.key`.

## Usando Variables como Propiedades (Props)

Un componente no es muy útil si siempre muestra lo mismo. Queremos poder pasarle datos para que sea dinámico. A estos datos los llamamos "propiedades" (o "props", como en otros frameworks).

Para pasar datos, simplemente declaramos variables `final` en nuestro widget y las inicializamos en el constructor.

```dart
import 'package:flutter/material.dart';

class SaludoPersonalizado extends StatelessWidget {
  // 1. Declaramos la propiedad que queremos recibir
  final String nombre;

  // 2. La añadimos como un parámetro requerido en el constructor
  const SaludoPersonalizado({super.key, required this.nombre});

  @override
  Widget build(BuildContext context) {
    // 3. Usamos la propiedad dentro de nuestro widget
    return Text(
      '¡Hola, $nombre!',
      style: const TextStyle(fontSize: 22, color: Colors.white, fontWeight: FontWeight.bold),
    );
  }
}

// Así lo usaríamos en otra parte de la app:
class MiPantalla extends StatelessWidget {
  const MiPantalla({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: SaludoPersonalizado(nombre: "Ana"), // Le pasamos el nombre aquí
      ),
    );
  }
}
```

## Usando Funciones como Propiedades (Callbacks)

Además de datos, también podemos pasar funciones. Esto es fundamental para gestionar interacciones del usuario, como cuando se presiona un botón. A estas funciones las llamamos "callbacks".

Creemos un botón personalizado que nos notifique cuando es presionado.

```dart
import 'package:flutter/material.dart';

class BotonPersonalizado extends StatelessWidget {
  // 1. Declaramos la propiedad para el texto del botón
  final String texto;
  // 2. Declaramos la función que se ejecutará al presionar (el callback)
  final void Function() onPressed;

  // 3. Las añadimos al constructor
  const BotonPersonalizado({super.key, required this.texto, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      // 4. Usamos la función `onPressed` que recibimos
      onPressed: onPressed,
      child: Text(texto),
    );
  }
}

// Así lo usaríamos:
class MiPantallaConBoton extends StatelessWidget {
  const MiPantallaConBoton({super.key});

  void _miFuncionDeCallback() {
    print("¡El botón fue presionado!");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        // Le pasamos el texto y la función que debe ejecutar
        child: BotonPersonalizado(
          texto: "Presióname",
          onPressed: _miFuncionDeCallback,
        ),
      ),
    );
  }
}
```

Al componetizar, creamos widgets reutilizables, mantenibles y fáciles de entender. Esta es la base para construir aplicaciones robustas y escalables en Flutter.
