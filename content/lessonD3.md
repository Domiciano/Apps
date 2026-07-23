# Layout

En esta lección aprenderás a organizar y personalizar la disposición de los widgets en Flutter usando `Container`, `Row` y `Column`.

```youtube
75xXoz6JvdY
```

## El Widget Container

`Container` es un widget versátil que funciona como un "div" en web. Permite personalizar el ancho, alto, color y otros estilos de un área de la pantalla. Solo puede tener un hijo, pero puedes anidar varios containers para lograr diseños complejos.

```dart trycode=e4cb71b3491e80ceb16a40beea6c10c7
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ejemplo Container',
      home: Scaffold(
        appBar: AppBar(title: const Text('Ejemplo Container')),
        body: Center(
          child: Container(
            width: 200,
            height: 100,
            color: Colors.blueAccent,
            child: const Center(
              child: Text(
                '¡Hola Container!',
                style: TextStyle(color: Colors.white, fontSize: 20),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
```

## El Widget Column

`Column` es un widget que permite organizar varios widgets hijos en una disposición vertical (de arriba a abajo). Es muy parecido a una columna en Flexbox en web.

```dart trycode=29b05a170041f34fa042190dfbe58b5e
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ejemplo Column',
      home: Scaffold(
        appBar: AppBar(title: const Text('Ejemplo Column')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center, // Centra los hijos verticalmente
            crossAxisAlignment: CrossAxisAlignment.center, // Centra los hijos horizontalmente
            children: const [
              Text('Primer Elemento'),
              SizedBox(height: 10), // Espacio entre elementos
              ElevatedButton(onPressed: null, child: Text('Botón')),
              SizedBox(height: 10),
              Text('Tercer Elemento'),
            ],
          ),
        ),
      ),
    );
  }
}
```

## El Widget Row

`Row` es un widget que permite organizar varios widgets hijos en una disposición horizontal (de izquierda a derecha). Es muy parecido a una fila en Flexbox en web.

```dart trycode=24cbe0dae7df7765d2fbf4eac5896056
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ejemplo Row',
      home: Scaffold(
        appBar: AppBar(title: const Text('Ejemplo Row')),
        body: Center(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround, // Distribuye el espacio uniformemente alrededor de los hijos
            crossAxisAlignment: CrossAxisAlignment.center, // Centra los hijos verticalmente
            children: const [
              Text('Elemento A'),
              ElevatedButton(onPressed: null, child: Text('Botón')),
              Text('Elemento B'),
            ],
          ),
        ),
      ),
    );
  }
}
```

## Propiedades de Alineación

Los widgets `Row` y `Column` comparten propiedades clave para controlar la disposición y alineación de sus hijos:

Un ejemplo práctico de cómo combinar `Row` y `Column` es la creación de una barra de iconos y texto, como las que se encuentran comúnmente en las aplicaciones móviles.

```dart trycode=2bd3986b5a5872e9941399469b4b89e6
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('Barra de Iconos')),
        body: Container(
          color: Colors.black,
          height: double.infinity,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildButtonColumn(Icons.call, 'Llamar'),
              _buildButtonColumn(Icons.near_me, 'Ruta'),
              _buildButtonColumn(Icons.share, 'Compartir'),
            ],
          ),
        ),
      ),
    );
  }

  Column _buildButtonColumn(IconData icon, String label) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(icon, color: Colors.blue),
        SizedBox(height: 8), // Espacio entre icono y texto
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w400,
            color: Colors.blue,
          ),
        ),
      ],
    );
  }
}
```

Intenta cambiar las propiedades en el código de ejemplo para que veas los diferentes efectos.

`mainAxisAlignment`
Controla la alineación de los hijos a lo largo del eje principal (horizontal para `Row`, vertical para `Column`).
`MainAxisAlignment.start`, `MainAxisAlignment.end`, `MainAxisAlignment.center`, `MainAxisAlignment.spaceBetween`, `MainAxisAlignment.spaceAround`, `MainAxisAlignment.spaceEvenly`.

`crossAxisAlignment`
Controla la alineación de los hijos a lo largo del eje secundario (vertical para `Row`, horizontal para `Column`).
`CrossAxisAlignment.start`, `CrossAxisAlignment.end`, `CrossAxisAlignment.center`, `CrossAxisAlignment.stretch`.
