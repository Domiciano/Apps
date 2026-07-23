# Navegación con BottomNavigationBar

Una de las formas más comunes de organizar la navegación en una aplicación móvil es mediante una barra de navegación inferior. El widget `BottomNavigationBar` de Flutter nos permite implementar esta funcionalidad de manera sencilla, ofreciendo al usuario acceso rápido a un número reducido de vistas principales.

## Estructura Básica

Para implementar una `BottomNavigationBar`, necesitamos un `StatefulWidget` que gestione el estado de la pestaña seleccionada. La barra de navegación se coloca dentro de la propiedad `bottomNavigationBar` de un `Scaffold`.

La propiedad `items` de la `BottomNavigationBar` recibe una lista de widgets `BottomNavigationBarItem`, donde cada uno representa una pestaña con su propio ícono y etiqueta.

```dart
Scaffold(
  appBar: AppBar(
    title: const Text('BottomNavBar Demo'),
  ),
  body: // Aquí irá la pantalla seleccionada,
  bottomNavigationBar: BottomNavigationBar(
    items: const <BottomNavigationBarItem>[
      BottomNavigationBarItem(
        icon: Icon(Icons.home),
        label: 'Inicio',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.business),
        label: 'Negocios',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.school),
        label: 'Escuela',
      ),
    ],
  ),
);
```

## Manejo del Estado y la Interacción

Para que la barra de navegación sea interactiva, necesitamos tres elementos clave en nuestro `StatefulWidget`:

1.  Una variable que almacene el índice de la pestaña actualmente seleccionada. Por convención, la llamaremos `_selectedIndex`.
2.  Una lista de los widgets (pantallas) que se mostrarán.
3.  Una función que se ejecute cuando el usuario toque una pestaña. Esta función recibirá el nuevo índice y actualizará `_selectedIndex` dentro de una llamada a `setState`.

```dart
int _selectedIndex = 0; // Índice de la pestaña activa

// Lista de pantallas que se mostrarán
static const List<Widget> _widgetOptions = <Widget>[
  Text('Index 0: Inicio'),
  Text('Index 1: Negocios'),
  Text('Index 2: Escuela'),
];

// Función para cambio de pestaña
void _onItemTapped(int index) {
  setState(() {
    _selectedIndex = index;
  });
}
```

## Conectando Todo

Ahora, conectamos estas partes al `Scaffold`. El `body` del `Scaffold` mostrará el widget de nuestra lista `_widgetOptions` correspondiente al `_selectedIndex`. La `BottomNavigationBar` usará `_selectedIndex` para resaltar la pestaña activa y `_onItemTapped` para manejar los clicks.

```dart
Scaffold(
  appBar: AppBar(
    title: const Text('BottomNavBar Demo'),
  ),
  body: Center(
    child: _widgetOptions.elementAt(_selectedIndex), // Muestra la pantalla seleccionada
  ),
  bottomNavigationBar: BottomNavigationBar(
    items: const <BottomNavigationBarItem>[
      BottomNavigationBarItem(
        icon: Icon(Icons.home),
        label: 'Inicio',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.business),
        label: 'Negocios',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.school),
        label: 'Escuela',
      ),
    ],
    currentIndex: _selectedIndex, // Resalta la pestaña activa
    selectedItemColor: Colors.amber[800], // Color del ítem seleccionado
    onTap: _onItemTapped, // Llama a la función al dar click
  ),
);
```

## Ejemplo Completo

Este código crea una aplicación con tres pestañas. Cada pestaña muestra un texto simple, pero en una aplicación real, reemplazarías esos `Text` con tus propios widgets de pantalla (por ejemplo, `HomeScreen()`, `ProfileScreen()`, etc.).

```dart trycode=e891cd454997b1e12f8c2410052cf6cf
import 'package:flutter/material.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: MyStatefulWidget(),
    );
  }
}

class MyStatefulWidget extends StatefulWidget {
  const MyStatefulWidget({super.key});

  @override
  State<MyStatefulWidget> createState() => _MyStatefulWidgetState();
}

class _MyStatefulWidgetState extends State<MyStatefulWidget> {
  int _selectedIndex = 0;
  static const List<Widget> _widgetOptions = <Widget>[
    Text(
      'Index 0: Inicio',
    ),
    Text(
      'Index 1: Negocios',
    ),
    Text(
      'Index 2: Escuela',
    ),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Ejemplo de BottomNavigationBar'),
      ),
      body: Center(
        child: _widgetOptions.elementAt(_selectedIndex),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Inicio',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.business),
            label: 'Negocios',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.school),
            label: 'Escuela',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.blue,
        onTap: _onItemTapped,
      ),
    );
  }
}
```
