# Introducción a las Listas y ListView

Las listas son uno de los elementos de interfaz de usuario más comunes en las aplicaciones móviles. Nos permiten mostrar colecciones de elementos de forma organizada, como una lista de correos electrónicos, contactos, productos o canciones. En Flutter, el widget principal para mostrar listas es `ListView`.

## ¿Qué es `ListView`?

`ListView` es un widget que organiza sus hijos en una lista desplazable en una dirección determinada (por defecto, verticalmente). Es ideal para mostrar un número pequeño y fijo de elementos, o cuando todos los elementos de la lista caben en la pantalla sin necesidad de desplazamiento.

## Creando una Lista Simple

Para crear una lista básica con `ListView`, simplemente le pasamos una lista de widgets como sus hijos (`children`). Cada widget en la lista se convierte en un elemento de la lista.

```dart trycode=7b684d12d00f344c7f52c73c1ce6d6e4
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
        appBar: AppBar(title: const Text('Lista Simple')),
        body: ListView(
          children: const <Widget>[
            ListTile(
              leading: Icon(Icons.star),
              title: Text('Elemento 1'),
              subtitle: Text('Descripción del elemento 1'),
            ),
            ListTile(
              leading: Icon(Icons.favorite),
              title: Text('Elemento 2'),
              subtitle: Text('Descripción del elemento 2'),
            ),
            ListTile(
              leading: Icon(Icons.thumb_up),
              title: Text('Elemento 3'),
              subtitle: Text('Descripción del elemento 3'),
            ),
            // Puedes añadir más ListTile o cualquier otro widget aquí
          ],
        ),
      ),
    );
  }
}
```

## `ListTile` Un Widget Común para Elementos de Lista

Como puedes ver en el ejemplo anterior, `ListTile` es un widget muy útil para crear elementos de lista. Proporciona una estructura predefinida para:

- `leading`: Un widget al inicio del elemento (a menudo un `Icon` o `CircleAvatar`).
- `title`: El contenido principal del elemento (generalmente un `Text`).
- `subtitle`: Un texto secundario debajo del título.
- `trailing`: Un widget al final del elemento (como un `Icon` para acciones o navegación).

`ListTile` maneja automáticamente el espaciado y la alineación, lo que facilita la creación de listas con un aspecto consistente.

## Listas Horizontales: Simulando Contactos

Además de las listas verticales, Flutter también permite crear listas que se desplazan horizontalmente. Esto es útil para mostrar una fila de elementos, como una galería de imágenes o una lista de contactos destacados.

Para hacer un `ListView` horizontal, simplemente cambiamos su propiedad `scrollDirection` a `Axis.horizontal`.

```dart trycode=5a51eacc433227a743cbeb4186f8869c
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final List<String> contactos = ['Ana', 'Juan', 'María', 'Pedro', 'Sofía', 'Luis', 'Elena', 'Carlos'];

    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('Contactos Horizontales')),
        body: Column(
          children: [
            const Padding(
              padding: EdgeInsets.all(16.0),
              child: Text(
                'Contactos Destacados',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
            ),
            SizedBox(
              height: 120, // Altura fija para la lista horizontal
              child: ListView.builder(
                scrollDirection: Axis.horizontal, // ¡Aquí está la clave!
                itemCount: contactos.length,
                itemBuilder: (context, index) {
                  return Card(
                    margin: const EdgeInsets.symmetric(horizontal: 8.0),
                    child: SizedBox(
                      width: 100, // Ancho fijo para cada tarjeta de contacto
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          CircleAvatar(
                            radius: 30,
                            backgroundColor: Colors.blueAccent,
                            child: Text(
                              contactos[index][0], // Primera letra del nombre
                              style: const TextStyle(color: Colors.white, fontSize: 24),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            contactos[index],
                            style: const TextStyle(fontSize: 14),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                  );}
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```
