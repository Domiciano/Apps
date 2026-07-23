# Listas Dinámicas y ListView.builder

En la lección anterior, vimos cómo usar `ListView` para mostrar listas simples y estáticas. Sin embargo, cuando trabajamos con listas muy largas o con datos que cambian dinámicamente (como una lista de publicaciones de redes sociales o resultados de búsqueda), usar `ListView` directamente con todos los `children` puede ser ineficiente y consumir mucha memoria.

Aquí es donde entra `ListView.builder`.

## `ListView.builder`: La Clave para Listas Eficientes

`ListView.builder` es un constructor de `ListView` que construye los elementos de la lista "a demanda" (lazy loading). Esto significa que solo renderiza los elementos que son visibles en la pantalla y unos pocos más que están a punto de ser visibles. Cuando un elemento sale de la pantalla, sus recursos pueden ser liberados, y cuando uno entra, se construye.

Esto lo hace extremadamente eficiente para listas con un gran número de elementos o un número desconocido de elementos.

## ¿Cómo funciona `ListView.builder`?

`ListView.builder` requiere dos parámetros principales:

1.  `itemCount`: El número total de elementos en la lista. Flutter lo usa para saber cuántos elementos potenciales hay y cuándo dejar de construir.
2.  `itemBuilder`: Una función que se llama para construir cada elemento de la lista. Recibe dos argumentos: el `BuildContext` y el `index` (la posición del elemento en la lista).

```dart trycode=f62169dbb31fb4c6c75bf5dfa4148ed8
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final List<String> items = List<String>.generate(10000, (i) => 'Elemento $i');

    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('Lista Dinámica')),
        body: ListView.builder(
          itemCount: items.length,
          itemBuilder: (BuildContext context, int index) {
            return ListTile(
              title: Text(items[index]),
              subtitle: Text('Este es el elemento número ${index + 1}'),
              leading: Icon(Icons.list),
            );
          },
        ),
      ),
    );
  }
}
```

En este ejemplo, estamos creando una lista de 10,000 elementos. Si hubiéramos usado `ListView` con `children`, la aplicación probablemente se habría ralentizado o incluso colgado. Con `ListView.builder`, la experiencia es fluida porque solo se construyen los elementos necesarios.

## Creando Widgets Personalizados para Elementos de Lista

Aunque `ListTile` es útil, a menudo querrás que tus elementos de lista tengan un diseño más complejo y personalizado. Puedes crear tus propios `StatelessWidget` o `StatefulWidget` para representar cada elemento de la lista y pasarlos al `itemBuilder`.

```dart trycode=170d1153830e0cad1ccefec6db787992
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final List<String> canciones = [
      'Bohemian Rhapsody', 'Stairway to Heaven', 'Hotel California',
      'Smells Like Teen Spirit', 'Billie Jean', 'Like a Rolling Stone',
      'Imagine', 'One', 'Hallelujah', ''
    ];

    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('Lista de Canciones')),
        body: ListView.builder(
          itemCount: canciones.length,
          itemBuilder: (context, index) {
            return CancionTile(titulo: canciones[index], artista: 'Artista Desconocido');
          },
        ),
      ),
    );
  }
}

class CancionTile extends StatelessWidget {
  final String titulo;
  final String artista;

  const CancionTile({Key? key, required this.titulo, required this.artista}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              titulo,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            Text(
              artista,
              style: TextStyle(fontSize: 14, color: Colors.grey[600]),
            ),
          ],
        ),
      ),
    );
  }
}
```

.
