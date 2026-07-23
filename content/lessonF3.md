# Interacción en Listas y Modelos de Datos Simples

Ahora que sabemos cómo mostrar listas estáticas y dinámicas de manera eficiente, el siguiente paso es hacer que nuestros elementos de lista sean interactivos. En la mayoría de las aplicaciones, al tocar un elemento de una lista, se realiza alguna acción, como navegar a una pantalla de detalles o mostrar más información.

También exploraremos cómo manejar datos más complejos que simples cadenas de texto, utilizando modelos de datos.

## Haciendo los Elementos de Lista Interactivos

Para que un elemento de lista responda a toques, podemos envolverlo en un widget que detecte gestos, como `GestureDetector` o `InkWell`. `ListTile` ya tiene una propiedad `onTap` incorporada, lo que lo hace muy conveniente.

```dart trycode=fc9c31cc40446404f7e52ff735de0068
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final List<String> frutas = ['Manzana', 'Banana', 'Cereza', 'Durazno', 'Fresa'];

    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('Lista Interactiva')),
        body: ListView.builder(
          itemCount: frutas.length,
          itemBuilder: (context, index) {
            return ListTile(
              title: Text(frutas[index]),
              onTap: () {
                // Acción al tocar el elemento
                 ScaffoldMessenger.of(context)
                  ..removeCurrentSnackBar() // Elimina cualquier SnackBar visible
                  ..showSnackBar(
                    SnackBar(content: Text('Tocaste: ${frutas[index]}')
                  ),
                );
                // Aquí podrías navegar a otra pantalla, por ejemplo:
                // Navigator.push(context, MaterialPageRoute(builder: (context) => DetallePantalla(fruta: frutas[index])));
              },
            );
          },
        ),
      ),
    );
  }
}
```

En este ejemplo, cada vez que se toca un elemento de la lista, aparece un `SnackBar` en la parte inferior de la pantalla mostrando qué fruta fue tocada. La función `onTap` de `ListTile` es un `VoidCallback`, lo que significa que espera una función que no toma argumentos y no devuelve nada.

## Modelos de Datos Simples

Hasta ahora, hemos trabajado con listas de `String`. Sin embargo, en aplicaciones reales, los datos suelen ser más complejos y estructurados. Por ejemplo, una canción no es solo un título, sino que también tiene un artista, una duración, un género, etc.

Podemos representar estos datos complejos creando clases de Dart que actúen como modelos de datos. Esto mejora la organización, la legibilidad y la seguridad de tipos de nuestro código.

```dart trycode=04ef26c393591b291d1ed78770dc1efb
import 'package:flutter/material.dart';

// 1. Definimos nuestro modelo de datos para una Canción
class Cancion {
  final String titulo;
  final String artista;
  final Duration duracion;

  const Cancion({
    required this.titulo,
    required this.artista,
    required this.duracion,
  });
}

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // 2. Creamos una lista de objetos Cancion
    final List<Cancion> canciones = [
      const Cancion(titulo: 'Bohemian Rhapsody', artista: 'Queen', duracion: Duration(minutes: 5, seconds: 55)),
      const Cancion(titulo: 'Stairway to Heaven', artista: 'Led Zeppelin', duracion: Duration(minutes: 8, seconds: 2)),
      const Cancion(titulo: 'Hotel California', artista: 'Eagles', duracion: Duration(minutes: 6, seconds: 30)),
    ];

    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('Lista con Modelos')),
        body: ListView.builder(
          itemCount: canciones.length,
          itemBuilder: (context, index) {
            final cancion = canciones[index]; // Obtenemos el objeto Cancion
            return ListTile(
              title: Text(cancion.titulo),
              subtitle: Text('${cancion.artista} - ${cancion.duracion.inMinutes} min'),
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Reproduciendo: ${cancion.titulo}')),
                );
              },
            );
          },
        ),
      ),
    );
  }
}
```

Al usar modelos de datos, nuestro código se vuelve más organizado y fácil de entender. Cada elemento de la lista es un objeto con propiedades bien definidas, lo que facilita el acceso y la manipulación de la información.
