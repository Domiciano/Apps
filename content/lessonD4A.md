# Text

El widget `Text` es uno de los más fundamentales en Flutter, utilizado para mostrar una cadena de texto en la pantalla. Permite una gran personalización a través de su propiedad `style`.

## Uso Básico

Para mostrar texto, simplemente pasas una cadena al constructor de `Text`.

```dart
Text('Hola, Flutter!')
```

Pruébalo por ti mismo

```dart trycode=74982acbc364f84b7004d0d5a7718f43
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
        body: Center(
          child: Text('Hola, Flutter!')
        ),
      ),
    );
  }
}
```

## Estilizando el Texto

La propiedad `style` del widget `Text` acepta un objeto `TextStyle`, que te permite controlar una amplia gama de propiedades visuales del texto, como el color, el tamaño de la fuente, el peso (negrita), y más.

## Color del Texto

Para cambiar el color del texto, usa la propiedad `color` dentro de `TextStyle`.

```dart
Text(
  'Texto Rojo',
  style: TextStyle(color: Colors.red),
)
```

Pruébalo por ti mismo

```dart trycode=09f602401b9ec4bf8c1b0c0ab93ced95
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
        body: Center(
          child: Text(
            'Texto Rojo',
            style: TextStyle(color: Colors.red),
          )
        ),
      ),
    );
  }
}
```

## Tamaño de la Fuente

La propiedad `fontSize` controla el tamaño del texto.

```dart
Text(
  'Texto Grande',
  style: TextStyle(fontSize: 24.0),
)
```

Pruébalo por ti mismo

```dart trycode=b0247e8702b421da747b8153b55aae8c
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
        body: Center(
          child: Text(
            'Texto Grande',
            style: TextStyle(fontSize: 24.0),
          )
        ),
      ),
    );
  }
}
```

## Negrita y Otros Pesos de Fuente

Usa la propiedad `fontWeight` para aplicar negrita u otros pesos de fuente. `FontWeight.bold` es para negrita.

```dart
Text(
  'Texto en Negrita',
  style: TextStyle(fontWeight: FontWeight.bold),
)
```

Pruébalo por ti mismo

```dart trycode=6d10a5b938b99ac69f2cc55deb4bad01
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
        body: Center(
          child: Text(
            'Texto en Negrita',
            style: TextStyle(fontWeight: FontWeight.bold),
          )
        ),
      ),
    );
  }
}
```

## Combinando Estilos

Puedes combinar múltiples propiedades de estilo en un solo `TextStyle`.

```dart
Text(
  'Texto Azul y Grande',
  style: TextStyle(
    color: Colors.blue,
    fontSize: 22.0,
    fontWeight: FontWeight.w500, // Un peso intermedio
  ),
)
```

Pruébalo por tu mismo

```dart trycode=99e8e614431f0a06bfd66ec04ba09295
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
        body: Center(
          child: Text(
              'Texto Azul y Grande',
              style: TextStyle(
              color: Colors.blue,
              fontSize: 22.0,
              fontWeight: FontWeight.w500, // Un peso intermedio
            ),
          )
        ),
      ),
    );
  }
}
```

## Ejemplo Completo

Aquí tienes un ejemplo completo y funcional que demuestra cómo usar el widget `Text` con diferentes estilos.

```dart trycode=407020861ee8301495bb36973b9edc74
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ejemplo Text Widget',
      home: Scaffold(
        appBar: AppBar(title: const Text('Widget Text')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
              Text(
                'Texto por defecto',
              ),
              SizedBox(height: 20),
              Text(
                'Texto de color verde',
                style: TextStyle(color: Colors.green),
              ),
              SizedBox(height: 20),
              Text(
                'Texto con tamaño 30',
                style: TextStyle(fontSize: 30.0),
              ),
              SizedBox(height: 20),
              Text(
                'Texto en negrita',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 20),
              Text(
                'Texto morado, grande y en negrita',
                style: TextStyle(
                  color: Colors.purple,
                  fontSize: 25.0,
                  fontWeight: FontWeight.w700,
                ),
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
